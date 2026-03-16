import type { NavSection } from "../../_shared/types";

export const NAV_SECTIONS: NavSection[] = [
    { id: "ai-overview", label: "Market Overview" },
    { id: "ai-georgia", label: "Georgia + ATL" },
    { id: "ai-industries", label: "Industry ROI" },
    { id: "ai-benchmarks", label: "Cross-Industry ROI" },
    { id: "ai-competitors", label: "Competitors" },
    { id: "ai-pricing", label: "Pricing" },
    { id: "ai-pitch", label: "Pitch Framework" },
    { id: "ai-usp", label: "USP + Playbook" },
];

/* ─── 1. Market Overview ─── */
export const GLOBAL_MARKET = [
    { segment: "AI Automation", current: "$19.6B (2026)", projected: "\u2014", cagr: "23.4%" },
    { segment: "Workflow Automation", current: "$27.91B (2026)", projected: "$65.26B (2034)", cagr: "11.2%" },
    { segment: "Marketing Automation", current: "$8.16B (2026)", projected: "$14.98B (2031)", cagr: "12.9%" },
    { segment: "Voice AI Agents", current: "$2.4B (2024)", projected: "$47.5B (2034)", cagr: "34.8%" },
    { segment: "AI Agents (Broad)", current: "$7.63B (2025)", projected: "$182.97B (2033)", cagr: "49.6%" },
    { segment: "Agentic AI", current: "$7.29B (2025)", projected: "$139.19B (2034)", cagr: "40.5%" },
];

export const HEADLINE_STATS = [
    { label: "AI Automation Market", value: 19.6, suffix: "B", prefix: "$", sub: "2026, growing 23.4% CAGR" },
    { label: "Voice AI Agents Market", value: 47.5, suffix: "B", prefix: "$", sub: "Projected 2034 (34.8% CAGR)" },
    { label: "SMB AI Investment (2025)", value: 57, suffix: "%", prefix: "", sub: "Up from 36% in 2023" },
    { label: "SMBs Using AI With No Strategy", value: 77, suffix: "%", prefix: "", sub: "Know they need it, can\u2019t implement it" },
    { label: "Georgia Small Businesses", value: 1.4, suffix: "M", prefix: "", sub: "1.8M workers (42.5% of workforce)" },
    { label: "GA Businesses Using AI", value: 4.5, suffix: "%", prefix: "", sub: "~1.3M in the addressable gap" },
    { label: "Voice AI First-Year ROI", value: 150, suffix: "%+", prefix: "", sub: "With 35% customer satisfaction increase" },
    { label: "AI Cost Reduction vs Call Centers", value: 90, suffix: "%", prefix: "", sub: "Operating cost reduction" },
];

export const SMB_STATS = [
    { label: "SMB AI Investment Rise", items: ["2023: 36%", "2024: 42%", "2025: 57%", "58% increase in two years"] },
    { label: "Key Gaps", items: ["77% have no formal AI strategy", "40% cite cost as biggest barrier", "Only 18% feel \u2018very confident\u2019 marketing works", "49% use any email automation at all"] },
    { label: "Email Opportunity", items: ["44% say email is most effective channel (up from 23%)", "Only 49% use any email automation", "Email ROI: $36\u2013$42 per $1 spent", "Automated emails: 2,361% better conversion"] },
];

/* ─── 2. Georgia + ATL ─── */
export const GA_INDUSTRIES = [
    { industry: "Other Services (salons, repair, personal care)", businesses: "182,664", need: "Booking, reminders, reviews" },
    { industry: "Professional/Scientific/Technical", businesses: "165,839", need: "Client intake, document processing" },
    { industry: "Administrative & Support", businesses: "158,020", need: "Workflow automation, CRM" },
    { industry: "Construction", businesses: "145,100", need: "Lead follow-up, scheduling" },
    { industry: "Real Estate", businesses: "107,859", need: "Lead qualification, showing booking" },
    { industry: "Retail Trade", businesses: "104,327", need: "Cart recovery, customer engagement" },
    { industry: "Health Care & Social Assistance", businesses: "103,391", need: "Appointment reminders, patient intake" },
    { industry: "Arts, Entertainment & Recreation", businesses: "59,662", need: "Ticketing, attendee engagement" },
    { industry: "Accommodation & Food Services", businesses: "48,600", need: "Phone ordering, reservations, loyalty" },
];

/* ─── 3. Industry ROI ─── */
export type IndustryKey = "restaurants" | "dental" | "realestate" | "salons" | "events" | "managers" | "ecommerce" | "professional";

export const INDUSTRIES: Record<IndustryKey, {
    label: string; color: string;
    painTitle: string; painPoints: string[];
    roiTitle: string; roiPoints: string[];
    pitch: string;
    lostRevenue: string; recovers: string; rovCost: string; roi: string;
}> = {
    restaurants: {
        label: "Restaurants", color: "#E84B8A",
        painTitle: "The Pain",
        painPoints: ["Miss 34\u201358% of incoming calls during peak hours", "Each missed call = $35\u2013$65 in lost revenue", "150 phone orders/week \u2192 1,794 lost orders \u2192 $62,790/year lost", "Casual dining missing 32 calls/day \u2192 $153,600/year lost", "71% of calls are revenue-related (orders, reservations, catering)", "20% of reservations requested outside business hours"],
        roiTitle: "The ROI of Automation",
        roiPoints: ["Voice AI reduces missed calls by 80%, recovers $27,000+/location/year", "Multi-location groups recovered $180,000+ annually", "WhatsApp/SMS handles ordering, confirmations, loyalty without staff", "Break-even in first month at $500\u2013$1,000/month cost"],
        pitch: "You\u2019re losing $62K\u2013$153K a year to calls nobody answers during rush hour. Our AI voice agent picks up every call, takes every order, books every reservation \u2014 24/7. Cost: $500\u2013$1,500/month. ROI: your first month.",
        lostRevenue: "$153,600", recovers: "$27K\u2013$180K", rovCost: "$6K\u2013$12K/yr", roi: "350\u20131,400%",
    },
    dental: {
        label: "Dental / Healthcare", color: "#1D9E75",
        painTitle: "The Pain",
        painPoints: ["No-shows cost US healthcare $150B+ annually", "Typical practice: 15\u201320% no-show rate \u2192 $60K\u2013$200K+/year lost", "Miss 15\u201330% of incoming calls during peak hours", "29% of all calls missed entirely", "Staff spend 15+ hrs/week on manual scheduling and reminders", "$383,827/month wasted marketing on patients who can\u2019t get through"],
        roiTitle: "The ROI of Automation",
        roiPoints: ["AI reduces no-shows by 50.7% (peer-reviewed) to 87% (real-world)", "One practice: $219,600/year recovered from $499/month system \u2192 3,567% ROI", "Patient confirmation: 58% \u2192 94%, 80% of scheduling time eliminated", "Automated reminders alone: $31,456 incremental production over 36 months", "5 no-shows/week at $200 each: $52,000/year lost \u2192 AI recovers $45,240"],
        pitch: "Your practice loses $60K\u2013$200K a year to no-shows and missed calls. AI reminders cut no-shows by 50\u201387%. One client saw $18,300/month recovered from a $499/month system \u2014 3,567% ROI.",
        lostRevenue: "$60K\u2013$200K+", recovers: "$45K\u2013$219K", rovCost: "$6K\u2013$18K/yr", roi: "650\u20133,567%",
    },
    realestate: {
        label: "Real Estate", color: "#E8A838",
        painTitle: "The Pain",
        painPoints: ["Average agent response time: 917 minutes (15+ hours)", "Responding within 5 min = 21x more likely to qualify", "Contact odds drop 80% after just 5 minutes", "47% of leads go cold within 24 hours", "50% of agents abandon follow-up after one attempt", "60% of buyers say \u2018no\u2019 four times before \u2018yes\u2019", "Overall lead conversion: 0.5\u20131.2%"],
        roiTitle: "The ROI of Automation",
        roiPoints: ["AI chatbots: 50%+ lead reply rates after hours", "41% higher qualified lead conversion within 6 weeks", "Response time: 15+ hours \u2192 under 30 seconds", "30% larger sales pipelines with AI-driven engagement", "90% of manual lead qualification can be automated", "$200/month investment \u2192 50x+ in preserved commissions"],
        pitch: "Your leads wait 15+ hours. By then, they\u2019ve called three other agents. Our AI responds in 30 seconds, qualifies the lead, and books the showing \u2014 24/7. One extra closed deal at $410K pays for two years of service.",
        lostRevenue: "$7,500+ per missed lead", recovers: "41% more conversions", rovCost: "$2.4K\u2013$6K/yr", roi: "50x+ per deal",
    },
    salons: {
        label: "Salons & Spas", color: "#7F77DD",
        painTitle: "The Pain",
        painPoints: ["Average salon loses $39K\u2013$104K/year to no-shows", "15\u201330% no-show rate is standard", "Each no-show: $150\u2013$200+ in lost revenue + idle time", "67% of no-shows are simply forgotten appointments", "Staff spend 15+ hrs/month on phone booking and reminders", "After-hours booking requests go completely unanswered"],
        roiTitle: "The ROI of Automation",
        roiPoints: ["Automated reminders (72hr, 24hr, 2hr) reduce no-shows by 29\u201378%", "Multi-channel (SMS + email) is 2.5x more effective than single-channel", "One salon: 28% \u2192 7.8% no-shows (72% reduction), $3,200/month recovered", "30 recovered appointments/month \u00d7 $85 = $2,550 + $200 labor savings", "Annual net benefit: $31,200/year from $1,800/year investment", "68% of cancelled slots filled through automated waitlist alerts"],
        pitch: "Your salon loses $39K\u2013$104K a year because clients forget appointments. One salon went from 28% no-shows to 7.8% and recovered $3,200 every single month. Cost: $500\u2013$1,000/month.",
        lostRevenue: "$39K\u2013$104K", recovers: "$31,200/yr net", rovCost: "$6K\u2013$12K/yr", roi: "400\u20131,700%",
    },
    events: {
        label: "Event Promoters", color: "#EA9A61",
        painTitle: "The Pain",
        painPoints: ["Ticket cart abandonment exceeds 80%", "Most rely on Eventbrite \u2014 forfeiting data ownership", "Zero email infrastructure despite email having best conversion ROI", "\u2018Mid-campaign plateau\u2019 \u2014 no mechanism to reignite sales", "Post-event follow-up virtually nonexistent", "Thousands spent on Instagram ads, nothing on retargeting near-buyers"],
        roiTitle: "The ROI of Automation",
        roiPoints: ["Abandoned cart emails: 40\u201345% open rates, 21% CTR, 50% of clickers convert", "Recover 10\u201320% of abandoned ticket purchases", "Automated emails: 2% of sends but 37% of total email revenue", "Email ROI: $36\u2013$42 per $1 spent", "Automated workflows: 30x higher returns than one-off blasts", "52% higher opens, 332% higher clicks, 2,361% better conversion"],
        pitch: "Over 80% of people who start buying tickets abandon checkout. You have zero follow-up. Automated cart recovery gets 45% open rates, and half buy. That\u2019s 10\u201320% of lost sales recovered \u2014 automatically.",
        lostRevenue: "80%+ cart abandonment", recovers: "10\u201320% recovery", rovCost: "$6K\u2013$18K/yr", roi: "$36\u2013$42 per $1",
    },
    managers: {
        label: "Artist Managers", color: "#B16937",
        painTitle: "The Pain",
        painPoints: ["Juggle separate studios, engineers, designers, developers per release", "Release marketing is manual and inconsistent", "Fan engagement between releases goes cold \u2014 no nurture system", "Streaming data collection requires manual dashboard pulls", "5 artists \u00d7 4 releases/year = 20+ projects across fragmented vendors"],
        roiTitle: "The ROI of Automation",
        roiPoints: ["Automated release sequences: email, SMS, social triggered per drop", "CRM tracks fan engagement, press, booking inquiries in one system", "Automated curator/press outreach increases placement rates", "One manager relationship = $15K\u2013$40K+/year bundled revenue"],
        pitch: "Every release means coordinating studios, designers, and email blasts manually. We replace all of that with one team and one system. When a track drops, automation triggers everything instantly.",
        lostRevenue: "Vendor fragmentation", recovers: "$15K\u2013$40K/yr per relationship", rovCost: "Bundled", roi: "Relationship-based",
    },
    ecommerce: {
        label: "E-Commerce", color: "#1D9E75",
        painTitle: "The Pain",
        painPoints: ["Average cart abandonment: 70\u201377%", "Only 2\u20133 of every 10 customers complete purchase", "Globally: $260B in recoverable sales", "Top cause: unexpected costs at checkout (48%)", "Mobile abandonment: 78\u201380%", "Most small e-commerce lacks any recovery system"],
        roiTitle: "The ROI of Automation",
        roiPoints: ["Abandoned cart emails: 41\u201350% open rates, recover 10\u201320%", "Revenue per recipient: $5.81 avg, top performers $28.89", "Multi-email sequences: 69% more orders than single-email", "Personalized retargeting: 1,300%+ ROI", "$50K/month store \u2192 $35K abandoned \u2192 15% recovery = $5,250/month"],
        pitch: "70% of your customers put items in cart and walk away. Recovery emails bring back 10\u201320%. For a $50K/month store, that\u2019s $5,000+/month recovered from a system that costs $500.",
        lostRevenue: "$420K/yr abandoned", recovers: "$63K/yr (15%)", rovCost: "$6K\u2013$12K/yr", roi: "425\u2013950%",
    },
    professional: {
        label: "Professional Services", color: "#7F77DD",
        painTitle: "The Pain",
        painPoints: ["Significant billable hours on admin tasks", "Client intake bottleneck: follow-up takes days", "Invoice processing consumes extensive manual time", "Staff shortages compound \u2014 can\u2019t hire fast enough", "Prospects call another firm while waiting for response"],
        roiTitle: "The ROI of Automation",
        roiPoints: ["AI reports 22\u201337% cost reductions in professional services", "Invoice processing: 70% time reduction, eliminates data entry errors", "One law firm\u2019s first bot saved 50+ hours, redirected to billable work", "CRM ROI: $8.71 for every $1 spent", "Automated intake: days \u2192 seconds response time"],
        pitch: "Your intake coordinator goes home at 5 PM. Your competitors\u2019 AI never sleeps. Automated intake, document processing, and follow-up save 22\u201337% in operational costs.",
        lostRevenue: "22\u201337% overhead", recovers: "70% faster processing", rovCost: "$12K\u2013$30K/yr", roi: "2\u20135 month payback",
    },
};

/* ─── 4. Cross-Industry Benchmarks ─── */
export const BENCHMARKS = [
    { metric: "Email marketing ROI", data: "$36\u2013$42 per $1 spent" },
    { metric: "Automated vs manual emails", data: "52% higher opens, 332% higher clicks, 2,361% better conversion" },
    { metric: "Top email automations", data: "$16.96/recipient vs $0.95 for best manual" },
    { metric: "CRM ROI", data: "$8.71 per $1 spent" },
    { metric: "Avg cost per lead (SMB)", data: "$146\u2013$198" },
    { metric: "AI reduces cost per lead", data: "By 43\u201358%" },
    { metric: "AI chatbots reduce qualification time", data: "By up to 80%" },
    { metric: "AI avg operational cost reduction", data: "35%" },
    { metric: "Workflow automation payback", data: "2\u20135 months" },
    { metric: "Monthly running cost (SMB stack)", data: "$50\u2013$200" },
    { metric: "AI vs non-AI businesses", data: "$3.70 return per $1; 83% adoption in growing firms" },
    { metric: "n8n lead processing", data: "100 leads in 3.5 min; 50 \u2192 200 leads/week, 10hrs \u2192 1hr" },
    { metric: "Conversion with automated workflows", data: "8% \u2192 11%, pipelines 50% faster" },
];

/* ─── 5. Competitors ─── */
export const AI_COMPETITORS = [
    { name: "AI Agents of Atlanta", url: "https://aiagentsofatlanta.com", focus: "AI receptionists, appointment booking, lead capture", pricing: "4 tiers (Entry \u2192 Elite)", gap: "No design, branding, web, or sound" },
    { name: "Tuesday AI Edge", focus: "AI consulting for Atlanta SMBs", pricing: "Unlisted; claims 85% time saved", gap: "No creative services whatsoever" },
    { name: "HummingAgent", focus: "Generic AI automation", pricing: "Unlisted; claims $47K saved/employee/yr", gap: "National franchise, not local; no creative" },
    { name: "AutomateNexus", focus: "Custom AI agents, workflow automation", pricing: "$2,500\u2013$22,000 builds; $199\u2013$1,499/mo", gap: "Washington-based; no creative or branding" },
    { name: "TapTwice Digital", focus: "Full-service software + AI", pricing: "Project-based", gap: "Alpharetta, enterprise-leaning; no creative" },
    { name: "InfyOm (Reference Model)", focus: "n8n + AI automation", pricing: "Project-based", gap: "India-based; no creative services" },
];

/* ─── 6. Pricing ─── */
export const PRICING_BENCHMARKS = [
    { model: "Small automation projects", range: "$2,500\u2013$15,000" },
    { model: "Mid-complexity AI builds", range: "$8,000\u2013$25,000+" },
    { model: "Entry retainers (SMB)", range: "Under $2,000/month" },
    { model: "Mid-market retainers", range: "$3,000\u2013$6,000/month" },
    { model: "Managed automation retainers", range: "$2,000\u2013$5,000/month MRR" },
    { model: "AI engineering hourly", range: "$75\u2013$250/hour" },
    { model: "n8n cost advantage", range: "$0.01/run vs Zapier $1.50/run" },
    { model: "Infrastructure margin", range: "$20/mo VPS \u2192 charge $300/mo" },
];

export const ENGAGEMENT_TIERS = [
    { tier: "Lightweight", range: "$500\u2013$1,500/month", target: "Solo operators, micro-businesses", scope: "1 core workflow (lead capture \u2192 CRM \u2192 follow-up), basic chatbot, monthly monitoring", context: "A restaurant recovering $2,250/month in missed-call revenue can justify $500\u2013$1,000/month easily." },
    { tier: "Mid-Range", range: "$1,500\u2013$3,000/month", target: "Small businesses, 5\u201320 employees", scope: "3\u20135 active workflows, WhatsApp/SMS AI agent, email automation with branded templates, CRM integration, bi-monthly calls", context: "A dental practice recovering $18,300/month can support $1,500\u2013$2,500/month." },
    { tier: "Full-Scale", range: "$3,500\u2013$6,000+/month", target: "Multi-location, enterprise-adjacent", scope: "Unlimited workflows, voice AI, full CRM, AI lead qualification, WhatsApp/SMS agents, custom chatbot, weekly calls", context: "Replaces $4,000\u2013$8,000+/month sourcing separately. Creative integration is the value multiplier." },
];

export const BUILD_PROJECTS = [
    { type: "AI chatbot custom build", range: "$2,000\u2013$10,000" },
    { type: "Full lead gen automation system", range: "$5,000\u2013$15,000" },
    { type: "CRM setup and integration", range: "$2,500\u2013$8,000" },
    { type: "Voice AI agent deployment", range: "$3,000\u2013$10,000" },
];

export const BUNDLE_TIERS = [
    { name: "Light Bundle", price: "$1,500\u2013$2,000/month", desc: "Brand maintenance + chatbot + basic email automation" },
    { name: "Mid Bundle", price: "$3,000\u2013$4,500/month", desc: "Design + website/CRM + 3\u20135 workflows + AI agent + designed emails" },
    { name: "Full Partnership", price: "$5,000\u2013$8,000/month", desc: "Unlimited design + all automation + voice AI + sound credits + stage visuals" },
];

/* ─── 7. Pitch Framework ─── */
export const PITCH_STEPS = [
    { step: "Step 1", body: "\u201CYou\u2019re losing $[X] per year to [specific problem \u2014 missed calls, no-shows, slow response, abandoned carts].\u201D" },
    { step: "Step 2", body: "\u201CAI automation solves this \u2014 here\u2019s the data: [specific stat \u2014 87% no-show reduction, 80% fewer missed calls, 41% more conversions].\u201D" },
    { step: "Step 3", body: "\u201COur system costs $[Y]/month. That\u2019s a [Z]% ROI in the first [timeframe].\u201D" },
    { step: "Step 4", body: "\u201CAnd unlike every other automation agency, we design everything the system sends \u2014 your emails, your chatbot, your text confirmations. Every automated message is a brand interaction.\u201D" },
];

export const QUICK_REF = [
    { industry: "Restaurant (casual)", lost: "$153,600", recovers: "$27K\u2013$180K", cost: "$6K\u2013$12K/yr", roi: "350\u20131,400%" },
    { industry: "Dental Practice", lost: "$60K\u2013$200K+", recovers: "$45K\u2013$219K", cost: "$6K\u2013$18K/yr", roi: "650\u20133,567%" },
    { industry: "Real Estate Agent", lost: "$7,500+ per lead", recovers: "41% more conversions", cost: "$2.4K\u2013$6K/yr", roi: "50x+ per deal" },
    { industry: "Salon (4 stylists)", lost: "$36K\u2013$104K", recovers: "$31,200/yr net", cost: "$6K\u2013$12K/yr", roi: "400\u20131,700%" },
    { industry: "Event Promoter", lost: "80%+ cart abandonment", recovers: "10\u201320% recovery", cost: "$6K\u2013$18K/yr", roi: "$36\u2013$42 per $1" },
    { industry: "E-Commerce ($50K/mo)", lost: "$420K/yr abandoned", recovers: "$63K/yr (15%)", cost: "$6K\u2013$12K/yr", roi: "425\u2013950%" },
    { industry: "Healthcare Practice", lost: "$200K\u2013$500K", recovers: "60\u201380% recoverable", cost: "$12K\u2013$36K/yr", roi: "655\u20133,567%" },
    { industry: "Professional Services", lost: "22\u201337% overhead", recovers: "70% faster processing", cost: "$12K\u2013$30K/yr", roi: "2\u20135 mo payback" },
];

/* ─── 8. USP + Playbook ─── */
export const PLAYBOOK = [
    { move: "Upsell existing clients immediately", body: "Event promoters and artist managers already trust R.O.V.\u2019s creative work. AI automation is a natural extension of existing retainers \u2014 not a new sales cycle. One conversation adds $1,000\u2013$3,000/month per client." },
    { move: "Target appointment-based businesses with ROI calculators", body: "Restaurants (48,600), salons (182,664), dental (103,391), real estate (107,859) = 400,000+ Georgia businesses with the clearest, most immediate automation ROI." },
    { move: "Lead with revenue recovery, not technology", body: "Never pitch \u2018AI automation\u2019 or \u2018n8n workflows\u2019 to a small business owner. Pitch recovered revenue, eliminated no-shows, captured leads. The technology is invisible \u2014 the results are the product." },
    { move: "Position as \u2018Creative AI Agency\u2019", body: "The market is flooding with generic n8n agencies. R.O.V.\u2019s moat is that every automated touchpoint is a designed brand interaction. Defensible, unique, impossible for pure-tech competitors to replicate." },
];

export const TACTICAL_PRIORITIES = [
    "Build 3\u20135 showcase automations for R.O.V.\u2019s own business",
    "Offer 2\u20133 free pilot automations to existing creative clients \u2192 capture case studies",
    "Create before/after video walkthroughs for Reels and TikTok",
    "Optimize Google Business Profile for \u2018AI automation Atlanta\u2019",
    "Join Georgia Music Partners ($25/year) + attend Music Biz 2026 (May 11\u201314, ATL)",
    "Launch ROI Calculator lead magnet on rovstudios.com",
    "Host quarterly \u2018AI for Atlanta Small Business\u2019 workshops at a co-working space",
];
