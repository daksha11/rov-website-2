# CTRL-A Nav Restructure Plan

Date: 2026-07-22
Owner: Andi
File under change: `app/ctrla/CtrlAContent.tsx` (+ `_volumes/`, new ATL content, new Lock In access)

## The problem

CTRL-A is two products fused onto one scroll: an evergreen toolbox and a
monthly magazine. The left-rail Spine lists only 6 of ~10 sections, tools sit
next to stories as equal peers, and nothing declares who the page is for. It
reads as disorganized because the map does not match the page and no audience
lens drives the order.

## The principle

CTRL-A is for all creatives, so the nav divides by creative TYPE (a directory,
not a filter that narrows to one). Craft lanes follow ROV's practice areas:
Sound, Design, Build, Motion. Everything universal wraps those lanes.

## Target information architecture

New top-level nav (replaces the flat 6-item Spine/CONTENTS):

> The Toolkits · Lock In · ATL · The Magazine

```
PERSISTENT
  [ Lock In ]   always-visible chip, summonable from anywhere,
                invoked like a keyboard shortcut. Enters the 5 focus worlds.
                No longer a scroll section.

TOP HALF (keep as-is)
  Cover hero -> Contents -> The Toolkits (Sound · Design · Build · Motion)
  + evergreen tools: Brand Kit Generator, Daily Taste Test

LOWER HALF (three zones)
  CTRL-A · ATL  (local field guide: college students + ATL creatives)
    Roots      how ATL became a creative capital        [NEW]
    The scene  creative events + World Cup 26           (from CondensedEvents)
    Rooms      where to work in the city                [NEW]
    Cookbook   cheap, fast fuel                         (moved in)
    Open calls student gigs & features                  [NEW]

  THE MAGAZINE  (walled off from tools)
    The Feature (DreamAsia)                             (DreamAsiaTeaser)
    Art Form (Kintsugi)                                 (vol.artForm)
    On Repeat                                           (VolumeBento)
    Vue's note                                          (VueClose)
```

## Section-by-section mapping (current -> new home)

| Current component / section | New home |
| --- | --- |
| Cover, Contents, StickerBelt | Top half, unchanged |
| ThreeToolkits | Top half, unchanged (craft lanes) |
| BrandKitFeature | Top half, evergreen tool |
| Daily Taste Test | Top half, evergreen tool |
| TheFoldTeaser (`/ctrla/the-fold`) | Removed from scroll -> Lock In persistent access |
| Cookbook | Moved into ATL |
| CondensedEvents | Moved into ATL as "The scene" |
| DreamAsiaTeaser | Magazine |
| vol.artForm (Kintsugi) | Magazine (needs a section component if not mounted) |
| VolumeBento (On Repeat) | Magazine |
| Mission | Keep near foot (thesis) or fold into Magazine intro |
| VueClose | Magazine close |

## Lock In (renamed from Vantage / the-fold)

- Name: "Lock In". Route stays `/ctrla/the-fold` for now (rename later if wanted).
- Access: persistent corner chip (or nav-dock slot), visible across the CTRL-A
  scroll, not buried mid-page. Tap = enter the focus worlds.
- Framing: a tool the platform gives you, invoked on demand, not an article.
- Remove the peer teaser that currently sits beside DreamAsia.

## ATL local field guide (the value build)

New wrapper section "CTRL-A · ATL". Five parts:

1. Roots [NEW content] — ATL as a creative capital. The sound lineage, the film
   boom (Y'allywood / studio economy), the AUC / university art scene. Anchor
   piece. Gives students belonging + context. Primary local SEO/GEO target.
2. The scene — creative events + big-city events (World Cup 26). Reuse
   CondensedEvents; add a creative-events track alongside the city events.
3. Rooms [NEW content] — where to actually work in the city (spots, studios,
   cafes, libraries). The real-world cousin of Lock In.
4. Cookbook — moved in as-is.
5. Open calls [NEW content] — student gigs, features, submission slots.

## Known gap: Motion toolkit

Dividing by craft exposes that Motion/video has no toolkit (DreamAsia is the
only motion content). Fill the Motion lane with a real toolkit to complete the
Sound/Design/Build/Motion set.

## Build order (phased)

- Phase 1 — Structure: rebuild `CONTENTS`/`SPINE_TARGETS` into the 4 zones;
  reorder sections; wrap ATL and Magazine; move Cookbook + Events into ATL.
- Phase 2 — Lock In access: build the persistent chip + summon behavior; pull
  TheFold out of the scroll.
- Phase 3 — ATL content: write Roots, then Rooms, then Open calls; wire the
  scene (creative + city events).
- Phase 4 — Motion toolkit: fill the craft-lane gap.

## Open decisions / assumptions carried

- On Repeat placed in Magazine (could double in the Sound lane).
- Brand Kit Generator + Taste Test stay top half with the Toolkits.
- Mission/thesis placement: keep at foot vs fold into Magazine intro (TBD).
- Lock In: corner chip vs nav-dock slot (decide during Phase 2).
