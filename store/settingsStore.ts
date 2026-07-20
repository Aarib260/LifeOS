import { create } from "zustand";
import { persist } from "zustand/middleware";

export type WallpaperKind = "gradient" | "photo";
export type IconSize = "small" | "medium" | "large";
export type GlassIntensity = "subtle" | "medium" | "strong";
export type Theme = "dark" | "light";

export interface WallpaperPreset {
  id: string;
  label: string;
  kind: WallpaperKind;
  /** For gradient wallpapers — two colors for the animated aurora blobs */
  colors?: [string, string];
  /** For photo wallpapers — full-res image used as the actual wallpaper */
  url?: string;
  /** For photo wallpapers — small image used for the picker thumbnail, so selecting doesn't require downloading the full-res image just to preview it */
  thumbnailUrl?: string;
}

/**
 * Photo presets use Picsum (picsum.photos) — a free, stable
 * placeholder-photo service that serves real Unsplash-sourced images via
 * a simple URL API, seeded so the same seed always returns the same
 * image. No image hosting needed on your end.
 */
export const WALLPAPER_PRESETS: WallpaperPreset[] = [
  { id: "cyan", label: "Cyan", kind: "gradient", colors: ["rgba(34,211,238,0.55)", "rgba(129,140,248,0.5)"] },
  { id: "violet", label: "Violet", kind: "gradient", colors: ["rgba(167,139,250,0.55)", "rgba(217,70,239,0.45)"] },
  { id: "sunset", label: "Sunset", kind: "gradient", colors: ["rgba(251,146,60,0.5)", "rgba(244,63,94,0.45)"] },
  { id: "forest", label: "Forest", kind: "gradient", colors: ["rgba(52,211,153,0.5)", "rgba(20,184,166,0.45)"] },
  {
    id: "mountain",
    label: "Mountain",
    kind: "photo",
    url: "https://picsum.photos/seed/lifeos-mountain/1920/1080",
    thumbnailUrl: "https://picsum.photos/seed/lifeos-mountain/120/80",
  },
  {
    id: "ocean",
    label: "Ocean",
    kind: "photo",
    url: "https://picsum.photos/seed/lifeos-ocean/1920/1080",
    thumbnailUrl: "https://picsum.photos/seed/lifeos-ocean/120/80",
  },
  {
    id: "forest-photo",
    label: "Forest",
    kind: "photo",
    url: "https://picsum.photos/seed/lifeos-forest/1920/1080",
    thumbnailUrl: "https://picsum.photos/seed/lifeos-forest/120/80",
  },
  {
    id: "city",
    label: "City",
    kind: "photo",
    url: "https://picsum.photos/seed/lifeos-city/1920/1080",
    thumbnailUrl: "https://picsum.photos/seed/lifeos-city/120/80",
  },
];

export const CUSTOM_WALLPAPER_ID = "custom";

interface SettingsStore {
  wallpaperId: string;
  customWallpaperDataUrl: string | null;
  setWallpaperId: (id: string) => void;
  setCustomWallpaper: (dataUrl: string) => void;

  iconSize: IconSize;
  setIconSize: (size: IconSize) => void;

  taskbarGlass: GlassIntensity;
  setTaskbarGlass: (level: GlassIntensity) => void;

  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

/**
 * localStorage persistence (via zustand's persist middleware) — these are
 * cosmetic, single-device preferences that don't need server storage.
 * Note: custom wallpaper images are stored as base64 data URLs here too,
 * which inflates size ~33% over the original file. localStorage typically
 * caps around 5-10MB per origin, so very large uploads could fail silently
 * — the upload UI warns above ~2MB for that reason.
 */
export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      wallpaperId: "cyan",
      customWallpaperDataUrl: null,
      setWallpaperId: (id) => set({ wallpaperId: id }),
      setCustomWallpaper: (dataUrl) =>
        set({ customWallpaperDataUrl: dataUrl, wallpaperId: CUSTOM_WALLPAPER_ID }),

      iconSize: "medium",
      setIconSize: (size) => set({ iconSize: size }),

      taskbarGlass: "medium",
      setTaskbarGlass: (level) => set({ taskbarGlass: level }),

      theme: "dark",
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set((s) => ({ theme: s.theme === "dark" ? "light" : "dark" })),
    }),
    { name: "lifeos-settings" }
  )
);
