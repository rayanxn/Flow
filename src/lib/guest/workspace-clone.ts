import { randomBytes } from "node:crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createAdminClient } from "../supabase/admin";
import type { Database, InsertTables, Tables } from "../types";

type AdminClient = SupabaseClient<Database>;

export const DEFAULT_GUEST_SOURCE_WORKSPACE_SLUG =
  process.env.GUEST_DEMO_SOURCE_WORKSPACE_SLUG ?? "pw-workspace";
export const GUEST_WORKSPACE_TTL_HOURS = 24;

type CloneMaps = {
  projects: Map<string, string>;
  teams: Map<string, string>;
  labels: Map<string, string>;
  sprints: Map<string, string>;
  issues: Map<string, string>;
};

export type GuestWorkspaceCloneResult = {
  workspace: Tables<"workspaces">;
  guestWorkspace: Tables<"guest_workspaces">;
  sourceWorkspace: Tables<"workspaces">;
  maps: CloneMaps;
};

export type CloneGuestWorkspaceOptions = {
  guestUserId: string;
  guestDisplayName?: string | null;
  sourceWorkspaceSlug?: string;
  now?: Date;
  slugSuffix?: string;
  supabase?: AdminClient;
};

function randomSuffix() {
  return randomBytes(3).toString("hex");
}

export function buildGuestWorkspaceSlug(suffix = randomSuffix()) {
  const cleanSuffix = suffix
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .slice(0, 10);

  return `guest-workspace-${cleanSuffix || randomSuffix()}`;
}

function isDuplicateError(error: { code?: string; message?: string } | null) {
  return (
    error?.code === "23505" ||
    error?.message?.toLowerCase().includes("duplicate") ||
    error?.message?.toLowerCase().includes("unique")
  );
}

function fail(context: string, error?: { message?: string } | null): never {
  throw new Error(error?.message ? `${context}: ${error.message}` : context);
}

function addHours(date: Date, hours: number) {
  return new Date(date.getTime() + hours * 60 * 60 * 1000);
}

function mapNullableId(id: string | null, map: Map<string, string>) {
  if (!id) return null;
  return map.get(id) ?? id;
}

function mapProfileId(id: string, sourceOwnerId: string | null, guestUserId: string) {
  return id === sourceOwnerId ? guestUserId : id;
}

function roleRank(role: Tables<"workspace_members">["role"]) {
  if (role === "owner") return 3;
  if (role === "admin") return 2;
  return 1;
}

async function ensureGuestProfile(
  supabase: AdminClient,
  guestUserId: string,
  guestDisplayName: string,
) {
  const syntheticEmail = `guest-${guestUserId.slice(0, 8)}@guest.flow.local`;
  const { error } = await supabase.from("profiles").upsert(
    {
      id: guestUserId,
      full_name: guestDisplayName,
      email: syntheticEmail,
    },
    { onConflict: "id" },
  );

  if (error) fail("Unable to prepare guest profile", error);
}

async function fetchSourceWorkspace(
  supabase: AdminClient,
  sourceWorkspaceSlug: string,
) {
  const { data, error } = await supabase
    .from("workspaces")
    .select("*")
    .eq("slug", sourceWorkspaceSlug)
    .single();

  if (error || !data) fail(`Source workspace '${sourceWorkspaceSlug}' not found`, error);
  return data;
}

async function createWorkspaceCopy(
  supabase: AdminClient,
  sourceWorkspace: Tables<"workspaces">,
  slugSuffix?: string,
) {
  for (let attempt = 0; attempt < 5; attempt++) {
    const suffix = attempt === 0 && slugSuffix ? slugSuffix : randomSuffix();
    const slug = buildGuestWorkspaceSlug(suffix);
    const { data, error } = await supabase
      .from("workspaces")
      .insert({
        name: "Guest Workspace",
        slug,
        issue_prefix: sourceWorkspace.issue_prefix,
        issue_counter: sourceWorkspace.issue_counter,
        default_sprint_length: sourceWorkspace.default_sprint_length,
        timezone: sourceWorkspace.timezone,
      })
      .select()
      .single();

    if (data) return data;
    if (!isDuplicateError(error)) fail("Unable to create guest workspace", error);
  }

  fail("Unable to create a unique guest workspace URL");
}

async function cloneWorkspaceMembers({
  supabase,
  sourceWorkspaceId,
  clonedWorkspaceId,
  sourceOwnerId,
  guestUserId,
}: {
  supabase: AdminClient;
  sourceWorkspaceId: string;
  clonedWorkspaceId: string;
  sourceOwnerId: string | null;
  guestUserId: string;
}) {
  const { data: sourceMembers, error } = await supabase
    .from("workspace_members")
    .select("*")
    .eq("workspace_id", sourceWorkspaceId)
    .order("created_at", { ascending: true });

  if (error) fail("Unable to read source workspace members", error);

  const byUser = new Map<string, InsertTables<"workspace_members">>();
  for (const member of sourceMembers ?? []) {
    const mappedUserId = mapProfileId(member.user_id, sourceOwnerId, guestUserId);
    const role =
      member.user_id === sourceOwnerId
        ? "owner"
        : member.role === "owner"
          ? "admin"
          : member.role;
    const row: InsertTables<"workspace_members"> = {
      workspace_id: clonedWorkspaceId,
      user_id: mappedUserId,
      role,
      primary_project_id: null,
      created_at: member.created_at,
      updated_at: member.updated_at,
    };
    const existing = byUser.get(mappedUserId);

    if (!existing || roleRank(row.role ?? "member") > roleRank(existing.role ?? "member")) {
      byUser.set(mappedUserId, row);
    }
  }

  const existingGuest = byUser.get(guestUserId);
  if (!existingGuest || existingGuest.role !== "owner") {
    byUser.set(guestUserId, {
      workspace_id: clonedWorkspaceId,
      user_id: guestUserId,
      role: "owner",
      primary_project_id: null,
    });
  }

  const rows = [...byUser.values()];
  if (rows.length === 0) return [];

  const { data: clonedMembers, error: insertError } = await supabase
    .from("workspace_members")
    .insert(rows)
    .select();

  if (insertError) fail("Unable to clone workspace members", insertError);
  return clonedMembers ?? [];
}

async function cloneTeams(
  supabase: AdminClient,
  sourceWorkspaceId: string,
  clonedWorkspaceId: string,
) {
  const { data: sourceTeams, error } = await supabase
    .from("teams")
    .select("*")
    .eq("workspace_id", sourceWorkspaceId)
    .order("created_at", { ascending: true });

  if (error) fail("Unable to read source teams", error);
  if (!sourceTeams?.length) return { sourceTeams: [], map: new Map<string, string>() };

  const { data: clonedTeams, error: insertError } = await supabase
    .from("teams")
    .insert(
      sourceTeams.map((team) => ({
        workspace_id: clonedWorkspaceId,
        name: team.name,
        created_at: team.created_at,
        updated_at: team.updated_at,
      })),
    )
    .select();

  if (insertError) fail("Unable to clone teams", insertError);

  const map = new Map<string, string>();
  sourceTeams.forEach((team, index) => {
    const cloned = clonedTeams?.[index];
    if (cloned) map.set(team.id, cloned.id);
  });

  return { sourceTeams, map };
}

async function cloneTeamMembers({
  supabase,
  sourceTeamIds,
  teamMap,
  sourceOwnerId,
  guestUserId,
}: {
  supabase: AdminClient;
  sourceTeamIds: string[];
  teamMap: Map<string, string>;
  sourceOwnerId: string | null;
  guestUserId: string;
}) {
  if (sourceTeamIds.length === 0) return;

  const { data: sourceTeamMembers, error } = await supabase
    .from("team_members")
    .select("*")
    .in("team_id", sourceTeamIds);

  if (error) fail("Unable to read source team members", error);

  const seen = new Set<string>();
  const rows = (sourceTeamMembers ?? []).flatMap((member) => {
    const teamId = teamMap.get(member.team_id);
    if (!teamId) return [];

    const userId = mapProfileId(member.user_id, sourceOwnerId, guestUserId);
    const key = `${teamId}:${userId}`;
    if (seen.has(key)) return [];
    seen.add(key);

    return [{ team_id: teamId, user_id: userId }];
  });

  if (rows.length === 0) return;

  const { error: insertError } = await supabase.from("team_members").insert(rows);
  if (insertError) fail("Unable to clone team members", insertError);
}

async function cloneProjects({
  supabase,
  sourceWorkspaceId,
  clonedWorkspaceId,
  teamMap,
  sourceOwnerId,
  guestUserId,
}: {
  supabase: AdminClient;
  sourceWorkspaceId: string;
  clonedWorkspaceId: string;
  teamMap: Map<string, string>;
  sourceOwnerId: string | null;
  guestUserId: string;
}) {
  const { data: sourceProjects, error } = await supabase
    .from("projects")
    .select("*")
    .eq("workspace_id", sourceWorkspaceId)
    .order("created_at", { ascending: true });

  if (error) fail("Unable to read source projects", error);
  if (!sourceProjects?.length) return { sourceProjects: [], map: new Map<string, string>() };

  const rows: InsertTables<"projects">[] = sourceProjects.map((project) => ({
    workspace_id: clonedWorkspaceId,
    name: project.name,
    description: project.description,
    color: project.color,
    lead_id: project.lead_id
      ? mapProfileId(project.lead_id, sourceOwnerId, guestUserId)
      : null,
    team_id: mapNullableId(project.team_id, teamMap),
    is_private: project.is_private,
    is_archived: project.is_archived,
    created_at: project.created_at,
    updated_at: project.updated_at,
  }));

  const { data: clonedProjects, error: insertError } = await supabase
    .from("projects")
    .insert(rows)
    .select();

  if (insertError) fail("Unable to clone projects", insertError);

  const map = new Map<string, string>();
  sourceProjects.forEach((project, index) => {
    const cloned = clonedProjects?.[index];
    if (cloned) map.set(project.id, cloned.id);
  });

  return { sourceProjects, map };
}

async function clonePrimaryProjects({
  supabase,
  sourceWorkspaceId,
  clonedWorkspaceId,
  projectMap,
  sourceOwnerId,
  guestUserId,
}: {
  supabase: AdminClient;
  sourceWorkspaceId: string;
  clonedWorkspaceId: string;
  projectMap: Map<string, string>;
  sourceOwnerId: string | null;
  guestUserId: string;
}) {
  const { data: sourceMembers, error } = await supabase
    .from("workspace_members")
    .select("user_id, primary_project_id")
    .eq("workspace_id", sourceWorkspaceId)
    .not("primary_project_id", "is", null);

  if (error) fail("Unable to read source primary projects", error);

  for (const member of sourceMembers ?? []) {
    const primaryProjectId = member.primary_project_id
      ? projectMap.get(member.primary_project_id)
      : null;
    if (!primaryProjectId) continue;

    const userId = mapProfileId(member.user_id, sourceOwnerId, guestUserId);
    const { error: updateError } = await supabase
      .from("workspace_members")
      .update({ primary_project_id: primaryProjectId })
      .eq("workspace_id", clonedWorkspaceId)
      .eq("user_id", userId);

    if (updateError) fail("Unable to clone member primary project", updateError);
  }
}

async function cloneLabels(
  supabase: AdminClient,
  sourceProjectIds: string[],
  projectMap: Map<string, string>,
) {
  if (sourceProjectIds.length === 0) return new Map<string, string>();

  const { data: sourceLabels, error } = await supabase
    .from("labels")
    .select("*")
    .in("project_id", sourceProjectIds)
    .order("name", { ascending: true });

  if (error) fail("Unable to read source labels", error);
  if (!sourceLabels?.length) return new Map<string, string>();

  const rows = sourceLabels.flatMap((label) => {
    const projectId = projectMap.get(label.project_id);
    if (!projectId) return [];
    return [{ project_id: projectId, name: label.name, color: label.color }];
  });

  const { data: clonedLabels, error: insertError } = await supabase
    .from("labels")
    .insert(rows)
    .select();

  if (insertError) fail("Unable to clone labels", insertError);

  const map = new Map<string, string>();
  sourceLabels.forEach((label, index) => {
    const cloned = clonedLabels?.[index];
    if (cloned) map.set(label.id, cloned.id);
  });

  return map;
}

async function cloneSprints({
  supabase,
  sourceWorkspaceId,
  clonedWorkspaceId,
  projectMap,
}: {
  supabase: AdminClient;
  sourceWorkspaceId: string;
  clonedWorkspaceId: string;
  projectMap: Map<string, string>;
}) {
  const { data: sourceSprints, error } = await supabase
    .from("sprints")
    .select("*")
    .eq("workspace_id", sourceWorkspaceId)
    .order("created_at", { ascending: true });

  if (error) fail("Unable to read source sprints", error);
  if (!sourceSprints?.length) return new Map<string, string>();

  const rows = sourceSprints.flatMap((sprint) => {
    const projectId = projectMap.get(sprint.project_id);
    if (!projectId) return [];

    return [
      {
        workspace_id: clonedWorkspaceId,
        project_id: projectId,
        name: sprint.name,
        goal: sprint.goal,
        status: sprint.status,
        start_date: sprint.start_date,
        end_date: sprint.end_date,
        capacity: sprint.capacity,
        created_at: sprint.created_at,
        updated_at: sprint.updated_at,
      },
    ];
  });

  const { data: clonedSprints, error: insertError } = await supabase
    .from("sprints")
    .insert(rows)
    .select();

  if (insertError) fail("Unable to clone sprints", insertError);

  const map = new Map<string, string>();
  sourceSprints.forEach((sprint, index) => {
    const cloned = clonedSprints?.[index];
    if (cloned) map.set(sprint.id, cloned.id);
  });

  return map;
}

async function cloneIssues({
  supabase,
  sourceWorkspaceId,
  clonedWorkspaceId,
  projectMap,
  sprintMap,
  sourceOwnerId,
  guestUserId,
}: {
  supabase: AdminClient;
  sourceWorkspaceId: string;
  clonedWorkspaceId: string;
  projectMap: Map<string, string>;
  sprintMap: Map<string, string>;
  sourceOwnerId: string | null;
  guestUserId: string;
}) {
  const { data: sourceIssues, error } = await supabase
    .from("issues")
    .select("*")
    .eq("workspace_id", sourceWorkspaceId)
    .order("issue_number", { ascending: true });

  if (error) fail("Unable to read source issues", error);
  if (!sourceIssues?.length) return new Map<string, string>();

  const rows = sourceIssues.flatMap((issue) => {
    const projectId = projectMap.get(issue.project_id);
    if (!projectId) return [];

    return [
      {
        workspace_id: clonedWorkspaceId,
        project_id: projectId,
        issue_number: issue.issue_number,
        issue_key: issue.issue_key,
        title: issue.title,
        description: issue.description,
        status: issue.status,
        priority: issue.priority,
        assignee_id: issue.assignee_id
          ? mapProfileId(issue.assignee_id, sourceOwnerId, guestUserId)
          : null,
        sprint_id: mapNullableId(issue.sprint_id, sprintMap),
        due_date: issue.due_date,
        story_points: issue.story_points,
        sort_order: issue.sort_order,
        created_by: mapProfileId(issue.created_by, sourceOwnerId, guestUserId),
        completed_at: issue.completed_at,
        checklist: issue.checklist,
        created_at: issue.created_at,
        updated_at: issue.updated_at,
      },
    ];
  });

  const { data: clonedIssues, error: insertError } = await supabase
    .from("issues")
    .insert(rows)
    .select();

  if (insertError) fail("Unable to clone issues", insertError);

  const map = new Map<string, string>();
  sourceIssues.forEach((issue, index) => {
    const cloned = clonedIssues?.[index];
    if (cloned) map.set(issue.id, cloned.id);
  });

  for (const issue of sourceIssues) {
    if (!issue.parent_id) continue;

    const clonedIssueId = map.get(issue.id);
    const clonedParentId = map.get(issue.parent_id);
    if (!clonedIssueId || !clonedParentId) continue;

    const { error: updateError } = await supabase
      .from("issues")
      .update({ parent_id: clonedParentId })
      .eq("id", clonedIssueId);

    if (updateError) fail("Unable to clone issue hierarchy", updateError);
  }

  return map;
}

async function cloneIssueLabels({
  supabase,
  sourceIssueIds,
  issueMap,
  labelMap,
}: {
  supabase: AdminClient;
  sourceIssueIds: string[];
  issueMap: Map<string, string>;
  labelMap: Map<string, string>;
}) {
  if (sourceIssueIds.length === 0) return;

  const { data: sourceIssueLabels, error } = await supabase
    .from("issue_labels")
    .select("*")
    .in("issue_id", sourceIssueIds);

  if (error) fail("Unable to read source issue labels", error);

  const rows = (sourceIssueLabels ?? []).flatMap((issueLabel) => {
    const issueId = issueMap.get(issueLabel.issue_id);
    const labelId = labelMap.get(issueLabel.label_id);
    if (!issueId || !labelId) return [];
    return [{ issue_id: issueId, label_id: labelId }];
  });

  if (rows.length === 0) return;

  const { error: insertError } = await supabase.from("issue_labels").insert(rows);
  if (insertError) fail("Unable to clone issue labels", insertError);
}

async function createGuestWorkspaceRecord({
  supabase,
  workspace,
  sourceWorkspace,
  guestUserId,
  now,
}: {
  supabase: AdminClient;
  workspace: Tables<"workspaces">;
  sourceWorkspace: Tables<"workspaces">;
  guestUserId: string;
  now: Date;
}) {
  const { data, error } = await supabase
    .from("guest_workspaces")
    .insert({
      workspace_id: workspace.id,
      workspace_slug: workspace.slug,
      source_workspace_id: sourceWorkspace.id,
      source_workspace_slug: sourceWorkspace.slug,
      guest_user_id: guestUserId,
      expires_at: addHours(now, GUEST_WORKSPACE_TTL_HOURS).toISOString(),
    })
    .select()
    .single();

  if (error || !data) fail("Unable to create guest lifecycle record", error);
  return data;
}

async function deletePartialWorkspace(supabase: AdminClient, workspaceId: string | null) {
  if (!workspaceId) return;
  await supabase.from("workspaces").delete().eq("id", workspaceId);
}

export async function cloneGuestWorkspace(
  options: CloneGuestWorkspaceOptions,
): Promise<GuestWorkspaceCloneResult> {
  const supabase = options.supabase ?? createAdminClient();
  const now = options.now ?? new Date();
  const sourceWorkspaceSlug =
    options.sourceWorkspaceSlug ?? DEFAULT_GUEST_SOURCE_WORKSPACE_SLUG;
  const guestDisplayName = options.guestDisplayName?.trim() || "Guest Visitor";
  let clonedWorkspaceId: string | null = null;

  try {
    await ensureGuestProfile(supabase, options.guestUserId, guestDisplayName);

    const sourceWorkspace = await fetchSourceWorkspace(supabase, sourceWorkspaceSlug);
    const { data: sourceOwner } = await supabase
      .from("workspace_members")
      .select("user_id")
      .eq("workspace_id", sourceWorkspace.id)
      .eq("role", "owner")
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    const sourceOwnerId = sourceOwner?.user_id ?? null;
    const workspace = await createWorkspaceCopy(
      supabase,
      sourceWorkspace,
      options.slugSuffix,
    );
    clonedWorkspaceId = workspace.id;

    await cloneWorkspaceMembers({
      supabase,
      sourceWorkspaceId: sourceWorkspace.id,
      clonedWorkspaceId: workspace.id,
      sourceOwnerId,
      guestUserId: options.guestUserId,
    });

    const { sourceTeams, map: teamMap } = await cloneTeams(
      supabase,
      sourceWorkspace.id,
      workspace.id,
    );
    await cloneTeamMembers({
      supabase,
      sourceTeamIds: sourceTeams.map((team) => team.id),
      teamMap,
      sourceOwnerId,
      guestUserId: options.guestUserId,
    });

    const { sourceProjects, map: projectMap } = await cloneProjects({
      supabase,
      sourceWorkspaceId: sourceWorkspace.id,
      clonedWorkspaceId: workspace.id,
      teamMap,
      sourceOwnerId,
      guestUserId: options.guestUserId,
    });
    await clonePrimaryProjects({
      supabase,
      sourceWorkspaceId: sourceWorkspace.id,
      clonedWorkspaceId: workspace.id,
      projectMap,
      sourceOwnerId,
      guestUserId: options.guestUserId,
    });

    const labelMap = await cloneLabels(
      supabase,
      sourceProjects.map((project) => project.id),
      projectMap,
    );
    const sprintMap = await cloneSprints({
      supabase,
      sourceWorkspaceId: sourceWorkspace.id,
      clonedWorkspaceId: workspace.id,
      projectMap,
    });
    const issueMap = await cloneIssues({
      supabase,
      sourceWorkspaceId: sourceWorkspace.id,
      clonedWorkspaceId: workspace.id,
      projectMap,
      sprintMap,
      sourceOwnerId,
      guestUserId: options.guestUserId,
    });
    await cloneIssueLabels({
      supabase,
      sourceIssueIds: [...issueMap.keys()],
      issueMap,
      labelMap,
    });

    const guestWorkspace = await createGuestWorkspaceRecord({
      supabase,
      workspace,
      sourceWorkspace,
      guestUserId: options.guestUserId,
      now,
    });

    return {
      workspace,
      guestWorkspace,
      sourceWorkspace,
      maps: {
        teams: teamMap,
        projects: projectMap,
        labels: labelMap,
        sprints: sprintMap,
        issues: issueMap,
      },
    };
  } catch (error) {
    await deletePartialWorkspace(supabase, clonedWorkspaceId);
    throw error;
  }
}
