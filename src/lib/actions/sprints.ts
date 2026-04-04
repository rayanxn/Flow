"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ActionResponse, Tables } from "@/lib/types";
import {
  createActivity,
  createNotificationsForActivity,
} from "@/lib/actions/activities";

export async function createSprint(
  formData: FormData
): Promise<ActionResponse<Tables<"sprints">>> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const workspaceId = formData.get("workspaceId") as string;
  const projectId = formData.get("projectId") as string;
  const name = formData.get("name") as string;
  const goal = (formData.get("goal") as string) || null;
  const startDate = (formData.get("startDate") as string) || null;
  const endDate = (formData.get("endDate") as string) || null;
  const capacityRaw = formData.get("capacity") as string;
  const capacity = capacityRaw ? Number(capacityRaw) : null;

  if (!workspaceId || !projectId || !name) {
    return { error: "Workspace, project, and name are required" };
  }

  const { data, error } = await supabase
    .from("sprints")
    .insert({
      workspace_id: workspaceId,
      project_id: projectId,
      name,
      goal,
      start_date: startDate,
      end_date: endDate,
      capacity,
      status: "planning",
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
      actorId: user.id,
      action: "created",
      entityType: "sprint",
      entityId: data.id,
      metadata: { name, project_id: projectId },
    });
  } catch {
    // Activity logging should not block the primary operation
  }

  revalidatePath("/", "layout");
  return { data };
}

export async function updateSprint(
  sprintId: string,
  updates: {
    name?: string;
    goal?: string | null;
    start_date?: string | null;
    end_date?: string | null;
    capacity?: number | null;
  }
): Promise<ActionResponse<Tables<"sprints">>> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("sprints")
    .update(updates)
    .eq("id", sprintId)
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  return { data };
}

export async function startSprint(
  sprintId: string
): Promise<ActionResponse<Tables<"sprints">>> {
  const supabase = await createClient();

  // Fetch sprint to get project_id
  const { data: sprint, error: fetchError } = await supabase
    .from("sprints")
    .select("*")
    .eq("id", sprintId)
    .single();

  if (fetchError || !sprint) {
    return { error: "Sprint not found" };
  }

  if (sprint.status !== "planning") {
    return { error: "Only planning sprints can be started" };
  }

  // Check for existing active sprint on this project
  const { data: activeSprints } = await supabase
    .from("sprints")
    .select("id")
    .eq("project_id", sprint.project_id)
    .eq("status", "active");

  if (activeSprints && activeSprints.length > 0) {
    return { error: "Another sprint is already active in this project. Complete it first." };
  }

  const { data, error } = await supabase
    .from("sprints")
    .update({ status: "active" })
    .eq("id", sprintId)
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const activity = await createActivity({
        supabase,
        workspaceId: data.workspace_id,
        actorId: user.id,
        action: "started",
        entityType: "sprint",
        entityId: sprintId,
        metadata: { name: data.name, project_id: data.project_id },
      });

      // Notify all workspace members
      const { data: members } = await supabase
        .from("workspace_members")
        .select("user_id")
        .eq("workspace_id", data.workspace_id);

      if (members) {
        await createNotificationsForActivity({
          supabase,
          workspaceId: data.workspace_id,
          actorId: user.id,
          activityId: activity.id,
          recipientIds: members.map((m) => m.user_id),
          type: "general",
        });
      }
    }
  } catch {
    // Activity logging should not block the primary operation
  }

  revalidatePath("/", "layout");
  return { data };
}

export async function completeSprint(
  sprintId: string
): Promise<ActionResponse<{ sprint: Tables<"sprints">; movedCount: number }>> {
  const supabase = await createClient();

  // Fetch sprint
  const { data: sprint, error: fetchError } = await supabase
    .from("sprints")
    .select("*")
    .eq("id", sprintId)
    .single();

  if (fetchError || !sprint) {
    return { error: "Sprint not found" };
  }

  if (sprint.status !== "active") {
    return { error: "Only active sprints can be completed" };
  }

  // Capture the sprint scope before moving issues so completed sprint analytics can
  // reconstruct the original sprint composition later.
  const { data: sprintIssues, error: sprintIssuesError } = await supabase
    .from("issues")
    .select("id, status")
    .eq("sprint_id", sprintId);

  if (sprintIssuesError) {
    return { error: sprintIssuesError.message };
  }

  const scopeIssueIds = (sprintIssues ?? []).map((issue) => issue.id);
  const movedCount = (sprintIssues ?? []).filter((issue) => issue.status !== "done").length;

  if (movedCount > 0) {
    const { error: moveError } = await supabase
      .from("issues")
      .update({ sprint_id: null })
      .eq("sprint_id", sprintId)
      .neq("status", "done");

    if (moveError) {
      return { error: moveError.message };
    }
  }

  // Complete the sprint
  const { data, error } = await supabase
    .from("sprints")
    .update({ status: "completed" })
    .eq("id", sprintId)
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const activity = await createActivity({
        supabase,
        workspaceId: data.workspace_id,
        actorId: user.id,
        action: "completed",
        entityType: "sprint",
        entityId: sprintId,
        metadata: {
          name: data.name,
          project_id: data.project_id,
          moved_count: movedCount,
          scope_issue_ids: scopeIssueIds,
        },
      });

      // Notify all workspace members
      const { data: members } = await supabase
        .from("workspace_members")
        .select("user_id")
        .eq("workspace_id", data.workspace_id);

      if (members) {
        await createNotificationsForActivity({
          supabase,
          workspaceId: data.workspace_id,
          actorId: user.id,
          activityId: activity.id,
          recipientIds: members.map((m) => m.user_id),
          type: "general",
        });
      }
    }
  } catch {
    // Activity logging should not block the primary operation
  }

  revalidatePath("/", "layout");
  return { data: { sprint: data, movedCount } };
}

export async function deleteSprint(
  sprintId: string
): Promise<ActionResponse<void>> {
  const supabase = await createClient();

  // Fetch sprint to verify status
  const { data: sprint, error: fetchError } = await supabase
    .from("sprints")
    .select("status")
    .eq("id", sprintId)
    .single();

  if (fetchError || !sprint) {
    return { error: "Sprint not found" };
  }

  if (sprint.status !== "planning") {
    return { error: "Only planning sprints can be deleted" };
  }

  // Unassign issues from this sprint
  await supabase
    .from("issues")
    .update({ sprint_id: null })
    .eq("sprint_id", sprintId);

  const { error } = await supabase
    .from("sprints")
    .delete()
    .eq("id", sprintId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  return { data: undefined };
}
