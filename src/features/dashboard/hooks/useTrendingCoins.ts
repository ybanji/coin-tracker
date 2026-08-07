import { useQuery } from "@tanstack/react-query";
import { getTrendingCoins } from "@/api/coingecko/endpoints";
import { queryKeys } from "@/api/queryKeys";

export function useTrendingCoins() {
  return useQuery({
    queryKey: queryKeys.trending.all,
    queryFn: ({ signal }) => getTrendingCoins(signal),
    staleTime: 2 * 60_000,
    select: (data) => data.coins.slice(0, 7),
  });
}
