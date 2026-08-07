import { useQuery } from "@tanstack/react-query";
import { getCoinDetail } from "@/api/coingecko/endpoints";
import { queryKeys } from "@/api/queryKeys";

export function useCoinDetailQuery(id: string) {
  return useQuery({
    queryKey: queryKeys.coin.detail(id),
    queryFn: ({ signal }) => getCoinDetail({ id, signal }),
    staleTime: 30_000,
    refetchInterval: 30_000,
    enabled: id.length > 0,
  });
}
