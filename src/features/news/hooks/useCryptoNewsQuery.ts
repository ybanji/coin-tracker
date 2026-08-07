import { useQuery } from "@tanstack/react-query";
import { getCryptoNews } from "@/api/news";
import { queryKeys } from "@/api/queryKeys";

export function useCryptoNewsQuery() {
  return useQuery({
    queryKey: queryKeys.news.all,
    queryFn: ({ signal }) => getCryptoNews(signal),
    staleTime: 5 * 60_000,
    refetchInterval: 5 * 60_000,
  });
}
