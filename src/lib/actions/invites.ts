"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createActivity } from "@/lib/actions/activities";
import { buildInviteUrl, canCreateInvite, getInviteStatus, getJoinInviteRecord } from "@/lib/invites";
import type { ActionResponse, Tables, WorkspaceRole } from "@/lib/types";

type WorkspaceInviteRow = Tables<"workspace_invites">;

type ManagedInviteResult = {
  invite: WorkspaceInviteRow;
  url: string;
};

async function getInviteActorContext(workspaceId: string): Promise<
  | {
      supabase: Awaited<ReturnType<typeof createClient>>;
      user: { id: string };
      role: WorkspaceRole;
    }
  | { error: string }
> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const { data: membership } = await supabase
    .from("workspace_members")
    .select("role")
    .eq("workspace_id", workspaceId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!membership) {
    return { error: "Only workspace owners and admins can manage invites" };
  }

  return {
    supabase,
    user: { id: user.id },
    role: membership.role,
  };
}

async function logInviteActivity(params: {
  actorId: string;
  invite: WorkspaceInviteRow;
  action: "created" | "accepted" | "revoked";
}) {
  const admin = createAdminClient();

  try {
    await createActivity({
      supabase: admin,
      workspaceId: params.invite.workspace_id,
      actorId: params.actorId,
      action: params.action,
      entityType: "invite",
      entityId: params.invite.id,
      metadata: {
        email: params.invite.email,
        invite_type: params.invite.invite_type,
        role: params.invite.role,
      },
    });
  } catch {
    // Activity logging should not block access changes.
  }
}

async function getActiveLinkInvite(workspaceId: string) {
  const supabase = await createClient();
  const { data: invites } = await supabase
    .from("workspace_invites")
    .select("*")
    .eq("workspace_id", workspaceId)
    .eq("invite_type", "link")
    .is("revoked_at", null)
    .order("created_at", { ascending: false });

  return (invites ?? []).find((invite) => getInviteStatus(invite) === "pending") ?? null;
}

export async function createWorkspaceLinkInvite(
  workspaceId: string,
): Promise<ActionResponse<ManagedInviteResult>> {
  const actor = await getInviteActorContext(workspaceId);
  if ("error" in actor) {
    return actor;
  }

  if (!canCreateInvite(actor.role, "link", "member")) {
    return { error: "You do not have permission to create join links" };
  }

  const existingLink = await getActiveLinkInvite(workspaceId);
  if (existingLink) {
    return {
      data: {
        invite: existingLink,
        url: buildInviteUrl(existingLink.code),
      },
    };
  }

  const admin = createAdminClient();
  const { data: invite, error } = await admin
    .from("workspace_invites")
    .insert({
      workspace_id: workspaceId,
      invite_type: "link",
      role: "member",
      created_by: actor.user.id,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    })
    .select()
    .single();

  if (error || !invite) {
    return { error: error?.message ?? "Unable to create join link" };
  }

  await logInviteActivity({
    actorId: actor.user.id,
    invite,
    action: "created",
  });

  revalidatePath("/", "layout");

  return {
    data: {
      invite,
      url: buildInviteUrl(invite.code),
    },
  };
}

export async function regenerateWorkspaceLinkInvite(
  workspaceId: string,
): Promise<ActionResponse<ManagedInviteResult>> {
  const actor = await getInviteActorContext(workspaceId);
  if ("error" in actor) {
    return actor;
  }

  if (!canCreateInvite(actor.role, "link", "member")) {
    return { error: "You do not have permission to regenerate join links" };
  }

  const activeLink = await getActiveLinkInvite(workspaceId);
  const admin = createAdminClient();

  if (activeLink) {
    await admin
      .from("workspace_invites")
      .update({
        revoked_at: new Date().toISOString(),
        revoked_by: actor.user.id,
      })
      .eq("id", activeLink.id);

    await logInviteActivity({
      actorId: actor.user.id,
      invite: {
        ...activeLink,
        revoked_at: new Date().toISOString(),
        revoked_by: actor.user.id,
      },
      action: "revoked",
    });
  }

  return createWorkspaceLinkInvite(workspaceId);
}

export async function createWorkspaceEmailInvite(input: {
  workspaceId: string;
  email: string;
  role: "admin" | "member";
}): Promise<ActionResponse<ManagedInviteResult>> {
  const email = input.email.trim().toLowerCase();
  if (!email) {
    return { error: "Email is required" };
  }

  const actor = await getInviteActorContext(input.workspaceId);
  if ("error" in actor) {
    return actor;
  }

  if (!canCreateInvite(actor.role, "email", input.role)) {
    return { error: "You do not have permission to create that invite" };
  }

  const admin = createAdminClient();
  const { data: invite, error } = await admin
    .from("workspace_invites")
    .insert({
      workspace_id: input.workspaceId,
      invite_type: "email",
      email,
      role: input.role,
      created_by: actor.user.id,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    })
    .select()
    .single();

  if (error || !invite) {
    return { error: error?.message ?? "Unable to create email invite" };
  }

  await logInviteActivity({
    actorId: actor.user.id,
    invite,
    action: "created",
  });

  revalidatePath("/", "layout");

  return {
    data: {
      invite,
      url: buildInviteUrl(invite.code),
    },
  };
}

export async function revokeWorkspaceInvite(
  inviteId: string,
): Promise<ActionResponse<void>> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const { data: invite } = await supabase
    .from("workspace_invites")
    .select("*")
    .eq("id", inviteId)
    .maybeSingle();

  if (!invite) {
    return { error: "Invite not found" };
  }

  const actor = await getInviteActorContext(invite.workspace_id);
  if ("error" in actor) {
    return actor;
  }

  const admin = createAdminClient();
  const revokedAt = new Date().toISOString();
  const { error } = await admin
    .from("workspace_invites")
    .update({
      revoked_at: revokedAt,
      revoked_by: actor.user.id,
    })
    .eq("id", inviteId);

  if (error) {
    return { error: error.message };
  }

  await logInviteActivity({
    actorId: actor.user.id,
    invite: {
      ...invite,
      revoked_at: revokedAt,
      revoked_by: actor.user.id,
    },
    action: "revoked",
  });

  revalidatePath("/", "layout");
  return { data: undefined };
}

export async function acceptWorkspaceInvite(
  code: string,
): Promise<ActionResponse<{ workspaceSlug: string; alreadyMember: boolean }>> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Please sign in before accepting this invite" };
  }

  const inviteRecord = await getJoinInviteRecord(code);
  if (!inviteRecord?.workspace) {
    return { error: "This invite is invalid or no longer exists" };
  }

  const status = getInviteStatus(inviteRecord);
  if (status === "revoked") {
    return { error: "This invite has been revoked. Ask a workspace admin for a new one." };
  }

  if (status === "expired") {
    return { error: "This invite has expired. Ask a workspace admin for a fresh invite." };
  }

  const currentEmail = user.email?.trim().toLowerCase() ?? "";
  if (
    inviteRecord.invite_type === "email" &&
    inviteRecord.email?.trim().toLowerCase() !== currentEmail
  ) {
    return {
      error: `This invite is for ${inviteRecord.email}. Sign in with that account to continue.`,
    };
  }

  if (
    inviteRecord.invite_type === "email" &&
    inviteRecord.accepted_at &&
    inviteRecord.accepted_by !== user.id
  ) {
    return { error: "This invite has already been used." };
  }

  const admin = createAdminClient();
  const { data: existingMembership } = await admin
    .from("workspace_members")
    .select("id")
    .eq("workspace_id", inviteRecord.workspace_id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!existingMembership) {
    const { error: membershipError } = await admin.from("workspace_members").upsert(
      {
        workspace_id: inviteRecord.workspace_id,
        user_id: user.id,
        role: inviteRecord.invite_type === "link" ? "member" : inviteRecord.role,
      },
      { onConflict: "workspace_id,user_id" },
    );

    if (membershipError) {
      return { error: membershipError.message };
    }
  }

  if (inviteRecord.invite_type === "email" && !inviteRecord.accepted_at) {
    const acceptedAt = new Date().toISOString();
    const { error: inviteUpdateError } = await admin
      .from("workspace_invites")
      .update({
        accepted_at: acceptedAt,
        accepted_by: user.id,
      })
      .eq("id", inviteRecord.id);

    if (inviteUpdateError) {
      return { error: inviteUpdateError.message };
    }

    await logInviteActivity({
      actorId: user.id,
      invite: {
        ...inviteRecord,
        accepted_at: acceptedAt,
        accepted_by: user.id,
      },
      action: "accepted",
    });
  } else if (!existingMembership) {
    await logInviteActivity({
      actorId: user.id,
      invite: inviteRecord,
      action: "accepted",
    });
  }

  revalidatePath("/", "layout");

  return {
    data: {
      workspaceSlug: inviteRecord.workspace.slug,
      alreadyMember: Boolean(existingMembership),
    },
  };
}
