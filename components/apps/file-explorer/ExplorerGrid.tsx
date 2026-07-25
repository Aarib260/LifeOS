"use client";

import { Folder, File as FileIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FSNode } from "@/types/fs";

interface ExplorerGridProps {
  items: FSNode[];
  selectedIds: Set<string>;
  renamingId: string | null;
  onSelect: (node: FSNode, e: React.MouseEvent) => void;
  onOpen: (node: FSNode) => void;
  onContextMenu: (e: React.MouseEvent, node: FSNode) => void;
  onCommitRename: (node: FSNode, newName: string) => void;
  onCancelRename: () => void;
}

export function ExplorerGrid({
  items,
  selectedIds,
  renamingId,
  onSelect,
  onOpen,
  onContextMenu,
  onCommitRename,
  onCancelRename,
}: ExplorerGridProps) {
  return (
    <div className="flex flex-wrap content-start gap-1 p-3">
      {items.map((node) => (
        <div
          key={node.id}
          role="button"
          tabIndex={0}
          onClick={(e) => onSelect(node, e)}
          onDoubleClick={() => onOpen(node)}
          onContextMenu={(e) => onContextMenu(e, node)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onOpen(node);
          }}
          className={cn(
            "group flex w-20 cursor-default flex-col items-center gap-1.5 rounded-lg p-2 text-center outline-none",
            selectedIds.has(node.id)
              ? "bg-[var(--surface-3)]"
              : "hover:bg-[var(--surface-1)] active:bg-[var(--surface-2)]"
          )}
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--border-2)] bg-[var(--surface-2)]">
            {node.type === "folder" ? (
              <Folder className="h-6 w-6 text-[var(--icon-accent)]" />
            ) : (
              <FileIcon className="h-6 w-6 text-[var(--icon-accent)]" />
            )}
          </div>

          {renamingId === node.id ? (
            <RenameInput
              initialValue={node.name}
              onCommit={(name) => onCommitRename(node, name)}
              onCancel={onCancelRename}
            />
          ) : (
            <span className="line-clamp-2 text-[11px] leading-tight text-[var(--text-2)]">
              {node.name}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

export function RenameInput({
  initialValue,
  onCommit,
  onCancel,
}: {
  initialValue: string;
  onCommit: (value: string) => void;
  onCancel: () => void;
}) {
  return (
    <input
      autoFocus
      defaultValue={initialValue}
      onClick={(e) => e.stopPropagation()}
      onFocus={(e) => e.target.select()}
      onKeyDown={(e) => {
        e.stopPropagation();
        if (e.key === "Enter") onCommit(e.currentTarget.value);
        if (e.key === "Escape") onCancel();
      }}
      onBlur={(e) => onCommit(e.currentTarget.value)}
      className="w-full rounded border border-cyan-400/50 bg-[var(--surface-1)] px-1 text-center text-[11px] text-[var(--text-1)] outline-none"
    />
  );
}