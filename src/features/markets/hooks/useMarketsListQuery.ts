import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getCoinMarkets } from "@/api/coingecko/endpoints";
import { queryKeys } from "@/api/queryKeys";
import { usePreferencesStore, resolveRefetchInterval } from "@/store/preferencesStore";
import type { SortField } from "@/types/coin";

export const MARKETS_PAGE_SIZE = 50;

/**
 * The paginated, sortable Markets listing — distinct from `useMarketsSnapshot`
 * (dashboard's fixed top-100 snapshot). Uses `keepPreviousData` so paging
 * doesn't flash a loading state, and respects the user's configured refresh
 * interval from Settings rather than a hardcoded poll rate.
 */
export function useMarketsListQuery(page: number, order: SortField) {
  const currency = usePreferencesStore((state) => state.currency);
  const refreshInterval = usePreferencesStore((state) => state.refreshInterval);

  return useQuery({
    queryKey: queryKeys.markets.paginated(currency, page, MARKETS_PAGE_SIZE, order),
    queryFn: ({ signal }) =>
      getCoinMarkets({
        vsCurrency: currency,
        page,
        perPage: MARKETS_PAGE_SIZE,
        order,
        sparkline: true,
        signal,
      }),
    staleTime: 20_000,
    refetchInterval: resolveRefetchInterval(refreshInterval),
    placeholderData: keepPreviousData,
  });
}
