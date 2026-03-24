"use client";

import type { VelocityPoint } from "@/lib/queries/analytics";

export function VelocityChart({ data }: { data: VelocityPoint[] }) {
  if (data.length === 0) {
    return (
      <div className="flex flex-col grow shrink basis-0 rounded-xl gap-5 bg-white border border-border/50 p-5">
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
    <div className="flex flex-col grow shrink basis-0 rounded-xl gap-5 bg-white border border-border/50 p-5">
      <span className="text-sm font-semibold text-text">
        Team Velocity
      </span>
      <div className="flex items-end grow shrink basis-0 pt-2 gap-6">
        {data.map((item, i) => {
          const isLast = i === data.length - 1;
          const height =
            maxPoints > 0 ? (item.points / maxPoints) * maxHeight : 0;

          // Color gradient from light to dark
          const colors = ["#E8E4DE", "#DFD9D2", "#D6CFC6", "#2E2E2C"];
          const colorIndex = Math.min(
            i + (4 - data.length),
            colors.length - 1
          );
          const barColor = isLast ? "#2E2E2C" : colors[Math.max(0, colorIndex)];

          return (
            <div
              key={item.name}
              className="flex flex-col items-center grow shrink basis-0 gap-2"
            >
              <div
                className="w-full rounded-md shrink-0 transition-all"
                style={{
                  height: `${height}px`,
                  backgroundColor: barColor,
                }}
              />
              <span
                className="text-[10px] font-mono"
                style={{
                  color: isLast ? "#2E2E2C" : "#B8B3AB",
                  fontWeight: isLast ? 600 : 400,
                }}
              >
                {item.name}
              </span>
              <span
                className="text-xs"
                style={{
                  color: isLast ? "#2D2A26" : "#9C9689",
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
