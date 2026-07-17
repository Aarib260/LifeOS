-- Run against your Neon Postgres database, same as the previous migrations.
--
-- content stores HTML produced by the Tiptap editor (bold/italic/lists).
-- Multiple entries per day are allowed — no unique constraint on entry_date.

CREATE TABLE IF NOT EXISTS journal_entries (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT,
  content     TEXT NOT NULL DEFAULT '',
  entry_date  DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_journal_entries_entry_date ON journal_entries (entry_date DESC);