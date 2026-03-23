-- 00017_enable_realtime_issues.sql
-- Enable Supabase Realtime for the issues table so clients can
-- subscribe to postgres_changes and receive live board updates.

alter publication supabase_realtime add table issues;

-- REPLICA IDENTITY FULL ensures UPDATE and DELETE payloads include
-- the full row (needed for project_id filtering on the client).
alter table issues replica identity full;
