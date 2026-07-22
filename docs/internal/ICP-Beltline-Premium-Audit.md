# Beltline page premium audit (2026-07-22)

Screenshot-based audit of `/industries/beltline-atlanta` at 1440px. Representative of all six ICP pages. Goal: make Beltline "super premium," then propagate the winning patterns to the other five.

## Verdict
Good ingredients, bloated execution. Five additive passes (restyle → media → composition → calculator/testimonials → chapter visuals) stacked the page to ~18,600px across 16 sections with large dead-air gaps. Premium here means LESS and TIGHTER, not more.

## Keep (working)
- Hero: cinematic scrimmed b-roll, clean white + gradient-italic type, dual CTAs. Strong.
- Stats tiles: clean once the bug below is fixed.
- Calculator: good concept and interaction.
- Showcase card structure: good bones.

## Fix
1. **Hydration error (P0 bug).** `IndustryStats` inline `<style>` contains an apostrophe in a CSS comment ("survives Reveal's inline transform"); server encodes it `&#x27;`, client renders `'`, React mismatch → "3 errors" badge on load. Remove apostrophes from all inline-JSX `<style>` comments (or move the CSS to a non-inline mechanism). Audit every `components/industries/*` inline style block for the same.
2. **Kill dead air.** Cut inter-section vertical padding to a tight, consistent rhythm. The page should feel dense and confident, not empty. Target: roughly halve total page height.
3. **Orphan grids.** Pains (4 cards) and Services (4 cards) render 3-across leaving one card alone beside a huge void. Change to 2x2 (or 4-across on wide screens). No orphaned card + void.
4. **Ghost numerals behind pains.** "01 02 03 04" collides with the H2 and reads as a glitch. Remove it here, or replace with a single coherent ghost word like the showcase's BELTLINE. The showcase ghost word works; the numeral row does not.
5. **Orphan connector line.** The thin vertical ember line floating between stats and pains is lost in black. Remove or make it a deliberate, anchored divider.
6. **Showcase poster frames.** Cards are flat ember gradient blocks until video mounts. Give a real first-frame poster (or a tasteful static thumbnail) so they never read as empty boxes.
7. **Body bloat.** 7 chapters largely restate the pains/services above. Tighten to ~3-4 dense chapters, or restructure so the body is not a wall that repeats earlier sections. Keep GEO prose in DOM but denser.
8. **Section count.** 16 is too many. Candidates to merge/cut: the body chapters overlap pains+services; ProjectStrip + Showcase + Testimonials are three separate proof-ish bands. Consolidate the proof story.

## Propagation
Once Beltline is dialed in and Andi approves, apply the same structural fixes (dead-air rhythm, 2x2 grids, ghost-word not numerals, poster frames, tightened body, hydration-safe inline styles) to the other five pages via the shared `components/industries/*` (most fixes are component-level, so they propagate automatically; content-file trims are per page).
