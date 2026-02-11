"use client";

import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { NavigationDock } from "@/components/NavDoc";
import Footer from "@/components/Footer";
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

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
  color: #fff;
`;

const Subtitle = styled(motion.p)`
  font-size: clamp(1rem, 1.5vw, 1.25rem);
  color: rgba(255, 255, 255, 0.6);
  max-width: 500px;
  line-height: 1.6;
`;

const SectionLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #cf3737;
  margin-bottom: 4rem;
  font-weight: 600;

  &::before {
    content: '';
    display: block;
    width: 8px;
    height: 8px;
    background: currentColor;
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

const ProjectImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
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
  color: #fff;
  letter-spacing: -0.02em;
`;

const ProjectDescription = styled.p`
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
  max-width: 450px;
  margin-bottom: 3rem;
`;

const ViewProjectLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.8rem 1.8rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 100px;
  color: #fff;
  text-decoration: none;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: all 0.3s ease;
  width: fit-content;

  &:hover {
    background: white;
    color: black;
    border-color: white;
  }
`;

const caseStudies = [
  {
    id: 'bando',
    title: 'The Bando',
    description: 'Bringing unapologetic brand energy to a digital fried chicken experience. A blend of modern aesthetics and raw street culture.',
    image: '/casestudyheroimg.png',
    href: '/casestudy/bando'
  },
  {
    id: 'ikna',
    title: 'IKNA',
    description: 'Elevating digital presence for high-end technology consulting services through strategic design and minimalistic elegance.',
    image: '/webdev/ayseiknawebhome.png',
    href: '/casestudy/ikna'
  }
];

export default function CaseStudySelectionPage() {
  return (
    <PageWrapper>
      <NavigationDock />

      {/* 
              Changed offsets to PX/VH values to avoid massive footer spacing.
              -200px from top and -300px from bottom (clipping ensures no scrollbar extension).
            */}
      <GradientBlob color="#C90000" top="-200px" left="-200px" />
      <GradientBlob color="#00f2ff" bottom="-300px" right="-200px" size="800px" />

      <ContentContainer>
        <HeaderSection>
          <Title
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            Our Case Studies
          </Title>
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
                <ProjectImage src={cs.image} alt={cs.title} />
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
