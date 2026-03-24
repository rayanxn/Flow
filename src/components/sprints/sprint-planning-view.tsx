"use client";

import { useState, useMemo, useRef, useCallback, useEffect } from "react";
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
import { formatDateFull } from "@/lib/utils/dates";
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

function DraggableIssueRow({ issue }: { issue: IssueWithDetails }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: issue.id });

  const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)` }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-2.5 px-5 py-2.5 border-b border-[#F0EDE7] hover:bg-surface-hover/60 transition-colors cursor-grab active:cursor-grabbing",
        isDragging && "opacity-30",
      )}
      {...attributes}
      {...listeners}
    >
      <IssueRowContent issue={issue} />
    </div>
  );
}

function IssueRowContent({ issue }: { issue: IssueWithDetails }) {
  const priorityConfig = PRIORITY_CONFIG[issue.priority as IssuePriority];

  return (
    <>
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="shrink-0">
        <circle cx="2" cy="2" r="1.2" fill="#C4C0BA" />
        <circle cx="5" cy="2" r="1.2" fill="#C4C0BA" />
        <circle cx="8" cy="2" r="1.2" fill="#C4C0BA" />
        <circle cx="2" cy="5" r="1.2" fill="#C4C0BA" />
        <circle cx="5" cy="5" r="1.2" fill="#C4C0BA" />
        <circle cx="8" cy="5" r="1.2" fill="#C4C0BA" />
        <circle cx="2" cy="8" r="1.2" fill="#C4C0BA" />
        <circle cx="5" cy="8" r="1.2" fill="#C4C0BA" />
        <circle cx="8" cy="8" r="1.2" fill="#C4C0BA" />
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
        <div className="w-[22px] h-[22px] flex items-center justify-center shrink-0 rounded-full bg-[#E8E4DE]">
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

  const selectableSprints = useMemo(
    () => sprints.filter((s) => s.status !== "completed"),
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
    setBacklogIssues(initialBacklogIssues);
    setSprintIssues(initialSprintIssues);
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

  const donePoints = useMemo(
    () => doneIssues.reduce((sum, i) => sum + (i.story_points ?? 0), 0),
    [doneIssues],
  );

  const incompleteIssues = sprintIssues.length - doneIssues.length;

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
    }
  }, [sprint]);

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
        <div className="flex flex-1 min-h-0 overflow-hidden pb-6 gap-4 px-10">
          {/* LEFT PANE — Backlog */}
          <DroppablePane id="backlog" className="flex-1 rounded-xl border border-[#E8E4DE] bg-white overflow-hidden">
            <div className="px-5 pt-4 pb-3 border-b border-[#E8E4DE]">
              <div className="flex items-center justify-between">
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

              <div className="flex items-center gap-2 mt-3">
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
                  className="h-8 rounded-lg border border-border bg-surface px-2 text-xs text-text focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-border-strong transition-colors"
                >
                  <option value="">Priority</option>
                  <option value="0">P0</option>
                  <option value="1">P1</option>
                  <option value="2">P2</option>
                  <option value="3">P3</option>
                </select>
              </div>

              {/* Quick filter chips */}
              <div className="flex items-center gap-1.5 mt-2.5">
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
          <DroppablePane id="sprint" className="flex-1 rounded-r-xl border border-[#E8E4DE] border-l-2 border-l-[#C17B5A] bg-[#FDFBF8] overflow-hidden">
            {sprint ? (
              <>
                <div className="px-5 pt-4 pb-3.5 border-b border-[#E8E4DE]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            type="button"
                            className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 hover:bg-surface-hover transition-colors"
                          >
                            <span
                              className={cn(
                                "text-[10px] font-semibold px-1.5 py-0.5 rounded border",
                                sprint.status === "active"
                                  ? "text-success border-success/40 bg-success/5"
                                  : "text-warning border-warning/40 bg-warning/5",
                              )}
                            >
                              {sprint.status === "active" ? "Active" : "Planning"}
                            </span>
                            <span className="text-sm font-semibold text-text">
                              {sprint.name}
                            </span>
                            <ChevronDown className="w-3.5 h-3.5 text-text-muted" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-[260px]">
                          {selectableSprints.some((s) => s.status === "active") && (
                            <>
                              <DropdownMenuLabel>Active</DropdownMenuLabel>
                              {selectableSprints
                                .filter((s) => s.status === "active")
                                .map((s) => (
                                  <DropdownMenuItem
                                    key={s.id}
                                    className={cn(
                                      "flex items-center gap-2 cursor-pointer",
                                      s.id === sprint.id && "bg-surface-hover",
                                    )}
                                    onSelect={() => handleSprintChange(s.id)}
                                  >
                                    <span className="w-2 h-2 rounded-full bg-success shrink-0" />
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
                          {selectableSprints.some((s) => s.status === "planning") && (
                            <>
                              <DropdownMenuLabel>Planning</DropdownMenuLabel>
                              {selectableSprints
                                .filter((s) => s.status === "planning")
                                .map((s) => (
                                  <DropdownMenuItem
                                    key={s.id}
                                    className={cn(
                                      "flex items-center gap-2 cursor-pointer",
                                      s.id === sprint.id && "bg-surface-hover",
                                    )}
                                    onSelect={() => handleSprintChange(s.id)}
                                  >
                                    <span className="w-2 h-2 rounded-full bg-warning shrink-0" />
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
                  <div className="mt-1.5 flex items-center gap-2 text-[11px] text-text-secondary">
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
                    <div className="mt-3 h-1.5 w-full rounded-[3px] bg-[#F0EDE7] overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-[3px] transition-all",
                          sprint.capacity && sprintPoints > sprint.capacity
                            ? "bg-danger"
                            : "bg-[#C17B5A]",
                        )}
                        style={{
                          width: `${Math.min(100, (sprintPoints / (sprint.capacity ?? sprintPoints)) * 100)}%`,
                        }}
                      />
                    </div>
                  )}

                  {/* Sprint actions */}
                  <div className="flex items-center gap-2 mt-3">
                    {sprint.status === "planning" && (
                      <Button
                        size="sm"
                        onClick={handleStartSprint}
                        disabled={sprintIssues.length === 0}
                      >
                        Start Sprint
                      </Button>
                    )}
                    {sprint.status === "active" && (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setShowCompleteModal(true)}
                      >
                        Complete Sprint
                      </Button>
                    )}
                  </div>

                  {startingError && (
                    <p className="mt-2 text-xs text-danger">{startingError}</p>
                  )}
                </div>

                <div className="flex-1 overflow-y-auto">
                  {sprintIssues.map((issue) => (
                    <DraggableIssueRow key={issue.id} issue={issue} />
                  ))}

                  {/* Drop zone placeholder */}
                  <div className="flex items-center justify-center flex-1 min-h-20 mx-5 my-3 rounded-lg border-2 border-dashed border-[#E8E4DE] text-xs text-[#C4C0BA]">
                    Drag issues here from backlog
                  </div>
                </div>

                {/* Team Load — per-person progress bars */}
                {teamLoad.length > 0 && (
                  <div className="border-t border-[#E8E4DE] px-5 py-3.5">
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
                          <div className="w-[22px] h-[22px] flex items-center justify-center shrink-0 rounded-full bg-[#E8E4DE]">
                            <span className="text-[9px] font-semibold text-text-secondary">
                              {getInitials(entry.fullName)}
                            </span>
                          </div>
                          <div className="flex-1 h-1.5 rounded-[3px] bg-[#F0EDE7] overflow-hidden">
                            <div
                              className="h-full rounded-[3px] bg-[#C17B5A] transition-all"
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
          totalIssues={sprintIssues.length}
          doneIssues={doneIssues.length}
          incompleteIssues={incompleteIssues}
        />
      )}
    </div>
  );
}
