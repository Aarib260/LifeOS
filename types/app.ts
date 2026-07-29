import type { ComponentType } from "react";

/**
 * Every installed "app" in LifeOS must have a stable, unique id.
 * Add new ids here as apps are registered — this is the single
 * source of truth other types (WindowState, DesktopIcon props, etc.)
 * key off of.
 */
export type AppId =
  | "tasks"
  | "habits"
  | "goals"
  | "calendar"
  | "journal"
  | "ai-assistant"
  | "settings"
  | "terminal"
  | "file-explorer"
  | "app-store"
  | "file-viewer"
  | "performance-monitor";

export interface AppDefinition {
  id: AppId;
  title: string;
  /** Icon shown on the Desktop, Taskbar, and Start Menu */
  icon: ComponentType<{ className?: string }>;
  /** The component rendered inside an AppWindow's content area. May optionally read `payload` for initial state (e.g. File Explorer's starting folder), and receives `windowId` to write state back via updatePayload for persistence across refresh. */
  component: ComponentType<{ payload?: Record<string, unknown>; windowId: string }>;
  /** Default window size when the app is first opened */
  defaultSize: { width: number; height: number };
  /** Default position (top-left) when first opened, before cascade offset */
  defaultPosition: { x: number; y: number };
  /** Whether multiple instances of this app can be open at once */
  allowMultipleInstances?: boolean;
  /** Minimum size the window can be resized down to */
  minSize?: { width: number; height: number };
  /** True for utility apps (like the file viewer) that open contextually and shouldn't appear on the Desktop, Start Menu, or App Store's "built in" list. */
  hidden?: boolean;
}

export type AppRegistry = Record<AppId, AppDefinition>;
