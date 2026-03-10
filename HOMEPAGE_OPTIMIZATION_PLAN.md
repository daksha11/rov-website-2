# Homepage Optimization Plan

## Overview

20 issues identified across the landing page, organized into 5 implementation phases ordered by impact and dependency.

---

## Phase 1: Dead Code & Quick Wins (Low Risk, High Impact)

Cleanup that reduces bundle size and removes confusion with zero behavioral change.

| # | Issue | File | Severity | Est. Effort |
|---|-------|------|----------|-------------|
| 1.1 | Remove dead imports (`MusicPlayer`, `Gallery`, `Card`, `DesignBreak`, `TestHero`) | `app/page.tsx:10,13-16,18` | Critical | 5 min |
| 1.2 | Remove unused `Footer` import | `app/layout.tsx:7` | Low | 2 min |
| 1.3 | Remove dead `@font-face` declarations ("Flight Maybe Maj", "ZRTW Bokerough") | `components/Services.tsx:454-466` | Low | 5 min |
| 1.4 | Remove unused `ServiceCard` props (`icon`, `description`, `isExpanded`, `expandedCard`, `onMouseEnter`, `onMouseLeave`) | `components/Services.tsx` | Medium | 10 min |
| 1.5 | Remove unused `isScrolled` state and its scroll listener | `app/page.tsx:46` | Medium | 5 min |
| 1.6 | Hoist `albumCovers` array outside component to prevent re-creation every render | `app/page.tsx:103-111` | Medium | 5 min |

**Total: ~30 min**
**Risk: None** — purely removing dead code and hoisting constants.

---

## Phase 2: Event Listener & Memory Fixes (Bug Fixes)

Fix actual bugs that cause memory leaks and unnecessary CPU usage.

| # | Issue | File | Severity | Est. Effort |
|---|-------|------|----------|-------------|
| 2.1 | Fix CustomCursor iframe event listener leak — arrow functions in cleanup never match originals | `components/CustomCursor.tsx:39-52` | High | 15 min |
| 2.2 | Throttle CustomCursor `mousemove` handler to prevent 60fps React re-renders | `components/CustomCursor.tsx:28` | High | 15 min |
| 2.3 | Gate Footer `setInterval` timer behind IntersectionObserver so it only ticks when visible | `components/Footer.tsx:28` | High | 15 min |

### Implementation Details

**2.1 — Event listener leak fix:**
- Store handler references in `useRef` or define named functions outside the effect
- Use the same function reference in both `addEventListener` and `removeEventListener`

**2.2 — Throttle cursor:**
- Use `requestAnimationFrame` gating instead of raw `setPosition` on every mousemove
- Only call `setPosition` once per animation frame

**2.3 — Footer timer:**
- Add `IntersectionObserver` to footer container ref
- Start interval only when `isIntersecting`, clear when not

**Total: ~45 min**
**Risk: Low** — behavior-preserving fixes, easily testable.

---

## Phase 3: Performance-Critical Fixes (Hero & ScrollTrigger)

Address the two biggest performance bottlenecks on the page.

| # | Issue | File | Severity | Est. Effort |
|---|-------|------|----------|-------------|
| 3.1 | Skip 652-image preload on mobile (canvas is hidden, video is shown instead) | `components/HeroWithAnimation.tsx:387-396` | Critical | 20 min |
| 3.2 | Scope ScrollTrigger cleanup to only kill Hero-owned triggers, not all global ones | `components/HeroWithAnimation.tsx:401` | Critical | 20 min |
| 3.3 | Merge the two duplicate resize listeners into one | `components/HeroWithAnimation.tsx:329-350` | Medium | 15 min |
| 3.4 | Consolidate triple initialization (immediate + fonts.ready + setTimeout) | `components/HeroWithAnimation.tsx:461-473` | Low | 20 min |

### Implementation Details

**3.1 — Mobile image skip:**
```
// Before preloading, check screen width
if (window.innerWidth <= 768) return; // mobile uses <video> fallback
```
- Guard the `forEach` image preload loop with a mobile check
- This saves ~50-100MB of unnecessary image downloads on mobile

**3.2 — Scoped ScrollTrigger kill:**
```
// Instead of: ScrollTrigger.getAll().forEach(t => t.kill())
// Tag Hero triggers with an id and kill only those:
ScrollTrigger.getAll()
  .filter(t => t.vars?.id?.startsWith('hero-'))
  .forEach(t => t.kill())
```

**3.3 — Merge resize listeners:**
- Combine the `dimensions` and `isMobile` state updates into a single `resize` event handler

**3.4 — Initialization consolidation:**
- Use `document.fonts.ready` as the single initialization path with a reasonable timeout fallback

**Total: ~75 min**
**Risk: Medium** — Hero is complex; test on both desktop and mobile after changes.

---

## Phase 4: Image Optimization (Next.js `<Image>`)

Replace raw `<img>` tags with Next.js `<Image>` for automatic lazy loading, responsive sizing, and WebP/AVIF conversion.

| # | Issue | File | Severity | Est. Effort |
|---|-------|------|----------|-------------|
| 4.1 | Replace 15+ raw `<img>` team photos with `<Image>` + lazy loading | `components/TeamSection.tsx:208-218` | High | 30 min |
| 4.2 | Replace CardSwap `<img>` tags with `<Image>` | `components/ElevateSection.tsx:438-445` | High | 15 min |
| 4.3 | Replace ProjectStrip logo `<img>` with `<Image>` | `components/ProjectStrip.tsx:225` | Low | 10 min |
| 4.4 | Review Footer `priority` on both skyline images — only first-visible needs it | `components/Footer.tsx` | Low | 5 min |

### Implementation Details

**4.1 — TeamSection (biggest impact):**
- The marquee renders ~72 ImageCards (4x copies × 3 rows × 6 members)
- Add `loading="lazy"` or use `<Image>` with `sizes` prop
- Consider reducing marquee copies from 4x to 2x if scroll length permits

**4.2 — ElevateSection CardSwap:**
- Replace `<img src="..." />` with `<Image src="..." width={} height={} alt="" />`
- Add appropriate `sizes` prop for responsive behavior

**4.3 — ProjectStrip:**
- Simple swap from `<img>` to `<Image>` with fixed dimensions

**4.4 — Footer priority audit:**
- Remove `priority` from the second skyline image (only above-fold images need it)

**Total: ~60 min**
**Risk: Low** — straightforward swaps, but verify images render correctly at all breakpoints.

---

## Phase 5: Architecture Improvements (Optional / Future)

Lower-priority improvements that reduce bundle size or improve maintainability.

| # | Issue | File | Severity | Est. Effort |
|---|-------|------|----------|-------------|
| 5.1 | Evaluate replacing `styled-components` with Tailwind in Hero, ElevateSection, ProjectStrip | Multiple files | Medium | 2-4 hrs |
| 5.2 | Deduplicate gradient blob pattern used across Services, ElevateSection, DigiMag | Multiple files | Low | 30 min |
| 5.3 | Reduce TeamSection marquee from 4x to 2x copies per row | `components/TeamSection.tsx` | Medium | 15 min |

### Notes

- **5.1** is the largest effort but removes `styled-components` runtime JS from the client bundle. This is a significant architectural change — consider doing it incrementally, one component at a time.
- **5.2** extracts the shared gradient blob into a reusable component.
- **5.3** reduces DOM nodes from ~72 to ~36 ImageCards while maintaining seamless scroll.

**Total: ~3-5 hrs**
**Risk: Medium-High** — architectural changes that touch styling across multiple components.

---

## Execution Summary

| Phase | Focus | Issues | Status |
|-------|-------|--------|--------|
| 1 | Dead code & quick wins | 6 | DONE |
| 2 | Event listener & memory fixes | 3 | DONE |
| 3 | Hero performance | 4 | DONE |
| 4 | Image optimization | 4 | DONE |
| 5 | Architecture improvements | 3 | DONE (5.1 converted ProjectStrip + ElevateSection; Hero left as-is due to GSAP complexity) |

**All 20 issues addressed.** Build compiles successfully.

---

## Testing Checklist

After each phase, verify:

- [ ] `npm run build` succeeds with no new errors
- [ ] Desktop: Hero animation plays smoothly, scroll interactions work
- [ ] Mobile: Video fallback displays, no canvas/image preloading in Network tab
- [ ] Custom cursor follows mouse without jank (Phase 2)
- [ ] Footer time updates only when scrolled into view (Phase 2)
- [ ] All images load correctly at mobile/tablet/desktop breakpoints (Phase 4)
- [ ] Navigation dock services menu opens/closes properly
- [ ] No console errors or warnings
