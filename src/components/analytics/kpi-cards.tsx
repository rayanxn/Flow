import type { SprintKPIs } from "@/lib/queries/analytics";
import { formatDelta } from "@/lib/utils/analytics";

type KPICardProps = {
  label: string;
  value: string;
  delta: { text: string; isPositive: boolean } | null;
};

function KPICard({ label, value, delta }: KPICardProps) {
  return (
    <div className="flex flex-col grow shrink basis-0 rounded-xl gap-1.5 bg-white border border-border/50 p-5">
      <span className="text-xs font-medium text-text-muted">{label}</span>
      <div className="flex items-baseline gap-2">
        <span className="text-[32px] font-bold leading-10 text-text">
          {value}
        </span>
        {delta && (
          <span
            className="text-[13px] font-medium"
            style={{ color: delta.isPositive ? "#4A7A5C" : "#8B4049" }}
          >
            {delta.text}
          </span>
        )}
      </div>
    </div>
  );
}

export function KPICards({
  current,
  previous,
}: {
  current: SprintKPIs;
  previous: SprintKPIs | null;
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
