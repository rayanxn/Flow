import type { TeamMemberWithProfile } from "@/lib/queries/teams";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils/format";

export function TeamMemberRow({ member }: { member: TeamMemberWithProfile }) {
  return (
    <div className="flex items-center py-3.5 px-6 border-b border-[#2E4036]/4 last:border-b-0">
      <Avatar size="sm" className="shrink-0">
        <AvatarFallback>
          {getInitials(member.profile.full_name, member.profile.email)}
        </AvatarFallback>
      </Avatar>
      <div className="pl-3 w-40 shrink-0 text-sm font-medium text-text">
        {member.profile.full_name ?? member.profile.email}
      </div>
      <div className="grow text-xs text-text font-mono opacity-30">
        {member.profile.email}
      </div>
      <div className="text-xs text-text font-mono opacity-25">
        {member.activeTaskCount} {member.activeTaskCount === 1 ? "task" : "tasks"}
      </div>
    </div>
  );
}
