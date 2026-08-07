import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useIsFetching, useQueryClient } from "@tanstack/react-query";
import { LineChart, Plus, RefreshCw, Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useGlobalMarketData } from "@/features/dashboard/hooks/useGlobalMarketData";
import { formatRelativeTime } from "@/utils/html";
import { toast } from "@/store/toastStore";
import { cn } from "@/lib/utils";

/** Forces a re-render every `intervalMs` so a relative-time label ("2m ago") stays live without a full data refetch. */
function useTick(intervalMs: number) {
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setTick((t) => t + 1), intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs]);
}

export function QuickActions() {
  const queryClient = useQueryClient();
  const isFetching = useIsFetching() > 0;
  const { dataUpdatedAt } = useGlobalMarketData();
  useTick(15_000);

  function handleRefresh() {
    void queryClient.invalidateQueries();
    toast.info("Refreshing", "Fetching the latest market data…");
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <p className="text-caption text-text-muted">
        {dataUpdatedAt ? `Last updated ${formatRelativeTime(Math.floor(dataUpdatedAt / 1000))}` : "Loading…"}
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <Link to="/markets">
          <Button variant="outline" size="sm">
            <LineChart className="h-3.5 w-3.5" aria-hidden="true" />
            Browse Markets
          </Button>
        </Link>
        <Link to="/watchlist">
          <Button variant="outline" size="sm">
            <Star className="h-3.5 w-3.5" aria-hidden="true" />
            Watchlist
          </Button>
        </Link>
        <Link to="/portfolio">
          <Button variant="outline" size="sm">
            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
            Add Holding
          </Button>
        </Link>
        <Button variant="ghost" size="sm" onClick={handleRefresh} aria-label="Refresh all data">
          <RefreshCw className={cn("h-3.5 w-3.5", isFetching && "animate-spin")} aria-hidden="true" />
          Refresh
        </Button>
      </div>
    </div>
  );
}
