import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getWorkspaceBySlug, getWorkspaceProjects } from "@/lib/queries/workspaces";
import { getUnreadNotificationCount } from "@/lib/queries/notifications";
import { getWorkspaceMembers } from "@/lib/queries/members";
import { WorkspaceProvider } from "@/providers/workspace-provider";
import { WorkspaceShell } from "@/components/layout/workspace-shell";
import { LayoutShell } from "@/components/layout/layout-shell";

export default async function WorkspaceLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ workspaceSlug: string }>;
}) {
  const { workspaceSlug } = await params;
  const result = await getWorkspaceBySlug(workspaceSlug);

  if (!result?.workspace) {
    notFound();
  }

  const workspace = result.workspace;
  const membership = result;
  const projects = await getWorkspaceProjects(workspace.id);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userName =
    typeof user?.user_metadata?.full_name === "string" &&
    user.user_metadata.full_name.trim().length > 0
      ? user.user_metadata.full_name.trim()
      : null;
  const userEmail = user?.email ?? null;
  const initials =
    userName
      ?.split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) ??
    userEmail?.slice(0, 2).toUpperCase() ??
    "U";

  const [unreadCount, members] = await Promise.all([
    user ? getUnreadNotificationCount(workspace.id, user.id) : 0,
    getWorkspaceMembers(workspace.id),
  ]);

  const memberList = members.map((m) => ({
    user_id: m.user_id,
    profile: { full_name: m.profile.full_name, email: m.profile.email },
  }));

  return (
    <WorkspaceProvider workspace={workspace} membership={membership}>
      <WorkspaceShell
        workspaceSlug={workspace.slug}
        workspaceId={workspace.id}
        userId={user?.id ?? ""}
        projects={projects}
        members={memberList}
      >
        <LayoutShell
          workspaceSlug={workspace.slug}
          sidebarProps={{
            workspaceName: workspace.name,
            workspaceSlug: workspace.slug,
            projects,
            workspaceId: workspace.id,
            userId: user?.id ?? "",
            unreadCount,
          }}
          userInitials={initials}
          userName={userName}
          userEmail={userEmail}
        >
          {children}
        </LayoutShell>
      </WorkspaceShell>
    </WorkspaceProvider>
  );
}
