import { notFound } from "next/navigation";
import { getWorkspaceBySlug } from "@/lib/queries/workspaces";
import {
  getWorkspaceSprints,
  getSprintAnalytics,
  getPreviousSprintKPIs,
  getSprintBurndown,
  getIssuesByLabel,
  getTeamVelocity,
} from "@/lib/queries/analytics";
import { KPICards } from "@/components/analytics/kpi-cards";
import { BurndownChart } from "@/components/analytics/burndown-chart";
import { LabelChart } from "@/components/analytics/label-chart";
import { VelocityChart } from "@/components/analytics/velocity-chart";
import { SprintSelector } from "@/components/analytics/analytics-client";

export default async function AnalyticsPage({
  params,
  searchParams,
}: {
  params: Promise<{ workspaceSlug: string }>;
  searchParams: Promise<{ sprint?: string }>;
}) {
  const [{ workspaceSlug }, resolvedSearchParams] = await Promise.all([
    params,
    searchParams,
  ]);

  const result = await getWorkspaceBySlug(workspaceSlug);
  if (!result?.workspace) notFound();

  const sprints = await getWorkspaceSprints(result.workspace.id);

  // Determine selected sprint: URL param > most recent active > most recent completed
  let selectedSprint = resolvedSearchParams.sprint
    ? sprints.find((s) => s.id === resolvedSearchParams.sprint) ?? null
    : null;

  if (!selectedSprint) {
    selectedSprint =
      sprints.find((s) => s.status === "active") ??
      sprints.find((s) => s.status === "completed") ??
      sprints[0] ??
      null;
  }

  if (!selectedSprint) {
    return (
      <div className="flex flex-col py-6 px-10 gap-6">
        <h1 className="text-[26px] font-bold text-text">Analytics</h1>
        <div className="flex flex-col items-center justify-center py-20">
          <h2 className="text-lg font-medium text-text">No sprints yet</h2>
          <p className="mt-1 text-sm text-text-muted">
            Create a sprint to see analytics data.
          </p>
        </div>
      </div>
    );
  }

  const [currentKPIs, previousKPIs, burndownData, labelData, velocityData] =
    await Promise.all([
      getSprintAnalytics(selectedSprint.id),
      getPreviousSprintKPIs(selectedSprint),
      getSprintBurndown(selectedSprint.id, selectedSprint),
      getIssuesByLabel(result.workspace.id, selectedSprint.id),
      getTeamVelocity(result.workspace.id),
    ]);

  return (
    <div className="flex flex-col py-6 px-10 gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-[26px] font-bold text-text">Analytics</h1>
        <SprintSelector
          sprints={sprints}
          selectedSprintId={selectedSprint.id}
        />
      </div>

      <KPICards current={currentKPIs} previous={previousKPIs} />

      <BurndownChart data={burndownData} />

      <div className="flex gap-4">
        <LabelChart data={labelData} />
        <VelocityChart data={velocityData} />
      </div>
    </div>
  );
}
