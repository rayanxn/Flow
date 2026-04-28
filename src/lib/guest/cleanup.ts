import type { SupabaseClient } from "@supabase/supabase-js";
import { createAdminClient } from "../supabase/admin";
import type { Database } from "../types";

type AdminClient = SupabaseClient<Database>;

export type DeleteGuestAuthUserResult = {
  deleted: boolean;
  skipped: boolean;
  reason?: string;
};

export type DeleteGuestAuthUser = (
  guestUserId: string,
  admin: AdminClient,
) => Promise<DeleteGuestAuthUserResult>;

export type CleanupExpiredGuestWorkspacesInput = {
  admin?: AdminClient;
  now?: Date;
  deleteGuestAuthUser?: DeleteGuestAuthUser;
};

export type CleanupExpiredGuestWorkspacesResult = {
  scanned: number;
  deletedWorkspaces: number;
  deletedAuthUsers: number;
  skippedAuthUsers: number;
  errors: string[];
};

function isMissingUserError(error: { message?: string; status?: number } | null) {
  const message = error?.message?.toLowerCase() ?? "";
  return error?.status === 404 || message.includes("not found");
}

export async function deleteAnonymousGuestAuthUser(
  guestUserId: string,
  admin: AdminClient,
): Promise<DeleteGuestAuthUserResult> {
  const { data, error } = await admin.auth.admin.getUserById(guestUserId);

  if (error) {
    if (isMissingUserError(error)) {
      return { deleted: false, skipped: true, reason: "missing" };
    }

    throw new Error(error.message);
  }

  if (!data.user?.is_anonymous) {
    return { deleted: false, skipped: true, reason: "not_anonymous" };
  }

  const { error: deleteError } = await admin.auth.admin.deleteUser(guestUserId);
  if (deleteError) {
    if (isMissingUserError(deleteError)) {
      return { deleted: false, skipped: true, reason: "missing" };
    }

    throw new Error(deleteError.message);
  }

  return { deleted: true, skipped: false };
}

export async function cleanupExpiredGuestWorkspaces({
  admin = createAdminClient(),
  now = new Date(),
  deleteGuestAuthUser = deleteAnonymousGuestAuthUser,
}: CleanupExpiredGuestWorkspacesInput = {}): Promise<CleanupExpiredGuestWorkspacesResult> {
  const nowIso = now.toISOString();
  const result: CleanupExpiredGuestWorkspacesResult = {
    scanned: 0,
    deletedWorkspaces: 0,
    deletedAuthUsers: 0,
    skippedAuthUsers: 0,
    errors: [],
  };

  const { data: guestWorkspaces, error } = await admin
    .from("guest_workspaces")
    .select("*")
    .lte("expires_at", nowIso)
    .is("deleted_at", null)
    .order("expires_at", { ascending: true });

  if (error) {
    throw new Error(`Unable to load expired guest workspaces: ${error.message}`);
  }

  for (const guestWorkspace of guestWorkspaces ?? []) {
    result.scanned += 1;
    const cleanupErrors: string[] = [];

    if (guestWorkspace.workspace_id) {
      const { error: deleteWorkspaceError } = await admin
        .from("workspaces")
        .delete()
        .eq("id", guestWorkspace.workspace_id);

      if (deleteWorkspaceError) {
        cleanupErrors.push(deleteWorkspaceError.message);
      } else {
        result.deletedWorkspaces += 1;
      }
    }

    try {
      const authResult = await deleteGuestAuthUser(
        guestWorkspace.guest_user_id,
        admin,
      );

      if (authResult.deleted) {
        result.deletedAuthUsers += 1;
      }

      if (authResult.skipped) {
        result.skippedAuthUsers += 1;
      }
    } catch (authError) {
      cleanupErrors.push(
        authError instanceof Error ? authError.message : String(authError),
      );
    }

    const { error: metadataError } = await admin
      .from("guest_workspaces")
      .update({
        deleted_at: nowIso,
        cleanup_error: cleanupErrors.length > 0 ? cleanupErrors.join("; ") : null,
      })
      .eq("id", guestWorkspace.id);

    if (metadataError) {
      cleanupErrors.push(metadataError.message);
    }

    result.errors.push(...cleanupErrors);
  }

  return result;
}
