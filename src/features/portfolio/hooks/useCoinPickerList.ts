import { useQuery } from "@tanstack/react-query";
import { getCoinMarkets } from "@/api/coingecko/endpoints";
import { queryKeys } from "@/api/queryKeys";
import { usePreferencesStore } from "@/store/preferencesStore";

const PICKER_SIZE = 250;

/** Broader-than-dashboard coin list (top 250) used to populate the "which coin?" picker in the portfolio form. */
export function useCoinPickerList() {
  const currency = usePreferencesStore((state) => state.currency);

  return useQuery({
    queryKey: queryKeys.markets.paginated(currency, 1, PICKER_SIZE, "market_cap_desc"),
    queryFn: ({ signal }) =>
      getCoinMarkets({ vsCurrency: currency, page: 1, perPage: PICKER_SIZE, sparkline: false, signal }),
    staleTime: 5 * 60_000,
  });
}
