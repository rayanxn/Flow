import { notFound } from "next/navigation";
import { getProjectById } from "@/lib/queries/projects";
import { getTimelineIssues } from "@/lib/queries/timeline";
import { TimelineView } from "@/components/timeline/timeline-view";

export default async function TimelinePage({
  params,
}: {
  params: Promise<{ workspaceSlug: string; projectId: string }>;
}) {
  const { projectId } = await params;

  const project = await getProjectById(projectId);
  if (!project) notFound();

  const issues = await getTimelineIssues(projectId);

  return <TimelineView issues={issues} />;
}
