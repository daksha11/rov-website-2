"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { NavigationDock } from '@/components/NavDoc';
import Footer from '@/components/Footer';
import OurApproachSection from '@/components/Web-Dev/OurApproachSection';
import FAQBottomSection from '@/components/Web-Dev/FAQBottomSection';
import AIWorkflowsSection from '@/components/ai-automation/AIWorkflowsSection';
import ProjectStrip from '@/components/ProjectStrip';
import LogoLoop from '@/components/LogoLoop';
import { SiNotion, SiGooglecloud, SiGmail, SiOpenai, SiN8N } from 'react-icons/si';

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



            {/* Hero Section */}
            <section style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                zIndex: 3,
                padding: 'clamp(100px, 15vh, 120px) clamp(16px, 8%, 8%) clamp(60px, 10vh, 80px) clamp(16px, 8%, 8%)',
                textAlign: 'center',
            }}>
                {/* Pill Badge */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: 'rgba(126, 42, 12, 0.20)',
                        border: '1px solid rgba(202, 53, 0, 0.30)',
                        borderRadius: '9999px',
                        padding: '8px 20px',
                        marginBottom: '40px',
                        backdropFilter: 'blur(8px)',
                    }}
                >
                    <span style={{ color: '#E8914A', fontSize: '0.85rem' }}>✦</span>
                    <span style={{
                        fontFamily: 'Roboto, sans-serif',
                        fontSize: '0.78rem',
                        fontWeight: '600',
                        color: '#E8914A',
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                    }}>
                        AI Systems &amp; Solutions
                    </span>
                </motion.div>

                {/* Main Heading */}
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.15 }}
                    style={{
                        fontFamily: 'TestSohne-Extrafett, Norwige, sans-serif',
                        fontSize: 'clamp(2.8rem, 7vw, 6.5rem)',
                        fontWeight: '800',
                        color: 'white',
                        lineHeight: '1.08',
                        letterSpacing: '-0.01em',
                        marginBottom: '0',
                        maxWidth: '900px',
                    }}
                >
                    AI that works the way
                    <br />
                    <span
                        style={{
                            fontFamily: 'NorwigeHeroItalic, sans-serif',
                            fontWeight: 'normal',
                            fontSize: 'clamp(2.8rem, 7vw, 6rem)',
                            lineHeight: '1.15',
                            display: 'block',
                            textAlign: 'center',
                            background: 'linear-gradient(90deg, #FF8904 0%, #F54900 100%)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}
                    >
                        your brand thinks
                    </span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    style={{
                        fontFamily: 'Roboto, sans-serif',
                        fontSize: 'clamp(0.95rem, 1.6vw, 1.1rem)',
                        lineHeight: '1.7',
                        color: 'rgba(255,255,255,0.65)',
                        marginTop: '30px',
                        marginBottom: '48px',
                        maxWidth: '520px',
                    }}
                >
                    Custom AI systems that save time and make money.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.45 }}
                    style={{
                        display: 'flex',
                        gap: '16px',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Link href="https://calendly.com/rangeofviewmusic/30min" target="_blank">
                        <motion.button
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.97 }}
                            style={{
                                fontFamily: 'Roboto, sans-serif',
                                fontSize: '0.82rem',
                                fontWeight: '700',
                                color: 'white',
                                background: 'linear-gradient(132deg, #EA9A61 4.77%, #B16937 27.26%, #A64D2B 50.09%, #42201C 76.74%)',
                                border: 'none',
                                borderRadius: '9999px',
                                padding: '15px 32px',
                                cursor: 'pointer',
                                letterSpacing: '0.1em',
                                textTransform: 'uppercase',
                                transition: 'all 0.3s ease',
                                boxShadow: '0 4px 24px rgba(160, 90, 40, 0.45)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                            }}
                        >
                            START YOUR AI JOURNEY <span style={{ fontSize: '1rem' }}>→</span>
                        </motion.button>
                    </Link>

                    <Link href="#ai-in-action">
                        <motion.button
                            whileHover={{ scale: 1.04, background: 'rgba(255,255,255,0.08)' }}
                            whileTap={{ scale: 0.97 }}
                            style={{
                                fontFamily: 'Roboto, sans-serif',
                                fontSize: '0.82rem',
                                fontWeight: '700',
                                color: 'white',
                                background: 'transparent',
                                border: '1.5px solid rgba(255,255,255,0.55)',
                                borderRadius: '999px',
                                padding: '15px 32px',
                                cursor: 'pointer',
                                letterSpacing: '0.1em',
                                textTransform: 'uppercase',
                                transition: 'all 0.3s ease',
                            }}
                        >
                            SEE AI IN ACTION
                        </motion.button>
                    </Link>
                </motion.div>
            </section>



            {/* Project Strip CTA */}
            <ProjectStrip />

            {/* Measurable Results Section */}
            <section style={{
                position: 'relative',
                zIndex: 3,
                padding: 'clamp(60px, 10vw, 100px) clamp(16px, 8%, 8%)',
                textAlign: 'center',
            }}>
                {/* Heading */}
                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    style={{
                        fontFamily: 'NorwigeHeroItalic, sans-serif',
                        fontWeight: 'normal',
                        fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
                        color: 'white',
                        marginBottom: '16px',
                        lineHeight: 1.15,
                    }}
                >
                    Measurable Results, Real ROI
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.15 }}
                    viewport={{ once: true }}
                    style={{
                        fontFamily: 'Roboto, sans-serif',
                        fontSize: 'clamp(0.9rem, 1.4vw, 1rem)',
                        color: 'rgba(255,255,255,0.5)',
                        marginBottom: '64px',
                        maxWidth: '480px',
                        margin: '0 auto 64px auto',
                        lineHeight: 1.7,
                    }}
                >
                    Our clients see tangible returns within the first 90 days. Here's what AI implementation delivers.
                </motion.p>

                {/* Stats Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(min(240px, 100%), 1fr))',
                    gap: '20px',
                    maxWidth: '1100px',
                    margin: '0 auto',
                }}>
                    {[
                        {
                            icon: '/aipage/clocksvg.svg',
                            stat: '80%',
                            label: 'Reduction in content production time',
                            sub: 'What took 10 hours now takes 2',
                        },
                        {
                            icon: '/aipage/peoplesvg.svg',
                            stat: '3x',
                            label: 'More customer interactions handled',
                            sub: 'Without increasing headcount',
                        },
                        {
                            icon: '/aipage/dollarsignsvg.svg',
                            stat: '$50K+',
                            label: 'Saved annually on repetitive tasks',
                            sub: 'Per team implementing AI',
                        },
                        {
                            icon: '/aipage/arrowsvg.svg',
                            stat: '45%',
                            label: 'Increase in conversion rates',
                            sub: 'Through personalisation & optimization',
                        },
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: i * 0.1 }}
                            viewport={{ once: true }}
                            whileHover={{ scale: 1.03 }}
                            style={{
                                background: 'rgba(126, 42, 12, 0.15)',
                                border: '1px solid rgba(202, 53, 0, 0.20)',
                                borderRadius: '20px',
                                padding: 'clamp(24px, 5vw, 36px) clamp(16px, 4vw, 24px)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '12px',
                                cursor: 'default',
                                transition: 'all 0.3s ease',
                            }}
                        >
                            {/* Icon */}
                            <div style={{
                                width: '44px',
                                height: '44px',
                                borderRadius: '50%',
                                background: 'rgba(202, 53, 0, 0.15)',
                                border: '1px solid rgba(202, 53, 0, 0.25)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '10px',
                            }}>
                                <img
                                    src={item.icon}
                                    alt={item.label}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'contain',
                                        filter: 'brightness(0) saturate(100%) invert(58%) sepia(52%) saturate(1988%) hue-rotate(358deg) brightness(103%) contrast(101%)',
                                    }}
                                />
                            </div>

                            {/* Big Stat */}
                            <span style={{
                                fontFamily: 'Norwige, sans-serif',
                                fontStyle: 'italic',
                                fontSize: 'clamp(2rem, 3.5vw, 2.8rem)',
                                fontWeight: 600,
                                background: 'linear-gradient(90deg, #FF8904 0%, #F54900 100%)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                lineHeight: 1,
                            }}>
                                {item.stat}
                            </span>

                            {/* Label */}
                            <p style={{
                                fontFamily: 'Roboto, sans-serif',
                                fontSize: '0.88rem',
                                fontWeight: 600,
                                color: 'rgba(255,255,255,0.85)',
                                margin: 0,
                                textAlign: 'center',
                                lineHeight: 1.4,
                            }}>
                                {item.label}
                            </p>

                            {/* Sub */}
                            <p style={{
                                fontFamily: 'Roboto, sans-serif',
                                fontSize: '0.75rem',
                                color: 'rgba(255,255,255,0.35)',
                                margin: 0,
                                textAlign: 'center',
                                lineHeight: 1.4,
                            }}>
                                {item.sub}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* AI Workflows Section */}
            <AIWorkflowsSection />

            {/* Technology Stack & Integrations Section */}
            <section style={{
                position: 'relative',
                zIndex: 3,
                padding: '0 clamp(16px, 8%, 8%) clamp(60px, 10vw, 100px) clamp(16px, 8%, 8%)',
            }}>
                {/* Heading */}
                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    style={{
                        fontFamily: 'NorwigeHeroItalic, sans-serif',
                        fontWeight: 'normal',
                        fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
                        color: 'white',
                        marginBottom: '16px',
                        lineHeight: 1.15,
                    }}
                >
                    Technology Stack &amp; Integrations
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.15 }}
                    viewport={{ once: true }}
                    style={{
                        fontFamily: 'Roboto, sans-serif',
                        fontSize: 'clamp(0.9rem, 1.4vw, 1rem)',
                        color: 'rgba(255,255,255,0.5)',
                        marginBottom: '48px',
                        maxWidth: '480px',
                        lineHeight: 1.7,
                    }}
                >
                    We work with best-in-class AI platforms and integrate seamlessly with your existing tools.
                </motion.p>

                {/* 2x2 Cards Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 450px), 1fr))',
                    gap: 'clamp(20px, 2.5vw, 40px)',
                    maxWidth: '1200px',
                    margin: '0 auto',
                }}>
                    {[
                        {
                            icon: '/aipage/gearsvg.svg',
                            title: 'AI Models & Platforms',
                            tags: ['OpenAI GPT-4', 'Anthropic Claude', 'Google Gemini', 'Custom Fine-tuned Models', 'Stable Diffusion', 'Midjourney API'],
                        },
                        {
                            icon: '/aipage/linksvg.svg',
                            title: 'Integration Capabilities',
                            tags: ['Slack', 'Microsoft Teams', 'Salesforce', 'HubSpot', 'Shopify', 'WordPress', 'Webflow', 'Zapier', 'Make.com'],
                        },
                        {
                            icon: '/aipage/cloudsvg.svg',
                            title: 'Infrastructure',
                            tags: ['AWS', 'Google Cloud', 'Azure', 'Vector Databases', 'Real-time APIs', 'Secure Webhooks'],
                        },
                        {
                            icon: '/aipage/arrow2svg.svg',
                            title: 'Development Tools',
                            tags: ['LangChain', 'LlamaIndex', 'Python', 'Node.js', 'React', 'API Development'],
                        },
                    ].map((card, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: i * 0.1 }}
                            viewport={{ once: true }}
                            style={{
                                background: 'linear-gradient(135deg, rgba(126, 42, 12, 0.20) 0%, rgba(159, 45, 0, 0.10) 100%)',
                                border: '1px solid rgba(159, 45, 0, 0.30)',
                                borderRadius: 'clamp(12px, 1.5vw, 20px)',
                                padding: 'clamp(24px, 3vw, 40px)',
                                minHeight: '240px',
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            {/* Card Header */}
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'clamp(12px, 1vw, 16px)',
                                marginBottom: 'clamp(20px, 2vw, 28px)',
                            }}>
                                <div style={{
                                    width: 'clamp(40px, 3vw, 50px)',
                                    height: 'clamp(40px, 3vw, 50px)',
                                    borderRadius: 'clamp(8px, 1vw, 12px)',
                                    background: 'rgba(202, 53, 0, 0.15)',
                                    border: '1px solid rgba(202, 53, 0, 0.25)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: 'clamp(8px, 0.8vw, 12px)',
                                    flexShrink: 0,
                                }}>
                                    <img
                                        src={card.icon}
                                        alt={card.title}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'contain',
                                            filter: 'brightness(0) saturate(100%) invert(58%) sepia(52%) saturate(1988%) hue-rotate(358deg) brightness(103%) contrast(101%)',
                                        }}
                                    />
                                </div>
                                <span style={{
                                    fontFamily: 'Roboto, sans-serif',
                                    fontWeight: 700,
                                    fontSize: 'clamp(0.95rem, 1.2vw, 1.1rem)',
                                    color: 'rgba(255,255,255,0.9)',
                                    letterSpacing: '0.01em',
                                    lineHeight: 1.3,
                                }}>
                                    {card.title}
                                </span>
                            </div>

                            {/* Tags */}
                            <div style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: 'clamp(8px, 0.8vw, 12px)',
                                flex: 1,
                                alignContent: 'flex-start',
                            }}>
                                {card.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        style={{
                                            fontFamily: 'Roboto, sans-serif',
                                            fontSize: 'clamp(0.75rem, 0.9vw, 0.85rem)',
                                            fontWeight: 500,
                                            color: 'rgba(255,255,255,0.65)',
                                            background: 'rgba(126, 42, 12, 0.20)',
                                            border: '1px solid rgba(159, 45, 0, 0.40)',
                                            borderRadius: '9999px',
                                            padding: 'clamp(6px, 0.5vw, 8px) clamp(12px, 1.2vw, 16px)',
                                            whiteSpace: 'nowrap',
                                        }}
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Logo Loop Section */}
            <section style={{
                position: 'relative',
                zIndex: 3,
                padding: 'clamp(40px, 8vw, 60px) clamp(16px, 8%, 8%) clamp(60px, 10vw, 100px) clamp(16px, 8%, 8%)',
            }}>

                <div style={{ height: '120px', position: 'relative', overflow: 'hidden' }}>
                    <LogoLoop
                        logos={[
                            {
                                node: <SiN8N className="text-white" />,
                                title: "n8n",
                                href: "https://n8n.io",
                                ariaLabel: "n8n automation platform"
                            },
                            {
                                src: "/logos/claude.svg",
                                alt: "Claude",
                                href: "https://www.anthropic.com",
                                title: "Claude AI"
                            },
                            {
                                node: <SiOpenai className="text-white" />,
                                title: "ChatGPT",
                                href: "https://openai.com",
                                ariaLabel: "ChatGPT"
                            },
                            {
                                src: "/logos/perplexity.svg",
                                alt: "Perplexity",
                                href: "https://www.perplexity.ai",
                                title: "Perplexity AI"
                            },
                            {
                                src: "/logos/langchain.svg",
                                alt: "LangChain",
                                href: "https://www.langchain.com",
                                title: "LangChain"
                            },
                            {
                                node: <SiNotion className="text-white" />,
                                title: "Notion",
                                href: "https://www.notion.so",
                                ariaLabel: "Notion"
                            },
                            {
                                src: "/logos/serpapi.svg",
                                alt: "SERP API",
                                href: "https://serpapi.com",
                                title: "SERP API"
                            },
                            {
                                node: <SiGooglecloud className="text-white" />,
                                title: "Google Cloud",
                                href: "https://cloud.google.com",
                                ariaLabel: "Google Cloud"
                            },
                            {
                                node: <SiGmail className="text-white" />,
                                title: "Gmail",
                                href: "https://gmail.com",
                                ariaLabel: "Gmail"
                            },
                            {
                                src: "/logos/pinecone.svg",
                                alt: "Pinecone",
                                href: "https://www.pinecone.io",
                                title: "Pinecone"
                            },
                        ]}
                        speed={50}
                        direction="left"
                        logoHeight={60}
                        gap={60}
                        hoverSpeed={0}
                        scaleOnHover
                        fadeOut
                        fadeOutColor="#000000"
                        ariaLabel="AI Technology partners and integrations"
                    />
                </div>
            </section>

            {/* Our Approach Section */}
            <OurApproachSection />

            {/* FAQ Section */}
            <FAQBottomSection />

            <Footer />

            <NavigationDock />
        </div>
    );
}
