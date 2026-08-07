import { Line, LineChart, ResponsiveContainer, YAxis } from "recharts";
import { getChangeDirection } from "@/utils/format";

export interface SparklineProps {
  data: number[];
  changePercent?: number | null;
  width?: number | string;
  height?: number;
}

/**
 * Renders a borderless trend line only — no axes, grid, or tooltip. This is
 * a glanceable indicator (used inline in table rows and small cards), not
 * an analytical chart; the full interactive chart lives on the coin detail
 * page and is a separate component.
 */
export function Sparkline({ data, changePercent, width = 120, height = 40 }: SparklineProps) {
  if (!data || data.length < 2) {
    return <div style={{ width, height }} aria-hidden="true" />;
  }

  const direction = getChangeDirection(changePercent ?? data[data.length - 1]! - data[0]!);
  const strokeColor =
    direction === "up"
      ? "hsl(var(--success))"
      : direction === "down"
        ? "hsl(var(--error))"
        : "hsl(var(--text-muted))";

  const chartData = data.map((price, index) => ({ index, price }));
  const min = Math.min(...data);
  const max = Math.max(...data);
  // Pad the domain slightly so the line never touches the top/bottom edge.
  const padding = (max - min) * 0.1 || 1;

  return (
    <div style={{ width, height }} role="img" aria-label={`7 day price trend, ${direction}`}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
          <YAxis domain={[min - padding, max + padding]} hide />
          <Line
            type="monotone"
            dataKey="price"
            stroke={strokeColor}
            strokeWidth={1.5}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
