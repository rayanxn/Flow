import { createClient } from "@/lib/supabase/server";
import type { ActivityWithActor } from "@/lib/utils/activities";

export type { ActivityWithActor } from "@/lib/utils/activities";
export { formatActivityAction } from "@/lib/utils/activities";

export async function getRecentActivities(
  workspaceId: string,
  limit: number = 6
): Promise<ActivityWithActor[]> {
  const supabase = await createClient();

  const { data: activities } = await supabase
    .from("activities")
    .select("*")
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (!activities || activities.length === 0) return [];

  // Batch-fetch actor profiles
  const actorIds = [...new Set(activities.map((a) => a.actor_id))];
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

  // Batch-fetch project names from metadata
  const projectIds = [
    ...new Set(
      activities
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

  return activities.map((activity) => {
    const meta = activity.metadata as Record<string, unknown>;
    const projectId = meta?.project_id as string | undefined;
    return {
      ...activity,
      actor: actorMap.get(activity.actor_id) ?? null,
      project_name: projectId ? projectMap.get(projectId) ?? null : null,
    };
  });
}
