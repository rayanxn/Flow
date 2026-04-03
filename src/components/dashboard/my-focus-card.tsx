import Link from "next/link";
import type { IssueWithDetails } from "@/lib/queries/issues";
import type { IssuePriority } from "@/lib/types";
import { PRIORITY_CONFIG } from "@/lib/utils/priorities";
import { formatDate } from "@/lib/utils/dates";

interface MyFocusCardProps {
  issues: IssueWithDetails[];
  workspaceSlug: string;
  onIssueClick?: (id: string) => void;
}

export function MyFocusCard({ issues, workspaceSlug, onIssueClick }: MyFocusCardProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-text">My Top Issues</h2>
        <Link
          href={`/${workspaceSlug}/my-issues`}
          className="text-[13px] font-medium text-text-secondary hover:text-text transition-colors"
        >
          View all &rarr;
        </Link>
      </div>

      {issues.length === 0 ? (
        <div className="rounded-[10px] border border-border bg-surface p-8 text-center">
          <p className="text-sm text-text-muted">
            All clear — no issues assigned to you.
          </p>
        </div>
      ) : (
        <div className="rounded-[10px] overflow-clip flex flex-col gap-px bg-border">
          {issues.map((issue) => {
            const priority = PRIORITY_CONFIG[issue.priority as IssuePriority];
            return (
              <div
                key={issue.id}
                role={onIssueClick ? "button" : undefined}
                tabIndex={onIssueClick ? 0 : undefined}
                onClick={() => onIssueClick?.(issue.id)}
                onKeyDown={(e) => {
                  if (onIssueClick && (e.key === "Enter" || e.key === " ")) {
                    e.preventDefault();
                    onIssueClick(issue.id);
                  }
                }}
                className={`flex flex-col items-start gap-2.5 bg-surface px-4 py-3.5 sm:flex-row sm:items-center sm:gap-3${onIssueClick ? " cursor-pointer hover:bg-surface-hover transition-colors" : ""}`}
              >
                <div className="flex w-full items-center gap-3">
                  <span
                    className="shrink-0 size-2 rounded-sm"
                    style={{ backgroundColor: priority.color }}
                    title={priority.label}
                  />
                  <span className="shrink-0 text-[11px] font-mono text-text-muted sm:w-14">
                    {issue.issue_key}
                  </span>
                  <span className="flex-1 truncate text-sm font-medium text-text">
                    {issue.title}
                  </span>
                </div>

                <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:shrink-0 sm:justify-end">
                  <span
                    className="inline-flex items-center rounded-full px-2 py-1 text-[10px] font-semibold sm:bg-transparent sm:px-0 sm:py-0 sm:text-[11px]"
                    style={{
                      color: priority.color,
                      backgroundColor: `${priority.color}14`,
                    }}
                  >
                    {priority.label}
                  </span>

                  {issue.due_date && (
                    <span className="inline-flex items-center rounded-full bg-background px-2 py-1 text-[10px] text-text-muted sm:bg-transparent sm:px-0 sm:py-0 sm:text-[11px]">
                      {formatDate(issue.due_date)}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
