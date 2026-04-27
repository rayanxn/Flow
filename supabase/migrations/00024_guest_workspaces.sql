-- 00024_guest_workspaces.sql
-- Lifecycle metadata for isolated anonymous demo workspaces.

create table guest_workspaces (
  id                    uuid primary key default gen_random_uuid(),
  workspace_id          uuid references workspaces(id) on delete set null,
  workspace_slug        text not null,
  source_workspace_id   uuid references workspaces(id) on delete set null,
  source_workspace_slug text not null,
  guest_user_id         uuid not null,
  created_at            timestamptz not null default now(),
  expires_at            timestamptz not null,
  cleaned_at            timestamptz,
  cleanup_error         text
);

create unique index guest_workspaces_workspace_unique
  on guest_workspaces (workspace_id)
  where workspace_id is not null;

create index idx_guest_workspaces_expired
  on guest_workspaces (expires_at)
  where cleaned_at is null;

create index idx_guest_workspaces_guest_user
  on guest_workspaces (guest_user_id);

alter table guest_workspaces enable row level security;
