import { ErrorBoundary } from "@/components/feedback/ErrorBoundary";
import { QuickActions } from "@/features/dashboard/components/QuickActions";
import { GlobalStatsBar } from "@/features/dashboard/components/GlobalStatsBar";
import { QuickSearch } from "@/features/dashboard/components/QuickSearch";
import { FearGreedGauge } from "@/features/dashboard/components/FearGreedGauge";
import { TrendingCoins } from "@/features/dashboard/components/TrendingCoins";
import { TopMovers } from "@/features/dashboard/components/TopMovers";
import { MarketHeatmap } from "@/features/dashboard/components/MarketHeatmap";
import { WatchlistPreview } from "@/features/dashboard/components/WatchlistPreview";

export function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <ErrorBoundary label="Quick actions">
        <QuickActions />
      </ErrorBoundary>

      <ErrorBoundary label="Quick search">
        <QuickSearch />
      </ErrorBoundary>

      <ErrorBoundary label="Market overview">
        <GlobalStatsBar />
      </ErrorBoundary>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ErrorBoundary label="Market heatmap">
            <MarketHeatmap />
          </ErrorBoundary>
        </div>
        <ErrorBoundary label="Fear and Greed Index">
          <FearGreedGauge />
        </ErrorBoundary>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <ErrorBoundary label="Trending coins">
          <TrendingCoins />
        </ErrorBoundary>
        <ErrorBoundary label="Top movers">
          <TopMovers />
        </ErrorBoundary>
        <ErrorBoundary label="Watchlist preview">
          <WatchlistPreview />
        </ErrorBoundary>
      </div>
    </div>
  );
}
