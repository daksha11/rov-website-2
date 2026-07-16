# CTRL-A Conversion System · Build Plan

Planning output only. No app code was changed to produce this document. Every claim in
§0 comes from reading the current codebase, not from the strategy doc or memory.
Strategy source of truth: `docs/CTRLA-CONVERSION-SYSTEM-PLAN.md`. House rules: no em
dashes, voice grounded / warm / refined, tracking is best-effort and never blocks a page
or a submit, credits and submissions are server-authoritative, private keys never reach
the client.

The ladder this plan implements (fixed, not up for redesign):
**0 Taste (free) → 1 Email (Klaviyo unlock for deep guides) → 2 Login (Supabase) →
3 Credits (brand-kit export + magazine features).** Never charge credits for reach.
Only charge where a cost improves the product.

---

## §0 · Current state, as of this audit

### 0.1 How login actually works today

**Client stack.** `@supabase/ssr` everywhere, keyed by `NEXT_PUBLIC_SUPABASE_URL` +
`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (the publishable key, not the legacy anon key).

- `utils/supabase/client.ts` · browser client:
  ```ts
  export const createClient = () => createBrowserClient(supabaseUrl!, supabaseKey!);
  ```
- `utils/supabase/server.ts` · cookie-bound server client, takes the awaited cookie
  store: `createClient(await cookies())`.
- `utils/supabase/middleware.ts` · builds a `createServerClient` wired to
  request/response cookies and returns `{ supabase, supabaseResponse }`.
- `utils/supabase/admin.ts` · service-role client, RPC-only, with the guard comment
  "NEVER import this into a client component":
  ```ts
  export function createServiceClient() {
    if (!url || !serviceKey) return null;
    return createClient(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  ```

**Middleware refreshes, it does not protect.** The root `middleware.ts` only rebuilds
the session cookie and falls through on error:

```ts
export async function middleware(request: NextRequest) {
  try {
    const { createClient } = await import("@/utils/supabase/middleware");
    const { supabaseResponse } = createClient(request);
    return supabaseResponse;
  } catch {
    return NextResponse.next();
  }
}
```

There is no route matcher that blocks `/admin` or `/account` at the edge. Every page
guards itself client-side after mount, and the only real enforcement is inside API
routes.

**Sign-in is Google OAuth only.** Five call sites use the same pattern
(`components/providers/GoogleLoginButton.tsx`, `components/brand-kit/AuthModal.tsx`,
`app/ctrla/contribute/page.tsx`, `CreditsPanel.tsx`, `DailyTasteTest.tsx`):

```ts
await supabase.auth.signInWithOAuth({
  provider: "google",
  options: { redirectTo: `${window.location.origin}/ctrla/contribute` },
});
```

There is no email/password or magic-link path. The email rung (rung 1) is entirely
Klaviyo-side; Supabase only enters at rung 2.

**Roles come from `profiles.role`** (`client | engineer | admin`). The one
server-side role gate in the CTRL-A area is `requireStaff()` in
`app/api/ctrla/review/route.ts:33`:

```ts
async function requireStaff() {
  const supabase = createClient(await cookies());
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { user: null, status: 401 as const };
  const { data: me } = await supabase
    .from("profiles").select("role").eq("id", user.id).single();
  if (me?.role !== "admin" && me?.role !== "engineer") return { user: null, status: 403 as const };
  return { user, status: 200 as const };
}
```

**Page-level guards are cosmetic.** `/account` (`app/account/page.tsx:97`) does
`supabase.auth.getSession()` in a `useEffect` and `router.push("/")` when signed out.
`/admin` (`app/admin/page.tsx:216`) does the same, checks `profile?.role !== 'admin'
&& profile?.role !== 'engineer'`, and redirects to `/portal`. `/admin/ctrla` repeats
the check with a different redirect (`/account`). All three render their shell before
the check resolves. The pattern is consistent and recent (the `/account`
profile-dashboard and the admin CTRL-A queue landed in the last few commits), so the
plan below builds on it rather than fighting it, but new money-adjacent surfaces must
put their real gate in the API layer, exactly like `requireStaff` does.

**`useLeadSync` is the rung 1 ↔ rung 2 bridge**, currently mounted in exactly one
place, `app/ctrla/brand-kit/builder/layout.tsx` (`useLeadSync("brand-kit")`). On an
authed session it POSTs the user's email to `/api/klaviyo/subscribe` once (deduped via
`localStorage["ctrla_klaviyo_synced_${user.id}"]`) and sets `ctrla_unlocked` so soft
gates stop nagging. Anonymous users send nothing.

### 0.2 The wallet is unified; one legacy spend path skips the ledger

Correcting an earlier assumption: there is **one master wallet**, not two. Reading the
SQL confirms it:

- `brand_kit_credits` (`supabase/sql/points-system-setup.sql`) is the **balance**
  table, `points INTEGER DEFAULT 1000 CHECK (points >= 0)`, one row per profile,
  seeded to 1,000 by the `handle_new_profile_credits` trigger on profile creation and
  realtime-enabled.
- `credit_events` (`supabase/sql/credits-system-setup.sql`) is the **ledger** on top
  of it. Both `award_credits(...)` and `spend_credits(p_user_id, p_amount, p_reason)`
  already exist, both write a ledger row **and** move the `brand_kit_credits` balance
  atomically, both are `SECURITY DEFINER` granted to `service_role` only.

So "everyone starts with 1,000 in one master system" is already true. `usePoints` and
`useCredits` both read `brand_kit_credits.points`; `/account`'s activity feed reads
`credit_events`. Consistent.

The one real defect: the brand-kit export
(`components/brand-kit/builder/steps/ExportStep.tsx:33`) spends through the **legacy**
`deduct_brand_kit_points` RPC (called client-side from `hooks/brand-kit/usePoints.ts`),
which decrements `brand_kit_credits` but writes **no** `credit_events` row. Result:
exports move the balance but never appear in the ledger or the activity feed, and the
50 is hardcoded (`points < 50`, `deductPoints(50)`) instead of reading
`COSTS["brand-kit-export"]`. The fix is small: route export through the existing
`spend_credits` RPC via a server route, so every spend lands in the one ledger. No
wallet migration, no reseeding, no balance reconciliation needed.

Also found: `ExportSpecButton`, `ExportTokensButton`, `ExportTailwindButton`, and
`ShareKitButton` are free and ungated (share explicitly says "No points are spent to
share"); only the standalone HTML download is gated. Kits are never persisted
server-side (localStorage Zustand `persist` key `ctrl-a-brand-kit`; sharing is a
stateless base64url `?kit=` token).

### 0.3 Klaviyo plumbing (solid, extend as-is)

- `app/api/klaviyo/subscribe/route.ts` · accepts `{email, name, source, listId}`,
  server path (private key, Subscribe-Profiles bulk job) with a public client fallback
  (company id `U3jthw`), honeypot `company` field, upserts profile props
  `ctrla_source` / `signup_source`, honest 503 when unconfigured.
- `lib/ctrla/klaviyo-events.ts` · `fireCtrlaEvent(event, email, properties)`,
  best-effort, never throws. Current event union: `CTRL-A Submission
  Received | Approved | Featured | Rejected`.
- `app/ctrla/_components/CtrlASignup.tsx` · the one email-capture component
  (inline/band/stacked variants), fires `_learnq` identify + `track("CTRL-A Signup")`,
  calls `onSuccess(email)`.
- `app/ctrla/_components/ToolGate.tsx` · soft client gate on
  `localStorage["ctrla_unlocked"]` / `ctrla_lead_email`, blurred teaser + `CtrlASignup`.
  Explicitly not hard security, which is correct for rung 1.

### 0.4 Submissions pipeline (solid backbone, text-only)

`app/api/ctrla/submissions/route.ts` validates a zod `discriminatedUnion` over four
types (`tool | idea | signal | resource`), toolkits `music | web-dev | design | video`,
inserts as the user so RLS enforces `author_id = auth.uid()` and `status = 'pending'`,
rate-limits 10 per rolling 24h, then fires `CTRL-A Submission Received` best-effort.
Review flows through the service-role RPC `review_ctrla_submission(p_submission_id,
p_status, p_reviewer_id, p_note)` (users have no UPDATE grant at all) and emails the
author via the matching event. `lib/ctrla/community.ts` holds the shared vocabulary
(`TYPE_META`, `STATUS_META`, `SubmissionPayload` of `title/url/body/tags/level/kind`).

The payload carries **no media of any kind**. There is no image, gallery, or section
field anywhere in the type, the zod schema, or the reviewer card. Track B does not
bolt onto this shape; it needs its own payload and storage (Phase 2).

`app/ctrla/contribute/page.tsx` is one Google-gated mega-form that morphs across the
four types with conditional fields. It works, but it is exactly the cramped single
form the strategy doc retires.

### 0.5 UI/UX audit · `/account` profile (`app/account/page.tsx` + `CommunityPanel.tsx`)

What exists: a single 640px-wide scrolling column. Gold accent bar → masthead →
sunset hero with the user's name → identity card (avatar, handle, email, staff-only
Admin pill, public-profile toggle, bio editor) → 3-stat row (Points, Contributions,
Featured) → "Recent activity" ledger (last 8 `credit_events`) → `CommunityPanel`
(last 30 submissions with status chips and the review note on rejection, plus a
Contribute CTA to `/ctrla/contribute`) → Studio card (locked behind booking) →
sign out. Cohesive CTRL-A styling, all inline styles, one quiet role check.

Judged against its new job (the member's home for balance, earning, submissions of
both tracks, and saved kits):

1. **The balance is a number with no verbs.** Points show in the stat row but there is
   no "ways to earn" module and no "what this buys" context. The earn surface lives
   on a different page (`/ctrla/credits`, `CreditsPanel`). A member who lands here
   with 40 points has no path to 50.
2. **No saved brand kits, because none exist server-side** (§0.2). The page cannot
   show what it has no table for. This is a Phase 2/3 dependency, not just a layout gap.
3. **CommunityPanel is single-track.** It renders text submissions fine but has no
   concept of a media feature: no thumbnail, no cost paid, no "refunded/paid back"
   line, no distinction between a toolkit suggestion and a magazine feature.
4. **The ledger is bare.** `actionLabel()` prettifies action slugs, but there is no
   running balance, no link from a `spend:` row to the thing bought, and only 8 rows
   with no "view all".
5. **Contributions CTA points at the page this plan replaces** (`/ctrla/contribute`
   → will be `/ctrla/submit`).
6. Nice bones to keep: the identity card, public-toggle, and hero are exactly right,
   and the stat-row pattern extends cleanly.

### 0.6 UI/UX audit · admin panel (`app/admin` + `app/admin/ctrla`)

What exists: `app/admin/page.tsx` is a **2,504-line single client component** with
inline styles and four modals, tabbed Client / Sound / Users, plus a link styled as a
fourth tab that navigates to the separate `/admin/ctrla` route. The CTRL-A queue page
(195 lines) fetches `GET /api/ctrla/review`, renders text cards (type badge, toolkit
badge, author, title/url/body/tags), and posts Approve / Feature / Reject with an
optional 500-char note; decided cards are optimistically removed from the list.

Judged against its new jobs (media-feature review, form-config editing, economy
control):

1. **The queue is text-only and narrow (720px).** A gallery, a tools-used breakdown,
   and a sectioned process read have nowhere to render. No filtering by type/toolkit,
   no search, no pagination past the 100-row cap, and no post-decision visibility:
   once decided, a submission vanishes with no undo, and every decision emails the
   author instantly (no confirm on Approve/Feature).
2. **No form-config surface exists anywhere.** Types, toolkits, and limits are
   hard-coded in three places that must stay in sync by hand: `lib/ctrla/community.ts`,
   the zod union in the submissions route, and the contribute form.
3. **No economy surface exists anywhere.** No screen shows a user's balance, a cost,
   or the ledger; every price change is a deploy. The Users tab's role `<select>`
   changes roles with zero confirmation, one misclick from granting `admin`.
4. **Access control is client-side on the pages** (§0.1); only the review API truly
   enforces staff. Direct-from-client mutations (role change, project edits, track
   deletes) ride on RLS alone.
5. **The monolith is the tax on everything above.** Any new admin surface either
   grows a 2,500-line file or spawns another stylistically-duplicated standalone
   route (as `/admin/ctrla` already did, with its own copied color constants).

---

## Phase 1 · Gating + economy

### 1.1 Guide gate

Extend `ToolGate` rather than replacing it.

- `app/ctrla/_components/ToolGate.tsx` · add
  `gate?: "email" | "credits"` (default `"email"`) and `guideSlug?: string`.
  - `email` mode: current behavior, plus on unlock fire onsite `_learnq`
    `CTRL-A Guide Unlocked` with `{ guide: guideSlug, toolkit }` and append the slug
    to a localStorage list that later syncs to the `unlocked_guides` profile prop.
  - `credits` mode: renders the same blurred teaser but the unlock button checks the
    session and calls the new spend route (§1.3) with `item: "premium-course"`. Not
    used at launch; it exists so flipping one guide later is a prop change.
- New tiny module `lib/ctrla/guides.ts` · the guide registry:
  `{ slug, title, toolkit, gate }` per guide, starting with the Claude Code crash
  course as the flagship email magnet. Guide pages read their gate from here so the
  email→credits flip is one line of config.
- Completion: each gated guide page gets a "mark complete" affordance at the end
  that POSTs to `/api/credits/earn` with `action: "guide-complete"` and
  `meta: { guide: slug }` (§1.3 adds the action). The earn route fires
  `CTRL-A Guide Completed` server-side after a successful award, so the Klaviyo event
  only ever fires when the award was real.

Files touched: `ToolGate.tsx`, new `lib/ctrla/guides.ts`, the guide/crash-course
pages, `lib/ctrla/klaviyo-events.ts` (extend the event union).

### 1.2 Brand-kit generator: builder stays open, export is the gate

The builder is already fully open (§0.2 confirmed no wall), so rung 0 is done. The
work is making the export gate honest and observable:

1. **Migrate export spend to the ledger.** Replace the client-side
   `deduct_brand_kit_points` call in `ExportStep.tsx` with a new server route
   `app/api/credits/spend/route.ts` (§1.3). The route authenticates via
   `supabase.auth.getUser()` exactly like `/api/credits/earn`, reads the cost from
   `COSTS["brand-kit-export"]`, and spends through a service-role `spend_credits` RPC
   that writes a `spend:brand-kit-export` ledger row atomically with the balance
   check. `ExportStep` keeps its current UX (AuthModal when signed out,
   earn-credits modal when short) but the number it displays comes from `COSTS`.
2. **The wallet (decided, and simpler than first thought).** `brand_kit_credits` is
   already the one master wallet and everyone already starts at 1,000 (§0.2), so no
   migration or reseed is needed. The only change is retiring the legacy
   `deduct_brand_kit_points` path: the export routes through the existing
   `spend_credits` RPC via the new `/api/credits/spend` route (§1.3), so exports
   finally write a `credit_events` ledger row and show up in the activity feed. The
   `deduct_brand_kit_points` RPC and the client-side `usePoints.deductPoints` call are
   removed once nothing references them.
   Note the accepted tradeoff kept from before: 1,000 points covers several feature
   submissions on day one, so anti-flood leans on the review queue and the
   per-submission cost, not on new accounts being broke.
3. **Events.** On successful spend the route fires `CTRL-A Brand Kit Exported`
   (server-side, reliable). Add onsite `_learnq` `CTRL-A Brand Kit Started` when a
   kit first gets a brand name (cheap, fires from the store's first meaningful write,
   best-effort). These two power the re-engage flow.
4. **Leave the free exports free** (spec, tokens, tailwind, share). They are honest
   taste and they carry the share link, which is acquisition. Flag as tunable later.
5. **Login-first leads must reach Klaviyo (decided requirement).** Someone who signs
   in with Google before ever typing their email into a CTRL-A form must still show
   up in Klaviyo. Today that only happens if they visit the brand-kit builder, the
   sole place `useLeadSync` is mounted. Plan:
   - Mount `useLeadSync("account")` in the global authed chrome (the provider that
     already watches auth state in `GoogleLoginButton` / the root layout), so the
     first authenticated session **anywhere** on the site triggers the sync.
   - Back it with a server-side belt: on the first authed session the sync call also
     hits the account bridge (§Phase 4 property sync), which subscribes the email via
     the existing server path, sets `account_created` / `account_created_at`, and
     fires `CTRL-A Account Created`. The localStorage dedupe key stays, but the
     server dedupes too (profile prop already set → skip), so a cleared browser
     never double-fires and a blocked script never loses the lead.
   - `signup_source` for these profiles lands as `google-login` so flows can tell a
     login-first lead from a form lead.

Files touched: `ExportStep.tsx`, `hooks/brand-kit/usePoints.ts` (read balance from
the ledger), new `app/api/credits/spend/route.ts`, new SQL for `spend_credits`,
`lib/ctrla/klaviyo-events.ts`, `app/ctrla/brand-kit/builder/layout.tsx`.

### 1.3 Credits config + routes

`lib/credits/config.ts` becomes the single tuning table it was meant to be:

```ts
export type EarnAction =
  | "follow-instagram" | "referral"
  | "social-engagement" | "guide-complete"
  | "contribution-approved" | "contribution-featured";

REWARDS: social-engagement { points: 50, cap: "weekly" }   // honor-system claim + dedupe
         guide-complete    { points: 75, once: true }      // dedupe key user:guide-complete:<slug>
         contribution-approved { points: 100 }             // server-attributed on review
         contribution-featured { points: 250 }             // server-attributed on review

COSTS:   "brand-kit-export": 50, "premium-download": 75, "premium-course": 100,
         "art-feature": 150, "story-feature": 250
```

- `/api/credits/earn` · widen `bodySchema` to the new claimable actions
  (`social-engagement`, `guide-complete` join `CLAIMABLE`; the two contribution
  rewards stay server-attributed and are awarded inside the review route, never
  claimable). Weekly cap for `social-engagement` via a dedupe key that includes the
  ISO week (`${user.id}:social-engagement:2026-W29`). After any successful award,
  fire `CTRL-A Credits Earned` with `{ action, awarded, balance }` best-effort.
- New `/api/credits/spend` · mirror of earn: zod `{ item: keyof COSTS, meta? }`,
  session required, service-role `spend_credits(p_user_id, p_item, p_amount, p_meta)`
  RPC that fails cleanly on insufficient balance and writes the `spend:<item>` row.
  All spends in the app go through this one route (export today, features in Phase 2).
- Review route (`/api/ctrla/review`) · on `approved` award
  `contribution-approved`, on `featured` award `contribution-featured`, both via
  `award_credits` with dedupe key `submission:<id>:<status>` so a re-review can never
  double-pay.

Schema changes: `spend_credits` RPC (service-role grant only), plus the §Q1 balance
migration. No table shape changes; the `credit_events` ledger already fits.

---

## Phase 2 · Contributions, two tracks

One review backbone, two doors. Track A stays free and fast; Track B is the
magazine-grade, credit-gated surface.

### 2.1 Data model

Extend `ctrla_submissions` rather than adding a second table, so `/account` tracking,
the wall, review, and Klaviyo events keep working for both tracks:

- `type` gains `history` (Track A) and `art`, `story` (Track B).
- New columns: `track text not null default 'toolkit'` (`toolkit | magazine`),
  `credit_cost int not null default 0` (what was actually charged at submit time, so
  later price changes never rewrite history), `media jsonb` (ordered array of
  `{ path, kind: "image"|"audio"|"video", caption? }` pointing into Storage).
- Payloads (zod in the API route stays the safety floor):
  - `history`: `{ title, date (ISO, past), body, url?, image? }`, `toolkitSlug` required.
  - `art`: `{ title, medium, statement, tools: string[] (mapped to toolkits where
    relevant), bio, links: url[] (max 4) }` + `media` (hero = first item, 1..8 items).
  - `story`: `{ title, tools: [{ name, toolkit? }] (min 3), process: [{ heading,
    body }] (min 3 sections, the ugly steps prompt built into the field help),
    bio, links }` + `media` (hero + gallery, min 3 items). All four story
    requirements (hero+gallery, tools breakdown, process, bio+links) are `required`
    in zod, not just in the config.
- **Storage**: new bucket `ctrla-submissions`, path `submissions/<user_id>/<uuid>.<ext>`.
  RLS: authenticated users insert only under their own prefix; reads are
  service-role/staff until a submission is featured, at which point publishing copies
  (or signs) the media it needs. Limits (flagged §Q6 for tuning): images ≤ 8MB,
  audio ≤ 25MB, short video ≤ 80MB, max 8 items.
- **Spend-at-submit**: the submissions route, for `art`/`story`, calls the same
  `spend_credits` RPC before insert, in one server action: spend, insert, and on
  insert failure refund via `award_credits` with dedupe key
  `refund:<spend_event_id>`. Track B is exempt from the 10/day limit (the cost is the
  limit); Track A keeps 10/day.
- Events: fire `CTRL-A Feature Submitted` with `{ track: "magazine", submission_type,
  cost, title }` for Track B (in addition to the existing Received event), so flows
  can treat features differently from suggestions.

### 2.2 Dedicated submission pages

Routes (each one page, one purpose, only that type's fields):

```
/ctrla/submit                 the Contribute hub: two doors
/ctrla/submit/tool            Track A ┐
/ctrla/submit/idea                    │ free · login · fast
/ctrla/submit/signal                  │
/ctrla/submit/resource                │
/ctrla/submit/history         NEW    ┘
/ctrla/submit/art             Track B ┐ login + credits · media-heavy
/ctrla/submit/story                  ┘ guided, magazine-feeling
/ctrla/contribute             becomes a redirect to /ctrla/submit
```

Shared components (new, under `app/ctrla/submit/_components/`):

- `SubmitShell` · the CTRL-A frame every page shares: masthead, auth check with the
  existing Google sign-in pattern, status/success state, link back to the hub.
- `ConfigForm` · renders a field list from the form config (§2.3): text, textarea,
  url, tags, select, date, media. This is the piece that makes forms admin-editable.
- `MediaUploader` · Supabase Storage upload with client-side downscale for images,
  ordered gallery, hero designation, per-file progress. Track B only.
- `ToolTagger` · tools-used input that maps entries to toolkit slugs.
- `CostHeader` · Track B header: the cost from config, the member's live balance
  (existing `useCredits`), and when short, an inline earn path (the Daily, IG follow,
  finish the crash course) instead of a dead end.
- `SpreadPreview` · live magazine-style preview for art/story so the submitter
  watches their spread form as they type. This is what makes the paid door feel like
  being published.

The hub (`/ctrla/submit`) is a two-door page: "Improve a toolkit" (free, effortless,
five type cards) and "Get featured" (credits, two format cards showing cost against
balance). After submit, both doors point at `/account` for tracking.

### 2.3 Admin-controllable forms · `ctrla_form_configs`

One row per submission type; the UI renders from it, zod remains the non-bypassable
floor beneath it.

```
ctrla_form_configs
  type          text primary key        -- tool | idea | ... | art | story
  track         text not null           -- toolkit | magazine
  is_open       boolean not null default true
  title         text                    -- page heading
  intro         text                    -- the warm one-liner under it
  credit_cost   int not null default 0  -- 0 for Track A
  fields        jsonb not null          -- ordered [{ key, label, help, kind, required,
                                        --   maxLength?, options?, min?, max? }]
  updated_at    timestamptz, updated_by uuid references profiles(id)
```

- **Config drives presentation and soft rules** (labels, help text, order, whether an
  optional field shows, whether the type is open, what the cost is). **Zod owns hard
  rules** (types, hard maxima, the four story requirements, URL shapes). A config row
  can hide or relabel a field; it can never make the server accept a payload zod
  rejects, and it can never mark a zod-required field optional. The submissions route
  reads `credit_cost` and `is_open` from the table (server-side) so a paused queue or
  price change is live without a deploy.
- RLS: `select` for everyone (the public pages must read it), `insert/update/delete`
  for `role in ('admin','engineer')` only, so the same rows stay directly editable in
  the Supabase dashboard, which was the explicit requirement.
- Admin front-end editor lives in the redesigned admin panel (§3.2): toggle a type
  open/closed, reorder and retitle fields, edit help text, change a cost, pause the
  art queue when it is full.
- Seed migration inserts the seven types with the current hard-coded labels from
  `TYPE_META` so day one looks identical to today.

Files: new `app/ctrla/submit/**` pages + components, new
`app/api/ctrla/submissions` extensions (new union members, spend-at-submit, config
reads), `lib/ctrla/community.ts` (types for `history/art/story`, `track`, media),
SQL migration for the columns, bucket, RLS, and `ctrla_form_configs`.

---

## Phase 3 · Profile + admin redesign

Grounded in the §0.5 / §0.6 findings. Both stay inside the existing CTRL-A visual
system (cosmic sunset ground, cream/gold/rose/plum, Norwige/Neue Montreal, the
`card` glass pattern) and keep the current auth patterns, with real enforcement in
API routes.

### 3.1 `/account` · the member's home

Keep: accent bar, masthead, sunset hero, identity card (avatar/handle/bio/public
toggle), the confirm-sign-out modal. Reorder and extend the rest. Proposed section
order, top to bottom:

1. **Identity card** (as-is, it already carries the staff Admin pill).
2. **Wallet card** (replaces the bare stat row's Points cell with a real module):
   balance large, then two inline rows: "Ways to earn" (the claimable actions from
   `REWARDS` with their point values, the Daily streak state, and links into each)
   and "What it unlocks" (export 50 · art 150 · story 250, live from `COSTS`, each a
   link). This fixes the number-with-no-verbs problem and doubles as the inline earn
   path the submit pages link back to.
3. **Stat row** slims to Contributions · Featured · Streak.
4. **My submissions** (CommunityPanel, extended): two grouped lists matching the two
   tracks. Magazine features get a thumbnail from `media[0]`, the cost paid, and on
   `featured` a "paid back +250" line; toolkit rows stay as today. Status vocabulary
   unchanged (`STATUS_META`). CTA moves to `/ctrla/submit`.
5. **Saved brand kits** · new card, dependent on kit persistence (§Q2). If kits stay
   local-only at launch, this card ships as "Your kit lives in this browser" with a
   resume link + share explainer, and upgrades when the table lands.
6. **Recent activity** · ledger with a running balance per row, a link on `spend:`
   rows to the thing bought, and a "view all" that extends the query past 8 rows.
7. **Studio** and **Sign out** as today.

Files: `app/account/page.tsx`, `app/account/CommunityPanel.tsx`, possibly a small
`app/account/WalletCard.tsx`.

### 3.2 Admin panel · from monolith + orphan to one shell

The 2,504-line single component cannot absorb three new jobs. Proposed IA:

```
/admin                        layout.tsx gains the shared shell: sticky header,
                              real tab NAV (links, not state), shared C tokens
  /admin            (page)    Studio ops: today's Client / Sound / Users tabs,
                              extracted into components, behavior unchanged
  /admin/ctrla                CTRL-A home: queue counts by track/type, quick stats
  /admin/ctrla/queue          the review queue, split by track:
                              · toolkit tab: today's text cards, plus filters
                                (type, toolkit), search, and a "decided" tab with
                                a 15-minute undo window before the event email
                                is fired (fixes no-undo + instant-email)
                              · magazine tab: full-width reviewer: hero + gallery
                                lightbox, tools-used list, sectioned process read,
                                bio/links, then Approve / Feature / Decline with
                                the note composer (decline note required, warm
                                by template)
  /admin/ctrla/forms          the ctrla_form_configs editor: per-type card with
                              open/closed toggle, cost input, drag-reorder fields,
                              inline label/help editing; "hard floor" badge on
                              zod-required fields that cannot be made optional
  /admin/ctrla/economy        read-only first: REWARDS/COSTS as configured, a user
                              lookup showing balance + ledger, and a manual
                              service-role grant/deduct with a required reason
                              (written to the ledger meta)
```

Cross-cutting fixes from §0.6: shared style tokens for all admin routes (kill the
copied `C` constants), a confirmation step on role changes in Users, and every new
mutation (review, forms, economy) goes through a staff-gated API route in the
`requireStaff` mold, never direct-from-client with RLS as the only net. The existing
tabs' client-side guard pattern stays, but the shared `/admin/layout.tsx` shell adds a
server-side session+role check so the panel stops relying on post-mount redirects
(this is the one auth behavior change worth making now, and it is additive).

Files: `app/admin/layout.tsx`, extraction of `app/admin/page.tsx` tab bodies into
components, new `app/admin/ctrla/{queue,forms,economy}/page.tsx`, new staff-gated
routes `app/api/ctrla/forms/route.ts` and `app/api/credits/admin/route.ts`.

---

## Phase 4 · Klaviyo buildbook (`docs/ctrla-klaviyo-flows.md`)

A separate doc, written to be executed in the Klaviyo dashboard. Its required
structure:

1. **The dictionary first** (§below, kept identical in both docs), plus required env
   (`KLAVIYO_PRIVATE_KEY`, `KLAVIYO_LIST_ID`, `NEXT_PUBLIC_KLAVIYO_COMPANY_ID`) and
   the list of metrics to pre-create.
2. **Per flow**: trigger (metric or list + filters), flow filters, then for each
   email: goal, subject, preview text, a first-draft body in CTRL-A voice (grounded,
   warm, refined, no hype, no em dashes), timing/delay, and exit/skip conditions.

Flows to specify:

| Flow | Trigger | Shape |
|---|---|---|
| Welcome | joined the list (`CTRL-A Signup` / subscribe) | 4 emails: what CTRL-A is → toolkit tour → the brand-kit generator → make a free account. Skip later emails when `account_created` |
| Guide nurture | `CTRL-A Guide Unlocked`, no `Guide Completed` in 4 days | 2 emails pulling them back to finish (and earn the 75) |
| Account activation | has email, `account_created` false, 3 days after signup | 2-3 emails on saved kits, credits, submission tracking. Exit on `CTRL-A Account Created` |
| Credit milestone | `CTRL-A Credits Earned` where `balance` crosses 50 / 150 / 250 | 1 email per threshold: "you can now export / submit art / submit a story" |
| Brand-kit re-engage | `Brand Kit Started`, no `Brand Kit Exported` in 24h | 1 high-intent recovery email |
| Feature lifecycle | the four submission events + `Feature Submitted` | received (thanks + timeline) → approved (congrats + credits earned) → featured (celebration + share + refer CTA) → declined (warm, specific, includes the note, invites a redo) |
| Win-back | 60 days no engagement | 2 emails, then suppress |
| Monthly drop | recurring campaign, not a flow | engaged segment, monthly cadence, noted explicitly so it is never confused with welcome |

Segments: anonymous leads (email, `account_created` false), members, contributors
(`is_contributor`), featured creators (`is_featured`), cold (60d), by
`toolkit_interest`, and has-credits (`credits_balance >= 50`).

App-side property sync (small Phase 4 code item, planned not built): extend
`useLeadSync` (or a sibling server call on first authed session) to set
`account_created`, `account_created_at`, and thereafter let the earn/spend/review
routes update `credits_balance`, `is_contributor`, `is_featured`, `unlocked_guides`
via the existing profile-import endpoint pattern. First authed session also fires
`CTRL-A Account Created` once (deduped like the existing sync key).

---

## Consolidated event / property dictionary

Names are load-bearing: the app, this plan, and the buildbook must match exactly.

**Events** (existing kept verbatim, new follow the same prefix):

| Event | Fired | Where |
|---|---|---|
| `CTRL-A Signup` | onsite `_learnq` | `CtrlASignup` (exists) |
| `CTRL-A Submission Received / Approved / Featured / Rejected` | server | submissions + review routes (exist) |
| `CTRL-A Guide Unlocked` | onsite | `ToolGate` email unlock (new) |
| `CTRL-A Guide Completed` | server | earn route after award (new) |
| `CTRL-A Brand Kit Started` | onsite | store's first meaningful write (new) |
| `CTRL-A Brand Kit Exported` | server | spend route (new) |
| `CTRL-A Account Created` | server | first authed sync (new) |
| `CTRL-A Credits Earned` | server | earn route + review awards (new) |
| `CTRL-A Feature Submitted` | server | submissions route, Track B (new) |

**Profile properties**: `ctrla_source`, `signup_source` (exist) ·
`toolkit_interest`, `account_created`, `account_created_at`, `credits_balance`,
`is_contributor`, `is_featured`, `unlocked_guides` (new).

**Config names**: earn `follow-instagram`, `referral`, `social-engagement`,
`guide-complete`, `contribution-approved`, `contribution-featured` · spend
`brand-kit-export`, `premium-download`, `premium-course`, `art-feature`,
`story-feature`.

---

## Sequencing

1. **Phase 1.3 first** (spend route + config widening + the §Q1 wallet decision):
   everything else prices against it.
2. **Phase 1.2** (export migration + events) and **1.1** (guide gate) in parallel;
   both are contained.
3. **Phase 2.1 → 2.3 → 2.2**: schema + storage, then form configs, then the pages
   (the pages render from the config, so the config must exist first).
4. **Phase 3** rides behind 2 (the profile shows Track B rows, the admin reviews
   them). The admin shell extraction (3.2) can start any time; it blocks nothing.
5. **Phase 4** dashboard work starts as soon as the Phase 1 events exist; the
   feature-lifecycle flow waits for Phase 2.

---

## Open questions

- **Q1 · The wallet: DECIDED / RESOLVED.** Already one master wallet
  (`brand_kit_credits` balance + `credit_events` ledger), everyone already seeded
  1,000 (§0.2). No migration. Only the legacy `deduct_brand_kit_points` export path
  is retired in favor of `spend_credits` (§1.2). Remaining sub-question: keep the
  credit-milestone Klaviyo flow triggering on threshold crossings by **earning**, not
  on the day-one 1,000 seed, so it does not fire "you can now submit" for everyone at
  once. Recommended: yes.
- **Q2 · Kit persistence.** Saved brand kits do not exist server-side today. Is a
  `brand_kits` table (owner, name, kit jsonb, updated_at) in scope for this effort,
  or does the profile card ship in its local-only form first?
- **Q3 · Costs and paybacks.** 150/250 submit, 250 featured, 100 approved are
  starting values. Partial refund on approval (not featured)?
- **Q4 · Social-engagement verification.** Honor-system + weekly cap at launch;
  when, if ever, does verification (link submission, manual spot-check) replace it?
- **Q5 · The flagship magnet.** Claude Code crash course assumed as the email
  magnet; confirm before the welcome flow copy is drafted.
- **Q6 · Media limits + moderation.** Proposed limits in §2.1 are first-draft.
  Also: is staff review sufficient moderation for launch (recommended yes, the
  queue sees everything before publish), or is automated scanning wanted?
- **Q7 · Free brand-kit exports.** Spec/tokens/tailwind/share stay free in this
  plan. Revisit only if export conversion underperforms.
