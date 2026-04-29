"use client";

import { useEffect, useState } from "react";
import TiltedCard from "@/components/TiltedCard";
import CtrlAFooter from "@/components/CtrlAFooter";
import { NavigationDock } from "@/components/NavDoc";
import styled from "styled-components";
import { GlobalTeamGlobe } from "@/components/ctrla/GlobalTeamGlobe";
import { BrandKitSection } from "@/components/ctrla/BrandKitSection";


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


function CtrlAHero() {
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
          opacity: 0.18,
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
          padding: '0 20px',
        }}
      >
        {/* Eyebrow */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px' }}>
          <div style={{ width: 'clamp(20px, 3vw, 36px)', height: '1px', background: 'rgba(234,154,97,0.4)' }} />
          <span
            style={{
              fontFamily: "'Roboto', sans-serif",
              color: 'rgba(234,154,97,0.7)',
              fontSize: 'clamp(9px, 1vw, 11px)',
              letterSpacing: '0.32em',
              textTransform: 'uppercase',
            }}
          >
            A ROV Creative Platform
          </span>
          <div style={{ width: 'clamp(20px, 3vw, 36px)', height: '1px', background: 'rgba(234,154,97,0.4)' }} />
        </div>

        {/* Keyboard keys — the hero visual */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'clamp(10px, 1.5vw, 18px)',
            marginBottom: '28px',
            filter: 'drop-shadow(0 8px 32px rgba(234,154,97,0.18))',
          }}
        >
          {/* CTRL key */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              width: 'clamp(110px, 14vw, 180px)',
              height: 'clamp(72px, 9vw, 116px)',
              padding: 'clamp(8px, 1.2vw, 16px) clamp(10px, 1.4vw, 18px)',
              borderRadius: 'clamp(8px, 1vw, 14px)',
              background: 'linear-gradient(160deg, #221410 0%, #140c08 50%, #0d0806 100%)',
              boxShadow: '0 7px 0 #060302, 0 14px 30px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,244,227,0.09), inset 0 0 0 1px rgba(234,154,97,0.13)',
              cursor: 'default',
              transition: 'transform 80ms ease, box-shadow 80ms ease',
              userSelect: 'none',
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = 'translateY(5px)';
              e.currentTarget.style.boxShadow = '0 2px 0 #060302, 0 6px 16px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,244,227,0.06), inset 0 0 0 1px rgba(234,154,97,0.13)';
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = '';
              e.currentTarget.style.boxShadow = '0 7px 0 #060302, 0 14px 30px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,244,227,0.09), inset 0 0 0 1px rgba(234,154,97,0.13)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = '';
              e.currentTarget.style.boxShadow = '0 7px 0 #060302, 0 14px 30px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,244,227,0.09), inset 0 0 0 1px rgba(234,154,97,0.13)';
            }}
          >
            <span
              style={{
                fontFamily: 'Norwige, sans-serif',
                fontStyle: 'italic',
                fontWeight: 900,
                fontSize: 'clamp(22px, 3.5vw, 48px)',
                color: '#EA9A61',
                letterSpacing: '0.03em',
                lineHeight: 1,
                textShadow: '0 0 18px rgba(234,154,97,0.35)',
              }}
            >
              CTRL
            </span>
            <span
              style={{
                fontFamily: "'Roboto', sans-serif",
                fontSize: 'clamp(7px, 0.8vw, 9px)',
                color: 'rgba(234,154,97,0.35)',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                alignSelf: 'flex-end',
              }}
            >
              control
            </span>
          </div>

          {/* Plus */}
          <span
            style={{
              fontFamily: 'Norwige, sans-serif',
              fontStyle: 'italic',
              fontSize: 'clamp(16px, 2.5vw, 30px)',
              color: 'rgba(234,154,97,0.3)',
              lineHeight: 1,
              userSelect: 'none',
            }}
          >
            +
          </span>

          {/* A key */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              width: 'clamp(72px, 9vw, 116px)',
              height: 'clamp(72px, 9vw, 116px)',
              padding: 'clamp(8px, 1.2vw, 16px) clamp(10px, 1.4vw, 18px)',
              borderRadius: 'clamp(8px, 1vw, 14px)',
              background: 'linear-gradient(160deg, #221410 0%, #140c08 50%, #0d0806 100%)',
              boxShadow: '0 7px 0 #060302, 0 14px 30px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,244,227,0.09), inset 0 0 0 1px rgba(234,154,97,0.13)',
              cursor: 'default',
              transition: 'transform 80ms ease, box-shadow 80ms ease',
              userSelect: 'none',
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = 'translateY(5px)';
              e.currentTarget.style.boxShadow = '0 2px 0 #060302, 0 6px 16px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,244,227,0.06), inset 0 0 0 1px rgba(234,154,97,0.13)';
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = '';
              e.currentTarget.style.boxShadow = '0 7px 0 #060302, 0 14px 30px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,244,227,0.09), inset 0 0 0 1px rgba(234,154,97,0.13)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = '';
              e.currentTarget.style.boxShadow = '0 7px 0 #060302, 0 14px 30px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,244,227,0.09), inset 0 0 0 1px rgba(234,154,97,0.13)';
            }}
          >
            <span
              style={{
                fontFamily: 'Norwige, sans-serif',
                fontStyle: 'italic',
                fontWeight: 900,
                fontSize: 'clamp(22px, 3.5vw, 48px)',
                color: '#EA9A61',
                letterSpacing: '0.03em',
                lineHeight: 1,
                textShadow: '0 0 18px rgba(234,154,97,0.35)',
              }}
            >
              A
            </span>
            <span
              style={{
                fontFamily: "'Roboto', sans-serif",
                fontSize: 'clamp(7px, 0.8vw, 9px)',
                color: 'rgba(234,154,97,0.35)',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                alignSelf: 'flex-end',
              }}
            >
              select all
            </span>
          </div>
        </div>

        {/* Tagline */}
        <p
          style={{
            fontFamily: 'Norwige, sans-serif',
            fontStyle: 'italic',
            fontWeight: 700,
            fontSize: 'clamp(13px, 1.8vw, 20px)',
            color: 'rgba(255,244,227,0.35)',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            margin: '0 0 18px',
          }}
        >
          The Creative Command
        </p>

        {/* Amber rule */}
        <div
          style={{
            width: 40,
            height: 1,
            background: 'linear-gradient(90deg, transparent 0%, rgba(234,154,97,0.6) 50%, transparent 100%)',
            margin: '0 auto 18px',
          }}
        />

        {/* Descriptor */}
        <p
          style={{
            fontFamily: "'Roboto', sans-serif",
            color: 'rgba(255,244,227,0.38)',
            fontSize: 'clamp(12px, 1.4vw, 14px)',
            letterSpacing: '0.02em',
            maxWidth: '360px',
            lineHeight: 1.7,
            margin: '0 0 26px',
          }}
        >
          Music. Design. Web. Everything a creative needs, one command away.
        </p>

        {/* Category pills */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {['MUSIC', 'DESIGN', 'WEB DEV'].map((label) => (
            <span
              key={label}
              style={{
                fontFamily: 'Norwige, sans-serif',
                fontStyle: 'italic',
                fontSize: 'clamp(8px, 0.9vw, 10px)',
                letterSpacing: '0.22em',
                color: 'rgba(234,154,97,0.55)',
                border: '1px solid rgba(234,154,97,0.15)',
                borderRadius: '100px',
                padding: '5px 14px',
              }}
            >
              {label}
            </span>
          ))}
        </div>

        {/* CTA — button-in-button */}
        <a
          href="/ctrla/magazine"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            borderRadius: '100px',
            paddingLeft: '24px',
            paddingRight: '6px',
            paddingTop: '6px',
            paddingBottom: '6px',
            background: 'linear-gradient(132deg, #EA9A61 4.77%, #B16937 27.26%, #A64D2B 50.09%, #42201C 76.74%)',
            boxShadow: '0 16px 40px -14px rgba(177,105,55,0.55), inset 0 1px 0 rgba(255,244,227,0.18), inset 0 0 0 1px rgba(255,244,227,0.08)',
            fontFamily: "'Roboto', sans-serif",
            fontSize: '0.875rem',
            letterSpacing: '0.05em',
            color: '#FFF4E3',
            textDecoration: 'none',
            transition: 'transform 600ms cubic-bezier(0.32,0.72,0,1)',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
        >
          <span style={{ padding: '4px 0' }}>Explore Magazine</span>
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: '#FFF4E3',
              color: '#3B2114',
              flexShrink: 0,
              boxShadow: '0 4px 10px -2px rgba(0,0,0,0.25)',
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 17L17 7M7 7h10v10" />
            </svg>
          </span>
        </a>
      </div>
    </section>
  );
}


export default function CtrlAContent() {
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
      <CtrlAHero />

      <BrandKitSection />

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
              href="/ctrla/magazine#music"
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
              href="/ctrla/magazine#web-dev"
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
              href="/ctrla/magazine#design"
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

      {/* Global Team Map */}
      <GlobalTeamGlobe />

      {/* Magazine CTA Strip */}
      <section className="relative bg-black px-6 md:px-12 py-8">
        <div className="max-w-7xl mx-auto">
          <div
            className="relative rounded-2xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6"
            style={{
              borderRadius: '15px',
              border: '1px solid #999288',
              background: 'linear-gradient(111deg, #42201C -1.34%, #A64D2B 25.87%, #B16937 59.87%, #EA9A61 93.39%)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            }}
          >
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                <img src="/rov-logo.webp" alt="ROV Logo" className="w-12 h-12 md:w-14 md:h-14 object-contain" />
              </div>
              <div>
                <h3 className="text-white text-2xl md:text-3xl lg:text-4xl font-bold italic mb-2" style={{ fontFamily: 'Norwige, sans-serif' }}>
                  The CTRL A Magazine
                </h3>
                <p className="text-white text-sm md:text-base opacity-80" style={{ fontFamily: "'Roboto', sans-serif" }}>
                  Community-curated toolkits for creatives. No fluff, just signal.
                </p>
              </div>
            </div>

            <a
              href="/ctrla/magazine"
              className="cta-shine flex-shrink-0 inline-flex items-center gap-3 text-white font-semibold cursor-pointer transition-all duration-300 hover:scale-105"
              style={{
                fontFamily: 'Norwige, sans-serif',
                borderRadius: '41.444px',
                background: '#0E0A08',
                boxShadow: '0 4px 4px 0 rgba(0, 0, 0, 0.25)',
                padding: 'clamp(0.75rem, 1.2vw, 0.9375rem) clamp(1.5rem, 2.5vw, 2rem)',
                fontSize: 'clamp(0.75rem, 1vw, 0.875rem)',
                letterSpacing: '0.05em',
              }}
            >
              READ NOW
            </a>
          </div>
        </div>
      </section>

      {/* Tape 3 Coming Soon */}
      <section className="relative bg-black overflow-hidden" style={{ padding: "clamp(60px, 10vw, 100px) clamp(16px, 5vw, 60px)" }}>
        {/* Subtle glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(234,154,97,0.05) 0%, transparent 60%)" }}
        />

        <div className="relative z-10 max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-10 md:gap-16">
          {/* Mini spinning vinyl */}
          <div className="relative w-36 h-36 md:w-48 md:h-48 shrink-0">
            <div
              className="absolute inset-0 rounded-full"
              style={{
                animation: "spin 6s linear infinite",
                background: `conic-gradient(
                  from 0deg,
                  #1a1210 0deg, #2a1e18 30deg, #1a1210 60deg, #2a1e18 90deg,
                  #1a1210 120deg, #2a1e18 150deg, #1a1210 180deg, #2a1e18 210deg,
                  #1a1210 240deg, #2a1e18 270deg, #1a1210 300deg, #2a1e18 330deg, #1a1210 360deg
                )`,
                boxShadow: "0 0 40px rgba(234,154,97,0.1), inset 0 0 20px rgba(0,0,0,0.5)",
              }}
            >
              {[25, 40, 55, 70, 85].map((pct) => (
                <div
                  key={pct}
                  className="absolute rounded-full border border-white/[0.04]"
                  style={{ inset: `${(100 - pct) / 2}%` }}
                />
              ))}
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="w-[28%] h-[28%] rounded-full flex items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg, #EA9A61 0%, #B16937 40%, #42201C 100%)",
                    boxShadow: "inset 0 1px 4px rgba(0,0,0,0.3)",
                  }}
                >
                  <div className="w-[18%] h-[18%] rounded-full bg-black/60" />
                </div>
              </div>
            </div>
          </div>

          {/* Text */}
          <div className="text-center md:text-left flex-1">
            <span
              className="block text-xs uppercase tracking-[0.3em] text-[#EA9A61]/50 mb-3"
              style={{ fontFamily: "'Roboto', sans-serif" }}
            >
              Coming Soon
            </span>
            <h2
              className="text-white text-4xl md:text-5xl lg:text-6xl font-bold italic leading-[0.95] mb-4"
              style={{ fontFamily: "Norwige, sans-serif" }}
            >
              The ROV{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: "linear-gradient(112deg, #42201C 6.46%, #A64D2B 34.96%, #B16937 63.88%, #EA9A61 97.63%)" }}
              >
                Tape 3
              </span>
            </h2>
            <p
              className="text-white/40 text-sm md:text-base leading-relaxed max-w-lg mb-6"
              style={{ fontFamily: "'Roboto', sans-serif" }}
            >
              A curated multi-artist tape. Afrobeats, RnB, soul, Atlanta energy.
              Cross-genre, culture-forward, and unapologetically ROV.
            </p>
            <a
              href="/ctrla/tape3"
              className="cta-shine inline-flex items-center gap-2 text-white font-semibold transition-all duration-300 hover:scale-105"
              style={{
                fontFamily: "Norwige, sans-serif",
                borderRadius: "41.444px",
                background: "linear-gradient(112deg, #42201C 6.46%, #A64D2B 34.96%, #B16937 63.88%, #EA9A61 97.63%)",
                boxShadow: "3px 4px 4px 0 rgba(255, 244, 227, 0.15) inset, 0 4.385px 4.385px 0 rgba(0, 0, 0, 0.25)",
                padding: "0.75rem 1.75rem",
                fontSize: "0.875rem",
                letterSpacing: "0.05em",
              }}
            >
              View Creative Brief
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <CtrlAFooter />
    </div>
  );
}
