import { useState } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { TooltipProps } from "recharts";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/feedback/ErrorState";
import { Tabs } from "@/components/ui/Tabs";
import { useCoinChartQuery } from "@/features/coin/hooks/useCoinChartQuery";
import { CHART_TIMEFRAMES, type ChartTimeframe } from "@/features/coin/timeframes";
import { formatDate, formatPrice, getChangeDirection } from "@/utils/format";
import { usePreferencesStore } from "@/store/preferencesStore";

const TAB_OPTIONS = CHART_TIMEFRAMES.map(({ value, label }) => ({ value, label }));

export function CoinChart({ coinId }: { coinId: string }) {
  const [timeframe, setTimeframe] = useState<ChartTimeframe>("7d");
  const currency = usePreferencesStore((state) => state.currency);
  const { data, isPending, isError, error, refetch } = useCoinChartQuery(coinId, timeframe);

  const first = data?.[0]?.price;
  const last = data?.[data.length - 1]?.price;
  const direction = getChangeDirection(first !== undefined && last !== undefined ? last - first : 0);
  const strokeColor =
    direction === "up" ? "hsl(var(--success))" : direction === "down" ? "hsl(var(--error))" : "hsl(var(--text-muted))";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Price Chart</CardTitle>
        <Tabs label="Chart timeframe" options={TAB_OPTIONS} value={timeframe} onChange={setTimeframe} />
      </CardHeader>
      <div className="h-72 px-2 pb-5 sm:px-5">
        {isError ? (
          <ErrorState error={error} onRetry={() => refetch()} className="h-full" />
        ) : isPending || !data ? (
          <Skeleton className="h-full w-full" />
        ) : data.length < 2 ? (
          <div className="flex h-full items-center justify-center text-caption text-text-muted">
            Not enough chart data for this timeframe.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="coinChartFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={strokeColor} stopOpacity={0.28} />
                  <stop offset="100%" stopColor={strokeColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="timestamp"
                tickFormatter={(value: number) => formatDate(value, { month: "short", day: "numeric" })}
                tick={{ fill: "hsl(var(--text-muted))", fontSize: 11 }}
                axisLine={{ stroke: "hsl(var(--border-subtle))" }}
                tickLine={false}
                minTickGap={40}
              />
              <YAxis
                domain={["auto", "auto"]}
                tick={{ fill: "hsl(var(--text-muted))", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={64}
                tickFormatter={(value: number) => formatPrice(value, currency)}
              />
              <Tooltip content={<ChartTooltip currency={currency} />} />
              <Area
                type="monotone"
                dataKey="price"
                stroke={strokeColor}
                strokeWidth={2}
                fill="url(#coinChartFill)"
                animationDuration={300}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
}

function ChartTooltip({ active, payload, currency }: TooltipProps<number, string> & { currency: string }) {
  if (!active || !payload?.length) return null;
  const point = payload[0];
  if (!point) return null;
  const value = typeof point.value === "number" ? point.value : Number(point.value);
  const timestamp = point.payload?.timestamp as number | undefined;

  return (
    <div className="rounded-md border border-border-subtle bg-bg-elevated px-3 py-2 shadow-popover">
      {timestamp !== undefined && (
        <p className="text-caption text-text-muted">
          {formatDate(timestamp, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
        </p>
      )}
      <p className="font-tabular text-caption font-semibold text-text-primary">{formatPrice(value, currency)}</p>
    </div>
  );
}
