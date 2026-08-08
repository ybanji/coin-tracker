import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SupportedCurrency } from "@/types/coin";

/** Auto-refresh cadence for live market data queries, in milliseconds. "off" disables polling entirely. */
export type RefreshInterval = 15_000 | 30_000 | 60_000 | 300_000 | "off";

export const REFRESH_INTERVAL_OPTIONS: { value: RefreshInterval; label: string }[] = [
  { value: 15_000, label: "15 seconds" },
  { value: 30_000, label: "30 seconds" },
  { value: 60_000, label: "1 minute" },
  { value: 300_000, label: "5 minutes" },
  { value: "off", label: "Off" },
];

interface PreferencesState {
  currency: SupportedCurrency;
  refreshInterval: RefreshInterval;
  compactMode: boolean;
  setCurrency: (currency: SupportedCurrency) => void;
  setRefreshInterval: (interval: RefreshInterval) => void;
  setCompactMode: (enabled: boolean) => void;
  reset: () => void;
}

const DEFAULTS = {
  currency: "usd" as SupportedCurrency,
  // Use a value that conforms to the RefreshInterval union (60_000 = 1 minute)
  refreshInterval: 60_000 as RefreshInterval,
  compactMode: false,
};

/** Toggles the `.compact` class on <html>, which globals.css uses to tighten spacing app-wide. */
export function applyCompactModeToDocument(compact: boolean) {
  document.documentElement.classList.toggle("compact", compact);
}

/**
 * Pure client/UI state — display currency, live-refresh cadence, and density.
 * This never touches server data directly; features read it and pass values
 * into their own TanStack Query hooks (e.g. `refetchInterval`), keeping
 * server-state and client-state ownership separate.
 */
export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      ...DEFAULTS,
      setCurrency: (currency) => set({ currency }),
      setRefreshInterval: (refreshInterval) => set({ refreshInterval }),
      setCompactMode: (compactMode) => {
        applyCompactModeToDocument(compactMode);
        set({ compactMode });
      },
      reset: () => {
        applyCompactModeToDocument(DEFAULTS.compactMode);
        set({ ...DEFAULTS });
      },
    }),
    {
      name: "coin-tracker-preferences",
      onRehydrateStorage: () => (_state) => {
        if (_state) applyCompactModeToDocument(_state.compactMode);
      },
    },
  ),
);

/** Resolves the user's refresh interval preference to a TanStack Query `refetchInterval` value. */
export function resolveRefetchInterval(interval: RefreshInterval): number | false {
  return interval === "off" ? false : interval;
}
