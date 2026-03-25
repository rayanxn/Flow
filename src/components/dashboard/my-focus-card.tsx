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
                className={`flex items-center gap-3 py-3.5 px-4 bg-surface${onIssueClick ? " cursor-pointer hover:bg-surface-hover transition-colors" : ""}`}
              >
                {/* Priority dot */}
                <span
                  className="shrink-0 size-2 rounded-sm"
                  style={{ backgroundColor: priority.color }}
                  title={priority.label}
                />

                {/* Issue key */}
                <span className="shrink-0 w-14 text-[11px] font-mono text-text-muted">
                  {issue.issue_key}
                </span>

                {/* Title */}
                <span className="flex-1 truncate text-sm font-medium text-text">
                  {issue.title}
                </span>

                {/* Priority label */}
                <span
                  className="shrink-0 text-[11px] font-medium"
                  style={{ color: priority.color }}
                >
                  {priority.label}
                </span>

                {/* Due date */}
                {issue.due_date && (
                  <span className="shrink-0 text-[11px] text-text-muted">
                    {formatDate(issue.due_date)}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
