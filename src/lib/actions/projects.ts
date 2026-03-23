"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ActionResponse, Tables } from "@/lib/types";

export async function updateProject(
  projectId: string,
  formData: FormData
): Promise<ActionResponse<Tables<"projects">>> {
  const supabase = await createClient();

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

  revalidatePath("/", "layout");
  return { data };
}

export async function archiveProject(
  projectId: string
): Promise<ActionResponse<void>> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("projects")
    .update({ is_archived: true })
    .eq("id", projectId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  return { data: undefined };
}

export async function deleteProject(
  projectId: string
): Promise<ActionResponse<void>> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", projectId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  return { data: undefined };
}
