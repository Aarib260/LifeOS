import { create } from "zustand";

export type ClipboardMode = "copy" | "cut";

interface ClipboardState {
  mode: ClipboardMode | null;
  nodeId: string | null;
  sourceParentId: string | null;
  setClipboard: (mode: ClipboardMode, nodeId: string, sourceParentId: string | null) => void;
  clear: () => void;
}

/**
 * Deliberately not persisted (unlike settingsStore) — a clipboard that
 * survives a refresh and silently pastes something from last session
 * would be surprising. Ephemeral, in-memory only.
 */
export const useClipboardStore = create<ClipboardState>((set) => ({
  mode: null,
  nodeId: null,
  sourceParentId: null,
  setClipboard: (mode, nodeId, sourceParentId) => set({ mode, nodeId, sourceParentId }),
  clear: () => set({ mode: null, nodeId: null, sourceParentId: null }),
}));
