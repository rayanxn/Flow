import { notFound } from "next/navigation";
import { getProjectIssues } from "@/lib/queries/issues";
import { getProjectById, getProjectLabels, getProjectSprints } from "@/lib/queries/projects";
import { getWorkspaceMembers } from "@/lib/queries/members";
import { getProjectActiveSprintSummary } from "@/lib/queries/sprints";
import { SprintHeader } from "@/components/sprints/sprint-header";
import { ListPageClient } from "./list-client";
import { ListViewContent } from "./list-view-content";

export default async function ListPage({
  params,
}: {
  params: Promise<{ workspaceSlug: string; projectId: string }>;
}) {
  const { workspaceSlug, projectId } = await params;

  const projectData = await getProjectById(projectId);
  if (!projectData) notFound();

  const [issues, labels, sprints, activeSprintSummary, members] = await Promise.all([
    getProjectIssues(projectId),
    getProjectLabels(projectId),
    getProjectSprints(projectId),
    getProjectActiveSprintSummary(projectId),
    getWorkspaceMembers(projectData.workspace_id),
  ]);

  const projects = [{ id: projectData.id, name: projectData.name, color: projectData.color }];
  const hasIssues = issues.length > 0;
  const maxSortOrder = issues.reduce((max, i) => Math.max(max, i.sort_order), 0);

  return (
    <div className="py-2">
      {activeSprintSummary && (
        <SprintHeader
          sprint={activeSprintSummary.sprint}
          totalIssues={activeSprintSummary.totalIssues}
          doneIssues={activeSprintSummary.doneIssues}
          totalPoints={activeSprintSummary.totalPoints}
          donePoints={activeSprintSummary.donePoints}
          workspaceSlug={workspaceSlug}
          projectId={projectId}
        />
      )}

      <ListPageClient
        projectId={projectData.id}
        projects={projects}
        members={members}
        sprints={sprints}
        labels={labels}
        hasIssues={hasIssues}
        maxSortOrder={maxSortOrder}
      />

      {hasIssues && (
        <ListViewContent issues={issues} members={members} labels={labels} />
      )}
    </div>
  );
}
