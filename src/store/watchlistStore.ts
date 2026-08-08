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
    (_set, get) => ({
      coinIds: [],
      add: (id) => _set((_state) => (_state.coinIds.includes(id) ? _state : { coinIds: [..._state.coinIds, id] })),
      remove: (id) => _set((_state) => ({ coinIds: _state.coinIds.filter((c) => c !== id) })),
      toggle: (id) => (get().has(id) ? get().remove(id) : get().add(id)),
      has: (id) => get().coinIds.includes(id),
    }),
    { name: "coin-tracker-watchlist" },
  ),
);
