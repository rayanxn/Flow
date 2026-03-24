import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getWorkspaceBySlug, getWorkspaceProjects } from "@/lib/queries/workspaces";
import { getUnreadNotificationCount } from "@/lib/queries/notifications";
import { WorkspaceProvider } from "@/providers/workspace-provider";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";

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

  const initials =
    user?.user_metadata?.full_name
      ?.split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) ??
    user?.email?.slice(0, 2).toUpperCase() ??
    "U";

  const unreadCount = user
    ? await getUnreadNotificationCount(workspace.id, user.id)
    : 0;

  return (
    <WorkspaceProvider workspace={workspace} membership={membership}>
      <div className="flex h-screen overflow-hidden">
        <Sidebar
          workspaceName={workspace.name}
          workspaceSlug={workspace.slug}
          projects={projects}
          workspaceId={workspace.id}
          userId={user?.id ?? ""}
          unreadCount={unreadCount}
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-y-auto bg-background">
            <Header userInitials={initials} />
            {children}
          </main>
        </div>
      </div>
    </WorkspaceProvider>
  );
}
