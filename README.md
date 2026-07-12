# rovstudios.com

The Range of View Studios website. We find where Atlanta businesses are losing money and fix it: this site is where the proof lives. It carries the marketing site, the blog and case studies, the client portal, and CTRL-A, our creative platform with its toolkit, daily taste test, credits, and brand-kit builder.

**Stack:** Next.js 13 (App Router) · TypeScript · Tailwind + styled-components · Supabase (auth, database, storage) · Klaviyo (email) · GSAP/Lenis/Framer Motion.

## Quick start

```bash
npm install
cp .env.example .env.local   # fill in Supabase + Klaviyo keys (ask Andi)
npm run dev                  # clears .next first, then starts on :3000
```

Other commands: `npm run build` (production build), `npm start`, `npm run lint`, `npm run analyze` (bundle size). Deploys to Vercel; production env vars live in the Vercel dashboard.

If dev throws "Cannot find module './XXXX.js'", delete `.next/` and restart (the dev script already does this).

## Folder map

| Folder | What lives there |
|---|---|
| `app/` | Routes and API endpoints. Folder = URL. Route-local code stays in that route's `_components/` / `_lib/` |
| `components/` | Shared UI: `schema/` (JSON-LD), `effects/` (animation), `sections/` (nav, footer, cross-page sections), `providers/` (analytics, chat, auth), `ui/` (primitives), `common/`, plus one folder per page family (`web/`, `sound/`, `blog/`, `casestudy/`, `brand-kit/`...) |
| `lib/` | Domain logic: blog engine, brand-kit generator, credits config, daily logic, helpers, types |
| `utils/` | `supabase/` client factories only (browser, server, service-role, middleware) |
| `hooks/` | Shared React hooks: `useCredits`, `useLeadSync`, brand-kit hooks |
| `data/` | Typed site data: testimonials, FAQs, approach steps |
| `content/` | Machine-read content only: `blog/` (runtime markdown), `dailies/` (seed batches). Paths are hardcoded, never move them |
| `supabase/` | Database source of truth: `sql/` setup files (run manually against Supabase) and `docs/` plans |
| `public/` | Static assets in topic folders. 197 MB, so keep images optimized (`.webp` preferred) |
| `docs/` | Internal documentation: audits, architecture, content pipeline, component staging |
| `scripts/` | Tooling: `seed-dailies.mjs`, `capture-toolshots.mjs`, `free-port.mjs` |

## Key integrations

- **Supabase** · clients in `utils/supabase/` (browser: 9 importers · server + service-role: API routes only). Schema in `supabase/sql/`. Root `middleware.ts` only refreshes the session; every protected page (`/admin`, `/portal`, `/internal/map`) checks `profiles.role` itself.
- **Klaviyo** · one endpoint, `app/api/klaviyo/subscribe`, fed by CtrlASignup, ToolGate, and `useLeadSync`. Onsite tracking loads in `app/layout.tsx`.
- **Analytics** · three systems in `app/layout.tsx`: Microsoft Clarity, Google Analytics, Klaviyo.
- **CTRL-A gamification** · `app/api/{credits,daily,predictions}` + `lib/credits` + `lib/daily` + `hooks/useCredits`. Writes go through the service-role client.

## Where do I add X?

| Adding... | Put it in... |
|---|---|
| A page | `app/<route>/page.tsx` · the folder name is the live URL, choose carefully |
| An API endpoint | `app/api/<name>/route.ts` |
| A component one route uses | that route's `_components/` |
| A component 2+ routes use | the matching `components/` group (see `CONTRIBUTING.md` rule 3) |
| Logic, helpers, types | `lib/` |
| A blog post | markdown in `content/blog/`, or a custom page per `.claude/blog-design-standard.md` |
| A case study | `app/casestudy/<client>/page.tsx` |
| A database change | SQL in `supabase/sql/`, same PR |
| Static assets | the matching `public/` topic folder |

Full rules: [CONTRIBUTING.md](CONTRIBUTING.md).

## Know the system

- **The living map** · `/internal/map` (admin/engineer login required, noindexed). Renders from `app/internal/map/map-data.ts`: update that file when the architecture changes.
- **[docs/CODEBASE-AUDIT.md](docs/CODEBASE-AUDIT.md)** · the 2026-07-12 structural audit: what everything is and why it's shaped this way.
- **[docs/RESTRUCTURE-PLAN.md](docs/RESTRUCTURE-PLAN.md)** · the migration that produced this layout.
- **Voice** · grounded, warm, refined, no em dashes. `ROV-BRAIN.md` is the source of truth for anything client-facing.
