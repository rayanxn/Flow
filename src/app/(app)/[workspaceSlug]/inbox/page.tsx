import { Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getWorkspaceBySlug } from "@/lib/queries/workspaces";
import { getNotifications } from "@/lib/queries/notifications";
import { InboxClient } from "@/components/inbox/inbox-client";
import { EmptyState } from "@/components/ui/empty-state";
import { Breadcrumb } from "@/components/ui/breadcrumb";

export default async function InboxPage({
  params,
}: {
  params: Promise<{ workspaceSlug: string }>;
}) {
  const { workspaceSlug } = await params;
  const supabase = await createClient();

  const result = await getWorkspaceBySlug(workspaceSlug);
  if (!result?.workspace) return null;

  const workspace = result.workspace;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const notifications = await getNotifications(workspace.id, user.id);

  return (
    <div className="flex flex-col flex-1 px-10">
      <Breadcrumb workspaceName={workspace.name} pageName="Inbox" />
      {notifications.length > 0 ? (
        <InboxClient
          notifications={notifications}
          workspaceId={workspace.id}
        />
      ) : (
        <EmptyState
          icon={Mail}
          title="All caught up"
          description="No notifications yet. You'll see updates here when you're assigned issues or mentioned."
        />
      )}
    </div>
  );
}
