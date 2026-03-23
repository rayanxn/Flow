"use client";

import { useState } from "react";
import { IssueEmptyState } from "@/components/issues/issue-empty-state";
import { CreateIssueModal } from "@/components/issues/create-issue-modal";

interface BoardPageEmptyProps {
  projectId: string;
  projects: { id: string; name: string; color: string }[];
  members: { user_id: string; profile: { full_name: string | null; email: string } }[];
  sprints: { id: string; name: string; status: string }[];
  labels: { id: string; name: string; color: string }[];
}

export function BoardPageEmpty({
  projectId,
  projects,
  members,
  sprints,
  labels,
}: BoardPageEmptyProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <>
      <IssueEmptyState onCreateIssue={() => setShowCreateModal(true)} />
      <CreateIssueModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        defaultProjectId={projectId}
        projects={projects}
        members={members}
        sprints={sprints}
        labels={labels}
        initialSortOrder={1000}
      />
    </>
  );
}
