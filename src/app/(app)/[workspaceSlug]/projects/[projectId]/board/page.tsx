import { notFound } from "next/navigation";
import { getProjectIssues } from "@/lib/queries/issues";
import {
  getProjectById,
  getProjectLabels,
  getProjectSprints,
} from "@/lib/queries/projects";
import { getWorkspaceMembers } from "@/lib/queries/members";
import { getWorkspaceBySlug } from "@/lib/queries/workspaces";
import { getProjectActiveSprintSummary } from "@/lib/queries/sprints";
import { SprintHeader } from "@/components/sprints/sprint-header";
import { BoardPageEmpty } from "./board-empty";
import { BoardWithDetail } from "./board-with-detail";

export default async function BoardPage({
  params,
}: {
  params: Promise<{ workspaceSlug: string; projectId: string }>;
}) {
  const { workspaceSlug, projectId } = await params;

  const projectData = await getProjectById(projectId);
  if (!projectData) notFound();

  const [issues, labels, sprints, activeSprintSummary, members, workspaceResult] = await Promise.all([
    getProjectIssues(projectId),
    getProjectLabels(projectId),
    getProjectSprints(projectId),
    getProjectActiveSprintSummary(projectId),
    getWorkspaceMembers(projectData.workspace_id),
    getWorkspaceBySlug(workspaceSlug),
  ]);

  const showFirstRunSetup = Boolean(
    workspaceResult &&
    workspaceResult.role === "owner" &&
    workspaceResult.primary_project_id === projectData.id,
  );

  if (issues.length === 0) {
    const projects = [{ id: projectData.id, name: projectData.name, color: projectData.color }];
    return (
      <BoardPageEmpty
        workspaceId={projectData.workspace_id}
        workspaceSlug={workspaceSlug}
        projectId={projectData.id}
        projects={projects}
        members={members}
        sprints={sprints}
        labels={labels}
        showFirstRunSetup={showFirstRunSetup}
      />
    );
  }

  return (
    <div className="h-full flex flex-col">
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
      <div className="flex-1">
        <BoardWithDetail
          initialIssues={issues}
          projectId={projectId}
          members={members}
          sprints={sprints}
          labels={labels}
        />
      </div>
    </div>
  );
}
