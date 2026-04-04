import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatDateFull } from "@/lib/utils/dates";
import type { Tables } from "@/lib/types";

interface SprintHeaderProps {
  sprint: Tables<"sprints">;
  totalIssues: number;
  doneIssues: number;
  totalPoints: number;
  donePoints: number;
  workspaceSlug: string;
  projectId: string;
}

export function SprintHeader({
  sprint,
  totalIssues,
  doneIssues,
  totalPoints,
  donePoints,
  workspaceSlug,
  projectId,
}: SprintHeaderProps) {
  const completionPercent =
    totalIssues > 0 ? Math.round((doneIssues / totalIssues) * 100) : 0;

  return (
    <div className="border-b border-border bg-surface-hover/50 px-6 py-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-success/20 bg-success/5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-success">
              Active Sprint
            </span>
            <span className="text-sm font-semibold text-text">{sprint.name}</span>
            <span className="text-xs text-text-muted">{completionPercent}% complete</span>
            <span className="text-xs text-text-muted tabular-nums">
              {donePoints} / {totalPoints} pts
            </span>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-text-muted">
            {sprint.start_date && sprint.end_date && (
              <span>
                {formatDateFull(sprint.start_date)} - {formatDateFull(sprint.end_date)}
              </span>
            )}
            <span>
              {doneIssues} of {totalIssues} issue{totalIssues !== 1 ? "s" : ""} done
            </span>
          </div>

          {sprint.goal && (
            <p className="mt-2 max-w-3xl text-sm text-text-secondary">
              Goal: {sprint.goal}
            </p>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Button asChild size="sm" variant="secondary">
            <Link
              href={`/${workspaceSlug}/projects/${projectId}/sprint-planning?sprint=${sprint.id}`}
            >
              Sprint Planning
            </Link>
          </Button>
          <Button asChild size="sm" variant="ghost">
            <Link href={`/${workspaceSlug}/analytics?tab=sprints&sprint=${sprint.id}`}>
              Analytics
            </Link>
          </Button>
        </div>
      </div>

      <div className="mt-3 h-1.5 w-full max-w-xl overflow-hidden rounded-full bg-border">
        <div
          className="h-full rounded-full bg-success transition-all"
          style={{ width: `${completionPercent}%` }}
        />
      </div>
    </div>
  );
}
