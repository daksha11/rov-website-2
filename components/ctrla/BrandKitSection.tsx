'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Palette, Type, MessageSquare, FileCode, ArrowUpRight } from 'lucide-react';

const features = [
  { icon: Palette, label: 'Colour tokens', desc: 'Primary, secondary, neutrals. Named and structured.' },
  { icon: Type, label: 'Typography system', desc: 'Headings, body, captions with size scales.' },
  { icon: MessageSquare, label: 'Voice & tone', desc: 'Guidelines every team member can act on.' },
  { icon: FileCode, label: 'Export to .md', desc: 'Drop into any dev or AI-assisted project.' },
];

const swatches = [
  { color: '#C4622D', label: 'Sacral' },
  { color: '#E0A44A', label: 'Solar' },
  { color: '#6B2318', label: 'Root' },
  { color: '#F5EDD8', label: 'Parchment' },
  { color: '#2B1F14', label: 'Dusk' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 70, damping: 16, delay: i * 0.07 },
  }),
};

export function BrandKitSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section
      ref={ref}
      style={{
        background: '#2B1F14',
        borderTop: '1px solid rgba(196,98,45,0.12)',
        borderBottom: '1px solid rgba(196,98,45,0.12)',
        padding: 'clamp(80px, 10vw, 140px) clamp(20px, 5vw, 72px)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Ambient glow — top right */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: '-15%',
          right: '-8%',
          width: '700px',
          height: '700px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(196,98,45,0.055) 0%, transparent 65%)',
          pointerEvents: 'none',
        }}
      />
      {/* Ambient glow — bottom left */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          bottom: '-20%',
          left: '-5%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(66,32,28,0.18) 0%, transparent 65%)',
          pointerEvents: 'none',
        }}
      />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_440px] gap-16 lg:gap-20 items-center">

          {/* ── Left — copy ── */}
          <div className="flex flex-col gap-7">

            {/* Eyebrow */}
            <motion.span
              custom={0} variants={fadeUp} initial="hidden" animate={inView ? 'show' : 'hidden'}
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: '11px',
                letterSpacing: '0.28em',
                color: 'rgba(196,98,45,0.65)',
                textTransform: 'uppercase',
                fontWeight: 500,
              }}
            >
              ROV Tool · Live Now
            </motion.span>

            {/* Headline */}
            <motion.h2
              custom={1} variants={fadeUp} initial="hidden" animate={inView ? 'show' : 'hidden'}
              style={{
                fontFamily: "'Thistora', Georgia, serif",
                fontSize: 'clamp(52px, 7.5vw, 96px)',
                fontWeight: 900,
                fontStyle: 'italic',
                lineHeight: 0.92,
                letterSpacing: '0.06em',
                margin: 0,
              }}
            >
              <span style={{ color: '#F5EDD8' }}>Brand Kit</span>
              <br />
              <span style={{ color: '#F5EDD8' }}>Generator</span>
            </motion.h2>

            {/* Body */}
            <motion.p
              custom={2} variants={fadeUp} initial="hidden" animate={inView ? 'show' : 'hidden'}
              style={{
                fontFamily: "'DM Sans', system-ui, sans-serif",
                fontWeight: 300,
                fontSize: 'clamp(15px, 1.4vw, 17px)',
                color: 'rgba(245,237,216,0.72)',
                lineHeight: 1.78,
                maxWidth: '500px',
                margin: 0,
              }}
            >
              Squashing the gap between designers and editors. Drop in your brand colours, type, and tone. Walk away with a complete, structured system. Designers hand off structure, not screenshots. Editors start building immediately.
            </motion.p>

            {/* Terminal callout */}
            <motion.div
              custom={3} variants={fadeUp} initial="hidden" animate={inView ? 'show' : 'hidden'}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '11px 18px',
                background: 'rgba(0,0,0,0.35)',
                border: '1px solid rgba(255,244,227,0.08)',
                borderRadius: '10px',
                maxWidth: 'max-content',
              }}
            >
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '13px', color: '#C4622D', fontWeight: 700 }}>$</span>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '13px', color: 'rgba(245,237,216,0.72)' }}>
                export <span style={{ color: 'rgba(196,98,45,0.75)' }}>brand-kit.md</span> and drop into any AI build
              </span>
            </motion.div>

            {/* CTA */}
            <motion.div
              custom={4} variants={fadeUp} initial="hidden" animate={inView ? 'show' : 'hidden'}
            >
              <a
                href="/ctrla/brand-kit"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '14px 30px',
                  borderRadius: '9999px',
                  background: 'linear-gradient(132deg, #6B2318 4.77%, #C4622D 40%, #E0A44A 100%)',
                  color: '#F5EDD8',
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  fontSize: '14px',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  fontWeight: 500,
                  textDecoration: 'none',
                  boxShadow: '0 0 0 1px rgba(196,98,45,0.18), 0 8px 32px rgba(42,16,12,0.55)',
                  transition: 'transform 0.22s cubic-bezier(0.16,1,0.3,1), box-shadow 0.22s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 0 0 1px rgba(196,98,45,0.28), 0 16px 48px rgba(42,16,12,0.65)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 0 0 1px rgba(196,98,45,0.18), 0 8px 32px rgba(42,16,12,0.55)';
                }}
              >
                Try the Generator
                <ArrowUpRight size={15} strokeWidth={2.5} />
              </a>
            </motion.div>

            {/* Feature 2x2 grid */}
            <motion.div
              custom={5} variants={fadeUp} initial="hidden" animate={inView ? 'show' : 'hidden'}
              className="grid grid-cols-2 gap-3 pt-2"
            >
              {features.map(({ icon: Icon, label, desc }) => (
                <div
                  key={label}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '5px',
                    padding: '14px 16px',
                    background: 'rgba(255,255,255,0.018)',
                    border: '1px solid rgba(255,244,227,0.06)',
                    borderRadius: '12px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                    <Icon size={12} color="rgba(196,98,45,0.75)" strokeWidth={1.5} />
                    <span style={{ fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: '12px', fontWeight: 500, color: 'rgba(245,237,216,0.75)' }}>{label}</span>
                  </div>
                  <p style={{ fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: '11px', fontWeight: 300, color: 'rgba(245,237,216,0.6)', margin: 0, lineHeight: 1.55 }}>{desc}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ── Right — simulated .md preview card ── */}
          <motion.div
            custom={3} variants={fadeUp} initial="hidden" animate={inView ? 'show' : 'hidden'}
            style={{ position: 'relative' }}
          >
            {/* Glow behind card */}
            <div
              aria-hidden
              style={{
                position: 'absolute',
                inset: '-30px',
                background: 'radial-gradient(ellipse at 60% 40%, rgba(196,98,45,0.09) 0%, transparent 68%)',
                borderRadius: '28px',
                pointerEvents: 'none',
              }}
            />

            {/* macOS-style window card */}
            <div
              style={{
                background: '#1C1208',
                border: '1px solid rgba(245,237,216,0.1)',
                borderRadius: '18px',
                overflow: 'hidden',
                boxShadow: '0 32px 80px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,244,227,0.06)',
              }}
            >
              {/* Window chrome */}
              <div
                style={{
                  padding: '14px 18px',
                  borderBottom: '1px solid rgba(245,237,216,0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '7px',
                  background: 'rgba(255,255,255,0.02)',
                }}
              >
                {['#FF5F57', '#FFBD2E', '#28CA41'].map((c) => (
                  <div key={c} style={{ width: '10px', height: '10px', borderRadius: '50%', background: c, opacity: 0.85 }} />
                ))}
                <span style={{ fontFamily: 'monospace', fontSize: '11px', color: 'rgba(255,244,227,0.5)', marginLeft: '10px' }}>
                  brand-kit.md
                </span>
              </div>

              {/* Colour tokens block */}
              <div style={{ padding: '22px 22px 0' }}>
                <p style={{ fontFamily: 'monospace', fontSize: '10px', color: 'rgba(196,98,45,0.45)', margin: '0 0 12px 0', letterSpacing: '0.05em' }}>
                  ## Colour Tokens
                </p>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '22px' }}>
                  {swatches.map(({ color, label }) => (
                    <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: '7px', alignItems: 'center' }}>
                      <div
                        style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '9px',
                          background: color,
                          border: '1px solid rgba(255,255,255,0.07)',
                          boxShadow: `0 4px 12px ${color}33`,
                        }}
                      />
                      <span style={{ fontFamily: 'monospace', fontSize: '8px', color: 'rgba(255,244,227,0.55)', letterSpacing: '0.03em' }}>{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Typography block */}
              <div
                style={{
                  padding: '0 22px 20px',
                  borderBottom: '1px solid rgba(255,244,227,0.05)',
                }}
              >
                <p style={{ fontFamily: 'monospace', fontSize: '10px', color: 'rgba(196,98,45,0.45)', margin: '0 0 10px 0', letterSpacing: '0.05em' }}>
                  ## Typography
                </p>
                <p style={{ fontFamily: "'Thistora', Georgia, serif", fontSize: '24px', fontStyle: 'italic', fontWeight: 700, color: 'rgba(245,237,216,0.82)', margin: '0 0 5px', lineHeight: 1 }}>
                  Display Heading
                </p>
                <p style={{ fontFamily: "'DM Sans', system-ui, sans-serif", fontWeight: 300, fontSize: '11px', color: 'rgba(245,237,216,0.6)', margin: '0 0 3px' }}>Body · DM Sans Light 16/1.75</p>
                <p style={{ fontFamily: "'DM Mono', monospace", fontSize: '10px', color: 'rgba(245,237,216,0.45)', margin: 0 }}>Caption · DM Mono 12/1.5</p>
              </div>

              {/* Voice & tone block with blinking cursor */}
              <div style={{ padding: '18px 22px 22px', background: 'rgba(0,0,0,0.28)' }}>
                <p style={{ fontFamily: 'monospace', fontSize: '10px', color: 'rgba(196,98,45,0.45)', margin: '0 0 10px 0', letterSpacing: '0.05em' }}>
                  ## Voice &amp; Tone
                </p>
                {['- Grounded, warm, refined', '- Substance over noise', '- Expert without being cold'].map((line, i) => (
                  <p
                    key={i}
                    style={{
                      fontFamily: 'monospace',
                      fontSize: '11px',
                      color: 'rgba(196,98,45,0.52)',
                      margin: '0 0 3px',
                    }}
                  >
                    {line}
                  </p>
                ))}
                <span
                  aria-hidden
                  style={{
                    display: 'inline-block',
                    width: '7px',
                    height: '13px',
                    background: 'rgba(196,98,45,0.55)',
                    marginTop: '7px',
                    borderRadius: '1px',
                    animation: 'bkBlink 1.1s step-end infinite',
                  }}
                />
              </div>
            </div>
          </motion.div>

        </div>
      </div>

      <style>{`
        @keyframes bkBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </section>
  );
}
