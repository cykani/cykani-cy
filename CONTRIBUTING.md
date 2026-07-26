# Contributing to Cykani

Thanks for your interest. Here's everything you need to get started.

## How contributions work

Cykani uses a standard fork-and-PR workflow. You don't need special access — just fork the repo, make your changes, and open a pull request. Direct write access is reserved for core maintainers; everyone else contributes through PRs.

## Before you start

- Check [open issues](https://github.com/cykani/cykani-cy/issues) to see if your idea or bug is already tracked
- For anything significant (new feature, architecture change), open an issue first and describe what you want to do — this avoids you doing work that doesn't get merged
- Issues labeled [`good first issue`](https://github.com/cykani/cykani-cy/issues?q=label%3A%22good+first+issue%22) are explicitly scoped for new contributors

## Setup

**Prerequisites:** Node.js ≥20, pnpm 9, Docker (for the full stack)

```bash
git clone https://github.com/cykani/cykani-cy.git
cd cykani-cy

# Start infrastructure
docker compose up -d postgres redis

# Install dependencies
pnpm install

# Push database schema
cd apps/api && pnpm db:push && cd ../..

# Run both servers
pnpm dev
```

- Marketing site → `http://localhost:3001`
- API → `http://localhost:3000`
- API docs → `http://localhost:3000/docs`

## Project layout

```
apps/
  api/     — Hono REST API (TypeScript)
  web/     — Next.js 16 frontend
packages/
  db/      — Drizzle schema + client
  ui/      — Shared components
  types/   — Shared types
  redis/   — Redis/BullMQ wrappers
  lib/     — Shared utilities
trigger/   — Trigger.dev background jobs
```

## Running tests

```bash
# API tests
cd apps/api && pnpm test

# Frontend lint + typecheck
cd apps/web && pnpm lint && pnpm typecheck
```

## Code style

The web app uses [Biome](https://biomejs.dev/) for linting and formatting. It runs automatically on commit via Husky. If your PR fails the lint check, run:

```bash
cd apps/web && pnpm lint --write
```

The API uses TypeScript strict mode. Keep the DDD layering intact — don't reach from `infrastructure/` into `domain/` or put business logic in route handlers.

## Submitting a PR

1. Fork the repo and create a branch: `git checkout -b fix/your-description`
2. Make your changes
3. Run tests and lint — PRs that break either won't be merged
4. Open the PR against `main` with a clear description of what it does and why
5. Link the related issue if there is one

## What gets merged

- Bug fixes with a clear description of the problem
- Performance improvements with measurable impact
- Documentation improvements
- Features that have been discussed in an issue first

## What doesn't get merged

- Changes that break existing API contracts without discussion
- Adding new dependencies without justification
- Cosmetic refactors that don't fix anything

## Questions

Open an issue or join the [Discord](https://discord.gg/cykani).
