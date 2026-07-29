"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Wallpaper } from "./Wallpaper";
import { DesktopIconGrid } from "./DesktopIconGrid";
import { DesktopWidgets } from "./DesktopWidgets";
import { AIOrb } from "./AIOrb";
import { WindowManager } from "@/components/window-manager/WindowManager";
import { Taskbar } from "@/components/taskbar/Taskbar";
import { StartMenu } from "@/components/start-menu/StartMenu";
import { ToastViewport } from "@/components/toast/ToastViewport";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useWindowStore } from "@/store/windowStore";
import { getOpenAppOptions } from "@/lib/appRegistry";
import { updateNode } from "@/lib/fsClient";
import { toast } from "@/store/toastStore";
import { TASKBAR_HEIGHT } from "@/lib/constants";
import type { FSNode } from "@/types/fs";

export function Desktop() {
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const queryClient = useQueryClient();

  const windows = useWindowStore((s) => s.windows);
  const focusedId = useWindowStore((s) => s.focusedId);
  const focusWindow = useWindowStore((s) => s.focusWindow);
  const restoreWindow = useWindowStore((s) => s.restoreWindow);
  const openApp = useWindowStore((s) => s.openApp);

  function handleCycleWindows() {
    if (windows.length === 0) return;
    const ordered = [...windows].sort((a, b) => a.zIndex - b.zIndex);
    const currentIndex = ordered.findIndex((w) => w.id === focusedId);
    const next = ordered[(currentIndex + 1) % ordered.length];
    if (next.isMinimized) {
      restoreWindow(next.id);
    } else {
      focusWindow(next.id);
    }
  }

  function handleOpenTaskManager() {
    openApp("performance-monitor", getOpenAppOptions("performance-monitor"));
  }

  async function handleUndo() {
    try {
      const res = await fetch("/api/fs/trash");
      if (!res.ok) throw new Error("Failed to load Recycle Bin");
      const trashed: FSNode[] = await res.json();

      if (trashed.length === 0) {
        toast.info("Nothing to undo");
        return;
      }

      // Trash is already ordered most-recently-deleted-first by the API.
      const mostRecent = trashed[0];
      await updateNode(mostRecent.id, { isDeleted: false });
      toast.success(`Restored "${mostRecent.name}"`);

      // Broad invalidate rather than one specific folder — the restored
      // item could belong to any folder the user had open.
      queryClient.invalidateQueries({ queryKey: ["fs"] });
    } catch {
      toast.error("Couldn't undo that");
    }
  }

  useKeyboardShortcuts({
    onToggleStartMenu: () => setIsStartMenuOpen((open) => !open),
    onEscape: () => setIsStartMenuOpen(false),
    onCycleWindows: handleCycleWindows,
    onOpenTaskManager: handleOpenTaskManager,
    onUndo: handleUndo,
  });

  return (
    <main
      className="relative h-screen w-screen overflow-hidden select-none"
      style={{ paddingBottom: TASKBAR_HEIGHT }}
    >
      <Wallpaper />

      <DesktopWidgets />

      {/*
        Icon grid — drag-to-reorder, multi-select (Ctrl/Cmd-click or a
        rubber-band selection box), inline rename, and keyboard shortcuts
        (Delete, Ctrl+C/X/V, Ctrl+A, F2) all live inside DesktopIconGrid,
        which is fully self-contained: it owns its own selection state,
        both context menus (background + item), and reads/writes the VFS
        directly via useFileSystem/fsClient. Desktop.tsx just places it.

        Truly global shortcuts (Alt+Tab, Ctrl+Shift+Esc, Ctrl+Z, Start Menu
        toggle) live here instead, since they need to work regardless of
        which window or icon (if any) currently has focus.
      */}
      <DesktopIconGrid />

      <WindowManager />

      <AIOrb />

      <Taskbar
        isStartMenuOpen={isStartMenuOpen}
        onToggleStartMenu={() => setIsStartMenuOpen((open) => !open)}
      />

      <StartMenu isOpen={isStartMenuOpen} onClose={() => setIsStartMenuOpen(false)} />

      <ToastViewport />
    </main>
  );
}
