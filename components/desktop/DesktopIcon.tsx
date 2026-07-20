"use client";

import { motion } from "framer-motion";
import type { ComponentType } from "react";
import { cn } from "@/lib/utils";
import { useSettingsStore, type IconSize } from "@/store/settingsStore";

interface DesktopIconProps {
  label: string;
  icon: ComponentType<{ className?: string }>;
  onOpen: () => void;
  className?: string;
}

const SIZE_CLASSES: Record<IconSize, { wrapper: string; tile: string; icon: string; label: string }> = {
  small: { wrapper: "w-16", tile: "h-8 w-8 rounded-lg", icon: "h-4 w-4", label: "text-[10px]" },
  medium: { wrapper: "w-20", tile: "h-11 w-11 rounded-xl", icon: "h-6 w-6", label: "text-[11px]" },
  large: { wrapper: "w-24", tile: "h-14 w-14 rounded-xl", icon: "h-7 w-7", label: "text-xs" },
};

/**
 * A single launchable icon on the Desktop. Double-click (or Enter, for
 * keyboard users) triggers onOpen — the Desktop is responsible for wiring
 * that to the window store; this component knows nothing about windows.
 * Size comes from Settings (iconSize) rather than being fixed.
 */
export function DesktopIcon({ label, icon: Icon, onOpen, className }: DesktopIconProps) {
  const iconSize = useSettingsStore((s) => s.iconSize);
  const sizes = SIZE_CLASSES[iconSize];

  return (
    <motion.button
      type="button"
      onDoubleClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter") onOpen();
      }}
      whileTap={{ scale: 0.96 }}
      className={cn(
        "group flex flex-col items-center gap-1.5 rounded-lg p-2",
        sizes.wrapper,
        "outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70",
        "hover:bg-white/5 active:bg-white/10 transition-colors",
        className
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center",
          sizes.tile,
          "bg-[var(--surface-2)] border border-[var(--border-2)] backdrop-blur-sm",
          "group-hover:border-cyan-400/30 group-hover:bg-[var(--surface-3)] transition-colors"
        )}
      >
        <Icon className={cn(sizes.icon, "text-cyan-100/90")} />
      </div>
      <span
        className={cn(
          sizes.label,
          "leading-tight text-[var(--text-2)] text-center line-clamp-2 [text-shadow:0_1px_2px_rgba(0,0,0,0.6)]"
        )}
      >
        {label}
      </span>
    </motion.button>
  );
}
