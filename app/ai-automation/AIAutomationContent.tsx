"use client";

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { NavigationDock } from '@/components/NavDoc';
import Footer from '@/components/Footer';
import ProjectStrip from '@/components/ProjectStrip';
import LogoLoop from '@/components/LogoLoop';
import { N8nWorkflowBlock } from '@/components/ui/n8n-workflow-block';

// Dynamic imports for below-fold heavy components
const AIWorkflowsSection = dynamic(() => import('@/components/ai-automation/AIWorkflowsSection'), {
    loading: () => <div className="bg-black min-h-[40vh]" />,
});
const AIPricingTiers = dynamic(() => import('@/components/ai-automation/AIPricingTiers'), {
    loading: () => <div className="bg-black min-h-[40vh]" />,
});
const OurApproachSection = dynamic(() => import('@/components/common/OurApproachSection'), {
    loading: () => <div className="bg-black min-h-[40vh]" />,
});
const FAQSection = dynamic(() => import('@/components/common/FAQSection'), {
    loading: () => <div className="bg-black min-h-[40vh]" />,
});
import TestimonialsSection from '@/components/common/TestimonialsSection';
import { aiTestimonials } from '@/data/testimonials';
import CrossSellNudges from "@/components/common/CrossSellNudges";
import { aiAutomationFaqItems } from '@/data/faq';
import { aiAutomationSteps } from '@/data/approach-steps';
// Inline SVG components to avoid react-icons barrel import (saves ~200-500KB)
const SiN8N = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-.6 7.2h1.2v4.2h4.2v1.2h-4.2v4.2h-1.2v-4.2H7.2v-1.2h4.2V7.2z"/></svg>
);
const SiOpenai = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em"><path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z"/></svg>
);
const SiNotion = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em"><path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L18.29 2.29c-.42-.326-.98-.7-2.055-.607L3.01 2.87c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.166V6.354c0-.606-.233-.933-.748-.886l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952l1.448.327s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.14c-.093-.514.28-.886.747-.933zM1.936 1.035l13.872-1.026c1.68-.14 2.1.093 2.8.606l3.876 2.726c.466.326.606.466.606.886v17.31c0 1.026-.373 1.632-1.68 1.726l-15.457.933c-.98.047-1.448-.093-1.962-.747l-3.13-4.064c-.56-.746-.793-1.306-.793-1.96V2.667c0-.84.374-1.54 1.868-1.632z"/></svg>
);
const SiGooglecloud = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em"><path d="M12.19 2.38a9.344 9.344 0 0 0-9.234 6.893c.053-.02-.055.013 0 0-3.875 2.551-3.922 8.11-.247 10.941l.006-.007-.007.003a6.542 6.542 0 0 0 3.624 1.109h12.476a5.276 5.276 0 0 0 5.192-5.143 5.207 5.207 0 0 0-2.226-4.272c.268-1.333.03-2.74-.756-3.97a5.26 5.26 0 0 0-3.612-2.27A9.39 9.39 0 0 0 12.19 2.38zm-.358 2.453a7.03 7.03 0 0 1 4.907 2.27l-1.675 1.675a4.577 4.577 0 0 0-3.232-1.492 4.757 4.757 0 0 0-4.737 4.453h.007c-.009.167-.017.333-.017.503a4.52 4.52 0 0 0 .473 2.003L6.2 15.587a7.084 7.084 0 0 1-.883-3.346c0-.1.007-.197.009-.297l.003-.025A7.093 7.093 0 0 1 11.832 4.833z"/></svg>
);
const SiGmail = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em"><path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/></svg>
);

const FaultyTerminal = dynamic(() => import('@/components/FaultyTerminal'), { ssr: false });
const AIROICalculator = dynamic(() => import('@/components/ai-automation/AIROICalculator'), {
    loading: () => <div className="bg-black min-h-[40vh]" />,
    ssr: false,
});

export default function AIAutomationContent() {
    const [showROI, setShowROI] = useState(false);

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

            {/* FaultyTerminal Background */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100vh',
                pointerEvents: 'none',
                zIndex: 2,
            }}>
                <FaultyTerminal
                    scale={1.9}
                    gridMul={[2, 1]}
                    digitSize={1.2}
                    timeScale={0.3}
                    pause={false}
                    scanlineIntensity={0.5}
                    glitchAmount={1}
                    flickerAmount={1}
                    noiseAmp={1}
                    chromaticAberration={0}
                    dither={0}
                    curvature={0.28}
                    tint="#90422c"
                    mouseReact
                    mouseStrength={0.7}
                    pageLoadAnimation
                    brightness={0.3}
                    style={{ width: '100%', height: '100%' }}
                />
            </div>



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
                    Our clients see tangible returns within the first 90 days. Here&apos;s what AI implementation delivers.
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
                                fontSize: 'clamp(0.75rem, 1vw, 0.8rem)',
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
                            tags: ['OpenAI GPT-4o', 'Anthropic Claude', 'Google Gemini', 'Mistral AI', 'ElevenLabs', 'Stable Diffusion', 'Custom Fine-tuned Models'],
                        },
                        {
                            icon: '/aipage/linksvg.svg',
                            title: 'Integration Capabilities',
                            tags: ['Slack', 'Gmail', 'HubSpot', 'Salesforce', 'Notion', 'Airtable', 'Shopify', 'Stripe', 'Twilio', 'WhatsApp', 'Zapier', 'Make.com'],
                        },
                        {
                            icon: '/aipage/cloudsvg.svg',
                            title: 'Infrastructure',
                            tags: ['AWS', 'Google Cloud', 'Azure', 'Supabase', 'Vector Databases', 'PostgreSQL', 'Redis', 'Secure Webhooks', 'Real-time APIs'],
                        },
                        {
                            icon: '/aipage/arrow2svg.svg',
                            title: 'Development Tools',
                            tags: ['LangChain', 'LlamaIndex', 'Python', 'Node.js', 'React', 'GitHub', 'Docker', 'REST APIs'],
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

            {/* Workflow Playground */}
            <section className="relative bg-black" style={{ padding: "clamp(60px, 10vw, 100px) clamp(16px, 5vw, 60px)" }}>
                <div className="max-w-6xl mx-auto">
                    <div className="mb-8 md:mb-12">
                        <span
                            className="block text-xs uppercase tracking-[0.3em] text-[#EA9A61] mb-4"
                            style={{ fontFamily: "'Roboto', sans-serif" }}
                        >
                            Interactive Playground
                        </span>
                        <h2
                            className="text-white text-3xl md:text-4xl lg:text-5xl font-bold italic leading-tight mb-3"
                            style={{ fontFamily: "Norwige, sans-serif" }}
                        >
                            See How Workflows Work
                        </h2>
                        <p
                            className="text-white/40 text-sm md:text-base max-w-xl"
                            style={{ fontFamily: "'Roboto', sans-serif" }}
                        >
                            Drag nodes around, add new ones, and see how automation pipelines connect.
                            This is a simplified version of what we build for your business.
                        </p>
                    </div>
                    <N8nWorkflowBlock />
                </div>
            </section>

            {/* Client Testimonials */}
            <TestimonialsSection testimonials={aiTestimonials} variant="ai" />

            {/* Pricing Tiers */}
            <AIPricingTiers onUnlock={() => setShowROI(prev => !prev)} />

            {/* ROI Calculator — revealed by secret triple-click on pricing market bar */}
            {showROI && <AIROICalculator />}

            {/* Our Approach Section */}
            <OurApproachSection steps={aiAutomationSteps} />

            {/* Cross-Sell Nudges */}
            <CrossSellNudges currentService="ai-automation" />

            {/* FAQ Section */}
            <FAQSection items={aiAutomationFaqItems} />

            <Footer />

            <NavigationDock />
        </div>
    );
}
