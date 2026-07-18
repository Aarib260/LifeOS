"use client";

import { motion } from "framer-motion";
import { useSettingsStore, WALLPAPER_THEMES } from "@/store/settingsStore";

/**
 * Ambient aurora-mesh wallpaper. Two soft radial gradients drift slowly
 * behind a fixed base color, echoing Atlas's animated-background motif
 * so the OS shell feels visually continuous with the apps it hosts.
 * Colors come from the selected theme (Settings app) rather than being
 * fixed, so switching themes there actually changes what's rendered here.
 *
 * Pure decoration — sits behind everything at z-0, pointer-events disabled.
 */
export function Wallpaper() {
  const wallpaperTheme = useSettingsStore((s) => s.wallpaperTheme);
  const theme = WALLPAPER_THEMES.find((t) => t.id === wallpaperTheme) ?? WALLPAPER_THEMES[0];
  const [colorA, colorB] = theme.colors;

  return (
    <div
      aria-hidden
      className="fixed inset-0 z-0 overflow-hidden bg-[#0A0E14] pointer-events-none"
    >
      <motion.div
        className="absolute h-[60vw] w-[60vw] rounded-full opacity-30 blur-3xl"
        style={{
          background: `radial-gradient(circle, ${colorA} 0%, transparent 70%)`,
        }}
        animate={{
          x: ["-10%", "15%", "-10%"],
          y: ["-5%", "10%", "-5%"],
        }}
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        initial={{ top: "5%", left: "10%" }}
      />
      <motion.div
        className="absolute h-[50vw] w-[50vw] rounded-full opacity-25 blur-3xl"
        style={{
          background: `radial-gradient(circle, ${colorB} 0%, transparent 70%)`,
        }}
        animate={{
          x: ["5%", "-15%", "5%"],
          y: ["10%", "-8%", "10%"],
        }}
        transition={{
          duration: 34,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        initial={{ bottom: "0%", right: "5%" }}
      />
      {/* Subtle grain/vignette to keep the gradients from feeling flat */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40" />
    </div>
  );
}