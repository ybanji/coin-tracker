/**
 * Formatting helpers. Centralized here so every screen renders financial
 * data identically — a card and a table cell should never disagree about
 * how many decimal places a price gets.
 */

const currencyFormatterCache = new Map<string, Intl.NumberFormat>();

function getCurrencyFormatter(currency: string, maximumFractionDigits: number) {
  const key = `${currency}-${maximumFractionDigits}`;
  let formatter = currencyFormatterCache.get(key);
  if (!formatter) {
    formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
      minimumFractionDigits: 0,
      maximumFractionDigits,
    });
    currencyFormatterCache.set(key, formatter);
  }
  return formatter;
}

/**
 * Formats a price with a decimal precision that adapts to magnitude —
 * sub-$1 assets (e.g. many altcoins) need more decimals to be meaningful,
 * while BTC-scale prices would be noisy with the same precision.
 */
export function formatPrice(value: number | null | undefined, currency = "usd"): string {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";
  const abs = Math.abs(value);
  const maximumFractionDigits = abs === 0 ? 2 : abs < 1 ? 6 : abs < 100 ? 4 : 2;
  return getCurrencyFormatter(currency, maximumFractionDigits).format(value);
}

/** Formats large monetary values (market cap, volume) in compact notation, e.g. $1.24B. */
export function formatCompactCurrency(value: number | null | undefined, currency = "usd"): string {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    notation: "compact",
    maximumFractionDigits: 2,
  });
  return formatter.format(value);
}

/** Formats a plain large number in compact notation, e.g. 21.3M — used for supply figures. */
export function formatCompactNumber(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";
  return new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 2 }).format(
    value,
  );
}

/** Formats a percentage change with a leading sign, e.g. +2.34% / -1.05%. */
export function formatPercent(value: number | null | undefined, fractionDigits = 2): string {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(fractionDigits)}%`;
}

/** Returns the semantic direction of a change value, used to pick success/error styling. */
export function getChangeDirection(value: number | null | undefined): "up" | "down" | "flat" {
  if (value === null || value === undefined || Number.isNaN(value) || value === 0) return "flat";
  return value > 0 ? "up" : "down";
}

export function formatDate(value: string | number | Date, options?: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat("en-US", options ?? { month: "short", day: "numeric" }).format(
    new Date(value),
  );
}
