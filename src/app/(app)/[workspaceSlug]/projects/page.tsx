import { notFound } from "next/navigation";
import { FolderKanban } from "lucide-react";
import { getWorkspaceBySlug } from "@/lib/queries/workspaces";
import { getProjectsWithStats } from "@/lib/queries/projects";
import { getWorkspaceTeams } from "@/lib/queries/members";
import { ProjectCard } from "@/components/projects/project-card";
import { EmptyState } from "@/components/ui/empty-state";
import { ProjectsPageClient } from "./projects-client";

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ workspaceSlug: string }>;
}) {
  const { workspaceSlug } = await params;

  const result = await getWorkspaceBySlug(workspaceSlug);
  if (!result?.workspace) notFound();

  const workspaceId = result.workspace.id;
  const [projects, teams] = await Promise.all([
    getProjectsWithStats(workspaceId),
    getWorkspaceTeams(workspaceId),
  ]);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-serif text-text">Projects</h1>
        <ProjectsPageClient teams={teams} />
      </div>

      {/* Grid */}
      {projects.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              id={project.id}
              name={project.name}
              description={project.description}
              color={project.color}
              lead={project.lead}
              issueCounts={project.issue_counts}
              totalIssues={project.total_issues}
              updatedAt={project.updated_at}
              workspaceSlug={workspaceSlug}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={FolderKanban}
          title="No projects yet"
          description="Create your first project to start tracking work."
        />
      )}
    </div>
  );
}
