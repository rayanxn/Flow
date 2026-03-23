-- 00013_activities.sql
-- Activity / audit log

create table activities (
  id           uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces on delete cascade,
  actor_id     uuid not null references profiles(id) on delete cascade,
  action       text not null,
  entity_type  text not null,
  entity_id    uuid not null,
  metadata     jsonb not null default '{}',
  created_at   timestamptz not null default now()
);

create index idx_activities_workspace on activities (workspace_id);
create index idx_activities_entity on activities (entity_type, entity_id);
create index idx_activities_actor on activities (actor_id);
