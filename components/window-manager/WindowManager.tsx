"use client";

import { AnimatePresence } from "framer-motion";
import { useWindowStore } from "@/store/windowStore";
import { APP_REGISTRY } from "@/lib/appRegistry";
import { AppWindow } from "./AppWindow";

/**
 * Subscribes to windowStore and renders one AppWindow per open window,
 * with each window's content resolved from APP_REGISTRY. Wrapped in
 * AnimatePresence so closing a window plays an exit animation.
 */
export function WindowManager() {
  const windows = useWindowStore((s) => s.windows);
  const focusedId = useWindowStore((s) => s.focusedId);

  return (
    <AnimatePresence>
      {windows.map((win) => {
        const AppComponent = APP_REGISTRY[win.appId]?.component;
        return (
          <AppWindow key={win.id} window={win} isFocused={win.id === focusedId}>
            {AppComponent ? <AppComponent /> : null}
          </AppWindow>
        );
      })}
    </AnimatePresence>
  );
}
