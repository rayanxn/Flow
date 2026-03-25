"use client";

import { useState, useCallback, Suspense } from "react";
import { IssueList } from "@/components/issues/issue-list";
import { IssueDetailModal } from "@/components/issues/issue-detail-modal";
import { FilterBar } from "@/components/filters/filter-bar";
import { useIssueFilters } from "@/lib/hooks/use-issue-filters";
import type { IssueWithDetails } from "@/lib/queries/issues";

interface ListViewContentProps {
  issues: IssueWithDetails[];
  members: { user_id: string; profile: { full_name: string | null; email: string } }[];
  labels: { id: string; name: string; color: string }[];
}

function ListViewContentInner({ issues, members, labels }: ListViewContentProps) {
  const [selectedIssue, setSelectedIssue] = useState<IssueWithDetails | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const {
    filters,
    searchQuery,
    setSearchQuery,
    toggleFilter,
    clearFilter,
    clearAll,
    filteredIssues,
    hasActiveFilters,
    searchInputRef,
  } = useIssueFilters({
    issues,
    enabledFilters: ["status", "priority", "assignee", "label"],
  });

  const handleIssueClick = useCallback(
    (id: string) => {
      const issue = issues.find((i) => i.id === id);
      if (issue) {
        setSelectedIssue(issue);
        setDetailOpen(true);
      }
    },
    [issues]
  );

  return (
    <>
      <div className="px-6 pb-2">
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
      <IssueList
        issues={filteredIssues}
        showProject={false}
        onIssueClick={handleIssueClick}
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

export function ListViewContent(props: ListViewContentProps) {
  return (
    <Suspense>
      <ListViewContentInner {...props} />
    </Suspense>
  );
}
