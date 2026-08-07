import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { EmptyState } from "@/components/feedback/EmptyState";
import { PieChart as PieChartIcon } from "lucide-react";
import { formatPercent, formatPrice } from "@/utils/format";
import { usePreferencesStore } from "@/store/preferencesStore";

export interface AllocationSlice {
  coinId: string;
  name: string;
  symbol: string;
  value: number;
}

// Fixed categorical palette — chart slices are arbitrary in number and don't map to
// semantic success/error tokens, so a small rotating hue set is the standard approach.
const PALETTE = [
  "#6366f1",
  "#22c55e",
  "#f59e0b",
  "#ec4899",
  "#06b6d4",
  "#ef4444",
  "#8b5cf6",
  "#14b8a6",
  "#eab308",
  "#64748b",
];

export function AllocationChart({ slices }: { slices: AllocationSlice[] }) {
  const currency = usePreferencesStore((state) => state.currency);
  const total = slices.reduce((sum, s) => sum + s.value, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Allocation</CardTitle>
      </CardHeader>
      {slices.length === 0 || total === 0 ? (
        <EmptyState icon={PieChartIcon} title="No allocation data yet" description="Add a holding to see your portfolio breakdown." />
      ) : (
        <div className="flex flex-col items-center gap-4 px-5 pb-5 sm:flex-row">
          <div className="h-48 w-48 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={slices} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={2}>
                  {slices.map((slice, i) => (
                    <Cell key={slice.coinId} fill={PALETTE[i % PALETTE.length]} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number, _name, item) => [
                    formatPrice(value, currency),
                    item.payload.name as string,
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="flex w-full flex-col gap-2">
            {slices
              .slice()
              .sort((a, b) => b.value - a.value)
              .map((slice) => (
                <li key={slice.coinId} className="flex items-center gap-2 text-caption">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: PALETTE[slices.findIndex((s) => s.coinId === slice.coinId) % PALETTE.length] }}
                    aria-hidden="true"
                  />
                  <span className="flex-1 truncate text-text-secondary">
                    {slice.name} <span className="text-text-muted">{slice.symbol.toUpperCase()}</span>
                  </span>
                  <span className="font-tabular font-medium text-text-primary">
                    {formatPercent((slice.value / total) * 100, 1).replace("+", "")}
                  </span>
                </li>
              ))}
          </ul>
        </div>
      )}
    </Card>
  );
}
