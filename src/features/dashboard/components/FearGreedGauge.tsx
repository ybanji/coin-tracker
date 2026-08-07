import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/feedback/ErrorState";
import { useFearGreedIndex } from "@/features/dashboard/hooks/useFearGreedIndex";
import { cn } from "@/lib/utils";

/** Maps 0–100 to a token color band matching the index's own classification language. */
function getBand(value: number): { color: string; track: string } {
  if (value < 25) return { color: "text-error", track: "bg-error" };
  if (value < 45) return { color: "text-warning", track: "bg-warning" };
  if (value < 55) return { color: "text-text-muted", track: "bg-text-muted" };
  if (value < 75) return { color: "text-primary", track: "bg-primary" };
  return { color: "text-success", track: "bg-success" };
}

export function FearGreedGauge() {
  const { data, isPending, isError, error, refetch } = useFearGreedIndex();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fear &amp; Greed Index</CardTitle>
      </CardHeader>
      <CardContent>
        {isPending ? (
          <div className="space-y-3">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-2 w-full" />
          </div>
        ) : isError ? (
          <ErrorState error={error} onRetry={() => refetch()} />
        ) : data ? (
          (() => {
            const value = Number(data.value);
            const band = getBand(value);
            return (
              <div>
                <div className="flex items-baseline gap-2">
                  <span className={cn("font-tabular text-h1", band.color)}>{value}</span>
                  <span className="text-caption font-medium text-text-secondary">
                    {data.value_classification}
                  </span>
                </div>
                <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-bg-elevated">
                  <div
                    className={cn("h-full rounded-full transition-all duration-300", band.track)}
                    style={{ width: `${value}%` }}
                    role="progressbar"
                    aria-valuenow={value}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label="Fear and Greed Index"
                  />
                </div>
              </div>
            );
          })()
        ) : null}
      </CardContent>
    </Card>
  );
}
