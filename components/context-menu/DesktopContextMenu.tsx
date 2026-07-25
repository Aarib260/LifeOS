"use client";

import { useState } from "react";
import {
  FolderPlus,
  FilePlus,
  ClipboardPaste,
  ArrowDownAZ,
  Paintbrush,
  Info,
  RotateCw,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { ContextMenuItem, ContextMenuSeparator } from "./ContextMenuItem";
import { useClipboardStore } from "@/store/clipboardStore";
import { createNode, updateNode, copyNode } from "@/lib/fsClient";
import { DEFAULT_ROOT_FOLDER_IDS } from "@/types/fs";

interface DesktopContextMenuProps {
  onClose: () => void;
  onOpenPersonalize: () => void;
}

const DESKTOP_ID = DEFAULT_ROOT_FOLDER_IDS.desktop;

export function DesktopContextMenu({ onClose, onOpenPersonalize }: DesktopContextMenuProps) {
  const [view, setView] = useState<"menu" | "properties">("menu");
  const queryClient = useQueryClient();
  const clipboard = useClipboardStore();

  const invalidateDesktop = () =>
    queryClient.invalidateQueries({ queryKey: ["fs", "children", DESKTOP_ID] });

  async function handleNewFolder() {
    try {
      await createNode({ parentId: DESKTOP_ID, name: "New Folder", type: "folder" });
      invalidateDesktop();
    } catch (error) {
      console.error("[DesktopContextMenu] Failed to create folder:", error);
      window.alert("Couldn't create the folder. Check the console for details.");
    }
    onClose();
  }

  async function handleNewFile() {
    try {
      await createNode({ parentId: DESKTOP_ID, name: "New File.txt", type: "file", content: "" });
      invalidateDesktop();
    } catch (error) {
      console.error("[DesktopContextMenu] Failed to create file:", error);
      window.alert("Couldn't create the file. Check the console for details.");
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
      if (clipboard.mode === "cut") clipboard.clear();
      invalidateDesktop();
    } catch (error) {
      console.error("[DesktopContextMenu] Failed to paste:", error);
      window.alert("Couldn't paste here. Check the console for details.");
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
      {/*
        A real "Sort by" submenu (Name/Type/Date, asc/desc) is worth adding
        once Desktop Improvements lands and there's more than a handful of
        icons to reorder. For now this just re-syncs against the VFS, which
        is what "Sort" would trigger a repaint of anyway.
      */}
      <ContextMenuItem label="Sort by Name" icon={ArrowDownAZ} onClick={handleRefresh} />
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
