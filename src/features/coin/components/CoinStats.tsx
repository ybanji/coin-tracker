import type { ReactNode } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { PriceChange } from "@/components/common/PriceChange";
import {
  formatCompactCurrency,
  formatCompactNumber,
  formatDate,
  formatPrice,
} from "@/utils/format";
import { usePreferencesStore } from "@/store/preferencesStore";
import type { CoinDetailData } from "@/types/coin";

function StatRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <span className="text-caption text-text-muted">{label}</span>
      <span className="font-tabular text-caption font-medium text-text-primary">{value}</span>
    </div>
  );
}

export function CoinStats({ coin }: { coin: CoinDetailData }) {
  const currency = usePreferencesStore((state) => state.currency);
  const md = coin.market_data;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Statistics</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-x-8 divide-y divide-border-subtle sm:grid-cols-2 sm:divide-y-0">
        <div className="divide-y divide-border-subtle">
          <StatRow label="Market Cap" value={formatCompactCurrency(md.market_cap[currency], currency)} />
          <StatRow label="24h Volume" value={formatCompactCurrency(md.total_volume[currency], currency)} />
          <StatRow label="24h High" value={formatPrice(md.high_24h[currency], currency)} />
          <StatRow label="24h Low" value={formatPrice(md.low_24h[currency], currency)} />
          <StatRow label="Circulating Supply" value={formatCompactNumber(md.circulating_supply)} />
        </div>
        <div className="divide-y divide-border-subtle">
          <StatRow label="Total Supply" value={md.total_supply ? formatCompactNumber(md.total_supply) : "—"} />
          <StatRow label="Max Supply" value={md.max_supply ? formatCompactNumber(md.max_supply) : "∞"} />
          <StatRow
            label="All-Time High"
            value={
              <span className="flex items-center gap-2">
                {formatPrice(md.ath[currency], currency)}
                <PriceChange value={md.ath_change_percentage[currency]} showIcon={false} />
              </span>
            }
          />
          <StatRow label="ATH Date" value={md.ath_date[currency] ? formatDate(md.ath_date[currency]!) : "—"} />
          <StatRow
            label="All-Time Low"
            value={
              <span className="flex items-center gap-2">
                {formatPrice(md.atl[currency], currency)}
                <PriceChange value={md.atl_change_percentage[currency]} showIcon={false} />
              </span>
            }
          />
          {md.roi && (
            <StatRow
              label={`ROI (${md.roi.currency.toUpperCase()})`}
              value={<PriceChange value={md.roi.percentage} showIcon={false} />}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
