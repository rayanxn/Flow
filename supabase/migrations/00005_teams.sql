-- 00005_teams.sql
-- Teams within a workspace

create table teams (
  id           uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces on delete cascade,
  name         text not null,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index idx_teams_workspace on teams (workspace_id);

create trigger teams_updated_at
  before update on teams
  for each row
  execute function public.update_updated_at();
