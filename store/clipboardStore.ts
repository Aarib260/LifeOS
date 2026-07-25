import { create } from "zustand";

export type ClipboardMode = "copy" | "cut";

interface ClipboardState {
  mode: ClipboardMode | null;
  nodeIds: string[];
  sourceParentId: string | null;
  setClipboard: (mode: ClipboardMode, nodeIds: string[], sourceParentId: string | null) => void;
  clear: () => void;
}

/**
 * Deliberately not persisted (unlike settingsStore) — a clipboard that
 * survives a refresh and silently pastes something from last session
 * would be surprising. Ephemeral, in-memory only.
 *
 * Holds nodeIds (plural) so multi-select copy/cut on Desktop or in
 * Explorer carries every selected item, not just one.
 */
export const useClipboardStore = create<ClipboardState>((set) => ({
  mode: null,
  nodeIds: [],
  sourceParentId: null,
  setClipboard: (mode, nodeIds, sourceParentId) => set({ mode, nodeIds, sourceParentId }),
  clear: () => set({ mode: null, nodeIds: [], sourceParentId: null }),
}));
