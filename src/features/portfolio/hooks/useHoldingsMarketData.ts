import { useQuery } from "@tanstack/react-query";
import { getCoinMarkets } from "@/api/coingecko/endpoints";
import { queryKeys } from "@/api/queryKeys";
import { usePreferencesStore, resolveRefetchInterval } from "@/store/preferencesStore";

export function useHoldingsMarketData(coinIds: string[]) {
  const currency = usePreferencesStore((state) => state.currency);
  const refreshInterval = usePreferencesStore((state) => state.refreshInterval);
  const uniqueIds = Array.from(new Set(coinIds));

  return useQuery({
    queryKey: queryKeys.markets.byIds(currency, uniqueIds),
    queryFn: ({ signal }) =>
      getCoinMarkets({
        vsCurrency: currency,
        ids: uniqueIds,
        perPage: Math.max(uniqueIds.length, 1),
        sparkline: false,
        signal,
      }),
    enabled: uniqueIds.length > 0,
    staleTime: 20_000,
    refetchInterval: resolveRefetchInterval(refreshInterval),
  });
}
