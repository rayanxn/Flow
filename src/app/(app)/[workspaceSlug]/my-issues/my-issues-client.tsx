"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateIssueModal } from "@/components/issues/create-issue-modal";

interface MyIssuesClientProps {
  projects: { id: string; name: string; color: string }[];
  members: { user_id: string; profile: { full_name: string | null; email: string } }[];
  sprints: { id: string; name: string; status: string; project_id: string }[];
  labels: { id: string; name: string; color: string; project_id: string }[];
  defaultAssigneeId?: string;
}

export function MyIssuesClient({
  projects,
  members,
  sprints,
  labels,
  defaultAssigneeId,
}: MyIssuesClientProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <>
      <Button
        size="sm"
        onClick={() => setShowCreateModal(true)}
        className="w-full sm:w-auto"
      >
        <Plus className="w-4 h-4 mr-1" />
        New Issue
      </Button>
      <CreateIssueModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        projects={projects}
        members={members}
        sprints={sprints}
        labels={labels}
        defaultAssigneeId={defaultAssigneeId}
      />
    </>
  );
}
