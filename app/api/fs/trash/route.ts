import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { mapRowToFSNode } from "@/lib/fsMapper";

/** GET /api/fs/trash -> every soft-deleted node, most recently deleted first */
export async function GET() {
  try {
    const rows = await sql`
      SELECT * FROM fs_nodes
      WHERE is_deleted = true
      ORDER BY deleted_at DESC
    `;
    return NextResponse.json(rows.map(mapRowToFSNode));
  } catch (error) {
    console.error("[GET /api/fs/trash]", error);
    return NextResponse.json({ error: "Failed to load Recycle Bin" }, { status: 500 });
  }
}