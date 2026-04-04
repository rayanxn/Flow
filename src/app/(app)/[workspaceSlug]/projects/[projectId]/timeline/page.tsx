import { notFound } from "next/navigation";
import { getProjectById } from "@/lib/queries/projects";
import { getTimelineIssues } from "@/lib/queries/timeline";
import { getProjectActiveSprintSummary } from "@/lib/queries/sprints";
import { SprintHeader } from "@/components/sprints/sprint-header";
import { TimelineView } from "@/components/timeline/timeline-view";

export default async function TimelinePage({
  params,
}: {
  params: Promise<{ workspaceSlug: string; projectId: string }>;
}) {
  const { workspaceSlug, projectId } = await params;

  const project = await getProjectById(projectId);
  if (!project) notFound();

  const [issues, activeSprintSummary] = await Promise.all([
    getTimelineIssues(projectId),
    getProjectActiveSprintSummary(projectId),
  ]);

  return (
    <div className="flex h-full flex-col">
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
        <TimelineView issues={issues} />
      </div>
    </div>
  );
}
