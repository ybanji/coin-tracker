import { useQuery } from "@tanstack/react-query";
import { getFearGreedIndex } from "@/api/fearGreed";
import { queryKeys } from "@/api/queryKeys";

export function useFearGreedIndex() {
  return useQuery({
    queryKey: queryKeys.fearGreed.all,
    queryFn: ({ signal }) => getFearGreedIndex(signal),
    staleTime: 5 * 60_000,
    refetchInterval: 5 * 60_000,
    select: (data) => data.data[0],
  });
}
