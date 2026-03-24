"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils/cn";
import { PRIORITY_CONFIG } from "@/lib/utils/priorities";
import { formatDate } from "@/lib/utils/dates";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { IssuePriority } from "@/lib/types";

export interface BoardCardProps {
  id: string;
  issueKey: string;
  title: string;
  priority: number;
  dueDate: string | null;
  status: string;
  assignee: {
    full_name: string | null;
    avatar_url: string | null;
  } | null;
  labels: { id: string; name: string; color: string }[];
  projectName?: string;
  projectColor?: string;
  isDragOverlay?: boolean;
}

function getInitials(name: string | null): string {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function BoardCard({
  id,
  issueKey,
  title,
  priority,
  dueDate,
  status,
  assignee,
  labels,
  projectName,
  projectColor,
  isDragOverlay = false,
}: BoardCardProps) {
  const sortable = useSortable({ id, disabled: isDragOverlay });
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    isDragOverlay
      ? { attributes: {}, listeners: {}, setNodeRef: undefined, transform: null, transition: undefined, isDragging: false }
      : sortable;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const priorityConfig = PRIORITY_CONFIG[priority as IssuePriority];
  const isDone = status === "done";
  const isOverdue =
    !isDone && dueDate && new Date(dueDate) < new Date(new Date().toDateString());

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      aria-label={`Issue ${issueKey}: ${title}`}
      aria-roledescription="sortable"
      className={cn(
        "rounded-lg border border-border bg-surface p-3 shadow-sm cursor-grab active:cursor-grabbing transition-shadow hover:shadow-md",
        isDragging && "opacity-30",
        isDragOverlay && "shadow-lg ring-2 ring-primary/10 rotate-[2deg]",
      )}
    >
      {/* Header: issue key + priority dot */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono text-text-muted">{issueKey}</span>
        <span
          className="w-2.5 h-2.5 rounded-full shrink-0"
          style={{ backgroundColor: priorityConfig.color }}
          title={priorityConfig.label}
        />
      </div>

      {/* Title */}
      <p className="text-sm font-medium text-text mt-1.5 line-clamp-2 leading-snug">
        {title}
      </p>

      {/* Labels */}
      {labels.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {labels.map((label) => (
            <span
              key={label.id}
              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-surface-hover border border-border text-text-secondary"
            >
              <span
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{ backgroundColor: label.color }}
              />
              {label.name}
            </span>
          ))}
        </div>
      )}

      {/* Project name (for My Issues board) */}
      {projectName && (
        <div className="flex items-center gap-1.5 mt-2">
          <span
            className="w-2 h-2 rounded-full shrink-0"
            style={{ backgroundColor: projectColor }}
          />
          <span className="text-[10px] text-text-muted truncate">
            {projectName}
          </span>
        </div>
      )}

      {/* Footer: due date + assignee */}
      {(dueDate || assignee) && (
        <div className="flex items-center justify-between mt-2.5">
          {dueDate ? (
            <span
              className={cn(
                "text-xs",
                isDone
                  ? "text-text-muted"
                  : isOverdue
                    ? "text-danger font-medium"
                    : "text-text-muted",
              )}
            >
              {isDone ? "Done" : formatDate(dueDate)}
            </span>
          ) : (
            <span />
          )}
          {assignee && (
            <Avatar size="sm" className="h-6 w-6 text-[10px]">
              {assignee.avatar_url && (
                <AvatarImage src={assignee.avatar_url} alt={assignee.full_name ?? ""} />
              )}
              <AvatarFallback>{getInitials(assignee.full_name)}</AvatarFallback>
            </Avatar>
          )}
        </div>
      )}
    </div>
  );
}
