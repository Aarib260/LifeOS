"use client";

import { useCallback, useState } from "react";

interface ContextMenuState<T> {
  isOpen: boolean;
  position: { x: number; y: number };
  payload: T | null;
}

/**
 * Generic right-click menu state. `T` is whatever payload the menu needs —
 * e.g. an FSNode for a file/folder icon, or nothing for the desktop
 * background. Position is captured from the triggering event; ContextMenu
 * handles clamping it to the viewport.
 */
export function useContextMenu<T = undefined>() {
  const [state, setState] = useState<ContextMenuState<T>>({
    isOpen: false,
    position: { x: 0, y: 0 },
    payload: null,
  });

  const open = useCallback((e: React.MouseEvent, payload?: T) => {
    e.preventDefault();
    e.stopPropagation();
    setState({ isOpen: true, position: { x: e.clientX, y: e.clientY }, payload: payload ?? null });
  }, []);

  const close = useCallback(() => {
    setState((s) => (s.isOpen ? { ...s, isOpen: false } : s));
  }, []);

  return { isOpen: state.isOpen, position: state.position, payload: state.payload, open, close };
}
