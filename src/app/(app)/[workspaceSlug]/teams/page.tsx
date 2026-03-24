import { notFound } from "next/navigation";
import { Users } from "lucide-react";
import { getWorkspaceBySlug } from "@/lib/queries/workspaces";
import { getTeamsWithMembers } from "@/lib/queries/teams";
import { TeamsList } from "@/components/teams/teams-list";
import { EmptyState } from "@/components/ui/empty-state";
import { InviteMemberButton } from "@/components/teams/invite-member-button";

export default async function TeamsPage({
  params,
}: {
  params: Promise<{ workspaceSlug: string }>;
}) {
  const { workspaceSlug } = await params;
  const result = await getWorkspaceBySlug(workspaceSlug);
  if (!result?.workspace) notFound();

  const teams = await getTeamsWithMembers(result.workspace.id);

  return (
    <div className="flex flex-col py-6 px-8 gap-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-[-0.02em] text-text">
          Teams
        </h1>
        <InviteMemberButton workspaceId={result.workspace.id} />
      </div>
      {teams.length > 0 ? (
        <TeamsList teams={teams} />
      ) : (
        <EmptyState
          icon={Users}
          title="No teams yet"
          description="Create teams to organize your workspace members."
        />
      )}
    </div>
  );
}
