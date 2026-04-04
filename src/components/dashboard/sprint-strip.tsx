"use client";

import Link from "next/link";
import { differenceInDays, format } from "date-fns";
import { Button } from "@/components/ui/button";
import { ProgressRing } from "@/components/ui/progress-ring";
import type { Tables, IssueStatus } from "@/lib/types";

interface SprintStripProps {
  sprint: Tables<"sprints">;
  issueCounts: Record<IssueStatus, number>;
  totalIssues: number;
  workspaceSlug: string;
  projectName: string | null;
}

const STATUS_BAR_ORDER: IssueStatus[] = [
  "done",
  "in_review",
  "in_progress",
  "todo",
];

const NEUTRAL_STATUS_COLORS: Record<IssueStatus, string> = {
  done: "var(--color-primary)",
  in_review: "var(--color-text-secondary)",
  in_progress: "var(--color-text-muted)",
  todo: "var(--color-border)",
};

const STATUS_LABELS: Record<IssueStatus, string> = {
  done: "Done",
  in_review: "Review",
  in_progress: "In Progress",
  todo: "Todo",
};

export function SprintStrip({
  sprint,
  issueCounts,
  totalIssues,
  workspaceSlug,
  projectName,
}: SprintStripProps) {
  const donePercent =
    totalIssues > 0 ? Math.round((issueCounts.done / totalIssues) * 100) : 0;

  const daysRemaining = sprint.end_date
    ? Math.max(0, differenceInDays(new Date(sprint.end_date), new Date()))
    : null;

  const dateRange =
    sprint.start_date && sprint.end_date
      ? `${format(new Date(sprint.start_date), "MMM d")} – ${format(new Date(sprint.end_date), "MMM d")}`
      : null;

  return (
    <div className="flex flex-col gap-5 rounded-xl border border-border bg-surface px-6 py-5 lg:flex-row lg:items-center">
      {/* Progress ring */}
      <div className="relative shrink-0">
        <ProgressRing value={donePercent} size={52} strokeWidth={5}>
          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dominantBaseline="central"
            className="fill-text text-xs font-semibold"
            transform={`rotate(90, 26, 26)`}
          >
            {donePercent}%
          </text>
        </ProgressRing>
      </div>

      {/* Sprint info */}
      <div className="min-w-0 shrink-0">
        {projectName && (
          <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-text-muted">
            {projectName}
          </p>
        )}
        <p className="text-base font-semibold text-text">{sprint.name}</p>
        <p className="text-[13px] text-text-secondary">
          {daysRemaining !== null && (
            <span>
              {daysRemaining} day{daysRemaining !== 1 ? "s" : ""} remaining
            </span>
          )}
          {daysRemaining !== null && dateRange && <span> · </span>}
          {dateRange && <span>{dateRange}</span>}
        </p>
        {sprint.goal && (
          <p className="mt-1 max-w-xl truncate text-[13px] text-text-secondary">
            Goal: {sprint.goal}
          </p>
        )}
      </div>

      {/* Divider */}
      <div className="hidden h-9 w-px shrink-0 bg-border lg:block" />

      {/* Status bar — fills remaining space */}
      <div className="hidden flex-1 flex-col gap-2.5 sm:flex">
        <p className="text-[11px] font-medium tracking-[0.04em] text-text-secondary uppercase">
          Issues by Status
        </p>
        {/* Bar */}
        <div className="flex h-2 w-full overflow-hidden rounded-sm">
          {STATUS_BAR_ORDER.map((status) => {
            const count = issueCounts[status];
            if (count === 0) return null;
            return (
              <div
                key={status}
                className="h-full transition-all duration-300"
                style={{
                  flexGrow: count,
                  backgroundColor: NEUTRAL_STATUS_COLORS[status],
                }}
              />
            );
          })}
        </div>
        {/* Legend */}
        <div className="flex gap-4 text-[11px] text-text-secondary">
          {STATUS_BAR_ORDER.map((status) => (
            <span key={status} className="flex items-center gap-1.5">
              <span
                className="inline-block size-1.5 rounded-[3px]"
                style={{ backgroundColor: NEUTRAL_STATUS_COLORS[status] }}
              />
              {STATUS_LABELS[status]} {issueCounts[status]}
            </span>
          ))}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <Button asChild size="sm" variant="secondary">
          <Link
            href={`/${workspaceSlug}/projects/${sprint.project_id}/sprint-planning?sprint=${sprint.id}`}
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
  );
}
