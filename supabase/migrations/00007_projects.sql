-- 00007_projects.sql
-- Projects within a workspace

create table projects (
  id           uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces on delete cascade,
  name         text not null,
  description  text,
  color        text not null default '#6B7280',
  lead_id      uuid references profiles(id) on delete set null,
  team_id      uuid references teams(id) on delete set null,
  is_private   boolean not null default false,
  is_archived  boolean not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index idx_projects_workspace on projects (workspace_id);
create index idx_projects_team on projects (team_id);

-- Now add the FK from workspace_members.primary_project_id → projects
alter table workspace_members
  add constraint workspace_members_primary_project_fk
  foreign key (primary_project_id) references projects(id) on delete set null;

create trigger projects_updated_at
  before update on projects
  for each row
  execute function public.update_updated_at();
