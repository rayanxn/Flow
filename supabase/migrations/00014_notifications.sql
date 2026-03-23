-- 00014_notifications.sql
-- User notifications linked to activities

create table notifications (
  id           uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces on delete cascade,
  user_id      uuid not null references profiles(id) on delete cascade,
  activity_id  uuid not null references activities(id) on delete cascade,
  type         text not null default 'general'
               check (type in ('mention', 'assigned', 'comment', 'status_change', 'general')),
  is_read      boolean not null default false,
  created_at   timestamptz not null default now()
);

create index idx_notifications_user on notifications (user_id, is_read);
create index idx_notifications_workspace on notifications (workspace_id);
create index idx_notifications_activity on notifications (activity_id);
