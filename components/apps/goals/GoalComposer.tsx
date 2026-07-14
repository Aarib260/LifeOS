"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface GoalComposerProps {
  onAdd: (input: { title: string; targetDate?: string }) => void;
  isPending: boolean;
}

export function GoalComposer({ onAdd, isPending }: GoalComposerProps) {
  const [title, setTitle] = useState("");
  const [targetDate, setTargetDate] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    onAdd({ title: trimmed, targetDate: targetDate || undefined });
    setTitle("");
    setTargetDate("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 border-b border-white/[0.06] p-3">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add a goal..."
        className="flex-1 rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-sm text-white/90 outline-none placeholder:text-white/30 focus:border-cyan-400/30"
      />
      <input
        type="date"
        value={targetDate}
        onChange={(e) => setTargetDate(e.target.value)}
        className="rounded-lg border border-white/[0.08] bg-white/[0.04] px-2 py-2 text-xs text-white/60 outline-none focus:border-cyan-400/30 [color-scheme:dark]"
      />
      <button
        type="submit"
        disabled={!title.trim() || isPending}
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors",
          title.trim() && !isPending
            ? "bg-cyan-400/15 text-cyan-300 hover:bg-cyan-400/25"
            : "text-white/20"
        )}
      >
        <Plus className="h-4 w-4" />
      </button>
    </form>
  );
}