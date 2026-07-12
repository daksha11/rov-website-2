# Codebase Audit · rov-website-2

**Date:** 2026-07-12
**Scope:** Full folder structure and repo hygiene, verified against the live tree (not the docs). Includes an after-the-fact check of the recent `public/` reorg.
**Method:** Every claim below was verified with greps and file reads. Import counts are real counts, not estimates.

---

## 1. Executive summary · the 9 biggest structural issues

1. **You ship dead code.** The entire `components/ctrla/` folder (9 files) has zero importers. So does `components/_archive/` (1 file, still compiled by TypeScript) and `utils/supabase.ts` (a loose Supabase client that nothing uses, superseded by `utils/supabase/`). Roughly 11 files exist purely to confuse the next person.
2. **The architecture docs describe a site that no longer exists.** `ARCHITECTURE.md` and `TECHNICAL-GUIDE.md` both reference `components/Header.tsx` and `Navigation.tsx` (neither exists), claim analytics is "Microsoft Clarity" (reality: Clarity + Google Analytics + Klaviyo), and never mention the entire credits/daily/predictions/Klaviyo/OG layer that now powers CTRL-A.
3. **Internal business documents are tracked in the public-facing repo.** Three `.doc` audit files, `funcs.txt` (orphaned, referenced nowhere), and `.bolt/` scaffolding are all in git history. Two newer `.doc` files and an Office temp file sit untracked at root. Meanwhile `docs/` holds one file.
4. **`components/` has five naming conventions and no grouping rule.** 37 loose files (which categorize cleanly into schema emitters, effects, site sections, and providers) sit beside feature folders named `Web-Dev`, `sound_page`, `casestudy`, `ai-automation`, and `_archive`. Five conventions, one folder.
5. **The `public/` reorg left a small blast radius.** One broken reference in live code (`/casestudy/casestudyheroimg.webp`), one not-on-disk path in the Claude course (`/skills/brand-voice/SKILL.md`), and 4 leftover duplicate files. Otherwise the reorg was clean: all 22 moves were tracked as 100% renames and no top-level folder is orphaned.
6. **Database schema lives in a folder called `utils/spbase-docs/`.** Eight SQL and markdown files that define your Supabase tables, hidden under a typo'd name inside a utilities folder. This is the source of truth for your data layer and it is nearly undiscoverable.
7. **The `lib/` vs `utils/` rule exists but only in people's heads.** The de facto pattern is coherent (Supabase infrastructure → `utils/`, product logic → `lib/`) but it is written down nowhere, and small inconsistencies are creeping in (`lib/brand-kit/utils/` contains both `colorUtils.ts` and `color-utils.ts`).
8. **`content/` mixes machine-read content with human documents.** Only `content/blog/` (runtime) and `content/dailies/` (seed script) are consumed by code. `content/social/`, `content/seo-geo/`, `content/intake/`, `content/review-queue/` are human docs living beside them with nothing marking the difference.

9. **Two unreachable route surfaces on the main site.** `app/ai/` holds only an error boundary (the `/ai` URL is config-redirected to `/ai-automation` before routing runs) and `app/casestudy/aysegul-ikna/page.tsx` can never render (config 301s it to `/casestudy/ikna`). Plus two unreferenced images stranded inside `app/` route folders instead of `public/`, one of which is the missing file behind the broken `ogImage` reference.

**What is genuinely healthy:** route-local `_components`/`_lib`/`_data` folders have zero cross-boundary leaks, `middleware.ts` is minimal and sane, `data/` is fully code-consumed, all 19 top-level `public/` folders are referenced, and the `.gitignore` already covers tsbuildinfo, Office temp files, and video backups.

---

## 2. Seed items · verified verdicts

| # | Seed claim | Verdict |
|---|---|---|
| 1 | Duplicate Supabase homes | **Real.** `utils/supabase.ts` has zero importers · dead code. `utils/supabase/` is canonical (client.ts: 9 importers, server.ts: 4, admin.ts: 5, middleware.ts: 1 via root `middleware.ts`). `spbase-docs/` is manual-run SQL, never read by code. |
| 2 | `lib/` vs `utils/` with no rule | **Half real.** A consistent de facto rule exists (Supabase infra → utils, everything else → lib) but it is undocumented, and `utils/` also shelters the misnamed `spbase-docs/`. |
| 3 | Root-level clutter | **Real, worse than flagged.** 3 of 5 `.doc` audits are tracked in git, `funcs.txt` is tracked and orphaned, `.bolt/` is tracked and not gitignored. The `~$` temp file and `tsconfig.tsbuildinfo` are already ignored (good). |
| 4 | `components/` flat-plus-nested mix | **Real, plus a new finding.** The 37 loose files categorize cleanly (7 schema, 11 effects + 2 css, 14 sections, 3 providers). `_archive/` has zero importers. **New:** the entire `components/ctrla/` folder (9 files) is dead code with 16 broken `/assets/...` image references inside it. |
| 5 | Content scattered | **Real but more coherent than it looks.** Each home has a distinct role (see §5). The problem is that human docs are shelved inside `content/` beside machine-read content, and none of it is labeled. |
| 6 | Route-local `_components` rules | **Real, and currently healthy.** Zero cross-boundary imports found. The rule just needs writing down before someone breaks it. |
| 7 | Docs vs code drift | **Real, significant.** Full list in §6. |
| + | Recent `public/` reorg | **Mostly clean.** Commit `4582593` moved 22 files as clean renames. Residue: 1 live broken ref, 1 not-on-disk course path, 4 duplicate leftovers, 19 broken refs confined to dead code. |

---

## 3. Top-level directory map · health verdicts

| Directory | What it holds | Who uses it | Verdict |
|---|---|---|---|
| `app/` | All routes, API handlers, route-local `_components`/`_lib`/`_data`/`_volumes` | Next.js router | **Keep as-is.** URLs are live; do not move route folders. Document the route-local rule. |
| `components/` | 137 files: 37 loose + 12 feature folders | Whole app | **Reorganize internally.** Group loose files, delete `_archive/` and `components/ctrla/`, normalize folder names. |
| `lib/` | Domain logic: blog, brand-kit generator, credits config, daily logic, `cn()`, types | 60+ import sites | **Keep.** Becomes the documented home for all non-Supabase logic. |
| `utils/` | `supabase/` client factories + dead `supabase.ts` + `spbase-docs/` | 19 import sites (all `supabase/`) | **Slim down.** Delete dead file, relocate SQL docs, keep `utils/supabase/` (Supabase SSR convention). |
| `hooks/` | `useCredits`, `useLeadSync`, `brand-kit/` (usePoints, useToast) | 10 import sites | **Keep as-is.** |
| `data/` | 4 TS data modules (testimonials, faq, approach-steps, coastlines) | 8+ import sites | **Keep as-is.** All live imports. |
| `content/` | `blog/` (runtime), `dailies/` (seed script), + 5 human-doc folders | `lib/blog.ts`, `scripts/seed-dailies.mjs` | **Split.** Machine-read stays; human docs move to `docs/`. |
| `docs/` | 1 file (the Fable audit prompt) | Humans | **Becomes the internal docs home.** Root `.doc`/audit files move here. |
| `public/` | 197 MB, ~962 files, 19 top-level folders | Static serving | **Keep structure.** Fix 2 live refs, delete 4 duplicate files. Reorg was otherwise clean. |
| `scripts/` | capture-toolshots, free-port, seed-dailies | npm scripts / manual | **Keep as-is.** All three are live tooling. |
| `.bolt/` | bolt.new scaffolding (3 files) | Nothing | **Delete and untrack.** Leftover from the original scaffold. |
| `.video-backup-original/` | 9 pre-optimization MP4s | Nothing | **Already gitignored.** Fine to keep locally; consider moving outside the repo folder. |
| `.gstack/` | Local tooling | gstack | **Already gitignored.** Leave alone. |
| Root files | 5 `.doc` audits, `funcs.txt`, `~$` temp, misc `.md` | Humans | **Relocate or delete.** See Batch 2 in the restructure plan. |

---

## 4. Ranked problems · worst first

### P1 · Dead code that reads as live code
**Issue:** `components/ctrla/` (9 files: HeroSection, ToolkitSection, CreativeFriction, Culture, CardTemplate, BookACall, BentoFlipGallery, BrandKitSection, GlobalTeamGlobe) has zero importers. The real CTRL-A UI lives in `app/ctrla/_components/` (32 files). `components/_archive/Services_FolderPopout_v1.tsx` also has zero importers but is still compiled. `utils/supabase.ts` constructs its own Supabase client that nothing imports.
**Why it hurts at scale:** A new engineer looking for CTRL-A components has a 50/50 chance of editing the dead folder. The dead files also contain 19 broken asset references that will pollute any future broken-link audit.
**Fix:** Delete all three. Zero import impact, verified.

### P1b · Ghost routes and stray binaries on the main site
**Issue:** `app/ai/` contains only an `error.tsx` · no page exists, and `next.config.js` permanently redirects `/ai` → `/ai-automation` before routing runs, so the folder is unreachable. `app/casestudy/aysegul-ikna/page.tsx` is a full page component that can never render: the config 301s that URL to `/casestudy/ikna` first, and nothing links to it. Two unreferenced binaries sit inside route folders where static assets don't belong: `app/ai-automation/image.png` and `app/casestudy/casestudyheroimg.png`.
**Why it hurts at scale:** Ghost routes look like real surface area to anyone auditing the site. And the stranded `casestudyheroimg.png` is the direct cause of the broken `ogImage` ref in P5: the code asks for a `.webp` in `public/casestudy/` that only exists as an unservable `.png` inside `app/`.
**Fix:** Delete `app/ai/` and the `aysegul-ikna` page (redirects already preserve the URLs). Move `casestudyheroimg` into `public/casestudy/` as `.webp` to heal the ref; delete the unreferenced `image.png`.

### P2 · Architecture docs actively mislead
**Issue:** See §6 for the full drift list. Highlights: two claimed components don't exist, three analytics systems where docs claim one, and the entire gamification/email layer (6 API route groups, 2 lib modules, 2 hooks, service-role Supabase client) is invisible in the docs.
**Why it hurts at scale:** Docs that are 70% right are worse than no docs. People trust them, then build on wrong assumptions.
**Fix:** Move both into `docs/`, then regenerate the structural sections from the live tree (the README and internal map in this project supersede most of their content).

### P3 · Internal business documents in the product repo
**Issue:** `CTRL-A-Execution-Plan`, `CTRL-A-Full-Site-Audit`, `ROV-Website-Audit` (.doc, tracked in git history), plus untracked `CTRL-A-Gating-Architecture.doc`, `ROV-Service-Pages-Audit.doc`, `CTRL-A-Gamification-Architecture.md`, and orphaned `funcs.txt` (tracked). `.bolt/` scaffolding is tracked and not gitignored.
**Why it hurts at scale:** Anyone who ever gets repo access (contractor, open-sourcing, a leaked token) gets your internal strategy docs. And root-level noise is the first thing every new engineer sees.
**Fix:** Move keepers to `docs/internal/`, delete `funcs.txt` and `.bolt/`, extend `.gitignore`.

### P4 · `components/` grouping and naming
**Issue:** 37 loose files in 4 natural categories; 5 folder-naming conventions (`Web-Dev`, `sound_page`, `casestudy`, `ai-automation`, `_archive`).
**Why it hurts at scale:** "Where do I put a new component?" currently has no answer, so the flat pile grows. Case-sensitive deploy targets (Linux) also make `Web-Dev` a standing rename hazard.
**Fix:** Introduce `schema/`, `effects/`, `sections/`, `providers/` groups; normalize folder names to kebab-case. Import-heavy (NavDoc: 21 importers, Footer: 14, BreadcrumbSchema: 12) so this is a scripted-rename batch with a full build check.

### P5 · `public/` reorg residue
**Issue:** Live broken ref: `/casestudy/casestudyheroimg.webp` in [design.ts:27](app/resources/toolkits/_content/design.ts#L27). Not-on-disk: `/skills/brand-voice/SKILL.md` in [ClaudeCourseContent.tsx:501](app/ctrla/claude-code/ClaudeCourseContent.tsx#L501). Duplicates: `ctrla/CTRL A_3D logo_black.png` + `ctrla/CTRL A_flat logo_black.png` (originals in `ctrla/Logos/`), `soundpage/sophie.webp` (real one: `clients/sophie.webp`), `thumbnails/fashion2.webp` (real one: `casestudy/ikna/fashion2.webp`).
**Why it hurts at scale:** Broken images fail silently in production and dupes drift out of sync.
**Fix:** Point the design.ts ref at an existing image, decide whether the SKILL.md should exist under `public/skills/` or be removed from the course copy, delete the 4 unreferenced duplicates.

### P6 · Database schema is undiscoverable
**Issue:** 8 SQL/markdown files defining the credits, daily, predictions, points, and roles tables live in `utils/spbase-docs/`.
**Why it hurts at scale:** These files are the only record of your database schema. At team size 3+, the person setting up a new Supabase environment will not find them.
**Fix:** Move to a root `supabase/` folder (`supabase/migrations-manual/` + `supabase/docs/`), matching the Supabase CLI convention you would adopt anyway when migrations get automated.

### P7 · Unwritten `lib/` vs `utils/` rule
**Issue:** The pattern is real but tribal. Small drift already: `lib/brand-kit/utils/colorUtils.ts` and `color-utils.ts` coexist.
**Fix:** One paragraph in CONTRIBUTING (Batch 4 writes it), plus reconcile the colorUtils pair.

### P8 · `content/` role ambiguity
**Issue:** Machine-read folders (`blog/`, `dailies/`) sit beside human-doc folders (`social/`, `seo-geo/`, `intake/`, `review-queue/`, `drafts/`, `analytics/`).
**Why it hurts at scale:** Someone will eventually "clean up" a folder the build depends on, or ship a draft because it looked like publishable content.
**Fix:** `content/` keeps only what code reads. Human workflow docs move under `docs/content-pipeline/` (or the ROV brain folder outside the repo, your call).

---

## 5. Content homes · actual roles (verified)

| Home | Role | Consumed by |
|---|---|---|
| `content/blog/` | Blog posts, markdown | `lib/blog.ts` at runtime (`fs.readFileSync`) |
| `content/dailies/` | Daily taste-test batches | `scripts/seed-dailies.mjs` at seed time → Supabase |
| `content/social/`, `seo-geo/`, `intake/`, `review-queue/`, `drafts/`, `analytics/` | Human working documents | Nobody in code |
| `data/` | Structured site data as TS modules | Direct imports (8+ files) |
| `public/ctrla/vault/` | Downloadable lead magnets | `<a download>` hrefs in PromptVault + Claude course |

The split is defensible: markdown that code parses → `content/`, typed data → `data/`, user-downloadable files → `public/`. It just needs to be documented, and the human docs need to move out.

---

## 6. Docs drift · concrete wrong claims

| Doc claim | Reality |
|---|---|
| `components/Header.tsx`, `components/Navigation.tsx` (both docs) | Neither exists. Navigation is `NavDoc.tsx` (21 importers). |
| Analytics: "Microsoft Clarity" (ARCHITECTURE.md:232) | Clarity + Google Analytics + Klaviyo onsite tracking, all in `app/layout.tsx`. |
| `app/api/` = `chat/proxy` only | Actual: `chat`, `credits`, `daily`, `klaviyo`, `og`, `predictions`. |
| `lib/` = blog, types, utils, registry, brand-kit | Missing: `lib/credits/`, `lib/daily/`. |
| `hooks/` = `brand-kit/` only | Missing: `useCredits.ts`, `useLeadSync.ts`. |
| `utils/supabase/` = "Database client setup" | Missing: `admin.ts` service-role client (bypasses RLS, used by 5 API routes). |
| `ctrla/` = "CTRL-A Magazine" | Missing: `credits/`, `daily/`, `vol/`, `the-fold/`, `tape3/`, `cookbook/`, `dreamasia/`, `toolkit/`, `pitchdeck/`, `brand-kit/`. |
| No mention | `app/works`, `app/ai`, `app/portal` (ARCHITECTURE.md), `sitemap-index.xml/`, `video-sitemap.xml/` route handlers, `robots.ts`, `sitemap.ts`. |

Also worth knowing: root `middleware.ts` protects nothing. It only refreshes the Supabase session on every request. Any "protected" route (admin, portal, the future internal map) is gated at the page level, not the middleware level.

---

## 7. Naming inconsistencies

| Where | Inconsistency | Suggested normal form |
|---|---|---|
| `components/Web-Dev/` | Only capitalized folder in the repo | `components/web/` (kebab, matches route `app/web`) |
| `components/sound_page/` | Only snake_case folder | `components/sound/` (matches route `app/sound`) |
| `components/casestudy/` | Unseparated, peers are hyphenated | Leave (matches live route `app/casestudy`) or note the pairing rule |
| `utils/spbase-docs/` | Typo'd abbreviation of "supabase" | `supabase/` at root |
| `lib/brand-kit/utils/colorUtils.ts` + `color-utils.ts` | Same concept, two casings, same folder | Merge into `color-utils.ts` |
| `lib/types.ts` + `lib/brand-kit/types.ts` | Duplicate filename, different scopes | Acceptable (scoped), document the pattern |
| `videoFrames/` in public | Only camelCase public folder | Cosmetic only; renaming touches asset URLs, skip |

---

## 8. Risky-to-touch registry

Do not move these without the specific care noted:

- **Anything under `app/`**: folder names are live URLs. Renames change public URLs and burn SEO. No batch in the restructure plan touches a route folder.
- **`components/NavDoc.tsx`** (21 importers), **`Footer.tsx`** (14), **`BreadcrumbSchema.tsx`** (12), **`common/ErrorFallback.tsx`** (10, one per route-segment `error.tsx`): highest blast radius on any components regroup.
- **`utils/supabase/`**: 19 import sites plus a dynamic import in root `middleware.ts` that a grep for static imports will miss. If ever renamed, `middleware.ts` must be updated by hand.
- **`lib/utils.ts`**: 20 importers plus a config reference in `components.json` (shadcn). A rename must update that JSON too.
- **`public/` paths**: referenced as string literals (including `encodeURI("/ctrla/Assets and Textures/...")`). Renaming public folders means find-and-replace across strings, not imports. Avoid unless broken.
- **`content/blog/`**: path is hardcoded in `lib/blog.ts` (`process.cwd() + "content/blog"`). Moving it breaks the blog at runtime, not build time.

---

*Companion document: [RESTRUCTURE-PLAN.md](RESTRUCTURE-PLAN.md) · the target tree and the batch-by-batch migration.*
