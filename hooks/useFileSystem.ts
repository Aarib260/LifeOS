"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  CopyFSNodeInput,
  CreateFSNodeInput,
  FSNode,
  FSPathSegment,
  UpdateFSNodeInput,
} from "@/types/fs";

const fsKey = (parentId: string | null) => ["fs", "children", parentId] as const;
const pathKey = (id: string) => ["fs", "path", id] as const;
const trashKey = ["fs", "trash"] as const;

async function fetchChildren(parentId: string | null): Promise<FSNode[]> {
  const url = parentId ? `/api/fs?parentId=${parentId}` : "/api/fs";
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to load files");
  return res.json();
}

async function fetchPath(id: string): Promise<FSPathSegment[]> {
  const res = await fetch(`/api/fs/${id}/path`);
  if (!res.ok) throw new Error("Failed to load path");
  return res.json();
}

async function fetchTrash(): Promise<FSNode[]> {
  const res = await fetch("/api/fs/trash");
  if (!res.ok) throw new Error("Failed to load Recycle Bin");
  return res.json();
}

async function createNodeRequest(input: CreateFSNodeInput): Promise<FSNode> {
  const res = await fetch("/api/fs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error("Failed to create item");
  return res.json();
}

async function updateNodeRequest(id: string, input: UpdateFSNodeInput): Promise<FSNode> {
  const res = await fetch(`/api/fs/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error("Failed to update item");
  return res.json();
}

async function permanentlyDeleteRequest(id: string): Promise<void> {
  const res = await fetch(`/api/fs/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete item");
}

async function copyNodeRequest(id: string, input: CopyFSNodeInput): Promise<FSNode> {
  const res = await fetch(`/api/fs/${id}/copy`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error("Failed to copy item");
  return res.json();
}

/**
 * Shared data layer for the virtual file system. Explorer, Terminal, and
 * Desktop all call this with the folder they're viewing — since they share
 * the same React Query cache keyed by parentId, a change from any one of
 * them (e.g. `mkdir` in Terminal) invalidates and refetches for the others.
 */
export function useFileSystem(folderId: string | null) {
  const queryClient = useQueryClient();

  const invalidateFolder = (parentId: string | null) => {
    queryClient.invalidateQueries({ queryKey: fsKey(parentId) });
  };

  const query = useQuery({ queryKey: fsKey(folderId), queryFn: () => fetchChildren(folderId) });

  const pathQuery = useQuery({
    queryKey: pathKey(folderId ?? ""),
    queryFn: () => fetchPath(folderId as string),
    enabled: folderId !== null,
  });

  const createFolder = useMutation({
    mutationFn: (name: string) =>
      createNodeRequest({ parentId: folderId, name, type: "folder" }),
    onSuccess: () => invalidateFolder(folderId),
  });

  const createFile = useMutation({
    mutationFn: ({ name, content, mimeType }: { name: string; content?: string; mimeType?: string }) =>
      createNodeRequest({ parentId: folderId, name, type: "file", content, mimeType }),
    onSuccess: () => invalidateFolder(folderId),
  });

  const rename = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) => updateNodeRequest(id, { name }),
    onSuccess: () => invalidateFolder(folderId),
  });

  const updateContent = useMutation({
    mutationFn: ({ id, content }: { id: string; content: string }) =>
      updateNodeRequest(id, { content }),
    onSuccess: () => invalidateFolder(folderId),
  });

  // Soft delete — the everyday "Delete" action, reversible from Recycle Bin.
  const remove = useMutation({
    mutationFn: (id: string) => updateNodeRequest(id, { isDeleted: true }),
    onSuccess: () => {
      invalidateFolder(folderId);
      queryClient.invalidateQueries({ queryKey: trashKey });
    },
  });

  const restore = useMutation({
    mutationFn: (id: string) => updateNodeRequest(id, { isDeleted: false }),
    onSuccess: () => {
      invalidateFolder(folderId);
      queryClient.invalidateQueries({ queryKey: trashKey });
    },
  });

  const permanentlyDelete = useMutation({
    mutationFn: permanentlyDeleteRequest,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: trashKey }),
  });

  const move = useMutation({
    mutationFn: ({ id, newParentId }: { id: string; newParentId: string | null }) =>
      updateNodeRequest(id, { parentId: newParentId }),
    onSuccess: (_, variables) => {
      invalidateFolder(folderId);
      invalidateFolder(variables.newParentId);
    },
  });

  const copy = useMutation({
    mutationFn: ({ id, targetParentId }: { id: string; targetParentId: string | null }) =>
      copyNodeRequest(id, { targetParentId }),
    onSuccess: (_, variables) => invalidateFolder(variables.targetParentId),
  });

  return {
    children: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    path: pathQuery.data ?? [],
    createFolder,
    createFile,
    rename,
    updateContent,
    remove,
    restore,
    permanentlyDelete,
    move,
    copy,
  };
}

/** For the Recycle Bin view. */
export function useTrash() {
  const queryClient = useQueryClient();
  const query = useQuery({ queryKey: trashKey, queryFn: fetchTrash });

  const restore = useMutation({
    mutationFn: (id: string) => updateNodeRequest(id, { isDeleted: false }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["fs"] }),
  });

  const permanentlyDelete = useMutation({
    mutationFn: permanentlyDeleteRequest,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: trashKey }),
  });

  return {
    items: query.data ?? [],
    isLoading: query.isLoading,
    restore,
    permanentlyDelete,
  };
}