"use client";

import { StartButton } from "./StartButton";
import { RunningApps } from "./RunningApps";
import { Clock } from "./Clock";
import { UserAvatar } from "./UserAvatar";
import { TASKBAR_HEIGHT, TASKBAR_Z } from "@/lib/constants";

interface TaskbarProps {
  isStartMenuOpen: boolean;
  onToggleStartMenu: () => void;
}

export function Taskbar({ isStartMenuOpen, onToggleStartMenu }: TaskbarProps) {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 flex items-center justify-between border-t border-white/[0.06] bg-[#0D1117]/80 px-3 backdrop-blur-xl"
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