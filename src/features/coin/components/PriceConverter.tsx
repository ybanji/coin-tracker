import { useState } from "react";
import { ArrowLeftRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { usePreferencesStore } from "@/store/preferencesStore";

export function PriceConverter({ coinPrice, coinSymbol }: { coinPrice: number | undefined; coinSymbol: string }) {
  const currency = usePreferencesStore((state) => state.currency);
  const [coinAmount, setCoinAmount] = useState("1");
  const [fiatAmount, setFiatAmount] = useState(coinPrice ? String(coinPrice) : "");

  if (!coinPrice) return null;

  function handleCoinChange(value: string) {
    setCoinAmount(value);
    const parsed = Number(value);
    setFiatAmount(Number.isFinite(parsed) && coinPrice ? (parsed * coinPrice).toFixed(2) : "");
  }

  function handleFiatChange(value: string) {
    setFiatAmount(value);
    const parsed = Number(value);
    setCoinAmount(Number.isFinite(parsed) && coinPrice ? (parsed / coinPrice).toFixed(8) : "");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Price Converter</CardTitle>
      </CardHeader>
      <CardContent className="flex items-end gap-3">
        <Input
          label={`${coinSymbol.toUpperCase()} amount`}
          type="number"
          inputMode="decimal"
          min={0}
          value={coinAmount}
          onChange={(event) => handleCoinChange(event.target.value)}
          className="font-tabular"
        />
        <ArrowLeftRight className="mb-2.5 h-4 w-4 shrink-0 text-text-muted" aria-hidden="true" />
        <Input
          label={`${currency.toUpperCase()} amount`}
          type="number"
          inputMode="decimal"
          min={0}
          value={fiatAmount}
          onChange={(event) => handleFiatChange(event.target.value)}
          className="font-tabular"
        />
      </CardContent>
    </Card>
  );
}
