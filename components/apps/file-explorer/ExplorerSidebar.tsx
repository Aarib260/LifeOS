"use client";

import { Monitor, FileText, Download, Image as ImageIcon, Music, Video, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { DEFAULT_ROOT_FOLDER_IDS } from "@/types/fs";
import type { ExplorerLocation } from "./useExplorerNavigation";

const SIDEBAR_ITEMS: { id: ExplorerLocation; label: string; icon: typeof Monitor }[] = [
  { id: DEFAULT_ROOT_FOLDER_IDS.desktop, label: "Desktop", icon: Monitor },
  { id: DEFAULT_ROOT_FOLDER_IDS.documents, label: "Documents", icon: FileText },
  { id: DEFAULT_ROOT_FOLDER_IDS.downloads, label: "Downloads", icon: Download },
  { id: DEFAULT_ROOT_FOLDER_IDS.pictures, label: "Pictures", icon: ImageIcon },
  { id: DEFAULT_ROOT_FOLDER_IDS.music, label: "Music", icon: Music },
  { id: DEFAULT_ROOT_FOLDER_IDS.videos, label: "Videos", icon: Video },
];

interface ExplorerSidebarProps {
  width: number;
  current: ExplorerLocation;
  onNavigate: (location: ExplorerLocation) => void;
  onResizePointerDown: (e: React.PointerEvent) => void;
  onResizePointerMove: (e: React.PointerEvent) => void;
  onResizePointerUp: (e: React.PointerEvent) => void;
}

export function ExplorerSidebar({
  width,
  current,
  onNavigate,
  onResizePointerDown,
  onResizePointerMove,
  onResizePointerUp,
}: ExplorerSidebarProps) {
  return (
    <div className="relative flex h-full shrink-0" style={{ width }}>
      <nav className="flex h-full w-full flex-col gap-0.5 overflow-y-auto border-r border-[var(--border-1)] p-2">
        {SIDEBAR_ITEMS.map((item) => (
          <SidebarButton
            key={item.id}
            label={item.label}
            icon={item.icon}
            isActive={current === item.id}
            onClick={() => onNavigate(item.id)}
          />
        ))}

        <div className="my-1.5 h-px bg-[var(--border-2)]" />

        <SidebarButton
          label="Recycle Bin"
          icon={Trash2}
          isActive={current === "recycle-bin"}
          onClick={() => onNavigate("recycle-bin")}
        />
      </nav>

      {/* Drag handle to resize the sidebar */}
      <div
        onPointerDown={onResizePointerDown}
        onPointerMove={onResizePointerMove}
        onPointerUp={onResizePointerUp}
        className="absolute right-0 top-0 h-full w-1 cursor-ew-resize touch-none hover:bg-cyan-400/30"
      />
    </div>
  );
}

function SidebarButton({
  label,
  icon: Icon,
  isActive,
  onClick,
}: {
  label: string;
  icon: typeof Monitor;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-left text-[13px] transition-colors",
        isActive
          ? "bg-[var(--surface-3)] text-[var(--text-1)]"
          : "text-[var(--text-2)] hover:bg-[var(--surface-2)] hover:text-[var(--text-1)]"
      )}
    >
      <Icon className="h-4 w-4 shrink-0 opacity-80" />
      <span className="truncate">{label}</span>
    </button>
  );
}