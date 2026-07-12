"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { useWindowStore } from "@/store/windowStore";
import { useDraggable } from "@/hooks/useDraggable";
import { useResizable } from "@/hooks/useResizable";
import { WindowControls } from "./WindowControls";
import { cn, getViewportSize } from "@/lib/utils";
import type { WindowState } from "@/types";

interface AppWindowProps {
  window: WindowState;
  isFocused: boolean;
  children: ReactNode;
}

export function AppWindow({ window: win, isFocused, children }: AppWindowProps) {
  const focusWindow = useWindowStore((s) => s.focusWindow);
  const updatePosition = useWindowStore((s) => s.updatePosition);
  const updateSize = useWindowStore((s) => s.updateSize);
  const closeWindow = useWindowStore((s) => s.closeWindow);
  const minimizeWindow = useWindowStore((s) => s.minimizeWindow);
  const toggleMaximize = useWindowStore((s) => s.toggleMaximize);

  const { onPointerDown, onPointerMove, onPointerUp } = useDraggable({
    position: win.position,
    disabled: win.isMaximized,
    onPositionChange: (pos) => {
      // Keep at least a sliver of the title bar reachable — prevents a
      // window from being dragged fully off-screen and becoming unrecoverable,
      // especially important on narrow viewports.
      const { width: viewportW, height: viewportH } = getViewportSize();
      const clamped = {
        x: Math.min(Math.max(pos.x, -(win.size.width - 80)), viewportW - 80),
        y: Math.min(Math.max(pos.y, 0), viewportH - 40),
      };
      updatePosition(win.id, clamped);
    },
  });

  const {
    onPointerDown: onResizeDown,
    onPointerMove: onResizeMove,
    onPointerUp: onResizeUp,
  } = useResizable({
    size: win.size,
    disabled: win.isMaximized,
    onSizeChange: (size) => updateSize(win.id, size),
  });

  return (
    <motion.div
      className={cn(
        "absolute flex flex-col overflow-hidden rounded-xl border shadow-2xl",
        "bg-[#12161F]/90 backdrop-blur-xl",
        isFocused ? "border-cyan-400/30 shadow-cyan-500/10" : "border-white/[0.08]",
        win.isMinimized && "pointer-events-none"
      )}
      style={{
        left: win.isMaximized ? 0 : win.position.x,
        top: win.isMaximized ? 0 : win.position.y,
        width: win.isMaximized ? "100%" : win.size.width,
        height: win.isMaximized ? "100%" : win.size.height,
        zIndex: win.zIndex,
      }}
      initial={{ opacity: 0, scale: 0.94, y: 14 }}
      animate={
        win.isMinimized
          ? { opacity: 0, scale: 0.35, y: 400 }
          : { opacity: 1, scale: 1, y: 0 }
      }
      exit={{ opacity: 0, scale: 0.94, y: 14, transition: { duration: 0.15 } }}
      transition={{ type: "spring", stiffness: 320, damping: 28 }}
      onPointerDownCapture={() => focusWindow(win.id)}
    >
      {/* Title bar — drag handle, double-click to maximize */}
      <div
        className="flex h-10 shrink-0 items-center justify-between border-b border-white/[0.06] px-3 cursor-grab active:cursor-grabbing"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onDoubleClick={() => toggleMaximize(win.id)}
      >
        <span className="truncate text-xs font-medium text-white/70">{win.title}</span>
        <WindowControls
          onMinimize={() => minimizeWindow(win.id)}
          onMaximize={() => toggleMaximize(win.id)}
          onClose={() => closeWindow(win.id)}
        />
      </div>

      {/* Content area — real app components mount here from Step 7 onward */}
      <div className="flex-1 overflow-auto">{children}</div>

      {/* Resize handle — bottom-right corner only for Phase 1 */}
      {!win.isMaximized && (
        <div
          onPointerDown={onResizeDown}
          onPointerMove={onResizeMove}
          onPointerUp={onResizeUp}
          className={cn(
            "absolute bottom-0 right-0 h-4 w-4 cursor-nwse-resize touch-none",
            "before:absolute before:bottom-1 before:right-1 before:h-2 before:w-2",
            "before:border-b-2 before:border-r-2 before:border-white/20 before:rounded-br-sm"
          )}
        />
      )}
    </motion.div>
  );
}