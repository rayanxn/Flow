import type { SupabaseClient } from "@supabase/supabase-js";

import { sortByPosition } from "@/lib/fractional-index";
import type { BoardWithDetails } from "@/types";
import type { Database } from "@/types/database";

export async function getBoardWithLists(
  supabase: SupabaseClient<Database>,
  boardId: string
): Promise<BoardWithDetails | null> {
  const { data, error } = await supabase
    .from("boards")
    .select("*, lists(*, cards(*))")
    .eq("id", boardId)
    .single();

  if (error) {
    if (error.code === "PGRST116" || error.code === "22P02") {
      return null;
    }
    throw new Error(error.message);
  }

  if (!data) {
    return null;
  }

  const board = data as BoardWithDetails;

  board.lists = sortByPosition(board.lists)
    .filter((list) => list.is_archived !== true)
    .map((list) => ({
      ...list,
      cards: sortByPosition(list.cards).filter((card) => card.is_archived !== true),
    }));

  return board;
}
