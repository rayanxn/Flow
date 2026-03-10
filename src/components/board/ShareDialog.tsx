"use client";

import { useState } from "react";
import { Crown, Globe, Lock, Mail, Shield, Trash2, User, X } from "lucide-react";
import { toast } from "sonner";

import { canManageMembers } from "@/lib/permissions";
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
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
          <Crown className="size-3" />
          Owner
        </span>
      );
    case "admin":
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
          <Shield className="size-3" />
          Admin
        </span>
      );
    case "member":
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
          <User className="size-3" />
          Member
        </span>
      );
  }
}

function getInitials(name: string | null, email: string): string {
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

  const isAdmin = canManageMembers(currentUserRole);
  const isOwner = currentUserRole === "owner";

  const handleInvite = async (event: React.FormEvent) => {
    event.preventDefault();

    const trimmed = email.trim().toLowerCase();

    if (!trimmed) return;

    setIsSubmitting(true);

    try {
      await onInvite(trimmed, inviteRole);
      setEmail("");
      toast.success(`Invitation sent to ${trimmed}.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to send invitation.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveMember = async (userId: string, name: string) => {
    try {
      await onRemoveMember(userId);
      toast.success(`Removed ${name} from the board.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to remove member.");
    }
  };

  const handleUpdateRole = async (userId: string, role: "admin" | "member") => {
    try {
      await onUpdateRole(userId, role);
      toast.success("Member role updated.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update role.");
    }
  };

  const handleCancelInvitation = async (invitationId: string) => {
    try {
      await onCancelInvitation(invitationId);
      toast.success("Invitation cancelled.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to cancel invitation.");
    }
  };

  const handleToggleVisibility = async () => {
    const newVisibility: BoardVisibility = board.visibility === "private" ? "public" : "private";

    try {
      await onUpdateVisibility(newVisibility);
      toast.success(`Board is now ${newVisibility}.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update visibility.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share board</DialogTitle>
          <DialogDescription>Manage who can access &ldquo;{board.title}&rdquo;.</DialogDescription>
        </DialogHeader>

        {isAdmin && (
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div className="flex items-center gap-2">
              {board.visibility === "private" ? (
                <Lock className="size-4 text-muted-foreground" />
              ) : (
                <Globe className="size-4 text-muted-foreground" />
              )}
              <div>
                <p className="text-sm font-medium">
                  {board.visibility === "private" ? "Private" : "Public"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {board.visibility === "private"
                    ? "Only members can see this board"
                    : "Any authenticated user can view"}
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleToggleVisibility}>
              {board.visibility === "private" ? "Make public" : "Make private"}
            </Button>
          </div>
        )}

        {isAdmin && (
          <form onSubmit={handleInvite} className="flex gap-2">
            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="flex-1"
              required
            />
            <select
              value={inviteRole}
              onChange={(event) => setInviteRole(event.target.value as "admin" | "member")}
              className="rounded-md border bg-background px-2 text-sm"
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
            <Button type="submit" size="sm" disabled={isSubmitting}>
              <Mail className="size-4" />
              Invite
            </Button>
          </form>
        )}

        {pendingInvitations.length > 0 && isAdmin && (
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Pending invitations
            </p>
            {pendingInvitations.map((invitation) => (
              <div
                key={invitation.id}
                className="flex items-center justify-between rounded-lg border border-dashed p-2.5"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm">{invitation.invitee_email}</p>
                  <p className="text-xs text-muted-foreground capitalize">{invitation.role}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCancelInvitation(invitation.id)}
                  className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                >
                  <X className="size-3.5" />
                </Button>
              </div>
            ))}
          </div>
        )}

        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Members ({participants.length})
          </p>
          {participants.map((participant) => (
            <div
              key={participant.userId}
              className="flex items-center gap-3 rounded-lg border p-2.5"
            >
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                {getInitials(participant.profile.full_name, participant.profile.email)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">
                  {participant.profile.full_name ?? participant.profile.email}
                </p>
                {participant.profile.full_name && (
                  <p className="truncate text-xs text-muted-foreground">
                    {participant.profile.email}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-1.5">
                {isOwner && participant.role !== "owner" ? (
                  <select
                    value={participant.role}
                    onChange={(event) =>
                      handleUpdateRole(
                        participant.userId,
                        event.target.value as "admin" | "member"
                      )
                    }
                    className="rounded-md border bg-background px-1.5 py-0.5 text-xs"
                  >
                    <option value="member">Member</option>
                    <option value="admin">Admin</option>
                  </select>
                ) : (
                  <RoleBadge role={participant.role} />
                )}
                {isAdmin && participant.role !== "owner" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      handleRemoveMember(
                        participant.userId,
                        participant.profile.full_name ?? participant.profile.email
                      )
                    }
                    className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
