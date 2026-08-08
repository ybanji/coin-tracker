import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PortfolioHolding, PortfolioHoldingInput } from "@/types/portfolio";

interface PortfolioState {
  holdings: PortfolioHolding[];
  addHolding: (input: PortfolioHoldingInput) => void;
  updateHolding: (id: string, input: PortfolioHoldingInput) => void;
  removeHolding: (id: string) => void;
  clear: () => void;
}

/**
 * User-entered portfolio holdings. Pure client state, persisted to
 * localStorage — this app never sends holdings anywhere. Current market
 * value is computed in the UI layer by joining `coinId` against live
 * TanStack Query data, keeping "what the user owns" and "what it's worth
 * right now" as separate concerns.
 */
export const usePortfolioStore = create<PortfolioState>()(
  persist(
    (_set) => ({
      holdings: [],
      addHolding: (input) =>
        _set((_state) => ({
          holdings: [
            ..._state.holdings,
            { ...input, id: crypto.randomUUID(), createdAt: new Date().toISOString() },
          ],
        })),
      updateHolding: (id, input) =>
        _set((_state) => ({
          holdings: _state.holdings.map((h) => (h.id === id ? { ...h, ...input } : h)),
        })),
      removeHolding: (id) => _set((_state) => ({ holdings: _state.holdings.filter((h) => h.id !== id) })),
      clear: () => _set({ holdings: [] }),
    }),
    { name: "coin-tracker-portfolio" },
  ),
);
