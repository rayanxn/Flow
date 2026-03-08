"use server";

import { revalidatePath } from "next/cache";
import type { SupabaseClient } from "@supabase/supabase-js";

import { requireAuthenticatedUser } from "@/lib/auth";
import {
  normalizeCardDescription,
  parseCardDueDate,
  parseCardTitle,
} from "@/lib/cards";
import { generateLastPosition } from "@/lib/fractional-index";
import type { Card, MoveCardValues, UpdateCardValues } from "@/types";
import type { Database } from "@/types/database";

type AccessibleListRow = Pick<Database["public"]["Tables"]["lists"]["Row"], "id" | "board_id">;

type AccessibleCardRelation = { board_id: string } | Array<{ board_id: string }>;

type AccessibleCardRow = Pick<Database["public"]["Tables"]["cards"]["Row"], "id" | "list_id"> & {
  lists: AccessibleCardRelation;
};

function revalidateCardViews(boardId: string) {
  revalidatePath(`/boards/${boardId}`);
  revalidatePath("/boards");
}

function getBoardIdFromRelation(relation: AccessibleCardRelation) {
  if (Array.isArray(relation)) {
    return relation[0]?.board_id ?? null;
  }

  return relation.board_id;
}

async function getAccessibleList(
  supabase: SupabaseClient<Database>,
  listId: string
): Promise<AccessibleListRow> {
  const { data, error } = await supabase
    .from("lists")
    .select("id, board_id")
    .eq("id", listId)
    .single();

  if (error || !data) {
    throw new Error("List not found or access denied.");
  }

  return data as AccessibleListRow;
}

async function getAccessibleCard(
  supabase: SupabaseClient<Database>,
  cardId: string
): Promise<{ boardId: string }> {
  const { data, error } = await supabase
    .from("cards")
    .select("id, list_id, lists!inner(board_id)")
    .eq("id", cardId)
    .single();

  if (error || !data) {
    throw new Error("Card not found or access denied.");
  }

  const card = data as AccessibleCardRow;
  const boardId = getBoardIdFromRelation(card.lists);

  if (!boardId) {
    throw new Error("Card board could not be determined.");
  }

  return { boardId };
}

export async function createCard(listId: string, title: string): Promise<Card> {
  const { supabase } = await requireAuthenticatedUser();
  const list = await getAccessibleList(supabase, listId);
  const parsedTitle = parseCardTitle(title);

  const { data: lastCard } = await supabase
    .from("cards")
    .select("position")
    .eq("list_id", listId)
    .order("position", { ascending: false })
    .limit(1)
    .single();

  const position = generateLastPosition(lastCard?.position ?? null);

  const { data, error } = await supabase
    .from("cards")
    .insert({
      list_id: listId,
      title: parsedTitle,
      position,
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  revalidateCardViews(list.board_id);

  return data as Card;
}

export async function updateCard(input: UpdateCardValues): Promise<Card> {
  const { supabase } = await requireAuthenticatedUser();
  const existingCard = await getAccessibleCard(supabase, input.cardId);
  const updates: Database["public"]["Tables"]["cards"]["Update"] = {};

  if (input.title !== undefined) {
    updates.title = parseCardTitle(input.title);
  }

  if (input.description !== undefined) {
    updates.description = normalizeCardDescription(input.description);
  }

  if (input.dueDate !== undefined) {
    updates.due_date = parseCardDueDate(input.dueDate);
  }

  if (Object.keys(updates).length === 0) {
    throw new Error("No card changes were provided.");
  }

  const { data, error } = await supabase
    .from("cards")
    .update(updates)
    .eq("id", input.cardId)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  revalidateCardViews(existingCard.boardId);

  return data as Card;
}

export async function deleteCard(cardId: string): Promise<void> {
  const { supabase } = await requireAuthenticatedUser();
  const existingCard = await getAccessibleCard(supabase, cardId);

  const { error } = await supabase.from("cards").delete().eq("id", cardId);

  if (error) {
    throw new Error(error.message);
  }

  revalidateCardViews(existingCard.boardId);
}

export async function moveCard(input: MoveCardValues): Promise<Card> {
  const { supabase } = await requireAuthenticatedUser();
  const existingCard = await getAccessibleCard(supabase, input.cardId);
  const targetList = await getAccessibleList(supabase, input.listId);
  const nextPosition = input.position.trim();

  if (!nextPosition) {
    throw new Error("A valid card position is required.");
  }

  if (existingCard.boardId !== targetList.board_id) {
    throw new Error("Cards can only be moved within the same board.");
  }

  const { data, error } = await supabase
    .from("cards")
    .update({
      list_id: input.listId,
      position: nextPosition,
    })
    .eq("id", input.cardId)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  revalidateCardViews(existingCard.boardId);

  return data as Card;
}
