# Contributing · Where Things Go

Eight rules. If you follow them, the repo stays navigable at any team size. If a change doesn't fit a rule, update the rule in the same PR, don't just break it quietly.

## 1. Pages and API routes
New page → `app/<route>/page.tsx`. New endpoint → `app/api/<name>/route.ts`.
The folder name IS the public URL. Name it carefully: renaming later is an SEO event, not a refactor.

## 2. Route-local vs shared components
Used by **one** route tree only → colocate it in that route's `_components/` (e.g. `app/ctrla/_components/`).
Used by **two or more** route trees → it belongs in `components/`.
Never import another route's `_components`. If you're tempted, the component just became shared: move it to `components/` first.

## 3. Which `components/` folder
- JSON-LD structured data → `components/` schema group
- Animation or visual effect → effects group
- Cross-page section (nav, footer, team, hero) → sections group
- Third-party glue (analytics, chat, auth buttons) → providers group
- Primitive (button, card, dialog) → `components/ui/`
- Feature-specific → the folder matching its route name

(The physical schema/effects/sections/providers folders land with the components regroup batch. Until then, match the nearest existing convention.)

## 4. `lib/` vs `utils/`
Everything goes in `lib/`: domain logic, helpers, types, config, generators.
The only exception is `utils/supabase/`: the Supabase client factories stay there because that is where the Supabase SSR convention (and every tutorial) puts them. Do not add anything else to `utils/`.

## 5. Database changes
SQL and schema docs live in `supabase/` (`sql/` for runnable setup files, `docs/` for plans and notes).
If your PR changes a table, it includes a file there. Same PR, no exceptions: those files are the only record of the schema.

## 6. Content vs docs vs downloads
- Code reads it → `content/` (markdown the app parses) or `data/` (typed TS modules)
- Humans read it → `docs/` (internal business docs go in `docs/internal/`)
- Users download it → `public/`

`content/blog/` and `content/dailies/` have hardcoded paths in code. Never move or rename them.

## 7. Blog posts
Markdown post → drop it in `content/blog/`, the dynamic route picks it up.
Custom-designed post → `app/blog/<slug>/page.tsx`, following `.claude/blog-design-standard.md` (colors, fonts, and structure are non-negotiable · canonical reference: `app/blog/restaurant-atlanta/page.tsx`).

## 8. Static assets
Into the matching `public/` topic folder (`teammembers/`, `casestudy/`, `ctrla/`, ...). Team member images are `.webp` only.
Nothing loose at `public/` root except favicons, `site.webmanifest`, `llms.txt`, and search verification files.
Never put images inside `app/` route folders: they can't be served from there.

---

Voice reminder for anything user-facing: grounded, warm, refined. No em dashes, ever. See `ROV-BRAIN.md`.
