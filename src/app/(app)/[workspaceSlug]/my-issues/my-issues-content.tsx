"use client";

import {
  useState,
  useMemo,
  useCallback,
  Suspense,
  useSyncExternalStore,
} from "react";
import { ChevronDown } from "lucide-react";
import { IssueList } from "@/components/issues/issue-list";
import { BoardView } from "@/components/board/board-view";
import { IssueDetailPanel } from "@/components/issues/issue-detail-panel";
import { useIssueFromUrl } from "@/lib/hooks/use-issue-from-url";
import { FilterBar } from "@/components/filters/filter-bar";
import { useIssueFilters } from "@/lib/hooks/use-issue-filters";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils/cn";
import { STATUS_ORDER } from "@/lib/utils/statuses";
import type { IssueWithDetails } from "@/lib/queries/issues";
import type { IssueStatus } from "@/lib/types";
import { getIssueClient } from "@/lib/queries/issues-client";

type ViewMode = "list" | "board";
type SortKey = "priority" | "due_date" | "created_at" | "title" | "status";

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "priority", label: "Priority" },
  { key: "due_date", label: "Due Date" },
  { key: "created_at", label: "Created" },
  { key: "title", label: "Title" },
  { key: "status", label: "Status" },
];

const VIEW_STORAGE_KEY = "flow-my-issues-view";
const SORT_STORAGE_KEY = "flow-my-issues-sort";
const STORAGE_EVENT = "flow-my-issues-preferences";

interface MyIssuesContentProps {
  issues: IssueWithDetails[];
  members?: { user_id: string; profile: { id: string; full_name: string | null; email: string; avatar_url: string | null } }[];
  sprints?: { id: string; name: string; status: string; project_id?: string }[];
  labels?: { id: string; name: string; color: string }[];
  projects?: { id: string; name: string; color: string }[];
}

function subscribePreferences(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(STORAGE_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(STORAGE_EVENT, onStoreChange);
  };
}

function getStoredViewMode(): ViewMode {
  const storedView = window.localStorage.getItem(VIEW_STORAGE_KEY);
  return storedView === "list" || storedView === "board" ? storedView : "list";
}

function getStoredSortKey(): SortKey {
  const storedSort = window.localStorage.getItem(SORT_STORAGE_KEY);
  return storedSort && SORT_OPTIONS.some((option) => option.key === storedSort)
    ? (storedSort as SortKey)
    : "priority";
}

function MyIssuesContentInner({
  issues,
  members = [],
  sprints = [],
  labels = [],
  projects = [],
}: MyIssuesContentProps) {
  const viewMode = useSyncExternalStore(
    subscribePreferences,
    getStoredViewMode,
    () => "list",
  );
  const sortKey = useSyncExternalStore(
    subscribePreferences,
    getStoredSortKey,
    () => "priority",
  );
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);
  const [selectedIssueFallback, setSelectedIssueFallback] = useState<IssueWithDetails | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const openIssue = useCallback(
    (issue: IssueWithDetails) => {
      setSelectedIssueId(issue.id);
      setSelectedIssueFallback(issue);
      setDetailOpen(true);
    },
    []
  );

  const selectedIssue = selectedIssueId
    ? issues.find((issue) => issue.id === selectedIssueId) ?? selectedIssueFallback
    : null;

  useIssueFromUrl(issues, openIssue);

  const {
    filters,
    searchQuery,
    setSearchQuery,
    toggleFilter,
    clearFilter,
    clearAll,
    filteredIssues,
    hasActiveFilters,
    issueFilterFn,
    searchInputRef,
  } = useIssueFilters({
    issues,
    enabledFilters: ["status", "priority", "assignee", "label", "project"],
  });

  function handleViewChange(mode: ViewMode) {
    window.localStorage.setItem(VIEW_STORAGE_KEY, mode);
    window.dispatchEvent(new Event(STORAGE_EVENT));
  }

  function handleSortChange(key: string) {
    window.localStorage.setItem(SORT_STORAGE_KEY, key);
    window.dispatchEvent(new Event(STORAGE_EVENT));
  }

  const handleIssueClick = useCallback(
    async (id: string) => {
      const issue = issues.find((i) => i.id === id) ?? (await getIssueClient(id));
      if (issue) openIssue(issue);
    },
    [issues, openIssue]
  );

  const sortedIssues = useMemo(() => {
    const sorted = [...filteredIssues];
    switch (sortKey) {
      case "priority":
        sorted.sort((a, b) => a.priority - b.priority);
        break;
      case "due_date":
        sorted.sort((a, b) => {
          if (!a.due_date && !b.due_date) return 0;
          if (!a.due_date) return 1;
          if (!b.due_date) return -1;
          return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
        });
        break;
      case "created_at":
        sorted.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        break;
      case "title":
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "status":
        sorted.sort(
          (a, b) =>
            STATUS_ORDER.indexOf(a.status as IssueStatus) -
            STATUS_ORDER.indexOf(b.status as IssueStatus)
        );
        break;
    }
    return sorted;
  }, [filteredIssues, sortKey]);

  const activeSortLabel =
    SORT_OPTIONS.find((o) => o.key === sortKey)?.label ?? "Priority";

  return (
    <>
      {/* Filter bar */}
      <FilterBar
        filters={filters}
        searchQuery={searchQuery}
        searchInputRef={searchInputRef}
        onSearchChange={setSearchQuery}
        onToggleFilter={toggleFilter}
        onClearFilter={clearFilter}
        onClearAll={clearAll}
        hasActiveFilters={hasActiveFilters}
        enabledFilters={["status", "priority", "assignee", "label", "project"]}
        members={members}
        labels={labels}
        projects={projects}
      />

      {/* Controls row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* View toggle */}
        <div className="flex w-full items-center gap-0.5 overflow-hidden rounded-lg bg-surface-inset p-0.5 sm:w-auto">
          <button
            onClick={() => handleViewChange("list")}
            className={cn(
              "flex-1 px-3.5 py-1.5 text-sm font-medium rounded-md transition-colors sm:flex-none",
              viewMode === "list"
                ? "bg-surface text-text"
                : "text-text-secondary hover:text-text"
            )}
          >
            List
          </button>
          <button
            onClick={() => handleViewChange("board")}
            className={cn(
              "flex-1 px-3.5 py-1.5 text-sm font-medium rounded-md transition-colors sm:flex-none",
              viewMode === "board"
                ? "bg-surface text-text"
                : "text-text-secondary hover:text-text"
            )}
          >
            Board
          </button>
        </div>

        {/* Sort dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex w-full items-center justify-between gap-1.5 rounded-lg border border-border px-3 py-2 text-sm text-text-secondary transition-colors hover:bg-surface-hover sm:w-auto sm:justify-start sm:py-1.5">
              <span>Sort: {activeSortLabel}</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[160px]">
            <DropdownMenuLabel>Sort by</DropdownMenuLabel>
            <DropdownMenuRadioGroup
              value={sortKey}
              onValueChange={handleSortChange}
            >
              {SORT_OPTIONS.map((option) => (
                <DropdownMenuRadioItem key={option.key} value={option.key}>
                  {option.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Content */}
      {sortedIssues.length > 0 ? (
        viewMode === "list" ? (
          <IssueList
            issues={sortedIssues}
            showProject={true}
            onIssueClick={handleIssueClick}
          />
        ) : (
          <BoardView
            initialIssues={issues}
            projectId=""
            showProject={true}
            onIssueClick={handleIssueClick}
            issueFilter={issueFilterFn}
            showHierarchy={false}
          />
        )
      ) : hasActiveFilters ? (
        <div className="flex flex-col items-center justify-center py-24">
          <h3 className="text-lg font-medium text-text mb-1">
            No matching issues
          </h3>
          <p className="text-sm text-text-muted">
            Try adjusting your filters to find what you&apos;re looking for.
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24">
          <h3 className="text-lg font-medium text-text mb-1">
            No issues assigned
          </h3>
          <p className="text-sm text-text-muted">
            Issues assigned to you will appear here.
          </p>
        </div>
      )}

      {/* Issue detail panel */}
      <IssueDetailPanel
        key={selectedIssue?.id ?? "issue-detail-empty"}
        issue={selectedIssue}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        members={members}
        sprints={sprints}
        labels={labels}
        onIssueNavigate={handleIssueClick}
      />
    </>
  );
}

export function MyIssuesContent(props: MyIssuesContentProps) {
  return (
    <Suspense>
      <MyIssuesContentInner {...props} />
    </Suspense>
  );
}
