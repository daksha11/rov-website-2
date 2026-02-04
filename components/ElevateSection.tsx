"use client";

import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import CardSwap, { Card } from './CardSwap';

const SectionContainer = styled.section`
  width: 100%;
  padding: clamp(2.5rem, 5vw, 3.75rem) clamp(1.5rem, 5vw, 4rem);
  background-color: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  
  @media (max-width: 768px) {
    padding: clamp(2rem, 4vw, 2.5rem) clamp(1rem, 4vw, 1.5rem);
  }
`;

const BannerCard = styled.div`
  display: flex;
  width: 100%;
  max-width: 100%;
  min-height: clamp(16rem, 20vw, 17.5rem);
  padding: clamp(2.5rem, 4vw, 3.75rem) clamp(2rem, 4vw, 3.75rem);
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.625rem;
  border-radius: 15px;
  position: relative;
  z-index: 10;
  border: 1px solid rgba(255, 244, 227, 0.40);
  background: #110C09;
  box-shadow: 0 0.25rem 0.25rem 0 rgba(0, 0, 0, 0.25);
  overflow: hidden;
  
  @media (max-width: 968px) {
    padding: clamp(2rem, 5vw, 2.5rem);
    gap: clamp(1.5rem, 4vw, 1.875rem);
    min-height: auto;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: clamp(2rem, 5vw, 3.75rem);
  position: relative;
  
  @media (max-width: 968px) {
    flex-direction: column;
    gap: clamp(1.5rem, 4vw, 1.875rem);
    align-items: center;
  }
`;

const LeftContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: clamp(1.5rem, 3vw, 2.5rem);
  flex: 1.2;
  text-align: left;
  
  @media (max-width: 968px) {
    align-items: center;
    text-align: center;
    gap: clamp(1rem, 3vw, 1.25rem);
  }
`;

const TextGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: clamp(0.5rem, 1vw, 1rem);
  width: 100%;
  
  @media (max-width: 968px) {
    align-items: center;
  }
`;

const LogoCircle = styled.div`
  width: clamp(5rem, 8vw, 7.5rem);
  height: clamp(5rem, 8vw, 7.5rem);
  background-color: #000;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  
  img {
    width: 58%;
    height: auto;
  }
  
  @media (max-width: 768px) {
    width: clamp(4rem, 12vw, 6.25rem);
    height: clamp(4rem, 12vw, 6.25rem);
  }
`;

const TextContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: clamp(0.5rem, 1vw, 0.75rem);
`;

const Title = styled.h2`
  font-size: clamp(1.75rem, 4vw, 3.25rem);
  font-weight: 600;
  line-height: 1.1;
  color: #FFF4E3;
  margin: 0;
  font-family: 'Inter', sans-serif; /* Using a clean sans-serif as per image */
  
  @media (max-width: 968px) {
    font-size: clamp(1.5rem, 5vw, 2.5rem);
  }
  
  @media (max-width: 480px) {
    font-size: clamp(1.125rem, 5vw, 1.5rem);
  }
`;

const Description = styled.p`
  font-size: clamp(0.875rem, 1.5vw, 1.1rem);
  line-height: 1.6;
  color: #FFF;
  margin: 0;
  font-family: 'Norwige Light', sans-serif;
  
  @media (max-width: 968px) {
    font-size: clamp(0.8125rem, 2vw, 1rem);
  }
`;

const CTAWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: clamp(1rem, 2vw, 1.5rem);
  margin-top: clamp(1rem, 2vw, 2rem);
  width: 100%;
  padding-left: clamp(1.875rem, 3vw, 2.5rem);
  
  @media (max-width: 968px) {
    justify-content: center;
    padding-left: 0;
  }

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
  }
`;

const RightSection = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  min-height: 450px;
  width: 100%;

  @media (max-width: 968px) {
    margin-top: 2rem;
    min-height: 350px;
  }
`;

const ArrowButton = styled(motion.button)`
  width: clamp(3.75rem, 6vw, 5rem);
  height: clamp(3.75rem, 6vw, 5rem);
  border-radius: 50%;
  background-color: #FFF4E3;
  border: 2px solid #FFF4E3;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  z-index: 2;
  flex-shrink: 0;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 0.25rem 0.75rem rgba(0, 0, 0, 0.15);
  }
  
  svg {
    width: 35%;
    height: 35%;
    stroke: #000;
  }
  
  @media (min-width: 969px) {
    &::before {
      content: '';
      position: absolute;
      width: 100%;
      height: 100%;
      left: -62.5%;
      border-radius: 50%;
      border: 2px solid #FFF4E3;
      background: transparent;
      z-index: -1;
    }
    
    &::after {
      content: '';
      position: absolute;
      width: 100%;
      height: 100%;
      right: -62.5%;
      border-radius: 50%;
      border: 2px solid #FFF4E3;
      background: transparent;
      z-index: -1;
    }
  }

  @media (max-width: 968px) {
    width: clamp(3rem, 10vw, 3.75rem);
    height: clamp(3rem, 10vw, 3.75rem);
  }
`;

const CTAButton = styled(motion.a)`
  display: inline-block;
  text-decoration: none;
  padding: clamp(0.75rem, 1.5vw, 1.125rem) clamp(1.5rem, 3vw, 2.5rem);
  border: none;
  border-radius: 41.444px;
  background: linear-gradient(112deg, #EA9A61 6.46%, #B16937 34.96%, #A64D2B 63.88%, #42201C 97.63%);
  box-shadow: 3px 4px 4px 0 rgba(255, 244, 227, 0.15) inset, 0 4.385px 4.385px 0 rgba(0, 0, 0, 0.25);
  color: #FFF;
  font-size: clamp(0.75rem, 1.2vw, 1rem);
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
    box-shadow: 3px 4px 4px 0 rgba(255, 244, 227, 0.15) inset, 0 8px 25px rgba(0, 0, 0, 0.4);
  }
  
  @media (max-width: 480px) {
    font-size: clamp(0.75rem, 3vw, 0.875rem);
    padding: 0.75rem 1.5rem;
  }
`;

const ElevateSection: React.FC = () => {
  return (
    <SectionContainer>
      {/* Top Left Gradient Blob */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: 'clamp(25rem, 50vw, 50rem)',
          height: 'clamp(25rem, 50vw, 50rem)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 0,
          background: 'rgba(96, 62, 37, 0.60)',
          filter: 'blur(clamp(6.25rem, 12.5vw, 12.5rem))',
          transform: 'translate(-30%, -30%)'
        }}
      />
      {/* Bottom Right Gradient Blob */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: 'clamp(25rem, 50vw, 50rem)',
          height: 'clamp(25rem, 50vw, 50rem)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 0,
          background: 'rgba(96, 62, 37, 0.60)',
          filter: 'blur(clamp(6.25rem, 12.5vw, 12.5rem))',
          transform: 'translate(30%, 30%)'
        }}
      />
      <BannerCard>
        <ContentWrapper>
          <LeftContent>
            <TextGroup>
              <Title>Take a look at our latest website case study!</Title>
            </TextGroup>

            <CTAWrapper>
              <ArrowButton
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = '/casestudy'}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </ArrowButton>

              <CTAButton
                href="/casestudy"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                READ THE STORY
              </CTAButton>
            </CTAWrapper>
          </LeftContent>

          <RightSection>
            <div className="w-full max-w-[380px]">
              <CardSwap width="100%" height={280} delay={4000}>
                <Card>
                  <img src="/rov_album_1.webp" alt="ROV Album 1" className="w-full h-full object-cover rounded-xl" />
                </Card>
                <Card>
                  <img src="/rov_album_2.webp" alt="ROV Album 2" className="w-full h-full object-cover rounded-xl" />
                </Card>
                <Card>
                  <img src="/rov_album_3.webp" alt="ROV Album 3" className="w-full h-full object-cover rounded-xl" />
                </Card>
              </CardSwap>
            </div>
          </RightSection>
        </ContentWrapper>
      </BannerCard>
    </SectionContainer>
  );
};

export default ElevateSection;