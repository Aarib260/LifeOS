"use client";

import { useState } from "react";
import { Wallpaper } from "./Wallpaper";
import { DesktopIcon } from "./DesktopIcon";
import { WindowManager } from "@/components/window-manager/WindowManager";
import { Taskbar } from "@/components/taskbar/Taskbar";
import { StartMenu } from "@/components/start-menu/StartMenu";
import { useWindowStore } from "@/store/windowStore";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { APP_LIST } from "@/lib/appRegistry";
import { TASKBAR_HEIGHT } from "@/lib/constants";

export function Desktop() {
  const openApp = useWindowStore((s) => s.openApp);
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);

  useKeyboardShortcuts({
    onToggleStartMenu: () => setIsStartMenuOpen((open) => !open),
    onEscape: () => setIsStartMenuOpen(false),
  });

  return (
    <main
      className="relative h-screen w-screen overflow-hidden select-none"
      style={{ paddingBottom: TASKBAR_HEIGHT }}
    >
      <Wallpaper />

      {/* Icon grid — left edge, top-down, Windows-style */}
      <div className="relative z-10 flex flex-col gap-1 p-4 w-fit">
        {APP_LIST.map((app) => (
          <DesktopIcon
            key={app.id}
            label={app.title}
            icon={app.icon}
            onOpen={() =>
              openApp(app.id, { title: app.title, size: app.defaultSize, minSize: app.minSize })
            }
          />
        ))}
      </div>

      <WindowManager />

      <Taskbar
        isStartMenuOpen={isStartMenuOpen}
        onToggleStartMenu={() => setIsStartMenuOpen((open) => !open)}
      />

      <StartMenu isOpen={isStartMenuOpen} onClose={() => setIsStartMenuOpen(false)} />
    </main>
  );
}