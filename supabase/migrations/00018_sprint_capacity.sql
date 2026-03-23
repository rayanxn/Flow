-- 00018_sprint_capacity.sql
-- Optional story-point capacity target for sprint planning

alter table sprints
  add column capacity integer;
