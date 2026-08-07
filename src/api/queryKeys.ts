import type { SupportedCurrency } from "@/types/coin";

/**
 * Every query key used in the app is defined here, hierarchically, so
 * invalidation can target broad ("all markets data") or narrow ("this one
 * coin") scopes without every feature having to know the exact key shape.
 */
export const queryKeys = {
  markets: {
    all: ["markets"] as const,
    list: (currency: SupportedCurrency, page: number, order: string) =>
      [...queryKeys.markets.all, "list", currency, page, order] as const,
    paginated: (currency: SupportedCurrency, page: number, perPage: number, order: string) =>
      [...queryKeys.markets.all, "paginated", currency, page, perPage, order] as const,
    byIds: (currency: SupportedCurrency, ids: string[]) =>
      [...queryKeys.markets.all, "byIds", currency, [...ids].sort().join(",")] as const,
  },
  global: {
    all: ["global"] as const,
  },
  trending: {
    all: ["trending"] as const,
  },
  fearGreed: {
    all: ["fear-greed"] as const,
  },
  coin: {
    all: ["coin"] as const,
    detail: (id: string) => [...queryKeys.coin.all, "detail", id] as const,
    chart: (id: string, currency: SupportedCurrency, days: number | "max") =>
      [...queryKeys.coin.all, "chart", id, currency, days] as const,
  },
  search: {
    all: ["search"] as const,
    query: (q: string) => [...queryKeys.search.all, q] as const,
  },
  news: {
    all: ["news"] as const,
  },
};
