/** Height of the fixed bottom taskbar, in px. Used by Desktop to size the usable canvas. */
export const TASKBAR_HEIGHT = 56;

/** Starting z-index for the first window. Taskbar/StartMenu sit above this range. */
export const WINDOW_Z_BASE = 100;

/** z-index for the fixed taskbar — above all windows, below the Start Menu overlay. */
export const TASKBAR_Z = 900;

/** z-index for the Start Menu overlay — must sit above all windows. */
export const START_MENU_Z = 1000;

/** Offset applied to each newly opened window so they cascade instead of stacking exactly. */
export const WINDOW_CASCADE_OFFSET = 32;

/** Default window size used when an app doesn't specify its own. */
export const DEFAULT_WINDOW_SIZE = { width: 720, height: 480 };

/** Absolute minimum window size, enforced regardless of app-specific minSize. */
export const MIN_WINDOW_SIZE = { width: 320, height: 200 };
