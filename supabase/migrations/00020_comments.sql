-- 00020_comments.sql
-- Issue comments with @mention support

create table comments (
  id           uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces on delete cascade,
  issue_id     uuid not null references issues on delete cascade,
  author_id    uuid not null references profiles(id) on delete cascade,
  body         text not null,
  mentions     uuid[] not null default '{}',
  is_edited    boolean not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index idx_comments_issue on comments (issue_id, created_at);
create index idx_comments_workspace on comments (workspace_id);
create index idx_comments_author on comments (author_id);

-- RLS
alter table comments enable row level security;

create policy "comments: workspace members can read"
  on comments for select
  to authenticated
  using (public.is_workspace_member(workspace_id));

create policy "comments: workspace members can insert"
  on comments for insert
  to authenticated
  with check (
    public.is_workspace_member(workspace_id)
    and author_id = auth.uid()
  );

create policy "comments: author can update"
  on comments for update
  to authenticated
  using (author_id = auth.uid())
  with check (author_id = auth.uid());

create policy "comments: author or admin can delete"
  on comments for delete
  to authenticated
  using (
    author_id = auth.uid()
    or public.get_user_workspace_role(workspace_id) in ('owner', 'admin')
  );

-- Realtime
alter publication supabase_realtime add table comments;
alter table comments replica identity full;
