"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Folder, File as FileIcon } from "lucide-react";
import { Wallpaper } from "./Wallpaper";
import { DesktopIcon } from "./DesktopIcon";
import { DesktopWidgets } from "./DesktopWidgets";
import { AIOrb } from "./AIOrb";
import { useIsRevealed } from "./OSBootSequence";
import { WindowManager } from "@/components/window-manager/WindowManager";
import { Taskbar } from "@/components/taskbar/Taskbar";
import { StartMenu } from "@/components/start-menu/StartMenu";
import { ContextMenu } from "@/components/context-menu/ContextMenu";
import { DesktopContextMenu } from "@/components/context-menu/DesktopContextMenu";
import { FileSystemContextMenu } from "@/components/context-menu/FileSystemContextMenu";
import { useWindowStore } from "@/store/windowStore";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useContextMenu } from "@/hooks/useContextMenu";
import { useFileSystem } from "@/hooks/useFileSystem";
import { APP_LIST, APP_REGISTRY } from "@/lib/appRegistry";
import { TASKBAR_HEIGHT } from "@/lib/constants";
import { DEFAULT_ROOT_FOLDER_IDS } from "@/types/fs";
import type { FSNode } from "@/types/fs";

export function Desktop() {
  const openApp = useWindowStore((s) => s.openApp);
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const isRevealed = useIsRevealed();

  const desktopMenu = useContextMenu();
  const iconMenu = useContextMenu<FSNode>();
  const { children: desktopFiles } = useFileSystem(DEFAULT_ROOT_FOLDER_IDS.desktop);

  useKeyboardShortcuts({
    onToggleStartMenu: () => setIsStartMenuOpen((open) => !open),
    onEscape: () => setIsStartMenuOpen(false),
  });

  function openSettings() {
    const settings = APP_REGISTRY.settings;
    openApp("settings", { title: settings.title, size: settings.defaultSize });
  }

  return (
    <main
      className="relative h-screen w-screen overflow-hidden select-none"
      style={{ paddingBottom: TASKBAR_HEIGHT }}
      onContextMenu={(e) => desktopMenu.open(e)}
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

        {/* Real files/folders from the Desktop VFS folder. Double-click
            "opening" a file or folder is a no-op until File Explorer and a
            file viewer exist — right-click (rename/delete/copy/cut) is
            fully live today since it only needs the VFS. */}
        {desktopFiles.map((node) => (
          <div
            key={node.id}
            onContextMenu={(e) => {
              e.stopPropagation();
              iconMenu.open(e, node);
            }}
          >
            <DesktopIcon
              label={node.name}
              icon={node.type === "folder" ? Folder : FileIcon}
              onOpen={() => {
                // TODO: open in File Explorer (folders) or a viewer (files)
                // once those apps exist.
              }}
            />
          </div>
        ))}
      </div>

      <WindowManager />

      <AIOrb />

      <Taskbar
        isStartMenuOpen={isStartMenuOpen}
        onToggleStartMenu={() => setIsStartMenuOpen((open) => !open)}
      />

      <StartMenu isOpen={isStartMenuOpen} onClose={() => setIsStartMenuOpen(false)} />

      <ContextMenu isOpen={desktopMenu.isOpen} position={desktopMenu.position} onClose={desktopMenu.close}>
        <DesktopContextMenu onClose={desktopMenu.close} onOpenPersonalize={openSettings} />
      </ContextMenu>

      <ContextMenu isOpen={iconMenu.isOpen} position={iconMenu.position} onClose={iconMenu.close}>
        {iconMenu.payload && <FileSystemContextMenu node={iconMenu.payload} onClose={iconMenu.close} />}
      </ContextMenu>
    </main>
  );
}
