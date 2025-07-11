# DropDaily Monorepo

## Overview

DropDaily is an AI‑powered content discovery platform that delivers a curated daily feed (the **Daily Drop**) to time‑poor knowledge workers. This repository contains **all** source code and infrastructure for:

* **Web** – public landing, onboarding funnel, user app
* **Admin** – internal dashboard for content ingestion & moderation
* **Edge Functions** – serverless ingestion workers (YouTube, RSS, Reddit…)
* **Shared Packages** – UI components, hooks, database schema & utilities

## Repository Layout

```
apps/
  web/       – user‑facing application (React + Tailwind)
  admin/     – content & ops dashboard
  functions/ – Supabase Edge Functions (Deno)
packages/
  ui/        – shared design system (shadcn‑ui)
  lib/       – shared TypeScript helpers (Supabase client, embeddings)
  db/        – SQL migrations & schema docs
```

*(The actual folder names may evolve; keep this diagram in sync.)*

## Prerequisites

* **Git** ≥ 2.40
* **Node.js** ≥ 18 LTS
* **pnpm** ≥ 9 (preferred) or Yarn
* **Supabase CLI** – for local DB & function emulation
* **Vercel CLI** (optional) – for preview deployments

## First‑time Setup

1. **Clone** the repo from GitHub.
2. Run `pnpm install` to fetch workspace dependencies.
   *(Avoid global installs; pnpm handles version consistency.)*
3. Copy `.env.example` → `.env` and fill in:

   * `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
   * `OPENAI_API_KEY`, `YOUTUBE_API_KEY` …
4. **Start Supabase locally** with `supabase start` to spin up Postgres + auth + storage.
5. Apply migrations: `supabase db reset` (this will load SQL in `packages/db/migrations`).
6. In a second terminal, run `pnpm dev:web` and `pnpm dev:admin` to launch both apps.
   (Each script is defined in the root `package.json`.)
7. Navigate to `http://localhost:3000` (web) and `http://localhost:3001` (admin).

## Edge Functions (Ingestion)

* The `apps/functions` directory hosts Deno source files.
* Deploy to Supabase with `supabase functions deploy <name>`.
* Cron schedules are set in the Supabase dashboard under **Edge Functions → Schedules**.

## Contribution Guidelines

* Follow standard **GitHub Flow** (feature branches + PRs).
* Run `pnpm test` before pushing.
* Each PR must update docs & Typescript types where relevant.

## Roadmap Snapshot

* **v0.1.0 – MVP**: unified schema, YouTube ingestion, Daily Drop algorithm.
* **v0.2.0 – Growth**: RSS & Reddit ingestion, mobile PWA, push notifications.
* **v1.0.0 – Launch**: Pro subscription tier, payment integration, observability.

## License

MIT © DropDaily 2025
# dd
