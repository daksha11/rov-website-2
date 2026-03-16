import type {
    NavSection, MarketStat, Competitor,
    AgencyPricing, Persona, PainPointSegment,
    VCComp, ATLVC, InvestorMetric, Trend, LeadChannel,
} from "../../_shared/types";

export const NAV_SECTIONS: NavSection[] = [
    { id: "market", label: "Market Size" },
    { id: "competitive", label: "Competitive" },
    { id: "agency-pricing", label: "Agency Pricing" },
    { id: "personas", label: "Personas" },
    { id: "pain-points", label: "Pain Points" },
    { id: "vc", label: "VC / Investment" },
    { id: "trends", label: "Trends" },
    { id: "leads", label: "Lead Channels" },
];

export const MARKET_STATS: MarketStat[] = [
    { value: 12.4, suffix: "B", prefix: "$", label: "Atlanta Music Economy", sub: "8.2% of city GDP" },
    { value: 5.1, suffix: "B", prefix: "$", label: "Atlanta Nightlife Economy", sub: "41,000+ jobs" },
    { value: 160, suffix: "B", prefix: "$", label: "Global Independent Artist Market", sub: "67% want to stay independent" },
    { value: 3.4, suffix: "B", prefix: "$", label: "Global Creative Services", sub: "\u2192 $6.5B by 2033 (6.69% CAGR)" },
    { value: 757, suffix: "M", prefix: "$", label: "Atlanta VC Raised (2025)", sub: "+23% YoY" },
    { value: 1796, suffix: "", prefix: "", label: "Active Atlanta Startups", sub: "8 unicorns" },
    { value: 713, suffix: "", prefix: "", label: "Atlanta Recording Studios", sub: "89% single-owner, 3.57%/yr growth" },
    { value: 527, suffix: "%", prefix: "", label: "YoY AI-Referred Web Traffic", sub: "GEO opportunity" },
];

export const COMPETITORS: Competitor[] = [
    { name: "Matchstic", url: "https://matchstic.com/", brand: "yes", web: "no", ai: "no", sound: "no", media: "no" },
    { name: "American Design Hub", url: "https://www.americandesignhub.com/", brand: "yes", web: "yes", ai: "yes", sound: "no", media: "no" },
    { name: "Wavy Entertainment", url: "https://www.wavyent.net/", brand: "partial", web: "no", ai: "no", sound: "yes", media: "partial" },
    { name: "Patchwerk", url: "https://patchwerk.com/", brand: "no", web: "no", ai: "no", sound: "yes", media: "no" },
    { name: "NueWay Studios", url: "https://www.nuewaystudios.com/", brand: "yes", web: "yes", ai: "no", sound: "no", media: "no" },
    { name: "FlyerHaus", url: "https://www.flyerhaus.com/", brand: "partial", web: "no", ai: "no", sound: "no", media: "no" },
    { name: "R.O.V. Studios", brand: "yes", web: "yes", ai: "yes", sound: "yes", media: "yes" },
];

export const AGENCY_PRICING: AgencyPricing[] = [
    { tier: "Budget", brand: "$1K\u2013$5K", website: "$997\u2013$5K", full: "$3K\u2013$8K" },
    { tier: "Mid-Range (R.O.V.)", brand: "$2K\u2013$10K", website: "$3K\u2013$8K", full: "$5K\u2013$10K" },
    { tier: "Premium (Matchstic)", brand: "$25K\u2013$65K", website: "$15K\u2013$30K", full: "$30K\u2013$70K" },
];

export const PERSONAS: Persona[] = [
    { name: "DLo", role: "Independent Rapper", age: "24\u201329", location: "East ATL", budget: "$500\u2013$3K", pain: "Disconnected Fiverr assets, studio didn\u2019t get his vision", win: "Cultural fluency, all-in-one, payment plans" },
    { name: "Tanya", role: "Real Estate Agent", age: "32\u201338", location: "Buckhead/Midtown", budget: "$3K\u2013$8K", pain: "4 vendors, no cohesion, brokerage templates strip differentiation", win: "Fast turnaround, single partner, drone content" },
    { name: "Marcus", role: "Pre-Seed PropTech Founder", age: "28\u201334", location: "Atlanta Tech Village", budget: "$2K\u2013$7K", pain: "$400 Fiverr pitch deck with no narrative, 3 VC passes", win: "Startup-native pricing, 2\u20134 week delivery, VC-fluent design" },
    { name: "Jasmine", role: "Streetwear Brand Founder", age: "26\u201332", location: "West End/BeltLine", budget: "$3K\u2013$8K/season", pain: "Logo doesn\u2019t scale, agency didn\u2019t understand streetwear culture", win: "Cultural fluency, full visual ecosystem" },
    { name: "Brandon", role: "Marketing Director", age: "35\u201342", location: "Midtown", budget: "$5K\u2013$10K/project", pain: "Big agency takes 8\u201312 weeks, $15K+ for $5K work", win: "Agility (2\u20134 wk delivery), genuine AI/n8n expertise" },
    { name: "Nadia", role: "UI/UX Designer (Recruit)", age: "26\u201330", location: "Currently at Definition6", budget: "Expects $75K\u2013$90K", pain: "Limited creative ownership at current agency", win: "Multi-disciplinary breadth, full project ownership, modern stack, equity" },
];

export const PAIN_POINTS: Record<string, PainPointSegment> = {
    "Real Estate": { label: "Real Estate Agents", items: [{ pain: "Brokerage templates strip differentiation", pct: 85 }, { pain: "4\u20135 separate vendors, no brand cohesion", pct: 78 }, { pain: "Only 35% use drone (listings sell 68% faster)", pct: 65 }, { pain: "No trackable ROI on marketing spend", pct: 72 }] },
    "Artists": { label: "Independent Artists", items: [{ pain: "Fiverr/freelancer fatigue \u2014 inconsistent quality", pct: 88 }, { pain: "5\u201314 day standard turnaround slows releases", pct: 75 }, { pain: "No cohesive visual identity matching sound", pct: 82 }, { pain: "Can\u2019t afford separate studio + designer + web dev", pct: 90 }] },
    "Startups": { label: "Tech Startups", items: [{ pain: "93% of pitch decks have design working against them", pct: 93 }, { pain: "75% lack a \u2018Why Now?\u2019 slide", pct: 75 }, { pain: "Budget too small for premium agencies ($75K+)", pct: 80 }, { pain: "Generic templates look amateur to VCs", pct: 70 }] },
    "Retail": { label: "Retail / Streetwear", items: [{ pain: "~70% cart abandonment on generic Shopify templates", pct: 70 }, { pain: "Brand inconsistency across channels", pct: 82 }, { pain: "Fiverr designs don\u2019t understand the culture", pct: 76 }] },
    "Events": { label: "Event Organizations", items: [{ pain: "No email list / attendee data ownership", pct: 85 }, { pain: "Zero post-event follow-up automation", pct: 90 }, { pain: "Inconsistent visual identity across events", pct: 78 }, { pain: "Can\u2019t prove ROI to attract sponsors", pct: 82 }, { pain: "Email delivers 30\u201340x ROI but almost none use it", pct: 95 }] },
};

export const VC_COMPS: VCComp[] = [
    { name: "Superside", raised: "$33.5M", revenue: "$44.9M (2024)", model: "Creative-as-a-Service subscription" },
    { name: "Design Pickle", raised: "$25M", revenue: "$86.3M", model: "Flat-rate unlimited design" },
    { name: "Red Antler", raised: "$31M fund", revenue: "\u2014", model: "Agency + equity stakes in clients" },
    { name: "Pattern Brands", raised: "$60M (Kleiner Perkins)", revenue: "\u2014", model: "Agency \u2192 brand investment platform" },
];

export const ATL_VCS: ATLVC[] = [
    { name: "Collab Capital", check: "$1\u20132M", focus: "Black-founded companies, SPACE structure" },
    { name: "Atlanta Ventures", check: "$250K\u2013$5M", focus: "SaaS + subscription under $5M ARR" },
    { name: "Tech Square Ventures", check: "$500K\u2013$3M", focus: "Tech-enabled services" },
    { name: "Valor Ventures", check: "$27M Fund 3", focus: "B2B AI/SaaS seed" },
    { name: "Panoramic / BIP Capital", check: "$100K\u2013$20M+", focus: "$550M AUM, broadest mandate" },
];

export const INVESTOR_METRICS: InvestorMetric[] = [
    { metric: "ARR (Seed Minimum)", target: "$100K+ ($500K\u2013$1M strong)" },
    { metric: "YoY Growth", target: "200%+ or 15\u201320% MoM" },
    { metric: "LTV:CAC Ratio", target: "3:1+" },
    { metric: "Gross Margins", target: "40%+" },
    { metric: "Client Retention", target: "90%+, <5% monthly churn" },
    { metric: "ATL Seed Valuation", target: "$3M\u2013$8M pre-money" },
];

export const TRENDS: Trend[] = [
    { title: "GEO (Generative Engine Optimization)", stat: "527%", statLabel: "YoY AI search traffic growth", detail: "Gartner predicts 50% drop in traditional organic traffic by 2028. LLMs cite only 2\u20137 domains per response vs Google\u2019s 10 blue links \u2014 winner-takes-most." },
    { title: "AI in Creative Services", stat: "$14.03B", statLabel: "Market by 2030 (27.1% CAGR)", detail: "80% of agencies use AI, but only 5% have mature integration. R.O.V.\u2019s n8n expertise is a genuine differentiator." },
    { title: "One-Vendor Bundling Trend", stat: "22%", statLabel: "of agencies say expanding to existing clients is #1 growth driver", detail: "Clients want fewer, more capable partners. R.O.V. covers 5 verticals vs competitors\u2019 1\u20133." },
    { title: "Atlanta 2026\u20132028 Spotlight", stat: "8", statLabel: "FIFA World Cup matches at Mercedes-Benz Stadium (2026)", detail: "Plus 2028 Super Bowl LXII. Global eyes on Atlanta = brands spending heavily on creative." },
    { title: "Independent Artist Boom", stat: "67%", statLabel: "of artists want to stay independent (up from 52% in 2023)", detail: "$160.6B market (2025). Direct-to-fan sales +32% YoY. These artists need full-service creative partners." },
];

export const LEAD_CHANNELS: LeadChannel[] = [
    { channel: "Referral Network", detail: "5\u201310 vendors, 10\u201315% commission", roi: 95, time: "Immediate" },
    { channel: "Google Business Profile", detail: "Free, optimize weekly", roi: 85, time: "30\u201360 days" },
    { channel: "Clutch + DesignRush + UpCity", detail: "High-intent buyers", roi: 80, time: "30\u201390 days" },
    { channel: "LinkedIn Founder Posts", detail: "3\u20135x/week, 4/5 B2B social leads", roi: 78, time: "30\u201360 days" },
    { channel: "SoundBetter + EngineEars", detail: "Music industry buyers", roi: 72, time: "Immediate" },
    { channel: "Website Case Studies", detail: "Immediate conversion impact", roi: 70, time: "Immediate" },
    { channel: "Local SEO Blog Content", detail: "Long-term compounding", roi: 65, time: "3\u20136 months" },
];
