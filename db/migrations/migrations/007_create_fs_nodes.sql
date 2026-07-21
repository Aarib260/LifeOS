-- Run this against your Neon Postgres database before using the File
-- Explorer, Terminal, or file-backed Desktop icons.

CREATE TABLE IF NOT EXISTS fs_nodes (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id   UUID REFERENCES fs_nodes(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  type        TEXT NOT NULL CHECK (type IN ('file', 'folder')),
  content     TEXT, -- null for folders
  mime_type   TEXT, -- null for folders
  size_bytes  INTEGER NOT NULL DEFAULT 0,
  is_deleted  BOOLEAN NOT NULL DEFAULT false, -- soft delete -> Recycle Bin
  deleted_at  TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_fs_nodes_parent ON fs_nodes (parent_id);
CREATE INDEX IF NOT EXISTS idx_fs_nodes_deleted ON fs_nodes (is_deleted);

-- The six default top-level folders, seeded with fixed ids so the app can
-- reference e.g. "Desktop" reliably without an extra lookup. Safe to
-- re-run — ON CONFLICT makes this a no-op if they already exist.
INSERT INTO fs_nodes (id, parent_id, name, type)
VALUES
  ('00000000-0000-0000-0000-000000000001', NULL, 'Desktop',   'folder'),
  ('00000000-0000-0000-0000-000000000002', NULL, 'Documents', 'folder'),
  ('00000000-0000-0000-0000-000000000003', NULL, 'Downloads', 'folder'),
  ('00000000-0000-0000-0000-000000000004', NULL, 'Pictures',  'folder'),
  ('00000000-0000-0000-0000-000000000005', NULL, 'Music',     'folder'),
  ('00000000-0000-0000-0000-000000000006', NULL, 'Videos',    'folder')
ON CONFLICT (id) DO NOTHING;