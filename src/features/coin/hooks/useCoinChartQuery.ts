import { useQuery } from "@tanstack/react-query";
import { getMarketChart } from "@/api/coingecko/endpoints";
import { queryKeys } from "@/api/queryKeys";
import { usePreferencesStore } from "@/store/preferencesStore";
import { CHART_TIMEFRAMES, type ChartTimeframe } from "@/features/coin/timeframes";

export function useCoinChartQuery(id: string, timeframe: ChartTimeframe) {
  const currency = usePreferencesStore((state) => state.currency);
  const days = CHART_TIMEFRAMES.find((t) => t.value === timeframe)?.days ?? 7;

  return useQuery({
    queryKey: queryKeys.coin.chart(id, currency, days),
    queryFn: ({ signal }) => getMarketChart({ id, vsCurrency: currency, days, signal }),
    staleTime: 60_000,
    enabled: id.length > 0,
    select: (data) => data.prices.map(([timestamp, price]) => ({ timestamp, price })),
  });
}
