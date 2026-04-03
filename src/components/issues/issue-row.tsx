import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils/cn";
import { PRIORITY_CONFIG } from "@/lib/utils/priorities";
import { formatDate } from "@/lib/utils/dates";
import type { IssuePriority } from "@/lib/types";

interface IssueRowProps {
  id: string;
  issueKey: string;
  title: string;
  project?: { name: string; color: string } | null;
  priority: number;
  dueDate?: string | null;
  status: string;
  showProject?: boolean;
  onClick?: (id: string) => void;
}

export function IssueRow({
  id,
  issueKey,
  title,
  project,
  priority,
  dueDate,
  status,
  showProject = true,
  onClick,
}: IssueRowProps) {
  const priorityConfig = PRIORITY_CONFIG[priority as IssuePriority];
  const isDone = status === "done";

  const dueDateDisplay = isDone
    ? "Done"
    : dueDate
      ? formatDate(dueDate)
      : null;

  const isOverdue =
    !isDone &&
    dueDate &&
    new Date(dueDate) < new Date(new Date().toDateString());

  return (
    <>
      <div
        onClick={() => onClick?.(id)}
        className="cursor-pointer rounded-xl border border-border bg-surface px-4 py-3.5 shadow-sm transition-colors hover:bg-surface-hover/70 sm:hidden"
      >
        <div className="flex items-start gap-3">
          <Checkbox className="mt-0.5 shrink-0" onClick={(e) => e.stopPropagation()} />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-mono text-text-muted">
                {issueKey}
              </span>
              {showProject && project && (
                <span className="inline-flex items-center gap-1 rounded-full bg-surface-hover px-2 py-1 text-[10px] font-medium text-text-secondary">
                  <span
                    className="size-1.5 rounded-full shrink-0"
                    style={{ backgroundColor: project.color }}
                  />
                  <span className="max-w-[140px] truncate">{project.name}</span>
                </span>
              )}
            </div>

            <p className="mt-2 text-sm font-medium leading-5 text-text">
              {title}
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span
                className="inline-flex items-center rounded-full px-2 py-1 text-[10px] font-semibold"
                style={{
                  color: priorityConfig.color,
                  backgroundColor: priorityConfig.bgColor,
                }}
              >
                {priorityConfig.label}
              </span>
              {dueDateDisplay && (
                <span
                  className={cn(
                    "inline-flex items-center rounded-full px-2 py-1 text-[10px] font-medium",
                    isOverdue
                      ? "bg-danger-light text-danger"
                      : "bg-background text-text-secondary",
                  )}
                >
                  {isDone ? dueDateDisplay : `Due ${dueDateDisplay}`}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div
        onClick={() => onClick?.(id)}
        className="group hidden cursor-pointer items-center gap-3 border-b border-border px-6 py-2.5 transition-colors last:border-b-0 hover:bg-surface-hover/50 sm:flex"
      >
        {/* Checkbox */}
        <Checkbox className="shrink-0" onClick={(e) => e.stopPropagation()} />

        {/* Issue key */}
        <span className="text-xs font-mono text-text-muted w-[72px] shrink-0">
          {issueKey}
        </span>

        {/* Title */}
        <span className="text-sm text-text flex-1 truncate">{title}</span>

        {/* Project */}
        {showProject && project && (
          <div className="flex items-center gap-1.5 shrink-0 w-[140px]">
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: project.color }}
            />
            <span className="text-xs text-text-secondary truncate">
              {project.name}
            </span>
          </div>
        )}

        {/* Priority */}
        <span
          className="text-sm font-semibold w-[72px] text-center shrink-0"
          style={{ color: priorityConfig.color }}
        >
          {priorityConfig.label}
        </span>

        {/* Due date */}
        <span
          className={`text-xs w-[72px] text-right shrink-0 ${
            isOverdue ? "text-danger font-medium" : "text-text-muted"
          }`}
        >
          {dueDateDisplay}
        </span>
      </div>
    </>
  );
}
