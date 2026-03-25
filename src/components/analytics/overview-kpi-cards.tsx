import type { OverviewKPIs } from "@/lib/queries/analytics";
import { formatDelta } from "@/lib/utils/analytics";
import { KPICard } from "./kpi-card";

export function OverviewKPICards({
  current,
  previous,
}: {
  current: OverviewKPIs;
  previous: OverviewKPIs | null;
}) {
  return (
    <div className="flex gap-4">
      <KPICard
        label="Issues Completed"
        value={String(current.issuesCompleted)}
        delta={
          previous
            ? formatDelta(current.issuesCompleted, previous.issuesCompleted)
            : null
        }
      />
      <KPICard
        label="Avg Cycle Time"
        value={`${current.avgCycleTime}d`}
        delta={
          previous
            ? formatDelta(current.avgCycleTime, previous.avgCycleTime, "d")
            : null
        }
      />
      <KPICard
        label="Throughput"
        value={`${current.throughput}`}
        delta={
          previous
            ? formatDelta(current.throughput, previous.throughput, "/wk")
            : { text: "/wk", isPositive: true }
        }
      />
      <KPICard
        label="Points Delivered"
        value={String(current.pointsDelivered)}
        delta={
          previous
            ? formatDelta(current.pointsDelivered, previous.pointsDelivered, " pts")
            : null
        }
      />
    </div>
  );
}
