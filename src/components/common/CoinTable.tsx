import { Link } from "react-router-dom";
import { CoinIcon } from "@/components/common/CoinIcon";
import { PriceChange } from "@/components/common/PriceChange";
import { WatchlistButton } from "@/components/common/WatchlistButton";
import { Sparkline } from "@/components/charts/Sparkline";
import { Skeleton, SkeletonText } from "@/components/ui/Skeleton";
import { formatCompactCurrency, formatPrice } from "@/utils/format";
import { usePreferencesStore } from "@/store/preferencesStore";
import type { CoinMarketData } from "@/types/coin";

export interface CoinTableProps {
  coins: CoinMarketData[];
  isLoading?: boolean;
  skeletonRows?: number;
}

const columnHeaderClass = "px-4 py-3 text-caption font-medium text-text-muted";

export function CoinTable({ coins, isLoading, skeletonRows = 10 }: CoinTableProps) {
  const currency = usePreferencesStore((state) => state.currency);

  return (
    <>
      {/* Desktop / tablet table */}
      <div className="hidden overflow-x-auto scrollbar-thin md:block">
        <table className="w-full min-w-[880px] border-collapse text-left">
          <thead>
            <tr className="border-b border-border-subtle">
              <th className={columnHeaderClass}>#</th>
              <th className={columnHeaderClass}>Coin</th>
              <th className={`${columnHeaderClass} text-right`}>Price</th>
              <th className={`${columnHeaderClass} text-right`}>1h %</th>
              <th className={`${columnHeaderClass} text-right`}>24h %</th>
              <th className={`${columnHeaderClass} text-right`}>7d %</th>
              <th className={`${columnHeaderClass} text-right`}>24h Volume</th>
              <th className={`${columnHeaderClass} text-right`}>Market Cap</th>
              <th className={`${columnHeaderClass} text-right`}>7d Chart</th>
              <th className={columnHeaderClass}>
                <span className="sr-only">Watchlist</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {isLoading
              ? Array.from({ length: skeletonRows }).map((_, i) => <TableRowSkeleton key={i} />)
              : coins.map((coin) => (
                  <tr key={coin.id} className="group transition-colors duration-200 hover:bg-bg-surface-hover">
                    <td className="px-4 py-3 font-tabular text-caption text-text-muted">
                      {coin.market_cap_rank ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      <Link to={`/coin/${coin.id}`} className="flex items-center gap-3">
                        <CoinIcon src={coin.image} name={coin.name} size={28} />
                        <div className="min-w-0">
                          <p className="truncate text-caption font-medium text-text-primary">{coin.name}</p>
                          <p className="text-caption text-text-muted">{coin.symbol.toUpperCase()}</p>
                        </div>
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-right font-tabular text-caption text-text-primary">
                      {formatPrice(coin.current_price, currency)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <PriceChange
                        value={coin.price_change_percentage_1h_in_currency}
                        showIcon={false}
                        className="justify-end"
                      />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <PriceChange
                        value={coin.price_change_percentage_24h}
                        showIcon={false}
                        className="justify-end"
                      />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <PriceChange
                        value={coin.price_change_percentage_7d_in_currency}
                        showIcon={false}
                        className="justify-end"
                      />
                    </td>
                    <td className="px-4 py-3 text-right font-tabular text-caption text-text-secondary">
                      {formatCompactCurrency(coin.total_volume, currency)}
                    </td>
                    <td className="px-4 py-3 text-right font-tabular text-caption text-text-secondary">
                      {formatCompactCurrency(coin.market_cap, currency)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="ml-auto">
                        <Sparkline
                          data={coin.sparkline_in_7d?.price ?? []}
                          changePercent={coin.price_change_percentage_7d_in_currency}
                          width={110}
                          height={36}
                        />
                      </div>
                    </td>
                    <td className="px-2 py-3">
                      <WatchlistButton coinId={coin.id} coinName={coin.name} />
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="divide-y divide-border-subtle md:hidden">
        {isLoading
          ? Array.from({ length: Math.min(skeletonRows, 6) }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-1 py-3">
                <Skeleton className="h-9 w-9 shrink-0 rounded-full" />
                <SkeletonText lines={2} className="flex-1" />
              </div>
            ))
          : coins.map((coin) => (
              <Link
                key={coin.id}
                to={`/coin/${coin.id}`}
                className="flex items-center gap-3 px-1 py-3 transition-colors duration-200 active:bg-bg-surface-hover"
              >
                <span className="w-5 shrink-0 font-tabular text-caption text-text-muted">
                  {coin.market_cap_rank ?? "—"}
                </span>
                <CoinIcon src={coin.image} name={coin.name} size={32} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-caption font-medium text-text-primary">{coin.name}</p>
                  <p className="text-caption text-text-muted">
                    {formatCompactCurrency(coin.market_cap, currency)} mkt cap
                  </p>
                </div>
                <div className="flex flex-col items-end gap-0.5">
                  <span className="font-tabular text-caption font-medium text-text-primary">
                    {formatPrice(coin.current_price, currency)}
                  </span>
                  <PriceChange value={coin.price_change_percentage_24h} showIcon={false} />
                </div>
                <WatchlistButton coinId={coin.id} coinName={coin.name} />
              </Link>
            ))}
      </div>
    </>
  );
}

function TableRowSkeleton() {
  return (
    <tr>
      <td className="px-4 py-3">
        <Skeleton className="h-3.5 w-4" />
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <Skeleton className="h-7 w-7 shrink-0 rounded-full" />
          <SkeletonText lines={2} className="w-24" />
        </div>
      </td>
      {Array.from({ length: 6 }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <Skeleton className="ml-auto h-3.5 w-16" />
        </td>
      ))}
      <td className="px-2 py-3">
        <Skeleton className="h-8 w-8 rounded-md" />
      </td>
    </tr>
  );
}
