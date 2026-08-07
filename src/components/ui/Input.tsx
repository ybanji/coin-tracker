import { forwardRef, useId } from "react";
import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

/**
 * Base text input. Always renders an associated <label> (visually hidden if
 * `label` is omitted) and wires `aria-invalid` / `aria-describedby` to the
 * error message, so every form built on top of this is accessible by default.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const errorId = error ? `${inputId}-error` : undefined;
    const hintId = hint ? `${inputId}-hint` : undefined;

    return (
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={inputId}
          className={cn("text-caption font-medium text-text-secondary", !label && "sr-only")}
        >
          {label ?? props["aria-label"] ?? "Input"}
        </label>
        <input
          ref={ref}
          id={inputId}
          aria-invalid={!!error || undefined}
          aria-describedby={cn(errorId, hintId) || undefined}
          className={cn(
            "h-10 w-full rounded-md border border-border bg-bg-elevated px-3 text-body text-text-primary",
            "placeholder:text-text-muted transition-colors duration-200",
            "hover:border-text-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-error focus-visible:ring-error",
            className,
          )}
          {...props}
        />
        {hint && !error && (
          <p id={hintId} className="text-caption text-text-muted">
            {hint}
          </p>
        )}
        {error && (
          <p id={errorId} role="alert" className="text-caption font-medium text-error">
            {error}
          </p>
        )}
      </div>
    );
  },
);
Input.displayName = "Input";
