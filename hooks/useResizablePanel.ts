"use client";

import { useCallback, useRef, useState } from "react";

interface UseResizablePanelOptions {
  initial: number;
  min: number;
  max: number;
}

/**
 * Drag-to-resize for a single dimension (width or height) — e.g. File
 * Explorer's sidebar. Generic on purpose so it isn't tied to windowStore
 * like useResizable is.
 */
export function useResizablePanel({ initial, min, max }: UseResizablePanelOptions) {
  const [size, setSize] = useState(initial);
  const startRef = useRef<{ startX: number; startSize: number } | null>(null);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      startRef.current = { startX: e.clientX, startSize: size };
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [size]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!startRef.current) return;
      const delta = e.clientX - startRef.current.startX;
      const next = Math.min(max, Math.max(min, startRef.current.startSize + delta));
      setSize(next);
    },
    [min, max]
  );

  const onPointerUp = useCallback(() => {
    startRef.current = null;
  }, []);

  return { size, onPointerDown, onPointerMove, onPointerUp };
}
