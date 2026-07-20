"use client";

import { cn } from "@/lib/utils";
import { useSettingsStore, type GlassIntensity } from "@/store/settingsStore";

const OPTIONS: { id: GlassIntensity; label: string; previewClass: string }[] = [
  { id: "subtle", label: "Subtle", previewClass: "backdrop-blur-sm bg-[var(--surface-3)]" },
  { id: "medium", label: "Medium", previewClass: "backdrop-blur-md bg-[var(--surface-3)]" },
  { id: "strong", label: "Strong", previewClass: "backdrop-blur-xl bg-[var(--surface-2)]" },
];

export function GlassEffectPicker() {
  const taskbarGlass = useSettingsStore((s) => s.taskbarGlass);
  const setTaskbarGlass = useSettingsStore((s) => s.setTaskbarGlass);

  return (
    <div className="flex gap-2">
      {OPTIONS.map((option) => {
        const isActive = option.id === taskbarGlass;
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => setTaskbarGlass(option.id)}
            className={cn(
              "flex flex-1 flex-col items-center gap-1.5 rounded-lg border p-2.5 transition-colors",
              isActive
                ? "border-cyan-400/50 bg-cyan-400/[0.08]"
                : "border-[var(--border-2)] hover:bg-[var(--surface-1)]"
            )}
          >
            <div className="flex h-8 w-full items-center justify-center rounded-md bg-gradient-to-br from-cyan-500/40 to-violet-500/40 p-1">
              <div className={cn("h-full w-full rounded-sm", option.previewClass)} />
            </div>
            <span className="text-[11px] text-[var(--text-3)]">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
