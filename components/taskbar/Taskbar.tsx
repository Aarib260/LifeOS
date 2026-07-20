"use client";

import { motion } from "framer-motion";
import { StartButton } from "./StartButton";
import { RunningApps } from "./RunningApps";
import { Clock } from "./Clock";
import { UserAvatar } from "./UserAvatar";
import { TASKBAR_HEIGHT, TASKBAR_Z } from "@/lib/constants";
import { useSettingsStore, type GlassIntensity } from "@/store/settingsStore";
import { useIsRevealed } from "@/components/desktop/OSBootSequence";
import { cn } from "@/lib/utils";

interface TaskbarProps {
  isStartMenuOpen: boolean;
  onToggleStartMenu: () => void;
}

const GLASS_CLASSES: Record<GlassIntensity, string> = {
  subtle: "backdrop-blur-md bg-[var(--bg-taskbar-95)]",
  medium: "backdrop-blur-xl bg-[var(--bg-taskbar-80)]",
  strong: "backdrop-blur-2xl bg-[var(--bg-taskbar-55)]",
};

export function Taskbar({ isStartMenuOpen, onToggleStartMenu }: TaskbarProps) {
  const taskbarGlass = useSettingsStore((s) => s.taskbarGlass);
  const isRevealed = useIsRevealed();

  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      animate={isRevealed ? { y: 0, opacity: 1 } : { y: 80, opacity: 0 }}
      transition={{ type: "spring", stiffness: 280, damping: 26 }}
      className={cn(
        "fixed bottom-0 left-0 right-0 flex items-center justify-between border-t border-[var(--border-1)] px-3",
        GLASS_CLASSES[taskbarGlass]
      )}
      style={{ height: TASKBAR_HEIGHT, zIndex: TASKBAR_Z }}
    >
      <div className="flex min-w-0 flex-1 items-center gap-1">
        <StartButton isActive={isStartMenuOpen} onClick={onToggleStartMenu} />
        <div className="mx-1 h-6 w-px shrink-0 bg-[var(--border-2)]" />
        <RunningApps />
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <Clock />
        <UserAvatar />
      </div>
    </motion.div>
  );
}
