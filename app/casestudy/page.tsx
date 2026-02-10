"use client";

import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { NavigationDock } from "@/components/NavDoc";
import Footer from "@/components/Footer";
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

const PageWrapper = styled.main`
  background: #000;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  color: white;
`;

const ContentContainer = styled.div`
  max-w-7xl mx-auto px-6 pt-32 pb-20 relative z-10;
`;

const GradientBlob = styled.div<{ color: string; top?: string; left?: string; right?: string; bottom?: string; size?: string }>`
  position: absolute;
  top: ${props => props.top || 'auto'};
  left: ${props => props.left || 'auto'};
  right: ${props => props.right || 'auto'};
  bottom: ${props => props.bottom || 'auto'};
  width: ${props => props.size || '40vw'};
  height: ${props => props.size || '40vw'};
  background: ${props => props.color};
  filter: blur(120px);
  opacity: 0.15;
  border-radius: 50%;
  pointer-events: none;
  z-index: 0;
`;

const Title = styled(motion.h1)`
  font-size: clamp(3rem, 8vw, 6rem);
  font-weight: 700;
  line-height: 1;
  margin-bottom: 2rem;
  letter-spacing: -0.02em;
`;

const Subtitle = styled(motion.p)`
  font-size: clamp(1.1rem, 2vw, 1.4rem);
  color: rgba(255, 255, 255, 0.6);
  max-width: 600px;
  margin-bottom: 4rem;
  line-height: 1.6;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const ClientCard = styled(motion.div) <{ accent: string }>`
  position: relative;
  height: 450px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  overflow: hidden;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 2.5rem;
  transition: border-color 0.4s ease;

  &:hover {
    border-color: ${props => props.accent};
  }

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, transparent 60%);
    z-index: 1;
  }
`;

const CardImage = styled.div<{ bg: string }>`
  position: absolute;
  inset: 0;
  background-image: url(${props => props.bg});
  background-size: cover;
  background-position: center;
  opacity: 0.4;
  transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
  
  ${ClientCard}:hover \u0026 {
    transform: scale(1.1);
    opacity: 0.6;
  }
`;

const CardContent = styled.div`
  position: relative;
  z-index: 2;
`;

const ClientTag = styled.span<{ accent: string }>`
  display: inline-block;
  padding: 0.5rem 1rem;
  background: ${props => props.accent}20;
  color: ${props => props.accent};
  border-radius: 100px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 1.5rem;
  border: 1px solid ${props => props.accent}40;
`;

const ClientName = styled.h2`
  font-size: 2.5rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
`;

const ClientDesc = styled.p`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.5;
`;

const caseStudies = [
    {
        id: 'bando',
        title: 'The Bando',
        tag: 'Restaurant \u0026 Museum',
        description: 'Bringing unapologetic brand energy to a digital fried chicken experience.',
        accent: '#C90000',
        image: '/casestudyheroimg.png',
        href: '/casestudy/bando'
    },
    {
        id: 'ikna',
        title: 'IKNA',
        tag: 'Technology Consulting',
        description: 'Elevating digital presence for high-end technology consulting services.',
        accent: '#00f2ff',
        image: '/webdev/ayseiknawebhome.png',
        href: '/casestudy/ikna'
    }
];

export default function CaseStudySelectionPage() {
    return (
        <PageWrapper>
            <NavigationDock />

            <GradientBlob color="#C90000" top="-10%" left="-10%" />
            <GradientBlob color="#00f2ff" bottom="-10%" right="-10%" size="50vw" />

            <ContentContainer className="max-w-7xl mx-auto px-6 pt-32 pb-20 relative z-10">
                <header className="mb-20">
                    <Title
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        Our Case <span style={{ color: 'rgba(255,255,255,0.2)' }}>Studies</span>
                    </Title>
                    <Subtitle
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    >
                        Explore how we help brands elevate their digital presence through
                        strategic design and technical excellence.
                    </Subtitle>
                </header>

                <Grid>
                    {caseStudies.map((cs, i) => (
                        <Link key={cs.id} href={cs.href} style={{ textDecoration: 'none' }}>
                            <ClientCard
                                accent={cs.accent}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: i * 0.15 }}
                                whileHover={{ y: -10 }}
                            >
                                <CardImage bg={cs.image} />
                                <CardContent>
                                    <ClientTag accent={cs.accent}>{cs.tag}</ClientTag>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                        <div>
                                            <ClientName>{cs.title}</ClientName>
                                            <ClientDesc>{cs.description}</ClientDesc>
                                        </div>
                                        <ArrowUpRight
                                            size={32}
                                            color="white"
                                            style={{ opacity: 0.4, marginBottom: '0.5rem' }}
                                        />
                                    </div>
                                </CardContent>
                            </ClientCard>
                        </Link>
                    ))}
                </Grid>
            </ContentContainer>

            <Footer />
        </PageWrapper>
    );
}
