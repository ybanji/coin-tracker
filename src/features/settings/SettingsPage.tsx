import { useState } from "react";
import { RotateCcw, Monitor, Moon, Sun } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { CURRENCY_OPTIONS } from "@/components/common/CurrencySelect";
import { usePreferencesStore, REFRESH_INTERVAL_OPTIONS, type RefreshInterval } from "@/store/preferencesStore";
import { useThemeStore, type ThemeMode } from "@/store/themeStore";
import { toast } from "@/store/toastStore";
import { usePageTitle } from "@/hooks/usePageTitle";
import { cn } from "@/lib/utils";
import type { SupportedCurrency } from "@/types/coin";

const THEME_OPTIONS: { value: ThemeMode; label: string; icon: typeof Sun }[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

export function SettingsPage() {
  usePageTitle("Settings", "Customize your currency, theme, refresh rate, and display density.");

  const mode = useThemeStore((state) => state.mode);
  const setMode = useThemeStore((state) => state.setMode);
  const currency = usePreferencesStore((state) => state.currency);
  const setCurrency = usePreferencesStore((state) => state.setCurrency);
  const refreshInterval = usePreferencesStore((state) => state.refreshInterval);
  const setRefreshInterval = usePreferencesStore((state) => state.setRefreshInterval);
  const compactMode = usePreferencesStore((state) => state.compactMode);
  const setCompactMode = usePreferencesStore((state) => state.setCompactMode);
  const resetPreferences = usePreferencesStore((state) => state.reset);

  const [resetConfirming, setResetConfirming] = useState(false);

  function handleReset() {
    if (!resetConfirming) {
      setResetConfirming(true);
      return;
    }
    resetPreferences();
    setMode("dark");
    setResetConfirming(false);
    toast.success("Settings reset", "All preferences were restored to their defaults.");
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-h2 text-text-primary">Settings</h1>
        <p className="mt-1 text-caption text-text-muted">
          Preferences are saved to this browser only — nothing is sent anywhere.
        </p>
      </div>

      <Card>
        <CardHeader className="flex-col items-start gap-1">
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Choose how Coin Tracker looks on this device.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <div>
            <p className="mb-2 text-caption font-medium text-text-secondary">Theme</p>
            <div role="radiogroup" aria-label="Theme" className="grid grid-cols-3 gap-2 sm:max-w-md">
              {THEME_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  role="radio"
                  aria-checked={mode === option.value}
                  onClick={() => setMode(option.value)}
                  className={cn(
                    "flex flex-col items-center gap-1.5 rounded-md border px-3 py-3 text-caption font-medium transition-colors duration-200",
                    mode === option.value
                      ? "border-primary bg-primary-muted text-primary"
                      : "border-border text-text-secondary hover:border-text-muted/50 hover:bg-bg-surface-hover",
                  )}
                >
                  <option.icon className="h-4 w-4" aria-hidden="true" />
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 sm:max-w-md">
            <div>
              <span className="block text-caption font-medium text-text-secondary">Compact Mode</span>
              <span className="block text-caption text-text-muted">Tighter spacing to fit more on screen.</span>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={compactMode}
              aria-label="Toggle compact mode"
              onClick={() => setCompactMode(!compactMode)}
              className={cn(
                "relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200",
                compactMode ? "bg-primary" : "bg-bg-elevated border border-border",
              )}
            >
              <span
                className={cn(
                  "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-subtle transition-transform duration-200",
                  compactMode ? "translate-x-[22px]" : "translate-x-0.5",
                )}
              />
            </button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-col items-start gap-1">
          <CardTitle>Data</CardTitle>
          <CardDescription>Control how prices are displayed and refreshed.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 sm:max-w-md">
          <Select
            label="Display Currency"
            value={currency}
            onChange={(event) => setCurrency(event.target.value as SupportedCurrency)}
          >
            {CURRENCY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>

          <Select
            label="Refresh Interval"
            value={String(refreshInterval)}
            onChange={(event) => {
              const raw = event.target.value;
              setRefreshInterval((raw === "off" ? "off" : Number(raw)) as RefreshInterval);
            }}
          >
            {REFRESH_INTERVAL_OPTIONS.map((option) => (
              <option key={String(option.value)} value={String(option.value)}>
                {option.label}
              </option>
            ))}
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-col items-start gap-1">
          <CardTitle>Reset</CardTitle>
          <CardDescription>Restore theme, currency, refresh rate, and density to their defaults.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant={resetConfirming ? "danger" : "outline"}
            onClick={handleReset}
            onBlur={() => setResetConfirming(false)}
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            {resetConfirming ? "Click again to confirm" : "Reset all settings"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
