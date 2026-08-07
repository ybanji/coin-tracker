import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind class lists safely — later classes win over earlier
 * conflicting ones (e.g. cn("p-2", isActive && "p-4") resolves to "p-4"
 * instead of Tailwind's default "last in source order" ambiguity).
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
