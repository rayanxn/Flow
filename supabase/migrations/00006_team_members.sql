-- 00006_team_members.sql
-- Join table linking users to teams

create table team_members (
  id      uuid primary key default gen_random_uuid(),
  team_id uuid not null references teams on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade
);

-- One membership per user per team
alter table team_members
  add constraint team_members_unique unique (team_id, user_id);

create index idx_team_members_user on team_members (user_id);
