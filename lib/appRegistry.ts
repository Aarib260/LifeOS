import {
  CheckSquare,
  Repeat,
  Target,
  CalendarDays,
  BookOpen,
  Sparkles,
  Settings,
} from "lucide-react";
import type { AppDefinition, AppRegistry } from "@/types";
import { TasksApp } from "@/components/apps/tasks/TasksApp";
import { HabitsApp } from "@/components/apps/habits/HabitsApp";
import { GoalsApp } from "@/components/apps/goals/GoalsApp";
import { CalendarApp } from "@/components/apps/calendar/CalendarApp";
import { JournalApp } from "@/components/apps/journal/JournalApp";
import { AIAssistantApp } from "@/components/apps/ai/AIAssistantApp";
import { SettingsApp } from "@/components/apps/settings/SettingsApp";

/**
 * Single source of truth for every installed app: icon, launchable
 * component, and default window bounds. Desktop, Taskbar, and StartMenu
 * all read from this — nothing else should hardcode app metadata.
 *
 * Atlas is deliberately not registered here yet — its migration into
 * LifeOS hasn't happened, so it's left out rather than shipping a
 * placeholder for it.
 */
export const APP_REGISTRY: AppRegistry = {
  tasks: {
    id: "tasks",
    title: "Tasks",
    icon: CheckSquare,
    component: TasksApp,
    defaultSize: { width: 480, height: 420 },
    defaultPosition: { x: 140, y: 110 },
  },
  habits: {
    id: "habits",
    title: "Habits",
    icon: Repeat,
    component: HabitsApp,
    defaultSize: { width: 480, height: 420 },
    defaultPosition: { x: 160, y: 130 },
  },
  goals: {
    id: "goals",
    title: "Goals",
    icon: Target,
    component: GoalsApp,
    defaultSize: { width: 480, height: 420 },
    defaultPosition: { x: 180, y: 150 },
  },
  calendar: {
    id: "calendar",
    title: "Calendar",
    icon: CalendarDays,
    component: CalendarApp,
    defaultSize: { width: 760, height: 540 },
    defaultPosition: { x: 200, y: 100 },
    minSize: { width: 420, height: 360 },
  },
  journal: {
    id: "journal",
    title: "Journal",
    icon: BookOpen,
    component: JournalApp,
    defaultSize: { width: 680, height: 520 },
    defaultPosition: { x: 220, y: 120 },
    minSize: { width: 380, height: 320 },
  },
  "ai-assistant": {
    id: "ai-assistant",
    title: "AI Assistant",
    icon: Sparkles,
    component: AIAssistantApp,
    defaultSize: { width: 420, height: 560 },
    defaultPosition: { x: 240, y: 90 },
  },
  settings: {
    id: "settings",
    title: "Settings",
    icon: Settings,
    component: SettingsApp,
    defaultSize: { width: 480, height: 420 },
    defaultPosition: { x: 260, y: 140 },
  },
};

export const APP_LIST: AppDefinition[] = Object.values(APP_REGISTRY);