import { Pencil, Trash2 } from "lucide-react";
import { CoinIcon } from "@/components/common/CoinIcon";
import { PriceChange } from "@/components/common/PriceChange";
import { Skeleton, SkeletonText } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";
import { formatDate, formatPrice } from "@/utils/format";
import { usePreferencesStore } from "@/store/preferencesStore";
import type { PortfolioHolding } from "@/types/portfolio";
import type { CoinMarketData } from "@/types/coin";

export interface HoldingRow {
  holding: PortfolioHolding;
  coin: CoinMarketData | undefined;
  currentPrice: number;
  currentValue: number;
  investment: number;
  profit: number;
  profitPercent: number;
}

const columnHeaderClass = "px-4 py-3 text-caption font-medium text-text-muted";

export function HoldingsTable({
  rows,
  isLoading,
  onEdit,
  onDelete,
}: {
  rows: HoldingRow[];
  isLoading: boolean;
  onEdit: (holding: PortfolioHolding) => void;
  onDelete: (holding: PortfolioHolding) => void;
}) {
  const currency = usePreferencesStore((state) => state.currency);

  return (
    <>
      <div className="hidden overflow-x-auto scrollbar-thin md:block">
        <table className="w-full min-w-[820px] border-collapse text-left">
          <thead>
            <tr className="border-b border-border-subtle">
              <th className={columnHeaderClass}>Coin</th>
              <th className={`${columnHeaderClass} text-right`}>Quantity</th>
              <th className={`${columnHeaderClass} text-right`}>Buy Price</th>
              <th className={`${columnHeaderClass} text-right`}>Purchase Date</th>
              <th className={`${columnHeaderClass} text-right`}>Current Value</th>
              <th className={`${columnHeaderClass} text-right`}>Profit / Loss</th>
              <th className={columnHeaderClass}>
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-4 py-3" colSpan={7}>
                      <SkeletonText lines={1} />
                    </td>
                  </tr>
                ))
              : rows.map(({ holding, coin, currentValue, investment, profit, profitPercent }) => (
                  <tr key={holding.id} className="transition-colors duration-200 hover:bg-bg-surface-hover">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <CoinIcon src={holding.coinImage} name={holding.coinName} size={28} />
                        <div className="min-w-0">
                          <p className="truncate text-caption font-medium text-text-primary">{holding.coinName}</p>
                          <p className="text-caption text-text-muted">{holding.coinSymbol.toUpperCase()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-tabular text-caption text-text-primary">
                      {holding.quantity}
                    </td>
                    <td className="px-4 py-3 text-right font-tabular text-caption text-text-secondary">
                      {formatPrice(holding.buyPrice, currency)}
                    </td>
                    <td className="px-4 py-3 text-right text-caption text-text-secondary">
                      {formatDate(holding.purchaseDate)}
                    </td>
                    <td className="px-4 py-3 text-right font-tabular text-caption font-medium text-text-primary">
                      {coin ? formatPrice(currentValue, currency) : "—"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {coin ? (
                        <div className="flex flex-col items-end">
                          <span
                            className={`font-tabular text-caption font-medium ${profit >= 0 ? "text-success" : "text-error"}`}
                          >
                            {profit >= 0 ? "+" : ""}
                            {formatPrice(profit, currency)}
                          </span>
                          <PriceChange value={investment > 0 ? profitPercent : 0} showIcon={false} />
                        </div>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-2 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => onEdit(holding)} aria-label={`Edit ${holding.coinName} holding`}>
                          <Pencil className="h-4 w-4" aria-hidden="true" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDelete(holding)}
                          aria-label={`Delete ${holding.coinName} holding`}
                          className="hover:text-error"
                        >
                          <Trash2 className="h-4 w-4" aria-hidden="true" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      <div className="divide-y divide-border-subtle md:hidden">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-1 py-3">
                <Skeleton className="h-9 w-9 shrink-0 rounded-full" />
                <SkeletonText lines={2} className="flex-1" />
              </div>
            ))
          : rows.map(({ holding, coin, currentValue, profitPercent }) => (
              <div key={holding.id} className="flex items-center gap-3 px-1 py-3">
                <CoinIcon src={holding.coinImage} name={holding.coinName} size={32} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-caption font-medium text-text-primary">{holding.coinName}</p>
                  <p className="text-caption text-text-muted">
                    {holding.quantity} {holding.coinSymbol.toUpperCase()}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-0.5">
                  <span className="font-tabular text-caption font-medium text-text-primary">
                    {coin ? formatPrice(currentValue, currency) : "—"}
                  </span>
                  {coin && <PriceChange value={profitPercent} showIcon={false} />}
                </div>
                <div className="flex items-center gap-0.5">
                  <Button variant="ghost" size="icon" onClick={() => onEdit(holding)} aria-label={`Edit ${holding.coinName} holding`}>
                    <Pencil className="h-4 w-4" aria-hidden="true" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(holding)}
                    aria-label={`Delete ${holding.coinName} holding`}
                    className="hover:text-error"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </div>
              </div>
            ))}
      </div>
    </>
  );
}
