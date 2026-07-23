"use client";

import type { ComponentType } from "react";
import { cn } from "@/lib/utils";

interface ContextMenuItemProps {
  label: string;
  icon?: ComponentType<{ className?: string }>;
  onClick?: () => void;
  danger?: boolean;
  disabled?: boolean;
  shortcut?: string;
}

export function ContextMenuItem({
  label,
  icon: Icon,
  onClick,
  danger,
  disabled,
  shortcut,
}: ContextMenuItemProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2.5 px-3 py-1.5 text-left text-[13px]",
        "text-[var(--text-1)] transition-colors",
        "hover:bg-[var(--surface-3)] disabled:opacity-40 disabled:hover:bg-transparent",
        danger && "text-red-400 hover:bg-red-500/10"
      )}
    >
      {Icon && <Icon className="h-3.5 w-3.5 shrink-0 opacity-80" />}
      <span className="flex-1">{label}</span>
      {shortcut && <span className="text-[11px] text-[var(--text-4)]">{shortcut}</span>}
    </button>
  );
}

export function ContextMenuSeparator() {
  return <div className="my-1 h-px bg-[var(--border-2)]" />;
}