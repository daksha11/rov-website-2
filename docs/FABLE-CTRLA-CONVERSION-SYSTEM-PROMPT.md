# Fable 5 Prompt · CTRL-A Conversion System (Klaviyo + Supabase)

Paste everything below the line into Fable 5. It is written to be dropped in as-is.
The context block is accurate to the repo as of this writing; if you change the plumbing
before running it, update the "What already exists" section so Fable doesn't rebuild it.

---

You are working in the Range Of View website repo (Next.js App Router, TypeScript,
Supabase auth, Klaviyo marketing). Your job is to design and build **the CTRL-A
conversion system**: a laddered email-then-account funnel where Klaviyo flows push
visitors from anonymous browse → email lead → real account → contributor. Deliver
both the app-side code and a Klaviyo buildbook I can configure in the dashboard.

Read `CLAUDE.md` and the CTRL-A route before writing anything. Match the existing
editorial voice and the house code style (heavy top-of-file comment blocks explaining
*why*, not just what). **No em dashes anywhere** (house rule), use commas/colons/periods.

## The strategy (do not redesign this, implement it)

A 3-rung ladder. The Supabase login is never a toll at the door: it appears only where
persistence is the reward. Klaviyo's job is to move people up the rungs.

- **Rung 0 · Anonymous browse.** No wall. We only *observe* interest so Klaviyo can
  segment later (which toolkit they looked at, whether they opened the brand kit).
- **Rung 1 · Email (soft gate).** The max-conversion moment. One field, instant Klaviyo
  profile, tagged by source + toolkit interest. Volume enters here. Keep friction tiny.
- **Rung 2 · Account (Supabase).** Prompted only when persistence *is* the value: save a
  brand kit, hold/spend credits, submit a contribution, track it getting featured.

## What already exists (DO NOT rebuild, extend it)

- `app/api/klaviyo/subscribe/route.ts` — email → Klaviyo subscribe, server path
  (private key, honors opt-in) with a public client fallback. Accepts `{email, name,
  source, listId}`. Upserts profile props `ctrla_source`, `signup_source`.
- `lib/ctrla/klaviyo-events.ts` — `fireCtrlaEvent(name, email, properties)`, best-effort,
  never throws. Already fires: `CTRL-A Submission Received / Approved / Featured / Rejected`.
- `app/ctrla/_components/CtrlASignup.tsx` — the one email-capture component. On success it
  fires onsite `_learnq` identify + `track("CTRL-A Signup")` and calls `onSuccess(email)`.
- `app/ctrla/_components/ToolGate.tsx` — soft client-side gate (localStorage
  `ctrla_unlocked` / `ctrla_lead_email`). Wraps content, shows a blurred teaser + email
  form until subscribed. Explicitly NOT hard security.
- `hooks/useLeadSync.ts` — on an authenticated Supabase session, syncs the user's email
  into Klaviyo once (deduped per user), and sets `ctrla_unlocked` so soft gates stop
  nagging a known lead. Currently only mounted on the brand-kit builder layout.
- Supabase auth: `utils/supabase/{client,server,middleware,admin}.ts`, `/account` page
  (role-aware), Google sign-in. Credits (`/api/credits/earn`, `/refer`), community
  submissions (`/api/ctrla/submissions`, `/review`), daily taste test, predictions.

## Deliverable 1 · App-side code

The system can't segment on what it doesn't track. Close these gaps. Everything Klaviyo
uses for triggers or filters must be emitted as an **event** or written as a **profile
property**. Keep all tracking best-effort (never block UI, never throw).

1. **Interest + funnel events.** Add onsite (`_learnq` track) and/or server events for:
   - `CTRL-A Viewed Toolkit` (with `toolkit: music | development | design`)
   - `CTRL-A Viewed Brand Kit`, `CTRL-A Brand Kit Started`, `CTRL-A Brand Kit Exported`
   - `CTRL-A Account Created` (fire once, from the account bridge below)
   - `CTRL-A Credits Earned`, `CTRL-A Referral Sent`
   Decide onsite vs server per event: use server (`fireCtrlaEvent`) for anything that must
   be reliable (account created, brand kit exported); onsite is fine for pure view signals.
   Centralize event names in one exported const map so they never drift from the buildbook.

2. **Profile properties for segmentation.** Ensure these land on the Klaviyo profile:
   `ctrla_source`, `toolkit_interest`, `account_created` (bool), `account_created_at`,
   `is_contributor`, `is_featured`, `credits_balance`. Extend `useLeadSync` (or a small
   server route) to set the account properties the first time we see an authenticated user.

3. **The account-activation bridge.** This is the rung 1 → rung 2 hinge. When a known
   email-lead (has `ctrla_lead_email` in localStorage) is browsing but has no Supabase
   session, and they reach for a persistence action (save kit, earn credits, submit),
   show an inline "create a free account to keep this" prompt that carries their known
   email into Google/Supabase sign-in. On first authenticated session, fire
   `CTRL-A Account Created` and set the account_* properties (extend `useLeadSync`).
   Mount `useLeadSync` everywhere an authenticated CTRL-A experience renders, not just the
   brand-kit builder.

4. **Wire the view/interest events** into the toolkit sections and brand-kit entry so
   rung-0 anonymous interest is actually captured.

Do not add a new email provider, do not change the subscribe route's contract, do not
introduce hard auth walls on rung-1 tools. Reuse `CtrlASignup` / `ToolGate` as-is.

## Deliverable 2 · Klaviyo buildbook (`docs/ctrla-klaviyo-flows.md`)

A step-by-step doc I configure in the Klaviyo dashboard. For EACH flow below give:
trigger (metric/list + filters), flow filters, each email's goal + subject + preview + a
first-draft body in CTRL-A voice, timing/delays, and the exit/skip conditions. Reference
the exact event and property names from Deliverable 1 so they line up.

Flows to specify:

1. **Welcome / onboarding** — trigger: joined the CTRL-A list. 4 emails: (a) welcome +
   what CTRL-A is, (b) tour the three toolkits, (c) the Brand Kit Generator, (d) create a
   free account to save your work (the activation CTA). Skip anyone who already has an
   account by later emails.
2. **Account activation** — trigger: has email, `account_created` is false, 3 days after
   signup. 2-3 emails making the case for an account (saved kits, credits, submission
   tracking). Exit on `CTRL-A Account Created`.
3. **Gate-abandon / tool re-engage** — trigger: `Viewed Brand Kit` or `Brand Kit Started`
   with no `Brand Kit Exported` and no account. Recover with a nudge back to the tool.
4. **Brand-kit completion** — trigger: `Brand Kit Started`, no `Brand Kit Exported` in 24h.
   Single high-intent recovery email.
5. **Submission lifecycle** — the four events already fire. Map each to an email:
   received (thanks + what's next), approved (congrats), featured (celebration + ask them
   to share + a referral CTA), rejected (warm, specific encouragement to resubmit).
6. **Win-back** — trigger: 60 days no email engagement. 2 emails, then suppress.
7. **Monthly drop** — note this is a recurring *campaign*, not a flow; specify the segment
   (whole engaged list) and cadence so it's not confused with the welcome flow.

Also specify the **segments** the flows depend on: anonymous leads (email, no account),
members (account_created), contributors, featured creators, cold (no engagement 60d),
and by `toolkit_interest`. And list the **required env** already in the repo
(`KLAVIYO_PRIVATE_KEY`, `KLAVIYO_LIST_ID`, `NEXT_PUBLIC_KLAVIYO_COMPANY_ID`) plus any new
metric names I must create in Klaviyo before the flows will trigger.

## Deliverable 3 · A short `docs/ctrla-conversion-system.md`

One page tying it together: the ladder diagram (0→1→2), the event/property dictionary
(name → where fired → which flow/segment consumes it), and the "what to turn on, in what
order" launch checklist. This is the map a human uses to verify the whole loop is live.

## Constraints

- No em dashes. House voice: grounded, warm, refined. No hype.
- Best-effort tracking only: a Klaviyo/Supabase outage must never break a page or a submit.
- Don't expose the private key client-side. Onsite events use `_learnq` only.
- Follow the canvas/`.next`/team-data rules in `CLAUDE.md` if you touch those areas.
- Show your work: before coding, output the event/property dictionary and let me confirm
  the names, since they must match the buildbook exactly.
