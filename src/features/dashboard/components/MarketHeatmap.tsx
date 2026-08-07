import { Link } from "react-router-dom";
import { Grid3x3 } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/feedback/ErrorState";
import { useMarketsSnapshot } from "@/features/dashboard/hooks/useMarketsSnapshot";
import { formatPercent, getChangeDirection } from "@/utils/format";
import { cn } from "@/lib/utils";

const TILE_COUNT = 24;
/** Change % magnitude at which a tile reaches full color saturation. */
const MAX_INTENSITY_CHANGE = 8;

export function MarketHeatmap() {
  const { data, isPending, isError, error, refetch } = useMarketsSnapshot();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Market Heatmap</CardTitle>
        <Grid3x3 className="h-4 w-4 text-text-muted" aria-hidden="true" />
      </CardHeader>
      <div className="px-5 pb-5">
        {isPending ? (
          <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-6 lg:grid-cols-8">
            {Array.from({ length: TILE_COUNT }).map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-sm" />
            ))}
          </div>
        ) : isError ? (
          <ErrorState error={error} onRetry={() => refetch()} />
        ) : (
          <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-6 lg:grid-cols-8">
            {data?.slice(0, TILE_COUNT).map((coin) => {
              const change = coin.price_change_percentage_24h ?? 0;
              const direction = getChangeDirection(change);
              const intensity = Math.min(Math.abs(change) / MAX_INTENSITY_CHANGE, 1);
              const bgVar = direction === "up" ? "--success" : direction === "down" ? "--error" : "--text-muted";

              return (
                <Link
                  key={coin.id}
                  to={`/coin/${coin.id}`}
                  className="group flex aspect-square flex-col items-center justify-center rounded-sm p-1 text-center transition-transform duration-200 hover:scale-105 hover:z-10"
                  style={{ backgroundColor: `hsl(var(${bgVar}) / ${0.12 + intensity * 0.55})` }}
                  title={`${coin.name}: ${formatPercent(change)}`}
                >
                  <span className={cn("truncate text-[10px] font-semibold uppercase text-text-primary")}>
                    {coin.symbol}
                  </span>
                  <span className="font-tabular text-[9px] text-text-secondary">{formatPercent(change, 1)}</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </Card>
  );
}
