import { expect, test } from "@playwright/test";
import { randomUUID } from "node:crypto";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database, Tables } from "../src/lib/types";
import { cloneGuestWorkspace } from "../src/lib/guest/workspace-clone";
import { cleanupExpiredGuestWorkspaces } from "../src/lib/guest/cleanup";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const TEST_PASSWORD = "guestTest!2026";
const RUN_ID = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

type SourceFixture = {
  workspace: Tables<"workspaces">;
  ownerId: string;
  memberId: string;
  teamId: string;
  projectId: string;
  sprintId: string;
  labelIds: string[];
  parentIssueId: string;
  childIssueId: string;
};

let admin: SupabaseClient<Database>;
let source: SourceFixture;
const workspaceIds: string[] = [];
const lifecycleIds: string[] = [];
const userIds: string[] = [];

test.use({ storageState: { cookies: [], origins: [] } });

async function createUser(email: string, fullName: string) {
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password: TEST_PASSWORD,
    email_confirm: true,
    user_metadata: { full_name: fullName },
  });

  if (error) {
    throw new Error(`Failed to create user ${email}: ${error.message}`);
  }

  userIds.push(data.user.id);
  return data.user.id;
}

async function createSourceFixture(): Promise<SourceFixture> {
  const ownerId = await createUser(`guest-owner-${RUN_ID}@test.flow.dev`, "Guest Source Owner");
  const memberId = await createUser(`guest-member-${RUN_ID}@test.flow.dev`, "Guest Source Member");

  const { data: workspace, error: workspaceError } = await admin
    .from("workspaces")
    .insert({
      name: `Guest Source ${RUN_ID}`,
      slug: `guest-source-${RUN_ID}`.replace(/[^a-z0-9-]/g, "-"),
      issue_prefix: "GST",
      issue_counter: 0,
      default_sprint_length: 10,
      timezone: "Asia/Kuwait",
    })
    .select()
    .single();

  if (workspaceError || !workspace) {
    throw new Error(`Failed to create source workspace: ${workspaceError?.message}`);
  }
  workspaceIds.push(workspace.id);

  const { error: membershipError } = await admin.from("workspace_members").insert([
    { workspace_id: workspace.id, user_id: ownerId, role: "owner" },
    { workspace_id: workspace.id, user_id: memberId, role: "member" },
  ]);
  if (membershipError) {
    throw new Error(`Failed to create source memberships: ${membershipError.message}`);
  }

  const { data: team, error: teamError } = await admin
    .from("teams")
    .insert({ workspace_id: workspace.id, name: "Demo Engineering" })
    .select()
    .single();
  if (teamError || !team) {
    throw new Error(`Failed to create source team: ${teamError?.message}`);
  }

  const { error: teamMemberError } = await admin.from("team_members").insert([
    { team_id: team.id, user_id: ownerId },
    { team_id: team.id, user_id: memberId },
  ]);
  if (teamMemberError) {
    throw new Error(`Failed to create source team members: ${teamMemberError.message}`);
  }

  const { data: project, error: projectError } = await admin
    .from("projects")
    .insert({
      workspace_id: workspace.id,
      name: "Guest Demo Project",
      description: "Project used to verify guest cloning",
      color: "#3B82F6",
      lead_id: ownerId,
      team_id: team.id,
    })
    .select()
    .single();
  if (projectError || !project) {
    throw new Error(`Failed to create source project: ${projectError?.message}`);
  }

  await admin
    .from("workspace_members")
    .update({ primary_project_id: project.id })
    .eq("workspace_id", workspace.id);

  const { data: labels, error: labelsError } = await admin
    .from("labels")
    .insert([
      { project_id: project.id, name: "Bug", color: "#EF4444" },
      { project_id: project.id, name: "Feature", color: "#3B82F6" },
    ])
    .select();
  if (labelsError || !labels) {
    throw new Error(`Failed to create source labels: ${labelsError?.message}`);
  }

  const { data: sprint, error: sprintError } = await admin
    .from("sprints")
    .insert({
      workspace_id: workspace.id,
      project_id: project.id,
      name: "Guest Sprint",
      goal: "Validate guest clone data",
      status: "active",
      start_date: "2026-04-01",
      end_date: "2026-04-14",
      capacity: 20,
    })
    .select()
    .single();
  if (sprintError || !sprint) {
    throw new Error(`Failed to create source sprint: ${sprintError?.message}`);
  }

  const checklist = [
    { id: randomUUID(), text: "Confirm guest clone", completed: true },
    { id: randomUUID(), text: "Verify issue counter", completed: false },
  ];
  const { data: parentIssue, error: parentIssueError } = await admin
    .from("issues")
    .insert({
      workspace_id: workspace.id,
      project_id: project.id,
      issue_number: 1,
      issue_key: "GST-1",
      title: "Parent demo issue",
      description: "Parent issue copied into guest workspaces",
      status: "in_progress",
      priority: 1,
      assignee_id: ownerId,
      sprint_id: sprint.id,
      story_points: 5,
      sort_order: 1000,
      created_by: memberId,
      checklist,
    })
    .select()
    .single();
  if (parentIssueError || !parentIssue) {
    throw new Error(`Failed to create parent issue: ${parentIssueError?.message}`);
  }

  const { data: childIssue, error: childIssueError } = await admin
    .from("issues")
    .insert({
      workspace_id: workspace.id,
      project_id: project.id,
      issue_number: 2,
      issue_key: "GST-2",
      title: "Child demo issue",
      description: "Child issue copied with remapped parent",
      status: "todo",
      priority: 2,
      assignee_id: memberId,
      sprint_id: sprint.id,
      story_points: 3,
      sort_order: 2000,
      created_by: ownerId,
      parent_id: parentIssue.id,
    })
    .select()
    .single();
  if (childIssueError || !childIssue) {
    throw new Error(`Failed to create child issue: ${childIssueError?.message}`);
  }

  const { error: issueLabelsError } = await admin.from("issue_labels").insert([
    { issue_id: parentIssue.id, label_id: labels[0].id },
    { issue_id: childIssue.id, label_id: labels[1].id },
  ]);
  if (issueLabelsError) {
    throw new Error(`Failed to create source issue labels: ${issueLabelsError.message}`);
  }

  await admin.from("workspaces").update({ issue_counter: 2 }).eq("id", workspace.id);

  return {
    workspace: { ...workspace, issue_counter: 2 },
    ownerId,
    memberId,
    teamId: team.id,
    projectId: project.id,
    sprintId: sprint.id,
    labelIds: labels.map((label) => label.id),
    parentIssueId: parentIssue.id,
    childIssueId: childIssue.id,
  };
}

async function getWorkspaceShape(workspaceId: string) {
  const [{ count: projects }, { count: teams }, { count: sprints }, { count: issues }] =
    await Promise.all([
      admin.from("projects").select("id", { count: "exact", head: true }).eq("workspace_id", workspaceId),
      admin.from("teams").select("id", { count: "exact", head: true }).eq("workspace_id", workspaceId),
      admin.from("sprints").select("id", { count: "exact", head: true }).eq("workspace_id", workspaceId),
      admin.from("issues").select("id", { count: "exact", head: true }).eq("workspace_id", workspaceId),
    ]);

  return { projects, teams, sprints, issues };
}

test.describe.serial("guest workspace cloning and cleanup", () => {
  test.beforeAll(async () => {
    admin = createClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_KEY);
    source = await createSourceFixture();
  });

  test.afterAll(async () => {
    if (lifecycleIds.length > 0) {
      await admin.from("guest_workspaces").delete().in("id", lifecycleIds);
    }

    if (workspaceIds.length > 0) {
      await admin.from("workspaces").delete().in("id", workspaceIds);
    }

    for (const userId of userIds) {
      await admin.auth.admin.deleteUser(userId).catch(() => undefined);
    }
  });

  test("clones a guest workspace with remapped core data and a usable issue counter", async () => {
    const guestId = await createUser(`guest-user-${RUN_ID}@test.flow.dev`, "Guest User");
    const sourceShapeBefore = await getWorkspaceShape(source.workspace.id);

    const clone = await cloneGuestWorkspace({
      admin,
      guestUserId: guestId,
      sourceWorkspaceSlug: source.workspace.slug,
      now: new Date("2030-01-01T00:00:00.000Z"),
    });
    workspaceIds.push(clone.workspace.id);
    lifecycleIds.push(clone.lifecycle.id);

    expect(clone.workspace.slug).toMatch(/^guest-workspace-[a-f0-9]{8}$/);
    expect(clone.workspace.issue_prefix).toBe(source.workspace.issue_prefix);
    expect(clone.workspace.issue_counter).toBe(2);
    expect(clone.lifecycle.guest_user_id).toBe(guestId);
    expect(new Date(clone.lifecycle.expires_at).getTime()).toBe(
      new Date("2030-01-02T00:00:00.000Z").getTime(),
    );

    const { data: memberships } = await admin
      .from("workspace_members")
      .select("*")
      .eq("workspace_id", clone.workspace.id);
    expect(memberships?.find((member) => member.user_id === guestId)?.role).toBe("owner");
    expect(memberships?.some((member) => member.user_id === source.memberId)).toBe(true);
    expect(memberships?.some((member) => member.user_id === source.ownerId)).toBe(false);

    const { data: teams } = await admin
      .from("teams")
      .select("*")
      .eq("workspace_id", clone.workspace.id);
    expect(teams).toHaveLength(1);
    expect(teams?.[0].id).not.toBe(source.teamId);

    const { data: teamMembers } = await admin
      .from("team_members")
      .select("*")
      .eq("team_id", teams![0].id);
    expect(teamMembers?.map((member) => member.user_id).sort()).toEqual(
      [guestId, source.memberId].sort(),
    );

    const { data: projects } = await admin
      .from("projects")
      .select("*")
      .eq("workspace_id", clone.workspace.id);
    expect(projects).toHaveLength(1);
    const clonedProject = projects![0];
    expect(clonedProject.id).not.toBe(source.projectId);
    expect(clonedProject.lead_id).toBe(guestId);
    expect(clonedProject.team_id).toBe(teams![0].id);

    const { data: labels } = await admin
      .from("labels")
      .select("*")
      .eq("project_id", clonedProject.id);
    expect(labels).toHaveLength(2);
    expect(labels?.some((label) => source.labelIds.includes(label.id))).toBe(false);

    const { data: sprints } = await admin
      .from("sprints")
      .select("*")
      .eq("workspace_id", clone.workspace.id);
    expect(sprints).toHaveLength(1);
    expect(sprints![0].project_id).toBe(clonedProject.id);
    expect(sprints![0].id).not.toBe(source.sprintId);

    const { data: issues } = await admin
      .from("issues")
      .select("*")
      .eq("workspace_id", clone.workspace.id)
      .order("issue_number", { ascending: true });
    expect(issues).toHaveLength(2);

    const [parentIssue, childIssue] = issues!;
    expect(parentIssue.id).not.toBe(source.parentIssueId);
    expect(parentIssue.project_id).toBe(clonedProject.id);
    expect(parentIssue.assignee_id).toBe(guestId);
    expect(parentIssue.created_by).toBe(source.memberId);
    expect(parentIssue.checklist).toEqual([
      { id: expect.any(String), text: "Confirm guest clone", completed: true },
      { id: expect.any(String), text: "Verify issue counter", completed: false },
    ]);
    expect(childIssue.parent_id).toBe(parentIssue.id);
    expect(childIssue.created_by).toBe(guestId);
    expect(childIssue.assignee_id).toBe(source.memberId);

    const { data: issueLabels } = await admin
      .from("issue_labels")
      .select("*")
      .in("issue_id", issues!.map((issue) => issue.id));
    expect(issueLabels).toHaveLength(2);
    expect(issueLabels?.every((row) => labels!.some((label) => label.id === row.label_id))).toBe(true);

    const guestClient = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
    const { error: signInError } = await guestClient.auth.signInWithPassword({
      email: `guest-user-${RUN_ID}@test.flow.dev`,
      password: TEST_PASSWORD,
    });
    expect(signInError).toBeNull();

    const { data: newIssue, error: newIssueError } = await guestClient.rpc(
      "create_issue",
      {
        p_workspace_id: clone.workspace.id,
        p_project_id: clonedProject.id,
        p_title: "Guest-created issue",
        p_description: "Created after cloning to verify the counter",
        p_status: "todo",
        p_priority: 3,
        p_label_ids: [] as string[],
      },
    );
    expect(newIssueError).toBeNull();
    expect(newIssue?.issue_number).toBe(3);
    expect(newIssue?.issue_key).toBe("GST-3");
    await guestClient.auth.signOut();

    expect(await getWorkspaceShape(source.workspace.id)).toEqual(sourceShapeBefore);
  });

  test("removes expired guest workspaces and preserves active ones idempotently", async () => {
    const expiredGuestId = await createUser(`expired-guest-${RUN_ID}@test.flow.dev`, "Expired Guest");
    const freshGuestId = await createUser(`fresh-guest-${RUN_ID}@test.flow.dev`, "Fresh Guest");
    const missingGuestId = await createUser(`missing-guest-${RUN_ID}@test.flow.dev`, "Missing Guest");

    const expired = await cloneGuestWorkspace({
      admin,
      guestUserId: expiredGuestId,
      sourceWorkspaceSlug: source.workspace.slug,
      now: new Date("2026-01-01T00:00:00.000Z"),
    });
    workspaceIds.push(expired.workspace.id);
    lifecycleIds.push(expired.lifecycle.id);

    const fresh = await cloneGuestWorkspace({
      admin,
      guestUserId: freshGuestId,
      sourceWorkspaceSlug: source.workspace.slug,
      now: new Date("2026-01-02T00:00:00.000Z"),
    });
    workspaceIds.push(fresh.workspace.id);
    lifecycleIds.push(fresh.lifecycle.id);

    const { data: missingLifecycle, error: missingLifecycleError } = await admin
      .from("guest_workspaces")
      .insert({
        workspace_id: null,
        workspace_slug: `already-deleted-${RUN_ID}`,
        source_workspace_id: source.workspace.id,
        source_workspace_slug: source.workspace.slug,
        guest_user_id: missingGuestId,
        created_at: "2026-01-01T00:00:00.000Z",
        expires_at: "2026-01-01T01:00:00.000Z",
      })
      .select()
      .single();
    expect(missingLifecycleError).toBeNull();
    lifecycleIds.push(missingLifecycle!.id);

    const authDeletes: string[] = [];
    const firstCleanup = await cleanupExpiredGuestWorkspaces({
      admin,
      now: new Date("2026-01-02T01:00:00.000Z"),
      deleteGuestAuthUser: async (guestUserId) => {
        authDeletes.push(guestUserId);
        return { deleted: true, skipped: false };
      },
    });

    expect(firstCleanup.scanned).toBe(2);
    expect(firstCleanup.deletedWorkspaces).toBe(1);
    expect(firstCleanup.deletedAuthUsers).toBe(2);
    expect(firstCleanup.errors).toEqual([]);
    expect(authDeletes.sort()).toEqual([expiredGuestId, missingGuestId].sort());

    const { data: expiredWorkspace } = await admin
      .from("workspaces")
      .select("id")
      .eq("id", expired.workspace.id)
      .maybeSingle();
    expect(expiredWorkspace).toBeNull();

    const { data: freshWorkspace } = await admin
      .from("workspaces")
      .select("id")
      .eq("id", fresh.workspace.id)
      .maybeSingle();
    expect(freshWorkspace?.id).toBe(fresh.workspace.id);

    const { data: lifecycles } = await admin
      .from("guest_workspaces")
      .select("id, deleted_at")
      .in("id", [expired.lifecycle.id, fresh.lifecycle.id, missingLifecycle!.id]);
    expect(lifecycles?.find((row) => row.id === expired.lifecycle.id)?.deleted_at).toBeTruthy();
    expect(lifecycles?.find((row) => row.id === missingLifecycle!.id)?.deleted_at).toBeTruthy();
    expect(lifecycles?.find((row) => row.id === fresh.lifecycle.id)?.deleted_at).toBeNull();

    const secondCleanup = await cleanupExpiredGuestWorkspaces({
      admin,
      now: new Date("2026-01-02T01:00:00.000Z"),
      deleteGuestAuthUser: async () => ({ deleted: true, skipped: false }),
    });
    expect(secondCleanup.scanned).toBe(0);
  });
});
