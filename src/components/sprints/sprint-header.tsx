import { formatDateFull } from "@/lib/utils/dates";
import type { Tables } from "@/lib/types";

interface SprintHeaderProps {
  sprint: Tables<"sprints">;
  totalIssues: number;
  doneIssues: number;
  totalPoints: number;
  donePoints: number;
}

export function SprintHeader({
  sprint,
  totalIssues,
  doneIssues,
  totalPoints,
  donePoints,
}: SprintHeaderProps) {
  const completionPercent =
    totalIssues > 0 ? Math.round((doneIssues / totalIssues) * 100) : 0;

  return (
    <div className="px-6 py-3 border-b border-border bg-surface-hover/50">
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-text">{sprint.name}</span>

        {sprint.start_date && sprint.end_date && (
          <span className="text-xs text-text-muted">
            {formatDateFull(sprint.start_date)} –{" "}
            {formatDateFull(sprint.end_date)}
          </span>
        )}

        <span className="text-xs text-text-muted">
          {completionPercent}% complete
        </span>

        <span className="text-xs text-text-muted tabular-nums">
          {donePoints} / {totalPoints} pts
        </span>
      </div>

      {/* Progress bar */}
      <div className="mt-2 h-1 w-full max-w-xs rounded-full bg-border overflow-hidden">
        <div
          className="h-full rounded-full bg-success transition-all"
          style={{ width: `${completionPercent}%` }}
        />
      </div>

      {sprint.goal && (
        <p className="mt-1.5 text-xs text-text-muted truncate">
          Goal: {sprint.goal}
        </p>
      )}
    </div>
  );
}
