# Fable Prompt — Codebase Structure Audit + README + Internal Map

Paste everything below the line into Fable (claude-fable-5) from the repo root. It is written to make Fable *verify against the real tree*, not guess, and to deliver in a specific order so you can approve each stage before it touches files.

---

You are auditing the folder structure and repo hygiene of the Range Of View website (Next.js App Router, TypeScript, Tailwind, Supabase, Klaviyo). Treat this like a scrappy studio with no money that has to be ready to scale to millions of users and dozens of contributors tomorrow. The bar: a new engineer should be able to open the repo and know where anything lives in under 60 seconds, and adding a new feature should have one obvious home.

## Recent changes to account for
We just reorganized the `public/` folder structure and made several other changes in the current working session, so parts of the tree are newer than any doc or git history suggests. Audit everything as it exists right now, after the fact. Do not assume the audit docs, `ARCHITECTURE.md`, or `TECHNICAL-GUIDE.md` reflect the current `public/` layout. Read the actual `public/` tree fresh, confirm the recent reorg is internally consistent (no orphaned references, no broken asset paths, no leftover duplicates from the move), and fold `public/` into the same navigation-and-scalability review as everything else. If you find references still pointing at old `public/` paths, flag them.

## Voice and writing rules (non-negotiable, applies to every doc, README, and code comment you produce)
- Range Of View voice: grounded, warm, refined. Substance over hype. Write like a trusted collaborator, not a corporate deck.
- NEVER use em dashes. Recast with commas, colons, periods, or a middot ( · ). This applies to every word you write.
- Read `CLAUDE.md`, `../CLAUDE.md` (the ROV brain), `ARCHITECTURE.md`, `TECHNICAL-GUIDE.md`, and `ROV-BRAIN.md` before proposing anything, so your recommendations respect existing conventions instead of fighting them.

## Ground rules for the audit
- Do NOT start moving files. Deliver the plan first and wait for approval before any migration.
- Verify every claim against the actual tree with your own file reads and greps. Do not trust the seed list below blindly. If something I flagged is wrong or already fixed, say so.
- For every proposed move, you must trace the import/route impact. This is a Next.js App Router project, so folder names under `app/` are live URLs. Moving a route folder changes the public URL and can break SEO. Flag every move that changes a URL and propose a redirect if needed.
- Prefer incremental, low-risk migration over a big-bang restructure. Group changes into small PR-sized batches that each keep the build green.
- Optimize for two readers: a future engineer navigating, and future-you scaling. Name things so intent is obvious without opening the file.

## Known problem areas to investigate (verify each, do not assume)
1. **Duplicate Supabase homes.** There is `utils/supabase/` (client, server, middleware, admin) and also a loose `utils/supabase.ts`. Determine which is canonical, whether both are imported, and consolidate. Also the SQL/setup files live under the awkwardly named `utils/spbase-docs/`. Propose a clearer home (for example `supabase/` at root, or `db/`).
2. **`lib/` vs `utils/` with no rule.** brand-kit logic lives in `lib/`, supabase lives in `utils/`, helpers are split across both. Define one clear rule for what belongs in each (or merge them) and document it.
3. **Root-level clutter.** Multiple audit documents (`CTRL-A-*.doc`, `ROV-*.doc`, `ROV-Website-Audit-*.doc`, etc.), `funcs.txt`, a leftover `~$...docx` Office temp file, `.bolt/`, and `.video-backup-original/` all sit at repo root while `docs/` is empty. Propose a home for internal docs, a `.gitignore` rule for Office temp files, and whether backup/tooling dirs should be removed or ignored.
4. **`components/` (about 48 entries) is a flat-plus-nested mix.** Loose top-level files (schema.org emitters like `OrganizationSchema.tsx`, `VideoSchema.tsx`; visual effects like `FaultyTerminal.tsx`, `DecryptedText.tsx`) sit next to feature folders (`ui/`, `common/`, `blog/`, `ctrla/`, `casestudy/`) and an `_archive/`. Propose a grouping convention (for example `components/schema/`, `components/effects/`, `components/ui/` primitives, feature folders) and what to do with `_archive`.
5. **Content scattered.** Content lives across `content/`, `data/`, and `public/ctrla/vault/`. Clarify the intended role of each and whether they should consolidate.
6. **Colocated `_components` / `_lib` / `_data` folders** exist under some routes (`app/ctrla/_components`, `app/resources/_components`). Decide when something is route-local vs shared, and make that rule explicit so people stop guessing.
7. **Docs vs code drift.** `ARCHITECTURE.md` and `TECHNICAL-GUIDE.md` exist but may be stale. Note where they disagree with the current tree.

## Deliverables, in this order

### 1. Audit report → write to `docs/CODEBASE-AUDIT.md`
- A current-state map of every top-level directory: what it holds, who imports it, and a health verdict (Keep as-is / Rename / Move / Merge / Delete).
- A ranked list of navigation and scalability problems, worst first, each with: the concrete issue, why it hurts at scale, and the specific fix.
- A "naming inconsistencies" table (for example `spbase-docs` vs `supabase`, singular vs plural folder names).
- Call out anything risky to touch (live route folders, anything imported in many places).

### 2. Target structure + migration plan → write to `docs/RESTRUCTURE-PLAN.md`
- The proposed target tree as an annotated directory diagram, with a one-line rationale per top-level folder.
- A batch-by-batch migration plan. Each batch is PR-sized, keeps the build green, lists exact `git mv` operations, the imports/routes affected, and any redirects required. Order batches lowest-risk first.
- An explicit rule set future contributors follow: "new API route goes here", "new shared component goes here", "route-local vs shared", "lib vs utils", "where docs live". This becomes a `CONTRIBUTING.md` or a section of the README.
- Do not execute yet. Stop here and ask for approval.

### 3. README → write/overwrite `README.md` at repo root
- What this project is, in ROV voice, in three sentences.
- Quick start: prerequisites, install, env setup (reference `.env.example`, do not print secrets), `npm run dev`, build, deploy target.
- The folder map: a short table of every top-level directory and its one-line purpose (kept in sync with the restructure).
- Key integrations and where they live: Supabase, Klaviyo, the chat/API routes, the CTRL-A app.
- "Where do I add X?" quick-reference (new page, new component, new API route, new blog post, new case study).
- Link to `docs/CODEBASE-AUDIT.md`, `docs/RESTRUCTURE-PLAN.md`, and the internal map page below.

### 4. Internal architecture map — a secret in-app page kept up to date
Build a gated internal page in the app that visualizes how the whole codebase fits together, so the team has a living map instead of a stale doc.
- Route: `app/internal/map/page.tsx` (or `app/admin/map` if that fits the existing admin gating better · check how `app/admin` and `app/portal` currently gate access and reuse that mechanism rather than inventing a new one).
- Gate it: not linked in any public nav, not in the sitemap, `noindex`, and behind whatever auth/role check the existing admin area uses. Confirm it cannot be reached by a logged-out visitor.
- Content: a visual, at-a-glance system map. Show the layers (App Router routes → shared components → lib/utils → Supabase/Klaviyo/external services → data/content sources) and how data flows between them. Use a rendered diagram (an inline SVG, a Mermaid diagram, or a simple boxes-and-arrows React layout · no external network calls, keep it self-contained). Include a legend and a "last updated" date.
- Make it maintainable: drive as much of the diagram as possible from a single data file (for example `app/internal/map/map-data.ts`) that lists the modules and their relationships, so updating the picture means editing one structured file, not redrawing SVG by hand. Document at the top of that file how to keep it current.
- Style it to the ROV brand kit (see `../brand-kit.md` / `tailwind.config.ts`): cream, espresso, rust, orange. It should look like us, not a default template.

## Output format for your first response
Do the reading and grepping, then give me:
1. A short summary of what you found (the 5 to 8 biggest structural issues).
2. Confirmation of which seed items above are real vs already-handled vs wrong.
3. Then produce Deliverable 1 (`docs/CODEBASE-AUDIT.md`) and Deliverable 2 (`docs/RESTRUCTURE-PLAN.md`).
4. Stop and wait for my approval before executing any file moves or building the README and internal map.
