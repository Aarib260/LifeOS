"use client";

import {
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  Search,
  LayoutGrid,
  List,
  FolderPlus,
  FilePlus,
  ArrowUpDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { FSPathSegment } from "@/types/fs";
import type { ExplorerFilter, ExplorerSortBy, ExplorerSortDir, ExplorerViewMode } from "./types";

interface ExplorerToolbarProps {
  path: FSPathSegment[];
  canGoBack: boolean;
  canGoForward: boolean;
  onBack: () => void;
  onForward: () => void;
  onUp: () => void;
  onNavigateToSegment: (id: string) => void;
  search: string;
  onSearchChange: (value: string) => void;
  view: ExplorerViewMode;
  onViewChange: (view: ExplorerViewMode) => void;
  sortBy: ExplorerSortBy;
  sortDir: ExplorerSortDir;
  onSortChange: (sortBy: ExplorerSortBy) => void;
  onToggleSortDir: () => void;
  filter: ExplorerFilter;
  onFilterChange: (filter: ExplorerFilter) => void;
  onNewFolder: () => void;
  onNewFile: () => void;
  disabled?: boolean;
}

export function ExplorerToolbar({
  path,
  canGoBack,
  canGoForward,
  onBack,
  onForward,
  onUp,
  onNavigateToSegment,
  search,
  onSearchChange,
  view,
  onViewChange,
  sortBy,
  sortDir,
  onSortChange,
  onToggleSortDir,
  filter,
  onFilterChange,
  onNewFolder,
  onNewFile,
  disabled,
}: ExplorerToolbarProps) {
  return (
    <div className="flex shrink-0 flex-col gap-2 border-b border-[var(--border-1)] p-2">
      <div className="flex items-center gap-1">
        <IconButton icon={ChevronLeft} label="Back" onClick={onBack} disabled={!canGoBack} />
        <IconButton icon={ChevronRight} label="Forward" onClick={onForward} disabled={!canGoForward} />
        <IconButton icon={ArrowUp} label="Up" onClick={onUp} disabled={disabled || path.length <= 1} />

        {/* Address bar — breadcrumb segments double as the editable path display */}
        <div className="ml-1 flex min-w-0 flex-1 items-center gap-1 overflow-x-auto rounded-lg border border-[var(--border-2)] bg-[var(--surface-1)] px-2 py-1.5 text-[13px]">
          {path.length === 0 && <span className="text-[var(--text-4)]">Recycle Bin</span>}
          {path.map((segment, i) => (
            <span key={segment.id} className="flex shrink-0 items-center gap-1">
              {i > 0 && <span className="text-[var(--text-4)]">/</span>}
              <button
                type="button"
                onClick={() => onNavigateToSegment(segment.id)}
                className={cn(
                  "rounded px-1 hover:bg-[var(--surface-3)]",
                  i === path.length - 1 ? "text-[var(--text-1)]" : "text-[var(--text-3)]"
                )}
              >
                {segment.name}
              </button>
            </span>
          ))}
        </div>

        <div className="flex items-center gap-1 rounded-lg border border-[var(--border-2)] bg-[var(--surface-1)] px-2 py-1">
          <Search className="h-3.5 w-3.5 text-[var(--text-4)]" />
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search"
            className="w-32 bg-transparent text-[13px] outline-none placeholder:text-[var(--text-4)]"
          />
        </div>
      </div>

      <div className="flex items-center gap-1">
        <IconButton icon={FolderPlus} label="New Folder" onClick={onNewFolder} disabled={disabled} />
        <IconButton icon={FilePlus} label="New File" onClick={onNewFile} disabled={disabled} />

        <div className="mx-1 h-4 w-px bg-[var(--border-2)]" />

        <select
          value={filter}
          onChange={(e) => onFilterChange(e.target.value as ExplorerFilter)}
          className="rounded-md border border-[var(--border-2)] bg-[var(--surface-1)] px-1.5 py-1 text-xs text-[var(--text-2)] outline-none"
        >
          <option value="all">All items</option>
          <option value="folder">Folders</option>
          <option value="file">Files</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as ExplorerSortBy)}
          className="rounded-md border border-[var(--border-2)] bg-[var(--surface-1)] px-1.5 py-1 text-xs text-[var(--text-2)] outline-none"
        >
          <option value="name">Name</option>
          <option value="type">Type</option>
          <option value="modified">Modified</option>
        </select>
        <button
          type="button"
          onClick={onToggleSortDir}
          title={sortDir === "asc" ? "Ascending — click to reverse" : "Descending — click to reverse"}
          className="flex h-6 w-6 items-center justify-center rounded-md border border-[var(--border-2)] bg-[var(--surface-1)] text-[var(--text-2)] hover:bg-[var(--surface-3)]"
        >
          <ArrowUpDown className={cn("h-3 w-3 transition-transform", sortDir === "desc" && "rotate-180")} />
        </button>

        <div className="ml-auto flex items-center gap-0.5 rounded-md border border-[var(--border-2)] bg-[var(--surface-1)] p-0.5">
          <ViewToggleButton icon={LayoutGrid} isActive={view === "grid"} onClick={() => onViewChange("grid")} />
          <ViewToggleButton icon={List} isActive={view === "list"} onClick={() => onViewChange("list")} />
        </div>
      </div>
    </div>
  );
}

function IconButton({
  icon: Icon,
  label,
  onClick,
  disabled,
}: {
  icon: typeof ChevronLeft;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className="flex h-7 w-7 items-center justify-center rounded-md text-[var(--text-2)] transition-colors hover:bg-[var(--surface-3)] hover:text-[var(--text-1)] disabled:opacity-30 disabled:hover:bg-transparent"
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}

function ViewToggleButton({
  icon: Icon,
  isActive,
  onClick,
}: {
  icon: typeof LayoutGrid;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex h-6 w-6 items-center justify-center rounded",
        isActive ? "bg-[var(--surface-3)] text-[var(--text-1)]" : "text-[var(--text-3)] hover:text-[var(--text-1)]"
      )}
    >
      <Icon className="h-3.5 w-3.5" />
    </button>
  );
}
