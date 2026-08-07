import { useEffect, useState } from "react";

/** Debounces a value by `delayMs`. Used for search inputs to avoid filtering/fetching on every keystroke. */
export function useDebounce<T>(value: T, delayMs = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timeout = window.setTimeout(() => setDebounced(value), delayMs);
    return () => window.clearTimeout(timeout);
  }, [value, delayMs]);

  return debounced;
}
