"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ActionResponse, Tables, ViewFilters } from "@/lib/types";
import type { Json } from "@/lib/types/database";
import { createActivity } from "@/lib/actions/activities";

export async function createView(
  formData: FormData
): Promise<ActionResponse<Tables<"views">>> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const workspaceId = formData.get("workspaceId") as string;
  const name = formData.get("name") as string;
  const description = (formData.get("description") as string) || null;
  const filtersJson = formData.get("filters") as string;

  if (!workspaceId || !name) {
    return { error: "Name is required" };
  }

  let filters: ViewFilters = {};
  try {
    filters = filtersJson ? JSON.parse(filtersJson) : {};
  } catch {
    return { error: "Invalid filters" };
  }

  const { data, error } = await supabase
    .from("views")
    .insert({
      workspace_id: workspaceId,
      name,
      description,
      filters: filters as unknown as Json,
      created_by: user.id,
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
      entityType: "view",
      entityId: data.id,
      metadata: { name },
    });
  } catch {
    // Activity logging should not block the primary operation
  }

  revalidatePath("/", "layout");
  return { data };
}

export async function updateView(
  viewId: string,
  updates: {
    name?: string;
    description?: string | null;
    filters?: ViewFilters;
  }
): Promise<ActionResponse<Tables<"views">>> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const updateData: Record<string, unknown> = {};
  if (updates.name !== undefined) updateData.name = updates.name;
  if (updates.description !== undefined) updateData.description = updates.description;
  if (updates.filters !== undefined) updateData.filters = updates.filters;

  const { data, error } = await supabase
    .from("views")
    .update(updateData)
    .eq("id", viewId)
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  return { data };
}

export async function deleteView(
  viewId: string
): Promise<ActionResponse<void>> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("views")
    .delete()
    .eq("id", viewId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  return { data: undefined };
}
