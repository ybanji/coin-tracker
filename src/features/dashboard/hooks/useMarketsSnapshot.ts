import { useQuery } from "@tanstack/react-query";
import { getCoinMarkets } from "@/api/coingecko/endpoints";
import { queryKeys } from "@/api/queryKeys";
import { resolveRefetchInterval, usePreferencesStore } from "@/store/preferencesStore";

/**
 * Shared top-100-by-market-cap snapshot. Several dashboard widgets (top
 * movers, heatmap, watchlist preview, quick search) all need "the current
 * top coins" — fetching it once here and letting TanStack Query's cache
 * serve every consumer avoids 4+ duplicate network requests on page load.
 * The paginated, filterable Markets page (a later phase) will use its own
 * hook with page/sort params rather than this fixed snapshot.
 */
export function useMarketsSnapshot() {
  const currency = usePreferencesStore((state) => state.currency);
  const refreshInterval = usePreferencesStore((state) => state.refreshInterval);

  return useQuery({
    queryKey: queryKeys.markets.list(currency, 1, "market_cap_desc"),
    queryFn: ({ signal }) =>
      getCoinMarkets({ vsCurrency: currency, page: 1, perPage: 100, sparkline: true, signal }),
    staleTime: 45_000,
    refetchInterval: resolveRefetchInterval(refreshInterval),
  });
}
