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
      <div className="flex flex-col rounded-xl gap-4 bg-white border border-border/50 p-5">
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
    <div className="flex flex-col rounded-xl gap-4 bg-white border border-border/50 p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-text">
          Sprint Burndown
        </span>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-0.5 rounded-sm bg-[#2E2E2C]" />
            <span className="text-[11px] text-text-muted">Actual</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-0.5 rounded-sm bg-[#D5D0C8] border-t border-dashed border-[#D5D0C8]" />
            <span className="text-[11px] text-text-muted">Ideal</span>
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={160}>
        <LineChart data={data}>
          <CartesianGrid
            strokeDasharray="0"
            stroke="#F0EDE7"
            vertical={false}
          />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fontFamily: "JetBrains Mono", fill: "#B8B3AB" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 10, fontFamily: "JetBrains Mono", fill: "#B8B3AB" }}
            axisLine={false}
            tickLine={false}
            width={30}
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
          <Line
            type="monotone"
            dataKey="ideal"
            stroke="#D5D0C8"
            strokeWidth={1.5}
            strokeDasharray="6 4"
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="actual"
            stroke="#2E2E2C"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 4, fill: "#2E2E2C" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
