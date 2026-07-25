"use client";

import { Folder, File as FileIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FSNode } from "@/types/fs";
import { RenameInput } from "./ExplorerGrid";

interface ExplorerListProps {
  items: FSNode[];
  selectedIds: Set<string>;
  renamingId: string | null;
  onSelect: (node: FSNode, e: React.MouseEvent) => void;
  onOpen: (node: FSNode) => void;
  onContextMenu: (e: React.MouseEvent, node: FSNode) => void;
  onCommitRename: (node: FSNode, newName: string) => void;
  onCancelRename: () => void;
}

function formatSize(bytes: number): string {
  if (bytes === 0) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function ExplorerList({
  items,
  selectedIds,
  renamingId,
  onSelect,
  onOpen,
  onContextMenu,
  onCommitRename,
  onCancelRename,
}: ExplorerListProps) {
  return (
    <table className="w-full border-collapse text-[13px]">
      <thead className="sticky top-0 bg-[var(--surface-1)] text-xs text-[var(--text-4)]">
        <tr className="border-b border-[var(--border-1)]">
          <th className="px-3 py-1.5 text-left font-medium">Name</th>
          <th className="px-3 py-1.5 text-left font-medium">Type</th>
          <th className="px-3 py-1.5 text-left font-medium">Size</th>
          <th className="px-3 py-1.5 text-left font-medium">Modified</th>
        </tr>
      </thead>
      <tbody>
        {items.map((node) => (
          <tr
            key={node.id}
            onClick={(e) => onSelect(node, e)}
            onDoubleClick={() => onOpen(node)}
            onContextMenu={(e) => onContextMenu(e, node)}
            className={cn(
              "cursor-default select-none",
              selectedIds.has(node.id) ? "bg-[var(--surface-3)]" : "hover:bg-[var(--surface-1)]"
            )}
          >
            <td className="flex items-center gap-2 px-3 py-1.5">
              {node.type === "folder" ? (
                <Folder className="h-4 w-4 shrink-0 text-[var(--icon-accent)]" />
              ) : (
                <FileIcon className="h-4 w-4 shrink-0 text-[var(--icon-accent)]" />
              )}
              {renamingId === node.id ? (
                <RenameInput
                  initialValue={node.name}
                  onCommit={(name) => onCommitRename(node, name)}
                  onCancel={onCancelRename}
                />
              ) : (
                <span className="truncate text-[var(--text-1)]">{node.name}</span>
              )}
            </td>
            <td className="px-3 py-1.5 text-[var(--text-3)]">
              {node.type === "folder" ? "Folder" : node.mimeType ?? "File"}
            </td>
            <td className="px-3 py-1.5 text-[var(--text-3)]">
              {node.type === "file" ? formatSize(node.sizeBytes) : "—"}
            </td>
            <td className="px-3 py-1.5 text-[var(--text-3)]">
              {new Date(node.updatedAt).toLocaleDateString()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
