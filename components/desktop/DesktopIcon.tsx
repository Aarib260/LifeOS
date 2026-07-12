"use client";

import { motion } from "framer-motion";
import type { ComponentType } from "react";
import { cn } from "@/lib/utils";

interface DesktopIconProps {
  label: string;
  icon: ComponentType<{ className?: string }>;
  onOpen: () => void;
  className?: string;
}

/**
 * A single launchable icon on the Desktop. Double-click (or Enter, for
 * keyboard users) triggers onOpen — the Desktop is responsible for wiring
 * that to the window store; this component knows nothing about windows.
 */
export function DesktopIcon({ label, icon: Icon, onOpen, className }: DesktopIconProps) {
  return (
    <motion.button
      type="button"
      onDoubleClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter") onOpen();
      }}
      whileTap={{ scale: 0.96 }}
      className={cn(
        "group flex w-20 flex-col items-center gap-1.5 rounded-lg p-2",
        "outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70",
        "hover:bg-white/5 active:bg-white/10 transition-colors",
        className
      )}
    >
      <div
        className={cn(
          "flex h-11 w-11 items-center justify-center rounded-xl",
          "bg-white/[0.06] border border-white/[0.08] backdrop-blur-sm",
          "group-hover:border-cyan-400/30 group-hover:bg-white/[0.09] transition-colors"
        )}
      >
        <Icon className="h-6 w-6 text-cyan-100/90" />
      </div>
      <span className="text-[11px] leading-tight text-white/80 text-center line-clamp-2 [text-shadow:0_1px_2px_rgba(0,0,0,0.6)]">
        {label}
      </span>
    </motion.button>
  );
}