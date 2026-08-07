import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface RecentSearchEntry {
  id: string;
  name: string;
  symbol: string;
  thumb: string;
}

const MAX_RECENT = 5;

interface RecentSearchState {
  entries: RecentSearchEntry[];
  addEntry: (entry: RecentSearchEntry) => void;
  clear: () => void;
}

export const useRecentSearchesStore = create<RecentSearchState>()(
  persist(
    (set) => ({
      entries: [],
      addEntry: (entry) =>
        set((state) => ({
          entries: [entry, ...state.entries.filter((e) => e.id !== entry.id)].slice(0, MAX_RECENT),
        })),
      clear: () => set({ entries: [] }),
    }),
    { name: "coin-tracker-recent-searches" },
  ),
);
