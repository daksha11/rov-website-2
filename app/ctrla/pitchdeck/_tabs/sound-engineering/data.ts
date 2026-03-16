import type { NavSection } from "../../_shared/types";

export const NAV_SECTIONS: NavSection[] = [
    { id: "snd-overview", label: "Market Overview" },
    { id: "snd-competitors", label: "Studio Competitors" },
    { id: "snd-pricing", label: "R.O.V. Pricing" },
    { id: "snd-events", label: "Event Orgs" },
    { id: "snd-managers", label: "Artist Managers" },
    { id: "snd-clients", label: "Getting Clients" },
    { id: "snd-usp", label: "USP Validation" },
    { id: "snd-pipeline", label: "Student Pipeline" },
];

/* ─── 1. Market Overview ─── */
export const MARKET_STATS = [
    { label: "Atlanta Music Economy", value: 12.4, suffix: "B", prefix: "$", sub: "8.2% of city GDP" },
    { label: "Hip-Hop Revenue Alone", value: 5.7, suffix: "B", prefix: "$", sub: "Global epicenter" },
    { label: "Atlanta Recording Studios", value: 713, suffix: "", prefix: "", sub: "Growing 3.57%/yr" },
    { label: "Single-Owner Studios", value: 89, suffix: "%", prefix: "", sub: "Fragmented, no full-stack creative" },
    { label: "Atlanta Nightlife Economy", value: 5.1, suffix: "B", prefix: "$", sub: "41,000+ jobs" },
    { label: "Indie Artist Market (Global)", value: 160, suffix: "B", prefix: "$", sub: "Projected 2025" },
    { label: "Indie Artists Want Independence", value: 67, suffix: "%", prefix: "", sub: "Up from 52% in 2023" },
    { label: "Direct-to-Fan Sales Growth", value: 32, suffix: "%", prefix: "+", sub: "YoY, $4.7B in 2023" },
];

/* ─── 2. Studio Competitors ─── */
export const STUDIO_COMPETITORS = [
    { name: "LANDR / eMastered (AI)", price: "$6\u2013$49/mo", turnaround: "Minutes", rush: "None", creative: "None" },
    { name: "Fiverr mid-range", price: "$30\u2013$100", turnaround: "3\u20135 days", rush: "+$20\u201360", creative: "None" },
    { name: "RexTrax Studios (ATL)", price: "$45/hr", turnaround: "Custom", rush: "\u2014", creative: "None" },
    { name: "aBs Studios (ATL)", price: "$35\u2013$60/hr", turnaround: "Custom", rush: "\u2014", creative: "None" },
    { name: "WAMM Studios (ATL)", price: "$99\u2013$175", turnaround: "5\u20137 days", rush: "+$50 for 48hr", creative: "None" },
    { name: "Major Mixing (online)", price: "$99+", turnaround: "3 days", rush: "+fee", creative: "None" },
    { name: "Mike\u2019s Mix & Master", price: "$126\u2013$175", turnaround: "4\u20135 days", rush: "+$50", creative: "None" },
    { name: "Mixing Monster", price: "$249\u2013$369", turnaround: "3\u20135 days", rush: "+fee", creative: "None" },
    { name: "R.O.V. (Independent)", price: "$100\u2013$125", turnaround: "1\u20132 days", rush: "Included", creative: "Full stack", isROV: true as const },
    { name: "SoundBetter mid-range", price: "$200\u2013$600", turnaround: "5\u201310 days", rush: "+fee", creative: "None" },
    { name: "The Closet Studios (ATL)", price: "$70/hr", turnaround: "Custom", rush: "\u2014", creative: "None" },
    { name: "Parhelion ATL (premium)", price: "$750\u2013$2,000", turnaround: "Custom", rush: "\u2014", creative: "None" },
    { name: "Tree Sound Studios (ATL)", price: "$85\u2013$225/hr", turnaround: "Custom", rush: "\u2014", creative: "None" },
    { name: "Patchwerk (ATL premium)", price: "By inquiry", turnaround: "Custom", rush: "\u2014", creative: "Music assets only" },
];

export const STUDIO_TIERS = [
    { tier: "Budget", border: "rgba(255,244,227,0.2)", body: "aBs Studios ($35\u2013$60/hr), RexTrax ($45/hr, 25+ years), M.A.D Studios ($50\u2013$65/hr). Audio only \u2014 zero creative services. Artists still need a separate designer, videographer, and web developer." },
    { tier: "Mid-Range", border: "rgba(255,244,227,0.2)", body: "EOA Studios ($40\u2013$130/hr), Icon Studios ($40\u2013$130/hr, 10,000 sq ft), The Closet Studios ($70/hr, $1K\u2013$2.5K bundles). WAMM Studios ($99\u2013$175/song, 5\u20137 day turnaround). No design or tech integration." },
    { tier: "Premium", border: "rgba(255,244,227,0.2)", body: "Tree Sound Studios ($85\u2013$225/hr), Patchwerk (300+ gold/platinum records \u2014 Outkast, Beyonc\u00e9, TLC). Major label budgets. Not competing with R.O.V.\u2019s market. Patchwerk offers limited music-asset design \u2014 no websites, no AI, no stage visuals." },
];

/* ─── 3. R.O.V. Pricing ─── */
export const ROV_TIERS = [
    {
        name: "Student", price: "$55/song", tag: "Volume play + pipeline builder", tagColor: "rgba(255,244,227,0.3)", highlighted: false,
        features: ["Mix + master included", "Online stem submission OR in-studio recording", "Both delivery methods same price", "2\u20133 day turnaround", "2 revision rounds", "WAV + MP3 delivery", "Builds the future manager pipeline", "Target: Georgia State, Clark Atlanta, Morehouse, Spelman, Kennesaw State, Emory"],
    },
    {
        name: "Independent Artist", price: "$100\u2013$125/song", tag: "Sweet spot \u2014 underserved by market", tagColor: "#1D9E75", highlighted: true,
        features: ["Mix + master included", "1\u20132 day delivery (rush included at no charge)", "3 revision rounds", "WAV + MP3 + instrumental version", "Undercuts Mike\u2019s Mix & Master ($126) and Major Mixing ($99) while delivering faster", "No competitor at this price delivers in under 2 days without a surcharge"],
    },
    {
        name: "Semi-Professional", price: "$175\u2013$225/song", tag: "Artists with management or regular releases", tagColor: "#E8A838", highlighted: true,
        features: ["Mix + master included", "1\u20132 day guaranteed delivery", "Unlimited revision rounds", "WAV + MP3 + stems + instrumental + acapella", "Vocal tuning/editing included", "Radio/clean edit included", "Matches WAMM\u2019s \u201CRecord Label Quality\u201D tier at faster delivery"],
    },
    {
        name: "Professional / Manager", price: "$300\u2013$500/song", tag: "Signed/managed artists, sync licensing, label-funded", tagColor: "#7F77DD", highlighted: false,
        features: ["Everything in Semi-Pro tier", "Attended/collaborative mix sessions available", "Apple Digital Masters certification", "Priority scheduling", "Same-day option available", "Dedicated engineer per project"],
    },
];

export const BUNDLES = [
    { name: "EP Bundle (4\u20136 songs)", discount: "10\u201315% off", sub: "Discount applied automatically" },
    { name: "Album Bundle (8\u201312 songs)", discount: "15\u201320% off", sub: "Biggest volume discount" },
    { name: "Manager Roster Bundle", discount: "Custom pricing", sub: "Contact for roster rates" },
];

export const ADDONS = [
    { name: "Vocal tuning/editing", price: "$25\u2013$50/song" },
    { name: "Instrumental mix", price: "$15\u2013$25/song" },
    { name: "Acapella/stems", price: "$15\u2013$25/song" },
    { name: "Radio/clean edit", price: "$15\u2013$25/song" },
    { name: "Same-day rush delivery", price: "+$25\u2013$50/song" },
    { name: "Artist branding package", price: "$200\u2013$500+", tag: "Unique to R.O.V." },
];

/* ─── 4. Event Orgs ─── */
export const EVENT_STATS = [
    { label: "ATL Nightlife Economy", value: 5.1, suffix: "B", prefix: "$", sub: "Annual economic impact" },
    { label: "Target Retainer Range", value: "2K\u20135K", sub: "Per month", isText: true as const },
    { label: "Email Marketing ROI", value: "30\u201340x", sub: "Almost no ATL promoter uses it", isText: true as const },
    { label: "Mid-Size Promoter Gross", value: "~$300K/yr", sub: "1,000 tickets \u00d7 $25 \u00d7 12 events", isText: true as const },
];

export const EVENT_TARGETS = ["InvAsian", "The Big Homecoming", "DOPE Events", "HBCU Alumni Atlanta Alliance", "Alter-Ego Entertainment", "VTP Events / Von the Promoter", "College Freaknik / The Function ATL"];
export const EVENT_VENUES = ["District Atlanta", "Opium ATL", "Compound ATL", "Penthouse", "Cafe Circa", "Lakewood Amphitheatre"];

export const EVENT_PAINS = [
    { pain: "No email list / attendee data ownership \u2014 Eventbrite owns their audience", pct: 96 },
    { pain: "Fragmented vendors \u2014 separate freelancers for every deliverable", pct: 90 },
    { pain: "Inconsistent visual identity across events \u2014 no brand system", pct: 86 },
    { pain: "Can\u2019t attract sponsors \u2014 no data to prove ROI", pct: 80 },
    { pain: "Zero post-event follow-up automation \u2014 attendees go cold", pct: 75 },
];

export const EVENT_RETAINERS = [
    { name: "Foundation", price: "$2,000/month", tag: "2\u20134 events/month", tagColor: "rgba(255,244,227,0.3)", highlighted: false, features: ["4 custom event flyers/month", "8 social media graphics", "Brand style guide maintenance", "Basic website updates", "1 AI workflow setup/quarter (email capture, basic CRM)", "2 revision rounds per deliverable"] },
    { name: "Production", price: "$3,500/month", tag: "4\u20138 events/month", tagColor: "#E8A838", highlighted: true, features: ["8 flyers + 16 social graphics", "4 animated/motion flyers", "2 VJ loop packages for LED walls (stage visuals)", "Full event website management + ticket integration", "Automated email marketing templates", "Monthly strategy call"] },
    { name: "Full Creative Partner", price: "$5,000/month", tag: "8+ events/month", tagColor: "#1D9E75", highlighted: false, features: ["Unlimited flyers (12\u201316/month)", "Full social content calendar", "4 VJ loop packages + live stage visual support at 1 event/month", "Full website + SEO + analytics", "CRM + automated email flows + ticket sales tracking", "Bi-weekly strategy calls", "24\u201348hr rush capability"] },
];

export const ALA_CARTE_COSTS = [
    { item: "Freelance flyers (8 events \u00d7 $250)", cost: "$2,000" },
    { item: "Social media graphics freelancer", cost: "$500\u2013$1,500" },
    { item: "Website maintenance", cost: "$500\u2013$1,500" },
    { item: "Stage visual content (4 events custom)", cost: "$2,000\u2013$8,000" },
    { item: "Total \u00e0 la carte", cost: "$5,000\u2013$13,000/mo", isTotal: true as const },
    { item: "R.O.V. Production retainer", cost: "$3,500/mo", isROV: true as const },
];

/* ─── 5. Artist Managers ─── */
export const MANAGER_TIERS = [
    { tier: "Tier 1 \u2014 Aspirational", border: "rgba(255,244,227,0.2)", body: "Quality Control / Solid Foundation (Lil Baby, Migos, Latto) \u2014 acquired by Hybe for $300M. Mizay Entertainment (founded by Debra Antney). Hard to access cold. Build toward via referrals and credential-building." },
    { tier: "Tier 2 \u2014 Primary Targets", border: "#E8A838", highlighted: true as const, items: ["CSP Music Group \u2014 artist development, advances up to $50K, Grammy-nominated connections", "AG Entertainment Management \u2014 full-service, hip-hop focus, Southeast region", "Groundwork Artist Management \u2014 NY + LA + Atlanta offices", "Panther Creek Artist Management \u2014 emerging and established artists", "BMA Management & Artist Development", "RSG Agency \u2014 distribution, A&R, merch, tours"] },
    { tier: "Tier 3 \u2014 Solo Managers", border: "#1D9E75", body: "Handle 1\u20133 artists. Often former artists, DJs, or promoters. Fastest to convert. Lower ACV but high volume. Every successful solo manager you build a relationship with can become a Tier 2 connection within 2\u20133 years." },
];

export const MANAGER_PAINS = [
    { pain: "Slow turnaround \u2014 5\u201314 days is industry standard", pct: 96 },
    { pain: "Vague ETAs \u2014 no locked delivery date ever given", pct: 92 },
    { pain: "Vendor fragmentation \u2014 separate engineer, designer, web developer per release", pct: 88 },
    { pain: "Inconsistent quality at budget tier ($100\u2013$250/mix)", pct: 82 },
    { pain: "Poor communication \u2014 ghosting, unclear revision process", pct: 76 },
];

export const DISCOVERY_CHANNELS = [
    { channel: "Word of mouth + referrals", badge: "HIGHEST TRUST", color: "#1D9E75" },
    { channel: "SoundBetter + EngineEars (verified reviews)", badge: "PLATFORM", color: "#E8A838" },
    { channel: "Instagram \u2014 session clips, before/after content", badge: "SOCIAL", color: "#7F77DD" },
    { channel: "Google \u2014 \u201Crecording studio near me\u201D (86% of discovery)", badge: "SEARCH", color: "#E84B8A" },
    { channel: "Music industry events (A3C, Music Biz 2026, NO EGO)", badge: "IN-PERSON", color: "#EA9A61" },
];

export const MANAGER_PITCH_STEPS = [
    { title: "The problem", body: "You\u2019re managing 5 artists, coordinating separate studios, engineers, designers, and developers for every release" },
    { title: "Quantify the alternative", body: "One call, one invoice, one team \u2014 not five" },
    { title: "Name the turnaround", body: "1\u20132 day mix and master delivery, no rush fees, locked timelines" },
    { title: "Show the bundle", body: "Mixing/mastering + single artwork + social assets + web updates per release" },
    { title: "Provide proof", body: "Before/after audio samples, 3\u20135 project case studies, named credits with stream counts" },
];

/* ─── 6. Getting Clients ─── */
export const LEAD_CHANNELS = [
    { channel: "Word of mouth + referrals", sub: "84% of B2B buyers start with a referral. Every completed project should generate at least one referral ask.", roi: 98 },
    { channel: "SoundBetter + EngineEars profiles", sub: "Set up verified profiles immediately. Collect reviews after every project. High-intent buyers live here.", roi: 88 },
    { channel: "Instagram before/after session clips", sub: "Post weekly. Raw vs mixed toggle videos perform best. Session BTS content builds cultural credibility.", roi: 80 },
    { channel: "Google Business Profile", sub: "86% of studio discovery happens via \u2018recording studio near me\u2019 category searches. Optimize immediately.", roi: 75 },
    { channel: "Music industry events", sub: "A3C, Music Biz 2026 (May, ATL), Georgia Music Partners events, NO EGO networking series.", roi: 70 },
];

export const CREDIBILITY_SIGNALS = [
    { signal: "Interactive before/after audio samples on website (toggle raw vs mixed)", impact: 98 },
    { signal: "Video testimonials from recognizable clients", impact: 90 },
    { signal: "Named credits with streaming numbers (\u201CX million streams mixed\u201D)", impact: 85 },
    { signal: "Verified reviews on SoundBetter + EngineEars", impact: 80 },
    { signal: "Session clips + BTS content on Instagram/TikTok weekly", impact: 75 },
    { signal: "Professional studio photography + virtual tour", impact: 65 },
];

export const ORGS_TO_JOIN = [
    { name: "Georgia Music Partners", color: "#1D9E75", body: "Join now for $25/year. State\u2019s primary music industry coalition. Co-founded with Recording Academy Atlanta Chapter. Regular events, direct access to industry contacts." },
    { name: "Georgia Music Industry Association", color: "rgba(255,244,227,0.2)", body: "Founded 1978. Regular Saturday meetups. Education, experience, exposure focused. Direct networking with active industry contacts across all levels." },
    { name: "A3C Festival + Conference", color: "#E8A838", body: "Atlanta\u2019s premier hip-hop conference. 50,000 attendees, 300 performers. Direct access to artists, managers, and labels. Primary event for building credibility in ATL\u2019s music scene." },
    { name: "NO EGO Events", color: "rgba(255,244,227,0.2)", body: "Informal Atlanta networking gatherings. No job titles, real conversations. Runs across ATL, Nashville, LA, and Philadelphia. Best environment for genuine manager relationship-building." },
];

/* ─── 7. USP Validation ─── */
export const USP1_EVIDENCE = [
    "Wavy Entertainment: recording + basic design \u2014 NO websites, NO AI workflows, NO stage visuals",
    "Patchwerk: recording + music-asset design \u2014 large premium facility, not a small studio-agency",
    "American Design Hub: design + web + AI \u2014 NO audio engineering whatsoever",
    "Every other major ATL studio identified: audio-only, zero creative services",
];

export const USP2_STANDARD = [
    "Standard professional mix + master combined: 5\u201310+ business days",
    "WAMM Studios rush: +$50 surcharge for 48-hour option",
    "Mike\u2019s Mix & Master rush: +$50 surcharge",
    "Fiverr 24-hour option: +$20\u201360 surcharge",
    "Most studios: vague ETAs, no locked delivery date",
];

export const USP2_ROV = [
    "Standard delivery: 1\u20132 days",
    "Rush fee: $0 (included at every tier)",
    "Delivery commitment: locked at time of booking",
    "Communication: proactive updates, clear revision process",
    "Only Major Mixing approaches this speed ($99+) \u2014 and offers zero creative bundle",
];

export const MESSAGING_AUDIENCE = [
    { audience: "Brand / marketing clients", color: "#1D9E75", msg: "\u2018One vendor, one vision \u2014 no fragmentation.\u2019 Lead with case studies, speed (2\u20134 wk delivery vs 8\u201312), transparent pricing, and genuine AI automation capability." },
    { audience: "VCs / investors", color: "#7F77DD", msg: "\u2018Tech-enabled creative platform, not an agency.\u2019 Lead with zero-competition positioning, recurring revenue model, proprietary n8n IP. Comps: Superside ($44.9M revenue), Design Pickle ($86.3M revenue)." },
    { audience: "Independent artists", color: "#E8A838", msg: "\u2018Studio, brand, web, content \u2014 one place that speaks your language.\u2019 Lead with bundled packages, speed, cultural fluency, payment plans, and the fact that 67% of artists want to stay independent." },
    { audience: "UI/UX talent", color: "#E84B8A", msg: "\u2018Own the full project. No committees. Your name on the work.\u2019 Lead with multi-disciplinary range, founding-team energy, equity potential, modern stack." },
];

/* ─── 8. Student Pipeline ─── */
export const PIPELINE_STEPS = [
    { color: "#1D9E75", title: "Student signs at $55/song", body: "R.O.V. delivers excellent work \u2014 better than they expected. This creates the word-of-mouth engine. Every student tells 3\u20135 other students." },
    { color: "#7F77DD", title: "Student gets traction", body: "Playlist placements, follower growth, live performance buzz. R.O.V.\u2019s mix quality is part of what helps this happen. The better they sound, the more they grow." },
    { color: "#E8A838", title: "Student attracts manager attention", body: "As the artist\u2019s profile grows, managers reach out. R.O.V. is already embedded as the trusted creative partner." },
    { color: "#1D9E75", title: "Manager inherits R.O.V.", body: "The manager doesn\u2019t need to vet a new studio \u2014 R.O.V. already has the relationship, the catalog history, and the artist\u2019s trust. Warmest possible B2B introduction." },
    { color: "#7F77DD", title: "Manager brings their full roster", body: "One student client becomes a $15K\u2013$40K/year manager relationship that brings multiple artists. The ROI on the original $55/song work compounds indefinitely." },
];

export const RETENTION_LEFT = [
    "Loyalty credits \u2014 every dollar spent earns toward free services",
    "Referral bonus \u2014 studio credit for every referred client who books",
    "Volume discounts \u2014 10% off at 5 songs, 15% at 10+, 20% at 20+",
    "Quarterly studio mixer \u2014 students and emerging artists networking together",
    "\u201CR.O.V. Alumni\u201D designation \u2014 priority scheduling + rate locks for 3+ project clients",
];

export const TARGET_CAMPUSES = ["Georgia State", "Clark Atlanta", "Morehouse", "Spelman", "Kennesaw State", "Emory"];

export const MILESTONE_PATH = [
    { stage: "Student Tier", trigger: "Enrolled in school, first releases, building catalog", upgrade: "First 1,000 Spotify monthly listeners OR first management interest" },
    { stage: "Independent Tier", trigger: "Active releases, building audience, no management yet", upgrade: "First playlist placement OR first sync opportunity OR manager signing" },
    { stage: "Semi-Pro / Manager Tier", trigger: "Management representation, label interest, regular release schedule", upgrade: "Full bundle per release \u2014 mix/master + artwork + social assets + web updates" },
];
