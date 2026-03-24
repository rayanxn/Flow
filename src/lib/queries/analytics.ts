import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/lib/types";
import { computeCycleTime, computeBurndownSeries, type BurndownPoint } from "@/lib/utils/analytics";

export async function getWorkspaceSprints(
  workspaceId: string
): Promise<Tables<"sprints">[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("sprints")
    .select("*")
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: false });
  return data ?? [];
}

export type SprintKPIs = {
  issuesCompleted: number;
  totalIssues: number;
  avgCycleTime: number;
  velocity: number;
  completionRate: number;
};

export async function getSprintAnalytics(
  sprintId: string
): Promise<SprintKPIs> {
  const supabase = await createClient();

  const { data: issues } = await supabase
    .from("issues")
    .select("id, status, story_points, created_at, completed_at")
    .eq("sprint_id", sprintId);

  if (!issues || issues.length === 0) {
    return {
      issuesCompleted: 0,
      totalIssues: 0,
      avgCycleTime: 0,
      velocity: 0,
      completionRate: 0,
    };
  }

  const doneIssues = issues.filter((i) => i.status === "done");
  const issuesCompleted = doneIssues.length;
  const totalIssues = issues.length;
  const avgCycleTime = computeCycleTime(issues);
  const velocity = doneIssues.reduce(
    (sum, i) => sum + (i.story_points ?? 0),
    0
  );
  const completionRate =
    totalIssues > 0
      ? Number(((issuesCompleted / totalIssues) * 100).toFixed(0))
      : 0;

  return {
    issuesCompleted,
    totalIssues,
    avgCycleTime,
    velocity,
    completionRate,
  };
}

export async function getPreviousSprintKPIs(
  currentSprint: Tables<"sprints">
): Promise<SprintKPIs | null> {
  const supabase = await createClient();

  const { data: prevSprints } = await supabase
    .from("sprints")
    .select("id")
    .eq("project_id", currentSprint.project_id)
    .lt("created_at", currentSprint.created_at)
    .order("created_at", { ascending: false })
    .limit(1);

  if (!prevSprints || prevSprints.length === 0) return null;

  return getSprintAnalytics(prevSprints[0].id);
}

export async function getSprintBurndown(
  sprintId: string,
  sprint: Pick<Tables<"sprints">, "start_date" | "end_date" | "workspace_id">
): Promise<BurndownPoint[]> {
  const supabase = await createClient();

  // Get total issues in sprint
  const { count: totalIssues } = await supabase
    .from("issues")
    .select("id", { count: "exact", head: true })
    .eq("sprint_id", sprintId);

  if (!totalIssues || totalIssues === 0) return [];

  // Get all status-change activities for issues in this sprint
  const { data: sprintIssues } = await supabase
    .from("issues")
    .select("id")
    .eq("sprint_id", sprintId);

  if (!sprintIssues || sprintIssues.length === 0) return [];

  const issueIds = sprintIssues.map((i) => i.id);

  const { data: activities } = await supabase
    .from("activities")
    .select("created_at, metadata")
    .eq("entity_type", "issue")
    .eq("action", "updated")
    .eq("workspace_id", sprint.workspace_id)
    .in("entity_id", issueIds)
    .order("created_at", { ascending: true });

  return computeBurndownSeries(activities ?? [], sprint, totalIssues);
}

export type LabelCount = {
  name: string;
  count: number;
  color: string;
};

export async function getIssuesByLabel(
  workspaceId: string,
  sprintId?: string
): Promise<LabelCount[]> {
  const supabase = await createClient();

  // Get issues (optionally filtered by sprint)
  let issueQuery = supabase
    .from("issues")
    .select("id")
    .eq("workspace_id", workspaceId);

  if (sprintId) {
    issueQuery = issueQuery.eq("sprint_id", sprintId);
  }

  const { data: issues } = await issueQuery;
  if (!issues || issues.length === 0) return [];

  const issueIds = issues.map((i) => i.id);

  // Get issue_labels joins
  const { data: issueLabels } = await supabase
    .from("issue_labels")
    .select("label_id")
    .in("issue_id", issueIds);

  if (!issueLabels || issueLabels.length === 0) return [];

  // Count per label
  const labelCounts = new Map<string, number>();
  for (const il of issueLabels) {
    labelCounts.set(il.label_id, (labelCounts.get(il.label_id) ?? 0) + 1);
  }

  // Fetch label details
  const labelIds = [...labelCounts.keys()];
  const { data: labels } = await supabase
    .from("labels")
    .select("id, name, color")
    .in("id", labelIds);

  return (labels ?? [])
    .map((label) => ({
      name: label.name,
      count: labelCounts.get(label.id) ?? 0,
      color: label.color,
    }))
    .sort((a, b) => b.count - a.count);
}

export type VelocityPoint = {
  name: string;
  points: number;
};

export async function getTeamVelocity(
  workspaceId: string,
  count: number = 4
): Promise<VelocityPoint[]> {
  const supabase = await createClient();

  // Get last N completed or active sprints
  const { data: sprints } = await supabase
    .from("sprints")
    .select("id, name")
    .eq("workspace_id", workspaceId)
    .in("status", ["completed", "active"])
    .order("created_at", { ascending: false })
    .limit(count);

  if (!sprints || sprints.length === 0) return [];

  // For each sprint, sum story_points of done issues
  const results: VelocityPoint[] = [];
  for (const sprint of sprints.reverse()) {
    const { data: issues } = await supabase
      .from("issues")
      .select("story_points")
      .eq("sprint_id", sprint.id)
      .eq("status", "done");

    const points = (issues ?? []).reduce(
      (sum, i) => sum + (i.story_points ?? 0),
      0
    );

    // Use short sprint name (e.g. "S24" from "Sprint 24")
    const shortName = sprint.name.replace(/sprint\s*/i, "S");
    results.push({ name: shortName, points });
  }

  return results;
}
