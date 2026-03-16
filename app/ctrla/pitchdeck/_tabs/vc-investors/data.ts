import type { NavSection } from "../../_shared/types";

export const NAV_SECTIONS: NavSection[] = [
    { id: "vc-tam", label: "TAM/SAM/SOM" },
    { id: "vc-unit", label: "Unit Economics" },
    { id: "vc-margins", label: "Margins + Revenue" },
    { id: "vc-moat", label: "Moat + Switching" },
    { id: "vc-comps", label: "Comparables" },
    { id: "vc-atl", label: "Atlanta Tailwinds" },
    { id: "vc-scale", label: "Scalability" },
    { id: "vc-risk", label: "Risk Analysis" },
    { id: "vc-metrics", label: "Investor Metrics" },
];

/* ─── 1. TAM/SAM/SOM ─── */
export const TAM_TABLE = [
    { pillar: "Creative Services (brand, design)", basis: "U.S. creative → $480B by 2033; GA creative industries $23.8B", tam: "~$23.8B" },
    { pillar: "Video Production", basis: "U.S. video $31.4B (7.4% CAGR); GA film/video $818.5M (2026)", tam: "~$818M" },
    { pillar: "Web Development", basis: "U.S. web dev $18.25B (5.15% CAGR); GA ~2.94% of national GDP", tam: "~$536M" },
    { pillar: "AI Automation", basis: "Global AI automation $129.9B (31.4% CAGR); N. America 32.7% share", tam: "~$2.1B" },
    { pillar: "Sound / Recording", basis: "U.S. studios $1.7B; ATL 713 studios; ATL music economy $12.4B", tam: "~$850M" },
];

export const SAM_FILTERS = [
    { filter: "Budget capacity ($500+ projects, $1K+ retainers)", businesses: "~186,910", note: "1\u201319 and 20\u2013499 employee businesses" },
    { filter: "Industry alignment (R.O.V.\u2019s proven verticals)", businesses: "~74,764", note: "~40% of budget-qualifying businesses" },
    { filter: "Bundle need (2+ pillars needed)", businesses: "~18,691", note: "25% of industry-aligned pool" },
];

export const SOM_TABLE = [
    { year: "Year 1", clients: "25\u201340", acv: "$8,000", revenue: "$200K\u2013$320K", capture: "0.13%\u20130.21%" },
    { year: "Year 2", clients: "60\u2013100", acv: "$14,000", revenue: "$840K\u2013$1.4M", capture: "0.32%\u20130.53%" },
    { year: "Year 3", clients: "120\u2013180", acv: "$20,000", revenue: "$2.4M\u2013$3.6M", capture: "0.64%\u20130.96%" },
];

export const VIDEO_PRICING = [
    { type: "Music video (basic)", range: "$350\u2013$725 (WAMM); $1K\u2013$10K nationally", opp: "Core offering for artist clients" },
    { type: "Music video (premium)", range: "$550\u2013$1,175 (WAMM); $10K\u2013$50K mid-tier", opp: "Upsell for managed artists" },
    { type: "Corporate brand video", range: "$2,500\u2013$10,000+ (ATL avg)", opp: "RE, startup, restaurant clients" },
    { type: "Social media content (reels)", range: "$75\u2013$300 per reel", opp: "High-volume recurring retainer" },
    { type: "Drone/aerial (real estate)", range: "$175\u2013$500 per property", opp: "Add-on for RE retainers" },
    { type: "Event recap video", range: "$300\u2013$1,500", opp: "Event promoter retainer add-on" },
    { type: "Commercial/ad spot", range: "$600\u2013$850+ (ATL); $15K\u2013$75K national", opp: "Mid-market B2B clients" },
];

/* ─── 2. Unit Economics ─── */
export const LTV_CAC = [
    { segment: "Independent Artists", spend: "$300\u2013$800/mo", lifespan: "12\u201318 mo", ltv: "$3.6K\u2013$14.4K", cac: "$150\u2013$300", ratio: "12:1\u201348:1" },
    { segment: "Event Promoters", spend: "$2K\u2013$5K/mo", lifespan: "18\u201336 mo", ltv: "$36K\u2013$180K", cac: "$500\u2013$1,500", ratio: "24:1\u2013120:1" },
    { segment: "Real Estate Agents", spend: "$1K\u2013$3K/mo", lifespan: "12\u201324 mo", ltv: "$12K\u2013$72K", cac: "$300\u2013$800", ratio: "15:1\u201390:1" },
    { segment: "Tech Startups", spend: "$2K\u2013$7K (project)", lifespan: "6\u201312 mo", ltv: "$12K\u2013$84K", cac: "$500\u2013$1K", ratio: "12:1\u201384:1" },
    { segment: "Artist Managers (B2B)", spend: "$1.5K\u2013$4K/mo", lifespan: "24\u201348 mo", ltv: "$36K\u2013$192K", cac: "$800\u2013$2K", ratio: "18:1\u201396:1" },
    { segment: "Restaurants/Salons (AI)", spend: "$1K\u2013$3K/mo", lifespan: "18\u201336 mo", ltv: "$18K\u2013$108K", cac: "$300\u2013$1K", ratio: "18:1\u2013108:1" },
];

export const CAC_CHANNELS = [
    { channel: "Email marketing", cac: "$72" },
    { channel: "Referral programs", cac: "$98\u2013$150" },
    { channel: "Content marketing", cac: "$156" },
    { channel: "Paid social", cac: "$189" },
    { channel: "Paid search", cac: "$341" },
    { channel: "Industry average", cac: "$802" },
];

/* ─── 3. Margins + Revenue ─── */
export const MARGINS = [
    { pillar: "AI Automation", margin: "70\u201390%", driver: "Near-zero marginal cost; n8n self-hosted free; autonomous", role: "Highest-margin pillar" },
    { pillar: "Sound (Mix/Master)", margin: "75\u201389%", driver: "~11% COGS; fixed equipment amortized; labor is variable", role: "High-margin, high-volume" },
    { pillar: "Video Production", margin: "30\u201355%", driver: "30\u201350% typical; social/corporate higher than film; owned gear", role: "Highest-growth (24.58% CAGR)" },
    { pillar: "Brand Identity/Design", margin: "50\u201370%", driver: "Premium strategic pricing; 15\u201325% net margins", role: "Anchor \u2014 brings clients in" },
    { pillar: "Web Development", margin: "45\u201360%", driver: "Higher technical overhead; strong retainer potential", role: "Recurring revenue driver" },
    { pillar: "Blended (Bundled Retainer)", margin: "55\u201375%", driver: "Cross-sell reduces CAC; bundle premium; utilization boost", role: "Strategic target" },
];

export const REVENUE_MIX = [
    { year: "Year 1", project: "$160K\u2013$224K", retainer: "$40K\u2013$96K", pct: "20\u201330%", drivers: "Initial brand projects, first retainer conversions" },
    { year: "Year 2", project: "$252K\u2013$420K", retainer: "$588K\u2013$980K", pct: "60\u201370%", drivers: "Retainer conversions; AI automation MRR" },
    { year: "Year 3", project: "$360K\u2013$540K", retainer: "$2.04M\u2013$3.06M", pct: "75\u201385%", drivers: "Mature retainer base; AI + sound recurring" },
];

export const EXPANSION_STATS = [
    "1-pillar entry \u2192 4-pillar expansion = 13x from initial project value",
    "22% of agencies cite expanding to existing clients as #1 growth driver",
    "Retainer agencies: 2.3x better retention (18% vs 42% annual churn)",
    "Creative agencies benchmark 7+ year average client lifespan",
    "Increasing retention by 5% boosts profits by 25\u201395%",
    "Target NRR for R.O.V.: 130\u2013150%",
];

/* ─── 4. Moat + Switching ─── */
export const SWITCHING_COSTS = [
    { asset: "Brand Identity", cost: "$5K\u2013$50K", time: "4\u201312 weeks", risk: "Loss of brand equity, audience confusion" },
    { asset: "Video Production", cost: "$2.5K\u2013$15K+", time: "4\u20138 weeks", risk: "Loss of visual language, re-education on guidelines" },
    { asset: "Website", cost: "$5K\u2013$30K", time: "6\u201316 weeks", risk: "SEO ranking loss, 90\u2013180 day recovery" },
    { asset: "CRM/Automation", cost: "$15K\u2013$150K", time: "8\u201320 weeks", risk: "Data integrity risk; hidden costs 2x estimates" },
    { asset: "AI Workflows (n8n)", cost: "$2.5K\u2013$15K per workflow", time: "4\u20138 weeks per workflow", risk: "Tribal knowledge loss; proprietary logic" },
    { asset: "Sound/Audio Relationship", cost: "N/A (relationship)", time: "2\u20134 weeks", risk: "Loss of engineer who \u2018knows the sound\u2019" },
];

export const IP_INVENTORY = [
    "Client onboarding automation: Lead capture \u2192 CRM \u2192 welcome \u2192 kickoff",
    "Event promoter suite: Ticket \u2192 email capture \u2192 follow-up \u2192 sponsor ROI",
    "Restaurant/salon booking agent: WhatsApp/voice AI \u2192 confirm \u2192 remind \u2192 review",
    "Artist release workflow: Master \u2192 distribution \u2192 social \u2192 email \u2192 streaming",
    "Email marketing templates: Pre-designed, brand-customizable flows per vertical",
];

/* ─── 5. Comparables ─── */
export const FUNDED_COMPS = [
    { company: "Superside", stage: "Early: Konsus (2015), freelancer marketplace", revenue: "Pre-revenue \u2192 ~$1M ARR", funding: "$1.3M seed (2016)", proved: "Demand for on-demand creative at scale" },
    { company: "Design Pickle", stage: "Founded 2015, bootstrapped to $1M ARR", revenue: "$1M ARR first year", funding: "$0 (bootstrapped to $25M rev)", proved: "Flat-rate subscription creative works" },
    { company: "ManyPixels", stage: "Founded 2018, rapid growth", revenue: "$550K ARR within 2 years", funding: "Bootstrapped", proved: "Design subscription scales quickly" },
    { company: "Contra", stage: "Marketplace launch", revenue: "Early marketplace revenue", funding: "$44.5M total", proved: "Commission-free creative captures network effects" },
];

export const VALUATION_MULTIPLES = [
    { band: "$1\u20133M", ebitda_margin: "10\u201315%", ebitda_multiple: "3\u20134x", rev_multiple: "0.3\u20130.6x" },
    { band: "$3\u20135M", ebitda_margin: "10\u201315%", ebitda_multiple: "4\u20135x", rev_multiple: "0.4\u20130.75x" },
    { band: "$5\u201310M", ebitda_margin: "15\u201320%", ebitda_multiple: "5\u20136x", rev_multiple: "0.75\u20131.2x" },
    { band: "$10\u201320M", ebitda_margin: "15\u201325%", ebitda_multiple: "6\u20137x", rev_multiple: "0.9\u20131.75x" },
];

export const CASE_STUDIES = [
    { name: "Gin Lane \u2192 Pattern Brands", detail: "Agency behind Harry\u2019s, Sweetgreen, SmileDirectClub closed agency practice, launched DTC holding company. Raised $60M from Kleiner Perkins, RRE, Primary, Victory Park. Took 25\u201350% equity stakes since 2015. First acquisition (GIR) profits up 100%+." },
    { name: "Red Antler \u2192 Habitat Partners", detail: "Branding firm behind Casper, Allbirds, Glossier launched $31M venture fund. Began with $50K\u2013$100K equity-for-services checks into 65 brands. Habitat now invests $500K\u2013$750K per deal across 49 companies." },
];

export const ATL_VCS = [
    { fund: "Collab Capital", check: "$1\u20132M (Fund II: $75M)", fit: "Black-founder focus; SPACE profit-sharing; LPs include Apple, Google, Goldman" },
    { fund: "Atlanta Ventures", check: "$500K\u2013$1.5M", fit: "29 deals since 2018; seed-stage; SaaS/subscription thesis matches retainer model" },
    { fund: "Tech Square Ventures", check: "$500K\u2013$3M", fit: "Most active GA VC (56 deals); \u2018tech-enabled services\u2019 explicitly included" },
    { fund: "Valor Ventures", check: "$500K\u2013$2M", fit: "Southeast B2B/AI seed specialist" },
    { fund: "Panoramic / BIP Ventures", check: "$100K\u2013$20M+", fit: "$550M+ AUM; 35 GA deals since 2018; broadest mandate" },
];

export const ATL_DEAL_TERMS = [
    { metric: "Median national seed round", data: "$2.5M (2024)" },
    { metric: "Atlanta typical seed range", data: "$1M\u2013$2.5M" },
    { metric: "Average SE check (2025, all stages)", data: "$6.8M" },
    { metric: "Georgia total investments (2025f)", data: "244 deals / $1.5B" },
    { metric: "Georgia total since 2018", data: "3,236 investments / $17.7B" },
    { metric: "Pre-seed typical", data: "$500K\u2013$1M" },
    { metric: "Series A range", data: "$5\u201312M" },
];

/* ─── 6. Atlanta Tailwinds ─── */
export const TAILWINDS = [
    { event: "FIFA World Cup 2026", detail: "8 matches at Mercedes-Benz Stadium (June\u2013July 2026). $503.2M projected economic impact on Georgia. Invest Atlanta Business Readiness Loan Fund: $5K\u2013$15K per business at 3% to Prime. R.O.V. \u2018World Cup Ready\u2019 package: rush branding + web + AI chatbot.", color: "#1D9E75" },
    { event: "Super Bowl LXII (2028)", detail: "Atlanta\u2019s 4th Super Bowl. Estimated $300M\u2013$1.3B host-city revenue. 2019 ATL Super Bowl: $400M+ impact. New hotels + Centennial Yards mixed-use completing near stadium \u2014 each a potential client.", color: "#E8A838" },
    { event: "Atlanta Tech Ecosystem", detail: "Tech sector: $58.6B economic impact, 7.2% of workforce, 13,147 tech establishments. #3 best city for tech careers. 25%+ surge in tech job postings in early 2026. #1 state for business 12 consecutive years.", color: "#7F77DD" },
    { event: "Southeast VC Acceleration", detail: "$7.1B deployed in H1 2025 (33% YoY increase). Full-year projection: $12B. Georgia: $17.7B total since 2018 across 3,236 deals. IT/SaaS dominates deal count.", color: "#E84B8A" },
];

export const GA_INCENTIVES = [
    { program: "Georgia Film/Post-Production Tax Credit", benefit: "20% base + 10% GA logo + 5% rural = up to 35%; no cap. $887M credits in 2025. Post-production credit reinstated Jan 1, 2026.", relevance: "R.O.V.\u2019s mixing/mastering + visual production may qualify" },
    { program: "Invest Atlanta SBIG", benefit: "Grants up to $50,000 for storefront/interior improvements", relevance: "Studio buildout, equipment upgrades" },
    { program: "Business Readiness Loan Fund", benefit: "$5K\u2013$15K loans at 3% to Prime, up to 3-year terms", relevance: "Working capital for World Cup prep" },
    { program: "Invest Atlanta Small Business Support", benefit: "$30M+ distributed since 2022 in loans, grants, and TA", relevance: "General business development funding" },
];

/* ─── 7. Scalability ─── */
export const AI_DELIVERY = [
    { deliverable: "Brand identity concept exploration", traditional: "8\u201312 hrs ($800\u2013$1,800)", ai: "2\u20134 hrs ($200\u2013$600)", improvement: "60\u201370% reduction" },
    { deliverable: "Social media graphic set (8 assets)", traditional: "4\u20136 hrs ($400\u2013$900)", ai: "1\u20132 hrs ($100\u2013$300)", improvement: "65\u201375% reduction" },
    { deliverable: "Video editing (social reels, 30\u201360s)", traditional: "3\u20135 hrs ($300\u2013$750)", ai: "1\u20132 hrs ($100\u2013$300)", improvement: "60\u201370% reduction" },
    { deliverable: "Email template design", traditional: "3\u20134 hrs ($300\u2013$600)", ai: "1 hr ($100\u2013$150)", improvement: "70\u201375% reduction" },
    { deliverable: "n8n workflow build (standard)", traditional: "6\u201310 hrs ($600\u2013$1,500)", ai: "2\u20134 hrs ($200\u2013$600)", improvement: "55\u201365% reduction" },
    { deliverable: "Mixing/mastering (per song)", traditional: "4\u20138 hrs ($200\u2013$400)", ai: "2\u20134 hrs ($100\u2013$200)", improvement: "50% reduction" },
    { deliverable: "Drone footage editing (RE)", traditional: "2\u20133 hrs ($200\u2013$450)", ai: "0.5\u20131 hr ($50\u2013$150)", improvement: "65\u201375% reduction" },
];

export const PRODUCT_ROADMAP = [
    { phase: "Phase 1 (Now)", timeline: "Year 1", product: "Productized packages (Brand Launch, Artist Starter, World Cup Ready)", model: "Fixed-price \u2192 retainer conversion" },
    { phase: "Phase 2", timeline: "Year 1\u20132", product: "Subscription creative tiers ($500\u2013$5K/mo)", model: "Monthly recurring revenue" },
    { phase: "Phase 3", timeline: "Year 2\u20133", product: "Self-serve AI automation templates (n8n marketplace)", model: "Per-template or subscription" },
    { phase: "Phase 4", timeline: "Year 3+", product: "R.O.V. Creative Platform (client portal, dashboards)", model: "Platform SaaS + service delivery" },
    { phase: "Phase 5", timeline: "Year 4+", product: "White-label automation packages for other agencies", model: "B2B licensing revenue" },
];

export const EXPANSION_CITIES = [
    { city: "Houston", music: "$6B+ music/entertainment", startup: "Growing tech hub; Rice pipeline", culture: "Hispanic + Black intersection", fit: "High" },
    { city: "Miami", music: "$4B+ nightlife; Latin music capital", startup: "Booming tech migration post-COVID", culture: "Latin + Caribbean fusion", fit: "High" },
    { city: "Washington DC", music: "$3B+ creative; go-go heritage", startup: "Gov tech corridor; Howard pipeline", culture: "HBCU culture + policy", fit: "Medium-High" },
    { city: "Nashville", music: "$10B+ music industry", startup: "Launch Tennessee accelerator", culture: "Country + hip-hop crossover", fit: "High" },
];

/* ─── 8. Risk Analysis ─── */
export const RISKS = [
    { risk: "Client Concentration", detail: "Losing a single large retainer could significantly impact early revenue.", mitigation: "Keep no client above 20% of revenue. Multi-segment strategy (artists, events, RE, startups, restaurants) inherently diversifies. By Year 2 (60\u2013100 clients), no single client >5\u201310%. 8-figure agencies maintain 92% retention vs 78% for 7-figure." },
    { risk: "Talent Dependency", detail: "Key creative leaving could affect delivery quality and client relationships.", mitigation: "AI-assisted delivery reduces individual dependency. Workflows documented in n8n. Brand guidelines systematized. Templates reusable. Target early-career designers (1\u20133 yrs) who value creative breadth + equity. Revenue per head target: $150K+." },
    { risk: "AI Commoditization", detail: "AI tools making basic creative cheaper (DALL-E, AI mastering, Wix AI).", mitigation: "Move up the value chain \u2014 AI handles production, humans handle strategy + cultural judgment. R.O.V.\u2019s AI automation services actually benefit from AI advancement. 80% of agencies use AI but only ~5% have mature integration \u2014 R.O.V. is in the 5%." },
    { risk: "Market Cyclicality", detail: "Economic downturns reduce marketing/creative budgets.", mitigation: "Retainer model more stable than project-based. R.O.V.\u2019s $1K\u2013$5K/mo retainer is below cost of one junior designer ($55K\u2013$65K/yr). Student/artist pipeline provides counter-cyclical volume. Niche agencies report 40\u201375% gross margins even in downturns." },
];

/* ─── 9. Investor Metrics ─── */
export const INVESTOR_METRICS = [
    { metric: "Revenue (ARR)", minimum: "$100K+", strong: "$500K\u2013$1M", rovTarget: "$300K\u2013$800K" },
    { metric: "Revenue growth", minimum: "200%+ YoY", strong: "15\u201320% MoM", rovTarget: "15%+ MoM" },
    { metric: "Recurring revenue %", minimum: "50%+", strong: "70%+", rovTarget: "60\u201370% by end of Year 2" },
    { metric: "Gross margin", minimum: "40%+", strong: "60%+", rovTarget: "55\u201375% (blended)" },
    { metric: "LTV:CAC", minimum: "3:1+", strong: "5:1+", rovTarget: "12:1\u201348:1 (referral-driven)" },
    { metric: "Client retention", minimum: "80%+", strong: "90%+", rovTarget: "85%+ Year 1 \u2192 92%+ Year 3" },
    { metric: "Client concentration", minimum: "<20% per client", strong: "<10% per client", rovTarget: "<15% by end of Year 1" },
    { metric: "CAC payback", minimum: "<12 months", strong: "<6 months", rovTarget: "<3 months (low-CAC channels)" },
];
