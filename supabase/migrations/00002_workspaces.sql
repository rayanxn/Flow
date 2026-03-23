-- 00002_workspaces.sql
-- Multi-tenant root entity

create table workspaces (
  id                    uuid primary key default gen_random_uuid(),
  name                  text not null,
  slug                  text unique not null
                        constraint slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  issue_prefix          text not null default 'FLO',
  issue_counter         int not null default 0,
  default_sprint_length int not null default 14,
  timezone              text not null default 'UTC',
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

create trigger workspaces_updated_at
  before update on workspaces
  for each row
  execute function public.update_updated_at();
