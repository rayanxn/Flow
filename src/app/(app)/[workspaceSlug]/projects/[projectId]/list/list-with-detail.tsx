"use client";

import { useState, useCallback } from "react";
import { IssueList } from "@/components/issues/issue-list";
import { IssueDetailPanel } from "@/components/issues/issue-detail-panel";
import { useIssueFromUrl } from "@/lib/hooks/use-issue-from-url";
import type { IssueWithDetails } from "@/lib/queries/issues";

interface ListWithDetailProps {
  issues: IssueWithDetails[];
  members?: { user_id: string; profile: { full_name: string | null; email: string } }[];
}

export function ListWithDetail({ issues, members = [] }: ListWithDetailProps) {
  const [selectedIssue, setSelectedIssue] = useState<IssueWithDetails | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const openIssue = useCallback(
    (issue: IssueWithDetails) => {
      setSelectedIssue(issue);
      setDetailOpen(true);
    },
    []
  );

  const handleIssueClick = useCallback(
    (id: string) => {
      const issue = issues.find((i) => i.id === id);
      if (issue) openIssue(issue);
    },
    [issues, openIssue]
  );

  useIssueFromUrl(issues, openIssue);

  return (
    <>
      <IssueList
        issues={issues}
        showProject={false}
        onIssueClick={handleIssueClick}
      />
      <IssueDetailPanel
        issue={selectedIssue}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        members={members}
      />
    </>
  );
}
