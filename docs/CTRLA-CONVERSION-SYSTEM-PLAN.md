# CTRL-A Conversion System · Master Plan

The plan for turning CTRL-A into a converting experience: a value ladder where
free taste pulls people in, an email unlocks the deep guides, and a login + credits
economy powers the brand-kit generator and magazine contributions. Klaviyo rides on top.

This is the source of truth. The Fable 5 build prompt is generated from this doc.
House rules apply: no em dashes, voice is grounded / warm / refined, all third-party
tracking is best-effort and never blocks a page.

---

## 1. The value ladder

Four rungs. The wall only ever appears where the thing above it is worth the step.

| Rung | Access | What lives here | Why |
|------|--------|-----------------|-----|
| **0 · Taste** | Free, no wall | Every toolkit's overview + taste. Cover, teasers, the wall of approved community picks, the Daily. | Volume and trust. Let people feel the quality before we ask for anything. |
| **1 · Email** | Email unlock (Klaviyo) | The in-depth guides / crash courses (e.g. Claude Code crash course). Premium downloads that aren't credit-worthy. | The lead-capture engine. A real magnet (the crash course) feeds the welcome flow. |
| **2 · Login** | Supabase account | Personal surface: saved work, credit balance, submission tracking, public profile. | Persistence is the reward. Login is a gift, never a toll. |
| **3 · Credits** | Login + earned credits | Brand-kit **export** (build free, export costs), magazine feature submissions (art + story). | Scarcity where it protects quality: paying to take work out, and anti-flood on features. |

Design rule: never charge credits for something whose main job is reach (guides, taste).
Only charge where a cost improves the product (generator load, feature quality bar).

Future option (not now): specific advanced guides may move to a credit cost. The guide
gate is built so flipping one guide from email to credits is a config flag, not a rewrite.

---

## 2. Gating map (what wraps what)

- **Toolkit taste** — no gate. Free forever.
- **Deep guides / crash courses** — `ToolGate` (existing soft email gate). Email in →
  Klaviyo profile + `toolkit_interest` → content reveals. Keep the option to swap a
  guide's gate to a credit cost later via a `gate: "email" | "credits"` prop.
- **Brand-kit generator** — free to view and use. Anyone can open the builder and play,
  no wall. The gate is on **export only**: exporting requires login + spends credits
  (`brand-kit-export`, already 50). This keeps the generator as a top-of-funnel magnet;
  the account + credit ask lands at the moment of real value (taking the work with you).
- **Magazine features (art + story)** — require login AND a credit cost to submit.
- **Toolkit contributions (tool / idea / signal / resource / history)** — require login,
  free to submit, rate-limited. Useful signal we want lots of.

---

## 3. The credits economy (updated)

One tuning file already exists: `lib/credits/config.ts`. Extend the tables. All numbers
below are STARTING values, tuned in one place. Server-authoritative via `award_credits`
(earn) and the spend path; the browser only ever asks.

### Earn (existing + new)

| Action | Points | Repeat? | Notes |
|--------|--------|---------|-------|
| Follow on Instagram | 100 | once | exists, honor-system claim |
| Refer a friend | 250 | per signup | exists, server-attributed |
| The Daily (taste test) | 10 + spike | daily | exists, variable reward + streak bonuses |
| **Social engagement** | 50 | capped | NEW. Share / tag / story featuring CTRL-A. Honor-system claim like IG, with a weekly cap + dedupe. Verify where the platform allows. |
| **Complete a guide / toolkit level** | 75 | once per guide | NEW. Rewards the learning loop, drives guide completion. Fires on the guide's completion event. |
| **Contribution approved** | 100 | per approval | NEW. Rewards quality, helps fund the next feature. |
| **Contribution featured** | 250 | per feature | NEW. The big payoff. A featured story nets positive even after its submit cost. |

### Spend (existing + new)

| Unlock | Cost | Notes |
|--------|------|-------|
| Brand-kit export | 50 | exists |
| Premium download | 75 | exists |
| Premium course | 100 | exists, only if a guide is set to credit-gate |
| **Submit art feature** | 150 | NEW. Anti-flood + quality signal for the magazine. |
| **Submit story feature** | 250 | NEW. Higher bar for the full editorial format. |

### The loop that makes it fair

Submitting a feature costs credits; getting **featured** pays more back (250) than most
submit costs. So confident, quality work is net-positive and spam is taxed. A brand-new
user can't immediately flood: reaching a story's 250 cost takes real engagement
(IG follow + finishing the free crash course + a few Daily plays). The economy self-gates.

Consider (flag, tune later): a partial refund of the submit cost on approval, so a good
faith miss stings less than a spam miss.

---

## 4. Contributions, redesigned: two tracks

Today there is one text-based pipeline (`tool / idea / signal / resource`, free,
rate-limited, → pending → approved → featured, public profiles at `/ctrla/u/[handle]`).
Split the mental model into two clearly separate doors. Both flow through the same
review + status backbone, but the intent, UX, cost, and bar differ.

### Track A · Improve the toolkits (utility)  — free, login, rate-limited

Purpose: make the toolkits better. High volume, community-voted, low friction.

| Type | What it is | Media |
|------|-----------|-------|
| Tool | A tool that belongs in a toolkit | link |
| Idea | A direction CTRL-A should explore | text |
| Signal | An industry shift for the Signals feed | link + text |
| Resource | A guide/video/read that leveled you up | link |
| **History** (NEW) | A dated milestone for a toolkit's history section | text + optional link/image |

Keep free. Keep the 10/day rate limit. Approved → on the wall; featured → promoted into
the toolkit / history proper. Earns credits on approve/feature (see economy).

### Track B · Get featured in the magazine (creative) — credits, login, high bar

Purpose: fill the magazine with real creative work, CTRL-A style. Media-heavy, curated,
credit-gated. This is a NEW submission surface (Supabase Storage for uploads).

**Art feature** (cost 150). Any medium: pottery, painting, music, film, design.
- Title + medium/kind
- Hero media + gallery (images; audio for music; short video ok)
- Tools / materials used (tagged, mapped to toolkits where relevant)
- Short artist statement
- Artist bio + links (feeds the public profile)

**Story feature** (cost 250). The full editorial. Every one REQUIRES:
- **Hero media + gallery** — quality minimums so the magazine always looks good.
- **Tools-used breakdown** — every tool/app/material, mapped to CTRL-A toolkits. The
  CTRL-A signature: show the how, not just the what.
- **Process, the ugly steps included** — a structured walk through the real process,
  messy middle and all. Matches the "none of the ugly steps skipped" thesis.
- **Artist bio + links** — who made it, their handle, links. Credit + reach.

Both go: submit (spend credits) → pending → in review → approved → featured in a volume,
or declined with a warm, specific note. Featured pays credits back + a public feature.

### Review

Extend the existing admin review (`app/admin/ctrla`) to handle media-heavy features:
gallery preview, the tools-used list, and the process read, plus approve / feature /
decline with a note. Track A and Track B share the status vocabulary
(pending / approved / featured / rejected) so `/account` tracking and Klaviyo events
work for both.

---

## 5. Contribution UX/UI (this is where it's won or lost)

A single **Contribute** hub with two obvious doors:

- **Improve a toolkit** — free. Fast forms, a visible "this helps the whole community"
  frame, community voting on the wall. Low ceremony.
- **Get featured** — credits. A guided, magazine-feeling builder:
  - Cost shown upfront next to the live balance. If short, an inline "earn credits"
    path (do the Daily, finish a guide, follow IG) instead of a dead end.
  - Media upload with a live magazine-style preview so the submitter sees their spread
    forming. Tool-tagging as they go.
  - For stories: a structured, sectioned form (hero, tools, process, bio) that makes the
    required shape obvious and hard to submit half-done.
  - After submit: clear status in `/account` (CommunityPanel exists), and Klaviyo keeps
    them warm through review.

Principle: the free door should feel effortless; the paid door should feel like being
published, worth the credits, and never like a slot machine.

### Dedicated submission pages, not one cramped form

Each submission type gets its **own route/page**, tailored to that type, Supabase-linked:
- Magazine: `/ctrla/submit/art`, `/ctrla/submit/story`.
- Toolkit: `/ctrla/submit/tool`, `/idea`, `/signal`, `/resource`, `/history`.
- The Contribute hub (`/ctrla/submit`) is the two-door chooser that routes into these.

Break the UX up so each form is neat, single-purpose, and only shows the fields that type
needs (no mega-form with half the fields hidden). Shared pieces (media upload, tool-tagging,
credit-cost header, status) are components reused across pages, not copy-pasted.

### Admin-controllable forms (front-end + Supabase)

The forms are **configurable, not hard-coded**. A Supabase table (e.g. `ctrla_form_configs`)
holds each type's fields, labels, help text, required flags, credit cost, and whether the
type is open/closed. The admin panel (`app/admin/ctrla`) edits these from the front end:
toggle a submission type on/off, reorder or retitle fields, change a cost, pause the art
queue when it's full. The same rows are readable/editable directly in Supabase for a quick
manual fix. The submission pages render from this config, and the server still validates
every payload with zod (config drives the UI; zod is the safety floor, never bypassed).

---

## 6. Klaviyo flows (layered on the ladder)

Events + profile properties are the fuel. The app must emit everything a flow triggers on.

New/confirmed events: `Guide Unlocked` (which guide, toolkit), `Guide Completed`,
`Brand Kit Started/Exported`, `Account Created`, `Credits Earned` (action, balance),
`Feature Submitted` (track, type, cost), plus the existing submission lifecycle events.

Profile properties: `toolkit_interest`, `account_created(_at)`, `credits_balance`,
`is_contributor`, `is_featured`, `unlocked_guides`.

Flows:
1. **Welcome / onboarding** — trigger: joined list (usually via a guide unlock). Sell
   CTRL-A, tour toolkits, push the crash course, end on "make an account to save + earn."
2. **Guide nurture** — trigger: `Guide Unlocked`, no `Guide Completed` in N days. Pull
   them back to finish (and earn the completion credits).
3. **Account activation** — trigger: has email, `account_created` false. Convert rung 1 → 2.
4. **Credit milestone** — trigger: `credits_balance` crosses a feature's cost. "You can
   now submit a feature / unlock the generator." Turns balance into action.
5. **Brand-kit re-engage** — trigger: `Brand Kit Started`, no `Exported`. Recover intent.
6. **Feature lifecycle** — submitted → in review → approved (congrats + credits) →
   featured (celebration + share + refer) → declined (warm, specific, invite a redo).
7. **Win-back** — 60d no engagement, 2 emails then suppress.
8. **Monthly drop** — recurring campaign to the engaged segment (not a flow).

Segments: anonymous leads, members, contributors, featured creators, cold, by
`toolkit_interest`, and "has credits to spend."

---

## 7. Build inventory (extend, don't rebuild)

Exists: `ToolGate`, `CtrlASignup`, `/api/klaviyo/subscribe`, `fireCtrlaEvent`,
`useLeadSync`, credits (`/api/credits/*`, `award_credits` RPC, `lib/credits/config.ts`),
submissions (`/api/ctrla/submissions`, `/review`, `lib/ctrla/community.ts`), public
profiles, admin review, `/account` + CommunityPanel.

New to build:
- Keep the brand-kit builder free to view and use; gate export only (login + existing cost).
- Guide gate with `gate: "email" | "credits"` prop (default email now).
- Credits: add earn actions (social, guide-complete, contribution approve/feature) and
  spend actions (art 150, story 250) to `config.ts` + the earn/spend routes.
- Track B submission surface: media upload (Supabase Storage), art + story payloads,
  credit-cost-on-submit, extend the zod schemas + `ctrla_submissions`.
- Add `history` type to Track A.
- The Contribute hub UX (two doors) + the feature builder with live preview.
- Extend admin review for media features.
- Emit the new events + profile properties; extend `useLeadSync` for account props.
- The Klaviyo buildbook doc for the flows above.
- A UI/UX audit + redesign proposal for the `/account` profile page and the admin panel
  (`app/admin` + `app/admin/ctrla`), since both now carry more weight: the profile is the
  member's home (balance, earn paths, submission tracking, saved work), and the admin panel
  gains form-config control + media-feature review. Audit the current layout/IA/hierarchy
  against those new jobs and propose optimal changes.

---

## 8. Open decisions (flagged, not blockers)

- Exact credit numbers (§3) are first-draft; tune in `config.ts`.
- Art vs story cost split (150 / 250) and whether featured pays a flat 250 or scales.
- Partial refund of submit cost on approval? (fairness vs simplicity)
- Social-engagement earning: honor-system + weekly cap now, verified later?
- Which single guide is the flagship email magnet (Claude Code crash course assumed)?
- Media limits for uploads (types, size, count, moderation).
