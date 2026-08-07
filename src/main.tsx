import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { useThemeStore, applyThemeToDocument } from "@/store/themeStore";
import { usePreferencesStore, applyCompactModeToDocument } from "@/store/preferencesStore";
import "@/styles/globals.css";

// Apply persisted theme + density immediately (zustand/persist hydrates synchronously
// from localStorage on first read), avoiding a flash of the wrong theme/layout.
applyThemeToDocument(useThemeStore.getState().mode);
applyCompactModeToDocument(usePreferencesStore.getState().compactMode);

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element (#root) not found — check index.html.");
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
