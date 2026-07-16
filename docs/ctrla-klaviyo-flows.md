# CTRL-A Klaviyo Buildbook

The step-by-step for configuring the CTRL-A flows in the Klaviyo dashboard. The app
already emits every event and property named here (see the dictionary). Build the
metrics and segments first, then the flows. House voice throughout: grounded, warm,
refined, no hype, no em dashes.

Required env (already in the repo): `KLAVIYO_PRIVATE_KEY`, `KLAVIYO_LIST_ID`,
`NEXT_PUBLIC_KLAVIYO_COMPANY_ID`.

---

## 1. Event + property dictionary

Create these metrics in Klaviyo before building flows (they appear automatically once
the app has fired each once, but the flow editor lets you pre-select known names).

| Event (metric name) | Fired from | Powers |
|---|---|---|
| `CTRL-A Signup` | onsite `_learnq`, `CtrlASignup` | Welcome trigger |
| `CTRL-A Guide Unlocked` | onsite, `ToolGate` email unlock | Guide nurture trigger |
| `CTRL-A Guide Completed` | server, `/api/credits/earn` | Guide nurture exit |
| `CTRL-A Brand Kit Exported` | server, `/api/ctrla/brand-kit/exported` | Brand-kit re-engage exit |
| `CTRL-A Account Created` | server, `/api/ctrla/account-bridge` | Activation exit |
| `CTRL-A Credits Earned` | server, earn + review routes | Credit milestone trigger |
| `CTRL-A Feature Submitted` | server, submissions route (Track B) | Feature lifecycle |
| `CTRL-A Submission Received` | server, submissions route | Feature lifecycle |
| `CTRL-A Submission Approved` | server, review route | Feature lifecycle |
| `CTRL-A Submission Featured` | server, review route | Feature lifecycle |
| `CTRL-A Submission Rejected` | server, review route | Feature lifecycle |

Onsite note: `CTRL-A Brand Kit Started` fires via `_learnq` when a kit first gets a
brand name (client). Wire it in the store if you want the "started, never exported"
recovery to trigger on the start rather than the first save.

Profile properties (set by the app):

| Property | Set by | Use in segments / filters |
|---|---|---|
| `ctrla_source`, `signup_source` | subscribe route, account bridge (`google-login`) | source segmenting |
| `account_created` (bool), `account_created_at` | account bridge | members vs leads |
| `credits_balance` | earn/spend events carry `balance`; sync to a property if you want to segment on it | has-credits segment |
| `toolkit_interest` | set from the toolkit a lead engaged with | interest segments |
| `is_contributor`, `is_featured` | set on approval / feature | contributor segments |
| `unlocked_guides` | appended on guide unlock | guide segments |

---

## 2. Segments to build first

- **Anonymous leads** · in the list AND `account_created` is not true.
- **Members** · `account_created` equals true.
- **Contributors** · `is_contributor` equals true.
- **Featured creators** · `is_featured` equals true.
- **Cold** · has not opened or clicked email in 60 days.
- **By interest** · `toolkit_interest` equals music / web-dev / design / video.
- **Has credits to spend** · `credits_balance` is at least 50.

---

## 3. Flows

For each: trigger, flow filters, per-email goal / subject / preview / first-draft body,
timing, and exits.

### 3.1 Welcome / onboarding
- **Trigger**: added to the CTRL-A list (or metric `CTRL-A Signup`).
- **Flow filter**: has not received this flow in the last 30 days.
- **Email 1** (immediate). Goal: land the promise. Subject: "You are in. Here is what
  CTRL-A is." Preview: "The short version, then the good stuff." Body: what CTRL-A is
  in three lines, the one thing to do first (open a toolkit), warm sign-off.
- **Email 2** (+2 days). Goal: tour the toolkits. Subject: "Four toolkits, pick your
  lane." Body: one line each on music / web-dev / design / video, link each.
- **Email 3** (+2 days). Goal: the brand-kit generator. Subject: "Build a brand kit,
  free." Body: what it does, that building is free, link to start.
- **Email 4** (+3 days). Goal: the account ask. Subject: "Make it yours." Body: an
  account saves your work, holds credits, tracks what you submit. CTA to sign in.
- **Skip / exit**: skip Email 4 for anyone where `account_created` is true.

### 3.2 Guide nurture
- **Trigger**: `CTRL-A Guide Unlocked`.
- **Flow filter**: none.
- **Email 1** (+2 days). Goal: pull them back to finish. Subject: "Still thinking about
  {{ event.guide }}?" Body: the payoff of finishing, that completing it earns credits,
  link back.
- **Email 2** (+3 days). Goal: last nudge. Subject: "Two minutes to finish." Body:
  shorter, one clear link.
- **Exit**: `CTRL-A Guide Completed` for the same guide.

### 3.3 Account activation
- **Trigger**: metric `CTRL-A Signup`, time delay, filter `account_created` is not true.
- **Email 1** (+3 days). Goal: make the account case. Subject: "Save your work." Body:
  the three account payoffs (saved kits, credits, tracking).
- **Email 2** (+4 days). Goal: the credit hook. Subject: "You are leaving credits on the
  table." Body: what credits unlock, that an account starts with a balance.
- **Exit**: `CTRL-A Account Created`.

### 3.4 Credit milestone
- **Trigger**: `CTRL-A Credits Earned`.
- **Flow filter**: trigger on the earned balance crossing a threshold, NOT on the
  day-one 1,000 seed. Use a conditional split on `event.balance` at 50 / 150 / 250 and
  only send when the prior balance was below it (a "first time above" check), so the
  starting seed does not fire everyone at once.
- **Email** (immediate per threshold). Subject at 50: "You can export your brand kit
  now." At 150: "You can submit art to the magazine." At 250: "You can submit a full
  story." Body: one action, one link.

### 3.5 Brand-kit re-engage
- **Trigger**: `CTRL-A Brand Kit Started` (onsite) with no `CTRL-A Brand Kit Exported`
  in 24h.
- **Email 1** (+24h). Goal: recover intent. Subject: "Your brand kit is waiting."
  Body: pick up where you left off, the export is one step away, link back.
- **Exit**: `CTRL-A Brand Kit Exported`.

### 3.6 Feature lifecycle
One flow, branched by the submission events, so a submitter is warm through review.
- **Trigger**: `CTRL-A Submission Received` where `track` equals magazine (use
  `CTRL-A Feature Submitted` if you prefer the track-specific event).
- **Email: received** (immediate). Subject: "Got your feature. Here is what happens
  next." Body: the review steps, the timeline, that they can track it on their profile.
- **Conditional splits** on the later events:
  - `CTRL-A Submission Approved` → Subject: "You are in." Body: congrats, the credits
    earned, where it will appear.
  - `CTRL-A Submission Featured` → Subject: "You are featured." Body: celebrate, link
    to the live feature, ask them to share, a referral CTA.
  - `CTRL-A Submission Rejected` → Subject: "Not this one, but keep going." Body: warm
    and specific, include `event.review_note`, invite a redo.

### 3.7 Win-back
- **Trigger**: has not engaged in 60 days (segment `Cold`).
- **Email 1** (day 0). Subject: "Still want CTRL-A in your inbox?" Body: the honest
  ask, one link to the best recent thing.
- **Email 2** (+5 days). Subject: "Last one from us for a while." Body: brief, one
  link, then suppress non-openers.

### 3.8 Monthly drop
- **Not a flow, a campaign.** Send monthly to the engaged list (members + leads who
  opened in the last 60 days). Keep it distinct from the welcome flow so a new lead does
  not get both in the same week.

---

## 4. Launch checklist

1. Confirm the metrics in §1 exist (fire each once from staging if needed).
2. Build the segments in §2.
3. Build flows 3.1 through 3.7, paste the draft copy, set the timings.
4. Set the monthly drop as a recurring campaign.
5. Turn flows live one at a time, watching the first sends.
