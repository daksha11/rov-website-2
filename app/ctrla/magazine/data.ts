// ═══════════════════════════════════════════════════════
// CTRL A MAGAZINE — CONTENT DATA
// ═══════════════════════════════════════════════════════

export interface Tool {
  name: string;
  category: string;
  description: string;
  url: string;
  tags: string[];
  favoriteBy?: string;
  favoriteQuote?: string;
}

export interface Misconception {
  myth: string;
  reality: string;
}

export interface GuideStep {
  number: number;
  title: string;
  body: string;
  tip?: string;
}

export interface ToolkitSection {
  id: string;
  title: string;
  pageNumber: string;
  accentColor: string;
  intro: string;
  tools: Tool[];
  misconceptions: Misconception[];
  guide: { title: string; steps: GuideStep[] };
}

// ── MUSIC TOOLKIT ──────────────────────────────────────

const musicTools: Tool[] = [
  {
    name: "Logic Pro",
    category: "DAW",
    description: "Apple's flagship DAW. Clean interface, powerful stock plugins, and seamless integration with macOS. The go-to for most of our sessions.",
    url: "https://www.apple.com/logic-pro/",
    tags: ["Production", "Mixing", "macOS"],
    favoriteBy: "Basu",
    favoriteQuote: "Logic's stock compressor and EQ are genuinely underrated. I reach for them before any third-party plugin.",
  },
  {
    name: "Pro Tools",
    category: "DAW",
    description: "Industry standard for recording studios. Unmatched for tracking, editing, and large session management.",
    url: "https://www.avid.com/pro-tools",
    tags: ["Recording", "Mixing", "Industry Standard"],
  },
  {
    name: "FabFilter Pro-Q 3",
    category: "Plugin",
    description: "The most intuitive EQ plugin ever made. Dynamic EQ, mid/side processing, and a visual interface that teaches you while you use it.",
    url: "https://www.fabfilter.com/products/pro-q-3-equalizer-plug-in",
    tags: ["EQ", "Mixing", "Essential"],
    favoriteBy: "Basu",
    favoriteQuote: "If I could only keep one plugin, this is it. The dynamic bands alone changed how I mix vocals.",
  },
  {
    name: "Waves CLA-2A",
    category: "Plugin",
    description: "Optical compressor modeled after the hardware classic. Smooth, musical compression that works on everything from vocals to bass.",
    url: "https://www.waves.com/plugins/cla-2a-compressor-limiter",
    tags: ["Compression", "Vocals", "Classic"],
  },
  {
    name: "Valhalla VintageVerb",
    category: "Plugin",
    description: "Lush, affordable reverb with vintage character. Covers everything from tight rooms to massive halls without the price tag.",
    url: "https://valhalladsp.com/shop/reverb/valhalla-vintage-verb/",
    tags: ["Reverb", "Effects", "Affordable"],
  },
  {
    name: "iZotope Ozone",
    category: "Mastering",
    description: "All-in-one mastering suite. AI-assisted mastering that actually sounds good, plus manual controls when you need precision.",
    url: "https://www.izotope.com/en/products/ozone.html",
    tags: ["Mastering", "AI", "Suite"],
  },
  {
    name: "Splice",
    category: "Platform",
    description: "Sample marketplace and plugin rent-to-own. Access millions of sounds and try expensive plugins before committing.",
    url: "https://splice.com/",
    tags: ["Samples", "Sounds", "Rent-to-Own"],
  },
  {
    name: "DistroKid",
    category: "Distribution",
    description: "Fastest way to get music on streaming platforms. Unlimited uploads, keep 100% of royalties, and splits built in.",
    url: "https://distrokid.com/",
    tags: ["Distribution", "Streaming", "Royalties"],
  },
];

const musicMisconceptions: Misconception[] = [
  {
    myth: "Expensive plugins make better mixes",
    reality: "Stock plugins in Logic and Pro Tools can achieve 90% of what premium plugins do. Skill matters more than tools. Learn your stock EQ and compressor inside out before spending money.",
  },
  {
    myth: "Mastering fixes a bad mix",
    reality: "Mastering enhances a good mix. If the mix is muddy, mastering will make it a louder muddy mix. Get the mix right first. Mastering is polish, not repair.",
  },
  {
    myth: "You need a treated room to mix well",
    reality: "Reference your mixes on multiple systems — car speakers, earbuds, phone, studio monitors. Knowing how your room sounds matters more than perfect treatment.",
  },
  {
    myth: "More tracks = better song",
    reality: "Some of the best records ever made used 8 tracks or less. Arrangement is about what you leave out. If a part doesn't serve the song, mute it.",
  },
];

const musicGuide: { title: string; steps: GuideStep[] } = {
  title: "Setting Up Your First Session",
  steps: [
    {
      number: 1,
      title: "Choose your DAW and learn the shortcuts",
      body: "Pick Logic, Pro Tools, or Ableton and commit for at least 6 months. Don't DAW-hop. Learn the keyboard shortcuts for record, split, copy, and bounce. Speed comes from muscle memory.",
      tip: "Logic is the best value — $200 one-time with world-class stock plugins.",
    },
    {
      number: 2,
      title: "Set your session template",
      body: "Create a template with your usual tracks pre-routed: lead vocal, doubles, adlibs, beat bus, and master. Color code everything. This saves 20 minutes per session.",
    },
    {
      number: 3,
      title: "Record clean takes",
      body: "Gain stage your mic so peaks hit around -12dB. Record in 24-bit/48kHz. Leave headroom. A clean recording is easier to mix than a hot one.",
      tip: "Pop filter + 6 inches from the mic. Closer isn't always better.",
    },
    {
      number: 4,
      title: "Mix in passes, not in circles",
      body: "First pass: levels only. Second pass: EQ and compression. Third pass: effects and automation. Don't touch the reverb until your levels are right.",
    },
    {
      number: 5,
      title: "Export and reference",
      body: "Bounce a WAV and an MP3. Listen on 3 different systems before calling it done. Your car speakers will tell you more than your monitors.",
    },
  ],
};

// ── WEB DEV TOOLKIT ────────────────────────────────────

const webDevTools: Tool[] = [
  {
    name: "Next.js",
    category: "Framework",
    description: "React framework with server components, file-based routing, and built-in optimization. The foundation of everything we build at ROV.",
    url: "https://nextjs.org/",
    tags: ["React", "SSR", "Full-Stack"],
    favoriteBy: "Daksha",
    favoriteQuote: "Server components changed everything. You get the DX of React with the performance of static sites.",
  },
  {
    name: "Tailwind CSS",
    category: "Styling",
    description: "Utility-first CSS framework. Write styles directly in your markup. No context switching, no naming things, no dead CSS.",
    url: "https://tailwindcss.com/",
    tags: ["CSS", "Utility-First", "Responsive"],
    favoriteBy: "Ayush",
    favoriteQuote: "Once you stop fighting it and just build, you realize you're shipping 3x faster.",
  },
  {
    name: "Framer Motion",
    category: "Animation",
    description: "Production-grade React animation library. Spring physics, gestures, layout animations, and scroll-triggered effects in a clean API.",
    url: "https://www.framer.com/motion/",
    tags: ["Animation", "React", "Gestures"],
  },
  {
    name: "Vercel",
    category: "Hosting",
    description: "Deploy Next.js apps in seconds. Preview deployments on every PR, edge functions, and analytics built in. Zero config.",
    url: "https://vercel.com/",
    tags: ["Hosting", "CI/CD", "Edge"],
  },
  {
    name: "shadcn/ui",
    category: "Components",
    description: "Copy-paste component library built on Radix UI. Not a dependency — you own the code. Customize everything without fighting a framework.",
    url: "https://ui.shadcn.com/",
    tags: ["Components", "Radix", "Accessible"],
  },
  {
    name: "Figma",
    category: "Design",
    description: "Collaborative design tool. Design, prototype, and hand off in one place. Dev mode gives you exact CSS values and assets.",
    url: "https://www.figma.com/",
    tags: ["Design", "Prototype", "Collaboration"],
    favoriteBy: "Kavya",
    favoriteQuote: "Dev mode + auto layout changed our handoff process completely. No more guessing spacing.",
  },
  {
    name: "Supabase",
    category: "Backend",
    description: "Open-source Firebase alternative. Postgres database, auth, storage, and real-time subscriptions. SQL power with a clean dashboard.",
    url: "https://supabase.com/",
    tags: ["Database", "Auth", "Real-time"],
  },
  {
    name: "Cursor",
    category: "Editor",
    description: "AI-native code editor built on VS Code. Tab completion that understands your codebase, inline chat, and multi-file edits.",
    url: "https://cursor.sh/",
    tags: ["AI", "Editor", "Productivity"],
  },
];

const webDevMisconceptions: Misconception[] = [
  {
    myth: "You need to learn everything before building",
    reality: "Build first, learn as you go. Start with HTML, CSS, and one framework. Ship something ugly this week. You'll learn more from one deployed project than six months of tutorials.",
  },
  {
    myth: "React is the only option",
    reality: "React dominates the job market, but Svelte, Vue, and even vanilla JS are legitimate choices. Pick based on your project, not Twitter hype. React's ecosystem is its real advantage.",
  },
  {
    myth: "AI will replace developers",
    reality: "AI makes good developers faster. It doesn't replace taste, architecture decisions, or understanding user needs. The developers who learn to use AI well will outpace everyone else.",
  },
  {
    myth: "You need a CS degree to get hired",
    reality: "A strong portfolio beats a degree. Build 3 real projects, contribute to open source, and show your work. Companies care about what you can do, not where you learned it.",
  },
];

const webDevGuide: { title: string; steps: GuideStep[] } = {
  title: "Shipping Your First Next.js Site",
  steps: [
    {
      number: 1,
      title: "Scaffold with create-next-app",
      body: "Run npx create-next-app@latest with TypeScript and Tailwind enabled. This gives you a production-ready setup in 30 seconds. Don't waste time configuring webpack.",
      tip: "Always pick the App Router — it's the future of Next.js.",
    },
    {
      number: 2,
      title: "Design in the browser",
      body: "Skip Figma for personal projects. Open your editor and start building with Tailwind classes directly. Use shadcn/ui for complex components. Iterate in real time.",
    },
    {
      number: 3,
      title: "Structure your routes",
      body: "Each page gets its own folder in app/. Use layout.tsx for shared UI. Use loading.tsx for suspense boundaries. Keep components next to the pages that use them.",
    },
    {
      number: 4,
      title: "Deploy to Vercel",
      body: "Connect your GitHub repo. Every push to main deploys automatically. Every PR gets a preview URL. Share it, get feedback, iterate.",
      tip: "Set up a custom domain early — it makes everything feel real.",
    },
    {
      number: 5,
      title: "Optimize and ship",
      body: "Add metadata for SEO. Use next/image for all images. Check Lighthouse scores. Fix the easy wins (alt text, heading hierarchy, contrast). Then ship it.",
    },
  ],
};

// ── DESIGN TOOLKIT ─────────────────────────────────────

const designTools: Tool[] = [
  {
    name: "Figma",
    category: "Interface Design",
    description: "The standard for UI/UX design. Real-time collaboration, auto layout, component variants, and dev mode for clean handoffs.",
    url: "https://www.figma.com/",
    tags: ["UI/UX", "Prototyping", "Collaboration"],
    favoriteBy: "Kavya",
    favoriteQuote: "Auto layout + component variants changed how I think about design systems. Everything is a system now.",
  },
  {
    name: "Adobe Illustrator",
    category: "Vector",
    description: "Vector illustration powerhouse. Logo design, icon systems, and complex illustrations. Nothing matches it for precision vector work.",
    url: "https://www.adobe.com/products/illustrator.html",
    tags: ["Vector", "Logo", "Illustration"],
  },
  {
    name: "Photoshop",
    category: "Raster",
    description: "Photo editing and compositing. Still unmatched for photo manipulation, texture work, and complex image editing.",
    url: "https://www.adobe.com/products/photoshop.html",
    tags: ["Photo", "Compositing", "Textures"],
  },
  {
    name: "Blender",
    category: "3D",
    description: "Free, open-source 3D creation suite. Modeling, texturing, animation, and rendering. Used by our 3D team for product visualizations.",
    url: "https://www.blender.org/",
    tags: ["3D", "Free", "Open Source"],
    favoriteBy: "David",
    favoriteQuote: "The fact that this is free is insane. Cycles renderer produces photorealistic output that rivals paid tools.",
  },
  {
    name: "Coolors",
    category: "Color",
    description: "Color palette generator. Lock colors you like, generate complementary ones, and export to any format. Saves hours of color theory.",
    url: "https://coolors.co/",
    tags: ["Color", "Palette", "Generator"],
  },
  {
    name: "Google Fonts",
    category: "Typography",
    description: "Free, open-source font library. Over 1,500 families. Performance-optimized for web. Variable fonts for maximum flexibility.",
    url: "https://fonts.google.com/",
    tags: ["Typography", "Free", "Web Fonts"],
  },
  {
    name: "Mobbin",
    category: "Inspiration",
    description: "Real-world design pattern library. Screenshots of actual apps organized by flow, screen type, and platform. Better than Dribbble for real UI work.",
    url: "https://mobbin.com/",
    tags: ["Inspiration", "Patterns", "Research"],
  },
  {
    name: "Spline",
    category: "3D for Web",
    description: "Design and publish 3D scenes for the web. No code needed. Interactive 3D elements that export as React components.",
    url: "https://spline.design/",
    tags: ["3D", "Web", "Interactive"],
  },
];

const designMisconceptions: Misconception[] = [
  {
    myth: "Good design is about making things pretty",
    reality: "Good design solves problems. Pretty is a side effect of clear thinking. If a design looks great but users can't find the button, it failed.",
  },
  {
    myth: "You need expensive tools to design well",
    reality: "Figma is free for individuals. Blender is free forever. Canva handles 80% of social media needs. Taste and practice matter more than your subscription.",
  },
  {
    myth: "Following trends makes you a good designer",
    reality: "Trends are references, not rules. The glassmorphism phase proved this — most of it was unreadable. Understand why a trend works before copying it.",
  },
  {
    myth: "Clients know what they want",
    reality: "Clients know their problems, not the solution. Your job is to translate their pain into a design that works. Show, don't ask. Present options, not questions.",
  },
];

const designGuide: { title: string; steps: GuideStep[] } = {
  title: "Building a Brand Identity from Scratch",
  steps: [
    {
      number: 1,
      title: "Research before you open Figma",
      body: "Study the industry, competitors, and target audience. Save 20-30 reference images. Identify what works, what doesn't, and where the gap is. Your brand lives in that gap.",
      tip: "Use Mobbin and Pinterest, not Dribbble. Real products > concept art.",
    },
    {
      number: 2,
      title: "Define the brand personality",
      body: "Pick 3 adjectives that describe how the brand should feel. Bold? Minimal? Warm? These words guide every design decision. If a choice doesn't match the adjectives, cut it.",
    },
    {
      number: 3,
      title: "Typography first, color second",
      body: "Choose 2 fonts: one for headlines, one for body. The headline font carries the personality. The body font carries readability. Don't pick both from the same vibe.",
      tip: "Pair a serif with a sans-serif. It works 90% of the time.",
    },
    {
      number: 4,
      title: "Build a minimal color system",
      body: "One primary color, one neutral, one accent. That's it for V1. Add complexity later. Use Coolors to generate palettes from your primary color.",
    },
    {
      number: 5,
      title: "Create a one-page brand sheet",
      body: "Logo, fonts, colors, spacing rules, and 3 example applications. This single page becomes the source of truth. Share it before designing anything else.",
    },
  ],
};

// ── EXPORT ──────────────────────────────────────────────

export const toolkitSections: ToolkitSection[] = [
  {
    id: "music",
    title: "Music",
    pageNumber: "01",
    accentColor: "#EA9A61",
    intro: "The tools, plugins, and platforms our sound engineers actually use — not what gets promoted on YouTube. From DAWs to distribution, every pick has been tested in real sessions with real artists.",
    tools: musicTools,
    misconceptions: musicMisconceptions,
    guide: musicGuide,
  },
  {
    id: "web-dev",
    title: "Web Dev",
    pageNumber: "02",
    accentColor: "#B16937",
    intro: "Our full development stack, from framework to deployment. These are the tools we build client sites with every day — chosen for speed, reliability, and developer experience.",
    tools: webDevTools,
    misconceptions: webDevMisconceptions,
    guide: webDevGuide,
  },
  {
    id: "design",
    title: "Design",
    pageNumber: "03",
    accentColor: "#C4956A",
    intro: "The design toolkit our creative team swears by. Interface design, branding, 3D, and everything in between. Curated by designers who ship real client work, not concept pieces.",
    tools: designTools,
    misconceptions: designMisconceptions,
    guide: designGuide,
  },
];
