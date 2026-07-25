"use client";

import { Folder, File as FileIcon, RotateCcw, Trash2 } from "lucide-react";
import { useTrash } from "@/hooks/useFileSystem";

export function RecycleBinView() {
  const { items, isLoading, restore, permanentlyDelete } = useTrash();

  if (isLoading) {
    return <div className="p-6 text-sm text-[var(--text-3)]">Loading Recycle Bin…</div>;
  }

  if (items.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 text-[var(--text-4)]">
        <Trash2 className="h-8 w-8 opacity-50" />
        <p className="text-sm">Recycle Bin is empty</p>
      </div>
    );
  }

  return (
    <table className="w-full border-collapse text-[13px]">
      <thead className="sticky top-0 bg-[var(--surface-1)] text-xs text-[var(--text-4)]">
        <tr className="border-b border-[var(--border-1)]">
          <th className="px-3 py-1.5 text-left font-medium">Name</th>
          <th className="px-3 py-1.5 text-left font-medium">Deleted</th>
          <th className="px-3 py-1.5 text-right font-medium">Actions</th>
        </tr>
      </thead>
      <tbody>
        {items.map((node) => (
          <tr key={node.id} className="hover:bg-[var(--surface-1)]">
            <td className="flex items-center gap-2 px-3 py-1.5">
              {node.type === "folder" ? (
                <Folder className="h-4 w-4 shrink-0 text-[var(--icon-accent)]" />
              ) : (
                <FileIcon className="h-4 w-4 shrink-0 text-[var(--icon-accent)]" />
              )}
              <span className="truncate text-[var(--text-1)]">{node.name}</span>
            </td>
            <td className="px-3 py-1.5 text-[var(--text-3)]">
              {node.deletedAt ? new Date(node.deletedAt).toLocaleDateString() : "—"}
            </td>
            <td className="px-3 py-1.5">
              <div className="flex justify-end gap-1">
                <button
                  type="button"
                  title="Restore"
                  onClick={() => restore.mutate(node.id)}
                  className="flex h-6 w-6 items-center justify-center rounded text-[var(--text-2)] hover:bg-[var(--surface-3)] hover:text-[var(--text-1)]"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  title="Delete permanently"
                  onClick={() => {
                    if (window.confirm(`Permanently delete "${node.name}"? This can't be undone.`)) {
                      permanentlyDelete.mutate(node.id);
                    }
                  }}
                  className="flex h-6 w-6 items-center justify-center rounded text-red-400 hover:bg-red-500/10"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
