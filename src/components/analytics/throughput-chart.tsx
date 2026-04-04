"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { ThroughputPoint } from "@/lib/queries/analytics";

export function ThroughputChart({ data }: { data: ThroughputPoint[] }) {
  if (data.length === 0 || data.every((d) => d.count === 0)) {
    return (
      <div className="flex flex-col gap-4 rounded-xl border border-border-input bg-surface p-5">
        <span className="text-sm font-semibold text-text">Throughput</span>
        <div className="flex items-center justify-center h-40 text-sm text-text-muted">
          No completed issues in this period.
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border-input bg-surface p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-text">Throughput</span>
        <span className="text-[11px] text-text-muted">issues / week</span>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <CartesianGrid
            strokeDasharray="0"
            stroke="var(--color-chart-grid)"
            vertical={false}
          />
          <XAxis
            dataKey="week"
            tick={{
              fontSize: 10,
              fontFamily: "JetBrains Mono",
              fill: "var(--color-text-muted)",
            }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{
              fontSize: 10,
              fontFamily: "JetBrains Mono",
              fill: "var(--color-text-muted)",
            }}
            axisLine={false}
            tickLine={false}
            width={30}
            allowDecimals={false}
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
          <Bar
            dataKey="count"
            fill="var(--color-chart-strong)"
            radius={[4, 4, 0, 0]}
            maxBarSize={40}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
