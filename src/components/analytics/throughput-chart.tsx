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
      <div className="flex flex-col rounded-xl gap-4 bg-white border border-border/50 p-5">
        <span className="text-sm font-semibold text-text">Throughput</span>
        <div className="flex items-center justify-center h-40 text-sm text-text-muted">
          No completed issues in this period.
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col rounded-xl gap-4 bg-white border border-border/50 p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-text">Throughput</span>
        <span className="text-[11px] text-text-muted">issues / week</span>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <CartesianGrid
            strokeDasharray="0"
            stroke="#F0EDE7"
            vertical={false}
          />
          <XAxis
            dataKey="week"
            tick={{
              fontSize: 10,
              fontFamily: "JetBrains Mono",
              fill: "#B8B3AB",
            }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{
              fontSize: 10,
              fontFamily: "JetBrains Mono",
              fill: "#B8B3AB",
            }}
            axisLine={false}
            tickLine={false}
            width={30}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#2E2E2C",
              border: "none",
              borderRadius: "8px",
              fontSize: "12px",
              color: "#F6F5F1",
            }}
          />
          <Bar
            dataKey="count"
            fill="#2E2E2C"
            radius={[4, 4, 0, 0]}
            maxBarSize={40}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
