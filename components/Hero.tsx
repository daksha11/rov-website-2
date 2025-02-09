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
`;

const Logo = styled(SlideInTop)`
  position: absolute;
  top: 20px;
  left: 20px;
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
`;

const TypingTextWrapper = styled.div`
  position: absolute;
  bottom: 20px;
  left: 20px;
  font-size: 1.2rem;
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