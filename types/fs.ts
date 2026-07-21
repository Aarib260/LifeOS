export type FSNodeType = "file" | "folder";

export interface FSNode {
  id: string;
  parentId: string | null;
  name: string;
  type: FSNodeType;
  content: string | null; // null for folders
  mimeType: string | null; // null for folders
  sizeBytes: number;
  isDeleted: boolean;
  deletedAt: string | null; // ISO string
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export interface FSPathSegment {
  id: string;
  name: string;
}

/** Shape sent to POST /api/fs */
export interface CreateFSNodeInput {
  parentId: string | null;
  name: string;
  type: FSNodeType;
  content?: string;
  mimeType?: string;
}

/**
 * Shape sent to PATCH /api/fs/[id].
 * - name/parentId present -> rename/move
 * - content present -> file content update
 * - isDeleted present -> soft delete (true) or restore from Recycle Bin (false)
 */
export interface UpdateFSNodeInput {
  name?: string;
  parentId?: string | null;
  content?: string;
  isDeleted?: boolean;
}

/** Shape sent to POST /api/fs/[id]/copy */
export interface CopyFSNodeInput {
  targetParentId: string | null;
}

/**
 * Fixed ids for the six default root folders, seeded by migration 007.
 * Referencing these directly (e.g. DEFAULT_ROOT_FOLDER_IDS.desktop) avoids
 * an extra lookup anywhere the app needs a specific default folder.
 */
export const DEFAULT_ROOT_FOLDER_IDS = {
  desktop: "00000000-0000-0000-0000-000000000001",
  documents: "00000000-0000-0000-0000-000000000002",
  downloads: "00000000-0000-0000-0000-000000000003",
  pictures: "00000000-0000-0000-0000-000000000004",
  music: "00000000-0000-0000-0000-000000000005",
  videos: "00000000-0000-0000-0000-000000000006",
} as const;