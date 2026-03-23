import { createClient } from "@/lib/supabase/server";

export type WorkspaceMember = {
  id: string;
  user_id: string;
  role: "owner" | "admin" | "member";
  profile: { id: string; full_name: string | null; email: string; avatar_url: string | null };
};

export async function getWorkspaceMembers(
  workspaceId: string
): Promise<WorkspaceMember[]> {
  const supabase = await createClient();

  const { data: members } = await supabase
    .from("workspace_members")
    .select("id, user_id, role")
    .eq("workspace_id", workspaceId);

  if (!members || members.length === 0) return [];

  const userIds = members.map((m) => m.user_id);
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name, email, avatar_url")
    .in("id", userIds);

  const profileMap = new Map<
    string,
    { id: string; full_name: string | null; email: string; avatar_url: string | null }
  >();
  for (const p of profiles ?? []) {
    profileMap.set(p.id, p);
  }

  return members
    .filter((m) => profileMap.has(m.user_id))
    .map((m) => ({
      ...m,
      profile: profileMap.get(m.user_id)!,
    }));
}

export async function getWorkspaceTeams(workspaceId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("teams")
    .select("*")
    .eq("workspace_id", workspaceId)
    .order("name");
  return data ?? [];
}
