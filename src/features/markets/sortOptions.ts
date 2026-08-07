import type { SortField } from "@/types/coin";

export const SORT_OPTIONS: { value: SortField; label: string }[] = [
  { value: "market_cap_desc", label: "Market Cap (High to Low)" },
  { value: "market_cap_asc", label: "Market Cap (Low to High)" },
  { value: "volume_desc", label: "Volume (High to Low)" },
  { value: "volume_asc", label: "Volume (Low to High)" },
  { value: "price_desc", label: "Price (High to Low)" },
  { value: "price_asc", label: "Price (Low to High)" },
  { value: "id_asc", label: "Name (A to Z)" },
  { value: "id_desc", label: "Name (Z to A)" },
];

export function isSortField(value: string): value is SortField {
  return SORT_OPTIONS.some((option) => option.value === value);
}
