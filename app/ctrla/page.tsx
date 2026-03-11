"use client";

import { useEffect } from "react";
import TiltedCard from "@/components/TiltedCard";
import CtrlAFooter from "@/components/CtrlAFooter";
import { NavigationDock } from "@/components/NavDoc";
import styled from "styled-components";


const StyledHeroBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  background-color: #000000;
  overflow: hidden;

  .glow-blob {
    position: absolute;
    border-radius: 50%;
    filter: blur(120px);
    pointer-events: none;
    opacity: 0.6;
    z-index: 1;
  }

  .glow-1 {
    top: -10%;
    left: -10%;
    width: 60%;
    height: 60%;
    background: radial-gradient(circle, rgba(234, 154, 97, 0.3) 0%, transparent 70%);
  }

  .glow-2 {
    bottom: -10%;
    right: -10%;
    width: 50%;
    height: 50%;
    background: radial-gradient(circle, rgba(177, 105, 55, 0.2) 0%, transparent 70%);
  }

  .void-pulse {
    width: 100%;
    height: 100%;
    background-color: rgba(10, 10, 10, 0.3);
    filter: url(#void-texture);
    position: relative;
    z-index: 2;
  }

  .orbit-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at center, transparent 0%, rgba(0, 0, 0, 0.5) 100%);
    pointer-events: none;
    z-index: 3;
  }

  .texture-filter {
    position: absolute;
    width: 0;
    height: 0;
  }
`;

const HeroBackground = () => {
  return (
    <StyledHeroBackground>
      {/* Background Glows */}
      <div className="glow-blob glow-1" />
      <div className="glow-blob glow-2" />

      {/* Texture Layer */}
      <div className="void-pulse">
        <span className="orbit-overlay" />
        <svg className="texture-filter">
          <filter id="void-texture">
            <feTurbulence result="noise" numOctaves={4} baseFrequency="0.015" type="turbulence" />
            <feGaussianBlur result="blur" stdDeviation={0.5} in="noise" />
            <feSpecularLighting result="specular" lightingColor="#EA9A61" specularExponent={40} specularConstant={0.5} surfaceScale={2} in="blur">
              <feDistantLight elevation={45} azimuth={90} />
            </feSpecularLighting>
            <feComposite result="lit" operator="over" in2="SourceGraphic" in="specular" />
            <feBlend mode="screen" in2="lit" in="SourceGraphic" />
          </filter>
        </svg>
      </div>
    </StyledHeroBackground>
  );
}

const StyledCursor = styled.span`
  display: inline-block;
  width: 3px;
  height: clamp(48px, 9vw, 108px);
  background: #EA9A61;
  margin-left: 6px;
  vertical-align: middle;
  border-radius: 2px;
  animation: blink 1s step-end infinite;

  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }
`;

const StyledProgressFill = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 0%;
  background: linear-gradient(90deg, #EA9A61, #B16937);
  border-radius: 2px;
  animation: fillBar 2.5s ease-out 0.5s forwards;

  @keyframes fillBar {
    to { width: 68%; }
  }
`;

function ComingSoonHero() {
  return (
    <section
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        backgroundColor: '#000000',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <HeroBackground />

      {/* Stickers — desktop only */}
      <div className="hidden md:block" style={{ position: 'absolute', top: '5%', left: '4%', width: '160px', height: '160px', backgroundImage: 'url(/ctrla/andresticker.webp)', backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }} />
      <div className="hidden md:block" style={{ position: 'absolute', top: '6%', right: '5%', width: '175px', height: '175px', backgroundImage: 'url(/ctrla/benzsticker.webp)', backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }} />
      <div className="hidden md:block" style={{ position: 'absolute', bottom: '8%', left: '5%', width: '185px', height: '185px', backgroundImage: 'url(/ctrla/gradysticker.webp)', backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }} />
      <div className="hidden md:block" style={{ position: 'absolute', bottom: '10%', right: '5%', width: '170px', height: '170px', backgroundImage: 'url(/ctrla/tunnelsticker.webp)', backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }} />
      <div className="hidden lg:block" style={{ position: 'absolute', top: '20%', left: '14%', width: '155px', height: '155px', backgroundImage: 'url(/ctrla/carsticker.webp)', backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }} />
      <div className="hidden lg:block" style={{ position: 'absolute', top: '20%', right: '14%', width: '165px', height: '165px', backgroundImage: 'url(/ctrla/grillsticker.webp)', backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }} />
      <div className="hidden lg:block" style={{ position: 'absolute', bottom: '20%', left: '20%', width: '155px', height: '155px', backgroundImage: 'url(/ctrla/atlsticker.webp)', backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }} />
      <div className="hidden lg:block" style={{ position: 'absolute', bottom: '22%', right: '18%', width: '150px', height: '150px', backgroundImage: 'url(/ctrla/martasticker.webp)', backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }} />

      {/* Center ghost sticker */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%) translateY(30px)',
          width: 'clamp(220px, 30vw, 320px)',
          height: 'clamp(220px, 30vw, 320px)',
          backgroundImage: 'url(/ctrla/futuresticker.webp)',
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          zIndex: 1,
          opacity: 0.25,
        }}
      />

      {/* Center content */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px',
          padding: '0 20px',
        }}
      >
        {/* Top label */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: 'clamp(24px, 4vw, 48px)', height: '1px', backgroundColor: 'rgba(234,154,97,0.5)' }} />
          <span
            style={{
              fontFamily: 'Norwige, sans-serif',
              fontStyle: 'italic',
              color: '#EA9A61',
              fontSize: 'clamp(11px, 1.5vw, 15px)',
              letterSpacing: '5px',
              opacity: 0.9,
            }}
          >
            CTRL A
          </span>
          <div style={{ width: 'clamp(24px, 4vw, 48px)', height: '1px', backgroundColor: 'rgba(234,154,97,0.5)' }} />
        </div>

        {/* Main heading */}
        <div style={{ lineHeight: '0.88', position: 'relative' }}>
          <h1
            style={{
              fontSize: 'clamp(64px, 13vw, 140px)',
              fontWeight: '900',
              fontStyle: 'italic',
              color: '#FFFFFF',
              margin: 0,
              letterSpacing: '-1px',
              fontFamily: 'Norwige, sans-serif',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            COMING
          </h1>
          <h1
            style={{
              fontSize: 'clamp(64px, 13vw, 140px)',
              fontWeight: '900',
              fontStyle: 'italic',
              color: '#FFFFFF',
              margin: 0,
              letterSpacing: '-1px',
              fontFamily: 'Norwige, sans-serif',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            SOON
            <StyledCursor />
          </h1>
        </div>

        {/* Dashed badge — ctrl+a wordplay */}
        <div
          style={{
            border: '1px dashed rgba(234,154,97,0.35)',
            borderRadius: '4px',
            padding: 'clamp(6px, 1vw, 10px) clamp(16px, 3vw, 28px)',
            marginTop: '4px',
          }}
        >
          <span
            style={{
              fontFamily: 'Norwige, sans-serif',
              fontStyle: 'italic',
              color: 'rgba(255,244,227,0.55)',
              fontSize: 'clamp(10px, 1.4vw, 14px)',
              letterSpacing: '5px',
            }}
          >
            SELECT WHAT&apos;S NEXT
          </span>
        </div>

        {/* Progress bar */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', marginTop: '8px', width: 'clamp(160px, 20vw, 240px)' }}>
          <div
            style={{
              width: '100%',
              height: '2px',
              backgroundColor: 'rgba(255,255,255,0.08)',
              borderRadius: '2px',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <StyledProgressFill />
          </div>
          <span
            style={{
              fontFamily: 'monospace',
              color: 'rgba(234,154,97,0.45)',
              fontSize: 'clamp(9px, 1.1vw, 11px)',
              letterSpacing: '3px',
            }}
          >
            IN THE WORKS
          </span>
        </div>
      </div>
    </section>
  );
}

export default function CtrlAPage() {
  // Reset scroll on mount
  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    // Set body styles for this page
    document.body.style.backgroundColor = '#000000';
    document.body.style.overflowX = 'hidden';
    document.body.style.height = 'auto';

    return () => {
      // Reset on unmount
      document.body.style.backgroundColor = '';
      document.body.style.overflowX = '';
      document.body.style.height = '';
    };
  }, []);

  return (
    <div style={{ backgroundColor: '#000000', minHeight: '100vh', width: '100%', overflowX: 'hidden' }}>
      <NavigationDock />
      {/* Hero Section */}
      <ComingSoonHero />

      {/* Tool Kit Section */}
      <section
        style={{
          backgroundColor: '#000000',
          padding: '80px 40px',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Tool Kit Title */}
        <h2
          style={{
            fontSize: '64px',
            fontWeight: '700',
            color: '#FFFFFF',
            marginBottom: '80px',
            textAlign: 'center',
            letterSpacing: '2px',
            fontFamily: 'Norwige',
          }}
        >
          TOOL KIT
        </h2>

        {/* Cards Container */}
        <div
          style={{
            display: 'flex',
            gap: '40px',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
            maxWidth: '1400px',
            perspective: '1000px',
          }}
        >
          {/* MUSIC Card */}
          <div style={{ transform: 'rotate(-8deg)', transformOrigin: 'center' }}>
            <a
              href="https://www.notion.so/Music-2f4055fcd3f88089b425e57ad165b3a9?source=copy_link"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'block' }}
            >
              <TiltedCard
                imageSrc="/music-card.svg"
                altText="Music"
                containerHeight="400px"
                containerWidth="320px"
                imageHeight="400px"
                imageWidth="320px"
                scaleOnHover={1.05}
                rotateAmplitude={12}
                showMobileWarning={false}
                showTooltip={false}
                displayOverlayContent={true}
                overlayContent={
                  <div
                    style={{
                      background: 'linear-gradient(132deg, #EA9A61 4.77%, #B16937 27.26%, #A64D2B 50.09%, #42201C 76.74%)',
                      borderRadius: '25.018px',
                      boxShadow: '0 39.091px 78.182px -18.764px rgba(0, 0, 0, 0.25)',
                      padding: '40px',
                      height: '400px',
                      width: '320px',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    {/* Geometric shapes */}
                    <div style={{ position: 'absolute', top: '30px', left: '30px', width: '60px', height: '60px', border: '3px solid rgba(255,255,255,0.3)', borderRadius: '8px' }} />
                    <div style={{ position: 'absolute', top: '140px', left: '50%', transform: 'translateX(-50%)', width: '180px', height: '180px', border: '3px solid rgba(255,255,255,0.3)', borderRadius: '50%' }} />
                    <div style={{ position: 'absolute', bottom: '100px', right: '30px', width: '80px', height: '80px', border: '3px solid rgba(255,255,255,0.3)', borderRadius: '8px' }} />

                    {/* Text */}
                    <h3
                      style={{
                        position: 'absolute',
                        bottom: '40px',
                        left: '40px',
                        fontSize: '42px',
                        fontWeight: '900',
                        color: '#FFFFFF',
                        margin: 0,
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        fontFamily: 'Norwige',
                      }}
                    >
                      MUSIC
                    </h3>
                  </div>
                }
              />
            </a>
          </div>

          {/* WEB DEVELOPMENT Card */}
          <div style={{ transform: 'rotate(2deg)', transformOrigin: 'center' }}>
            <a
              href="https://www.notion.so/Dev-2f4055fcd3f880fcbefac116b9373821?source=copy_link"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'block' }}
            >
              <TiltedCard
                imageSrc="/web-card.svg"
                altText="Web Development"
                containerHeight="400px"
                containerWidth="320px"
                imageHeight="400px"
                imageWidth="320px"
                scaleOnHover={1.05}
                rotateAmplitude={12}
                showMobileWarning={false}
                showTooltip={false}
                displayOverlayContent={true}
                overlayContent={
                  <div
                    style={{
                      background: 'linear-gradient(132deg, #EA9A61 4.77%, #B16937 27.26%, #A64D2B 50.09%, #42201C 76.74%)',
                      borderRadius: '25.018px',
                      boxShadow: '0 39.091px 78.182px -18.764px rgba(0, 0, 0, 0.25)',
                      padding: '40px',
                      height: '400px',
                      width: '320px',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    {/* Geometric shapes */}
                    <div style={{ position: 'absolute', top: '30px', right: '30px', width: '70px', height: '70px', border: '3px solid rgba(255,255,255,0.3)', borderRadius: '8px' }} />
                    <div style={{ position: 'absolute', top: '140px', left: '50%', transform: 'translateX(-50%)', width: '200px', height: '200px', border: '3px solid rgba(255,255,255,0.3)', borderRadius: '50%' }} />
                    <div style={{ position: 'absolute', bottom: '140px', left: '40px', width: '90px', height: '90px', border: '3px solid rgba(255,255,255,0.3)', borderRadius: '8px' }} />

                    {/* Text */}
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '40px',
                        left: '40px',
                        right: '40px',
                      }}
                    >
                      <h3
                        style={{
                          fontSize: '32px',
                          fontWeight: '900',
                          color: '#FFFFFF',
                          margin: 0,
                          textTransform: 'uppercase',
                          letterSpacing: '1px',
                          lineHeight: '1.2',
                          fontFamily: 'Norwige',
                        }}
                      >
                        WEB
                      </h3>
                      <h3
                        style={{
                          fontSize: '32px',
                          fontWeight: '900',
                          color: '#FFFFFF',
                          margin: 0,
                          textTransform: 'uppercase',
                          letterSpacing: '1px',
                          fontFamily: 'Norwige',
                        }}
                      >
                        DEVELOPMENT
                      </h3>
                    </div>
                  </div>
                }
              />
            </a>
          </div>

          {/* DESIGN Card */}
          <div style={{ transform: 'rotate(-5deg)', transformOrigin: 'center' }}>
            <a
              href="https://www.notion.so/Design-2f4055fcd3f880e8b6cdefdc57baa6b9?source=copy_link"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'block' }}
            >
              <TiltedCard
                imageSrc="/design-card.svg"
                altText="Design"
                containerHeight="400px"
                containerWidth="320px"
                imageHeight="400px"
                imageWidth="320px"
                scaleOnHover={1.05}
                rotateAmplitude={12}
                showMobileWarning={false}
                showTooltip={false}
                displayOverlayContent={true}
                overlayContent={
                  <div
                    style={{
                      background: 'linear-gradient(132deg, #EA9A61 4.77%, #B16937 27.26%, #A64D2B 50.09%, #42201C 76.74%)',
                      borderRadius: '25.018px',
                      boxShadow: '0 39.091px 78.182px -18.764px rgba(0, 0, 0, 0.25)',
                      padding: '40px',
                      height: '400px',
                      width: '320px',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    {/* Geometric shapes */}
                    <div style={{ position: 'absolute', top: '30px', left: '30px', width: '65px', height: '65px', border: '3px solid rgba(255,255,255,0.3)', borderRadius: '8px' }} />
                    <div style={{ position: 'absolute', top: '120px', right: '40px', width: '220px', height: '220px', border: '3px solid rgba(255,255,255,0.3)', borderRadius: '50%' }} />
                    <div style={{ position: 'absolute', bottom: '100px', left: '50px', width: '75px', height: '75px', border: '3px solid rgba(255,255,255,0.3)', borderRadius: '8px' }} />

                    {/* Text */}
                    <h3
                      style={{
                        position: 'absolute',
                        bottom: '40px',
                        right: '40px',
                        fontSize: '42px',
                        fontWeight: '900',
                        color: '#FFFFFF',
                        margin: 0,
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        fontFamily: 'Norwige',
                      }}
                    >
                      DESIGN
                    </h3>
                  </div>
                }
              />
            </a>
          </div>
        </div>
      </section>

      {/* Stay In Touch Section */}
      <section
        style={{
          backgroundColor: '#000000',
          padding: '100px 40px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Title */}
        <h2
          style={{
            fontSize: 'clamp(2.5rem, 8vw, 4rem)',
            fontWeight: '900',
            color: '#FFFFFF',
            marginBottom: '80px',
            textAlign: 'center',
            letterSpacing: '0.05em',
            fontFamily: 'Norwige',
          }}
        >
          STAY IN TOUCH!
        </h2>

        {/* Social Icons Container */}
        <div
          style={{
            display: 'flex',
            gap: '80px',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          {/* Discord */}
          <a
            href="#"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '20px',
              textDecoration: 'none',
              transition: 'transform 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-10px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div
              style={{
                width: '100px',
                height: '100px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg
                width="100"
                height="100"
                viewBox="0 0 71 55"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M60.1045 4.8978C55.5792 2.8214 50.7265 1.2916 45.6527 0.41542C45.5603 0.39851 45.468 0.440769 45.4204 0.525289C44.7963 1.6353 44.105 3.0834 43.6209 4.2216C38.1637 3.4046 32.7345 3.4046 27.3892 4.2216C26.905 3.0581 26.1886 1.6353 25.5617 0.525289C25.5141 0.443589 25.4218 0.40133 25.3294 0.41542C20.2584 1.2888 15.4057 2.8186 10.8776 4.8978C10.8384 4.9147 10.8048 4.9429 10.7825 4.9795C1.57795 18.7309 -0.943561 32.1443 0.293408 45.3914C0.299005 45.4562 0.335386 45.5182 0.385761 45.5576C6.45866 50.0174 12.3413 52.7249 18.1147 54.5195C18.2071 54.5477 18.305 54.5139 18.3638 54.4378C19.7295 52.5728 20.9469 50.6063 21.9907 48.5383C22.0523 48.4172 21.9935 48.2735 21.8676 48.2256C19.9366 47.4931 18.0979 46.6 16.3292 45.5858C16.1893 45.5041 16.1781 45.304 16.3068 45.2082C16.679 44.9293 17.0513 44.6391 17.4067 44.3461C17.471 44.2926 17.5606 44.2813 17.6362 44.3151C29.2558 49.6202 41.8354 49.6202 53.3179 44.3151C53.3935 44.2785 53.4831 44.2898 53.5502 44.3433C53.9057 44.6363 54.2779 44.9293 54.6529 45.2082C54.7816 45.304 54.7732 45.5041 54.6333 45.5858C52.8646 46.6197 51.0259 47.4931 49.0921 48.2228C48.9662 48.2707 48.9102 48.4172 48.9718 48.5383C50.038 50.6034 51.2554 52.5699 52.5959 54.435C52.6519 54.5139 52.7526 54.5477 52.845 54.5195C58.6464 52.7249 64.529 50.0174 70.6019 45.5576C70.6551 45.5182 70.6887 45.459 70.6943 45.3942C72.1747 30.0791 68.2147 16.7757 60.1968 4.9823C60.1772 4.9429 60.1437 4.9147 60.1045 4.8978ZM23.7259 37.3253C20.2276 37.3253 17.3451 34.1136 17.3451 30.1693C17.3451 26.225 20.1717 23.0133 23.7259 23.0133C27.308 23.0133 30.1626 26.2532 30.1066 30.1693C30.1066 34.1136 27.28 37.3253 23.7259 37.3253ZM47.3178 37.3253C43.8196 37.3253 40.9371 34.1136 40.9371 30.1693C40.9371 26.225 43.7636 23.0133 47.3178 23.0133C50.9 23.0133 53.7545 26.2532 53.6986 30.1693C53.6986 34.1136 50.9 37.3253 47.3178 37.3253Z"
                  fill="white"
                />
              </svg>
            </div>
            <span
              style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#FFFFFF',
                letterSpacing: '0.05em',
                fontFamily: 'Norwige',
              }}
            >
              Discord
            </span>
          </a>

          {/* Instagram */}
          <a
            href="#"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '20px',
              textDecoration: 'none',
              transition: 'transform 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-10px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div
              style={{
                width: '100px',
                height: '100px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg
                width="100"
                height="100"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
                  fill="white"
                />
              </svg>
            </div>
            <span
              style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#FFFFFF',
                letterSpacing: '0.05em',
                fontFamily: 'Norwige',
              }}
            >
              Instagram
            </span>
          </a>

          {/* Reddit */}
          <a
            href="#"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '20px',
              textDecoration: 'none',
              transition: 'transform 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-10px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div
              style={{
                width: '100px',
                height: '100px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg
                width="100"
                height="100"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"
                  fill="white"
                />
              </svg>
            </div>
            <span
              style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#FFFFFF',
                letterSpacing: '0.05em',
                fontFamily: 'Norwige',
              }}
            >
              Reddit
            </span>
          </a>
        </div>
      </section>

      {/* Footer */}
      <CtrlAFooter />
    </div>
  );
}