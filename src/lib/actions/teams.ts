"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ActionResponse, Tables } from "@/lib/types";
import { createActivity } from "@/lib/actions/activities";

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

export type TeamRef = {
  id: string;
  name: string;
} | null;

async function requireTeamManager(
  supabase: SupabaseClient,
  workspaceId: string
): Promise<ActionResponse<{ userId: string }>> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const { data: membership } = await supabase
    .from("workspace_members")
    .select("role")
    .eq("workspace_id", workspaceId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!membership || membership.role === "member") {
    return { error: "Only owners and admins can manage teams" };
  }

  return { data: { userId: user.id } };
}

function getManagerId(
  result: ActionResponse<{ userId: string }>
): string | null {
  return result.data?.userId ?? null;
}

async function getTeamRecord(
  supabase: SupabaseClient,
  teamId: string
): Promise<Tables<"teams"> | null> {
  const { data } = await supabase
    .from("teams")
    .select("*")
    .eq("id", teamId)
    .maybeSingle();

  return data ?? null;
}

async function getProjectRecord(
  supabase: SupabaseClient,
  projectId: string
): Promise<Tables<"projects"> | null> {
  const { data } = await supabase
    .from("projects")
    .select("*")
    .eq("id", projectId)
    .maybeSingle();

  return data ?? null;
}

async function createProjectTeamUpdateActivity({
  supabase,
  actorId,
  project,
  nextTeam,
}: {
  supabase: SupabaseClient;
  actorId: string;
  project: Pick<Tables<"projects">, "id" | "name" | "workspace_id">;
  nextTeam: TeamRef;
}) {
  await createActivity({
    supabase,
    workspaceId: project.workspace_id,
    actorId,
    action: "updated",
    entityType: "project",
    entityId: project.id,
    metadata: {
      name: project.name,
      project_id: project.id,
      changes: {
        team_id: nextTeam?.id ?? null,
      },
    },
  });
}

export async function recordProjectOwnershipActivities({
  supabase,
  actorId,
  project,
  previousTeam,
  nextTeam,
}: {
  supabase: SupabaseClient;
  actorId: string;
  project: Pick<Tables<"projects">, "id" | "name" | "workspace_id">;
  previousTeam: TeamRef;
  nextTeam: TeamRef;
}) {
  if (previousTeam?.id === nextTeam?.id) return;

  const tasks: Promise<unknown>[] = [];

  if (previousTeam) {
    tasks.push(
      createActivity({
        supabase,
        workspaceId: project.workspace_id,
        actorId,
        action: "project_unlinked",
        entityType: "team",
        entityId: previousTeam.id,
        metadata: {
          name: previousTeam.name,
          project_id: project.id,
          project_name: project.name,
          next_team_id: nextTeam?.id ?? null,
          next_team_name: nextTeam?.name ?? null,
        },
      }),
    );
  }

  if (nextTeam) {
    tasks.push(
      createActivity({
        supabase,
        workspaceId: project.workspace_id,
        actorId,
        action: "project_linked",
        entityType: "team",
        entityId: nextTeam.id,
        metadata: {
          name: nextTeam.name,
          project_id: project.id,
          project_name: project.name,
          previous_team_id: previousTeam?.id ?? null,
          previous_team_name: previousTeam?.name ?? null,
        },
      }),
    );
  }

  await Promise.all(tasks);
}

export async function createTeam(
  formData: FormData
): Promise<ActionResponse<Tables<"teams">>> {
  const supabase = await createClient();
  const workspaceId = formData.get("workspaceId") as string;
  const name = (formData.get("name") as string | null)?.trim();

  if (!workspaceId || !name) {
    return { error: "Team name is required" };
  }

  const managerResult = await requireTeamManager(supabase, workspaceId);
  if (managerResult.error) return { error: managerResult.error };
  const managerId = getManagerId(managerResult);
  if (!managerId) return { error: "Only owners and admins can manage teams" };

  const { data, error } = await supabase
    .from("teams")
    .insert({
      workspace_id: workspaceId,
      name,
    })
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  try {
    await createActivity({
      supabase,
      workspaceId,
      actorId: managerId,
      action: "created",
      entityType: "team",
      entityId: data.id,
      metadata: { name: data.name },
    });
  } catch {
    // Activity logging should not block the primary operation
  }

  revalidatePath("/", "layout");
  return { data };
}

export async function renameTeam(
  teamId: string,
  name: string
): Promise<ActionResponse<Tables<"teams">>> {
  const supabase = await createClient();
  const team = await getTeamRecord(supabase, teamId);

  if (!team) {
    return { error: "Team not found" };
  }

  const nextName = name.trim();
  if (!nextName) {
    return { error: "Team name is required" };
  }

  const managerResult = await requireTeamManager(supabase, team.workspace_id);
  if (managerResult.error) return { error: managerResult.error };
  const managerId = getManagerId(managerResult);
  if (!managerId) return { error: "Only owners and admins can manage teams" };

  const { data, error } = await supabase
    .from("teams")
    .update({ name: nextName })
    .eq("id", teamId)
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  try {
    await createActivity({
      supabase,
      workspaceId: data.workspace_id,
      actorId: managerId,
      action: "updated",
      entityType: "team",
      entityId: data.id,
      metadata: {
        name: data.name,
        changes: {
          name: nextName,
        },
      },
    });
  } catch {
    // Activity logging should not block the primary operation
  }

  revalidatePath("/", "layout");
  return { data };
}

export async function deleteTeam(
  teamId: string
): Promise<ActionResponse<void>> {
  const supabase = await createClient();
  const team = await getTeamRecord(supabase, teamId);

  if (!team) {
    return { error: "Team not found" };
  }

  const managerResult = await requireTeamManager(supabase, team.workspace_id);
  if (managerResult.error) return { error: managerResult.error };
  const managerId = getManagerId(managerResult);
  if (!managerId) return { error: "Only owners and admins can manage teams" };

  const [{ count: linkedProjectCount }, { count: memberCount }] = await Promise.all([
    supabase
      .from("projects")
      .select("id", { count: "exact", head: true })
      .eq("team_id", team.id),
    supabase
      .from("team_members")
      .select("id", { count: "exact", head: true })
      .eq("team_id", team.id),
  ]);

  const { error } = await supabase
    .from("teams")
    .delete()
    .eq("id", teamId);

  if (error) {
    return { error: error.message };
  }

  try {
    await createActivity({
      supabase,
      workspaceId: team.workspace_id,
      actorId: managerId,
      action: "deleted",
      entityType: "team",
      entityId: team.id,
      metadata: {
        name: team.name,
        linked_project_count: linkedProjectCount ?? 0,
        member_count: memberCount ?? 0,
      },
    });
  } catch {
    // Activity logging should not block the primary operation
  }

  revalidatePath("/", "layout");
  return { data: undefined };
}

export async function addTeamMember(
  teamId: string,
  userId: string
): Promise<ActionResponse<Tables<"team_members">>> {
  const supabase = await createClient();
  const team = await getTeamRecord(supabase, teamId);

  if (!team) {
    return { error: "Team not found" };
  }

  const managerResult = await requireTeamManager(supabase, team.workspace_id);
  if (managerResult.error) return { error: managerResult.error };
  const managerId = getManagerId(managerResult);
  if (!managerId) return { error: "Only owners and admins can manage teams" };

  const [{ data: workspaceMembership }, { data: profile }] = await Promise.all([
    supabase
      .from("workspace_members")
      .select("id")
      .eq("workspace_id", team.workspace_id)
      .eq("user_id", userId)
      .maybeSingle(),
    supabase
      .from("profiles")
      .select("id, full_name, email")
      .eq("id", userId)
      .maybeSingle(),
  ]);

  if (!workspaceMembership || !profile) {
    return { error: "Member must belong to the workspace" };
  }

  const { data, error } = await supabase
    .from("team_members")
    .insert({
      team_id: team.id,
      user_id: userId,
    })
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  try {
    await createActivity({
      supabase,
      workspaceId: team.workspace_id,
      actorId: managerId,
      action: "member_added",
      entityType: "team",
      entityId: team.id,
      metadata: {
        name: team.name,
        member_id: userId,
        member_name: profile.full_name ?? profile.email,
      },
    });
  } catch {
    // Activity logging should not block the primary operation
  }

  revalidatePath("/", "layout");
  return { data };
}

export async function removeTeamMember(
  teamMemberId: string
): Promise<ActionResponse<void>> {
  const supabase = await createClient();
  const { data: teamMember } = await supabase
    .from("team_members")
    .select("id, team_id, user_id")
    .eq("id", teamMemberId)
    .maybeSingle();

  if (!teamMember) {
    return { error: "Team member not found" };
  }

  const team = await getTeamRecord(supabase, teamMember.team_id);
  if (!team) {
    return { error: "Team not found" };
  }

  const managerResult = await requireTeamManager(supabase, team.workspace_id);
  if (managerResult.error) return { error: managerResult.error };
  const managerId = getManagerId(managerResult);
  if (!managerId) return { error: "Only owners and admins can manage teams" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name, email")
    .eq("id", teamMember.user_id)
    .maybeSingle();

  const { error } = await supabase
    .from("team_members")
    .delete()
    .eq("id", teamMemberId);

  if (error) {
    return { error: error.message };
  }

  try {
    await createActivity({
      supabase,
      workspaceId: team.workspace_id,
      actorId: managerId,
      action: "member_removed",
      entityType: "team",
      entityId: team.id,
      metadata: {
        name: team.name,
        member_id: teamMember.user_id,
        member_name: profile?.full_name ?? profile?.email ?? "Member",
      },
    });
  } catch {
    // Activity logging should not block the primary operation
  }

  revalidatePath("/", "layout");
  return { data: undefined };
}

export async function linkProjectToTeam(
  teamId: string,
  projectId: string
): Promise<ActionResponse<Tables<"projects">>> {
  const supabase = await createClient();
  const [team, project] = await Promise.all([
    getTeamRecord(supabase, teamId),
    getProjectRecord(supabase, projectId),
  ]);

  if (!team || !project) {
    return { error: "Team or project not found" };
  }

  if (team.workspace_id !== project.workspace_id) {
    return { error: "Project must belong to the same workspace" };
  }

  const managerResult = await requireTeamManager(supabase, team.workspace_id);
  if (managerResult.error) return { error: managerResult.error };
  const managerId = getManagerId(managerResult);
  if (!managerId) return { error: "Only owners and admins can manage teams" };

  if (project.team_id === team.id) {
    return { data: project };
  }

  const previousTeam =
    project.team_id != null
      ? await getTeamRecord(supabase, project.team_id)
      : null;

  const { data, error } = await supabase
    .from("projects")
    .update({ team_id: team.id })
    .eq("id", project.id)
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  try {
    await Promise.all([
      createProjectTeamUpdateActivity({
        supabase,
        actorId: managerId,
        project: data,
        nextTeam: { id: team.id, name: team.name },
      }),
      recordProjectOwnershipActivities({
        supabase,
        actorId: managerId,
        project: data,
        previousTeam: previousTeam
          ? { id: previousTeam.id, name: previousTeam.name }
          : null,
        nextTeam: { id: team.id, name: team.name },
      }),
    ]);
  } catch {
    // Activity logging should not block the primary operation
  }

  revalidatePath("/", "layout");
  return { data };
}

export async function unlinkProjectFromTeam(
  teamId: string,
  projectId: string
): Promise<ActionResponse<Tables<"projects">>> {
  const supabase = await createClient();
  const [team, project] = await Promise.all([
    getTeamRecord(supabase, teamId),
    getProjectRecord(supabase, projectId),
  ]);

  if (!team || !project) {
    return { error: "Team or project not found" };
  }

  if (project.team_id !== team.id) {
    return { error: "Project is not linked to this team" };
  }

  const managerResult = await requireTeamManager(supabase, team.workspace_id);
  if (managerResult.error) return { error: managerResult.error };
  const managerId = getManagerId(managerResult);
  if (!managerId) return { error: "Only owners and admins can manage teams" };

  const { data, error } = await supabase
    .from("projects")
    .update({ team_id: null })
    .eq("id", project.id)
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  try {
    await Promise.all([
      createProjectTeamUpdateActivity({
        supabase,
        actorId: managerId,
        project: data,
        nextTeam: null,
      }),
      recordProjectOwnershipActivities({
        supabase,
        actorId: managerId,
        project: data,
        previousTeam: { id: team.id, name: team.name },
        nextTeam: null,
      }),
    ]);
  } catch {
    // Activity logging should not block the primary operation
  }

  revalidatePath("/", "layout");
  return { data };
}
