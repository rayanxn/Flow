import type { IssueWithDetails } from "@/lib/queries/issues";
import { STATUS_CONFIG } from "@/lib/utils/statuses";
import { PRIORITY_CONFIG } from "@/lib/utils/priorities";
import { formatDate } from "@/lib/utils/dates";
import type { IssueStatus, IssuePriority } from "@/lib/types";

export function ViewIssueTable({ issues }: { issues: IssueWithDetails[] }) {
  if (issues.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <p className="text-sm text-text-muted">No issues match these filters.</p>
      </div>
    );
  }

  return (
    <div className="border border-border/50 rounded-xl overflow-hidden bg-white">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border/50">
            <th className="text-left text-[10px] font-medium uppercase tracking-widest text-text-muted py-3 px-4 font-mono">
              ID
            </th>
            <th className="text-left text-[10px] font-medium uppercase tracking-widest text-text-muted py-3 px-2 font-mono">
              Status
            </th>
            <th className="text-left text-[10px] font-medium uppercase tracking-widest text-text-muted py-3 px-4 font-mono">
              Title
            </th>
            <th className="text-left text-[10px] font-medium uppercase tracking-widest text-text-muted py-3 px-4 font-mono">
              Project
            </th>
            <th className="text-left text-[10px] font-medium uppercase tracking-widest text-text-muted py-3 px-4 font-mono">
              Assignee
            </th>
            <th className="text-left text-[10px] font-medium uppercase tracking-widest text-text-muted py-3 px-4 font-mono">
              Priority
            </th>
            <th className="text-left text-[10px] font-medium uppercase tracking-widest text-text-muted py-3 px-4 font-mono">
              Due
            </th>
          </tr>
        </thead>
        <tbody>
          {issues.map((issue) => {
            const status = STATUS_CONFIG[issue.status as IssueStatus];
            const priority = PRIORITY_CONFIG[issue.priority as IssuePriority];
            return (
              <tr
                key={issue.id}
                className="border-b border-border/30 last:border-b-0 hover:bg-surface-hover/50 transition-colors"
              >
                <td className="py-3 px-4 text-xs font-mono text-text-muted whitespace-nowrap">
                  {issue.issue_key}
                </td>
                <td className="py-3 px-2">
                  <span
                    className="inline-block size-2.5 rounded-full"
                    style={{ backgroundColor: status.color }}
                    title={status.label}
                  />
                </td>
                <td className="py-3 px-4 text-sm text-text font-medium">
                  {issue.title}
                </td>
                <td className="py-3 px-4 whitespace-nowrap">
                  {issue.project && (
                    <div className="flex items-center gap-1.5">
                      <span
                        className="inline-block size-2 rounded-full"
                        style={{ backgroundColor: issue.project.color }}
                      />
                      <span className="text-xs text-text-secondary">
                        {issue.project.name}
                      </span>
                    </div>
                  )}
                </td>
                <td className="py-3 px-4 whitespace-nowrap">
                  {issue.assignee ? (
                    <div className="flex items-center gap-1.5">
                      <div className="size-5 rounded-full bg-muted flex items-center justify-center shrink-0">
                        <span className="text-[8px] font-medium text-text-secondary">
                          {(issue.assignee.full_name ?? issue.assignee.email)
                            .charAt(0)
                            .toUpperCase()}
                        </span>
                      </div>
                      <span className="text-xs text-text-secondary">
                        {issue.assignee.full_name ?? issue.assignee.email}
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs text-text-muted">Unassigned</span>
                  )}
                </td>
                <td className="py-3 px-4">
                  <span
                    className="inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold"
                    style={{
                      backgroundColor: priority.bgColor,
                      color: priority.color,
                    }}
                  >
                    {priority.label}
                  </span>
                </td>
                <td className="py-3 px-4 text-xs text-text-muted whitespace-nowrap">
                  {issue.due_date ? formatDate(issue.due_date) : "—"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
