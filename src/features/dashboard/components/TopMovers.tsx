import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { TrendingDown, TrendingUp } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { SkeletonText } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/feedback/ErrorState";
import { EmptyState } from "@/components/feedback/EmptyState";
import { CoinIcon } from "@/components/common/CoinIcon";
import { PriceChange } from "@/components/common/PriceChange";
import { useMarketsSnapshot } from "@/features/dashboard/hooks/useMarketsSnapshot";
import { usePreferencesStore } from "@/store/preferencesStore";
import { formatPrice } from "@/utils/format";
import { cn } from "@/lib/utils";
import type { CoinMarketData } from "@/types/coin";

type MoverTab = "gainers" | "losers";

export function TopMovers() {
  const [tab, setTab] = useState<MoverTab>("gainers");
  const { data, isPending, isError, error, refetch } = useMarketsSnapshot();
  const currency = usePreferencesStore((state) => state.currency);

  const movers = useMemo(() => {
    if (!data) return [];
    const withChange = data.filter(
      (coin): coin is CoinMarketData & { price_change_percentage_24h: number } =>
        coin.price_change_percentage_24h !== null,
    );
    const sorted = [...withChange].sort((a, b) =>
      tab === "gainers"
        ? b.price_change_percentage_24h - a.price_change_percentage_24h
        : a.price_change_percentage_24h - b.price_change_percentage_24h,
    );
    return sorted.slice(0, 5);
  }, [data, tab]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Movers</CardTitle>
        <div role="tablist" aria-label="Movers filter" className="flex gap-1 rounded-md bg-bg-elevated p-0.5">
          <TabButton active={tab === "gainers"} onClick={() => setTab("gainers")} icon={TrendingUp} label="Gainers" />
          <TabButton active={tab === "losers"} onClick={() => setTab("losers")} icon={TrendingDown} label="Losers" />
        </div>
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
        ) : movers.length === 0 ? (
          <EmptyState icon={TrendingUp} title="No market data available" className="px-5" />
        ) : (
          movers.map((coin) => (
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

function TabButton({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof TrendingUp;
  label: string;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        "flex items-center gap-1 rounded-sm px-2 py-1 text-caption font-medium transition-colors duration-200",
        active ? "bg-bg-surface text-text-primary shadow-subtle" : "text-text-muted hover:text-text-secondary",
      )}
    >
      <Icon className="h-3 w-3" aria-hidden="true" />
      {label}
    </button>
  );
}
