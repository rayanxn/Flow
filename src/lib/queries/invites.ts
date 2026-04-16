import { createClient } from "@/lib/supabase/server";
import { getInviteStatus, type WorkspaceInviteListItem } from "@/lib/invites";

export async function getWorkspaceInvites(workspaceId: string): Promise<WorkspaceInviteListItem[]> {
  const supabase = await createClient();
  const { data: invites } = await supabase
    .from("workspace_invites")
    .select("*")
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: false });

  return (invites ?? []).map((invite) => ({
    ...invite,
    status: getInviteStatus(invite),
  }));
}
