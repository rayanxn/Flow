import type { SupabaseClient } from "@supabase/supabase-js";

import type { BoardInvitation, BoardParticipant } from "@/types";
import type { Database } from "@/types/database";

export async function getBoardParticipants(
  supabase: SupabaseClient<Database>,
  boardId: string
): Promise<BoardParticipant[]> {
  // Get board owner
  const { data: board, error: boardError } = await supabase
    .from("boards")
    .select("owner_id, profiles!boards_owner_id_fkey(id, email, full_name, avatar_url, created_at, updated_at)")
    .eq("id", boardId)
    .single();

  if (boardError || !board) {
    return [];
  }

  const ownerProfile = Array.isArray(board.profiles) ? board.profiles[0] : board.profiles;

  if (!ownerProfile) {
    return [];
  }

  const participants: BoardParticipant[] = [
    {
      userId: board.owner_id,
      role: "owner",
      profile: ownerProfile,
    },
  ];

  // Get members with profiles
  const { data: memberships } = await supabase
    .from("board_memberships")
    .select("*, profiles(id, email, full_name, avatar_url, created_at, updated_at)")
    .eq("board_id", boardId)
    .order("created_at", { ascending: true });

  for (const membership of memberships ?? []) {
    const profile = Array.isArray(membership.profiles)
      ? membership.profiles[0]
      : membership.profiles;

    if (profile) {
      participants.push({
        userId: membership.user_id,
        role: membership.role as "admin" | "member",
        profile,
      });
    }
  }

  return participants;
}

export async function getBoardInvitations(
  supabase: SupabaseClient<Database>,
  boardId: string
): Promise<BoardInvitation[]> {
  const { data, error } = await supabase
    .from("board_invitations")
    .select("*")
    .eq("board_id", boardId)
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  if (error) {
    return [];
  }

  return (data ?? []) as BoardInvitation[];
}
