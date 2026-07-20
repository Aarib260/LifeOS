"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { useWindowStore } from "@/store/windowStore";
import { WallpaperPicker } from "./WallpaperPicker";
import { IconSizePicker } from "./IconSizePicker";
import { GlassEffectPicker } from "./GlassEffectPicker";
import { ThemeToggle } from "@/components/shared/ThemeToggle";

export function SettingsApp() {
  const closeAllWindows = useWindowStore((s) => s.closeAllWindows);
  const openWindowCount = useWindowStore((s) => s.windows.length);

  return (
    <div className="flex h-full flex-col gap-6 overflow-y-auto p-4">
      <section>
        <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-[var(--text-4)]">
          Appearance
        </h3>
        <div className="flex items-center justify-between rounded-lg border border-[var(--border-2)] p-3">
          <span className="text-xs text-[var(--text-3)]">Light / Dark theme</span>
          <ThemeToggle />
        </div>
      </section>

      <section>
        <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-[var(--text-4)]">
          Wallpaper
        </h3>
        <WallpaperPicker />
      </section>

      <section>
        <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-[var(--text-4)]">
          Desktop Icon Size
        </h3>
        <IconSizePicker />
      </section>

      <section>
        <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-[var(--text-4)]">
          Taskbar Glass Effect
        </h3>
        <GlassEffectPicker />
      </section>

      <section>
        <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-[var(--text-4)]">
          Window Management
        </h3>
        <button
          type="button"
          onClick={closeAllWindows}
          disabled={openWindowCount === 0}
          className="rounded-lg bg-[var(--surface-2)] px-3 py-2 text-xs text-[var(--text-2)] transition-colors hover:bg-[var(--surface-3)] disabled:opacity-30"
        >
          Close all open windows ({openWindowCount})
        </button>
      </section>

      <section>
        <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-[var(--text-4)]">
          Session
        </h3>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-2 rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-300 transition-colors hover:bg-red-500/20"
        >
          <LogOut className="h-3.5 w-3.5" />
          Sign out
        </button>
      </section>

      <section>
        <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-[var(--text-4)]">About</h3>
        <p className="text-xs text-[var(--text-4)]">
          LifeOS — a browser-based personal operating system. Account preferences
          aren&apos;t built yet.
        </p>
      </section>
    </div>
  );
}
