"use client";

import { Minus, Square, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface WindowControlsProps {
  onMinimize: () => void;
  onMaximize: () => void;
  onClose: () => void;
}

export function WindowControls({ onMinimize, onMaximize, onClose }: WindowControlsProps) {
  return (
    // Stop propagation so clicking a control doesn't start a title-bar drag
    <div className="flex items-center gap-0.5" onPointerDown={(e) => e.stopPropagation()}>
      <button
        type="button"
        aria-label="Minimize"
        onClick={onMinimize}
        className={cn(
          "flex h-7 w-9 items-center justify-center rounded-md text-[var(--text-3)]",
          "hover:bg-white/10 hover:text-[var(--text-1)] transition-colors"
        )}
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        aria-label="Maximize"
        onClick={onMaximize}
        className={cn(
          "flex h-7 w-9 items-center justify-center rounded-md text-[var(--text-3)]",
          "hover:bg-white/10 hover:text-[var(--text-1)] transition-colors"
        )}
      >
        <Square className="h-3 w-3" />
      </button>
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className={cn(
          "flex h-7 w-9 items-center justify-center rounded-md text-[var(--text-3)]",
          "hover:bg-red-500/85 hover:text-white transition-colors"
        )}
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
