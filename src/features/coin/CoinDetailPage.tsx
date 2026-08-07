import { useParams } from "react-router-dom";
import { Card } from "@/components/ui/Card";
import { Skeleton, SkeletonText } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/feedback/ErrorState";
import { ErrorBoundary } from "@/components/feedback/ErrorBoundary";
import { useCoinDetailQuery } from "@/features/coin/hooks/useCoinDetailQuery";
import { CoinHero } from "@/features/coin/components/CoinHero";
import { CoinChart } from "@/features/coin/components/CoinChart";
import { CoinStats } from "@/features/coin/components/CoinStats";
import { CoinDescription } from "@/features/coin/components/CoinDescription";
import { CoinLinks } from "@/features/coin/components/CoinLinks";
import { PriceConverter } from "@/features/coin/components/PriceConverter";
import { RelatedCoins } from "@/features/coin/components/RelatedCoins";
import { usePageTitle } from "@/hooks/usePageTitle";
import { usePreferencesStore } from "@/store/preferencesStore";

export function CoinDetailPage() {
  const { id } = useParams<{ id: string }>();
  const coinId = id ?? "";
  const currency = usePreferencesStore((state) => state.currency);
  const { data: coin, isPending, isError, error, refetch } = useCoinDetailQuery(coinId);

  usePageTitle(
    coin ? `${coin.name} (${coin.symbol.toUpperCase()}) Price` : "Coin Details",
    coin ? `Live price, charts, and statistics for ${coin.name}.` : undefined,
  );

  if (isError) {
    return (
      <Card>
        <ErrorState error={error} onRetry={() => refetch()} />
      </Card>
    );
  }

  if (isPending || !coin) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-14 w-14 shrink-0 rounded-full" />
          <SkeletonText lines={2} className="w-48" />
        </div>
        <Skeleton className="h-72 w-full" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Skeleton className="h-64 w-full lg:col-span-2" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <ErrorBoundary label="Coin overview">
        <CoinHero coin={coin} />
      </ErrorBoundary>

      <ErrorBoundary label="Price chart">
        <CoinChart coinId={coin.id} />
      </ErrorBoundary>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <ErrorBoundary label="Statistics">
            <CoinStats coin={coin} />
          </ErrorBoundary>
          <ErrorBoundary label="Description">
            <CoinDescription html={coin.description.en} coinName={coin.name} />
          </ErrorBoundary>
        </div>

        <div className="flex flex-col gap-6">
          <ErrorBoundary label="Price converter">
            <PriceConverter coinPrice={coin.market_data.current_price[currency]} coinSymbol={coin.symbol} />
          </ErrorBoundary>
          <ErrorBoundary label="Official links">
            <CoinLinks coin={coin} />
          </ErrorBoundary>
          <ErrorBoundary label="Related coins">
            <RelatedCoins coinId={coin.id} rank={coin.market_cap_rank} />
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
}
