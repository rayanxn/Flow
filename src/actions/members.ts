"use server";

import { revalidatePath } from "next/cache";

import { requireAuthenticatedUser } from "@/lib/auth";
import { isValidEmail } from "@/lib/email";
import { getBoardParticipants } from "@/lib/member-queries";
import { canManageMembers, getUserBoardRole } from "@/lib/permissions";
import type {
  BoardInvitation,
  BoardInvitationWithDetails,
  BoardMembership,
  BoardParticipant,
  InviteMemberValues,
} from "@/types";

function revalidateBoardViews(boardId: string) {
  revalidatePath(`/boards/${boardId}`);
  revalidatePath("/boards");
}

function isMissingCollaborationSchemaError(error: { code?: string; message?: string } | null) {
  return (
    error?.code === "42P01" ||
    error?.code === "42703" ||
    error?.code === "PGRST205" ||
    error?.message?.includes("board_invitations") ||
    error?.message?.includes("board_memberships") ||
    error?.message?.includes("visibility")
  );
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export async function getBoardMembers(boardId: string): Promise<BoardParticipant[]> {
  const { supabase } = await requireAuthenticatedUser();

  return getBoardParticipants(supabase, boardId);
}

export async function inviteMember(input: InviteMemberValues): Promise<BoardInvitation> {
  const { supabase, user } = await requireAuthenticatedUser();
  const inviteeEmail = normalizeEmail(input.email);

  if (!isValidEmail(inviteeEmail)) {
    throw new Error("Please provide a valid email address.");
  }

  const role = await getUserBoardRole(supabase, input.boardId, user.id);

  if (!canManageMembers(role)) {
    throw new Error("You do not have permission to invite members to this board.");
  }

  const { data: board } = await supabase
    .from("boards")
    .select("owner_id, profiles!boards_owner_id_fkey(email)")
    .eq("id", input.boardId)
    .single();

  if (!board) {
    throw new Error("Board not found or access denied.");
  }

  const ownerProfile = Array.isArray(board.profiles) ? board.profiles[0] : board.profiles;

  if (ownerProfile?.email?.toLowerCase() === inviteeEmail) {
    throw new Error("The board owner already has access to this board.");
  }

  const { data: inviteeProfile } = await supabase
    .from("profiles")
    .select("id")
    .ilike("email", inviteeEmail)
    .maybeSingle();

  if (inviteeProfile) {
    const { data: existingMembership } = await supabase
      .from("board_memberships")
      .select("id")
      .eq("board_id", input.boardId)
      .eq("user_id", inviteeProfile.id)
      .maybeSingle();

    if (existingMembership) {
      throw new Error("This user is already a member of the board.");
    }
  }

  const { data: existingInvite } = await supabase
    .from("board_invitations")
    .select("id")
    .eq("board_id", input.boardId)
    .ilike("invitee_email", inviteeEmail)
    .eq("status", "pending")
    .maybeSingle();

  if (existingInvite) {
    throw new Error("An invitation is already pending for this email.");
  }

  const { data, error } = await supabase
    .from("board_invitations")
    .insert({
      board_id: input.boardId,
      inviter_id: user.id,
      invitee_email: inviteeEmail,
      role: input.role,
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  revalidateBoardViews(input.boardId);

  return data as BoardInvitation;
}

export async function acceptInvitation(invitationId: string): Promise<BoardMembership> {
  const { supabase, user } = await requireAuthenticatedUser();
  const userEmail = normalizeEmail(user.email ?? "");

  const { data: invitation, error: inviteError } = await supabase
    .from("board_invitations")
    .select("*")
    .eq("id", invitationId)
    .eq("status", "pending")
    .single();

  if (inviteError || !invitation) {
    throw new Error("Invitation not found or already responded to.");
  }

  if (normalizeEmail(invitation.invitee_email) !== userEmail) {
    throw new Error("This invitation is not for your account.");
  }

  const { data: membership, error: memberError } = await supabase
    .from("board_memberships")
    .insert({
      board_id: invitation.board_id,
      user_id: user.id,
      role: invitation.role,
    })
    .select("*")
    .single();

  if (memberError) {
    throw new Error(memberError.message);
  }

  const { error: updateError } = await supabase
    .from("board_invitations")
    .update({ status: "accepted" })
    .eq("id", invitationId);

  if (updateError) {
    throw new Error(updateError.message);
  }

  revalidateBoardViews(invitation.board_id);
  revalidatePath("/boards");

  return membership as BoardMembership;
}

export async function declineInvitation(invitationId: string): Promise<void> {
  const { supabase, user } = await requireAuthenticatedUser();
  const userEmail = normalizeEmail(user.email ?? "");

  const { data: invitation, error: inviteError } = await supabase
    .from("board_invitations")
    .select("*")
    .eq("id", invitationId)
    .eq("status", "pending")
    .single();

  if (inviteError || !invitation) {
    throw new Error("Invitation not found or already responded to.");
  }

  if (normalizeEmail(invitation.invitee_email) !== userEmail) {
    throw new Error("This invitation is not for your account.");
  }

  const { error } = await supabase
    .from("board_invitations")
    .update({ status: "declined" })
    .eq("id", invitationId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/boards");
}

export async function removeMember(boardId: string, userId: string): Promise<void> {
  const { supabase, user } = await requireAuthenticatedUser();
  const role = await getUserBoardRole(supabase, boardId, user.id);

  if (!canManageMembers(role)) {
    throw new Error("You do not have permission to remove members from this board.");
  }

  const { data: board } = await supabase
    .from("boards")
    .select("owner_id")
    .eq("id", boardId)
    .single();

  if (board?.owner_id === userId) {
    throw new Error("The board owner cannot be removed.");
  }

  const { error } = await supabase
    .from("board_memberships")
    .delete()
    .eq("board_id", boardId)
    .eq("user_id", userId);

  if (error) {
    throw new Error(error.message);
  }

  revalidateBoardViews(boardId);
}

export async function updateMemberRole(
  boardId: string,
  userId: string,
  newRole: "admin" | "member"
): Promise<void> {
  const { supabase, user } = await requireAuthenticatedUser();
  const role = await getUserBoardRole(supabase, boardId, user.id);

  if (role !== "owner") {
    throw new Error("Only the board owner can change member roles.");
  }

  const { error } = await supabase
    .from("board_memberships")
    .update({ role: newRole })
    .eq("board_id", boardId)
    .eq("user_id", userId);

  if (error) {
    throw new Error(error.message);
  }

  revalidateBoardViews(boardId);
}

export async function leaveBoard(boardId: string): Promise<void> {
  const { supabase, user } = await requireAuthenticatedUser();

  const { data: board } = await supabase
    .from("boards")
    .select("owner_id")
    .eq("id", boardId)
    .single();

  if (board?.owner_id === user.id) {
    throw new Error("The board owner cannot leave the board.");
  }

  const { error } = await supabase
    .from("board_memberships")
    .delete()
    .eq("board_id", boardId)
    .eq("user_id", user.id);

  if (error) {
    throw new Error(error.message);
  }

  revalidateBoardViews(boardId);
}

export async function cancelInvitation(invitationId: string): Promise<void> {
  const { supabase, user } = await requireAuthenticatedUser();

  const { data: invitation, error: inviteError } = await supabase
    .from("board_invitations")
    .select("*")
    .eq("id", invitationId)
    .eq("status", "pending")
    .single();

  if (inviteError || !invitation) {
    throw new Error("Invitation not found or already responded to.");
  }

  const role = await getUserBoardRole(supabase, invitation.board_id, user.id);

  if (!canManageMembers(role)) {
    throw new Error("You do not have permission to cancel invitations for this board.");
  }

  const { error } = await supabase
    .from("board_invitations")
    .delete()
    .eq("id", invitationId);

  if (error) {
    throw new Error(error.message);
  }

  revalidateBoardViews(invitation.board_id);
}

export async function getPendingInvitationsForUser(): Promise<BoardInvitationWithDetails[]> {
  const { supabase, user } = await requireAuthenticatedUser();
  const userEmail = normalizeEmail(user.email ?? "");

  if (!userEmail) {
    return [];
  }

  const { data, error } = await supabase
    .from("board_invitations")
    .select("*, boards(id, title, background), profiles!board_invitations_inviter_id_fkey(id, email, full_name)")
    .ilike("invitee_email", userEmail)
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  if (error) {
    if (isMissingCollaborationSchemaError(error)) {
      return [];
    }

    throw new Error(error.message);
  }

  return (data ?? []) as BoardInvitationWithDetails[];
}
