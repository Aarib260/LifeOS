-- Run against your Neon Postgres database, same as the previous migrations.
--
-- Phase 2 scope: single-date events only (no recurrence, no multi-day
-- spans yet). start_time/end_time are nullable — leave both null for an
-- all-day event.

CREATE TABLE IF NOT EXISTS events (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL,
  description TEXT,
  event_date  DATE NOT NULL,
  start_time  TIME,
  end_time    TIME,
  color       TEXT NOT NULL DEFAULT '#22D3EE',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_events_event_date ON events (event_date);