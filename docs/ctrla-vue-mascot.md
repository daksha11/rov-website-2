# Vue · the CTRL·A narrator

Vue already existed in the copy. `VueNote` in `DreamAsiaSections.tsx` and
`VueClose` in `IssueSections.tsx` both carried a literal `Vue mascot drop-in
slot` comment with a placeholder circle where the character should be, and
`vol-01.ts` signs the closing note "Vue · Vol. 01 · CTRL-A". The voice shipped;
the face never did. This is the face.

## The idea

Vue is a spacefarer in a robe with a **blank visor and a single glowing gold
sigil for an eye**. That eye is the whole opportunity, so the split is:

**PNG body, SVG face.** The body is settled art and stays a flat webp. The eye
is one SVG the size of a postage stamp, and it is the only part that has to
move.

The catch: the sigil was *painted into the art*, and an overlay on top of a
painted eye can glow but can never close. So the optimizer **erases the sigil
off the visor**, fitting a quadratic surface to the surviving visor around it,
which rebuilds the gradient and its specular streaks at the right brightness.
The visor ships blank, `VueEye` is the only eye there is, and Vue can blink.

## What shipped

**Assets**

- `public/ctrla/vue/`: six optimized poses, 6.12 MB of PNG down to 0.51 MB of
  webp (92% smaller). Trimmed, height-normalized so Vue is the same size
  character in every pose, and sigil-erased.
- `.asset-originals/vue/`: the full-res masters, gitignored, off the CDN.
- `scripts/optimize-vue-poses.mjs`: drop a new `vue_<pose>_<colorway>.png` in,
  add its `ERASE` rect, re-run. Needs `sharp` (now a devDependency).

**Components**, in `app/ctrla/_components/vue/`

- `poses.ts`: the registry. Role, intrinsic size, facing direction, the
  measured visor rect, and the gesturing-hand point for each pose. Add a pose
  here and it is available everywhere.
- `VueEye.tsx`: the sigil, traced from the painted original into a 128×100
  viewBox: an angular lens, two nested rings, a diamond pupil, six rays.
- `Vue.tsx`: the join. Draws the pose, lays the eye onto the registry rect.
  Exports `VueBust` for a round shoulders-up crop.
- `VueHandoff.tsx`: Vue beside a section with a thread drawn from her palm to
  its heading.
- `VueAside.tsx`: a line of narration with her bust on it. The small sibling of
  the hand-off, for beats where a full figure is too much ceremony.
- `narration.ts`: Vue's lines per toolkit, three beats each.
- `app/ctrla/vue-lab/`: a working bench at `/ctrla/vue-lab` (noindexed).
  Delete once Vue is settled.

**What the eye does**, all GSAP, all collapsing to a static drawn eye under
`prefers-reduced-motion`:

| Behaviour | Mechanic |
|---|---|
| **Wake** | `DrawSVGPlugin` draws lens → rings → pupil → rays, ~900ms, on first intersect |
| **Blink** | The lens `scaleY` collapses to 0.04 and back, 120ms, on a randomized 4–9s repeat |
| **Gaze** | The iris translates toward the pointer via `quickTo`, with a slow idle drift underneath |
| **Pulse** | The rays breathe on a 3s yoyo |

Three moods (`calm`, `focused`, `alert`) vary lens scale, ray flare, and blink
cadence.

**Placements**

1. **`VueNote`**: a 38px `VueBust` as the byline on Vue's own pull-quote, in
   `focused`, replacing the placeholder circle.
2. **`VueClose`**: `leaning`, braced on a rule added under the sign-off and
   bled off the right edge of the page (see **The leaning pose** below). The
   copy reads "I drift a little above all this, watching what you build" and
   the pose is exactly that.
3. **The Spine rider**: a 34px `VueBust` pinned to the head of the progress
   rail, descending as you read. It flashes `alert` for a beat each time you
   cross into a new section, which the rail already tracks. This is the one
   that makes Vue a narrator rather than a sticker.
4. **The hand-off**: `VueHandoff` on "Which one are you?", the single moment
   the reader has to choose a direction. `showing` faces right, so Vue leads
   and the question follows; a gold thread draws from her open palm to the
   heading on scroll-in. Below 900px the stylesheet drops Vue entirely rather
   than stacking her over a heading the thread would point at from nowhere.
   Because that is `display: none`, the lazy image never loads on phones.

**Toolkit narration** on `/ctrla/toolkit/[id]`. Three beats per sector, lines in
`narration.ts`:

1. **open**, before the craft guide: a hand-off, so the first voice on the page
   is the guide's and not the tool list's.
2. **stations**, at Part 02: an aside handing over to the kit itself.
3. **close**, before prev/next: an aside plus the same edge-bled `leaning`
   figure that closes the magazine.

All three run clay-on-cream and take `theme={edLight}`, which swaps the thread
and the eyebrows from gold to plum. Vue's eye stays gold in both themes,
because it is painted on a visor that is dark in both colorways.

## Three things worth knowing

**The leaning pose has no right arm.** The art assumes that side is behind an
edge, so rendered free-standing it reads as a missing limb. `poses.ts` carries
an `edge` entry for it (`right`, 18%) and `<Vue bleed>` clips there: the
component then measures only the visible part, so sitting it flush against a
container edge is the whole placement. 18% is the cut where the trailing drape
and the far boot both still cross the edge, so the body clearly continues
behind it. **Never render `leaning` without `bleed`.**


**IntersectionObserver, not ScrollTrigger.** Both `VueEye` and `VueHandoff`
trigger on IO. "Is this on screen" is the only question being asked, and IO
answers it without caring which element scrolls or needing a refresh when the
page reflows around lazy images.

**Colorway rule.** `purple` is the magazine (the dark `ed` theme); `clay` is
the toolkits (cream `edLight`). The two colorways of a pose are
pixel-registered, same trimmed crop and same figure height, so they can
cross-fade in place. Clay on cream was the plan's open question; the lab
confirms it holds, carried by the dark brown linework and the sash.

## Still to do

- **The loader.** `CtrlALoader` runs once per session over a WebGL aurora. Vue
  in `showing`, small, bottom-left, eye waking as the progress fills. The first
  frame of the brand, and the eye component is now proven.
- **Per-station narration.** The toolkit beats sit between sections, not on
  individual tools. `ToolkitStations.tsx` is the place to go finer if it earns
  it.
- **More poses.** Six is a thin vocabulary and the placements above nearly
  exhaust it. A *waving* and a *sitting* pose would unlock the loader and the
  Discord door properly.
- **The hand-off is used once, on purpose.** Two more at most, on `Contents`
  and `TheRoom`. A gesture that happens at every section stops being a gesture.
