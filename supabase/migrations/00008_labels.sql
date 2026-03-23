-- 00008_labels.sql
-- Per-project labels for issues

create table labels (
  id         uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects on delete cascade,
  name       text not null,
  color      text not null
);

-- One label name per project
alter table labels
  add constraint labels_project_name_unique unique (project_id, name);
