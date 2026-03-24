-- 00019_enable_realtime_notifications.sql
-- Enable Supabase Realtime for the notifications table so clients can
-- subscribe to postgres_changes and receive live inbox updates.

alter publication supabase_realtime add table notifications;

-- REPLICA IDENTITY FULL ensures UPDATE and DELETE payloads include
-- the full row (needed for user_id filtering on the client).
alter table notifications replica identity full;
