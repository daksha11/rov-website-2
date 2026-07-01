"use client";

// ═══════════════════════════════════════════════════════
// TEAM — ROV house editorial (home design system)
// The people are the page. A clean grid of portraits on the
// warm near-black ground, set in the ROV house type (Norwige
// display + Inter body) with the ember gradient as the single
// accent. Tap a face to open the full bio inline. Shared by the
// home page and /about, so it wears the studio brand, not CTRL-A.
// ═══════════════════════════════════════════════════════

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Image from "next/image";

type Category = "All" | "Creative" | "Tech" | "Systems";
type CreativeSubcategory = "UI/UX" | "Motion" | "Illustrative" | "Sound";

interface TeamMember {
    id: number;
    image: string;
    category: Category;
    creativeSubcategory?: CreativeSubcategory;
    additionalCategories?: Category[];
    additionalSubcategories?: CreativeSubcategory[];
    name: string;
    role: string;
    skills: string[];
    location: string;
    specialties?: string;
    shadowColor?: string;
    imageRotation?: number;
    portfolioLink?: string;
}

const teamMembers: TeamMember[] = [
    {
        id: 1,
        image: "/teammembers/basutm2.webp",
        category: "Creative",
        creativeSubcategory: "UI/UX",
        additionalCategories: ["Tech", "Systems"],
        additionalSubcategories: ["Motion", "Sound"],
        name: "Ayush Basu",
        role: "FOUNDER & CREATIVE DIRECTOR",
        skills: ["Creative Direction", "Brand Strategy", "Web Development", "Design Systems", "Client Relations"],
        location: "Atlanta",
        portfolioLink: "https://www.ayushbasu.com/",
        specialties: "I lead creative direction across all client projects and internal initiatives while overseeing company operations. I contribute hands-on to design, development, and client communications, making sure R.O.V.'s vision stays consistent from pitch to delivery.",
        shadowColor: "101, 67, 33"
    },
    {
        id: 13,
        image: "/teammembers/kavyatm.webp",
        category: "Creative",
        creativeSubcategory: "UI/UX",
        name: "Kavya",
        role: "DIRECTOR OF DESIGN — UI/UX & DESIGN SYSTEMS",
        skills: ["UI/UX Design", "Design Systems", "Web Design", "Design Infrastructure", "Brand Guidelines", "Design Standards", "Team Leadership", "Project Delegation", "Client Relations", "Creative Strategy"],
        location: "Atlanta",
        portfolioLink: "https://www.kavyaray.com/",
        specialties: "I'm ROV Studios' Director of Design, a SCAD-trained UI/UX designer and design systems specialist with enterprise-level experience from brands like Porsche, Lowe's, and UBS. Based in Atlanta, I lead the design team end-to-end: from delegating creative tasks and setting design standards to managing client relationships and delivering polished, system-driven work at every touchpoint.",
        shadowColor: "100, 100, 100"
    },
    {
        id: 3,
        image: "/teammembers/vaishnavitm.webp",
        category: "Creative",
        creativeSubcategory: "Motion",
        name: "Vaishnavi",
        role: "CREATIVE DIRECTOR & VIDEO STRATEGIST",
        skills: ["Video Creative Direction", "Visual Storytelling", "Campaign Strategy", "Motion Design"],
        location: "Atlanta",
        specialties: "I help brands tell stories that stick, through motion, narrative structure, and campaign-level thinking. Whether it's directing video concepts or modeling creative strategies, I make sure every decision connects back to what the brand needs to say and how people should feel it.",
        shadowColor: "180, 120, 90"
    },
    {
        id: 4,
        image: "/teammembers/tanvitm.webp",
        category: "Creative",
        creativeSubcategory: "Illustrative",
        name: "Tanvi",
        role: "DESIGN & SOCIAL MEDIA STRATEGIST",
        skills: ["Social Media Design", "UI/UX", "Content Strategy", "Creative Ideation", "Campaign Visuals"],
        location: "India",
        specialties: "I drive social media design and visual content strategy while playing a key role in ideating and brainstorming direction for new projects. I bring fresh UI/UX perspectives and make sure every digital touchpoint feels modern and engaging.",
        shadowColor: "140, 110, 140"
    },
    {
        id: 14,
        image: "/teammembers/jinwontm.webp",
        category: "Creative",
        creativeSubcategory: "UI/UX",
        name: "Jiwon",
        role: "UI/UX DESIGNER & ILLUSTRATOR",
        skills: ["UI/UX Design", "Design Strategy", "Illustration", "Interface Design", "User Experience", "Visual Design Systems"],
        location: "Savannah",
        specialties: "I'm a SCAD-trained designer based in Savannah with an exceptional eye for overall design strategy.",
        shadowColor: "130, 100, 160"
    },
    {
        id: 6,
        image: "/teammembers/davidtm.webp",
        category: "Creative",
        creativeSubcategory: "Motion",
        name: "David",
        role: "3D CREATIVE DIRECTOR",
        skills: ["3D Product Visualization", "Custom Texturing", "Modeling", "Lighting & Rendering", "Creative Direction"],
        location: "USA",
        specialties: "I create sophisticated, photorealistic 3D product visualizations using advanced Blender techniques. From custom texturing and modeling to lighting and rendering, I bring digital assets to life with cinematic quality.",
        shadowColor: "100, 150, 200"
    },
    {
        id: 7,
        image: "/teammembers/dakshatm.webp",
        category: "Tech",
        name: "Daksha",
        role: "HEAD OF DEVELOPMENT",
        skills: ["Full-Stack Development", "Technical Architecture", "Complex Problem Solving", "Performance Optimization", "Code Standards"],
        location: "India",
        specialties: "I'm R.O.V.'s go-to technical lead for complex coding challenges and scalable solutions. I solve the toughest tech problems, architect robust systems, and make sure every build is performant, maintainable, and production-ready.",
        shadowColor: "90, 120, 150"
    },
    // hidden: Jasnoor

    {
        id: 10,
        image: "/teammembers/suchettm.webp",
        category: "Tech",
        name: "Suchet",
        role: "CO-FOUNDER & SYSTEMS ARCHITECT",
        skills: ["Operations Strategy", "AI Systems Development", "Financial Management", "Sales & Client Relations", "Process Automation"],
        location: "Atlanta",
        specialties: "I joined as co-founder to build the operational backbone of R.O.V.",
    },
    {
        id: 12,
        image: "/teammembers/suchettm.webp",
        category: "Systems",
        name: "Suchet",
        role: "CO-FOUNDER & SYSTEMS ARCHITECT",
        skills: ["Operations Strategy", "AI Systems Development", "Financial Management", "Sales & Client Relations", "Process Automation"],
        location: "Atlanta",
        specialties: "I joined as co-founder to build the operational backbone of R.O.V.",
    },
    {
        id: 11,
        image: "/teammembers/dakshatm.webp",
        category: "Systems",
        name: "Daksha",
        role: "HEAD OF DEVELOPMENT",
        skills: ["Full-Stack Development", "Technical Architecture", "Complex Problem Solving", "Performance Optimization", "Code Standards"],
        location: "India",
        specialties: "I'm R.O.V.'s go-to technical lead for complex coding challenges and scalable solutions. I solve the toughest tech problems, architect robust systems, and make sure every build is performant, maintainable, and production-ready.",
    },
    {
        id: 5,
        image: "/teammembers/chamantm.webp",
        category: "Creative",
        creativeSubcategory: "Motion",
        name: "Chaman",
        role: "VIDEO EDITOR & MOTION DESIGNER",
        skills: ["Video Editing", "Motion Graphics", "After Effects Design", "Creative Concepting", "Rapid Turnaround Production"],
        location: "India",
        specialties: "I bring fresh creative ideas and fast execution to R.O.V.'s edits and media production. Whether it's complex motion work or quick-turn content, I specialize in After Effects wizardry and turn concepts into polished, dynamic visuals, even on tight timelines.",
        shadowColor: "200, 100, 50"
    },
    {
        id: 15,
        image: "/teammembers/samsuentm.webp",
        category: "Creative",
        creativeSubcategory: "Sound",
        name: "Sam Suen",
        role: "HEAD OF ARTIST DEVELOPMENT",
        skills: ["Artist Development", "Creative Strategy", "Talent Management", "Music Industry Relations", "Brand Building"],
        location: "Atlanta",
        specialties: "I lead artist development initiatives, guiding emerging talent through creative growth and strategic brand positioning in the music industry.",
        shadowColor: "140, 90, 110"
    },
    {
        id: 16,
        image: "/teammembers/anishtm2.webp",
        category: "Creative",
        creativeSubcategory: "UI/UX",
        name: "Anish Goel",
        role: "WEB & GRAPHIC DESIGNER",
        skills: ["Web Design", "Graphic Design", "Visual Communication", "Brand Collateral Design", "Design Strategy"],
        location: "Savannah, Georgia",
        specialties: "I bridge creativity and clarity through thoughtful web and graphic design. I translate R.O.V.'s ideas into compelling visual communication, ensuring concepts are expressed with precision, polish, and purpose across digital and branded touchpoints.",
        shadowColor: "150, 120, 90"
    },
    {
        id: 17,
        image: "/teammembers/eshaaltm.webp",
        category: "Creative",
        creativeSubcategory: "Illustrative",
        name: "Eshaal",
        role: "CUSTOM ILLUSTRATOR",
        skills: ["Custom Illustration", "Hand-Drawn Art", "Character Design", "Creative Concepting", "Visual Storytelling"],
        location: "Birmingham, UK",
        specialties: "I draw custom, fun illustrations from scratch for R.O.V.'s projects. I bring a playful, hand-crafted touch to every piece, turning ideas into one-of-a-kind visuals that give each project its own personality and charm.",
        shadowColor: "160, 110, 130"
    },
    {
        id: 20,
        image: "/teammembers/krinapic.jpg",
        category: "Creative",
        creativeSubcategory: "Motion",
        name: "Krina",
        role: "PHOTOGRAPHER & CAMERA OPERATOR",
        skills: ["Photography", "Camera Operation", "Visual Composition", "Lighting", "On-Set Direction", "Post-Processing"],
        location: "Atlanta",
        specialties: "I shoot with a precision-first mentality, framing each shot to tell the story before any edit is applied. From on-location photography to camera operation on set, I handle the lens side of production so every frame is intentional.",
        shadowColor: "120, 90, 140"
    },
    {
        id: 21,
        image: "/teammembers/chandra.jpg",
        category: "Creative",
        creativeSubcategory: "Motion",
        name: "Chandra",
        role: "DIRECTOR & CONTENT STRATEGIST",
        skills: ["Creative Direction", "Content Strategy", "Camera Operation", "Storytelling", "Production Planning", "Brand Narrative"],
        location: "Atlanta",
        specialties: "I direct shoots and shape content strategy from concept to camera. I think in story arcs and translate brand ideas into visual narratives that actually land. On set, I'm also behind the camera, making sure what we capture matches the vision.",
        shadowColor: "100, 130, 160"
    },
];

// ── ROV brand tokens (warm-earth / ember) ──
// Key names kept stable; values are the studio palette. `rose`/`gold` now
// hold the ember accent tones so existing references pick up the brand.
const T = {
    ground: "#0A0604",
    panel: "#1A120B",
    panelDeep: "#140C06",
    ink: "#FFF4E3",
    inkSoft: "rgba(255,244,227,0.74)",
    inkFaint: "rgba(255,244,227,0.5)",
    hair: "rgba(255,244,227,0.16)",
    rose: "#EA9A61", // ember accent — legible on the dark ground
    gold: "#B16937", // deeper ember, for secondary emphasis
    emberGrad: "linear-gradient(112deg, #EA9A61 6.46%, #B16937 34.96%, #A64D2B 63.88%, #42201C 97.63%)",
    grotesque: "'Norwige', 'Playfair Display', Georgia, serif", // display + names
    serif: "'Inter', 'Helvetica Neue', Arial, sans-serif", // body / bio
    mono: "'Inter', 'Helvetica Neue', Arial, sans-serif", // labels / roles
} as const;

// Unique people (the data carries duplicate entries for category grouping we no
// longer use), in a reading order that leads with the founders.
const PEOPLE = teamMembers.filter((m, i, arr) => arr.findIndex((t) => t.name === m.name) === i);

function Kicker({ children }: { children: React.ReactNode }) {
    return (
        <span style={{ display: "inline-flex", alignItems: "center", gap: 9 }}>
            <span aria-hidden style={{ width: 18, height: 2, background: T.emberGrad, flexShrink: 0 }} />
            <span style={{ fontFamily: T.mono, fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: T.rose }}>{children}</span>
        </span>
    );
}

function PersonTile({ m, onClick }: { m: TeamMember; onClick: () => void }) {
    return (
        <motion.button
            layout
            type="button"
            onClick={onClick}
            className="group relative block w-full overflow-hidden text-left"
            style={{ aspectRatio: "4 / 5", borderRadius: 14, border: `1px solid ${T.hair}`, background: T.panel }}
            aria-label={`Open ${m.name}'s bio`}
        >
            <Image
                src={m.image}
                alt={m.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                loading="lazy"
                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.06]"
            />
            <span aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 38%, rgba(10,6,4,0.4) 60%, rgba(10,6,4,0.95) 100%)" }} />
            <span style={{ position: "absolute", left: 16, right: 16, bottom: 15 }}>
                <span style={{ display: "block", fontFamily: T.grotesque, fontWeight: 700, fontSize: "clamp(16px,1.6vw,22px)", letterSpacing: "-0.01em", lineHeight: 1.06, color: T.ink }}>{m.name}</span>
                <span style={{ display: "block", marginTop: 5, fontFamily: T.mono, fontSize: 10, letterSpacing: "0.13em", textTransform: "uppercase", color: T.rose, lineHeight: 1.35 }}>{m.role}</span>
                <span aria-hidden className="block h-[2px] mt-2.5 w-6 transition-all duration-500 ease-out group-hover:w-14" style={{ background: T.emberGrad }} />
            </span>
        </motion.button>
    );
}

function ExpandedMemberView({ m, onClose }: { m: TeamMember; onClose: () => void }) {
    return (
        <motion.div
            key="expanded-view"
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: "auto", marginBottom: 40 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            className="w-full overflow-hidden"
        >
            <div style={{ position: "relative", borderRadius: 20, border: `1px solid ${T.hair}`, background: T.panelDeep, overflow: "hidden" }}>
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close bio"
                    className="absolute z-10 transition-opacity hover:opacity-70"
                    style={{ top: 18, right: 18, color: T.inkFaint }}
                >
                    <X className="w-6 h-6" />
                </button>

                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 p-6 md:p-10">
                    <div className="w-full lg:w-[38%] lg:shrink-0">
                        <div style={{ position: "relative", width: "100%", aspectRatio: "4 / 5", borderRadius: 14, overflow: "hidden", border: `1px solid ${T.hair}` }}>
                            <Image src={m.image} alt={m.name} fill sizes="(max-width: 1024px) 100vw, 38vw" className="object-cover" loading="lazy" />
                        </div>
                    </div>

                    <div className="flex-1 min-w-0">
                        <h3 style={{ fontFamily: T.grotesque, fontWeight: 700, fontSize: "clamp(30px,4.6vw,56px)", letterSpacing: "-0.02em", lineHeight: 1.0, color: T.ink, margin: 0 }}>{m.name}</h3>
                        <p style={{ fontFamily: T.mono, fontSize: 12, letterSpacing: "0.16em", textTransform: "uppercase", color: T.rose, margin: "12px 0 0" }}>{m.role} · {m.location}</p>

                        {m.specialties && (
                            <p style={{ fontFamily: T.serif, fontSize: "clamp(17px,1.9vw,22px)", lineHeight: 1.6, color: T.inkSoft, margin: "22px 0 0", maxWidth: 640 }}>{m.specialties}</p>
                        )}

                        {m.portfolioLink && (
                            <a
                                href={m.portfolioLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 transition-colors"
                                style={{ marginTop: 22, padding: "10px 20px", borderRadius: 999, border: `1px solid ${T.rose}`, color: T.ink, fontFamily: T.mono, fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase" }}
                                onMouseEnter={(e) => { e.currentTarget.style.background = T.emberGrad; e.currentTarget.style.borderColor = "transparent"; }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = T.rose; }}
                            >
                                View portfolio
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17l9.2-9.2M17 17V7H7" /></svg>
                            </a>
                        )}

                        <div style={{ marginTop: 26, paddingTop: 22, borderTop: `1px solid ${T.hair}` }}>
                            <Kicker>What I do</Kicker>
                            <div className="flex flex-wrap gap-2" style={{ marginTop: 14 }}>
                                {m.skills.map((s, i) => (
                                    <span key={i} style={{ fontFamily: T.mono, fontSize: 11, letterSpacing: "0.06em", color: T.inkSoft, border: `1px solid ${T.hair}`, borderRadius: 999, padding: "5px 12px" }}>{s}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

const TeamSection: React.FC = () => {
    const [expandedId, setExpandedId] = useState<number | null>(null);
    const expanded = PEOPLE.find((m) => m.id === expandedId) ?? null;

    return (
        <>
            <div id="team-members" style={{ marginTop: "-160px", paddingTop: "160px", pointerEvents: "none" }} />
            <section id="team" style={{ background: "transparent", padding: "clamp(8px,2vw,24px) 0 clamp(48px,7vw,96px)" }}>
                <div className="max-w-6xl mx-auto px-6">
                    <div style={{ marginBottom: "clamp(24px,4vw,40px)" }}>
                        <Kicker>The studio · {PEOPLE.length} people</Kicker>
                    </div>

                    <AnimatePresence mode="wait">
                        {expanded && <ExpandedMemberView key={expanded.id} m={expanded} onClose={() => setExpandedId(null)} />}
                    </AnimatePresence>

                    <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                        {PEOPLE.filter((m) => m.id !== expandedId).map((m) => (
                            <PersonTile key={m.id} m={m} onClick={() => setExpandedId(m.id)} />
                        ))}
                    </motion.div>
                </div>
            </section>
        </>
    );
};

export default TeamSection;
