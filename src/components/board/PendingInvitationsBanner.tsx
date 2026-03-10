"use client";

import { useState } from "react";
import { Check, Mail, X } from "lucide-react";
import { toast } from "sonner";

import {
  acceptInvitation as acceptInvitationAction,
  declineInvitation as declineInvitationAction,
} from "@/actions/members";
import type { BoardInvitationWithDetails } from "@/types";
import { Button } from "@/components/ui/button";

interface PendingInvitationsBannerProps {
  invitations: BoardInvitationWithDetails[];
}

export default function PendingInvitationsBanner({
  invitations: initialInvitations,
}: PendingInvitationsBannerProps) {
  const [invitations, setInvitations] = useState(initialInvitations);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  if (invitations.length === 0) {
    return null;
  }

  const handleAccept = async (invitationId: string) => {
    setLoadingId(invitationId);

    try {
      await acceptInvitationAction(invitationId);
      setInvitations((prev) => prev.filter((i) => i.id !== invitationId));
      toast.success("Invitation accepted! The board is now available.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to accept invitation.");
    } finally {
      setLoadingId(null);
    }
  };

  const handleDecline = async (invitationId: string) => {
    setLoadingId(invitationId);

    try {
      await declineInvitationAction(invitationId);
      setInvitations((prev) => prev.filter((i) => i.id !== invitationId));
      toast.success("Invitation declined.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to decline invitation.");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-3">
      {invitations.map((invitation) => (
        <div
          key={invitation.id}
          className="flex flex-col gap-3 rounded-xl border border-blue-200 bg-blue-50/50 p-4 dark:border-blue-900/50 dark:bg-blue-950/20 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-start gap-3">
            <div className="mt-0.5 rounded-full bg-blue-100 p-1.5 dark:bg-blue-900/40">
              <Mail className="size-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium">
                You&apos;ve been invited to &ldquo;{invitation.boards.title}&rdquo;
              </p>
              <p className="text-xs text-muted-foreground">
                Invited by {invitation.profiles.full_name ?? invitation.profiles.email} as{" "}
                {invitation.role}
              </p>
            </div>
          </div>
          <div className="flex gap-2 sm:shrink-0">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleDecline(invitation.id)}
              disabled={loadingId === invitation.id}
            >
              <X className="size-3.5" />
              Decline
            </Button>
            <Button
              size="sm"
              onClick={() => handleAccept(invitation.id)}
              disabled={loadingId === invitation.id}
            >
              <Check className="size-3.5" />
              Accept
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
