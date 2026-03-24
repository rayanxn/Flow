import type { TeamMemberWithProfile } from "@/lib/queries/teams";

export function TeamMemberRow({ member }: { member: TeamMemberWithProfile }) {
  return (
    <div className="flex items-center py-3.5 px-6 border-b border-[#2E4036]/4 last:border-b-0">
      <div className="shrink-0 rounded-full bg-[#9C9B90]/15 size-7" />
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
