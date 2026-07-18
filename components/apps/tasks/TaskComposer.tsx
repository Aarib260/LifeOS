"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskComposerProps {
  onAdd: (title: string) => void;
  isPending: boolean;
}

export function TaskComposer({ onAdd, isPending }: TaskComposerProps) {
  const [value, setValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setValue("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 p-3 border-b border-white/[0.06]">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Add a task..."
        className="flex-1 rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-sm text-white/90 outline-none placeholder:text-white/30 focus:border-cyan-400/30"
      />
      <button
        type="submit"
        disabled={!value.trim() || isPending}
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors",
          value.trim() && !isPending
            ? "bg-cyan-400/15 text-cyan-300 hover:bg-cyan-400/25"
            : "text-white/20"
        )}
      >
        <Plus className="h-4 w-4" />
      </button>
    </form>
  );
}
