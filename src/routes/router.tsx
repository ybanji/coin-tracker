import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import type { ReactNode } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageLoader } from "@/components/feedback/PageLoader";

const DashboardPage = lazy(() =>
  import("@/features/dashboard/DashboardPage").then((m) => ({ default: m.DashboardPage })),
);
const MarketsPage = lazy(() => import("@/features/markets/MarketsPage").then((m) => ({ default: m.MarketsPage })));
const CoinDetailPage = lazy(() =>
  import("@/features/coin/CoinDetailPage").then((m) => ({ default: m.CoinDetailPage })),
);
const WatchlistPage = lazy(() =>
  import("@/features/watchlist/WatchlistPage").then((m) => ({ default: m.WatchlistPage })),
);
const PortfolioPage = lazy(() =>
  import("@/features/portfolio/PortfolioPage").then((m) => ({ default: m.PortfolioPage })),
);
const SettingsPage = lazy(() =>
  import("@/features/settings/SettingsPage").then((m) => ({ default: m.SettingsPage })),
);
const NewsPage = lazy(() => import("@/features/news/NewsPage").then((m) => ({ default: m.NewsPage })));
const NotFoundPage = lazy(() =>
  import("@/features/not-found/NotFoundPage").then((m) => ({ default: m.NotFoundPage })),
);

// Route-level code splitting keeps the initial bundle to just the dashboard;
// every other route is fetched on first navigation. `withSuspense` gives
// each a consistent full-page loading state instead of a blank flash.
function withSuspense(element: ReactNode) {
  return <Suspense fallback={<PageLoader />}>{element}</Suspense>;
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    children: [
      { index: true, element: withSuspense(<DashboardPage />) },
      { path: "markets", element: withSuspense(<MarketsPage />) },
      { path: "watchlist", element: withSuspense(<WatchlistPage />) },
      { path: "portfolio", element: withSuspense(<PortfolioPage />) },
      { path: "news", element: withSuspense(<NewsPage />) },
      { path: "settings", element: withSuspense(<SettingsPage />) },
      { path: "coin/:id", element: withSuspense(<CoinDetailPage />) },
      { path: "*", element: withSuspense(<NotFoundPage />) },
    ],
  },
]);
