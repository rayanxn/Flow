import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getWorkspaceBySlug } from "@/lib/queries/workspaces";
import { getMyIssues } from "@/lib/queries/issues";
import { getWorkspaceMembers } from "@/lib/queries/members";
import { getWorkspaceProjects } from "@/lib/queries/workspaces";
import { MyIssuesClient } from "./my-issues-client";
import { MyIssuesContent } from "./my-issues-content";

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

  const [issues, members, projects] = await Promise.all([
    getMyIssues(result.workspace.id, user.id),
    getWorkspaceMembers(result.workspace.id),
    getWorkspaceProjects(result.workspace.id),
  ]);

  const labels: never[] = [];
  const sprints: never[] = [];

  return (
    <div className="flex flex-col py-6 px-4 md:px-8 gap-5">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-[13px] -mb-3">
        <span className="text-text-secondary">{result.workspace.name}</span>
        <span className="text-text-muted/40">/</span>
        <span className="text-text font-medium">My Issues</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text">My Issues</h1>
        <div className="flex items-center gap-3">
          <MyIssuesClient
            projects={projects}
            members={members}
            sprints={sprints}
            labels={labels}
            defaultAssigneeId={user.id}
          />
        </div>
      </div>

      {/* View toggle, sort dropdown, and issue list/board */}
      <MyIssuesContent issues={issues} members={members} />
    </div>
  );
}
