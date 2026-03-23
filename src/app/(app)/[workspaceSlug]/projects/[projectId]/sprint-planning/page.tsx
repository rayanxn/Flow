import { notFound } from "next/navigation";
import { getProjectById, getProjectSprints } from "@/lib/queries/projects";
import { getWorkspaceMembers } from "@/lib/queries/members";
import { getBacklogIssues, getSprintIssues } from "@/lib/queries/sprints";
import { SprintPlanningView } from "@/components/sprints/sprint-planning-view";

export default async function SprintPlanningPage({
  params,
  searchParams,
}: {
  params: Promise<{ workspaceSlug: string; projectId: string }>;
  searchParams: Promise<{ sprint?: string }>;
}) {
  const [{ projectId }, resolvedSearchParams] = await Promise.all([
    params,
    searchParams,
  ]);

  const projectData = await getProjectById(projectId);
  if (!projectData) notFound();

  const [sprints, members] = await Promise.all([
    getProjectSprints(projectId),
    getWorkspaceMembers(projectData.workspace_id),
  ]);

  // Determine which sprint to show:
  // 1. URL param ?sprint=<id> if it matches a valid sprint
  // 2. First "planning" sprint
  // 3. First "active" sprint
  const selectableSprints = sprints.filter((s) => s.status !== "completed");
  let selectedSprint =
    resolvedSearchParams.sprint
      ? selectableSprints.find((s) => s.id === resolvedSearchParams.sprint) ?? null
      : null;

  if (!selectedSprint) {
    selectedSprint =
      selectableSprints.find((s) => s.status === "planning") ??
      selectableSprints.find((s) => s.status === "active") ??
      null;
  }

  // Fetch backlog (excluding the selected sprint) and sprint issues in parallel
  const [backlogIssues, sprintIssues] = await Promise.all([
    getBacklogIssues(projectId, selectedSprint?.id),
    selectedSprint ? getSprintIssues(selectedSprint.id) : Promise.resolve([]),
  ]);

  return (
    <SprintPlanningView
      projectId={projectData.id}
      workspaceId={projectData.workspace_id}
      sprint={selectedSprint}
      sprints={sprints}
      initialBacklogIssues={backlogIssues}
      initialSprintIssues={sprintIssues}
      members={members}
    />
  );
}
