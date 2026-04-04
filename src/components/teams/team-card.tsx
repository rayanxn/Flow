import type { TeamWithMembers } from "@/lib/queries/teams";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { TeamMemberRow } from "./team-member-row";

export function TeamCard({ team }: { team: TeamWithMembers }) {
  const initial = team.name.charAt(0).toUpperCase();

  return (
    <div className="flex flex-col overflow-clip rounded-2xl border border-border-input bg-surface">
      <div className="flex items-center justify-between py-4.5 px-6 bg-muted/30">
        <div className="flex items-center gap-3">
          <Avatar size="sm" className="shrink-0 size-8">
            <AvatarFallback className="text-[13px] font-semibold">
              {initial}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-px">
            <span className="text-base font-semibold text-text">
              {team.name}
            </span>
            <span className="text-[11px] text-text font-mono opacity-30">
              {team.members.length} {team.members.length === 1 ? "member" : "members"}
            </span>
          </div>
        </div>
        <span className="text-xs font-medium font-mono text-danger-muted">
          {team.activeIssueCount} active {team.activeIssueCount === 1 ? "issue" : "issues"}
        </span>
      </div>
      {team.members.map((member) => (
        <TeamMemberRow key={member.id} member={member} />
      ))}
    </div>
  );
}
