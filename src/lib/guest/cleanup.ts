import type { SupabaseClient } from "@supabase/supabase-js";
import { createAdminClient } from "../supabase/admin";
import type { Database, Tables } from "../types";

type AdminClient = SupabaseClient<Database>;

export type CleanupExpiredGuestWorkspacesOptions = {
  now?: Date;
  batchSize?: number;
  supabase?: AdminClient;
};

export type CleanupExpiredGuestWorkspacesResult = {
  scanned: number;
  deletedWorkspaces: number;
  deletedUsers: number;
  skippedUsers: number;
  markedCleaned: number;
  errors: string[];
};

function isMissingAuthUserError(error: { message?: string; status?: number } | null) {
  return (
    error?.status === 404 ||
    error?.message?.toLowerCase().includes("not found") ||
    error?.message?.toLowerCase().includes("user not found")
  );
}

async function cleanupGuestWorkspace(
  supabase: AdminClient,
  record: Tables<"guest_workspaces">,
  cleanedAt: string,
) {
  let workspaceDeleted = false;
  let userDeleted = false;
  let userSkipped = false;
  const errors: string[] = [];

  if (record.workspace_id) {
    const { error } = await supabase
      .from("workspaces")
      .delete()
      .eq("id", record.workspace_id);

    if (error) {
      errors.push(`Workspace ${record.workspace_id}: ${error.message}`);
    } else {
      workspaceDeleted = true;
    }
  }

  if (record.guest_user_id) {
    const { data: userData, error: getUserError } =
      await supabase.auth.admin.getUserById(record.guest_user_id);

    if (getUserError) {
      if (!isMissingAuthUserError(getUserError)) {
        errors.push(`Guest user ${record.guest_user_id}: ${getUserError.message}`);
      }
    } else if (userData.user?.is_anonymous === true) {
      const { error: deleteUserError } = await supabase.auth.admin.deleteUser(
        record.guest_user_id,
      );

      if (deleteUserError && !isMissingAuthUserError(deleteUserError)) {
        errors.push(`Guest user ${record.guest_user_id}: ${deleteUserError.message}`);
      } else {
        userDeleted = true;
      }
    } else {
      userSkipped = true;
    }
  }

  const shouldMarkCleaned = errors.length === 0;
  if (shouldMarkCleaned) {
    const { error } = await supabase
      .from("guest_workspaces")
      .update({ cleaned_at: cleanedAt, cleanup_error: null })
      .eq("id", record.id);

    if (error) {
      errors.push(`Guest record ${record.id}: ${error.message}`);
    }
  } else {
    await supabase
      .from("guest_workspaces")
      .update({ cleanup_error: errors.join("; ") })
      .eq("id", record.id);
  }

  return {
    workspaceDeleted,
    userDeleted,
    userSkipped,
    markedCleaned: shouldMarkCleaned && errors.length === 0,
    errors,
  };
}

export async function cleanupExpiredGuestWorkspaces(
  options: CleanupExpiredGuestWorkspacesOptions = {},
): Promise<CleanupExpiredGuestWorkspacesResult> {
  const supabase = options.supabase ?? createAdminClient();
  const now = options.now ?? new Date();
  const batchSize = options.batchSize ?? 100;
  const cleanedAt = now.toISOString();

  const { data: records, error } = await supabase
    .from("guest_workspaces")
    .select("*")
    .is("cleaned_at", null)
    .lte("expires_at", cleanedAt)
    .order("expires_at", { ascending: true })
    .limit(batchSize);

  if (error) {
    throw new Error(`Unable to load expired guest workspaces: ${error.message}`);
  }

  const result: CleanupExpiredGuestWorkspacesResult = {
    scanned: records?.length ?? 0,
    deletedWorkspaces: 0,
    deletedUsers: 0,
    skippedUsers: 0,
    markedCleaned: 0,
    errors: [],
  };

  for (const record of records ?? []) {
    const item = await cleanupGuestWorkspace(supabase, record, cleanedAt);
    if (item.workspaceDeleted) result.deletedWorkspaces++;
    if (item.userDeleted) result.deletedUsers++;
    if (item.userSkipped) result.skippedUsers++;
    if (item.markedCleaned) result.markedCleaned++;
    result.errors.push(...item.errors);
  }

  return result;
}
