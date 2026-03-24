"use client";

import { useRouter } from "next/navigation";
import type { Tables, ViewFilters, IssueStatus, IssuePriority } from "@/lib/types";
import type { IssueWithDetails } from "@/lib/queries/issues";
import { STATUS_CONFIG } from "@/lib/utils/statuses";
import { PRIORITY_CONFIG } from "@/lib/utils/priorities";
import { ViewIssueTable } from "./view-issue-table";

function getFilterChipDetails(
  filters: ViewFilters
): { key: string; label: string; filterKey: keyof ViewFilters; value?: string }[] {
  const chips: { key: string; label: string; filterKey: keyof ViewFilters; value?: string }[] = [];

  if (filters.status?.length) {
    for (const s of filters.status) {
      chips.push({
        key: `status-${s}`,
        label: STATUS_CONFIG[s].label,
        filterKey: "status",
        value: s,
      });
    }
  }
  if (filters.priority?.length) {
    for (const p of filters.priority) {
      chips.push({
        key: `priority-${p}`,
        label: PRIORITY_CONFIG[p].label,
        filterKey: "priority",
        value: String(p),
      });
    }
  }

  return chips;
}

export function ViewDetailClient({
  view,
  issues,
  workspaceSlug,
}: {
  view: Tables<"views">;
  issues: IssueWithDetails[];
  workspaceSlug: string;
}) {
  const router = useRouter();
  const filters = (view.filters ?? {}) as ViewFilters;
  const chips = getFilterChipDetails(filters);

  function removeChip(chip: { filterKey: keyof ViewFilters; value?: string }) {
    const newFilters = { ...filters };

    if (chip.filterKey === "status" && chip.value) {
      newFilters.status = (newFilters.status ?? []).filter(
        (s) => s !== chip.value
      );
      if (newFilters.status.length === 0) delete newFilters.status;
    } else if (chip.filterKey === "priority" && chip.value) {
      newFilters.priority = (newFilters.priority ?? []).filter(
        (p) => String(p) !== chip.value
      );
      if (newFilters.priority.length === 0) delete newFilters.priority;
    }

    // Build URL params from remaining filters
    const params = new URLSearchParams();
    if (newFilters.status?.length) params.set("status", newFilters.status.join(","));
    if (newFilters.priority?.length) params.set("priority", newFilters.priority.join(","));

    const qs = params.toString();
    router.push(
      `/${workspaceSlug}/views/${view.id}${qs ? `?${qs}` : ""}`
    );
  }

  return (
    <div className="flex flex-col py-6 px-8 gap-5">
      <div className="flex items-center gap-2 text-xs font-mono text-text-muted">
        <span className="opacity-50">{workspaceSlug}</span>
        <span className="opacity-30">/</span>
        <span className="opacity-50">Views</span>
        <span className="opacity-30">/</span>
        <span className="text-text font-medium">{view.name}</span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-baseline gap-3">
          <h1 className="text-2xl font-semibold tracking-tight text-text">
            {view.name}
          </h1>
          <span className="text-sm text-text-muted font-mono">
            {issues.length} {issues.length === 1 ? "issue" : "issues"}
          </span>
        </div>
      </div>

      {chips.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {chips.map((chip) => (
            <button
              key={chip.key}
              onClick={() => removeChip(chip)}
              className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium bg-surface-hover border border-border hover:bg-muted transition-colors group"
            >
              {chip.label}
              <span className="text-text-muted group-hover:text-text transition-colors">
                &times;
              </span>
            </button>
          ))}
          <button
            onClick={() =>
              router.push(`/${workspaceSlug}/views/${view.id}`)
            }
            className="text-xs text-text-muted hover:text-text transition-colors px-1"
          >
            + Add filter
          </button>
        </div>
      )}

      <ViewIssueTable issues={issues} />
    </div>
  );
}
