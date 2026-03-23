import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/lib/types";

export async function getUserWorkspace() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("workspace_members")
    .select("workspace:workspaces(*)")
    .eq("user_id", user.id)
    .limit(1)
    .single();

  if (!data) return null;

  const row = data as unknown as { workspace: Tables<"workspaces"> | null };
  return row.workspace ?? null;
}

export async function getWorkspaceBySlug(slug: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: membership } = await supabase
    .from("workspace_members")
    .select("*, workspace:workspaces!inner(*)")
    .eq("workspace.slug", slug)
    .eq("user_id", user.id)
    .single();

  if (!membership) return null;

  return membership as Tables<"workspace_members"> & {
    workspace: Tables<"workspaces">;
  };
}

export async function getWorkspaceProjects(workspaceId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("projects")
    .select("id, name, color, is_archived")
    .eq("workspace_id", workspaceId)
    .eq("is_archived", false)
    .order("name");
  return data ?? [];
}
