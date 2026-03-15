"use client";

import { useMemo, useState } from "react";
import { Crown, Globe, Lock, Mail, Shield, Trash2, User, X } from "lucide-react";
import { toast } from "sonner";

import { isValidEmail } from "@/lib/email";
import { canManageMembers } from "@/lib/permissions";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import type {
  Board,
  BoardInvitation,
  BoardParticipant,
  BoardRole,
  BoardVisibility,
} from "@/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface ShareDialogProps {
  board: Board;
  participants: BoardParticipant[];
  onlineUserIds?: string[];
  pendingInvitations: BoardInvitation[];
  currentUserRole: BoardRole | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInvite: (email: string, role: "admin" | "member") => Promise<void>;
  onRemoveMember: (userId: string) => Promise<void>;
  onUpdateRole: (userId: string, role: "admin" | "member") => Promise<void>;
  onCancelInvitation: (invitationId: string) => Promise<void>;
  onUpdateVisibility: (visibility: BoardVisibility) => Promise<void>;
}

function RoleBadge({ role }: { role: BoardRole }) {
  switch (role) {
    case "owner":
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
          <Crown className="size-3" />
          Owner
        </span>
      );
    case "admin":
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-sky-100 px-2 py-0.5 text-xs font-medium text-sky-800">
          <Shield className="size-3" />
          Admin
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
          <User className="size-3" />
          Member
        </span>
      );
  }
}

function getInitials(name: string | null, email: string) {
  if (name) {
    const parts = name.trim().split(/\s+/);

    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }

    return name.slice(0, 2).toUpperCase();
  }

  return email.slice(0, 2).toUpperCase();
}

export default function ShareDialog({
  board,
  participants,
  onlineUserIds = [],
  pendingInvitations,
  currentUserRole,
  open,
  onOpenChange,
  onInvite,
  onRemoveMember,
  onUpdateRole,
  onCancelInvitation,
  onUpdateVisibility,
}: ShareDialogProps) {
  const [email, setEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"admin" | "member">("member");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showVisibilityConfirm, setShowVisibilityConfirm] = useState(false);
  const isAdmin = canManageMembers(currentUserRole);
  const isOwner = currentUserRole === "owner";
  const visibility = board.visibility === "public" ? "public" : "private";
  const sortedParticipants = useMemo(
    () =>
      [...participants].sort((left, right) => {
        const roleOrder = { owner: 0, admin: 1, member: 2 };

        return roleOrder[left.role] - roleOrder[right.role];
      }),
    [participants]
  );

  const handleInvite = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextEmail = email.trim().toLowerCase();

    if (!nextEmail) {
      return;
    }

    if (!isValidEmail(nextEmail)) {
      toast.error("Please provide a valid email address.");
      return;
    }

    setIsSubmitting(true);

    try {
      await onInvite(nextEmail, inviteRole);
      setEmail("");
      toast.success(`Invitation sent to ${nextEmail}.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to send invitation.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleVisibility = async () => {
    const nextVisibility: BoardVisibility = visibility === "private" ? "public" : "private";

    try {
      await onUpdateVisibility(nextVisibility);
      toast.success(`Board is now ${nextVisibility}.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update visibility.");
    }
  };

  const handleCancelInvitation = async (invitation: BoardInvitation) => {
    try {
      await onCancelInvitation(invitation.id);
      toast.success(`Canceled invite for ${invitation.invitee_email}.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to cancel invitation.");
    }
  };

  const handleRemoveMember = async (participant: BoardParticipant) => {
    const participantName = participant.profile.full_name ?? participant.profile.email;

    try {
      await onRemoveMember(participant.userId);
      toast.success(`Removed ${participantName} from the board.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to remove member.");
    }
  };

  const handleUpdateMemberRole = async (
    participant: BoardParticipant,
    nextRole: "admin" | "member"
  ) => {
    const participantName = participant.profile.full_name ?? participant.profile.email;

    try {
      await onUpdateRole(participant.userId, nextRole);
      toast.success(`${participantName} is now ${nextRole}.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update member role.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Share board</DialogTitle>
          <DialogDescription>
            Manage who can access &ldquo;{board.title}&rdquo;.
          </DialogDescription>
        </DialogHeader>

        {isAdmin ? (
          <div className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-slate-50/80 p-3">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-full bg-white text-slate-600 shadow-sm ring-1 ring-slate-200">
                {visibility === "private" ? (
                  <Lock className="size-4" />
                ) : (
                  <Globe className="size-4" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">
                  {visibility === "private" ? "Private board" : "Public board"}
                </p>
                <p className="text-xs text-slate-500">
                  {visibility === "private"
                    ? "Only board members can access this board."
                    : "Any authenticated user can open this board read-only."}
                </p>
              </div>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={() => setShowVisibilityConfirm(true)}>
              {visibility === "private" ? "Make public" : "Make private"}
            </Button>
          </div>
        ) : null}

        {isAdmin ? (
          <form onSubmit={handleInvite} className="rounded-xl border border-slate-200/80 bg-white p-3">
            <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto]">
              <Input
                type="email"
                placeholder="Invite by email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
              <select
                value={inviteRole}
                onChange={(event) => setInviteRole(event.target.value as "admin" | "member")}
                className="h-10 rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none"
              >
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>
              <Button type="submit" disabled={isSubmitting}>
                <Mail className="size-4" />
                Invite
              </Button>
            </div>
          </form>
        ) : null}

        {isAdmin && pendingInvitations.length > 0 ? (
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Pending invitations
            </p>
            {pendingInvitations.map((invitation) => (
              <div
                key={invitation.id}
                className="flex items-center justify-between rounded-xl border border-dashed border-slate-200 bg-slate-50/70 p-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-800">
                    {invitation.invitee_email}
                  </p>
                  <p className="text-xs capitalize text-slate-500">{invitation.role}</p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="size-8 rounded-full p-0 text-slate-500 hover:text-destructive"
                  aria-label={`Cancel invitation for ${invitation.invitee_email}`}
                  onClick={() => void handleCancelInvitation(invitation)}
                >
                  <X className="size-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : null}

        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Members ({sortedParticipants.length})
          </p>
          {sortedParticipants.map((participant) => (
            <div
              key={participant.userId}
              className="flex items-center gap-3 rounded-xl border border-slate-200/80 bg-white p-3"
            >
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-sky-100 text-xs font-semibold text-sky-800">
                {getInitials(participant.profile.full_name, participant.profile.email)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-900">
                  {participant.profile.full_name ?? participant.profile.email}
                </p>
                <p className="truncate text-xs text-slate-500">
                  {participant.profile.email}
                  {onlineUserIds.includes(participant.userId) ? " · Online" : ""}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {isOwner && participant.role !== "owner" ? (
                  <select
                    value={participant.role}
                    onChange={(event) =>
                      void handleUpdateMemberRole(
                        participant,
                        event.target.value as "admin" | "member"
                      )
                    }
                    className="h-8 rounded-md border border-input bg-background px-2 text-xs shadow-xs outline-none"
                  >
                    <option value="member">Member</option>
                    <option value="admin">Admin</option>
                  </select>
                ) : (
                  <RoleBadge role={participant.role} />
                )}
                {isAdmin && participant.role !== "owner" ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="size-8 rounded-full p-0 text-slate-500 hover:text-destructive"
                    aria-label={`Remove ${participant.profile.email} from board`}
                    onClick={() => void handleRemoveMember(participant)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>

      <ConfirmDialog
        open={showVisibilityConfirm}
        onOpenChange={setShowVisibilityConfirm}
        title={visibility === "private" ? "Make board public?" : "Make board private?"}
        description={
          visibility === "private"
            ? "Any authenticated user will be able to view this board read-only."
            : "Only board members will be able to access this board."
        }
        confirmLabel={visibility === "private" ? "Make public" : "Make private"}
        onConfirm={handleToggleVisibility}
      />
    </Dialog>
  );
}
