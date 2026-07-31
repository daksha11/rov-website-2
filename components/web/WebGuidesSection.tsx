import Link from "next/link";

// Cluster links for the /web hub. Topical authority is largely a link-structure
// signal: every child page already links back up here, but the hub linked down
// to none of them, so the cluster only pointed one way. Anchor text is
// deliberately descriptive rather than "read more".
const GUIDES: { href: string; title: string; blurb: string }[] = [
  {
    href: "/web/how-much-does-a-website-cost-in-atlanta",
    title: "How much does a website cost in Atlanta?",
    blurb:
      "Real 2026 pricing, what moves the number, and what a cheap website actually costs you later.",
  },
  {
    href: "/web/why-isnt-my-business-showing-up-on-google",
    title: "Why isn't my business showing up on Google?",
    blurb:
      "The six reasons Atlanta businesses stay invisible in local search, and how to fix each one.",
  },
  {
    href: "/web/real-estate-agent-website-atlanta",
    title: "Real estate agent websites in Atlanta",
    blurb:
      "Nearly half of online inquiries never get a reply. The website and follow-up system that fixes it.",
  },
  {
    href: "/web/missed-call-text-back-atlanta-hvac",
    title: "Missed-call text-back for Atlanta HVAC",
    blurb:
      "The call you miss on a job goes to the next truck. A text back in under 30 seconds keeps it yours.",
  },
  {
    href: "/web/skills-that-matter-in-the-ai-era",
    title: "What skills actually matter in the AI era?",
    blurb:
      "AI made building the easy part. Planning, systems thinking, and judgment are what's left.",
  },
];

export default function WebGuidesSection() {
  return (
    <section className="relative bg-black py-20 md:py-28 px-6 md:px-12 lg:px-16 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <p
          className="text-xs uppercase tracking-[0.3em] text-center mb-10 md:mb-14"
          style={{ color: "rgba(255,244,227,0.3)", fontFamily: "Norwige, sans-serif" }}
        >
          Guides worth reading first
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          {GUIDES.map((guide) => (
            <Link
              key={guide.href}
              href={guide.href}
              className="group block rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-7 transition-colors hover:border-[#EA9A61]/40 hover:bg-white/[0.06]"
            >
              <h3
                className="text-lg md:text-xl text-white mb-2"
                style={{ fontFamily: "Norwige, sans-serif" }}
              >
                {guide.title}
              </h3>
              <p className="text-sm md:text-[0.9375rem] leading-relaxed text-white/55">
                {guide.blurb}
              </p>
              <span className="mt-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#EA9A61]/70 transition-colors group-hover:text-[#EA9A61]">
                Read the guide
                <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
                  &rarr;
                </span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
