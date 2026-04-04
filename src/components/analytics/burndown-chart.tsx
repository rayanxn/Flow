"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { BurndownPoint } from "@/lib/utils/analytics";

export function BurndownChart({ data }: { data: BurndownPoint[] }) {
  if (data.length === 0) {
    return (
      <div className="flex flex-col gap-4 rounded-xl border border-border-input bg-surface p-5">
        <span className="text-sm font-semibold text-text">
          Sprint Burndown
        </span>
        <div className="flex items-center justify-center h-40 text-sm text-text-muted">
          No burndown data available.
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border-input bg-surface p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-text">
          Sprint Burndown
        </span>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="h-0.5 w-4 rounded-sm bg-[var(--color-chart-strong)]" />
            <span className="text-[11px] text-text-muted">Actual</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-0.5 w-4 rounded-sm border-t border-dashed border-[var(--color-chart-line)] bg-[var(--color-chart-line)]" />
            <span className="text-[11px] text-text-muted">Ideal</span>
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={160}>
        <LineChart data={data}>
          <CartesianGrid
            strokeDasharray="0"
            stroke="var(--color-chart-grid)"
            vertical={false}
          />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fontFamily: "JetBrains Mono", fill: "var(--color-text-muted)" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 10, fontFamily: "JetBrains Mono", fill: "var(--color-text-muted)" }}
            axisLine={false}
            tickLine={false}
            width={30}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--color-primary)",
              border: "1px solid var(--color-border-strong)",
              borderRadius: "8px",
              fontSize: "12px",
              color: "var(--color-background)",
            }}
          />
          <Line
            type="monotone"
            dataKey="ideal"
            stroke="var(--color-chart-line)"
            strokeWidth={1.5}
            strokeDasharray="6 4"
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="actual"
            stroke="var(--color-chart-strong)"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 4, fill: "var(--color-chart-strong)" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
