-- 00004_workspace_invites.sql
-- Invite codes for workspace onboarding

create table workspace_invites (
  id           uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces on delete cascade,
  code         text unique not null default gen_random_uuid()::text,
  role         text not null default 'member'
               check (role in ('admin', 'member')),
  created_by   uuid not null references profiles(id) on delete cascade,
  expires_at   timestamptz,
  created_at   timestamptz not null default now()
);

create index idx_workspace_invites_workspace
  on workspace_invites (workspace_id);

create index idx_workspace_invites_code
  on workspace_invites (code);
