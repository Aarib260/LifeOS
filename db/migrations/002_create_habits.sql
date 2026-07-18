-- Run against your Neon Postgres database, same as 001_create_tasks.sql.
--
-- Two tables: `habits` is the definition (name, color, which days it's
-- scheduled for), `habit_logs` is one row per day it was actually
-- completed. Streaks are computed from habit_logs at read time rather
-- than stored as a running counter, so they can never drift out of sync
-- with the actual history.

CREATE TABLE IF NOT EXISTS habits (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  color       TEXT NOT NULL DEFAULT '#22D3EE',
  target_days SMALLINT[] NOT NULL DEFAULT '{0,1,2,3,4,5,6}', -- 0=Sun..6=Sat
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS habit_logs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  habit_id    UUID NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
  logged_date DATE NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (habit_id, logged_date)
);

CREATE INDEX IF NOT EXISTS idx_habit_logs_habit_id ON habit_logs (habit_id);
