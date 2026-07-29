"use client";

import { useEffect } from "react";

interface UseKeyboardShortcutsOptions {
  /** Ctrl/Cmd+Space — Raycast/Spotlight-style Start Menu toggle. Standing in for a literal Windows/Search key, which a browser can't reliably intercept (it's heavily OS-reserved). */
  onToggleStartMenu: () => void;
  onEscape: () => void;
  /** Alt+Tab — cycles focus to the next open window. */
  onCycleWindows: () => void;
  /** Ctrl+Shift+Esc — opens the Performance Monitor, same as real Windows' Task Manager shortcut. */
  onOpenTaskManager: () => void;
  /** Ctrl/Cmd+Z — restores the most recently deleted file/folder from the Recycle Bin. */
  onUndo: () => void;
}

/**
 * Global, always-listening shortcuts — lives at the Desktop level so these
 * work regardless of which window (if any) has focus. App-scoped shortcuts
 * (Delete/Ctrl+C/X/V/A/F2 for selected items) stay local to Desktop's icon
 * grid and File Explorer, since those need to know about that component's
 * own selection state.
 *
 * Caveat worth knowing: Alt+Tab here can only cycle windows *within* this
 * browser tab. It can't intercept the OS's own Alt+Tab (switching between
 * real applications) — that's captured by the operating system before a
 * webpage ever sees it, and no browser API can override that. Same story
 * for a literal Windows key, which is why Ctrl/Cmd+Space stands in for it.
 */
export function useKeyboardShortcuts({
  onToggleStartMenu,
  onEscape,
  onCycleWindows,
  onOpenTaskManager,
  onUndo,
}: UseKeyboardShortcutsOptions) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const isMod = e.metaKey || e.ctrlKey;

      if (isMod && e.code === "Space") {
        e.preventDefault();
        onToggleStartMenu();
        return;
      }

      if (isMod && e.shiftKey && e.key === "Escape") {
        e.preventDefault();
        onOpenTaskManager();
        return;
      }

      if (e.key === "Escape") {
        onEscape();
        return;
      }

      if (e.altKey && e.key === "Tab") {
        e.preventDefault();
        onCycleWindows();
        return;
      }

      if (isMod && e.key.toLowerCase() === "z") {
        const target = e.target as HTMLElement | null;
        const isTyping =
          target?.tagName === "INPUT" || target?.tagName === "TEXTAREA" || target?.isContentEditable;
        // Native text-undo should win while typing anywhere (Terminal input,
        // rename fields, search boxes, File Viewer) — only treat Ctrl+Z as
        // "restore last deleted file" when focus isn't in a text field.
        if (isTyping) return;
        e.preventDefault();
        onUndo();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onToggleStartMenu, onEscape, onCycleWindows, onOpenTaskManager, onUndo]);
}
