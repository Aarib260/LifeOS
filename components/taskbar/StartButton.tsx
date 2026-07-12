"use client";

import { Grid2x2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface StartButtonProps {
  isActive: boolean;
  onClick: () => void;
}

export function StartButton({ isActive, onClick }: StartButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Start"
      aria-pressed={isActive}
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-lg transition-colors",
        isActive
          ? "bg-cyan-400/15 text-cyan-300"
          : "text-white/70 hover:bg-white/10 hover:text-white"
      )}
    >
      <Grid2x2 className="h-5 w-5" />
    </button>
  );
}