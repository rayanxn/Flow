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
  const [{ workspaceSlug, projectId }, resolvedSearchParams] = await Promise.all([
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
  // 1. URL param ?sprint=<id> if it matches any sprint, including completed
  // 2. First "planning" sprint
  // 3. First "active" sprint
  // 4. Most recent completed sprint
  const activeSelectableSprints = sprints.filter((s) => s.status !== "completed");
  const selectedSprint =
    (resolvedSearchParams.sprint
      ? sprints.find((s) => s.id === resolvedSearchParams.sprint) ?? null
      : null) ??
    activeSelectableSprints.find((s) => s.status === "planning") ??
    activeSelectableSprints.find((s) => s.status === "active") ??
    sprints.find((s) => s.status === "completed") ??
    null;

  // Fetch backlog (excluding the selected sprint) and sprint issues in parallel
  const [backlogIssuesRaw, sprintIssues] = await Promise.all([
    getBacklogIssues(projectId, selectedSprint?.id),
    selectedSprint ? getSprintIssues(selectedSprint.id) : Promise.resolve([]),
  ]);
  const sprintIssueIds = new Set(sprintIssues.map((issue) => issue.id));
  const backlogIssues = backlogIssuesRaw.filter((issue) => !sprintIssueIds.has(issue.id));

  const planningViewKey = [
    selectedSprint?.id ?? "no-sprint",
    backlogIssues.map((issue) => issue.id).join(","),
    sprintIssues.map((issue) => issue.id).join(","),
  ].join(":");

  return (
    <SprintPlanningView
      key={planningViewKey}
      workspaceSlug={workspaceSlug}
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
