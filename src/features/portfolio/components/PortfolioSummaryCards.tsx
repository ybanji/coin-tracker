import { Card, CardContent } from "@/components/ui/Card";
import { formatPrice, formatPercent, getChangeDirection } from "@/utils/format";
import { usePreferencesStore } from "@/store/preferencesStore";
import { cn } from "@/lib/utils";

export function PortfolioSummaryCards({
  totalValue,
  totalInvestment,
  totalProfit,
}: {
  totalValue: number;
  totalInvestment: number;
  totalProfit: number;
}) {
  const currency = usePreferencesStore((state) => state.currency);
  const profitPercent = totalInvestment > 0 ? (totalProfit / totalInvestment) * 100 : 0;
  const direction = getChangeDirection(totalProfit);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <Card>
        <CardContent className="flex flex-col gap-1">
          <p className="text-caption text-text-muted">Current Value</p>
          <p className="font-tabular text-h2 text-text-primary">{formatPrice(totalValue, currency)}</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="flex flex-col gap-1">
          <p className="text-caption text-text-muted">Total Invested</p>
          <p className="font-tabular text-h2 text-text-primary">{formatPrice(totalInvestment, currency)}</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="flex flex-col gap-1">
          <p className="text-caption text-text-muted">Profit / Loss</p>
          <p
            className={cn(
              "font-tabular text-h2",
              direction === "up" ? "text-success" : direction === "down" ? "text-error" : "text-text-primary",
            )}
          >
            {totalProfit >= 0 ? "+" : ""}
            {formatPrice(totalProfit, currency)}
            <span className="ml-2 text-body">({formatPercent(profitPercent)})</span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
