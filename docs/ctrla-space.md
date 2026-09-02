# CTRL·A · Space

An alternate, drivable view of the magazine at `/ctrla/space`. You fly a ship
through the CTRL·A system; every planet, moon, asteroid, and comet is a part
of the magazine, and docking at one opens the real page. Vue rides along as
the co-pilot. Desktop only by design; phones get the star map.

## What it is not

It is not the home of anything. Every stop links to a real, indexed page and
nothing exists only inside the game. The route is `noindex`. The magazine is
the canonical site; this is the fun door.

## Where things live

```
app/ctrla/space/
  page.tsx            metadata (noindex) + shell
  SpaceClient.tsx     the gate: ship or map, decided before any three.js loads
  Hud.tsx             all DOM interface over the canvas
  DockPanel.tsx       the panel that opens at a stop (used by HUD and StarMap)
  StarMap.tsx         the 2D SVG view: phones, no-WebGL, reduced-motion, M key
  _map/map.ts         THE REGISTRY. Every body, orbit, look, and link.
  _map/narration.ts   Vue's lines per stop, plus ambient one-liners
  _state/useSpace.ts  zustand for UI state; plain refs for per-frame state
  _scene/             the only place besides the loader's aurora that touches three
    Scene.tsx         <Canvas>, sky shader, lights, tab-hidden pause, ?lite knob
    Starfield.tsx     two instanced point layers
    Bodies.tsx        procedural bodies from the registry, labels, dock rings
    Ship.tsx          flight model, chase camera, autopilot, docking, fps
```

## How the isolation works

The magazine bundle is byte-identical to before this feature existed:

- `_scene/` is reached only through `dynamic(() => import(...), { ssr: false })`
  in `SpaceClient`, which runs the gate first. Phones, no-WebGL, and
  reduced-motion visitors never request the chunk.
- The door on `/ctrla` is a plain `<a>`, not `<Link>`, so Next never
  prefetches the route.
- Nothing outside `_scene/` imports three. Keep it that way.

## Growing the universe

Add an entry to `BODIES` in `_map/map.ts` and a matching key in
`_map/narration.ts`. That is the whole job: the scene renders it, the HUD
counts it, the star map pins it, the dock panel links it. A new volume next
month is a new moon.

Kinds: `sun` (one), `planet` (big stops, HUD chips), `moon` (orbits a
planet via `parent`), `asteroid` (loose one-offs), `comet` (time-limited,
gets a tail). `look.palette` is `[deep, mid, glow]`; `mid` is the body
colour, `glow` the map accent.

## Performance decisions

- Everything is procedural: displaced icosahedrons, canvas-drawn labels,
  radial-gradient glow sprites. Zero downloaded assets.
- No physics engine. A ship in empty space is thrust, damping, and a
  heading. Flight is planar, which is what makes it navigable.
- Per-frame state (ship position, body positions, speed) lives in refs in
  `useSpace.ts`, never in React. The HUD polls it at 8Hz.
- Labels are `sizeAttenuation: false` sprites, so they never balloon up
  close.
- Tab hidden → `frameloop="never"`. A space game warming a laptop in a
  background tab is the reputation this must not earn.
- The canvas is opaque (`alpha: false`) and starts at `min(devicePixelRatio,
  1.5)`. A `QualityGovernor` in `Scene.tsx` then steps the render scale down
  a quarter whenever a two-second window averages under 50fps, and back up
  after three steady 58+ windows. The HUD meter shows the live scale
  (`1.5×`). MSAA cannot change after the context exists, so it stays on.
- Nothing over the canvas may use `mix-blend-mode` or `backdrop-filter`.
  Both make the compositor re-process the full live frame every frame and
  cost more than the entire 3D scene. The space grain is its own plain-alpha
  class (`.ctrla-space-grain`), not the magazine's `.ctrla-grain`.
- `?lite` pins dpr 1 and no MSAA. That is what headless testing uses
  (SwiftShader crashes on MSAA at full DPR).

## r184 gotchas worth remembering

- Lights use physical units with inverse-square falloff. The sun's point
  light is `intensity={14000}`; a value of 2 lights nothing past the first
  orbit.
- `IcosahedronGeometry` is already non-indexed; calling `toNonIndexed()`
  on it just logs a warning.
- Installing `@react-three/fiber` widens the global `JSX.IntrinsicElements`.
  Any code that casts a dynamic HTML tag to `keyof JSX.IntrinsicElements`
  breaks; narrow it to the real tags (see `ChatWidget.tsx`).
- React 18.2 pins us to fiber v8 and drei v9. v9 fiber needs React 19.

## The second pass (feel, meaning, share)

- **Sun = the mark.** `_scene/SunLogo.tsx` loads `/ctrla/ctrla-flat-logo-white.svg`
  with three's SVGLoader and extrudes it (curveSegments 3 keeps the
  hand-drawn outline under 50k triangles). Suspense falls back to the plain
  gold core while it loads.
- **Atmospheres.** A fresnel shell per body in its glow colour, additive.
  The same shader, hotter, is the sun's edge; two stacked glow sprites are
  the bloom. No post-processing pass, on purpose: it would cost more than
  the scene.
- **Trail + boost.** `_scene/Trail.tsx` is a 28-point ring buffer turned
  into a triangle strip, opacity following speed. Boost adds a small camera
  wobble, 4° of FOV, and DOM speed streaks (`.ctrla-space-streaks`, plain
  alpha) past cruise speed.
- **Nebula.** Five huge canvas-gradient sprites between the star layers.
- **Landing.** Enter in ship mode sets `landingId`: the camera dives toward
  the body (Ship.tsx), a wipe in the planet's colour fills the frame
  (`.ctrla-space-landing`), and the HUD pushes the route after 1s.
- **Your planet first.** The HUD reads `lib/ctrla/profile.ts`; if the quiz
  named a craft whose id is a planet, the intro uses `HOME_LINE` and the
  primary button autopilots there.
- **Photo mode.** `P` hides the HUD and nav (`html[data-ctrla-photo]`),
  draws a gold frame, and copies `/ctrla/space?at=<nearest>` to the
  clipboard. `?at=` spawns the ship beside that stop, facing it
  (`restPosition` in map.ts, `spawn()` in Ship.tsx).
- **Analytics.** `_state/track.ts` sends `space_open`, `space_dock`,
  `space_enter`, `space_charted_all` to GA4; silent without gtag.
- Flight constants live in `_map/flight.ts` so the HUD can read them
  without importing three.

## The third pass (the line, the guide, the parking)

- **Routes.** `_map/routes.ts` turns the quiz profile into a five-stop line
  (`routeFor`). Everything stays open; one waypoint is lit at a time
  (`route[step]`), docking anywhere counts, and docking at the waypoint
  advances the step. Every line crosses into a second craft on purpose.
  Brand-intent designers get the history lesson instead of Design twice.
- **The guide.** `Guide.tsx` is Vue's bubble: one line at a time, on beats
  (spawn, next stop, approach, off-route, take-over, first boost, edge,
  idle, route complete), never on a clock, with tappable replies. Beats
  never interrupt a bubble that is waiting on a reply. `H` hides her.
  With no profile she runs the `/ctrla/start` quiz word for word in the
  bubble (`_map/guide.ts` → `QUIZ`) and writes the same profile.
- **Parking.** Ship.tsx: inside 4× dock range the speed cap falls toward
  8 u/s, but only while closing on the body (leaving is never throttled;
  the spawn pad sits inside the sun's envelope). Sitting still inside the
  ring for a second auto-docks; `E` docks now, `W` waves off; the magnet
  re-arms only after the ship leaves a ring, so undocking never re-docks.
  Bodies push the ship out (no clipping through the sun). Turn rate is
  2.8 rad/s parked, 1.6 at full boost. Holding `W` with no turn input eases
  the heading toward the waypoint (fly-by-wire). Docked ships circle the
  body slowly. `Space` brakes.
- **Waypoint.** `_scene/Waypoint.tsx` draws the chevron and projects the
  waypoint into `frame.waypoint`; the HUD positions an edge-of-screen
  arrow from it on its own rAF, never through React.
- **Star map** draws the line as a dotted gold path with step numbers.
- Orbit speeds were halved so the static map stays honest for a session.
- New events: `space_quiz_complete`, `space_route_complete`; `space_dock`
  carries `onRoute`.

## Phases

- **P0 + P1, shipped.** Ship, starfield, sky, all bodies from the registry,
  autopilot, docking, HUD, Vue checkpoints, star map, fallbacks, the door.
- **P2, shipped.** Governor, logo sun, atmospheres, nebula, trail, boost,
  landing dive, home planet, photo mode + deep links, analytics.
- **P3, optional.** Vue chat behind rate limits and a spend cap (drops into
  the guide bubble), sound, new poses, presence (other ships).
