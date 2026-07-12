import { create } from "zustand";
import type { AppId, Position, Size, WindowState } from "@/types";
import {
  WINDOW_Z_BASE,
  WINDOW_CASCADE_OFFSET,
  DEFAULT_WINDOW_SIZE,
  MIN_WINDOW_SIZE,
} from "@/lib/constants";
import { generateWindowId } from "@/lib/utils";

interface OpenAppOptions {
  title?: string;
  size?: Size;
  position?: Position;
  allowMultipleInstances?: boolean;
}

interface WindowStore {
  windows: WindowState[];
  focusedId: string | null;
  /** Ids of recently opened/focused apps, most recent first — feeds Start Menu "Recent" */
  recentAppIds: AppId[];

  openApp: (appId: AppId, options?: OpenAppOptions) => string;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  restoreWindow: (id: string) => void;
  toggleMaximize: (id: string) => void;
  focusWindow: (id: string) => void;
  updatePosition: (id: string, position: Position) => void;
  updateSize: (id: string, size: Size) => void;

  // Derived-state helpers (kept as functions, not stored, to avoid sync bugs)
  isAppOpen: (appId: AppId) => boolean;
  getWindow: (id: string) => WindowState | undefined;
}

let zCounter = WINDOW_Z_BASE;

export const useWindowStore = create<WindowStore>((set, get) => ({
  windows: [],
  focusedId: null,
  recentAppIds: [],

  openApp: (appId, options) => {
    const existing = get().windows.find(
      (w) => w.appId === appId && !options?.allowMultipleInstances
    );

    // If already open and not minimized-only-allowed duplicates, just focus it.
    if (existing) {
      get().focusWindow(existing.id);
      if (existing.isMinimized) {
        get().restoreWindow(existing.id);
      }
      return existing.id;
    }

    const id = generateWindowId();
    const openCount = get().windows.length;
    const cascade = (openCount % 8) * WINDOW_CASCADE_OFFSET;

    zCounter += 1;

    const newWindow: WindowState = {
      id,
      appId,
      title: options?.title ?? appId,
      position: options?.position ?? { x: 120 + cascade, y: 100 + cascade },
      size: options?.size ?? DEFAULT_WINDOW_SIZE,
      restoreBounds: null,
      isMinimized: false,
      isMaximized: false,
      zIndex: zCounter,
      openedAt: Date.now(),
    };

    set((state) => ({
      windows: [...state.windows, newWindow],
      focusedId: id,
      recentAppIds: [appId, ...state.recentAppIds.filter((a) => a !== appId)].slice(0, 8),
    }));

    return id;
  },

  closeWindow: (id) => {
    set((state) => {
      const remaining = state.windows.filter((w) => w.id !== id);
      const wasFocused = state.focusedId === id;
      const nextFocused = wasFocused
        ? remaining.reduce<WindowState | null>(
            (top, w) => (!top || w.zIndex > top.zIndex ? w : top),
            null
          )?.id ?? null
        : state.focusedId;

      return { windows: remaining, focusedId: nextFocused };
    });
  },

  minimizeWindow: (id) => {
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, isMinimized: true } : w
      ),
      focusedId: state.focusedId === id ? null : state.focusedId,
    }));
  },

  restoreWindow: (id) => {
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, isMinimized: false } : w
      ),
    }));
    get().focusWindow(id);
  },

  toggleMaximize: (id) => {
    set((state) => ({
      windows: state.windows.map((w) => {
        if (w.id !== id) return w;
        if (w.isMaximized) {
          // Restore previous bounds
          return {
            ...w,
            isMaximized: false,
            position: w.restoreBounds?.position ?? w.position,
            size: w.restoreBounds?.size ?? w.size,
            restoreBounds: null,
          };
        }
        return {
          ...w,
          isMaximized: true,
          restoreBounds: { position: w.position, size: w.size },
        };
      }),
    }));
    get().focusWindow(id);
  },

  focusWindow: (id) => {
    zCounter += 1;
    const z = zCounter;
    set((state) => ({
      windows: state.windows.map((w) => (w.id === id ? { ...w, zIndex: z } : w)),
      focusedId: id,
    }));
  },

  updatePosition: (id, position) => {
    set((state) => ({
      windows: state.windows.map((w) => (w.id === id ? { ...w, position } : w)),
    }));
  },

  updateSize: (id, size) => {
    const clamped: Size = {
      width: Math.max(size.width, MIN_WINDOW_SIZE.width),
      height: Math.max(size.height, MIN_WINDOW_SIZE.height),
    };
    set((state) => ({
      windows: state.windows.map((w) => (w.id === id ? { ...w, size: clamped } : w)),
    }));
  },

  isAppOpen: (appId) => get().windows.some((w) => w.appId === appId),
  getWindow: (id) => get().windows.find((w) => w.id === id),
}));