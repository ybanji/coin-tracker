import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Clock, Loader2, Search, SearchX, X } from "lucide-react";
import { searchCoins } from "@/api/coingecko/endpoints";
import { queryKeys } from "@/api/queryKeys";
import { CoinIcon } from "@/components/common/CoinIcon";
import { useDebounce } from "@/hooks/useDebounce";
import { useRecentSearchesStore } from "@/store/recentSearchesStore";
import { cn } from "@/lib/utils";
import type { CoinSearchResult } from "@/types/coin";

const MAX_RESULTS = 8;

export function GlobalSearch() {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const debouncedQuery = useDebounce(query, 300);
  const trimmed = debouncedQuery.trim();

  const recent = useRecentSearchesStore((state) => state.entries);
  const addRecent = useRecentSearchesStore((state) => state.addEntry);

  const { data, isFetching } = useQuery({
    queryKey: queryKeys.search.query(trimmed.toLowerCase()),
    queryFn: ({ signal }) => searchCoins(trimmed, signal),
    enabled: trimmed.length > 0,
    staleTime: 60_000,
  });

  const results: CoinSearchResult[] = trimmed ? (data?.coins ?? []).slice(0, MAX_RESULTS) : [];
  const showingRecent = !trimmed && recent.length > 0;
  const listItems = trimmed ? results : showingRecent ? recent : [];

  useEffect(() => setActiveIndex(0), [trimmed, open]);

  useEffect(() => {
    function onClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function select(coin: { id: string; name: string; symbol: string; thumb: string }) {
    addRecent({ id: coin.id, name: coin.name, symbol: coin.symbol, thumb: coin.thumb });
    setOpen(false);
    setQuery("");
    navigate(`/coin/${coin.id}`);
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      setOpen(false);
      event.currentTarget.blur();
      return;
    }
    if (!listItems.length) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((i) => (i + 1) % listItems.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((i) => (i - 1 + listItems.length) % listItems.length);
    } else if (event.key === "Enter") {
      event.preventDefault();
      const item = listItems[activeIndex];
      if (item) select(item);
    }
  }

  return (
    <div ref={containerRef} className="relative hidden w-full max-w-sm sm:block">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" aria-hidden="true" />
      <input
        type="search"
        role="combobox"
        aria-expanded={open}
        aria-controls="global-search-listbox"
        aria-autocomplete="list"
        value={query}
        onFocus={() => setOpen(true)}
        onChange={(event) => {
          setQuery(event.target.value);
          setOpen(true);
        }}
        onKeyDown={onKeyDown}
        placeholder="Search coins…"
        aria-label="Search all coins"
        className="h-9 w-full rounded-md border border-border bg-bg-elevated pl-9 pr-8 text-caption text-text-primary placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      />
      {isFetching && trimmed ? (
        <Loader2 className="absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-text-muted" aria-hidden="true" />
      ) : query ? (
        <button
          type="button"
          onClick={() => setQuery("")}
          aria-label="Clear search"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      ) : null}

      {open && (query || showingRecent) && (
        <div
          id="global-search-listbox"
          role="listbox"
          aria-label="Search results"
          className="absolute inset-x-0 top-full z-40 mt-1 max-h-96 overflow-y-auto rounded-md border border-border-subtle bg-bg-elevated shadow-popover scrollbar-thin"
        >
          {showingRecent && (
            <p className="flex items-center gap-1.5 px-3 pt-2.5 text-caption font-medium text-text-muted">
              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
              Recent searches
            </p>
          )}

          {trimmed && !isFetching && results.length === 0 ? (
            <div className="flex flex-col items-center gap-2 px-4 py-8 text-center">
              <SearchX className="h-5 w-5 text-text-muted" aria-hidden="true" />
              <p className="text-caption text-text-muted">No coins found for "{trimmed}".</p>
            </div>
          ) : (
            <ul>
              {listItems.map((item, index) => (
                <li key={item.id}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={index === activeIndex}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => select(item)}
                    className={cn(
                      "flex w-full items-center gap-2.5 px-3 py-2 text-left text-caption transition-colors duration-200",
                      index === activeIndex ? "bg-bg-surface-hover" : "hover:bg-bg-surface-hover",
                    )}
                  >
                    <CoinIcon src={item.thumb} name={item.name} size={20} />
                    <span className="flex-1 truncate text-text-primary">{item.name}</span>
                    <span className="text-text-muted">{item.symbol.toUpperCase()}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
