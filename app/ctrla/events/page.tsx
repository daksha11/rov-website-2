'use client';

import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { MapPin, Clock, ArrowLeft, ArrowUpRight, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { NavigationDock } from '@/components/NavDoc';

// ─── Data ───────────────────────────────────────────────────────────────────

type CategoryId = 'art' | 'music' | 'tech' | 'theater' | 'community';

const CATEGORIES: { id: CategoryId; label: string; color: string; bg: string; border: string }[] = [
  { id: 'art',       label: 'Art & Design',       color: '#EA9A61',                    bg: 'rgba(234,154,97,0.07)',   border: 'rgba(234,154,97,0.18)'  },
  { id: 'music',     label: 'Music',               color: '#B16937',                    bg: 'rgba(177,105,55,0.07)',   border: 'rgba(177,105,55,0.18)'  },
  { id: 'tech',      label: 'Tech & Gaming',       color: 'rgba(255,244,227,0.65)',     bg: 'rgba(255,244,227,0.04)', border: 'rgba(255,244,227,0.1)'  },
  { id: 'theater',   label: 'Theater & Fringe',    color: 'rgba(234,154,97,0.65)',      bg: 'rgba(234,154,97,0.05)',  border: 'rgba(234,154,97,0.12)'  },
  { id: 'community', label: 'Community',           color: 'rgba(177,105,55,0.9)',       bg: 'rgba(177,105,55,0.06)',  border: 'rgba(177,105,55,0.14)'  },
];

interface ATLEvent {
  id: number;
  category: CategoryId;
  dayName: string | null;
  dayNum: string | null;
  endDayNum: string | null;
  month: string;
  time: string;
  title: string;
  venue: string;
  city: string;
  desc: string;
  price: string;
  free: boolean;
  featured: boolean;
  link: string;
}

const ALL_EVENTS: ATLEvent[] = [
  {
    id: 1, category: 'art', dayName: 'THU', dayNum: '1', endDayNum: null, month: 'MAY', time: 'Evening',
    title: 'Pancakes & Booze Art Show',
    venue: 'Underground Atlanta', city: 'Atlanta, GA',
    desc: "Hundreds of emerging artists take over Underground Atlanta for one night. Open walls, live DJs, body painting, and free pancakes for the first wave in. Part gallery opening, part block party.",
    price: 'Ticketed', free: false, featured: true,
    link: 'https://www.eventbrite.com/e/the-atlanta-pancakes-booze-art-show-tickets-1983822147446',
  },
  {
    id: 2, category: 'art', dayName: 'SAT', dayNum: '2', endDayNum: '3', month: 'MAY', time: '10am to 5pm',
    title: 'Indie Craft Spring Experience',
    venue: 'Atlanta', city: 'Atlanta, GA',
    desc: 'Over 100 makers from across the Southeast in one space. Ceramics, textiles, prints, jewelry, and handmade goods you will not find on Etsy. Ten dollars to get in.',
    price: '$10 Entry', free: false, featured: false,
    link: 'https://www.artsatl.org/event/indie-craft-spring-experience/2026-05-02/',
  },
  {
    id: 3, category: 'art', dayName: 'SUN', dayNum: '10', endDayNum: '11', month: 'MAY', time: 'All day',
    title: 'Chastain Park Spring Arts Festival',
    venue: 'Chastain Park', city: 'Atlanta, GA',
    desc: 'One of the top 100 arts festivals in the country, right here in ATL. Fine art, crafts, food trucks, and live music across one of the city\'s best parks. Free to walk, free to browse.',
    price: 'Free', free: true, featured: false,
    link: 'https://discoveratlanta.com/stories/things-to-do/cool-things-to-do-in-may-in-atlanta/',
  },
  {
    id: 4, category: 'music', dayName: 'FRI', dayNum: '9', endDayNum: null, month: 'MAY', time: '2pm to 11pm',
    title: 'No Words ATL Instrumental Music Festival',
    venue: 'Little 5 Points', city: 'Atlanta, GA',
    desc: 'Instrumentals only. Little 5 Points transforms for a full day of musicians, dancers, DJs, and a NOLA-style second line parade through the streets. No headliner needed.',
    price: 'Free', free: true, featured: false,
    link: 'https://secretatlanta.co/things-to-do-may/',
  },
  {
    id: 5, category: 'music', dayName: 'SAT', dayNum: '23', endDayNum: '25', month: 'MAY', time: 'All day',
    title: 'Atlanta Jazz Festival',
    venue: 'Piedmont Park', city: 'Atlanta, GA',
    desc: 'Three days of live jazz in Piedmont Park over Memorial Day weekend, completely free. Local artists, food vendors, and open air energy. One of the best things ATL puts on all year.',
    price: 'Free', free: true, featured: true,
    link: 'https://secretatlanta.co/things-to-do-may/',
  },
  {
    id: 6, category: 'music', dayName: null, dayNum: null, endDayNum: null, month: 'MAY', time: 'Ongoing',
    title: 'Six The Musical',
    venue: 'Fox Theatre', city: 'Atlanta, GA',
    desc: 'Six queens. Six stories. The Fox Theatre is the right room for it. Good for a date night or a solo creative reset. Full production, full house most nights.',
    price: 'Ticketed', free: false, featured: false,
    link: 'https://atlanta-ga.events/may/',
  },
  {
    id: 7, category: 'tech', dayName: 'FRI', dayNum: '15', endDayNum: '17', month: 'MAY', time: 'All day',
    title: 'DreamHack Atlanta 2026',
    venue: 'Georgia World Congress Center', city: 'Atlanta, GA',
    desc: 'Gaming, cosplay, creator talks, and interactive experiences across the Georgia World Congress Center. Not just for gamers. Designers and builders will find their crowd here too.',
    price: 'Ticketed', free: false, featured: false,
    link: 'https://dreamhack.com/atlanta/',
  },
  {
    id: 8, category: 'tech', dayName: 'THU', dayNum: '21', endDayNum: '24', month: 'MAY', time: 'All day',
    title: 'MomoCon + Wonder Festival',
    venue: 'Georgia World Congress Center', city: 'Atlanta, GA',
    desc: "Japan's Wonder Festival lands in North America for the first time, inside MomoCon. Figure artists, model makers, collectors, and game culture across 100,000 square feet.",
    price: 'Ticketed', free: false, featured: false,
    link: 'https://secretatlanta.co/things-to-do-may/',
  },
  {
    id: 9, category: 'theater', dayName: 'TUE', dayNum: '27', endDayNum: null, month: 'MAY', time: 'Through Jun 8',
    title: 'Atlanta Fringe Festival',
    venue: 'Little 5 Points, 10 venues', city: 'Atlanta, GA',
    desc: '80 performance groups. 10 venues. 12 days. Theater, dance, comedy, storytelling. The fringe format means you will see things you cannot find anywhere else in the city.',
    price: 'Ticketed', free: false, featured: false,
    link: 'https://discoveratlanta.com/stories/things-to-do/cool-things-to-do-in-may-in-atlanta/',
  },
  {
    id: 10, category: 'community', dayName: null, dayNum: null, endDayNum: null, month: 'MAY', time: 'Ongoing',
    title: 'Scraplanta',
    venue: 'Two ATL Locations', city: 'Atlanta, GA',
    desc: 'Community craft nights running all month at two ATL spots. Sewing circles, junk journaling, crochet, papermaking, and a community quilt reception. Bring what you are working on or start fresh.',
    price: 'Free', free: true, featured: false,
    link: 'https://www.instagram.com/p/DXZSG2YGsm7/',
  },
];

const FILTER_TABS = [
  { id: 'ALL', label: 'All Events' },
  { id: 'art', label: 'Art & Design' },
  { id: 'music', label: 'Music' },
  { id: 'tech', label: 'Tech & Gaming' },
  { id: 'theater', label: 'Theater' },
  { id: 'community', label: 'Community' },
];

// ─── Helpers ────────────────────────────────────────────────────────────────

function getCat(id: CategoryId) {
  return CATEGORIES.find((c) => c.id === id)!;
}

function dateLabel(evt: ATLEvent): string {
  if (!evt.dayNum) return 'Ongoing';
  const base = `${evt.month} ${evt.dayNum}`;
  if (evt.endDayNum) return `${base}–${evt.endDayNum}`;
  return base;
}

// ─── Components ─────────────────────────────────────────────────────────────

function PriceBadge({ free, price, large = false }: { free: boolean; price: string; large?: boolean }) {
  if (free) {
    return (
      <span style={{
        fontFamily: "'Roboto', sans-serif",
        fontSize: large ? '11px' : '9px',
        fontWeight: 800,
        letterSpacing: '0.2em',
        textTransform: 'uppercase' as const,
        padding: large ? '4px 12px' : '3px 10px',
        borderRadius: '100px',
        color: 'rgba(100,210,120,0.95)',
        background: 'rgba(100,210,120,0.1)',
        border: '1px solid rgba(100,210,120,0.28)',
        boxShadow: '0 0 10px rgba(100,210,120,0.12)',
      }}>
        FREE
      </span>
    );
  }
  return (
    <span style={{
      fontFamily: "'Roboto', sans-serif",
      fontSize: large ? '10px' : '9px',
      fontWeight: 600,
      letterSpacing: '0.18em',
      textTransform: 'uppercase' as const,
      padding: large ? '4px 12px' : '3px 9px',
      borderRadius: '100px',
      color: 'rgba(234,154,97,0.7)',
      background: 'rgba(234,154,97,0.06)',
      border: '1px solid rgba(234,154,97,0.16)',
    }}>
      {price}
    </span>
  );
}

function DateBadge({ evt, large = false }: { evt: ATLEvent; large?: boolean }) {
  const isMultiDay = !!evt.endDayNum;
  const size = large
    ? { w: 72, h: 80, daySize: '9px', numSize: isMultiDay ? '18px' : '30px', monSize: '9px' }
    : { w: 56, h: 64, daySize: '8px', numSize: isMultiDay ? '14px' : '22px', monSize: '8px' };

  if (!evt.dayNum) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: `${size.w}px`, minWidth: `${size.w}px`, height: `${size.h}px`, borderRadius: '12px', background: 'rgba(234,154,97,0.05)', border: '1px solid rgba(234,154,97,0.1)', gap: '2px' }}>
        <span style={{ fontFamily: 'Norwige, sans-serif', fontStyle: 'italic', fontSize: '11px', color: 'rgba(234,154,97,0.45)' }}>All</span>
        <span style={{ fontFamily: 'Norwige, sans-serif', fontStyle: 'italic', fontSize: '11px', color: 'rgba(234,154,97,0.45)' }}>May</span>
      </div>
    );
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: `${size.w}px`, minWidth: `${size.w}px`, height: `${size.h}px`, borderRadius: '12px', background: 'rgba(234,154,97,0.06)', border: '1px solid rgba(234,154,97,0.13)', gap: '1px', overflow: 'hidden' }}>
      {evt.dayName && <span style={{ fontFamily: "'Roboto', sans-serif", fontSize: size.daySize, color: 'rgba(234,154,97,0.45)', letterSpacing: '0.12em', textTransform: 'uppercase' as const }}>{evt.dayName}</span>}
      <span style={{ fontFamily: 'Norwige, sans-serif', fontStyle: 'italic', fontWeight: 700, fontSize: size.numSize, color: '#EA9A61', lineHeight: 1, whiteSpace: 'nowrap' as const }}>
        {isMultiDay ? `${evt.dayNum}–${evt.endDayNum}` : evt.dayNum}
      </span>
      <span style={{ fontFamily: "'Roboto', sans-serif", fontSize: size.monSize, color: 'rgba(234,154,97,0.38)', letterSpacing: '0.1em' }}>{evt.month}</span>
    </div>
  );
}

function FeaturedCard({ event, index }: { event: ATLEvent; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const cat = getCat(event.category);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ type: 'spring', stiffness: 60, damping: 15, delay: index * 0.08 }}
      style={{
        position: 'relative',
        background: 'rgba(234,154,97,0.04)',
        border: '1px solid rgba(234,154,97,0.18)',
        borderRadius: '22px',
        overflow: 'hidden',
        padding: 'clamp(24px, 3.5vw, 36px)',
      }}
    >
      {/* Corner glow */}
      <div aria-hidden style={{ position: 'absolute', top: '-30%', right: '-10%', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(234,154,97,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />

      {/* Featured label */}
      <div style={{ position: 'absolute', top: '20px', right: '20px', fontFamily: "'Roboto', sans-serif", fontSize: '8px', letterSpacing: '0.22em', color: 'rgba(234,154,97,0.6)', background: 'rgba(234,154,97,0.07)', border: '1px solid rgba(234,154,97,0.14)', borderRadius: '100px', padding: '3px 10px', textTransform: 'uppercase' as const }}>
        Featured
      </div>

      <div style={{ display: 'flex', gap: 'clamp(16px, 2.5vw, 28px)', alignItems: 'flex-start' }}>
        <DateBadge evt={event} large />

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', flexWrap: 'wrap' as const }}>
            {event.free && <PriceBadge free={event.free} price={event.price} large />}
            <span style={{ fontFamily: "'Roboto', sans-serif", fontSize: '8px', fontWeight: 600, letterSpacing: '0.2em', color: cat.color, background: cat.bg, border: `1px solid ${cat.border}`, borderRadius: '100px', padding: '2px 9px', textTransform: 'uppercase' as const }}>{cat.label}</span>
            {!event.free && <PriceBadge free={event.free} price={event.price} large />}
          </div>

          <h3 style={{ fontFamily: 'Norwige, sans-serif', fontStyle: 'italic', fontWeight: 700, fontSize: 'clamp(22px, 3vw, 32px)', color: 'rgba(255,244,227,0.95)', margin: '0 0 10px', lineHeight: 1.1 }}>
            {event.title}
          </h3>

          <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: 'clamp(13px, 1.2vw, 15px)', color: 'rgba(255,244,227,0.68)', margin: '0 0 18px', lineHeight: 1.72, maxWidth: '560px' }}>
            {event.desc}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' as const, marginBottom: '22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Clock size={11} color="rgba(255,244,227,0.38)" />
              <span style={{ fontFamily: "'Roboto', sans-serif", fontSize: '11px', color: 'rgba(255,244,227,0.55)' }}>{event.time}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <MapPin size={11} color="rgba(255,244,227,0.38)" />
              <span style={{ fontFamily: "'Roboto', sans-serif", fontSize: '11px', color: 'rgba(255,244,227,0.55)' }}>{event.venue}</span>
            </div>
          </div>

          <a
            href={event.link}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '11px 26px', borderRadius: '9999px', background: 'linear-gradient(132deg, #EA9A61 4.77%, #B16937 27.26%, #A64D2B 50.09%, #42201C 76.74%)', color: '#FFF4E3', fontFamily: 'Norwige, sans-serif', fontStyle: 'italic', fontSize: '13px', letterSpacing: '0.08em', fontWeight: 700, textDecoration: 'none', boxShadow: '0 8px 24px -8px rgba(177,105,55,0.5)', transition: 'transform 0.2s ease, opacity 0.2s ease' }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.opacity = '0.88'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.opacity = '1'; }}
          >
            {event.free ? 'Attend Free' : 'Get Tickets'}
            <ExternalLink size={12} strokeWidth={2.5} />
          </a>
        </div>
      </div>
    </motion.div>
  );
}

function EventRow({ event, index }: { event: ATLEvent; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-30px' });
  const cat = getCat(event.category);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ type: 'spring', stiffness: 65, damping: 15, delay: index * 0.05 }}
      style={{
        display: 'flex',
        gap: '16px',
        alignItems: 'center',
        padding: '16px 20px',
        background: 'rgba(255,255,255,0.013)',
        border: '1px solid rgba(255,244,227,0.065)',
        borderRadius: '16px',
        transition: 'border-color 0.25s ease, background 0.25s ease',
        cursor: 'default',
      }}
      whileHover={{ borderColor: 'rgba(234,154,97,0.18)', backgroundColor: 'rgba(234,154,97,0.02)' }}
    >
      <DateBadge evt={event} />

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '5px', flexWrap: 'wrap' as const }}>
          {event.free && <PriceBadge free={event.free} price={event.price} />}
          <span style={{ fontFamily: "'Roboto', sans-serif", fontSize: '8px', fontWeight: 600, letterSpacing: '0.18em', color: cat.color, background: cat.bg, border: `1px solid ${cat.border}`, borderRadius: '100px', padding: '2px 8px', textTransform: 'uppercase' as const }}>{cat.label}</span>
          {!event.free && <PriceBadge free={event.free} price={event.price} />}
        </div>
        <p style={{ fontFamily: 'Norwige, sans-serif', fontStyle: 'italic', fontWeight: 700, fontSize: 'clamp(14px, 1.5vw, 17px)', color: 'rgba(255,244,227,0.88)', margin: '0 0 4px', lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>
          {event.title}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' as const }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={10} color="rgba(255,244,227,0.35)" />
            <span style={{ fontFamily: "'Roboto', sans-serif", fontSize: '10px', color: 'rgba(255,244,227,0.52)' }}>{event.time}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <MapPin size={10} color="rgba(255,244,227,0.35)" />
            <span style={{ fontFamily: "'Roboto', sans-serif", fontSize: '10px', color: 'rgba(255,244,227,0.52)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{event.venue}</span>
          </div>
        </div>
      </div>

      <a
        href={event.link}
        target="_blank"
        rel="noopener noreferrer"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(234,154,97,0.08)', border: '1px solid rgba(234,154,97,0.22)', flexShrink: 0, transition: 'all 0.2s ease', color: 'rgba(234,154,97,0.75)', textDecoration: 'none' }}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(234,154,97,0.16)'; e.currentTarget.style.borderColor = 'rgba(234,154,97,0.45)'; e.currentTarget.style.color = '#EA9A61'; e.currentTarget.style.transform = 'scale(1.08)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(234,154,97,0.08)'; e.currentTarget.style.borderColor = 'rgba(234,154,97,0.22)'; e.currentTarget.style.color = 'rgba(234,154,97,0.75)'; e.currentTarget.style.transform = 'scale(1)'; }}
      >
        <ArrowUpRight size={14} strokeWidth={2.5} />
      </a>
    </motion.div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function EventsPage() {
  const [activeFilter, setActiveFilter] = useState('ALL');
  const heroRef = useRef<HTMLDivElement>(null);
  const heroInView = useInView(heroRef, { once: true });

  const featured = ALL_EVENTS.filter((e) => e.featured && (activeFilter === 'ALL' || e.category === activeFilter));
  const rest = ALL_EVENTS.filter((e) => !e.featured && (activeFilter === 'ALL' || e.category === activeFilter));
  const freeCount = ALL_EVENTS.filter((e) => e.free).length;

  return (
    <div style={{ backgroundColor: '#000000', minHeight: '100vh', overflowX: 'hidden' }}>
      <NavigationDock />

      {/* ── Hero ── */}
      <div ref={heroRef} style={{ position: 'relative', padding: 'clamp(120px, 16vw, 180px) clamp(20px, 5vw, 72px) clamp(48px, 6vw, 72px)', overflow: 'hidden' }}>
        <div aria-hidden style={{ position: 'absolute', top: '-20%', right: '-8%', width: '650px', height: '650px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(234,154,97,0.055) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div aria-hidden style={{ position: 'absolute', bottom: '-10%', left: '-6%', width: '480px', height: '480px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(66,32,28,0.16) 0%, transparent 65%)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '1280px', margin: '0 auto' }}>

          {/* Back */}
          <motion.div initial={{ opacity: 0, x: -8 }} animate={heroInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.35 }} style={{ marginBottom: '40px' }}>
            <Link href="/ctrla" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontFamily: "'Roboto', sans-serif", fontSize: '10px', letterSpacing: '0.2em', color: 'rgba(234,154,97,0.45)', textDecoration: 'none', textTransform: 'uppercase' as const, transition: 'color 0.2s ease' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(234,154,97,0.8)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(234,154,97,0.45)'; }}>
              <ArrowLeft size={11} />CTRL A
            </Link>
          </motion.div>

          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '0' }}>
            <motion.span initial={{ opacity: 0, y: 12 }} animate={heroInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.4, delay: 0.05 }} style={{ fontFamily: "'Roboto', sans-serif", fontSize: '11px', letterSpacing: '0.28em', color: 'rgba(234,154,97,0.6)', textTransform: 'uppercase' as const, fontWeight: 500, marginBottom: '18px', display: 'block' }}>
              ATL Creative Hub · May 2026
            </motion.span>

            <motion.h1 initial={{ opacity: 0, y: 18 }} animate={heroInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.1 }} style={{ fontFamily: 'Norwige, sans-serif', fontStyle: 'italic', fontWeight: 700, fontSize: 'clamp(52px, 9vw, 110px)', lineHeight: 0.9, letterSpacing: '-0.02em', margin: '0 0 28px' }}>
              <span style={{ color: '#FFF4E3' }}>Creative</span>
              <br />
              <span style={{ background: 'linear-gradient(132deg, #EA9A61 4.77%, #B16937 27.26%, #A64D2B 50.09%, #42201C 76.74%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Events</span>
            </motion.h1>

            {/* Stat strip */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={heroInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.45, delay: 0.18 }} style={{ display: 'flex', gap: '0', flexWrap: 'wrap' as const, marginBottom: '28px' }}>
              {[
                { num: `${ALL_EVENTS.length}`, label: 'May events', accent: false },
                { num: `${freeCount}`, label: 'Free to attend', accent: true },
                { num: '5', label: 'Categories', accent: false },
                { num: 'ATL', label: 'Base city', accent: false },
              ].map(({ num, label, accent }, i) => (
                <div key={label} style={{ display: 'flex', flexDirection: 'column' as const, gap: '2px', padding: '12px 28px', borderRight: i < 3 ? '1px solid rgba(255,244,227,0.06)' : 'none', paddingLeft: i === 0 ? '0' : '28px' }}>
                  <span style={{ fontFamily: 'Norwige, sans-serif', fontStyle: 'italic', fontWeight: 700, fontSize: 'clamp(20px, 2.5vw, 28px)', color: accent ? 'rgba(100,210,120,0.95)' : '#FFF4E3', lineHeight: 1 }}>{num}</span>
                  <span style={{ fontFamily: "'Roboto', sans-serif", fontSize: '10px', color: accent ? 'rgba(100,210,120,0.6)' : 'rgba(255,244,227,0.45)', letterSpacing: '0.12em', textTransform: 'uppercase' as const }}>{label}</span>
                </div>
              ))}
            </motion.div>

            <motion.p initial={{ opacity: 0, y: 12 }} animate={heroInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.4, delay: 0.22 }} style={{ fontFamily: "'Roboto', sans-serif", fontSize: 'clamp(14px, 1.3vw, 16px)', color: 'rgba(255,244,227,0.62)', lineHeight: 1.75, maxWidth: '460px', margin: 0 }}>
              Art shows. Music festivals. Creator cons. Fringe theater. Everything worth showing up for in ATL this May.
            </motion.p>
          </div>
        </div>
      </div>

      {/* ── Divider ── */}
      <div style={{ width: '100%', height: '1px', background: 'linear-gradient(90deg, transparent 0%, rgba(255,244,227,0.06) 20%, rgba(255,244,227,0.06) 80%, transparent 100%)' }} />

      {/* ── Filter + Events ── */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: 'clamp(40px, 6vw, 64px) clamp(20px, 5vw, 72px) clamp(80px, 10vw, 120px)' }}>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '40px', flexWrap: 'wrap' as const, alignItems: 'center' }}>
          {FILTER_TABS.map((tab) => {
            const active = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                style={{
                  fontFamily: "'Roboto', sans-serif",
                  fontSize: '10px',
                  fontWeight: 600,
                  letterSpacing: '0.14em',
                  padding: '8px 18px',
                  borderRadius: '100px',
                  border: active ? '1px solid transparent' : '1px solid rgba(255,244,227,0.09)',
                  background: active ? 'linear-gradient(132deg, #EA9A61 4.77%, #B16937 27.26%, #A64D2B 50.09%, #42201C 76.74%)' : 'transparent',
                  color: active ? '#FFF4E3' : 'rgba(255,244,227,0.55)',
                  textTransform: 'uppercase' as const,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: active ? '0 4px 16px -4px rgba(177,105,55,0.45)' : 'none',
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Featured events */}
        {featured.length > 0 && (
          <div style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <span style={{ fontFamily: "'Roboto', sans-serif", fontSize: '9px', letterSpacing: '0.22em', color: 'rgba(234,154,97,0.75)', textTransform: 'uppercase' as const, fontWeight: 600 }}>Highlighted</span>
              <div style={{ flex: 1, height: '1px', background: 'rgba(234,154,97,0.12)' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: featured.length > 1 ? 'repeat(auto-fit, minmax(380px, 1fr))' : '1fr', gap: '14px' }}>
              {featured.map((e, i) => <FeaturedCard key={e.id} event={e} index={i} />)}
            </div>
          </div>
        )}

        {/* All other events */}
        {rest.length > 0 && (
          <div>
            {featured.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <span style={{ fontFamily: "'Roboto', sans-serif", fontSize: '9px', letterSpacing: '0.22em', color: 'rgba(255,244,227,0.5)', textTransform: 'uppercase' as const, fontWeight: 600 }}>All events</span>
                <div style={{ flex: 1, height: '1px', background: 'rgba(255,244,227,0.08)' }} />
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '10px' }}>
              {rest.map((e, i) => <EventRow key={e.id} event={e} index={i} />)}
            </div>
          </div>
        )}

        {/* Empty state */}
        {featured.length === 0 && rest.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <p style={{ fontFamily: 'Norwige, sans-serif', fontStyle: 'italic', fontSize: '24px', color: 'rgba(255,244,227,0.25)', margin: 0 }}>No events in this category</p>
          </div>
        )}

        {/* Resources strip */}
        <div style={{ marginTop: '56px', padding: 'clamp(20px, 3vw, 28px) clamp(20px, 3vw, 32px)', borderRadius: '18px', background: 'rgba(234,154,97,0.05)', border: '1px solid rgba(234,154,97,0.18)', display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' as const }}>
          <div style={{ flex: 1 }}>
            <span style={{ fontFamily: "'Roboto', sans-serif", fontSize: '9px', letterSpacing: '0.2em', color: 'rgba(234,154,97,0.75)', textTransform: 'uppercase' as const, display: 'block', marginBottom: '6px' }}>More listings</span>
            <p style={{ fontFamily: 'Norwige, sans-serif', fontStyle: 'italic', fontSize: 'clamp(15px, 1.8vw, 20px)', color: '#FFF4E3', margin: 0, lineHeight: 1.3 }}>Creative Loafing ATL and Arts ATL carry the full May calendar.</p>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexShrink: 0, flexWrap: 'wrap' as const }}>
            {[
              { label: 'Creative Loafing', href: 'https://creativeloafing.com/atlanta-events/may' },
              { label: 'Arts ATL', href: 'https://www.artsatl.org/calendar/2026-05-09/' },
            ].map(({ label, href }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '9px 18px', borderRadius: '100px', border: '1px solid rgba(234,154,97,0.3)', background: 'rgba(234,154,97,0.08)', color: 'rgba(255,244,227,0.85)', fontFamily: "'Roboto', sans-serif", fontSize: '10px', letterSpacing: '0.12em', textDecoration: 'none', textTransform: 'uppercase' as const, transition: 'all 0.2s ease' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(234,154,97,0.55)'; e.currentTarget.style.color = '#FFF4E3'; e.currentTarget.style.background = 'rgba(234,154,97,0.14)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(234,154,97,0.3)'; e.currentTarget.style.color = 'rgba(255,244,227,0.85)'; e.currentTarget.style.background = 'rgba(234,154,97,0.08)'; }}>
                {label}<ExternalLink size={10} strokeWidth={2} />
              </a>
            ))}
          </div>
        </div>

        {/* Submit strip */}
        <div style={{ marginTop: '14px', padding: 'clamp(24px, 3.5vw, 36px) clamp(20px, 3vw, 32px)', borderRadius: '18px', background: 'rgba(234,154,97,0.03)', border: '1px dashed rgba(234,154,97,0.28)', display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: '16px', textAlign: 'center' as const }}>
          <div>
            <span style={{ fontFamily: "'Roboto', sans-serif", fontSize: '9px', letterSpacing: '0.2em', color: 'rgba(234,154,97,0.75)', textTransform: 'uppercase' as const, display: 'block', marginBottom: '6px' }}>Running an event?</span>
            <p style={{ fontFamily: 'Norwige, sans-serif', fontStyle: 'italic', fontWeight: 700, fontSize: 'clamp(15px, 1.8vw, 20px)', color: '#FFF4E3', margin: 0, lineHeight: 1.2 }}>Get it on the ATL Creative Hub calendar.</p>
          </div>
          <a href="mailto:admin@pursuenetworking.com?subject=CTRL A Event Submission" style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '11px 26px', borderRadius: '9999px', border: '1px solid transparent', background: 'linear-gradient(132deg, #EA9A61 4.77%, #B16937 27.26%, #A64D2B 50.09%, #42201C 76.74%)', color: '#FFF4E3', fontFamily: "'Roboto', sans-serif", fontSize: '10px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase' as const, textDecoration: 'none', transition: 'transform 0.22s cubic-bezier(0.16,1,0.3,1), box-shadow 0.22s ease', boxShadow: '0 0 0 1px rgba(234,154,97,0.22), 0 8px 28px rgba(42,16,12,0.6)' }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 0 0 1px rgba(234,154,97,0.35), 0 14px 40px rgba(42,16,12,0.7)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 0 0 1px rgba(234,154,97,0.22), 0 8px 28px rgba(42,16,12,0.6)'; }}>
            Submit Event <ArrowUpRight size={11} strokeWidth={2} />
          </a>
        </div>
      </div>
    </div>
  );
}
