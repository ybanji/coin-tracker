import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ApiError } from "@/api/apiError";
import { cn } from "@/lib/utils";

export interface ErrorStateProps {
  error: unknown;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({ error, onRetry, className }: ErrorStateProps) {
  const message = error instanceof ApiError ? error.friendlyMessage : "Something went wrong loading this data.";

  return (
    <div
      role="alert"
      className={cn("flex flex-col items-center justify-center gap-3 px-6 py-12 text-center", className)}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-error-muted">
        <AlertTriangle className="h-6 w-6 text-error" aria-hidden="true" />
      </div>
      <p className="max-w-sm text-caption text-text-secondary">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
