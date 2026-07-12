"use client";

import { AnimatePresence } from "framer-motion";
import { useWindowStore } from "@/store/windowStore";
import { AppWindow } from "./AppWindow";

/**
 * Subscribes to windowStore and renders one AppWindow per open window.
 * Wrapped in AnimatePresence so closing a window plays an exit animation
 * (minimize is handled internally by AppWindow via the isMinimized flag,
 * since that window stays mounted — only closing actually unmounts it).
 * Content is a placeholder until Step 7 wires real app components in.
 */
export function WindowManager() {
  const windows = useWindowStore((s) => s.windows);
  const focusedId = useWindowStore((s) => s.focusedId);

  return (
    <AnimatePresence>
      {windows.map((win) => (
        <AppWindow key={win.id} window={win} isFocused={win.id === focusedId}>
          <div className="flex h-full items-center justify-center text-sm text-white/40">
            {win.title} — content coming in Step 7
          </div>
        </AppWindow>
      ))}
    </AnimatePresence>
  );
}