"use client";

import { useState, useMemo, useEffect, useCallback, Suspense } from "react";
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

type ViewMode = "list" | "board";
type SortKey = "priority" | "due_date" | "created_at" | "title" | "status";

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "priority", label: "Priority" },
  { key: "due_date", label: "Due Date" },
  { key: "created_at", label: "Created" },
  { key: "title", label: "Title" },
  { key: "status", label: "Status" },
];

const VIEW_STORAGE_KEY = "flowboard-my-issues-view";
const SORT_STORAGE_KEY = "flowboard-my-issues-sort";

interface MyIssuesContentProps {
  issues: IssueWithDetails[];
  members?: { user_id: string; profile: { id: string; full_name: string | null; email: string; avatar_url: string | null } }[];
  labels?: { id: string; name: string; color: string }[];
  projects?: { id: string; name: string; color: string }[];
}

function MyIssuesContentInner({
  issues,
  members = [],
  labels = [],
  projects = [],
}: MyIssuesContentProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [sortKey, setSortKey] = useState<SortKey>("priority");
  const [selectedIssue, setSelectedIssue] = useState<IssueWithDetails | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const openIssue = useCallback(
    (issue: IssueWithDetails) => {
      setSelectedIssue(issue);
      setDetailOpen(true);
    },
    []
  );

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

  // Load persisted state from localStorage
  useEffect(() => {
    const storedView = localStorage.getItem(VIEW_STORAGE_KEY);
    if (storedView === "list" || storedView === "board") setViewMode(storedView);
    const storedSort = localStorage.getItem(SORT_STORAGE_KEY);
    if (storedSort && SORT_OPTIONS.some((o) => o.key === storedSort)) {
      setSortKey(storedSort as SortKey);
    }
  }, []);

  function handleViewChange(mode: ViewMode) {
    setViewMode(mode);
    localStorage.setItem(VIEW_STORAGE_KEY, mode);
  }

  function handleSortChange(key: string) {
    setSortKey(key as SortKey);
    localStorage.setItem(SORT_STORAGE_KEY, key);
  }

  const handleIssueClick = useCallback(
    (id: string) => {
      const issue = issues.find((i) => i.id === id);
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
      <div className="flex items-center gap-3">
        {/* View toggle */}
        <div className="flex items-center rounded-lg overflow-hidden bg-[#EDEAE4] p-0.5 gap-0.5">
          <button
            onClick={() => handleViewChange("list")}
            className={cn(
              "px-3.5 py-1.5 text-sm font-medium rounded-md transition-colors",
              viewMode === "list"
                ? "bg-white text-text"
                : "text-text-secondary hover:text-text"
            )}
          >
            List
          </button>
          <button
            onClick={() => handleViewChange("board")}
            className={cn(
              "px-3.5 py-1.5 text-sm font-medium rounded-md transition-colors",
              viewMode === "board"
                ? "bg-white text-text"
                : "text-text-secondary hover:text-text"
            )}
          >
            Board
          </button>
        </div>

        {/* Sort dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-text-secondary border border-border rounded-lg hover:bg-surface-hover transition-colors">
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
        issue={selectedIssue}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        members={members}
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
