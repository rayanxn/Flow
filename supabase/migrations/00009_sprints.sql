-- 00009_sprints.sql
-- Time-boxed sprints scoped to a project

create table sprints (
  id           uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces on delete cascade,
  project_id   uuid not null references projects on delete cascade,
  name         text not null,
  goal         text,
  status       text not null default 'planning'
               check (status in ('planning', 'active', 'completed')),
  start_date   date,
  end_date     date,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index idx_sprints_project on sprints (project_id);
create index idx_sprints_workspace on sprints (workspace_id);

-- At most one active sprint per project
create unique index idx_one_active_sprint_per_project
  on sprints (project_id)
  where status = 'active';

create trigger sprints_updated_at
  before update on sprints
  for each row
  execute function public.update_updated_at();
