import type { NavSection } from "../../_shared/types";

export const NAV_SECTIONS: NavSection[] = [
    { id: "wd-overview", label: "Overview" },
    { id: "wd-roi", label: "ROI Data" },
    { id: "wd-segments", label: "Target Segments" },
    { id: "wd-competitors", label: "Competitors" },
    { id: "wd-meetings", label: "Getting Meetings" },
    { id: "wd-linkedin", label: "LinkedIn Strategy" },
    { id: "wd-ai", label: "AI Integration" },
    { id: "wd-pricing", label: "Pricing + Pitch" },
];

export const OVERVIEW_STATS = [
    { label: "Revenue Lost to Bad UX", value: 35, suffix: "%", prefix: "", sub: "Of potential revenue lost" },
    { label: "ROI of $1 in UX", value: 100, suffix: "", prefix: "$", sub: "9,900% return (Forrester)" },
    { label: "Conversion Rate Uplift", value: 400, suffix: "%", prefix: "", sub: "Good UX vs bad UX (Forrester)" },
    { label: "US Web Design Market", value: 40.8, suffix: "B", prefix: "$", sub: "Growing annually" },
    { label: "Redesigns Due to Low Conversions", value: 80.8, suffix: "%", prefix: "", sub: "Source: Sagapixel" },
    { label: "Small Businesses With No CTA", value: 70, suffix: "%", prefix: "", sub: "Leave money on the table" },
    { label: "Trust Judged by Design", value: 75, suffix: "%", prefix: "", sub: "Users judge credibility by design" },
    { label: "Go to Competitor After Bad XP", value: 89, suffix: "%", prefix: "", sub: "Oracle research" },
];

export const ROI_STATS = [
    { label: "1-Second Load Delay", value: "-7%", sub: "Conversion rate drop" },
    { label: "UX Investment Return", value: "$100:$1", sub: "9,900% ROI (Forrester)" },
    { label: "Visit-to-Lead Uplift", value: "400%", sub: "Good vs bad UX" },
    { label: "AI Chatbot Conversion Boost", value: "+23%", sub: "Avg vs no chatbot" },
    { label: "Chatbot ROI", value: "$8:$1", sub: "Revenue per $1 invested" },
    { label: "Redesign Revenue Improvement", value: "+15\u201330%", sub: "Conservative estimate" },
];

export const SEGMENT_ROI: Record<string, { label: string; color: string; stats: string[] }> = {
    restaurants: {
        label: "Restaurants", color: "#E84B8A",
        stats: ["77% of diners check a restaurant website before visiting", "65% go directly to the restaurant\u2019s own website to book \u2014 not OpenTable", "40% visit a restaurant after seeing food photos online", "73% choose a competitor if the restaurant doesn\u2019t respond online", "Only 69% of full-service restaurants even maintain a website"],
    },
    law: {
        label: "Law + Professional Services", color: "#7F77DD",
        stats: ["96% of people seeking legal services start with a search engine", "9 in 10 adults visit at least 2 websites before contacting an attorney", "Only 1 in 3 said finding a lawyer via website was seamless or easy", "35% of smaller law firms haven\u2019t updated their website in 3+ years", "64% of lawyers plan to increase website optimization budget this year"],
    },
    retail: {
        label: "Retail / Boutiques", color: "#1D9E75",
        stats: ["~70% cart abandonment rate on generic Shopify templates", "Mobile accounts for 78% of retail ecommerce traffic", "22% of customers return items because product photo didn\u2019t match reality", "Adding testimonials to landing pages increases conversions by 34%", "Optimized CTA buttons alone can boost conversions by 34%"],
    },
    b2b: {
        label: "B2B / Tech Startups", color: "#E8A838",
        stats: ["93% of pitch decks have design working against them", "Sites with good UX achieve 400% higher visit-to-lead conversion", "Responding to a lead within 5 minutes is 21x more likely to convert", "AI chatbots convert 28% of all website visitors into qualified leads", "B2B chatbot funnels convert at 2.4x the rate of static lead forms"],
    },
};

export type SegmentKey = "restaurants" | "law" | "startups" | "boutiques" | "realestate" | "entertainment";

export const TARGET_SEGMENTS: Record<SegmentKey, {
    label: string; currentTitle: string; currentItems: string[]; rovTitle: string; rovItems: string[]; pitch: string; howToFind: string;
}> = {
    restaurants: {
        label: "Restaurants", currentTitle: "What they currently do",
        currentItems: ["GoDaddy or Squarespace drag-and-drop builds", "OpenTable widget bolted onto an outdated page", "Menu as unreadable PDF on mobile", "No native reservation integration on their own site", "Outdated photography from 3\u20135 years ago", "Not mobile-optimized \u2014 78% of diners book on mobile"],
        rovTitle: "What R.O.V. builds",
        rovItems: ["Cinematic food/ambiance photography-first design", "Native reservation system (not just OpenTable embed)", "Mobile-first fast-loading menu experience", "AI chatbot for instant reservation inquiries + FAQ", "Instagram feed integration for social proof", "Private dining / event booking flow"],
        pitch: "65% of diners go directly to your website to book \u2014 not OpenTable. If your site doesn\u2019t convert them in 3 seconds, you\u2019re sending paying customers somewhere else.",
        howToFind: "Google Maps: search \u2018upscale restaurant Atlanta\u2019 + sort by reviews. Visit each website on your phone. Any 4-star+ restaurant on a GoDaddy template is your prospect.",
    },
    law: {
        label: "Law + Professional", currentTitle: "Current state",
        currentItems: ["35% of smaller firms haven\u2019t updated their website in 3+ years", "Most use LegalZoom-style templates that look identical", "84% have contact info findable \u2014 but only 36% say the process is seamless", "Low conversion: no intake forms, no scheduling, no chat", "Firms spend $5K\u2013$50K/month on marketing \u2014 but the website loses the leads"],
        rovTitle: "What R.O.V. builds",
        rovItems: ["Premium credibility-first design that signals authority and trust", "AI intake bot that qualifies leads and books consultations 24/7", "Attorney profile pages that convert (video intro, testimonials, case results)", "Practice area pages optimized for local search", "Online consultation booking integrated with Calendly or custom scheduler"],
        pitch: "Law firms with 10+ attorneys generate $2M\u2013$10M+/year. If their website brings in 20% of clients, a 15% conversion improvement = $60K\u2013$300K additional annual revenue.",
        howToFind: "Search \u2018Atlanta law firm\u2019 on Google. Open top 20 websites. Any that looks like a template from 2015, lacks \u2018book a consultation,\u2019 or has no clear CTA \u2014 that\u2019s your prospect.",
    },
    startups: {
        label: "Tech Startups", currentTitle: "Why startup sites are bad",
        currentItems: ["Built on Webflow/Squarespace by the founder at 2am", "93% of pitch decks have design working against them", "Website = investor first impression \u2014 often a Notion page", "No compelling value prop above the fold", "Generic SaaS aesthetics that don\u2019t stand out"],
        rovTitle: "What R.O.V. builds",
        rovItems: ["Investor-grade landing page showing product vision, not just features", "Demo booking flow built into the site (AI-powered lead qualification)", "Brand identity that signals \u2018we\u2019re serious\u2019 to VCs", "Custom animations and micro-interactions showing technical craft", "CRM-integrated lead capture for beta signups"],
        pitch: "93% of pitch decks have design working against them. Your website is the second thing investors look at after the deck. If it looks like a template, they assume the product is too.",
        howToFind: "Physical: Atlanta Tech Village, Tech Square (Georgia Tech), Ponce City Market offices. Online: LinkedIn \u2018Founder Atlanta\u2019 + 1\u201310 employees. Target pre-seed and seed.",
    },
    boutiques: {
        label: "Boutiques + Retail", currentTitle: "The problem",
        currentItems: ["Generic Shopify templates identical to 10,000 other stores", "~70% cart abandonment on poorly designed e-commerce", "In-store experience is stunning \u2014 website looks like a different brand", "Product photos are inconsistent, no cohesion", "No story, no culture \u2014 just a product grid"],
        rovTitle: "R.O.V.\u2019s advantage",
        rovItems: ["Full brand identity kit + website = cohesive experience everywhere", "Editorial-style photography direction built into the brief", "Conversion-optimized product pages (not default Shopify layout)", "AI chatbot for sizing, styling recommendations, inventory questions", "Klaviyo/email automation for post-purchase and win-back flows"],
        pitch: "Your Instagram has 10K followers and your store is beautiful. Then someone visits your website and it\u2019s a default Shopify theme. That disconnect is costing you sales every single day.",
        howToFind: "Walk Ponce City Market, Krog Street Market, Buckhead boutiques, West End, Little Five Points. Beautiful in-store experience but bad website = your opening.",
    },
    realestate: {
        label: "Real Estate", currentTitle: "Current state",
        currentItems: ["Most development websites look like brochures from 2012", "Property pages with low-res renders and PDF floor plans", "No interactive maps, no virtual tour integration", "Contact form as the only conversion mechanism", "No AI chat to handle inquiry volume after hours"],
        rovTitle: "What R.O.V. builds",
        rovItems: ["Luxury property marketing sites with cinematic design", "Interactive floor plan viewers and availability dashboards", "AI chatbot for instant inquiry response + lead qualification", "CRM sync \u2014 every inquiry goes directly to the sales team", "Brand identity for the development (logo, colors, positioning)"],
        pitch: "A $50M mixed-use development with a website that looks like a 2012 brochure. The site is the first thing every prospective tenant and investor sees.",
        howToFind: "LinkedIn: \u2018real estate developer Atlanta\u2019 or \u2018property marketing Atlanta.\u2019 BeltLine corridor developers care deeply about brand.",
    },
    entertainment: {
        label: "Entertainment + Venues", currentTitle: "Typical venue site problems",
        currentItems: ["Events calendar always outdated (manually updated)", "Ticket links scattered across 3 different platforms", "No consistent brand identity across website, flyers, social", "Mobile experience is broken \u2014 most discovery happens on phone", "No email capture \u2014 losing hundreds of potential repeat customers per event"],
        rovTitle: "R.O.V.\u2019s full-stack solution",
        rovItems: ["Unified brand identity: website to flyers to stage visuals", "Automated event calendar synced to ticketing platform", "AI chatbot for FAQs, private booking inquiries, guest list", "Email capture with automated welcome flow (n8n)", "Overlaps with event org retainer \u2014 biggest bundle opportunity"],
        pitch: "You\u2019re spending $2K/month on flyers, $1K on social graphics, and $500 on web maintenance from 3 different freelancers. R.O.V. bundles all of it for less.",
        howToFind: "Instagram: search Atlanta event organizers, venue owners. Attend events and network. The sell isn\u2019t just a website \u2014 it\u2019s the full retainer package.",
    },
};

export const COMPETITORS_WEB = [
    { name: "Trajectory Web Design", tag: "Direct competitor", tagColor: "#E84B8A", desc: "Atlanta\u2019s no-nonsense web company. Strong reputation, clean builds. No AI integration, no brand identity, no sound/visuals. Pure web play." },
    { name: "Newman Web Solutions", tag: "Direct competitor", tagColor: "#E84B8A", desc: "Well-reviewed, conversion-first design. Strong local SEO. Template-adjacent feel, no custom animation, no AI workflows." },
    { name: "Cardinal Digital / Captivate", tag: "Upper tier", tagColor: "#E84B8A", desc: "Larger agencies, $10K\u2013$50K+. Slower, corporate feel. Win on reputation not craft. Slow timelines, bureaucratic process." },
    { name: "Junction Creative Solutions", tag: "Mid-large", tagColor: "rgba(255,244,227,0.3)", desc: "400+ brands, Fortune 1000 + SMB. Strong results (+414% online sales for one client). At scale \u2014 less personal, less nimble." },
    { name: "Creative Juice", tag: "Brand-first", tagColor: "rgba(255,244,227,0.3)", desc: "Multicultural branding agency. Fortune 500 clients. Limited on custom web dev and AI. Cultural alignment but different lane." },
    { name: "R.O.V. Studios", tag: "Full stack", tagColor: "#EA9A61", desc: "Design-first + custom code + AI + brand identity + sound + stage visuals. Only ATL studio with all five. 2\u20134 week delivery.", isROV: true as const },
];

export const DIFF_MATRIX = [
    { capability: "Custom AI workflow in site", rov: "yes" as const, trajectory: "no" as const, newman: "no" as const, cardinal: "no" as const },
    { capability: "Brand identity bundled", rov: "yes" as const, trajectory: "no" as const, newman: "no" as const, cardinal: "yes" as const },
    { capability: "Design rivals premium agencies", rov: "yes" as const, trajectory: "partial" as const, newman: "partial" as const, cardinal: "yes" as const },
    { capability: "2\u20134 week delivery", rov: "yes" as const, trajectory: "partial" as const, newman: "partial" as const, cardinal: "no" as const },
    { capability: "Cultural fluency (music, streetwear, entertainment)", rov: "yes" as const, trajectory: "no" as const, newman: "no" as const, cardinal: "no" as const },
];

export const MEETING_STEPS = [
    { color: "#1D9E75", title: "Pre-visit research", body: "Visit their website on your phone before walking in. Screenshot 2\u20133 specific problems. Know the owner\u2019s name. Come with a specific observation, not a generic pitch." },
    { color: "#7F77DD", title: "The opening \u2014 spark curiosity", body: "Don\u2019t lead with \u2018we build websites.\u2019 Lead with an observation: \u2018I was looking at your menu online and couldn\u2019t find your hours on mobile \u2014 is that something customers mention?\u2019" },
    { color: "#E8A838", title: "The hook \u2014 show, don\u2019t tell", body: "Phone ready with: (a) their current site, (b) a comparable business with a great site, (c) your most relevant case study. \u2018Can I show you something real quick?\u2019 Nobody says no." },
    { color: "#1D9E75", title: "The ask \u2014 one clear next step", body: "Never try to close in the walk-in. \u2018I\u2019d love to do a quick audit of your site and show you what\u2019s costing you customers. Can we schedule 20 minutes this week?\u2019" },
    { color: "#7F77DD", title: "The follow-up \u2014 24 hours", body: "Build a 1-page homepage concept in Figma (1\u20132 hours). Send as PDF: \u2018This is what we\u2019d start with for you.\u2019 This closes deals at dramatically higher rates. Shows speed, confidence, and craft." },
];

export const TIMING_CARDS = [
    { segment: "Restaurants", time: "Tue\u2013Thu, 2\u20134pm", body: "Between lunch and dinner. Talk to owner/GM. Opening: \u2018I was trying to find your menu on my phone \u2014 I couldn\u2019t read it easily.\u2019" },
    { segment: "Boutiques", time: "Weekday mornings 10\u201312", body: "Low foot traffic, owner on floor. \u2018Your Instagram is beautiful \u2014 there\u2019s a big gap between how you show up online vs in person.\u2019" },
    { segment: "Law Firms", time: "Don\u2019t cold walk in", body: "LinkedIn DM to managing partner first, OR \u2018Website Audit\u2019 PDF cold email. \u2018I found 3 things likely losing you client inquiries.\u2019" },
    { segment: "Startups", time: "Events + meetups", body: "Atlanta Tech Village events, Tech Square meetups. Build relationships first. Follow up with LinkedIn DM + free 20-min audit." },
];

export const OBJECTIONS = [
    { q: "\u201CWe already have someone\u201D", a: "\u2018When did they last update it? Checked mobile lately?\u2019 Plant doubt. Offer the free audit. Let the current site\u2019s problems speak." },
    { q: "\u201CWe don\u2019t have the budget\u201D", a: "\u2018Do you know how many customers you\u2019re losing each month?\u2019 Reframe from cost to ROI. Budget becomes a different conversation." },
    { q: "\u201CWe\u2019re too busy\u201D", a: "\u2018That\u2019s exactly why \u2014 it works 24/7 so you don\u2019t have to. I only need 20 minutes. The build barely touches your schedule.\u2019" },
    { q: "\u201CBad experience with agencies\u201D", a: "Listen fully. Then: \u2018R.O.V. delivers in 2\u20134 weeks, not months. You see mockups before we touch a line of code.\u2019 Trust through specificity." },
];

export const LINKEDIN_STATS = [
    { label: "LinkedIn vs Email Reply", value: "2x", sub: "Higher response rate" },
    { label: "Personalized Replies", value: "30\u201350%", sub: "When properly executed" },
    { label: "B2B Social Leads", value: "80%", sub: "Of all B2B social leads" },
    { label: "InMail vs Cold Email", value: "18\u201325% vs 3%", sub: "Reply rate comparison" },
];

export const LINKEDIN_STEPS = [
    { day: "Day 1", color: "#1D9E75", title: "Blank connection request", body: "NO message. Just your face, title, optimized profile. Headline: \u2018We build premium websites for Atlanta businesses.\u2019 20%+ accept blank requests." },
    { day: "Day 2\u20134", color: "#7F77DD", title: "Engage with their content", body: "Like 1\u20132 posts. Leave a specific thoughtful comment \u2014 reference something they actually said. Become a familiar face." },
    { day: "Day 5", color: "#E8A838", title: "First message", body: "\u2018Hey [Name] \u2014 noticed [specific thing]. I did a quick look at your website and found something that might be costing you [leads/reservations/customers]. Happy to send a 2-min audit?\u2019 Under 3 sentences. Specific. Yes/no question." },
    { day: "Day 7", color: "#1D9E75", title: "Send the audit/spec", body: "Whether they replied or not: screen recording or 1-page PDF with 3 specific improvements. This is the door-opener." },
    { day: "Day 10+", color: "#7F77DD", title: "One follow-up max", body: "\u2018Just checking if you saw that audit \u2014 happy to walk through it on a quick call.\u2019 Max one follow-up. No response after 2 touches = revisit in 60 days." },
];

export const AI_STATS = [
    { label: "AI Chatbot Conversion Boost", value: "+23%", sub: "Average vs no chatbot" },
    { label: "Chatbot ROI", value: "$8:$1", sub: "Revenue per $1 invested" },
    { label: "Chatbot vs Form Conversion", value: "3x", sub: "Higher conversion rate" },
    { label: "Visitor-to-Lead via Chatbot", value: "28%", sub: "Of all website visitors" },
    { label: "First-Year Chatbot ROI", value: "148\u2013200%", sub: "For integrated systems" },
    { label: "Respond Within 5 Min", value: "21x", sub: "More likely to convert lead" },
];

export const AI_BY_SEGMENT = [
    { segment: "Restaurants", color: "#1D9E75", items: ["AI chatbot: instant reservation booking + FAQ", "Automated email: confirmation \u2192 reminder \u2192 post-visit review", "SMS via n8n for private event inquiries", "Menu chatbot handling dietary restrictions 24/7"] },
    { segment: "Law Firms", color: "#7F77DD", items: ["AI intake bot: qualifies leads + auto-books consultations", "24/7 availability \u2014 50% of buyer conversations happen off-hours", "CRM sync: every inquiry with lead score", "Automated follow-up sequence after booking"] },
    { segment: "Boutiques + Retail", color: "#E8A838", items: ["AI styling assistant: product recommendations", "Size guide chatbot: reduces 22% return rate", "Abandoned cart recovery (Klaviyo integration)", "Post-purchase upsell + win-back sequence"] },
    { segment: "Tech Startups", color: "#E84B8A", items: ["Demo booking bot: qualifies before sales call", "Product tour adapting to visitor\u2019s role", "Beta waitlist with automated nurture", "Investor deck download + CRM capture"] },
];

export const AI_PRICING = [
    { tier: "Basic AI Chatbot", price: "+$1,000\u2013$2,000", desc: "FAQ, contact capture, lead routing. n8n + chatbot trained on business data" },
    { tier: "Full Lead Qualification", price: "+$2,500\u2013$4,000", desc: "Qualifies, scores, books, CRM-syncs. Full n8n automation pipeline" },
    { tier: "AI Booking System", price: "+$2,000\u2013$3,500", desc: "Reservations, consultation booking, event inquiries \u2014 fully automated" },
    { tier: "Email Automation Suite", price: "+$1,500\u2013$2,500", desc: "Post-visit, post-purchase, lead nurture. n8n + Klaviyo or Mailchimp" },
];

export const PRICING_TIERS = [
    { name: "Starter", price: "$7,000\u2013$9,000", best: "boutiques, emerging startups, smaller restaurants", highlighted: false, features: ["Up to 6 pages, custom design", "Brand identity kit (logo, colors, typography)", "Mobile-first responsive build", "Basic contact form + Google Analytics", "2-week delivery", "1 round of revisions"] },
    { name: "Premium", price: "$10,000\u2013$13,000", best: "law firms, mid-size restaurants, established brands", highlighted: true, features: ["Up to 12 pages, premium design + motion", "Full brand identity system", "AI chatbot integration (basic)", "CRM/email integration", "SEO foundation setup", "3\u20134 week delivery", "2 rounds of revisions"] },
    { name: "Full Stack", price: "$14,000\u2013$17,000", best: "real estate, professional services, tech startups", highlighted: false, features: ["Unlimited pages, complex custom build", "Full brand identity + visual system", "AI lead qualification + booking automation", "Full n8n automation pipeline", "CRM + email sequences", "4\u20136 week delivery", "3 revisions + 30-day support"] },
];

export const PROPOSAL_STEPS = [
    { title: "The problem (their current site + data)", body: "Show specific failures with data. Estimate bounce rate impact, identify missing CTAs, show mobile failure. Make the cost of inaction concrete." },
    { title: "The vision (spec mockup)", body: "Show a homepage concept you already built for them. Most powerful page in any proposal. They see the potential. Sale is mostly made here." },
    { title: "The process (clear timeline)", body: "Week 1: Discovery + wireframes. Week 2\u20133: Design. Week 4: Build + test. Week 5: Launch. Eliminates the #1 agency anxiety." },
    { title: "The ROI case (their numbers)", body: "Revenue \u00d7 15% improvement \u00d7 12 months. Show payback period. For $500K+ businesses, a $10K website pays back in 2\u20134 months." },
    { title: "The ask (one clear option)", body: "Don\u2019t present 3 tiers \u2014 lead with the right package. 50% deposit upfront, 50% on launch. Minimum $5K deposit." },
];

export const MONTHLY_TARGETS = [
    { label: "Month 1 Goal", value: "1 deal", sub: "$7K\u2013$10K project signed" },
    { label: "Month 2 Goal", value: "2 deals", sub: "$15K\u2013$20K in pipeline" },
    { label: "Month 3 Goal", value: "1 retainer", sub: "$500\u2013$1K/month ongoing" },
    { label: "Weekly Activity", value: "5/week", sub: "Audits sent or walk-ins made" },
];
