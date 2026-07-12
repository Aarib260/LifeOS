"use client";

import { useEffect } from "react";

interface UseKeyboardShortcutsOptions {
  onToggleStartMenu: () => void;
  onEscape: () => void;
}

/**
 * Raycast/Spotlight-style global invocation. Lives at the Desktop level
 * (not inside StartMenu itself) since the toggle needs to work even
 * when the menu is closed.
 */
export function useKeyboardShortcuts({
  onToggleStartMenu,
  onEscape,
}: UseKeyboardShortcutsOptions) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const isModSpace = (e.metaKey || e.ctrlKey) && e.code === "Space";
      if (isModSpace) {
        e.preventDefault();
        onToggleStartMenu();
        return;
      }
      if (e.key === "Escape") {
        onEscape();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onToggleStartMenu, onEscape]);
}