import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Star } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { ErrorState } from "@/components/feedback/ErrorState";
import { EmptyState } from "@/components/feedback/EmptyState";
import { ErrorBoundary } from "@/components/feedback/ErrorBoundary";
import { CoinTable } from "@/components/common/CoinTable";
import { useWatchlistStore } from "@/store/watchlistStore";
import { useWatchlistCoinsQuery } from "@/features/watchlist/hooks/useWatchlistCoinsQuery";
import { SORT_OPTIONS } from "@/features/markets/sortOptions";
import { usePageTitle } from "@/hooks/usePageTitle";
import type { SortField } from "@/types/coin";

export function WatchlistPage() {
  usePageTitle("Watchlist", "The coins you're tracking, all in one place.");

  const coinIds = useWatchlistStore((state) => state.coinIds);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortField>("market_cap_desc");

  const { data, isPending, isError, error, refetch } = useWatchlistCoinsQuery(coinIds);

  const filtered = useMemo(() => {
    const list = data ?? [];
    const q = search.trim().toLowerCase();
    const searched = q
      ? list.filter((c) => c.name.toLowerCase().includes(q) || c.symbol.toLowerCase().includes(q))
      : list;
    return [...searched].sort((a, b) => sortByField(a, b, sort));
  }, [data, search, sort]);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-h2 text-text-primary">Watchlist</h1>
        <p className="mt-1 text-caption text-text-muted">
          {coinIds.length === 0
            ? "Star coins from Markets or a coin's page to track them here."
            : `Tracking ${coinIds.length} coin${coinIds.length === 1 ? "" : "s"}.`}
        </p>
      </div>

      {coinIds.length === 0 ? (
        <Card>
          <EmptyState
            icon={Star}
            title="Your watchlist is empty"
            description="Star coins from Markets or any coin's detail page to track them here."
            action={
              <Link to="/markets">
                <Button variant="outline">Browse Markets</Button>
              </Link>
            }
          />
        </Card>
      ) : (
        <>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-xs">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted"
                aria-hidden="true"
              />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search your watchlist…"
                aria-label="Search watchlist"
                className="h-10 w-full rounded-md border border-border bg-bg-elevated pl-9 pr-3 text-body text-text-primary placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              />
            </div>
            <Select
              label="Sort by"
              value={sort}
              onChange={(event) => setSort(event.target.value as SortField)}
              className="sm:w-64"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>

          <ErrorBoundary label="Watchlist table">
            <Card>
              {isError ? (
                <ErrorState error={error} onRetry={() => refetch()} />
              ) : !isPending && filtered.length === 0 ? (
                <EmptyState icon={Search} title="No matches" description={`No watched coins match "${search}".`} />
              ) : (
                <CoinTable coins={filtered} isLoading={isPending} skeletonRows={coinIds.length} />
              )}
            </Card>
          </ErrorBoundary>
        </>
      )}
    </div>
  );
}

function sortByField(
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
