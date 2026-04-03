"use client";

import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  useSensor,
  useSensors,
  PointerSensor,
  useDroppable,
  useDraggable,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import { Plus, Search, ChevronDown, X } from "lucide-react";
import { format } from "date-fns";
import { updateIssue } from "@/lib/actions/issues";
import { startSprint } from "@/lib/actions/sprints";
import { PRIORITY_CONFIG } from "@/lib/utils/priorities";
import { cn } from "@/lib/utils/cn";
import { getInitials } from "@/lib/utils/format";
import { useWorkspace } from "@/providers/workspace-provider";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { CreateSprintModal } from "./create-sprint-modal";
import { CompleteSprintModal } from "./complete-sprint-modal";
import type { Tables, IssuePriority } from "@/lib/types";
import type { IssueWithDetails } from "@/lib/queries/issues";
import type { WorkspaceMember } from "@/lib/queries/members";

// --- Types ---

interface SprintPlanningViewProps {
  workspaceSlug: string;
  projectId: string;
  workspaceId: string;
  sprint: Tables<"sprints"> | null;
  sprints: Tables<"sprints">[];
  initialBacklogIssues: IssueWithDetails[];
  initialSprintIssues: IssueWithDetails[];
  members: WorkspaceMember[];
}

type TeamLoadEntry = {
  userId: string;
  fullName: string | null;
  avatarUrl: string | null;
  points: number;
};

type QuickFilter = "p0" | "unassigned" | "bugs" | "my-issues";

const QUICK_FILTER_CONFIG: {
  key: QuickFilter;
  label: string;
  activeClass: string;
}[] = [
  { key: "p0", label: "P0 Critical", activeClass: "border-danger text-danger bg-danger/5" },
  { key: "unassigned", label: "Unassigned", activeClass: "border-text-muted text-text bg-surface-hover" },
  { key: "bugs", label: "Bugs", activeClass: "border-text-muted text-text bg-surface-hover" },
  { key: "my-issues", label: "My Issues", activeClass: "border-text-muted text-text bg-surface-hover" },
];

const SPRINT_STATUS_CONFIG = {
  active: {
    label: "Active",
    badgeClassName: "text-success border-success/40 bg-success/5",
    dotClassName: "bg-success",
  },
  planning: {
    label: "Planning",
    badgeClassName: "text-warning border-warning/40 bg-warning/5",
    dotClassName: "bg-warning",
  },
  completed: {
    label: "Completed",
    badgeClassName: "text-text-secondary border-border bg-background",
    dotClassName: "bg-text-muted",
  },
} as const;

// --- Helpers ---

function findContainer(
  issueId: string,
  backlog: IssueWithDetails[],
  sprint: IssueWithDetails[],
): "backlog" | "sprint" | null {
  if (backlog.some((i) => i.id === issueId)) return "backlog";
  if (sprint.some((i) => i.id === issueId)) return "sprint";
  return null;
}

function formatDateRange(start: string | null, end: string | null): string {
  if (!start || !end) return "";
  const s = new Date(start);
  const e = new Date(end);
  if (s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear()) {
    return `${format(s, "MMM d")} – ${format(e, "d")}`;
  }
  return `${format(s, "MMM d")} – ${format(e, "MMM d")}`;
}

// --- Draggable Issue Row ---

function DraggableIssueRow({
  issue,
  disabled = false,
}: {
  issue: IssueWithDetails;
  disabled?: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: issue.id, disabled });

  const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)` }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "border-b border-border px-4 py-3 transition-colors sm:px-5 sm:py-2.5",
        disabled
          ? "cursor-default"
          : "cursor-grab hover:bg-surface-hover/60 active:cursor-grabbing",
        isDragging && "opacity-30",
      )}
      {...(disabled ? {} : attributes)}
      {...(disabled ? {} : listeners)}
    >
      <IssueRowContent issue={issue} />
    </div>
  );
}

function IssueRowContent({ issue }: { issue: IssueWithDetails }) {
  const priorityConfig = PRIORITY_CONFIG[issue.priority as IssuePriority];

  return (
    <>
      <div className="flex w-full flex-col gap-2 sm:hidden">
        <div className="flex items-center gap-2">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="shrink-0">
            <circle cx="2" cy="2" r="1.2" fill="var(--color-text-muted)" />
            <circle cx="5" cy="2" r="1.2" fill="var(--color-text-muted)" />
            <circle cx="8" cy="2" r="1.2" fill="var(--color-text-muted)" />
            <circle cx="2" cy="5" r="1.2" fill="var(--color-text-muted)" />
            <circle cx="5" cy="5" r="1.2" fill="var(--color-text-muted)" />
            <circle cx="8" cy="5" r="1.2" fill="var(--color-text-muted)" />
            <circle cx="2" cy="8" r="1.2" fill="var(--color-text-muted)" />
            <circle cx="5" cy="8" r="1.2" fill="var(--color-text-muted)" />
            <circle cx="8" cy="8" r="1.2" fill="var(--color-text-muted)" />
          </svg>
          <span className="text-[11px] font-mono text-text-secondary">
            {issue.issue_key}
          </span>
          <span
            className="rounded-full px-2 py-1 text-[10px] font-semibold"
            style={{ color: priorityConfig.color, backgroundColor: priorityConfig.bgColor }}
          >
            {priorityConfig.label}
          </span>
          <span className="ml-auto rounded-full bg-background px-2 py-1 text-[10px] font-mono font-medium text-text-secondary">
            {issue.story_points ?? "–"} pts
          </span>
        </div>
        <span className="text-[13px] leading-5 text-text">{issue.title}</span>
        <div className="flex items-center gap-2">
          {issue.assignee ? (
            <div className="flex items-center gap-2">
              <div className="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-avatar">
                <span className="text-[9px] font-semibold text-text-secondary">
                  {getInitials(issue.assignee.full_name)}
                </span>
              </div>
              <span className="text-[11px] text-text-secondary">
                {issue.assignee.full_name ?? "Assigned"}
              </span>
            </div>
          ) : (
            <span className="text-[11px] text-text-muted">Unassigned</span>
          )}
        </div>
      </div>

      <div className="hidden w-full items-center gap-2.5 sm:flex">
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="shrink-0">
          <circle cx="2" cy="2" r="1.2" fill="var(--color-text-muted)" />
          <circle cx="5" cy="2" r="1.2" fill="var(--color-text-muted)" />
          <circle cx="8" cy="2" r="1.2" fill="var(--color-text-muted)" />
          <circle cx="2" cy="5" r="1.2" fill="var(--color-text-muted)" />
          <circle cx="5" cy="5" r="1.2" fill="var(--color-text-muted)" />
          <circle cx="8" cy="5" r="1.2" fill="var(--color-text-muted)" />
          <circle cx="2" cy="8" r="1.2" fill="var(--color-text-muted)" />
          <circle cx="5" cy="8" r="1.2" fill="var(--color-text-muted)" />
          <circle cx="8" cy="8" r="1.2" fill="var(--color-text-muted)" />
        </svg>
        <span className="text-[11px] font-mono text-text-secondary shrink-0 w-13">
          {issue.issue_key}
        </span>
        <span className="text-[13px] text-text truncate flex-1">{issue.title}</span>
        <span
          className="text-[10px] font-semibold shrink-0 rounded-sm px-1.5 py-0.5"
          style={{ color: priorityConfig.color, backgroundColor: priorityConfig.bgColor }}
        >
          {priorityConfig.label}
        </span>
        {issue.assignee ? (
          <div className="flex h-[22px] w-[22px] items-center justify-center shrink-0 rounded-full bg-avatar">
            <span className="text-[9px] font-semibold text-text-secondary">
              {getInitials(issue.assignee.full_name)}
            </span>
          </div>
        ) : (
          <div className="w-[22px] shrink-0" />
        )}
        <span className="text-[11px] font-mono font-medium text-text-secondary shrink-0 rounded-sm px-1.5 py-0.5 bg-background">
          {issue.story_points ?? "–"}
        </span>
      </div>
    </>
  );
}

// --- Overlay Row (rendered in DragOverlay) ---

function OverlayIssueRow({ issue }: { issue: IssueWithDetails }) {
  return (
    <div className="flex items-center gap-2.5 px-5 py-2.5 bg-surface border border-border rounded-lg shadow-lg">
      <IssueRowContent issue={issue} />
    </div>
  );
}

// --- Droppable Pane Wrapper ---

function DroppablePane({
  id,
  children,
  className,
}: {
  id: string;
  children: React.ReactNode;
  className?: string;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex flex-col transition-colors",
        isOver && "bg-surface-hover/50",
        className,
      )}
    >
      {children}
    </div>
  );
}

// --- Main Component ---

export function SprintPlanningView({
  workspaceSlug,
  projectId,
  workspaceId,
  sprint,
  sprints,
  initialBacklogIssues,
  initialSprintIssues,
  members,
}: SprintPlanningViewProps) {
  const { membership } = useWorkspace();
  const currentUserId = membership.user_id;

  const [backlogIssues, setBacklogIssues] = useState(initialBacklogIssues);
  const [sprintIssues, setSprintIssues] = useState(initialSprintIssues);
  const [activeId, setActiveId] = useState<string | null>(null);
  const snapshot = useRef<{
    backlog: IssueWithDetails[];
    sprint: IssueWithDetails[];
  }>({ backlog: [], sprint: [] });

  // Filters
  const [backlogFilter, setBacklogFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<string>("");
  const [quickFilters, setQuickFilters] = useState<Set<QuickFilter>>(new Set());

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);

  // Starting sprint
  const [startingError, setStartingError] = useState<string | null>(null);

  // Sprint selector
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const sprintGroups = useMemo(
    () => ({
      active: sprints.filter((s) => s.status === "active"),
      planning: sprints.filter((s) => s.status === "planning"),
      completed: sprints.filter((s) => s.status === "completed"),
    }),
    [sprints],
  );

  const handleSprintChange = useCallback(
    (sprintId: string) => {
      if (sprintId === "__new__") {
        setShowCreateModal(true);
        return;
      }
      const params = new URLSearchParams(searchParams.toString());
      params.set("sprint", sprintId);
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams],
  );

  const toggleQuickFilter = useCallback((filter: QuickFilter) => {
    setQuickFilters((prev) => {
      const next = new Set(prev);
      if (next.has(filter)) {
        next.delete(filter);
      } else {
        next.add(filter);
      }
      return next;
    });
  }, []);

  // Sync local state when server re-renders with new sprint data
  useEffect(() => {
    const syncFrame = window.requestAnimationFrame(() => {
      setBacklogIssues(initialBacklogIssues);
      setSprintIssues(initialSprintIssues);
    });

    return () => window.cancelAnimationFrame(syncFrame);
  }, [initialBacklogIssues, initialSprintIssues]);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor),
  );

  // --- Computed values ---

  const filteredBacklog = useMemo(() => {
    let filtered = backlogIssues;

    // Text search
    if (backlogFilter) {
      const q = backlogFilter.toLowerCase();
      filtered = filtered.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.issue_key.toLowerCase().includes(q),
      );
    }

    // Priority dropdown
    if (priorityFilter !== "") {
      const p = Number(priorityFilter);
      filtered = filtered.filter((i) => i.priority === p);
    }

    // Quick filter chips (OR union)
    if (quickFilters.size > 0) {
      filtered = filtered.filter((issue) => {
        if (quickFilters.has("p0") && issue.priority === 0) return true;
        if (quickFilters.has("unassigned") && !issue.assignee_id) return true;
        if (
          quickFilters.has("bugs") &&
          issue.labels.some((l) => l.name.toLowerCase() === "bug")
        )
          return true;
        if (quickFilters.has("my-issues") && issue.assignee_id === currentUserId)
          return true;
        return false;
      });
    }

    return filtered;
  }, [backlogIssues, backlogFilter, priorityFilter, quickFilters, currentUserId]);

  const backlogPoints = useMemo(
    () => backlogIssues.reduce((sum, i) => sum + (i.story_points ?? 0), 0),
    [backlogIssues],
  );

  const sprintPoints = useMemo(
    () => sprintIssues.reduce((sum, i) => sum + (i.story_points ?? 0), 0),
    [sprintIssues],
  );

  const doneIssues = useMemo(
    () => sprintIssues.filter((i) => i.status === "done"),
    [sprintIssues],
  );

  const incompleteIssues = sprintIssues.length - doneIssues.length;
  const dragDisabled = sprint?.status === "completed";
  const sprintStatusConfig = sprint ? SPRINT_STATUS_CONFIG[sprint.status] : null;

  const teamLoad = useMemo((): TeamLoadEntry[] => {
    const map = new Map<string, number>();
    for (const issue of sprintIssues) {
      if (issue.assignee_id) {
        map.set(
          issue.assignee_id,
          (map.get(issue.assignee_id) ?? 0) + (issue.story_points ?? 0),
        );
      }
    }

    return Array.from(map.entries()).map(([userId, points]) => {
      const member = members.find((m) => m.user_id === userId);
      return {
        userId,
        fullName: member?.profile.full_name ?? null,
        avatarUrl: member?.profile.avatar_url ?? null,
        points,
      };
    });
  }, [sprintIssues, members]);

  const maxTeamPoints = useMemo(
    () => Math.max(...teamLoad.map((e) => e.points), 1),
    [teamLoad],
  );

  const avgTeamPoints = useMemo(
    () =>
      teamLoad.length > 0
        ? Math.round(teamLoad.reduce((s, e) => s + e.points, 0) / teamLoad.length)
        : 0,
    [teamLoad],
  );

  // --- Active issue for DragOverlay ---

  const activeIssue = activeId
    ? [...backlogIssues, ...sprintIssues].find((i) => i.id === activeId) ?? null
    : null;

  // --- DnD Handlers ---

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      setActiveId(event.active.id as string);
      snapshot.current = {
        backlog: [...backlogIssues],
        sprint: [...sprintIssues],
      };
    },
    [backlogIssues, sprintIssues],
  );

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveId(null);

      if (!over || !sprint) return;

      const issueId = active.id as string;
      const sourceContainer = findContainer(
        issueId,
        backlogIssues,
        sprintIssues,
      );

      // Determine target container
      let targetContainer: "backlog" | "sprint" | null = null;
      if (over.id === "backlog" || over.id === "sprint") {
        targetContainer = over.id;
      } else {
        // Dropped on an issue — find which pane it belongs to
        targetContainer = findContainer(
          over.id as string,
          backlogIssues,
          sprintIssues,
        );
      }

      if (!sourceContainer || !targetContainer) return;
      if (sourceContainer === targetContainer) return;

      // Find the issue being moved
      const issue =
        sourceContainer === "backlog"
          ? backlogIssues.find((i) => i.id === issueId)
          : sprintIssues.find((i) => i.id === issueId);
      if (!issue) return;

      const newSprintId = targetContainer === "sprint" ? sprint.id : null;

      // Optimistic update
      if (sourceContainer === "backlog") {
        setBacklogIssues((prev) => prev.filter((i) => i.id !== issueId));
        setSprintIssues((prev) => [
          ...prev,
          { ...issue, sprint_id: newSprintId },
        ]);
      } else {
        setSprintIssues((prev) => prev.filter((i) => i.id !== issueId));
        setBacklogIssues((prev) => [
          ...prev,
          { ...issue, sprint_id: newSprintId },
        ]);
      }

      // Persist
      const result = await updateIssue(issueId, { sprint_id: newSprintId });

      if (result.error) {
        // Rollback
        setBacklogIssues(snapshot.current.backlog);
        setSprintIssues(snapshot.current.sprint);
      }
    },
    [backlogIssues, sprintIssues, sprint],
  );

  const handleDragCancel = useCallback(() => {
    setActiveId(null);
    setBacklogIssues(snapshot.current.backlog);
    setSprintIssues(snapshot.current.sprint);
  }, []);

  // --- Sprint actions ---

  const handleStartSprint = useCallback(async () => {
    if (!sprint) return;
    setStartingError(null);
    const result = await startSprint(sprint.id);
    if (result.error) {
      setStartingError(result.error);
      return;
    }
    router.refresh();
  }, [router, sprint]);

  // --- Render ---

  return (
    <div className="flex flex-col h-full">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div className="flex flex-1 min-h-0 flex-col gap-4 overflow-y-auto px-4 pb-4 md:px-6 xl:flex-row xl:overflow-hidden xl:px-10 xl:pb-6">
          {/* LEFT PANE — Backlog */}
          <DroppablePane id="backlog" className="flex-1 min-h-[22rem] overflow-hidden rounded-xl border border-border bg-surface">
            <div className="border-b border-border px-4 pb-3 pt-4 sm:px-5">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-baseline gap-2">
                  <h2 className="text-[15px] font-semibold text-text">Backlog</h2>
                  <span className="text-xs text-text-secondary">
                    {backlogIssues.length} issue{backlogIssues.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <span className="text-xs font-mono font-medium text-text-secondary tabular-nums">
                  {backlogPoints} pts
                </span>
              </div>

              <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
                  <Input
                    placeholder="Search issues..."
                    value={backlogFilter}
                    onChange={(e) => setBacklogFilter(e.target.value)}
                    className="pl-8 h-8 text-xs"
                  />
                </div>
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="h-8 w-full rounded-lg border border-border bg-surface px-2 text-xs text-text transition-colors focus:border-border-strong focus:outline-none focus:ring-2 focus:ring-primary/10 sm:w-auto"
                >
                  <option value="">Priority</option>
                  <option value="0">P0</option>
                  <option value="1">P1</option>
                  <option value="2">P2</option>
                  <option value="3">P3</option>
                </select>
              </div>

              {/* Quick filter chips */}
              <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                {QUICK_FILTER_CONFIG.map((chip) => (
                  <button
                    key={chip.key}
                    type="button"
                    onClick={() => toggleQuickFilter(chip.key)}
                    className={cn(
                      "px-2 py-0.5 rounded-[5px] text-[11px] font-medium border transition-colors",
                      quickFilters.has(chip.key)
                        ? chip.activeClass
                        : "border-border text-text-secondary hover:text-text hover:border-border-strong bg-background",
                    )}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {filteredBacklog.length === 0 ? (
                <div className="flex items-center justify-center h-32 text-sm text-text-muted">
                  {backlogIssues.length === 0
                    ? "No issues in backlog"
                    : "No issues match filters"}
                </div>
              ) : (
                filteredBacklog.map((issue) => (
                  <DraggableIssueRow key={issue.id} issue={issue} />
                ))
              )}
            </div>
          </DroppablePane>

          {/* RIGHT PANE — Sprint (warm tint) */}
          <DroppablePane id="sprint" className="flex-1 min-h-[22rem] overflow-hidden rounded-xl border border-border border-l-2 border-l-accent bg-surface xl:rounded-r-xl">
            {sprint ? (
              <>
                <div className="border-b border-border px-4 pb-3.5 pt-4 sm:px-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex min-w-0 flex-col gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            type="button"
                            className="inline-flex max-w-full items-center gap-2 rounded-full border border-border px-3 py-1 transition-colors hover:bg-surface-hover"
                          >
                            <span
                              className={cn(
                                "text-[10px] font-semibold px-1.5 py-0.5 rounded border",
                                sprintStatusConfig?.badgeClassName,
                              )}
                            >
                              {sprintStatusConfig?.label}
                            </span>
                            <span className="truncate text-sm font-semibold text-text">
                              {sprint.name}
                            </span>
                            <ChevronDown className="w-3.5 h-3.5 text-text-muted" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-[260px]">
                          {sprintGroups.active.length > 0 && (
                            <>
                              <DropdownMenuLabel>Active</DropdownMenuLabel>
                              {sprintGroups.active.map((s) => (
                                  <DropdownMenuItem
                                    key={s.id}
                                    className={cn(
                                      "flex items-center gap-2 cursor-pointer",
                                      s.id === sprint.id && "bg-surface-hover",
                                    )}
                                    onSelect={() => handleSprintChange(s.id)}
                                  >
                                    <span
                                      className={cn(
                                        "w-2 h-2 rounded-full shrink-0",
                                        SPRINT_STATUS_CONFIG.active.dotClassName,
                                      )}
                                    />
                                    <span className="text-sm text-text flex-1">{s.name}</span>
                                    <span className="text-xs text-text-muted">
                                      {formatDateRange(s.start_date, s.end_date)}
                                    </span>
                                    {s.id === sprint.id && (
                                      <X className="w-3.5 h-3.5 text-text-muted shrink-0" />
                                    )}
                                  </DropdownMenuItem>
                                ))}
                            </>
                          )}
                          {sprintGroups.planning.length > 0 && (
                            <>
                              <DropdownMenuLabel>Planning</DropdownMenuLabel>
                              {sprintGroups.planning.map((s) => (
                                  <DropdownMenuItem
                                    key={s.id}
                                    className={cn(
                                      "flex items-center gap-2 cursor-pointer",
                                      s.id === sprint.id && "bg-surface-hover",
                                    )}
                                    onSelect={() => handleSprintChange(s.id)}
                                  >
                                    <span
                                      className={cn(
                                        "w-2 h-2 rounded-full shrink-0",
                                        SPRINT_STATUS_CONFIG.planning.dotClassName,
                                      )}
                                    />
                                    <span className="text-sm text-text flex-1">{s.name}</span>
                                    <span className="text-xs text-text-muted">
                                      {formatDateRange(s.start_date, s.end_date)}
                                    </span>
                                    {s.id === sprint.id && (
                                      <X className="w-3.5 h-3.5 text-text-muted shrink-0" />
                                    )}
                                  </DropdownMenuItem>
                                ))}
                            </>
                          )}
                          {sprintGroups.completed.length > 0 && (
                            <>
                              <DropdownMenuLabel>Completed</DropdownMenuLabel>
                              {sprintGroups.completed.map((s) => (
                                <DropdownMenuItem
                                  key={s.id}
                                  className={cn(
                                    "flex items-center gap-2 cursor-pointer",
                                    s.id === sprint.id && "bg-surface-hover",
                                  )}
                                  onSelect={() => handleSprintChange(s.id)}
                                >
                                  <span
                                    className={cn(
                                      "w-2 h-2 rounded-full shrink-0",
                                      SPRINT_STATUS_CONFIG.completed.dotClassName,
                                    )}
                                  />
                                  <span className="text-sm text-text flex-1">{s.name}</span>
                                  <span className="text-xs text-text-muted">
                                    {formatDateRange(s.start_date, s.end_date)}
                                  </span>
                                  {s.id === sprint.id && (
                                    <X className="w-3.5 h-3.5 text-text-muted shrink-0" />
                                  )}
                                </DropdownMenuItem>
                              ))}
                            </>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="flex items-center gap-2 cursor-pointer"
                            onSelect={() => setShowCreateModal(true)}
                          >
                            <Plus className="w-4 h-4 text-text-muted" />
                            <span className="text-sm text-text">New Sprint</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>

                      <span className="text-xs text-text-muted">
                        {sprintIssues.length} issue{sprintIssues.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-sm font-mono font-semibold text-text tabular-nums">
                        {sprintPoints}
                      </span>
                      <span className="text-xs font-mono text-text-secondary tabular-nums">
                        {sprint.capacity ? `/ ${sprint.capacity} pts` : "pts"}
                      </span>
                    </div>
                  </div>

                  {/* Date range and goal */}
                  <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[11px] text-text-secondary">
                    {sprint.start_date && sprint.end_date && (
                      <span>
                        {formatDateRange(sprint.start_date, sprint.end_date)}
                      </span>
                    )}
                    {sprint.goal && (
                      <>
                        {sprint.start_date && sprint.end_date && (
                          <span className="w-1 h-1 rounded-full bg-border-strong shrink-0" />
                        )}
                        <span className="truncate">
                          Goal: {sprint.goal}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Capacity bar */}
                  {(sprint.capacity ?? sprintPoints) > 0 && (
                    <div className="mt-3 h-1.5 w-full overflow-hidden rounded-[3px] bg-surface-inset">
                      <div
                        className={cn(
                          "h-full rounded-[3px] transition-all",
                          sprint.capacity && sprintPoints > sprint.capacity
                            ? "bg-danger"
                            : "bg-accent",
                        )}
                        style={{
                          width: `${Math.min(100, (sprintPoints / (sprint.capacity ?? sprintPoints)) * 100)}%`,
                        }}
                      />
                    </div>
                  )}

                  {/* Sprint actions */}
                  <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
                    {sprint.status !== "planning" && (
                      <Button asChild size="sm" variant="ghost" className="w-full sm:w-auto">
                        <Link href={`/${workspaceSlug}/analytics?tab=sprints&sprint=${sprint.id}`}>
                          Analytics
                        </Link>
                      </Button>
                    )}
                    {sprint.status === "planning" && (
                      <Button
                        size="sm"
                        onClick={handleStartSprint}
                        disabled={sprintIssues.length === 0}
                        className="w-full sm:w-auto"
                      >
                        Start Sprint
                      </Button>
                    )}
                    {sprint.status === "active" && (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setShowCompleteModal(true)}
                        className="w-full sm:w-auto"
                      >
                        Complete Sprint
                      </Button>
                    )}
                  </div>

                  {dragDisabled && (
                    <p className="mt-2 text-xs text-text-secondary">
                      Completed sprint scope is read-only.
                    </p>
                  )}

                  {startingError && (
                    <p className="mt-2 text-xs text-danger">{startingError}</p>
                  )}
                </div>

                <div className="flex-1 overflow-y-auto">
                  {sprintIssues.map((issue) => (
                    <DraggableIssueRow
                      key={issue.id}
                      issue={issue}
                      disabled={dragDisabled}
                    />
                  ))}

                  {/* Drop zone placeholder */}
                  <div className="mx-4 my-3 flex min-h-20 flex-1 items-center justify-center rounded-lg border-2 border-dashed border-border px-4 text-center text-xs text-text-muted sm:mx-5">
                    {dragDisabled
                      ? "Completed sprint. Scope is read-only."
                      : "Drag issues here from backlog"}
                  </div>
                </div>

                {/* Team Load — per-person progress bars */}
                {teamLoad.length > 0 && (
                  <div className="border-t border-border px-5 py-3.5">
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="text-[11px] font-medium uppercase tracking-[0.05em] text-text-secondary">
                        Team Load
                      </span>
                      <span className="text-[11px] text-text-secondary">
                        {avgTeamPoints} pts / person avg
                      </span>
                    </div>
                    <div className="flex flex-col gap-2">
                      {teamLoad.map((entry) => (
                        <div key={entry.userId} className="flex items-center gap-2">
                          <div className="flex h-[22px] w-[22px] items-center justify-center shrink-0 rounded-full bg-avatar">
                            <span className="text-[9px] font-semibold text-text-secondary">
                              {getInitials(entry.fullName)}
                            </span>
                          </div>
                          <div className="flex-1 h-1.5 overflow-hidden rounded-[3px] bg-surface-inset">
                            <div
                              className="h-full rounded-[3px] bg-accent transition-all"
                              style={{
                                width: `${(entry.points / maxTeamPoints) * 100}%`,
                              }}
                            />
                          </div>
                          <span className="text-[11px] font-mono text-text tabular-nums w-fit text-right shrink-0">
                            {entry.points} pts
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full gap-3">
                <p className="text-sm text-text-muted">
                  No sprint found. Create one to get started.
                </p>
                <Button
                  size="sm"
                  onClick={() => setShowCreateModal(true)}
                >
                  <Plus className="w-4 h-4 mr-1.5" />
                  New Sprint
                </Button>
              </div>
            )}
          </DroppablePane>
        </div>

        <DragOverlay>
          {activeIssue ? <OverlayIssueRow issue={activeIssue} /> : null}
        </DragOverlay>
      </DndContext>

      {/* Modals */}
      <CreateSprintModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        projectId={projectId}
        workspaceId={workspaceId}
      />

      {sprint && (
        <CompleteSprintModal
          open={showCompleteModal}
          onOpenChange={setShowCompleteModal}
          sprint={sprint}
          workspaceSlug={workspaceSlug}
          totalIssues={sprintIssues.length}
          doneIssues={doneIssues.length}
          incompleteIssues={incompleteIssues}
        />
      )}
    </div>
  );
}
