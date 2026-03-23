"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateIssueModal } from "@/components/issues/create-issue-modal";
import { IssueEmptyState } from "@/components/issues/issue-empty-state";

interface ListPageClientProps {
  projectId: string;
  projects: { id: string; name: string; color: string }[];
  members: { user_id: string; profile: { full_name: string | null; email: string } }[];
  sprints: { id: string; name: string; status: string }[];
  labels: { id: string; name: string; color: string }[];
  hasIssues: boolean;
  maxSortOrder: number;
}

export function ListPageClient({
  projectId,
  projects,
  members,
  sprints,
  labels,
  hasIssues,
  maxSortOrder,
}: ListPageClientProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <>
      {hasIssues ? (
        <div className="flex items-center justify-end px-6 pb-2">
          <Button size="sm" variant="ghost" onClick={() => setShowCreateModal(true)}>
            <Plus className="w-4 h-4 mr-1" />
            New Issue
          </Button>
        </div>
      ) : (
        <IssueEmptyState onCreateIssue={() => setShowCreateModal(true)} />
      )}
      <CreateIssueModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        defaultProjectId={projectId}
        projects={projects}
        members={members}
        sprints={sprints}
        labels={labels}
        initialSortOrder={maxSortOrder + 1000}
      />
    </>
  );
}
