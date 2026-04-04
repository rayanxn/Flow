"use client";

import type { VelocityPoint } from "@/lib/queries/analytics";

export function VelocityChart({ data }: { data: VelocityPoint[] }) {
  if (data.length === 0) {
    return (
      <div className="flex flex-col grow shrink basis-0 gap-5 rounded-xl border border-border-input bg-surface p-5">
        <span className="text-sm font-semibold text-text">
          Team Velocity
        </span>
        <div className="flex items-center justify-center h-20 text-sm text-text-muted">
          No velocity data.
        </div>
      </div>
    );
  }

  const maxPoints = Math.max(...data.map((d) => d.points));
  const maxHeight = 120; // px

  return (
    <div className="flex flex-col grow shrink basis-0 gap-5 rounded-xl border border-border-input bg-surface p-5">
      <span className="text-sm font-semibold text-text">
        Team Velocity
      </span>
      <div className="flex items-end pt-2 gap-6 justify-center flex-1">
        {data.map((item, i) => {
          const isLast = i === data.length - 1;
          const height =
            maxPoints > 0 ? (item.points / maxPoints) * maxHeight : 0;

          const colors = [
            "var(--color-chart-highlight)",
            "var(--color-chart-muted)",
            "var(--color-chart-line)",
            "var(--color-chart-strong)",
          ];
          const colorIndex = Math.min(
            i + (4 - data.length),
            colors.length - 1
          );
          const barColor = isLast ? "var(--color-chart-strong)" : colors[Math.max(0, colorIndex)];

          return (
            <div
              key={item.name}
              className="flex flex-col items-center w-16 gap-2"
            >
              <div
                className="w-10 rounded-md shrink-0 transition-all"
                style={{
                  height: `${height}px`,
                  backgroundColor: barColor,
                }}
              />
              <span
                className="text-[10px] font-mono"
                style={{
                  color: isLast ? "var(--color-text)" : "var(--color-text-muted)",
                  fontWeight: isLast ? 600 : 400,
                }}
              >
                {item.name}
              </span>
              <span
                className="text-xs"
                style={{
                  color: isLast ? "var(--color-text)" : "var(--color-text-secondary)",
                  fontWeight: isLast ? 600 : 400,
                }}
              >
                {item.points}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
