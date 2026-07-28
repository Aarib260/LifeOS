"use client";

import { useState } from "react";
import {
  FolderPlus,
  FilePlus,
  ClipboardPaste,
  ArrowDownAZ,
  Shapes,
  Clock,
  Paintbrush,
  Info,
  RotateCw,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { ContextMenuItem, ContextMenuSeparator, ContextSubmenu } from "./ContextMenuItem";
import { useClipboardStore } from "@/store/clipboardStore";
import { createNode, updateNode, copyNode } from "@/lib/fsClient";
import { toast } from "@/store/toastStore";
import { DEFAULT_ROOT_FOLDER_IDS } from "@/types/fs";
import type { DesktopSortBy } from "@/components/desktop/DesktopIconGrid";

interface DesktopContextMenuProps {
  onClose: () => void;
  onOpenPersonalize: () => void;
  onSort: (by: DesktopSortBy) => void;
}

const DESKTOP_ID = DEFAULT_ROOT_FOLDER_IDS.desktop;

export function DesktopContextMenu({ onClose, onOpenPersonalize, onSort }: DesktopContextMenuProps) {
  const [view, setView] = useState<"menu" | "properties">("menu");
  const queryClient = useQueryClient();
  const clipboard = useClipboardStore();

  const invalidateDesktop = () =>
    queryClient.invalidateQueries({ queryKey: ["fs", "children", DESKTOP_ID] });

  async function handleNewFolder() {
    try {
      await createNode({ parentId: DESKTOP_ID, name: "New Folder", type: "folder" });
      invalidateDesktop();
      toast.success("Folder created");
    } catch (error) {
      console.error("[DesktopContextMenu] Failed to create folder:", error);
      toast.error("Couldn't create the folder");
    }
    onClose();
  }

  async function handleNewFile() {
    try {
      await createNode({ parentId: DESKTOP_ID, name: "New File.txt", type: "file", content: "" });
      invalidateDesktop();
      toast.success("File created");
    } catch (error) {
      console.error("[DesktopContextMenu] Failed to create file:", error);
      toast.error("Couldn't create the file");
    }
    onClose();
  }

  async function handlePaste() {
    if (!clipboard.mode || clipboard.nodeIds.length === 0) return;
    try {
      for (const id of clipboard.nodeIds) {
        if (clipboard.mode === "copy") {
          await copyNode(id, DESKTOP_ID);
        } else {
          await updateNode(id, { parentId: DESKTOP_ID });
        }
      }
      const count = clipboard.nodeIds.length;
      if (clipboard.mode === "cut") clipboard.clear();
      invalidateDesktop();
      toast.success(count === 1 ? "Pasted 1 item" : `Pasted ${count} items`);
    } catch (error) {
      console.error("[DesktopContextMenu] Failed to paste:", error);
      toast.error("Couldn't paste here");
    }
    onClose();
  }

  function handleRefresh() {
    invalidateDesktop();
    onClose();
  }

  if (view === "properties") {
    return (
      <div className="min-w-[200px] px-3 py-2 text-[13px] text-[var(--text-1)]">
        <p className="mb-1 font-medium">Desktop</p>
        <p className="text-xs text-[var(--text-4)]">LifeOS virtual desktop folder</p>
      </div>
    );
  }

  return (
    <>
      <ContextMenuItem label="Refresh" icon={RotateCw} onClick={handleRefresh} />
      <ContextMenuSeparator />
      <ContextMenuItem label="New Folder" icon={FolderPlus} onClick={handleNewFolder} />
      <ContextMenuItem label="New File" icon={FilePlus} onClick={handleNewFile} />
      <ContextMenuItem
        label="Paste"
        icon={ClipboardPaste}
        disabled={!clipboard.mode}
        onClick={handlePaste}
        shortcut="Ctrl+V"
      />
      <ContextMenuSeparator />
      <ContextSubmenu label="Sort by" icon={ArrowDownAZ}>
        <ContextMenuItem
          label="Name"
          icon={ArrowDownAZ}
          onClick={() => {
            onSort("name");
            onClose();
          }}
        />
        <ContextMenuItem
          label="Type"
          icon={Shapes}
          onClick={() => {
            onSort("type");
            onClose();
          }}
        />
        <ContextMenuItem
          label="Date modified"
          icon={Clock}
          onClick={() => {
            onSort("modified");
            onClose();
          }}
        />
      </ContextSubmenu>
      <ContextMenuItem
        label="Personalize"
        icon={Paintbrush}
        onClick={() => {
          onOpenPersonalize();
          onClose();
        }}
      />
      <ContextMenuSeparator />
      <ContextMenuItem label="Properties" icon={Info} onClick={() => setView("properties")} />
    </>
  );
}
