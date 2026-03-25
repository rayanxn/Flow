-- Add checklist JSONB column to issues for lightweight sub-tasks
-- Schema: [{ "id": "uuid", "text": "string", "completed": boolean }]
ALTER TABLE issues ADD COLUMN checklist jsonb NOT NULL DEFAULT '[]';
