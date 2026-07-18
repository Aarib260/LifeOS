"use client";

import { useWindowStore } from "@/store/windowStore";
import { WallpaperPicker } from "./WallpaperPicker";
import { IconSizePicker } from "./IconSizePicker";
import { GlassEffectPicker } from "./GlassEffectPicker";

export function SettingsApp() {
  const closeAllWindows = useWindowStore((s) => s.closeAllWindows);
  const openWindowCount = useWindowStore((s) => s.windows.length);

  return (
    <div className="flex h-full flex-col gap-6 overflow-y-auto p-4">
      <section>
        <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-white/40">
          Wallpaper
        </h3>
        <WallpaperPicker />
      </section>

      <section>
        <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-white/40">
          Desktop Icon Size
        </h3>
        <IconSizePicker />
      </section>

      <section>
        <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-white/40">
          Taskbar Glass Effect
        </h3>
        <GlassEffectPicker />
      </section>

      <section>
        <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-white/40">
          Window Management
        </h3>
        <button
          type="button"
          onClick={closeAllWindows}
          disabled={openWindowCount === 0}
          className="rounded-lg bg-white/[0.06] px-3 py-2 text-xs text-white/70 transition-colors hover:bg-white/[0.1] disabled:opacity-30"
        >
          Close all open windows ({openWindowCount})
        </button>
      </section>

      <section>
        <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-white/40">About</h3>
        <p className="text-xs text-white/40">
          LifeOS — a browser-based personal operating system. Account preferences
          aren&apos;t built yet.
        </p>
      </section>
    </div>
  );
}