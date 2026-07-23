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
  | "terminal";

export interface AppDefinition {
  id: AppId;
  title: string;
  /** Icon shown on the Desktop, Taskbar, and Start Menu */
  icon: ComponentType<{ className?: string }>;
  /** The component rendered inside an AppWindow's content area */
  component: ComponentType;
  /** Default window size when the app is first opened */
  defaultSize: { width: number; height: number };
  /** Default position (top-left) when first opened, before cascade offset */
  defaultPosition: { x: number; y: number };
  /** Whether multiple instances of this app can be open at once */
  allowMultipleInstances?: boolean;
  /** Minimum size the window can be resized down to */
  minSize?: { width: number; height: number };
}

export type AppRegistry = Record<AppId, AppDefinition>;