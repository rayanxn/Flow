"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CreateProjectModal } from "@/components/projects/create-project-modal";

interface ProjectsPageClientProps {
  teams: { id: string; name: string }[];
  members: { user_id: string; profile: { full_name: string | null; email: string } }[];
}

export function ProjectsPageClient({ teams, members }: ProjectsPageClientProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <>
      <Button onClick={() => setShowCreateModal(true)}>New Project</Button>
      <CreateProjectModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        teams={teams}
        members={members}
      />
    </>
  );
}
