# SavingsCalculator Implementation Plan

## Overview
A single-file  component at , inserted into  between  and the Student Rates callout (line 343-344).

---

## 1. File: components/sound_page/SavingsCalculator.tsx

### Imports
-  directive
- , ,  from react
- ,  from framer-motion
- No new dependencies

### Constants (top of file)
- HEADING_FONT, BODY_FONT, spring -- same values as StudioSection
- TIERS array: [{max:2, name:"Starter", price:150}, {max:4, name:"Standard", price:250}, {max:6, name:"Pro", price:400}]
- CREATIVE_SERVICES array with id, label, industryCost, rovCost, perSong fields
- ServiceId type derived from CREATIVE_SERVICES

### State (3 pieces only)
- songsPerMonth: number, default 2, range 1-10
- costPerSong: number, default 200, range 50-300 step 10
- activeServices: Set of ServiceId

### Calculation (useMemo depending on all 3 state values)
- Tier: find matching TIERS entry or Custom (400 + (songs-6)*65)
- currentTotal = (songs * costPerSong * 12) + creative service industry costs
- rovTotal = (tierPrice * 12) + creative service ROV costs
- annualSavings = currentTotal - rovTotal
- savingsPercent = round((savings/currentTotal)*100)
- CTA: songs<=6 -> "Start with a free mix" mailto:stems@rovstudios.com; songs>6 -> "DM us for a custom quote" ig.me/m/rangeofviewstudios

### Component Structure
1. Section label ("See Your Savings") -- matches ValueAccordion pattern exactly
2. Inputs card (rounded-2xl, border-white/[0.06], bg-white/[0.02])
   - Two-column grid (md+) for sliders: songs/month and cost/song
   - Each slider: large italic number display + range input + min/max labels
   - Range track styled with inline gradient background (filled portion = #EA9A61)
   - Creative services: row of toggle pill buttons
   - Active pill: border-[#EA9A61]/40 bg-[#EA9A61]/10 text-[#EA9A61]
   - Inactive pill: border-white/[0.07] text-white/40
3. Results comparison (lg:grid-cols-2)
   - Left: "Without ROV" card, neutral styling, line items + total
   - Right: "With ROV" card, accent border-[#EA9A61]/20, subtle gradient bg, tier badge
   - LineItem helper: label left, dollar value right
4. Savings banner: large gradient text number, key={annualSavings} for re-animation
   - Negative/zero savings: neutral fallback message
5. CTA button: cta-shine class, gradient bg, inset box-shadow, whileHover scale

### Animation Approach
- useInView(ref, { once: true, margin: "-60px" }) for scroll reveal
- Staggered delays: section label (0), inputs (0.08), results (0.16), savings (0.24)
- Each uses initial={{ opacity:0, y:30 }} with spring transition
- Savings number uses key={calc.annualSavings} to remount and re-animate on change
- No debounce needed: useMemo is synchronous, only the key-driven remount is visual

### Responsive Breakpoints
- Mobile (<768): single column everything, stacked
- Tablet (md:768): two-column sliders, stacked results
- Desktop (lg:1024): two-column sliders, two-column results side by side

---

## 2. File: components/sound_page/StudioSection.tsx

### Changes (2 lines total)
- Line 2 area: add import SavingsCalculator from "./SavingsCalculator"
- Line 342 area: insert <SavingsCalculator /> between </ValueAccordion> closing and Student Rates callout

---

## 3. File: app/globals.css (optional polish)

### Range Input Styles
Existing rule at line 405 only sets background: #302218 for webkit-slider-thumb.
Extend with: -webkit-appearance: none, width: 20px, height: 20px, border-radius: 50%, border: 2px solid #EA9A61, plus matching -moz-range-thumb and track rules.

MusicPlayer uses opacity: 0 on its range input, so extending the global rule is safe.
If cautious: scope under .calc-slider class instead.

---

## 4. Edge Cases

| Case | Handling |
|------|---------|
| annualSavings <= 0 | Show neutral message, CTA still renders |
| songsPerMonth = 10 | Display "10+", Custom tier = 400 + 4*65 = 660/mo |
| No creative services | Only mixing comparison rows shown |
| Fast slider drag | useMemo is sync, no debounce; key prop handles animation |
| Custom tier CTA | Opens Instagram DM link in new tab |

---

## 5. Implementation Sequence

1. Extend range input styles in globals.css
2. Create SavingsCalculator.tsx (~200 lines)
3. Import + insert into StudioSection.tsx (2 lines)
4. Test at 375px, 768px, 1024px breakpoints
5. Cross-browser slider thumb verification
6. Edge case testing
