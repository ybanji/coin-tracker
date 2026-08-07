export type ChartTimeframe = "24h" | "7d" | "30d" | "90d" | "1y";

export const CHART_TIMEFRAMES: { value: ChartTimeframe; label: string; days: number }[] = [
  { value: "24h", label: "24H", days: 1 },
  { value: "7d", label: "7D", days: 7 },
  { value: "30d", label: "30D", days: 30 },
  { value: "90d", label: "90D", days: 90 },
  { value: "1y", label: "1Y", days: 365 },
];

export function isChartTimeframe(value: string): value is ChartTimeframe {
  return CHART_TIMEFRAMES.some((t) => t.value === value);
}
