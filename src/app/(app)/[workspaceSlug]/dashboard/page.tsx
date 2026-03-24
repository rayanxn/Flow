import { createClient } from "@/lib/supabase/server";
import { getWorkspaceBySlug, getWorkspaceProjects } from "@/lib/queries/workspaces";
import { enrichIssues } from "@/lib/queries/issues";
import { getRecentActivities } from "@/lib/queries/activities";
import { DashboardGreeting } from "@/components/dashboard/dashboard-greeting";
import { SprintStrip } from "@/components/dashboard/sprint-strip";
import { MyFocusCard } from "@/components/dashboard/my-focus-card";
import { RecentActivityCard } from "@/components/dashboard/recent-activity-card";
import type { IssueStatus } from "@/lib/types";

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ workspaceSlug: string }>;
}) {
  const { workspaceSlug } = await params;
  const supabase = await createClient();

  const result = await getWorkspaceBySlug(workspaceSlug);
  if (!result?.workspace) return null;

  const workspace = result.workspace;
  const membership = result;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const firstName =
    (user.user_metadata?.full_name as string)?.split(" ")[0] ??
    user.email?.split("@")[0] ??
    "there";

  // Determine primary project for sprint context
  let primaryProjectId = membership.primary_project_id;
  if (!primaryProjectId) {
    const projects = await getWorkspaceProjects(workspace.id);
    primaryProjectId = projects[0]?.id ?? null;
  }

  // Fetch active sprint for the primary project
  let activeSprint = null;
  let issueCounts: Record<IssueStatus, number> = {
    todo: 0,
    in_progress: 0,
    in_review: 0,
    done: 0,
  };
  let totalIssues = 0;

  if (primaryProjectId) {
    const { data: sprint } = await supabase
      .from("sprints")
      .select("*")
      .eq("project_id", primaryProjectId)
      .eq("status", "active")
      .single();

    if (sprint) {
      activeSprint = sprint;

      const { data: sprintIssues } = await supabase
        .from("issues")
        .select("id, status")
        .eq("sprint_id", sprint.id);

      if (sprintIssues) {
        totalIssues = sprintIssues.length;
        for (const issue of sprintIssues) {
          const status = issue.status as IssueStatus;
          issueCounts[status] = (issueCounts[status] || 0) + 1;
        }
      }
    }
  }

  // Fetch My Focus issues: top 6 non-done issues assigned to user
  const { data: focusIssuesRaw } = await supabase
    .from("issues")
    .select("*")
    .eq("workspace_id", workspace.id)
    .eq("assignee_id", user.id)
    .neq("status", "done")
    .order("priority", { ascending: true })
    .order("due_date", { ascending: true, nullsFirst: false })
    .limit(6);

  const focusIssues = await enrichIssues(focusIssuesRaw ?? [], supabase);

  // Fetch recent activities
  const recentActivities = await getRecentActivities(workspace.id, 6);

  return (
    <div className="flex flex-col flex-1">
      {/* Greeting */}
      <div className="px-10 pt-6">
        <DashboardGreeting firstName={firstName} />
      </div>

      {/* Sprint context */}
      {activeSprint && (
        <div className="px-10 pt-6">
          <SprintStrip
            sprint={activeSprint}
            issueCounts={issueCounts}
            totalIssues={totalIssues}
          />
        </div>
      )}

      {/* Main columns */}
      <div className="flex flex-1 gap-6 px-10 pt-6 pb-8">
        <div className="flex flex-col" style={{ flexGrow: 1.6, flexBasis: 0 }}>
          <MyFocusCard issues={focusIssues} workspaceSlug={workspaceSlug} />
        </div>
        <div className="flex flex-col flex-1" style={{ flexBasis: 0 }}>
          <RecentActivityCard
            activities={recentActivities}
            workspaceSlug={workspaceSlug}
          />
        </div>
      </div>
    </div>
  );
}
