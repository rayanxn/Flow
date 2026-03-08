"use server";

import { revalidatePath } from "next/cache";

import { requireAuthenticatedUser } from "@/lib/auth";
import { parseBoardFormValues } from "@/lib/boards";
import type { Board, BoardFormValues, UpdateBoardValues } from "@/types";

function revalidateBoardViews(boardId?: string) {
  revalidatePath("/boards");
  revalidatePath("/archived");

  if (boardId) {
    revalidatePath(`/boards/${boardId}`);
  }
}

export async function createBoard(input: BoardFormValues): Promise<Board> {
  const { supabase, user } = await requireAuthenticatedUser();
  const parsedInput = parseBoardFormValues(input);

  const { data, error } = await supabase
    .from("boards")
    .insert({
      title: parsedInput.title,
      background: parsedInput.background,
      owner_id: user.id,
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  const board = data as Board;

  revalidateBoardViews(board.id);

  return board;
}

export async function updateBoard(input: UpdateBoardValues): Promise<Board> {
  const { supabase } = await requireAuthenticatedUser();
  const parsedInput = parseBoardFormValues(input);

  const { data, error } = await supabase
    .from("boards")
    .update({
      title: parsedInput.title,
      background: parsedInput.background,
    })
    .eq("id", input.boardId)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  const board = data as Board;

  revalidateBoardViews(board.id);

  return board;
}

export async function archiveBoard(boardId: string): Promise<Board> {
  const { supabase } = await requireAuthenticatedUser();

  const { data, error } = await supabase
    .from("boards")
    .update({
      is_archived: true,
      archived_at: new Date().toISOString(),
    })
    .eq("id", boardId)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  const board = data as Board;

  revalidateBoardViews(boardId);

  return board;
}

export async function restoreBoard(boardId: string): Promise<Board> {
  const { supabase } = await requireAuthenticatedUser();

  const { data, error } = await supabase
    .from("boards")
    .update({
      is_archived: false,
      archived_at: null,
    })
    .eq("id", boardId)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  const board = data as Board;

  revalidateBoardViews(boardId);

  return board;
}

export async function deleteBoard(boardId: string): Promise<void> {
  const { supabase } = await requireAuthenticatedUser();

  const { data: board, error: boardError } = await supabase
    .from("boards")
    .select("id, is_archived")
    .eq("id", boardId)
    .single();

  if (boardError) {
    throw new Error(boardError.message);
  }

  if (!board.is_archived) {
    throw new Error("Only archived boards can be deleted permanently.");
  }

  const { error } = await supabase.from("boards").delete().eq("id", boardId);

  if (error) {
    throw new Error(error.message);
  }

  revalidateBoardViews(boardId);
}
