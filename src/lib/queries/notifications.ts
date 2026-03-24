import { createClient } from "@/lib/supabase/server";
import type { Tables, NotificationType } from "@/lib/types";
import type {
  ActivityWithActor,
  NotificationWithActivity,
} from "@/lib/utils/activities";

export type { NotificationWithActivity } from "@/lib/utils/activities";

export async function getNotifications(
  workspaceId: string,
  userId: string,
  options?: { type?: NotificationType; limit?: number }
): Promise<NotificationWithActivity[]> {
  const supabase = await createClient();

  let query = supabase
    .from("notifications")
    .select("*")
    .eq("workspace_id", workspaceId)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(options?.limit ?? 50);

  if (options?.type) {
    query = query.eq("type", options.type);
  }

  const { data: notifications } = await query;
  if (!notifications || notifications.length === 0) return [];

  // Batch-fetch activities
  const activityIds = [
    ...new Set(notifications.map((n) => n.activity_id)),
  ];
  const activityMap = new Map<string, Tables<"activities">>();

  if (activityIds.length > 0) {
    const { data: activities } = await supabase
      .from("activities")
      .select("*")
      .in("id", activityIds);
    for (const a of activities ?? []) {
      activityMap.set(a.id, a);
    }
  }

  // Batch-fetch actor profiles from activities
  const actorIds = [
    ...new Set(
      [...activityMap.values()].map((a) => a.actor_id)
    ),
  ];
  const actorMap = new Map<
    string,
    { id: string; full_name: string | null; email: string; avatar_url: string | null }
  >();

  if (actorIds.length > 0) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name, email, avatar_url")
      .in("id", actorIds);
    for (const p of profiles ?? []) {
      actorMap.set(p.id, p);
    }
  }

  // Batch-fetch project names
  const projectIds = [
    ...new Set(
      [...activityMap.values()]
        .map((a) => (a.metadata as Record<string, unknown>)?.project_id)
        .filter(Boolean)
    ),
  ] as string[];
  const projectMap = new Map<string, string>();

  if (projectIds.length > 0) {
    const { data: projects } = await supabase
      .from("projects")
      .select("id, name")
      .in("id", projectIds);
    for (const p of projects ?? []) {
      projectMap.set(p.id, p.name);
    }
  }

  return notifications.map((notification) => {
    const rawActivity = activityMap.get(notification.activity_id);
    if (!rawActivity) {
      return { ...notification, activity: null };
    }

    const meta = rawActivity.metadata as Record<string, unknown>;
    const projectId = meta?.project_id as string | undefined;

    const activity: ActivityWithActor = {
      ...rawActivity,
      actor: actorMap.get(rawActivity.actor_id) ?? null,
      project_name: projectId ? projectMap.get(projectId) ?? null : null,
    };

    return { ...notification, activity };
  });
}

export async function getUnreadNotificationCount(
  workspaceId: string,
  userId: string
): Promise<number> {
  const supabase = await createClient();

  const { count } = await supabase
    .from("notifications")
    .select("id", { count: "exact", head: true })
    .eq("workspace_id", workspaceId)
    .eq("user_id", userId)
    .eq("is_read", false);

  return count ?? 0;
}
