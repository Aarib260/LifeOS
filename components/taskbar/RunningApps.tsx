"use client";

import { useWindowStore } from "@/store/windowStore";
import { APP_REGISTRY } from "@/lib/appRegistry";
import { cn } from "@/lib/utils";

/**
 * One button per open window instance (not deduped by app), so two
 * windows of the same app — once allowMultipleInstances is used —
 * each get their own taskbar entry, matching real OS behavior.
 */
export function RunningApps() {
  const windows = useWindowStore((s) => s.windows);
  const focusedId = useWindowStore((s) => s.focusedId);
  const focusWindow = useWindowStore((s) => s.focusWindow);
  const minimizeWindow = useWindowStore((s) => s.minimizeWindow);
  const restoreWindow = useWindowStore((s) => s.restoreWindow);

  if (windows.length === 0) return null;

  const handleClick = (id: string, isFocused: boolean, isMinimized: boolean) => {
    if (isMinimized) {
      restoreWindow(id);
    } else if (isFocused) {
      minimizeWindow(id);
    } else {
      focusWindow(id);
    }
  };

  return (
    <div className="flex items-center gap-1 overflow-x-auto">
      {windows.map((win) => {
        const Icon = APP_REGISTRY[win.appId]?.icon;
        const isFocused = win.id === focusedId && !win.isMinimized;

        return (
          <button
            key={win.id}
            type="button"
            title={win.title}
            onClick={() => handleClick(win.id, isFocused, win.isMinimized)}
            className={cn(
              "relative flex h-10 w-10 items-center justify-center rounded-lg transition-colors",
              isFocused
                ? "bg-[var(--surface-3)] text-cyan-300"
                : "text-[var(--text-3)] hover:bg-[var(--surface-3)] hover:text-[var(--text-1)]"
            )}
          >
            {Icon && <Icon className="h-5 w-5" />}
            <span
              className={cn(
                "absolute bottom-0.5 h-1 w-1 rounded-full",
                isFocused ? "bg-cyan-300" : "bg-[var(--text-4)]"
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
