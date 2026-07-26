import type { ComponentType } from "react";
import {
  Palette,
  Timer,
  CloudSun,
  Music2,
  Code2,
  Brain,
  Waves,
  StickyNote,
  Rocket,
  PiggyBank,
} from "lucide-react";

export type AppStoreCategory =
  | "Productivity"
  | "Creativity"
  | "Utilities"
  | "Games"
  | "Developer Tools"
  | "Wellness"
  | "Finance";

export interface CatalogApp {
  id: string;
  name: string;
  developer: string;
  description: string;
  category: AppStoreCategory;
  icon: ComponentType<{ className?: string }>;
  rating: number; // 1-5
  sizeLabel: string; // purely cosmetic, e.g. "24 MB"
  featured?: boolean;
}

/**
 * Entirely simulated — installing one of these doesn't add real
 * functionality, matching the spec's "simulated app store; no real
 * downloads required." Real OS apps (Tasks, Terminal, etc.) aren't in
 * here; they're already "installed" by definition and shown separately.
 */
export const APP_STORE_CATALOG: CatalogApp[] = [
  {
    id: "pixel-paint",
    name: "Pixel Paint",
    developer: "Glyph Studio",
    description: "A lightweight pixel-art editor with layers, palettes, and export to PNG.",
    category: "Creativity",
    icon: Palette,
    rating: 4.6,
    sizeLabel: "38 MB",
    featured: true,
  },
  {
    id: "focus-timer-pro",
    name: "Focus Timer Pro",
    developer: "Quietwork Labs",
    description: "Pomodoro-style focus sessions with ambient sound and streak tracking.",
    category: "Productivity",
    icon: Timer,
    rating: 4.8,
    sizeLabel: "12 MB",
    featured: true,
  },
  {
    id: "weather-now",
    name: "Weather Now",
    developer: "Skylight",
    description: "Hyperlocal forecasts, radar maps, and severe weather alerts.",
    category: "Utilities",
    icon: CloudSun,
    rating: 4.3,
    sizeLabel: "20 MB",
  },
  {
    id: "retro-synth",
    name: "Retro Synth",
    developer: "8bit Audio Co.",
    description: "A virtual analog synthesizer with retro drum machine and sequencer.",
    category: "Creativity",
    icon: Music2,
    rating: 4.5,
    sizeLabel: "64 MB",
    featured: true,
  },
  {
    id: "codesnap",
    name: "CodeSnap",
    developer: "DevTools Inc.",
    description: "Turn code snippets into beautifully formatted, shareable images.",
    category: "Developer Tools",
    icon: Code2,
    rating: 4.7,
    sizeLabel: "18 MB",
  },
  {
    id: "mind-map",
    name: "Mind Map",
    developer: "Clearhead",
    description: "Freeform mind-mapping for brainstorms, outlines, and project planning.",
    category: "Productivity",
    icon: Brain,
    rating: 4.4,
    sizeLabel: "22 MB",
  },
  {
    id: "soundscapes",
    name: "Soundscapes",
    developer: "Quietwork Labs",
    description: "Looping ambient soundscapes for focus, relaxation, and sleep.",
    category: "Wellness",
    icon: Waves,
    rating: 4.9,
    sizeLabel: "40 MB",
  },
  {
    id: "quicknotes-plus",
    name: "QuickNotes+",
    developer: "Clearhead",
    description: "Fast, tag-based scratch notes that sync across every window.",
    category: "Productivity",
    icon: StickyNote,
    rating: 4.2,
    sizeLabel: "9 MB",
  },
  {
    id: "galaxy-defender",
    name: "Galaxy Defender",
    developer: "Nova Interactive",
    description: "A retro arcade shoot-'em-up with 40 hand-crafted levels.",
    category: "Games",
    icon: Rocket,
    rating: 4.1,
    sizeLabel: "88 MB",
  },
  {
    id: "budget-buddy",
    name: "Budget Buddy",
    developer: "Ledger Labs",
    description: "Simple envelope budgeting with spending charts and monthly reviews.",
    category: "Finance",
    icon: PiggyBank,
    rating: 4.5,
    sizeLabel: "16 MB",
  },
];

export const APP_STORE_CATEGORIES: AppStoreCategory[] = [
  "Productivity",
  "Creativity",
  "Utilities",
  "Games",
  "Developer Tools",
  "Wellness",
  "Finance",
];
