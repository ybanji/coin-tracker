import { usePreferencesStore } from "@/store/preferencesStore";
import type { SupportedCurrency } from "@/types/coin";
import { cn } from "@/lib/utils";

export const CURRENCY_OPTIONS: { value: SupportedCurrency; label: string }[] = [
  { value: "usd", label: "USD" },
  { value: "eur", label: "EUR" },
  { value: "gbp", label: "GBP" },
  { value: "jpy", label: "JPY" },
  { value: "btc", label: "BTC" },
];

export function CurrencySelect({ className }: { className?: string }) {
  const currency = usePreferencesStore((state) => state.currency);
  const setCurrency = usePreferencesStore((state) => state.setCurrency);

  return (
    <div className="inline-flex items-center">
      <label className="sr-only" htmlFor="currency-select">
        Display currency
      </label>
      <select
        id="currency-select"
        value={currency}
        onChange={(event) => setCurrency(event.target.value as SupportedCurrency)}
        className={cn(
          "h-9 rounded-md border border-border bg-bg-elevated px-2 text-caption font-medium text-text-primary",
          "hover:bg-bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
          className,
        )}
      >
        {CURRENCY_OPTIONS.map((c) => (
          <option key={c.value} value={c.value}>
            {c.label}
          </option>
        ))}
      </select>
    </div>
  );
}
