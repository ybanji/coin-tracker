import { ApiError } from "../apiError";

const API_TIER = import.meta.env.VITE_COINGECKO_API_TIER === "pro" ? "pro" : "demo";
const API_KEY = import.meta.env.VITE_COINGECKO_API_KEY;

const BASE_URL =
  API_TIER === "pro" ? "https://pro-api.coingecko.com/api/v3" : "https://api.coingecko.com/api/v3";

const API_KEY_HEADER = API_TIER === "pro" ? "x-cg-pro-api-key" : "x-cg-demo-api-key";

const MAX_RETRIES = 3;
const BASE_RETRY_DELAY_MS = 500;
const REQUEST_TIMEOUT_MS = 15_000;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Full jitter exponential backoff — avoids every failed client retrying in lockstep. */
function getBackoffDelay(attempt: number, retryAfterMs?: number): number {
  if (retryAfterMs) return retryAfterMs;
  const exponential = BASE_RETRY_DELAY_MS * 2 ** attempt;
  return Math.random() * exponential;
}

export interface RequestOptions {
  params?: Record<string, string | number | boolean | undefined>;
  signal?: AbortSignal;
}

function buildUrl(path: string, params?: RequestOptions["params"]): string {
  const url = new URL(`${BASE_URL}${path}`);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) url.searchParams.set(key, String(value));
    }
  }
  return url.toString();
}

/**
 * Fetch wrapper with:
 *  - automatic retry with exponential backoff + jitter (network errors, 429, 5xx)
 *  - request timeout via AbortController
 *  - normalized ApiError on failure
 *
 * Deliberately does NOT implement its own response cache or in-flight
 * de-duplication: TanStack Query already de-duplicates identical concurrent
 * queries by queryKey and owns response caching. Duplicating that here
 * would be two sources of truth for the same cache.
 */
export async function coingeckoFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const url = buildUrl(path, options.params);

  let lastError: ApiError | undefined;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    const timeoutController = new AbortController();
    const timeoutId = setTimeout(() => timeoutController.abort(), REQUEST_TIMEOUT_MS);

    // Combine the caller's abort signal (e.g. React Query unmount) with our timeout.
    const onCallerAbort = () => timeoutController.abort();
    options.signal?.addEventListener("abort", onCallerAbort);

    try {
      const response = await fetch(url, {
        signal: timeoutController.signal,
        headers: {
          Accept: "application/json",
          ...(API_KEY ? { [API_KEY_HEADER]: API_KEY } : {}),
        },
      });

      if (!response.ok) {
        const apiError = ApiError.fromResponse(response);
        const isRetryable = apiError.kind === "rate_limit" || apiError.kind === "server";
        if (isRetryable && attempt < MAX_RETRIES) {
          lastError = apiError;
          await sleep(getBackoffDelay(attempt, apiError.retryAfterMs));
          continue;
        }
        throw apiError;
      }

      return (await response.json()) as T;
    } catch (error) {
      if (error instanceof ApiError) {
        lastError = error;
        if (attempt >= MAX_RETRIES) throw error;
        continue;
      }
      // Caller intentionally cancelled (not a real failure) — propagate as-is.
      if (options.signal?.aborted) throw error;

      const networkError = new ApiError(
        error instanceof Error ? error.message : "Network request failed.",
        "network",
      );
      lastError = networkError;
      if (attempt >= MAX_RETRIES) throw networkError;
      await sleep(getBackoffDelay(attempt));
    } finally {
      clearTimeout(timeoutId);
      options.signal?.removeEventListener("abort", onCallerAbort);
    }
  }

  // Unreachable in practice — the loop always returns or throws — but keeps TS satisfied.
  throw lastError ?? new ApiError("Request failed.", "unknown");
}
