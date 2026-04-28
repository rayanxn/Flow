-- 00024_guest_workspaces.sql
-- Lifecycle metadata for isolated anonymous guest demo workspaces.

create table public.guest_workspaces (
  id                    uuid primary key default gen_random_uuid(),
  workspace_id          uuid unique references public.workspaces(id) on delete set null,
  workspace_slug        text not null,
  source_workspace_id   uuid references public.workspaces(id) on delete set null,
  source_workspace_slug text not null,
  guest_user_id         uuid not null,
  created_at            timestamptz not null default now(),
  expires_at            timestamptz not null,
  deleted_at            timestamptz,
  cleanup_error         text
);

create index idx_guest_workspaces_expires_at
  on public.guest_workspaces (expires_at)
  where deleted_at is null;

create index idx_guest_workspaces_guest_user_id
  on public.guest_workspaces (guest_user_id);

alter table public.guest_workspaces enable row level security;
