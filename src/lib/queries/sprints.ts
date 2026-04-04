import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/lib/types";
import { enrichIssues, type IssueWithDetails } from "./issues";

export type ActiveSprintSummary = {
  sprint: Tables<"sprints">;
  totalIssues: number;
  doneIssues: number;
  totalPoints: number;
  donePoints: number;
};

async function getCompletedSprintScopeIssueIds(
  supabase: Awaited<ReturnType<typeof createClient>>,
  sprintId: string
): Promise<string[] | null> {
  const { data: completionActivity } = await supabase
    .from("activities")
    .select("metadata")
    .eq("entity_type", "sprint")
    .eq("action", "completed")
    .eq("entity_id", sprintId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const metadata =
    (completionActivity?.metadata as Record<string, unknown> | null) ?? null;
  const scopeIssueIds = metadata?.scope_issue_ids;

  if (!Array.isArray(scopeIssueIds)) return null;

  return scopeIssueIds.filter((value): value is string => typeof value === "string");
}

export async function getBacklogIssues(
  projectId: string,
  excludeSprintId?: string
): Promise<IssueWithDetails[]> {
  const supabase = await createClient();

  let query = supabase
    .from("issues")
    .select("*")
    .eq("project_id", projectId);

  if (excludeSprintId) {
    // Show all issues NOT in the selected sprint (including unassigned and other sprints)
    query = query.or(`sprint_id.is.null,sprint_id.neq.${excludeSprintId}`);
  } else {
    query = query.is("sprint_id", null);
  }

  const { data: issues } = await query.order("sort_order", { ascending: true });

  if (!issues || issues.length === 0) return [];

  return enrichIssues(issues, supabase);
}

export async function getSprintIssues(
  sprintId: string
): Promise<IssueWithDetails[]> {
  const supabase = await createClient();

  const completedSprintScopeIssueIds = await getCompletedSprintScopeIssueIds(
    supabase,
    sprintId,
  );

  let issues: Tables<"issues">[] | null = null;

  if (completedSprintScopeIssueIds && completedSprintScopeIssueIds.length > 0) {
    const { data } = await supabase
      .from("issues")
      .select("*")
      .in("id", completedSprintScopeIssueIds);
    issues = (data ?? []).sort((a, b) => a.sort_order - b.sort_order);
  } else {
    const { data } = await supabase
      .from("issues")
      .select("*")
      .eq("sprint_id", sprintId)
      .order("sort_order", { ascending: true });
    issues = data ?? [];
  }

  if (!issues || issues.length === 0) return [];

  return enrichIssues(issues, supabase);
}

export async function getProjectActiveSprintSummary(
  projectId: string
): Promise<ActiveSprintSummary | null> {
  const supabase = await createClient();

  const { data: sprint } = await supabase
    .from("sprints")
    .select("*")
    .eq("project_id", projectId)
    .eq("status", "active")
    .single();

  if (!sprint) return null;

  const { data: issues } = await supabase
    .from("issues")
    .select("status, story_points")
    .eq("sprint_id", sprint.id);

  const sprintIssues = issues ?? [];
  const doneIssues = sprintIssues.filter((issue) => issue.status === "done");

  return {
    sprint,
    totalIssues: sprintIssues.length,
    doneIssues: doneIssues.length,
    totalPoints: sprintIssues.reduce(
      (sum, issue) => sum + (issue.story_points ?? 0),
      0
    ),
    donePoints: doneIssues.reduce(
      (sum, issue) => sum + (issue.story_points ?? 0),
      0
    ),
  };
}
