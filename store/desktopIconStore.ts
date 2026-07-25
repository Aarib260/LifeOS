import { create } from "zustand";

export interface IconGridPosition {
  col: number;
  row: number;
}

interface DesktopIconState {
  positions: Record<string, IconGridPosition>;
  /** Assigns a position only if this id doesn't already have one. */
  ensurePosition: (id: string, fallback: IconGridPosition) => void;
  /** Moves an icon to a cell, swapping with whatever already occupies it. */
  moveIcon: (id: string, target: IconGridPosition) => void;
  removePosition: (id: string) => void;
}

/**
 * Icon grid positions only — not persisted yet. Kept in its own store
 * (rather than component state) so the upcoming State Persistence phase
 * can wrap this with zustand's `persist` middleware without changing how
 * anything reads from it.
 */
export const useDesktopIconStore = create<DesktopIconState>((set, get) => ({
  positions: {},

  ensurePosition: (id, fallback) => {
    if (get().positions[id]) return;
    set((s) => ({ positions: { ...s.positions, [id]: fallback } }));
  },

  moveIcon: (id, target) => {
    set((s) => {
      const current = s.positions[id];
      if (current && current.col === target.col && current.row === target.row) return s;

      const occupantEntry = Object.entries(s.positions).find(
        ([otherId, pos]) => otherId !== id && pos.col === target.col && pos.row === target.row
      );

      const next = { ...s.positions, [id]: target };
      if (occupantEntry && current) {
        next[occupantEntry[0]] = current;
      }
      return { positions: next };
    });
  },

  removePosition: (id) => {
    set((s) => {
      const next = { ...s.positions };
      delete next[id];
      return { positions: next };
    });
  },
}));
