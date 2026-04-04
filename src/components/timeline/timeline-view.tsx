"use client";

import { useState, useRef } from "react";
import type { TimelineIssue } from "@/lib/queries/timeline";
import type { TimelineScale } from "@/lib/utils/timeline";
import {
  SCALE_CONFIG,
  getDateRange,
  getColumnForDate,
  getColumnCount,
  generateDateHeaders,
  getTodayColumn,
} from "@/lib/utils/timeline";
import { STATUS_CONFIG } from "@/lib/utils/statuses";
import type { IssueStatus } from "@/lib/types";
import { cn } from "@/lib/utils/cn";

const SCALES: TimelineScale[] = ["day", "week", "month"];
const ROW_HEIGHT = 44;

export function TimelineView({ issues }: { issues: TimelineIssue[] }) {
  const [scale, setScale] = useState<TimelineScale>("week");
  const bodyRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  if (issues.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-20">
        <h2 className="text-lg font-medium text-text">No timeline data</h2>
        <p className="mt-1 text-sm text-text-muted">
          Issues need a due date to appear on the timeline.
        </p>
      </div>
    );
  }

  const { start, end } = getDateRange(issues);
  const colCount = getColumnCount(start, end, scale);
  const { colWidth } = SCALE_CONFIG[scale];
  const headers = generateDateHeaders(start, end, scale);
  const todayCol = getTodayColumn(start, scale);
  const gridWidth = colCount * colWidth;

  function handleScroll(e: React.UIEvent<HTMLDivElement>) {
    if (headerRef.current) {
      headerRef.current.scrollLeft = e.currentTarget.scrollLeft;
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Scale toggle */}
      <div className="flex items-center justify-end px-6 py-3 gap-1 border-b border-border/50">
        {SCALES.map((s) => (
          <button
            key={s}
            onClick={() => setScale(s)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
              scale === s
                ? "bg-primary text-background"
                : "text-text-secondary hover:bg-surface-hover"
            )}
          >
            {SCALE_CONFIG[s].label}
          </button>
        ))}
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left panel: issue list */}
        <div className="w-72 shrink-0 border-r border-border/50 flex flex-col">
          {/* Header spacer */}
          <div className="h-10 border-b border-border/50 px-4 flex items-center">
            <span className="text-[10px] font-medium uppercase tracking-widest text-text-muted font-mono">
              Issue
            </span>
          </div>
          {/* Issue rows */}
          <div className="flex-1 overflow-y-auto">
            {issues.map((issue, i) => (
              <div
                key={issue.id}
                className={cn(
                  "flex items-center gap-2 px-4 border-b border-border/20",
                  i % 2 === 1 && "bg-surface-inset/50"
                )}
                style={{ height: ROW_HEIGHT }}
              >
                <span
                  className="inline-block size-2 rounded-full shrink-0"
                  style={{
                    backgroundColor:
                      STATUS_CONFIG[issue.status as IssueStatus].color,
                  }}
                />
                <span className="text-[11px] font-mono text-text-muted shrink-0">
                  {issue.issue_key}
                </span>
                <span className="text-xs text-text truncate">
                  {issue.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right panel: timeline grid */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Date header (synced scroll) */}
          <div
            ref={headerRef}
            className="h-10 border-b border-border/50 overflow-hidden"
          >
            <div
              className="relative h-full"
              style={{ width: gridWidth }}
            >
              {headers.map((header) => (
                <div
                  key={header.column}
                  className={cn(
                    "absolute top-0 h-full flex items-center justify-center border-r border-border/20 text-[10px] font-mono",
                    header.isToday
                      ? "text-primary font-semibold"
                      : "text-text-muted"
                  )}
                  style={{
                    left: (header.column - 1) * colWidth,
                    width: colWidth,
                  }}
                >
                  {header.label}
                </div>
              ))}
            </div>
          </div>

          {/* Grid body */}
          <div
            ref={bodyRef}
            className="flex-1 overflow-auto"
            onScroll={handleScroll}
          >
            <div
              className="relative"
              style={{
                width: gridWidth,
                height: issues.length * ROW_HEIGHT,
              }}
            >
              {/* Column grid lines */}
              {headers.map((header) => (
                <div
                  key={`grid-${header.column}`}
                  className="absolute top-0 h-full border-r border-border/10"
                  style={{
                    left: (header.column - 1) * colWidth,
                    width: colWidth,
                  }}
                />
              ))}

              {/* Alternating row backgrounds */}
              {issues.map((_, i) =>
                i % 2 === 1 ? (
                  <div
                    key={`row-bg-${i}`}
                    className="absolute left-0 w-full bg-surface-inset/50"
                    style={{
                      top: i * ROW_HEIGHT,
                      height: ROW_HEIGHT,
                    }}
                  />
                ) : null
              )}

              {/* Today marker */}
              {todayCol && (
                <div
                  className="absolute top-0 h-full w-0.5 bg-primary/60 z-10"
                  style={{
                    left: (todayCol - 1) * colWidth + colWidth / 2,
                  }}
                >
                  <div className="absolute -top-0 left-1/2 -translate-x-1/2 rounded-b bg-primary px-1.5 py-0.5 font-mono text-[9px] font-semibold text-background">
                    TODAY
                  </div>
                </div>
              )}

              {/* Issue bars */}
              {issues.map((issue, i) => {
                const startCol = getColumnForDate(
                  issue.created_at,
                  start,
                  scale
                );
                const endCol = getColumnForDate(
                  issue.due_date,
                  start,
                  scale
                );
                const barStart = Math.max(0, (startCol - 1) * colWidth);
                const barEnd = Math.max(barStart + colWidth, endCol * colWidth);
                const barWidth = barEnd - barStart;
                const statusColor =
                  STATUS_CONFIG[issue.status as IssueStatus].color;

                const initials = issue.assignee?.full_name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2);

                return (
                  <div
                    key={issue.id}
                    className="absolute flex items-center"
                    style={{
                      left: barStart,
                      width: barWidth,
                      top: i * ROW_HEIGHT + 10,
                      height: ROW_HEIGHT - 20,
                    }}
                  >
                    <div
                      className="h-full w-full rounded-md flex items-center justify-end px-1.5"
                      style={{ backgroundColor: statusColor + "30" }}
                    >
                      <div
                        className="h-full rounded-md"
                        style={{
                          backgroundColor: statusColor,
                          width: "100%",
                          opacity: 0.7,
                          position: "absolute",
                          left: 0,
                          top: 0,
                          borderRadius: "6px",
                        }}
                      />
                      {issue.assignee && initials && (
                        <div
                          className="relative z-10 flex size-5 shrink-0 items-center justify-center rounded-full bg-surface/90"
                          title={
                            issue.assignee.full_name ?? undefined
                          }
                        >
                          <span className="text-[8px] font-semibold text-text">
                            {initials}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
