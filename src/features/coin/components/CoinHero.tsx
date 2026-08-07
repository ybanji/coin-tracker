import { CoinIcon } from "@/components/common/CoinIcon";
import { PriceChange } from "@/components/common/PriceChange";
import { Badge } from "@/components/ui/Badge";
import { WatchlistButton } from "@/components/common/WatchlistButton";
import { formatPrice } from "@/utils/format";
import { usePreferencesStore } from "@/store/preferencesStore";
import type { CoinDetailData } from "@/types/coin";

export function CoinHero({ coin }: { coin: CoinDetailData }) {
  const currency = usePreferencesStore((state) => state.currency);
  const price = coin.market_data.current_price[currency];
  const change24h = coin.market_data.price_change_percentage_24h;

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex items-center gap-4">
        <CoinIcon src={coin.image.large} name={coin.name} size={56} />
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-h1 text-text-primary">{coin.name}</h1>
            <span className="text-h3 text-text-muted">{coin.symbol.toUpperCase()}</span>
            {coin.market_cap_rank && <Badge variant="primary">Rank #{coin.market_cap_rank}</Badge>}
          </div>
          <div className="mt-2 flex items-center gap-3">
            <span className="font-tabular text-h2 text-text-primary">{formatPrice(price, currency)}</span>
            <PriceChange value={change24h} className="text-body" />
          </div>
        </div>
      </div>

      <WatchlistButton coinId={coin.id} coinName={coin.name} size="md" className="border border-border" />
    </div>
  );
}
