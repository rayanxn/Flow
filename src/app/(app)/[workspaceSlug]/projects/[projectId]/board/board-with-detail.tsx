"use client";

import { useState, useCallback, Suspense } from "react";
import { BoardView } from "@/components/board/board-view";
import { IssueDetailModal } from "@/components/issues/issue-detail-modal";
import { FilterBar } from "@/components/filters/filter-bar";
import { useIssueFilters } from "@/lib/hooks/use-issue-filters";
import type { IssueWithDetails } from "@/lib/queries/issues";

interface BoardWithDetailProps {
  initialIssues: IssueWithDetails[];
  projectId: string;
  members?: { user_id: string; profile: { id: string; full_name: string | null; email: string; avatar_url: string | null } }[];
  labels?: { id: string; name: string; color: string }[];
}

function BoardWithDetailInner({
  initialIssues,
  projectId,
  members = [],
  labels = [],
}: BoardWithDetailProps) {
  const [selectedIssue, setSelectedIssue] = useState<IssueWithDetails | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

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
    (id: string) => {
      const issue = initialIssues.find((i) => i.id === id);
      if (issue) {
        setSelectedIssue(issue);
        setDetailOpen(true);
      }
    },
    [initialIssues]
  );

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
      <IssueDetailModal
        issue={selectedIssue}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        members={members}
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
