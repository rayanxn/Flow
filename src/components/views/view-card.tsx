import Link from "next/link";
import type { Tables, ViewFilters } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { STATUS_CONFIG } from "@/lib/utils/statuses";
import { PRIORITY_CONFIG } from "@/lib/utils/priorities";

function getViewColor(filters: ViewFilters): string {
  // Priority-based (P0/P1 = high priority bugs)
  if (filters.priority?.some((p) => p <= 1)) return "#C4483E";
  // Due date filters
  if (filters.due_date_range?.from || filters.due_date_range?.to) return "#D4853D";
  // Status filters
  if (filters.status?.length) return "#9C9689";
  // Assignee absent
  if (filters.assignee_ids?.length === 0) return "#B8B3AB";
  // Has assignee filters
  if (filters.assignee_ids?.length) return "#2D2A26";
  // Has project filters
  if (filters.project_ids?.length) return "#7C8A6E";
  // Default
  return "#6B6B60";
}

function getFilterChips(filters: ViewFilters): string[] {
  const chips: string[] = [];

  if (filters.status?.length) {
    for (const s of filters.status) {
      chips.push(STATUS_CONFIG[s].label);
    }
  }
  if (filters.priority?.length) {
    for (const p of filters.priority) {
      chips.push(PRIORITY_CONFIG[p].label);
    }
  }
  if (filters.assignee_ids?.length) {
    chips.push(`${filters.assignee_ids.length} assignee${filters.assignee_ids.length > 1 ? "s" : ""}`);
  }
  if (filters.project_ids?.length) {
    chips.push(`${filters.project_ids.length} project${filters.project_ids.length > 1 ? "s" : ""}`);
  }
  if (filters.label_ids?.length) {
    chips.push(`${filters.label_ids.length} label${filters.label_ids.length > 1 ? "s" : ""}`);
  }
  if (filters.due_date_range?.from || filters.due_date_range?.to) {
    chips.push("Due date");
  }

  return chips;
}

export function ViewCard({
  view,
  issueCount,
  workspaceSlug,
}: {
  view: Tables<"views">;
  issueCount: number;
  workspaceSlug: string;
}) {
  const filters = (view.filters ?? {}) as ViewFilters;
  const borderColor = getViewColor(filters);
  const chips = getFilterChips(filters);

  return (
    <Link
      href={`/${workspaceSlug}/views/${view.id}`}
      className="flex flex-col rounded-xl bg-white border border-border/50 p-5 gap-2 hover:border-border transition-colors"
      style={{ borderLeftWidth: "4px", borderLeftColor: borderColor }}
    >
      <div className="flex items-start justify-between">
        <h3 className="text-sm font-semibold text-text">{view.name}</h3>
        <span className="text-xs font-mono text-text-muted shrink-0 ml-2">
          {issueCount} {issueCount === 1 ? "issue" : "issues"}
        </span>
      </div>
      {view.description && (
        <p className="text-xs text-text-muted font-mono line-clamp-2">
          {view.description}
        </p>
      )}
      {chips.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-1">
          {chips.map((chip) => (
            <Badge key={chip} className="text-[10px]">
              {chip}
            </Badge>
          ))}
        </div>
      )}
    </Link>
  );
}
