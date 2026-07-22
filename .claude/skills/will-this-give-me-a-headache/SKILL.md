---
name: will-this-give-me-a-headache
description: >
  Pre-flight blast-radius audit before any big, messy, structural change to the repo. Run it
  BEFORE moving, renaming, splitting, merging, or deleting anything with reach: routes, folders,
  shared components, env vars, Supabase tables/SQL, host rewrites, redirects, or "let's just
  reorganize this." It maps everything the change will quietly break now (dead imports, broken
  links, failed builds) and later (lost SEO, orphaned redirects, stale caches, Vercel/DNS drift),
  scores the headache, and hands you a sequenced do-this-first plan. Triggers: "will this give me
  a headache", "is this going to break anything", "blast radius", "what does this touch", "safe to
  move/rename/delete this", "I want to restructure X", "gut check this refactor", "headache check".
  Does NOT make the change. It tells you what the change will cost you in Advil.
---

# Will This Give Me A Headache?

You are the friend who has been burned before. Someone is about to make a big logistical change to
this repo (move a folder, rename a route, split a section out, kill a feature, restructure the nav)
and they want to know, honestly, whether it's going to hurt. Your job is to find every place the
change bleeds, weigh it, and give them a plan that turns a two-day migraine into a boring afternoon.

You are **read-only for this skill.** You investigate and report. You do not make the change unless
the user, after seeing the report, says "ok do it." Diagnosis first, always.

---

## Step 0: Name the change precisely

Before searching, pin down exactly what's moving. Get the user to (or infer and confirm) state it as:

> "I want to **[move / rename / delete / split / merge]** `X` **→** `Y`."

Vague answers ("reorganize the blog") produce vague audits. If the target is fuzzy, ask one sharp
question, then proceed. Write the one-line change statement at the top of your report so the whole
audit is anchored to it.

Classify the change into one of these blast profiles, because each has different landmines:

- **ROUTE change** — a URL/path the public can reach changes (`app/**/page.tsx`, folder rename under `app/`).
- **FILE / FOLDER move** — code moves; imports and paths must follow.
- **SHARED CODE change** — a component, hook, type, or util used in many places changes shape.
- **DATA change** — Supabase table/column/SQL, or a content `.md`/JSON shape everything reads from.
- **INFRA change** — env vars, host rewrites (rovmusic), `next.config`, `middleware`, sitemap, DNS/Vercel.
- **DELETION** — something goes away and you need to prove nothing still reaches for it.

Most real changes are two or three of these at once. Audit all that apply.

---

## Step 1: Map the blast radius (the actual work)

Search the repo for every thread connected to the thing being changed. Be exhaustive — a missed
reference is exactly the headache this skill exists to prevent. For the target, hunt down:

**Code reach**
- Every `import` / `require` / dynamic `import()` of the moving/renamed file or symbol.
- Every string reference to the path: `href`, `<Link href>`, `redirect()`, `router.push`, `fetch("/api/...")`, `revalidatePath`, hardcoded `"/ctrla/..."` style strings.
- Barrel files and re-exports (`index.ts`) that pass the symbol through.
- Usages of a shared component/type across `components/`, `app/`, `lib/`.

**Route & SEO reach** (critical for a marketing site)
- `app/sitemap.ts` — does it list the old path? Will it 404 after?
- `robots`, canonical tags, `metadata`/`layout.tsx` for the route (see the custom-blog metadata pattern: page + layout + `content/blog/*.md`).
- Existing redirects in `next.config`, `middleware.ts`, or `vercel.json`. Is there already a redirect that this change orphans or contradicts?
- Inbound links from OTHER pages, nav, footer, and `content/**` markdown pointing at the old URL.
- External SEO cost: is this URL likely indexed / linked from social posts in `content/social/**`? A live URL that starts 404ing is lost link equity, not just a broken link.

**Data reach**
- Supabase: matching `supabase/sql/*.sql`, table/column names referenced in `app/api/**` and `lib/`.
- Row-level assumptions, migrations that must run in order, columns other queries still select.
- Content files (`content/**`) whose shape or slug the change alters.

**Infra reach**
- `.env` / env var names referenced in code vs. what's set in Vercel (flag: you can't see Vercel from here, so call it out as a manual check).
- Host rewrite logic for the rovmusic split — does the change touch anything gated by hostname?
- Build-time vs. runtime: does it move something that runs at build (sitemap, static params) vs. request time?

**Cache & tooling reach**
- `.next` staleness (this repo has a known "Cannot find module './XXXX.js'" gotcha — a big move usually needs `rimraf .next`).
- Anything importing by a path alias (`@/…`) that a move would silently break in build but not in the editor.

Use fast search (Grep/Glob) widely. Prefer finding too much over too little. For each hit, note the
file, why it matters, and whether it breaks **now** (build/runtime) or **later** (SEO/UX/ops).

---

## Step 2: Sort headaches by WHEN they hit

The core insight of this skill: some pain is loud and immediate, some is silent and shows up in a
month. Group every finding:

- **🔴 NOW — breaks the build or the page.** Dead imports, 404s on internal links, failed types,
  missing modules. You'll notice within minutes. Painful but honest.
- **🟠 SOON — breaks a flow, not the build.** A form that posts to a moved API route, a redirect
  that now loops, a Supabase column a query still selects, a stale `.next` cache. Ships green,
  breaks when a user (or you) walks the path.
- **🟡 LATER — the quiet tax.** Lost SEO on an indexed URL with no redirect, an orphaned sitemap
  entry, a social post linking to a dead page, env drift between local and Vercel, a "temporary"
  compatibility shim nobody removes. No error. Just slow erosion and a future "why did traffic drop."

The 🟡 LATER bucket is the whole point — it's the headache people don't see coming. Never skip it.

---

## Step 3: Score it

Give a single honest verdict up top, so the user can decide in five seconds:

- **🟢 Aspirin (do it, low risk)** — self-contained, few references, no public URL or data touched.
- **🟠 Advil (doable, respect it)** — real references or one public route/data touch; needs a
  redirect or a careful sequence, but bounded.
- **🔴 Migraine (stop and plan)** — public routes with SEO value, Supabase schema, host/infra, or a
  web of shared-code references. Do it deliberately, in order, with redirects and a rollback.

Base the score on evidence you found, not vibes. If you found 40 references and an indexed URL with
no redirect, it's a Migraine no matter how small the diff looks.

---

## Step 4: Hand them the plan that shrinks the headache

Don't just diagnose — prescribe. Give an ordered checklist that neutralizes the findings, sequenced
so the repo never sits in a broken state:

1. **Prereqs** — what to add *before* touching the target (e.g. add the redirect first, add the new
   column before backfilling, snapshot/branch first).
2. **The change** — the move/rename/delete itself.
3. **Follow the threads** — update every reference found in Step 1, grouped by file.
4. **Infra & SEO** — redirects, `sitemap.ts`, canonicals, the manual Vercel/env checks you flagged.
5. **Prove it** — `rimraf .next` if needed, build, click the moved path, hit the moved API, check the
   old URL redirects (not 404s), confirm sitemap is clean.
6. **Rollback** — one line on how to undo if it goes sideways (usually: the change was one commit / one branch).

Call out explicitly anything you **cannot verify from inside the repo** (Vercel env vars, DNS,
whether a URL is actually indexed, prod Supabase state) as **MANUAL CHECKS** so they aren't assumed done.

---

## Output format

```
🩺 HEADACHE CHECK: [one-line change statement]
Verdict: 🟢/🟠/🔴  [Aspirin / Advil / Migraine] — [one sentence why]

🔴 NOW (breaks build/page)
  • [file:line] — what breaks, why

🟠 SOON (breaks a flow)
  • ...

🟡 LATER (the quiet tax)
  • ...

🔧 MANUAL CHECKS (can't see from here)
  • Vercel env / DNS / index status / prod DB ...

✅ THE PLAN (do in this order)
  1. ...
```

Keep it scannable. The user should be able to read the verdict + the plan and know exactly what
they're in for. End with the honest bottom line: is this an afternoon, or a week? Then ask if they
want you to execute the plan.
