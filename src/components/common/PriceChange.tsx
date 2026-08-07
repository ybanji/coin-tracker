import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import { formatPercent, getChangeDirection } from "@/utils/format";
import { cn } from "@/lib/utils";

export interface PriceChangeProps {
  value: number | null | undefined;
  showIcon?: boolean;
  className?: string;
}

const directionClasses = {
  up: "text-success",
  down: "text-error",
  flat: "text-text-muted",
} as const;

/**
 * The single source of truth for "is a change positive or negative" styling.
 * Every screen that shows a % change (dashboard cards, markets table, coin
 * hero, sparkline captions) renders through this component so red/green
 * semantics never drift between features.
 */
export function PriceChange({ value, showIcon = true, className }: PriceChangeProps) {
  const direction = getChangeDirection(value);
  const Icon = direction === "up" ? ArrowUp : direction === "down" ? ArrowDown : Minus;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 font-tabular text-caption font-medium",
        directionClasses[direction],
        className,
      )}
    >
      {showIcon && <Icon className="h-3 w-3" aria-hidden="true" />}
      {formatPercent(value)}
    </span>
  );
}
