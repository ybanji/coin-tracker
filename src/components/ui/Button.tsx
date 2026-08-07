import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline" | "danger";
type ButtonSize = "sm" | "md" | "lg" | "icon";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-primary text-white hover:bg-primary-hover active:brightness-95",
  secondary: "bg-bg-elevated text-text-primary hover:bg-bg-surface-hover border border-border",
  ghost: "bg-transparent text-text-secondary hover:bg-bg-surface-hover hover:text-text-primary",
  outline: "bg-transparent text-text-primary border border-border hover:bg-bg-surface-hover",
  danger: "bg-error text-white hover:brightness-110",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-caption gap-1.5 rounded-md",
  md: "h-10 px-4 text-body gap-2 rounded-md",
  lg: "h-12 px-6 text-body gap-2 rounded-lg",
  icon: "h-10 w-10 rounded-md",
};

/**
 * Base button primitive. Every interactive surface in the app (nav items,
 * table actions, form submits) composes this rather than styling raw
 * <button> elements, so hover/focus/disabled/loading behavior stays uniform.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        aria-busy={isLoading || undefined}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors duration-200",
          "disabled:pointer-events-none disabled:opacity-50",
          variantClasses[variant],
          sizeClasses[size],
          className,
        )}
        {...props}
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
        {children}
      </button>
    );
  },
);
Button.displayName = "Button";
