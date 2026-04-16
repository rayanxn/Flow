import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { buildAuthRedirectUrl } from "@/lib/utils/redirect-path";
import { getInviteStatus, getJoinInviteRecord } from "@/lib/invites";
import { JoinInviteClient } from "./join-invite-client";

function InviteStateCard({
  eyebrow,
  title,
  body,
  children,
}: {
  eyebrow: string;
  title: string;
  body: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex min-h-screen max-w-xl items-center px-4 py-12">
      <div className="w-full rounded-[28px] border border-border bg-surface px-8 py-8 shadow-sm">
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-text-muted">
          {eyebrow}
        </p>
        <h1 className="mt-3 font-serif text-3xl text-text">{title}</h1>
        <p className="mt-3 text-sm leading-6 text-text-secondary">{body}</p>
        {children ? <div className="mt-6">{children}</div> : null}
      </div>
    </div>
  );
}

export default async function JoinInvitePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const joinPath = `/join/${code}`;
  const inviteRecord = await getJoinInviteRecord(code);

  if (!inviteRecord?.workspace) {
    return (
      <InviteStateCard
        eyebrow="Invite not found"
        title="This invite link is invalid"
        body="Ask your workspace admin for a fresh invite link or a targeted email invite."
      />
    );
  }

  const workspace = inviteRecord.workspace;
  const inviteStatus = getInviteStatus(inviteRecord);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const currentEmail = user?.email?.trim().toLowerCase() ?? "";
  const inviteEmail = inviteRecord.email?.trim().toLowerCase() ?? "";
  const isMismatch =
    Boolean(user) &&
    inviteRecord.invite_type === "email" &&
    inviteEmail.length > 0 &&
    inviteEmail !== currentEmail;

  const { data: existingMembership } = user
    ? await supabase
        .from("workspace_members")
        .select("id")
        .eq("workspace_id", inviteRecord.workspace_id)
        .eq("user_id", user.id)
        .maybeSingle()
    : { data: null };

  if (inviteStatus === "revoked") {
    return (
      <InviteStateCard
        eyebrow="Invite revoked"
        title="This invite has been revoked"
        body={`The invite to join ${workspace.name} is no longer active. Ask an owner or admin to send a new one.`}
      />
    );
  }

  if (inviteStatus === "expired") {
    return (
      <InviteStateCard
        eyebrow="Invite expired"
        title="This invite has expired"
        body={`The invite to join ${workspace.name} is older than the allowed window. Ask for a fresh invite.`}
      />
    );
  }

  if (
    inviteRecord.invite_type === "email" &&
    inviteRecord.accepted_at &&
    inviteRecord.accepted_by &&
    inviteRecord.accepted_by !== user?.id &&
    !existingMembership
  ) {
    return (
      <InviteStateCard
        eyebrow="Invite used"
        title="This invite has already been accepted"
        body="Targeted email invites are single-use. Ask the workspace owner or admin for a new invite if you still need access."
      />
    );
  }

  if (!user) {
    return (
      <InviteStateCard
        eyebrow="Workspace invite"
        title={`Join ${workspace.name}`}
        body={
          inviteRecord.invite_type === "email"
            ? `Sign in or create an account with ${inviteRecord.email} to accept this invite.`
            : "Sign in or create an account to join this workspace with the link you opened."
        }
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href={buildAuthRedirectUrl("/login", joinPath)}
            className="rounded-lg bg-primary px-4 py-2.5 text-center text-sm font-medium text-background transition-colors hover:bg-primary-hover"
          >
            Sign in
          </Link>
          <Link
            href={buildAuthRedirectUrl("/signup", joinPath)}
            className="rounded-lg border border-border-input px-4 py-2.5 text-center text-sm font-medium text-text transition-colors hover:bg-surface-hover"
          >
            Create account
          </Link>
        </div>
      </InviteStateCard>
    );
  }

  if (existingMembership) {
    return (
      <InviteStateCard
        eyebrow="Already a member"
        title={`You already belong to ${workspace.name}`}
        body="No extra onboarding is required. Open the workspace directly."
      >
        <Link
          href={`/${workspace.slug}/dashboard`}
          className="inline-flex rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-background transition-colors hover:bg-primary-hover"
        >
          Open workspace
        </Link>
      </InviteStateCard>
    );
  }

  if (isMismatch) {
    return (
      <InviteStateCard
        eyebrow="Account mismatch"
        title="This invite is for a different email"
        body={`You’re signed in as ${user.email}, but this invite was sent to ${inviteRecord.email}. Switch accounts to continue.`}
      >
        <JoinInviteClient
          code={code}
          joinPath={joinPath}
          mismatch
        />
      </InviteStateCard>
    );
  }

  return (
    <InviteStateCard
      eyebrow="Workspace invite"
      title={`Join ${workspace.name}`}
      body={
        inviteRecord.invite_type === "email"
          ? `You’ve been invited as an ${inviteRecord.role}. Accept the invite to join this workspace.`
          : "This join link grants member access. Accept the invite to enter the workspace."
      }
    >
      <JoinInviteClient
        code={code}
        joinPath={joinPath}
      />
    </InviteStateCard>
  );
}
