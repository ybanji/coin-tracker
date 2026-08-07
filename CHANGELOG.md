# Changelog

All notable changes to this project are documented in this file.
The format loosely follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

### Added

- **Markets page** — debounced full-text search (via CoinGecko `/search` +
  `/coins/markets`), sortable columns, pagination, all persisted to the URL
  so a refresh or shared link preserves state. Responsive table on desktop,
  card list on mobile.
- **Coin Details page** — hero with live price/rank, multi-timeframe price
  chart (24H/7D/30D/90D/1Y) with tooltips, full statistics grid (market cap,
  volume, supply, ATH/ATL, ROI), sanitized description, official links,
  a price converter widget, and related coins by market-cap proximity.
- **Watchlist page** — full listing of starred coins with local search,
  sorting, and an empty state; the star toggle (`WatchlistButton`) is now
  shared across Markets, Watchlist, and the coin detail hero.
- **Portfolio page** — add/edit/delete holdings (coin, quantity, buy price,
  purchase date) with validated forms, a live-valued holdings table, summary
  cards (current value, invested, profit/loss), and an allocation pie chart.
  Fully client-side, persisted to `localStorage`.
- **Settings page** — theme (light/dark/system), display currency, refresh
  interval, and a compact-density mode, plus a two-step confirm reset.
- **News page** — card grid of recent crypto headlines.
- **Global search** — command-palette-style coin search in the top bar:
  debounced, keyboard-navigable (arrows + enter), with recent searches and
  loading/empty states.
- **404 page** for unmatched routes.
- **Dashboard**: added ETH dominance to the global stats bar, a live
  "last updated" indicator, and a quick-actions row (refresh all data, jump
  to Markets/Watchlist/Portfolio).
- New shared UI primitives: `Input`, `Select`, `Dialog`, `Pagination`, `Tabs`.
- Vitest + React Testing Library test suite covering formatting utilities,
  the debounce hook, the watchlist/portfolio stores, a shared component, and
  the portfolio form's validation schema.
- GitHub Actions CI (lint → typecheck → test → build), issue templates, a PR
  template, `CONTRIBUTING.md`, and this changelog.

### Changed

- Route-level code splitting: every page beyond the dashboard is now lazily
  loaded, so the initial bundle only ships what's needed for the first paint.
- Every nav item now points at a real page — the `ComingSoon` placeholder
  component has been removed.

### Fixed

- Consolidated a duplicated client-settings store (`refreshInterval` /
  `compactMode` were briefly defined in two places) back into the single
  `preferencesStore`.

## [0.1.0] — Initial scaffold

- Project setup: Vite, React 19, TypeScript (strict), Tailwind, TanStack
  Query, Zustand, React Router.
- Dashboard with global stats, trending coins, top movers, market heatmap,
  Fear & Greed index, and a watchlist preview.
- Shared design system primitives (`Button`, `Card`, `Badge`, `Skeleton`),
  feedback components (`EmptyState`, `ErrorState`, `ErrorBoundary`), theming,
  and the CoinGecko API client.
