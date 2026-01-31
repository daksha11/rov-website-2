"use client";

import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const StripContainer = styled.section`
  width: 100%;
  padding: clamp(2rem, 4vw, 3rem) clamp(1.5rem, 5vw, 4rem);
  background-color: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  
  @media (max-width: 768px) {
    padding: clamp(1.5rem, 3vw, 2rem) clamp(1rem, 4vw, 1.5rem);
  }
`;

const StripBanner = styled.div`
  display: flex;
  width: 100%;
  max-width: 100%;
  padding: clamp(2.5rem, 4vw, 3.5rem) clamp(2rem, 4vw, 3.75rem);
  align-items: flex-end;
  justify-content: space-between;
  gap: clamp(1.5rem, 3vw, 2.5rem);
  border-radius: 15px;
  border: 1px solid #999288;
  background: linear-gradient(111deg, #EA9A61 -1.34%, #B16937 25.87%, #A64D2B 59.87%, #42201C 93.39%);
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);
  position: relative;
  z-index: 10;
  overflow: hidden;
  
  @media (max-width: 968px) {
    flex-direction: column;
    text-align: center;
    align-items: center;
    gap: clamp(1.5rem, 4vw, 2rem);
    padding: clamp(2rem, 5vw, 2.5rem) clamp(1.5rem, 4vw, 2rem);
  }
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: clamp(1.25rem, 2.5vw, 2rem);
  flex: 1;
  
  @media (max-width: 968px) {
    flex-direction: column;
    gap: 1.25rem;
  }
`;

const LogoCircle = styled.div`
  width: clamp(4.5rem, 7vw, 6rem);
  height: clamp(4.5rem, 7vw, 6rem);
  background-color: #000;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  
  img {
    width: 60%;
    height: auto;
  }
  
  @media (max-width: 768px) {
    width: clamp(4rem, 10vw, 5rem);
    height: clamp(4rem, 10vw, 5rem);
  }
`;

const TextContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  
  @media (max-width: 968px) {
    align-items: center;
  }
`;

const Heading = styled.h2`
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 600;
  line-height: 1.2;
  color: #FFFFFF;
  margin: 0;
  font-family: 'Inter', sans-serif;
  
  @media (max-width: 968px) {
    font-size: clamp(1.25rem, 4vw, 1.75rem);
  }
`;

const Subtext = styled.p`
  font-size: clamp(0.8125rem, 1.2vw, 0.9375rem);
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  font-family: 'Inter', sans-serif;
  font-weight: 300;
  
  @media (max-width: 968px) {
    font-size: clamp(0.75rem, 2vw, 0.875rem);
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: clamp(0.75rem, 1.5vw, 1rem);
  flex-shrink: 0;
  
  @media (max-width: 968px) {
    justify-content: center;
  }
  
  @media (max-width: 480px) {
    flex-direction: column;
    gap: 1rem;
  }
`;


const CircleContainer = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  /* Negative margin to pull items closer if needed, 
     but visual overlap is handled by the items themselves or negative margins on children */
  gap: 0; 
`;

const OutlineCircle = styled.div`
  width: clamp(3rem, 5vw, 3.75rem);
  height: clamp(3rem, 5vw, 3.75rem);
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.5);
  background: transparent;
  flex-shrink: 0;
  
  @media (max-width: 768px) {
    width: clamp(2.75rem, 8vw, 3.25rem);
    height: clamp(2.75rem, 8vw, 3.25rem);
  }
`;

const ArrowButton = styled(motion.a)`
  width: clamp(3rem, 5vw, 3.75rem);
  height: clamp(3rem, 5vw, 3.75rem);
  border-radius: 50%;
  background-color: #F7F2E4; /* Using the off-white/cream color from screenshot */
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  z-index: 2;
  flex-shrink: 0;
  margin: 0 -10px; /* Overlap effect */
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    z-index: 10;
  }
  
  svg {
    width: 35%;
    height: 35%;
    stroke: #000;
  }
  
  @media (max-width: 768px) {
    width: clamp(2.75rem, 8vw, 3.25rem);
    height: clamp(2.75rem, 8vw, 3.25rem);
  }
`;

const CTAButton = styled(motion.a)`
  display: inline-block;
  text-decoration: none;
  padding: clamp(0.75rem, 1.2vw, 0.9375rem) clamp(1.5rem, 2.5vw, 2rem);
  border: none;
  border-radius: 37.809px;
  background: #0E0A08;
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);
  color: #FFFFFF;
  font-size: clamp(0.75rem, 1vw, 0.875rem);
  font-weight: 600;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  font-family: 'Inter', sans-serif;
  position: relative;
  z-index: 1;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
  }
  
  @media (max-width: 480px) {
    font-size: clamp(0.75rem, 3vw, 0.8125rem);
    padding: 0.75rem 1.5rem;
  }
`;

const ProjectStrip: React.FC = () => {
  return (
    <StripContainer>
      <StripBanner>
        <LeftSection>
          <LogoCircle>
            <img src="/rov-logo.webp" alt="ROV Logo" />
          </LogoCircle>
          <TextContent>
            <Heading>Got a project in mind?</Heading>
            <Subtext>
              From web and video to sound and AI,<br />
              we shape ideas into experiences that connect.
            </Subtext>
          </TextContent>
        </LeftSection>

        <RightSection>
          <CircleContainer>
            <OutlineCircle />
            <ArrowButton
              href="https://calendly.com/rangeofviewmusic/30min"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </ArrowButton>
            <OutlineCircle />
          </CircleContainer>

          <CTAButton
            href="https://calendly.com/rangeofviewmusic/30min"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            LET'S CREATE!
          </CTAButton>
        </RightSection>
      </StripBanner>
    </StripContainer>
  );
};

export default ProjectStrip;
