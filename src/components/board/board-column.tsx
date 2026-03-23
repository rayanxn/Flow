"use client";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import { STATUS_CONFIG } from "@/lib/utils/statuses";
import { BoardCard } from "./board-card";
import { BoardQuickAdd } from "./board-quick-add";
import type { IssueStatus } from "@/lib/types";
import type { IssueWithDetails } from "@/lib/queries/issues";

interface BoardColumnProps {
  status: IssueStatus;
  issues: IssueWithDetails[];
  showProject?: boolean;
  projectId: string;
  quickAddActive: boolean;
  onQuickAddOpen: () => void;
  onQuickAddClose: () => void;
  onQuickAddCreated: () => void;
}

export function BoardColumn({
  status,
  issues,
  showProject = false,
  projectId,
  quickAddActive,
  onQuickAddOpen,
  onQuickAddClose,
  onQuickAddCreated,
}: BoardColumnProps) {
  const { setNodeRef } = useDroppable({ id: status });
  const config = STATUS_CONFIG[status];
  const issueIds = issues.map((i) => i.id);

  // Sort order for new quick-add issue: after the last issue
  const lastSortOrder =
    issues.length > 0 ? issues[issues.length - 1].sort_order + 1 : 1;

  return (
    <div className="flex flex-col min-w-[280px] w-[280px] shrink-0">
      {/* Column header */}
      <div className="flex items-center gap-2 px-3 py-2.5 mb-1">
        <span
          className="w-2 h-2 rounded-full shrink-0"
          style={{ backgroundColor: config.color }}
        />
        <span className="text-sm font-medium text-text uppercase tracking-wider">
          {config.label}
        </span>
        <span className="text-xs text-text-muted tabular-nums">
          {issues.length}
        </span>
        <button
          type="button"
          onClick={onQuickAddOpen}
          className="ml-auto p-0.5 text-text-muted hover:text-text-secondary transition-colors rounded hover:bg-surface-hover"
          title={`Add issue to ${config.label}`}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Cards area */}
      <SortableContext
        id={status}
        items={issueIds}
        strategy={verticalListSortingStrategy}
      >
        <div
          ref={setNodeRef}
          className="flex flex-col gap-2 px-1 pb-4 flex-1 min-h-[120px] overflow-y-auto"
        >
          {issues.map((issue) => (
            <BoardCard
              key={issue.id}
              id={issue.id}
              issueKey={issue.issue_key}
              title={issue.title}
              priority={issue.priority}
              dueDate={issue.due_date}
              status={issue.status}
              assignee={issue.assignee}
              labels={issue.labels}
              projectName={showProject ? issue.project?.name : undefined}
              projectColor={showProject ? issue.project?.color : undefined}
            />
          ))}

          {/* Quick add form */}
          {quickAddActive && (
            <BoardQuickAdd
              projectId={projectId}
              status={status}
              sortOrder={lastSortOrder}
              onClose={onQuickAddClose}
              onCreated={onQuickAddCreated}
            />
          )}
        </div>
      </SortableContext>
    </div>
  );
}
