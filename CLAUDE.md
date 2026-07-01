# Project Rules

## Canvas Components
- **Never set fixed pixel dimensions** on `<canvas>` elements via inline `style={{ width: N, height: N }}`. Canvas must always use `style={{ width: "100%", height: "100%" }}` and derive actual dimensions from the parent container via `canvas.clientWidth` / `canvas.clientHeight` in the draw loop.
- **Always guard the draw loop** against 0-dimension canvases: if `clientWidth` or `clientHeight` is 0, skip the frame and schedule the next `requestAnimationFrame`. This prevents black-box rendering when the canvas hasn't been laid out yet.
- The parent container is responsible for sizing (e.g., `width: min(90vw, 600px)`), not the canvas itself.

## .next Cache
- Run `rimraf .next` before `next dev` (already configured in package.json `"dev"` script). If you see "Cannot find module './XXXX.js'" errors, delete `.next` and restart.

## Team Data
- Team member images must use `.webp` format only (not `.png`). Images live in `public/teammembers/`.
- Team member descriptions (specialties) must be written in **first person** ("I design..." not "Designs...").

## Blog Page Design Standard
All custom blog `page.tsx` files must match the design system defined in `.claude/blog-design-standard.md`.
Canonical reference: `app/blog/restaurant-atlanta/page.tsx`.

**The non-negotiables:**
- Colors: cream `#FFF4E3` bg, dark espresso `#3B2114`, rust `#90422C`, orange `#EA9A61`
- Fonts: Norwige (headings) / Inter (body) / Neue Montreal (labels only)
- Structure: Hero → Stats Row → Main Content → FAQ Accordion → Author Card → CTA
- Hero H1: solid white, not gradient
- Author pill in hero: beige background, dark text
- CTA: beige background, dark text — never dark/gradient CTA background
- Logo always links to `/`
- FAQ: cream background, Norwige bold questions, chevron accordion
