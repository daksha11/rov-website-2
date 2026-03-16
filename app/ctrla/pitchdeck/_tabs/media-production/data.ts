import type { NavSection } from "../../_shared/types";

export const NAV_SECTIONS: NavSection[] = [
    { id: "mp-overview", label: "Market Overview" },
    { id: "mp-roi", label: "ROI + Business Case" },
    { id: "mp-shortform", label: "Short-Form Video" },
    { id: "mp-realestate", label: "Real Estate" },
    { id: "mp-segments", label: "Target Segments" },
    { id: "mp-pricing", label: "Pricing" },
    { id: "mp-retainers", label: "Retainer Strategy" },
    { id: "mp-drone", label: "Drone + FAA" },
    { id: "mp-clients", label: "Getting Clients" },
];

/* ─── 1. Market Overview ─── */
export const MARKET_STATS = [
    { label: "Businesses Using Video", value: 91, suffix: "%", prefix: "", sub: "As a marketing tool (2026)" },
    { label: "Video Marketers With Good ROI", value: 82, suffix: "%", prefix: "", sub: "Consistent returns (Wyzowl)" },
    { label: "Consumers Who Prefer Video", value: 72, suffix: "%", prefix: "", sub: "To learn about products/services" },
    { label: "Global Video Ad Spend 2026", value: 236, suffix: "B", prefix: "$", sub: "Projected, growing to $268B by 2029" },
    { label: "Short-Form Video Growth", value: 75, suffix: "%", prefix: "", sub: "Increase in global consumption" },
    { label: "Video Share of Internet Traffic", value: 82, suffix: "%", prefix: "", sub: "Of all internet traffic by 2025" },
    { label: "Purchase Influenced by Video", value: 82, suffix: "%", prefix: "", sub: "Of buyers influenced by video" },
    { label: "Companies Growing Revenue Faster", value: 49, suffix: "%", prefix: "", sub: "Revenue growth with video vs without" },
];

/* ─── 2. ROI ─── */
export const ROI_STATS = [
    { label: "Video on Landing Page", value: "+80\u201386%", sub: "Conversion rate increase" },
    { label: "Websites With Video Conversion", value: "4.8%", sub: "vs 2.9% without video" },
    { label: "Video Email Click-Through", value: "+300%", sub: "vs emails without video" },
    { label: "Leads Generated", value: "+87%", sub: "Businesses using video generate more leads" },
    { label: "Direct Sales Increase", value: "+83%", sub: "Video marketers say video drove sales" },
    { label: "Time on Site", value: "+88%", sub: "More time spent with video vs no video" },
];

export const ROI_BY_FORMAT = [
    { format: "Short-form reels/TikToks", color: "#1D9E75", stats: ["Short-form videos (30\u201360 sec) deliver 39% higher ROI than longer formats for small business", "66% of consumers say short-form is the most engaging content type", "Short-form video ad spending hitting $100B+ globally", "TikTok: 39% higher engagement-to-conversion rate than Instagram Reels", "Instagram Reels: 200 billion daily views across Meta (2025)", "95% message retention via video vs 10% via text alone"] },
    { format: "Real estate listings", color: "#E8A838", stats: ["Listings with video receive 403% more inquiries than those without", "Drone/aerial photos sell homes 68% faster than standard images alone", "Professional video gets 118% more engagement on listing platforms", "Virtual tours help properties sell 31% faster", "Only 9% of agents create listing videos \u2014 massive gap vs demand", "Agents with professional photography earn $8,683 per sale vs $4,292 without"] },
    { format: "Brand + promo videos", color: "#7F77DD", stats: ["85% of people have been convinced to buy after watching a brand video", "Explainer videos increase conversions by 27% over text-only descriptions", "Adding video to landing page increases conversion by up to 68%", "81% of B2B marketers say video directly contributed to closing a deal", "Companies allocating 30%+ of ad budget to video see 1.5x higher ROAS", "Brands running weekly video content see ROI growth 34% faster than monthly posters"] },
    { format: "Dialogue/testimonial videos", color: "#E84B8A", stats: ["96% of people have watched an explainer video to learn about a product/service", "79% of people say watching a testimonial video influenced them", "User-generated-style testimonial videos lead to 23% higher purchase rate", "Personalized video campaigns yield 18% higher ROI than non-personalized", "39% of businesses report testimonial videos deliver the highest ROI of any format"] },
];

/* ─── 3. Short-Form ─── */
export const PLATFORM_STATS = [
    { label: "Instagram Reels Daily Views", value: "200B", sub: "Across Meta platforms (2025)" },
    { label: "TikTok Monthly Users", value: "1.59B", sub: "40% of short-form platform market share" },
    { label: "YouTube Shorts Monthly Users", value: "2B", sub: "Fastest growing platform" },
    { label: "Short vs Long Engagement", value: "2.5x", sub: "Higher on social platforms" },
];

export const PLATFORMS: Record<string, { label: string; items: string[] }> = {
    reels: { label: "Instagram Reels", items: ["200 billion daily Reel views (2025 estimate)", "35% of total Instagram usage time spent on Reels", "Reels between 60\u201390 seconds get the highest engagement and views", "Reels reach up to 726.8 million users via ads", "83% of users discover new products on Instagram", "Smaller accounts have highest engagement rates \u2014 good for new clients", "Algorithm favors original, non-watermarked Reels \u2014 don\u2019t cross-post from TikTok", "Best posting cadence: 4\u20137 Reels per week for growth"] },
    tiktok: { label: "TikTok", items: ["1.59 billion active users, 2.65 billion monthly visits", "Android users spend average 35 hours/month on TikTok", "TikTok engagement rate: 2.80\u20133.15% vs Instagram Reels at 0.65%", "50% of TikTok users have bought something after seeing content", "Algorithm favors content quality over follower count \u2014 new accounts CAN go viral", "2-minute TikTok videos have best engagement and views", "Best for: brand awareness, cultural connection, discovery", "82% of Gen Z uses TikTok for entertainment, shopping, AND search"] },
    trial: { label: "Trial Reels", items: ["Instagram\u2019s testing feature \u2014 shows Reels to non-followers first", "Algorithm tests with small audience, then pushes wider if engagement is strong", "Best for: new client accounts with small following trying to gain traction fast", "R.O.V.\u2019s strategy: create optimized hooks in first 3 seconds, use Trial Reels to bypass follower count", "Niche, specific content performs better than broad generic content on Trial Reels"] },
};

/* ─── 4. Real Estate ─── */
export const RE_STATS = [
    { label: "Video Listing Inquiries", value: 403, suffix: "%", prefix: "", sub: "More than listings without video" },
    { label: "Drone Photos Sell Faster", value: 68, suffix: "%", prefix: "", sub: "vs standard images alone" },
    { label: "Professional Video Engagement", value: 118, suffix: "%", prefix: "", sub: "More than standard listings" },
    { label: "Agents Using Video", value: 38, suffix: "%", prefix: "", sub: "Only \u2014 massive gap to fill" },
    { label: "Agents Creating Listing Videos", value: 9, suffix: "%", prefix: "", sub: "Despite proven ROI" },
    { label: "Drone Adoption 2025", value: 52, suffix: "%", prefix: "", sub: "Up from 35% in 2024" },
];

export const RE_VIDEO_TYPES = [
    { type: "Single-family listing", price: "$500\u2013$800", features: ["2\u20133 minute walkthrough with drone", "30\u201360 sec social cut included", "1\u20132 day delivery"] },
    { type: "Luxury/commercial listing", price: "$1,200\u2013$2,500", features: ["Full cinematic production", "Multiple social cuts (Reel + TikTok + YouTube)", "Drone + interior + neighborhood", "Color graded LOG footage"] },
    { type: "Agent personal brand video", price: "$800\u2013$1,500", features: ["Dialogue-style introduction", "2\u20134 min long-form + short-form cuts", "Talking to camera with b-roll"] },
    { type: "Brokerage/team video", price: "$1,500\u2013$3,500", features: ["Full team production", "Office culture + listing highlights", "Multiple deliverables for all platforms"] },
    { type: "Neighborhood/development highlight", price: "$1,500\u2013$3,000", features: ["Drone + ground footage of the area", "Lifestyle/amenities b-roll", "Voiceover or text-overlay option"] },
];

export const RE_RETAINERS = [
    { name: "Listing Package", price: "$800\u2013$1,200/month", best: "individual agents, 1\u20133 listings/month", features: ["2 listing videos/month (2\u20133 min + social cut)", "Drone included on all listings", "2-day delivery standard"] },
    { name: "Agent Brand Package", price: "$1,500\u2013$2,500/month", best: "top producers, 3\u20136 listings/month", highlighted: true as const, features: ["4 listing videos + social cuts", "1 personal brand/market update video/month", "4 short-form social edits (Reels/TikToks)", "Priority scheduling"] },
    { name: "Brokerage Partner", price: "$2,500\u2013$4,500/month", best: "teams, small brokerages, volume agents", features: ["Unlimited listing coverage (up to 8/month)", "Full social content calendar", "Drone on all listings", "Team + brand video quarterly", "Custom deliverable breakdown"] },
];

/* ─── 5. Target Segments ─── */
export type MediaSegKey = "restaurants" | "boutiques" | "events" | "local" | "artists" | "b2b";
export const MEDIA_SEGMENTS: Record<MediaSegKey, {
    label: string; problem: string; solution: string; pitch: string; price: string;
}> = {
    restaurants: {
        label: "Restaurants + Hospitality",
        problem: "Generic iPhone videos with no color grade, no story, no hook. Most restaurant social content looks the same \u2014 plate after plate, no atmosphere. 74% of consumers use social media to decide where to eat.",
        solution: "Atmospheric short-form content (food in motion, kitchen energy, dining ambiance). Reel/TikTok optimized. Same shoot yields: 1x 60-sec brand reel + 3\u20134 short food clips + story footage. Dialogue-style owner intro builds trust. LOG footage \u2192 cinematic color grade.",
        pitch: "Your food is the product. Our camera is how people fall in love with it before they walk in the door.",
        price: "$800\u2013$2,500/shoot | $1,500\u2013$3,000/month retainer",
    },
    boutiques: {
        label: "Clothing Boutiques + Retail",
        problem: "Product photos only. No video. No brand story. No social content showing how clothes move, fit, and feel. Shopify pages have 70% cart abandonment partly because static photos don\u2019t convey enough.",
        solution: "Lookbook-style movement videos. Brand story dialogue video (owner + process + culture). Drop announcement Reels/TikToks. Behind-the-scenes content. Motion adds what photography can\u2019t \u2014 texture, movement, and cultural context.",
        pitch: "The customer you\u2019re missing is on TikTok. They\u2019re buying from the brand that showed up in their For You page.",
        price: "$1,000\u2013$3,000/shoot | $1,500\u2013$2,500/month retainer",
    },
    events: {
        label: "Event Promoters + Orgs",
        problem: "Events happen and disappear. No recap content, no highlight video, no footage for next event\u2019s marketing. Sponsors have no proof of reach. The event was incredible \u2014 the internet never knew.",
        solution: "Event recap video (2\u20133 min cinematic). Short-form hype clips (30\u201360 sec) for post-event and pre-event marketing. Drone coverage. Artist/performer highlights. Crowd energy cut for social proof. One shoot, 10 pieces of content.",
        pitch: "Every event R.O.V. covers becomes a marketing asset for the next one.",
        price: "$1,500\u2013$3,500/event | Bundled with event retainer for monthly orgs",
    },
    local: {
        label: "Local Businesses (Shops, Studios, Gyms)",
        problem: "Zero video presence. Most they have is a Google Maps photo from 2019. Customers don\u2019t know what to expect. 96% of people watch explainer videos before visiting a service business.",
        solution: "Business intro / owner spotlight video (2\u20133 min dialogue-style). Space walkthrough with b-roll. Short-form social content. \u201CA day in the life\u201D format for gyms/studios. Testimonial-style customer spotlights.",
        pitch: "Your best marketing is showing people exactly what they get when they walk through your door.",
        price: "$800\u2013$2,000/project | $1,000\u2013$2,000/month retainer",
    },
    artists: {
        label: "Music Artists + Entertainment",
        problem: "Artists invest in recording but have no visual content strategy. Cover art and a Spotify link isn\u2019t enough. 67% of independent artists want to stay indie \u2014 but they\u2019re competing with major labels who have full production teams.",
        solution: "Music video concepts (narrative or performance-based). Release announcement Reels + TikToks. Studio session b-roll. Event/show recap footage. Same crew doing audio AND visual = consistency nobody else offers.",
        pitch: "You\u2019re not just releasing a song \u2014 you\u2019re building an artist brand. R.O.V. handles both the sound and the visuals.",
        price: "$1,500\u2013$5,000/music video | $500\u2013$1,500 content packages",
    },
    b2b: {
        label: "Tech Startups + Professional Services",
        problem: "Founders record Zoom demos on laptops. Law firms and advisors have zero video presence. 81% of B2B marketers say video directly contributed to closing a deal \u2014 yet most B2B companies don\u2019t have any.",
        solution: "Founder story / brand video (2\u20133 min cinematic with dialogue). Product demo with motion graphics overlay. Testimonial capture shoots. Professional talking head videos for thought leadership. LinkedIn-optimized short-form. Pitch deck video integrations.",
        pitch: "Your investors and clients form their opinion of your company in the first 10 seconds of visiting your site. Give them something to watch.",
        price: "$1,500\u2013$3,500/project | $1,500\u2013$3,000/month content package",
    },
};

/* ─── 6. Pricing ─── */
export const PRICING_TABLE = [
    { type: "Short-form reel/TikTok (15\u201360 sec)", budget: "$200\u2013$500", mid: "$500\u2013$1,500", rov: "$300\u2013$800" },
    { type: "Property listing video (2\u20134 min + drone)", budget: "$400\u2013$800", mid: "$800\u2013$2,000", rov: "$500\u2013$1,500" },
    { type: "Drone aerial package (photos + video)", budget: "$249\u2013$499", mid: "$500\u2013$1,000", rov: "$400\u2013$900" },
    { type: "Event recap video (2\u20133 min)", budget: "$500\u2013$1,500", mid: "$1,500\u2013$3,000", rov: "$1,000\u2013$2,500" },
    { type: "Brand/promo video (60\u201390 sec)", budget: "$1,000\u2013$3,000", mid: "$3,000\u2013$8,000", rov: "$1,500\u2013$3,000" },
    { type: "Dialogue/talking head (2\u20134 min)", budget: "$500\u2013$1,500", mid: "$1,500\u2013$4,000", rov: "$800\u2013$2,000" },
    { type: "Motion graphics/animated video", budget: "$1,500\u2013$5,000", mid: "$5,000\u2013$15,000", rov: "$2,500\u2013$5,000" },
    { type: "Full brand shoot (multi-deliverable day)", budget: "$2,000\u2013$5,000", mid: "$5,000\u2013$15,000", rov: "$2,500\u2013$5,000" },
];

export const FREELANCE_TIERS = [
    { tier: "Budget", body: "Day rate $300\u2013$700. Editing $30\u2013$60/hr. Basic shoots, limited equipment. No color grading, no drone, no organized deliverables." },
    { tier: "Average", body: "Day rate $600\u2013$1,000. Editing $60\u2013$90/hr. Solid execution, standard camera gear. Limited post-production. Typically no drone." },
    { tier: "High-end", body: "Day rate $2,000\u2013$3,500. Editing $100+/hr. Full production. R.O.V. operates at this quality level at average-tier pricing \u2014 the core competitive advantage." },
];

export const ADDONS = [
    { name: "Additional social cut from existing footage", price: "$150\u2013$300/cut" },
    { name: "Color grade upgrade (LOG \u2192 cinematic)", price: "+$200\u2013$500" },
    { name: "Voiceover (professional VO artist)", price: "+$200\u2013$500" },
    { name: "Motion graphics overlay", price: "+$300\u2013$800/video" },
    { name: "Raw footage delivery", price: "+$150\u2013$300" },
    { name: "Expedited delivery (under 24 hrs)", price: "+25\u201350% of project fee" },
];

/* ─── 7. Retainer Strategy ─── */
export const RETAINER_STATS = [
    { label: "Retainer Savings vs Project", value: "20\u201330%", sub: "Clients save on production" },
    { label: "Content Needed Per Agent", value: "Every 7\u201310 days", sub: "New creative to avoid ad fatigue" },
    { label: "Brands Increasing Video Budget", value: "92%", sub: "Same or more in 2026" },
    { label: "Retainer vs Project Close Rate", value: "Much higher", sub: "Once trust established" },
];

export const RETAINER_PITCH_STEPS = [
    { color: "#1D9E75", title: "Start with one project", body: "Don\u2019t pitch a retainer cold. Do one project, deliver beyond expectations, then say: \u2018Imagine having this kind of content every month without having to brief a new videographer from scratch each time.\u2019" },
    { color: "#7F77DD", title: "Reframe it as a team, not a vendor", body: "\u2018I\u2019m your embedded visual storytelling partner. I know your brand, your aesthetic, your voice \u2014 no ramp-up time, no inconsistency, no coordination overhead.\u2019" },
    { color: "#E8A838", title: "Frame it as salary math", body: "\u2018A part-time content creator costs $40K\u2013$60K/year. A freelance social media manager is $3K\u2013$5K/month. Our retainer gives you a full production team at a fraction of that cost \u2014 and better quality.\u2019" },
    { color: "#1D9E75", title: "Show the content calendar", body: "Present a sample monthly content calendar showing exactly what they\u2019d get. Real estate: 4 listing videos + 4 social reels + 1 personal brand update. Restaurants: 2 food shoots + 4 social reels + 1 monthly brand story." },
    { color: "#7F77DD", title: "Start small, scale up", body: "Offer a 3-month starter retainer at a slightly reduced rate. Once results are visible \u2014 more reservations, more inquiries, more engagement \u2014 upselling to a higher tier is easy." },
];

export const RETAINER_BY_CLIENT = [
    { type: "Real estate agent", starter: "$800\u2013$1,200/mo", growth: "$1,500\u2013$2,500/mo", full: "$2,500\u2013$4,500/mo" },
    { type: "Restaurant", starter: "$1,000\u2013$1,500/mo", growth: "$1,500\u2013$2,500/mo", full: "$2,500\u2013$4,000/mo" },
    { type: "Boutique/retail", starter: "$800\u2013$1,200/mo", growth: "$1,200\u2013$2,000/mo", full: "$2,000\u2013$3,500/mo" },
    { type: "Event org", starter: "$1,500\u2013$2,500/mo", growth: "$2,500\u2013$3,500/mo", full: "$3,500\u2013$5,000/mo" },
    { type: "Local business", starter: "$500\u2013$1,000/mo", growth: "$1,000\u2013$1,800/mo", full: "$1,800\u2013$3,000/mo" },
    { type: "Tech startup", starter: "$1,000\u2013$2,000/mo", growth: "$2,000\u2013$3,500/mo", full: "$3,500\u2013$5,000/mo" },
];

export const RETAINER_OBJECTIONS = [
    { q: "\u201CWe don\u2019t need that much content\u201D", a: "Most businesses underestimate how quickly content gets consumed. One video per week is the minimum for algorithm-driven growth. A retainer keeps the machine running without you having to think about it." },
    { q: "\u201CWe\u2019d rather do it per project\u201D", a: "That works \u2014 and we love per-project work. But most of our per-project clients come back monthly anyway. A retainer means you\u2019re prioritized, get better rates, and I already know your brand." },
    { q: "\u201CWe can\u2019t afford a monthly commitment\u201D", a: "Our starter retainer is less than one full shoot booked per project. You get more content, better rates, and consistent quality \u2014 for less than the alternative." },
    { q: "\u201CWe\u2019ll try one video first\u201D", a: "Perfect. That\u2019s exactly how most of our retainer relationships start. Let\u2019s make that first video exceptional \u2014 and we can talk about what monthly looks like." },
];

/* ─── 8. Drone + FAA ─── */
export const DRONE_STATS = [
    { label: "Drone Adoption in RE 2025", value: 52, suffix: "%", prefix: "", sub: "Up from 35% in 2024" },
    { label: "Drone Services Market CAGR", value: "16\u201318%", sub: "Through 2029", isText: true as const },
    { label: "Drone Market Size 2025", value: 0.57, suffix: "B", prefix: "$", sub: "Real estate drone services alone" },
    { label: "Listings With Drone Sell Faster", value: 68, suffix: "%", prefix: "", sub: "Than standard images" },
];

export const FAA_STEPS = [
    { title: "Part 107 Remote Pilot Certificate", body: "Any paid drone work requires FAA Part 107 certification. Pass the UAG knowledge test (60 multiple-choice questions) at an FAA-approved center. Recurrent training every 24 months. Apply through IACRA after passing.", sub: "Required for all commercial drone work" },
    { title: "Register every drone ($5/aircraft, 3 years)", body: "Every drone over 0.55 lbs (250g) must be registered at FAADroneZone. Registration number must be visibly marked on the drone.", sub: "$5 fee, 3-year validity" },
    { title: "Understand Atlanta airspace", body: "Atlanta is home to Hartsfield-Jackson (ATL) \u2014 one of the busiest airports in the world. Much of central Atlanta is Class B/C controlled airspace requiring LAANC authorization. Always check B4UFLY before any shoot. Buckhead, Midtown, and areas near the airport require LAANC approval.", sub: "LAANC authorization often required" },
    { title: "Core operational rules under Part 107", body: "Max altitude: 400 ft AGL. Max speed: 100 mph. Visual Line of Sight required. Daylight only (or anti-collision lighting). No flying over people without Category 1\u20134 approval. Min visibility: 3 statute miles. Max drone weight: 55 lbs.", sub: "Key limits to know" },
    { title: "Remote ID (required since Sept 2023)", body: "All registered drones must broadcast Remote ID \u2014 digital license plate broadcasting location, altitude, speed, and operator location. Standard DJI drones (Mavic 3, Air 3, Mini 4 Pro) are already compliant.", sub: "Digital license plate" },
];

export const DRONE_APPS = [
    { name: "B4UFLY", desc: "Free, FAA official \u2014 pre-flight airspace check" },
    { name: "Aloft (formerly Kittyhawk)", desc: "LAANC authorization + airspace maps" },
    { name: "DJI Fly / DJI GO", desc: "Drone-specific, includes no-fly zone overlay" },
    { name: "SkyVector", desc: "Detailed sectional charts for advanced airspace reading" },
];

/* ─── 9. Getting Clients ─── */
export const WALKIN_STEPS = [
    { color: "#1D9E75", title: "Before walking in", body: "Pull up their Instagram. Note: Do they post video? Is the quality amateur? Do they post consistently? What\u2019s missing \u2014 production quality, color grade, creative direction?" },
    { color: "#7F77DD", title: "The opening hook", body: "Restaurants: \u2018I follow you on Instagram \u2014 I think there\u2019s a shot of [specific dish] that would blow up as a Reel. Do you film your own content?\u2019 Boutiques: \u2018Your in-store aesthetic is incredible. I couldn\u2019t find video \u2014 your clothes need to be seen in motion.\u2019" },
    { color: "#E8A838", title: "Show them a comparable example", body: "Phone ready with the best example in their industry from your portfolio. \u2018This is the kind of content I\u2019d create for you \u2014 shot in Atlanta, similar vibe.\u2019 Never show generic work." },
    { color: "#1D9E75", title: "The soft close", body: "\u2018I\u2019d love to come do one short shoot \u2014 2 hours \u2014 and show you what\u2019s possible. No big commitment.\u2019 Lower the barrier to yes. One great video starts the retainer conversation." },
    { color: "#7F77DD", title: "The follow-up \u2014 24 hours", body: "After the conversation, send a quick mood board for how you\u2019d shoot their brand. Shows initiative and speed before the contract is signed." },
];

export const OUTREACH_CHANNELS = [
    { channel: "Instagram DM", color: "#1D9E75", body: "Find businesses with good aesthetics but weak video. Comment on 2\u20133 posts before DMing. \u2018Hey \u2014 I\u2019ve been following you and I think your brand has massive potential on Reels. I\u2019m a videographer based in Atlanta. Would love to show you what I\u2019d create.\u2019" },
    { channel: "LinkedIn", color: "#7F77DD", body: "Best for B2B \u2014 startups, professional services, brokerages. Search: \u2018Marketing Director Atlanta\u2019 + small company. \u2018Noticed [Company] doesn\u2019t have much video presence \u2014 I made a quick thought on how I\u2019d approach a brand video for you.\u2019" },
    { channel: "Google Maps + Yelp audit", color: "#E8A838", body: "Search any industry + Atlanta. Sort by 4+ stars. Check website and Instagram. Any business with great reviews but no video = ideal cold prospect. Build a list of 20\u201330 targets per segment." },
    { channel: "Real estate agent outreach", color: "#E84B8A", body: "73% of homeowners prefer agents who offer video. Find top agents on Zillow/Instagram. \u2018Listings with video get 403% more inquiries. I\u2019d love to shoot your next listing on the house \u2014 no cost, no obligation.\u2019" },
];

export const CRED_SIGNALS = [
    { signal: "Showreel/demo reel with diverse project types", impact: 98 },
    { signal: "Platform-specific examples (actual Reels, TikToks, not just Vimeo)", impact: 95 },
    { signal: "Before/after or \u201Cwhat we made for [client]\u201D case studies", impact: 90 },
    { signal: "Instagram showing consistent content from real shoots", impact: 88 },
    { signal: "Client testimonials with specific results", impact: 85 },
    { signal: "Behind-the-scenes shoot content on social", impact: 78 },
    { signal: "Named Atlanta clients and recognizable locations", impact: 75 },
];

export const MONTHLY_TARGETS = [
    { label: "Month 1 Goal", value: "2 projects", sub: "$3K\u2013$7K in revenue" },
    { label: "Month 2 Goal", value: "4 projects", sub: "$6K\u2013$14K in revenue" },
    { label: "Month 3 Goal", value: "1 retainer signed", sub: "$800\u2013$2,500/month ongoing" },
    { label: "Weekly Activity", value: "5/week", sub: "DM, walk-in, or email outreach" },
];
