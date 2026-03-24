"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ActionResponse, Tables } from "@/lib/types";

export async function createLabel(
  projectId: string,
  name: string,
  color: string
): Promise<ActionResponse<Tables<"labels">>> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  if (!name.trim()) return { error: "Label name is required" };

  const { data, error } = await supabase
    .from("labels")
    .insert({ project_id: projectId, name: name.trim(), color })
    .select()
    .single();

  if (error) {
    if (error.message.includes("duplicate") || error.message.includes("unique")) {
      return { error: "A label with this name already exists" };
    }
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  return { data };
}

export async function updateLabel(
  labelId: string,
  updates: { name?: string; color?: string }
): Promise<ActionResponse<Tables<"labels">>> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const updateData: Record<string, unknown> = {};
  if (updates.name !== undefined) updateData.name = updates.name.trim();
  if (updates.color !== undefined) updateData.color = updates.color;

  const { data, error } = await supabase
    .from("labels")
    .update(updateData)
    .eq("id", labelId)
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  return { data };
}

export async function deleteLabel(
  labelId: string
): Promise<ActionResponse<void>> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  // Delete issue_labels references first
  await supabase.from("issue_labels").delete().eq("label_id", labelId);

  const { error } = await supabase.from("labels").delete().eq("id", labelId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  return { data: undefined };
}
