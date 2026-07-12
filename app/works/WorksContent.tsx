"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import {
  ArrowUpRight, ExternalLink,
  UtensilsCrossed, Scissors, Globe, Bot, Users,
  Feather, Monitor, ShoppingBag,
  type LucideIcon,
} from "lucide-react";
import { NavigationDock } from "@/components/sections/NavDoc";
import Footer from "@/components/sections/Footer";
import SplitText from "@/components/effects/SplitText";

const EASE = [0.32, 0.72, 0, 1] as const;

type InternalProject = {
  id: string;
  num: string;
  title: string;
  tags: readonly string[];
  description: string;
  href: string;
  type: "internal";
  icon: LucideIcon;
};

type ExternalProject = {
  id: string;
  num: string;
  title: string;
  tags: readonly string[];
  domain: string;
  href: string;
  type: "external";
  accent: string;
  icon: LucideIcon;
};

type Project = InternalProject | ExternalProject;

const projects: Project[] = [
  {
    id: "bando",
    num: "01",
    title: "The Bando",
    tags: ["Restaurant", "Next.js", "UX Design"],
    description:
      "Bold, unapologetically Atlanta. Cut bounce rate by 60% and increased online ordering page views 689x.",
    href: "/casestudy/bando",
    type: "internal",
    icon: UtensilsCrossed,
  },
  {
    id: "ikna",
    num: "02",
    title: "Aysegul Ikna",
    tags: ["Fashion", "E-commerce", "Brand Identity"],
    description:
      "Luxury that justifies the price tag. Elevated design drove 30% sales growth for this sustainable fashion brand.",
    href: "/casestudy/ikna",
    type: "internal",
    icon: Scissors,
  },
  {
    id: "dkm",
    num: "03",
    title: "DKM Corp",
    tags: ["Corporate", "Brand Identity", "Global"],
    description:
      "Brand identity and digital infrastructure spanning India, Australia, the US, and Dubai.",
    href: "/casestudy/dkm",
    type: "internal",
    icon: Globe,
  },
  {
    id: "pursue-networking",
    num: "04",
    title: "Pursue Networking",
    tags: ["SaaS", "AI", "Platform"],
    description:
      "AI-powered LinkedIn copilot. Built the platform, brand, and pipeline for 500+ active professionals.",
    href: "/casestudy/pursue-networking",
    type: "internal",
    icon: Bot,
  },
  {
    id: "atlanta-tech-meetup",
    num: "05",
    title: "Atlanta Tech Meetup",
    tags: ["Community", "Events", "Hand-coded"],
    description:
      "Hand-built community site. 100% hand-coded, serving 500+ builders across 50+ events.",
    href: "/casestudy/atlanta-tech-meetup",
    type: "internal",
    icon: Users,
  },
  {
    id: "cagedbutterfly",
    num: "06",
    title: "The Caged Butterfly",
    tags: ["Brand", "Web"],
    domain: "thecagedbutterfly.com",
    href: "https://www.thecagedbutterfly.com/",
    type: "external",
    accent: "#b794f4",
    icon: Feather,
  },
  {
    id: "grangerwang",
    num: "07",
    title: "Granger Wang",
    tags: ["Portfolio", "Web"],
    domain: "grangerwang.com",
    href: "https://www.grangerwang.com/",
    type: "external",
    accent: "#63b3ed",
    icon: Monitor,
  },
  {
    id: "strangeiswag",
    num: "08",
    title: "Strange Is Swag",
    tags: ["Brand", "E-commerce"],
    domain: "strangeiswag.com",
    href: "https://www.strangeiswag.com/",
    type: "external",
    accent: "#f6ad55",
    icon: ShoppingBag,
  },
];

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const isInternal = project.type === "internal";

  const card = (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay: (index % 3) * 0.07, ease: EASE }}
      className="group relative overflow-hidden rounded-2xl cursor-pointer"
      style={{ aspectRatio: "4/5" }}
    >
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{
          background: isInternal
            ? `radial-gradient(ellipse 55% 55% at 75% 20%, rgba(177,105,55,0.13) 0%, transparent 60%), #090909`
            : `radial-gradient(ellipse 60% 60% at 25% 25%, ${(project as ExternalProject).accent}18 0%, transparent 65%), #090909`,
        }}
      />
      {/* Category icon — centered, large, ghost opacity */}
      <div
        aria-hidden
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none transition-transform duration-700 ease-out group-hover:scale-110"
      >
        <project.icon
          size={120}
          strokeWidth={0.6}
          style={{
            color: isInternal
              ? "rgba(177,105,55,0.18)"
              : `${(project as ExternalProject).accent}22`,
            filter: isInternal
              ? "drop-shadow(0 0 32px rgba(177,105,55,0.12))"
              : `drop-shadow(0 0 32px ${(project as ExternalProject).accent}18)`,
          }}
        />
      </div>
      {/* Subtle grid lines */}
      {isInternal && (
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

      {/* Top row */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
        <span className="font-mono text-[11px] text-white/25">{project.num}</span>
        {isInternal ? (
          <ArrowUpRight
            size={13}
            strokeWidth={1.5}
            className="text-white/10 group-hover:text-[#EA9A61]/50 transition-colors duration-300"
          />
        ) : (
          <ExternalLink
            size={13}
            strokeWidth={1.5}
            className="text-white/15 group-hover:text-white/40 transition-colors duration-300"
          />
        )}
      </div>

      {/* Bottom content */}
      <div className="absolute bottom-0 left-0 right-0 p-5">
        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {project.tags.map((t) => (
            <span
              key={t}
              className="text-[8px] uppercase tracking-[0.18em] px-2 py-0.5 rounded-full border border-white/[0.09] text-white/35"
            >
              {t}
            </span>
          ))}
        </div>

        {/* Title */}
        <h3
          className="leading-none uppercase"
          style={{
            fontFamily: "'Norwige', serif",
            fontSize: "clamp(1.5rem, 2.2vw, 2rem)",
            letterSpacing: "-0.02em",
            color: isInternal ? "transparent" : (project as ExternalProject).accent,
            backgroundImage: isInternal
              ? "linear-gradient(132deg, #EA9A61 4.77%, #B16937 27.26%, #A64D2B 50.09%, #42201C 76.74%)"
              : undefined,
            backgroundClip: isInternal ? "text" : undefined,
            WebkitBackgroundClip: isInternal ? "text" : undefined,
          }}
        >
          {project.title}
        </h3>

        {/* Domain for external */}
        {!isInternal && (
          <p
            className="text-[9px] tracking-[0.14em] uppercase mt-1"
            style={{ color: `${(project as ExternalProject).accent}50` }}
          >
            {(project as ExternalProject).domain}
          </p>
        )}

        {/* Description — expands on hover for internal */}
        {isInternal && (
          <div className="grid transition-all duration-400 ease-out grid-rows-[0fr] group-hover:grid-rows-[1fr]">
            <div className="overflow-hidden">
              <p className="text-white/50 text-[0.78rem] leading-[1.65] mt-2.5 max-w-[32ch]">
                {(project as InternalProject).description}
              </p>
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="mt-3 flex items-center gap-1.5 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          {isInternal ? (
            <span className="text-[9px] uppercase tracking-[0.2em] text-[#EA9A61] flex items-center gap-1.5">
              View Case Study
              <ArrowUpRight size={10} strokeWidth={2} />
            </span>
          ) : (
            <span
              className="text-[9px] uppercase tracking-[0.2em] flex items-center gap-1.5"
              style={{ color: (project as ExternalProject).accent }}
            >
              Visit Site
              <ExternalLink size={9} strokeWidth={1.5} />
            </span>
          )}
        </div>
      </div>

      {/* Subtle hover tint */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
        style={{
          background: isInternal
            ? "rgba(234,154,97,0.03)"
            : `${(project as ExternalProject).accent}07`,
        }}
      />
    </motion.div>
  );

  return isInternal ? (
    <Link href={(project as InternalProject).href}>{card}</Link>
  ) : (
    <a href={project.href} target="_blank" rel="noopener noreferrer">
      {card}
    </a>
  );
}

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
        {/* Hero */}
        <div ref={heroRef} className="mb-14 md:mb-18">
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

          <div
            className="[&>h1]:font-normal [&>h1]:leading-none [&>h1]:tracking-tight [&>h1]:text-[#FFF4E3]"
            style={{ fontFamily: "'Norwige', serif", fontSize: "clamp(3.5rem,10vw,8rem)" }}
          >
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
            Every site, brand, and experience we&apos;ve shipped — from deep case studies to quick-turn builds.
          </motion.p>
        </div>

        {/* Grid — all 8 projects, 3 columns on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {projects.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} />
          ))}
        </div>
      </div>

      <Footer />
    </main>
  );
}
