"use client";

import { motion } from "framer-motion";
import {
  useSettingsStore,
  WALLPAPER_PRESETS,
  CUSTOM_WALLPAPER_ID,
} from "@/store/settingsStore";

/**
 * Renders one of three wallpaper kinds depending on Settings:
 * - "gradient": the original animated aurora-mesh blobs
 * - "photo": a static real photo (Picsum-sourced preset)
 * - custom: a user-uploaded image (data URL from localStorage)
 *
 * Pure decoration — sits behind everything at z-0, pointer-events disabled.
 */
export function Wallpaper() {
  const wallpaperId = useSettingsStore((s) => s.wallpaperId);
  const customWallpaperDataUrl = useSettingsStore((s) => s.customWallpaperDataUrl);

  if (wallpaperId === CUSTOM_WALLPAPER_ID && customWallpaperDataUrl) {
    return <PhotoWallpaper url={customWallpaperDataUrl} />;
  }

  const preset = WALLPAPER_PRESETS.find((p) => p.id === wallpaperId) ?? WALLPAPER_PRESETS[0];

  if (preset.kind === "photo" && preset.url) {
    return <PhotoWallpaper url={preset.url} />;
  }

  return <GradientWallpaper colors={preset.colors ?? WALLPAPER_PRESETS[0].colors!} />;
}

function PhotoWallpaper({ url }: { url: string }) {
  return (
    <div aria-hidden className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${url})` }}
      />
      {/* Dark overlay so desktop icons/taskbar text stay legible over any photo */}
      <div className="absolute inset-0 bg-black/35" />
    </div>
  );
}

function GradientWallpaper({ colors }: { colors: [string, string] }) {
  const [colorA, colorB] = colors;

  return (
    <div
      aria-hidden
      className="fixed inset-0 z-0 overflow-hidden bg-[var(--bg-base)] pointer-events-none"
    >
      <motion.div
        className="absolute h-[60vw] w-[60vw] rounded-full opacity-30 blur-3xl"
        style={{ background: `radial-gradient(circle, ${colorA} 0%, transparent 70%)` }}
        animate={{ x: ["-10%", "15%", "-10%"], y: ["-5%", "10%", "-5%"] }}
        transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
        initial={{ top: "5%", left: "10%" }}
      />
      <motion.div
        className="absolute h-[50vw] w-[50vw] rounded-full opacity-25 blur-3xl"
        style={{ background: `radial-gradient(circle, ${colorB} 0%, transparent 70%)` }}
        animate={{ x: ["5%", "-15%", "5%"], y: ["10%", "-8%", "10%"] }}
        transition={{ duration: 34, repeat: Infinity, ease: "easeInOut" }}
        initial={{ bottom: "0%", right: "5%" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40" />
    </div>
  );
}
