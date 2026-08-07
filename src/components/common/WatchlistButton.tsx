import { Star } from "lucide-react";
import { useWatchlistStore } from "@/store/watchlistStore";
import { toast } from "@/store/toastStore";
import { cn } from "@/lib/utils";

export interface WatchlistButtonProps {
  coinId: string;
  coinName: string;
  size?: "sm" | "md";
  className?: string;
}

/** Star toggle used in Markets rows, Watchlist rows, and the coin detail hero — single source of truth for the add/remove-with-toast behavior. */
export function WatchlistButton({ coinId, coinName, size = "sm", className }: WatchlistButtonProps) {
  const isWatched = useWatchlistStore((state) => state.has(coinId));
  const toggle = useWatchlistStore((state) => state.toggle);

  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        const next = !isWatched;
        toggle(coinId);
        if (next) {
          toast.success("Added to watchlist", `${coinName} is now on your watchlist.`);
        } else {
          toast.info("Removed from watchlist", `${coinName} was removed from your watchlist.`);
        }
      }}
      aria-pressed={isWatched}
      aria-label={isWatched ? `Remove ${coinName} from watchlist` : `Add ${coinName} to watchlist`}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-md text-text-muted transition-colors duration-200 hover:bg-bg-surface-hover hover:text-warning",
        size === "sm" ? "h-8 w-8" : "h-10 w-10",
        isWatched && "text-warning",
        className,
      )}
    >
      <Star className={cn(size === "sm" ? "h-4 w-4" : "h-5 w-5", isWatched && "fill-warning")} aria-hidden="true" />
    </button>
  );
}
