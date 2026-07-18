"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const COLOR_OPTIONS = ["#22D3EE", "#818CF8", "#F59E0B", "#FB7185", "#34D399"];
const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"]; // index = day-of-week, 0=Sun

interface HabitComposerProps {
  onAdd: (input: { name: string; color: string; targetDays: number[] }) => void;
  isPending: boolean;
}

export function HabitComposer({ onAdd, isPending }: HabitComposerProps) {
  const [name, setName] = useState("");
  const [color, setColor] = useState(COLOR_OPTIONS[0]);
  const [targetDays, setTargetDays] = useState<number[]>([0, 1, 2, 3, 4, 5, 6]);

  const toggleDay = (day: number) => {
    setTargetDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day].sort()
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed || targetDays.length === 0) return;
    onAdd({ name: trimmed, color, targetDays });
    setName("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 border-b border-white/[0.06] p-3">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Add a habit..."
          className="flex-1 rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-sm text-white/90 outline-none placeholder:text-white/30 focus:border-cyan-400/30"
        />
        <button
          type="submit"
          disabled={!name.trim() || targetDays.length === 0 || isPending}
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors",
            name.trim() && targetDays.length > 0 && !isPending
              ? "bg-cyan-400/15 text-cyan-300 hover:bg-cyan-400/25"
              : "text-white/20"
          )}
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex gap-1">
          {COLOR_OPTIONS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              aria-label={`Color ${c}`}
              className={cn(
                "h-5 w-5 rounded-full border-2 transition-transform",
                color === c ? "scale-110 border-white/60" : "border-transparent"
              )}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>

        <div className="flex gap-0.5">
          {DAY_LABELS.map((label, day) => (
            <button
              key={day}
              type="button"
              onClick={() => toggleDay(day)}
              className={cn(
                "flex h-6 w-6 items-center justify-center rounded-md text-[10px] font-medium transition-colors",
                targetDays.includes(day)
                  ? "bg-cyan-400/20 text-cyan-200"
                  : "bg-white/[0.04] text-white/30"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </form>
  );
}