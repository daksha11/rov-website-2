# ROV Studios - SEO Implementation Plan

**Date:** March 11, 2026
**Site:** https://rovstudios.com
**Framework:** Next.js 13.5.1 (App Router)
**Last Updated:** March 13, 2026

---

## What's Been Done

### Phase 1: Root Layout & Global Metadata — COMPLETE
- Updated `app/layout.tsx` with comprehensive global metadata: title template (`%s | Range of View Studios`), metadataBase, OpenGraph, Twitter cards, robots directives, keywords, canonical URL, icons, and manifest reference.

### Phase 2: Page-Level Metadata — COMPLETE
- All 11 pages now have unique `export const metadata` with title, description, canonical URL, and OpenGraph configuration.
- Client components were extracted from `"use client"` pages into separate `*Content.tsx` files so `page.tsx` could become server components capable of exporting metadata.
- **Pages updated:** Home, Sound, Web, Video Production, AI, AI Automation, Case Studies index, The Bando, Aysegul Ikna, DKM Corp, CTRL A.

### Phase 3: Open Graph & Social Cards — COMPLETE
- All 10 OG images (1200x630px, JPG) placed in `public/og/`.
- All pages now reference their dedicated OG images from `/og/` directory.
- Twitter `summary_large_image` card metadata added to every page (previously missing on AI, Case Studies hub, CTRL A, Bando page, DKM page).
- Case study pages (Bando, Ikna) updated from generic case study images to dedicated OG images (`og-bando.jpg`, `og-ikna.jpg`).
- **Files:** og-default.jpg, og-home.jpg, og-sound.jpg, og-web.jpg, og-video.jpg, og-ai.jpg, og-casestudy.jpg, og-bando.jpg, og-ikna.jpg, og-dkm.jpg, og-ctrla.jpg.

### Phase 4: Image SEO — COMPLETE
- Fixed empty alt text in TeamSection, CaseStudyHero, and ArtistBreakthrough.
- Updated ~26 generic alt texts across all components with descriptive, keyword-rich alternatives.
- Decorative images (arrows, hands) set to `alt=""` per best practices.
- Added `role="img"` and `aria-label` to meaningful background images (Story, MusicBanner, HeroVideo, VisionSection).
- Converted Gallery and MixesSection `<img>` tags to Next.js `<Image>` with proper `sizes` attributes.
- Converted DesignBreak `<img>` to Next.js `<Image>`.
- **Components updated:** TeamSection, CaseStudyHero, ArtistBreakthrough, HeroSection (ctrla), Culture, CardTemplate, ShowcaseSection, Corousel, DesignBreak, Story, MusicPlayer, MusicBanner, TakeWork, HustleSection, HowWeWorkSection, VisionMixing, HeroSection (aeriel), VisionSection, Gallery, MixesSection, WhatMakesUsDifferent, VisionImpact, GlassComponent, LatestAlbum.

### Phase 5: Video SEO — COMPLETE
- Created reusable `VideoSchema.tsx` component for VideoObject JSON-LD structured data.
- Added `aria-label` and `title` to all 15 `<video>` elements across 11 components.
- Decorative footer ring videos marked with `aria-hidden="true"`.
- Added `playsInline` to ShowcaseSection video that was missing it.
- Added VideoSchema structured data to video-production page (4 schemas: Atlanta Skyline, Gladstone, Mountain, Boxing).
- Added VideoSchema structured data to sound page (2 schemas: Stars Collide, Starboy).
- SoundHero already had `poster` attribute; video thumbnail generation (ffmpeg) noted as follow-up for remaining videos.
- **Components updated:** VideoProductionContent, VideoPortfolioSection, PostProductionSection, ContactSection (aeriel), HeroSection (aeriel), WhoWeFlyWith, SoundHero, Loading, VideoShowcaseSection, ShowcaseSection (Web-Dev), Footer.
- **Pages with VideoSchema:** video-production/page.tsx, sound/page.tsx.

### Phase 6: Text & Heading SEO — COMPLETE
- Added visually-hidden `<h1>` to Home page ("Range of View Studios — Creative Production Agency in Atlanta") using Tailwind `sr-only`.
- Sound page: Wrapped SoundHero tagline ("RAW. REFINED. RELEASED.") in `<h1>`, demoted AgencyIntro's `<h1>` to `<h2>`.
- Web page: Combined split `<h2>` "Your Website" + `<h1>` "Reimagined" into a single `<h1>` with `<span>` children.
- CTRL A page: Merged two `<h1>` tags ("COMING" / "SOON") into one `<h1>` with `<span>` children.
- Aerial page: Merged two `<h1>` tags ("ELEVATE YOUR VISION" / "LITERALLY.") into one `<h1>` with `<span>` children.
- Video Production page: h1 "Breathtaking Visuals" was already correct — no changes needed.
- AI and AI Automation pages: h1 headings were already well-structured — no changes needed.
- **Files updated:** HomeContent.tsx, SoundHero.tsx, AgencyIntro.tsx, WebContent.tsx, CtrlAContent.tsx, HeroSection (aeriel).

### Phase 7: Structured Data (JSON-LD) — COMPLETE
- Created 5 reusable schema components: `OrganizationSchema`, `ServiceSchema`, `FAQPageSchema`, `BreadcrumbSchema`, `CreativeWorkSchema`.
- Added Organization JSON-LD to root layout (`app/layout.tsx`) — appears on every page.
- Added Service schema to all 5 service pages (Sound, Web, Video Production, AI, AI Automation).
- Added BreadcrumbList schema to all 5 service pages and all 3 case study pages.
- Added FAQPage schema to 4 pages with FAQ sections (Sound, Web, Video Production, AI Automation).
- Added CreativeWork schema to all 3 case study pages (The Bando, Aysegul Ikna, DKM Corp).
- **New components:** OrganizationSchema.tsx, ServiceSchema.tsx, FAQPageSchema.tsx, BreadcrumbSchema.tsx, CreativeWorkSchema.tsx.
- **Pages updated:** layout.tsx, sound/page.tsx, web/page.tsx, video-production/page.tsx, ai/page.tsx, ai-automation/page.tsx, casestudy/bando/page.tsx, casestudy/ikna/page.tsx, casestudy/dkm/page.tsx.

### Phase 8: Sitemap & Technical SEO — COMPLETE
- Verified all routes are present in sitemap (11 pages including all 3 case studies and CTRL A).
- Added server-level 301 redirect for `/casestudy/aysegul-ikna` → `/casestudy/ikna` in `next.config.js` (supplements existing `permanentRedirect` in page component).
- Created video sitemap at `app/video-sitemap.xml/route.ts` with 6 video entries (4 from video-production, 2 from sound page).
- Updated `app/robots.ts` to reference both `sitemap.xml` and `video-sitemap.xml`.
- **Files updated:** next.config.js, app/robots.ts.
- **Files created:** app/video-sitemap.xml/route.ts.

### Phase 9: Performance & Image Optimization — COMPLETE
- Enabled Next.js image optimization in `next.config.js` (formats: AVIF/WebP, responsive device/image sizes).
- Converted 23 oversized images from PNG/JPG to WebP (total savings ~150MB+). Key conversions: team member photos (6.6MB→675KB avg), hero assets (22MB→2MB), background images (6MB→443KB).
- Updated all image references across 13 components to use `.webp` versions.
- Added `priority` prop to CTRL A hero images for faster LCP.
- **Files updated:** next.config.js, TeamSection.tsx, Services.tsx, Footer.tsx, HeroVideo.tsx, MusicPlayer.tsx, CaseStudyContent.tsx, FeaturedWorksSection.tsx, BookACall.tsx, CardTemplate.tsx, HeroSection (ctrla), casestudy/ikna/page.tsx.

### Phase 10: Web Manifest & Verification — COMPLETE
- Fixed `site.webmanifest`: added name ("Range of View Studios"), short_name ("ROV Studios"), description, start_url, scope, and corrected theme/background colors from white to black.
- Fixed CaseStudyHero.tsx type error: `title` (string[]) passed to `alt` (string) — added `.join(' ')`.
- **Post-deploy verification (2026-03-12):**
  - OG tags verified on all 11 pages — correct og:title, og:description, og:image, og:url, twitter:card, canonical URLs.
  - OG images loading from `/og/` directory on 9/11 pages. Bando and CTRL A showing cached old values (code is correct, CDN cache issue).
  - Video sitemap live at `/video-sitemap.xml` — all 6 videos present with correct content URLs and thumbnails.
  - Manifest live and correct: name, short_name, description, black theme, icons.
  - Sitemap.xml: all 11 routes with correct priorities (1.0 → 0.7).
  - Redirects working: `/casestudy/aysegul-ikna` → `/casestudy/ikna` (308→308→200), `/services/*` → `/*` (308→308→200).
  - robots.txt: CDN may still cache old version (missing video-sitemap ref); code is correct.
- **Files updated:** public/site.webmanifest, components/casestudy/CaseStudyHero.tsx, SEO-IMPLEMENTATION-PLAN.md.

---

## Table of Contents

1. [Phase 3: Open Graph & Social Cards](#1-phase-3-open-graph--social-cards)
2. [Phase 4: Image SEO](#2-phase-4-image-seo)
3. [Phase 5: Video SEO](#3-phase-5-video-seo)
4. [Phase 6: Text & Heading SEO](#4-phase-6-text--heading-seo)
5. [Phase 7: Structured Data (JSON-LD)](#5-phase-7-structured-data-json-ld)
6. [Phase 8: Sitemap & Technical SEO](#6-phase-8-sitemap--technical-seo)
7. [Phase 9: Performance & Image Optimization](#7-phase-9-performance--image-optimization)
8. [Phase 10: Web Manifest & PWA](#8-phase-10-web-manifest--pwa)
9. [OG Image Creation Guide](#9-og-image-creation-guide)
10. [Implementation Checklist](#10-implementation-checklist)

---

## 1. Phase 3: Open Graph & Social Cards

### Required: Create OG Images

See "What You Need to Provide" section above for the full list of required images.

### OG Image Design Guidelines
- **Size:** 1200x630px (1.91:1 ratio)
- **Format:** JPG (smaller file size than PNG for photos)
- **File size:** Keep under 300KB for fast loading
- **Safe zone:** Keep important content within 1000x530px center area (edges get cropped on some platforms)
- **Text:** Use large, bold text (minimum 40px) — images are often displayed small
- **Branding:** Include ROV logo in corner
- **Contrast:** Ensure text is readable on the background

### Alternative: Auto-Generated OG Images

Next.js supports dynamic OG image generation. Create `app/og/route.tsx`:

```tsx
import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") || "Range of View Studios";

  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #110808 0%, #1a1a2e 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px",
        }}
      >
        <h1
          style={{
            fontSize: 64,
            color: "white",
            textAlign: "center",
            lineHeight: 1.2,
          }}
        >
          {title}
        </h1>
        <p style={{ fontSize: 28, color: "rgba(255,255,255,0.6)", marginTop: 20 }}>
          Range of View Studios
        </p>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
```

Then reference it in metadata: `images: [{ url: "/og?title=Sound+Engineering" }]`

---

## 2. Phase 4: Image SEO

### 2.1 Fix Missing Alt Text

| File | Line | Current | Recommended Alt Text |
|------|------|---------|---------------------|
| `components/TeamSection.tsx` | ~283 | `alt=""` | `alt={expandedMember.name + " - " + expandedMember.role}` |
| All CSS `background-image` elements | Various | No alt | Add `role="img"` and `aria-label="..."` to parent div |

### 2.2 Improve Existing Alt Text

Replace generic alt text with descriptive, keyword-rich alternatives:

| Current Alt | Better Alt |
|-------------|-----------|
| `"Album Cover 1"` | `"Stars Collide album cover produced by Range of View Studios"` |
| `"Album Cover 2"` | `"After Hours EP cover art by ROV Studios"` |
| `"ROV Album 1"` | `"Range of View Studios music production portfolio"` |
| `"Cover 1"` through `"Cover 3"` | Describe what's actually in each cover image |
| `"Microphone"` | `"Professional studio microphone at ROV Studios recording booth"` |
| `"Arrow"` | `"Navigate to next section"` (or use `alt=""` if purely decorative) |
| `"Camera Icon"` | `"Video production camera icon"` or `alt=""` if decorative |
| `"Decoration"` | `alt=""` (decorative images should have empty alt) |
| `"Album artwork {id}"` | Use actual album/track names |
| `"Album Cover"` (GlassComponent) | Describe the specific content |

### 2.3 Alt Text Best Practices

```
DO:
- "Professional mixing console at Range of View Studios, Atlanta"
- "The Bando restaurant website homepage redesign by ROV Studios"
- "Before and after sound engineering comparison waveform"

DON'T:
- "image1.jpg"
- "Album Cover 1"
- "Photo"
- "image of a microphone" (don't say "image of" — screen readers already announce it as an image)
```

### 2.4 Add Accessible Labels to Background Images

For CSS `background-image` elements that convey meaning, add ARIA attributes:

```tsx
// Before
<div style={{ backgroundImage: "url('/assets/background/5.jpg')" }}>

// After
<div
  role="img"
  aria-label="Atmospheric studio environment at Range of View Studios"
  style={{ backgroundImage: "url('/assets/background/5.jpg')" }}
>
```

**Priority background images to label** (content-bearing, not purely decorative):
- `Story.tsx` line 36 — studio background
- `MusicBanner.tsx` line 274 — music production background
- `VisionSection.tsx` line 10 — vision section background
- `CaseStudyHero` — case study hero backgrounds
- `HeroVideo.tsx` line 12 — hero background

For purely **decorative backgrounds** (textures, gradients, abstract patterns), add `aria-hidden="true"` instead.

### 2.5 Image File Naming

Rename image files to be descriptive and keyword-rich:

| Current | Recommended |
|---------|-------------|
| `changeit.webp` | `rov-studio-portfolio.webp` |
| `5th.gif` | `studio-ambience-animation.gif` |
| `Untitled-6.gif` | `creative-process-animation.gif` |
| `Untitled-3.gif` | `sound-engineering-animation.gif` |
| `3.jpg`, `5.jpg`, `12.jpg` | Descriptive names like `mixing-studio-interior.jpg` |
| `1.png`, `2.jpg` | Descriptive names matching content |
| `Adf.png` | `studio-audio-interface.png` |
| `samxbasuvid.png` | `sound-engineer-at-work.png` |
| `new1.jpg` through `new9.png` | Descriptive names matching content |

> **Impact:** Google Images search uses file names as a ranking signal. `mixing-studio-interior.jpg` ranks better than `3.jpg` for "mixing studio" searches.

### 2.6 Replace `<img>` with Next.js `<Image>`

These locations use plain `<img>` tags and should switch to Next.js `<Image>`:

| File | Line | Current |
|------|------|---------|
| `app/page.tsx` | 28-34 | Album cover loop uses plain `<img>` |
| `app/sound/page.tsx` | 69-71 | ROV logo uses plain `<img>` |
| `components/TeamGallery.tsx` | 102 | Team member images |
| `components/ArtistCard.tsx` | 83 | Artist images |
| `components/sound_page/MusicPlayer.tsx` | 392, 500 | Track covers |
| `app/casestudy/page.tsx` | 352 | Project images |

Benefits of `<Image>`:
- Automatic lazy loading
- Responsive `srcset` generation
- WebP/AVIF auto-conversion (when optimization is enabled)
- Prevents Cumulative Layout Shift (CLS)

> **Note:** Image optimization is currently disabled in `next.config.js` (`images: { unoptimized: true }`). See [Phase 9](#7-phase-9-performance--image-optimization) for how to enable it.

---

## 3. Phase 5: Video SEO

### 3.1 Video Structured Data (JSON-LD)

Add `VideoObject` schema to pages with videos. Create a reusable component:

```tsx
// components/VideoSchema.tsx
export function VideoSchema({
  name,
  description,
  thumbnailUrl,
  uploadDate,
  contentUrl,
  duration,
}: {
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;
  contentUrl?: string;
  duration?: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name,
    description,
    thumbnailUrl: `https://rovstudios.com${thumbnailUrl}`,
    uploadDate,
    ...(contentUrl && { contentUrl: `https://rovstudios.com${contentUrl}` }),
    ...(duration && { duration }),
    publisher: {
      "@type": "Organization",
      name: "Range of View Studios",
      logo: {
        "@type": "ImageObject",
        url: "https://rovstudios.com/rov-logo.webp",
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
```

### 3.2 Apply to Video Production Page

In `app/video-production/page.tsx`, add schemas for each showcase video:

```tsx
<VideoSchema
  name="Atlanta Skyline Cinematic Shot"
  description="Cinematic aerial footage of the Atlanta skyline captured by Range of View Studios."
  thumbnailUrl="/videoprod/atlskyline-thumb.jpg"
  uploadDate="2025-01-15"
  contentUrl="/videoprod/Atlskylineweb.mp4"
  duration="PT30S"
/>
<VideoSchema
  name="Gladstone Creative Shot"
  description="Creative video production showcasing dynamic visual storytelling by ROV Studios."
  thumbnailUrl="/videoprod/gladshot-thumb.jpg"
  uploadDate="2025-01-15"
  contentUrl="/videoprod/Gladshotweb.mp4"
  duration="PT25S"
/>
```

### 3.3 Add Video Thumbnails

For each video in `/public/videoprod/`, create a thumbnail image (JPG, 1280x720):

| Video | Thumbnail to Create |
|-------|---------------------|
| `Atlskylineweb.mp4` | `atlskyline-thumb.jpg` |
| `Gladshotweb.mp4` | `gladshot-thumb.jpg` |
| `Laketipweb.mp4` | `laketip-thumb.jpg` |
| `Mountainweb.mp4` | `mountain-thumb.jpg` |
| `Redstairs.mp4` | `redstairs-thumb.jpg` |
| `Signiabenzweb.mp4` | `signiabenz-thumb.jpg` |

Extract thumbnails from videos using ffmpeg:
```bash
ffmpeg -i Atlskylineweb.mp4 -ss 00:00:02 -frames:v 1 -q:v 2 atlskyline-thumb.jpg
```

### 3.4 Video Accessibility

Add `aria-label` and `title` attributes to all `<video>` elements:

```tsx
// Before
<video ref={videoRef} loop muted playsInline>

// After
<video
  ref={videoRef}
  loop
  muted
  playsInline
  aria-label="Atlanta skyline cinematic footage by Range of View Studios"
  title="Atlanta Skyline - ROV Studios"
>
```

### 3.5 Video Poster Images

Add `poster` attribute to all `<video>` tags for better perceived performance:

```tsx
<video
  poster="/videoprod/atlskyline-thumb.jpg"
  loop
  muted
  playsInline
>
```

---

## 4. Phase 6: Text & Heading SEO

### 4.1 Heading Hierarchy Fixes

Each page should have exactly **one `<h1>`** that clearly describes the page content. Currently there are issues:

#### Home Page (`/`)
- **Issue:** No explicit `<h1>` — branding is animation-based
- **Fix:** Add a visually hidden `<h1>` for SEO:
```tsx
<h1 className="sr-only">
  Range of View Studios — Creative Production Agency in Atlanta
</h1>
```
Add to `globals.css`:
```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```
> Note: Tailwind already includes `sr-only` utility class — just use `className="sr-only"`.

#### Sound Page (`/sound`)
- **Issue:** h1 says "Breathtaking Visuals" — this is the video production tagline, not sound
- **Fix:** Change to something like `"Professional Sound Engineering & Music Production"`

#### CTRL A Page (`/ctrla`)
- **Issue:** Two `<h1>` tags ("COMING SOON" split across two elements)
- **Fix:** Merge into one `<h1>` or make the second one `<span>`

#### Web Page (`/web`)
- **Issue:** h2 "Your Website" followed by h1 "Reimagined" — split heading
- **Fix:** Combine into single `<h1>Your Website, Reimagined</h1>`

### 4.2 Heading Content Optimization

Replace vague headings with keyword-rich, descriptive ones:

| Page | Current Heading | Optimized Heading |
|------|----------------|-------------------|
| Sound | "Breathtaking Visuals" (wrong page!) | "Professional Sound Engineering & Mixing" |
| Video | "Breathtaking Visuals" | "Cinematic Video Production & Storytelling" |
| Web | "Reimagined" | "Your Website, Reimagined" (combine h2+h1) |
| AI | "Transform your business..." | Keep as-is (good) |
| AI Automation | "AI that works the way..." | Keep as-is (good) |
| Case Study | "Client Case Studies" | Keep as-is (good) |
| Home Services section | Various | Ensure each service has descriptive h3 |

### 4.3 Content Text Optimization

#### Key Principles
1. **First 160 characters matter** — Google uses them as the default snippet
2. **Use natural language** — Write for humans, not keyword-stuffing
3. **Include location** — "Atlanta-based" helps local SEO
4. **Use specific numbers** — "60% bounce rate reduction" is more compelling than "significant improvement"

#### Recommended Text Updates

**Sound Page — Hero/CTA Section:**
```
Current: "Demo snippets are free. No Strings. No Proof."
Better:  "Free demo snippets — no strings attached. Professional mixing, mastering,
          and sound engineering from our Atlanta studio."
```

**Video Production — Subtitle:**
```
Current: "We capture life in motion. Experience cinematic video production that
          elevates your brand and tells compelling stories."
Recommendation: Good as-is. Consider adding "Atlanta-based" or "Georgia-based" for local SEO.
```

**AI Automation — Stats Section:**
```
Current stats are excellent for SEO ("80% reduction", "3x more", "$50K+ saved", "45% increase").
Recommendation: Ensure these are wrapped in semantically appropriate tags and visible to crawlers
(not hidden behind animations that don't render server-side).
```

### 4.4 Semantic HTML Improvements

Replace generic `<div>` containers with semantic elements where appropriate:

```tsx
// Before
<div className="services-section">
  <div className="service-card">...</div>
</div>

// After
<section aria-labelledby="services-heading">
  <h2 id="services-heading">Our Services</h2>
  <article className="service-card">...</article>
</section>
```

Priority areas:
- Services section on home page → `<section>` with `aria-labelledby`
- Team section → `<section>` with heading
- FAQ sections → Use `<details>` / `<summary>` or proper ARIA accordion pattern
- Footer → Already uses `<footer>` (good)

---

## 5. Phase 7: Structured Data (JSON-LD)

### 5.1 Organization Schema — `app/layout.tsx`

Add to the root layout (appears on every page):

```tsx
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Range of View Studios",
  alternateName: "ROV Studios",
  url: "https://rovstudios.com",
  logo: "https://rovstudios.com/rov-logo.webp",
  description:
    "Creative production agency specializing in sound engineering, web development, video production, and AI automation.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Atlanta",
    addressRegion: "GA",
    addressCountry: "US",
  },
  sameAs: [
    "https://www.instagram.com/rangeofviewstudios/",
    "https://www.linkedin.com/company/range-of-view-studios/",
    "https://discord.gg/GfzXdmu",
    "https://www.reddit.com/user/rangeofviewstudios/",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    email: "rangeofview@rovstudios.com",
    contactType: "customer service",
    url: "https://calendly.com/rangeofviewmusic/30min",
  },
};

// Add inside <body> in layout.tsx:
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
/>
```

### 5.2 Service Schema — Each Service Page

```tsx
// Example for Sound page
const soundServiceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Sound Engineering & Music Production",
  description:
    "Professional sound engineering, mixing, and mastering services. From demo to final master.",
  provider: {
    "@type": "Organization",
    name: "Range of View Studios",
    url: "https://rovstudios.com",
  },
  serviceType: "Sound Engineering",
  areaServed: {
    "@type": "Place",
    name: "Atlanta, Georgia",
  },
  url: "https://rovstudios.com/sound",
  image: "https://rovstudios.com/og/og-sound.jpg",
  offers: {
    "@type": "Offer",
    description: "Free demo snippets available",
    price: "0",
    priceCurrency: "USD",
  },
};
```

Similar schemas for:
- Web Development service
- Video Production service
- AI Automation service

### 5.3 Case Study / CreativeWork Schema

```tsx
// For The Bando case study
const bandoCaseStudySchema = {
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  name: "The Bando Website Redesign",
  description:
    "Website redesign for The Bando, a Black history museum and fried chicken restaurant in Atlanta. Achieved 60% bounce rate reduction.",
  creator: {
    "@type": "Organization",
    name: "Range of View Studios",
  },
  dateCreated: "2025-01-01",
  url: "https://rovstudios.com/casestudy/bando",
  image: "https://rovstudios.com/og/og-bando.jpg",
  about: {
    "@type": "WebSite",
    name: "The Bando",
  },
};
```

### 5.4 BreadcrumbList Schema

Add breadcrumbs for nested pages (case studies, services):

```tsx
const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://rovstudios.com",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Case Studies",
      item: "https://rovstudios.com/casestudy",
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "The Bando",
      item: "https://rovstudios.com/casestudy/bando",
    },
  ],
};
```

### 5.5 FAQ Schema — FAQ Sections

For pages with FAQ sections (Sound, Web, AI), add FAQ schema:

```tsx
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How much does sound engineering cost?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We offer free demo snippets with no strings attached. Contact us for full project pricing.",
      },
    },
    // ... more Q&A pairs
  ],
};
```

> **Impact:** FAQ schema can generate expandable FAQ rich results directly in Google search.

---

## 6. Phase 8: Sitemap & Technical SEO

### 6.1 Update Sitemap — `app/sitemap.ts`

Add missing routes:

```tsx
import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://rovstudios.com";

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${baseUrl}/sound`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/video-production`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/web`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/ai`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/ai-automation`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/casestudy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/casestudy/bando`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/casestudy/ikna`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/ctrla`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];
}
```

### 6.2 Add Video Sitemap (Optional, High Impact)

Create `app/video-sitemap.xml/route.ts`:

```tsx
export async function GET() {
  const videos = [
    {
      loc: "https://rovstudios.com/video-production",
      videoTitle: "Atlanta Skyline Cinematic Shot",
      description: "Cinematic aerial footage of the Atlanta skyline by ROV Studios",
      contentUrl: "https://rovstudios.com/videoprod/Atlskylineweb.mp4",
      thumbnailUrl: "https://rovstudios.com/videoprod/atlskyline-thumb.jpg",
    },
    // ... more videos
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
  ${videos
    .map(
      (v) => `
  <url>
    <loc>${v.loc}</loc>
    <video:video>
      <video:thumbnail_loc>${v.thumbnailUrl}</video:thumbnail_loc>
      <video:title>${v.videoTitle}</video:title>
      <video:description>${v.description}</video:description>
      <video:content_loc>${v.contentUrl}</video:content_loc>
    </video:video>
  </url>`
    )
    .join("")}
</urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
```

Then update `robots.ts` to reference it:
```tsx
sitemap: ["https://rovstudios.com/sitemap.xml", "https://rovstudios.com/video-sitemap.xml"],
```

### 6.3 Canonical Tags

Already handled by `alternates.canonical` in each page's metadata (Phase 2). ✅

### 6.4 Handle Duplicate Case Study Page

There are two routes for the same case study:
- `/casestudy/ikna`
- `/casestudy/aysegul-ikna`

**Fix:** Add a redirect in `next.config.js`:

```js
{
  source: '/casestudy/aysegul-ikna',
  destination: '/casestudy/ikna',
  permanent: true,
},
```

---

## 7. Phase 9: Performance & Image Optimization

### 7.1 Enable Next.js Image Optimization

In `next.config.js`, change:

```js
// Before
images: { unoptimized: true },

// After
images: {
  formats: ["image/avif", "image/webp"],
  deviceSizes: [640, 750, 828, 1080, 1200, 1920],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
},
```

> **Impact:** Automatically serves images in WebP/AVIF format, generates responsive sizes, and lazy-loads below-the-fold images. This directly improves Core Web Vitals (LCP, CLS) which are Google ranking factors.

> **Caveat:** This requires a Node.js server (not static export). Since you removed `output: 'export'`, this should work. Test thoroughly after enabling.

### 7.2 Compress Oversized Images

Several images are extremely large and should be compressed:

| File | Current Size | Target Size | Action |
|------|-------------|-------------|--------|
| `catchthelight.png` | 40MB | Use `.webp` version (197KB) | Delete PNG, use webp |
| `samxbasuvid.png` | 22MB | < 500KB | Convert to webp |
| `basutm.png` | 6.1MB | < 300KB | Convert to webp |
| `suchettm.png` | 6.6MB | < 300KB | Convert to webp |
| `kavyatm.png` | 5.5MB | < 300KB | Convert to webp |
| `jinwontm.png` | 5MB | < 300KB | Convert to webp |
| `dakshatm.png` | 3.9MB | < 300KB | Convert to webp |
| `vaishnavitm.png` | 3.9MB | < 300KB | Convert to webp |
| `webfolder3.png` | 4.1MB | < 300KB | Convert to webp |
| `webfolder2.png` | 3MB | < 300KB | Convert to webp |
| `backgroundimage.png` | 3.2MB | < 500KB | Convert to webp |
| `atlskylinefooter.png` | 4.5MB | < 500KB | Convert to webp |
| `ctltrackprint.jpg` | 12.3MB | Use `.webp` version (884KB) | Delete JPG, use webp |

Batch convert with:
```bash
# Install cwebp if not available
brew install webp

# Convert all oversized PNGs in teammembers/
for f in public/teammembers/*.png; do
  cwebp -q 80 "$f" -o "${f%.png}.webp"
done
```

### 7.3 Add `loading="lazy"` and `fetchPriority`

- Above-the-fold hero images: `priority={true}` (Next.js Image) or `fetchPriority="high"`
- Below-the-fold images: `loading="lazy"` (default for Next.js Image)

---

## 8. Phase 10: Web Manifest & PWA

### Fix Empty Manifest — `public/site.webmanifest`

```json
{
  "name": "Range of View Studios",
  "short_name": "ROV Studios",
  "description": "Creative production agency specializing in sound, web, video, and AI.",
  "start_url": "/",
  "scope": "/",
  "icons": [
    {
      "src": "/android-chrome-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/android-chrome-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  "theme_color": "#110808",
  "background_color": "#110808",
  "display": "standalone"
}
```

---

## 9. OG Image Creation Guide

### Tools
- **Canva** — Free template at 1200x630px, export as JPG
- **Figma** — Create a frame at 1200x630px
- **Next.js ImageResponse** — Auto-generate (see Phase 3 above)

### Template Layout
```
┌──────────────────────────────────────────┐
│                                          │
│   [ROV Logo - top left corner]           │
│                                          │
│        PAGE TITLE                        │
│        IN BOLD TEXT                       │
│                                          │
│   Subtitle or tagline in lighter text    │
│                                          │
│   rovstudios.com                         │
│                                          │
└──────────────────────────────────────────┘
Background: Dark gradient matching site (#110808 → #1a1a2e)
```

### Per-Page Suggestions

| Page | Background Idea | Text Overlay |
|------|----------------|--------------|
| Home | Collage of services (music, web, video, AI) | "Creative Production Agency" |
| Sound | Studio mic/console photo | "Sound Engineering" |
| Web | Screenshot of best web project | "Web Development" |
| Video | Frame from best video | "Video Production" |
| AI | Tech/automation visual | "AI Automation" |
| Case Studies | Grid of project thumbnails | "Client Case Studies" |
| Bando | The Bando hero screenshot | "The Bando - Case Study" |
| Ikna | Aysegul Ikna hero screenshot | "Aysegul Ikna - Case Study" |
| CTRL A | CTRL A sticker collage | "CTRL A - Coming Soon" |

---

## 10. Implementation Checklist

### Phase 3: OG Images — COMPLETE
- [x] Design and export 10 OG images (1200x630px) into `public/og/`
- [x] All pages reference dedicated OG images
- [x] Twitter card metadata added to all pages

### Phase 4: Image SEO — COMPLETE
- [x] Fix empty alt text in `TeamSection.tsx`
- [x] Update generic alt text across all components
- [x] Add `role="img"` and `aria-label` to meaningful background images
- [x] Replace `<img>` with `<Image>` where applicable (Gallery, MixesSection, DesignBreak)

### Phase 5: Video SEO — COMPLETE
- [x] Create `VideoSchema` component (`components/VideoSchema.tsx`)
- [x] Add video structured data to video production page (4 schemas) and sound page (2 schemas)
- [x] Add video thumbnail `poster` attributes to all video elements using `public/thumbnails/` webp images
- [x] Add `aria-label`, `title` to all 15 `<video>` elements across 11 components
- [x] Add `aria-hidden="true"` to decorative footer ring videos
- [x] Add `playsInline` to ShowcaseSection video

### Phase 6: Text & Headings — COMPLETE
- [x] Add hidden h1 to Home page (sr-only)
- [x] Fix Sound page — add h1 to SoundHero, demote AgencyIntro h1 to h2
- [x] Fix Web page — combine split h2+h1 into single h1
- [x] Fix CTRL A page — merge duplicate h1 into one
- [x] Fix Aerial page — merge duplicate h1 into one
- [x] Verify AI, Video Production h1 headings (already correct)

### Phase 7: Structured Data — COMPLETE
- [x] Add Organization JSON-LD schema to root layout
- [x] Add Service schema to each service page (5 pages)
- [x] Add CreativeWork schema to case study pages (3 pages)
- [x] Add BreadcrumbList schema to nested pages (8 pages)
- [x] Add FAQPage schema to pages with FAQ sections (4 pages)

### Phase 8: Sitemap & Technical — COMPLETE
- [x] Add missing case study routes to sitemap (already present: bando, ikna, dkm, ctrla)
- [x] Add DKM Corp case study to sitemap (already present)
- [x] Add duplicate page redirect (`aysegul-ikna` → `ikna`) in `next.config.js`
- [x] Create video sitemap (`app/video-sitemap.xml/route.ts`) with 6 videos

### Phase 9: Performance — COMPLETE
- [x] Enable Next.js image optimization
- [x] Compress oversized images (convert to webp)
- [x] Add `priority` to above-the-fold hero images
- [x] Test all pages after enabling optimization

### Phase 10: Web Manifest & Verification — COMPLETE
- [x] Fix `site.webmanifest` with proper name/description
- [x] Test OG previews — verified all 11 pages have correct og:title, og:description, og:image, og:url, twitter:card tags
- [x] Validate structured data — JSON-LD schemas confirmed in code for all pages (Organization, Service, FAQ, Breadcrumb, CreativeWork, Video)
- [x] Check sitemap — all 11 pages present, video sitemap ready (will go live on next deploy)
- [x] Verify robots.txt — correct allow/disallow rules, sitemap references in code
- [ ] Run Lighthouse audit for SEO score (manual — run in Chrome DevTools after deploy)
- [ ] Test social sharing on Twitter, LinkedIn, Discord (manual — share URLs after deploy)
- [ ] Check Google Search Console for indexing issues (manual — requires account access)

---

*Generated for Range of View Studios — March 2026*
