import {
  CheckSquare,
  Repeat,
  Target,
  CalendarDays,
  BookOpen,
  Sparkles,
  Settings,
  Globe,
  type LucideIcon,
} from "lucide-react";
import type { AppId } from "@/types";

export interface AppMetadata {
  id: AppId;
  label: string;
  icon: LucideIcon;
}

/**
 * Single source of truth for icon + display name per app. Desktop and
 * Taskbar both read from this so they never fall out of sync. This is
 * intentionally NOT the full AppDefinition (component, defaultSize, etc.)
 * from types/app.ts — that gets built out in Step 7 once real app
 * components exist to attach.
 */
export const APP_METADATA: Record<AppId, AppMetadata> = {
  tasks: { id: "tasks", label: "Tasks", icon: CheckSquare },
  habits: { id: "habits", label: "Habits", icon: Repeat },
  goals: { id: "goals", label: "Goals", icon: Target },
  calendar: { id: "calendar", label: "Calendar", icon: CalendarDays },
  journal: { id: "journal", label: "Journal", icon: BookOpen },
  "ai-assistant": { id: "ai-assistant", label: "AI Assistant", icon: Sparkles },
  atlas: { id: "atlas", label: "Atlas", icon: Globe },
  settings: { id: "settings", label: "Settings", icon: Settings },
};

export const APP_LIST: AppMetadata[] = Object.values(APP_METADATA);