import { notFound } from "next/navigation";
import { Filter } from "lucide-react";
import { getWorkspaceBySlug } from "@/lib/queries/workspaces";
import { getWorkspaceViews, getFilteredIssueCount } from "@/lib/queries/views";
import type { ViewFilters } from "@/lib/types";
import { ViewsList } from "@/components/views/views-list";
import { EmptyState } from "@/components/ui/empty-state";
import { CreateViewModal } from "@/components/views/create-view-modal";

export default async function ViewsPage({
  params,
}: {
  params: Promise<{ workspaceSlug: string }>;
}) {
  const { workspaceSlug } = await params;
  const result = await getWorkspaceBySlug(workspaceSlug);
  if (!result?.workspace) notFound();

  const views = await getWorkspaceViews(result.workspace.id);

  // Get issue counts for each view in parallel
  const counts = await Promise.all(
    views.map((view) =>
      getFilteredIssueCount(
        result.workspace.id,
        (view.filters ?? {}) as ViewFilters
      )
    )
  );

  const issueCounts = new Map<string, number>();
  views.forEach((view, i) => {
    issueCounts.set(view.id, counts[i]);
  });

  return (
    <div className="flex flex-col py-6 px-8 gap-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight text-text">
          Saved Views
        </h1>
        <CreateViewModal
          workspaceId={result.workspace.id}
          workspaceSlug={workspaceSlug}
        />
      </div>
      {views.length > 0 ? (
        <ViewsList
          views={views}
          issueCounts={issueCounts}
          workspaceSlug={workspaceSlug}
        />
      ) : (
        <EmptyState
          icon={Filter}
          title="No saved views"
          description="Create a view to save filter combinations for quick access."
        />
      )}
    </div>
  );
}
