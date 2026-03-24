import { Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getWorkspaceBySlug } from "@/lib/queries/workspaces";
import { getNotifications } from "@/lib/queries/notifications";
import { getWorkspaceMembers } from "@/lib/queries/members";
import { InboxClient } from "@/components/inbox/inbox-client";
import { EmptyState } from "@/components/ui/empty-state";

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

  const [notifications, members] = await Promise.all([
    getNotifications(workspace.id, user.id),
    getWorkspaceMembers(workspace.id),
  ]);

  return (
    <div className="flex flex-col flex-1 px-4 md:px-10">
      <div className="text-[13px] py-3 flex items-center gap-2">
        <span className="text-text-secondary">{workspace.name}</span>
        <span className="text-text-muted">/</span>
        <span className="text-text font-medium">Inbox</span>
      </div>
      {notifications.length > 0 ? (
        <InboxClient
          notifications={notifications}
          workspaceId={workspace.id}
          members={members}
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
