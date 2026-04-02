# ROV Studios Website — Code Quality Audit & Implementation Plan

**Date:** 2026-04-01
**Framework:** Next.js 13.5.1 | React | Tailwind CSS
**Files Reviewed:** ~180+ source files
**Standards Applied:** Implementation Standards (YAGNI, DRY, KISS, SOLID, Readability, Maintainability)

---

## Executive Summary

The codebase has significant technical debt across four dimensions: **security vulnerabilities** (hardcoded secrets, XSS risk, missing input validation), **dead code accumulation** (~40 unused components, ~5,000+ orphan lines), **performance bottlenecks** (652-image preload, dual styling systems, artificial loading delays), and **DRY violations** (duplicate FAQ/Approach components, shimmer CSS repeated 4x, font families hardcoded 240+ times).

**Priority Stack Applied (correctness > readability > simplicity > reusability > performance):**

| Severity | Count | Key Themes |
|----------|-------|------------|
| Critical | 4 | Security (3), Dependency vulnerability (1) |
| High | 8 | Dead code (3), Performance (2), Bundle bloat (2), Repo hygiene (1) |
| Medium | 15 | DRY (4), Performance (3), YAGNI (2), Readability (3), Repo hygiene (2), Maintainability (1) |
| Low | 14 | Accessibility (3), Type safety (1), Config (4), Readability (2), Performance (2), UX (1), Dependencies (1) |

---

## Systemic Patterns

These recurring issues appear across dozens of files and indicate structural problems, not one-off mistakes.

### A. Massive Dead Code Inventory
~30-40 component files and 4 page directories are completely unused. This violates **YAGNI** — code that isn't needed right now shouldn't exist.

### B. Inline `style={{}}` Proliferation
2,000+ occurrences across 149 files. Defeats Tailwind's purpose, prevents style reuse, and makes theme changes require touching dozens of files. Violates **DRY** and **Maintainability**.

### C. Font Family Strings Hardcoded Everywhere
`fontFamily: 'Norwige, sans-serif'` and `fontFamily: "'Roboto', sans-serif"` appear 240+ times across 100+ files instead of using Tailwind utility classes or CSS custom properties. Violates **DRY**.

### D. Dual Styling Systems
The codebase simultaneously uses Tailwind CSS, styled-components, CSS modules, inline styles, and `<style jsx>` blocks. styled-components alone adds ~15 KB gzipped. Violates **KISS** and **Simplicity**.

### E. Zero Error Boundaries
No React error boundaries exist anywhere. A single component crash takes down the entire page. Violates **Correctness** (highest priority in the stack).

---

## Critical Findings

### C-01: Hardcoded n8n Webhook URL
- **File:** `app/api/chat/proxy/route.ts:31`
- **Principle Violated:** Security / Dependency Inversion (SOLID) — *"Use environment variables for configuration, not hardcoded values"*
- **Issue:** The n8n webhook URL with UUID is hardcoded in source code and committed to version control. This UUID is effectively an access credential.
- **Fix:** Move to `N8N_WEBHOOK_URL` environment variable with startup validation.

### C-02: XSS Risk via dangerouslySetInnerHTML
- **File:** `components/blog/BlogPostBody.tsx:7`, `lib/blog.ts:92`
- **Principle Violated:** Correctness (top of priority stack)
- **Issue:** Blog markdown is converted to HTML via `remark-html` (which does NOT sanitize) and injected with `dangerouslySetInnerHTML`. Malicious markdown = direct XSS.
- **Fix:** Add `rehype-sanitize` to the remark processing pipeline.

### C-03: No Input Validation on Chat Proxy API Route
- **File:** `app/api/chat/proxy/route.ts:28-43`
- **Principle Violated:** Correctness, Error Handling — *"Handle errors at the boundary (API route)"*
- **Issue:** POST handler calls `req.json()` without validating shape, size, or content. No max message length. No sessionId format check.
- **Fix:** Add zod schema validation, enforce max message length (2000 chars), validate sessionId format.

### C-04: Outdated Next.js with Known CVEs
- **File:** `package.json:52`
- **Principle Violated:** Correctness
- **Issue:** Next.js 13.5.1 (Sept 2023) has multiple patched CVEs in subsequent versions (e.g., CVE-2024-34351).
- **Fix:** Upgrade to Next.js 14.x or 15.x.

---

## High Severity Findings

### H-01: ~40 Unused Components (YAGNI)
- **Principle Violated:** YAGNI — *"Do I need this RIGHT NOW? If no, don't keep it"*
- **Key files (non-exhaustive):**
  - `components/Navbar.tsx`, `Hero.tsx`, `TestHero.tsx`, `CardSwap.tsx`, `GlassComponent.tsx`, `GradientBlob.tsx`, `Waves.tsx`, `CircularText.tsx`, `TrueFocus.tsx`, `StarBorder.tsx`, `TextType.tsx`, `FuzzyText.tsx`, `LatestAlbum.tsx`, `MusicPlayer.tsx` (root), `ScrollStack.tsx`, `Corousel.tsx`, `IntroScroll.tsx`, `TeamGallery.tsx`, `FeaturedArtists.tsx`, `ArtistCard.tsx`
  - `components/common/ScrollToTop.tsx`
  - `components/Web-Dev/BookingModal.tsx`, `BookACall.tsx`, `DigitalStage.tsx`, `FAQSection.tsx`, `HomeBanner.tsx`, `HowWeWorkSection.tsx`, `HustleSection.tsx`, `ShowcaseSection.tsx`, `WhatMakesUsDifferent.tsx`, `WhoWeBuildFor.tsx`, `TestimonialsSection.tsx`
  - All of `components/aerielPage/`, `components/service/`
  - `components/sound_page/MusicBanner.tsx`, `AgencyIntro.tsx`, `ArtistBreakthrough.tsx`, `BookACall.tsx`, `Gallery.tsx`, `MixesSection.tsx`, `Story.tsx`, `VisionSection.tsx`, `AboutFaq.tsx`, `HeroVideo.tsx`
- **Fix:** Delete all. Git history preserves them.

### H-02: Dead Page Routes (YAGNI)
- **Files:** `app/_web-old/page.tsx`, `app/_aeriel/page.tsx`, `app/_landing/page.tsx`, `app/sound/page_original.tsx`
- **Fix:** Delete entirely.

### H-03: Orphan File in Root
- **File:** `Usersayush.claudeplanswarm-cuddling-ritchie-agent-afa96da328645f707.md`
- **Principle Violated:** Repo hygiene
- **Fix:** Delete from repo, add to `.gitignore`.

### H-04: Unused Asset Files in Root
- **Files:** `ROV assets.ico` (175 KB), `ROV assets.png` (82 KB)
- **Principle Violated:** YAGNI
- **Fix:** Remove from version control.

### H-05: styled-components Bundle Bloat
- **Files:** `lib/registry.tsx`, `app/HomeContent.tsx`, `components/HeroWithAnimation.tsx`, `app/casestudy/CaseStudyContent.tsx`
- **Principle Violated:** KISS — *"Is this the simplest solution? → If not, simplify"*
- **Issue:** styled-components used in only ~4 files but adds ~15 KB gzipped + SSR registry complexity while the rest of the project uses Tailwind.
- **Fix:** Migrate remaining usages to Tailwind. Remove dependency and `StyledComponentsRegistry`.

### H-06: Native `<img>` Instead of `next/image`
- **Files:** `app/ctrla/CtrlAContent.tsx`, `app/ai-automation/AIAutomationContent.tsx`, `components/common/TestimonialsSection.tsx`, `components/HeroWithAnimation.tsx`
- **Principle Violated:** Performance, Framework best practice — *"Check the framework — does Next.js already provide this?"*
- **Fix:** Replace all `<img>` with `next/image` `Image` component.

### H-07: ~30 Unused shadcn/ui Components
- **Principle Violated:** YAGNI
- **Files:** `components/ui/` contains ~40 shadcn/ui components, many never imported. Examples: `alert-dialog`, `aspect-ratio`, `avatar`, `checkbox`, `collapsible`, `command`, `context-menu`, `drawer`, `dropdown-menu`, `form`, `hover-card`, `input-otp`, `input`, `label`, `menubar`, `navigation-menu`, `pagination`, `popover`, `radio-group`, `resizable`, `scroll-area`, `select`, `separator`, `sheet`, `skeleton`, `sonner`, `switch`, `table`, `textarea`, `toggle-group`, `toggle`, `tooltip`.
- **Fix:** Delete unused. Re-add via `npx shadcn-ui add` when needed.

### H-08: HeroWithAnimation Preloads 652 Images
- **File:** `components/HeroWithAnimation.tsx:366-383`
- **Principle Violated:** Performance, KISS
- **Issue:** Desktop eagerly creates 652 `new Image()` objects (~6.5 MB). Page unblocks at 15% but continues loading 550+ frames in background.
- **Fix:** Replace with video element (already the mobile fallback) or implement viewport-based progressive loading.

---

## Medium Severity Findings

### M-01: Duplicate FAQBottomSection Components (DRY — Rule of Three triggered)
- **Files:** `components/sound_page/FAQBottomSection.tsx`, `components/Web-Dev/FAQBottomSection.tsx`, `components/ai-automation/FAQBottomSection.tsx`, `components/video-production/FAQSection.tsx`
- **Issue:** 4 nearly identical FAQ accordion components differing only in data.
- **Fix:** Create single `components/common/FAQSection.tsx` accepting items as props.

### M-02: Duplicate OurApproachSection Components (DRY — Rule of Three triggered)
- **Files:** `components/Web-Dev/OurApproachSection.tsx`, `components/ai-automation/OurApproachSection.tsx`, `components/video-production/OurApproachSection.tsx`
- **Issue:** 3 approach sections with same layout, different step data.
- **Fix:** Create single `components/common/OurApproachSection.tsx` accepting steps as props.

### M-03: Duplicate Shimmer CSS (DRY)
- **Files:** `components/NavDoc.tsx:81-117`, `components/ChatWidget.tsx:428-461`, `app/globals.css:326-339`, `app/casestudy/CaseStudyContent.tsx`
- **Fix:** Define once in `globals.css`, reference everywhere.

### M-04: `useIsMobile` Hydration Mismatch Risk
- **File:** `hooks/use-mobile.tsx:18`
- **Issue:** Returns `false` on server but may be `true` on client → hydration mismatch.
- **Fix:** Return `undefined` initially and handle loading state at call sites.

### M-05: Artificial 3-Second Loading Delay
- **File:** `app/HomeContent.tsx:91`
- **Principle Violated:** Performance — *"Optimize only when measured and needed"* (this pessimizes)
- **Issue:** `setTimeout(() => setIsLoading(false), 3000)` forces minimum 3s spinner even with cached resources. Destroys LCP.
- **Fix:** Remove artificial delay or reduce to 500ms max.

### M-06: Footer `priority` on Both Skyline Images
- **File:** `components/Footer.tsx:222,240`
- **Issue:** Both Atlanta and Hyderabad skylines have `priority={true}` but only one is visible. Wastes bandwidth.
- **Fix:** Remove `priority` from both (below fold).

### M-07: CSS Conflicts — Body Background Overridden
- **File:** `app/globals.css:242,251` + `app/HomeContent.tsx` GlobalStyle
- **Principle Violated:** KISS — conflicting styling in 3 places
- **Fix:** Consolidate body styling to one location in `globals.css`.

### M-08: Unused `categories` Variable
- **File:** `app/ai/AIContent.tsx:16-21`
- **Principle Violated:** YAGNI — defined but never rendered
- **Fix:** Use the array to generate buttons or remove it.

### M-09–M-11: Typos in Filenames
- `components/service/DemandAttension.tsx` → "Attention" (dead, delete per H-01)
- `components/Corousel.tsx` → "Carousel" (dead, delete per H-01)
- `components/ui/accordian.tsx` → `accordion.tsx` (rename + update imports)

### M-12–M-13: Tracked Files That Should Be Gitignored
- `tsconfig.tsbuildinfo` (227 KB) and `next-env.d.ts` — both listed in `.gitignore` but still tracked.
- **Fix:** `git rm --cached tsconfig.tsbuildinfo next-env.d.ts`

### M-14: No `.env.example`
- **Principle Violated:** Maintainability — *"A junior developer could understand this code"*
- **Fix:** Create `.env.example` documenting all required/optional env vars.

### M-15: Synchronous `fs.readFileSync` in Async Function
- **File:** `lib/blog.ts:79`
- **Principle Violated:** Correctness
- **Fix:** Use `fs.promises.readFile` or remove `async` wrapper.

---

## Low Severity Findings

| ID | File | Issue | Principle |
|----|------|-------|-----------|
| L-01 | `app/layout.tsx:101,109` | GA4 ID `G-YCZYQKQYRQ` hardcoded — pollutes analytics in staging | Dependency Inversion |
| L-02 | `app/globals.css:248,254` | `scroll-behavior: smooth` on both html and body — redundant | DRY |
| L-03 | `app/HomeContent.tsx:131-172` | Commented-out code (MusicPlayer, Gallery, Card, TestHero) | Readability — *"Delete commented-out code, git history preserves it"* |
| L-04 | `app/globals.css:16,97,113` | Font file paths with spaces (`Futura Regular.ttf`) — fragile on some build systems | Maintainability |
| L-05 | Multiple files | Redundant `import React` — unnecessary with new JSX transform | YAGNI |
| L-06 | `components/HeroWithAnimation.tsx:535` | `<img>` for logo instead of `next/image` | Framework best practice |
| L-07 | `package.json:77` | `@types/gsap` v1.20.2 is deprecated — GSAP 3.x ships own types | Dependency hygiene |
| L-08 | `tailwind.config.ts:6` | Content path includes `pages/` but no pages directory exists | Readability |
| L-09 | `package.json:71-72` | Both `tw-animate-css` and `tailwindcss-animate` installed — overlapping | KISS |
| L-10 | `components/Footer.tsx:172-174` | Location toggle is a `div` with `onClick` — missing `role`, `tabIndex`, `aria-label` | Accessibility |
| L-11 | `components/ChatWidget.tsx` | Modal missing focus trap and Escape key handler | Accessibility |
| L-12 | `components/NavDoc.tsx:193-236` | Contact modal missing focus trap and Escape key handler | Accessibility |
| L-13 | `app/api/chat/proxy/route.ts:19,48,94,114` | `catch (error: any)` — violates TypeScript strict mode | Type Safety — *"Never use `any` — use `unknown` and narrow"* |
| L-14 | `app/ai-automation/AIAutomationContent.tsx:24,696` | Hidden triple-click ROI toggle — untestable, undiscoverable | KISS, UX |

---

## Implementation Plan

### Phase 1: Security Fixes (Do Now)

**Estimated impact: Eliminates all Critical vulnerabilities**

| # | Task | Files | Standard |
|---|------|-------|----------|
| 1.1 | Move n8n webhook URL to `N8N_WEBHOOK_URL` env var, add startup validation | `app/api/chat/proxy/route.ts` | Dependency Inversion |
| 1.2 | Add `rehype-sanitize` to blog remark pipeline | `lib/blog.ts`, `package.json` | Correctness |
| 1.3 | Add zod schema validation to chat proxy: max 2000 chars, validate sessionId | `app/api/chat/proxy/route.ts`, `package.json` | Correctness |
| 1.4 | Create `.env.example` documenting all env vars | New: `.env.example` | Maintainability |
| 1.5 | Replace `catch (error: any)` with `catch (error: unknown)` + narrowing | `app/api/chat/proxy/route.ts` | Type Safety |
| 1.6 | Move GA4 ID to `NEXT_PUBLIC_GA_ID` env var | `app/layout.tsx` | Dependency Inversion |

**Checklist before starting:**
- [ ] Searched codebase for all `process.env` references to catalog existing vars
- [ ] Identified all `dangerouslySetInnerHTML` usages
- [ ] No speculative features planned

---

### Phase 2: Dead Code Cleanup (Next Sprint)

**Estimated impact: Removes ~40 files, ~5,000+ lines, ~257 KB from repo**

| # | Task | Files | Standard |
|---|------|-------|----------|
| 2.1 | Delete all unused components listed in H-01 | ~40 component files | YAGNI |
| 2.2 | Delete dead page routes | `app/_web-old/`, `app/_aeriel/`, `app/_landing/`, `app/sound/page_original.tsx` | YAGNI |
| 2.3 | Delete orphan root files | `Usersayush.claude...md`, `ROV assets.ico`, `ROV assets.png` | Repo hygiene |
| 2.4 | Audit and delete unused shadcn/ui components | `components/ui/` (~30 files) | YAGNI |
| 2.5 | Remove tracked gitignored files | `tsconfig.tsbuildinfo`, `next-env.d.ts` | Repo hygiene |
| 2.6 | Delete commented-out code in HomeContent | `app/HomeContent.tsx:131-172` | Readability |
| 2.7 | Remove unused `categories` variable | `app/ai/AIContent.tsx:16-21` | YAGNI |
| 2.8 | Fix `accordian.tsx` typo → `accordion.tsx` | `components/ui/accordian.tsx` + imports | Readability |

**Verification after completion:**
- [ ] No unused imports, variables, or functions remain
- [ ] `npm run build` succeeds with zero errors
- [ ] All pages render correctly (manual spot-check)

---

### Phase 3: Performance Optimization (1-2 Sprints)

**Estimated impact: ~20 KB bundle reduction, 3s faster LCP, 6.5 MB less on page load**

| # | Task | Files | Standard |
|---|------|-------|----------|
| 3.1 | Remove 3s artificial loading delay (or reduce to 500ms) | `app/HomeContent.tsx:91` | Performance |
| 3.2 | Migrate styled-components → Tailwind (4 files) | `HomeContent.tsx`, `HeroWithAnimation.tsx`, `CaseStudyContent.tsx`, `lib/registry.tsx` | KISS |
| 3.3 | Remove `styled-components` + `StyledComponentsRegistry` after migration | `package.json`, `lib/registry.tsx`, `app/layout.tsx` | KISS |
| 3.4 | Replace all `<img>` with `next/image` | `CtrlAContent.tsx`, `AIAutomationContent.tsx`, `TestimonialsSection.tsx`, `HeroWithAnimation.tsx` | Framework reuse |
| 3.5 | Replace 652-frame preload with video or viewport-based loading | `components/HeroWithAnimation.tsx:366-383` | KISS, Performance |
| 3.6 | Remove `priority` from footer skyline images | `components/Footer.tsx:222,240` | Performance |
| 3.7 | Consolidate body background styling to single location | `app/globals.css`, remove GlobalStyle | KISS |
| 3.8 | Remove duplicate `scroll-behavior: smooth` | `app/globals.css:254` | DRY |
| 3.9 | Resolve `tw-animate-css` vs `tailwindcss-animate` — pick one | `package.json`, `globals.css` | KISS |

**Verification after completion:**
- [ ] Lighthouse Performance score improved (measure before/after)
- [ ] No hydration mismatches in console
- [ ] Bundle analyzer shows styled-components removed

---

### Phase 4: DRY Consolidation (2-3 Sprints)

**Estimated impact: Eliminates duplicate patterns, creates reusable shared components**

| # | Task | Files | Standard |
|---|------|-------|----------|
| 4.1 | Create generic `components/common/FAQSection.tsx` accepting FAQ items as props | Replace 4 duplicate FAQ components | DRY (Rule of Three) |
| 4.2 | Create generic `components/common/OurApproachSection.tsx` accepting steps as props | Replace 3 duplicate approach components | DRY (Rule of Three) |
| 4.3 | Consolidate shimmer animation to single definition in `globals.css` | `NavDoc.tsx`, `ChatWidget.tsx`, `globals.css`, `CaseStudyContent.tsx` | DRY |
| 4.4 | Extract font families into Tailwind config or CSS custom properties | 100+ files with hardcoded `fontFamily` | DRY |
| 4.5 | Fix `useIsMobile` hydration mismatch | `hooks/use-mobile.tsx` | Correctness |
| 4.6 | Add error boundaries at page level | Each route's `error.tsx` | Correctness |

**New shared component specification:**
```typescript
// components/common/FAQSection.tsx
interface FAQItem {
  question: string;
  answer: string;
}
interface FAQSectionProps {
  items: FAQItem[];
  title?: string;
}
```

```typescript
// components/common/OurApproachSection.tsx
interface ApproachStep {
  number: number;
  title: string;
  description: string;
  icon?: React.ReactNode;
}
interface OurApproachSectionProps {
  steps: ApproachStep[];
  title?: string;
}
```

**Checklist:**
- [ ] Every new function has a clear single purpose
- [ ] No new function exceeds ~30 lines
- [ ] No new file exceeds ~200 lines
- [ ] All names are descriptive and unambiguous

---

### Phase 5: Framework Upgrade (Next Quarter)

**Estimated impact: Security patches, performance improvements, modern features**

| # | Task | Files | Standard |
|---|------|-------|----------|
| 5.1 | Upgrade Next.js to 14.x or 15.x | `package.json`, potentially all route files | Correctness (security) |
| 5.2 | Remove deprecated `@types/gsap` | `package.json:77` | Dependency hygiene |
| 5.3 | Remove `pages/` from Tailwind content paths | `tailwind.config.ts:6` | Readability |
| 5.4 | Remove redundant `import React` statements | Multiple files | YAGNI |
| 5.5 | Rename font files to remove spaces | `public/font/` directory | Maintainability |
| 5.6 | Add accessibility to interactive elements (focus traps, ARIA, keyboard) | `Footer.tsx`, `ChatWidget.tsx`, `NavDoc.tsx` | Correctness |

---

## Standards Compliance Scorecard

| Standard | Current State | Target After Phase 4 |
|----------|--------------|---------------------|
| **YAGNI** | ~40 dead components, 4 dead routes, ~30 unused UI components | Zero dead code |
| **DRY** | 4x FAQ, 3x Approach, 4x shimmer, 240x font strings | Single source for each |
| **KISS** | 2 styling systems, 3 body background sources, hidden toggle features | Single styling system (Tailwind) |
| **SOLID (Dependency Inversion)** | Hardcoded webhook URL, hardcoded GA ID | All config via env vars |
| **Correctness** | XSS risk, no input validation, no error boundaries | Sanitized HTML, validated inputs, error boundaries |
| **Readability** | Typos in filenames, commented-out code, `any` types | Clean naming, no dead comments, strict TypeScript |
| **Maintainability** | No `.env.example`, tracked gitignored files | Documented setup, clean git tracking |
| **Performance** | 652-image preload, 3s delay, dual CSS runtime, native `<img>` | Video/progressive load, no delay, Tailwind only, `next/image` |

---

## How to Use This Report

1. **Start with Phase 1** — security fixes are non-negotiable and self-contained
2. **Phase 2 is low-risk, high-reward** — deleting dead code can't break anything that's actually used
3. **Phases 3-4 can overlap** — performance and DRY work touch different files
4. **Phase 5 is a dedicated effort** — Next.js upgrade may require migration work
5. **After each phase**, run `npm run build` and manually verify all pages render correctly
