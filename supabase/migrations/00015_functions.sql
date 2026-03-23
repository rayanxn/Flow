-- 00015_functions.sql
-- Helper functions and RPC endpoints

-- ──────────────────────────────────────────────
-- is_workspace_member(ws_id uuid) → boolean
-- ──────────────────────────────────────────────
create or replace function public.is_workspace_member(ws_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.workspace_members
    where workspace_id = ws_id
      and user_id = auth.uid()
  );
$$;

-- ──────────────────────────────────────────────
-- get_user_workspace_role(ws_id uuid) → text
-- ──────────────────────────────────────────────
create or replace function public.get_user_workspace_role(ws_id uuid)
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select role
  from public.workspace_members
  where workspace_id = ws_id
    and user_id = auth.uid()
  limit 1;
$$;

-- ──────────────────────────────────────────────
-- create_workspace(p_name, p_slug, p_team_size)
-- Creates the workspace and adds the caller as owner.
-- ──────────────────────────────────────────────
create or replace function public.create_workspace(
  p_name      text,
  p_slug      text,
  p_team_size text default null
)
returns public.workspaces
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_workspace public.workspaces;
begin
  insert into public.workspaces (name, slug)
  values (p_name, p_slug)
  returning * into v_workspace;

  insert into public.workspace_members (workspace_id, user_id, role)
  values (v_workspace.id, auth.uid(), 'owner');

  return v_workspace;
end;
$$;

-- ──────────────────────────────────────────────
-- create_issue(...)
-- Atomically increments the workspace counter,
-- builds issue_key, inserts issue + labels.
-- ──────────────────────────────────────────────
create or replace function public.create_issue(
  p_workspace_id uuid,
  p_project_id   uuid,
  p_title        text,
  p_description  text     default null,
  p_status       text     default 'todo',
  p_priority     int      default 3,
  p_assignee_id  uuid     default null,
  p_sprint_id    uuid     default null,
  p_due_date     date     default null,
  p_story_points int      default null,
  p_sort_order   float8   default 0,
  p_label_ids    uuid[]   default '{}'
)
returns public.issues
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_caller   uuid := auth.uid();
  v_number   int;
  v_prefix   text;
  v_issue    public.issues;
begin
  -- Verify caller is a workspace member
  if not exists (
    select 1 from public.workspace_members
    where workspace_id = p_workspace_id
      and user_id = v_caller
  ) then
    raise exception 'Not a member of this workspace';
  end if;

  -- Atomically increment issue counter and get prefix
  update public.workspaces
  set issue_counter = issue_counter + 1
  where id = p_workspace_id
  returning issue_counter, issue_prefix
  into v_number, v_prefix;

  -- Insert the issue
  insert into public.issues (
    workspace_id, project_id, issue_number, issue_key,
    title, description, status, priority,
    assignee_id, sprint_id, due_date, story_points,
    sort_order, created_by
  ) values (
    p_workspace_id, p_project_id, v_number,
    v_prefix || '-' || v_number,
    p_title, p_description, p_status, p_priority,
    p_assignee_id, p_sprint_id, p_due_date, p_story_points,
    p_sort_order, v_caller
  )
  returning * into v_issue;

  -- Attach labels (if any)
  if array_length(p_label_ids, 1) is not null then
    insert into public.issue_labels (issue_id, label_id)
    select v_issue.id, unnest(p_label_ids);
  end if;

  return v_issue;
end;
$$;
