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

// Collaboration types
export type BoardRole = "owner" | "admin" | "member";
export type BoardVisibility = "private" | "public";

export type BoardMembership = Database["public"]["Tables"]["board_memberships"]["Row"];
export type BoardInvitation = Database["public"]["Tables"]["board_invitations"]["Row"];

export interface BoardMemberWithProfile extends BoardMembership {
  profiles: Profile;
}

export interface BoardParticipant {
  userId: string;
  role: BoardRole;
  profile: Profile;
}

export interface InviteMemberValues {
  boardId: string;
  email: string;
  role: "admin" | "member";
}

export interface UpdateBoardVisibilityValues {
  boardId: string;
  visibility: BoardVisibility;
}

export interface BoardInvitationWithDetails extends BoardInvitation {
  boards: Pick<Board, "id" | "title" | "background">;
  profiles: Pick<Profile, "id" | "email" | "full_name">;
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
