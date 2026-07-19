"use client";

import { useEffect } from "react";
import { useSettingsStore } from "@/store/settingsStore";

/**
 * Sets data-theme on <html>, which every CSS variable in globals.css
 * keys off. Renders nothing — purely a side effect. Mounted once at
 * the root layout so it governs both the landing pages and /os.
 */
export function ThemeEffect() {
  const theme = useSettingsStore((s) => s.theme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return null;
}