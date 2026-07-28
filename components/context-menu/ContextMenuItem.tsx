"use client";

import type { ComponentType } from "react";
import { ChevronRight } from "lucide-react";
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

interface ContextSubmenuProps {
  label: string;
  icon?: ComponentType<{ className?: string }>;
  children: React.ReactNode;
}

/**
 * A hover-to-reveal flyout, e.g. "Sort by" > Name/Type/Modified. Opens to
 * the right of the trigger row; closes on mouse-leave of the whole group
 * (trigger + flyout treated as one hit area via the `group` class).
 */
export function ContextSubmenu({ label, icon: Icon, children }: ContextSubmenuProps) {
  return (
    <div className="group/submenu relative">
      <div
        className={cn(
          "flex w-full cursor-default items-center gap-2.5 px-3 py-1.5 text-left text-[13px]",
          "text-[var(--text-1)] transition-colors hover:bg-[var(--surface-3)]"
        )}
      >
        {Icon && <Icon className="h-3.5 w-3.5 shrink-0 opacity-80" />}
        <span className="flex-1">{label}</span>
        <ChevronRight className="h-3.5 w-3.5 opacity-50" />
      </div>

      <div
        className={cn(
          "invisible absolute left-full top-[-6px] ml-1 min-w-[160px] opacity-0",
          "rounded-xl border border-[var(--border-2)] bg-[var(--surface-2)]/95 py-1.5 shadow-2xl backdrop-blur-xl",
          "transition-opacity duration-100",
          "group-hover/submenu:visible group-hover/submenu:opacity-100"
        )}
      >
        {children}
      </div>
    </div>
  );
}
