"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const COLOR_OPTIONS = ["#22D3EE", "#818CF8", "#F59E0B", "#FB7185", "#34D399"];

interface EventComposerProps {
  selectedDate: string;
  onAdd: (input: {
    title: string;
    eventDate: string;
    startTime?: string;
    color: string;
  }) => void;
  isPending: boolean;
}

export function EventComposer({ selectedDate, onAdd, isPending }: EventComposerProps) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(selectedDate);
  const [startTime, setStartTime] = useState("");
  const [color, setColor] = useState(COLOR_OPTIONS[0]);

  // Keep the date field in sync when a different day is clicked in the grid,
  // but don't clobber it if the user already typed a title (mid-edit).
  useEffect(() => {
    if (!title) setDate(selectedDate);
  }, [selectedDate, title]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    onAdd({ title: trimmed, eventDate: date, startTime: startTime || undefined, color });
    setTitle("");
    setStartTime("");
    setDate(selectedDate);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 border-b border-[var(--border-1)] p-3">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add an event..."
        className="rounded-lg border border-[var(--border-2)] bg-[var(--surface-1)] px-3 py-2 text-sm text-[var(--text-1)] outline-none placeholder:text-[var(--text-4)] focus:border-cyan-400/30"
      />

      <div className="flex items-center gap-1.5">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="min-w-0 flex-1 rounded-md border border-[var(--border-2)] bg-[var(--surface-1)] px-2 py-1.5 text-xs text-[var(--text-2)] outline-none focus:border-cyan-400/30 [color-scheme:dark]"
        />
        <input
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className="min-w-0 flex-1 rounded-md border border-[var(--border-2)] bg-[var(--surface-1)] px-2 py-1.5 text-xs text-[var(--text-2)] outline-none focus:border-cyan-400/30 [color-scheme:dark]"
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex gap-1">
          {COLOR_OPTIONS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              aria-label={`Color ${c}`}
              className={cn(
                "h-4 w-4 rounded-full border-2 transition-transform",
                color === c ? "scale-110 border-white/60" : "border-transparent"
              )}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={!title.trim() || isPending}
          className={cn(
            "flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium transition-colors",
            title.trim() && !isPending
              ? "bg-cyan-400/15 text-cyan-300 hover:bg-cyan-400/25"
              : "text-[var(--text-5)]"
          )}
        >
          <Plus className="h-3.5 w-3.5" />
          Add
        </button>
      </div>
    </form>
  );
}
