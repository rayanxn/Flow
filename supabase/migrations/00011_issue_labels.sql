-- 00011_issue_labels.sql
-- Many-to-many join between issues and labels

create table issue_labels (
  issue_id uuid not null references issues on delete cascade,
  label_id uuid not null references labels on delete cascade,
  primary key (issue_id, label_id)
);

create index idx_issue_labels_label on issue_labels (label_id);
