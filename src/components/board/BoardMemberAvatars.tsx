"use client";

import { UserPlus, Users } from "lucide-react";

import type { BoardParticipant } from "@/types";

interface BoardMemberAvatarsProps {
  participants: BoardParticipant[];
  onOpenShare: () => void;
}

const MAX_VISIBLE = 5;

function getInitials(name: string | null, email: string): string {
  if (name) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }
  return email.slice(0, 2).toUpperCase();
}

export default function BoardMemberAvatars({ participants, onOpenShare }: BoardMemberAvatarsProps) {
  const visible = participants.slice(0, MAX_VISIBLE);
  const overflow = participants.length - MAX_VISIBLE;

  return (
    <div className="inline-flex h-9 items-center gap-1.5 rounded-full bg-black/14 px-1.5 pr-1.5 text-sm font-medium text-white/88 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-sm md:pr-1.5">
      <div className="flex items-center -space-x-2">
        {visible.map((participant) => (
          <div
            key={participant.userId}
            className="flex size-7 items-center justify-center rounded-full border border-white/45 bg-white/92 text-[10px] font-semibold text-slate-700 shadow-sm"
            title={participant.profile.full_name ?? participant.profile.email}
          >
            {getInitials(participant.profile.full_name, participant.profile.email)}
          </div>
        ))}
        {overflow > 0 && (
          <div className="flex size-7 items-center justify-center rounded-full border border-white/35 bg-white/20 text-[10px] font-semibold text-white shadow-sm">
            +{overflow}
          </div>
        )}
        <button
          type="button"
          onClick={onOpenShare}
          className="inline-flex size-7 items-center justify-center rounded-full border border-white/35 bg-white/10 text-white/90 transition hover:bg-white/16"
          aria-label="Invite board members"
        >
          <UserPlus className="size-3.5" />
        </button>
      </div>
      <button
        type="button"
        onClick={onOpenShare}
        className="hidden items-center gap-1.5 rounded-full px-1.5 py-1 text-sm font-medium text-white/90 transition hover:bg-white/10 md:inline-flex"
      >
        <Users className="size-3.5" />
        Members
      </button>
    </div>
  );
}
