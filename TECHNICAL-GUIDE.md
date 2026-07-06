# ROV Website Technical Guide
## A Complete Breakdown for Technical Explainers

---

## 1. THE PROJECT AT A GLANCE

**What is this?**
- Website for Range Of View Studios, a creative tech agency in Atlanta
- **Location:** `/live/rov-website-2/` folder
- **Live domain:** www.rovstudios.com
- **Purpose:** Showcase services, host blog content, case studies, and interactive tools

**Key Pages:**
- `/` — Homepage (main entry point)
- `/about` — Team & studio info
- `/blog` — Blog articles with SEO optimization
- `/casestudy` — Portfolio projects (Bando, DKM, Ikna, etc.)
- `/web`, `/sound`, `/video-production`, `/ai-automation` — Service pages
- `/ctrla` — CTRL-A Magazine (interactive editorial experience)
- `/resources` — Guides, toolkits, playbooks
- `/admin` — Internal dashboard

---

## 2. TECH STACK (AND WHY EACH PIECE MATTERS)

### **Core Framework: Next.js (v13.5.11) + React 18**
- **What it does:** Next.js is a React framework that handles routing, server rendering, and build optimization automatically
- **Why we use it:**
  - **File-based routing** — folder structure = URL structure (no routing config needed)
  - **Server vs Client components** — smart separation of concerns (we'll explain below)
  - **Built-in SEO support** — metadata and structured data generation
  - **Image optimization** — automatic WebP conversion, responsive sizes
  - **API routes** — backend endpoints live in `/app/api/` folder

### **Language: TypeScript**
- **What it does:** JavaScript with type safety
- **Why it matters:** Catches bugs at write-time instead of runtime. You declare what data shape things should be (interfaces/types) and TS yells if you pass the wrong data
- **Example:** `interface BlogPost { title: string; date: Date; }` means you can't accidentally pass `title: 123`

### **Styling: Tailwind CSS + Styled Components**
- **Tailwind** — Utility-first CSS (use pre-built classes like `text-white`, `bg-blue-500`, `p-4`)
- **Styled Components** — JavaScript-in-CSS (write CSS inside React components)
- **How they coexist:** Use Tailwind for simple layouts, Styled Components for complex animations

### **Animation Libraries**
1. **GSAP (GreenSock Animation Platform)** — Industry standard for complex animations
   - Handles timeline-based animations, morphs, and scroll triggers
   - Used for: logo animations, banner reveals, scroll-based effects
   
2. **Lenis** — Smooth scrolling library
   - Makes scroll feel buttery instead of janky
   
3. **Framer Motion** — React-first animation library
   - Simpler than GSAP, good for component-level motion

4. **Three.js** — 3D graphics library
   - Powers 3D visualizations (though currently minimal use)

### **State Management: Zustand**
- **What it does:** Global state storage (shared data across all components)
- **Why Zustand:** Lightweight, hook-based, minimal boilerplate
- **Example:** Store user preferences, UI toggles, form data without prop drilling

### **Database & Auth: Supabase**
- **What it does:** Backend-as-a-service (database, authentication, file storage)
- **Current use:** Admin login, portal features
- **Middleware integration:** `/middleware.ts` checks auth on protected routes

### **UI Components: Radix UI + Custom Components**
- **Radix UI** — Unstyled, accessible component primitives
- **What we build with it:** Dialogs, labels, switches, accordions
- **Then style with:** Tailwind or Styled Components on top

### **Data Processing: Remark/Rehype**
- **What:** Markdown processing pipeline
- **Use:** Convert blog markdown files to HTML
- **Plugins:** `rehype-sanitize` (prevent XSS), `rehype-raw` (allow custom HTML in markdown)

### **Other Key Libraries**
- **jszip** — Bundle files into ZIP downloads
- **@dnd-kit** — Drag-and-drop functionality
- **react-colorful** — Color picker UI
- **clsx** — Conditional CSS class builder (cleaner than string concatenation)
- **zod** — Data validation (check API inputs match expected shape)

---

## 3. FOLDER STRUCTURE & WHAT GOES WHERE

```
rov-website-2/
├── app/                           # Main app (Next.js App Router)
│   ├── page.tsx                   # Homepage (/)
│   ├── layout.tsx                 # Root layout (wraps all pages)
│   ├── globals.css                # Global styles + font declarations
│   ├── [route]/page.tsx           # Page files = URL routes
│   ├── [route]/layout.tsx         # Shared layout for route group
│   ├── api/                       # Backend API routes (localhost:3000/api/*)
│   ├── about/                     # /about page
│   ├── blog/                      # /blog pages
│   │   ├── page.tsx               # Blog index (/blog)
│   │   ├── [slug]/page.tsx        # Dynamic blog post (/blog/:slug)
│   │   └── restaurant-atlanta/    # Specific blog post
│   ├── casestudy/                 # Portfolio projects
│   ├── web/, sound/, etc.         # Service pages
│   ├── ctrla/                     # CTRL-A Magazine (complex interactive experience)
│   ├── resources/                 # Guides & toolkits
│   ├── admin/                     # Admin dashboard (auth-protected)
│   └── portal/                    # Internal portal
│
├── components/                    # Reusable React components
│   ├── Footer.tsx
│   ├── Header.tsx
│   ├── Navigation.tsx
│   ├── ...Schema.tsx              # SEO schema components
│   ├── ChatWidget.tsx             # Chat interface (hidden for now)
│   └── [other components]
│
├── lib/                           # Utilities & helpers
│   ├── types.ts                   # TypeScript interfaces (BlogPost, ChatbotMessage, etc.)
│   ├── utils.ts                   # Helper functions
│   ├── registry.tsx               # Styled Components registry (SSR setup)
│   ├── blog.ts                    # Blog data loading functions
│   └── brand-kit/                 # Brand system data
│
├── hooks/                         # Custom React hooks
│   └── brand-kit/                 # Brand kit specific hooks
│
├── data/                          # Static data files
│   ├── testimonials.ts            # Quote data
│   ├── faq.ts                     # FAQ content
│   └── approach-steps.ts
│
├── public/                        # Static files (images, fonts, SVGs)
│   ├── og/                        # Open Graph images (for social sharing)
│   ├── ctrla/                     # CTRL-A assets
│   ├── font/                      # Custom fonts
│   └── images/
│
├── content/                       # Content files (markdown, etc.)
│
├── scripts/                       # Build/automation scripts
│
├── utils/                         # Shared utilities
│   └── supabase/                  # Database client setup
│
├── package.json                   # Dependencies list
├── tsconfig.json                  # TypeScript config
├── next.config.js                 # Next.js build config
├── tailwind.config.ts             # Tailwind CSS settings
├── middleware.ts                  # Request middleware (auth checks)
└── .env.local                     # Environment variables (NOT in git)
```

---

## 4. HOW THE APP STRUCTURE WORKS

### **Next.js App Router Basics**

```
Folder Structure          →    URL Path
/app/page.tsx            →    /
/app/about/page.tsx      →    /about
/app/blog/page.tsx       →    /blog
/app/blog/[slug]/page.tsx →   /blog/:slug (dynamic)
```

**Key Rule:** Every `page.tsx` file becomes a route.

### **Layouts (Shared Wrappers)**

```typescript
// app/layout.tsx — wraps EVERY page
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}

// app/blog/layout.tsx — wraps only /blog pages
export default function BlogLayout({ children }) {
  return (
    <section className="blog-container">
      {children}
    </section>
  )
}
```

### **Server vs Client Components**

This is CRITICAL to understand:

```typescript
// Server Component (default in Next.js 13+)
// - Runs on server only
// - Can access database directly
// - CAN'T use hooks (useState, useEffect)
// - CAN use async/await

async function BlogList() {
  const posts = await fetchBlogPosts(); // ✓ OK
  return <ul>{posts.map(p => <li>{p.title}</li>)}</ul>
}

// Client Component
// - Runs in browser
// - Can use hooks
// - CAN'T access database directly
// - Must fetch data via API

'use client'  // ← This line tells Next.js: "Run this in browser"
import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)  // ✓ OK
  return <button onClick={() => setCount(count + 1)}>{count}</button>
}
```

**Mental model:** Default to server components (faster, better SEO), only use `'use client'` when you need interactivity.

---

## 5. KEY LIBRARIES & WHAT THEY ACTUALLY DO

### **GSAP (Animation Engine)**

```typescript
// Simple fade-in animation
gsap.to('.element', {
  duration: 1,
  opacity: 1,
  y: 0,
  ease: 'power3.out'
})

// Timeline (sequence of animations)
const tl = gsap.timeline()
tl.to('.box1', { x: 100 })
tl.to('.box2', { y: 50 }, '<') // Sync with previous
```

**When to use:** Complex, multi-step animations; scroll triggers; timeline-based motion

### **SVG Animations**

SVGs (Scalable Vector Graphics) are used throughout the site:
- **Logo morphs** — animated logo transformations
- **Icons** — animated SVG icons
- **Illustrations** — custom animated graphics

```typescript
// SVG path animation
<svg>
  <path
    d="M 10 10 L 100 100"
    strokeDasharray={length}
    strokeDashoffset={length}
    style={{
      animation: `draw 2s forwards`
    }}
  />
</svg>
```

### **Tailwind CSS (Styling)**

```typescript
// Instead of writing CSS:
// .button { padding: 10px 20px; background: #EA9A61; }

// Use Tailwind classes:
<button className="px-5 py-2 bg-ember text-white rounded">Click me</button>

// Responsive design (mobile-first):
<div className="text-sm md:text-lg lg:text-2xl">
  Responsive text
</div>
```

**Key concept:** Tailwind is "utility-first" — small, single-purpose classes you combine.

### **Styled Components (CSS-in-JS)**

```typescript
import styled from 'styled-components'

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`

export default function MyComponent() {
  return <ButtonContainer>...</ButtonContainer>
}
```

**When to use:** Complex, dynamic styling; theme switching; nested styles

---

## 6. DATA FLOW & HOW PAGES GET THEIR CONTENT

### **Static Data (Fast, No Database)**
```
data/ folder → imported in component → rendered
Example: testimonials.ts, faq.ts
```

### **Dynamic Content from Markdown**
```
1. Markdown file (e.g., blog post)
2. Remark processes it → HTML
3. Component renders HTML
```

### **Database Content (Supabase)**
```
Server Component
  ↓
fetch from Supabase
  ↓
render to HTML
  ↓
send to browser
```

### **Metadata (SEO Critical)**

```typescript
// app/blog/[slug]/page.tsx
export async function generateMetadata({ params }) {
  const post = await getBlogPost(params.slug)
  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      images: [{ url: post.coverImage }],
    }
  }
}
```

**Why it matters:** Google crawlers read `<meta>` tags to understand what your page is about (helps SEO ranking)

---

## 7. COMPONENT ARCHITECTURE

### **Component Patterns**

**Simple Presentational Component:**
```typescript
// components/Card.tsx
export function Card({ title, children }) {
  return (
    <div className="border rounded p-4">
      <h2>{title}</h2>
      {children}
    </div>
  )
}
```

**Interactive Component:**
```typescript
'use client'
import { useState } from 'react'

export function Accordion({ items }) {
  const [open, setOpen] = useState(null)
  return items.map(item => (
    <div key={item.id}>
      <button onClick={() => setOpen(open === item.id ? null : item.id)}>
        {item.title}
      </button>
      {open === item.id && <div>{item.content}</div>}
    </div>
  ))
}
```

**Container vs Presentational:**
- **Container** — gets data, manages logic, passes to presentational
- **Presentational** — just displays what it's given (dumb, reusable)

### **Custom Hooks**

```typescript
// hooks/useScroll.ts
'use client'
import { useEffect, useState } from 'react'

export function useScroll() {
  const [scrollY, setScrollY] = useState(0)
  
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  return scrollY
}

// Usage:
const scrollY = useScroll()
```

---

## 8. STYLING SYSTEM

### **Design Tokens (Brand Colors)**

```css
/* app/globals.css */
:root {
  --color-deep:   #3B2114;    /* Deep brown */
  --color-dark:   #603E25;    /* Dark brown */
  --color-mid:    #957E5E;    /* Warm tan */
  --color-light:  #D0BEA5;    /* Sand */
  --color-cream:  #FFF4E3;    /* Cream (primary light) */
  --color-accent: #90422C;    /* Ember (accent) */
}
```

### **Tailwind Config Override**

```typescript
// tailwind.config.ts
module.exports = {
  theme: {
    extend: {
      colors: {
        'ember': '#90422C',
        'deep': '#3B2114',
      },
      fontFamily: {
        'display': ['Norwige', 'serif'],
        'body': ['Roboto', 'sans-serif'],
      }
    }
  }
}
```

### **CSS Architecture**

```
globals.css (base)
  ↓
Tailwind utilities
  ↓
Styled Components (per-component)
  ↓
Inline styles (last resort)
```

---

## 9. ROUTING & URL STRUCTURE

### **Dynamic Routes with Brackets**

```typescript
// app/blog/[slug]/page.tsx
export default function BlogPost({ params }) {
  // params.slug = "restaurant-atlanta" when URL is /blog/restaurant-atlanta
  return <h1>Post: {params.slug}</h1>
}

// This ONE file handles:
// /blog/restaurant-atlanta
// /blog/dkm-corp-brand
// /blog/anything-here
```

### **SEO-Friendly URLs**

- `/blog/restaurant-atlanta` (✓ good — keyword-rich, readable)
- `/blog/post-123` (✗ bad — not SEO friendly)

The site uses slug-based URLs for all content.

### **Redirects & Rewrites** (in `next.config.js`)

```javascript
async redirects() {
  return [
    { source: '/ai', destination: '/ai-automation', permanent: true },
    { source: '/services/web', destination: '/web', permanent: true },
  ]
}
```

**permanent: true** → tells search engines this is a permanent redirect (updates rankings)

---

## 10. SEO & METADATA

### **Three SEO Layers**

**1. Page Metadata:**
```typescript
export const metadata = {
  title: 'Blog Title | Range of View Studios',
  description: 'What the post is about...',
  alternates: { canonical: 'https://www.rovstudios.com/blog/slug' },
  openGraph: { /* Twitter/Facebook sharing */ }
}
```

**2. Structured Data (JSON-LD):**
```typescript
// components/BlogPostingSchema.tsx
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "Post Title",
  "author": { "@type": "Person", "name": "Author Name" },
  "datePublished": "2024-01-01",
  "articleBody": "Content here..."
}
</script>
```

Tells Google/AI crawlers: "This is a blog post, written by X, published on Y, about Z"

**3. SEO-Friendly HTML:**
```typescript
// Server-rendered content in sr-only for crawlers
<section className="sr-only" aria-label="About Us">
  <h1>About Range Of View Studios</h1>
  <p>Full company description...</p>
</section>

// Visual content
<section>
  {/* The pretty design */}
</section>
```

### **Blog Data Interface** (in `/lib/types.ts`)

```typescript
interface BlogPost {
  slug: string;                    // URL segment
  title: string;                   // Page title
  seoTitle?: string;              // SEO/SERP title (shorter)
  description: string;             // Meta description
  author: string;
  date: string;
  category: string;
  tags: string[];
  featured: boolean;
  readingTime: number;
  atlantaAngle: string;           // Geo angle for SEO
  published: boolean;
  content: string;                // Markdown
  htmlContent?: string;           // Processed HTML
  faqs?: { question: string; answer: string }[];
}
```

---

## 11. STATE MANAGEMENT (Zustand)

```typescript
// lib/store.ts
import { create } from 'zustand'

export const useAppStore = create((set) => ({
  isDarkMode: false,
  toggleDarkMode: () => set(state => ({ isDarkMode: !state.isDarkMode })),
}))

// Usage in component:
'use client'
export function ThemeToggle() {
  const { isDarkMode, toggleDarkMode } = useAppStore()
  return <button onClick={toggleDarkMode}>Toggle</button>
}
```

---

## 12. BUILD & DEPLOYMENT

### **Development**
```bash
npm run dev
# Starts on http://localhost:3000
# Hot reload on file changes
# Clears .next cache automatically (configured in package.json)
```

### **Production Build**
```bash
npm run build    # Creates optimized build
npm start        # Starts server
```

### **Bundle Analysis**
```bash
ANALYZE=true npm run build
# Shows what code is being shipped (useful for reducing bundle size)
```

### **Environment Variables** (`.env.local`)
```
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
BRANDKIT_URL=https://...
```

**NEXT_PUBLIC_** prefix = visible in browser (safe for public URLs)
Without prefix = server-only (secrets stay safe)

---

## 13. KEY CONCEPTS TO EXPLAIN

### **When Talking to Other Technical People:**

1. **"This is server-side rendered with Next.js 13 App Router"**
   - Means: Pages render on the server first, then hydrate in the browser
   - Why: Better SEO, faster initial load, can access databases

2. **"We use Tailwind for utility styling and Styled Components for complex animations"**
   - Means: Quick layout with Tailwind, detailed CSS-in-JS for motion
   - Why: Fast development, maintainable, no CSS bloat

3. **"GSAP handles all timeline-based animations and scroll triggers"**
   - Means: Complex motion, choreographed sequences, scroll-driven effects
   - Why: GSAP is battle-tested, performant, industry standard

4. **"Blog content is markdown-to-HTML via Remark/Rehype pipeline"**
   - Means: Write markdown, it gets converted to safe HTML, rendered as React
   - Why: Editable content, type-safe, sanitized against XSS

5. **"Auth and some data lives in Supabase, managed in middleware"**
   - Means: User sessions checked before pages load, database queries in server components
   - Why: Secure, scalable, handles sessions automatically

6. **"Metadata and structured data are dynamically generated per page"**
   - Means: Each page declares its own title, description, schema
   - Why: Better SEO, social sharing, AI crawler friendliness

---

## 14. COMMON PATTERNS & HOW TO READ THE CODE

### **Reading a Page:**

```typescript
// app/blog/[slug]/page.tsx

// Step 1: Metadata generation
export async function generateMetadata({ params }) {
  const post = await getBlogPost(params.slug)
  return { title: post.title, description: post.description }
}

// Step 2: Page component
export default async function BlogPage({ params }) {
  const post = await getBlogPost(params.slug)
  
  return (
    <>
      {/* SEO layer for crawlers */}
      <script type="application/ld+json">
        {JSON.stringify(getBlogPostingSchema(post))}
      </script>
      
      {/* Visual layer for users */}
      <article>
        <h1>{post.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: post.htmlContent }} />
      </article>
    </>
  )
}
```

### **Reading a Component:**

```typescript
// components/BlogCard.tsx

'use client'  // This is interactive
import { useState } from 'react'
import Link from 'next/link'

export function BlogCard({ post }) {
  const [liked, setLiked] = useState(false)
  
  return (
    <article className="border rounded p-4">
      <Link href={`/blog/${post.slug}`}>
        <h2 className="font-display text-xl">{post.title}</h2>
      </Link>
      <p>{post.description}</p>
      <button onClick={() => setLiked(!liked)}>
        {liked ? '❤️' : '🤍'} {post.likes}
      </button>
    </article>
  )
}
```

---

## 15. QUICK REFERENCE: COMMON TASKS

### **Adding a New Blog Post**
1. Create markdown file in `/content/blog/`
2. Add BlogPost interface entry to data
3. New `/blog/[slug]` page automatically works

### **Adding a New Service Page**
1. Create `/app/[service-name]/page.tsx`
2. Add metadata for SEO
3. Import and use existing components

### **Adding an Animation**
1. Import GSAP: `import gsap from 'gsap'`
2. Use in `useEffect` or `useLayoutEffect`:
   ```typescript
   useEffect(() => {
     gsap.to('.element', { duration: 1, opacity: 1 })
   }, [])
   ```

### **Styling a Component**
```typescript
// Option 1: Tailwind (for layout)
<div className="flex gap-4 md:gap-8">

// Option 2: Styled Components (for complex styles)
const Card = styled.div`
  background: var(--color-cream);
  border: 1px solid var(--color-light);
`

// Option 3: CSS modules (if needed)
import styles from './MyComponent.module.css'
<div className={styles.container}>
```

---

## SUMMARY: THE 30-SECOND EXPLANATION

*"This is a Next.js React website with TypeScript. It uses App Router for file-based routing, Tailwind + Styled Components for styling, and GSAP for animations. Content lives in markdown files and gets converted to HTML. Auth and some data use Supabase. Every page has automatic metadata generation for SEO, and JSON-LD schemas tell search engines what the page is. Components are either server-rendered (for data fetching) or client-rendered (for interactivity). The whole app is optimized for performance and search ranking."*

---

## USEFUL COMMANDS

```bash
npm run dev              # Start dev server
npm run build           # Build for production
npm run lint            # Check code style
npm run analyze         # See bundle size breakdown
npm run clean           # Delete .next cache

# TypeScript check
npx tsc --noEmit

# Format code
npx prettier --write .
```

---

## RESOURCES

- **Next.js Docs:** https://nextjs.org/docs
- **React Docs:** https://react.dev
- **Tailwind Docs:** https://tailwindcss.com/docs
- **GSAP Docs:** https://greensock.com/docs
- **TypeScript Docs:** https://www.typescriptlang.org/docs
