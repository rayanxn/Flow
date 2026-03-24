import type { TeamWithMembers } from "@/lib/queries/teams";
import { TeamCard } from "./team-card";

export function TeamsList({ teams }: { teams: TeamWithMembers[] }) {
  if (teams.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h2 className="text-lg font-medium text-text">No teams yet</h2>
        <p className="mt-1 text-sm text-text-muted">
          Create teams to organize your workspace members.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {teams.map((team) => (
        <TeamCard key={team.id} team={team} />
      ))}
    </div>
  );
}
