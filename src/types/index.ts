import type { Database } from "@/types/database";

// Profile type (extends Supabase auth.users)
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];

// Board type
export type Board = Database["public"]["Tables"]["boards"]["Row"];

export interface BoardFormValues {
  title: string;
  background: string;
}

export interface UpdateBoardValues extends BoardFormValues {
  boardId: string;
}

// List type
export type List = Database["public"]["Tables"]["lists"]["Row"];

// Card type
export type Card = Database["public"]["Tables"]["cards"]["Row"];

export interface CardUpdatePatch {
  title?: string;
  description?: string | null;
  dueDate?: string | null;
}

export interface UpdateCardValues extends CardUpdatePatch {
  cardId: string;
}

export interface MoveCardValues {
  cardId: string;
  listId: string;
  position: string;
}

// Board with nested lists and cards
export interface BoardWithDetails extends Board {
  lists: ListWithCards[];
}

// List with nested cards
export interface ListWithCards extends List {
  cards: Card[];
}

// Realtime payload types
export type RealtimeEvent = "INSERT" | "UPDATE" | "DELETE";

export interface RealtimePayload<T = unknown> {
  commit_timestamp: string;
  eventType: RealtimeEvent;
  new: T;
  old: T;
  schema: string;
  table: string;
}
