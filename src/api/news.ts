import { ApiError } from "./apiError";
import type { NewsArticle, NewsResponse } from "@/types/news";

/**
 * CoinGecko's free tier has no news endpoint, so this hits CryptoCompare's
 * public news feed directly (no API key required for this endpoint), the
 * same pattern as api/fearGreed.ts — kept in its own module so each
 * secondary data provider stays independently swappable.
 */
export async function getCryptoNews(signal?: AbortSignal): Promise<NewsArticle[]> {
  const response = await fetch("https://min-api.cryptocompare.com/data/v2/news/?lang=EN", { signal });
  if (!response.ok) {
    throw new ApiError("Failed to load news.", "unknown", response.status);
  }
  const json: NewsResponse = await response.json();
  return json.Data.map((article) => ({
    id: article.id,
    title: article.title,
    body: article.body,
    url: article.url,
    source: article.source,
    imageUrl: article.imageurl,
    publishedAt: article.published_on,
    tags: article.tags,
    categories: article.categories,
  }));
}
