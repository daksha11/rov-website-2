// ═══════════════════════════════════════════════════════
// CTRL A MAGAZINE, CONTENT DATA
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
}

// ── ISSUE MASTHEAD / STATS ──────────────────────────────

export interface IssueStat {
  value: string;
  label: string;
}

export const issueMeta = {
  volume: "Vol. 01",
  edition: "June 2026",
  cadence: "Monthly",
  tagline: "A digital muse for creatives everywhere.",
  // The thesis: what CTRL-A is, and why these sections belong together.
  thesis:
    "CTRL-A is how Range Of View plays digital muse to creatives everywhere, helping you see the bigger picture. We go deep on the tools worth your time, walk the whole process with none of the ugly steps skipped, and feature the art we cannot stop thinking about. Because nothing matters more in creative work than taste. Taste is the sky you set as your limit.",
  coverEyebrow: "ROV's monthly field guide for creatives",
  coverHeadline: "See the bigger picture.",
  coverDeck:
    "CTRL-A is ROV's digital muse for creatives everywhere: immersive toolkits, the whole process with none of the ugly steps skipped, and the art we cannot stop thinking about. Because taste is the sky you set as your limit.",
  // The volume's deep feature, kept separate from the cover thesis.
  featureHeadline: "From the bedroom to the stage.",
  featureDeck:
    "How a small team produced a multi-city festival headline. Sam Suen headlines DreamAsia Fest across two states. Everything that happened before the lights came up.",
  stats: [
    { value: "24", label: "Tools in rotation" },
    { value: "03", label: "Toolkits" },
    { value: "01", label: "Deep feature" },
    { value: "12", label: "Volumes a year" },
  ] as IssueStat[],
};

// ── TASTE / FEATURED ART ────────────────────────────────
// "We feature the art we can't stop thinking about." One feature per
// volume, any discipline. Taste is the throughline.
export const taste = {
  eyebrow: "Featured art · Taste",
  headline: "Taste.",
  lede: "Taste is the sky you set as your limit.",
  note: "Every volume we feature one artist whose work we cannot stop thinking about. Not the loudest. The truest.",
  openCall: {
    title: "Featured next volume?",
    body: "One artist a volume, across any discipline. If you are making something true, show us.",
    cta: "Send us the work",
    email: "admin@pursuenetworking.com",
  },
};

// ── THE COOKBOOK ────────────────────────────────────────
// A digital muse feeds the maker too. Easy recipes from the
// cultures we work with, built for creatives short on time
// and money. Recurring standing feature, refreshed per volume.

export interface Recipe {
  name: string;
  origin: string;
  /** the collaborator / culture it comes by way of */
  by?: string;
  time: string;
  cost: string;
  serves: string;
  blurb: string;
  ingredients: string[];
  steps: string[];
  /** the volume's sneak-peek dish, the most appetising one */
  featured?: boolean;
  /** optional hero food photo for the sneak peek */
  image?: string;
}

export const cookbook = {
  eyebrow: "The Cookbook · Fuel for the work",
  headline: "The Cookbook.",
  lede: "A digital muse feeds the maker, too.",
  note: "Easy recipes from the cultures we work with, built for creatives short on time and money. Real food, few ingredients, done before your render finishes.",
  recipes: [
    {
      name: "Gyeran Bap",
      origin: "Korean",
      by: "by way of DreamAsia",
      time: "10 min",
      cost: "About $3",
      serves: "1",
      featured: true,
      blurb: "The 2am edit-session staple. Hot rice, a glossy fried egg, sesame and soy. Comfort with almost nothing in the fridge.",
      ingredients: ["1 bowl hot cooked rice", "1 to 2 eggs", "Toasted sesame oil", "Soy sauce", "Sesame seeds", "Optional: seaweed, green onion"],
      steps: [
        "Fry the egg in a little oil, keep the yolk runny.",
        "Tip the hot rice into a bowl, add a small spoon of sesame oil and a splash of soy.",
        "Slide the egg on top, break the yolk, and mix it through.",
        "Finish with sesame seeds and torn seaweed.",
      ],
    },
    {
      name: "Menemen",
      origin: "Turkish",
      by: "by way of Aysegul",
      time: "15 min",
      cost: "About $4",
      serves: "2",
      blurb: "Soft eggs cooked down with tomato and pepper. One pan, scoop it with bread, nothing to plate.",
      ingredients: ["3 eggs", "2 tomatoes, or a small tin", "1 green pepper", "Olive oil", "Salt, pepper, pinch of chili", "Bread, to serve"],
      steps: [
        "Soften chopped pepper in olive oil for 3 to 4 minutes.",
        "Add chopped tomato and cook down to a loose sauce.",
        "Lower the heat, pour in beaten eggs, and fold gently until just set.",
        "Season, then scoop straight from the pan with bread.",
      ],
    },
    {
      name: "Egg Bhurji",
      origin: "Indian",
      by: "by way of DKM",
      time: "12 min",
      cost: "About $4",
      serves: "2",
      blurb: "A spiced scramble that turns three eggs and an onion into a real meal. Roll it in roti or pile it on toast.",
      ingredients: ["3 eggs", "1 onion", "1 tomato", "Green chili, optional", "Turmeric, chili powder, salt", "Oil, fresh coriander"],
      steps: [
        "Fry chopped onion until soft, then add tomato and chili.",
        "Stir in a pinch of turmeric and chili powder.",
        "Pour in the beaten eggs and scramble until just set.",
        "Top with coriander and serve with roti or toast.",
      ],
    },
    {
      name: "Cheese Grits",
      origin: "Southern · ATL",
      time: "15 min",
      cost: "About $3",
      serves: "2",
      blurb: "Hometown comfort in one pot. Creamy, warm, cheap. The bowl you make when the budget is gone but the deadline isn't.",
      ingredients: ["1/2 cup quick grits", "2 cups water, or half milk", "Butter", "Sharp cheddar", "Salt, black pepper", "Hot sauce, to finish"],
      steps: [
        "Bring the water to a boil, whisk in the grits, and lower the heat.",
        "Stir often for 5 to 7 minutes, until creamy.",
        "Off the heat, stir in butter and a handful of cheddar.",
        "Season well and finish with hot sauce.",
      ],
    },
  ] as Recipe[],
};

// ── ATL ARTIST SHOWCASE ─────────────────────────────────

export interface Artist {
  name: string;
  discipline: string;
  blurb: string;
  quote: string;
  feature?: boolean; // larger card
  image?: string;
}

export const artists: Artist[] = [
  {
    name: "Sam Suen",
    discipline: "Korean-American R&B",
    feature: true,
    blurb:
      "A bedroom producer turned festival headliner. Sam writes the kind of R&B that sounds like 2am in a city that never quite sleeps: intimate, patient, and built to fill a room the moment it needs to.",
    quote: "The stage at DreamAsia wasn't a destination. It was just the next logical step.",
  },
];

// ── ROV SPOTLIGHT ───────────────────────────────────────

export const spotlight = {
  eyebrow: "ROV Spotlight · Vol. 01",
  headline: "Producing DreamAsia Fest, end to end.",
  body:
    "When Sam Suen needed a set ready for DreamAsia, ROV ran the whole pipeline, demos to mix, stage to screen. The records were built and mixed in-house, the visuals shot and cut in-house, and the whole thing pulled together on a deadline that didn't move. No outsourcing, no hand-offs. The work below is the proof.",
  tools: ["FL Studio", "DaVinci Resolve", "Premiere Pro", "BMPCC 6K", "Canon", "Claude"],
  image: undefined as string | undefined,
};

// ── ATL EVENTS, FIFA World Cup 26, Atlanta ─────────────
// Atlanta (Mercedes-Benz Stadium) is a host city for the FIFA World
// Cup 2026. Each event links out to an authoritative source, these
// outbound citations + the structured data below aid SEO/GEO.

export interface IssueEvent {
  date: string;
  /** ISO date for schema.org structured data. */
  isoDate: string;
  name: string;
  location: string;
  /** Full venue address for structured data. */
  venue: string;
  badge: "Free" | "Ticketed";
  /** Authoritative outbound link (official source), backlink for SEO/GEO. */
  url: string;
}

export const events: IssueEvent[] = [
  {
    date: "Jun 15",
    isoDate: "2026-06-15",
    name: "FIFA World Cup 26™, Atlanta Group Stage",
    location: "Mercedes-Benz Stadium, ATL",
    venue: "Mercedes-Benz Stadium, 1 AMB Dr NW, Atlanta, GA 30313",
    badge: "Ticketed",
    url: "https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026",
  },
  {
    date: "Jun 20",
    isoDate: "2026-06-20",
    name: "FIFA Fan Festival™ Atlanta",
    location: "Centennial Olympic Park, ATL",
    venue: "Centennial Olympic Park, 265 Park Ave W NW, Atlanta, GA 30313",
    badge: "Free",
    url: "https://discoveratlanta.com/fifa-world-cup-2026/",
  },
  {
    date: "Jul 07",
    isoDate: "2026-07-07",
    name: "FIFA World Cup 26™, Atlanta Round of 16",
    location: "Mercedes-Benz Stadium, ATL",
    venue: "Mercedes-Benz Stadium, 1 AMB Dr NW, Atlanta, GA 30313",
    badge: "Ticketed",
    url: "https://www.mercedesbenzstadium.com/fifa-world-cup-2026",
  },
];

/** Section cover image for the FIFA events block. */
export const eventsCover = {
  src: "/ctrla/VOL1/fanfestatl.webp",
  alt: "FIFA Fan Festival crowd in Atlanta",
  label: "FIFA Fan Festival · Atlanta",
};

/** Authoritative outbound references shown under the events list. */
export const eventSources: { label: string; url: string }[] = [
  { label: "FIFA World Cup 26™", url: "https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026" },
  { label: "Mercedes-Benz Stadium", url: "https://www.mercedesbenzstadium.com/" },
  { label: "Atlanta Sports Council", url: "https://www.atlsports.org/" },
  { label: "Discover Atlanta, World Cup 2026", url: "https://discoveratlanta.com/fifa-world-cup-2026/" },
];

// ── VUE, CLOSING NOTE ──────────────────────────────────

export const vueClose = {
  eyebrow: "Vue · Closing note · DreamAsia Fest",
  body:
    "I spend most of my time drifting a little above all this, watching what you build. DreamAsia wasn't supposed to be possible for a team this size, too many cities, too many moving parts, not enough hands. They did it anyway. That's the only lesson worth keeping: the gap between a bedroom setup and a festival stage isn't money or gear or a lucky break. It's reps, and the nerve to run the whole thing yourself. Sam and the crew had both. So can you.",
  signoff: "See you next volume.",
  signature: "Vue · Vol. 01 · CTRL-A",
};

// ═══════════════════════════════════════════════════════
// DREAMASIA FEST, FEATURE ISSUE CONTENT
// Real media drops into /ctrla/VOL1; everything else is a
// labelled placeholder block at locked size + aspect ratio.
// ═══════════════════════════════════════════════════════

// ── Cover ──────────────────────────────────────────────
export const coverShot = {
  src: "/ctrla/VOL1/dreamasiacover.webp",
  alt: "Sam Suen mid-set at DreamAsia Fest, stage visuals and crowd behind him",
  label: "HERO: peak performance frame",
};

// ── 1. The story, how it started ───────────────────────
export const issueOpen = {
  eyebrow: "The story · How it started",
  headline: "Two friends, one deadline, a festival stage.",
  body: [
    "Sam Suen and the ROV team have made music together since high school: bedroom sessions, borrowed gear, songs nobody had asked for yet. DreamAsia Fest is the same two friends, years on, headlining a national celebration of Asian entertainment, food, and culture across two states.",
    "Nothing about the setup got bigger overnight. The crew stayed small. What changed was the reps, and the nerve to run the whole thing themselves, from the first demo to the last light cue.",
  ],
  vueNote:
    "Underdog math: a small crew, a big room, and nobody coming to save the show. They built it anyway.",
  prep: { label: "EARLY PREP: bedroom / studio setup", ratio: "4 / 5" as const },
  stage: {
    src: "/ctrla/VOL1/dreamasiafestpic2.webp",
    label: "THE BIG STAGE: first load-in",
    ratio: "4 / 5" as const,
  },
};

// ── 2. Behind the scenes (HERO gallery) ────────────────
export interface BtsTile {
  label: string;
  ratio: string;
  /** column span on the 12-col mosaic (desktop). */
  span: number;
  /** full-bleed row on mobile. */
  wide?: boolean;
  img?: string;
  video?: string;
}

export const bts = {
  eyebrow: "Behind the scenes · The real work",
  headline: "Everything before the lights came up.",
  note: "Fan experience, stage visuals, soundcheck, load-in. The part the audience never sees, and the reason the show worked.",
  tiles: [
    { label: "BTS: crew load-in & stage build", ratio: "16 / 9", span: 8, wide: true, video: "/ctrla/VOL1/Dreamasiafest.mp4" },
    { label: "BTS: stage visuals on the wall", ratio: "4 / 5", span: 4, img: "/ctrla/VOL1/dreamasiafestpic2.webp" },
    { label: "BTS: the sound board, mid-soundcheck", ratio: "1 / 1", span: 4 },
    { label: "BTS: fan experience setup", ratio: "1 / 1", span: 4 },
    { label: "BTS: Sam at soundcheck", ratio: "1 / 1", span: 4 },
    { label: "BTS: front of house & lighting", ratio: "16 / 9", span: 6, video: "/ctrla/VOL1/concert1.mp4" },
    { label: "BTS: backstage, pre-show", ratio: "16 / 9", span: 6, video: "/ctrla/VOL1/Dreamasiacirc.mp4" },
    { label: "BTS: doors open, the room fills", ratio: "21 / 9", span: 12, wide: true },
  ] as BtsTile[],
};

// ── 3. Two cities, the scale ───────────────────────────
export const twoCities = {
  eyebrow: "Two cities · The scale",
  headline: "The same headline show. Twice. Two states.",
  body: "DreamAsia ran in North Carolina and Georgia: the same production, rebuilt on a new stage, for a new crowd, days apart. Delivering it once is a show. Delivering it twice is an operation.",
  cities: [
    { state: "North Carolina", label: "NC: crowd at peak", note: "Where it opened. New venue, a new room to read.", ratio: "4 / 5" as const },
    { state: "Georgia", label: "GA: the headline set", note: "Where it closed. Same show, dialled in and bigger.", ratio: "4 / 5" as const },
  ],
};

// ── 4. The toolkit, what you can use ───────────────────
export interface ProdTool {
  name: string;
  role: string;
  line: string;
}

export const productionToolkit = {
  eyebrow: "The toolkit · What you can use",
  headline: "How it was made, so you can too.",
  note: "The exact stack behind the records, the visuals, and the cut. Steal the workflow.",
  tools: [
    { name: "FL Studio", role: "Records & demos", line: "Where the songs started: beats and demos built in the box." },
    { name: "DaVinci Resolve", role: "Color & finish", line: "The final cut and the color. The recap's whole look lives here." },
    { name: "Premiere Pro", role: "Edit & social", line: "Fast turnarounds and social cut-downs while the tour moved." },
    { name: "BMPCC 6K Pro", role: "A-cam", line: "Our cinema camera for the set and the crowd in full frame." },
    { name: "Canon", role: "B-cam & stills", line: "Run-and-gun coverage and stills, backstage to front of house." },
    { name: "Claude", role: "Run-of-show", line: "Show notes, run-of-show, and copy, all drafted fast so the team could move." },
  ] as ProdTool[],
};

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

// ── EXPORT ──────────────────────────────────────────────

export const toolkitSections: ToolkitSection[] = [
  {
    id: "music",
    title: "Music",
    pageNumber: "01",
    accentColor: "#A56A67",
    intro: "The tools, plugins, and platforms our sound engineers actually use, not what gets promoted on YouTube. From DAWs to distribution, every pick has been tested in real sessions with real artists.",
    blurb: "DAWs, plugins, and platforms our engineers run in real sessions. No sponsored picks.",
    pickCount: "8 Picks",
    cadence: "Updated monthly",
    tools: musicTools,
    misconceptions: musicMisconceptions,
    guide: musicGuide,
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
  },
];
