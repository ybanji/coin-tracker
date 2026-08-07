import { Flame } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { SkeletonText } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/feedback/ErrorState";
import { EmptyState } from "@/components/feedback/EmptyState";
import { CoinIcon } from "@/components/common/CoinIcon";
import { useTrendingCoins } from "@/features/dashboard/hooks/useTrendingCoins";
import { usePreferencesStore } from "@/store/preferencesStore";
import { formatPrice } from "@/utils/format";

export function TrendingCoins() {
  const { data, isPending, isError, error, refetch } = useTrendingCoins();
  const currency = usePreferencesStore((state) => state.currency);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trending</CardTitle>
        <Flame className="h-4 w-4 text-warning" aria-hidden="true" />
      </CardHeader>
      <div className="divide-y divide-border-subtle">
        {isPending ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="px-5 py-3">
              <SkeletonText lines={1} />
            </div>
          ))
        ) : isError ? (
          <ErrorState error={error} onRetry={() => refetch()} className="px-5" />
        ) : !data || data.length === 0 ? (
          <EmptyState icon={Flame} title="No trending coins right now" className="px-5" />
        ) : (
          data.map(({ item }) => (
            <Link
              key={item.id}
              to={`/coin/${item.id}`}
              className="flex items-center gap-3 px-5 py-3 transition-colors duration-200 hover:bg-bg-surface-hover"
            >
              <CoinIcon src={item.small} name={item.name} size={24} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-caption font-medium text-text-primary">{item.name}</p>
                <p className="text-caption text-text-muted">{item.symbol.toUpperCase()}</p>
              </div>
              <span className="font-tabular text-caption text-text-secondary">
                {formatPrice(item.data.price, currency)}
              </span>
            </Link>
          ))
        )}
      </div>
    </Card>
  );
}
