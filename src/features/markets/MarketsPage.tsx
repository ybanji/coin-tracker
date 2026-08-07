import { useCallback, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SearchX, X } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Select } from "@/components/ui/Select";
import { Pagination } from "@/components/ui/Pagination";
import { ErrorState } from "@/components/feedback/ErrorState";
import { EmptyState } from "@/components/feedback/EmptyState";
import { ErrorBoundary } from "@/components/feedback/ErrorBoundary";
import { CoinTable } from "@/components/common/CoinTable";
import { useMarketsListQuery, MARKETS_PAGE_SIZE } from "@/features/markets/hooks/useMarketsListQuery";
import { useMarketsSearchQuery } from "@/features/markets/hooks/useMarketsSearchQuery";
import { SORT_OPTIONS, isSortField } from "@/features/markets/sortOptions";
import { useDebounce } from "@/hooks/useDebounce";
import { usePageTitle } from "@/hooks/usePageTitle";
import type { SortField } from "@/types/coin";

export function MarketsPage() {
  usePageTitle("Markets", "Browse, search, sort, and filter every cryptocurrency by price, volume, and market cap.");

  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(searchParams.get("q") ?? "");
  const debouncedQuery = useDebounce(searchInput, 350);

  const sortParam = searchParams.get("sort");
  const sort: SortField = sortParam && isSortField(sortParam) ? sortParam : "market_cap_desc";
  const page = Math.max(1, Number(searchParams.get("page") ?? "1") || 1);

  const isSearching = debouncedQuery.trim().length > 0;

  const listQuery = useMarketsListQuery(page, sort);
  const searchQuery = useMarketsSearchQuery(debouncedQuery);

  const active = isSearching ? searchQuery : listQuery;
  const coins = useMemo(() => {
    const data = active.data ?? [];
    if (!isSearching) return data;
    // Client-side sort of search results — /coins/markets?ids= doesn't reliably respect `order`.
    return [...data].sort((a, b) => sortCoins(a, b, sort));
  }, [active.data, isSearching, sort]);

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          for (const [key, value] of Object.entries(updates)) {
            if (value === null || value === "") next.delete(key);
            else next.set(key, value);
          }
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  function handleSearchChange(value: string) {
    setSearchInput(value);
    updateParams({ q: value || null, page: null });
  }

  function handleSortChange(value: string) {
    updateParams({ sort: value === "market_cap_desc" ? null : value, page: null });
  }

  function handlePageChange(nextPage: number) {
    updateParams({ page: nextPage > 1 ? String(nextPage) : null });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // We don't get a total count from the API for the un-searched listing, so
  // "has a next page" is inferred from whether this page came back full.
  const hasNextPage = !isSearching && (listQuery.data?.length ?? 0) === MARKETS_PAGE_SIZE;
  const softTotalPages = isSearching ? 1 : hasNextPage ? page + 1 : page;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-h2 text-text-primary">Markets</h1>
        <p className="mt-1 text-caption text-text-muted">
          Browse, search, and sort every cryptocurrency by price, market cap, and volume.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" aria-hidden="true" />
          <input
            type="search"
            value={searchInput}
            onChange={(event) => handleSearchChange(event.target.value)}
            placeholder="Search all coins…"
            aria-label="Search coins"
            className="h-10 w-full rounded-md border border-border bg-bg-elevated pl-9 pr-9 text-body text-text-primary placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
          {searchInput && (
            <button
              type="button"
              onClick={() => handleSearchChange("")}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>

        <Select
          label="Sort by"
          value={sort}
          onChange={(event) => handleSortChange(event.target.value)}
          className="sm:w-64"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </div>

      <ErrorBoundary label="Markets table">
        <Card>
          {active.isError ? (
            <ErrorState error={active.error} onRetry={() => active.refetch()} />
          ) : isSearching && !active.isPending && coins.length === 0 ? (
            <EmptyState
              icon={SearchX}
              title="No coins found"
              description={`No results for "${debouncedQuery}". Try a different name or symbol.`}
            />
          ) : (
            <CoinTable coins={coins} isLoading={active.isPending} />
          )}
        </Card>
      </ErrorBoundary>

      {!isSearching && !active.isError && (
        <Pagination page={page} totalPages={softTotalPages} onPageChange={handlePageChange} />
      )}
    </div>
  );
}

function sortCoins(
  a: { current_price: number; market_cap: number; total_volume: number; name: string },
  b: { current_price: number; market_cap: number; total_volume: number; name: string },
  sort: SortField,
): number {
  switch (sort) {
    case "market_cap_asc":
      return a.market_cap - b.market_cap;
    case "market_cap_desc":
      return b.market_cap - a.market_cap;
    case "volume_asc":
      return a.total_volume - b.total_volume;
    case "volume_desc":
      return b.total_volume - a.total_volume;
    case "price_asc":
      return a.current_price - b.current_price;
    case "price_desc":
      return b.current_price - a.current_price;
    case "id_asc":
      return a.name.localeCompare(b.name);
    case "id_desc":
      return b.name.localeCompare(a.name);
    default:
      return 0;
  }
}
