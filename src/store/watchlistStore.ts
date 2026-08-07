import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WatchlistState {
  coinIds: string[];
  add: (id: string) => void;
  remove: (id: string) => void;
  toggle: (id: string) => void;
  has: (id: string) => boolean;
}

export const useWatchlistStore = create<WatchlistState>()(
  persist(
    (set, get) => ({
      coinIds: [],
      add: (id) => set((state) => (state.coinIds.includes(id) ? state : { coinIds: [...state.coinIds, id] })),
      remove: (id) => set((state) => ({ coinIds: state.coinIds.filter((c) => c !== id) })),
      toggle: (id) => (get().has(id) ? get().remove(id) : get().add(id)),
      has: (id) => get().coinIds.includes(id),
    }),
    { name: "coin-tracker-watchlist" },
  ),
);
