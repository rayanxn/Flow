import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, NotificationType } from "@/lib/types";
import type { Json } from "@/lib/types/database";

interface CreateActivityParams {
  supabase: SupabaseClient<Database>;
  workspaceId: string;
  actorId: string;
  action: string;
  entityType: string;
  entityId: string;
  metadata?: Record<string, unknown>;
}

export async function createActivity({
  supabase,
  workspaceId,
  actorId,
  action,
  entityType,
  entityId,
  metadata = {},
}: CreateActivityParams) {
  const { data, error } = await supabase
    .from("activities")
    .insert({
      workspace_id: workspaceId,
      actor_id: actorId,
      action,
      entity_type: entityType,
      entity_id: entityId,
      metadata: metadata as unknown as Json,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

interface CreateNotificationsParams {
  supabase: SupabaseClient<Database>;
  workspaceId: string;
  actorId: string;
  activityId: string;
  recipientIds: string[];
  type: NotificationType;
}

export async function createNotificationsForActivity({
  supabase,
  workspaceId,
  actorId,
  activityId,
  recipientIds,
  type,
}: CreateNotificationsParams) {
  const uniqueRecipients = [...new Set(recipientIds)].filter(
    (id) => id !== actorId
  );

  if (uniqueRecipients.length === 0) return;

  const rows = uniqueRecipients.map((userId) => ({
    workspace_id: workspaceId,
    user_id: userId,
    activity_id: activityId,
    type,
  }));

  const { error } = await supabase.from("notifications").insert(rows);
  if (error) throw error;
}
