import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { CoinIcon } from "@/components/common/CoinIcon";
import { cn } from "@/lib/utils";
import type { CoinMarketData } from "@/types/coin";

export interface CoinComboboxProps {
  coins: CoinMarketData[];
  value: string;
  onChange: (coinId: string) => void;
  error?: string;
  disabled?: boolean;
}

/** Searchable single-select for choosing a coin in the portfolio form — a native <select> with 250 options is unusable, so this is a small custom listbox. */
export function CoinCombobox({ coins, value, onChange, error, disabled }: CoinComboboxProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const selected = coins.find((c) => c.id === value);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return coins.slice(0, 50);
    return coins
      .filter((c) => c.name.toLowerCase().includes(q) || c.symbol.toLowerCase().includes(q))
      .slice(0, 50);
  }, [coins, query]);

  useEffect(() => {
    function onClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div className="flex flex-col gap-1.5" ref={containerRef}>
      <label className="text-caption font-medium text-text-secondary" id="coin-combobox-label">
        Coin
      </label>
      <div className="relative">
        <button
          type="button"
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-labelledby="coin-combobox-label"
          onClick={() => setOpen((v) => !v)}
          className={cn(
            "flex h-10 w-full items-center gap-2 rounded-md border border-border bg-bg-elevated px-3 text-left text-body text-text-primary",
            "transition-colors duration-200 hover:border-text-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-error focus-visible:ring-error",
          )}
        >
          {selected ? (
            <>
              <CoinIcon src={selected.image} name={selected.name} size={20} />
              <span className="flex-1 truncate">{selected.name}</span>
              <span className="text-caption text-text-muted">{selected.symbol.toUpperCase()}</span>
            </>
          ) : (
            <span className="flex-1 truncate text-text-muted">Select a coin…</span>
          )}
          <ChevronDown className="h-4 w-4 shrink-0 text-text-muted" aria-hidden="true" />
        </button>

        {open && (
          <div
            role="listbox"
            aria-labelledby="coin-combobox-label"
            className="absolute inset-x-0 top-full z-20 mt-1 max-h-72 overflow-hidden rounded-md border border-border-subtle bg-bg-elevated shadow-popover"
          >
            <div className="flex items-center gap-2 border-b border-border-subtle px-3 py-2">
              <Search className="h-4 w-4 shrink-0 text-text-muted" aria-hidden="true" />
              <input
                autoFocus
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search coins…"
                aria-label="Search coins"
                className="w-full bg-transparent text-caption text-text-primary placeholder:text-text-muted focus:outline-none"
              />
            </div>
            <div className="max-h-60 overflow-y-auto scrollbar-thin">
              {filtered.length === 0 ? (
                <p className="px-3 py-4 text-center text-caption text-text-muted">No coins found.</p>
              ) : (
                filtered.map((coin) => (
                  <button
                    key={coin.id}
                    type="button"
                    role="option"
                    aria-selected={coin.id === value}
                    onClick={() => {
                      onChange(coin.id);
                      setOpen(false);
                      setQuery("");
                    }}
                    className={cn(
                      "flex w-full items-center gap-2.5 px-3 py-2 text-left text-caption transition-colors duration-200 hover:bg-bg-surface-hover",
                      coin.id === value && "bg-primary-muted",
                    )}
                  >
                    <CoinIcon src={coin.image} name={coin.name} size={20} />
                    <span className="flex-1 truncate text-text-primary">{coin.name}</span>
                    <span className="text-text-muted">{coin.symbol.toUpperCase()}</span>
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>
      {error && (
        <p role="alert" className="text-caption font-medium text-error">
          {error}
        </p>
      )}
    </div>
  );
}
