# Contributing to Coin Tracker

Thanks for your interest in improving Coin Tracker! This is a portfolio/showcase
project, but it's built and maintained like a real production app — the same
standards apply to contributions.

## Getting started

```bash
git clone <repo-url>
cd coin-tracker
npm install
cp .env.example .env   # add your CoinGecko API key
npm run dev
```

See the [README](./README.md) for the full architecture overview and folder structure.

## Development workflow

1. Create a branch off `main`: `git checkout -b feat/short-description`.
2. Make your changes, following the conventions already used in the codebase
   (see [Code style](#code-style) below).
3. Add or update tests for any behavior you change.
4. Run the full check suite locally before opening a PR:

   ```bash
   npm run lint
   npm run test
   npm run build
   ```

5. Open a pull request using the PR template — fill in the checklist honestly.

## Code style

- **TypeScript, strictly.** No `any` unless there's genuinely no better option
  (and then it should be commented). `noUncheckedIndexedAccess` is on, so
  handle `undefined` from array/object indexing explicitly.
- **Feature-first structure.** Code specific to one feature lives under
  `src/features/<feature>/` (with its own `hooks/` and `components/`
  subfolders). Only put something in `src/components/` if it's genuinely
  shared across multiple features.
- **Server state vs. client state.** Data from the API goes through TanStack
  Query (`src/api/`, feature `hooks/`). User preferences and app state
  (theme, watchlist, portfolio) go through Zustand (`src/store/`). Don't mix
  the two.
- **Every screen needs a loading, error, and empty state.** Look at
  `src/components/feedback/` for the primitives (`Skeleton`, `ErrorState`,
  `EmptyState`) before building a new one.
- **Accessibility isn't optional.** Interactive elements need labels,
  keyboard support, and visible focus states. `eslint-plugin-jsx-a11y` will
  catch the obvious misses, but it's not a substitute for testing with a
  keyboard.
- **Formatting is automatic.** Run `npm run format` (Prettier, with the
  Tailwind class-sorting plugin) — CI will fail on unformatted code caught by
  lint-staged's pre-commit hook, but it's faster to just run it yourself.

## Commit messages

Not strictly enforced, but please try to follow
[Conventional Commits](https://www.conventionalcommits.org/) (`feat:`,
`fix:`, `refactor:`, `docs:`, `chore:`, `test:`) — it makes the changelog and
history much easier to scan.

## Reporting bugs / requesting features

Please use the issue templates — they ask for the information that's
actually needed to act on a report (repro steps, environment, etc.).
