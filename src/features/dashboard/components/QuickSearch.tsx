import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, X } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { CoinIcon } from "@/components/common/CoinIcon";
import { useMarketsSnapshot } from "@/features/dashboard/hooks/useMarketsSnapshot";
import { cn } from "@/lib/utils";

/**
 * Filters the already-loaded top-100 snapshot rather than hitting a search
 * endpoint — zero extra requests, instant results. This only covers the top
 * 100 coins by design; the dedicated Search feature (a later phase) will
 * call CoinGecko's /search endpoint for the full coin universe.
 */
export function QuickSearch() {
  const [query, setQuery] = useState("");
  const { data } = useMarketsSnapshot();

  const results = useMemo(() => {
    if (!query.trim() || !data) return [];
    const q = query.trim().toLowerCase();
    return data
      .filter((coin) => coin.name.toLowerCase().includes(q) || coin.symbol.toLowerCase().includes(q))
      .slice(0, 6);
  }, [query, data]);

  return (
    <Card className="relative">
      <div className="flex items-center gap-3 px-4 py-3">
        <Search className="h-4 w-4 shrink-0 text-text-muted" aria-hidden="true" />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search coins by name or symbol…"
          aria-label="Search coins"
          className="w-full bg-transparent text-body text-text-primary placeholder:text-text-muted focus:outline-none"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="Clear search"
            className="text-text-muted hover:text-text-primary"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>

      {query.trim() && (
        <div
          className={cn(
            "absolute inset-x-0 top-full z-10 mt-1 max-h-80 overflow-y-auto rounded-lg border border-border-subtle bg-bg-elevated shadow-popover scrollbar-thin",
          )}
        >
          {results.length === 0 ? (
            <p className="px-4 py-6 text-center text-caption text-text-muted">
              No coins found in the top 100 for "{query}".
            </p>
          ) : (
            results.map((coin) => (
              <Link
                key={coin.id}
                to={`/coin/${coin.id}`}
                onClick={() => setQuery("")}
                className="flex items-center gap-3 px-4 py-2.5 transition-colors duration-200 hover:bg-bg-surface-hover"
              >
                <CoinIcon src={coin.image} name={coin.name} size={22} />
                <span className="text-caption font-medium text-text-primary">{coin.name}</span>
                <span className="text-caption text-text-muted">{coin.symbol.toUpperCase()}</span>
              </Link>
            ))
          )}
        </div>
      )}
    </Card>
  );
}
