import { useQuery } from "@tanstack/react-query";
import { getCoinMarkets } from "@/api/coingecko/endpoints";
import { queryKeys } from "@/api/queryKeys";
import { usePreferencesStore, resolveRefetchInterval } from "@/store/preferencesStore";

/**
 * Fetches full market data for exactly the watched coin IDs — unlike the
 * dashboard's WatchlistPreview (which cross-references the top-100
 * snapshot), this covers any coin regardless of market-cap rank.
 */
export function useWatchlistCoinsQuery(ids: string[]) {
  const currency = usePreferencesStore((state) => state.currency);
  const refreshInterval = usePreferencesStore((state) => state.refreshInterval);

  return useQuery({
    queryKey: queryKeys.markets.byIds(currency, ids),
    queryFn: ({ signal }) =>
      getCoinMarkets({ vsCurrency: currency, ids, perPage: Math.max(ids.length, 1), sparkline: true, signal }),
    enabled: ids.length > 0,
    staleTime: 20_000,
    refetchInterval: resolveRefetchInterval(refreshInterval),
  });
}
