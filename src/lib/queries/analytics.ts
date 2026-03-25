import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/lib/types";
import {
  computeCycleTime,
  computeBurndownSeries,
  type BurndownPoint,
  bucketCycleTime,
  CYCLE_TIME_BUCKETS,
  type CycleTimeBucketLabel,
} from "@/lib/utils/analytics";
import { differenceInDays, startOfWeek, format, addWeeks } from "date-fns";

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

// --- Overview (time-range-scoped, sprint-independent) ---

export type OverviewKPIs = {
  issuesCompleted: number;
  avgCycleTime: number;
  throughput: number;
  pointsDelivered: number;
};

async function computeOverviewKPIsForRange(
  workspaceId: string,
  rangeStart: Date,
  rangeEnd: Date,
  days: number
): Promise<OverviewKPIs> {
  const supabase = await createClient();

  const { data: issues } = await supabase
    .from("issues")
    .select("id, status, story_points, created_at, completed_at")
    .eq("workspace_id", workspaceId)
    .eq("status", "done")
    .gte("completed_at", rangeStart.toISOString())
    .lte("completed_at", rangeEnd.toISOString());

  const list = issues ?? [];
  const issuesCompleted = list.length;
  const avgCycleTime = computeCycleTime(list);
  const weeks = Math.max(days / 7, 1);
  const throughput = Number((issuesCompleted / weeks).toFixed(1));
  const pointsDelivered = list.reduce(
    (sum, i) => sum + (i.story_points ?? 0),
    0
  );

  return { issuesCompleted, avgCycleTime, throughput, pointsDelivered };
}

export async function getOverviewKPIs(
  workspaceId: string,
  rangeStart: Date,
  rangeEnd: Date,
  prevRangeStart: Date,
  prevRangeEnd: Date,
  days: number
): Promise<{ current: OverviewKPIs; previous: OverviewKPIs | null }> {
  const [current, previous] = await Promise.all([
    computeOverviewKPIsForRange(workspaceId, rangeStart, rangeEnd, days),
    computeOverviewKPIsForRange(workspaceId, prevRangeStart, prevRangeEnd, days),
  ]);

  // Return null for previous if there was no data at all
  const hasPrev =
    previous.issuesCompleted > 0 || previous.pointsDelivered > 0;

  return { current, previous: hasPrev ? previous : null };
}

export type ThroughputPoint = {
  week: string;
  count: number;
};

export async function getThroughputSeries(
  workspaceId: string,
  rangeStart: Date,
  rangeEnd: Date
): Promise<ThroughputPoint[]> {
  const supabase = await createClient();

  const { data: issues } = await supabase
    .from("issues")
    .select("completed_at")
    .eq("workspace_id", workspaceId)
    .eq("status", "done")
    .gte("completed_at", rangeStart.toISOString())
    .lte("completed_at", rangeEnd.toISOString());

  const list = issues ?? [];

  // Bucket by week start (Monday)
  const weekCounts = new Map<string, number>();
  for (const issue of list) {
    const weekStart = startOfWeek(new Date(issue.completed_at!), {
      weekStartsOn: 1,
    });
    const key = format(weekStart, "yyyy-MM-dd");
    weekCounts.set(key, (weekCounts.get(key) ?? 0) + 1);
  }

  // Generate all weeks in range, zero-fill gaps
  const points: ThroughputPoint[] = [];
  let cursor = startOfWeek(rangeStart, { weekStartsOn: 1 });
  const end = rangeEnd;

  while (cursor <= end) {
    const key = format(cursor, "yyyy-MM-dd");
    points.push({
      week: format(cursor, "MMM d"),
      count: weekCounts.get(key) ?? 0,
    });
    cursor = addWeeks(cursor, 1);
  }

  return points;
}

export type CycleTimeBucket = {
  bucket: CycleTimeBucketLabel;
  count: number;
};

export async function getCycleTimeDistribution(
  workspaceId: string,
  rangeStart: Date,
  rangeEnd: Date
): Promise<CycleTimeBucket[]> {
  const supabase = await createClient();

  const { data: issues } = await supabase
    .from("issues")
    .select("created_at, completed_at")
    .eq("workspace_id", workspaceId)
    .eq("status", "done")
    .not("completed_at", "is", null)
    .gte("completed_at", rangeStart.toISOString())
    .lte("completed_at", rangeEnd.toISOString());

  const counts = new Map<CycleTimeBucketLabel, number>();
  for (const b of CYCLE_TIME_BUCKETS) counts.set(b, 0);

  for (const issue of issues ?? []) {
    const days = Math.max(
      0,
      differenceInDays(new Date(issue.completed_at!), new Date(issue.created_at))
    );
    const label = bucketCycleTime(days);
    counts.set(label, (counts.get(label) ?? 0) + 1);
  }

  return CYCLE_TIME_BUCKETS.map((bucket) => ({
    bucket,
    count: counts.get(bucket) ?? 0,
  }));
}

export type AssigneeCount = {
  name: string;
  avatarUrl: string | null;
  count: number;
};

export async function getAssigneeBreakdown(
  workspaceId: string,
  rangeStart: Date,
  rangeEnd: Date
): Promise<AssigneeCount[]> {
  const supabase = await createClient();

  const { data: issues } = await supabase
    .from("issues")
    .select("assignee_id")
    .eq("workspace_id", workspaceId)
    .eq("status", "done")
    .gte("completed_at", rangeStart.toISOString())
    .lte("completed_at", rangeEnd.toISOString());

  const list = issues ?? [];
  if (list.length === 0) return [];

  // Group by assignee
  const assigneeCounts = new Map<string | null, number>();
  for (const issue of list) {
    const key = issue.assignee_id;
    assigneeCounts.set(key, (assigneeCounts.get(key) ?? 0) + 1);
  }

  // Fetch profile details for non-null assignees
  const assigneeIds = [...assigneeCounts.keys()].filter(
    (id): id is string => id !== null
  );

  const profileMap = new Map<string, { name: string; avatarUrl: string | null }>();
  if (assigneeIds.length > 0) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name, email, avatar_url")
      .in("id", assigneeIds);

    for (const p of profiles ?? []) {
      profileMap.set(p.id, {
        name: p.full_name || p.email,
        avatarUrl: p.avatar_url,
      });
    }
  }

  const results: AssigneeCount[] = [];
  for (const [assigneeId, count] of assigneeCounts) {
    if (assigneeId === null) {
      results.push({ name: "Unassigned", avatarUrl: null, count });
    } else {
      const profile = profileMap.get(assigneeId);
      results.push({
        name: profile?.name ?? "Unknown",
        avatarUrl: profile?.avatarUrl ?? null,
        count,
      });
    }
  }

  return results.sort((a, b) => b.count - a.count);
}
