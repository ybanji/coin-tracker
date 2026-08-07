import { useQuery } from "@tanstack/react-query";
import { getCoinMarkets, searchCoins } from "@/api/coingecko/endpoints";
import { queryKeys } from "@/api/queryKeys";
import { usePreferencesStore } from "@/store/preferencesStore";

const MAX_SEARCH_RESULTS = 50;

/**
 * CoinGecko's /coins/markets has no free-text `search` param — it only
 * covers the full coin universe via /search, which returns lightweight
 * matches (no price data). So a search here is two hops: resolve matching
 * coin IDs via /search, then fetch full market data for exactly those IDs.
 * Both are cached independently, so retyping a previously-seen query is instant.
 */
export function useMarketsSearchQuery(query: string) {
  const currency = usePreferencesStore((state) => state.currency);
  const trimmed = query.trim();

  const searchResult = useQuery({
    queryKey: queryKeys.search.query(trimmed.toLowerCase()),
    queryFn: ({ signal }) => searchCoins(trimmed, signal),
    enabled: trimmed.length > 0,
    staleTime: 60_000,
  });

  const ids = (searchResult.data?.coins ?? []).slice(0, MAX_SEARCH_RESULTS).map((c) => c.id);

  const marketsResult = useQuery({
    queryKey: queryKeys.markets.byIds(currency, ids),
    queryFn: ({ signal }) =>
      getCoinMarkets({ vsCurrency: currency, ids, perPage: ids.length, sparkline: true, signal }),
    enabled: ids.length > 0,
    staleTime: 30_000,
  });

  return {
    data: ids.length > 0 ? marketsResult.data : [],
    isPending: trimmed.length > 0 && (searchResult.isPending || (ids.length > 0 && marketsResult.isPending)),
    isError: searchResult.isError || marketsResult.isError,
    error: searchResult.error ?? marketsResult.error,
    hasNoMatches: trimmed.length > 0 && searchResult.isSuccess && ids.length === 0,
    refetch: () => {
      void searchResult.refetch();
      void marketsResult.refetch();
    },
  };
}
