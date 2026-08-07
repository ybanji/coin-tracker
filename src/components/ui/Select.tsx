import { forwardRef, useId } from "react";
import type { SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, id, children, ...props }, ref) => {
    const generatedId = useId();
    const selectId = id ?? generatedId;
    const errorId = error ? `${selectId}-error` : undefined;

    return (
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={selectId}
          className={cn("text-caption font-medium text-text-secondary", !label && "sr-only")}
        >
          {label ?? props["aria-label"] ?? "Select"}
        </label>
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            aria-invalid={!!error || undefined}
            aria-describedby={errorId}
            className={cn(
              "h-10 w-full appearance-none rounded-md border border-border bg-bg-elevated px-3 pr-9 text-body text-text-primary",
              "transition-colors duration-200 hover:border-text-muted/50",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
              "disabled:cursor-not-allowed disabled:opacity-50",
              error && "border-error focus-visible:ring-error",
              className,
            )}
            {...props}
          >
            {children}
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted"
            aria-hidden="true"
          />
        </div>
        {error && (
          <p id={errorId} role="alert" className="text-caption font-medium text-error">
            {error}
          </p>
        )}
      </div>
    );
  },
);
Select.displayName = "Select";
