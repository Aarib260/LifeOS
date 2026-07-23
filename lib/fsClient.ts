import type { CreateFSNodeInput, FSNode, FSPathSegment, UpdateFSNodeInput } from "@/types/fs";

/**
 * Thin fetch wrappers around /api/fs. useFileSystem.ts (React Query) covers
 * the reactive Explorer/Desktop case; Terminal commands run imperatively
 * one at a time and don't need a query cache, so they call these directly.
 */

export async function getChildren(parentId: string | null): Promise<FSNode[]> {
  const url = parentId ? `/api/fs?parentId=${parentId}` : "/api/fs";
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to list directory");
  return res.json();
}

export async function getNode(id: string): Promise<FSNode> {
  const res = await fetch(`/api/fs/${id}`);
  if (!res.ok) throw new Error("No such file or directory");
  return res.json();
}

export async function getPath(id: string): Promise<FSPathSegment[]> {
  const res = await fetch(`/api/fs/${id}/path`);
  if (!res.ok) throw new Error("Failed to resolve path");
  return res.json();
}

export async function createNode(input: CreateFSNodeInput): Promise<FSNode> {
  const res = await fetch("/api/fs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error("Failed to create item");
  return res.json();
}

export async function updateNode(id: string, input: UpdateFSNodeInput): Promise<FSNode> {
  const res = await fetch(`/api/fs/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error("Failed to update item");
  return res.json();
}

/** Finds a direct child of `parentId` by name (case-sensitive, exact match). */
export async function findChildByName(
  parentId: string | null,
  name: string
): Promise<FSNode | undefined> {
  const children = await getChildren(parentId);
  return children.find((n) => n.name === name);
}