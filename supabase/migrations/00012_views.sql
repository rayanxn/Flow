-- 00012_views.sql
-- Saved filter views per workspace

create table views (
  id           uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces on delete cascade,
  name         text not null,
  description  text,
  filters      jsonb not null default '{}',
  created_by   uuid not null references profiles(id),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index idx_views_workspace on views (workspace_id);

create trigger views_updated_at
  before update on views
  for each row
  execute function public.update_updated_at();
