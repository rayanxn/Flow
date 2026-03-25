"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Cell,
} from "recharts";
import type { CycleTimeBucket } from "@/lib/queries/analytics";

const BAR_COLORS = ["#4A7A5C", "#5C8A6E", "#7AA08A", "#9CB8A8", "#BED0C6"];

export function CycleTimeChart({ data }: { data: CycleTimeBucket[] }) {
  if (data.length === 0 || data.every((d) => d.count === 0)) {
    return (
      <div className="flex flex-col grow shrink basis-0 rounded-xl gap-4 bg-white border border-border/50 p-5">
        <span className="text-sm font-semibold text-text">
          Cycle Time Distribution
        </span>
        <div className="flex items-center justify-center h-40 text-sm text-text-muted">
          No completed issues in this period.
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col grow shrink basis-0 rounded-xl gap-4 bg-white border border-border/50 p-5">
      <span className="text-sm font-semibold text-text">
        Cycle Time Distribution
      </span>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} layout="vertical">
          <CartesianGrid
            strokeDasharray="0"
            stroke="#F0EDE7"
            horizontal={false}
          />
          <XAxis
            type="number"
            tick={{
              fontSize: 10,
              fontFamily: "JetBrains Mono",
              fill: "#B8B3AB",
            }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <YAxis
            type="category"
            dataKey="bucket"
            tick={{
              fontSize: 11,
              fontFamily: "JetBrains Mono",
              fill: "#9C9689",
            }}
            axisLine={false}
            tickLine={false}
            width={50}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#2E2E2C",
              border: "none",
              borderRadius: "8px",
              fontSize: "12px",
              color: "#F6F5F1",
            }}
            formatter={(value) => [`${value} issues`, "Count"]}
          />
          <Bar dataKey="count" radius={[0, 4, 4, 0]} maxBarSize={28}>
            {data.map((_, index) => (
              <Cell key={index} fill={BAR_COLORS[index % BAR_COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
