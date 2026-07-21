import type { FSNode } from "@/types/fs";

/** Raw shape returned by the `fs_nodes` table (snake_case, as Postgres returns it) */
interface FSNodeRow {
  id: string;
  parent_id: string | null;
  name: string;
  type: "file" | "folder";
  content: string | null;
  mime_type: string | null;
  size_bytes: number;
  is_deleted: boolean;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export function mapRowToFSNode(row: FSNodeRow): FSNode {
  return {
    id: row.id,
    parentId: row.parent_id,
    name: row.name,
    type: row.type,
    content: row.content,
    mimeType: row.mime_type,
    sizeBytes: row.size_bytes,
    isDeleted: row.is_deleted,
    deletedAt: row.deleted_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}