import type { ViewFilters } from "@/lib/types";

export function parseFiltersFromParams(
  searchParams: Record<string, string | string[] | undefined>
): ViewFilters {
  const filters: ViewFilters = {};

  if (searchParams.status) {
    filters.status = (
      Array.isArray(searchParams.status)
        ? searchParams.status
        : searchParams.status.split(",")
    ) as ViewFilters["status"];
  }

  if (searchParams.priority) {
    const raw = Array.isArray(searchParams.priority)
      ? searchParams.priority
      : searchParams.priority.split(",");
    filters.priority = raw.map(Number) as ViewFilters["priority"];
  }

  if (searchParams.assignee) {
    filters.assignee_ids = Array.isArray(searchParams.assignee)
      ? searchParams.assignee
      : searchParams.assignee.split(",");
  }

  if (searchParams.project) {
    filters.project_ids = Array.isArray(searchParams.project)
      ? searchParams.project
      : searchParams.project.split(",");
  }

  if (searchParams.label) {
    filters.label_ids = Array.isArray(searchParams.label)
      ? searchParams.label
      : searchParams.label.split(",");
  }

  if (searchParams.due_from || searchParams.due_to) {
    filters.due_date_range = {};
    if (searchParams.due_from) {
      filters.due_date_range.from = Array.isArray(searchParams.due_from)
        ? searchParams.due_from[0]
        : searchParams.due_from;
    }
    if (searchParams.due_to) {
      filters.due_date_range.to = Array.isArray(searchParams.due_to)
        ? searchParams.due_to[0]
        : searchParams.due_to;
    }
  }

  return filters;
}

export function filtersToParams(filters: ViewFilters): URLSearchParams {
  const params = new URLSearchParams();

  if (filters.status?.length) params.set("status", filters.status.join(","));
  if (filters.priority?.length)
    params.set("priority", filters.priority.join(","));
  if (filters.assignee_ids?.length)
    params.set("assignee", filters.assignee_ids.join(","));
  if (filters.project_ids?.length)
    params.set("project", filters.project_ids.join(","));
  if (filters.label_ids?.length)
    params.set("label", filters.label_ids.join(","));
  if (filters.due_date_range?.from)
    params.set("due_from", filters.due_date_range.from);
  if (filters.due_date_range?.to)
    params.set("due_to", filters.due_date_range.to);

  return params;
}
