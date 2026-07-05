// ═══════════════════════════════════════════════════════
// CTRL A MAGAZINE, CONTENT DATA
//
// Volume-specific editorial content now lives in
// `./_volumes/*`. This module is TWO things:
//   1. The home of the evergreen TOOLKIT subsystem (music /
//      web-dev / design) — reworked in a later wave, so it
//      stays here for now.
//   2. A thin compatibility layer that re-exports the CURRENT
//      volume's content (and the volume types) so existing
//      imports keep working. Flip the pointer in
//      `./_volumes/index.ts` to publish a new issue.
// ═══════════════════════════════════════════════════════

import { currentVolume } from "./_volumes";
import type { GalleyCategory } from "./_volumes/types";

// ── Current-volume re-exports (compatibility layer) ─────
// Prefer importing `currentVolume` from "./_volumes" in new code.
export const issueMeta = currentVolume.issueMeta;
export const taste = currentVolume.taste;
export const onRepeat = currentVolume.onRepeat;
export const artForm = currentVolume.artForm;
export const galley = currentVolume.galley;
export const cookbook = currentVolume.cookbook;
export const artists = currentVolume.artists;
export const spotlight = currentVolume.spotlight;
export const events = currentVolume.events;
export const eventSources = currentVolume.eventSources;
export const eventsCover = currentVolume.eventsCover;
export const vueClose = currentVolume.vueClose;
// The deep feature — flattened for the existing feature components.
export const coverShot = currentVolume.feature.coverShot;
export const issueOpen = currentVolume.feature.issueOpen;
export const bts = currentVolume.feature.bts;
export const twoCities = currentVolume.feature.twoCities;
export const productionToolkit = currentVolume.feature.productionToolkit;

// Volume types re-exported so `import { type X } from "../data"` keeps working.
export type {
  IssueStat,
  IssueMeta,
  RepeatTrack,
  GalleyRecipe,
  GalleyCategory,
  Artist,
  IssueEvent,
  BtsTile,
  ProdTool,
  Volume,
} from "./_volumes/types";

// ── Galley category accents ─────────────────────────────
// Evergreen (not volume-specific): the fridge's meal / snack / drink
// tints stay inside the house palette: gold / rose / lifted plum.
export const galleyMeta: Record<GalleyCategory, { label: string; accent: string }> = {
  meal: { label: "Meal", accent: "#E3C24A" },
  snack: { label: "Snack", accent: "#A56A67" },
  drink: { label: "Drink", accent: "#8E76B8" },
};

// ═══════════════════════════════════════════════════════
// TOOLKIT SUBSYSTEM (evergreen — reworked in a later wave)
// ═══════════════════════════════════════════════════════

export type ToolLevel = "Beginner" | "Intermediate" | "Pro";

export interface Tool {
  name: string;
  category: string;
  description: string;
  url: string;
  tags: string[];
  favoriteBy?: string;
  favoriteQuote?: string;
  // ── Immersive "Tool Station" fields (optional; web-dev is the flagship) ──
  /** One punchy sentence — what it is, fast. */
  oneLiner?: string;
  /** The single moment you reach for it. */
  whenToUse?: string;
  /** Difficulty, drives the level filter. */
  level?: ToolLevel;
  /** Names of tools it works best alongside. */
  pairsWith?: string[];
  /** Site allows iframe embedding, so the preview can run a live frame
   *  on top of the screenshot. Most tool sites block this, so default off. */
  embeddable?: boolean;
  /** Curated screenshot in /public — overrides the auto screenshot for tools
   *  whose site won't capture cleanly. Drop a real image and point here. */
  preview?: string;
}

/** A dated industry-shift entry for the "Signals" feed (hand-curated). */
export type SignalKind = "Release" | "Shift" | "Trend" | "Sunset";
export interface Signal {
  date: string; // display, e.g. "Jun 2026"
  kind: SignalKind;
  title: string;
  note: string;
  url?: string;
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
  /** Short editorial blurb for the "Three Toolkits" column (1–2 lines). */
  blurb: string;
  /** e.g. "12 PICKS", shown on the toolkit column. */
  pickCount: string;
  /** e.g. "Updated weekly". */
  cadence: string;
  tools: Tool[];
  misconceptions: Misconception[];
  guide: { title: string; steps: GuideStep[] };
  /** Hand-curated industry shifts for the Signals feed (flagship: web-dev). */
  signals?: Signal[];
  /** Subtle, hand-authored editorial nods to the sibling toolkits. Optional and
   *  capped at 3. `toolkit` is another section id, `toolName` names a real tool
   *  in that section, `line` is a single Instrument Serif sentence in ROV voice. */
  crossRefs?: { toolkit: string; toolName: string; line: string }[];
}

// ── MUSIC TOOLKIT ──────────────────────────────────────

const musicTools: Tool[] = [
  {
    name: "Logic Pro",
    category: "DAW",
    description: "Apple's flagship DAW. Clean interface, powerful stock plugins, and seamless integration with macOS. The go-to for most of our sessions.",
    url: "https://www.apple.com/logic-pro/",
    tags: ["Production", "Mixing", "macOS"],
    favoriteBy: "Founder & audio engineer",
    favoriteQuote: "Logic's stock compressor and EQ are genuinely underrated. I reach for them before any third-party plugin.",
    level: "Intermediate",
    oneLiner: "Apple's whole studio in a box, with stock plugins good enough to finish on.",
    whenToUse: "When you want one affordable place to take a song from first idea to final mix on a Mac.",
    pairsWith: ["FabFilter Pro-Q 3", "iZotope Ozone"],
  },
  {
    name: "Antares Auto-Tune",
    category: "Tuning",
    description: "The plugin that defined modern vocal pitch. Real-time correction that runs from transparent nudges to the hard, locked sound that became a genre of its own. Graph mode for detailed by-hand work, auto mode for riding live.",
    url: "https://www.antarestech.com/",
    tags: ["Tuning", "Vocals", "Pitch"],
    favoriteBy: "Founder & audio engineer",
    favoriteQuote: "I tune by hand first, then let Auto-Tune ride on top. Retune Speed is the whole sound: slow for natural, near zero for the locked effect.",
    level: "Intermediate",
    oneLiner: "The tuner that set the standard, invisible or hard-locked, your call.",
    whenToUse: "Riding over hand-tuned vocals to hold pitch in real time. Light when you want it invisible, hard when the locked sound is the point.",
    pairsWith: ["FabFilter Pro-Q 3", "Soundtoys Little AlterBoy"],
  },
  {
    name: "FabFilter Pro-Q 3",
    category: "EQ",
    description: "The most intuitive EQ plugin ever made. Dynamic EQ, mid/side processing, and a visual interface that teaches you while you use it.",
    url: "https://www.fabfilter.com/products/pro-q-3-equalizer-plug-in",
    tags: ["EQ", "Mixing", "Essential"],
    favoriteBy: "Founder & audio engineer",
    favoriteQuote: "If I could only keep one plugin, this is it. The dynamic bands alone changed how I mix vocals.",
    level: "Beginner",
    oneLiner: "The EQ that teaches your ears while you use it.",
    whenToUse: "Any time something sounds muddy, harsh, or boxy and you need to carve it clean.",
    pairsWith: ["Logic Pro", "Waves CLA-2A"],
  },
  {
    name: "FabFilter Pro-DS",
    category: "De-essing",
    description: "A transparent de-esser that finds the harsh sss and t sounds and pulls them down without dulling the rest of the vocal. Single-vocal or wideband modes, with a clear readout of exactly what it's catching.",
    url: "https://www.fabfilter.com/products/pro-ds-de-esser-plug-in",
    tags: ["De-essing", "Vocals", "Mixing"],
    favoriteBy: "Founder & audio engineer",
    favoriteQuote: "Compression always wakes the esses back up, so I de-ess once early and almost always again near the end of the chain.",
    level: "Intermediate",
    oneLiner: "Surgical sibilance control the rest of the chain can't undo.",
    whenToUse: "When sss and t sounds stab through the mix, set before the compressor so it isn't reacting to harshness.",
    pairsWith: ["FabFilter Pro-Q 3", "Waves CLA-2A"],
  },
  {
    name: "Waves CLA-2A",
    category: "Compression",
    description: "Optical compressor modeled after the hardware classic. Smooth, musical compression that works on everything from vocals to bass.",
    url: "https://www.waves.com/plugins/cla-2a-compressor-limiter",
    tags: ["Compression", "Vocals", "Classic"],
    level: "Intermediate",
    oneLiner: "A classic optical compressor that makes vocals sit smooth and forward.",
    whenToUse: "When a vocal jumps around in level and you want it glued and up front. Two gentle ones in series beat one working hard.",
    pairsWith: ["FabFilter Pro-Q 3", "Waves Doubler"],
  },
  {
    name: "Waves Doubler",
    category: "Doubling / width",
    description: "A modulated doubler that turns one take into a wide, thick vocal stack. Up to four detuned and delayed voices spread left and right for width and size without re-recording a single layer.",
    url: "https://www.waves.com/plugins/doubler",
    tags: ["Doubling", "Width", "Vocals"],
    level: "Intermediate",
    oneLiner: "One take, widened into a stacked, radio-ready vocal.",
    whenToUse: "When a hook needs to feel bigger and wider but you only tracked one take.",
    pairsWith: ["Waves CLA-2A"],
  },
  {
    name: "CamelCrusher",
    category: "Saturation / grit",
    description: "A free distortion and coloring plugin that still beats plenty of paid ones. Two flavors of overdrive plus a built-in compressor and low/high tone, perfect for adding warmth, grit, and presence to a sterile signal.",
    url: "https://www.kvraudio.com/product/camelcrusher-by-camel-audio",
    tags: ["Saturation", "Distortion", "Free"],
    favoriteBy: "Founder & audio engineer",
    favoriteQuote: "It's free and I still reach for it on vocals constantly. A touch of the mechanical mode and the vocal sits right in the track.",
    level: "Beginner",
    oneLiner: "Free saturation and grit that punches way above its price (zero).",
    whenToUse: "When a clean vocal or bass needs warmth, attitude, or a little dirt to sit forward instead of just louder.",
    pairsWith: ["FabFilter Pro-Q 3"],
  },
  {
    name: "Soundtoys Little AlterBoy",
    category: "Pitch / formant",
    description: "Pitch and formant shifting for vocals, from subtle thickening to octave stacks, gender-bending, and robotic transformer effects. A hard-tune mode and built-in drive make it a creative vocal weapon, not just a corrector.",
    url: "https://www.soundtoys.com/product/little-alterboy/",
    tags: ["Pitch", "Formant", "Vocals"],
    level: "Intermediate",
    oneLiner: "Bend pitch and formant for octave stacks, thick lows, and alien vocals.",
    whenToUse: "When you want a pitched-down vocal double, a formant tweak, or a wild effect take you could never sing.",
    pairsWith: ["Soundtoys EchoBoy", "Antares Auto-Tune"],
  },
  {
    name: "Soundtoys EchoBoy",
    category: "Delay",
    description: "The delay that does it all, from clean digital repeats to warm tape and gritty analog character. Rhythmic subdivisions, saturation per repeat, and a feel knob that makes the echoes breathe with the track.",
    url: "https://www.soundtoys.com/product/echoboy/",
    tags: ["Delay", "Effects", "Vocals"],
    favoriteBy: "Founder & audio engineer",
    favoriteQuote: "EchoBoy on a send, high-passed and ducked under the dry vocal, is half of why our mixes feel deep.",
    level: "Intermediate",
    oneLiner: "Every delay you need, from tight slaps to tape echoes that breathe.",
    whenToUse: "On a send, to throw a word to the back wall or wrap the vocal in rhythmic space.",
    pairsWith: ["FabFilter Pro-R", "Waves CLA-2A"],
  },
  {
    name: "FabFilter Pro-R",
    category: "Reverb",
    description: "A natural, musical reverb with a Decay Rate EQ and a single Space knob that sweeps from a tiny room to a cathedral. The cleanest way to add depth without washing the mix in mud.",
    url: "https://www.fabfilter.com/products/pro-r-reverb-plug-in",
    tags: ["Reverb", "Effects", "Mixing"],
    level: "Intermediate",
    oneLiner: "Depth and space that stay clean, a reverb you can EQ by decay.",
    whenToUse: "On a send for last-step depth. High-pass it and duck it under the dry vocal so space never costs you clarity.",
    pairsWith: ["Soundtoys EchoBoy"],
  },
  {
    name: "iZotope Ozone",
    category: "Mastering",
    description: "All-in-one mastering suite. AI-assisted mastering that actually sounds good, plus manual controls when you need precision.",
    url: "https://www.izotope.com/en/products/ozone.html",
    tags: ["Mastering", "AI", "Suite"],
    level: "Pro",
    oneLiner: "A full mastering chain, with an AI assistant for a strong first move.",
    whenToUse: "The last step, when the mix is done and you want it loud, balanced, and upload-ready.",
    pairsWith: ["DistroKid"],
  },
  {
    name: "DistroKid",
    category: "Distribution",
    description: "Fastest way to get music on streaming platforms. Unlimited uploads, keep 100% of royalties, and splits built in.",
    url: "https://distrokid.com/",
    tags: ["Distribution", "Streaming", "Royalties"],
    level: "Beginner",
    oneLiner: "The fastest way onto Spotify and Apple Music, with all your royalties kept.",
    whenToUse: "When the master is done and you want it live on streaming this week.",
    pairsWith: ["iZotope Ozone"],
  },
];

// Hand-curated industry shifts for the Music sector.
const musicSignals: Signal[] = [
  {
    date: "Jun 2026",
    kind: "Trend",
    title: "Stem separation is everywhere",
    note: "One-click stem splitting is now baked into most tools. Remixing, sampling, and cleanup workflows changed overnight.",
    url: "https://www.izotope.com/en/products/rx.html",
  },
  {
    date: "May 2026",
    kind: "Shift",
    title: "AI mastering got genuinely good",
    note: "Assistant masters are a credible starting point now, not a gimmick. The skill is knowing when to trust them and when to take over.",
    url: "https://www.izotope.com/en/products/ozone.html",
  },
  {
    date: "Apr 2026",
    kind: "Trend",
    title: "You master for LUFS, not loudness",
    note: "Streaming normalization keeps winning. Aim for dynamics and a target loudness, not the loudest possible file.",
  },
  {
    date: "Mar 2026",
    kind: "Release",
    title: "Rent-to-own keeps lowering the barrier",
    note: "More flagship plugins are pay-as-you-go. Still, learning your stock chain first beats hoarding plugins.",
    url: "https://splice.com/",
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
    reality: "Reference your mixes on multiple systems, car speakers, earbuds, phone, studio monitors. Knowing how your room sounds matters more than perfect treatment.",
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
      tip: "Logic is the best value, $200 one-time with world-class stock plugins.",
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
    level: "Intermediate",
    oneLiner: "The React framework that turns a folder of files into a fast, production site.",
    whenToUse: "Reach for it the moment a project needs real routing, SEO, or a backend, not just a single page.",
    pairsWith: ["Tailwind CSS", "Vercel", "Supabase"],
  },
  {
    name: "Tailwind CSS",
    category: "Styling",
    description: "Utility-first CSS framework. Write styles directly in your markup. No context switching, no naming things, no dead CSS.",
    url: "https://tailwindcss.com/",
    tags: ["CSS", "Utility-First", "Responsive"],
    favoriteBy: "Ayush",
    favoriteQuote: "Once you stop fighting it and just build, you realize you're shipping 3x faster.",
    level: "Beginner",
    oneLiner: "Style straight in your markup with small utility classes, no naming, no dead CSS.",
    whenToUse: "Use it on day one of any UI when you want to move fast and stay consistent.",
    pairsWith: ["Next.js", "shadcn/ui"],
  },
  {
    name: "Framer Motion",
    category: "Animation",
    description: "Production-grade React animation library. Spring physics, gestures, layout animations, and scroll-triggered effects in a clean API.",
    url: "https://www.framer.com/motion/",
    tags: ["Animation", "React", "Gestures"],
    level: "Intermediate",
    oneLiner: "Spring-physics animation for React that looks expensive with very little code.",
    whenToUse: "Bring it in once a UI works and you want it to feel alive, transitions, gestures, scroll.",
    pairsWith: ["Next.js", "shadcn/ui"],
  },
  {
    name: "Vercel",
    category: "Hosting",
    description: "Deploy Next.js apps in seconds. Preview deployments on every PR, edge functions, and analytics built in. Zero config.",
    url: "https://vercel.com/",
    tags: ["Hosting", "CI/CD", "Edge"],
    level: "Beginner",
    oneLiner: "Push to GitHub, get a live URL in seconds, with a preview for every change.",
    whenToUse: "The day you want others to see it. Connect the repo and you are deployed.",
    pairsWith: ["Next.js"],
  },
  {
    name: "shadcn/ui",
    category: "Components",
    description: "Copy-paste component library built on Radix UI. Not a dependency, you own the code. Customize everything without fighting a framework.",
    url: "https://ui.shadcn.com/",
    tags: ["Components", "Radix", "Accessible"],
    level: "Intermediate",
    oneLiner: "Accessible components you copy into your code and own outright, no black box.",
    whenToUse: "When you need buttons, dialogs, and menus that are solid but still yours to restyle.",
    pairsWith: ["Tailwind CSS", "Next.js"],
  },
  {
    name: "Figma",
    category: "Design",
    description: "Collaborative design tool. Design, prototype, and hand off in one place. Dev mode gives you exact CSS values and assets.",
    url: "https://www.figma.com/",
    tags: ["Design", "Prototype", "Collaboration"],
    favoriteBy: "Kavya",
    favoriteQuote: "Dev mode + auto layout changed our handoff process completely. No more guessing spacing.",
    level: "Beginner",
    oneLiner: "Where the screen gets designed before it gets built, together, in the browser.",
    whenToUse: "Before you write code, to settle layout, spacing, and type without guessing.",
    pairsWith: ["Tailwind CSS"],
  },
  {
    name: "Supabase",
    category: "Backend",
    description: "Open-source Firebase alternative. Postgres database, auth, storage, and real-time subscriptions. SQL power with a clean dashboard.",
    url: "https://supabase.com/",
    tags: ["Database", "Auth", "Real-time"],
    level: "Intermediate",
    oneLiner: "A real Postgres database with auth and storage, wired up from a clean dashboard.",
    whenToUse: "The moment your app needs to remember things: users, data, uploads, logins.",
    pairsWith: ["Next.js"],
  },
  {
    name: "Cursor",
    category: "Editor",
    description: "AI-native code editor built on VS Code. Tab completion that understands your codebase, inline chat, and multi-file edits.",
    url: "https://cursor.sh/",
    tags: ["AI", "Editor", "Productivity"],
    level: "Beginner",
    oneLiner: "VS Code with an AI that actually understands your whole project.",
    whenToUse: "All the time, but especially when stuck, refactoring, or moving across many files.",
    pairsWith: ["Next.js"],
  },
];

// Hand-curated industry shifts for the Web Dev sector. Edit this list to keep
// the Signals feed current; entries render newest-first as written.
const webDevSignals: Signal[] = [
  {
    date: "Jun 2026",
    kind: "Shift",
    title: "Server Components are the default",
    note: "New React projects now assume server-first. Reach for client components only where you truly need interactivity.",
    url: "https://nextjs.org/docs",
  },
  {
    date: "May 2026",
    kind: "Release",
    title: "Tailwind's engine keeps getting faster",
    note: "The newer build pipeline means near-instant rebuilds. If you are on an old config, the upgrade is worth an afternoon.",
    url: "https://tailwindcss.com/blog",
  },
  {
    date: "Apr 2026",
    kind: "Trend",
    title: "AI editors moved from novelty to default",
    note: "Tab-complete that reads your codebase is now table stakes. The skill is steering it well, not whether you use it.",
    url: "https://cursor.sh/",
  },
  {
    date: "Mar 2026",
    kind: "Shift",
    title: "You own your components now",
    note: "Copy-in libraries like shadcn/ui keep winning over heavy dependencies. Less lock-in, more control over the details.",
    url: "https://ui.shadcn.com/",
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
      tip: "Always pick the App Router, it's the future of Next.js.",
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
      tip: "Set up a custom domain early, it makes everything feel real.",
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
    level: "Beginner",
    oneLiner: "Where screens get designed and prototyped, together, in the browser.",
    whenToUse: "Before you build anything, to settle layout, spacing, and flow with your team.",
    pairsWith: ["Mobbin", "Google Fonts"],
  },
  {
    name: "Adobe Illustrator",
    category: "Vector",
    description: "Vector illustration powerhouse. Logo design, icon systems, and complex illustrations. Nothing matches it for precision vector work.",
    url: "https://www.adobe.com/products/illustrator.html",
    tags: ["Vector", "Logo", "Illustration"],
    level: "Intermediate",
    oneLiner: "Precision vector tool for logos, icons, and clean illustration.",
    whenToUse: "When you need crisp artwork that scales to any size without blurring.",
    pairsWith: ["Photoshop"],
  },
  {
    name: "Photoshop",
    category: "Raster",
    description: "Photo editing and compositing. Still unmatched for photo manipulation, texture work, and complex image editing.",
    url: "https://www.adobe.com/products/photoshop.html",
    tags: ["Photo", "Compositing", "Textures"],
    level: "Intermediate",
    oneLiner: "The standard for photo editing, retouching, and compositing.",
    whenToUse: "When you're working with photos and textures, not shapes and type.",
    pairsWith: ["Adobe Illustrator"],
  },
  {
    name: "Blender",
    category: "3D",
    description: "Free, open-source 3D creation suite. Modeling, texturing, animation, and rendering. Used by our 3D team for product visualizations.",
    url: "https://www.blender.org/",
    tags: ["3D", "Free", "Open Source"],
    favoriteBy: "David",
    favoriteQuote: "The fact that this is free is insane. Cycles renderer produces photorealistic output that rivals paid tools.",
    level: "Pro",
    oneLiner: "A complete 3D suite, modeling to render, that happens to be free.",
    whenToUse: "When a project needs real 3D: product shots, motion, or scenes you can't fake in 2D.",
    pairsWith: ["Spline"],
  },
  {
    name: "Coolors",
    category: "Color",
    description: "Color palette generator. Lock colors you like, generate complementary ones, and export to any format. Saves hours of color theory.",
    url: "https://coolors.co/",
    tags: ["Color", "Palette", "Generator"],
    level: "Beginner",
    oneLiner: "Generate, lock, and export colour palettes in seconds.",
    whenToUse: "At the start of a brand or UI, when you're hunting a palette that actually works.",
    pairsWith: ["Figma"],
  },
  {
    name: "Google Fonts",
    category: "Typography",
    description: "Free, open-source font library. Over 1,500 families. Performance-optimized for web. Variable fonts for maximum flexibility.",
    url: "https://fonts.google.com/",
    tags: ["Typography", "Free", "Web Fonts"],
    level: "Beginner",
    oneLiner: "1,500+ free, web-ready type families, variable fonts included.",
    whenToUse: "Any time you need quality type with no licensing headache.",
    pairsWith: ["Figma"],
  },
  {
    name: "Mobbin",
    category: "Inspiration",
    description: "Real-world design pattern library. Screenshots of actual apps organized by flow, screen type, and platform. Better than Dribbble for real UI work.",
    url: "https://mobbin.com/",
    tags: ["Inspiration", "Patterns", "Research"],
    level: "Beginner",
    oneLiner: "Screenshots of real shipped apps, organized by flow and screen.",
    whenToUse: "When you're designing a flow and want to see how real products solve it.",
    pairsWith: ["Figma"],
  },
  {
    name: "Spline",
    category: "3D for Web",
    description: "Design and publish 3D scenes for the web. No code needed. Interactive 3D elements that export as React components.",
    url: "https://spline.design/",
    tags: ["3D", "Web", "Interactive"],
    level: "Intermediate",
    oneLiner: "Design interactive 3D for the web with no code, then export to React.",
    whenToUse: "When a site needs a 3D element that reacts, without opening Blender.",
    pairsWith: ["Figma", "Blender"],
  },
];

// Hand-curated industry shifts for the Design sector.
const designSignals: Signal[] = [
  {
    date: "Jun 2026",
    kind: "Trend",
    title: "3D on the web went mainstream",
    note: "Interactive 3D and WebGL hero moments are common on product sites now. Tools made it approachable for solo designers.",
    url: "https://spline.design/",
  },
  {
    date: "May 2026",
    kind: "Shift",
    title: "Variable fonts are the default",
    note: "One file, every weight and width. Type systems are lighter and more flexible than the static-font era ever allowed.",
    url: "https://fonts.google.com/",
  },
  {
    date: "Apr 2026",
    kind: "Trend",
    title: "Real-product reference beats concept art",
    note: "Designers reference shipped apps over dribbble concepts. Patterns that actually work in production win.",
    url: "https://mobbin.com/",
  },
  {
    date: "Mar 2026",
    kind: "Release",
    title: "Design tools lean into AI assists",
    note: "First-pass layouts, variants, and content fills are a click away. Taste is still the whole differentiator.",
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
    reality: "Trends are references, not rules. The glassmorphism phase proved this, most of it was unreadable. Understand why a trend works before copying it.",
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

// ── VIDEO / FILM TOOLKIT ───────────────────────────────
// ⚠️ DRAFT FOR ANDI TO VERIFY. The tool picks, prices, quotes, dated
// Signals, and myth/reality pairs below are a plausible, ROV-voice
// reconstruction of the film stack, not a confirmed list. Confirm the
// exact bodies, lenses, and attributions the team actually runs, and
// re-check every Signal date and source link, before this ships.

const videoTools: Tool[] = [
  {
    name: "Blackmagic Pocket Cinema Camera 6K Pro",
    category: "Camera body",
    description: "A Super35 cinema camera that shoots 6K in Blackmagic RAW to a card you can afford. Built-in ND filters, a tilting screen, and a real cine image for the price of a mid photo body. The A-cam behind our set and crowd coverage.",
    url: "https://www.blackmagicdesign.com/products/blackmagicpocketcinemacamera",
    tags: ["Cinema", "6K RAW", "Super35"],
    favoriteBy: "ROV film team",
    favoriteQuote: "Internal RAW and built-in NDs on a body this cheap is the reason our run-and-gun footage grades like a bigger production.",
    level: "Intermediate",
    oneLiner: "A true cinema image with internal RAW, for the price of a photo body.",
    whenToUse: "When you want a gradeable, cinematic file and you are willing to light and expose it with care.",
    pairsWith: ["Sigma 18-35mm f/1.8 Art", "DaVinci Resolve Studio"],
  },
  {
    name: "Sigma 18-35mm f/1.8 Art",
    category: "Lens",
    description: "The fast zoom that behaves like a bag of primes. A constant f/1.8 across the range on Super35, sharp wide open, with the shallow depth and low-light room that make a shot feel filmic. One lens covers most of a run-and-gun day.",
    url: "https://www.sigma-global.com/en/lenses/a013_18_35_18/",
    tags: ["Zoom", "Fast", "Super35"],
    level: "Intermediate",
    oneLiner: "One fast zoom that covers the range of three primes.",
    whenToUse: "When the day moves too fast to swap primes but you still want prime-grade depth and light.",
    pairsWith: ["Blackmagic Pocket Cinema Camera 6K Pro"],
  },
  {
    name: "Aputure LS 600d Pro",
    category: "Key light",
    description: "A daylight point-source LED with the punch of a small HMI and none of the noise. Bowens mount for any modifier, app control, and enough output to bounce, diffuse, or push through a window. The dependable key on most of our sets.",
    url: "https://www.aputure.com/products/ls-600d-pro/",
    tags: ["LED", "Daylight", "Key"],
    favoriteBy: "ROV film team",
    favoriteQuote: "One strong, controllable source you can shape beats a pile of little panels every single time.",
    level: "Intermediate",
    oneLiner: "One controllable key with real output, ready for any modifier.",
    whenToUse: "When you need a dependable main light you can shape, dim, and match to daylight.",
    pairsWith: ["Matthews C-Stand", "Blackmagic Pocket Cinema Camera 6K Pro"],
  },
  {
    name: "Matthews C-Stand",
    category: "Grip / modifier",
    description: "The grip workhorse. A heavy, stable stand with a grip head and arm that flags, nets, bounces, and blocks light exactly where you want it. Most of lighting is subtraction, and this is the tool that takes light away as precisely as a fixture adds it.",
    url: "https://msegrip.com/",
    tags: ["Grip", "Flag", "Control"],
    level: "Beginner",
    oneLiner: "The stand that shapes light by taking it away, not adding it.",
    whenToUse: "The moment a source is lit but uncontrolled: flag the spill, net the hotspot, add negative fill.",
    pairsWith: ["Aputure LS 600d Pro"],
  },
  {
    name: "Adobe Premiere Pro",
    category: "Edit suite",
    description: "The editing room for fast turnarounds. Strong multicam, tight integration with the rest of Adobe, and the social cut-downs the team ships while a shoot is still moving. Where the story gets cut before it gets colored.",
    url: "https://www.adobe.com/products/premiere.html",
    tags: ["Editing", "Multicam", "Social"],
    favoriteBy: "ROV film team",
    favoriteQuote: "For quick social cut-downs on the road, Premiere is still the fastest place to get from cards to posted.",
    level: "Intermediate",
    oneLiner: "The fast edit room for cutting story and shipping social same-day.",
    whenToUse: "When the priority is a fast, organized cut and quick social versions, not the final color.",
    pairsWith: ["DaVinci Resolve Studio"],
  },
  {
    name: "DaVinci Resolve Studio",
    category: "Color",
    description: "The industry color suite, and a full edit and finish room around it. Node-based grading, real scopes, and the tools to match shots and build a look with intent. The final cut and the color of our recaps live here.",
    url: "https://www.blackmagicdesign.com/products/davinciresolve",
    tags: ["Color", "Finish", "Grading"],
    favoriteBy: "ROV film team",
    favoriteQuote: "Grade with the scopes, not just your eyes. The waveform tells you the truth your tired eyes stop telling you after an hour.",
    level: "Pro",
    oneLiner: "The color and finish suite where the whole look gets built.",
    whenToUse: "The finishing step, when the edit is locked and you want the shots to match and the mood to land.",
    pairsWith: ["Adobe Premiere Pro", "Blackmagic Pocket Cinema Camera 6K Pro"],
  },
  {
    name: "Zoom F3",
    category: "Location sound",
    description: "A tiny two-input field recorder with 32-bit float and preamps that stay clean. In practice it ends the level panic: record now, set the gain in post, and stop losing a take to a clipped or too-quiet input. Pairs with a shotgun or a lav for real location dialogue.",
    url: "https://zoomcorp.com/en/us/field-recorders/field-recorders/f3/",
    tags: ["Audio", "32-bit float", "Field"],
    level: "Intermediate",
    oneLiner: "32-bit float field recording that makes clipped or quiet takes a thing of the past.",
    whenToUse: "Any time dialogue or real location sound matters and you cannot babysit a level meter.",
    pairsWith: ["Blackmagic Pocket Cinema Camera 6K Pro"],
  },
  {
    name: "HandBrake",
    category: "Delivery / compression",
    description: "Free, open-source video transcoding. Turn a heavy master into a clean, right-sized H.264 or H.265 file for the web without guesswork. Sensible presets to start, real control over bitrate and codec when you need the file smaller without looking worse.",
    url: "https://handbrake.fr/",
    tags: ["Encoding", "Free", "Delivery"],
    level: "Beginner",
    oneLiner: "Free transcoding that gets your master small and clean for the web.",
    whenToUse: "The last step before upload, when the master is done and the file needs to travel light.",
    pairsWith: ["DaVinci Resolve Studio"],
  },
];

// Hand-curated industry shifts for the Video / Film sector.
// ⚠️ DRAFT: verify each date and source link before publishing.
const videoSignals: Signal[] = [
  {
    date: "Jun 2026",
    kind: "Trend",
    title: "32-bit float ended the level panic",
    note: "Float recorders mean you set dialogue gain in post, not on set. Missing a take to a clipped or too-quiet input is fast becoming a solved problem.",
    url: "https://zoomcorp.com/en/us/field-recorders/field-recorders/f3/",
  },
  {
    date: "May 2026",
    kind: "Shift",
    title: "AV1 is the new delivery default",
    note: "Platforms keep leaning on AV1 for better quality at a smaller size. Master clean, then let your delivery encode ride the newer codec.",
    url: "https://aomedia.org/",
  },
  {
    date: "Apr 2026",
    kind: "Release",
    title: "Internal RAW reached every tier",
    note: "Gradeable RAW is no longer a high-end-only feature. The gap now is lighting and exposure discipline, not the codec your body records.",
    url: "https://www.blackmagicdesign.com/products/blackmagicpocketcinemacamera",
  },
  {
    date: "Mar 2026",
    kind: "Trend",
    title: "AI relight and roto moved into the timeline",
    note: "Relighting, tracking, and rotoscoping assists now live inside the grade. They speed the grunt work, but the look is still yours to call.",
    url: "https://www.blackmagicdesign.com/products/davinciresolve",
  },
];

// ⚠️ DRAFT myth/reality pairs for Video / Film. Confirm the ROV take.
const videoMisconceptions: Misconception[] = [
  {
    myth: "A cinema camera makes it cinematic",
    reality: "Cinematic is lighting, lens choice, and motion, not the body. A phone shot in beautiful, controlled light will beat a cinema camera in a flat, uncontrolled room every time.",
  },
  {
    myth: "More lights means better lighting",
    reality: "Control beats count. One good source, shaped with a flag and some negative fill, reads better than three fixtures blasting flat, shadowless light from every side. Most of lighting is subtraction.",
  },
  {
    myth: "Always shoot flat or log",
    reality: "Log only pays off with exposure discipline and a real grade. If you cannot expose it right and color it later, a well-set picture profile will look better than mangled, muddy log footage.",
  },
  {
    myth: "Fix it in post",
    reality: "Post amplifies what you captured, it does not invent it. Blown highlights, soft focus, and bad location audio do not come back. Get exposure, focus, and sound right in the room.",
  },
];

// ⚠️ DRAFT quick-start for Video / Film. Verify before publishing.
const videoGuide: { title: string; steps: GuideStep[] } = {
  title: "Lighting Your First Cinematic Setup",
  steps: [
    {
      number: 1,
      title: "Motivate the light before you place it",
      body: "Decide where the light in this scene is supposed to come from: a window, a lamp, the sun. Every fixture you add should sell that source. Unmotivated light is what makes a shot read as filmed, not felt.",
      tip: "One believable direction beats four fixtures pointing everywhere.",
    },
    {
      number: 2,
      title: "Set the key first, alone",
      body: "Kill every other light and place your key. Move it around the subject and watch the shadow it carves. The key decides the whole mood before anything else touches the scene, so get it right in the dark.",
    },
    {
      number: 3,
      title: "Expose for the highlights",
      body: "Protect the bright end. Use false color or zebras and hold your highlights just under clipping. Shadows can be lifted in the grade, but a blown highlight is gone for good. Set white balance on purpose while you are there.",
      tip: "When in doubt, expose a touch under and lift it later.",
    },
    {
      number: 4,
      title: "Separate the subject from the background",
      body: "Add a back or rim light to lift the subject off the backdrop, then use negative fill, a flag or a black flag, to deepen the shadow side. Separation and contrast are what give a flat scene depth.",
    },
    {
      number: 5,
      title: "Record clean sound, it is half the picture",
      body: "Get a mic close, off-axis to the noise, and record with headroom or on 32-bit float. Audiences forgive a rough image far sooner than they forgive dialogue they cannot hear. Sound is half of cinematic.",
    },
  ],
};

// ── EXPORT ──────────────────────────────────────────────

export const toolkitSections: ToolkitSection[] = [
  {
    id: "music",
    title: "Music",
    pageNumber: "01",
    accentColor: "#A56A67",
    intro: "The tools, plugins, and platforms our sound engineers actually use, not what gets promoted on YouTube. From DAWs to distribution, every pick has been tested in real sessions with real artists.",
    blurb: "DAWs, plugins, and platforms our engineers run in real sessions. No sponsored picks.",
    pickCount: "12 Picks",
    cadence: "Updated monthly",
    tools: musicTools,
    misconceptions: musicMisconceptions,
    guide: musicGuide,
    signals: musicSignals,
    crossRefs: [
      {
        toolkit: "design",
        toolName: "Photoshop",
        line: "DistroKid puts the song on streaming, but the cover art sitting beside it is built over in the design kit with Photoshop.",
      },
      {
        toolkit: "design",
        toolName: "Coolors",
        line: "A release needs a visual world, and the palette behind the artwork usually starts with Coolors in the design kit.",
      },
    ],
  },
  {
    id: "web-dev",
    title: "Web Dev",
    pageNumber: "02",
    accentColor: "#E3C24A",
    intro: "Our full development stack, from framework to deployment. These are the tools we build client sites with every day, chosen for speed, reliability, and developer experience.",
    blurb: "The stack we ship client sites on, framework to deploy. Chosen for speed and DX.",
    pickCount: "8 Picks",
    cadence: "Updated monthly",
    tools: webDevTools,
    misconceptions: webDevMisconceptions,
    guide: webDevGuide,
    signals: webDevSignals,
    crossRefs: [
      {
        toolkit: "design",
        toolName: "Figma",
        line: "Figma lives in the design kit too, where the screen gets settled before a single line of Next.js is written.",
      },
      {
        toolkit: "design",
        toolName: "Spline",
        line: "The 3D hero moments Framer Motion brings to life are modelled first with Spline over in the design kit.",
      },
    ],
  },
  {
    id: "design",
    title: "Design",
    pageNumber: "03",
    accentColor: "#4E3D73",
    intro: "The design toolkit our creative team swears by. Interface design, branding, 3D, and everything in between. Curated by designers who ship real client work, not concept pieces.",
    blurb: "Interface, brand, and 3D tools our designers swear by. Curated from real client work.",
    pickCount: "8 Picks",
    cadence: "Updated monthly",
    tools: designTools,
    misconceptions: designMisconceptions,
    guide: designGuide,
    signals: designSignals,
    crossRefs: [
      {
        toolkit: "web-dev",
        toolName: "Next.js",
        line: "A design only counts once it ships, and the screens drawn here get handed to Next.js in the web dev kit.",
      },
      {
        toolkit: "web-dev",
        toolName: "Spline",
        line: "The interactive 3D built in Spline leaves as React components, which the web dev kit picks up and mounts.",
      },
      {
        toolkit: "music",
        toolName: "Antares Auto-Tune",
        line: "Cover art and artist branding shaped here dress the records mixed with Auto-Tune in the music kit.",
      },
    ],
  },
  {
    id: "video",
    title: "Video / Film",
    pageNumber: "04",
    // Lifted plum, the "projection beam" accent. Distinct from design's deeper
    // plum, and legible on both the dark landing and the cream toolkit page.
    accentColor: "#8E76B8",
    intro: "The bodies, glass, lights, and grip our film team actually runs, plus the edit and finish room behind the cut. Cinematic is a craft, not a purchase. These are the picks that reward lighting and exposure done right.",
    blurb: "Camera, glass, light, and finish for cinematic work. The stack behind our set and recaps.",
    pickCount: "8 Picks",
    cadence: "Updated monthly",
    tools: videoTools,
    misconceptions: videoMisconceptions,
    guide: videoGuide,
    signals: videoSignals,
    crossRefs: [
      {
        toolkit: "music",
        toolName: "Soundtoys EchoBoy",
        line: "The location sound captured here gets sweetened next door, where the music kit's EchoBoy and reverbs sit the dialogue in space.",
      },
      {
        toolkit: "design",
        toolName: "Figma",
        line: "Title cards and lower thirds get laid out first in the design kit's Figma before they ever hit the timeline.",
      },
      {
        toolkit: "web-dev",
        toolName: "Next.js",
        line: "The finished recap needs a home, and the web dev kit mounts it in a Next.js page that loads fast.",
      },
    ],
  },
];
