-- 00016_rls_policies.sql
-- Enable RLS on every table and define access policies.

-- ════════════════════════════════════════════════
-- 1. PROFILES
-- ════════════════════════════════════════════════
alter table profiles enable row level security;

create policy "profiles: anyone authenticated can read"
  on profiles for select
  to authenticated
  using (true);

create policy "profiles: users can update own profile"
  on profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- ════════════════════════════════════════════════
-- 2. WORKSPACES
-- ════════════════════════════════════════════════
alter table workspaces enable row level security;

create policy "workspaces: members can read"
  on workspaces for select
  to authenticated
  using (public.is_workspace_member(id));

create policy "workspaces: owner/admin can update"
  on workspaces for update
  to authenticated
  using (public.get_user_workspace_role(id) in ('owner', 'admin'))
  with check (public.get_user_workspace_role(id) in ('owner', 'admin'));

create policy "workspaces: owner can delete"
  on workspaces for delete
  to authenticated
  using (public.get_user_workspace_role(id) = 'owner');

-- ════════════════════════════════════════════════
-- 3. WORKSPACE_MEMBERS
-- ════════════════════════════════════════════════
alter table workspace_members enable row level security;

create policy "workspace_members: members can read"
  on workspace_members for select
  to authenticated
  using (public.is_workspace_member(workspace_id));

create policy "workspace_members: owner/admin can insert"
  on workspace_members for insert
  to authenticated
  with check (public.get_user_workspace_role(workspace_id) in ('owner', 'admin'));

create policy "workspace_members: owner/admin can update"
  on workspace_members for update
  to authenticated
  using (public.get_user_workspace_role(workspace_id) in ('owner', 'admin'))
  with check (public.get_user_workspace_role(workspace_id) in ('owner', 'admin'));

create policy "workspace_members: owner/admin or self can delete"
  on workspace_members for delete
  to authenticated
  using (
    public.get_user_workspace_role(workspace_id) in ('owner', 'admin')
    or user_id = auth.uid()
  );

-- ════════════════════════════════════════════════
-- 4. WORKSPACE_INVITES
-- ════════════════════════════════════════════════
alter table workspace_invites enable row level security;

create policy "workspace_invites: owner/admin can read"
  on workspace_invites for select
  to authenticated
  using (public.get_user_workspace_role(workspace_id) in ('owner', 'admin'));

create policy "workspace_invites: owner/admin can insert"
  on workspace_invites for insert
  to authenticated
  with check (public.get_user_workspace_role(workspace_id) in ('owner', 'admin'));

create policy "workspace_invites: owner/admin can delete"
  on workspace_invites for delete
  to authenticated
  using (public.get_user_workspace_role(workspace_id) in ('owner', 'admin'));

-- ════════════════════════════════════════════════
-- 5. TEAMS
-- ════════════════════════════════════════════════
alter table teams enable row level security;

create policy "teams: members can read"
  on teams for select
  to authenticated
  using (public.is_workspace_member(workspace_id));

create policy "teams: members can insert"
  on teams for insert
  to authenticated
  with check (public.is_workspace_member(workspace_id));

create policy "teams: members can update"
  on teams for update
  to authenticated
  using (public.is_workspace_member(workspace_id))
  with check (public.is_workspace_member(workspace_id));

create policy "teams: members can delete"
  on teams for delete
  to authenticated
  using (public.is_workspace_member(workspace_id));

-- ════════════════════════════════════════════════
-- 6. TEAM_MEMBERS
-- ════════════════════════════════════════════════
alter table team_members enable row level security;

create policy "team_members: workspace members can read"
  on team_members for select
  to authenticated
  using (
    public.is_workspace_member(
      (select t.workspace_id from teams t where t.id = team_id)
    )
  );

create policy "team_members: workspace members can insert"
  on team_members for insert
  to authenticated
  with check (
    public.is_workspace_member(
      (select t.workspace_id from teams t where t.id = team_id)
    )
  );

create policy "team_members: workspace members can update"
  on team_members for update
  to authenticated
  using (
    public.is_workspace_member(
      (select t.workspace_id from teams t where t.id = team_id)
    )
  )
  with check (
    public.is_workspace_member(
      (select t.workspace_id from teams t where t.id = team_id)
    )
  );

create policy "team_members: workspace members can delete"
  on team_members for delete
  to authenticated
  using (
    public.is_workspace_member(
      (select t.workspace_id from teams t where t.id = team_id)
    )
  );

-- ════════════════════════════════════════════════
-- 7. PROJECTS
-- ════════════════════════════════════════════════
alter table projects enable row level security;

create policy "projects: members can read non-private or accessible"
  on projects for select
  to authenticated
  using (
    public.is_workspace_member(workspace_id)
    and (
      not is_private
      or lead_id = auth.uid()
      or exists (
        select 1 from team_members tm
        where tm.team_id = projects.team_id
          and tm.user_id = auth.uid()
      )
      or public.get_user_workspace_role(workspace_id) in ('owner', 'admin')
    )
  );

create policy "projects: members can insert"
  on projects for insert
  to authenticated
  with check (public.is_workspace_member(workspace_id));

create policy "projects: owner/admin or lead can update"
  on projects for update
  to authenticated
  using (
    public.get_user_workspace_role(workspace_id) in ('owner', 'admin')
    or lead_id = auth.uid()
  )
  with check (
    public.get_user_workspace_role(workspace_id) in ('owner', 'admin')
    or lead_id = auth.uid()
  );

create policy "projects: owner/admin can delete"
  on projects for delete
  to authenticated
  using (public.get_user_workspace_role(workspace_id) in ('owner', 'admin'));

-- ════════════════════════════════════════════════
-- 8. LABELS
-- ════════════════════════════════════════════════
alter table labels enable row level security;

create policy "labels: workspace members can read"
  on labels for select
  to authenticated
  using (
    public.is_workspace_member(
      (select p.workspace_id from projects p where p.id = project_id)
    )
  );

create policy "labels: workspace members can insert"
  on labels for insert
  to authenticated
  with check (
    public.is_workspace_member(
      (select p.workspace_id from projects p where p.id = project_id)
    )
  );

create policy "labels: workspace members can update"
  on labels for update
  to authenticated
  using (
    public.is_workspace_member(
      (select p.workspace_id from projects p where p.id = project_id)
    )
  )
  with check (
    public.is_workspace_member(
      (select p.workspace_id from projects p where p.id = project_id)
    )
  );

create policy "labels: workspace members can delete"
  on labels for delete
  to authenticated
  using (
    public.is_workspace_member(
      (select p.workspace_id from projects p where p.id = project_id)
    )
  );

-- ════════════════════════════════════════════════
-- 9. SPRINTS
-- ════════════════════════════════════════════════
alter table sprints enable row level security;

create policy "sprints: members can read"
  on sprints for select
  to authenticated
  using (public.is_workspace_member(workspace_id));

create policy "sprints: members can insert"
  on sprints for insert
  to authenticated
  with check (public.is_workspace_member(workspace_id));

create policy "sprints: members can update"
  on sprints for update
  to authenticated
  using (public.is_workspace_member(workspace_id))
  with check (public.is_workspace_member(workspace_id));

create policy "sprints: members can delete"
  on sprints for delete
  to authenticated
  using (public.is_workspace_member(workspace_id));

-- ════════════════════════════════════════════════
-- 10. ISSUES
-- ════════════════════════════════════════════════
alter table issues enable row level security;

create policy "issues: members can read"
  on issues for select
  to authenticated
  using (public.is_workspace_member(workspace_id));

create policy "issues: members can insert"
  on issues for insert
  to authenticated
  with check (public.is_workspace_member(workspace_id));

create policy "issues: members can update"
  on issues for update
  to authenticated
  using (public.is_workspace_member(workspace_id))
  with check (public.is_workspace_member(workspace_id));

create policy "issues: owner/admin or creator can delete"
  on issues for delete
  to authenticated
  using (
    public.get_user_workspace_role(workspace_id) in ('owner', 'admin')
    or created_by = auth.uid()
  );

-- ════════════════════════════════════════════════
-- 11. ISSUE_LABELS
-- ════════════════════════════════════════════════
alter table issue_labels enable row level security;

create policy "issue_labels: workspace members can read"
  on issue_labels for select
  to authenticated
  using (
    public.is_workspace_member(
      (select i.workspace_id from issues i where i.id = issue_id)
    )
  );

create policy "issue_labels: workspace members can insert"
  on issue_labels for insert
  to authenticated
  with check (
    public.is_workspace_member(
      (select i.workspace_id from issues i where i.id = issue_id)
    )
  );

create policy "issue_labels: workspace members can delete"
  on issue_labels for delete
  to authenticated
  using (
    public.is_workspace_member(
      (select i.workspace_id from issues i where i.id = issue_id)
    )
  );

-- ════════════════════════════════════════════════
-- 12. VIEWS
-- ════════════════════════════════════════════════
alter table views enable row level security;

create policy "views: members can read"
  on views for select
  to authenticated
  using (public.is_workspace_member(workspace_id));

create policy "views: members can insert"
  on views for insert
  to authenticated
  with check (public.is_workspace_member(workspace_id));

create policy "views: members can update"
  on views for update
  to authenticated
  using (public.is_workspace_member(workspace_id))
  with check (public.is_workspace_member(workspace_id));

create policy "views: members can delete"
  on views for delete
  to authenticated
  using (public.is_workspace_member(workspace_id));

-- ════════════════════════════════════════════════
-- 13. ACTIVITIES
-- ════════════════════════════════════════════════
alter table activities enable row level security;

create policy "activities: members can read"
  on activities for select
  to authenticated
  using (public.is_workspace_member(workspace_id));

create policy "activities: members can insert"
  on activities for insert
  to authenticated
  with check (public.is_workspace_member(workspace_id));

-- ════════════════════════════════════════════════
-- 14. NOTIFICATIONS
-- ════════════════════════════════════════════════
alter table notifications enable row level security;

create policy "notifications: user can read own"
  on notifications for select
  to authenticated
  using (user_id = auth.uid());

create policy "notifications: user can update own (mark read)"
  on notifications for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "notifications: system can insert"
  on notifications for insert
  to authenticated
  with check (public.is_workspace_member(workspace_id));
