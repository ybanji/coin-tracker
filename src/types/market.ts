/** Shape of GET /global — headline market-wide statistics. */
export interface GlobalMarketData {
  active_cryptocurrencies: number;
  markets: number;
  total_market_cap: Record<string, number>;
  total_volume: Record<string, number>;
  market_cap_percentage: Record<string, number>;
  market_cap_change_percentage_24h_usd: number;
  updated_at: number;
}

export interface GlobalMarketResponse {
  data: GlobalMarketData;
}

/** One entry of GET /search/trending. */
export interface TrendingCoinItem {
  item: {
    id: string;
    coin_id: number;
    name: string;
    symbol: string;
    market_cap_rank: number | null;
    thumb: string;
    small: string;
    large: string;
    score: number;
    data: {
      price: number;
      price_change_percentage_24h?: Record<string, number>;
      market_cap: string;
      total_volume: string;
    };
  };
}

export interface TrendingResponse {
  coins: TrendingCoinItem[];
}

/** Fear & Greed Index — sourced from alternative.me (CoinGecko has no equivalent endpoint). */
export interface FearGreedResponse {
  data: Array<{
    value: string;
    value_classification: string;
    timestamp: string;
  }>;
}
