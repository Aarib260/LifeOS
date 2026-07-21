import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { mapRowToFSNode } from "@/lib/fsMapper";
import { dedupeName } from "@/lib/fsHelpers";
import type { CreateFSNodeInput } from "@/types/fs";

/**
 * GET /api/fs?parentId=<uuid>  -> children of that folder
 * GET /api/fs                 -> root-level nodes (parent_id IS NULL)
 * Deleted (Recycle Bin) nodes are excluded — see /api/fs/trash for those.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const parentId = searchParams.get("parentId");

    const rows = parentId
      ? await sql`
          SELECT * FROM fs_nodes
          WHERE parent_id = ${parentId} AND is_deleted = false
          ORDER BY type DESC, name ASC
        `
      : await sql`
          SELECT * FROM fs_nodes
          WHERE parent_id IS NULL AND is_deleted = false
          ORDER BY type DESC, name ASC
        `;

    return NextResponse.json(rows.map(mapRowToFSNode));
  } catch (error) {
    console.error("[GET /api/fs]", error);
    return NextResponse.json({ error: "Failed to load files" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body: CreateFSNodeInput = await request.json();

    if (!body.name?.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }
    if (body.type !== "file" && body.type !== "folder") {
      return NextResponse.json({ error: "type must be 'file' or 'folder'" }, { status: 400 });
    }

    const finalName = await dedupeName(body.parentId, body.name.trim());
    const content = body.type === "file" ? body.content ?? "" : null;
    const mimeType = body.type === "file" ? body.mimeType ?? "text/plain" : null;
    const sizeBytes = content ? Buffer.byteLength(content, "utf8") : 0;

    const rows = await sql`
      INSERT INTO fs_nodes (parent_id, name, type, content, mime_type, size_bytes)
      VALUES (${body.parentId}, ${finalName}, ${body.type}, ${content}, ${mimeType}, ${sizeBytes})
      RETURNING *
    `;

    return NextResponse.json(mapRowToFSNode(rows[0]), { status: 201 });
  } catch (error) {
    console.error("[POST /api/fs]", error);
    return NextResponse.json({ error: "Failed to create item" }, { status: 500 });
  }
}