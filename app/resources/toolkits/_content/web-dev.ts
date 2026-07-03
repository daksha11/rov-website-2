// Content for /resources/toolkits/web-dev.
// The tool roster (name, url, category, oneLiner, etc.) is imported from CTRL-A's
// data.ts, since those facts are shared. Everything else: the framing, myths,
// quick-start, and FAQ, is authored fresh for an Atlanta small business owner
// deciding whether to hire a web dev team, not for CTRL-A's culture-magazine reader.

import { toolkitSections } from "@/app/ctrla/data";
import type { ToolkitArticleContent } from "./types";

const webDevSection = toolkitSections.find((section) => section.id === "web-dev");

if (!webDevSection) {
  throw new Error("web-dev toolkit section not found in app/ctrla/data.ts");
}

export const webDevContent: ToolkitArticleContent = {
  id: "web-dev",

  seo: {
    title: "What Software Builds a Website That Converts?",
    description:
      "The 8 tools behind every site ROV ships, what each does, and what to ask before you pay for a website.",
    ogTitle: "What Software Actually Builds a Website That Converts?",
    ogDescription:
      "Eight tools, one stack, and the questions worth asking before you pay for an Atlanta small business website.",
    ogImage: "/heroassets/codingframe.webp",
  },

  breadcrumb: "Resources · Web Dev Toolkit",

  h1: "What Software Actually Builds a Website That Converts?",
  heroSubtitle:
    "Eight tools. One stack. The difference between a site that just exists online and one that actually brings in calls.",
  quickAnswer:
    "A website that converts is built on a real framework like Next.js, not a drag-and-drop template: that's what gives it sub-two-second load times, clean HTML that Google and AI search engines can crawl, and room to add pages without a rebuild. The 8 tools in this stack, from Next.js and Tailwind to Figma and Vercel, are the ones ROV uses on every client site for exactly that reason.",

  authorName: "Suchet Konda",
  authorRole: "Co-Founder and Systems Architect",
  authorImage: "/teammembers/suchettm.webp",
  dateDisplay: "July 2026",
  dateISO: "2026-07-03",
  readingTime: "9 min read",

  stats: [
    { value: "8", label: "Tools in the stack" },
    { value: "0", label: "Templates used" },
    { value: "5", label: "Steps, idea to live site" },
  ],

  toc: [
    { id: "the-stack-behind-a-site-that-works", label: "The stack behind a site that works" },
    { id: "the-toolkit", label: "The 8 tools we build with" },
    { id: "myths-corrected", label: "Myths, corrected" },
    { id: "quick-start", label: "What actually happens when we build your site" },
    { id: "what-this-means", label: "What this means for Atlanta businesses" },
    { id: "faq", label: "Frequently asked questions" },
  ],

  intro: {
    heading: "The stack behind a site that works",
    paragraphs: [
      "An HVAC company owner in Alpharetta got two quotes for a new website last spring. One came from a drag-and-drop builder: pick a theme, swap the logo, done in an afternoon. The other listed words she'd never heard: Next.js, Tailwind, Vercel. She picked the one she recognized. Six months later her ordering page still wasn't showing up when someone searched \"HVAC repair Alpharetta,\" and she had no idea why.",
      "The name of the software is not the point. What it determines is the point: how fast the site loads, whether Google and AI search engines can actually read it, and whether you can add a booking form or a second location page without starting over. A business owner does not need to learn to code. But knowing what a real stack looks like is how you tell a fair quote from a template with a markup.",
      "This is the toolkit we build every ROV client site with. Not because the names are impressive, but because each one solves a specific problem that a no-code builder either can't solve or charges you extra for later.",
    ],
    calloutLabel: "The short version",
    calloutText:
      "A website's software stack decides whether it can be found, how fast it loads, and whether it can grow with your business. These are the 8 tools we use to make sure it can do all three, from the framework up to the editor we write the code in.",
  },

  toolsSection: {
    heading: "The 8 tools we build with",
    intro:
      "This is the actual stack, framework to editor. No filler tools added to pad the list. If a client asks what we build with, this is the honest answer.",
    tools: webDevSection.tools,
    image: {
      src: "/heroassets/codingframe.webp",
      alt: "Code editor showing a Next.js component file, the framework ROV builds every client site on",
      caption: "The actual code behind a client build, not a drag-and-drop theme editor.",
    },
  },

  myths: {
    heading: "Myths, corrected",
    intro:
      "Four things Atlanta business owners assume about web development that cost them money or time when they turn out to be wrong.",
    items: [
      {
        myth: "A no-code builder is basically the same as a custom-coded site.",
        reality:
          "It looks the same on the surface. Underneath, template builders ship extra code your site doesn't need, which slows it down, and they limit how a search engine or AI answer engine can read your pages. A framework like Next.js gives control over both. That control is most of what separates a $500 site from one built to actually be found.",
      },
      {
        myth: "The framework doesn't matter, it's all just 'a website.'",
        reality:
          "The framework decides whether your pages load in under two seconds or five, and whether Google and AI search tools like Perplexity can crawl your content cleanly. A slow site or one that hides its content behind heavy scripts gets buried, no matter how good the design looks.",
      },
      {
        myth: "AI website builders mean you don't need to pay a real developer anymore.",
        reality:
          "AI tools make a good developer faster. They don't replace the decisions that make a site actually convert: what a customer sees first, where the call-to-action goes, how the site is structured for search. An AI-generated site can look finished in an afternoon and still be invisible in search results a year later.",
      },
      {
        myth: "You need a big agency and a big price tag to get a 'real' website.",
        reality:
          "Size is not the signal. A lean team using the right stack ships a fully custom, fast, search-ready site without the overhead of a 20-person agency. What to ask instead: what software do you build with, and can I see a live site you've shipped, not just a mockup.",
      },
    ],
  },

  quickStart: {
    heading: "What actually happens when we build your site",
    intro:
      "This is the process behind every ROV build, the same five steps whether the client is a restaurant or a roofing company. Knowing it is how you follow along with your own project instead of waiting in the dark.",
    steps: [
      {
        number: 1,
        title: "The foundation gets set right, framework first",
        body: "Every build starts on Next.js, so the site is fast and readable by search engines from the first line of code, not patched in later. This is the step a template builder skips entirely.",
        tip: "Ask any web dev team what framework they build on. If the answer is \"our platform\" instead of a named technology, that's a template, not custom code.",
      },
      {
        number: 2,
        title: "Design happens where you can see it",
        body: "Layout and spacing get settled in Figma first, so there are no surprises between the mockup and the live site. Components come from a shared system like shadcn/ui, so buttons, forms, and menus stay consistent across every page.",
      },
      {
        number: 3,
        title: "The site gets structured to be found",
        body: "Each service, each location, each page you need gets its own real route, built with the SEO and GEO foundation baked in, not bolted on after launch. This is the step most cheap sites skip, and it's the difference between a site that sits there and one that shows up in search.",
      },
      {
        number: 4,
        title: "You see it before it's live",
        body: "Every change deploys to a preview link on Vercel before it touches the real site. You review it, we adjust, nothing goes live that you haven't seen.",
        tip: "If your current site can't show you a preview before changes go live, that's worth asking about.",
      },
      {
        number: 5,
        title: "It gets checked, then it ships",
        body: "Images get compressed, page titles and descriptions get written for search, and load times get tested before launch. Then, and only then, it goes live.",
      },
    ],
    image: {
      src: "/heroassets/webfolder3.webp",
      alt: "Project file structure for a client website, with each page and route organized as its own folder",
      caption: "Every page gets its own route from the start, not a single template stretched across the site.",
    },
  },

  whatThisMeans: {
    heading: "What this means for Atlanta businesses hiring a web dev team",
    paragraphs: [
      "AI website builders promising a finished site in an afternoon are everywhere this year, and plenty of Atlanta owners are trying them. The site that comes out often looks fine. The problem is what's underneath: heavy, generic code that search engines struggle to read, and no real structure to grow from when you add a second location or a booking system.",
      "Search is also changing. People in Buckhead, Grant Park, the Westside, and Marietta aren't only typing into Google anymore. They're asking Perplexity and ChatGPT Search full questions like \"who's a good roofer near me.\" Getting picked by those answers depends on how the site is built, not just what it says. A site built on a real stack, with clean structure and fast load times, is readable by both Google and AI search. A template site optimized for nothing but looking nice usually isn't.",
      "None of this means you need to understand the code. It means that when you're comparing quotes, the software behind the number is worth one question: what do you build with, and why.",
    ],
    calloutLabel: "The short version",
    calloutText:
      "The stack behind your website decides whether it loads fast, whether it can grow, and whether Google or AI search can actually find it. Ask any web dev team what they build with before you ask what it costs.",
  },

  faqs: [
    {
      question: "Do I need a custom-coded website or is a template enough?",
      answer:
        "A template is fine for testing an idea with no real traffic goal. For a business that wants to show up in search and convert visitors into calls, a custom-coded site built on a real framework like Next.js loads faster and is easier for Google and AI search to read. The gap shows up within months, once the template site's pages stay buried and the custom site's don't.",
    },
    {
      question: "What is Next.js and why do web developers use it?",
      answer:
        "Next.js is a React framework that handles routing, performance, and server-side rendering out of the box. Developers use it because it produces sites that load fast and are structured in a way search engines can crawl cleanly, which matters more for getting found than almost anything else about a website.",
    },
    {
      question: "Does the software behind my website actually affect my Google or AI search ranking?",
      answer:
        "Yes. Load speed, clean HTML structure, and mobile performance are all ranking factors for Google, and they're also what determines whether an AI answer engine like Perplexity or ChatGPT Search can read your content well enough to cite it. A slow site built on heavy, generic code is harder to find in both.",
    },
    {
      question: "Should I hire a freelancer or an agency for my Atlanta business website?",
      answer:
        "Neither answer is automatically right. What matters is whether they can show you a live site they built, name the stack they use, and explain how the site will be found once it launches. A freelancer with the right process can outperform a large agency using a bloated template, and the reverse is also true.",
    },
    {
      question: "Why do some websites cost $500 and others cost $5,000 if they look similar?",
      answer:
        "The visible design is often the smallest difference. A $500 site is usually a template with a logo dropped in, running on shared, generic code. A $5,000 site is typically custom-built on a framework like Next.js, structured for search from day one, and built to add features without starting over. The price gap is mostly what's underneath, not what's on screen.",
    },
  ],

  cta: {
    heading: "Not sure what your current site is built on?",
    subtitle:
      "We run free audits for Atlanta businesses. We look at your current site's stack, speed, and search visibility, then tell you exactly what's costing you and what it would take to fix it.",
    primaryHref: "https://calendly.com/rangeofviewmusic/30min",
    primaryLabel: "Book a free audit",
    secondaryHref: "/web",
    secondaryLabel: "See our web services",
  },
};
