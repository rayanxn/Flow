import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getWorkspaceBySlug } from "@/lib/queries/workspaces";
import { getWorkspaceMembers } from "@/lib/queries/members";
import { MembersSettings } from "@/components/settings/members-settings";

export default async function WorkspaceMembersPage({
  params,
}: {
  params: Promise<{ workspaceSlug: string }>;
}) {
  const { workspaceSlug } = await params;
  const result = await getWorkspaceBySlug(workspaceSlug);

  if (!result?.workspace) {
    notFound();
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const members = await getWorkspaceMembers(result.workspace.id);

  return (
    <MembersSettings
      members={members}
      workspaceId={result.workspace.id}
      currentUserId={user?.id ?? ""}
      currentUserRole={result.role}
    />
  );
}
