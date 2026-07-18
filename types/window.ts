import type { AppId } from "./app";

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

/**
 * Represents a single OPEN INSTANCE of an app.
 * Note: `id` is the window instance id (unique per open window),
 * NOT the same as `appId` — one app can have multiple windows
 * if `allowMultipleInstances` is true.
 */
export interface WindowState {
  id: string;
  appId: AppId;
  title: string;
  position: Position;
  size: Size;
  /** Resize floor for this window — copied from AppDefinition.minSize at open time, falls back to the global default */
  minSize: Size;
  /** Position/size saved before maximizing, so we can restore on un-maximize */
  restoreBounds: { position: Position; size: Size } | null;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  openedAt: number;
}

export type WindowId = WindowState["id"];