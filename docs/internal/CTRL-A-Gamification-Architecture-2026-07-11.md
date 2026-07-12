# CTRL-A Gamification Architecture
**Date:** 2026-07-11 · **Status:** Proposal · **Companion to:** CTRL-A-Gating-Architecture-2026-07-08.doc

The plan for turning CTRL-A into a daily habit: The Daily (taste test), streaks, the sticker sheet, Signals predictions, and Fold regulars. Everything below builds on what already exists: the `brand_kit_credits` wallet, the `credit_events` ledger, the `award_credits()` / `spend_credits()` service-role RPCs, the volume registry, and the 4-key entitlement ladder from the gating doc.

One design law carried over from the gating doc: **the browser never decides anything that has value.** Every credit, streak, sticker, and payout is written by a service-role RPC behind an `/api` route. The client only asks.

---

## The loop we are building

```
midnight ET ──> new Daily goes live
user plays (15 sec) ──> reveal: agreement %, editor's note
        │
        ├── streak ticks up ──> credits awarded (base + streak bonus, slight randomness)
        ├── taste stat updates ("agrees with editors 71%")
        ├── share card generated ──> friends arrive with ?ref= links
        └── sticker progress ticks ──> sheet fills ──> entitlement granted
volume drops monthly ──> predictions resolve, old sticker sheet closes, new one opens
```

---

## Phase 1 · The Daily + streaks + credits (build first)

### What ships
A daily "which one is better?" game at `/ctrla/daily`, plus a card on the landing TOC. One challenge per day, same for everyone. Pick A or B, get the reveal (what % agreed with you, plus the editor's note on why), streak ticks, credits land, share card is one tap away.

### The "day"
A day is a **calendar date in America/New_York**. One helper, used everywhere:

```ts
// lib/daily/date.ts
export function todayET(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/New_York" }).format(new Date());
  // "2026-07-11"
}
```

### Data model (Supabase)

```sql
-- One row per calendar day. Authored in advance, in batches.
CREATE TABLE daily_challenges (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    publish_date  DATE UNIQUE NOT NULL,
    volume        INT NOT NULL,
    kind          TEXT NOT NULL DEFAULT 'taste-test',
    prompt        TEXT NOT NULL,            -- "Two lockups for the same coffee brand. Which is sharper?"
    option_a      JSONB NOT NULL,           -- { label, image?, text?, credit? }
    option_b      JSONB NOT NULL,
    editors_pick  CHAR(1) NOT NULL,         -- 'a' | 'b'
    editors_note  TEXT NOT NULL,            -- the two-sentence "why" (the real payoff)
    counts_a      INT NOT NULL DEFAULT 0,   -- aggregate votes (anon + signed-in)
    counts_b      INT NOT NULL DEFAULT 0,
    created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- One row per signed-in play. The unique constraint IS the once-per-day rule.
CREATE TABLE daily_plays (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    challenge_id    UUID NOT NULL REFERENCES daily_challenges(id) ON DELETE CASCADE,
    choice          CHAR(1) NOT NULL,
    matched_editors BOOLEAN NOT NULL,
    played_at       TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (user_id, challenge_id)
);

-- One row per user. Streak + lifetime taste stats live here.
CREATE TABLE user_streaks (
    user_id          UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
    current_streak   INT NOT NULL DEFAULT 0,
    longest_streak   INT NOT NULL DEFAULT 0,
    last_played      DATE,
    freeze_available BOOLEAN NOT NULL DEFAULT TRUE,  -- one grace day, regenerates weekly
    freeze_used_on   DATE,
    taste_plays      INT NOT NULL DEFAULT 0,
    taste_agreements INT NOT NULL DEFAULT 0,         -- agreement % = agreements / plays
    updated_at       TIMESTAMPTZ DEFAULT NOW()
);
```

RLS: users can `SELECT` their own `daily_plays` and `user_streaks` rows. `daily_challenges` is readable by everyone **except** `editors_pick` / `editors_note` (serve those only through the play route so the reveal stays a reveal; a view or column-filtered API response handles this, the API route is simplest).

### The one RPC that does everything

`play_daily(p_user_id, p_choice)` · SECURITY DEFINER, granted to `service_role` only. Single transaction:

1. Load today's challenge (by `todayET()` date passed in). No challenge = closed.
2. `INSERT` into `daily_plays`. Unique violation = already played, return existing result.
3. Increment `counts_a` / `counts_b`.
4. **Streak logic:**
   - `last_played` = yesterday → streak + 1.
   - `last_played` = today → no-op (can't happen past step 2, belt and braces).
   - gap of exactly one missed day AND `freeze_available` → consume freeze, streak + 1 (the grace day).
   - anything else → streak resets to 1.
   - Regenerate `freeze_available` if `freeze_used_on` is 7+ days old.
5. **Credits:** compute award, then call `award_credits()` internally with dedupe key `daily:<date>:<user_id>`. The dedupe key means even a bug can't double-pay.
6. Return: both counts, editors pick + note, new streak, credits awarded, updated taste stats.

Anonymous visitors (Key 0, per the gating doc: never gate the hook) can play via a slim `play_daily_anon(p_choice)` that only increments the aggregate counters and returns the reveal. Their pick is remembered in localStorage. No streaks, no credits, and the UI says exactly that: "Sign in to start a streak." The daily itself is the free sample; the streak is the reason to become a Member.

### Credits config (extend, don't replace)

```ts
// lib/credits/config.ts additions
export const DAILY = {
  basePoints: 10,          // every play
  spikeMax: 25,            // random 0..spikeMax added server-side (variable reward)
  streakBonuses: { 3: 5, 7: 15, 14: 25, 30: 50 },  // extra on milestone days
} as const;
```

The randomness ("sometimes 12, sometimes 33") is generated **in the API route**, never the client. This replaces the separate "daily visit grant" idea: one ritual, one reward moment, less surface area.

### API routes (mirror the existing `/api/credits/earn` pattern)

- `GET /api/daily` → today's challenge, minus `editors_pick` / `editors_note`. Public, cacheable until midnight ET.
- `POST /api/daily/play` → body `{ choice: 'a' | 'b' }`. If a session cookie exists, run `play_daily`; else `play_daily_anon`. Zod-validated, service-role client, same shape as the earn route.

### Client

- `app/ctrla/daily/page.tsx` + `_components/DailyTasteTest.tsx`. Play state, reveal animation (the agreement bar filling is the dopamine moment, make it feel like the Prompt Mixer meter), streak marker, share button.
- A TOC entry + small teaser card on the landing page ("Today's Taste Test · No. 042").
- Streak + taste stats surface on `/ctrla/credits` (CreditsPanel already subscribes to the wallet in realtime; streak can piggyback on a `user_streaks` realtime subscription the same way).

### Share card

`app/api/og/daily/route.tsx` using `@vercel/og` (already available in Next). Renders the result in CTRL-A chrome: void background, gold accent, "Taste Test No. 042 · I sided with 68% · streak 12 · ctrl a". Share text carries the user's existing `?ref=` referral link, so the share loop and the referral loop are the same loop.

### Authoring workflow (fits how volumes already publish)

Dailies are authored **a month at a time**, alongside the volume:

1. Write `app/ctrla/_volumes/vol-02-dailies.ts` (an array of challenge objects, images referenced from `/public/ctrla/daily/vol2/`).
2. Run `npm run seed:dailies` → a small script (`scripts/seed-dailies.ts`) that upserts them into `daily_challenges` with the service-role key, keyed on `publish_date`.
3. Assets ship with the normal monthly deploy; scheduling is data, so no daily deploys ever.

---

## Phase 2 · Entitlements + the Sticker Sheet

### Entitlements (do this first, it's the foundation from the gating doc)

```sql
CREATE TABLE entitlements (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    entitlement TEXT NOT NULL,            -- 'vol1-sheet-prize', 'premium-download:prompt-pack'
    granted_by  TEXT NOT NULL,            -- 'stickers' | 'credits' | 'stripe' | 'comp'
    meta        JSONB DEFAULT '{}'::jsonb,
    expires_at  TIMESTAMPTZ,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (user_id, entitlement)
);
```

This is the "two currencies for the same door" table: rows get created by sticker completion now, by `spend_credits` when downloads go live, by Stripe later. One check everywhere: does the row exist?

### Stickers

Sticker **definitions live in code** (they are hand-drawn assets that ship with the volume), earned state lives in the DB.

```ts
// extend app/ctrla/_volumes/types.ts
export interface StickerDef {
  id: string;              // 'vol1-feature-read'
  name: string;            // 'Cover to Cover'
  asset: string;           // '/ctrla/VOL1/stickers/feature.webp'
  hint: string;            // 'Read the feature, all the way down.'
  trigger: StickerTrigger; // how it's earned (see below)
}
// Volume gains: stickers: StickerDef[]
```

```sql
CREATE TABLE user_stickers (
    user_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    volume     INT NOT NULL,
    sticker_id TEXT NOT NULL,
    earned_at  TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, volume, sticker_id)
);
```

`award_sticker()` RPC (service-role): insert if absent, then check whether the volume's sheet is now complete (count vs. a count passed in from the code-side definition); if complete, insert the entitlement row + a completion credit bonus (dedupe key `sheet:<volume>:<user>`).

**Triggers, two kinds:**
- **Server-attributed** (trustworthy): earned inside existing server paths. Referral sticker awards inside `/api/credits/refer`. "Played 10 dailies this volume" awards inside `play_daily`. Prediction stickers inside the stake route.
- **Client-claimed** (honor-system, same philosophy as the Instagram follow): scroll-to-end of the feature, prompt scored 80+ in the Mixer, sat 3 Fold sessions. Client calls `POST /api/stickers/claim` with the sticker id; route validates it's a claimable sticker for the **current** volume and awards. Spoofable in theory, worthless to spoof in practice, exactly like the IG follow.

**The close:** when `currentVolume` flips, the old volume's stickers simply stop being claimable (`/api/stickers/claim` only accepts current-volume ids, and server-attributed triggers only fire for the current volume). Earned stickers stay forever on the credits page. No cron needed; the volume flip IS the deadline.

UI: a sticker sheet section on `/ctrla/credits` (grayscale silhouettes for unearned, full-color hand-drawn for earned, progress "9 of 12"), plus a subtle toast anywhere a sticker lands.

---

## Phase 3 · Signals Predictions + Fold Regulars

### Predictions

```sql
CREATE TABLE predictions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    volume          INT NOT NULL,
    question        TEXT NOT NULL,
    options         JSONB NOT NULL,        -- ["Yes","No"] or multi
    closes_at       TIMESTAMPTZ NOT NULL,  -- staking freezes here
    resolved_option INT,                   -- null until resolved
    resolved_at     TIMESTAMPTZ
);

CREATE TABLE prediction_stakes (
    user_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    prediction_id UUID NOT NULL REFERENCES predictions(id) ON DELETE CASCADE,
    option        INT NOT NULL,
    stake         INT NOT NULL CHECK (stake BETWEEN 10 AND 200),
    staked_at     TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, prediction_id)
);
```

- **Stake:** one atomic RPC `stake_prediction(user, prediction, option, stake)` that spends credits and inserts the stake in the same transaction (never call `spend_credits` then insert separately; a crash in between eats someone's credits).
- **Payout:** fixed **2x** to start. Odds-based pools are sexier but harder to explain and tune; revisit after one volume of data.
- **Resolve:** `resolve_prediction(id, winning_option)` RPC, run manually as part of the volume-publish checklist. Pays every winning stake via `award_credits` with dedupe `pred:<id>:<user>`. Idempotent by construction.
- The stake cap (200) bounds the economy's downside while it's being tuned.
- Per-user lifetime "foresight" record derives from resolved stakes; show it next to the taste stat.

### Fold regulars

```sql
CREATE TABLE fold_sessions (
    id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    room       TEXT NOT NULL,
    seconds    INT NOT NULL,
    started_at TIMESTAMPTZ NOT NULL
);
```

Logged via `navigator.sendBeacon` to `POST /api/fold/session` when a sitting ends (only count sessions ≥ 5 minutes; cap credited time to keep tab-parking worthless). "Regular" status = N sessions in a room, computed by query, rendered as the presence-dot ring. Optionally: a small credit trickle only during golden hour, awarded server-side per session with a per-day dedupe key.

---

## Economy guardrails

- **Sinks before faucets.** Wire `premium-download` (75) and `premium-course` (100) spends through the entitlements table **in Phase 2**, before predictions add a new faucet. Credits nobody can spend are just a number going up.
- Rough faucet math at launch: daily play averages ~22/day, so a devoted player earns ~700/month + milestones + sheet bonus. A month of real engagement ≈ one course chapter + a download. Feels attainable, not free. All tunable from `config.ts`.
- **Progress framing everywhere:** the credits page never shows a price without showing distance ("30 away"), rendered as a partially-filled bar.
- Every award path has a **dedupe key**. Every spend+grant is **one transaction**. No exceptions.

---

## Build order

| Step | What | Touches |
|---|---|---|
| 1 | SQL migration: `daily_challenges`, `daily_plays`, `user_streaks`, `play_daily` RPCs | `utils/spbase-docs/daily-system-setup.sql` |
| 2 | `GET /api/daily`, `POST /api/daily/play`, config additions, `todayET()` | `app/api/daily/`, `lib/credits/config.ts`, `lib/daily/` |
| 3 | `/ctrla/daily` page + `DailyTasteTest` component + landing TOC card | `app/ctrla/daily/`, `_components/` |
| 4 | Streak + taste stats on the credits page | `credits/CreditsPageContent.tsx`, `CreditsPanel.tsx` |
| 5 | OG share card route + share button (carries `?ref=`) | `app/api/og/daily/` |
| 6 | Seed script + first 2 weeks of authored taste tests | `scripts/seed-dailies.ts`, `_volumes/` |
| 7 | Entitlements table + wire premium-download / course spends | Phase 2 |
| 8 | Sticker definitions on `Volume`, `user_stickers`, claim route, sheet UI | Phase 2 |
| 9 | Predictions tables + stake/resolve RPCs + Signals UI | Phase 3 |
| 10 | Fold sessions + regulars | Phase 3 |

Steps 1 through 6 are the launchable unit. Everything after compounds on it.

## Open decisions (flagging, with a recommendation each)

1. **Reset time:** midnight ET (recommended, it's the brand's home timezone) vs. midnight local. NYT uses local; ET is simpler and makes "everyone plays the same day" literally true.
2. **Streak requires sign-in:** yes (recommended). The daily is free for everyone; the streak is the Member hook, per the gating ladder.
3. **Content burden:** one taste test per day = ~30 pairs per volume. If that's too heavy editorially, ship 3 per week (Mon/Wed/Fri) with the same architecture; `publish_date` already supports gaps. Daily is better psychology, cadence is a content decision.
4. **Prediction payout:** fixed 2x now, odds pools later.
