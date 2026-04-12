"use client";

import React from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { NavigationDock } from "@/components/NavDoc";
import Footer from "@/components/Footer";
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import SplitText from '@/components/SplitText';

/*
 * MAIN PAGE WRAPPER
 * Using overflow: hidden ensures that absolute positioned decorative elements
 * (like the blobs) that extend outside the container are clipped, preventing
 * unwanted scrollbars and extra white space, while the container itself
 * grows with content due to min-height: 100vh.
 *
 * Removed overflow-x: hidden to avoid potential scroll-chaining issues,
 * opting for general `overflow: hidden` to clip background effects.
 */
const PageWrapper = styled.main`
  background: #000;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  width: 100%;
  color: white;
  font-family: 'Inter', sans-serif;
`;

/*
 * CONTENT CONTAINER
 */
const ContentContainer = styled.ul`
  max-width: 1400px;
  margin: 0 auto;
  padding: 8rem 2rem 5rem;
  position: relative;
  z-index: 10;
  list-style: none;

  @media (max-width: 900px) {
    padding: 6rem 1.5rem 3rem;
  }
`;

/*
 * BACKGROUND GRADIENTS
 * Positioning with pixels/vh ensures consistent placement regardless of page height.
 * This prevents the "huge space below footer" issue caused by percentage offsets
 * on very tall pages.
 */
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

/* --- SHIMMER ANIMATION --- */

const shimmer = keyframes`
  0% {
    background-position: -200% center;
  }
  100% {
    background-position: 200% center;
  }
`;

/* --- HEADER SECTION --- */

const HeaderSection = styled.header`
  margin-bottom: 6rem;

  @media (max-width: 768px) {
    margin-bottom: 4rem;
  }
`;

const Title = styled(motion.h1)`
  font-family: 'Norwige', serif;
  font-size: clamp(3.5rem, 10vw, 8rem);
  font-weight: 400;
  line-height: 0.9;
  letter-spacing: -0.02em;
  margin-bottom: 2rem;
  color: #FFF4E3;
`;

const TitleWrapper = styled.div`
  h1 {
    font-family: 'Norwige', serif;
    font-size: clamp(3.5rem, 10vw, 8rem);
    font-weight: 400;
    line-height: 0.9;
    letter-spacing: -0.02em;
    color: #FFF4E3;
  }
`;

const Subtitle = styled(motion.p)`
  font-size: clamp(1rem, 1.5vw, 1.25rem);
  color: #FFF4E3;
  max-width: 500px;
  line-height: 1.6;
`;

const SectionLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 4rem;
  font-weight: 600;
  background: linear-gradient(132deg, #EA9A61 4.77%, #B16937 27.26%, #A64D2B 50.09%, #42201C 76.74%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: ${shimmer} 6s linear 1;
  cursor: pointer;

  &:hover {
    animation: ${shimmer} 6s linear infinite;
  }

  &::before {
    content: '';
    display: block;
    width: 8px;
    height: 8px;
    background: #FFF4E3;
    border-radius: 50%;
  }
`;

/* --- PROJECT LIST --- */

const ProjectRow = styled(motion.li) <{ $reversed?: boolean }>`
  display: flex;
  flex-direction: ${props => props.$reversed ? 'row-reverse' : 'row'};
  align-items: center;
  gap: 4rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 4rem;
  margin-bottom: 4rem;
  width: 100%;

  @media (max-width: 900px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 2rem;
  }
`;

const ImageContainer = styled(Link)`
  position: relative;
  flex: 1.2;
  width: 100%;
  aspect-ratio: 4/3;
  overflow: hidden;
  background: #111;
  display: block;
  cursor: pointer;

  @media (max-width: 900px) {
    flex: none;
    width: 100%;
    aspect-ratio: 16/9;
  }
`;

const ProjectImageWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  transition: transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);

  ${ImageContainer}:hover & {
    transform: scale(1.05);
  }
`;

const ProjectContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;

  @media (max-width: 900px) {
    flex: none;
  }
`;

const ProjectIndex = styled.span`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.4);
  margin-bottom: 2rem;
  display: block;
  font-family: monospace;
`;

const ProjectTitle = styled.h2`
  font-family: 'Norwige', serif;
  font-size: clamp(3rem, 6vw, 5rem);
  line-height: 0.9;
  margin-bottom: 1.5rem;
  text-transform: uppercase;
  letter-spacing: -0.02em;
  background: linear-gradient(132deg, #EA9A61 4.77%, #B16937 27.26%, #A64D2B 50.09%, #42201C 76.74%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: ${shimmer} 8s linear 1;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    animation: ${shimmer} 8s linear infinite;
    transform: scale(1.02);
  }
`;

const ProjectDescription = styled.p`
  font-size: 1.1rem;
  color: #FFF4E3;
  line-height: 1.6;
  max-width: 450px;
  margin-bottom: 3rem;
`;

const ViewProjectLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.8rem 1.8rem;
  border: 1px solid rgba(255, 244, 227, 0.2);
  border-radius: 100px;
  color: #FFF4E3;
  text-decoration: none;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: all 0.3s ease;
  width: fit-content;

  &:hover {
    background: #FFF4E3;
    color: black;
    border-color: #FFF4E3;
  }
`;

const caseStudies = [
  {
    id: 'bando',
    title: 'The Bando',
    description: 'Bold, unapologetically Atlanta. We transformed a Black history museum and fried chicken spot\'s digital presence to match their in-person energy, cutting bounce rate by 60%.',
    image: '/casestudy/Evertriedcrack.webp',
    href: '/casestudy/bando'
  },
  {
    id: 'ikna',
    title: 'Aysegul Ikna',
    description: 'Luxury that justifies the price tag. We built a sophisticated digital home for a sustainable fashion brand at Ponce City Market, driving 30% sales growth through elevated design and seamless e-commerce.',
    image: '/casestudy/iknacasestudy.webp',
    href: '/casestudy/ikna'
  },
  {
    id: 'dkm',
    title: 'DKM Corp',
    description: 'Scaling Global Operations. A comprehensive brand identity and digital infrastructure project for a private growth and operations partner spanning India, Australia, the US, and Dubai.',
    image: '/casestudy/dubaiskyline.webp',
    href: '/casestudy/dkm'
  },
  {
    id: 'pursue-networking',
    title: 'Pursue Networking',
    description: "An AI-powered LinkedIn copilot that turns B2B networking into revenue. We built the platform, the brand, and the pipeline that now drives 500+ active professionals.",
    image: '/casestudy/Pursue/pursuecover.webp',
    href: '/casestudy/pursue-networking'
  },
  {
    id: 'atlanta-tech-meetup',
    title: 'Atlanta Tech Meetup',
    description: "The vibe is the product. Hand-built community site for Atlanta's monthly tech meetup. 100% hand-coded, 0% AI-generated, serving a community of 500+ builders across 50+ events.",
    image: '/casestudy/atm/atm1.webp',
    href: '/casestudy/atlanta-tech-meetup'
  }
];

export default function CaseStudyContent() {
  return (
    <PageWrapper>
      <NavigationDock />

      {/* Top Left Gradient Blob */}
      <div
        className="absolute top-0 left-0 w-[800px] h-[800px] rounded-full pointer-events-none z-0"
        style={{
          background: 'rgba(96, 62, 37, 0.90)',
          filter: 'blur(200px)',
          transform: 'translate(-30%, -30%)'
        }}
      />
      {/* Bottom Right Gradient Blob */}
      <div
        className="absolute bottom-0 right-0 w-[800px] h-[800px] rounded-full pointer-events-none z-0"
        style={{
          background: 'rgba(96, 62, 37, 0.90)',
          filter: 'blur(200px)',
          transform: 'translate(30%, 30%)'
        }}
      />

      <ContentContainer>
        <HeaderSection>
          <TitleWrapper style={{ marginBottom: '2rem' }}>
            <SplitText
              text="Client Case Studies"
              tag="h1"
              className=""
              delay={30}
              duration={1}
              ease="power3.out"
              splitType="chars"
              from={{ opacity: 0, y: 40 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.1}
              rootMargin="-50px"
              textAlign="inherit"
            />
          </TitleWrapper>
          <Subtitle
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            Explore how we help brands elevate their digital presence through
            strategic design and technical excellence.
          </Subtitle>
        </HeaderSection>

        <SectionLabel>Latest Projects</SectionLabel>

        {caseStudies.map((cs, i) => {
          const isReversed = i % 2 !== 0;
          return (
            <ProjectRow
              key={cs.id}
              $reversed={isReversed}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <ImageContainer href={cs.href}>
                <ProjectImageWrapper>
                  <Image src={cs.image} alt={cs.title} fill sizes="(max-width: 900px) 100vw, 55vw" style={{ objectFit: 'cover' }} />
                </ProjectImageWrapper>
              </ImageContainer>

              <ProjectContent>
                <ProjectIndex>0{i + 1}</ProjectIndex>
                <ProjectTitle>{cs.title}</ProjectTitle>
                <ProjectDescription>
                  {cs.description}
                </ProjectDescription>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                  <ViewProjectLink href={cs.href}>
                    View project <ArrowUpRight size={18} />
                  </ViewProjectLink>
                </div>
              </ProjectContent>
            </ProjectRow>
          );
        })}
      </ContentContainer>

      <Footer />
    </PageWrapper>
  );
}
