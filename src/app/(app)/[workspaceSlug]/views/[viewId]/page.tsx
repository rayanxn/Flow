import { notFound } from "next/navigation";
import { getWorkspaceBySlug } from "@/lib/queries/workspaces";
import { getViewById, getFilteredIssues } from "@/lib/queries/views";
import type { ViewFilters } from "@/lib/types";
import { ViewDetailClient } from "@/components/views/view-detail-client";

export default async function ViewDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ workspaceSlug: string; viewId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [{ workspaceSlug, viewId }, resolvedSearchParams] = await Promise.all([
    params,
    searchParams,
  ]);

  const result = await getWorkspaceBySlug(workspaceSlug);
  if (!result?.workspace) notFound();

  const view = await getViewById(viewId);
  if (!view) notFound();

  // Use view's stored filters, but allow search params to override
  const storedFilters = (view.filters ?? {}) as ViewFilters;

  // If search params have filter overrides, use those instead
  const hasOverrides =
    resolvedSearchParams.status || resolvedSearchParams.priority;

  let activeFilters: ViewFilters;
  if (hasOverrides) {
    activeFilters = { ...storedFilters };
    if (resolvedSearchParams.status) {
      const raw = Array.isArray(resolvedSearchParams.status)
        ? resolvedSearchParams.status
        : resolvedSearchParams.status.split(",");
      activeFilters.status = raw as ViewFilters["status"];
    }
    if (resolvedSearchParams.priority) {
      const raw = Array.isArray(resolvedSearchParams.priority)
        ? resolvedSearchParams.priority
        : resolvedSearchParams.priority.split(",");
      activeFilters.priority = raw.map(Number) as ViewFilters["priority"];
    }
  } else {
    activeFilters = storedFilters;
  }

  const issues = await getFilteredIssues(result.workspace.id, activeFilters);

  return (
    <ViewDetailClient
      view={view}
      issues={issues}
      workspaceSlug={workspaceSlug}
    />
  );
}
