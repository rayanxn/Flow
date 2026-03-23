import { Checkbox } from "@/components/ui/checkbox";
import { PRIORITY_CONFIG } from "@/lib/utils/priorities";
import { formatDate } from "@/lib/utils/dates";
import type { IssuePriority } from "@/lib/types";

interface IssueRowProps {
  issueKey: string;
  title: string;
  project?: { name: string; color: string } | null;
  priority: number;
  dueDate?: string | null;
  status: string;
  showProject?: boolean;
}

export function IssueRow({
  issueKey,
  title,
  project,
  priority,
  dueDate,
  status,
  showProject = true,
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
    <div className="flex items-center gap-3 px-6 py-2.5 hover:bg-surface-hover transition-colors group border-b border-border last:border-b-0">
      {/* Checkbox */}
      <Checkbox className="shrink-0" />

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
        className="text-xs font-semibold w-8 text-center shrink-0"
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
  );
}
