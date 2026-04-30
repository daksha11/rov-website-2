'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { MapPin, ArrowUpRight } from 'lucide-react';

const PREVIEW_EVENTS = [
  {
    month: 'MAY',
    dayNum: '1',
    dayName: 'FRI',
    type: 'ART',
    typeColor: 'rgba(196,98,45,0.9)',
    typeBg: 'rgba(196,98,45,0.08)',
    typeBorder: 'rgba(196,98,45,0.18)',
    title: 'Pancakes & Booze Art Show',
    venue: 'Underground Atlanta',
    desc: "North America's largest pop-up art movement. Emerging artists + free pancakes.",
    price: 'Ticketed',
    priceColor: 'rgba(196,98,45,0.55)',
  },
  {
    month: 'MAY',
    dayNum: '9',
    dayName: 'FRI',
    type: 'MUSIC',
    typeColor: 'rgba(74,122,80,0.95)',
    typeBg: 'rgba(74,122,80,0.08)',
    typeBorder: 'rgba(74,122,80,0.18)',
    title: 'No Words ATL Festival',
    venue: 'Little 5 Points',
    desc: 'Musicians, DJs, dancers, and a NOLA-inspired flag parade. 2–11 PM.',
    price: 'Free',
    priceColor: 'rgba(74,122,80,0.8)',
  },
  {
    month: 'MAY',
    dayNum: '15',
    dayName: 'FRI',
    type: 'TECH',
    typeColor: 'rgba(74,63,140,0.9)',
    typeBg: 'rgba(74,63,140,0.08)',
    typeBorder: 'rgba(74,63,140,0.18)',
    title: 'DreamHack Atlanta 2026',
    venue: 'Georgia World Congress Center',
    desc: 'Gaming + creator festival. Cosplay, interactive programming, creator-led stages.',
    price: 'Ticketed',
    priceColor: 'rgba(196,98,45,0.55)',
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 70, damping: 16, delay: i * 0.07 },
  }),
};

export function EventsHubSection() {
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
      <div aria-hidden style={{ position: 'absolute', top: '-12%', left: '-6%', width: '560px', height: '560px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(196,98,45,0.045) 0%, transparent 65%)', pointerEvents: 'none' }} />
      <div aria-hidden style={{ position: 'absolute', bottom: '-18%', right: '-6%', width: '520px', height: '520px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(66,32,28,0.2) 0%, transparent 65%)', pointerEvents: 'none' }} />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_460px] gap-16 lg:gap-20 items-center">

          {/* ── Left ── */}
          <div className="flex flex-col gap-7">

            <motion.div custom={0} variants={fadeUp} initial="hidden" animate={inView ? 'show' : 'hidden'} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '20px', height: '1px', background: 'rgba(196,98,45,0.4)' }} />
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '11px', letterSpacing: '0.28em', color: 'rgba(196,98,45,0.65)', textTransform: 'uppercase' as const, fontWeight: 500 }}>
                ATL Creative Hub · May 2026
              </span>
            </motion.div>

            <motion.h2
              custom={1} variants={fadeUp} initial="hidden" animate={inView ? 'show' : 'hidden'}
              style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(52px, 7.5vw, 96px)', fontWeight: 900, fontStyle: 'italic', lineHeight: 0.92, letterSpacing: '-0.02em', margin: 0 }}
            >
              <span style={{ color: '#F5EDD8' }}>Show</span>
              <br />
              <span style={{ background: 'linear-gradient(132deg, #6B2318 4.77%, #C4622D 40%, #E0A44A 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Up.</span>
            </motion.h2>

            <motion.p custom={2} variants={fadeUp} initial="hidden" animate={inView ? 'show' : 'hidden'} style={{ fontFamily: "'DM Sans', system-ui, sans-serif", fontWeight: 300, fontSize: 'clamp(15px, 1.4vw, 17px)', color: 'rgba(245,237,216,0.65)', lineHeight: 1.78, maxWidth: '460px', margin: 0 }}>
              The ATL creative scene runs on who shows up. Art shows, music festivals, creator cons. Know what is happening this month and be in the room.
            </motion.p>

            <motion.div custom={3} variants={fadeUp} initial="hidden" animate={inView ? 'show' : 'hidden'} style={{ display: 'flex', gap: '36px' }}>
              {[{ num: '10+', label: 'May events' }, { num: 'ATL', label: 'Base city' }, { num: '5', label: 'Free events' }].map(({ num, label }) => (
                <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: 'italic', fontWeight: 700, fontSize: 'clamp(22px, 3vw, 36px)', color: '#F5EDD8', lineHeight: 1 }}>{num}</span>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '10px', color: 'rgba(245,237,216,0.48)', letterSpacing: '0.12em', textTransform: 'uppercase' as const }}>{label}</span>
                </div>
              ))}
            </motion.div>

            <motion.div custom={4} variants={fadeUp} initial="hidden" animate={inView ? 'show' : 'hidden'}>
              <a
                href="/ctrla/events"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '14px 30px', borderRadius: '9999px', background: 'linear-gradient(132deg, #6B2318 4.77%, #C4622D 40%, #E0A44A 100%)', color: '#F5EDD8', fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: '14px', letterSpacing: '0.05em', textTransform: 'uppercase' as const, fontWeight: 500, textDecoration: 'none', boxShadow: '0 0 0 1px rgba(196,98,45,0.18), 0 8px 32px rgba(42,16,12,0.55)', transition: 'transform 0.22s cubic-bezier(0.16,1,0.3,1), box-shadow 0.22s ease' }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 0 0 1px rgba(196,98,45,0.28), 0 16px 48px rgba(42,16,12,0.65)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 0 0 1px rgba(196,98,45,0.18), 0 8px 32px rgba(42,16,12,0.55)'; }}
              >
                Full May Calendar
                <ArrowUpRight size={15} strokeWidth={2.5} />
              </a>
            </motion.div>
          </div>

          {/* ── Right — event cards ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', position: 'relative' }}>
            <div aria-hidden style={{ position: 'absolute', inset: '-24px', background: 'radial-gradient(ellipse at 50% 50%, rgba(196,98,45,0.055) 0%, transparent 68%)', borderRadius: '28px', pointerEvents: 'none' }} />

            {PREVIEW_EVENTS.map((evt, i) => (
              <motion.div
                key={evt.title}
                custom={i + 2} variants={fadeUp} initial="hidden" animate={inView ? 'show' : 'hidden'}
                whileHover={{ borderColor: 'rgba(196,98,45,0.22)', backgroundColor: 'rgba(196,98,45,0.025)' }}
                style={{ display: 'flex', gap: '16px', alignItems: 'center', padding: '18px 20px', background: 'rgba(245,237,216,0.04)', border: '1px solid rgba(245,237,216,0.08)', borderRadius: '16px', overflow: 'hidden', transition: 'border-color 0.25s ease, background-color 0.25s ease', cursor: 'default' }}
              >
                {/* Date badge */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '52px', minWidth: '52px', height: '60px', borderRadius: '10px', background: 'rgba(196,98,45,0.06)', border: '1px solid rgba(196,98,45,0.14)', gap: '1px' }}>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '8px', color: 'rgba(196,98,45,0.5)', letterSpacing: '0.12em', textTransform: 'uppercase' as const }}>{evt.dayName}</span>
                  <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: 'italic', fontWeight: 700, fontSize: '22px', color: '#C4622D', lineHeight: 1 }}>{evt.dayNum}</span>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '8px', color: 'rgba(196,98,45,0.4)', letterSpacing: '0.1em' }}>{evt.month}</span>
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ marginBottom: '5px' }}>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '8px', fontWeight: 500, letterSpacing: '0.2em', color: evt.typeColor, background: evt.typeBg, border: `1px solid ${evt.typeBorder}`, borderRadius: '100px', padding: '2px 8px', textTransform: 'uppercase' as const }}>{evt.type}</span>
                  </div>
                  <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: 'italic', fontWeight: 700, fontSize: '15px', color: 'rgba(245,237,216,0.88)', margin: '0 0 3px', lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{evt.title}</p>
                  <p style={{ fontFamily: "'DM Sans', system-ui, sans-serif", fontWeight: 300, fontSize: '11px', color: 'rgba(245,237,216,0.55)', margin: 0, lineHeight: 1.45 }}>{evt.desc}</p>
                </div>

                {/* Meta */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px', flexShrink: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <MapPin size={9} color="rgba(255,244,227,0.2)" />
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '9px', color: 'rgba(245,237,216,0.22)', letterSpacing: '0.06em' }}>ATL</span>
                  </div>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '9px', color: evt.priceColor, letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>{evt.price}</span>
                </div>
              </motion.div>
            ))}

            <motion.a
              href="/ctrla/events" custom={6} variants={fadeUp} initial="hidden" animate={inView ? 'show' : 'hidden'}
              whileHover={{ borderColor: 'rgba(196,98,45,0.3)' }}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', padding: '13px 20px', borderRadius: '12px', border: '1px dashed rgba(196,98,45,0.14)', background: 'transparent', textDecoration: 'none', transition: 'border-color 0.2s ease', marginTop: '2px' }}
            >
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '10px', color: 'rgba(196,98,45,0.45)', letterSpacing: '0.2em', textTransform: 'uppercase' as const }}>View all 10+ events</span>
              <ArrowUpRight size={10} color="rgba(196,98,45,0.45)" />
            </motion.a>
          </div>

        </div>
      </div>
    </section>
  );
}
