import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface BadgeProps {
  children: ReactNode;
  color?: "emerald" | "orange" | "blue";
  className?: string;
}

export default function Badge({ children, color = "emerald", className }: BadgeProps) {
  const colors = {
    emerald: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    orange: "bg-orange-500/15 text-orange-400 border-orange-500/30",
    blue: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border",
        colors[color],
        className
      )}
    >
      {children}
    </span>
  );
}