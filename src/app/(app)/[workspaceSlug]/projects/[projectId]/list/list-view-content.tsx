"use client";

import { useState, useCallback, Suspense } from "react";
import { IssueList } from "@/components/issues/issue-list";
import { IssueDetailPanel } from "@/components/issues/issue-detail-panel";
import { useIssueFromUrl } from "@/lib/hooks/use-issue-from-url";
import { FilterBar } from "@/components/filters/filter-bar";
import { useIssueFilters } from "@/lib/hooks/use-issue-filters";
import type { IssueWithDetails } from "@/lib/queries/issues";
import { getIssueClient } from "@/lib/queries/issues-client";

interface ListViewContentProps {
  issues: IssueWithDetails[];
  members: { user_id: string; profile: { full_name: string | null; email: string } }[];
  sprints: { id: string; name: string; status: string; project_id?: string }[];
  labels: { id: string; name: string; color: string }[];
}

function ListViewContentInner({ issues, members, sprints, labels }: ListViewContentProps) {
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);
  const [selectedIssueFallback, setSelectedIssueFallback] = useState<IssueWithDetails | null>(null);
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

  const handleIssueClick = useCallback(
    async (id: string) => {
      const issue = issues.find((i) => i.id === id) ?? (await getIssueClient(id));
      if (issue) openIssue(issue);
    },
    [issues, openIssue]
  );

  useIssueFromUrl(issues, openIssue);

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
        treeMode
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

export function ListViewContent(props: ListViewContentProps) {
  return (
    <Suspense>
      <ListViewContentInner {...props} />
    </Suspense>
  );
}
