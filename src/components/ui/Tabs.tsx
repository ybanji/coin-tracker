import { cn } from "@/lib/utils";

export interface TabOption<T extends string> {
  value: T;
  label: string;
}

export interface TabsProps<T extends string> {
  options: TabOption<T>[];
  value: T;
  onChange: (value: T) => void;
  label: string;
  className?: string;
}

/** Simple pill-style tab group. Generic over the option value so callers get type-safe `onChange`. */
export function Tabs<T extends string>({ options, value, onChange, label, className }: TabsProps<T>) {
  return (
    <div
      role="tablist"
      aria-label={label}
      className={cn("inline-flex gap-1 rounded-md bg-bg-elevated p-0.5", className)}
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="tab"
          aria-selected={option.value === value}
          onClick={() => onChange(option.value)}
          className={cn(
            "rounded-sm px-2.5 py-1 text-caption font-medium transition-colors duration-200",
            option.value === value
              ? "bg-bg-surface text-text-primary shadow-subtle"
              : "text-text-muted hover:text-text-secondary",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
