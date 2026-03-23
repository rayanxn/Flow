"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CreateProjectModal } from "@/components/projects/create-project-modal";

interface ProjectsPageClientProps {
  teams: { id: string; name: string }[];
}

export function ProjectsPageClient({ teams }: ProjectsPageClientProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <>
      <Button onClick={() => setShowCreateModal(true)}>New Project</Button>
      <CreateProjectModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        teams={teams}
      />
    </>
  );
}
