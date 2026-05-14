"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { NavigationDock } from "@/components/NavDoc";
import Footer from "@/components/Footer";
import SplitText from "@/components/SplitText";

const EASE = [0.32, 0.72, 0, 1] as const;

/* ─── data ──────────────────────────────────────────────────────────────── */

const caseStudies = [
  {
    id: "bando",
    num: "01",
    title: "The Bando",
    tags: ["Restaurant", "Next.js", "UX Design"],
    description:
      "Bold, unapologetically Atlanta. We transformed a Black history museum and fried chicken spot's digital presence to match their in-person energy, cutting bounce rate by 60%.",
    image: "/casestudy/Evertriedcrack.webp",
    href: "/casestudy/bando",
    type: "internal",
  },
  {
    id: "ikna",
    num: "02",
    title: "Aysegul Ikna",
    tags: ["Fashion", "E-commerce", "Brand Identity"],
    description:
      "Luxury that justifies the price tag. A sophisticated digital home for a sustainable fashion brand at Ponce City Market, driving 30% sales growth through elevated design.",
    image: "/casestudy/iknacasestudy.webp",
    href: "/casestudy/ikna",
    type: "internal",
  },
  {
    id: "dkm",
    num: "03",
    title: "DKM Corp",
    tags: ["Corporate", "Brand Identity", "Global"],
    description:
      "Scaling global operations. Brand identity and digital infrastructure for a private growth and operations partner spanning India, Australia, the US, and Dubai.",
    image: "/casestudy/dubaiskyline.webp",
    href: "/casestudy/dkm",
    type: "internal",
  },
  {
    id: "pursue-networking",
    num: "04",
    title: "Pursue Networking",
    tags: ["SaaS", "AI", "Platform"],
    description:
      "An AI-powered LinkedIn copilot that turns B2B networking into revenue. We built the platform, the brand, and the pipeline that now drives 500+ active professionals.",
    image: "/casestudy/Pursue/pursuecover.webp",
    href: "/casestudy/pursue-networking",
    type: "internal",
  },
  {
    id: "atlanta-tech-meetup",
    num: "05",
    title: "Atlanta Tech Meetup",
    tags: ["Community", "Events", "Hand-coded"],
    description:
      "The vibe is the product. Hand-built community site for Atlanta's monthly tech meetup. 100% hand-coded, serving a community of 500+ builders across 50+ events.",
    image: "/casestudy/atm/atm1.webp",
    href: "/casestudy/atlanta-tech-meetup",
    type: "internal",
  },
] as const;

const additionalProjects = [
  {
    id: "cagedbutterfly",
    num: "06",
    title: "The Caged Butterfly",
    tags: ["Brand", "Web"],
    domain: "thecagedbutterfly.com",
    href: "https://www.thecagedbutterfly.com/",
    gradient: "from-[#1a0a2e] via-[#2d1b4e] to-[#0d0619]",
    accent: "#b794f4",
  },
  {
    id: "grangerwang",
    num: "07",
    title: "Granger Wang",
    tags: ["Portfolio", "Web"],
    domain: "grangerwang.com",
    href: "https://www.grangerwang.com/",
    gradient: "from-[#0a1628] via-[#0f2442] to-[#060e1a]",
    accent: "#63b3ed",
  },
  {
    id: "strangeiswag",
    num: "08",
    title: "Strange Is Wag",
    tags: ["Brand", "E-commerce"],
    domain: "strangeiswag.com",
    href: "https://www.strangeiswag.com/",
    gradient: "from-[#1a1200] via-[#2d2000] to-[#0d0900]",
    accent: "#f6ad55",
  },
] as const;

/* ─── components ─────────────────────────────────────────────────────────── */

function FeaturedRow({
  project,
  index,
}: {
  project: (typeof caseStudies)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reversed = index % 2 !== 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: EASE }}
      className={`flex flex-col ${reversed ? "md:flex-row-reverse" : "md:flex-row"} gap-10 md:gap-16 items-center border-t border-white/[0.07] pt-12 mb-12`}
    >
      {/* image */}
      <Link
        href={project.href}
        className="relative w-full md:flex-[1.3] aspect-[4/3] overflow-hidden bg-[#0d0d0d] block group"
      >
        <div className="w-full h-full relative transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]">
          <Image
            src={project.image}
            alt={project.title}
            fill
            sizes="(max-width: 900px) 100vw, 55vw"
            className="object-cover"
          />
        </div>
        {/* overlay */}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-500" />
      </Link>

      {/* copy */}
      <div className="flex-1 flex flex-col justify-center w-full">
        <div className="flex items-center gap-4 mb-6">
          <span className="font-mono text-sm text-white/30">{project.num}</span>
          <div className="flex flex-wrap gap-2">
            {project.tags.map((t) => (
              <span
                key={t}
                className="text-[10px] uppercase tracking-[0.18em] px-2.5 py-1 rounded-full border border-white/10 text-white/40"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        <h2
          className="leading-none mb-5 uppercase text-transparent bg-clip-text"
          style={{
            fontFamily: "'Norwige', serif",
            fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
            backgroundImage:
              "linear-gradient(132deg, #EA9A61 4.77%, #B16937 27.26%, #A64D2B 50.09%, #42201C 76.74%)",
            letterSpacing: "-0.02em",
          }}
        >
          {project.title}
        </h2>

        <p className="text-white/60 leading-[1.7] mb-8 max-w-[44ch] text-[0.95rem]">
          {project.description}
        </p>

        <Link
          href={project.href}
          className="group/btn inline-flex items-center gap-3 rounded-full pl-6 pr-1.5 py-1.5 w-fit border border-white/15 text-white/80 hover:border-[#EA9A61]/50 hover:text-white transition-all duration-300"
          style={{ fontSize: "0.85rem", letterSpacing: "0.06em" }}
        >
          <span className="uppercase py-1">View Case Study</span>
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.06] group-hover/btn:bg-[#EA9A61]/15 transition-colors duration-300">
            <ArrowUpRight size={14} strokeWidth={2} />
          </span>
        </Link>
      </div>
    </motion.div>
  );
}

function AdditionalCard({
  project,
  index,
}: {
  project: (typeof additionalProjects)[number];
  index: number;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.a
      ref={ref}
      href={project.href}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.1, ease: EASE }}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/[0.07] p-8 min-h-[280px] hover:border-white/15 transition-colors duration-500"
      style={{
        background: `radial-gradient(ellipse at 30% 20%, ${project.accent}18 0%, transparent 60%)`,
        backgroundColor: "#0a0a0a",
      }}
    >
      {/* num + tags */}
      <div className="flex items-start justify-between mb-auto">
        <div>
          <span className="font-mono text-sm text-white/20 block mb-4">
            {project.num}
          </span>
          <div className="flex flex-wrap gap-2">
            {project.tags.map((t) => (
              <span
                key={t}
                className="text-[10px] uppercase tracking-[0.18em] px-2.5 py-1 rounded-full border border-white/10 text-white/30"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/30 group-hover:border-white/30 group-hover:text-white transition-all duration-300">
          <ExternalLink size={14} strokeWidth={1.5} />
        </span>
      </div>

      {/* title + domain */}
      <div className="mt-10">
        <h3
          className="leading-none uppercase mb-2"
          style={{
            fontFamily: "'Norwige', serif",
            fontSize: "clamp(1.8rem, 3vw, 2.75rem)",
            color: project.accent,
            letterSpacing: "-0.02em",
          }}
        >
          {project.title}
        </h3>
        <p
          className="text-[0.75rem] tracking-[0.12em] uppercase"
          style={{ color: `${project.accent}60` }}
        >
          {project.domain}
        </p>
      </div>

      {/* hover glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500 rounded-2xl"
        style={{
          background: `radial-gradient(ellipse at 30% 20%, ${project.accent}10 0%, transparent 70%)`,
        }}
      />
    </motion.a>
  );
}

/* ─── page ───────────────────────────────────────────────────────────────── */

export default function WorksContent() {
  const heroRef = useRef<HTMLDivElement>(null);

  return (
    <main className="relative bg-[#050505] min-h-[100dvh] overflow-x-hidden text-white">
      <NavigationDock />

      {/* ambient blobs */}
      <div
        aria-hidden
        className="fixed top-0 left-0 w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{
          background: "rgba(96,62,37,0.7)",
          filter: "blur(200px)",
          transform: "translate(-40%, -40%)",
          zIndex: 0,
        }}
      />
      <div
        aria-hidden
        className="fixed bottom-0 right-0 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: "rgba(96,62,37,0.5)",
          filter: "blur(180px)",
          transform: "translate(35%, 35%)",
          zIndex: 0,
        }}
      />

      <div className="relative z-10 max-w-[1280px] mx-auto px-5 md:px-10 pt-32 pb-24">
        {/* ── hero ── */}
        <div ref={heroRef} className="mb-20 md:mb-28">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 mb-8"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#EA9A61]" />
            <span className="text-[10px] uppercase tracking-[0.28em] text-white/50">
              Range of View Studios
            </span>
          </motion.div>

          {/* wrapper forces Norwige + display size onto the SplitText h1 */}
          <div className="[&>h1]:font-normal [&>h1]:leading-none [&>h1]:tracking-tight [&>h1]:text-[#FFF4E3]"
            style={{ fontFamily: "'Norwige', serif", fontSize: "clamp(3.5rem,10vw,8rem)" }}>
            <SplitText
              text="All Work"
              tag="h1"
              className=""
              delay={25}
              duration={1}
              ease="power3.out"
              splitType="chars"
              from={{ opacity: 0, y: 50 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.1}
              rootMargin="-50px"
              textAlign="inherit"
            />
          </div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35, ease: EASE }}
            className="mt-6 max-w-[52ch] text-white/50 leading-[1.7]"
            style={{ fontSize: "clamp(1rem, 1.5vw, 1.1rem)" }}
          >
            Every site, brand, and experience we&apos;ve shipped — from deep
            case studies to quick-turn builds. All in one place.
          </motion.p>
        </div>

        {/* ── featured case studies ── */}
        <section aria-label="Featured case studies" className="mb-28">
          <div className="flex items-center gap-4 mb-14">
            <span className="h-px flex-1 bg-white/[0.07]" />
            <span className="text-[10px] uppercase tracking-[0.28em] text-white/30">
              Featured Case Studies
            </span>
            <span className="h-px flex-1 bg-white/[0.07]" />
          </div>

          <div>
            {caseStudies.map((cs, i) => (
              <FeaturedRow key={cs.id} project={cs} index={i} />
            ))}
          </div>
        </section>

        {/* ── additional projects ── */}
        <section aria-label="Additional projects">
          <div className="flex items-center gap-4 mb-14">
            <span className="h-px flex-1 bg-white/[0.07]" />
            <span className="text-[10px] uppercase tracking-[0.28em] text-white/30">
              More Projects
            </span>
            <span className="h-px flex-1 bg-white/[0.07]" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {additionalProjects.map((p, i) => (
              <AdditionalCard key={p.id} project={p} index={i} />
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
