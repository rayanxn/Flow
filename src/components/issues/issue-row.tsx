import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils/cn";
import { PRIORITY_CONFIG } from "@/lib/utils/priorities";
import { formatDate } from "@/lib/utils/dates";
import type { IssuePriority } from "@/lib/types";
import { ChevronDown, ChevronRight } from "lucide-react";

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
  depth?: number;
  hasChildren?: boolean;
  expanded?: boolean;
  onToggleExpand?: (id: string) => void;
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
  depth = 0,
  hasChildren = false,
  expanded = false,
  onToggleExpand,
}: IssueRowProps) {
  const priorityConfig = PRIORITY_CONFIG[priority as IssuePriority];
  const isDone = status === "done";
  const indent = depth * 16;

  const dueDateDisplay = isDone
    ? "Done"
    : dueDate
      ? formatDate(dueDate)
      : null;

  const isOverdue =
    !isDone &&
    dueDate &&
    new Date(dueDate) < new Date(new Date().toDateString());

  const ToggleIcon = expanded ? ChevronDown : ChevronRight;

  return (
    <>
      <div
        onClick={() => onClick?.(id)}
        className="cursor-pointer rounded-xl border border-border bg-surface px-4 py-3.5 shadow-sm transition-colors hover:bg-surface-hover/70 sm:hidden"
      >
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex items-center gap-1.5">
            {hasChildren ? (
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onToggleExpand?.(id);
                }}
                className="rounded p-0.5 text-text-muted transition-colors hover:bg-surface-hover hover:text-text"
                aria-label={expanded ? "Collapse sub-issues" : "Expand sub-issues"}
              >
                <ToggleIcon className="size-3.5" />
              </button>
            ) : (
              <span className="inline-block size-4 shrink-0" />
            )}
            <Checkbox className="shrink-0" onClick={(e) => e.stopPropagation()} />
          </div>
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

            <div className="mt-2 flex items-start gap-2" style={{ paddingLeft: indent }}>
              {depth > 0 && <span className="mt-1 h-4 w-px shrink-0 bg-border" />}
              <p className="text-sm font-medium leading-5 text-text">
                {title}
              </p>
            </div>

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
        <div className="flex items-center gap-2 shrink-0">
          {hasChildren ? (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onToggleExpand?.(id);
              }}
              className="rounded p-0.5 text-text-muted transition-colors hover:bg-surface-hover hover:text-text"
              aria-label={expanded ? "Collapse sub-issues" : "Expand sub-issues"}
            >
              <ToggleIcon className="size-3.5" />
            </button>
          ) : (
            <span className="inline-block size-4 shrink-0" />
          )}
          <Checkbox className="shrink-0" onClick={(e) => e.stopPropagation()} />
        </div>

        {/* Issue key */}
        <span className="text-xs font-mono text-text-muted w-[72px] shrink-0">
          {issueKey}
        </span>

        {/* Title */}
        <div className="flex min-w-0 flex-1 items-center gap-2" style={{ paddingLeft: indent }}>
          {depth > 0 && <span className="h-5 w-px shrink-0 bg-border" />}
          <span className="text-sm text-text truncate">{title}</span>
        </div>

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
