import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SearchHistoryState {
  recentQueries: string[];
  addQuery: (query: string) => void;
  clear: () => void;
}

const MAX_RECENT = 6;

export const useSearchHistoryStore = create<SearchHistoryState>()(
  persist(
    (set) => ({
      recentQueries: [],
      addQuery: (query) => {
        const trimmed = query.trim();
        if (!trimmed) return;
        set((s) => ({
          recentQueries: [trimmed, ...s.recentQueries.filter((q) => q !== trimmed)].slice(
            0,
            MAX_RECENT
          ),
        }));
      },
      clear: () => set({ recentQueries: [] }),
    }),
    { name: "lifeos-search-history" }
  )
);
