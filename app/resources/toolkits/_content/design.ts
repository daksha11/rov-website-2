// Content for /resources/toolkits/design.
// The tool roster (name, url, category, oneLiner, etc.) is imported from CTRL-A's
// data.ts, since those facts are shared. Everything else: the framing, myths,
// quick-start, and FAQ, is authored fresh for an Atlanta small business owner
// deciding whether their DIY/Canva branding is costing them customers, not for
// CTRL-A's culture-magazine reader.

import { toolkitSections } from "@/app/ctrla/data";
import type { ToolkitArticleContent } from "./types";

const designSection = toolkitSections.find((section) => section.id === "design");

if (!designSection) {
  throw new Error("design toolkit section not found in app/ctrla/data.ts");
}

export const designContent: ToolkitArticleContent = {
  id: "design",

  seo: {
    title: "Why Does My Brand Look Homemade?",
    description:
      "The 8 tools behind every brand ROV builds, and the signs your Canva logo is costing you customers in Atlanta.",
    ogTitle: "Why Does My Brand Look Homemade?",
    ogDescription:
      "Eight tools, one process, and the questions worth asking before you invest in real brand design for your Atlanta business.",
    ogImage: "/casestudy/casestudyheroimg.png",
  },

  breadcrumb: "Resources · Design Toolkit",

  h1: "Why Does My Brand Look Homemade?",
  heroSubtitle:
    "Eight tools. One process. The difference between a logo you made on a Tuesday and a brand people trust with their money.",
  quickAnswer:
    "A brand looks homemade when it has a logo but no system: no defined colors, no consistent typography, and no rules for how the mark scales across a website, a truck door, or a black-and-white invoice. Fixing it takes a real design process, research, a defined personality, typography and color decisions, and stress-testing the mark, not a better logo file.",

  authorName: "Kavya",
  authorRole: "Director of Design",
  authorImage: "/teammembers/kavyatm.webp",
  dateDisplay: "July 2026",
  dateISO: "2026-07-03",
  readingTime: "8 min read",

  stats: [
    { value: "8", label: "Tools in the process" },
    { value: "3", label: "Colors in a working palette" },
    { value: "5", label: "Steps, blank page to brand sheet" },
  ],

  toc: [
    { id: "the-process-behind-a-brand-that-works", label: "The process behind a brand that works" },
    { id: "the-toolkit", label: "The 8 tools we design with" },
    { id: "myths-corrected", label: "Myths, corrected" },
    { id: "quick-start", label: "What actually happens when we build your brand" },
    { id: "what-this-means", label: "What this means for Atlanta businesses" },
    { id: "faq", label: "Frequently asked questions" },
  ],

  intro: {
    heading: "The process behind a brand that works",
    paragraphs: [
      "A landscaping company owner in Decatur built her logo in Canva the week she registered her LLC. It looked fine on her phone. Then a $40,000 backyard renovation client pulled up her estimate next to a competitor's, on a laptop, at full size, and asked why her invoice looked like a birthday flyer. She didn't lose the job because her work was worse. She lost it because her brand gave the client a reason to doubt her before she said a word.",
      "This happens constantly in Atlanta right now. A business owner spends years getting good at the actual work, plumbing, catering, landscaping, coaching, then hands their public face to whatever free tool was open on a Tuesday night. The logo, the fonts, the colors: these aren't decoration. They're the first signal a stranger reads about whether you're a serious operation or a side hustle.",
      "This is the toolkit we build every ROV client's brand with. Not because the names are impressive, but because each one solves a specific problem a template logo maker either can't solve or gets wrong by default.",
    ],
    calloutLabel: "The short version",
    calloutText:
      "A brand's design process decides whether it looks trustworthy at first glance, holds up across every size and surface, and feels like one consistent business instead of five mismatched templates. These are the 8 tools we use to make sure it does, from the first mood board to the final export.",
  },

  toolsSection: {
    heading: "The 8 tools we design with",
    intro:
      "This is the actual kit, mood board to export. No filler tools added to pad the list. If a client asks what we build their brand with, this is the honest answer.",
    tools: designSection.tools,
    image: {
      src: "/casestudy/bando/bando1.webp",
      alt: "The Bando wordmark hand-painted at mural scale across a retro patterned wall inside the venue",
      caption: "TheBando's wordmark, tested at mural scale inside the space. The same typography discipline these tools are built for.",
    },
  },

  myths: {
    heading: "Myths, corrected",
    intro:
      "Four things Atlanta business owners assume about design that cost them customers when they turn out to be wrong.",
    items: [
      {
        myth: "Good design is about making things pretty.",
        reality:
          "Good design is about making things clear and trustworthy. Pretty is a side effect of getting the thinking right, not the goal. A logo can be visually pleasant and still fail if it doesn't read at a glance on a truck door, a favicon, or a black-and-white invoice. Real design work starts with where the brand will actually be seen, not with picking colors that feel nice.",
      },
      {
        myth: "A DIY logo maker gets you basically the same result as hiring a designer.",
        reality:
          "It gets you a logo. It doesn't get you a system. A template tool hands you one image in one format. A real brand build hands you a mark that works as a favicon, a truck decal, and a letterhead, plus the exact fonts, colors, and spacing rules so every future flyer, sign, and social post looks like the same business made it. That consistency is most of what makes a brand feel established.",
      },
      {
        myth: "You need expensive software and a big budget to design well.",
        reality:
          "Some of the tools in a professional kit are free. What costs money isn't the software, it's the judgment: knowing which of a hundred font pairings actually works, which color choice reads as trustworthy versus which reads as discount, and which idea to cut. Free tools in untrained hands still produce a Canva logo. The gap is experience, not the price of the subscription.",
      },
      {
        myth: "Following design trends makes a brand look current.",
        reality:
          "Trends are references, not rules. Plenty of Atlanta small business logos leaned into a trend two years ago that already looks dated, while a well-built classic mark from the same year still holds up. A brand designed to chase this month's look needs a redo every year. One built on real fundamentals, typography, color theory, and a clear personality, ages slowly on purpose.",
      },
    ],
  },

  quickStart: {
    heading: "What actually happens when we build your brand",
    intro:
      "This is the process behind every ROV brand build, the same five steps whether the client is a restaurant or a roofing company. Knowing it is how you tell a real design process from a same-day logo drop.",
    steps: [
      {
        number: 1,
        title: "Research happens before anything gets designed",
        body: "We study the industry, the competitors, and who the brand actually needs to convince. We pull real reference, not concept art, to find the gap between what everyone else in the category looks like and what this business needs to say instead.",
        tip: "Ask any designer what they researched before they opened a design tool. If the answer is nothing, that's a template with your name on it, not a brand.",
      },
      {
        number: 2,
        title: "The brand personality gets defined in words first",
        body: "Three adjectives, not fifty. Bold or quiet, warm or clinical, established or scrappy. Every font, color, and layout choice after this point gets checked against those words. If a choice doesn't match, it gets cut, no matter how nice it looks alone.",
      },
      {
        number: 3,
        title: "Typography and color get chosen in that order",
        body: "Two fonts: one that carries the personality, one built for readability. Then a minimal color system, one primary, one neutral, one accent, built to work in a real environment, not just floating on a white mood board.",
        tip: "If your current brand has five fonts across your website, menu, and signage, that's not variety. That's the sign nobody ever set the rules.",
      },
      {
        number: 4,
        title: "The mark gets stress-tested, not just approved",
        body: "The logo gets checked small, in black and white, on a busy background, and next to a competitor's. A mark that only works in one perfect version on one perfect background isn't finished. This is the step a same-day logo drop skips entirely.",
      },
      {
        number: 5,
        title: "You get a system, not a single file",
        body: "A brand sheet with the logo in every format you'll need, the exact fonts and colors, spacing rules, and real applications, a sign, a flyer, a social post, so whoever touches your brand next builds on it instead of guessing.",
      },
    ],
    image: {
      src: "/casestudy/ikna/fashion1ikna.webp",
      alt: "A model walking a runway show inside Ikna's Atlanta retail space during a branded event",
      caption: "Ikna's brand system in use at a live event: the same colors, typography, and personality carried from the logo into the room.",
    },
  },

  whatThisMeans: {
    heading: "What this means for Atlanta businesses",
    paragraphs: [
      "Canva and free logo generators are genuinely useful for testing an idea fast, and plenty of Atlanta owners start there with no shame in it. The problem shows up later, when the business is real, the invoices are bigger, and the brand still looks like the version made in one sitting before the LLC paperwork was even filed.",
      "Customers in Buckhead, Decatur, Marietta, and the Westside are comparing you against competitors constantly, often without meaning to. A homeowner getting three quotes for a kitchen remodel, a family choosing between two caterers for an event, they are reading brand consistency as a stand-in for reliability, even when they couldn't name a single design principle. A logo that looks different on your truck than it does on your website plants a small doubt neither party can fully explain.",
      "None of this means you need to become a designer. It means that when your brand still looks like it did the week you started, that's worth a second look, the same way you'd revisit a five-year-old website. Ask what a real brand system includes before you ask what a logo costs.",
    ],
    calloutLabel: "The short version",
    calloutText:
      "Your brand is the first signal a stranger reads about whether your business is established or just getting started. A DIY logo can launch a business. A designed brand system is what makes it look like it's built to last.",
  },

  faqs: [
    {
      question: "Do I need a professional brand designer or is Canva enough?",
      answer:
        "Canva is enough for testing an idea with no customers yet. Once real money and real trust are on the line, a designed brand system, logo variations, defined typography, a real color palette, and usage rules, reads as more established than a template logo, and that difference shows up in which quotes customers actually pick.",
    },
    {
      question: "What is a brand system and how is it different from a logo?",
      answer:
        "A logo is one image. A brand system is the full set of rules around it: the exact fonts, the exact colors with hex codes, spacing guidelines, and example applications like a sign, a flyer, and a business card. The system is what keeps every future piece of marketing looking like the same business made it, instead of five mismatched files.",
    },
    {
      question: "Does my brand's design actually affect whether customers choose me?",
      answer:
        "Yes. Customers read visual consistency as a proxy for reliability, especially when comparing quotes for a big purchase like a renovation, an event, or ongoing service. A mismatched or homemade-looking brand plants doubt before a customer reads a single word of your pitch, even if the underlying work is excellent.",
    },
    {
      question: "Should I hire a freelance designer or an agency for my Atlanta business?",
      answer:
        "Neither answer is automatically right. What matters is whether they show you a real process, research, personality definition, typography and color decisions, and stress-testing, or just deliver a single logo file. A freelancer with a real process can outperform an agency handing you a template, and the reverse is also true.",
    },
    {
      question: "Why do some logos cost $200 and others cost $3,000 if they look similar at a glance?",
      answer:
        "The visible mark is the smallest part of the cost. A $200 logo is usually one file from a generator with no system behind it. A $3,000 brand build includes research, a defined color and type system, multiple mark variations for different surfaces, and a usage guide. The gap is mostly what happens before and after the logo, not the logo itself.",
    },
  ],

  cta: {
    heading: "Not sure if your current brand is helping or hurting you?",
    subtitle:
      "We run free brand audits for Atlanta businesses. We look at your logo, colors, and consistency across your site, signage, and socials, then tell you exactly what's costing you trust and what it would take to fix it.",
    primaryHref: "https://calendly.com/rangeofviewmusic/30min",
    primaryLabel: "Book a free audit",
    secondaryHref: "/works",
    secondaryLabel: "See our design work",
  },
};
