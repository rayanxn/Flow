import { notFound } from "next/navigation";
import { getProjectIssues } from "@/lib/queries/issues";
import { getProjectById, getProjectLabels, getProjectSprints } from "@/lib/queries/projects";
import { getWorkspaceMembers } from "@/lib/queries/members";
import { SprintHeader } from "@/components/sprints/sprint-header";
import { ListPageClient } from "./list-client";
import { ListWithDetail } from "./list-with-detail";

export default async function ListPage({
  params,
}: {
  params: Promise<{ workspaceSlug: string; projectId: string }>;
}) {
  const { projectId } = await params;

  const projectData = await getProjectById(projectId);
  if (!projectData) notFound();

  const [issues, labels, sprints, members] = await Promise.all([
    getProjectIssues(projectId),
    getProjectLabels(projectId),
    getProjectSprints(projectId),
    getWorkspaceMembers(projectData.workspace_id),
  ]);

  const projects = [{ id: projectData.id, name: projectData.name, color: projectData.color }];
  const hasIssues = issues.length > 0;
  const maxSortOrder = issues.reduce((max, i) => Math.max(max, i.sort_order), 0);

  const activeSprint = sprints.find((s) => s.status === "active");
  const sprintIssues = activeSprint
    ? issues.filter((i) => i.sprint_id === activeSprint.id)
    : [];
  const sprintDone = sprintIssues.filter((i) => i.status === "done");

  return (
    <div className="py-2">
      {activeSprint && (
        <SprintHeader
          sprint={activeSprint}
          totalIssues={sprintIssues.length}
          doneIssues={sprintDone.length}
          totalPoints={sprintIssues.reduce((s, i) => s + (i.story_points ?? 0), 0)}
          donePoints={sprintDone.reduce((s, i) => s + (i.story_points ?? 0), 0)}
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
        <ListWithDetail issues={issues} members={members} />
      )}
    </div>
  );
}
