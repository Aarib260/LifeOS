import { sql } from "@/lib/db";

/**
 * Appends " (2)", " (3)", etc. if a sibling in the same folder already has
 * this name — mirrors real-OS behavior instead of silently colliding.
 * `ignoreId` excludes the node itself when renaming in place.
 */
export async function dedupeName(
  parentId: string | null,
  name: string,
  ignoreId?: string
): Promise<string> {
  const siblings = parentId
    ? await sql`
        SELECT name FROM fs_nodes
        WHERE parent_id = ${parentId} AND is_deleted = false AND id != ${ignoreId ?? null}
      `
    : await sql`
        SELECT name FROM fs_nodes
        WHERE parent_id IS NULL AND is_deleted = false AND id != ${ignoreId ?? null}
      `;

  const taken = new Set(siblings.map((s) => s.name as string));
  if (!taken.has(name)) return name;

  const dotIndex = name.lastIndexOf(".");
  const base = dotIndex > 0 ? name.slice(0, dotIndex) : name;
  const ext = dotIndex > 0 ? name.slice(dotIndex) : "";

  let counter = 2;
  let candidate = `${base} (${counter})${ext}`;
  while (taken.has(candidate)) {
    counter += 1;
    candidate = `${base} (${counter})${ext}`;
  }
  return candidate;
}

/**
 * True if `candidateAncestorId` is `nodeId` itself or one of its
 * descendants. Used to block moving/copying a folder into its own subtree,
 * which would otherwise orphan it (or, for copy, recurse forever).
 */
export async function isSameOrDescendant(
  nodeId: string,
  candidateAncestorId: string | null
): Promise<boolean> {
  if (candidateAncestorId === null) return false;
  if (candidateAncestorId === nodeId) return true;

  const rows = await sql`
    WITH RECURSIVE descendants AS (
      SELECT id FROM fs_nodes WHERE id = ${nodeId}
      UNION ALL
      SELECT f.id FROM fs_nodes f
      JOIN descendants d ON f.parent_id = d.id
    )
    SELECT id FROM descendants WHERE id = ${candidateAncestorId}
  `;
  return rows.length > 0;
}