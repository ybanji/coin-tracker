/** Shape of one entry from GET /coins/markets — the primary listing payload. */
export interface CoinMarketData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number | null;
  fully_diluted_valuation: number | null;
  total_volume: number;
  high_24h: number | null;
  low_24h: number | null;
  price_change_24h: number | null;
  price_change_percentage_24h: number | null;
  market_cap_change_24h: number | null;
  market_cap_change_percentage_24h: number | null;
  circulating_supply: number;
  total_supply: number | null;
  max_supply: number | null;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  last_updated: string;
  sparkline_in_7d?: { price: number[] };
  price_change_percentage_1h_in_currency?: number | null;
  price_change_percentage_24h_in_currency?: number | null;
  price_change_percentage_7d_in_currency?: number | null;
}

/** Shape of one entry from GET /search — lightweight, used for the global search experience. */
export interface CoinSearchResult {
  id: string;
  name: string;
  symbol: string;
  market_cap_rank: number | null;
  thumb: string;
  large: string;
}

export interface SearchResponse {
  coins: CoinSearchResult[];
}

interface CurrencyStat {
  usd?: number;
  eur?: number;
  gbp?: number;
  jpy?: number;
  btc?: number;
  [key: string]: number | undefined;
}

/** Shape of GET /coins/{id}/market_data — nested inside the full coin detail payload. */
export interface CoinDetailMarketData {
  current_price: CurrencyStat;
  ath: CurrencyStat;
  ath_change_percentage: CurrencyStat;
  ath_date: Record<string, string>;
  atl: CurrencyStat;
  atl_change_percentage: CurrencyStat;
  atl_date: Record<string, string>;
  market_cap: CurrencyStat;
  market_cap_rank: number | null;
  fully_diluted_valuation: CurrencyStat;
  total_volume: CurrencyStat;
  high_24h: CurrencyStat;
  low_24h: CurrencyStat;
  price_change_percentage_24h: number | null;
  price_change_percentage_7d: number | null;
  price_change_percentage_14d: number | null;
  price_change_percentage_30d: number | null;
  price_change_percentage_1y: number | null;
  market_cap_change_percentage_24h: number | null;
  circulating_supply: number | null;
  total_supply: number | null;
  max_supply: number | null;
  roi: { times: number; currency: string; percentage: number } | null;
  last_updated: string;
}

/** Full payload from GET /coins/{id} — the coin detail page's primary data source. */
export interface CoinDetailData {
  id: string;
  symbol: string;
  name: string;
  image: { thumb: string; small: string; large: string };
  description: Record<string, string>;
  links: {
    homepage: string[];
    blockchain_site: string[];
    repos_url: { github: string[] };
    subreddit_url: string | null;
    twitter_screen_name: string | null;
  };
  categories: string[];
  market_cap_rank: number | null;
  market_data: CoinDetailMarketData;
  community_data: {
    twitter_followers: number | null;
    reddit_subscribers: number | null;
  } | null;
  last_updated: string;
}

export type SupportedCurrency = "usd" | "eur" | "gbp" | "jpy" | "btc";

export type SortField =
  | "market_cap_desc"
  | "market_cap_asc"
  | "volume_desc"
  | "volume_asc"
  | "id_asc"
  | "id_desc"
  | "price_desc"
  | "price_asc";

/** A currency-keyed numeric map, e.g. { usd: 64000, eur: 59000 }. CoinGecko returns these for most detail fields. */
export type CurrencyMap = CurrencyStat;
