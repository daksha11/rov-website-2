# Publishing a CTRL-A Volume

CTRL-A is a monthly magazine. Every volume's editorial content lives in one file under
`app/ctrla/_volumes/`. Publishing a new volume is "add one file, flip one pointer, drop
one media folder." This runbook is the checklist. Follow it top to bottom.

## How the system works

- `app/ctrla/_volumes/vol-01.ts` (and future `vol-02.ts`, ...) each `export const volNN: Volume`
  containing ALL volume-specific editorial content: issue meta, the feature story, off-the-clock
  picks, events, cookbook, closing note.
- `app/ctrla/_volumes/index.ts` holds the `volumes` registry and a single `currentVolume` pointer.
- `app/ctrla/data.ts` is a thin compatibility hub: it re-exports the current volume's bindings and
  keeps the evergreen toolkit subsystem. Do not put volume content here.
- `/ctrla` always renders `currentVolume`. Past issues auto-archive at `/ctrla/vol/[n]`.

Flipping `currentVolume` re-themes the whole live surface at once: landing, footer colophon,
loader, and the back-nav on the toolkit / cookbook / dreamasia pages, plus `/ctrla` metadata.

## The publish steps

1. **Create the volume file.** Copy `vol-01.ts` to `vol-02.ts`, rename the export to `vol02`,
   and replace every field with the new issue's content. Keep the `Volume` type happy (import it
   from `./types`); TypeScript will flag anything you miss.
2. **Register it.** In `_volumes/index.ts`: add `2: vol02` to `volumes`, and set
   `currentVolume = vol02`. That single change publishes the issue and archives the previous one.
3. **Drop the media.** Put the issue's images/videos in `public/ctrla/VOL2/` (match the paths you
   referenced in the volume file). Keep individual video files small (see QA below).

## QA checklist (do not skip, this is what keeps 12 volumes a year honest)

- [ ] `npx tsc --noEmit` is clean.
- [ ] `npm run build` passes and lists the new `/ctrla/vol/[previous-number]` archive route.
- [ ] **Anchor-link check.** Every `href` in the landing `CONTENTS` array (in `CtrlAContent.tsx`)
      resolves: on-page `#anchors` must have a matching `id` rendered on the landing route, and
      `/ctrla/...` routes must exist. (A dead `#cookbook` anchor shipped once because this step
      did not exist. Do not let it happen again.)
- [ ] **No placeholders shipped.** Every feature tile, image, and panel is backed by a real asset.
      A placeholder never ships. An honest smaller feature beats an aspirational incomplete one.
- [ ] **No em dashes** anywhere in the volume copy. Use commas, colons, periods, or a middot.
- [ ] `/ctrla`, `/ctrla/dreamasia`, `/ctrla/cookbook`, `/ctrla/vol/[prev]` all render and show the
      correct volume label sourced from `currentVolume`.
- [ ] The previous volume reads correctly at its archive URL.

## Assets

- **Compress video before committing.** VOL media is the heaviest thing in the repo. Target under
  ~2 MB per clip (H.264, faststart, 1080p cap). Feature videos already lazy-load, but the bytes
  still ship to anyone who scrolls. If `ffmpeg` is not installed locally, install it first.
- **Refresh tool screenshots** if the toolkit picks changed (see the toolkit subsystem; screenshots
  live under `public/ctrla/toolshots/` once that migration lands, replacing the third-party mShots).

## Known follow-ups (wire these when the owning wave runs)

- `app/ctrla/the-fold/_content/fuel.ts` still hardcodes `Vol. 01` in ~3 places. Point it at
  `currentVolume` when The Fold is next touched.
- `/ctrla/dreamasia` is a single live route pointing at the current volume's feature. If archived
  issues should link to their own feature, add per-volume feature routes.
- Toolkit content (`toolkitSections` in `data.ts`) is still evergreen/shared, not per-volume. If
  toolkit picks should archive with each issue, fold that data into the volume model.
