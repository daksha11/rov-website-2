import type { NavSection } from "../../_shared/types";

export const NAV_SECTIONS: NavSection[] = [
    { id: "ds-overview", label: "Market Overview" },
    { id: "ds-brand", label: "Brand Identity" },
    { id: "ds-music", label: "Music + Artist" },
    { id: "ds-event", label: "Event + Promo" },
    { id: "ds-social", label: "Social Media" },
    { id: "ds-packaging", label: "Packaging + Labels" },
    { id: "ds-motion", label: "Motion Design" },
    { id: "ds-stage", label: "Stage Visuals" },
    { id: "ds-pricing", label: "Pricing" },
    { id: "ds-clients", label: "Getting Clients" },
];

export const MARKET_STATS = [
    { label: "Consistent Branding Revenue Lift", value: 23, suffix: "%", prefix: "+", sub: "Average revenue increase" },
    { label: "Brand Recall With Consistent Identity", value: 33, suffix: "%", prefix: "+", sub: "Higher than inconsistent brands" },
    { label: "Logo Increases Brand Recognition", value: 80, suffix: "%", prefix: "+", sub: "vs no visual identity" },
    { label: "Color Drives Purchase Decisions", value: 85, suffix: "%", prefix: "", sub: "Of all snap purchase judgments" },
    { label: "Consumers Who Must Trust to Buy", value: 81, suffix: "%", prefix: "", sub: "Won\u2019t buy from brands they don\u2019t trust" },
    { label: "Companies With Brand Consistency", value: 60, suffix: "%", prefix: "", sub: "Report 10\u201320% revenue growth" },
    { label: "First Impression Time", value: 0.1, suffix: " sec", prefix: "", sub: "Visual first impression window" },
    { label: "Consumers Recalling Color vs Name", value: 81, suffix: "%", prefix: "", sub: "More likely to recall color than name" },
];

export const BRAND_ROI = [
    { label: "Consistent Branding Revenue Lift", value: "+23%", sub: "Proven revenue impact" },
    { label: "Brand Visibility Lift", value: "3.5x", sub: "Consistently vs inconsistently presented" },
    { label: "Revenue Boost From Consistency", value: "20%+", sub: "Reported by 33% of companies" },
    { label: "Logo Trust Boost", value: "+40%", sub: "Well-designed logos boost trust" },
];

export const BRAND_CORE = ["Primary logo (full color, reversed, monochrome)", "Secondary / submark logos", "Color palette (primary, secondary, neutrals + hex/RGB/CMYK)", "Typography system (primary, secondary, hierarchy rules)", "Brand usage guidelines (do/don\u2019t, spacing, clear space)", "Tone of voice guidelines (brief)"];
export const BRAND_OPTIONAL = ["Business card design", "Email signature template", "Social media profile kit (avatar, banner, highlight covers)", "Letterhead + document templates", "Merchandise / apparel mockups"];

export const BRAND_TIERS = [
    { name: "Starter Logo", price: "$300\u2013$800", tag: "New businesses, solo artists", tagColor: "rgba(255,244,227,0.3)", highlighted: false, features: ["Logo mark + wordmark", "2 color variations", "3 revision rounds", "PNG + SVG delivery", "5\u20137 day delivery"] },
    { name: "Brand Identity Kit", price: "$1,200\u2013$3,000", tag: "Established businesses, funded startups", tagColor: "#E8A838", highlighted: true, features: ["Full logo suite (primary, secondary, submark)", "Color palette + typography system", "Brand guidelines document (PDF)", "Social media profile kit", "Business card design", "2\u20133 week delivery"] },
    { name: "Full Brand System", price: "$3,000\u2013$6,000+", tag: "Companies rebranding, CPG, premium", tagColor: "#7F77DD", highlighted: false, features: ["Everything in Brand Identity Kit", "Extended guidelines for all touchpoints", "Packaging design included", "Website visual system", "Stationery suite", "4\u20136 week delivery"] },
];

export const FIVERR_BAD = ["Template-based, seen on 1,000 other brands", "No brand strategy \u2014 just a file", "No font licensing, no usage guidelines", "PNG only \u2014 unusable for print/embroidery/scale", "No cultural context or industry knowledge"];
export const ROV_GOOD = ["Custom-built from scratch \u2014 around your story", "Brand strategy conversation before design begins", "Print-ready vector files (AI, EPS, SVG, PDF)", "Full usage guidelines and color codes", "Atlanta cultural context and trend awareness", "Cross-sells into web, packaging, social, and more"];

export const MUSIC_STATS = [
    { label: "Album Art As Visual Gateway", value: "First thing", sub: "Seen before a single note plays" },
    { label: "Streaming Platform Thumbnail", value: "3000x3000px", sub: "Minimum for all platforms" },
    { label: "Fiverr Cover Art Range", value: "$50\u2013$300", sub: "What artists currently settle for" },
    { label: "Professional Cover Art", value: "$300\u2013$2,000+", sub: "Market rate for real quality" },
];

export const MUSIC_SERVICES = ["Single cover art \u2014 social-optimized square + story", "EP cover art \u2014 front cover + cohesive visual system", "Album art \u2014 full package (front/back/spine)", "Artist logo / wordmark", "Press kit graphics (EPK design)", "Spotify / Apple Music canvas graphics", "Music video graphics + title cards", "Merch mockups (tees, caps, stickers)", "Animated cover art (motion version)"];

export const MUSIC_PRICING = [
    { type: "Single cover art", fiverr: "$20\u2013$80", mid: "$150\u2013$400", rov: "$100\u2013$300" },
    { type: "EP cover (3\u20136 songs)", fiverr: "$80\u2013$200", mid: "$300\u2013$700", rov: "$250\u2013$600" },
    { type: "Full album package", fiverr: "$150\u2013$400", mid: "$500\u2013$2,000+", rov: "$500\u2013$1,500" },
    { type: "Artist logo / wordmark", fiverr: "$50\u2013$150", mid: "$300\u2013$800", rov: "$200\u2013$600" },
    { type: "Social media kit", fiverr: "$50\u2013$150", mid: "$200\u2013$600", rov: "$150\u2013$400" },
    { type: "Animated cover art", fiverr: "$100\u2013$300", mid: "$300\u2013$800", rov: "$250\u2013$600" },
    { type: "Full artist brand package", fiverr: "$300\u2013$600", mid: "$1,000\u2013$3,500", rov: "$800\u2013$2,500" },
];

export const EVENT_STATS_D = [
    { label: "Flyer Is First Touchpoint", value: "Every time", sub: "Before venue, lineup, ticket link" },
    { label: "Social Share Rate", value: "Higher", sub: "People share what looks good" },
    { label: "Eventbrite With Design", value: "More clicks", sub: "vs plain text listings" },
    { label: "Repeat Promoter Value", value: "Monthly", sub: "New graphics every 2\u20134 weeks" },
];

export const EVENT_PRICING_D = [
    { type: "Single event flyer", fiverr: "$10\u2013$50", mid: "$150\u2013$400", rov: "$75\u2013$250" },
    { type: "Flyer + story + square", fiverr: "$30\u2013$100", mid: "$250\u2013$600", rov: "$150\u2013$400" },
    { type: "Full event graphic package", fiverr: "$50\u2013$200", mid: "$400\u2013$1,000", rov: "$300\u2013$700" },
    { type: "Event series branding (4 events)", fiverr: "$150\u2013$400", mid: "$600\u2013$2,000", rov: "$500\u2013$1,500" },
    { type: "Stage / backdrop design", fiverr: "$100\u2013$300", mid: "$300\u2013$800", rov: "$250\u2013$600" },
    { type: "Monthly retainer (2\u20134 events/mo)", fiverr: "\u2014", mid: "$500\u2013$2,000", rov: "$400\u2013$1,200" },
];

export const SOCIAL_STATS = [
    { label: "Instagram Discovery via Profile", value: "83%", sub: "Users discover new brands on IG" },
    { label: "Consistent Visual Identity", value: "+33%", sub: "Higher brand recall" },
    { label: "Highlight Covers View Rate", value: "High", sub: "First thing visited after bio" },
    { label: "Templates Save Time", value: "80%+", sub: "Don\u2019t post because creation is slow" },
];

export const SOCIAL_PRICING = [
    { type: "5 Instagram post templates", fiverr: "$20\u2013$80", mid: "$150\u2013$400", rov: "$100\u2013$300" },
    { type: "Story template set (5)", fiverr: "$20\u2013$80", mid: "$150\u2013$350", rov: "$100\u2013$250" },
    { type: "Highlight cover set (12)", fiverr: "$10\u2013$50", mid: "$80\u2013$200", rov: "$75\u2013$150" },
    { type: "Full profile branding kit", fiverr: "$50\u2013$150", mid: "$300\u2013$800", rov: "$250\u2013$600" },
    { type: "Complete social design system", fiverr: "$100\u2013$300", mid: "$500\u2013$1,500", rov: "$400\u2013$1,200" },
    { type: "Monthly social (12 posts)", fiverr: "\u2014", mid: "$400\u2013$1,200", rov: "$300\u2013$800/mo" },
];

export const PKG_STATS = [
    { label: "Packaging Drives Purchase", value: "72%", sub: "Consumers say packaging influences buying" },
    { label: "Premium Packaging = Premium Price", value: "Direct", sub: "Signals value before product is used" },
    { label: "Sustainable Packaging Pref", value: "71%", sub: "More likely to buy eco-friendly" },
    { label: "Packaging Design Market Rate", value: "$300\u2013$3K", sub: "Professional range" },
];

export const PKG_PRICING = [
    { type: "Single product label", fiverr: "$30\u2013$100", mid: "$300\u2013$800", rov: "$200\u2013$600" },
    { type: "Label (2\u20133 variants)", fiverr: "$80\u2013$200", mid: "$600\u2013$1,500", rov: "$400\u2013$1,200" },
    { type: "Full packaging system", fiverr: "$150\u2013$400", mid: "$1,500\u2013$5,000", rov: "$800\u2013$2,500" },
    { type: "Beverage / sauce brand", fiverr: "$100\u2013$300", mid: "$800\u2013$3,000", rov: "$600\u2013$2,000" },
    { type: "Sticker pack (6\u201310)", fiverr: "$30\u2013$100", mid: "$200\u2013$500", rov: "$150\u2013$400" },
    { type: "Merch packaging system", fiverr: "$100\u2013$300", mid: "$500\u2013$2,000", rov: "$400\u2013$1,500" },
];

export const MOTION_STATS = [
    { label: "Avg Cost 60-Sec Motion", value: "$3,130", sub: "Market avg ($1K\u2013$16K range)" },
    { label: "Motion Marketers Good ROI", value: "83%", sub: "Report positive returns" },
    { label: "Brands Increasing Motion Budget", value: "62%", sub: "In 2025" },
    { label: "Motion vs Static", value: "More engaging", sub: "Outperforms on every platform" },
];

export const MOTION_PRICING = [
    { type: "Animated logo reveal (10\u201320 sec)", fiverr: "$100\u2013$300", mid: "$300\u2013$1,000", rov: "$250\u2013$600" },
    { type: "Kinetic typography (15\u201330 sec)", fiverr: "$100\u2013$400", mid: "$400\u2013$1,500", rov: "$300\u2013$800" },
    { type: "Animated social post (15 sec)", fiverr: "$50\u2013$200", mid: "$200\u2013$600", rov: "$150\u2013$400" },
    { type: "Brand intro animation", fiverr: "$100\u2013$400", mid: "$400\u2013$1,200", rov: "$300\u2013$700" },
    { type: "2D explainer (30\u201360 sec)", fiverr: "$300\u2013$800", mid: "$1,000\u2013$5,000", rov: "$800\u2013$2,500" },
    { type: "Music visualizer / lyric video", fiverr: "$100\u2013$400", mid: "$300\u2013$1,000", rov: "$250\u2013$700" },
    { type: "Full motion brand package", fiverr: "$500\u2013$1,500", mid: "$2,000\u2013$8,000", rov: "$1,500\u2013$4,000" },
];

export const STAGE_STATS = [
    { label: "Custom LED Content", value: "$500\u2013$2K/min", sub: "If sourced separately" },
    { label: "LED Wall Rental ATL", value: "$10,000+/event", sub: "Hardware before content" },
    { label: "VJ Loop Package Rate", value: "$500\u2013$2K", sub: "Per event, per loop set" },
    { label: "Stage + Brand Overlap", value: "Zero", sub: "No ATL agency does both" },
];

export const STAGE_PRICING = [
    { type: "VJ loop package (5\u20138 loops)", mid: "$800\u2013$2,500", rov: "$600\u2013$1,800" },
    { type: "Single branded backdrop loop", mid: "$300\u2013$800", rov: "$200\u2013$500" },
    { type: "Artist performance visuals", mid: "$1,500\u2013$5,000", rov: "$1,000\u2013$3,500" },
    { type: "Event intro / countdown", mid: "$400\u2013$1,200", rov: "$300\u2013$800" },
    { type: "Full stage visual system", mid: "$3,000\u2013$10,000", rov: "$2,000\u2013$6,000" },
    { type: "Motion for live stream", mid: "$500\u2013$1,500", rov: "$400\u2013$1,000" },
];

export const MASTER_PRICING = [
    { service: "Single logo", fiverr: "$20\u2013$100", mid: "$300\u2013$800", rov: "$200\u2013$600" },
    { service: "Brand identity kit", fiverr: "$100\u2013$300", mid: "$1,500\u2013$5,000", rov: "$1,200\u2013$3,000" },
    { service: "Full brand system", fiverr: "$300\u2013$600", mid: "$3,000\u2013$10,000", rov: "$3,000\u2013$6,000+" },
    { service: "Single cover art", fiverr: "$20\u2013$80", mid: "$150\u2013$400", rov: "$100\u2013$300" },
    { service: "Full album package", fiverr: "$150\u2013$400", mid: "$500\u2013$2,000", rov: "$500\u2013$1,500" },
    { service: "Event flyer (all formats)", fiverr: "$30\u2013$100", mid: "$250\u2013$600", rov: "$150\u2013$400" },
    { service: "Social design system", fiverr: "$100\u2013$300", mid: "$500\u2013$1,500", rov: "$400\u2013$1,200" },
    { service: "Product label", fiverr: "$30\u2013$100", mid: "$300\u2013$800", rov: "$200\u2013$600" },
    { service: "Full packaging", fiverr: "$150\u2013$400", mid: "$1,500\u2013$5,000", rov: "$800\u2013$2,500" },
    { service: "Animated logo", fiverr: "$100\u2013$300", mid: "$300\u2013$1,000", rov: "$250\u2013$600" },
    { service: "2D explainer (30\u201360 sec)", fiverr: "$300\u2013$800", mid: "$1,000\u2013$5,000", rov: "$800\u2013$2,500" },
    { service: "VJ loop package", fiverr: "$500\u2013$1,000", mid: "$800\u2013$2,500", rov: "$600\u2013$1,800" },
    { service: "Stage visual system", fiverr: "$1,000\u2013$3,000", mid: "$3,000\u2013$10,000", rov: "$2,000\u2013$6,000" },
];

export const HOURLY_RATES = [
    { tier: "Budget freelance", body: "$25\u2013$50/hr. Entry-level, portfolio-building. Higher revision risk, template-adjacent." },
    { tier: "Experienced freelance (R.O.V.)", body: "$75\u2013$150/hr. Strategic, culturally fluent, production-ready files." },
    { tier: "Agency", body: "$150\u2013$300/hr+. High overhead baked in. Slower, less personal." },
];

export const DESIGN_RETAINERS = [
    { name: "Content Design", price: "$500\u2013$1,000/month", tag: "Ongoing social + promo", tagColor: "rgba(255,244,227,0.3)", features: ["8\u201312 social posts/month", "2\u20134 event flyers/month", "Story templates", "Best for: small businesses, solo artists"] },
    { name: "Brand Maintenance", price: "$1,000\u2013$2,000/month", tag: "Brand + content + motion", tagColor: "#E8A838", features: ["Everything in Content Design", "2\u20133 motion graphics/month", "Brand asset updates", "Priority turnaround", "Best for: event orgs, growing brands"] },
    { name: "Full Creative Partner", price: "$2,000\u2013$4,000/month", tag: "Complete design coverage", tagColor: "#1D9E75", features: ["Everything in Brand Maintenance", "Stage visual content", "Packaging updates", "Cross-platform consistency", "Best for: established brands, CPG"] },
];

export const CLIENT_STEPS = [
    { color: "#1D9E75", title: "Identify the visual problem", body: "Pull up their Instagram, website, event flyers. Find the specific design failure: inconsistent fonts, amateur flyer, no brand cohesion. Come with the observation, not a pitch." },
    { color: "#7F77DD", title: "The specific observation opener", body: "Artists: \u2018Your music is professional \u2014 your cover art doesn\u2019t match.\u2019 Event orgs: \u2018The vibe in the room doesn\u2019t match what you\u2019re putting out visually.\u2019 CPG: \u2018Your product is incredible \u2014 the label isn\u2019t telling that story.\u2019" },
    { color: "#E8A838", title: "Show adjacent work immediately", body: "Don\u2019t describe \u2014 show the most relevant portfolio piece on your phone. Always have 3\u20135 examples sorted by client type." },
    { color: "#1D9E75", title: "Offer a free spec for anchor clients", body: "Spend 2 hours on a quick concept (logo direction, flyer, cover art). Send: \u2018This is the direction I\u2019d take your brand.\u2019 Converts at extremely high rate." },
    { color: "#7F77DD", title: "Bridge to the full R.O.V. stack", body: "After the flyer: \u2018Your website doesn\u2019t match this.\u2019 After cover art: \u2018Since we\u2019re recording here, we handle artwork too.\u2019 Design is the gateway; the full stack is the destination." },
];

export const OUTREACH_CHANNELS = [
    { channel: "Instagram DM", color: "#1D9E75", body: "Follow first. Like 2\u20133 posts. Comment specifically. Then DM: \u2018I design for [music/food/event] brands in Atlanta. Your visual identity could go to a completely different level.\u2019 Attach work." },
    { channel: "Cold email \u2014 CPG + professional", color: "#7F77DD", body: "Subject: \u2018Quick thought on [Brand]\u2019s packaging.\u2019 Compliment + gap observation. Under 5 sentences. \u2018Happy to put together a quick concept.\u2019" },
    { channel: "Event promoter outreach", color: "#E8A838", body: "DM within 24 hours of their event: \u2018That event looked incredible \u2014 there\u2019s a visual identity that could make [Event Name] instantly recognizable.\u2019" },
    { channel: "Referral network", color: "#E84B8A", body: "Every studio session \u2192 cover art. Every website client \u2192 brand identity. Every event client \u2192 who else puts on events. Design referrals compound fastest." },
];

export const CRED_SIGNALS = [
    { signal: "Portfolio showing range across client types", impact: 98 },
    { signal: "Cultural relevance \u2014 work that looks like ATL", impact: 95 },
    { signal: "Before/after transformations", impact: 90 },
    { signal: "Named client testimonials", impact: 85 },
    { signal: "Social showing design process (WIP, reels)", impact: 80 },
    { signal: "Speed + process transparency", impact: 75 },
];

export const REVENUE_TARGETS = [
    { goal: "Month 1", target: "5 design projects", revenue: "$750\u2013$3,000" },
    { goal: "Month 2", target: "8 projects + 1 brand kit", revenue: "$2,000\u2013$6,000" },
    { goal: "Month 3", target: "1 design retainer", revenue: "$500\u2013$1,200/mo" },
    { goal: "Ongoing", target: "1 referral per project", revenue: "Compounding" },
];
