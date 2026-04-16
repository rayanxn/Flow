import type { Tables, WorkspaceInviteStatus, WorkspaceInviteType, WorkspaceRole } from "@/lib/types";
import { createAdminClient } from "@/lib/supabase/admin";

type WorkspaceInviteRow = Tables<"workspace_invites">;

export type JoinInviteRecord = WorkspaceInviteRow & {
  workspace: Pick<Tables<"workspaces">, "id" | "name" | "slug"> | null;
};

export type WorkspaceInviteListItem = WorkspaceInviteRow & {
  status: WorkspaceInviteStatus;
};

export function buildInviteUrl(code: string) {
  const appUrl = (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000").replace(/\/$/, "");
  return `${appUrl}/join/${code}`;
}

export function getInviteStatus(invite: WorkspaceInviteRow): WorkspaceInviteStatus {
  if (invite.revoked_at) {
    return "revoked";
  }

  if (
    invite.invite_type === "email" &&
    invite.accepted_at
  ) {
    return "accepted";
  }

  if (invite.expires_at && new Date(invite.expires_at).getTime() <= Date.now()) {
    return "expired";
  }

  return "pending";
}

export function canCreateInvite(
  actorRole: WorkspaceRole,
  inviteType: WorkspaceInviteType,
  role: "admin" | "member",
) {
  if (actorRole === "owner") {
    return inviteType !== "link" || role === "member";
  }

  if (actorRole === "admin") {
    return role === "member";
  }

  return false;
}

export function getInviteStatusLabel(status: WorkspaceInviteStatus) {
  switch (status) {
    case "accepted":
      return "Accepted";
    case "expired":
      return "Expired";
    case "revoked":
      return "Revoked";
    default:
      return "Pending";
  }
}

export async function getJoinInviteRecord(code: string): Promise<JoinInviteRecord | null> {
  const admin = createAdminClient();

  const { data: invite, error } = await admin
    .from("workspace_invites")
    .select("*")
    .eq("code", code)
    .maybeSingle();

  if (error || !invite) {
    return null;
  }

  const { data: workspace } = await admin
    .from("workspaces")
    .select("id, name, slug")
    .eq("id", invite.workspace_id)
    .maybeSingle();

  return {
    ...invite,
    workspace: workspace ?? null,
  };
}
