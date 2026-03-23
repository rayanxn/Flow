-- 00003_workspace_members.sql
-- Join table linking users to workspaces with roles

create table workspace_members (
  id                 uuid primary key default gen_random_uuid(),
  workspace_id       uuid not null references workspaces on delete cascade,
  user_id            uuid not null references profiles(id) on delete cascade,
  role               text not null default 'member'
                     check (role in ('owner', 'admin', 'member')),
  primary_project_id uuid,  -- FK added after projects table exists
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

-- Unique constraint: one membership per user per workspace
alter table workspace_members
  add constraint workspace_members_unique unique (workspace_id, user_id);

-- Index for lookups by user_id
create index idx_workspace_members_user_id on workspace_members (user_id);

-- Composite index for auth checks
create index idx_workspace_members_user_ws
  on workspace_members (user_id, workspace_id)
  include (role);

create trigger workspace_members_updated_at
  before update on workspace_members
  for each row
  execute function public.update_updated_at();
