import type { ReactNode } from "react";
import { Activity, Bitcoin, Coins, DollarSign, TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { SkeletonText } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/feedback/ErrorState";
import { PriceChange } from "@/components/common/PriceChange";
import { useGlobalMarketData } from "@/features/dashboard/hooks/useGlobalMarketData";
import { usePreferencesStore } from "@/store/preferencesStore";
import { formatCompactCurrency } from "@/utils/format";
import { cn } from "@/lib/utils";

interface StatItemProps {
  icon: LucideIcon;
  label: string;
  value: ReactNode;
  trailing?: ReactNode;
}

function StatItem({ icon: Icon, label, value, trailing }: StatItemProps) {
  return (
    <div className="flex items-center gap-3 px-5 py-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-bg-elevated text-text-secondary">
        <Icon className="h-4 w-4" aria-hidden="true" />
      </div>
      <div className="min-w-0">
        <p className="text-caption text-text-muted">{label}</p>
        <div className="flex items-baseline gap-2">
          <p className="truncate font-tabular text-body font-semibold text-text-primary">{value}</p>
          {trailing}
        </div>
      </div>
    </div>
  );
}

export function GlobalStatsBar() {
  const { data, isPending, isError, error, refetch } = useGlobalMarketData();
  const currency = usePreferencesStore((state) => state.currency);

  if (isError) {
    return (
      <Card>
        <ErrorState error={error} onRetry={() => refetch()} />
      </Card>
    );
  }

  const btcDominance = data?.data.market_cap_percentage.btc;
  const ethDominance = data?.data.market_cap_percentage.eth;
  const marketCap = data ? data.data.total_market_cap[currency] : undefined;
  const volume = data ? data.data.total_volume[currency] : undefined;
  const marketCapChange = data?.data.market_cap_change_percentage_24h_usd;

  return (
    <Card
      className={cn(
        "grid grid-cols-1 divide-y divide-border-subtle sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-3 xl:grid-cols-5",
      )}
    >
      {isPending ? (
        Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="px-5 py-4">
            <SkeletonText lines={2} />
          </div>
        ))
      ) : (
        <>
          <StatItem
            icon={DollarSign}
            label="Market Cap"
            value={formatCompactCurrency(marketCap, currency)}
            trailing={<PriceChange value={marketCapChange} />}
          />
          <StatItem icon={Activity} label="24h Volume" value={formatCompactCurrency(volume, currency)} />
          <StatItem icon={Bitcoin} label="BTC Dominance" value={btcDominance ? `${btcDominance.toFixed(1)}%` : "—"} />
          <StatItem icon={Coins} label="ETH Dominance" value={ethDominance ? `${ethDominance.toFixed(1)}%` : "—"} />
          <StatItem
            icon={TrendingUp}
            label="Active Cryptocurrencies"
            value={data?.data.active_cryptocurrencies.toLocaleString() ?? "—"}
          />
        </>
      )}
    </Card>
  );
}
