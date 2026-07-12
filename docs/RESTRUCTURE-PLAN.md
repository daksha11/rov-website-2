# Restructure Plan · rov-website-2

**Date:** 2026-07-12
**Companion:** [CODEBASE-AUDIT.md](CODEBASE-AUDIT.md) · the evidence behind every move here.
**Guiding constraint:** No batch touches a route folder under `app/`. Zero public URLs change. Zero redirects needed. Every batch keeps `npm run build` green and is small enough to review as one PR.

---

## 1. Target tree

```
rov-website-2/
├── app/                        # Routes only. Folder = URL. Route-local code in _folders.
│   ├── api/                    # All server endpoints (chat, credits, daily, klaviyo, og, predictions)
│   ├── ctrla/                  # CTRL-A product surface (_components, _lib, _volumes stay colocated)
│   └── ...                     # (unchanged · no route folder moves in this plan)
│
├── components/                 # Shared UI. If it's used by 2+ route trees, it lives here.
│   ├── schema/                 # JSON-LD emitters (7 files, was loose)
│   ├── effects/                # Visual/animation components (11 + 2 css, was loose)
│   ├── sections/               # Cross-page site sections: Footer, NavDoc, TeamSection... (14, was loose)
│   ├── providers/              # ClarityProvider, ChatWidget, GoogleLoginButton (3, was loose)
│   ├── ui/                     # Primitives (unchanged)
│   ├── common/                 # Shared composites (unchanged)
│   ├── blog/ · casestudy/ · brand-kit/  (unchanged)
│   ├── web/                    # was Web-Dev/
│   ├── sound/                  # was sound_page/
│   ├── ai-automation/ · video-production/  (unchanged)
│   └── (deleted: _archive/, ctrla/)
│
├── lib/                        # ALL domain logic, helpers, types, config. The default home.
├── utils/                      # Supabase client factories ONLY (utils/supabase/). Nothing else.
├── hooks/                      # Shared React hooks (unchanged)
├── data/                       # Typed site data modules (unchanged)
│
├── supabase/                   # NEW · database source of truth (was utils/spbase-docs/)
│   ├── sql/                    # *.sql setup files, run manually against Supabase
│   └── docs/                   # points-system-plan.md, user-role-management.md
│
├── content/                    # ONLY machine-read content
│   ├── blog/                   # read at runtime by lib/blog.ts (path is hardcoded · never move)
│   └── dailies/                # read by scripts/seed-dailies.mjs
│
├── docs/                       # Internal documentation home
│   ├── CODEBASE-AUDIT.md · RESTRUCTURE-PLAN.md · FABLE-CODEBASE-AUDIT-PROMPT.md
│   ├── ARCHITECTURE.md · TECHNICAL-GUIDE.md      # moved from root, then refreshed
│   ├── internal/               # the .doc business audits, gamification/gating plans
│   └── content-pipeline/       # was content/{social,seo-geo,intake,review-queue,drafts,analytics}
│
├── public/                     # Static assets (structure unchanged; refs fixed, dupes removed)
├── scripts/                    # Build/ops scripts (unchanged)
├── middleware.ts · next.config.js · tailwind.config.ts · tsconfig.json
├── CLAUDE.md                   # stays at root (tooling reads it there)
├── ROV-BRAIN.md                # stays at root (referenced by content skills)
└── README.md                   # NEW · Deliverable 3, written after this plan is approved
```

**One-line rationale per decision:**
- `app/` untouched: routes are URLs; SEO equity stays intact.
- `components/` gets 4 group folders: the 37 loose files already fall into exactly these categories, we're naming what exists.
- `lib/` is the default home for logic: it already holds 90% of it; the rule becomes explicit.
- `utils/` shrinks to Supabase only: matches the Supabase Next.js SSR convention, so tutorials and future hires find it where they expect.
- `supabase/` at root: schema files are infrastructure, not utilities, and this matches the Supabase CLI layout you would adopt for real migrations.
- `content/` = machine-read only: if code doesn't read it, it isn't content, it's documentation.
- `docs/` = everything humans read: one obvious place, out of the root, out of `content/`.

---

## 2. Migration batches · lowest risk first

Every batch ends with: `npm run build` passes, spot-check `npm run dev` on one affected page.

### Batch 1 · Delete dead code (zero import impact, verified)
| Operation | Evidence |
|---|---|
| `git rm utils/supabase.ts` | 0 importers |
| `git rm -r components/_archive/` | 0 importers (was still being compiled) |
| `git rm -r components/ctrla/` | 0 importers across all 9 files; live CTRL-A UI is `app/ctrla/_components/` |
| Delete `~$o-audit-rovstudios-full-2026-06-25.docx` (untracked local file) | Office temp turd |
| `git rm funcs.txt` | Referenced nowhere |
| `git rm -r .bolt/` + add `.bolt/` to `.gitignore` | bolt.new scaffolding, unused |
| `git rm -r app/ai/` | Ghost route: only an `error.tsx`, and `next.config.js` 301s `/ai` → `/ai-automation` before routing runs |
| `git rm -r app/casestudy/aysegul-ikna/` | Unreachable page: config 301s the URL to `/casestudy/ikna`; nothing links to it |
| `git rm app/ai-automation/image.png` | Unreferenced binary inside a route folder |

Imports affected: none. Routes affected: none. Also removes 19 of the 21 broken asset references for free (they lived in the dead files).

### Batch 2 · Docs consolidation (no code changes)
| Operation | Notes |
|---|---|
| `git mv ARCHITECTURE.md TECHNICAL-GUIDE.md docs/` | Refresh their structural sections afterward (Deliverable 3 supersedes much of both) |
| Move the 5 `.doc` audits + `CTRL-A-Gamification-Architecture-2026-07-11.md` + `ROV-Service-Pages-Audit-2026-07-11.doc` → `docs/internal/` | 3 are tracked (git mv), 3 are untracked (plain move) |
| Move `real-estate-agents-playbook.html` → `docs/internal/` or delete | Currently deleted in working tree but tracked · decide keep-or-kill |
| `.gitignore` additions: `.bolt/` (from Batch 1) | `~$*`, `*.tsbuildinfo`, `.video-backup-original/` already covered |
| Decide: should `docs/internal/` be gitignored entirely? | If these audits shouldn't live in git history at all, ignore the folder and keep it local-only |

Imports affected: none. Routes affected: none.

### Batch 3 · Fix `public/` reorg residue (4 deletes, 2 ref fixes)
| Operation | Evidence |
|---|---|
| Fix `/casestudy/casestudyheroimg.webp` in [app/resources/toolkits/_content/design.ts:27](../app/resources/toolkits/_content/design.ts#L27) | Root cause found: the image exists as an unservable `app/casestudy/casestudyheroimg.png`. Convert to webp, move to `public/casestudy/`, ref heals |
| Decide `/skills/brand-voice/SKILL.md` in [ClaudeCourseContent.tsx:501](../app/ctrla/claude-code/ClaudeCourseContent.tsx#L501) | Either add the file under `public/skills/brand-voice/` or update the course copy |
| Delete `public/ctrla/CTRL A_3D logo_black.png` + `public/ctrla/CTRL A_flat logo_black.png` | Unreferenced duplicates of `public/ctrla/Logos/` originals |
| Delete `public/soundpage/sophie.webp` | Unreferenced; live one is `public/clients/sophie.webp` (testimonials.ts:62) |
| Delete `public/thumbnails/fashion2.webp` | Unreferenced; live one is `public/casestudy/ikna/fashion2.webp` |

Imports affected: 1 string literal. Routes affected: none.

### Batch 4 · Database home + the lib/utils rule
| Operation | Notes |
|---|---|
| `git mv utils/spbase-docs supabase` then split: `*.sql` → `supabase/sql/`, `*.md` → `supabase/docs/` | 0 code references, pure file move |
| Merge `lib/brand-kit/utils/colorUtils.ts` + `color-utils.ts` → one `color-utils.ts` | Check importers of each first; update the losing side's imports |
| Write the contributor rules (see §3) into `CONTRIBUTING.md` at root | One page, not a novel |

Imports affected: colorUtils importers only (small, brand-kit-internal). Routes affected: none.

### Batch 5 · `components/` regroup (highest touch count, do last, one sitting)
| Operation | Import updates required |
|---|---|
| `git mv` the 7 `*Schema.tsx` → `components/schema/` | ~35 import lines (BreadcrumbSchema alone: 12 files) |
| `git mv` the 11 effects + 2 css → `components/effects/` | ~20 import lines |
| `git mv` the 14 sections → `components/sections/` | ~45 import lines (NavDoc: 21, Footer: 14) |
| `git mv` ChatWidget, ClarityProvider, GoogleLoginButton → `components/providers/` | ~6 import lines |
| `git mv components/Web-Dev components/web` | Do as two-step rename on Windows (`web-tmp` → `web`) so git registers the case change |
| `git mv components/sound_page components/sound` | Update its importers |

Method: scripted find-and-replace on the `@/components/...` specifiers, then `npm run build` must pass with zero unresolved-module errors before commit. All changes are internal module paths · zero URL impact.
Optional add-on: barrel files (`components/schema/index.ts`) to make future moves cheaper. Skip if you prefer explicit paths.

### Batch 6 · `content/` split
| Operation | Notes |
|---|---|
| Move `content/social/`, `content/seo-geo/`, `content/intake/`, `content/review-queue/`, `content/drafts/`, `content/analytics/` → `docs/content-pipeline/` | 0 code references, verified. `content/blog/` and `content/dailies/` DO NOT MOVE (hardcoded paths in `lib/blog.ts` and `seed-dailies.mjs`) |
| Drop a `content/README.md` one-liner: "Everything in this folder is read by code. Human docs live in /docs." | The guardrail that keeps it clean |

Imports affected: none. Routes affected: none.

### After approval · Deliverables 3 and 4
- **README.md** at root: identity, quick start, folder map (matching the target tree above), integrations map, "where do I add X" table.
- **Internal architecture map page**: gated route + `map-data.ts`-driven diagram. Note from the audit: root `middleware.ts` protects nothing, so the gate must reuse the page-level auth check that `app/admin/page.tsx` uses (Supabase client + role check), plus `robots` noindex metadata and exclusion from `app/sitemap.ts`.

---

## 3. The rules (draft for CONTRIBUTING.md)

1. **New page or API route** → `app/<route>/page.tsx` or `app/api/<name>/route.ts`. The folder name is the URL. Think before naming; renames are SEO events.
2. **Route-local vs shared component** → used by one route tree only: colocate in that route's `_components/`. Used by 2+ route trees: `components/<group>/`. Never import another route's `_components` · if you need to, the component is shared, move it.
3. **Which components group** → JSON-LD: `schema/`. Animation/visual effect: `effects/`. Cross-page section: `sections/`. Third-party glue: `providers/`. Primitive: `ui/`. Feature-specific: the feature folder matching its route name.
4. **`lib/` vs `utils/`** → everything goes in `lib/` except Supabase client factories, which stay in `utils/supabase/` (Supabase SSR convention). Do not add anything else to `utils/`.
5. **Database changes** → SQL and schema docs go in `supabase/`. If it changes a table, it gets a file there, same PR.
6. **Content vs docs** → code reads it: `content/` or `data/`. Humans read it: `docs/`. Users download it: `public/`.
7. **New blog post** → markdown in `content/blog/` (dynamic route) or a custom `app/blog/<slug>/page.tsx` following `.claude/blog-design-standard.md`.
8. **Assets** → into the existing `public/` topic folder. No loose files at `public/` root except favicons/manifest/verification.

---

## 4. What this plan deliberately does not do

- **No route renames.** `app/casestudy` stays unhyphenated, `app/ctrla` stays. URLs outrank tidiness.
- **No `public/` folder renames.** `videoFrames/` stays camelCase; asset paths are string literals and the churn isn't worth it.
- **No lib/utils merge.** Keeping `utils/supabase/` where every Supabase tutorial puts it is worth more than one fewer top-level folder.
- **No big-bang commit.** Six small batches, each independently revertable.

---

**Status: awaiting approval.** Nothing has been moved, deleted, or renamed. On approval, batches execute in order (1 → 6), then the README and the internal map page get built.
