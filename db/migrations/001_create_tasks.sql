CREATE TABLE IF NOT EXISTS tasks (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL,
  notes       TEXT,
  is_complete BOOLEAN NOT NULL DEFAULT false,
  priority    SMALLINT NOT NULL DEFAULT 0, -- 0=none, 1=low, 2=medium, 3=high
  due_date    TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
 
CREATE INDEX IF NOT EXISTS idx_tasks_is_complete ON tasks (is_complete);
CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks (created_at DESC);