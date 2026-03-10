"use server";

import { revalidatePath } from "next/cache";

import { requireAuthenticatedUser } from "@/lib/auth";
import { generateLastPosition } from "@/lib/fractional-index";
import { parseListTitle } from "@/lib/lists";
import type { List } from "@/types";

function revalidateListViews(boardId: string) {
  revalidatePath(`/boards/${boardId}`);
  revalidatePath("/boards");
}

export async function createList(boardId: string, title: string): Promise<List> {
  const { supabase } = await requireAuthenticatedUser();
  const parsedTitle = parseListTitle(title);

  // Verify board access (RLS handles permissions)
  const { data: board, error: boardError } = await supabase
    .from("boards")
    .select("id")
    .eq("id", boardId)
    .single();

  if (boardError || !board) {
    throw new Error("Board not found or access denied.");
  }

  // Get last list position
  const { data: lastList } = await supabase
    .from("lists")
    .select("position")
    .eq("board_id", boardId)
    .order("position", { ascending: false })
    .limit(1)
    .single();

  const position = generateLastPosition(lastList?.position ?? null);

  const { data, error } = await supabase
    .from("lists")
    .insert({
      board_id: boardId,
      title: parsedTitle,
      position,
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  revalidateListViews(boardId);

  return data as List;
}

export async function updateListTitle(listId: string, title: string): Promise<List> {
  const { supabase } = await requireAuthenticatedUser();
  const parsedTitle = parseListTitle(title);

  // Verify access (RLS handles permissions)
  const { data: existingList, error: listError } = await supabase
    .from("lists")
    .select("id, board_id")
    .eq("id", listId)
    .single();

  if (listError || !existingList) {
    throw new Error("List not found or access denied.");
  }

  const { data, error } = await supabase
    .from("lists")
    .update({ title: parsedTitle })
    .eq("id", listId)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  revalidateListViews(existingList.board_id);

  return data as List;
}

export async function deleteList(listId: string): Promise<{ boardId: string }> {
  const { supabase } = await requireAuthenticatedUser();

  // Fetch list to get board_id (RLS handles permissions)
  const { data: existingList, error: listError } = await supabase
    .from("lists")
    .select("id, board_id")
    .eq("id", listId)
    .single();

  if (listError || !existingList) {
    throw new Error("List not found or access denied.");
  }

  const { error } = await supabase.from("lists").delete().eq("id", listId);

  if (error) {
    throw new Error(error.message);
  }

  revalidateListViews(existingList.board_id);

  return { boardId: existingList.board_id };
}

export async function reorderList(listId: string, newPosition: string): Promise<List> {
  const { supabase } = await requireAuthenticatedUser();

  // Verify access (RLS handles permissions)
  const { data: existingList, error: listError } = await supabase
    .from("lists")
    .select("id, board_id")
    .eq("id", listId)
    .single();

  if (listError || !existingList) {
    throw new Error("List not found or access denied.");
  }

  const { data, error } = await supabase
    .from("lists")
    .update({ position: newPosition })
    .eq("id", listId)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  revalidateListViews(existingList.board_id);

  return data as List;
}
