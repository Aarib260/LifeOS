"use client";

import { useState } from "react";
import { FolderOpen, Edit3, Trash2, Copy, Scissors, ClipboardPaste, Info } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { ContextMenuItem, ContextMenuSeparator } from "./ContextMenuItem";
import { useClipboardStore } from "@/store/clipboardStore";
import { updateNode, copyNode } from "@/lib/fsClient";
import type { FSNode } from "@/types/fs";

interface FileSystemContextMenuProps {
  node: FSNode;
  onClose: () => void;
  /** Wire this to actually opening the file/folder once Explorer/viewers exist. */
  onOpen?: (node: FSNode) => void;
  /**
   * If provided, called instead of the window.prompt fallback — lets a
   * caller (like File Explorer) swap in inline rename instead.
   */
  onRenameRequest?: (node: FSNode) => void;
}

/**
 * Right-click menu for a single file or folder. Used today by Desktop
 * icons, and built generic enough (just needs an FSNode + onClose) to drop
 * straight into File Explorer list/grid items once that app exists.
 */
export function FileSystemContextMenu({
  node,
  onClose,
  onOpen,
  onRenameRequest,
}: FileSystemContextMenuProps) {
  const [view, setView] = useState<"menu" | "properties">("menu");
  const queryClient = useQueryClient();
  const clipboard = useClipboardStore();

  const invalidate = (parentId: string | null) =>
    queryClient.invalidateQueries({ queryKey: ["fs", "children", parentId] });

  function handleOpen() {
    onOpen?.(node);
    onClose();
  }

  async function handleRename() {
    if (onRenameRequest) {
      onRenameRequest(node);
      onClose();
      return;
    }
    // window.prompt is a placeholder — swap for an in-place editable label
    // when inline rename lands in the Desktop Improvements phase.
    const next = window.prompt("Rename to:", node.name);
    if (next && next.trim() && next !== node.name) {
      await updateNode(node.id, { name: next.trim() });
      invalidate(node.parentId);
    }
    onClose();
  }

  async function handleDelete() {
    await updateNode(node.id, { isDeleted: true });
    invalidate(node.parentId);
    onClose();
  }

  function handleCopy() {
    clipboard.setClipboard("copy", [node.id], node.parentId);
    onClose();
  }

  function handleCut() {
    clipboard.setClipboard("cut", [node.id], node.parentId);
    onClose();
  }

  async function handlePasteInto() {
    if (!clipboard.mode || clipboard.nodeIds.length === 0 || node.type !== "folder") return;
    for (const id of clipboard.nodeIds) {
      if (clipboard.mode === "copy") {
        await copyNode(id, node.id);
      } else {
        await updateNode(id, { parentId: node.id });
      }
    }
    if (clipboard.mode === "cut") clipboard.clear();
    invalidate(node.id);
    onClose();
  }

  if (view === "properties") {
    return (
      <div className="min-w-[220px] px-3 py-2 text-[13px] text-[var(--text-1)]">
        <p className="mb-1 truncate font-medium">{node.name}</p>
        <dl className="space-y-0.5 text-xs text-[var(--text-4)]">
          <div className="flex justify-between gap-4">
            <dt>Type</dt>
            <dd>{node.type === "folder" ? "Folder" : node.mimeType ?? "File"}</dd>
          </div>
          {node.type === "file" && (
            <div className="flex justify-between gap-4">
              <dt>Size</dt>
              <dd>{node.sizeBytes} bytes</dd>
            </div>
          )}
          <div className="flex justify-between gap-4">
            <dt>Created</dt>
            <dd>{new Date(node.createdAt).toLocaleDateString()}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt>Modified</dt>
            <dd>{new Date(node.updatedAt).toLocaleDateString()}</dd>
          </div>
        </dl>
      </div>
    );
  }

  return (
    <>
      <ContextMenuItem label="Open" icon={FolderOpen} onClick={handleOpen} />
      <ContextMenuSeparator />
      <ContextMenuItem label="Rename" icon={Edit3} onClick={handleRename} shortcut="F2" />
      <ContextMenuItem label="Delete" icon={Trash2} danger onClick={handleDelete} shortcut="Del" />
      <ContextMenuSeparator />
      <ContextMenuItem label="Copy" icon={Copy} onClick={handleCopy} shortcut="Ctrl+C" />
      <ContextMenuItem label="Cut" icon={Scissors} onClick={handleCut} shortcut="Ctrl+X" />
      {node.type === "folder" && (
        <ContextMenuItem
          label="Paste"
          icon={ClipboardPaste}
          disabled={!clipboard.mode}
          onClick={handlePasteInto}
          shortcut="Ctrl+V"
        />
      )}
      <ContextMenuSeparator />
      <ContextMenuItem label="Properties" icon={Info} onClick={() => setView("properties")} />
    </>
  );
}
