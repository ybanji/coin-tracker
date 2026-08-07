import { ApiError } from "./apiError";
import type { FearGreedResponse } from "@/types/market";

/**
 * CoinGecko has no Fear & Greed endpoint, so this hits alternative.me's
 * free public API directly. Kept in its own module (rather than folded
 * into api/coingecko) so the two providers stay swappable independently.
 */
export async function getFearGreedIndex(signal?: AbortSignal): Promise<FearGreedResponse> {
  const response = await fetch("https://api.alternative.me/fng/?limit=1", { signal });
  if (!response.ok) {
    throw new ApiError("Failed to load the Fear & Greed Index.", "unknown", response.status);
  }
  return response.json();
}
