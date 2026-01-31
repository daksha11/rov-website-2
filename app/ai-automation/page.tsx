"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { NavigationDock } from '@/components/NavDoc';
import Footer from '@/components/Footer';
import OurApproachSection from '@/components/Web-Dev/OurApproachSection';
import FAQBottomSection from '@/components/Web-Dev/FAQBottomSection';
import ProjectStrip from '@/components/ProjectStrip';

export default function AIAutomationPage() {
    return (
        <div style={{
            minHeight: '100vh',
            background: '#000000',
            position: 'relative',
            overflow: 'hidden',
        }}>
            {/* Light Splashes */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: `
                    radial-gradient(ellipse 1200px 1200px at 20% 25%, rgba(234, 154, 97, 0.3) 0%, transparent 50%),
                    radial-gradient(ellipse 1200px 1200px at 80% 50%, rgba(177, 105, 55, 0.25) 0%, transparent 50%)
                `,
                pointerEvents: 'none',
                zIndex: 1,
            }}></div>

            {/* Grainy Overlay */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.15'/%3E%3C/svg%3E")`,
                opacity: 0.6,
                pointerEvents: 'none',
                zIndex: 2,
            }}></div>

            {/* Hero Section */}
            <section style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'flex-end',
                position: 'relative',
                zIndex: 3,
                justifyContent: 'space-between',
                padding: '0 8% 8% 8%',
                gap: '80px',
            }}
                className="flex-col md:flex-row gap-8 md:gap-20 p-4 md:p-8 pb-12 md:pb-16"
            >
                {/* Left Side - Main Heading and CTA */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    style={{
                        flex: 1,
                        maxWidth: '650px',
                    }}
                    className="w-full md:max-w-[650px]"
                >
                    <h1 style={{
                        fontFamily: 'Norwige, sans-serif',
                        fontSize: 'clamp(2rem, 8vw, 7rem)',
                        fontWeight: '900',
                        color: 'white',
                        lineHeight: '1.1',
                        marginBottom: '40px',
                        letterSpacing: '0.02em',
                        textShadow: '0 0 20px rgba(255, 255, 255, 0.3)',
                    }}
                        className="text-left mb-6 md:mb-10"
                    >
                        AI SOLUTIONS THAT DRIVE YOUR{' '}
                        <span style={{
                            display: 'block',
                            fontSize: 'clamp(2.5rem, 9vw, 8rem)',
                            marginTop: '20px',
                            animation: 'glowPulse 6s ease-in-out infinite',
                        }}>
                            BUSINESS FORWARD
                        </span>

                        <style jsx>{`
                            @keyframes glowPulse {
                                0%, 100% {
                                    text-shadow: 
                                        0 0 5px rgba(255, 255, 255, 0.2),
                                        0 0 10px rgba(255, 255, 255, 0.1);
                                }
                                40%, 60% {
                                    text-shadow: 
                                        0 0 10px rgba(255, 255, 255, 0.8),
                                        0 0 20px rgba(255, 255, 255, 0.6),
                                        0 0 40px rgba(255, 255, 255, 0.4),
                                        0 0 60px rgba(255, 255, 255, 0.3);
                                }
                            }
                        `}</style>
                    </h1>

                    <Link href="https://calendly.com/rangeofviewmusic/30min" target="_blank">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="project-button w-full md:w-auto"
                            style={{
                                fontFamily: 'Norwige, sans-serif',
                                fontSize: 'clamp(0.9rem, 2vw, 1.3rem)',
                                fontWeight: '600',
                                color: 'white',
                                background: 'transparent',
                                border: '3px solid white',
                                borderRadius: '60px',
                                padding: '16px 40px',
                                cursor: 'pointer',
                                letterSpacing: '0.1em',
                                textTransform: 'uppercase',
                                transition: 'all 0.3s ease',
                                position: 'relative',
                                overflow: 'hidden',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'white';
                                e.currentTarget.style.color = 'black';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.color = 'white';
                            }}
                        >
                            START MY PROJECT
                        </motion.button>

                        <style jsx>{`
                            .project-button::before {
                                content: '';
                                position: absolute;
                                top: 0;
                                left: -100%;
                                width: 100%;
                                height: 100%;
                                background: linear-gradient(
                                    90deg,
                                    transparent,
                                    rgba(255, 255, 255, 0.3),
                                    transparent
                                );
                                transition: left 0.6s ease;
                            }

                            .project-button:hover::before {
                                left: 100%;
                            }
                        `}</style>
                    </Link>
                </motion.div>

                {/* Right Side - Description Text */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    style={{
                        flex: 1,
                        maxWidth: '500px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-end',
                        alignItems: 'flex-end',
                        textAlign: 'right',
                    }}
                    className="w-full md:max-w-[500px] items-start md:items-end text-left md:text-right"
                >
                    <p style={{
                        fontFamily: 'Roboto, sans-serif',
                        fontSize: 'clamp(0.9rem, 1.5vw, 1.2rem)',
                        lineHeight: '1.8',
                        color: 'white',
                        marginBottom: '40px',
                        textAlign: 'justify',
                    }}
                        className="text-left md:text-justify mb-6 md:mb-10"
                    >
                        We build intelligent workflows that connect your tools, eliminate repetitive tasks, and let you focus on what actually grows your business.
                    </p>

                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '20px',
                    }}
                        className="w-full items-start md:items-end gap-3 md:gap-5"
                    >
                        <motion.h3
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            style={{
                                fontFamily: 'Norwige, sans-serif',
                                fontSize: 'clamp(1rem, 2vw, 1.5rem)',
                                fontWeight: '600',
                                color: 'white',
                                margin: 0,
                            }}
                        >
                            Automate the chaos.
                        </motion.h3>

                        <motion.h3
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            style={{
                                fontFamily: 'Norwige, sans-serif',
                                fontSize: 'clamp(1rem, 2vw, 1.5rem)',
                                fontWeight: '600',
                                color: 'white',
                                margin: 0,
                            }}
                        >
                            Simple systems.
                        </motion.h3>

                        <motion.h3
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            style={{
                                fontFamily: 'Norwige, sans-serif',
                                fontSize: 'clamp(1rem, 2vw, 1.5rem)',
                                fontWeight: '600',
                                color: 'white',
                                margin: 0,
                            }}
                        >
                            Real results.
                        </motion.h3>
                    </div>
                </motion.div>
            </section>

            {/* Technology Stack Section */}
            <section style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                zIndex: 3,
                padding: '80px 8%',
            }}
                className="py-12 md:py-20 px-4 md:px-8"
            >
                <motion.h2
                    initial={{ opacity: 0, y: -30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    style={{
                        fontFamily: 'Norwige, sans-serif',
                        fontSize: 'clamp(2rem, 5vw, 4rem)',
                        fontWeight: '900',
                        color: 'white',
                        textAlign: 'center',
                        marginBottom: '80px',
                        letterSpacing: '0.1em',
                    }}
                    className="mb-8 md:mb-16"
                >
                    TECHNOLOGY STACK
                </motion.h2>

                {/* Technology Grid */}
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(5, 1fr)',
                        gap: '30px',
                        maxWidth: '1200px',
                        width: '100%',
                        padding: '40px',
                        background: 'rgba(255, 255, 255, 0.02)',
                        borderRadius: '30px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                    }}
                    className="grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 p-4 md:p-8 rounded-2xl md:rounded-3xl"
                >
                    {[
                        { name: 'n8n', icon: '∞' },
                        { name: 'claude', icon: '✦' },
                        { name: 'chatgpt', icon: '◎' },
                        { name: 'perplexity', icon: '✺' },
                        { name: 'langchain', icon: '🔗' },
                        { name: 'notion', icon: 'N' },
                        { name: 'serp api', icon: '◐' },
                        { name: 'google cloud', icon: '☁' },
                        { name: 'gmail', icon: 'M' },
                        { name: 'pinecone', icon: '❋' },
                    ].map((tech, index) => (
                        <motion.div
                            key={tech.name}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            whileHover={{ scale: 1.05 }}
                            style={{
                                background: 'rgba(0, 0, 0, 0.6)',
                                borderRadius: '20px',
                                padding: '30px 20px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '15px',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                backdropFilter: 'blur(5px)',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                            }}
                            className="p-4 md:p-6 gap-2 md:gap-4 rounded-xl md:rounded-2xl"
                        >
                            <div style={{
                                fontSize: 'clamp(2rem, 4vw, 3rem)',
                                color: 'white',
                            }}
                                className="text-3xl md:text-4xl"
                            >
                                {tech.icon}
                            </div>
                            <p style={{
                                fontFamily: 'Roboto, sans-serif',
                                fontSize: 'clamp(0.8rem, 1.2vw, 1rem)',
                                color: 'white',
                                margin: 0,
                                textAlign: 'center',
                                letterSpacing: '0.05em',
                            }}
                                className="text-xs md:text-sm"
                            >
                                {tech.name}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Project Strip CTA */}
            <ProjectStrip />

            {/* Our Approach Section */}
            <OurApproachSection />

            {/* FAQ Section */}
            <FAQBottomSection />

            <Footer />

            <NavigationDock />
        </div>
    );
}
