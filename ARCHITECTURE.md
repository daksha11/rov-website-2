# ROV Website - Architecture Diagram

## How Data Flows Through the App

```
┌─────────────────────────────────────────────────────────────────────┐
│                          USER'S BROWSER                              │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │                    React Components                             │ │
│  │  - Button clicks, form input, scroll events                    │ │
│  │  - Managed by Zustand (global state)                          │ │
│  │  - Animated with GSAP, Lenis, Framer Motion                  │ │
│  └────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
                              ↑    ↓
                          (HTML, CSS, JS)
┌─────────────────────────────────────────────────────────────────────┐
│                     NEXT.JS SERVER (Build Time)                      │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ app/[route]/page.tsx (Server Components)                     │  │
│  │ - Fetch from database                                         │  │
│  │ - Load markdown content                                       │  │
│  │ - Generate metadata (SEO)                                     │  │
│  │ - Create JSON-LD schemas                                      │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                              ↓                                        │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ lib/blog.ts, lib/types.ts                                    │  │
│  │ - Helper functions                                            │  │
│  │ - Type definitions                                            │  │
│  │ - Data transformation                                         │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                              ↓                                        │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ External Data Sources                                         │  │
│  │ - Supabase (database)                                         │  │
│  │ - Markdown files (content)                                    │  │
│  │ - Static JSON (data/)                                         │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│                  RENDERS TO HTML STRING                              │
│  - Optimized and minified                                            │
│  - Includes metadata tags (<meta>, <title>)                          │
│  - Includes JSON-LD scripts                                          │
│  - Sent to browser as static HTML                                    │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Folder Structure Tree

```
rov-website-2/
│
├── app/                          ← ROUTES (folder = URL)
│   ├── page.tsx                  ← / (homepage)
│   ├── layout.tsx                ← Root wrapper (Header, Footer, global stuff)
│   ├── globals.css               ← Global styles + all font declarations
│   │
│   ├── blog/
│   │   ├── page.tsx              ← /blog (list of all posts)
│   │   ├── [slug]/page.tsx       ← /blog/:slug (individual post)
│   │   └── restaurant-atlanta/
│   │       └── page.tsx          ← /blog/restaurant-atlanta
│   │
│   ├── casestudy/                ← /casestudy
│   ├── web/, sound/, video-production/, ai-automation/  ← Service pages
│   ├── ctrla/                    ← /ctrla (CTRL-A Magazine)
│   ├── resources/                ← /resources (guides & toolkits)
│   ├── admin/                    ← /admin (protected with auth)
│   │
│   └── api/
│       ├── chat/proxy/route.ts   ← /api/chat/proxy (backend endpoint)
│       └── ...
│
├── components/                   ← REUSABLE UI PIECES
│   ├── Footer.tsx
│   ├── Header.tsx
│   ├── Navigation.tsx
│   ├── *Schema.tsx               ← SEO schema components
│   └── [50+ other components]
│
├── lib/                          ← UTILITIES & HELPERS
│   ├── types.ts                  ← Type definitions (BlogPost, etc.)
│   ├── utils.ts                  ← Helper functions
│   ├── blog.ts                   ← Blog-specific functions
│   ├── registry.tsx              ← Styled Components setup
│   └── brand-kit/                ← Design system data
│
├── hooks/                        ← CUSTOM REACT HOOKS
│   └── brand-kit/
│
├── data/                         ← STATIC DATA
│   ├── testimonials.ts
│   ├── faq.ts
│   └── approach-steps.ts
│
├── public/                       ← STATIC FILES (images, fonts)
│   ├── og/                       ← Open Graph images
│   ├── ctrla/                    ← CTRL-A assets
│   ├── font/                     ← Custom fonts
│   └── images/
│
├── utils/                        ← SHARED UTILITIES
│   └── supabase/
│
├── scripts/                      ← BUILD/AUTOMATION SCRIPTS
│
├── package.json                  ← Dependencies + scripts
├── tsconfig.json                 ← TypeScript config
├── next.config.js                ← Next.js build config
├── tailwind.config.ts            ← Tailwind CSS config
├── middleware.ts                 ← Auth middleware
└── .env.local                    ← Environment secrets (NOT in git)
```

---

## Component Hierarchy (Example: Blog Page)

```
app/layout.tsx (Root Layout)
│
└── app/blog/layout.tsx (Blog Layout)
    │
    └── app/blog/[slug]/page.tsx (Blog Post Page)
        │
        └── components/
            ├── Header.tsx
            ├── BlogPostingSchema.tsx (SEO)
            ├── BlogContent.tsx
            │   ├── Accordion.tsx
            │   ├── Gallery.tsx
            │   └── CallToAction.tsx
            └── Footer.tsx
```

---

## Data Flow: Blog Post Example

```
1. USER VISITS: /blog/restaurant-atlanta

2. NEXT.JS ROUTER: Matches /app/blog/[slug]/page.tsx
   params.slug = "restaurant-atlanta"

3. SERVER COMPONENT:
   - Calls getBlogPost("restaurant-atlanta")
   - Queries database or reads markdown file
   
4. REMARK/REHYPE PIPELINE:
   Markdown → HTML
   (Sanitized, safe to render)

5. METADATA GENERATION:
   Title, description, OG image, canonical URL
   (Used by Google, Facebook, Twitter)

6. SCHEMA GENERATION:
   BlogPosting JSON-LD script
   (Tells AI crawlers: "This is a blog post")

7. COMPONENT TREE RENDERS:
   <BlogLayout>
     <BlogPostingSchema data={post} />
     <BlogContent post={post} />
     <Accordion items={post.faqs} />
   </BlogLayout>

8. NEXT.JS CONVERTS TO HTML:
   React → HTML string

9. BROWSER RECEIVES:
   <html>
     <head>
       <title>Restaurant Atlanta | Range of View Studios</title>
       <meta name="description" content="...">
       <meta property="og:image" content="/og/restaurant-atlanta.jpg">
       <script type="application/ld+json">{...}</script>
     </head>
     <body>
       <!-- Full HTML here -->
       <h1>Restaurant Atlanta</h1>
       ...
     </body>
   </html>

10. BROWSER HYDRATES:
    JavaScript takes over
    → Events work (clicks, scrolls)
    → Animations start (GSAP, Lenis)
    → Forms become interactive
```

---

## Technology Stack Map

```
┌──────────────────────────────────────────────────────────┐
│                    FRONTEND (Browser)                     │
├──────────────────────────────────────────────────────────┤
│ React 18 + TypeScript                                     │
│   ├── Pages/Routes: Next.js 13 (App Router)             │
│   ├── State: Zustand                                     │
│   ├── Styling: Tailwind CSS + Styled Components         │
│   ├── Animation: GSAP + Lenis + Framer Motion           │
│   ├── UI Components: Radix UI + Custom                  │
│   ├── 3D: Three.js (minimal use)                        │
│   └── Icons: Lucide React                               │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│                    BACKEND (Server)                       │
├──────────────────────────────────────────────────────────┤
│ Next.js Server Components                                │
│   ├── Routing: File-based routing                        │
│   ├── API Routes: /app/api/                             │
│   ├── Middleware: Auth checks                           │
│   └── Data Processing: Remark/Rehype                    │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│                 EXTERNAL SERVICES                         │
├──────────────────────────────────────────────────────────┤
│ Database: Supabase (Auth, Storage, Queries)             │
│ Analytics: Microsoft Clarity                             │
│ Build Tools: Webpack (via Next.js)                       │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│              DEVELOPER TOOLS (npm scripts)               │
├──────────────────────────────────────────────────────────┤
│ npm run dev         → Start local dev server             │
│ npm run build       → Create optimized production build  │
│ npm start           → Run production server              │
│ npm run lint        → Check code style                   │
│ npm run analyze     → Bundle size analysis               │
└──────────────────────────────────────────────────────────┘
```

---

## Request/Response Lifecycle

```
1. BROWSER REQUESTS PAGE
   GET /blog/restaurant-atlanta

2. NEXT.JS SERVER
   ├── Matches route to app/blog/[slug]/page.tsx
   ├── Runs generateMetadata() function
   │   └── Fetches blog post data
   ├── Runs default export function
   │   ├── Fetches blog post content
   │   ├── Processes markdown to HTML
   │   └── Renders React component tree
   └── Converts to HTML string

3. HTML RESPONSE
   200 OK
   Content-Type: text/html
   
   <html>
     <head>
       <title>Restaurant Atlanta...</title>
       <meta name="description" content="...">
       <meta property="og:image" content="...">
       <script type="application/ld+json">...</script>
     </head>
     <body>
       <header>...</header>
       <main>...</main>
       <footer>...</footer>
       <script src="/_next/static/chunks/main.js"></script>
     </body>
   </html>

4. BROWSER RENDERS
   ├── Parse HTML
   ├── Download CSS + JavaScript
   ├── Display page
   └── Hydrate with React (attach event listeners)

5. BROWSER RUNS CLIENT JAVASCRIPT
   ├── React components become interactive
   ├── Event listeners attached
   ├── Animations start (GSAP, Lenis, etc.)
   └── Smooth scroll enabled
```

---

## SEO & Crawlers

```
GOOGLE BOT VISITS: /blog/restaurant-atlanta

Google sees:
├── HTTP 200 (page exists)
├── Title: "Restaurant Atlanta | Range of View Studios"
├── Meta Description: "How we redesigned X restaurant..."
├── <meta property="og:image"> (social preview image)
├── <link rel="canonical"> (this is the main version)
├── <script type="application/ld+json">
│   {
│     "@type": "BlogPosting",
│     "headline": "...",
│     "datePublished": "2024-01-01",
│     "author": { "@type": "Person", "name": "..." },
│     "articleBody": "...",
│     "image": "..."
│   }
└── Server-rendered content (no JavaScript needed)

Google ranks based on:
✓ Keyword relevance
✓ Content quality
✓ Page speed
✓ Mobile friendliness
✓ Structured data (schema)
✓ Backlinks
```

---

## Performance Optimizations

```
Next.js Automatic:
├── Code splitting (load only needed JS)
├── Lazy loading (images load on demand)
├── Image optimization (WebP, responsive)
├── CSS minification
├── JavaScript minification
├── Tree shaking (remove unused code)
└── Caching headers

Manual Optimizations:
├── GSAP ScrollTrigger (animate on scroll)
├── Lenis (smooth scroll, better perf)
├── Lazy component loading (dynamic imports)
├── Reusable components (less code duplication)
└── Tailwind JIT (only include used styles)

Result:
→ Fast initial page load
→ Smooth animations
→ Good Core Web Vitals
→ Better SEO rankings
```

---

## Deployment Pipeline

```
1. LOCAL DEVELOPMENT
   npm run dev
   → Changes visible immediately (hot reload)

2. GIT PUSH
   → Code sent to repository

3. BUILD PROCESS
   npm run build
   → TypeScript compiled to JavaScript
   → React optimized for production
   → CSS minified
   → JavaScript bundled & minified
   → Static pages pre-rendered

4. DEPLOYMENT
   → .next folder (built app) uploaded to server
   → Environment variables set
   → Server started

5. LIVE SITE
   → www.rovstudios.com serves optimized static HTML
   → Users get fast page loads
   → Animations run smooth
   → SEO rankings improve
```

---

## Example: Adding a Feature

```
TASK: Add "dark mode" toggle to header

1. CREATE ZUSTAND STORE (Global State)
   lib/store.ts
   └── useTheme = create(...)

2. CREATE COMPONENT
   components/ThemeToggle.tsx
   ├── 'use client' (interactive)
   ├── import { useTheme } from 'lib/store'
   └── return <button onClick={toggleDarkMode}>

3. UPDATE LAYOUT
   app/layout.tsx
   ├── Add <ThemeToggle /> to header
   └── Apply theme class to <html>

4. ADD STYLES
   app/globals.css
   ├── Define --color-* variables
   ├── html[data-theme="dark"] { --color-bg: #3B2114; }
   └── Use with Tailwind: bg-[--color-bg]

5. TEST LOCALLY
   npm run dev
   → Click toggle → theme changes

6. BUILD & DEPLOY
   npm run build
   → git push
   → Live in production
```

---

## Quick Reference: When to Use What

```
ROUTING
├── Static page (e.g., /about)
│   └── Use: app/about/page.tsx
├── Dynamic page (e.g., /blog/:slug)
│   └── Use: app/blog/[slug]/page.tsx
└── API endpoint (e.g., /api/chat)
    └── Use: app/api/chat/route.ts

STATE MANAGEMENT
├── Global state (dark mode, user prefs)
│   └── Use: Zustand store
└── Local state (form inputs, modals)
    └── Use: useState hook

STYLING
├── Layout & spacing
│   └── Use: Tailwind utilities
├── Complex animations
│   └── Use: Styled Components + CSS
└── Timeline animations
    └── Use: GSAP

ANIMATION
├── Simple fade/slide
│   └── Use: CSS transitions or Framer Motion
├── Complex sequences
│   └── Use: GSAP timeline
└── Scroll triggers
    └── Use: GSAP ScrollTrigger

DATA FETCHING
├── Server component (page load)
│   └── Use: async/await directly
├── Client component (on-demand)
│   └── Use: fetch() in useEffect or API route
└── Real-time data
    └── Use: Supabase listeners
```

---

## Architecture in One Picture

```
┌─────────────────────────────────────────────────────────────┐
│                     EVERYTHING STARTS HERE                   │
│              /app/layout.tsx (Root Layout)                  │
├─────────────────────────────────────────────────────────────┤
│  - Global metadata (title template, fonts, scripts)         │
│  - Header & Footer (wrapped around every page)              │
│  - Providers (Styled Components, Auth, Analytics)           │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│              FOLDER STRUCTURE = URL STRUCTURE               │
│  /app/page.tsx              → /                             │
│  /app/about/page.tsx        → /about                        │
│  /app/blog/[slug]/page.tsx  → /blog/:slug                  │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│     EACH PAGE GENERATES OWN METADATA (SEO + Schema)        │
│              (Google sees these, ranks page)                │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│      COMPONENTS RENDER & COMBINE (React Tree)              │
│  Content from: Database, Markdown, Static Data              │
│  Styled with: Tailwind + Styled Components                  │
│  Animated with: GSAP, Lenis, Framer Motion                │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│         NEXT.JS CONVERTS TO HTML (Server)                  │
│              (Static HTML sent to browser)                  │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│    BROWSER RECEIVES HTML + CSS + JAVASCRIPT                │
│    - JavaScript "hydrates" = attaches event listeners      │
│    - Page becomes interactive                              │
│    - Animations & smooth scroll kick in                    │
└─────────────────────────────────────────────────────────────┘
```

This is the entire architecture! Understanding this picture = understanding the whole codebase.
