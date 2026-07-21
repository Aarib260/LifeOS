import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { mapRowToFSNode } from "@/lib/fsMapper";
import { dedupeName, isSameOrDescendant } from "@/lib/fsHelpers";
import type { CopyFSNodeInput, FSNode } from "@/types/fs";

interface RouteParams {
  params: Promise<{ id: string }>;
}

async function copyNodeRecursive(
  nodeId: string,
  targetParentId: string | null
): Promise<FSNode> {
  const rows = await sql`SELECT * FROM fs_nodes WHERE id = ${nodeId}`;
  if (rows.length === 0) throw new Error("Node not found: " + nodeId);
  const node = rows[0];

  const finalName = await dedupeName(targetParentId, node.name as string);

  const insertedRows = await sql`
    INSERT INTO fs_nodes (parent_id, name, type, content, mime_type, size_bytes)
    VALUES (
      ${targetParentId},
      ${finalName},
      ${node.type},
      ${node.content},
      ${node.mime_type},
      ${node.size_bytes}
    )
    RETURNING *
  `;
  const newNode = mapRowToFSNode(insertedRows[0]);

  if (node.type === "folder") {
    const children = await sql`
      SELECT id FROM fs_nodes WHERE parent_id = ${nodeId} AND is_deleted = false
    `;
    // Sequential rather than Promise.all — each child copy issues its own
    // queries and we'd rather not fan out many concurrent connections for
    // what's normally a handful of items.
    for (const child of children) {
      await copyNodeRecursive(child.id as string, newNode.id);
    }
  }

  return newNode;
}

/** POST /api/fs/[id]/copy — recursively duplicates a file or folder */
export async function POST(request: Request, { params }: RouteParams) {
  const { id } = await params;

  try {
    const body: CopyFSNodeInput = await request.json();

    if (await isSameOrDescendant(id, body.targetParentId)) {
      return NextResponse.json(
        { error: "Cannot copy a folder into itself or its own subfolder" },
        { status: 400 }
      );
    }

    const copied = await copyNodeRecursive(id, body.targetParentId);
    return NextResponse.json(copied, { status: 201 });
  } catch (error) {
    console.error("[POST /api/fs/:id/copy]", error);
    return NextResponse.json({ error: "Failed to copy item" }, { status: 500 });
  }
}