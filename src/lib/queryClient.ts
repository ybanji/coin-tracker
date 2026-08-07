import { QueryClient } from "@tanstack/react-query";
import { ApiError } from "@/api/apiError";

/**
 * Defaults tuned for a live market-data app:
 *  - staleTime keeps data fresh-enough without refetching on every render;
 *    individual hooks override this per endpoint (e.g. global stats refresh
 *    faster than a coin's static metadata).
 *  - retry defers to our own client-level retry in coingeckoFetch for
 *    network/5xx/429 — but still guards against errors that slip through
 *    (e.g. a JSON parse failure) with one extra attempt, and never retries
 *    4xx errors that indicate a genuine bad request.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 5 * 60_000,
      refetchOnWindowFocus: true,
      retry: (failureCount, error) => {
        if (error instanceof ApiError && (error.kind === "not_found" || error.kind === "unknown")) {
          return false;
        }
        return failureCount < 1;
      },
    },
  },
});
