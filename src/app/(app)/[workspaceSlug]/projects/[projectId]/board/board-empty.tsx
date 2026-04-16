"use client";

import { useState } from "react";
import Link from "next/link";
import { IssueEmptyState } from "@/components/issues/issue-empty-state";
import { CreateIssueModal } from "@/components/issues/create-issue-modal";
import { CreateSprintModal } from "@/components/sprints/create-sprint-modal";
import { Button } from "@/components/ui/button";

interface BoardPageEmptyProps {
  workspaceId: string;
  workspaceSlug: string;
  projectId: string;
  projects: { id: string; name: string; color: string }[];
  members: { user_id: string; profile: { full_name: string | null; email: string } }[];
  sprints: { id: string; name: string; status: string }[];
  labels: { id: string; name: string; color: string }[];
  showFirstRunSetup?: boolean;
}

export function BoardPageEmpty({
  workspaceId,
  workspaceSlug,
  projectId,
  projects,
  members,
  sprints,
  labels,
  showFirstRunSetup = false,
}: BoardPageEmptyProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCreateSprintModal, setShowCreateSprintModal] = useState(false);

  return (
    <>
      {showFirstRunSetup ? (
        <div className="flex min-h-[calc(100vh-12rem)] items-center justify-center px-6 py-10">
          <div className="w-full max-w-3xl rounded-[28px] border border-border-input bg-surface px-8 py-10 shadow-sm">
            <div className="max-w-2xl">
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-text-muted">
                First-run setup
              </p>
              <h1 className="mt-3 font-serif text-4xl leading-tight text-text">
                Start on the board, then bring the team in.
              </h1>
              <p className="mt-4 text-sm leading-6 text-text-secondary">
                Your workspace is ready. Create the first issue or sprint from the board, and invite teammates once the project has context.
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" onClick={() => setShowCreateModal(true)}>
                Create first issue
              </Button>
              <Button
                size="lg"
                variant="secondary"
                onClick={() => setShowCreateSprintModal(true)}
              >
                Create first sprint
              </Button>
              <Link
                href={`/${workspaceSlug}/settings/members`}
                className="inline-flex items-center justify-center rounded-lg border border-border-input px-4 py-2.5 text-sm font-medium text-text transition-colors hover:bg-surface-hover"
              >
                Invite teammates
              </Link>
            </div>
          </div>
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
        initialSortOrder={1000}
      />
      <CreateSprintModal
        open={showCreateSprintModal}
        onOpenChange={setShowCreateSprintModal}
        projectId={projectId}
        workspaceId={workspaceId}
      />
    </>
  );
}
