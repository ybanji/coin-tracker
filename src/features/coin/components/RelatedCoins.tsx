import { Link } from "react-router-dom";
import { Layers } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { SkeletonText } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/feedback/EmptyState";
import { CoinIcon } from "@/components/common/CoinIcon";
import { PriceChange } from "@/components/common/PriceChange";
import { useMarketsSnapshot } from "@/features/dashboard/hooks/useMarketsSnapshot";
import { usePreferencesStore } from "@/store/preferencesStore";
import { formatPrice } from "@/utils/format";

const RELATED_COUNT = 5;

/** "Related" = nearest neighbors by market-cap rank in the already-cached top-100 snapshot — zero extra requests. */
export function RelatedCoins({ coinId, rank }: { coinId: string; rank: number | null }) {
  const { data, isPending } = useMarketsSnapshot();
  const currency = usePreferencesStore((state) => state.currency);

  const related =
    data && rank
      ? [...data]
          .filter((c) => c.id !== coinId)
          .sort((a, b) => Math.abs((a.market_cap_rank ?? 0) - rank) - Math.abs((b.market_cap_rank ?? 0) - rank))
          .slice(0, RELATED_COUNT)
      : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Related Coins</CardTitle>
        <Layers className="h-4 w-4 text-text-muted" aria-hidden="true" />
      </CardHeader>
      <div className="divide-y divide-border-subtle">
        {isPending ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="px-5 py-3">
              <SkeletonText lines={1} />
            </div>
          ))
        ) : related.length === 0 ? (
          <EmptyState icon={Layers} title="No related coins found" className="px-5" />
        ) : (
          related.map((coin) => (
            <Link
              key={coin.id}
              to={`/coin/${coin.id}`}
              className="flex items-center gap-3 px-5 py-3 transition-colors duration-200 hover:bg-bg-surface-hover"
            >
              <CoinIcon src={coin.image} name={coin.name} size={24} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-caption font-medium text-text-primary">{coin.name}</p>
                <p className="text-caption text-text-muted">{coin.symbol.toUpperCase()}</p>
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
