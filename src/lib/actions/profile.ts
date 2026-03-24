"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ActionResponse, Tables } from "@/lib/types";

export async function updateProfile(
  formData: FormData
): Promise<ActionResponse<Tables<"profiles">>> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const updates: Record<string, unknown> = {};

  const fullName = formData.get("fullName") as string | null;
  if (fullName !== null) updates.full_name = fullName || null;

  // Notification toggles
  const notifyEmail = formData.get("notifyEmail");
  const notifyInApp = formData.get("notifyInApp");
  const notifyMentions = formData.get("notifyMentions");
  const notifyAssignments = formData.get("notifyAssignments");

  if (notifyEmail !== null) updates.notify_email = notifyEmail === "true";
  if (notifyInApp !== null) updates.notify_in_app = notifyInApp === "true";
  if (notifyMentions !== null) updates.notify_mentions = notifyMentions === "true";
  if (notifyAssignments !== null) updates.notify_assignments = notifyAssignments === "true";

  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", user.id)
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  return { data };
}
