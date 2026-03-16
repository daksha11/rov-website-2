"use client";

import { useEffect, useState } from "react";
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
              textAlign: 'center',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              COMING
            </span>
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              SOON
              <StyledCursor />
            </span>
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

/* ═══════════════════════════════════════════════════════
   GLOBAL TEAM MAP — interactive dot-map with team locations
   ═══════════════════════════════════════════════════════ */

const TEAM_LOCATIONS = [
  { city: "Atlanta", country: "USA", label: "HQ", x: 22, y: 40, isPrimary: true },
  { city: "Savannah", country: "USA", label: "GA", x: 23.5, y: 43, isPrimary: false },
  { city: "Toronto", country: "Canada", label: "CAN", x: 23, y: 33, isPrimary: false },
  { city: "Lagos", country: "Nigeria", label: "NGA", x: 48, y: 56, isPrimary: false },
  { city: "London", country: "UK", label: "UK", x: 43, y: 18, isPrimary: false },
  { city: "Hyderabad", country: "India", label: "IND", x: 68, y: 44, isPrimary: false },
  { city: "Bangalore", country: "India", label: "IND", x: 67, y: 48, isPrimary: false },
];

const StyledMapPulse = styled.div`
  @keyframes mapPulse {
    0% { transform: scale(1); opacity: 0.8; }
    50% { transform: scale(2.2); opacity: 0; }
    100% { transform: scale(1); opacity: 0; }
  }
  @keyframes mapGlow {
    0%, 100% { box-shadow: 0 0 8px rgba(234,154,97,0.4); }
    50% { box-shadow: 0 0 20px rgba(234,154,97,0.7); }
  }
`;

function GlobalTeamMap() {
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <StyledMapPulse>
      <section
        style={{
          backgroundColor: '#000000',
          padding: 'clamp(60px, 10vw, 120px) clamp(20px, 5vw, 60px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
          <div style={{ width: 'clamp(24px, 4vw, 48px)', height: '1px', backgroundColor: 'rgba(234,154,97,0.5)' }} />
          <span style={{ fontFamily: 'Norwige, sans-serif', fontStyle: 'italic', color: '#EA9A61', fontSize: 'clamp(11px, 1.5vw, 14px)', letterSpacing: '5px' }}>
            WORLDWIDE
          </span>
          <div style={{ width: 'clamp(24px, 4vw, 48px)', height: '1px', backgroundColor: 'rgba(234,154,97,0.5)' }} />
        </div>

        <h2
          style={{
            fontSize: 'clamp(2rem, 6vw, 3.5rem)',
            fontWeight: '900',
            color: '#FFFFFF',
            textAlign: 'center',
            fontFamily: 'Norwige, sans-serif',
            fontStyle: 'italic',
            marginBottom: 16,
            letterSpacing: '-0.5px',
          }}
        >
          One Vision,{' '}
          <span style={{
            background: 'linear-gradient(132deg, #EA9A61 4.77%, #B16937 27.26%, #A64D2B 50.09%, #42201C 76.74%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            Global Reach
          </span>
        </h2>
        <p style={{ fontFamily: 'Norwige, sans-serif', fontStyle: 'italic', fontSize: 'clamp(13px, 1.8vw, 16px)', color: 'rgba(255,244,227,0.5)', textAlign: 'center', maxWidth: 500, marginBottom: 'clamp(40px, 6vw, 72px)' }}>
          Our team spans 4 continents — Atlanta roots, international perspective.
        </p>

        {/* Map container */}
        <div style={{ position: 'relative', width: '100%', maxWidth: 1100, aspectRatio: '2 / 1' }}>
          {/* SVG world map — continent shapes filled with dot pattern */}
          <svg viewBox="0 0 1000 500" style={{ width: '100%', height: '100%' }} xmlns="http://www.w3.org/2000/svg">
            <defs>
              {/* Dot pattern that fills continent shapes */}
              <pattern id="landDots" width="8" height="8" patternUnits="userSpaceOnUse">
                <circle cx="4" cy="4" r="1.6" fill="rgba(234,154,97,0.22)" />
              </pattern>
              {/* Subtle background grid */}
              <pattern id="bgDots" width="12" height="12" patternUnits="userSpaceOnUse">
                <circle cx="6" cy="6" r="0.6" fill="rgba(234,154,97,0.04)" />
              </pattern>
            </defs>
            <rect width="1000" height="500" fill="url(#bgDots)" />

            {/* North America */}
            <path d="M120,50 L140,45 L165,42 L190,40 L210,42 L230,48 L245,55 L255,65 L260,78 L258,92 L250,105 L248,120 L252,135 L258,148 L262,160 L268,170 L275,178 L280,190 L278,200 L270,208 L260,215 L248,218 L238,215 L228,210 L218,215 L208,225 L200,235 L195,245 L192,255 L188,248 L180,240 L170,235 L158,232 L148,228 L140,222 L132,215 L125,205 L120,195 L115,185 L112,175 L110,165 L108,155 L106,145 L105,135 L104,125 L103,115 L102,105 L103,95 L106,85 L110,75 L114,65 L118,55 Z" fill="url(#landDots)" stroke="rgba(234,154,97,0.08)" strokeWidth="0.5" />
            {/* Greenland */}
            <path d="M280,30 L300,28 L320,30 L335,38 L340,50 L335,62 L325,70 L310,72 L295,68 L285,58 L280,45 Z" fill="url(#landDots)" stroke="rgba(234,154,97,0.08)" strokeWidth="0.5" />
            {/* Central America + Caribbean */}
            <path d="M192,255 L198,260 L205,268 L210,275 L215,280 L218,288 L216,295 L210,298 L205,295 L200,288 L195,280 L190,272 L188,264 Z" fill="url(#landDots)" stroke="rgba(234,154,97,0.08)" strokeWidth="0.5" />

            {/* South America */}
            <path d="M218,298 L228,295 L240,298 L252,305 L262,315 L270,328 L275,342 L278,358 L276,375 L270,390 L262,402 L252,412 L242,420 L232,425 L225,430 L222,440 L225,448 L228,455 L225,460 L218,458 L212,450 L208,440 L205,428 L202,415 L200,400 L198,385 L198,370 L200,355 L202,340 L205,325 L210,312 Z" fill="url(#landDots)" stroke="rgba(234,154,97,0.08)" strokeWidth="0.5" />

            {/* Europe */}
            <path d="M440,75 L450,70 L462,68 L475,70 L488,72 L498,75 L508,80 L518,78 L528,82 L535,88 L540,98 L538,108 L532,118 L525,125 L518,130 L510,135 L502,138 L495,142 L488,145 L480,148 L472,145 L465,140 L458,135 L452,128 L448,120 L445,112 L442,105 L440,95 L439,85 Z" fill="url(#landDots)" stroke="rgba(234,154,97,0.08)" strokeWidth="0.5" />
            {/* British Isles */}
            <path d="M425,82 L432,78 L438,82 L436,92 L430,98 L424,95 L422,88 Z" fill="url(#landDots)" stroke="rgba(234,154,97,0.08)" strokeWidth="0.5" />
            {/* Scandinavia */}
            <path d="M475,35 L482,32 L490,35 L495,45 L498,58 L495,68 L488,72 L480,68 L475,58 L472,48 Z" fill="url(#landDots)" stroke="rgba(234,154,97,0.08)" strokeWidth="0.5" />

            {/* Africa */}
            <path d="M445,175 L458,172 L472,170 L488,172 L502,178 L515,185 L525,195 L532,208 L536,222 L538,238 L536,255 L532,272 L525,288 L518,302 L510,315 L502,325 L495,332 L488,338 L482,342 L478,345 L475,348 L478,355 L480,365 L478,372 L472,375 L465,370 L460,362 L455,352 L450,340 L448,328 L446,315 L445,302 L444,288 L443,275 L442,262 L441,248 L440,235 L440,222 L441,208 L442,195 L443,185 Z" fill="url(#landDots)" stroke="rgba(234,154,97,0.08)" strokeWidth="0.5" />

            {/* Asia (Russia + Central + South) */}
            <path d="M540,40 L560,35 L585,32 L610,30 L635,32 L660,35 L685,38 L710,42 L735,48 L755,55 L770,62 L780,70 L788,80 L790,90 L785,100 L778,108 L770,115 L760,120 L748,122 L738,118 L728,115 L718,112 L708,110 L698,112 L688,118 L680,125 L672,132 L665,140 L658,148 L652,158 L648,168 L645,178 L640,188 L632,195 L622,198 L612,195 L605,188 L600,180 L595,172 L590,165 L585,158 L580,152 L575,148 L568,145 L560,142 L552,140 L545,135 L540,128 L538,118 L540,108 L542,98 L540,88 L538,78 L536,68 L535,58 L536,48 Z" fill="url(#landDots)" stroke="rgba(234,154,97,0.08)" strokeWidth="0.5" />

            {/* India */}
            <path d="M648,168 L658,165 L668,168 L678,175 L688,185 L695,198 L698,212 L696,228 L690,242 L682,252 L672,258 L662,255 L655,245 L650,232 L646,218 L644,205 L643,192 L644,180 Z" fill="url(#landDots)" stroke="rgba(234,154,97,0.08)" strokeWidth="0.5" />

            {/* Southeast Asia / Indonesia */}
            <path d="M720,190 L735,185 L750,188 L762,195 L770,205 L772,218 L768,228 L758,232 L748,228 L738,222 L728,215 L722,205 L720,198 Z" fill="url(#landDots)" stroke="rgba(234,154,97,0.08)" strokeWidth="0.5" />
            {/* Japan / Korea */}
            <path d="M795,90 L802,85 L810,88 L815,98 L812,110 L805,118 L798,115 L792,108 L790,100 Z" fill="url(#landDots)" stroke="rgba(234,154,97,0.08)" strokeWidth="0.5" />

            {/* Australia */}
            <path d="M748,340 L768,335 L790,338 L808,345 L822,355 L830,368 L832,382 L828,395 L818,405 L805,410 L790,412 L775,408 L762,400 L752,390 L746,378 L742,365 L744,352 Z" fill="url(#landDots)" stroke="rgba(234,154,97,0.08)" strokeWidth="0.5" />

            {/* Connection lines from Atlanta to each location */}
            {mounted && TEAM_LOCATIONS.slice(1).map((loc, i) => {
              const hq = TEAM_LOCATIONS[0];
              return (
                <line
                  key={`line-${i}`}
                  x1={hq.x * 10} y1={hq.y * 5 + 50}
                  x2={loc.x * 10} y2={loc.y * 5 + 50}
                  stroke="rgba(234,154,97,0.1)"
                  strokeWidth="0.8"
                  strokeDasharray="4 4"
                />
              );
            })}
          </svg>

          {/* Location markers as HTML overlays */}
          {TEAM_LOCATIONS.map((loc) => {
            const isHovered = hoveredCity === loc.city;
            const isHQ = loc.isPrimary;
            return (
              <div
                key={loc.city}
                onMouseEnter={() => setHoveredCity(loc.city)}
                onMouseLeave={() => setHoveredCity(null)}
                style={{
                  position: 'absolute',
                  left: `${loc.x}%`,
                  top: `${loc.y}%`,
                  transform: 'translate(-50%, -50%)',
                  cursor: 'pointer',
                  zIndex: isHovered ? 20 : 10,
                }}
              >
                {/* Pulse ring */}
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: isHQ ? 32 : 24,
                  height: isHQ ? 32 : 24,
                  borderRadius: '50%',
                  border: `1.5px solid ${isHQ ? '#EA9A61' : 'rgba(234,154,97,0.4)'}`,
                  animation: 'mapPulse 3s ease-out infinite',
                  animationDelay: `${Math.random() * 2}s`,
                }} />

                {/* Dot */}
                <div style={{
                  width: isHQ ? 14 : 10,
                  height: isHQ ? 14 : 10,
                  borderRadius: '50%',
                  background: isHQ
                    ? 'linear-gradient(132deg, #EA9A61 4.77%, #B16937 27.26%, #A64D2B 50.09%, #42201C 76.74%)'
                    : '#EA9A61',
                  border: `2px solid ${isHQ ? '#FFF4E3' : 'rgba(255,244,227,0.6)'}`,
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  transform: isHovered ? 'scale(1.5)' : 'scale(1)',
                  animation: isHQ ? 'mapGlow 2s ease-in-out infinite' : undefined,
                  boxShadow: isHovered ? '0 0 20px rgba(234,154,97,0.6)' : '0 0 8px rgba(234,154,97,0.3)',
                }} />

                {/* Tooltip */}
                <div style={{
                  position: 'absolute',
                  bottom: 'calc(100% + 10px)',
                  left: '50%',
                  transform: `translateX(-50%) ${isHovered ? 'translateY(0)' : 'translateY(4px)'}`,
                  opacity: isHovered ? 1 : 0,
                  pointerEvents: 'none',
                  transition: 'opacity 0.3s, transform 0.3s',
                  whiteSpace: 'nowrap',
                  background: 'rgba(30,26,23,0.95)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(234,154,97,0.25)',
                  borderRadius: 10,
                  padding: '8px 14px',
                  textAlign: 'center',
                }}>
                  <p style={{ fontFamily: 'Norwige, sans-serif', fontStyle: 'italic', fontSize: 14, fontWeight: 700, color: '#FFF4E3', margin: 0 }}>
                    {loc.city}
                  </p>
                  <p style={{ fontFamily: 'Norwige, sans-serif', fontStyle: 'italic', fontSize: 11, color: '#EA9A61', margin: '2px 0 0' }}>
                    {loc.country}{isHQ ? ' — Headquarters' : ''}
                  </p>
                  {/* Arrow */}
                  <div style={{
                    position: 'absolute',
                    bottom: -5,
                    left: '50%',
                    transform: 'translateX(-50%) rotate(45deg)',
                    width: 10,
                    height: 10,
                    background: 'rgba(30,26,23,0.95)',
                    borderRight: '1px solid rgba(234,154,97,0.25)',
                    borderBottom: '1px solid rgba(234,154,97,0.25)',
                  }} />
                </div>

                {/* Always-visible city label for HQ */}
                {isHQ && !isHovered && (
                  <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 6px)',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    whiteSpace: 'nowrap',
                    fontFamily: 'Norwige, sans-serif',
                    fontStyle: 'italic',
                    fontSize: 11,
                    color: '#EA9A61',
                    letterSpacing: '0.1em',
                    fontWeight: 700,
                  }}>
                    ATLANTA
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Location tags row */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginTop: 'clamp(24px, 4vw, 48px)' }}>
          {TEAM_LOCATIONS.map(loc => (
            <span
              key={loc.city}
              onMouseEnter={() => setHoveredCity(loc.city)}
              onMouseLeave={() => setHoveredCity(null)}
              style={{
                fontFamily: 'Norwige, sans-serif',
                fontStyle: 'italic',
                fontSize: 'clamp(11px, 1.4vw, 13px)',
                padding: '6px 16px',
                borderRadius: 999,
                border: `1px solid ${hoveredCity === loc.city ? '#EA9A61' : 'rgba(234,154,97,0.15)'}`,
                background: hoveredCity === loc.city ? 'rgba(234,154,97,0.1)' : 'transparent',
                color: hoveredCity === loc.city || loc.isPrimary ? '#EA9A61' : 'rgba(255,244,227,0.4)',
                cursor: 'pointer',
                transition: 'all 0.3s',
                letterSpacing: '0.06em',
              }}
            >
              {loc.city}{loc.isPrimary ? ' (HQ)' : ''}
            </span>
          ))}
        </div>
      </section>
    </StyledMapPulse>
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

      {/* Global Team Map */}
      <GlobalTeamMap />

      {/* Footer */}
      <CtrlAFooter />
    </div>
  );
}
