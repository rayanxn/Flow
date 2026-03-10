"use server";

import { revalidatePath } from "next/cache";

import { requireAuthenticatedUser } from "@/lib/auth";
import { getUserBoardRole, canManageMembers } from "@/lib/permissions";
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

export async function getBoardMembers(boardId: string): Promise<BoardParticipant[]> {
  const { supabase } = await requireAuthenticatedUser();

  // Get board owner
  const { data: board, error: boardError } = await supabase
    .from("boards")
    .select("owner_id, profiles!boards_owner_id_fkey(id, email, full_name, avatar_url, created_at, updated_at)")
    .eq("id", boardId)
    .single();

  if (boardError || !board) {
    throw new Error("Board not found or access denied.");
  }

  const ownerProfile = Array.isArray(board.profiles) ? board.profiles[0] : board.profiles;

  if (!ownerProfile) {
    throw new Error("Board owner profile not found.");
  }

  const participants: BoardParticipant[] = [
    {
      userId: board.owner_id,
      role: "owner",
      profile: ownerProfile,
    },
  ];

  // Get members with profiles
  const { data: memberships, error: memberError } = await supabase
    .from("board_memberships")
    .select("*, profiles(id, email, full_name, avatar_url, created_at, updated_at)")
    .eq("board_id", boardId)
    .order("created_at", { ascending: true });

  if (memberError) {
    throw new Error(memberError.message);
  }

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

export async function inviteMember(input: InviteMemberValues): Promise<BoardInvitation> {
  const { supabase, user } = await requireAuthenticatedUser();

  const role = await getUserBoardRole(supabase, input.boardId, user.id);

  if (!canManageMembers(role)) {
    throw new Error("You do not have permission to invite members to this board.");
  }

  // Check if user is already a member
  const { data: existingMember } = await supabase
    .from("board_memberships")
    .select("id")
    .eq("board_id", input.boardId)
    .eq("user_id", (
      await supabase.from("profiles").select("id").eq("email", input.email).maybeSingle()
    ).data?.id ?? "")
    .maybeSingle();

  if (existingMember) {
    throw new Error("This user is already a member of the board.");
  }

  // Check if board owner
  const { data: board } = await supabase
    .from("boards")
    .select("owner_id")
    .eq("id", input.boardId)
    .single();

  if (board) {
    const { data: ownerProfile } = await supabase
      .from("profiles")
      .select("email")
      .eq("id", board.owner_id)
      .single();

    if (ownerProfile?.email === input.email) {
      throw new Error("The board owner cannot be invited as a member.");
    }
  }

  // Check for existing pending invitation
  const { data: existingInvite } = await supabase
    .from("board_invitations")
    .select("id")
    .eq("board_id", input.boardId)
    .eq("invitee_email", input.email)
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
      invitee_email: input.email,
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

  // Get invitation
  const { data: invitation, error: inviteError } = await supabase
    .from("board_invitations")
    .select("*")
    .eq("id", invitationId)
    .eq("status", "pending")
    .single();

  if (inviteError || !invitation) {
    throw new Error("Invitation not found or already responded to.");
  }

  // Verify this invitation belongs to the current user
  if (invitation.invitee_email !== user.email) {
    throw new Error("This invitation is not for your account.");
  }

  // Create membership
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

  // Update invitation status
  await supabase
    .from("board_invitations")
    .update({ status: "accepted" })
    .eq("id", invitationId);

  revalidateBoardViews(invitation.board_id);
  revalidatePath("/boards");

  return membership as BoardMembership;
}

export async function declineInvitation(invitationId: string): Promise<void> {
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

  if (invitation.invitee_email !== user.email) {
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

  // Check if target is the owner
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

  // Check if user is the owner
  const { data: board } = await supabase
    .from("boards")
    .select("owner_id")
    .eq("id", boardId)
    .single();

  if (board?.owner_id === user.id) {
    throw new Error("The board owner cannot leave the board. Transfer ownership or delete the board instead.");
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

  if (!user.email) {
    return [];
  }

  const { data, error } = await supabase
    .from("board_invitations")
    .select("*, boards(id, title, background), profiles!board_invitations_inviter_id_fkey(id, email, full_name)")
    .eq("invitee_email", user.email)
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as BoardInvitationWithDetails[];
}
