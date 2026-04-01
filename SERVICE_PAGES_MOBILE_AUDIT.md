# ROV Studios — Service Pages Mobile & Performance Audit

**Date:** 2026-04-01
**Branch:** `optimise/services-pages`
**Audited Pages:** Web Development, Sound Engineering, Video Production, AI Automation, AI Services

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Pages & Components Inventory](#pages--components-inventory)
3. [Mobile / Responsive Issues](#mobile--responsive-issues)
4. [Performance Issues](#performance-issues)
5. [Implementation Plan](#implementation-plan)
6. [Implementation Standards Checklist](#implementation-standards-checklist)

---

## Executive Summary

The service pages have strong visual design but suffer from **inconsistent mobile optimization** and **significant performance bottlenecks**. The sound page (`/sound`) is the gold standard — it uses `dynamic()` imports and keeps the page wrapper as a server component. All other service pages wrap everything in `"use client"`, shipping the entire page as a client bundle.

**Top 3 wins by impact:**
1. Remove `"use client"` from content wrappers → reduces initial JS bundle by ~40-60%
2. Add `dynamic()` imports (following the sound page pattern) → defers heavy components
3. Fix touch targets and hover-only interactions → unblocks mobile usability

---

## Pages & Components Inventory

| Service Page | Route | Content Wrapper | Dedicated Components | Dynamic Imports |
|---|---|---|---|---|
| Web Development | `/web` | `WebContent.tsx` | 18 components in `components/Web-Dev/` | None |
| Sound Engineering | `/sound` | `page.tsx` (server) | 20 components in `components/sound_page/` | 7 dynamic imports |
| Video Production | `/video-production` | `VideoProductionContent.tsx` | 7 components in `components/video-production/` | None |
| AI Automation | `/ai-automation` | `AIAutomationContent.tsx` | 5 components in `components/ai-automation/` | 2 (FaultyTerminal, AIROICalculator) |
| AI Services | `/ai` | `AIContent.tsx` | Inline + shared | 1 (FaultyTerminal) |

**Shared components:** `components/service/` (9), `components/common/` (3), schema components (4)

---

## Mobile / Responsive Issues

### CRITICAL — Fix Before Launch

| # | Issue | Files | Details |
|---|---|---|---|
| M1 | **Touch targets below 44px** | `VideoProductionContent.tsx`, `FeaturedWorksSection.tsx`, `MusicPlayer.tsx` | Carousel dots (8-12px), navigation arrows, and category filter tabs are too small for reliable touch interaction. WCAG 2.5.8 requires minimum 24px, Apple HIG recommends 44px. |
| M2 | **Hover-only interactions** | `VideoProductionContent.tsx` | Cinema mode toggle and video category filter rely on hover states with no touch/tap equivalent. These features are invisible on mobile. |
| M3 | **FaultyTerminal missing 0-dimension canvas guard** | `components/FaultyTerminal.tsx` | Per CLAUDE.md rules, the draw loop must skip frames when `clientWidth` or `clientHeight` is 0. The `resize()` function (line ~350) and `update()` loop do not check for this. The component returns `null` on mobile (good), but the guard is still required. |

### HIGH — Should Fix

| # | Issue | Files | Details |
|---|---|---|---|
| M4 | **Font sizes below 12px on mobile** | `SavingsCalculator.tsx`, `WebPricingTiers.tsx`, `PricingTiers.tsx`, `AIPricingTiers.tsx` | Labels, disclaimers, and feature list items render at 9-11px on mobile. iOS Safari enforces a minimum font size and will auto-zoom inputs, causing layout jumps. |
| M5 | **Video carousel has no swipe support** | `VideoProductionContent.tsx` | Users can only navigate via tiny dot indicators. No swipe/drag gesture support. |
| M6 | **Range input styling breaks on Firefox mobile** | `SavingsCalculator.tsx` | The `.rov-range` custom track fill uses a WebKit-only `background` gradient approach. Firefox mobile renders an unstyled default track. |
| M7 | **Video production carousel dots — only navigation method** | `VideoProductionContent.tsx` | Dot indicators are the sole navigation mechanism on mobile. No swipe, no arrows at accessible sizes. |

### MEDIUM — Improve When Possible

| # | Issue | Files | Details |
|---|---|---|---|
| M8 | **Inline styles prevent responsive overrides** | `AIAutomationContent.tsx` | Nearly every element uses `style={{}}` instead of Tailwind classes. Responsive breakpoints require JS media queries instead of simple `md:` prefixes. |
| M9 | **3-column grid breakpoint too aggressive** | `CreativeAddOns.tsx` | Shifts to 3 columns at `sm` (640px). On 640-768px screens, cards are cramped. Should break at `md` (768px). |
| M10 | **MusicPlayer 3D carousel** | `MusicPlayer.tsx` | Uses `perspective: 1000px` and `rotateY` transforms. iOS Safari can produce rendering artifacts with 3D CSS transforms + `overflow: hidden`. Needs physical device testing. |

---

## Performance Issues

### CRITICAL — Largest Impact

| # | Issue | Files | Impact | Fix |
|---|---|---|---|---|
| P1 | **`"use client"` on content wrappers** | `WebContent.tsx`, `VideoProductionContent.tsx`, `AIAutomationContent.tsx`, `AIContent.tsx` | Forces ALL child components into the client JS bundle, even static content (FAQ text, headings, descriptions). Dramatically increases TTI and bundle size. | Restructure: keep content wrapper as server component, only mark interactive children as `"use client"`. Follow the `/sound/page.tsx` pattern. |
| P2 | **`react-icons/si` barrel import** | `AIAutomationContent.tsx:18` | `import { SiNotion, SiGooglecloud, ... } from 'react-icons/si'` pulls the entire `si` icon set (200-500KB). Tree-shaking is unreliable with react-icons barrels. | Use `@react-icons/all-files/si/SiNotion` per-file imports, or replace with inline SVGs. |
| P3 | **No `dynamic()` imports on 3/4 service pages** | `WebContent.tsx`, `VideoProductionContent.tsx`, `AIAutomationContent.tsx` | All sub-components are statically imported. Heavy components (GSAP sections, video carousels, calculators) load eagerly even when below the fold. | Add `dynamic(() => import(...))` for below-fold components, following sound page pattern. |

### HIGH

| # | Issue | Files | Impact | Fix |
|---|---|---|---|---|
| P4 | **`setMousePos` state on every mousemove** | `WebHero.tsx:268` | `setMousePos({ x, y })` triggers full WebHero re-render on every mouse move. All motion elements, text, and buttons re-render for a subtle gradient follow effect. | Switch to a `useRef` + CSS custom properties, or use `onMouseMove` with direct DOM manipulation. |
| P5 | **Triple filter stack on video** | `FeaturedWorksSection.tsx:128` | `filter: "blur(40px) brightness(0.3) saturate(0.6)"` on a full-width `<video>`. Three compositing passes per frame. | Pre-process the blur in video editing, or use a static poster image with CSS overlay. |
| P6 | **`backdrop-blur` on always-visible overlays** | `VideoProductionContent.tsx:112`, `AIAutomationContent.tsx:108` | Triggers GPU compositing on every frame. Especially expensive on mobile. | Remove or reduce blur radius. Use a solid semi-transparent overlay instead. |
| P7 | **Animating `left`/`top` properties** | `WebHero.tsx:305` | `transition: "left 0.3s, top 0.3s"` triggers layout recalculation per frame. | Switch to `transform: translate()` for GPU-accelerated animation. |
| P8 | **Video carousel remounts DOM on slide change** | `FeaturedWorksSection.tsx:316-333` | `AnimatePresence mode="wait"` with `key={activeIndex}` destroys and recreates 2 video elements + blur filter every 8 seconds. | Use a sliding/fading approach that keeps video elements mounted. Preload adjacent slides. |
| P9 | **14+ `@font-face` declarations loaded globally** | `globals.css:7-117` | All fonts (anton, futura, Boke Rough, Norwige 4 weights, Sedgwick Ave, Pearl Jean, HellasFun, Hornset, LostInSouth) load on every page. Many used on only 1-2 pages. | Move page-specific fonts to `next/font/local` imports in the components that use them. |

### MEDIUM

| # | Issue | Files | Impact | Fix |
|---|---|---|---|---|
| P10 | **Dual animation libraries** | Various | Ships both `framer-motion` (~40KB gz) and `gsap` (~25KB gz) to the client. Some pages use both. | Standardize on one library per page. Prefer framer-motion for simple enter/exit, GSAP for scroll-driven. |
| P11 | **styled-components runtime loaded globally** | `layout.tsx:7,113` | `StyledComponentsRegistry` wraps all children. Not used on any service page. Runtime ships to every page. | Conditionally load only on pages that need it, or migrate remaining usages to Tailwind. |
| P12 | **Canvas `shadowBlur` overuse** | `WebHero.tsx:156-228` | Multiple `ctx.shadowBlur` calls per frame for stars, trails, cursor. One of the most expensive Canvas2D operations, compounded on retina displays. | Reduce shadow usage. Pre-render glow effects to an offscreen canvas. |
| P13 | **ScrollTrigger triple-init** | `OurApproachSection.tsx:136-236` | `initAnimations()` called 3 times (immediate, fonts.ready, 500ms timeout). Each kills ALL global ScrollTriggers and recreates them. | Use a single init with `document.fonts.ready` and a MutationObserver fallback. |
| P14 | **Three duplicate OurApproachSection components** | `Web-Dev/`, `video-production/`, `ai-automation/` | Same component duplicated 3 times with minor content differences. Each imports Lenis + GSAP independently. | Extract a shared `OurApproachSection` that accepts content via props. |
| P15 | **`animate-ping` / `animate-pulse` running off-screen** | `AIContent.tsx:192`, `OurApproachSection.tsx:408` | Infinite CSS animations run even when elements are not visible. | Use IntersectionObserver to pause animations when off-screen, or use `animation-play-state`. |

### LOW

| # | Issue | Files | Impact | Fix |
|---|---|---|---|---|
| P16 | **Raw `<img>` instead of `next/image`** | `AIAutomationContent.tsx:357,522`, `TestimonialsSection.tsx:234` | SVG icons use raw `<img>`. No lazy loading or size hints. | Replace with `next/image` or at minimum add `width`, `height`, `loading="lazy"`. |
| P17 | **Inter font loaded but unused on service pages** | `layout.tsx:3,10` | Downloaded via `next/font/google` but overridden everywhere by Norwige/Roboto. | Remove from service page layouts or scope to pages that use it. |
| P18 | **Next.js 13.5.1 is outdated** | `package.json:52` | Missing Turbopack, improved image optimization, RSC improvements, partial prerendering. | Plan upgrade to Next.js 14.x+ as a separate initiative. |
| P19 | **`styled-jsx` used in one place** | `OurApproachSection.tsx:448-461` | `<style jsx>` block for a shine animation. Adds styled-jsx runtime for a single keyframe. | Move keyframe to `globals.css` or use Tailwind `@keyframes`. |

---

## Implementation Plan

### Phase 1: Mobile Usability Fixes (Critical)

**Priority:** Highest — these block usability on mobile devices.
**Estimated scope:** ~10 files, focused edits.

#### 1.1 Fix touch targets (M1)

**Files:** `VideoProductionContent.tsx`, `FeaturedWorksSection.tsx`, `MusicPlayer.tsx`
**Approach:**
- Increase carousel dot size to minimum 44x44px tap area (can use transparent padding)
- Increase navigation arrow hit areas
- Add `min-h-[44px] min-w-[44px]` to all interactive elements

**Reuse check:** No existing touch-target utility — create a `tap-target` Tailwind class in `globals.css` if needed across 3+ files.

#### 1.2 Add touch alternatives for hover interactions (M2)

**Files:** `VideoProductionContent.tsx`
**Approach:**
- Cinema mode: add a tap toggle button visible on touch devices
- Category filter: ensure tabs are always visible, not hover-revealed

#### 1.3 Add canvas 0-dimension guard (M3)

**File:** `components/FaultyTerminal.tsx`
**Approach:**
- In `resize()`: early return if `ctn.offsetWidth === 0 || ctn.offsetHeight === 0`
- In `update()`: skip frame and schedule next rAF if dimensions are 0
- Follows existing CLAUDE.md canvas rules

---

### Phase 2: Performance — Bundle Size (Critical)

**Priority:** Highest impact on load time.
**Estimated scope:** ~5 content wrapper files restructured.

#### 2.1 Remove `"use client"` from content wrappers (P1)

**Files:** `WebContent.tsx`, `VideoProductionContent.tsx`, `AIAutomationContent.tsx`, `AIContent.tsx`
**Approach:**
- Convert content wrappers to server components
- Move `useState`/`useEffect` hooks down into individual child components
- Each interactive child keeps its own `"use client"` directive
- **Reference implementation:** `app/sound/page.tsx` — already does this correctly

#### 2.2 Fix react-icons barrel import (P2)

**File:** `AIAutomationContent.tsx`
**Approach:**
- Replace `import { SiNotion } from 'react-icons/si'` with per-file imports
- Or replace with inline SVGs (5 icons total — minimal effort)

#### 2.3 Add dynamic imports (P3)

**Files:** `WebContent.tsx`, `VideoProductionContent.tsx`, `AIAutomationContent.tsx`, `AIContent.tsx`
**Approach:**
- Import below-fold components via `dynamic(() => import(...))`
- Add loading skeletons for key sections
- Priority components for dynamic import:
  - Web: `OurApproachSection`, `FeaturedWorksSection`, `WebROICalculator`, `FAQBottomSection`
  - Video: `PostProductionSection`, `VideoPortfolioSection`, `ContentCalculator`
  - AI Automation: `AIWorkflowsSection`, `AIPricingTiers`, `AIROICalculator`
  - AI: `OurApproachSection`, `FAQBottomSection`

---

### Phase 3: Performance — Rendering (High)

**Priority:** Reduces jank and improves interaction responsiveness.
**Estimated scope:** ~4 files, targeted fixes.

#### 3.1 Fix mousemove re-render (P4)

**File:** `WebHero.tsx`
**Approach:**
- Replace `useState` for mouse position with `useRef`
- Update the gradient div via `ref.current.style.background` directly
- Eliminates full component re-render on every mouse event

#### 3.2 Fix left/top animation (P7)

**File:** `WebHero.tsx`
**Approach:**
- Replace `left`/`top` transitions with `transform: translate(x, y)`
- Use `will-change: transform` for GPU acceleration

#### 3.3 Fix video carousel remount (P8)

**File:** `FeaturedWorksSection.tsx`
**Approach:**
- Keep all slide video elements mounted, toggle visibility with opacity/z-index
- Pre-load adjacent slide videos
- Remove `AnimatePresence mode="wait"` destruction pattern

#### 3.4 Reduce filter stack (P5, P6)

**Files:** `FeaturedWorksSection.tsx`, `VideoProductionContent.tsx`, `AIAutomationContent.tsx`
**Approach:**
- Replace triple-filter video with a poster image + CSS gradient overlay
- Replace `backdrop-blur` overlays with solid `rgba()` backgrounds

---

### Phase 4: Performance — Loading (Medium)

**Priority:** Improves initial page load and font rendering.
**Estimated scope:** ~3-5 files.

#### 4.1 Scope font loading (P9)

**File:** `globals.css`, individual components
**Approach:**
- Keep only universally-used fonts (Norwige Regular, Roboto) in `globals.css`
- Move page-specific fonts (Boke Rough, Pearl Jean, HellasFun, etc.) to `next/font/local` in the components that use them
- Audit which fonts are actually used on which pages

#### 4.2 Remove global styled-components (P11)

**File:** `layout.tsx`
**Approach:**
- Audit which pages still use styled-components
- Wrap `StyledComponentsRegistry` conditionally or migrate remaining usages to Tailwind
- Remove `compiler: { styledComponents: true }` from `next.config.js` if fully migrated

#### 4.3 Deduplicate OurApproachSection (P14)

**Files:** `Web-Dev/OurApproachSection.tsx`, `video-production/OurApproachSection.tsx`, `ai-automation/OurApproachSection.tsx`
**Approach:**
- Extract shared `OurApproachSection` component accepting `steps` and `title` as props
- Single Lenis + GSAP instance per page
- Fix the triple-init pattern (P13) in the process

---

### Phase 5: Mobile Polish (Medium)

**Priority:** Improves mobile experience but not blocking.

#### 5.1 Fix small font sizes (M4)

**Files:** Calculator and pricing components across all service pages
**Approach:**
- Set `min-font-size: 12px` on all text elements
- Use `clamp()` for fluid typography: `clamp(12px, 2.5vw, 14px)` for labels

#### 5.2 Add swipe support to carousels (M5, M7)

**File:** `VideoProductionContent.tsx`
**Approach:**
- Add touch event handlers (`touchstart`, `touchmove`, `touchend`) for swipe detection
- Or integrate a lightweight swipe library
- Minimum swipe distance threshold of 50px

#### 5.3 Fix range input cross-browser (M6)

**File:** `SavingsCalculator.tsx`
**Approach:**
- Add Firefox (`-moz-range-track`, `-moz-range-thumb`) styling
- Test on Firefox mobile

---

### Phase 6: Future Improvements (Low)

These are valuable but should be separate initiatives:

| Item | Description |
|---|---|
| Next.js upgrade (P18) | Upgrade from 13.5.1 to 14.x+. Separate branch, thorough testing. |
| Animation library consolidation (P10) | Standardize on one animation library per page type. |
| Infinite animation cleanup (P15) | Add IntersectionObserver to pause off-screen animations. |
| Image component migration (P16) | Replace remaining `<img>` tags with `next/image`. |

---

## Implementation Standards Checklist

Per the Implementation Standards skill, each phase must verify:

### Before Starting Each Phase
- [ ] Searched codebase for existing similar code/components to reuse
- [ ] Identified the simplest approach that meets requirements
- [ ] No speculative features or "just in case" code planned
- [ ] Reference implementation identified (sound page for Phase 2)

### During Implementation
- [ ] Every function has a clear single purpose
- [ ] No function exceeds ~30 lines
- [ ] No file exceeds ~200-300 lines (flag `AIAutomationContent.tsx` — likely exceeds this)
- [ ] All names are descriptive and unambiguous
- [ ] No `any` types in TypeScript
- [ ] Comments explain "why" not "what"
- [ ] No commented-out code left behind
- [ ] Error states handled with user-facing messages
- [ ] Loading states present for dynamically imported components

### After Implementation
- [ ] A junior developer could understand the changes
- [ ] No unused imports, variables, or functions
- [ ] No console.log or debug artifacts
- [ ] Edge cases handled (empty states, loading, error)
- [ ] Changes tested on: Chrome mobile, Safari iOS, Firefox mobile
- [ ] Lighthouse mobile score measured before and after

### Reuse Principles Applied
- [ ] OurApproachSection deduplicated (Rule of Three — 3 copies exist)
- [ ] Sound page `dynamic()` pattern reused across all service pages
- [ ] No new abstractions created for single-use cases
- [ ] Existing Tailwind utilities used instead of new CSS where possible

---

## Appendix: File Reference

### Service Page Content Wrappers
- `app/web/WebContent.tsx`
- `app/sound/page.tsx`
- `app/video-production/VideoProductionContent.tsx`
- `app/ai-automation/AIAutomationContent.tsx`
- `app/ai/AIContent.tsx`

### Key Component Directories
- `components/Web-Dev/` (18 files)
- `components/sound_page/` (20 files)
- `components/video-production/` (7 files)
- `components/ai-automation/` (5 files)
- `components/service/` (9 shared files)
- `components/common/` (3 shared files)

### Config Files
- `app/globals.css` — font declarations
- `app/layout.tsx` — global layout, styled-components registry
- `next.config.js` — Next.js configuration
- `package.json` — dependencies (Next.js 13.5.1)
