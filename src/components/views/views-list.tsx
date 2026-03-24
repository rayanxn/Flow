import type { Tables } from "@/lib/types";
import { ViewCard } from "./view-card";

export function ViewsList({
  views,
  issueCounts,
  workspaceSlug,
}: {
  views: Tables<"views">[];
  issueCounts: Map<string, number>;
  workspaceSlug: string;
}) {
  if (views.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h2 className="text-lg font-medium text-text">No saved views</h2>
        <p className="mt-1 text-sm text-text-muted">
          Create a view to save filter combinations for quick access.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {views.map((view) => (
        <ViewCard
          key={view.id}
          view={view}
          issueCount={issueCounts.get(view.id) ?? 0}
          workspaceSlug={workspaceSlug}
        />
      ))}
    </div>
  );
}
