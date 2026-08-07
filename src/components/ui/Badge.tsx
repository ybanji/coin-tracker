import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "success" | "error" | "warning" | "primary";

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-bg-elevated text-text-secondary border-border",
  success: "bg-success-muted text-success border-transparent",
  error: "bg-error-muted text-error border-transparent",
  warning: "bg-warning-muted text-warning border-transparent",
  primary: "bg-primary-muted text-primary border-transparent",
};

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-sm border px-2 py-0.5 text-caption font-medium",
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  );
}
