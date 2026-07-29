import {
  CheckSquare,
  Repeat,
  Target,
  CalendarDays,
  BookOpen,
  Sparkles,
  Settings,
  Terminal as TerminalIcon,
  FolderOpen,
  Store,
  FileText,
  Gauge,
} from "lucide-react";
import type { AppDefinition, AppId, AppRegistry } from "@/types";
import { TasksApp } from "@/components/apps/tasks/TasksApp";
import { HabitsApp } from "@/components/apps/habits/HabitsApp";
import { GoalsApp } from "@/components/apps/goals/GoalsApp";
import { CalendarApp } from "@/components/apps/calendar/CalendarApp";
import { JournalApp } from "@/components/apps/journal/JournalApp";
import { AIAssistantApp } from "@/components/apps/ai/AIAssistantApp";
import { SettingsApp } from "@/components/apps/settings/SettingsApp";
import { TerminalApp } from "@/components/apps/terminal/TerminalApp";
import { FileExplorerApp } from "@/components/apps/file-explorer/FileExplorerApp";
import { AppStoreApp } from "@/components/apps/app-store/AppStoreApp";
import { FileViewerApp } from "@/components/apps/file-viewer/FileViewerApp";
import { PerformanceMonitorApp } from "@/components/apps/performance-monitor/PerformanceMonitorApp";

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
  terminal: {
    id: "terminal",
    title: "Terminal",
    icon: TerminalIcon,
    component: TerminalApp,
    defaultSize: { width: 620, height: 420 },
    defaultPosition: { x: 280, y: 160 },
    minSize: { width: 360, height: 220 },
    allowMultipleInstances: true,
  },
  "file-explorer": {
    id: "file-explorer",
    title: "File Explorer",
    icon: FolderOpen,
    component: FileExplorerApp,
    defaultSize: { width: 760, height: 520 },
    defaultPosition: { x: 220, y: 100 },
    minSize: { width: 480, height: 320 },
    allowMultipleInstances: true,
  },
  "app-store": {
    id: "app-store",
    title: "App Store",
    icon: Store,
    component: AppStoreApp,
    defaultSize: { width: 680, height: 520 },
    defaultPosition: { x: 240, y: 110 },
    minSize: { width: 480, height: 400 },
  },
  "file-viewer": {
    id: "file-viewer",
    title: "File Viewer",
    icon: FileText,
    component: FileViewerApp,
    defaultSize: { width: 560, height: 480 },
    defaultPosition: { x: 260, y: 120 },
    minSize: { width: 340, height: 260 },
    allowMultipleInstances: true,
    hidden: true,
  },
  "performance-monitor": {
    id: "performance-monitor",
    title: "Performance",
    icon: Gauge,
    component: PerformanceMonitorApp,
    defaultSize: { width: 620, height: 640 },
    defaultPosition: { x: 300, y: 90 },
    minSize: { width: 420, height: 480 },
  },
};

export const APP_LIST: AppDefinition[] = Object.values(APP_REGISTRY);

/** Apps that should actually appear on the Desktop, Start Menu, and App Store's "built in" list — excludes hidden utility apps like the file viewer. */
export const VISIBLE_APP_LIST: AppDefinition[] = APP_LIST.filter((app) => !app.hidden);

/**
 * Builds the options object for `useWindowStore().openApp()` straight from
 * the registry, so things like `allowMultipleInstances` and `minSize` only
 * have to be declared once here instead of duplicated (and easy to forget)
 * at every call site that opens an app.
 */
export function getOpenAppOptions(
  appId: AppId,
  overrides?: { title?: string; payload?: Record<string, unknown> }
) {
  const app = APP_REGISTRY[appId];
  return {
    title: overrides?.title ?? app.title,
    size: app.defaultSize,
    minSize: app.minSize,
    allowMultipleInstances: app.allowMultipleInstances,
    payload: overrides?.payload,
  };
}
