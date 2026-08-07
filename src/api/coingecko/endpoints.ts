import { coingeckoFetch } from "./client";
import type {
  CoinDetailData,
  CoinMarketData,
  SearchResponse,
  SortField,
  SupportedCurrency,
} from "@/types/coin";
import type { GlobalMarketResponse, TrendingResponse } from "@/types/market";

export interface GetCoinMarketsParams {
  vsCurrency: SupportedCurrency;
  page?: number;
  perPage?: number;
  order?: SortField;
  ids?: string[];
  sparkline?: boolean;
  priceChangePercentage?: string;
  signal?: AbortSignal;
}

/** GET /coins/markets — the primary paginated coin listing used by Markets and Dashboard. */
export function getCoinMarkets({
  vsCurrency,
  page = 1,
  perPage = 100,
  order = "market_cap_desc",
  ids,
  sparkline = false,
  priceChangePercentage = "1h,24h,7d",
  signal,
}: GetCoinMarketsParams): Promise<CoinMarketData[]> {
  return coingeckoFetch<CoinMarketData[]>("/coins/markets", {
    signal,
    params: {
      vs_currency: vsCurrency,
      order,
      page,
      per_page: perPage,
      sparkline,
      price_change_percentage: priceChangePercentage,
      ids: ids?.join(","),
    },
  });
}

/** GET /global — headline market cap, volume, and BTC/ETH dominance. */
export function getGlobalMarketData(signal?: AbortSignal): Promise<GlobalMarketResponse> {
  return coingeckoFetch<GlobalMarketResponse>("/global", { signal });
}

/** GET /search/trending — top searched coins in the last 24h. */
export function getTrendingCoins(signal?: AbortSignal): Promise<TrendingResponse> {
  return coingeckoFetch<TrendingResponse>("/search/trending", { signal });
}

export interface GetCoinDetailParams {
  id: string;
  signal?: AbortSignal;
}

/** GET /coins/{id} — full detail payload for a single coin's detail page. */
export function getCoinDetail({ id, signal }: GetCoinDetailParams): Promise<CoinDetailData> {
  return coingeckoFetch<CoinDetailData>("/coins/" + id, {
    signal,
    params: {
      localization: false,
      tickers: false,
      market_data: true,
      community_data: true,
      developer_data: false,
      sparkline: true,
    },
  });
}

/** GET /search — lightweight global coin search by name/symbol (full coin universe, not just top 100). */
export function searchCoins(query: string, signal?: AbortSignal): Promise<SearchResponse> {
  return coingeckoFetch<SearchResponse>("/search", { signal, params: { query } });
}

export interface GetMarketChartParams {
  id: string;
  vsCurrency: SupportedCurrency;
  days: number | "max";
  signal?: AbortSignal;
}

/** GET /coins/{id}/market_chart — historical price series for the coin detail chart. */
export function getMarketChart({ id, vsCurrency, days, signal }: GetMarketChartParams) {
  return coingeckoFetch<{ prices: [number, number][] }>(`/coins/${id}/market_chart`, {
    signal,
    params: { vs_currency: vsCurrency, days },
  });
}
