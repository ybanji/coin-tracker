import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { SkeletonText } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/feedback/EmptyState";
import { ErrorState } from "@/components/feedback/ErrorState";
import { CoinIcon } from "@/components/common/CoinIcon";
import { PriceChange } from "@/components/common/PriceChange";
import { useMarketsSnapshot } from "@/features/dashboard/hooks/useMarketsSnapshot";
import { useWatchlistStore } from "@/store/watchlistStore";
import { usePreferencesStore } from "@/store/preferencesStore";
import { formatPrice } from "@/utils/format";

/**
 * Cross-references watched coin IDs against the top-100 snapshot rather than
 * fetching them individually — keeps this preview to zero extra requests.
 * A coin outside the top 100 simply won't render here; the full Watchlist
 * page (a later phase) will fetch watched coins directly by ID instead.
 */
export function WatchlistPreview() {
  const coinIds = useWatchlistStore((state) => state.coinIds);
  const { data, isPending, isError, error, refetch } = useMarketsSnapshot();
  const currency = usePreferencesStore((state) => state.currency);

  const watchedCoins = data?.filter((coin) => coinIds.includes(coin.id)).slice(0, 5) ?? [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Watchlist</CardTitle>
        <Star className="h-4 w-4 text-warning" aria-hidden="true" />
      </CardHeader>
      <div className="divide-y divide-border-subtle">
        {coinIds.length === 0 ? (
          <EmptyState
            icon={Star}
            title="Your watchlist is empty"
            description="Star coins from Markets or a coin's page to track them here."
            className="px-5"
            action={
              <Link
                to="/watchlist"
                className="inline-flex h-8 items-center justify-center rounded-md border border-border px-3 text-caption font-medium text-text-primary transition-colors duration-200 hover:bg-bg-surface-hover"
              >
                Browse coins
              </Link>
            }
          />
        ) : isPending ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="px-5 py-3">
              <SkeletonText lines={1} />
            </div>
          ))
        ) : isError ? (
          <ErrorState error={error} onRetry={() => refetch()} className="px-5" />
        ) : (
          watchedCoins.map((coin) => (
            <Link
              key={coin.id}
              to={`/coin/${coin.id}`}
              className="flex items-center gap-3 px-5 py-3 transition-colors duration-200 hover:bg-bg-surface-hover"
            >
              <CoinIcon src={coin.image} name={coin.name} size={24} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-caption font-medium text-text-primary">{coin.name}</p>
              </div>
              <div className="flex flex-col items-end gap-0.5">
                <span className="font-tabular text-caption text-text-secondary">
                  {formatPrice(coin.current_price, currency)}
                </span>
                <PriceChange value={coin.price_change_percentage_24h} showIcon={false} />
              </div>
            </Link>
          ))
        )}
      </div>
    </Card>
  );
}
