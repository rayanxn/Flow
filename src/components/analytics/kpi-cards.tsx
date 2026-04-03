import type { SprintKPIs } from "@/lib/queries/analytics";
import { formatDelta } from "@/lib/utils/analytics";
import { KPICard } from "./kpi-card";

export function KPICards({
  current,
  previous,
}: {
  current: SprintKPIs;
  previous: SprintKPIs | null;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
        label="Velocity"
        value={String(current.velocity)}
        delta={
          previous
            ? (() => {
                const d = formatDelta(current.velocity, previous.velocity);
                return d ? { ...d, text: `${current.velocity} pts/sprint` } : null;
              })()
            : { text: "pts/sprint", isPositive: true }
        }
      />
      <KPICard
        label="Completion Rate"
        value={`${current.completionRate}%`}
        delta={
          previous
            ? formatDelta(
                current.completionRate,
                previous.completionRate,
                "%"
              )
            : null
        }
      />
    </div>
  );
}
