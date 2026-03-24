"use client";

import { useState, useCallback } from "react";
import { BoardView } from "@/components/board/board-view";
import { IssueDetailModal } from "@/components/issues/issue-detail-modal";
import type { IssueWithDetails } from "@/lib/queries/issues";

interface BoardWithDetailProps {
  initialIssues: IssueWithDetails[];
  projectId: string;
  members?: { user_id: string; profile: { full_name: string | null; email: string } }[];
}

export function BoardWithDetail({
  initialIssues,
  projectId,
  members = [],
}: BoardWithDetailProps) {
  const [selectedIssue, setSelectedIssue] = useState<IssueWithDetails | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

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
      <BoardView
        initialIssues={initialIssues}
        projectId={projectId}
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
