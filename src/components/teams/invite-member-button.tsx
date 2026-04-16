"use client";

import { useState, useTransition } from "react";
import { createWorkspaceLinkInvite } from "@/lib/actions/invites";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function InviteMemberButton({ workspaceId }: { workspaceId: string }) {
  const [open, setOpen] = useState(false);
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleInvite() {
    setError(null);
    setInviteLink(null);
    setCopied(false);
    startTransition(async () => {
      const result = await createWorkspaceLinkInvite(workspaceId);
      if (result.error) {
        setError(result.error);
      } else if (result.data?.url) {
        setInviteLink(result.data.url);
      }
    });
    setOpen(true);
  }

  async function handleCopy() {
    if (!inviteLink) return;
    await navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <>
      <Button onClick={handleInvite} disabled={isPending}>
        {isPending ? "Generating..." : "Invite Member"}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Team Member</DialogTitle>
          </DialogHeader>
          {error && (
            <p className="text-sm text-status-error">{error}</p>
          )}
          {inviteLink && (
            <div className="flex flex-col gap-3">
              <p className="text-sm text-text-secondary">
                Share this invite link with your team member. It expires in 7 days.
              </p>
              <div className="flex items-center gap-2">
                <input
                  readOnly
                  value={inviteLink}
                  className="flex-1 rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs font-mono text-text"
                />
                <Button variant="secondary" size="sm" onClick={handleCopy}>
                  {copied ? "Copied!" : "Copy"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
