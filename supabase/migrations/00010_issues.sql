-- 00010_issues.sql
-- Core issue / task records

create table issues (
  id           uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces on delete cascade,
  project_id   uuid not null references projects on delete cascade,
  issue_number int not null,
  issue_key    text not null,
  title        text not null,
  description  text,
  status       text not null default 'todo'
               check (status in ('todo', 'in_progress', 'in_review', 'done')),
  priority     int not null default 3
               check (priority >= 0 and priority <= 3),
  assignee_id  uuid references profiles(id) on delete set null,
  sprint_id    uuid references sprints(id) on delete set null,
  due_date     date,
  story_points int,
  sort_order   float8 not null default 0,
  created_by   uuid not null references profiles(id),
  completed_at timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- Unique issue number per workspace
alter table issues
  add constraint issues_workspace_number_unique unique (workspace_id, issue_number);

create index idx_issues_project on issues (project_id);
create index idx_issues_workspace on issues (workspace_id);
create index idx_issues_assignee on issues (assignee_id);
create index idx_issues_sprint on issues (sprint_id);
create index idx_issues_status on issues (project_id, status);

create trigger issues_updated_at
  before update on issues
  for each row
  execute function public.update_updated_at();
