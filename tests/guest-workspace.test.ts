import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import test from "node:test";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "node:path";
import { cleanupExpiredGuestWorkspaces } from "../src/lib/guest/cleanup";
import { cloneGuestWorkspace } from "../src/lib/guest/workspace-clone";
import type { Database } from "../src/lib/types";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const PASSWORD = "guestTest!2026";

const missingEnvReason =
  !SUPABASE_URL || !SUPABASE_SERVICE_KEY || !SUPABASE_ANON_KEY
    ? "Supabase environment variables are not configured"
    : undefined;

function adminClient() {
  return createClient<Database>(SUPABASE_URL!, SUPABASE_SERVICE_KEY!);
}

async function createTestUser(
  admin: SupabaseClient<Database>,
  email: string,
  fullName: string,
) {
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password: PASSWORD,
    email_confirm: true,
    user_metadata: { full_name: fullName },
  });

  if (error || !data.user) {
    throw new Error(error?.message ?? "Unable to create test user");
  }

  return data.user.id;
}

async function deleteUsers(admin: SupabaseClient<Database>, ids: string[]) {
  for (const id of ids) {
    await admin.auth.admin.deleteUser(id);
  }
}

async function createSourceWorkspace(admin: SupabaseClient<Database>, suffix: string) {
  const sourceSlug = `guest-source-${suffix}`;
  const ownerEmail = `guest-owner-${suffix}@test.flow.dev`;
  const memberEmail = `guest-member-${suffix}@test.flow.dev`;
  const ownerId = await createTestUser(admin, ownerEmail, "Source Owner");
  const memberId = await createTestUser(admin, memberEmail, "Demo Member");
  const checklist = [{ id: randomUUID(), text: "Verify clone mapping", completed: false }];

  const { data: workspace, error: workspaceError } = await admin
    .from("workspaces")
    .insert({
      name: "Guest Source",
      slug: sourceSlug,
      issue_prefix: "GST",
      issue_counter: 2,
      default_sprint_length: 10,
      timezone: "UTC",
    })
    .select()
    .single();
  if (workspaceError || !workspace) throw workspaceError;

  await admin.from("workspace_members").insert([
    { workspace_id: workspace.id, user_id: ownerId, role: "owner" },
    { workspace_id: workspace.id, user_id: memberId, role: "member" },
  ]);

  const { data: team, error: teamError } = await admin
    .from("teams")
    .insert({ workspace_id: workspace.id, name: "Engineering" })
    .select()
    .single();
  if (teamError || !team) throw teamError;

  await admin.from("team_members").insert([
    { team_id: team.id, user_id: ownerId },
    { team_id: team.id, user_id: memberId },
  ]);

  const { data: project, error: projectError } = await admin
    .from("projects")
    .insert({
      workspace_id: workspace.id,
      name: "Demo Project",
      description: "Source project for guest clone tests",
      color: "#3B82F6",
      lead_id: ownerId,
      team_id: team.id,
    })
    .select()
    .single();
  if (projectError || !project) throw projectError;

  await admin
    .from("workspace_members")
    .update({ primary_project_id: project.id })
    .eq("workspace_id", workspace.id);

  const { data: labels, error: labelError } = await admin
    .from("labels")
    .insert([
      { project_id: project.id, name: "Bug", color: "#EF4444" },
      { project_id: project.id, name: "Feature", color: "#3B82F6" },
    ])
    .select();
  if (labelError || !labels) throw labelError;

  const { data: sprint, error: sprintError } = await admin
    .from("sprints")
    .insert({
      workspace_id: workspace.id,
      project_id: project.id,
      name: "Sprint 1",
      goal: "Clone the useful demo data",
      status: "active",
      start_date: "2026-04-20",
      end_date: "2026-05-04",
      capacity: 20,
    })
    .select()
    .single();
  if (sprintError || !sprint) throw sprintError;

  const { data: parentIssue, error: parentError } = await admin
    .from("issues")
    .insert({
      workspace_id: workspace.id,
      project_id: project.id,
      issue_number: 1,
      issue_key: "GST-1",
      title: "Parent issue",
      description: "Parent issue description",
      status: "in_progress",
      priority: 1,
      assignee_id: ownerId,
      sprint_id: sprint.id,
      story_points: 5,
      sort_order: 1000,
      created_by: ownerId,
      checklist,
    })
    .select()
    .single();
  if (parentError || !parentIssue) throw parentError;

  const { data: childIssue, error: childError } = await admin
    .from("issues")
    .insert({
      workspace_id: workspace.id,
      project_id: project.id,
      issue_number: 2,
      issue_key: "GST-2",
      title: "Child issue",
      status: "todo",
      priority: 2,
      assignee_id: memberId,
      sprint_id: sprint.id,
      story_points: 2,
      sort_order: 2000,
      created_by: ownerId,
      parent_id: parentIssue.id,
    })
    .select()
    .single();
  if (childError || !childIssue) throw childError;

  await admin.from("issue_labels").insert([
    { issue_id: parentIssue.id, label_id: labels[0].id },
    { issue_id: childIssue.id, label_id: labels[1].id },
  ]);

  return {
    workspace,
    ownerId,
    ownerEmail,
    memberId,
    project,
    team,
    sprint,
    labels,
    parentIssue,
    childIssue,
    checklist,
  };
}

test(
  "cloneGuestWorkspace creates an isolated demo workspace with remapped IDs",
  { skip: missingEnvReason },
  async () => {
    const admin = adminClient();
    const suffix = randomUUID().slice(0, 8);
    const guestEmail = `guest-clone-${suffix}@test.flow.dev`;
    const guestUserId = await createTestUser(admin, guestEmail, "Guest Tester");
    const source = await createSourceWorkspace(admin, suffix);
    let clonedWorkspaceId: string | null = null;

    try {
      const clone = await cloneGuestWorkspace({
        supabase: admin,
        guestUserId,
        guestDisplayName: "Guest Tester",
        sourceWorkspaceSlug: source.workspace.slug,
        slugSuffix: suffix,
        now: new Date("2026-04-27T00:00:00.000Z"),
      });
      clonedWorkspaceId = clone.workspace.id;

      assert.match(clone.workspace.slug, /^guest-workspace-[a-z0-9]+$/);
      assert.notEqual(clone.workspace.id, source.workspace.id);
      assert.equal(clone.workspace.issue_counter, 2);

      const { data: clonedMembers } = await admin
        .from("workspace_members")
        .select("user_id, role, primary_project_id")
        .eq("workspace_id", clone.workspace.id);
      assert.equal(clonedMembers?.some((m) => m.user_id === guestUserId && m.role === "owner"), true);
      assert.equal(clonedMembers?.some((m) => m.user_id === source.memberId && m.role === "member"), true);
      assert.equal(clonedMembers?.some((m) => m.user_id === source.ownerId), false);

      const { data: clonedTeams } = await admin
        .from("teams")
        .select("*")
        .eq("workspace_id", clone.workspace.id);
      assert.equal(clonedTeams?.length, 1);
      assert.notEqual(clonedTeams?.[0].id, source.team.id);

      const { data: clonedTeamMembers } = await admin
        .from("team_members")
        .select("*")
        .eq("team_id", clonedTeams![0].id);
      assert.equal(clonedTeamMembers?.some((m) => m.user_id === guestUserId), true);
      assert.equal(clonedTeamMembers?.some((m) => m.user_id === source.memberId), true);

      const { data: clonedProjects } = await admin
        .from("projects")
        .select("*")
        .eq("workspace_id", clone.workspace.id);
      assert.equal(clonedProjects?.length, 1);
      const clonedProject = clonedProjects![0];
      assert.notEqual(clonedProject.id, source.project.id);
      assert.equal(clonedProject.team_id, clonedTeams![0].id);
      assert.equal(clonedProject.lead_id, guestUserId);

      const { data: clonedLabels } = await admin
        .from("labels")
        .select("*")
        .eq("project_id", clonedProject.id);
      assert.equal(clonedLabels?.length, 2);

      const { data: clonedSprints } = await admin
        .from("sprints")
        .select("*")
        .eq("workspace_id", clone.workspace.id);
      assert.equal(clonedSprints?.length, 1);
      assert.equal(clonedSprints?.[0].project_id, clonedProject.id);

      const { data: clonedIssues } = await admin
        .from("issues")
        .select("*")
        .eq("workspace_id", clone.workspace.id)
        .order("issue_number", { ascending: true });
      assert.equal(clonedIssues?.length, 2);
      const clonedParent = clonedIssues![0];
      const clonedChild = clonedIssues![1];
      assert.notEqual(clonedParent.id, source.parentIssue.id);
      assert.equal(clonedParent.project_id, clonedProject.id);
      assert.equal(clonedParent.sprint_id, clonedSprints![0].id);
      assert.equal(clonedParent.assignee_id, guestUserId);
      assert.equal(clonedParent.created_by, guestUserId);
      assert.deepEqual(clonedParent.checklist, source.checklist);
      assert.equal(clonedChild.parent_id, clonedParent.id);
      assert.notEqual(clonedChild.parent_id, source.parentIssue.id);
      assert.equal(clonedChild.assignee_id, source.memberId);

      const { data: clonedIssueLabels } = await admin
        .from("issue_labels")
        .select("*")
        .in("issue_id", clonedIssues!.map((issue) => issue.id));
      assert.equal(clonedIssueLabels?.length, 2);

      const { data: sourceWorkspaceAfter } = await admin
        .from("workspaces")
        .select("issue_counter")
        .eq("id", source.workspace.id)
        .single();
      assert.equal(sourceWorkspaceAfter?.issue_counter, 2);

      const guestClient = createClient<Database>(SUPABASE_URL!, SUPABASE_ANON_KEY!);
      const { error: signInError } = await guestClient.auth.signInWithPassword({
        email: guestEmail,
        password: PASSWORD,
      });
      assert.equal(signInError, null);

      const { data: newIssue, error: createIssueError } = await guestClient.rpc(
        "create_issue",
        {
          p_workspace_id: clone.workspace.id,
          p_project_id: clonedProject.id,
          p_title: "Guest-created issue",
        },
      );
      assert.equal(createIssueError, null);
      assert.equal(newIssue?.issue_number, 3);
      assert.equal(newIssue?.issue_key, "GST-3");
    } finally {
      if (clonedWorkspaceId) {
        await admin.from("workspaces").delete().eq("id", clonedWorkspaceId);
      }
      await admin
        .from("guest_workspaces")
        .delete()
        .eq("source_workspace_slug", source.workspace.slug);
      await admin.from("workspaces").delete().eq("id", source.workspace.id);
      await deleteUsers(admin, [guestUserId, source.ownerId, source.memberId]);
    }
  },
);

test(
  "cleanupExpiredGuestWorkspaces removes expired workspaces and is idempotent",
  { skip: missingEnvReason },
  async () => {
    const admin = adminClient();
    const suffix = randomUUID().slice(0, 8);
    const expiredUserId = await createTestUser(
      admin,
      `guest-expired-${suffix}@test.flow.dev`,
      "Expired Guest",
    );
    const freshUserId = await createTestUser(
      admin,
      `guest-fresh-${suffix}@test.flow.dev`,
      "Fresh Guest",
    );
    const missingUserId = randomUUID();
    const now = new Date("2026-04-27T00:00:00.000Z");

    const { data: expiredWorkspace, error: expiredWorkspaceError } = await admin
      .from("workspaces")
      .insert({ name: "Expired Guest", slug: `expired-guest-${suffix}` })
      .select()
      .single();
    if (expiredWorkspaceError || !expiredWorkspace) throw expiredWorkspaceError;

    const { data: freshWorkspace, error: freshWorkspaceError } = await admin
      .from("workspaces")
      .insert({ name: "Fresh Guest", slug: `fresh-guest-${suffix}` })
      .select()
      .single();
    if (freshWorkspaceError || !freshWorkspace) throw freshWorkspaceError;

    try {
      const { data: expiredRecord, error: expiredRecordError } = await admin
        .from("guest_workspaces")
        .insert({
          workspace_id: expiredWorkspace.id,
          workspace_slug: expiredWorkspace.slug,
          source_workspace_slug: "source",
          guest_user_id: expiredUserId,
          expires_at: "2026-04-26T23:00:00.000Z",
        })
        .select()
        .single();
      if (expiredRecordError || !expiredRecord) throw expiredRecordError;

      const { data: freshRecord, error: freshRecordError } = await admin
        .from("guest_workspaces")
        .insert({
          workspace_id: freshWorkspace.id,
          workspace_slug: freshWorkspace.slug,
          source_workspace_slug: "source",
          guest_user_id: freshUserId,
          expires_at: "2026-04-28T00:00:00.000Z",
        })
        .select()
        .single();
      if (freshRecordError || !freshRecord) throw freshRecordError;

      const { data: alreadyDeletedRecord, error: alreadyDeletedError } = await admin
        .from("guest_workspaces")
        .insert({
          workspace_id: null,
          workspace_slug: `already-deleted-${suffix}`,
          source_workspace_slug: "source",
          guest_user_id: missingUserId,
          expires_at: "2026-04-26T22:00:00.000Z",
        })
        .select()
        .single();
      if (alreadyDeletedError || !alreadyDeletedRecord) throw alreadyDeletedError;

      const result = await cleanupExpiredGuestWorkspaces({
        supabase: admin,
        now,
        batchSize: 10,
      });

      assert.equal(result.scanned, 2);
      assert.equal(result.deletedWorkspaces, 1);
      assert.equal(result.markedCleaned, 2);
      assert.equal(result.errors.length, 0);

      const { data: expiredWorkspaceAfter } = await admin
        .from("workspaces")
        .select("id")
        .eq("id", expiredWorkspace.id)
        .maybeSingle();
      assert.equal(expiredWorkspaceAfter, null);

      const { data: freshWorkspaceAfter } = await admin
        .from("workspaces")
        .select("id")
        .eq("id", freshWorkspace.id)
        .maybeSingle();
      assert.equal(freshWorkspaceAfter?.id, freshWorkspace.id);

      const { data: recordsAfter } = await admin
        .from("guest_workspaces")
        .select("id, cleaned_at")
        .in("id", [expiredRecord.id, freshRecord.id, alreadyDeletedRecord.id]);
      const byId = new Map(recordsAfter?.map((record) => [record.id, record]));
      assert.notEqual(byId.get(expiredRecord.id)?.cleaned_at, null);
      assert.notEqual(byId.get(alreadyDeletedRecord.id)?.cleaned_at, null);
      assert.equal(byId.get(freshRecord.id)?.cleaned_at, null);

      const secondPass = await cleanupExpiredGuestWorkspaces({
        supabase: admin,
        now,
        batchSize: 10,
      });
      assert.equal(secondPass.scanned, 0);
    } finally {
      await admin
        .from("guest_workspaces")
        .delete()
        .in("workspace_slug", [
          expiredWorkspace.slug,
          freshWorkspace.slug,
          `already-deleted-${suffix}`,
        ]);
      await admin.from("workspaces").delete().eq("id", freshWorkspace.id);
      await deleteUsers(admin, [expiredUserId, freshUserId]);
    }
  },
);
