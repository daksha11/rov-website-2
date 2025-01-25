{/*
import { motion } from "framer-motion";
import { Play } from "lucide-react";

export default function Hero() {
  return (
    <section id="hero" className="relative h-screen overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        poster="https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3"
      >
        <source
          src="https://cdn.coverr.co/videos/coverr-a-concert-venue-with-purple-lights-2683/1080p.mp4"
          type="video/mp4"
        />
      </video>

      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black" />

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="absolute inset-0 flex flex-col items-center justify-center"
      >
        <motion.h1
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="text-6xl md:text-8xl font-bold mb-8 text-center text-white"
        >
          RANGE OF VIEW
        </motion.h1>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.8, ease: "easeOut", delay: 0.5 }}
          className="group flex items-center gap-2 bg-white text-black px-8 py-3 rounded-full hover:bg-gray-200 transition"
        >
          <Play className="w-5 h-5" />
          <span>Latest Release</span>
        </motion.button>
      </motion.div>
    </section>
  );
}
*/}
import React from 'react';
import styled, { keyframes } from 'styled-components';

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
  animation: 
    ${fadeIn} 0.1s 1.2s forwards,
    ${typing} 4s steps(40, end) 1s forwards,
    ${blinkCaret} 0.75s step-end 1s infinite;
  border-right: 0.15em solid white;

  @media (max-width: 768px) {
    font-size: 1rem;
    letter-spacing: 0.1em;
    white-space: normal; // Allow text to wrap on mobile
  }
`;

const Container = styled.div`
  background-color: black;
  color: white;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    padding: 20px;
    height: auto; // Adjust height for mobile
  }
`;

const Logo = styled(SlideInTop)`
  position: absolute;
  top: 20px;
  left: 20px;

  @media (max-width: 768px) {
    position: relative;
    top: 0;
    left: 0;
    margin-bottom: 20px;
    text-align: center; // Center logo on mobile
    width: 100%; // Full width for better alignment
  }
`;

const CenterImage = styled(SlideInRight)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;

  @media (max-width: 768px) {
    justify-content: flex-start;
    margin-bottom: 20px; // Add spacing below the image
  }
`;

const Heading = styled(SlideInTop)`
  position: absolute;
  top: 20px;
  right: 20px;
  text-align: right;

  @media (max-width: 768px) {
    position: relative;
    top: 0;
    right: 0;
    text-align: left;
    font-size: 2rem;
    margin-bottom: 20px;
    width: 100%; // Full width for better alignment
  }
`;

const TypingTextWrapper = styled.div`
  position: absolute;
  bottom: 20px;
  left: 20px;
  font-size: 1.2rem;

  @media (max-width: 768px) {
    position: relative;
    bottom: 0;
    left: 0;
    margin-top: 20px;
    width: 100%; // Full width for better alignment
  }
`;

const Hero: React.FC = () => {
  return (
    <Container>
      <Logo>
        <img 
          src="rov-logo.png" 
          alt="ROV Logo" 
          style={{ width: '100px', height: 'auto' }} 
        />
      </Logo>
      <CenterImage>
        <img 
          src="rov-colour.png" 
          alt="ROV" 
          style={{ maxWidth: '100%', height: 'auto' }} 
        />
      </CenterImage>
      <Heading>
        <div style={{ fontSize: '3rem', fontWeight: 'bold', lineHeight: '1.2' }}>
          CREATIVE<br />STUDIO
        </div>
      </Heading>
      <TypingTextWrapper>
        <TypingText>
          Creation, production & promotion of artists. In Atlanta. And everywhere.
        </TypingText>
      </TypingTextWrapper>
    </Container>
  );
};

export default Hero;