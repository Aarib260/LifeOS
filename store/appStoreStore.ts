import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AppStoreState {
  /** Catalog app ids the user has "installed" — purely simulated. */
  installedIds: string[];
  /** Catalog app ids with a pending simulated update. */
  updatesAvailable: string[];
  /** The catalog app id currently mid-install-animation, if any. */
  installingId: string | null;

  install: (id: string) => void;
  uninstall: (id: string) => void;
  applyUpdate: (id: string) => void;
}

const INSTALL_ANIMATION_MS = 1100;

/**
 * Pre-seeded with a couple of "already installed" apps (one with a
 * pending update) so the Installed/Updates tabs aren't empty on first
 * open — that seed only applies once, since persist takes over after.
 */
export const useAppStoreStore = create<AppStoreState>()(
  persist(
    (set, get) => ({
      installedIds: ["quicknotes-plus", "weather-now"],
      updatesAvailable: ["quicknotes-plus"],
      installingId: null,

      install: (id) => {
        if (get().installedIds.includes(id) || get().installingId) return;
        set({ installingId: id });
        setTimeout(() => {
          set((s) => ({
            installedIds: [...s.installedIds, id],
            installingId: s.installingId === id ? null : s.installingId,
          }));
        }, INSTALL_ANIMATION_MS);
      },

      uninstall: (id) => {
        set((s) => ({
          installedIds: s.installedIds.filter((i) => i !== id),
          updatesAvailable: s.updatesAvailable.filter((i) => i !== id),
        }));
      },

      applyUpdate: (id) => {
        set((s) => ({ updatesAvailable: s.updatesAvailable.filter((i) => i !== id) }));
      },
    }),
    {
      name: "lifeos-app-store",
      // installingId is a transient animation flag — if the page refreshes
      // mid-"install", we don't want it stuck forever with no timeout left
      // to clear it. Only the actual install/update state is durable.
      partialize: (state) => ({
        installedIds: state.installedIds,
        updatesAvailable: state.updatesAvailable,
      }),
    }
  )
);
