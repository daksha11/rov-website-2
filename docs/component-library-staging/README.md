# Component Library Staging

Retired components preserved for the toolkit component library project (planned week of 2026-07-13). They were removed from `components/` in the 2026-07-12 restructure because nothing imported them. This folder is excluded from TypeScript compilation (`tsconfig.json` excludes `docs/`), so nothing here affects the build.

## What's here

**`ctrla/`** · 10 files from an earlier CTRL-A landing page concept (the live CTRL-A UI is `app/ctrla/_components/`):

| Component | What it is | Known issues before reuse |
|---|---|---|
| `BentoFlipGallery.tsx` | Flipping bento image grid | Check its default image paths |
| `BookACall.tsx` | Booking CTA section | References `/assets/background/new9.webp` · `public/assets/` does not exist |
| `BrandKitSection.tsx` | Brand kit promo section | · |
| `CardTemplate.tsx` | Card layout template | References 2 missing `/assets/...` images |
| `CreativeFriction.tsx` | Editorial section | References 4 missing `/assets/...` images |
| `Culture.tsx` | Culture section | References 2 missing `/assets/...` images |
| `GlobalTeamGlobe.tsx` | Team globe visualization | Compare with the live `components/TeamGlobeView.tsx` before reusing |
| `HeroSection.tsx` | Hero with layered imagery | References 4 missing `/assets/...` images |
| `ToolkitSection.tsx` | Toolkit promo section | References 1 missing `/assets/...` image |

**`Services_FolderPopout_v1.tsx`** · v1 of the Services folder popout (superseded by `components/Services.tsx`). References 3 assets that no longer exist (`/heroassets/webfolder2.png`, `/folderback.svg`, `/folderfront.svg`).

## Before promoting anything back into the app

1. Fix the broken image paths (the `/assets/` folder was never in `public/`; point them at real assets).
2. Move the file into the proper `components/` group per `CONTRIBUTING.md` rule 3.
3. It only counts as alive once something imports it.
