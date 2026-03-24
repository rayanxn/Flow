"use client";

import type { LabelCount } from "@/lib/queries/analytics";

export function LabelChart({ data }: { data: LabelCount[] }) {
  if (data.length === 0) {
    return (
      <div className="flex flex-col grow shrink basis-0 rounded-xl gap-5 bg-white border border-border/50 p-5">
        <span className="text-sm font-semibold text-text">
          Issues by Label
        </span>
        <div className="flex items-center justify-center h-20 text-sm text-text-muted">
          No label data.
        </div>
      </div>
    );
  }

  const maxCount = Math.max(...data.map((d) => d.count));

  return (
    <div className="flex flex-col grow shrink basis-0 rounded-xl gap-5 bg-white border border-border/50 p-5">
      <span className="text-sm font-semibold text-text">
        Issues by Label
      </span>
      <div className="flex flex-col gap-3.5">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-3">
            <span className="w-15 shrink-0 text-xs text-text">
              {item.name}
            </span>
            <div className="grow shrink basis-0 h-5 rounded-sm overflow-clip bg-[#F0EDE7]">
              <div
                className="h-full rounded-sm transition-all"
                style={{
                  width: `${(item.count / maxCount) * 100}%`,
                  backgroundColor: item.color,
                }}
              />
            </div>
            <span className="w-5 text-right text-[11px] font-mono text-text-muted shrink-0">
              {item.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
