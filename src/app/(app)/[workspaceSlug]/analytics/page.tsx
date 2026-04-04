import { notFound } from "next/navigation";
import { getWorkspaceBySlug } from "@/lib/queries/workspaces";
import {
  getWorkspaceSprints,
  getSprintAnalytics,
  getPreviousSprintKPIs,
  getSprintBurndown,
  getIssuesByLabel,
  getTeamVelocity,
  getSprintSnapshot,
  getOverviewKPIs,
  getThroughputSeries,
  getCycleTimeDistribution,
  getAssigneeBreakdown,
} from "@/lib/queries/analytics";
import { parseRange, computeDateRange } from "@/lib/utils/analytics";
import { KPICards } from "@/components/analytics/kpi-cards";
import { BurndownChart } from "@/components/analytics/burndown-chart";
import { LabelChart } from "@/components/analytics/label-chart";
import { VelocityChart } from "@/components/analytics/velocity-chart";
import { SprintSelector } from "@/components/analytics/analytics-client";
import { AnalyticsTabs } from "@/components/analytics/analytics-tabs";
import { TimeRangeSelector } from "@/components/analytics/time-range-selector";
import { OverviewKPICards } from "@/components/analytics/overview-kpi-cards";
import { ThroughputChart } from "@/components/analytics/throughput-chart";
import { CycleTimeChart } from "@/components/analytics/cycle-time-chart";
import { AssigneeChart } from "@/components/analytics/assignee-chart";
import { SprintSnapshotCard } from "@/components/analytics/sprint-snapshot-card";
import { Breadcrumb } from "@/components/ui/breadcrumb";

export default async function AnalyticsPage({
  params,
  searchParams,
}: {
  params: Promise<{ workspaceSlug: string }>;
  searchParams: Promise<{ tab?: string; range?: string; sprint?: string }>;
}) {
  const [{ workspaceSlug }, resolvedSearchParams] = await Promise.all([
    params,
    searchParams,
  ]);

  const result = await getWorkspaceBySlug(workspaceSlug);
  if (!result?.workspace) notFound();

  const sprints = await getWorkspaceSprints(result.workspace.id);
  const hasSprints = sprints.length > 0;

  // Determine active tab — fall back to overview if no sprints
  const activeTab: "overview" | "sprints" =
    resolvedSearchParams.tab === "sprints" && hasSprints ? "sprints" : "overview";

  const range = parseRange(resolvedSearchParams.range);

  // --- Overview tab data ---
  if (activeTab === "overview") {
    const { rangeStart, rangeEnd, prevRangeStart, prevRangeEnd, days } =
      computeDateRange(range);

    const [kpiData, throughputData, cycleTimeData, assigneeData] =
      await Promise.all([
        getOverviewKPIs(
          result.workspace.id,
          rangeStart,
          rangeEnd,
          prevRangeStart,
          prevRangeEnd,
          days
        ),
        getThroughputSeries(result.workspace.id, rangeStart, rangeEnd),
        getCycleTimeDistribution(result.workspace.id, rangeStart, rangeEnd),
        getAssigneeBreakdown(result.workspace.id, rangeStart, rangeEnd),
      ]);

    return (
      <div className="flex flex-col py-6 px-10 gap-6">
        <Breadcrumb
          workspaceName={result.workspace.name}
          pageName="Analytics"
        />
        <div className="flex items-center justify-between">
          <h1 className="text-[26px] font-bold text-text">Analytics</h1>
          <TimeRangeSelector activeRange={range} />
        </div>

        <AnalyticsTabs activeTab={activeTab} hasSprints={hasSprints} />

        <OverviewKPICards
          current={kpiData.current}
          previous={kpiData.previous}
        />

        <ThroughputChart data={throughputData} />

        <div className="flex gap-4">
          <CycleTimeChart data={cycleTimeData} />
          <AssigneeChart data={assigneeData} />
        </div>
      </div>
    );
  }

  // --- Sprints tab data ---
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
    // Shouldn't happen since hasSprints is true, but handle gracefully
    return (
      <div className="flex flex-col py-6 px-10 gap-6">
        <Breadcrumb
          workspaceName={result.workspace.name}
          pageName="Analytics"
        />
        <h1 className="text-[26px] font-bold text-text">Analytics</h1>
        <AnalyticsTabs activeTab="overview" hasSprints={false} />
      </div>
    );
  }

  const [currentKPIs, previousKPIs, burndownData, labelData, velocityData, snapshot] =
    await Promise.all([
      getSprintAnalytics(selectedSprint.id),
      getPreviousSprintKPIs(selectedSprint),
      getSprintBurndown(selectedSprint.id, selectedSprint),
      getIssuesByLabel(result.workspace.id, selectedSprint.id),
      getTeamVelocity(result.workspace.id),
      getSprintSnapshot(selectedSprint),
    ]);

  return (
    <div className="flex flex-col py-6 px-10 gap-6">
      <Breadcrumb workspaceName={result.workspace.name} pageName="Analytics" />
      <div className="flex items-center justify-between">
        <h1 className="text-[26px] font-bold text-text">Analytics</h1>
        <SprintSelector
          sprints={sprints}
          selectedSprintId={selectedSprint.id}
        />
      </div>

      <AnalyticsTabs activeTab={activeTab} hasSprints={hasSprints} />

      <SprintSnapshotCard
        snapshot={snapshot}
        workspaceSlug={workspaceSlug}
      />

      <KPICards current={currentKPIs} previous={previousKPIs} />

      <BurndownChart data={burndownData} />

      <div className="flex gap-4">
        <LabelChart data={labelData} />
        <VelocityChart data={velocityData} />
      </div>
    </div>
  );
}
