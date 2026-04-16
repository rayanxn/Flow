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
  showHierarchy?: boolean;
  projectId: string;
  quickAddActive: boolean;
  onQuickAddOpen: () => void;
  onQuickAddClose: () => void;
  onQuickAddCreated: () => void;
  onIssueClick?: (id: string) => void;
  onParentClick?: (id: string) => void;
}

export function BoardColumn({
  status,
  issues,
  showProject = false,
  showHierarchy = true,
  projectId,
  quickAddActive,
  onQuickAddOpen,
  onQuickAddClose,
  onQuickAddCreated,
  onIssueClick,
  onParentClick,
}: BoardColumnProps) {
  const { setNodeRef } = useDroppable({ id: status });
  const config = STATUS_CONFIG[status];
  const issueIds = issues.map((i) => i.id);

  // Sort order for new quick-add issue: after the last issue
  const lastSortOrder =
    issues.length > 0 ? issues[issues.length - 1].sort_order + 1000 : 1000;

  return (
    <div
      className="flex w-full min-w-0 shrink-0 flex-col rounded-xl border border-border bg-surface p-2 md:min-w-[280px] md:w-[280px] md:rounded-none md:border-none md:bg-transparent md:p-0"
      role="region"
      aria-label={`${config.label} column, ${issues.length} ${issues.length === 1 ? "issue" : "issues"}`}
    >
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
        {projectId && (
          <button
            type="button"
            onClick={onQuickAddOpen}
            className="ml-auto p-0.5 text-text-muted hover:text-text-secondary transition-colors rounded hover:bg-surface-hover"
            title={`Add issue to ${config.label}`}
          >
            <Plus className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Cards area */}
      <SortableContext
        id={status}
        items={issueIds}
        strategy={verticalListSortingStrategy}
      >
        <div
          ref={setNodeRef}
          className="flex flex-1 flex-col gap-2 overflow-visible px-1 pb-2 md:min-h-[120px] md:overflow-y-auto md:pb-4"
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
              parent={showHierarchy ? issue.parent : null}
              subIssueDoneCount={showHierarchy ? issue.sub_issues_done_count : 0}
              subIssueTotalCount={showHierarchy ? issue.sub_issues_count : 0}
              onClick={onIssueClick}
              onParentClick={onParentClick}
            />
          ))}

          {/* Quick add form */}
          {projectId && quickAddActive && (
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
