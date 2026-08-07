import { Newspaper } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Skeleton, SkeletonText } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/feedback/ErrorState";
import { EmptyState } from "@/components/feedback/EmptyState";
import { ErrorBoundary } from "@/components/feedback/ErrorBoundary";
import { useCryptoNewsQuery } from "@/features/news/hooks/useCryptoNewsQuery";
import { usePageTitle } from "@/hooks/usePageTitle";
import { stripHtml, formatRelativeTime } from "@/utils/html";

export function NewsPage() {
  usePageTitle("News", "The latest headlines from across the crypto industry.");

  const { data, isPending, isError, error, refetch } = useCryptoNewsQuery();

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-h2 text-text-primary">News</h1>
        <p className="mt-1 text-caption text-text-muted">The latest headlines from across the crypto industry.</p>
      </div>

      <ErrorBoundary label="News feed">
        {isError ? (
          <Card>
            <ErrorState error={error} onRetry={() => refetch()} />
          </Card>
        ) : !isPending && (data?.length ?? 0) === 0 ? (
          <Card>
            <EmptyState icon={Newspaper} title="No articles available" description="Check back again shortly." />
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {isPending
              ? Array.from({ length: 9 }).map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <Skeleton className="h-36 w-full rounded-none" />
                    <div className="p-4">
                      <SkeletonText lines={3} />
                    </div>
                  </Card>
                ))
              : (data ?? []).slice(0, 24).map((article) => (
                  <a
                    key={article.id}
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="group"
                  >
                    <Card className="flex h-full flex-col overflow-hidden transition-colors duration-200 group-hover:border-border">
                      <div className="aspect-[16/9] w-full overflow-hidden bg-bg-elevated">
                        <img
                          src={article.imageUrl}
                          alt=""
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          onError={(event) => {
                            event.currentTarget.style.display = "none";
                          }}
                        />
                      </div>
                      <div className="flex flex-1 flex-col gap-2 p-4">
                        <p className="line-clamp-2 text-body font-medium text-text-primary">{article.title}</p>
                        <p className="line-clamp-2 flex-1 text-caption text-text-muted">{stripHtml(article.body)}</p>
                        <div className="flex items-center justify-between text-caption text-text-muted">
                          <span className="font-medium text-text-secondary">{article.source}</span>
                          <span>{formatRelativeTime(article.publishedAt)}</span>
                        </div>
                      </div>
                    </Card>
                  </a>
                ))}
          </div>
        )}
      </ErrorBoundary>
    </div>
  );
}
