import type { SupabaseClient } from "@supabase/supabase-js";

import type { Board, BoardRole } from "@/types";
import type { Database } from "@/types/database";

export interface BoardWithRole extends Board {
  userRole: BoardRole;
}

export async function listBoards(supabase: SupabaseClient<Database>): Promise<Board[]> {
  const { data, error } = await supabase
    .from("boards")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data as Board[];
}

export async function listBoardsWithRole(
  supabase: SupabaseClient<Database>,
  userId: string
): Promise<BoardWithRole[]> {
  // Get all accessible boards (RLS handles filtering)
  const { data: boards, error: boardError } = await supabase
    .from("boards")
    .select("*")
    .eq("is_archived", false)
    .order("updated_at", { ascending: false });

  if (boardError) {
    throw new Error(boardError.message);
  }

  if (!boards || boards.length === 0) {
    return [];
  }

  // Get memberships for the current user
  const boardIds = boards.map((b) => b.id);
  const { data: memberships } = await supabase
    .from("board_memberships")
    .select("board_id, role")
    .eq("user_id", userId)
    .in("board_id", boardIds);

  const membershipMap = new Map(
    (memberships ?? []).map((m) => [m.board_id, m.role as BoardRole])
  );

  return boards.map((board) => ({
    ...board,
    userRole: board.owner_id === userId
      ? "owner" as const
      : membershipMap.get(board.id) ?? "member" as const,
  }));
}
