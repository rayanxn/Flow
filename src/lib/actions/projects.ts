"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ActionResponse, Tables } from "@/lib/types";
import { createActivity } from "@/lib/actions/activities";

export async function updateProject(
  projectId: string,
  formData: FormData
): Promise<ActionResponse<Tables<"projects">>> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const updates: Record<string, unknown> = {};

  const name = formData.get("name") as string | null;
  const description = formData.get("description") as string | null;
  const color = formData.get("color") as string | null;
  const leadId = formData.get("leadId") as string | null;
  const teamId = formData.get("teamId") as string | null;
  const isPrivate = formData.get("isPrivate");

  if (name) updates.name = name;
  if (description !== null) updates.description = description || null;
  if (color) updates.color = color;
  if (leadId !== null) updates.lead_id = leadId || null;
  if (teamId !== null) updates.team_id = teamId || null;
  if (isPrivate !== null) updates.is_private = isPrivate === "true";

  const { data, error } = await supabase
    .from("projects")
    .update(updates)
    .eq("id", projectId)
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  try {
    await createActivity({
      supabase,
      workspaceId: data.workspace_id,
      actorId: user.id,
      action: "updated",
      entityType: "project",
      entityId: projectId,
      metadata: { name: data.name, project_id: projectId, changes: updates },
    });
  } catch {
    // Activity logging should not block the primary operation
  }

  revalidatePath("/", "layout");
  return { data };
}

export async function archiveProject(
  projectId: string
): Promise<ActionResponse<void>> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  // Fetch project before archiving for activity metadata
  const { data: project } = await supabase
    .from("projects")
    .select("workspace_id, name")
    .eq("id", projectId)
    .single();

  const { error } = await supabase
    .from("projects")
    .update({ is_archived: true })
    .eq("id", projectId);

  if (error) {
    return { error: error.message };
  }

  if (project) {
    try {
      await createActivity({
        supabase,
        workspaceId: project.workspace_id,
        actorId: user.id,
        action: "archived",
        entityType: "project",
        entityId: projectId,
        metadata: { name: project.name, project_id: projectId },
      });
    } catch {
      // Activity logging should not block the primary operation
    }
  }

  revalidatePath("/", "layout");
  return { data: undefined };
}

export async function deleteProject(
  projectId: string
): Promise<ActionResponse<void>> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  // Fetch project before deleting for activity metadata
  const { data: project } = await supabase
    .from("projects")
    .select("workspace_id, name")
    .eq("id", projectId)
    .single();

  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", projectId);

  if (error) {
    return { error: error.message };
  }

  if (project) {
    try {
      await createActivity({
        supabase,
        workspaceId: project.workspace_id,
        actorId: user.id,
        action: "deleted",
        entityType: "project",
        entityId: projectId,
        metadata: { name: project.name, project_id: projectId },
      });
    } catch {
      // Activity logging should not block the primary operation
    }
  }

  revalidatePath("/", "layout");
  return { data: undefined };
}
