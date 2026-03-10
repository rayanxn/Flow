import type { SupabaseClient } from "@supabase/supabase-js";

import type { BoardRole } from "@/types";
import type { Database } from "@/types/database";

export async function getUserBoardRole(
  supabase: SupabaseClient<Database>,
  boardId: string,
  userId: string
): Promise<BoardRole | null> {
  // Check if user is the owner
  const { data: board } = await supabase
    .from("boards")
    .select("owner_id")
    .eq("id", boardId)
    .single();

  if (!board) {
    return null;
  }

  if (board.owner_id === userId) {
    return "owner";
  }

  // Check membership
  const { data: membership } = await supabase
    .from("board_memberships")
    .select("role")
    .eq("board_id", boardId)
    .eq("user_id", userId)
    .single();

  if (!membership) {
    return null;
  }

  return membership.role as BoardRole;
}

export function canManageMembers(role: BoardRole | null): boolean {
  return role === "owner" || role === "admin";
}

export function canEditBoard(role: BoardRole | null): boolean {
  return role === "owner" || role === "admin";
}

export function canEditContent(role: BoardRole | null): boolean {
  return role === "owner" || role === "admin" || role === "member";
}
