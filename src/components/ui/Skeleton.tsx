import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/** Base shimmer block. Compose into feature-specific skeletons (row, card, chart). */
export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div role="presentation" aria-hidden="true" className={cn("skeleton", className)} {...props} />;
}

export function SkeletonText({ lines = 1, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn("space-y-2", className)} aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className={cn("h-3.5", i === lines - 1 && lines > 1 ? "w-2/3" : "w-full")} />
      ))}
    </div>
  );
}
