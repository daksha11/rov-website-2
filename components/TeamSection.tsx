"use client";

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

type Category = "All" | "Creative" | "Tech" | "Systems";

interface TeamMember {
    id: number;
    image: string;
    category: Category;
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
        image: "/teammembers/basutm.png",
        category: "Creative",
        name: "Basu",
        role: "FOUNDER & CREATIVE DIRECTOR",
        skills: ["Creative Direction", "Brand Strategy", "Web Development", "Design Systems", "Client Relations"],
        location: "Atlanta",
        specialties: "Leads creative direction across all client projects and internal initiatives while overseeing company operations. Contributes hands-on to design, development, and client communications, ensuring R.O.V.'s vision stays consistent from pitch to delivery.",
        shadowColor: "101, 67, 33"
    },
    {
        id: 2,
        image: "/teammembers/jahnavitm.png",
        category: "Creative",
        name: "Jahnavi",
        role: "HEAD OF DESIGN",
        skills: ["UI/UX Design", "Brand Identity", "Design Systems", "Illustration", "Visual Design", "Prototyping"],
        location: "India",
        specialties: "Masters every design discipline—from UI/UX and visual systems to custom illustration and brand identity. Creates cohesive, polished design solutions across all touchpoints, ensuring R.O.V.'s work is as functional as it is beautiful.",
        shadowColor: "150, 100, 120"
    },
    {
        id: 3,
        image: "/teammembers/vaishnavitm.png?v=3",
        category: "Creative",
        name: "Vaishnavi",
        role: "CREATIVE DIRECTOR & VIDEO STRATEGIST",
        skills: ["Video Creative Direction", "Visual Storytelling", "Campaign Strategy", "Motion Design"],
        location: "Atlanta",
        specialties: "I help brands tell stories that stick—through motion, narrative structure, and campaign-level thinking. Whether it's directing video concepts or modeling creative strategies, I make sure every decision connects back to what the brand needs to say and how people should feel it.",
        shadowColor: "180, 120, 90"
    },
    {
        id: 4,
        image: "/teammembers/tanvitm.png",
        category: "Creative",
        name: "Tanvi",
        role: "DESIGN & SOCIAL MEDIA STRATEGIST",
        skills: ["Social Media Design", "UI/UX", "Content Strategy", "Creative Ideation", "Campaign Visuals"],
        location: "India",
        specialties: "Drives social media design and visual content strategy while playing a key role in ideating and brainstorming direction for new projects. Brings fresh UI/UX perspectives and ensures digital touchpoints feel modern and engaging.",
        shadowColor: "140, 110, 140"
    },
    {
        id: 5,
        image: "/teammembers/chamantm.png",
        category: "Creative",
        name: "Chaman",
        role: "VIDEO EDITOR & MOTION DESIGNER",
        skills: ["Video Editing", "Motion Graphics", "After Effects Design", "Creative Concepting", "Rapid Turnaround Production"],
        location: "India",
        specialties: "Expert video editor who brings fresh creative ideas and fast execution to R.O.V.'s edits and media production. Specializes in After Effects wizardry and communicates seamlessly to turn concepts into polished, dynamic visuals on tight timelines.",
        shadowColor: "200, 100, 50"
    },
    {
        id: 6,
        image: "/teammembers/davidtm.png",
        category: "Creative",
        name: "David",
        role: "3D CREATIVE DIRECTOR",
        skills: ["3D Product Visualization", "Custom Texturing", "Modeling", "Lighting & Rendering", "Creative Direction"],
        location: "USA",
        specialties: "Creates sophisticated, photorealistic 3D product visualizations using advanced Blender techniques. Specializes in custom texturing, modeling, and lighting that bring digital assets to life with cinematic quality.",
        shadowColor: "100, 150, 200"
    },
    {
        id: 7,
        image: "/teammembers/dakshatm.png",
        category: "Tech",
        name: "Daksha",
        role: "HEAD OF DEVELOPMENT",
        skills: ["Full-Stack Development", "Technical Architecture", "Complex Problem Solving", "Performance Optimization", "Code Standards"],
        location: "India",
        specialties: "R.O.V.'s go-to technical lead for complex coding challenges and scalable solutions. Solves the toughest tech problems, architects robust systems, and ensures every build is performant, maintainable, and production-ready.",
        shadowColor: "90, 120, 150"
    },
    {
        id: 8,
        image: "/teammembers/jasnoortm.png",
        category: "Tech",
        name: "Jasnoor",
        role: "DEVELOPER & FRONTEND SPECIALIST",
        skills: ["Frontend Development", "Creative Problem Solving", "UI Implementation", "Interactive Features", "Component Development"],
        location: "Atlanta",
        specialties: "Assists with coding across projects while solving complex technical problems and creating innovative frontend solutions. Brings creative thinking to development, finding elegant ways to implement ambitious design ideas.",
        shadowColor: "120, 140, 100"
    },
    {
        id: 9,
        image: "/teammembers/basutm.png",
        category: "Tech",
        name: "Basu",
        role: "FOUNDER & CREATIVE DIRECTOR",
        skills: ["Creative Direction", "Brand Strategy", "Web Development", "Design Systems", "Client Relations"],
        location: "Atlanta",
        specialties: "Leads creative direction across all client projects and internal initiatives while overseeing company operations.",
    },
    {
        id: 10,
        image: "/teammembers/suchettm.png",
        category: "Tech",
        name: "Suchet",
        role: "CO-FOUNDER & SYSTEMS ARCHITECT",
        skills: ["Operations Strategy", "AI Systems Development", "Financial Management", "Sales & Client Relations", "Process Automation"],
        location: "Atlanta",
        specialties: "Joined as co-founder to build the operational backbone of R.O.V.",
    },
    {
        id: 12,
        image: "/teammembers/suchettm.png",
        category: "Systems",
        name: "Suchet",
        role: "CO-FOUNDER & SYSTEMS ARCHITECT",
        skills: ["Operations Strategy", "AI Systems Development", "Financial Management", "Sales & Client Relations", "Process Automation"],
        location: "Atlanta",
        specialties: "Joined as co-founder to build the operational backbone of R.O.V.",
    },
    {
        id: 11,
        image: "/teammembers/dakshatm.png",
        category: "Systems",
        name: "Daksha",
        role: "HEAD OF DEVELOPMENT",
        skills: ["Full-Stack Development", "Technical Architecture", "Complex Problem Solving", "Performance Optimization", "Code Standards"],
        location: "India",
        specialties: "R.O.V.'s go-to technical lead for complex coding challenges.",
    },
    {
        id: 13,
        image: "/teammembers/kavyatm.png",
        category: "Creative",
        name: "Kavya",
        role: "UI/UX DESIGNER & DESIGN SYSTEMS SPECIALIST",
        skills: ["UI/UX Design", "Design Systems", "Web Design", "Design Infrastructure", "Brand Guidelines", "Design Standards"],
        location: "Atlanta",
        portfolioLink: "https://www.kavyaray.com/",
        specialties: "SCAD-trained designer who brings enterprise-level design rigor from work with major brands like Porsche, Lowe's, and UBS.",
        shadowColor: "100, 100, 100"
    },
    {
        id: 14,
        image: "/teammembers/jinwontm.png",
        category: "Creative",
        name: "Jiwon",
        role: "UI/UX DESIGNER & ILLUSTRATOR",
        skills: ["UI/UX Design", "Design Strategy", "Illustration", "Interface Design", "User Experience", "Visual Design Systems"],
        location: "Savannah",
        specialties: "SCAD-trained design talent based in Savannah with exceptional vision for overall design strategy.",
        shadowColor: "130, 100, 160"
    },
];

const categories: Category[] = ["Creative", "Tech", "Systems"];

const TeamSection: React.FC = () => {
    const [activeCategory, setActiveCategory] = useState<Category>("All");
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
                <img
                    src={src}
                    alt={alt}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'center center',
                        display: 'block',
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

    // Fixed CategorySection definition to accept props correctly
    const CategorySection = ({ category, members }: { category: Category, members: TeamMember[] }) => {
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
                    {expandedMember && (
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
                                    <img src={expandedMember.image} className="w-full h-full object-cover opacity-20 blur-sm" alt="" />
                                    <div className="absolute inset-0 bg-black/60" />
                                </div>

                                <div className="relative z-10">
                                    <div className="flex flex-col lg:flex-row gap-12">
                                        <div className="w-full lg:w-1/3">
                                            <img src={expandedMember.image} className="w-full aspect-[4/5] object-cover rounded-2xl shadow-2xl" alt={expandedMember.name} />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-sink text-[clamp(2.5rem,5vw,4rem)] font-black text-[#F7F2E4] uppercase leading-none mb-4">
                                                {expandedMember.name}
                                            </h3>
                                            <p className="font-norwige text-sm tracking-[0.2em] uppercase text-[#DAA520] mb-8">
                                                {expandedMember.role} • {expandedMember.location}
                                            </p>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                {expandedMember.specialties && (
                                                    <div>
                                                        <h4 className="font-sink text-lg font-black uppercase text-[#F7F2E4] mb-4">Specialties</h4>
                                                        <p className="font-norwige text-sm text-[#F7F2E4]/80 leading-relaxed">{expandedMember.specialties}</p>
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
                                                    <h4 className="font-sink text-lg font-black uppercase text-[#F7F2E4] mb-4">Skills</h4>
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
                    )}
                </AnimatePresence>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {gridMembers.map((member) => (
                        <motion.div
                            layout
                            key={member.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="relative h-[300px] rounded-2xl overflow-hidden cursor-pointer group border border-white/10"
                            onClick={() => setExpandedMemberId(member.id)}
                        >
                            <img src={member.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={member.name} />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                            <div className="absolute bottom-6 left-6 right-6">
                                <h4 className="font-sink text-2xl font-black text-white uppercase">{member.name}</h4>
                                <p className="font-norwige text-[10px] tracking-[0.2em] text-[#DAA520] uppercase">{member.role}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        );
    };

    return (
        <section
            style={{
                borderRadius: "20px",
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                minHeight: "100vh", padding: "40px 0", position: "relative",
                display: "flex", flexDirection: "column", alignItems: "center",
                overflow: "hidden",
            }}
        >
            {/* Top Left Gradient Blob */}
            {/* Top Left Gradient Blob */}
            <div
                className="absolute top-0 left-0 rounded-full pointer-events-none z-0 blob-gradient"
                style={{
                    transform: 'translate(-30%, -30%)'
                }}
            />
            {/* Bottom Right Gradient Blob */}
            <div
                className="absolute bottom-0 right-0 rounded-full pointer-events-none z-0 blob-gradient"
                style={{
                    transform: 'translate(30%, 30%)'
                }}
            />
            <div className="z-50 mb-8 md:mb-12 flex flex-wrap items-center gap-2 md:gap-6 justify-center md:justify-end w-full px-2 md:px-8">
                <button
                    onClick={() => { setActiveCategory("All"); setExpandedMemberId(null); }}
                    className={`text-sm md:text-xl font-normal transition-all duration-300 ${activeCategory === "All" ? "text-white" : "text-white/50 hover:text-white/80"}`}
                    style={{ fontFamily: 'Roboto, sans-serif' }}
                > ALL </button>
                <span className="text-white/30 text-xs md:text-base">|</span>
                {categories.map((cat, index) => (
                    <React.Fragment key={cat}>
                        <button
                            onClick={() => { setActiveCategory(cat); setExpandedMemberId(null); }}
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
                                {[...Array(4)].map((_, i) => (
                                    <React.Fragment key={`r1-${i}`}>
                                        <div className="text-block"><h2>MEET</h2></div>
                                        <ImageCard src={teamMembers[0].image} alt="Basu" name={teamMembers[0].name} role={teamMembers[0].role} onClick={() => handleMarqueeMemberClick(teamMembers[0])} />
                                        <ImageCard src={teamMembers[9].image} alt="Suchet" name={teamMembers[9].name} role={teamMembers[9].role} onClick={() => handleMarqueeMemberClick(teamMembers[9])} />
                                        <button className="category-button" onClick={() => setActiveCategory("Creative")}>CREATIVE</button>
                                        <ImageCard src={teamMembers[6].image} alt="Daksha" name={teamMembers[6].name} role={teamMembers[6].role} onClick={() => handleMarqueeMemberClick(teamMembers[6])} />
                                        <ImageCard src={teamMembers[1].image} alt="Jahnavi" name={teamMembers[1].name} role={teamMembers[1].role} onClick={() => handleMarqueeMemberClick(teamMembers[1])} />
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>

                        <div className="marquee-row">
                            <div className="marquee-track scroll-right">
                                {[...Array(4)].map((_, i) => (
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
                                {[...Array(4)].map((_, i) => (
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

                .blob-gradient {
                    width: 400px;
                    height: 400px;
                    background: rgba(96, 62, 37, 0.30);
                    filter: blur(60px);
                }
                @media (min-width: 768px) {
                    .blob-gradient {
                        width: 600px;
                        height: 600px;
                        background: rgba(96, 62, 37, 0.45);
                        filter: blur(150px);
                    }
                }
            `}</style>
        </section>
    );
};

export default TeamSection;