import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { mapRowToFSNode } from "@/lib/fsMapper";
import { dedupeName, isSameOrDescendant } from "@/lib/fsHelpers";
import type { UpdateFSNodeInput } from "@/types/fs";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  const { id } = await params;

  try {
    const rows = await sql`SELECT * FROM fs_nodes WHERE id = ${id}`;
    if (rows.length === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(mapRowToFSNode(rows[0]));
  } catch (error) {
    console.error("[GET /api/fs/:id]", error);
    return NextResponse.json({ error: "Failed to load item" }, { status: 500 });
  }
}

/**
 * Handles rename, move, file-content updates, and soft delete/restore —
 * whichever fields are present in the body. Fetch-merge-update, same
 * pattern as PATCH /api/tasks/[id].
 */
export async function PATCH(request: Request, { params }: RouteParams) {
  const { id } = await params;

  try {
    const body: UpdateFSNodeInput = await request.json();

    const existingRows = await sql`SELECT * FROM fs_nodes WHERE id = ${id}`;
    if (existingRows.length === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    const existing = existingRows[0];

    // Guard: a folder can't be moved into itself or its own descendant.
    if (
      body.parentId !== undefined &&
      existing.type === "folder" &&
      (await isSameOrDescendant(id, body.parentId))
    ) {
      return NextResponse.json(
        { error: "Cannot move a folder into itself or its own subfolder" },
        { status: 400 }
      );
    }

    const targetParentId = body.parentId !== undefined ? body.parentId : existing.parent_id;
    const nameChanged = body.name !== undefined && body.name !== existing.name;
    const parentChanged = body.parentId !== undefined && body.parentId !== existing.parent_id;

    const finalName =
      nameChanged || parentChanged
        ? await dedupeName(targetParentId, body.name ?? existing.name, id)
        : existing.name;

    const content = body.content !== undefined ? body.content : existing.content;
    const sizeBytes =
      body.content !== undefined
        ? Buffer.byteLength(body.content, "utf8")
        : existing.size_bytes;

    const isDeleted = body.isDeleted !== undefined ? body.isDeleted : existing.is_deleted;
    const deletedAt =
      body.isDeleted === true
        ? new Date().toISOString()
        : body.isDeleted === false
        ? null
        : existing.deleted_at;

    const rows = await sql`
      UPDATE fs_nodes
      SET
        name = ${finalName},
        parent_id = ${targetParentId},
        content = ${content},
        size_bytes = ${sizeBytes},
        is_deleted = ${isDeleted},
        deleted_at = ${deletedAt},
        updated_at = now()
      WHERE id = ${id}
      RETURNING *
    `;

    return NextResponse.json(mapRowToFSNode(rows[0]));
  } catch (error) {
    console.error("[PATCH /api/fs/:id]", error);
    return NextResponse.json({ error: "Failed to update item" }, { status: 500 });
  }
}

/**
 * Permanent delete — for "Delete permanently" / "Empty Recycle Bin", not
 * the everyday Explorer delete (which is PATCH isDeleted: true). Cascades
 * to children via the fs_nodes FK's ON DELETE CASCADE.
 */
export async function DELETE(_request: Request, { params }: RouteParams) {
  const { id } = await params;

  try {
    await sql`DELETE FROM fs_nodes WHERE id = ${id}`;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE /api/fs/:id]", error);
    return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
  }
}