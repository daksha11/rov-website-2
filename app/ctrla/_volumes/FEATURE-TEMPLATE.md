# CTRL-A Feature Template

Every volume's deep feature is the same **template**, not a fresh build. It is composed
from four fixed beats plus optional modules, all driven by the `feature` block in
`vol-NN.ts` (typed by `Feature` in `types.ts`, rendered by `FeatureStory` in
`_components/DreamAsiaSections.tsx`). You fill in data; the story assembles itself.

This is the feature-specific companion to the runbook `PUBLISHING-A-VOLUME.md`. Read that
first for how a whole volume ships (add one file, flip one pointer, drop one media folder);
read this for how to author the feature inside it.

## The core rule

**Fixed beats keep authoring cheap. Optional modules stop every story looking identical.**

- The four fixed beats are the same blanks every issue: open, work, turn, toolkit. Filling
  them is a checklist, not a design problem. That is what lets us ship 12 a year.
- The optional modules are the levers. A music feature might add The Sound and The
  Interview; a design feature might add The Scale and nothing else. Include only what the
  story earns. Two features that use different modules do not look like the same page.

## Order on the page

`FeatureStory` always renders in this order. Modules only appear when the volume supplies them:

```
1. The Open      (fixed)
2. The Work      (fixed)
3. The Turn      (fixed)
   · The Scale      (optional module)
   · The Interview  (optional module)
   · The Sound      (optional module)
4. The Toolkit   (fixed, always closes the story)
```

The Turn sits after The Work on purpose: the reader has seen the craft, now they feel what
nearly cost it. The Toolkit always closes · "how it was made, so you can too" is the payoff.

---

## The four fixed beats (always required)

### 1 · The Open · data field `issueOpen`
The hook. Who, what, why it matters.

- `eyebrow` · kicker, e.g. "The story · How it started"
- `headline` · one line
- `body` · **1 to 2 paragraphs** (~40 to 90 words total)
- `vueNote` · **exactly one** Vue pull-quote, the mascot's read on the story
- `stage` · **1 hero media panel** (`src`, `label`, `ratio`). Portrait (`4 / 5`) reads well beside the copy.
- Also uses the shared `coverShot` (the 16:7 hero frame) and `issueMeta.featureHeadline`.

### 2 · The Work · data field `bts`
The proof. A mosaic of the real work.

- `eyebrow`, `headline`, `note` (a short right-aligned aside)
- `tiles` · **4 to 8 tiles**. Each is `img` OR `video` (never a placeholder), plus `label`,
  `ratio`, and a 12-col `span` (use `wide: true` on the lead tile for a full mobile row).
- Videos use the LazyVideo pattern automatically. Keep clips under ~2 MB (see the runbook's Assets note).

### 3 · The Turn · data field `turn`
The narrative pivot. The one obstacle or decision that nearly broke the show, and what the
team chose. This is what stops the feature reading as a gallery with captions.

- `eyebrow`, `headline`
- `body` · **~150 to 200 words**, 2 to 3 paragraphs of finished prose. ROV voice: direct,
  no hype, no em dashes. Name a real decision (a budget call, a venue change, a 3am mix).
- `pullquote` · one emphasis line, set large beside the prose.

> If you do not have the true story yet, draft it in-voice and mark the block
> `DRAFT COPY FOR ANDI TO VERIFY` in a code comment (see Vol. 01's `turn`). A drafted-and-
> flagged turn is fine in progress; an unflagged invented one is not. Never ship lorem.

### 4 · The Toolkit · data field `productionToolkit`
The payoff. The exact stack, so a reader can copy the workflow.

- `eyebrow`, `headline`, `note`
- `tools` · each is `name`, `role` (a 1-3 word tag), and `line` (one sentence on what it did).
  6 tools reads well; 4 to 8 is the working range.

---

## The optional modules (include or omit)

Add a module by setting its field on `feature`. Omit it by leaving the field off entirely ·
`FeatureStory` renders each only when present, so omission needs no code change.

### The Scale · data field `twoCities`
A multi-location / multi-show beat: same production, rebuilt elsewhere. Use when the story's
size is part of the point.

- `eyebrow`, `headline`, `body` (one short paragraph), `panel` (one media panel).

### The Interview · data field `interview`
Three questions, in the subject's own voice. Use when a person is the story.

- `eyebrow`, `headline`, `subject` (who is answering)
- `qa` · **exactly 3** `{ question, answer }` pairs. Keep answers to 2 to 4 sentences.

### The Sound · data field `sound`
One embedded track, as a link-out card (matches the on-repeat pattern). Use for music features.

- `eyebrow`, `headline`, optional `note`
- `track` · `title`, `artist`, `image` (square art), `url` (streaming link).

---

## Authoring a Vol. 02 feature (worked example)

1. In `vol-02.ts`, fill the `feature` block: set `href`, `coverShot`, and the four fixed
   beats (`issueOpen`, `bts`, `turn`, `productionToolkit`). TypeScript's `Feature` type will
   flag anything missing.
2. Decide the modules. A band feature might add `interview` and `sound` and omit `twoCities`.
   A studio-build feature might add only `twoCities`. Add the fields you want; leave the rest off.
3. Drop media into `public/ctrla/VOL2/` at the paths you referenced. No placeholders ship.
4. Verify: `npx tsc --noEmit` is clean, then confirm the feature route renders every beat you
   supplied with real media. Then run the full QA checklist in `PUBLISHING-A-VOLUME.md`.

The feature route (`/ctrla/dreamasia` today) always renders `currentVolume`'s feature through
`FeatureStory`, so publishing the volume publishes the feature. If archived issues should keep
their own feature routes, wire per-volume feature pages (a known follow-up in the runbook).
