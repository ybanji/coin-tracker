import { useQuery } from "@tanstack/react-query";
import { getGlobalMarketData } from "@/api/coingecko/endpoints";
import { queryKeys } from "@/api/queryKeys";

/** Refetches every 60s — headline stats move slowly enough that faster polling would just burn rate limit. */
export function useGlobalMarketData() {
  return useQuery({
    queryKey: queryKeys.global.all,
    queryFn: ({ signal }) => getGlobalMarketData(signal),
    staleTime: 60_000,
    refetchInterval: 60_000,
  });
}
