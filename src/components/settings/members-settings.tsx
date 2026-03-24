"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  updateMemberRole,
  removeMember,
  createWorkspaceInvite,
} from "@/lib/actions/workspaces";
import { DeleteConfirmationModal } from "@/components/ui/delete-confirmation-modal";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { WorkspaceRole } from "@/lib/types";

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
  workspaceId: string;
  currentUserId: string;
  currentUserRole: WorkspaceRole;
}

const ROLE_LABELS: Record<WorkspaceRole, string> = {
  owner: "Owner",
  admin: "Admin",
  member: "Member",
};

const ROLE_BADGE_STYLES: Record<WorkspaceRole, string> = {
  owner: "bg-[#2E2E2C] text-white",
  admin: "bg-[#2E2E2C14] text-text",
  member: "bg-[#2E2E2C0A] text-text-muted",
};

export function MembersSettings({
  members,
  workspaceId,
  currentUserId,
  currentUserRole,
}: MembersSettingsProps) {
  const router = useRouter();
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [removingMember, setRemovingMember] = useState<Member | null>(null);
  const [removeLoading, setRemoveLoading] = useState(false);

  const canManageMembers = currentUserRole === "owner" || currentUserRole === "admin";

  const handleGenerateInvite = useCallback(async () => {
    setInviteLoading(true);
    const result = await createWorkspaceInvite(workspaceId, "member");
    if ("data" in result && result.data) {
      const url = `${window.location.origin}/join/${result.data.code}`;
      setInviteLink(url);
      navigator.clipboard.writeText(url);
    }
    setInviteLoading(false);
  }, [workspaceId]);

  const handleRoleChange = useCallback(
    async (memberId: string, newRole: "admin" | "member") => {
      await updateMemberRole(memberId, newRole);
      router.refresh();
    },
    [router],
  );

  const handleRemoveMember = useCallback(async () => {
    if (!removingMember) return;
    setRemoveLoading(true);
    await removeMember(removingMember.id);
    setRemoveLoading(false);
    setRemovingMember(null);
    router.refresh();
  }, [removingMember, router]);

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-semibold text-text leading-7">Members</h1>
          <p className="text-[13px] text-text-muted mt-1 leading-[18px]">
            Manage who has access to this workspace.
          </p>
        </div>
        {canManageMembers && (
          <button
            type="button"
            onClick={handleGenerateInvite}
            disabled={inviteLoading}
            className="rounded-lg py-2 px-4 bg-[#2E2E2C] text-white text-[13px] font-medium hover:bg-[#1E1E1C] transition-colors disabled:opacity-50"
          >
            {inviteLoading ? "Generating..." : "Generate invite link"}
          </button>
        )}
      </div>

      {inviteLink && (
        <div className="mt-4 flex items-center gap-3 rounded-[10px] bg-[#F6F5F1] border border-[#2E2E2C14] px-4 py-3">
          <span className="flex-1 text-[13px] font-mono text-text truncate">
            {inviteLink}
          </span>
          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(inviteLink);
            }}
            className="text-[12px] font-medium text-text-muted hover:text-text transition-colors shrink-0"
          >
            Copy
          </button>
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
              className="flex items-center gap-3 py-3 px-3 rounded-lg hover:bg-[#F6F5F1] transition-colors"
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
                  className="px-2 py-1 rounded-md text-[11px] font-medium bg-[#2E2E2C0A] border border-[#2E2E2C14] text-text focus:outline-none"
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
                  className="text-[12px] text-text-muted hover:text-[#C45A3C] transition-colors"
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
