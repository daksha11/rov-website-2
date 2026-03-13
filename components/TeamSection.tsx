"use client";

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Image from "next/image";
import GradientBlob from "./GradientBlob";

type Category = "All" | "Creative" | "Tech" | "Systems";
type CreativeSubcategory = "UI/UX" | "Motion" | "Illustrative";

interface TeamMember {
    id: number;
    image: string;
    category: Category;
    creativeSubcategory?: CreativeSubcategory;
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
        name: "Ayush",
        role: "FOUNDER & CREATIVE DIRECTOR",
        skills: ["Creative Direction", "Brand Strategy", "Web Development", "Design Systems", "Client Relations"],
        location: "Atlanta",
        specialties: "I lead creative direction across all client projects and internal initiatives while overseeing company operations. I contribute hands-on to design, development, and client communications—making sure R.O.V.'s vision stays consistent from pitch to delivery.",
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
        specialties: "I'm ROV Studios' Director of Design — a SCAD-trained UI/UX designer and design systems specialist with enterprise-level experience from brands like Porsche, Lowe's, and UBS. Based in Atlanta, I lead the design team end-to-end: from delegating creative tasks and setting design standards to managing client relationships and delivering polished, system-driven work at every touchpoint.",
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
        specialties: "I help brands tell stories that stick—through motion, narrative structure, and campaign-level thinking. Whether it's directing video concepts or modeling creative strategies, I make sure every decision connects back to what the brand needs to say and how people should feel it.",
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
    {
        id: 8,
        image: "/teammembers/jasnoortm.webp",
        category: "Tech",
        name: "Jasnoor",
        role: "DEVELOPER & FRONTEND SPECIALIST",
        skills: ["Frontend Development", "Creative Problem Solving", "UI Implementation", "Interactive Features", "Component Development"],
        location: "Atlanta",
        specialties: "I work across projects solving complex technical problems and building innovative frontend solutions. I bring creative thinking to development—always looking for elegant ways to turn ambitious design ideas into reality.",
        shadowColor: "120, 140, 100"
    },
    {
        id: 9,
        image: "/teammembers/basutm2.webp",
        category: "Tech",
        name: "Ayush",
        role: "FOUNDER & CREATIVE DIRECTOR",
        skills: ["Creative Direction", "Brand Strategy", "Web Development", "Design Systems", "Client Relations"],
        location: "Atlanta",
        specialties: "I lead creative direction across all client projects and internal initiatives while overseeing company operations. I contribute hands-on to design, development, and client communications—making sure R.O.V.'s vision stays consistent from pitch to delivery.",
    },
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
        id: 2,
        image: "/teammembers/jahnavitm.webp",
        category: "Creative",
        creativeSubcategory: "Illustrative",
        name: "Jahnavi",
        role: "DESIGN ASSISTANT",
        skills: ["UI/UX Design", "Brand Identity", "Design Systems", "Illustration", "Visual Design", "Prototyping"],
        location: "India",
        specialties: "I master every design discipline—from UI/UX and visual systems to custom illustration and brand identity. I create cohesive, polished design solutions across all touchpoints, making sure R.O.V.'s work is as functional as it is beautiful.",
        shadowColor: "150, 100, 120"
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
        specialties: "I bring fresh creative ideas and fast execution to R.O.V.'s edits and media production. Whether it's complex motion work or quick-turn content, I specialize in After Effects wizardry and turn concepts into polished, dynamic visuals—even on tight timelines.",
        shadowColor: "200, 100, 50"
    },
    {
        id: 15,
        image: "/teammembers/samtm.webp",
        category: "Creative",
        name: "Sam Suen",
        role: "HEAD OF ARTIST DEVELOPMENT",
        skills: ["Artist Development", "Creative Strategy", "Talent Management", "Music Industry Relations", "Brand Building"],
        location: "Atlanta",
        specialties: "I lead artist development initiatives, guiding emerging talent through creative growth and strategic brand positioning in the music industry.",
        shadowColor: "140, 90, 110"
    },
    {
        id: 16,
        image: "/teammembers/anishtm2.png",
        category: "Creative",
        creativeSubcategory: "UI/UX",
        name: "Anish Goel",
        role: "WEB & GRAPHIC DESIGNER",
        skills: ["Web Design", "Graphic Design", "Visual Communication", "Brand Collateral Design", "Design Strategy"],
        location: "Savannah, Georgia",
        specialties: "Bridges creativity and clarity through thoughtful web and graphic design. Translates R.O.V.'s ideas into compelling visual communication, ensuring concepts are expressed with precision, polish, and purpose across digital and branded touchpoints.",
        shadowColor: "150, 120, 90"
    },
];

const categories: Category[] = ["Creative", "Tech", "Systems"];
const creativeSubcategories: CreativeSubcategory[] = ["UI/UX", "Motion", "Illustrative"];

const TeamSection: React.FC = () => {
    const [activeCategory, setActiveCategory] = useState<Category>("All");
    const [activeCreativeSub, setActiveCreativeSub] = useState<CreativeSubcategory | "All">("All");
    const [expandedMemberId, setExpandedMemberId] = useState<number | null>(null);

    const handleMarqueeMemberClick = (member: TeamMember) => {
        setExpandedMemberId(member.id);
    };

    const ImageCard = useCallback(({ src, alt, onClick, name, role, rotation = 0 }: { src: string; alt: string, onClick?: () => void, name?: string, role?: string, rotation?: number }) => {
        const [isHovered, setIsHovered] = useState(false);

        return (
            <motion.div
                className="image-card md:w-[450px] md:h-[253px] w-[240px] h-[135px] rounded-[10px] overflow-hidden shrink-0 relative cursor-pointer"
                onClick={onClick}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <Image
                    src={src}
                    alt={alt}
                    fill
                    sizes="(max-width: 768px) 240px, 450px"
                    loading="lazy"
                    className="object-cover object-center"
                    style={{
                        transform: rotation !== 0 ? `rotate(${rotation}deg)` : undefined
                    }}
                />
                <AnimatePresence>
                    {name && isHovered && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            style={{
                                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                                background: 'linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 100%)',
                                backdropFilter: 'blur(4px)', display: 'flex', flexDirection: 'column',
                                alignItems: 'center', justifyContent: 'center', gap: '10px', zIndex: 10
                            }}
                        >
                            <h3 className="text-[clamp(2.5rem,5vw,3.5rem)] font-black text-white uppercase tracking-widest m-0" style={{ fontFamily: 'Norwige, sans-serif' }}>
                                {name}
                            </h3>
                            {role && (
                                <p className="text-[clamp(0.8rem,1.5vw,1rem)] font-normal text-white/90 uppercase tracking-widest m-0" style={{ fontFamily: 'Roboto, sans-serif' }}>
                                    {role}
                                </p>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        );
    }, []);

    const filteredMembers = activeCategory === "All" ? teamMembers : teamMembers.filter(m => m.category === activeCategory);

    const ExpandedMemberView = ({ expandedMember }: { expandedMember: TeamMember }) => (
        <motion.div
            key="expanded-view"
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: 'auto', marginBottom: 48 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            className="w-full"
        >
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-white/10 to-white/5 p-8 border border-white/20"
                style={{ boxShadow: `0 25px 50px -12px rgba(${expandedMember.shadowColor || '101, 67, 33'}, 0.5)` }}>

                <button
                    onClick={() => setExpandedMemberId(null)}
                    className="absolute top-6 right-6 z-20 text-white/60 hover:text-white transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>

                <div className="absolute inset-0 z-0">
                    <Image src={expandedMember.image} alt={`${expandedMember.name} - ${expandedMember.role}`} fill sizes="100vw" className="object-cover opacity-20 blur-sm" loading="lazy" />
                    <div className="absolute inset-0 bg-black/60" />
                </div>

                <div className="relative z-10">
                    <div className="flex flex-col lg:flex-row gap-12">
                        <div className="w-full lg:w-1/3">
                            <div className="relative w-full aspect-[4/5]">
                                <Image src={expandedMember.image} alt={expandedMember.name} fill sizes="(max-width: 1024px) 100vw, 33vw" className="object-cover rounded-2xl shadow-2xl" loading="lazy" />
                            </div>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-[clamp(2.5rem,5vw,4rem)] font-black text-[#F7F2E4] uppercase leading-none mb-4" style={{ fontFamily: 'Norwige, sans-serif' }}>
                                {expandedMember.name}
                            </h3>
                            <p className="text-sm tracking-[0.2em] uppercase text-[#DAA520] mb-8" style={{ fontFamily: 'Roboto, sans-serif' }}>
                                {expandedMember.role} • {expandedMember.location}
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {expandedMember.specialties && (
                                    <div>
                                        <h4 className="text-lg font-black uppercase text-[#F7F2E4] mb-4" style={{ fontFamily: 'Norwige, sans-serif' }}>Specialties</h4>
                                        <p className="text-sm text-[#F7F2E4]/80 leading-relaxed" style={{ fontFamily: 'Roboto, sans-serif' }}>{expandedMember.specialties}</p>
                                        {expandedMember.portfolioLink && (
                                            <a
                                                href={expandedMember.portfolioLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-white text-xs font-bold uppercase tracking-widest transition-all hover:scale-105"
                                            >
                                                View Portfolio
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17l9.2-9.2M17 17V7H7" /></svg>
                                            </a>
                                        )}
                                    </div>
                                )}
                                <div>
                                    <h4 className="text-lg font-black uppercase text-[#F7F2E4] mb-4" style={{ fontFamily: 'Norwige, sans-serif' }}>Skills</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {expandedMember.skills.map((s, i) => (
                                            <span key={i} className="px-3 py-1 bg-white/10 border border-white/10 rounded-full text-[10px] text-white uppercase tracking-widest">{s}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );

    const MemberGrid = ({ members }: { members: TeamMember[] }) => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {members.map((member) => (
                <motion.div
                    layout
                    key={member.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="relative h-[300px] rounded-2xl overflow-hidden cursor-pointer group border border-white/10"
                    onClick={() => setExpandedMemberId(member.id)}
                >
                    <Image src={member.image} alt={member.name} fill sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6">
                        <h4 className="text-2xl font-black text-white uppercase" style={{ fontFamily: 'Norwige, sans-serif' }}>{member.name}</h4>
                        <p className="text-[10px] tracking-[0.2em] text-[#DAA520] uppercase" style={{ fontFamily: 'Roboto, sans-serif' }}>{member.role}</p>
                    </div>
                </motion.div>
            ))}
        </div>
    );

    const CategorySection = ({ members }: { category: Category, members: TeamMember[] }) => {
        const expandedMember = members.find(m => m.id === expandedMemberId);
        const gridMembers = members.filter(m => m.id !== expandedMemberId);

        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="w-full max-w-7xl mx-auto px-4"
            >
                <AnimatePresence mode="wait">
                    {expandedMember && <ExpandedMemberView expandedMember={expandedMember} />}
                </AnimatePresence>
                <MemberGrid members={gridMembers} />
            </motion.div>
        );
    };

    const CreativeSection = ({ members }: { members: TeamMember[] }) => {
        const expandedMember = members.find(m => m.id === expandedMemberId);
        // Leadership members (no subcategory — Ayush, Sam)
        const leadershipMembers = members.filter(m => !m.creativeSubcategory && m.id !== expandedMemberId);

        // Get members for the active sub-filter
        const getSubMembers = () => {
            if (activeCreativeSub === "All") {
                return members.filter(m => m.creativeSubcategory && m.id !== expandedMemberId);
            }
            return members.filter(m => m.creativeSubcategory === activeCreativeSub && m.id !== expandedMemberId);
        };

        const subMembers = getSubMembers();

        // Group by subcategory for "All" view
        const groupedBySubcategory = activeCreativeSub === "All"
            ? creativeSubcategories.map(sub => ({
                label: sub,
                members: members.filter(m => m.creativeSubcategory === sub && m.id !== expandedMemberId),
            })).filter(g => g.members.length > 0)
            : [];

        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="w-full max-w-7xl mx-auto px-4"
            >
                {/* Sub-filter pills */}
                <div className="flex items-center gap-3 mb-8 justify-center flex-wrap">
                    {(["All", ...creativeSubcategories] as const).map((sub) => (
                        <button
                            key={sub}
                            onClick={() => { setActiveCreativeSub(sub); setExpandedMemberId(null); }}
                            className={`px-4 py-1.5 rounded-full text-xs uppercase tracking-[0.15em] border transition-all duration-300 ${
                                activeCreativeSub === sub
                                    ? "bg-white/15 border-white/30 text-white"
                                    : "bg-transparent border-white/10 text-white/40 hover:text-white/70 hover:border-white/20"
                            }`}
                            style={{ fontFamily: 'Roboto, sans-serif' }}
                        >
                            {sub}
                        </button>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    {expandedMember && <ExpandedMemberView expandedMember={expandedMember} />}
                </AnimatePresence>

                {/* Leadership row — always visible */}
                {leadershipMembers.length > 0 && (
                    <div className="mb-10">
                        <h3 className="text-xs tracking-[0.3em] uppercase text-white/30 mb-4 pl-1" style={{ fontFamily: 'Roboto, sans-serif' }}>
                            Creative Direction
                        </h3>
                        <MemberGrid members={leadershipMembers} />
                    </div>
                )}

                {/* Grouped view when "All" sub is active */}
                {activeCreativeSub === "All" ? (
                    groupedBySubcategory.map((group) => (
                        <div key={group.label} className="mb-10">
                            <h3 className="text-xs tracking-[0.3em] uppercase text-white/30 mb-4 pl-1" style={{ fontFamily: 'Roboto, sans-serif' }}>
                                {group.label}
                            </h3>
                            <MemberGrid members={group.members} />
                        </div>
                    ))
                ) : (
                    <MemberGrid members={subMembers} />
                )}
            </motion.div>
        );
    };

    return (
        <>
        <div id="team-members" style={{ marginTop: '-200px', paddingTop: '200px', pointerEvents: 'none' }} />
        <section
            id="team"
            style={{
                borderRadius: "20px",
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                minHeight: "100vh", padding: "40px 0", position: "relative",
                display: "flex", flexDirection: "column", alignItems: "center",
                overflow: "hidden"
            }}
        >
            <GradientBlob position="top-left" opacity={0.45} size="600px" blur="150px" />
            <GradientBlob position="bottom-right" opacity={0.45} size="600px" blur="150px" />
            <div className="z-50 mb-8 md:mb-12 flex flex-wrap items-center gap-2 md:gap-6 justify-center md:justify-end w-full px-2 md:px-8">
                <button
                    onClick={() => { setActiveCategory("All"); setActiveCreativeSub("All"); setExpandedMemberId(null); }}
                    className={`text-sm md:text-xl font-normal transition-all duration-300 ${activeCategory === "All" ? "text-white" : "text-white/50 hover:text-white/80"}`}
                    style={{ fontFamily: 'Roboto, sans-serif' }}
                > ALL </button>
                <span className="text-white/30 text-xs md:text-base">|</span>
                {categories.map((cat, index) => (
                    <React.Fragment key={cat}>
                        <button
                            onClick={() => { setActiveCategory(cat); setActiveCreativeSub("All"); setExpandedMemberId(null); }}
                            className={`text-sm md:text-xl font-normal transition-all duration-300 ${activeCategory === cat ? "text-white" : "text-white/50 hover:text-white/80"}`}
                            style={{ fontFamily: 'Roboto, sans-serif' }}
                        > {cat.toUpperCase()} </button>
                        {index < categories.length - 1 && <span className="text-white/30 text-xs md:text-base">|</span>}
                    </React.Fragment>
                ))}
            </div>

            <div className="w-full flex-1 flex items-center justify-center">
                {activeCategory === "All" && !expandedMemberId ? (
                    <motion.div key="marquee" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full">
                        <div className="marquee-row">
                            <div className="marquee-track scroll-left">
                                {[...Array(2)].map((_, i) => (
                                    <React.Fragment key={`r1-${i}`}>
                                        <div className="text-block"><h2>MEET</h2></div>
                                        <ImageCard src={teamMembers[0].image} alt="Ayush" name={teamMembers[0].name} role={teamMembers[0].role} onClick={() => handleMarqueeMemberClick(teamMembers[0])} />
                                        <ImageCard src={teamMembers[9].image} alt="Suchet" name={teamMembers[9].name} role={teamMembers[9].role} onClick={() => handleMarqueeMemberClick(teamMembers[9])} />
                                        <button className="category-button" onClick={() => setActiveCategory("Creative")}>CREATIVE</button>
                                        <ImageCard src={teamMembers[6].image} alt="Daksha" name={teamMembers[6].name} role={teamMembers[6].role} onClick={() => handleMarqueeMemberClick(teamMembers[6])} />
                                        <ImageCard src={teamMembers[1].image} alt="Kavya" name={teamMembers[1].name} role={teamMembers[1].role} onClick={() => handleMarqueeMemberClick(teamMembers[1])} />
                                        <ImageCard src={teamMembers[14].image} alt="Anish" name={teamMembers[14].name} role={teamMembers[14].role} onClick={() => handleMarqueeMemberClick(teamMembers[14])} />
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>

                        <div className="marquee-row">
                            <div className="marquee-track scroll-right">
                                {[...Array(2)].map((_, i) => (
                                    <React.Fragment key={`r2-${i}`}>
                                        <button className="category-button" onClick={() => setActiveCategory("Tech")}>TECH</button>
                                        <ImageCard src={teamMembers[12].image} alt="Kavya" name={teamMembers[12].name} role={teamMembers[12].role} onClick={() => handleMarqueeMemberClick(teamMembers[12])} />
                                        <ImageCard src={teamMembers[13].image} alt="Jiwon" name={teamMembers[13].name} role={teamMembers[13].role} onClick={() => handleMarqueeMemberClick(teamMembers[13])} />
                                        <div className="text-block"><h2>THE</h2></div>
                                        <ImageCard src={teamMembers[2].image} alt="Vaishnavi" name={teamMembers[2].name} role={teamMembers[2].role} onClick={() => handleMarqueeMemberClick(teamMembers[2])} />
                                        <ImageCard src={teamMembers[3].image} alt="Tanvi" name={teamMembers[3].name} role={teamMembers[3].role} onClick={() => handleMarqueeMemberClick(teamMembers[3])} />
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>

                        <div className="marquee-row">
                            <div className="marquee-track scroll-left">
                                {[...Array(2)].map((_, i) => (
                                    <React.Fragment key={`r3-${i}`}>
                                        <ImageCard src={teamMembers[5].image} alt="David" name={teamMembers[5].name} role={teamMembers[5].role} onClick={() => handleMarqueeMemberClick(teamMembers[5])} />
                                        <ImageCard src={teamMembers[4].image} alt="Chaman" name={teamMembers[4].name} role={teamMembers[4].role} onClick={() => handleMarqueeMemberClick(teamMembers[4])} rotation={teamMembers[4].imageRotation} />
                                        <div className="text-block"><h2>TEAM</h2></div>
                                        <ImageCard src={teamMembers[7].image} alt="Jasnoor" name={teamMembers[7].name} role={teamMembers[7].role} onClick={() => handleMarqueeMemberClick(teamMembers[7])} />
                                        <ImageCard src={teamMembers[10].image} alt="Suchet" name={teamMembers[10].name} role={teamMembers[10].role} onClick={() => handleMarqueeMemberClick(teamMembers[10])} />
                                        <button className="category-button" onClick={() => setActiveCategory("Systems")}>SYSTEMS</button>
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                ) : activeCategory === "Creative" ? (
                    <CreativeSection members={filteredMembers} />
                ) : (
                    <CategorySection category={activeCategory} members={filteredMembers} />
                )}
            </div>

            <style jsx>{`
                .marquee-row { display: flex; overflow: hidden; width: 100%; margin-bottom: 60px; mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent); -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent); }
                .marquee-track { display: flex; align-items: center; gap: 20px; width: max-content; padding-right: 20px; }
                .scroll-left { animation: scrollLeft 60s linear infinite; }
                .scroll-right { animation: scrollRight 60s linear infinite; }
                .text-block { padding: 0 40px; }
                h2 { font-family: 'Roboto', sans-serif; font-size: clamp(2rem, 5vw, 4.5rem); font-weight: 400; color: #F7F2E4; letter-spacing: 0.05em; white-space: nowrap; }
                .category-button { writing-mode: vertical-rl; text-orientation: mixed; background: #3B2114; color: #FFF4E3; padding: 40px 35px; border-radius: 10px; border: none; font-size: clamp(1rem, 2.5vw, 1.8rem); font-weight: 400; font-family: 'Roboto', sans-serif; transition: all 0.3s ease; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2); white-space: nowrap; height: 253px; display: flex; align-items: center; justify-content: center; letter-spacing: 0.1em; }
                @keyframes scrollLeft { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
                @keyframes scrollRight { 0% { transform: translateX(-50%); } 100% { transform: translateX(0); } }
                @media (max-width: 768px) { .image-card { width: 240px !important; height: 135px !important; } .category-button { height: 135px; padding: 20px 10px; } }
            `}</style>
        </section>
        </>
    );
};

export default TeamSection;