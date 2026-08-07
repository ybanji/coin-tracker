import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ThemeMode = "dark" | "light" | "system";

interface ThemeState {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
}

function resolveSystemPreference(): "dark" | "light" {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/** Applies the resolved theme class to <html>, which every CSS token cascades from. */
export function applyThemeToDocument(mode: ThemeMode) {
  const resolved = mode === "system" ? resolveSystemPreference() : mode;
  const root = document.documentElement;
  root.classList.remove("dark", "light");
  root.classList.add(resolved);
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: "dark",
      setMode: (mode) => {
        applyThemeToDocument(mode);
        set({ mode });
      },
    }),
    {
      name: "coin-tracker-theme",
      onRehydrateStorage: () => (state) => {
        if (state) applyThemeToDocument(state.mode);
      },
    },
  ),
);
