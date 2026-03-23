import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getWorkspaceBySlug } from "@/lib/queries/workspaces";
import { getMyIssues } from "@/lib/queries/issues";
import { getWorkspaceMembers } from "@/lib/queries/members";
import { IssueList } from "@/components/issues/issue-list";
import { MyIssuesClient } from "./my-issues-client";

export default async function MyIssuesPage({
  params,
}: {
  params: Promise<{ workspaceSlug: string }>;
}) {
  const { workspaceSlug } = await params;

  const result = await getWorkspaceBySlug(workspaceSlug);
  if (!result?.workspace) notFound();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) notFound();

  const [issues, members] = await Promise.all([
    getMyIssues(result.workspace.id, user.id),
    getWorkspaceMembers(result.workspace.id),
  ]);

  const projects = issues
    .map((i) => i.project)
    .filter((p): p is { id: string; name: string; color: string } => p !== null)
    .filter((p, i, arr) => arr.findIndex((a) => a.id === p.id) === i);

  // Get labels and sprints from the workspace context (empty for now, will be fetched in Phase 4)
  const labels: never[] = [];
  const sprints: never[] = [];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-serif text-text">My Issues</h1>
        <div className="flex items-center gap-3">
          <MyIssuesClient
            projects={projects}
            members={members}
            sprints={sprints}
            labels={labels}
          />
          <div className="flex items-center rounded-lg border border-border overflow-hidden">
            <button className="px-3 py-1.5 text-sm font-medium bg-surface text-text border-r border-border">
              List
            </button>
            <button className="px-3 py-1.5 text-sm text-text-secondary hover:text-text bg-surface-hover">
              Board
            </button>
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-text-secondary border border-border rounded-lg hover:bg-surface-hover transition-colors">
            <span>Sort: Priority</span>
          </button>
        </div>
      </div>

      {/* Issue list */}
      {issues.length > 0 ? (
        <div className="bg-surface rounded-lg border border-border overflow-hidden">
          <IssueList issues={issues} showProject={true} />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24">
          <h3 className="text-lg font-medium text-text mb-1">
            No issues assigned
          </h3>
          <p className="text-sm text-text-muted">
            Issues assigned to you will appear here.
          </p>
        </div>
      )}
    </div>
  );
}
