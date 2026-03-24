import type { Tables } from "@/lib/types";
import { differenceInDays, startOfDay, addDays, format } from "date-fns";

export function computeCycleTime(
  issues: Pick<Tables<"issues">, "created_at" | "completed_at" | "status">[]
): number {
  const doneIssues = issues.filter(
    (i) => i.status === "done" && i.completed_at
  );
  if (doneIssues.length === 0) return 0;

  const totalDays = doneIssues.reduce((sum, issue) => {
    const created = new Date(issue.created_at);
    const completed = new Date(issue.completed_at!);
    return sum + Math.max(0, differenceInDays(completed, created));
  }, 0);

  return Number((totalDays / doneIssues.length).toFixed(1));
}

export type BurndownPoint = {
  date: string;
  actual: number;
  ideal: number;
};

export function computeBurndownSeries(
  activities: Pick<Tables<"activities">, "created_at" | "metadata">[],
  sprint: Pick<Tables<"sprints">, "start_date" | "end_date">,
  totalIssues: number
): BurndownPoint[] {
  if (!sprint.start_date || !sprint.end_date) return [];

  const startDate = startOfDay(new Date(sprint.start_date));
  const endDate = startOfDay(new Date(sprint.end_date));
  const totalDays = differenceInDays(endDate, startDate);

  if (totalDays <= 0) return [];

  // Count completions per day from activities
  const completionsByDay = new Map<string, number>();

  for (const activity of activities) {
    const metadata = activity.metadata as Record<string, unknown> | null;
    const changes = metadata?.changes as Record<string, unknown> | undefined;
    if (changes?.status === "done") {
      const dayKey = format(new Date(activity.created_at), "yyyy-MM-dd");
      completionsByDay.set(dayKey, (completionsByDay.get(dayKey) ?? 0) + 1);
    }
  }

  const points: BurndownPoint[] = [];
  let cumulativeCompleted = 0;

  for (let day = 0; day <= totalDays; day++) {
    const currentDate = addDays(startDate, day);
    const dayKey = format(currentDate, "yyyy-MM-dd");
    const today = startOfDay(new Date());

    // Stop at today if sprint is still ongoing
    if (currentDate > today) break;

    cumulativeCompleted += completionsByDay.get(dayKey) ?? 0;

    points.push({
      date: format(currentDate, "MMM d"),
      actual: totalIssues - cumulativeCompleted,
      ideal: Number(
        (totalIssues - (totalIssues * day) / totalDays).toFixed(1)
      ),
    });
  }

  return points;
}

export function formatDelta(
  current: number,
  previous: number,
  suffix: string = ""
): { text: string; isPositive: boolean } | null {
  if (previous === 0) return null;

  const diff = current - previous;
  if (diff === 0) return null;

  // For cycle time, lower is better (negative diff is positive)
  // For everything else, higher is better
  const isPositive =
    suffix === "d" ? diff < 0 : diff > 0;

  const sign = diff > 0 ? "+" : "";
  const text = `${sign}${Number(diff.toFixed(1))}${suffix}${suffix === "d" ? "" : " from last"}`;

  return { text, isPositive };
}
