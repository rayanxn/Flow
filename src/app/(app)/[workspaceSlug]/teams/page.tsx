import { notFound } from "next/navigation";
import { getWorkspaceBySlug } from "@/lib/queries/workspaces";
import { getTeamsWithMembers } from "@/lib/queries/teams";
import { TeamsList } from "@/components/teams/teams-list";
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
      <TeamsList teams={teams} />
    </div>
  );
}
