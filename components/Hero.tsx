import React from 'react';
import styled, { keyframes, createGlobalStyle } from 'styled-components';
import Aurora from './Aurora'; // Adjust the import path based on your file structure

// Global styles for custom fonts
const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'FlightMaybeMaj';
    src: url('/fonts/Flight mAybe Maj.ttf') format('truetype');
    font-weight: normal;
    font-style: normal;
  }

  @font-face {
    font-family: 'ProximaNovaBlack';
    src: url('/fonts/proximanova_black.ttf') format('truetype');
    font-weight: normal;
    font-style: normal;
  }
`;

// Keyframes for animations
const slideInTop = keyframes`
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const slideInRight = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const typing = keyframes`
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
`;

const blinkCaret = keyframes`
  from, to {
    border-color: transparent;
  }
  50% {
    border-color: white;
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const SlideInTop = styled.div`
  animation: ${slideInTop} 1s ease-out forwards;
`;

const SlideInRight = styled.div`
  animation: ${slideInRight} 1s ease-out forwards;
`;

const TypingText = styled.div`
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  letter-spacing: 0.15em;
  opacity: 0;
  font-family: 'ProximaNovaBlack', sans-serif;
  animation: 
    ${fadeIn} 0.1s 1.2s forwards,
    ${typing} 4s steps(40, end) 1s forwards,
    ${blinkCaret} 0.75s step-end 1s infinite;
  border-right: 0.15em solid white;
  font-size: 1.2rem;

  @media (max-width: 768px) {
    font-size: 0.44rem;
    letter-spacing: 0.05em;
  }
`;

const Container = styled.div`
  background-color: black;
  color: white;
  min-height: min-content;
  padding: 80px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  font-family: 'ProximaNovaBlack', sans-serif;

  @media (max-width: 768px) {
    padding: 60px 10px;
  }
`;

const Logo = styled(SlideInTop)`
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 10; /* Ensure logo stays above Aurora */

  img {
    width: 100px;
    height: auto;
  }

  @media (max-width: 768px) {
    top: 10px;
    left: 10px;
    
    img {
      width: 60px;
    }
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 5; /* Ensure content stays above Aurora */

  @media (max-width: 768px) {
    gap: 10px;
  }
`;

const CenterImage = styled(SlideInRight)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const Heading = styled(SlideInTop)`
  position: absolute;
  top: 20px;
  right: 20px;
  text-align: right;
  font-family: 'FlightMaybeMaj', sans-serif;
  z-index: 10; /* Ensure heading stays above Aurora */

  @media (max-width: 768px) {
    top: 10px;
    right: 10px;
    
    div {
      font-size: 1.5rem !important;
    }
  }
`;

const TypingTextWrapper = styled.div`
  text-align: center;
  padding: 0 20px;
  margin-top: -20px;

  @media (max-width: 768px) {
    padding: 0 10px;
    margin-top: -10px;
  }
`;

const AuroraWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 60%; /* Extend down to just above the rov-colour logo */
  margin-bottom: 40px; /* Add gap between Aurora and the logo */
  z-index: 1; /* Place Aurora behind logo and heading but above other content */

  @media (max-width: 768px) {
    height: 50%; /* Adjust for smaller screens */
    margin-bottom: 20px; /* Smaller gap on mobile */
  }
`;

const Hero: React.FC = () => {
  return (
    <Container style={{ height: "100vh" }}>
      <GlobalStyle />
      <AuroraWrapper>
        <Aurora 
          colorStops={["#ff3300", "#ffbf66", "#00d8ff"]} 
          amplitude={1.0} 
        />
      </AuroraWrapper>
      <Logo>
        <img 
          src="rov-logo.png" 
          alt="ROV Logo"
        />
      </Logo>
      <ContentWrapper>
        <CenterImage>
          <img 
            src="rov-colour.png" 
            alt="ROV" 
            style={{ maxWidth: '100%', height: 'auto' }} 
          />
        </CenterImage>
        <TypingTextWrapper>
          <TypingText>
            Creation, production & promotion of artists. In Atlanta. And everywhere.
          </TypingText>
        </TypingTextWrapper>
      </ContentWrapper>
      <Heading>
        <div style={{ fontSize: '3rem', fontWeight: 'bold', lineHeight: '1.2' }}>
          CREATIVE<br />STUDIO
        </div>
      </Heading>
    </Container>
  );
};

export default Hero;