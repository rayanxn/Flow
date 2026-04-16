"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  updateMemberRole,
  removeMember,
} from "@/lib/actions/workspaces";
import {
  createWorkspaceEmailInvite,
  createWorkspaceLinkInvite,
  regenerateWorkspaceLinkInvite,
  revokeWorkspaceInvite,
} from "@/lib/actions/invites";
import { DeleteConfirmationModal } from "@/components/ui/delete-confirmation-modal";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { WorkspaceRole } from "@/lib/types";
import type { WorkspaceInviteListItem } from "@/lib/invites";
import { buildInviteUrl, getInviteStatusLabel } from "@/lib/invites";
import { formatRelative } from "@/lib/utils/dates";

type Member = {
  id: string;
  user_id: string;
  role: "owner" | "admin" | "member";
  profile: {
    id: string;
    full_name: string | null;
    email: string;
    avatar_url: string | null;
  };
};

interface MembersSettingsProps {
  members: Member[];
  invites: WorkspaceInviteListItem[];
  workspaceId: string;
  workspaceSlug: string;
  currentUserId: string;
  currentUserRole: WorkspaceRole;
}

const ROLE_LABELS: Record<WorkspaceRole, string> = {
  owner: "Owner",
  admin: "Admin",
  member: "Member",
};

const ROLE_BADGE_STYLES: Record<WorkspaceRole, string> = {
  owner: "bg-primary text-background",
  admin: "border border-border-input bg-surface-subtle text-text",
  member: "border border-border-subtle bg-surface-hover text-text-muted",
};

export function MembersSettings({
  members,
  invites,
  workspaceId,
  workspaceSlug,
  currentUserId,
  currentUserRole,
}: MembersSettingsProps) {
  const router = useRouter();
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"admin" | "member">("member");
  const [inviteLoading, setInviteLoading] = useState(false);
  const [emailInviteLoading, setEmailInviteLoading] = useState(false);
  const [removingMember, setRemovingMember] = useState<Member | null>(null);
  const [removeLoading, setRemoveLoading] = useState(false);

  const canManageMembers = currentUserRole === "owner" || currentUserRole === "admin";
  const activeLinkInvite = useMemo(
    () => invites.find((invite) => invite.invite_type === "link" && invite.status === "pending") ?? null,
    [invites],
  );

  const effectiveInviteLink = inviteLink ?? (activeLinkInvite ? buildInviteUrl(activeLinkInvite.code) : null);

  async function handleGenerateInvite() {
    setInviteLoading(true);
    const result = await createWorkspaceLinkInvite(workspaceId);
    if ("data" in result && result.data) {
      const url = result.data.url;
      setInviteLink(url);
      navigator.clipboard.writeText(url);
      router.refresh();
    }
    setInviteLoading(false);
  }

  async function handleRoleChange(memberId: string, newRole: "admin" | "member") {
    await updateMemberRole(memberId, newRole);
    router.refresh();
  }

  async function handleRemoveMember() {
    if (!removingMember) return;
    setRemoveLoading(true);
    await removeMember(removingMember.id);
    setRemoveLoading(false);
    setRemovingMember(null);
    router.refresh();
  }

  async function handleCreateEmailInvite() {
    if (!inviteEmail.trim()) return;
    setEmailInviteLoading(true);
    const result = await createWorkspaceEmailInvite({
      workspaceId,
      email: inviteEmail,
      role: currentUserRole === "owner" ? inviteRole : "member",
    });

    if (result.data) {
      setInviteEmail("");
      setInviteLink(result.data.url);
      await navigator.clipboard.writeText(result.data.url);
      router.refresh();
    }

    setEmailInviteLoading(false);
  }

  async function handleRegenerateLink() {
    setInviteLoading(true);
    const result = await regenerateWorkspaceLinkInvite(workspaceId);
    if (result.data) {
      setInviteLink(result.data.url);
      await navigator.clipboard.writeText(result.data.url);
      router.refresh();
    }
    setInviteLoading(false);
  }

  async function handleRevokeInvite(inviteId: string) {
    await revokeWorkspaceInvite(inviteId);
    if (activeLinkInvite?.id === inviteId) {
      setInviteLink(null);
    }
    router.refresh();
  }

  function copyInvite(url: string) {
    navigator.clipboard.writeText(url);
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-semibold text-text leading-7">Members</h1>
          <p className="text-[13px] text-text-muted mt-1 leading-[18px]">
            Manage who has access to this workspace.
          </p>
        </div>
      </div>

      {canManageMembers && (
        <div className="mt-6 space-y-4">
          <div className="rounded-[14px] border border-border-input bg-surface px-5 py-5">
            <div className="flex flex-col gap-1">
              <h2 className="text-[15px] font-semibold text-text">Invite by email</h2>
              <p className="text-[13px] text-text-muted">
                Target a specific teammate. If email delivery is not configured, copy the join link directly.
              </p>
            </div>

            <div className="mt-4 flex flex-col gap-3 md:flex-row">
              <input
                type="email"
                value={inviteEmail}
                onChange={(event) => setInviteEmail(event.target.value)}
                placeholder="teammate@company.com"
                className="h-10 flex-1 rounded-lg border border-border-input bg-background px-3 text-[13px] text-text outline-none transition-colors focus:border-border-strong focus:ring-2 focus:ring-primary/10"
              />
              {currentUserRole === "owner" && (
                <select
                  value={inviteRole}
                  onChange={(event) => setInviteRole(event.target.value as "admin" | "member")}
                  className="h-10 rounded-lg border border-border-input bg-background px-3 text-[13px] text-text outline-none transition-colors focus:border-border-strong focus:ring-2 focus:ring-primary/10"
                >
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                </select>
              )}
              <button
                type="button"
                onClick={handleCreateEmailInvite}
                disabled={emailInviteLoading}
                className="rounded-lg bg-primary px-4 py-2 text-[13px] font-medium text-background transition-colors hover:bg-primary-hover disabled:opacity-50"
              >
                {emailInviteLoading ? "Creating..." : "Create invite"}
              </button>
            </div>
          </div>

          <div className="rounded-[14px] border border-border-input bg-surface px-5 py-5">
            <div className="flex flex-col gap-1">
              <h2 className="text-[15px] font-semibold text-text">Shareable join link</h2>
              <p className="text-[13px] text-text-muted">
                Link invites always grant the member role and expire after 7 days.
              </p>
            </div>

            {effectiveInviteLink ? (
              <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center">
                <span className="min-w-0 flex-1 truncate rounded-lg border border-border-input bg-background px-3 py-2 text-[12px] font-mono text-text">
                  {effectiveInviteLink}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => copyInvite(effectiveInviteLink)}
                    className="rounded-lg border border-border-input px-3 py-2 text-[12px] font-medium text-text transition-colors hover:bg-surface-hover"
                  >
                    Copy
                  </button>
                  <button
                    type="button"
                    onClick={handleRegenerateLink}
                    disabled={inviteLoading}
                    className="rounded-lg border border-border-input px-3 py-2 text-[12px] font-medium text-text transition-colors hover:bg-surface-hover disabled:opacity-50"
                  >
                    {inviteLoading ? "Regenerating..." : "Regenerate"}
                  </button>
                  {activeLinkInvite && (
                    <button
                      type="button"
                      onClick={() => handleRevokeInvite(activeLinkInvite.id)}
                      className="rounded-lg border border-danger/20 px-3 py-2 text-[12px] font-medium text-danger transition-colors hover:bg-danger-light"
                    >
                      Revoke
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleGenerateInvite}
                disabled={inviteLoading}
                className="mt-4 rounded-lg bg-primary px-4 py-2 text-[13px] font-medium text-background transition-colors hover:bg-primary-hover disabled:opacity-50"
              >
                {inviteLoading ? "Generating..." : "Generate join link"}
              </button>
            )}
          </div>
        </div>
      )}

      {canManageMembers && invites.length > 0 && (
        <div className="mt-6 rounded-[14px] border border-border-input bg-surface px-5 py-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-[15px] font-semibold text-text">Invite history</h2>
              <p className="text-[13px] text-text-muted">
                Pending, accepted, revoked, and expired workspace invites.
              </p>
            </div>
            <a
              href={`/${workspaceSlug}/teams`}
              className="text-[12px] font-medium text-text-muted transition-colors hover:text-text"
            >
              Open Teams
            </a>
          </div>

          <div className="mt-4 space-y-2">
            {invites.map((invite) => {
              const inviteUrl = buildInviteUrl(invite.code);
              return (
                <div
                  key={invite.id}
                  className="flex flex-col gap-3 rounded-xl border border-border-subtle bg-background px-4 py-3 md:flex-row md:items-center"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-[13px] font-medium text-text">
                        {invite.invite_type === "email"
                          ? invite.email
                          : "Shareable join link"}
                      </p>
                      <span className="rounded-full border border-border-input px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-text-muted">
                        {getInviteStatusLabel(invite.status)}
                      </span>
                    </div>
                    <p className="mt-1 text-[12px] text-text-muted">
                      {invite.role === "admin" ? "Admin invite" : "Member invite"} · Created {formatRelative(invite.created_at)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {invite.status === "pending" && (
                      <>
                        <button
                          type="button"
                          onClick={() => copyInvite(inviteUrl)}
                          className="rounded-lg border border-border-input px-3 py-2 text-[12px] font-medium text-text transition-colors hover:bg-surface-hover"
                        >
                          Copy
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRevokeInvite(invite.id)}
                          className="rounded-lg border border-danger/20 px-3 py-2 text-[12px] font-medium text-danger transition-colors hover:bg-danger-light"
                        >
                          Revoke
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Member list */}
      <div className="mt-8 space-y-1">
        {members.map((member) => {
          const initials =
            member.profile.full_name
              ?.split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2) ?? member.profile.email.slice(0, 2).toUpperCase();

          const isOwner = member.role === "owner";
          const isSelf = member.user_id === currentUserId;

          return (
            <div
              key={member.id}
              className="flex items-center gap-3 rounded-lg py-3 px-3 transition-colors hover:bg-surface-hover"
            >
              <Avatar size="sm">
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-text truncate">
                  {member.profile.full_name ?? member.profile.email}
                  {isSelf && (
                    <span className="text-text-muted ml-1">(you)</span>
                  )}
                </p>
                <p className="text-[12px] text-text-muted truncate">
                  {member.profile.email}
                </p>
              </div>

              {/* Role badge / selector */}
              {isOwner || !canManageMembers ? (
                <span
                  className={`px-2 py-0.5 rounded-md text-[11px] font-medium ${ROLE_BADGE_STYLES[member.role]}`}
                >
                  {ROLE_LABELS[member.role]}
                </span>
              ) : (
                <select
                  value={member.role}
                  onChange={(e) =>
                    handleRoleChange(member.id, e.target.value as "admin" | "member")
                  }
                  className="rounded-md border border-border-input bg-surface-subtle px-2 py-1 text-[11px] font-medium text-text focus:outline-none"
                >
                  <option value="admin">Admin</option>
                  <option value="member">Member</option>
                </select>
              )}

              {/* Remove button */}
              {canManageMembers && !isOwner && !isSelf && (
                <button
                  type="button"
                  onClick={() => setRemovingMember(member)}
                  className="text-[12px] text-text-muted transition-colors hover:text-danger"
                >
                  Remove
                </button>
              )}
            </div>
          );
        })}
      </div>

      <DeleteConfirmationModal
        open={!!removingMember}
        onOpenChange={(open) => !open && setRemovingMember(null)}
        title="Remove member?"
        description={`${removingMember?.profile.full_name ?? removingMember?.profile.email ?? "This member"} will lose access to the workspace.`}
        onConfirm={handleRemoveMember}
        loading={removeLoading}
        confirmLabel="Remove"
      />
    </div>
  );
}
