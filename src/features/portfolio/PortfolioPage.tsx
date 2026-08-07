import { useMemo, useState } from "react";
import { Plus, Wallet } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/feedback/EmptyState";
import { ErrorState } from "@/components/feedback/ErrorState";
import { ErrorBoundary } from "@/components/feedback/ErrorBoundary";
import { usePortfolioStore } from "@/store/portfolioStore";
import { toast } from "@/store/toastStore";
import { useCoinPickerList } from "@/features/portfolio/hooks/useCoinPickerList";
import { useHoldingsMarketData } from "@/features/portfolio/hooks/useHoldingsMarketData";
import { HoldingFormDialog } from "@/features/portfolio/components/HoldingFormDialog";
import { HoldingsTable, type HoldingRow } from "@/features/portfolio/components/HoldingsTable";
import { PortfolioSummaryCards } from "@/features/portfolio/components/PortfolioSummaryCards";
import { AllocationChart } from "@/features/portfolio/components/AllocationChart";
import { usePageTitle } from "@/hooks/usePageTitle";
import type { PortfolioHolding } from "@/types/portfolio";

export function PortfolioPage() {
  usePageTitle("Portfolio", "Track your holdings, cost basis, and profit or loss in one place.");

  const holdings = usePortfolioStore((state) => state.holdings);
  const removeHolding = usePortfolioStore((state) => state.removeHolding);
  const pickerList = useCoinPickerList();
  const marketData = useHoldingsMarketData(holdings.map((h) => h.coinId));

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingHolding, setEditingHolding] = useState<PortfolioHolding | null>(null);

  const rows: HoldingRow[] = useMemo(() => {
    const marketById = new Map((marketData.data ?? []).map((c) => [c.id, c]));
    return holdings.map((holding) => {
      const coin = marketById.get(holding.coinId);
      const currentPrice = coin?.current_price ?? 0;
      const currentValue = coin ? holding.quantity * currentPrice : 0;
      const investment = holding.quantity * holding.buyPrice;
      const profit = currentValue - investment;
      const profitPercent = investment > 0 ? (profit / investment) * 100 : 0;
      return { holding, coin, currentPrice, currentValue, investment, profit, profitPercent };
    });
  }, [holdings, marketData.data]);

  const totalValue = rows.reduce((sum, r) => sum + (r.coin ? r.currentValue : 0), 0);
  const totalInvestment = rows.reduce((sum, r) => sum + r.investment, 0);
  const totalProfit = totalValue - totalInvestment;

  const allocationSlices = rows
    .filter((r) => r.coin && r.currentValue > 0)
    .map((r) => ({
      coinId: r.holding.coinId,
      name: r.holding.coinName,
      symbol: r.holding.coinSymbol,
      value: r.currentValue,
    }));

  function handleAdd() {
    setEditingHolding(null);
    setDialogOpen(true);
  }

  function handleEdit(holding: PortfolioHolding) {
    setEditingHolding(holding);
    setDialogOpen(true);
  }

  function handleDelete(holding: PortfolioHolding) {
    const confirmed = window.confirm(`Remove ${holding.coinName} from your portfolio? This can't be undone.`);
    if (!confirmed) return;
    removeHolding(holding.id);
    toast.info("Holding removed", `${holding.coinName} was removed from your portfolio.`);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-h2 text-text-primary">Portfolio</h1>
          <p className="mt-1 text-caption text-text-muted">
            Track what you own, your cost basis, and how it's performing. Stored only in this browser.
          </p>
        </div>
        <Button onClick={handleAdd} disabled={pickerList.isPending}>
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add Holding
        </Button>
      </div>

      {holdings.length === 0 ? (
        <Card>
          <EmptyState
            icon={Wallet}
            title="No holdings yet"
            description="Add a coin you own to start tracking its value, profit, and allocation."
            action={
              <Button onClick={handleAdd} disabled={pickerList.isPending}>
                <Plus className="h-4 w-4" aria-hidden="true" />
                Add Your First Holding
              </Button>
            }
          />
        </Card>
      ) : (
        <>
          <ErrorBoundary label="Portfolio summary">
            <PortfolioSummaryCards totalValue={totalValue} totalInvestment={totalInvestment} totalProfit={totalProfit} />
          </ErrorBoundary>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <ErrorBoundary label="Holdings table">
                <Card>
                  {marketData.isError ? (
                    <ErrorState error={marketData.error} onRetry={() => marketData.refetch()} />
                  ) : (
                    <HoldingsTable rows={rows} isLoading={marketData.isPending} onEdit={handleEdit} onDelete={handleDelete} />
                  )}
                </Card>
              </ErrorBoundary>
            </div>
            <ErrorBoundary label="Allocation chart">
              <AllocationChart slices={allocationSlices} />
            </ErrorBoundary>
          </div>
        </>
      )}

      <HoldingFormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        coins={pickerList.data ?? []}
        editingHolding={editingHolding}
      />
    </div>
  );
}
