import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { SprintSnapshot } from "@/lib/queries/analytics";
import { formatDateFull } from "@/lib/utils/dates";

const STATUS_LABELS: Record<SprintSnapshot["status"], string> = {
  planning: "Planning",
  active: "Active",
  completed: "Completed",
};

export function SprintSnapshotCard({
  snapshot,
  workspaceSlug,
}: {
  snapshot: SprintSnapshot;
  workspaceSlug: string;
}) {
  const dateRange =
    snapshot.startDate && snapshot.endDate
      ? `${formatDateFull(snapshot.startDate)} - ${formatDateFull(snapshot.endDate)}`
      : null;

  return (
    <div className="rounded-xl border border-border/50 bg-white p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-border bg-surface px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-text-secondary">
              {snapshot.status === "completed" ? "Retrospective" : "Sprint Context"}
            </span>
            <span className="text-sm text-text-secondary">
              {STATUS_LABELS[snapshot.status]} sprint
            </span>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-semibold text-text">{snapshot.sprintName}</h2>
            <span className="text-lg text-text-secondary">·</span>
            <span className="text-sm text-text-secondary">{snapshot.projectName}</span>
          </div>

          <p className="mt-1 text-sm font-medium text-text">
            {snapshot.scopeIssues} issue{snapshot.scopeIssues !== 1 ? "s" : ""} in scope,{" "}
            {snapshot.issuesCompleted} completed
            {snapshot.rolledOverIssues > 0
              ? `, ${snapshot.rolledOverIssues} rolled over`
              : ""}
            .
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-text-secondary">
            <span>{STATUS_LABELS[snapshot.status]} sprint</span>
            {dateRange && <span>{dateRange}</span>}
            {snapshot.completedAt && (
              <span>Completed {formatDateFull(snapshot.completedAt)}</span>
            )}
          </div>

          {snapshot.goal && (
            <p className="mt-3 max-w-3xl text-sm text-text-secondary">
              Goal: {snapshot.goal}
            </p>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Button asChild size="sm" variant="secondary">
            <Link
              href={`/${workspaceSlug}/projects/${snapshot.projectId}/sprint-planning?sprint=${snapshot.sprintId}`}
            >
              Sprint Planning
            </Link>
          </Button>
          <Button asChild size="sm" variant="ghost">
            <Link href={`/${workspaceSlug}/projects/${snapshot.projectId}/board`}>
              Project Board
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
