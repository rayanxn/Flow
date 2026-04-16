-- 00023_invite_flow_rework.sql
-- Rework invites around a canonical join flow and auditable lifecycle state.

alter table public.workspace_invites
  add column invite_type text not null default 'link'
    check (invite_type in ('email', 'link')),
  add column email text,
  add column accepted_at timestamptz,
  add column accepted_by uuid references public.profiles(id) on delete set null,
  add column revoked_at timestamptz,
  add column revoked_by uuid references public.profiles(id) on delete set null;

alter table public.workspace_invites
  add constraint workspace_invites_email_by_type_check
    check (
      (invite_type = 'email' and email is not null)
      or (invite_type = 'link' and email is null)
    ),
  add constraint workspace_invites_link_role_check
    check (invite_type <> 'link' or role = 'member');

create index idx_workspace_invites_email
  on public.workspace_invites (email);

create index idx_workspace_invites_lookup
  on public.workspace_invites (workspace_id, invite_type, created_at desc);

create policy "workspace_invites: owner/admin can update"
  on public.workspace_invites for update
  to authenticated
  using (public.get_user_workspace_role(workspace_id) in ('owner', 'admin'))
  with check (public.get_user_workspace_role(workspace_id) in ('owner', 'admin'));
