import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AppId, Position, Size, WindowState } from "@/types";
import {
  WINDOW_Z_BASE,
  WINDOW_CASCADE_OFFSET,
  DEFAULT_WINDOW_SIZE,
  MIN_WINDOW_SIZE,
  TASKBAR_HEIGHT,
} from "@/lib/constants";
import { generateWindowId, getViewportSize } from "@/lib/utils";

interface OpenAppOptions {
  title?: string;
  size?: Size;
  position?: Position;
  minSize?: Size;
  allowMultipleInstances?: boolean;
  /** Passed through to the app component as a `payload` prop, e.g. an initial folder id. */
  payload?: Record<string, unknown>;
}

interface WindowStore {
  windows: WindowState[];
  focusedId: string | null;
  /** Ids of recently opened/focused apps, most recent first — feeds Start Menu "Recent" */
  recentAppIds: AppId[];

  openApp: (appId: AppId, options?: OpenAppOptions) => string;
  closeWindow: (id: string) => void;
  closeAllWindows: () => void;
  minimizeWindow: (id: string) => void;
  restoreWindow: (id: string) => void;
  toggleMaximize: (id: string) => void;
  focusWindow: (id: string) => void;
  updatePosition: (id: string, position: Position) => void;
  updateSize: (id: string, size: Size) => void;
  /** Merges into a window's payload — apps use this to persist their own internal state (e.g. Explorer's current folder, Terminal's cwd/history) across a refresh. */
  updatePayload: (id: string, partial: Record<string, unknown>) => void;

  // Derived-state helpers (kept as functions, not stored, to avoid sync bugs)
  isAppOpen: (appId: AppId) => boolean;
  getWindow: (id: string) => WindowState | undefined;
}

// Module-level, not persisted state — always increases so a newly
// focused/opened window ends up above everything restored from storage.
// Synced to be above any restored window's zIndex in onRehydrateStorage
// below, since this counter itself resets to WINDOW_Z_BASE on every load.
let zCounter = WINDOW_Z_BASE;

export const useWindowStore = create<WindowStore>()(
  persist(
    (set, get) => ({
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

        const { width: viewportW, height: viewportH } = getViewportSize();
        const usableHeight = viewportH - TASKBAR_HEIGHT;

        // Clamp requested size to the viewport (with a margin) so a window
        // sized for desktop (e.g. Calendar at 640px) never opens wider than
        // a mobile screen.
        const requestedSize = options?.size ?? DEFAULT_WINDOW_SIZE;
        const size: Size = {
          width: Math.min(requestedSize.width, viewportW - 24),
          height: Math.min(requestedSize.height, usableHeight - 24),
        };

        const requestedPosition = options?.position ?? { x: 120 + cascade, y: 100 + cascade };
        const position: Position = {
          x: Math.min(requestedPosition.x, Math.max(viewportW - size.width - 12, 12)),
          y: Math.min(requestedPosition.y, Math.max(usableHeight - size.height - 12, 12)),
        };

        zCounter += 1;

        const minSize = options?.minSize ?? MIN_WINDOW_SIZE;

        const newWindow: WindowState = {
          id,
          appId,
          title: options?.title ?? appId,
          position,
          size,
          minSize,
          restoreBounds: null,
          isMinimized: false,
          isMaximized: false,
          zIndex: zCounter,
          openedAt: Date.now(),
          payload: options?.payload,
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

      closeAllWindows: () => {
        set({ windows: [], focusedId: null });
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
        set((state) => ({
          windows: state.windows.map((w) => {
            if (w.id !== id) return w;
            const clamped: Size = {
              width: Math.max(size.width, w.minSize.width),
              height: Math.max(size.height, w.minSize.height),
            };
            return { ...w, size: clamped };
          }),
        }));
      },

      updatePayload: (id, partial) => {
        set((state) => ({
          windows: state.windows.map((w) =>
            w.id === id ? { ...w, payload: { ...w.payload, ...partial } } : w
          ),
        }));
      },

      isAppOpen: (appId) => get().windows.some((w) => w.appId === appId),
      getWindow: (id) => get().windows.find((w) => w.id === id),
    }),
    {
      name: "lifeos-windows",
      // zCounter is a plain module variable (not part of persisted state,
      // since z-index ordering only needs to be internally consistent, not
      // stored) — but it resets to WINDOW_Z_BASE on every page load. Without
      // this, the first window you focus/open after a refresh could get a
      // *lower* zIndex than windows restored from storage and render behind
      // them. Bump it above whatever came back from storage before anything
      // else runs.
      onRehydrateStorage: () => (state) => {
        const restoredMax = state?.windows.reduce((max, w) => Math.max(max, w.zIndex), WINDOW_Z_BASE) ?? WINDOW_Z_BASE;
        zCounter = restoredMax;
      },
    }
  )
);
