"use client";

import { useCallback, useRef } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import type { Position } from "@/types";

interface UseDraggableOptions {
  /** Current position of the element being dragged (controlled by the caller/store) */
  position: Position;
  /** Called on every pointer move with the new position — caller decides how to persist it */
  onPositionChange: (position: Position) => void;
  disabled?: boolean;
}

/**
 * Generic pointer-drag hook. Deliberately has no opinion about what's
 * being dragged — AppWindow uses it for window position; it could just
 * as easily drive a slider or a draggable icon later.
 */
export function useDraggable({ position, onPositionChange, disabled }: UseDraggableOptions) {
  const dragOrigin = useRef<{ pointerX: number; pointerY: number; originX: number; originY: number } | null>(
    null
  );

  const onPointerDown = useCallback(
    (e: ReactPointerEvent) => {
      if (disabled) return;
      dragOrigin.current = {
        pointerX: e.clientX,
        pointerY: e.clientY,
        originX: position.x,
        originY: position.y,
      };
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    },
    [position, disabled]
  );

  const onPointerMove = useCallback(
    (e: ReactPointerEvent) => {
      if (!dragOrigin.current) return;
      const dx = e.clientX - dragOrigin.current.pointerX;
      const dy = e.clientY - dragOrigin.current.pointerY;
      onPositionChange({
        x: dragOrigin.current.originX + dx,
        y: dragOrigin.current.originY + dy,
      });
    },
    [onPositionChange]
  );

  const onPointerUp = useCallback(() => {
    dragOrigin.current = null;
  }, []);

  return { onPointerDown, onPointerMove, onPointerUp };
}