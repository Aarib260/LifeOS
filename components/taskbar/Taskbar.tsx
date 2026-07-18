"use client";

import { StartButton } from "./StartButton";
import { RunningApps } from "./RunningApps";
import { Clock } from "./Clock";
import { UserAvatar } from "./UserAvatar";
import { TASKBAR_HEIGHT, TASKBAR_Z } from "@/lib/constants";
import { useSettingsStore, type GlassIntensity } from "@/store/settingsStore";
import { cn } from "@/lib/utils";

interface TaskbarProps {
  isStartMenuOpen: boolean;
  onToggleStartMenu: () => void;
}

const GLASS_CLASSES: Record<GlassIntensity, string> = {
  subtle: "backdrop-blur-md bg-[#0D1117]/95",
  medium: "backdrop-blur-xl bg-[#0D1117]/80",
  strong: "backdrop-blur-2xl bg-[#0D1117]/55",
};

export function Taskbar({ isStartMenuOpen, onToggleStartMenu }: TaskbarProps) {
  const taskbarGlass = useSettingsStore((s) => s.taskbarGlass);

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 flex items-center justify-between border-t border-white/[0.06] px-3",
        GLASS_CLASSES[taskbarGlass]
      )}
      style={{ height: TASKBAR_HEIGHT, zIndex: TASKBAR_Z }}
    >
      <div className="flex min-w-0 flex-1 items-center gap-1">
        <StartButton isActive={isStartMenuOpen} onClick={onToggleStartMenu} />
        <div className="mx-1 h-6 w-px shrink-0 bg-white/10" />
        <RunningApps />
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <Clock />
        <UserAvatar />
      </div>
    </div>
  );
}