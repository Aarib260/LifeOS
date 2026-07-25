"use client";

import { useState } from "react";
import { Wallpaper } from "./Wallpaper";
import { DesktopIconGrid } from "./DesktopIconGrid";
import { DesktopWidgets } from "./DesktopWidgets";
import { AIOrb } from "./AIOrb";
import { WindowManager } from "@/components/window-manager/WindowManager";
import { Taskbar } from "@/components/taskbar/Taskbar";
import { StartMenu } from "@/components/start-menu/StartMenu";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { TASKBAR_HEIGHT } from "@/lib/constants";

export function Desktop() {
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);

  useKeyboardShortcuts({
    onToggleStartMenu: () => setIsStartMenuOpen((open) => !open),
    onEscape: () => setIsStartMenuOpen(false),
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
      */}
      <DesktopIconGrid />

      <WindowManager />

      <AIOrb />

      <Taskbar
        isStartMenuOpen={isStartMenuOpen}
        onToggleStartMenu={() => setIsStartMenuOpen((open) => !open)}
      />

      <StartMenu isOpen={isStartMenuOpen} onClose={() => setIsStartMenuOpen(false)} />
    </main>
  );
}
