"use client";

import { useState, useCallback, Suspense } from "react";
import { BoardView } from "@/components/board/board-view";
import { IssueDetailPanel } from "@/components/issues/issue-detail-panel";
import { useIssueFromUrl } from "@/lib/hooks/use-issue-from-url";
import { FilterBar } from "@/components/filters/filter-bar";
import { useIssueFilters } from "@/lib/hooks/use-issue-filters";
import type { IssueWithDetails } from "@/lib/queries/issues";
import { getIssueClient } from "@/lib/queries/issues-client";

interface BoardWithDetailProps {
  initialIssues: IssueWithDetails[];
  projectId: string;
  members?: { user_id: string; profile: { id: string; full_name: string | null; email: string; avatar_url: string | null } }[];
  sprints?: { id: string; name: string; status: string; project_id?: string }[];
  labels?: { id: string; name: string; color: string }[];
}

function BoardWithDetailInner({
  initialIssues,
  projectId,
  members = [],
  sprints = [],
  labels = [],
}: BoardWithDetailProps) {
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
    ? initialIssues.find((issue) => issue.id === selectedIssueId) ?? selectedIssueFallback
    : null;

  const {
    filters,
    searchQuery,
    setSearchQuery,
    toggleFilter,
    clearFilter,
    clearAll,
    hasActiveFilters,
    issueFilterFn,
    searchInputRef,
  } = useIssueFilters({
    issues: initialIssues,
    enabledFilters: ["status", "priority", "assignee", "label"],
  });

  const handleIssueClick = useCallback(
    async (id: string) => {
      const issue =
        initialIssues.find((item) => item.id === id) ??
        (await getIssueClient(id));
      if (issue) openIssue(issue);
    },
    [initialIssues, openIssue]
  );

  useIssueFromUrl(initialIssues, openIssue);

  return (
    <>
      <div className="px-6 pt-4">
        <FilterBar
          filters={filters}
          searchQuery={searchQuery}
          searchInputRef={searchInputRef}
          onSearchChange={setSearchQuery}
          onToggleFilter={toggleFilter}
          onClearFilter={clearFilter}
          onClearAll={clearAll}
          hasActiveFilters={hasActiveFilters}
          enabledFilters={["status", "priority", "assignee", "label"]}
          members={members}
          labels={labels}
        />
      </div>
      <BoardView
        initialIssues={initialIssues}
        projectId={projectId}
        onIssueClick={handleIssueClick}
        issueFilter={issueFilterFn}
      />
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

export function BoardWithDetail(props: BoardWithDetailProps) {
  return (
    <Suspense>
      <BoardWithDetailInner {...props} />
    </Suspense>
  );
}
