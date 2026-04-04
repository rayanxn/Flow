"use client";

import { useState, useMemo, useRef, useCallback } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  useSensor,
  useSensors,
  PointerSensor,
  type DragStartEvent,
  type DragOverEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useRealtimeIssues } from "@/lib/hooks/use-realtime-issues";
import { updateIssue } from "@/lib/actions/issues";
import { STATUS_ORDER } from "@/lib/utils/statuses";
import { BoardColumn } from "./board-column";
import { BoardCard } from "./board-card";
import type { IssueStatus } from "@/lib/types";
import type { IssueWithDetails } from "@/lib/queries/issues";

interface BoardViewProps {
  initialIssues: IssueWithDetails[];
  projectId: string;
  showProject?: boolean;
  onIssueClick?: (id: string) => void;
  issueFilter?: (issue: IssueWithDetails) => boolean;
}

function calculateSortOrder(
  columnIssues: IssueWithDetails[],
  targetIndex: number,
): number {
  if (columnIssues.length === 0) return 1;
  if (targetIndex <= 0) return columnIssues[0].sort_order / 2;
  if (targetIndex >= columnIssues.length) {
    return columnIssues[columnIssues.length - 1].sort_order + 1;
  }
  const above = columnIssues[targetIndex - 1].sort_order;
  const below = columnIssues[targetIndex].sort_order;
  return (above + below) / 2;
}

function needsRebalance(
  columnIssues: IssueWithDetails[],
  targetIndex: number,
): boolean {
  if (columnIssues.length < 2) return false;
  const clampedIdx = Math.max(0, Math.min(targetIndex, columnIssues.length - 1));
  if (clampedIdx === 0) return columnIssues[0].sort_order < 0.0001;
  if (clampedIdx >= columnIssues.length - 1) return false;
  const above = columnIssues[clampedIdx - 1].sort_order;
  const below = columnIssues[clampedIdx].sort_order;
  return Math.abs(below - above) < 0.0001;
}

/** Find which status column an over target belongs to */
function findColumnOfOver(
  overId: string | number,
  issues: IssueWithDetails[],
  overData: Record<string, unknown> | undefined,
): IssueStatus | null {
  // If overId is a status string, it's the column's droppable
  if (STATUS_ORDER.includes(overId as IssueStatus)) {
    return overId as IssueStatus;
  }
  // Check sortable data for containerId
  const sortable = overData?.sortable as
    | { containerId?: string }
    | undefined;
  if (sortable?.containerId && STATUS_ORDER.includes(sortable.containerId as IssueStatus)) {
    return sortable.containerId as IssueStatus;
  }
  // Fallback: find issue
  const issue = issues.find((i) => i.id === overId);
  return issue ? (issue.status as IssueStatus) : null;
}

export function BoardView({
  initialIssues,
  projectId,
  showProject = false,
  onIssueClick,
  issueFilter,
}: BoardViewProps) {
  const { issues, setIssues } = useRealtimeIssues({
    projectId,
    initialIssues,
  });
  const [activeId, setActiveId] = useState<string | null>(null);
  const [quickAddStatus, setQuickAddStatus] = useState<IssueStatus | null>(null);
  const issuesSnapshot = useRef<IssueWithDetails[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // Group and sort issues into columns, applying optional filter for display
  const columns = useMemo(() => {
    const map = new Map<IssueStatus, IssueWithDetails[]>();
    for (const s of STATUS_ORDER) {
      map.set(s, []);
    }
    for (const issue of issues) {
      if (issueFilter && !issueFilter(issue)) continue;
      const col = map.get(issue.status as IssueStatus);
      if (col) col.push(issue);
    }
    for (const [, col] of map) {
      col.sort((a, b) => a.sort_order - b.sort_order);
    }
    return map;
  }, [issues, issueFilter]);

  const activeIssue = activeId
    ? issues.find((i) => i.id === activeId) ?? null
    : null;

  // --- Drag Handlers ---

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      setActiveId(event.active.id as string);
      issuesSnapshot.current = issues.map((i) => ({ ...i }));
    },
    [issues],
  );

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      const { active, over } = event;
      if (!over) return;

      const activeIssueStatus = issues.find(
        (i) => i.id === active.id,
      )?.status as IssueStatus | undefined;
      const overColumn = findColumnOfOver(
        over.id,
        issues,
        over.data?.current as Record<string, unknown> | undefined,
      );

      if (!activeIssueStatus || !overColumn) return;
      if (activeIssueStatus === overColumn) return;

      // Move card to the new column in local state
      setIssues((prev) =>
        prev.map((i) =>
          i.id === active.id ? { ...i, status: overColumn } : i,
        ),
      );
    },
    [issues, setIssues],
  );

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveId(null);

      if (!over) return;

      const activeIssueId = active.id as string;
      const activeIssue = issues.find((i) => i.id === activeIssueId);
      if (!activeIssue) return;

      const targetColumn = findColumnOfOver(
        over.id,
        issues,
        over.data?.current as Record<string, unknown> | undefined,
      );
      if (!targetColumn) return;

      const newStatus = targetColumn;
      const columnIssues = issues
        .filter((i) => i.status === newStatus && i.id !== activeIssueId)
        .sort((a, b) => a.sort_order - b.sort_order);

      // Determine target index
      let targetIndex = columnIssues.length; // default: end of column
      if (over.id !== newStatus) {
        // Dropped on a specific card — find its index
        const overIdx = columnIssues.findIndex((i) => i.id === over.id);
        if (overIdx !== -1) {
          targetIndex = overIdx;
        }
      }

      const newSortOrder = calculateSortOrder(columnIssues, targetIndex);

      // Optimistic local update
      setIssues((prev) =>
        prev.map((i) =>
          i.id === activeIssueId
            ? { ...i, status: newStatus, sort_order: newSortOrder }
            : i,
        ),
      );

      // Persist
      const result = await updateIssue(activeIssueId, {
        status: newStatus,
        sort_order: newSortOrder,
      });

      if (result.error) {
        // Rollback
        setIssues(issuesSnapshot.current);
        return;
      }

      // Rebalance if needed
      if (needsRebalance(columnIssues, targetIndex)) {
        const allColumnIssues = issues
          .filter((i) => i.status === newStatus || i.id === activeIssueId)
          .filter((i) => i.status === newStatus)
          .sort((a, b) => a.sort_order - b.sort_order);

        const rebalancePromises = allColumnIssues.map((issue, idx) =>
          updateIssue(issue.id, { sort_order: (idx + 1) * 1000 }),
        );
        await Promise.all(rebalancePromises);

        // Update local state with rebalanced orders
        setIssues((prev) =>
          prev.map((i) => {
            const rebalancedIdx = allColumnIssues.findIndex(
              (ri) => ri.id === i.id,
            );
            if (rebalancedIdx !== -1) {
              return { ...i, sort_order: (rebalancedIdx + 1) * 1000 };
            }
            return i;
          }),
        );
      }
    },
    [issues, setIssues],
  );

  const handleDragCancel = useCallback(() => {
    setActiveId(null);
    setIssues(issuesSnapshot.current);
  }, [setIssues]);

  const handleQuickAddCreated = useCallback(() => {
    setQuickAddStatus(null);
  }, []);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="flex h-full flex-col gap-4 overflow-y-auto p-4 md:flex-row md:overflow-x-auto md:overflow-y-hidden md:p-6">
        {STATUS_ORDER.map((status) => (
          <BoardColumn
            key={status}
            status={status}
            issues={columns.get(status) ?? []}
            showProject={showProject}
            projectId={projectId}
            quickAddActive={quickAddStatus === status}
            onQuickAddOpen={() => setQuickAddStatus(status)}
            onQuickAddClose={() => setQuickAddStatus(null)}
            onQuickAddCreated={handleQuickAddCreated}
            onIssueClick={onIssueClick}
          />
        ))}
      </div>

      <DragOverlay>
        {activeIssue ? (
          <BoardCard
            id={activeIssue.id}
            issueKey={activeIssue.issue_key}
            title={activeIssue.title}
            priority={activeIssue.priority}
            dueDate={activeIssue.due_date}
            status={activeIssue.status}
            assignee={activeIssue.assignee}
            labels={activeIssue.labels}
            projectName={
              showProject ? activeIssue.project?.name : undefined
            }
            projectColor={
              showProject ? activeIssue.project?.color : undefined
            }
            isDragOverlay
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
