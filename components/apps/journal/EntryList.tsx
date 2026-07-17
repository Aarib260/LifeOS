"use client";

import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { JournalEntry } from "@/types/journal";

interface EntryListProps {
  entries: JournalEntry[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  isLoading: boolean;
  isError: boolean;
}

/** Strips HTML tags for the sidebar preview snippet */
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export function EntryList({ entries, selectedId, onSelect, onNew, isLoading, isError }: EntryListProps) {
  return (
    <div className="flex h-full w-48 shrink-0 flex-col border-r border-white/[0.06]">
      <div className="border-b border-white/[0.06] p-2">
        <button
          type="button"
          onClick={onNew}
          className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-cyan-400/15 py-1.5 text-xs font-medium text-cyan-300 transition-colors hover:bg-cyan-400/25"
        >
          <Plus className="h-3.5 w-3.5" />
          New Entry
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading && <p className="p-3 text-center text-xs text-white/30">Loading...</p>}
        {isError && <p className="p-3 text-center text-xs text-red-300/70">Couldn&apos;t load.</p>}
        {!isLoading && !isError && entries.length === 0 && (
          <p className="p-3 text-center text-xs text-white/30">No entries yet.</p>
        )}

        {entries.map((entry) => {
          const preview = stripHtml(entry.content);
          return (
            <button
              key={entry.id}
              type="button"
              onClick={() => onSelect(entry.id)}
              className={cn(
                "flex w-full flex-col items-start gap-0.5 border-b border-white/[0.04] px-3 py-2 text-left transition-colors hover:bg-white/[0.04]",
                selectedId === entry.id && "bg-cyan-400/[0.08]"
              )}
            >
              <span className="text-[10px] text-white/35">
                {new Date(entry.entryDate).toLocaleDateString([], { month: "short", day: "numeric" })}
              </span>
              <span className="w-full truncate text-xs text-white/85">
                {entry.title || "Untitled"}
              </span>
              {preview && (
                <span className="line-clamp-1 w-full text-[11px] text-white/35">{preview}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}