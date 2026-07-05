// ═══════════════════════════════════════════════════════
// CTRL-A — VOLUME 01 · June 2026
// The DreamAsia Fest issue. All content that is specific to
// this volume lives here. Real media drops into
// /public/ctrla/VOL1; everything else is a labelled
// placeholder block at a locked size + aspect ratio.
// ═══════════════════════════════════════════════════════

import type { GalleyRecipe, Volume } from "./types";

// ── The cookbook / galley (one unified recipe list) ─────
// The galley fridge picks the first Meal / Snack / Drink; the
// cookbook teaser highlights the `featured` dish. One source of
// truth: swapping a dish is a one-line edit here.
const galley: GalleyRecipe[] = [
  {
    id: "gyeran-bap",
    category: "meal",
    name: "Gyeran Bap",
    cuisine: "Korean",
    // Contributor credit (placeholder — swap for a real reader submission).
    by: "Daksha, Atlanta",
    featured: true,
    image: "/ctrla/placeholder/cookbook-dish.jpg",
    blurb:
      "The 2am edit-session staple. Hot rice, a glossy fried egg, sesame and soy. Comfort with almost nothing in the fridge.",
    timeMins: 10,
    costUsd: 3,
    serves: 1,
    ingredients: [
      "1 bowl hot cooked rice",
      "1 to 2 eggs",
      "Toasted sesame oil",
      "Soy sauce",
      "Sesame seeds",
      "Optional: seaweed, green onion",
    ],
    steps: [
      "Fry the egg in a little oil, keep the yolk runny.",
      "Tip the hot rice into a bowl, add a small spoon of sesame oil and a splash of soy.",
      "Slide the egg on top, break the yolk, and mix it through.",
      "Finish with sesame seeds and torn seaweed.",
    ],
  },
  {
    id: "menemen",
    category: "meal",
    name: "Menemen",
    cuisine: "Turkish",
    by: "by way of Aysegul",
    blurb:
      "Soft eggs cooked down with tomato and pepper. One pan, scoop it with bread, nothing to plate.",
    timeMins: 15,
    costUsd: 4,
    serves: 2,
    ingredients: [
      "3 eggs",
      "2 tomatoes, or a small tin",
      "1 green pepper",
      "Olive oil",
      "Salt, pepper, pinch of chili",
      "Bread, to serve",
    ],
    steps: [
      "Soften chopped pepper in olive oil for 3 to 4 minutes.",
      "Add chopped tomato and cook down to a loose sauce.",
      "Lower the heat, pour in beaten eggs, and fold gently until just set.",
      "Season, then scoop straight from the pan with bread.",
    ],
  },
  {
    id: "egg-bhurji",
    category: "meal",
    name: "Egg Bhurji",
    cuisine: "Indian",
    by: "by way of DKM",
    blurb:
      "A spiced scramble that turns three eggs and an onion into a real meal. Roll it in roti or pile it on toast.",
    timeMins: 12,
    costUsd: 4,
    serves: 2,
    ingredients: [
      "3 eggs",
      "1 onion",
      "1 tomato",
      "Green chili, optional",
      "Turmeric, chili powder, salt",
      "Oil, fresh coriander",
    ],
    steps: [
      "Fry chopped onion until soft, then add tomato and chili.",
      "Stir in a pinch of turmeric and chili powder.",
      "Pour in the beaten eggs and scramble until just set.",
      "Top with coriander and serve with roti or toast.",
    ],
  },
  {
    id: "cheese-grits",
    category: "meal",
    name: "Cheese Grits",
    cuisine: "Southern · ATL",
    blurb:
      "Hometown comfort in one pot. Creamy, warm, cheap. The bowl you make when the budget is gone but the deadline isn't.",
    timeMins: 15,
    costUsd: 3,
    serves: 2,
    ingredients: [
      "1/2 cup quick grits",
      "2 cups water, or half milk",
      "Butter",
      "Sharp cheddar",
      "Salt, black pepper",
      "Hot sauce, to finish",
    ],
    steps: [
      "Bring the water to a boil, whisk in the grits, and lower the heat.",
      "Stir often for 5 to 7 minutes, until creamy.",
      "Off the heat, stir in butter and a handful of cheddar.",
      "Season well and finish with hot sauce.",
    ],
  },
  {
    id: "miso-toast",
    category: "snack",
    name: "Miso Butter Toast",
    cuisine: "Japanese-ish",
    by: "Kavya, Atlanta",
    blurb:
      "Bread, butter, a smear of miso under the grill. Salt and umami to bridge the gap between renders.",
    timeMins: 4,
    costUsd: 2,
    serves: 1,
    ingredients: ["bread", "butter", "miso paste"],
    steps: [
      "Butter the bread, then spread a thin layer of miso on top.",
      "Grill until the edges catch and the top blisters.",
      "Eat hot, straight off the tray.",
    ],
  },
  {
    id: "focus-tea",
    category: "drink",
    name: "Slow-Brew Focus Tea",
    cuisine: "House blend",
    by: "Ayush, Atlanta",
    blurb:
      "Green tea, ginger, a little honey. The warm reset that settles the mind without the crash.",
    timeMins: 6,
    costUsd: 1,
    serves: 1,
    ingredients: ["green tea", "ginger", "honey", "lemon"],
    steps: [
      "Steep the green tea with a few slices of ginger for 3 to 4 minutes.",
      "Stir in honey and a squeeze of lemon.",
      "Sip slowly, then get back to the work.",
    ],
  },
];

export const vol01: Volume = {
  number: 1,

  issueMeta: {
    volume: "Vol. 01",
    edition: "June 2026",
    cadence: "Monthly",
    tagline: "A digital muse for creatives everywhere.",
    thesis:
      "CTRL-A is how Range Of View plays digital muse to creatives everywhere, helping you see the bigger picture. We go deep on the tools worth your time, walk the whole process with none of the ugly steps skipped, and feature the art we cannot stop thinking about. Because nothing matters more in creative work than taste. Taste is the sky you set as your limit.",
    coverEyebrow: "ROV's monthly field guide for creatives",
    coverHeadline: "See the bigger picture.",
    coverDeck:
      "CTRL-A is ROV's digital muse for creatives everywhere: immersive toolkits, the whole process with none of the ugly steps skipped, and the art we cannot stop thinking about. Because taste is the sky you set as your limit.",
    coverValue:
      "Every volume, free: a deep-dive toolkit for music, web, and design, the real process behind the work, and a brand-kit generator you can use today.",
    featureHeadline: "From the bedroom to the stage.",
    featureDeck:
      "How a small team produced a multi-city festival headline. Sam Suen headlines DreamAsia Fest across two states. Everything that happened before the lights came up.",
    stats: [
      { value: "24", label: "Tools in rotation" },
      { value: "04", label: "Toolkits" },
      { value: "01", label: "Deep feature" },
      { value: "12", label: "Volumes a year" },
    ],
  },

  taste: {
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
  },

  onRepeat: {
    eyebrow: "On repeat · Sound",
    headline: "Two on repeat.",
    note: "What is soundtracking the studio this volume. Hit play, then go make something.",
    tracks: [
      {
        title: "Stars Collide",
        artist: "SAM SUEN, Basu",
        image: "/ctrla/onrepeat/stars-collide.jpg",
        url: "https://open.spotify.com/track/2jAoNrw7bhzNTDoMNJSQz9",
      },
      {
        title: "you could be my woman",
        artist: "Basu",
        image: "/ctrla/onrepeat/you-could-be-my-woman.jpg",
        url: "https://open.spotify.com/track/78bezRj4TvB0XJhpsfOi48",
      },
    ],
  },

  // Vol. 01 — kintsugi, repair in gold (on-theme: nothing hidden).
  artForm: {
    eyebrow: "Form of the volume · Craft",
    form: "Kintsugi",
    origin: "Japan · since the 15th century",
    headline: "Repair, in gold.",
    blurb:
      "Kintsugi mends broken ceramics with lacquer and powdered gold, so the seams become the most beautiful part of the piece. The break is not hidden. It is the point. That is the whole CTRL-A thesis in a bowl: none of the ugly steps skipped, the process worn proudly on the surface.",
    note: "Each volume we sit with one craft, pottery, graffiti, weaving, glass, for what it teaches about taste and patience.",
    pullquote: "The crack is where the gold goes.",
    // Placeholder stock photo until we shoot/source the real piece.
    image: "/ctrla/placeholder/artform-kintsugi.jpg",
  },

  galley,

  cookbook: {
    eyebrow: "The Cookbook · Fuel for the work",
    headline: "The Cookbook.",
    lede: "A digital muse feeds the maker, too.",
    note: "Easy recipes from the cultures we work with, built for creatives short on time and money. Real food, few ingredients, done before your render finishes.",
    // The teaser draws from the same unified list the fridge uses.
    recipes: galley,
    // Chef of the volume — one rotating slot, edited per issue. Photo optional;
    // drop a headshot in /public and point `photo` here when the team has one.
    chef: {
      name: "Andi",
      city: "Atlanta",
      bio: "ROV's founder. Cooks the way he edits: fast, few ingredients, nothing wasted.",
    },
    // Deferred lead-capture hook. Points at /contact today; swap for the real
    // submission form URL when it exists, no component change needed.
    submitUrl: "/contact",
  },

  artists: [
    {
      name: "Sam Suen",
      discipline: "Korean-American R&B",
      feature: true,
      blurb:
        "A bedroom producer turned festival headliner. Sam writes the kind of R&B that sounds like 2am in a city that never quite sleeps: intimate, patient, and built to fill a room the moment it needs to.",
      quote: "The stage at DreamAsia wasn't a destination. It was just the next logical step.",
    },
  ],

  spotlight: {
    eyebrow: "ROV Spotlight · Vol. 01",
    headline: "Producing DreamAsia Fest, end to end.",
    body:
      "When Sam Suen needed a set ready for DreamAsia, ROV ran the whole pipeline, demos to mix, stage to screen. The records were built and mixed in-house, the visuals shot and cut in-house, and the whole thing pulled together on a deadline that didn't move. No outsourcing, no hand-offs. The work below is the proof.",
    tools: ["FL Studio", "DaVinci Resolve", "Premiere Pro", "BMPCC 6K", "Canon", "Claude"],
    image: undefined,
  },

  // Atlanta (Mercedes-Benz Stadium) is a host city for the FIFA World Cup
  // 2026. Each event links out to an authoritative source; these outbound
  // citations + the structured data aid SEO/GEO.
  events: [
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
  ],

  eventSources: [
    { label: "FIFA World Cup 26™", url: "https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026" },
    { label: "Mercedes-Benz Stadium", url: "https://www.mercedesbenzstadium.com/" },
    { label: "Atlanta Sports Council", url: "https://www.atlsports.org/" },
    { label: "Discover Atlanta, World Cup 2026", url: "https://discoveratlanta.com/fifa-world-cup-2026/" },
  ],

  eventsCover: {
    src: "/ctrla/VOL1/fanfestatl.webp",
    alt: "FIFA Fan Festival crowd in Atlanta",
    label: "FIFA Fan Festival · Atlanta",
  },

  vueClose: {
    eyebrow: "Vue · Closing note",
    body:
      "I drift a little above all this, watching what you build, or don't. One thing before you go. The time passes either way. The year runs out whether you make the thing or you don't. So press CTRL-A, pull back far enough to see the whole picture, and do it anyway.",
    signoff: "The time will pass regardless. Do it anyway.",
    signature: "Vue · Vol. 01 · CTRL-A",
  },

  // ── The deep feature — DreamAsia Fest ────────────────
  feature: {
    href: "/ctrla/dreamasia",

    coverShot: {
      src: "/ctrla/VOL1/dreamasiacover.webp",
      alt: "Sam Suen mid-set at DreamAsia Fest, stage visuals and crowd behind him",
      label: "HERO: peak performance frame",
    },

    issueOpen: {
      eyebrow: "The story · How it started",
      headline: "Two friends, one deadline, a festival stage.",
      body: [
        "Sam Suen and the ROV team have made music together since high school: bedroom sessions, borrowed gear, songs nobody had asked for yet. DreamAsia Fest is the same two friends, years on, headlining a national celebration of Asian entertainment, food, and culture across two states.",
        "Nothing about the setup got bigger overnight. The crew stayed small. What changed was the reps, and the nerve to run the whole thing themselves, from the first demo to the last light cue.",
      ],
      vueNote:
        "Underdog math: a small crew, a big room, and nobody coming to save the show. They built it anyway.",
      stage: {
        src: "/ctrla/VOL1/dreamasiafestpic2.webp",
        label: "The stage · first load-in",
        ratio: "4 / 5",
      },
    },

    bts: {
      eyebrow: "Behind the scenes · The real work",
      headline: "Everything before the lights came up.",
      note: "Load-in, the fan fest, front of house, the room before doors. The part the audience never sees, and the reason the show worked.",
      tiles: [
        { label: "Crew load-in & stage build", ratio: "16 / 9", span: 8, wide: true, video: "/ctrla/VOL1/Dreamasiafest.mp4" },
        { label: "The fan fest · Atlanta", ratio: "1 / 1", span: 4, img: "/ctrla/VOL1/fanfestatl.webp" },
        { label: "Front of house & lighting", ratio: "16 / 9", span: 6, video: "/ctrla/VOL1/concert1.mp4" },
        { label: "The room, pre-show", ratio: "16 / 9", span: 6, video: "/ctrla/VOL1/Dreamasiacirc.mp4" },
      ],
    },

    // ── Beat 3 · The Turn ────────────────────────────────
    // DRAFT COPY FOR ANDI TO VERIFY. This is a plausible, ROV-voice
    // reconstruction of the production turn, not the confirmed story.
    // Swap in the true detail (the real venue, the real hour) before
    // this ships, or cut it back to what actually happened.
    turn: {
      eyebrow: "The turn · What nearly broke it",
      headline: "The night the show almost did not fit.",
      body: [
        "The whole visual show was built for the North Carolina stage: deep, wide, room behind the band for the projection to breathe. Georgia was a different room. When the crew walked the second venue the afternoon before doors, the stage was shallower by a third, the screen sat closer, and every cue timed to the first build now landed in the wrong place. Nothing was broken. It just did not fit.",
        "There were two honest options. Run the show as-is and let half the visuals fall off the edges, or re-cut the entire package overnight for a stage nobody had measured until that afternoon. The team took the second one. They pulled the projection files back into Resolve at the hotel, re-framed every scene to the new ratio, and re-timed the cues to a stage they were rebuilding in their heads.",
        "The recut wrapped a little after three. Doors were at seven. Nobody in the crowd knew the show they watched was twelve hours old.",
      ],
      pullquote: "Run it broken, or rebuild it overnight. They rebuilt it.",
    },

    twoCities: {
      eyebrow: "Two cities · The scale",
      headline: "The same headline show. Twice. Two states.",
      body: "DreamAsia ran in North Carolina and Georgia: the same production, rebuilt on a new stage, for a new crowd, days apart. Delivering it once is a show. Delivering it twice is an operation.",
      panel: {
        src: "/ctrla/VOL1/dreamasiateam.jpg",
        label: "The crew who ran both rooms",
        ratio: "16 / 9",
      },
    },

    productionToolkit: {
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
      ],
    },
  },
};
