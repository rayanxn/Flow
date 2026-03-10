"use client";

import { create } from "zustand";

import {
  getBoardMembers,
  inviteMember as inviteMemberAction,
  removeMember as removeMemberAction,
  updateMemberRole as updateMemberRoleAction,
  cancelInvitation as cancelInvitationAction,
} from "@/actions/members";
import type {
  BoardInvitation,
  BoardParticipant,
  BoardRole,
  InviteMemberValues,
} from "@/types";

interface MemberState {
  participants: BoardParticipant[];
  pendingInvitations: BoardInvitation[];
  currentUserRole: BoardRole | null;
  isLoading: boolean;
  loadBoardMembers: (boardId: string, currentUserId: string) => Promise<void>;
  setInitialData: (
    participants: BoardParticipant[],
    invitations: BoardInvitation[],
    currentUserId: string
  ) => void;
  inviteMember: (input: InviteMemberValues) => Promise<void>;
  removeMember: (boardId: string, userId: string) => Promise<void>;
  updateMemberRole: (boardId: string, userId: string, role: "admin" | "member") => Promise<void>;
  cancelInvitation: (invitationId: string) => Promise<void>;
  clear: () => void;
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong while managing members.";
}

function resolveRole(participants: BoardParticipant[], userId: string): BoardRole | null {
  const participant = participants.find((p) => p.userId === userId);
  return participant?.role ?? null;
}

export const useMemberStore = create<MemberState>((set, get) => ({
  participants: [],
  pendingInvitations: [],
  currentUserRole: null,
  isLoading: false,
  async loadBoardMembers(boardId, currentUserId) {
    set({ isLoading: true });

    try {
      const participants = await getBoardMembers(boardId);

      set({
        participants,
        currentUserRole: resolveRole(participants, currentUserId),
        isLoading: false,
      });
    } catch {
      set({ isLoading: false });
    }
  },
  setInitialData(participants, invitations, currentUserId) {
    set({
      participants,
      pendingInvitations: invitations,
      currentUserRole: resolveRole(participants, currentUserId),
      isLoading: false,
    });
  },
  async inviteMember(input) {
    try {
      const invitation = await inviteMemberAction(input);

      set({
        pendingInvitations: [...get().pendingInvitations, invitation],
      });
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },
  async removeMember(boardId, userId) {
    try {
      await removeMemberAction(boardId, userId);

      set({
        participants: get().participants.filter((p) => p.userId !== userId),
      });
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },
  async updateMemberRole(boardId, userId, role) {
    try {
      await updateMemberRoleAction(boardId, userId, role);

      set({
        participants: get().participants.map((p) =>
          p.userId === userId ? { ...p, role } : p
        ),
      });
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },
  async cancelInvitation(invitationId) {
    try {
      await cancelInvitationAction(invitationId);

      set({
        pendingInvitations: get().pendingInvitations.filter((i) => i.id !== invitationId),
      });
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },
  clear() {
    set({
      participants: [],
      pendingInvitations: [],
      currentUserRole: null,
      isLoading: false,
    });
  },
}));
