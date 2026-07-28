import type { PlaybookContent } from "./types";

// Ported and reframed from an internal ROV research tool into agent-facing educational
// content. Verbatim quotes and named sources are kept as-is (they're real, attributed
// public statements). Anything addressed to a hypothetical vendor/salesperson reading
// this to pitch agents has been rewritten to speak directly to the agent, or to a
// neutral reader curious how the business actually works.

export const realEstateAgentsPlaybook: PlaybookContent = {
  slug: "real-estate-agents",
  seo: {
    title: "What Real Estate Agents Actually Take Home (And Why)",
    description:
      "An interactive breakdown of real estate commissions, the industry ecosystem, and real agent pain points. Plug in your own numbers.",
    ogTitle: "What Real Estate Agents Actually Take Home (And Why)",
    ogDescription:
      "Drag the sliders and see what an agent really keeps after brokerage splits, team splits, and taxes. Plus the ecosystem, the vocabulary, and an Atlanta competitive teardown.",
    ogImage: "/og/og-default.webp",
  },
  breadcrumb: "Resources · Playbook · Real Estate",
  kicker: "ROV Studios · Real Estate Playbook",
  h1: "What Real Estate Agents Actually Take Home",
  heroSubtitle:
    "How the money moves, what actually hurts, the words agents use versus the words vendors use, and who's winning in Atlanta right now. Drag the sliders, read the quotes, run the numbers.",
  dateISO: "2026-07-03",
  dateDisplay: "July 2026",
  authorName: "Suchet Konda",
  authorRole: "Co-Founder & Systems Architect",
  stats: [
    { value: "~$25K", label: "Median agent net income / yr" },
    { value: "2.4", label: "Agents competing per home sale" },
    { value: "~50%", label: "Buyer inquiries never answered" },
    { value: "4–6×", label: "ROI of referrals vs. internet leads" },
  ],
  tabs: [
    { id: "overview", label: "Overview" },
    { id: "money", label: "Money Flow" },
    { id: "players", label: "The Players" },
    { id: "pain", label: "Their Pain" },
    { id: "vocab", label: "Their Words" },
    { id: "comp", label: "The Competition" },
  ],
  overview: {
    sectionLabel: "The one-paragraph truth",
    heading: "Agents are their own marketing department, whether they planned to be or not",
    lead: "Every real estate agent is a 1099 small-business owner who only gets paid when a deal closes. The brokerage takes a cut every year, the portals sell shared leads at a brutal cost per closing, and a 2024 legal change now requires agents to put their value in writing before they do any work at all. The best lead source most agents have, their own past clients, is almost never systematized. That gap is where a lot of income quietly disappears.",
    cards: [
      {
        tag: "Brand",
        title: "Front-end brand, leaky back-end",
        body: "Even Atlanta's top agents win on brand and fumble the funnel: dated websites, unanswered inquiries, no real follow-up system. Being good at the visible half of the job doesn't fix the invisible half.",
      },
      {
        tag: "Language",
        title: "Listings, not \"leads\"",
        body: "The industry runs on listing appointments and closings, not \"lead generation\" or \"brand awareness.\" If a tool or vendor talks to you in that language, it's usually a sign they don't understand how the job actually works.",
      },
      {
        tag: "Reality",
        title: "\"Maybe it just isn't for me\"",
        body: "For a lot of agents the pain isn't \"I want more leads.\" It's watching fees eat every closing and starting to wonder if the whole career was a mistake. That doubt is common, and it's usually a systems problem, not a talent problem.",
      },
    ],
    calloutLabel: "How to use this page",
    calloutText:
      "Work through the tabs top to bottom. Money Flow has a live calculator, drag the sliders and see what an agent actually takes home on a deal. Their Words has a study mode to test the vocabulary. The Competition tab breaks down five real Atlanta agents and teams.",
  },
  moneyFlow: {
    sectionLabel: "Follow the money",
    heading: "What an agent actually takes home",
    lead: "The seller pays roughly 5.5% commission. It splits four times before it reaches the agent's pocket. Drag the sliders below, this is why a junior agent closing a $1M deal can walk away with barely enough to cover a tank of gas.",
    calloutLabel: "Why this matters",
    calloutText:
      "On a normal Atlanta deal, the agent keeps a fraction of what the sign in the yard implies, and pays for their own marketing out of what's left over. A deal an agent sources directly, instead of one fed through a team or a paid portal lead, is worth two to three times as much once every split is accounted for. That's the real math behind \"own your own pipeline.\"",
    sourceNote:
      "Sources: US Realty Training (commissions), Colibri (broker splits), Jamil Academy (agent income), Inman.",
  },
  players: {
    sectionLabel: "The ecosystem",
    heading: "Who's who, and how money moves between them",
    lead: "Real estate is a web of independent contractors, all orchestrated around one transaction. Understanding who depends on whom explains a lot about how agents actually build (or lose) a business.",
    calloutLabel: "The referral web",
    calloutText:
      "An agent has to keep three relationships healthy: their sphere (referrals), their loan officer (borrower flow and co-marketing dollars), and their broker or team lead (license and leads). The loan-officer relationship is the most overlooked, plenty of loan officers will help co-fund an agent's marketing because their business depends on it too.",
    flowModes: [
      {
        key: "money",
        label: "Money at the closing table",
        viewBox: [0, 0, 1000, 720],
        note: "Illustrative: a $400,000 Atlanta sale at 5.5% commission, 20% down, a 70/30 broker split, agent on a team. The sign out front says $22,000 of commission; the agent walks with under $4,000.",
        legend: [
          { color: "#90422C", label: "money flowing at closing" },
          { color: "#A6402C", label: "money the agent pays out" },
        ],
        nodes: [
          { id: "buyer", x: 60, y: 24, w: 180, h: 54, title: "Buyer", sub: "down payment + closing costs" },
          { id: "lender", x: 760, y: 24, w: 190, h: 54, title: "Lender", sub: "funds the mortgage" },
          { id: "appr", x: 24, y: 150, w: 158, h: 46, title: "Appraiser", sub: "~$550 · buyer pays" },
          { id: "insp", x: 24, y: 212, w: 158, h: 46, title: "Home inspector", sub: "~$450 · buyer pays" },
          { id: "haz", x: 24, y: 274, w: 158, h: 46, title: "Hazard insurance", sub: "~$1,500/yr · buyer" },
          { id: "sale", x: 365, y: 128, w: 280, h: 64, title: "The sale · $400,000", sub: "closing attorney (GA) runs it", variant: "hub" },
          { id: "seller", x: 790, y: 150, w: 186, h: 56, title: "Seller (net)", sub: "≈ $366,000 proceeds" },
          { id: "atty", x: 230, y: 250, w: 158, h: 46, title: "Closing attorney", sub: "~$1,000" },
          { id: "title", x: 410, y: 250, w: 150, h: 46, title: "Title insurance", sub: "~$1,400" },
          { id: "govt", x: 600, y: 250, w: 180, h: 46, title: "Transfer tax (GA)", sub: "~$400" },
          { id: "pool", x: 360, y: 342, w: 250, h: 56, title: "Commission pool", sub: "$22,000 (5.5%)", variant: "hub" },
          { id: "lbroker", x: 246, y: 444, w: 186, h: 50, title: "Listing broker", sub: "$11,000 · list side" },
          { id: "bbroker", x: 560, y: 444, w: 186, h: 50, title: "Buyer broker", sub: "$11,000 · buyer side" },
          { id: "lagent", x: 246, y: 536, w: 186, h: 50, title: "Listing agent", sub: "$7,700 after split" },
          { id: "bagent", x: 560, y: 536, w: 186, h: 50, title: "Buyer agent", sub: "$7,700 after split" },
          { id: "team", x: 560, y: 628, w: 240, h: 56, title: "Team lead keeps 50%", sub: "agent walks with ≈ $3,850", variant: "warn" },
        ],
        links: [
          { from: "buyer", to: "sale", label: "$80k down", kind: "in" },
          { from: "lender", to: "sale", label: "$320k loan", kind: "in" },
          { from: "buyer", to: "appr", kind: "pay" },
          { from: "buyer", to: "insp", kind: "pay" },
          { from: "buyer", to: "haz", kind: "pay" },
          { from: "sale", to: "seller", label: "net ≈ $366k", kind: "in" },
          { from: "sale", to: "pool", label: "$22,000", kind: "in" },
          { from: "sale", to: "atty", kind: "in" },
          { from: "sale", to: "title", kind: "in" },
          { from: "sale", to: "govt", kind: "in" },
          { from: "pool", to: "lbroker", label: "$11,000", kind: "in" },
          { from: "pool", to: "bbroker", label: "$11,000", kind: "in" },
          { from: "lbroker", to: "lagent", label: "$7,700", kind: "in" },
          { from: "bbroker", to: "bagent", label: "$7,700", kind: "in" },
          { from: "bagent", to: "team", label: "−$3,850", kind: "pay" },
        ],
      },
      {
        key: "leads",
        label: "Leads & referrals",
        viewBox: [0, 0, 1000, 660],
        note: "How business (not closing money) reaches an agent. Rust = business coming in. Red = what the agent pays for it. The sphere is free and the best source, yet almost no agent systematizes it, that's the biggest gap in the whole ecosystem.",
        legend: [
          { color: "#90422C", label: "leads / referrals in" },
          { color: "#A6402C", label: "what the agent pays out" },
        ],
        nodes: [
          { id: "sphere", x: 40, y: 40, w: 210, h: 56, title: "Sphere / past clients", sub: "referrals · free · best source" },
          { id: "lo", x: 750, y: 40, w: 210, h: 56, title: "Loan officer", sub: "trades clients · co-funds marketing" },
          { id: "other", x: 40, y: 300, w: 210, h: 56, title: "Another agent", sub: "referral · 25% fee" },
          { id: "portal", x: 750, y: 300, w: 210, h: 56, title: "Zillow / portals", sub: "shared, low-convert leads", variant: "warn" },
          { id: "dev", x: 40, y: 556, w: 210, h: 56, title: "Developer / builder", sub: "inventory to list" },
          { id: "vend", x: 750, y: 556, w: 210, h: 56, title: "Title / insurance vendors", sub: "referral partners" },
          { id: "agent", x: 388, y: 296, w: 224, h: 74, title: "THE AGENT", sub: "the hub everyone feeds", variant: "hub" },
          { id: "client", x: 398, y: 556, w: 204, h: 56, title: "Buyer / seller", sub: "pays the commission" },
        ],
        links: [
          { from: "sphere", to: "agent", label: "referrals (free)", kind: "in" },
          { from: "lo", to: "agent", label: "sends buyers", kind: "in" },
          { from: "agent", to: "lo", label: "sends borrowers", kind: "in" },
          { from: "other", to: "agent", label: "referral", kind: "in" },
          { from: "agent", to: "other", label: "25% fee", kind: "pay" },
          { from: "portal", to: "agent", label: "shared leads", kind: "in" },
          { from: "agent", to: "portal", label: "$$ you pay", kind: "pay" },
          { from: "dev", to: "agent", label: "listings", kind: "in" },
          { from: "vend", to: "agent", label: "perks + referrals", kind: "in" },
          { from: "client", to: "agent", label: "commission", kind: "in" },
        ],
      },
    ],
    roles: [
      { title: "Solo agent", description: "1099 salesperson under a broker's license. Prospects, shows, negotiates, closes. The most common role in the industry.", moneyNote: "nets 35–55% of gross" },
      { title: "Team lead", description: "Top producer who hires junior agents and a coordinator, then feeds them leads for a split.", moneyNote: "takes 40–50% of team deals" },
      { title: "Managing broker", description: "Holds the license agents hang under; provides compliance, MLS access, and E&O insurance. Takes a cut of every deal.", moneyNote: "split or cap per deal" },
      { title: "Loan officer", description: "The buyer's mortgage contact. Lives on agent referrals and co-markets constantly.", moneyNote: "co-funds agent marketing" },
      { title: "Transaction coordinator", description: "Runs paperwork contract-to-close so the agent can focus on selling. Usually a sign an agent is doing real volume.", moneyNote: "~$300–500 / file" },
      { title: "Title / escrow", description: "Runs closing, verifies title, holds funds. Courts agents to stay on the preferred-vendor list.", moneyNote: "paid at closing" },
      { title: "Closing attorney (GA)", description: "Georgia is an attorney-closing state, a real estate lawyer runs the closing, handles documents, and disburses funds.", moneyNote: "~$1,000+ / closing" },
      { title: "Title insurance", description: "Insures the buyer and lender against title defects. Sold through the attorney or title company at closing.", moneyNote: "~$1,000–1,800 one-time" },
      { title: "Hazard insurance", description: "The homeowner's policy a lender requires before funding. Written by an insurance agent who's usually a co-marketing partner.", moneyNote: "~$1,500/yr · buyer pays" },
      { title: "Appraiser", description: "An independent value opinion so the lender doesn't over-lend. Ordered by the lender, paid by the buyer.", moneyNote: "~$500–600 · buyer pays" },
      { title: "Home inspector", description: "Evaluates the physical condition of the property during due diligence. Hired and paid by the buyer.", moneyNote: "~$400–500 · buyer pays" },
      { title: "Developer / builder", description: "Land, entitlement, build, sell. Uses agents to move inventory, and usually treats marketing as a soft cost.", moneyNote: "project-based budgets" },
      { title: "Wholesaler / investor", description: "The off-market cash economy. Runs large direct-outreach engines to find motivated sellers.", moneyNote: "$5K–$30K assignment fees" },
      { title: "The sphere", description: "Past clients and personal network. The highest-ROI lead source there is (4–6× internet leads), and almost never systematized.", moneyNote: "free · un-systematized" },
    ],
  },
  pain: {
    sectionLabel: "In their own words",
    heading: "What agents are actually saying",
    lead: "Verbatim, pulled from forums, reviews, and industry press. Filter by theme. A rust border marks a real agent speaking; a muted grey border marks article or editorial voice.",
    filters: [
      { id: "all", label: "All" },
      { id: "leads", label: "Portal leads" },
      { id: "money", label: "Money / income" },
      { id: "time", label: "No time" },
      { id: "sat", label: "Saturation" },
      { id: "follow", label: "Follow-up" },
    ],
    quotes: [
      { quote: "If StreetEasy shuts off tomorrow, do you still have a business?", who: "Corey Cohen · Compass", tags: ["leads"], real: true },
      { quote: "Stack that on a brokerage split and a team split, and a junior agent closing a $1 million deal walks away with enough money to buy a sandwich.", who: "Corey Cohen · Compass", tags: ["money"], real: true },
      { quote: "I been licensed for 2 years now and I have not sold anything. I'm throwing more money away on fees, mls, etc, than I am getting anything. Maybe it just isn't for me.", who: "Agent · Quora (verbatim)", tags: ["money"], real: true },
      { quote: "I spent $2,000 in realtor.com and closed 0 leads from them.", who: "Francisco Peot · ActiveRain", tags: ["leads", "money"], real: true },
      { quote: "I'd been with Zillow for eight years… my lead count was cut in half since July, and the quality went down to the vacant cheapest units on the market.", who: "Terry McDonald · eXp (NC)", tags: ["leads"], real: true },
      { quote: "The leads are terrible. Most are not loyal to the agent they talk to, and will just call to get anyone to show a house.", who: "G2 reviewer · Zillow Premier Agent", tags: ["leads"], real: true },
      { quote: "I never had one call, one actual client from a Zillow lead.", who: "Stacy Williams · Memphis Luxury Group", tags: ["leads"], real: true },
      { quote: "The fact that no $$$ immediate $$$ is coming in, so \"How do I pay the bills?\"", who: "New agent · Quora", tags: ["money"], real: true },
      { quote: "When things are moving fast, you can get away with a lot. As the market cooled even a little, you could see people start to fall off.", who: "Alex Wright · 307 Real Estate", tags: ["money"], real: true },
      { quote: "most agents who tell me \"I don't have time for marketing\" are spending 45 minutes a day consuming other people's content and calling it research. It's avoidance.", who: "Coach Krista Mashore", tags: ["time"], real: false },
      { quote: "A client texts at 8am and suddenly your planned recording session turns into two hours of back-and-forth… marketing gets pushed to 'later.' Later never comes.", who: "Krista Mashore", tags: ["time"], real: false },
      { quote: "What makes you so different from all the other agents? Nothing. And everything… When it comes to tools, we're all pretty much on the same page.", who: "Tish Lloyd · ActiveRain", tags: ["sat"], real: true },
      { quote: "In my market, there are more licensed agents than homes on the market.", who: "NC agent · Miami Herald", tags: ["sat"], real: true },
      { quote: "approximately 2.4 licensed real estate agents are competing for every single home sale… that statistic probably just made your stomach drop.", who: "Referral Chime", tags: ["sat"], real: false },
      { quote: "hot leads go cold because no one reached out at the right moment with the right message.", who: "HousingWire", tags: ["follow"], real: false },
      { quote: "leads slip through the cracks because they were saved in three different places, phone contacts, a spreadsheet, a sticky note.", who: "HousingWire", tags: ["follow"], real: false },
      { quote: "Statistics show the industry average is around 1% of converting internet leads to closings… sometimes as low as 1/2%.", who: "Christopher Lotte · ActiveRain", tags: ["follow", "leads"], real: true },
    ],
  },
  vocab: {
    sectionLabel: "The glossary",
    heading: "A real estate glossary: how agents actually talk",
    lead: "Real estate has its own vocabulary, and outsiders trip over it constantly. The left column is how agents actually talk. The right column is the generic marketing language that immediately reads as coming from someone who doesn't understand the business. Flip on study mode to test yourself.",
    calloutLabel: "The one rule that matters most",
    calloutText:
      "Outsiders talk about leads, traffic, impressions, brand awareness. Agents talk about listing appointments, signed listings, closings. That's the entire chain that actually matters.",
    pairs: [
      { say: "GCI / \"production\" / \"what you closed last year\"", dont: "\"revenue,\" \"top-line,\" \"your numbers\"" },
      { say: "Listings / \"get you more listings\"", dont: "\"seller leads,\" \"inventory acquisition\"" },
      { say: "Buyers / \"buyer side\"", dont: "\"demand-side clients\"" },
      { say: "Sphere / SOI / \"your database\"", dont: "\"your network,\" \"contact list,\" \"audience\"" },
      { say: "Farming a neighborhood / circle prospecting", dont: "\"geo-targeted marketing,\" \"local brand awareness\"" },
      { say: "Lead gen / \"more at-bats\"", dont: "\"top-of-funnel acquisition,\" \"demand generation\"" },
      { say: "Listing appointments → closings", dont: "\"conversions,\" \"deal completions\"" },
      { say: "Pipeline / \"what's in your pipeline\"", dont: "\"sales funnel,\" \"prospect management\"" },
      { say: "Follow-up / \"stay in touch with the database\"", dont: "\"nurture sequences,\" \"drip campaigns\"" },
      { say: "ISA (inside sales agent)", dont: "\"SDR,\" \"appointment setter,\" \"BDR\"" },
      { say: "CRM, name it: Follow Up Boss, kvCORE, Sierra, Chime", dont: "\"customer relationship platform\"" },
      { say: "IDX website / IDX feed", dont: "\"MLS-integrated web portal,\" \"property search widget\"" },
      { say: "DOM / comps / CMA", dont: "\"listing velocity,\" \"pricing analytics\"" },
      { say: "Expired / FSBO", dont: "\"aged inventory,\" \"unrepresented sellers\"" },
      { say: "\"List to last\" / \"the grind\" / \"stay top of mind\"", dont: "\"brand equity,\" \"always-on marketing\"" },
      { say: "Split / cap", dont: "\"margin,\" \"take rate,\" \"unit economics\"" },
    ],
  },
  competition: {
    sectionLabel: "Atlanta teardown",
    heading: "Who's winning in Atlanta, and where even they have room to grow",
    lead: "These are five of the most visible agents and teams in Atlanta real estate. What they do well is worth studying, no matter what stage you're at. Where they still have room to grow is a reminder that even the top of the market hasn't fully figured this out. Click to expand.",
    entries: [
      {
        name: "Justin Landis Group",
        subtitle: "#1 ATL team · 4,500+ five-star reviews",
        strengths: [
          "4,500+ reviews, a level of social proof almost no individual agent can match",
          "Full capture stack: valuation tool, IDX search, newsletter, scheduling",
          "Relocation and neighborhood SEO content",
          "A B-Corp mission woven into the brand story",
        ],
        growthAreas: [
          "Brand centers on the team as a whole, with no single breakout human face",
          "YouTube and video are underleveraged relative to their review dominance",
        ],
      },
      {
        name: "Glennda Baker",
        subtitle: "Video queen · ~1M+ followers across platforms",
        strengths: [
          "Video-first everything; six figures earned directly through TikTok",
          "Personality is the product, people follow her, not a listing feed",
          "Real capture mechanisms on-site: newsletter, interest modal",
        ],
        growthAreas: [
          "The website badly under-converts a roughly 1M-person audience: dated design, no real IDX integration, competing calls to action, no clear next step for a visitor",
          "No education or coaching product despite an audience that would likely buy one",
          "A clear example of how attention without a converting system leaves real money on the table",
        ],
      },
      {
        name: "Duffy Realty",
        subtitle: "Discount + volume · 1,112 Zillow reviews",
        strengths: [
          "Sharp, quantified positioning: a 1% fee, \"saves ~$8,297\"",
          "A named, productized methodology for their process",
          "Massive review and transaction volume",
        ],
        growthAreas: [
          "The most common complaint in reviews is about communication and follow-up, a gap in the middle of an otherwise strong operation",
          "Low investment in social and personal brand; less visible where younger buyers spend their time",
        ],
      },
      {
        name: "Altenbach & Meko Fountain",
        subtitle: "Ansley/Christie's & Compass · brand under a brokerage",
        strengths: [
          "Niche neighborhood farming plus a lifestyle brand",
          "Polished Instagram at scale (Meko: 102K followers, $520M+ sold)",
        ],
        growthAreas: [
          "Both lean heavily on the brokerage's name recognition rather than an owned funnel or audience",
          "Instagram-heavy but thin everywhere else; even an award-winning team has no clearly documented system behind the brand",
        ],
      },
      {
        name: "Ryan Serhant (national bar)",
        subtitle: "1.5M+ YouTube · the ceiling for the industry",
        strengths: [
          "Closed the full loop: content → owned audience → productized education → software",
        ],
        growthAreas: [
          "No Atlanta agent has closed that same loop yet: content to owned audience to productized education to software. It's the clearest gap in the market.",
        ],
      },
    ],
    patternPanel: {
      heading: "The pattern across all of them",
      tableStakesLabel: "Table stakes across the market",
      tableStakesItems: [
        "Visible review volume as hero-level social proof",
        "A defined face or team brand",
        "Consistent social presence at scale",
        "Multi-path website lead capture",
        "Neighborhood and local-SEO content",
      ],
      growthLabel: "Where there's room to grow, even at the top",
      growthItems: [
        "Websites that under-convert the audience they already have, the biggest, most repeatable gap on this list",
        "Broken follow-up (roughly half of inquiries never get a response)",
        "No automated review engine",
        "Video is still ignored by most agents, despite roughly 403% more inquiries for the ones who use it consistently",
      ],
    },
  },
  faqs: [
    {
      question: "What percentage of commission does a real estate agent actually keep?",
      answer:
        "It depends on the brokerage split, whether the agent is on a team, and taxes, but a common range is 35% to 55% of the gross commission on their side of the deal. After a 70/30 broker split, a 50% team-lead split, and a 28% tax set-aside, an agent can end up keeping well under 15% of the total commission the seller paid.",
    },
    {
      question: "What does GCI mean in real estate?",
      answer:
        "GCI stands for gross commission income, the total commission an agent earns before any splits, fees, or taxes are taken out. It's the number agents use when talking about \"production,\" not their actual take-home pay.",
    },
    {
      question: "Why do so many real estate leads go unanswered?",
      answer:
        "Most agents run their business without a follow-up system: leads come in through a portal, a website form, or a text, and get saved across a phone, a spreadsheet, and a sticky note. Industry estimates put unanswered inquiries at roughly 50%, and conversion on internet leads at around 1%.",
    },
    {
      question: "What is an agent's \"sphere\" and why does it matter more than portal leads?",
      answer:
        "The sphere is an agent's network of past clients, friends, and referral sources. It's widely cited as the highest-ROI lead source in the industry, often 4 to 6 times more effective than paid internet leads, largely because it's free and comes with built-in trust. Most agents never build a real system around it.",
    },
  ],
  cta: {
    heading: "Think your website is costing you listings?",
    subtitle:
      "We'll tell you for free. A quick, no-pitch audit of your site and online presence, built specifically for real estate agents.",
    primaryHref: "https://cal.com/rov-studios-imhphw/15min",
    primaryLabel: "Book a free audit",
    secondaryHref: "/web",
    secondaryLabel: "See our web work",
  },
};
