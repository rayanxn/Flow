import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getWorkspaceBySlug } from "@/lib/queries/workspaces";
import { getMyIssues } from "@/lib/queries/issues";
import { getWorkspaceMembers } from "@/lib/queries/members";
import { getWorkspaceProjects } from "@/lib/queries/workspaces";
import { getWorkspaceSprints } from "@/lib/queries/analytics";
import { getWorkspaceLabels } from "@/lib/queries/projects";
import { IssueList } from "@/components/issues/issue-list";
import { Breadcrumb } from "@/components/ui/breadcrumb";
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

  const [issues, members, projects, sprintRows, labelRows] = await Promise.all([
    getMyIssues(result.workspace.id, user.id),
    getWorkspaceMembers(result.workspace.id),
    getWorkspaceProjects(result.workspace.id),
    getWorkspaceSprints(result.workspace.id),
    getWorkspaceLabels(result.workspace.id),
  ]);

  const sprints = sprintRows.map((s) => ({
    id: s.id,
    name: s.name,
    status: s.status,
    project_id: s.project_id,
  }));

  const labels = labelRows.map((l) => ({
    id: l.id,
    name: l.name,
    color: l.color,
    project_id: l.project_id,
  }));

  return (
    <div className="flex flex-col py-6 px-4 md:px-8 gap-5">
      {/* Breadcrumb */}
      <Breadcrumb workspaceName={result.workspace.name} pageName="My Issues" />

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
      <MyIssuesContent issues={issues} members={members} labels={labels} projects={projects} />
    </div>
  );
}
