"use client";

import { useCallback, useRef } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import type { Size } from "@/types";

interface UseResizableOptions {
  size: Size;
  onSizeChange: (size: Size) => void;
  disabled?: boolean;
}

/**
 * Generic pointer-drag resize hook — mirrors useDraggable's shape.
 * Phase 1 only wires this to a single bottom-right corner handle;
 * left/top/edge handles can reuse this same hook later if needed.
 */
export function useResizable({ size, onSizeChange, disabled }: UseResizableOptions) {
  const resizeOrigin = useRef<{
    pointerX: number;
    pointerY: number;
    originWidth: number;
    originHeight: number;
  } | null>(null);

  const onPointerDown = useCallback(
    (e: ReactPointerEvent) => {
      if (disabled) return;
      // Prevent this from bubbling up into the window's focus/drag handlers
      e.stopPropagation();
      resizeOrigin.current = {
        pointerX: e.clientX,
        pointerY: e.clientY,
        originWidth: size.width,
        originHeight: size.height,
      };
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    },
    [size, disabled]
  );

  const onPointerMove = useCallback(
    (e: ReactPointerEvent) => {
      if (!resizeOrigin.current) return;
      const dx = e.clientX - resizeOrigin.current.pointerX;
      const dy = e.clientY - resizeOrigin.current.pointerY;
      onSizeChange({
        width: resizeOrigin.current.originWidth + dx,
        height: resizeOrigin.current.originHeight + dy,
      });
    },
    [onSizeChange]
  );

  const onPointerUp = useCallback(() => {
    resizeOrigin.current = null;
  }, []);

  return { onPointerDown, onPointerMove, onPointerUp };
}
