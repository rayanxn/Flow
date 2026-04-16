-- 00022_sub_issues.sql
-- Single-level parent-child hierarchy for issues

alter table public.issues
  add column parent_id uuid references public.issues(id) on delete set null;

alter table public.issues
  add constraint issues_parent_not_self check (parent_id is null or parent_id <> id);

create index idx_issues_parent on public.issues (parent_id);

create or replace function public.validate_issue_parent_assignment()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  v_parent public.issues;
begin
  if new.parent_id is null then
    return new;
  end if;

  if new.parent_id = new.id then
    raise exception 'Issue cannot be its own parent';
  end if;

  select *
  into v_parent
  from public.issues
  where id = new.parent_id;

  if v_parent.id is null then
    raise exception 'Parent issue not found';
  end if;

  if v_parent.parent_id is not null then
    raise exception 'Sub-issues cannot have their own sub-issues';
  end if;

  if v_parent.workspace_id <> new.workspace_id then
    raise exception 'Parent issue must belong to the same workspace';
  end if;

  if v_parent.project_id <> new.project_id then
    raise exception 'Parent issue must belong to the same project';
  end if;

  if exists (
    select 1
    from public.issues
    where parent_id = new.id
  ) then
    raise exception 'Parent issues cannot become sub-issues while they still have children';
  end if;

  return new;
end;
$$;

drop trigger if exists issues_validate_parent on public.issues;

create trigger issues_validate_parent
  before insert or update of parent_id, project_id, workspace_id
  on public.issues
  for each row
  execute function public.validate_issue_parent_assignment();

drop function if exists public.create_issue(
  uuid,
  uuid,
  text,
  text,
  text,
  int,
  uuid,
  uuid,
  date,
  int,
  double precision,
  uuid[]
);

create function public.create_issue(
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
  p_label_ids    uuid[]   default '{}',
  p_parent_id    uuid     default null
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
  if not exists (
    select 1 from public.workspace_members
    where workspace_id = p_workspace_id
      and user_id = v_caller
  ) then
    raise exception 'Not a member of this workspace';
  end if;

  update public.workspaces
  set issue_counter = issue_counter + 1
  where id = p_workspace_id
  returning issue_counter, issue_prefix
  into v_number, v_prefix;

  insert into public.issues (
    workspace_id, project_id, issue_number, issue_key,
    title, description, status, priority,
    assignee_id, sprint_id, due_date, story_points,
    sort_order, created_by, parent_id
  ) values (
    p_workspace_id, p_project_id, v_number,
    v_prefix || '-' || v_number,
    p_title, p_description, p_status, p_priority,
    p_assignee_id, p_sprint_id, p_due_date, p_story_points,
    p_sort_order, v_caller, p_parent_id
  )
  returning * into v_issue;

  if array_length(p_label_ids, 1) is not null then
    insert into public.issue_labels (issue_id, label_id)
    select v_issue.id, unnest(p_label_ids);
  end if;

  return v_issue;
end;
$$;
