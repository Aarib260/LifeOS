"use client";

import { cn } from "@/lib/utils";
import { useSettingsStore, type IconSize } from "@/store/settingsStore";

const OPTIONS: { id: IconSize; label: string; previewSize: string }[] = [
  { id: "small", label: "Small", previewSize: "h-4 w-4" },
  { id: "medium", label: "Medium", previewSize: "h-5 w-5" },
  { id: "large", label: "Large", previewSize: "h-6 w-6" },
];

export function IconSizePicker() {
  const iconSize = useSettingsStore((s) => s.iconSize);
  const setIconSize = useSettingsStore((s) => s.setIconSize);

  return (
    <div className="flex gap-2">
      {OPTIONS.map((option) => {
        const isActive = option.id === iconSize;
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => setIconSize(option.id)}
            className={cn(
              "flex flex-1 flex-col items-center gap-1.5 rounded-lg border p-2.5 transition-colors",
              isActive
                ? "border-cyan-400/50 bg-cyan-400/[0.08]"
                : "border-[var(--border-2)] hover:bg-[var(--surface-1)]"
            )}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[var(--surface-2)]">
              <div className={cn("rounded-sm bg-cyan-300/80", option.previewSize)} />
            </div>
            <span className="text-[11px] text-[var(--text-3)]">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
