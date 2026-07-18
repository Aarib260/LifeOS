"use client";

import { useRef, useState } from "react";
import { Check, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useSettingsStore,
  WALLPAPER_PRESETS,
  CUSTOM_WALLPAPER_ID,
} from "@/store/settingsStore";

// Soft warning threshold — localStorage typically caps around 5-10MB per
// origin, and base64 inflates file size ~33%, so this leaves real headroom.
const LARGE_FILE_WARNING_BYTES = 2 * 1024 * 1024;

export function WallpaperPicker() {
  const wallpaperId = useSettingsStore((s) => s.wallpaperId);
  const customWallpaperDataUrl = useSettingsStore((s) => s.customWallpaperDataUrl);
  const setWallpaperId = useSettingsStore((s) => s.setWallpaperId);
  const setCustomWallpaper = useSettingsStore((s) => s.setCustomWallpaper);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [warning, setWarning] = useState<string | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setWarning("Please choose an image file.");
      return;
    }

    if (file.size > LARGE_FILE_WARNING_BYTES) {
      setWarning("That image is large and may not save. Try something under 2MB.");
    } else {
      setWarning(null);
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setCustomWallpaper(reader.result);
      }
    };
    reader.readAsDataURL(file);

    e.target.value = "";
  };

  return (
    <div>
      <div className="grid grid-cols-4 gap-2">
        {WALLPAPER_PRESETS.map((preset) => {
          const isActive = preset.id === wallpaperId;
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => setWallpaperId(preset.id)}
              className="flex flex-col items-center gap-1"
            >
              <div
                className={cn(
                  "relative flex h-12 w-full items-center justify-center overflow-hidden rounded-lg border-2 bg-cover bg-center",
                  isActive ? "border-cyan-400/70" : "border-white/[0.08]"
                )}
                style={{
                  background:
                    preset.kind === "photo"
                      ? `url(${preset.thumbnailUrl}) center/cover`
                      : `linear-gradient(135deg, ${preset.colors?.[0]} 0%, #0A0E14 45%, ${preset.colors?.[1]} 100%)`,
                }}
              >
                {isActive && <Check className="h-4 w-4 text-white drop-shadow" />}
              </div>
              <span className="text-[11px] text-white/60">{preset.label}</span>
            </button>
          );
        })}

        {/* Custom upload tile */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex flex-col items-center gap-1"
        >
          <div
            className={cn(
              "relative flex h-12 w-full items-center justify-center overflow-hidden rounded-lg border-2 bg-cover bg-center",
              wallpaperId === CUSTOM_WALLPAPER_ID
                ? "border-cyan-400/70"
                : "border-dashed border-white/20"
            )}
            style={
              wallpaperId === CUSTOM_WALLPAPER_ID && customWallpaperDataUrl
                ? { backgroundImage: `url(${customWallpaperDataUrl})` }
                : undefined
            }
          >
            {wallpaperId === CUSTOM_WALLPAPER_ID && customWallpaperDataUrl ? (
              <Check className="h-4 w-4 text-white drop-shadow" />
            ) : (
              <Upload className="h-4 w-4 text-white/40" />
            )}
          </div>
          <span className="text-[11px] text-white/60">Upload</span>
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {warning && <p className="mt-2 text-[11px] text-amber-300/80">{warning}</p>}
    </div>
  );
}