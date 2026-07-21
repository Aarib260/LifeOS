import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import type { FSPathSegment } from "@/types/fs";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/** GET /api/fs/[id]/path -> breadcrumb trail from root to this node, inclusive */
export async function GET(_request: Request, { params }: RouteParams) {
  const { id } = await params;

  try {
    const rows = await sql`
      WITH RECURSIVE ancestors AS (
        SELECT id, parent_id, name, 0 AS depth FROM fs_nodes WHERE id = ${id}
        UNION ALL
        SELECT f.id, f.parent_id, f.name, a.depth + 1
        FROM fs_nodes f
        JOIN ancestors a ON f.id = a.parent_id
      )
      SELECT id, name FROM ancestors ORDER BY depth DESC
    `;

    const path: FSPathSegment[] = rows.map((r) => ({ id: r.id as string, name: r.name as string }));
    return NextResponse.json(path);
  } catch (error) {
    console.error("[GET /api/fs/:id/path]", error);
    return NextResponse.json({ error: "Failed to load path" }, { status: 500 });
  }
}
import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import type { FSPathSegment } from "@/types/fs";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/** GET /api/fs/[id]/path -> breadcrumb trail from root to this node, inclusive */
export async function GET(_request: Request, { params }: RouteParams) {
  const { id } = await params;

  try {
    const rows = await sql`
      WITH RECURSIVE ancestors AS (
        SELECT id, parent_id, name, 0 AS depth FROM fs_nodes WHERE id = ${id}
        UNION ALL
        SELECT f.id, f.parent_id, f.name, a.depth + 1
        FROM fs_nodes f
        JOIN ancestors a ON f.id = a.parent_id
      )
      SELECT id, name FROM ancestors ORDER BY depth DESC
    `;

    const path: FSPathSegment[] = rows.map((r) => ({ id: r.id as string, name: r.name as string }));
    return NextResponse.json(path);
  } catch (error) {
    console.error("[GET /api/fs/:id/path]", error);
    return NextResponse.json({ error: "Failed to load path" }, { status: 500 });
  }
}import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import type { FSPathSegment } from "@/types/fs";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/** GET /api/fs/[id]/path -> breadcrumb trail from root to this node, inclusive */
export async function GET(_request: Request, { params }: RouteParams) {
  const { id } = await params;

  try {
    const rows = await sql`
      WITH RECURSIVE ancestors AS (
        SELECT id, parent_id, name, 0 AS depth FROM fs_nodes WHERE id = ${id}
        UNION ALL
        SELECT f.id, f.parent_id, f.name, a.depth + 1
        FROM fs_nodes f
        JOIN ancestors a ON f.id = a.parent_id
      )
      SELECT id, name FROM ancestors ORDER BY depth DESC
    `;

    const path: FSPathSegment[] = rows.map((r) => ({ id: r.id as string, name: r.name as string }));
    return NextResponse.json(path);
  } catch (error) {
    console.error("[GET /api/fs/:id/path]", error);
    return NextResponse.json({ error: "Failed to load path" }, { status: 500 });
  }
}