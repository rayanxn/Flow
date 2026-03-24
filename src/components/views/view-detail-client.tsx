"use client";

import { useRouter } from "next/navigation";
import type { Tables, ViewFilters, IssueStatus, IssuePriority } from "@/lib/types";
import type { IssueWithDetails } from "@/lib/queries/issues";
import { STATUS_CONFIG } from "@/lib/utils/statuses";
import { PRIORITY_CONFIG } from "@/lib/utils/priorities";
import { ViewIssueTable } from "./view-issue-table";

type ChipInfo = {
  key: string;
  label: string;
  filterKey: keyof ViewFilters;
  value?: string;
};

function getFilterChipDetails(
  filters: ViewFilters,
  memberMap?: Record<string, string>,
  projectMap?: Record<string, string>,
): ChipInfo[] {
  const chips: ChipInfo[] = [];

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
  if (filters.assignee_ids?.length) {
    for (const id of filters.assignee_ids) {
      chips.push({
        key: `assignee-${id}`,
        label: memberMap?.[id] ?? "Unknown member",
        filterKey: "assignee_ids",
        value: id,
      });
    }
  }
  if (filters.project_ids?.length) {
    for (const id of filters.project_ids) {
      chips.push({
        key: `project-${id}`,
        label: projectMap?.[id] ?? "Unknown project",
        filterKey: "project_ids",
        value: id,
      });
    }
  }
  if (filters.due_date_range) {
    const { from, to } = filters.due_date_range;
    if (from) {
      chips.push({
        key: "due-from",
        label: `From ${from}`,
        filterKey: "due_date_range",
        value: "from",
      });
    }
    if (to) {
      chips.push({
        key: "due-to",
        label: `Until ${to}`,
        filterKey: "due_date_range",
        value: "to",
      });
    }
  }

  return chips;
}

export function ViewDetailClient({
  view,
  issues,
  workspaceSlug,
  memberMap,
  projectMap,
}: {
  view: Tables<"views">;
  issues: IssueWithDetails[];
  workspaceSlug: string;
  memberMap?: Record<string, string>;
  projectMap?: Record<string, string>;
}) {
  const router = useRouter();
  const filters = (view.filters ?? {}) as ViewFilters;
  const chips = getFilterChipDetails(filters, memberMap, projectMap);

  function removeChip(chip: ChipInfo) {
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
    } else if (chip.filterKey === "assignee_ids" && chip.value) {
      newFilters.assignee_ids = (newFilters.assignee_ids ?? []).filter(
        (id) => id !== chip.value
      );
      if (newFilters.assignee_ids.length === 0) delete newFilters.assignee_ids;
    } else if (chip.filterKey === "project_ids" && chip.value) {
      newFilters.project_ids = (newFilters.project_ids ?? []).filter(
        (id) => id !== chip.value
      );
      if (newFilters.project_ids.length === 0) delete newFilters.project_ids;
    } else if (chip.filterKey === "due_date_range" && chip.value) {
      const range = { ...newFilters.due_date_range };
      if (chip.value === "from") delete range.from;
      else delete range.to;
      if (!range.from && !range.to) {
        delete newFilters.due_date_range;
      } else {
        newFilters.due_date_range = range;
      }
    }

    // Build URL params from remaining filters
    const params = new URLSearchParams();
    if (newFilters.status?.length) params.set("status", newFilters.status.join(","));
    if (newFilters.priority?.length) params.set("priority", newFilters.priority.join(","));
    if (newFilters.assignee_ids?.length) params.set("assignee_ids", newFilters.assignee_ids.join(","));
    if (newFilters.project_ids?.length) params.set("project_ids", newFilters.project_ids.join(","));
    if (newFilters.due_date_range?.from) params.set("due_from", newFilters.due_date_range.from);
    if (newFilters.due_date_range?.to) params.set("due_to", newFilters.due_date_range.to);

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
