"use client";

// ═══════════════════════════════════════════════════════
// CTRL-A — EDITORIAL FOOTER
// Ink ground, paper type, amber accent. Matches the
// magazine branding; flows out of the Friday-drop band.
// ═══════════════════════════════════════════════════════

import Link from "next/link";
import { Instagram } from "lucide-react";
import AnimatedShaderBackground from "@/components/ui/animated-shader-background";
import { ed, Bleed, Rule, Label } from "./editorial";

const NAV = [
  { kicker: "Let's make it happen", title: "Services", href: "/#services", external: false },
  { kicker: "Get to know us", title: "About", href: "/#team-members", external: false },
  { kicker: "Contact", title: "Calendly", href: "https://calendly.com/rangeofviewmusic/30min", external: true },
];

const paperSoft = "rgba(240,230,224,0.66)";
const paperFaint = "rgba(240,230,224,0.42)";

export default function EditorialFooter() {
  return (
    <footer
      style={{
        position: "relative",
        backgroundColor: ed.void,
        color: ed.paper,
        width: "100%",
        overflow: "hidden",
      }}
    >
      {/* Animated shooting-stars shader, behind footer content */}
      <AnimatedShaderBackground style={{ zIndex: 0 }} intensity={1} />

      <div style={{ position: "relative", zIndex: 1 }}>
      <Bleed style={{ padding: "clamp(40px,6vw,72px) clamp(18px,5vw,64px) clamp(20px,3vw,32px)" }}>
        {/* Nav columns */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "clamp(24px,4vw,48px)",
          }}
        >
          {NAV.map((n) => (
            <a
              key={n.title}
              href={n.href}
              {...(n.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="ctrla-foot-link"
              style={{ display: "flex", flexDirection: "column", gap: 12, textDecoration: "none" }}
            >
              <Label color={ed.amber}>{n.kicker}</Label>
              <span
                style={{
                  fontFamily: ed.grotesque,
                  fontWeight: 800,
                  fontSize: "clamp(30px,4vw,52px)",
                  letterSpacing: "-0.02em",
                  color: ed.paper,
                  transition: "color .25s",
                }}
              >
                {n.title}
              </span>
            </a>
          ))}
        </div>

        {/* Contact note + socials */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 20,
            flexWrap: "wrap",
            marginTop: "clamp(28px,4vw,44px)",
          }}
        >
          <p style={{ fontFamily: ed.mono, fontSize: 12, lineHeight: 1.6, color: paperFaint, margin: 0, maxWidth: 360 }}>
            Book a call. *We&apos;re millennials and gen-z, please do not call us.
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <a href="https://discord.gg/GfzXdmu" target="_blank" rel="noopener noreferrer" aria-label="Discord" className="ctrla-foot-soc" style={socStyle}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 640 512" style={{ width: 18, height: 18 }}>
                <path d="M524.5 69.5A1.5 1.5 0 0 0 523.7 69a485 485 0 0 0-120.4-37.2 1.8 1.8 0 0 0-1.9 1 337.2 337.2 0 0 0-15.1 31.2 447.4 447.4 0 0 0-134 0A309.4 309.4 0 0 0 237.2 33a1.9 1.9 0 0 0-1.9-1A483.6 483.6 0 0 0 116.4 69a1.7 1.7 0 0 0-.8.7C39.1 183.6 18.1 294.4 28.5 404.3a2.1 2.1 0 0 0 .8 1.3A487 487 0 0 0 177.2 480a1.9 1.9 0 0 0 2.1-.7 348.2 348.2 0 0 0 30-48.9 1.9 1.9 0 0 0-1-2.6 321.8 321.8 0 0 1-46-21.9 1.9 1.9 0 0 1-.2-3.2 251.7 251.7 0 0 0 9.1-7.1 1.9 1.9 0 0 1 2-.3c96.1 43.9 200.4 43.9 296 0a1.9 1.9 0 0 1 2 .3 235.5 235.5 0 0 0 9.1 7.1 1.9 1.9 0 0 1-.2 3.2 301 301 0 0 1-46 21.9 1.9 1.9 0 0 0-1 2.6 347.9 347.9 0 0 0 30 48.9 1.9 1.9 0 0 0 2.1.7A486.8 486.8 0 0 0 610.7 405a2 2 0 0 0 .8-1.3c10.4-109.8-10.6-220.6-87-334.2zM222.2 338.1c-23.4 0-42.6-21.5-42.6-47.8s18.9-47.8 42.6-47.8c23.7 0 42.9 21.5 42.6 47.8s-18.9 47.8-42.6 47.8zm195.6 0c-23.4 0-42.6-21.5-42.6-47.8s18.9-47.8 42.6-47.8 42.9 21.5 42.6 47.8-18.9 47.8-42.6 47.8z" />
              </svg>
            </a>
            <a href="https://www.instagram.com/rangeofviewstudios/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="ctrla-foot-soc" style={socStyle}>
              <Instagram size={18} />
            </a>
            <a href="https://www.reddit.com/user/rangeofviewstudios/" target="_blank" rel="noopener noreferrer" aria-label="Reddit" className="ctrla-foot-soc" style={socStyle}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 512 512" style={{ width: 18, height: 18 }}>
                <path d="M201.5 305.5c-13.8 0-24.9-11.1-24.9-24.6 0-13.8 11.1-24.9 24.9-24.9 13.6 0 24.6 11.1 24.6 24.9 0 13.6-11.1 24.6-24.6 24.6zM504 256c0 137-111 248-248 248S8 393 8 256 119 8 256 8s248 111 248 248zm-132.3-41.2c-9.4 0-17.7 3.9-23.8 10-22.4-15.5-52.6-25.5-86.1-26.6l17.4-78.3 55.4 12.5c0 13.6 11.1 24.6 24.6 24.6 13.8 0 24.9-11.3 24.9-24.9s-11.1-24.9-24.9-24.9c-9.7 0-18 5.8-22.1 13.8l-61.2-13.6c-3-.8-6.1 1.4-6.9 4.4l-19.1 86.4c-33.2 1.4-63.1 11.3-85.5 26.8-6.1-6.4-14.7-10.2-24.1-10.2-34.9 0-46.3 46.9-14.4 62.8-1.1 5-1.7 10.2-1.7 15.5 0 52.6 59.2 95.2 132 95.2 73.1 0 132.3-42.6 132.3-95.2 0-5.3-.6-10.8-1.9-15.8 31.3-16 19.8-62.5-14.9-62.5zM302.8 331c-18.2 18.2-76.1 17.9-93.6 0-2.2-2.2-6.1-2.2-8.3 0-2.5 2.5-2.5 6.4 0 8.6 22.8 22.8 87.3 22.8 110.2 0 2.5-2.2 2.5-6.1 0-8.6-2.2-2.2-6.1-2.2-8.3 0zm7.7-75c-13.6 0-24.6 11.1-24.6 24.9 0 13.6 11.1 24.6 24.6 24.6 13.8 0 24.9-11.1 24.9-24.6 0-13.8-11-24.9-24.9-24.9z" />
              </svg>
            </a>
          </div>
        </div>
      </Bleed>

      {/* Giant CTRL-A logo (masked to paper so the black art reads on ink) */}
      <Link
        href="/ctrla/pitchdeck"
        className="ctrla-foot-mark"
        aria-label="CTRL-A"
        style={{ display: "block", textDecoration: "none", padding: "clamp(12px,3vw,40px) clamp(18px,5vw,64px)" }}
      >
        <div
          className="ctrla-foot-mark-img"
          style={{
            width: "100%",
            maxWidth: 1200,
            height: "clamp(120px, 22vw, 320px)",
            margin: "0 auto",
            background: ed.paper,
            WebkitMaskImage: "url('/ctrla/ctrla-3d-logo-black.png')",
            maskImage: "url('/ctrla/ctrla-3d-logo-black.png')",
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
            WebkitMaskSize: "contain",
            maskSize: "contain",
            WebkitMaskPosition: "center",
            maskPosition: "center",
            transition: "background .3s",
          }}
        />
      </Link>

      {/* Colophon */}
      <Bleed style={{ padding: "0 clamp(18px,5vw,64px) clamp(24px,3vw,32px)" }}>
        <Rule color="rgba(240,230,224,0.14)" />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap", paddingTop: 16 }}>
          <Label color={paperSoft}>CTRL-A · Issue 01 · Spring 2026</Label>
          <Label color={paperFaint}>© Range of View Studios</Label>
        </div>
      </Bleed>
      </div>
    </footer>
  );
}

const socStyle: React.CSSProperties = {
  width: 40,
  height: 40,
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: ed.paper,
  background: "rgba(240,230,224,0.1)",
  transition: "background .25s, color .25s",
};
