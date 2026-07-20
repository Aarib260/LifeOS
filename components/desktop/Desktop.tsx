"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Wallpaper } from "./Wallpaper";
import { DesktopIcon } from "./DesktopIcon";
import { DesktopWidgets } from "./DesktopWidgets";
import { AIOrb } from "./AIOrb";
import { useIsRevealed } from "./OSBootSequence";
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
  const isRevealed = useIsRevealed();

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

      <DesktopWidgets />

      {/* Icon grid — left edge, top-down, Windows-style. Staggered
          spring entrance plays once, in sync with the boot reveal. */}
      <div className="relative z-10 flex flex-col gap-1 p-4 w-fit">
        {APP_LIST.map((app, index) => (
          <motion.div
            key={app.id}
            initial={{ opacity: 0, scale: 0.5, y: 10 }}
            animate={
              isRevealed
                ? { opacity: 1, scale: 1, y: 0 }
                : { opacity: 0, scale: 0.5, y: 10 }
            }
            transition={{
              type: "spring",
              stiffness: 320,
              damping: 18,
              delay: 0.1 + index * 0.06,
            }}
          >
            <DesktopIcon
              label={app.title}
              icon={app.icon}
              onOpen={() =>
                openApp(app.id, { title: app.title, size: app.defaultSize, minSize: app.minSize })
              }
            />
          </motion.div>
        ))}
      </div>

      <WindowManager />

      <AIOrb />

      <Taskbar
        isStartMenuOpen={isStartMenuOpen}
        onToggleStartMenu={() => setIsStartMenuOpen((open) => !open)}
      />

      <StartMenu isOpen={isStartMenuOpen} onClose={() => setIsStartMenuOpen(false)} />
    </main>
  );
}
