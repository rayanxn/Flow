"use client";

import type { AssigneeCount } from "@/lib/queries/analytics";

export function AssigneeChart({ data }: { data: AssigneeCount[] }) {
  if (data.length === 0) {
    return (
      <div className="flex flex-col grow shrink basis-0 gap-5 rounded-xl border border-border-input bg-surface p-5">
        <span className="text-sm font-semibold text-text">
          Issues by Assignee
        </span>
        <div className="flex items-center justify-center h-20 text-sm text-text-muted">
          No completed issues in this period.
        </div>
      </div>
    );
  }

  const maxCount = Math.max(...data.map((d) => d.count));

  return (
    <div className="flex flex-col grow shrink basis-0 gap-5 rounded-xl border border-border-input bg-surface p-5">
      <span className="text-sm font-semibold text-text">
        Issues by Assignee
      </span>
      <div className="flex flex-col gap-3.5">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-3">
            <div className="flex items-center gap-2 w-24 shrink-0">
              {item.avatarUrl ? (
                <img
                  src={item.avatarUrl}
                  alt=""
                  className="w-5 h-5 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-avatar">
                  <span className="text-[9px] font-medium text-text-muted">
                    {item.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <span className="text-xs text-text truncate">{item.name}</span>
            </div>
            <div className="grow shrink basis-0 h-5 rounded-sm overflow-clip bg-surface-inset">
              <div
                className="h-full rounded-sm transition-all"
                style={{
                  width: `${(item.count / maxCount) * 100}%`,
                  backgroundColor: "var(--color-chart-strong)",
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
