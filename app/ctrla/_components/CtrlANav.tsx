"use client";

// ═══════════════════════════════════════════════════════
// CTRL-A — NAVIGATION
// The issue's own menu. Replaces the site-wide ROV NavigationDock on
// every /ctrla route, so the community side never wears the B2B nav.
//
// Two parts:
//   · A persistent glass bar. CTRL-A mark on the left; Start here, Sign
//     up, and the Menu trigger on the right.
//   · A cream panel that opens on hover (fine pointers) and pins on
//     click. Cream is the point: the ROV menu is a dark panel with light
//     type, so CTRL-A takes the inverse and opening it reads as turning
//     a page rather than dimming the lights. Small text goes dark plum
//     here, the standard inversion of the gold used on night grounds.
//
// The way back to the studio lives at the foot of the panel as the
// R.O.V wordmark, matching how the reference parks its legal row.
// ═══════════════════════════════════════════════════════

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Instagram, Linkedin, Mail } from "lucide-react";
import GoogleLoginButton from "@/components/providers/GoogleLoginButton";
import CtrlASignup from "./CtrlASignup";
import { ed, edLight, legibleAccent } from "./editorial";
import { toolkitSections } from "../data";

/** The ROV wordmark is type, not an asset — matched to the main nav. */
const ROV_DISPLAY = { fontFamily: "'Norwige Light', sans-serif" } as const;

/** Routes that own the whole screen and get no site chrome. */
const CHROMELESS = ["/ctrla/pitchdeck"];

const PRIMARY = [
  { title: "Lock In", to: "/ctrla/the-fold", note: "A place to actually work" },
  { title: "ATL", to: "/ctrla/atl", note: "The Atlanta field guide" },
  { title: "The Magazine", to: "/ctrla/vol/1", note: "This volume, front to back" },
];

const SECONDARY = [
  // First, because the bar's "Start here" link hides on narrow screens and
  // this is the only other door to the quiz.
  { title: "Start here", to: "/ctrla/start" },
  { title: "Brand Kit Generator", to: "/ctrla/brand-kit" },
  { title: "The Daily Taste Test", to: "/ctrla/daily" },
  { title: "Cookbook", to: "/ctrla/cookbook" },
  { title: "Submit your work", to: "/ctrla/submit" },
];

/** Atlanta clock, the way the reference shows its studio's local time. */
function useAtlantaTime() {
  const [now, setNow] = useState<string | null>(null);
  useEffect(() => {
    const tick = () =>
      setNow(
        new Intl.DateTimeFormat("en-US", {
          hour: "numeric",
          minute: "2-digit",
          timeZone: "America/New_York",
        }).format(new Date())
      );
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);
  return now;
}

export default function CtrlANav() {
  const pathname = usePathname() || "";
  const [open, setOpen] = useState(false);
  const [kitsOpen, setKitsOpen] = useState(false);
  const time = useAtlantaTime();

  // Hover opens on pointer devices; a click pins it so the panel survives
  // the cursor leaving. Touch only ever uses the click path.
  const pinned = useRef(false);
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const clearTimers = () => {
    if (openTimer.current) clearTimeout(openTimer.current);
    if (closeTimer.current) clearTimeout(closeTimer.current);
    openTimer.current = null;
    closeTimer.current = null;
  };

  const close = useCallback(() => {
    clearTimers();
    pinned.current = false;
    setOpen(false);
  }, []);

  const hoverOpen = () => {
    if (typeof window !== "undefined" && !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    clearTimers();
    openTimer.current = setTimeout(() => setOpen(true), 90);
  };

  const hoverClose = () => {
    if (pinned.current) return;
    clearTimers();
    closeTimer.current = setTimeout(() => setOpen(false), 220);
  };

  // Never trail the page it opened from.
  useEffect(() => {
    close();
  }, [pathname, close]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  useEffect(() => clearTimers, []);

  if (CHROMELESS.some((r) => pathname === r || pathname.startsWith(`${r}/`))) return null;

  const accent = legibleAccent(ed.gold); // gold is illegible on cream
  const isActive = (to: string) => pathname === to || pathname.startsWith(`${to}/`);

  return (
    <>
      {/* ── The bar ─────────────────────────────────────── */}
      <div
        className="ctrla-nav-bar"
        onMouseEnter={hoverOpen}
        onMouseLeave={hoverClose}
      >
        <Link href="/ctrla" aria-label="CTRL-A home" className="ctrla-nav-mark">
          <Image
            src="/ctrla/ctrla-flat-logo-white.svg"
            alt="CTRL-A"
            width={48}
            height={35}
            priority
            unoptimized
            style={{ height: "clamp(18px,2.2vw,24px)", width: "auto" }}
          />
        </Link>

        <div className="ctrla-nav-right">
          <Link href="/ctrla/start" className="ctrla-nav-link ctrla-nav-start">
            Start here
          </Link>

          <button
            type="button"
            className="ctrla-nav-signup"
            onClick={() => {
              clearTimers();
              pinned.current = true;
              setOpen(true);
              // Let the panel mount, then put the cursor in the field.
              setTimeout(() => panelRef.current?.querySelector<HTMLInputElement>("input[type=email]")?.focus(), 420);
            }}
          >
            Sign up
          </button>

          <button
            type="button"
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            className="ctrla-nav-trigger"
            onClick={() => {
              clearTimers();
              if (open && pinned.current) {
                close();
              } else {
                pinned.current = true;
                setOpen(true);
              }
            }}
          >
            <span>{open ? "Close" : "Menu"}</span>
            <span className={`ctrla-nav-burger${open ? " is-open" : ""}`} aria-hidden>
              <span />
              <span />
              <span />
            </span>
          </button>
        </div>
      </div>

      {/* ── The panel ───────────────────────────────────── */}
      <div
        className={`ctrla-nav-shell${open ? " is-open" : ""}`}
        aria-hidden={!open}
        onMouseEnter={() => clearTimers()}
        onMouseLeave={hoverClose}
      >
        <button type="button" aria-label="Close menu" tabIndex={-1} onClick={close} className="ctrla-nav-scrim" />

        <div ref={panelRef} className="ctrla-nav-panel" role="dialog" aria-modal="false" aria-label="CTRL-A menu">
          <div className="ctrla-nav-panel-inner">
            <span className="ctrla-nav-eyebrow" style={{ color: edLight.inkFaint }}>
              Menu
            </span>

            {/* Toolkits, expanding in place to the four crafts */}
            <button
              type="button"
              className="ctrla-nav-item ctrla-nav-item-btn"
              aria-expanded={kitsOpen}
              onClick={() => setKitsOpen((v) => !v)}
            >
              <span className="ctrla-nav-item-title">Toolkits</span>
              <span className="ctrla-nav-item-meta">[{toolkitSections.length}]</span>
            </button>

            {kitsOpen && (
              <div className="ctrla-nav-kits">
                {toolkitSections.map((s) => (
                  <Link key={s.id} href={`/ctrla/toolkit/${s.id}`} className="ctrla-nav-kit" onClick={close}>
                    <span
                      aria-hidden
                      className="ctrla-nav-kit-dot"
                      style={{ background: legibleAccent(s.accentColor) }}
                    />
                    {s.title}
                  </Link>
                ))}
              </div>
            )}

            {PRIMARY.map((item) => (
              <Link
                key={item.to}
                href={item.to}
                onClick={close}
                className={`ctrla-nav-item${isActive(item.to) ? " is-active" : ""}`}
              >
                <span className="ctrla-nav-item-title">{item.title}</span>
                <span className="ctrla-nav-item-meta">{item.note}</span>
              </Link>
            ))}

            <div className="ctrla-nav-secondary">
              {SECONDARY.map((item) => (
                <Link key={item.to} href={item.to} onClick={close} className="ctrla-nav-sub">
                  {item.title}
                </Link>
              ))}
            </div>

            {/* Join the drop */}
            <div className="ctrla-nav-block">
              <span className="ctrla-nav-eyebrow" style={{ color: edLight.inkFaint }}>
                Join the drop
              </span>
              <CtrlASignup
                source="ctrla:nav"
                theme="light"
                variant="stacked"
                accent={accent}
                cta="Join"
                note="One email a month. Nothing else."
                style={{ marginTop: 12 }}
              />
            </div>

            {/* Local time + socials */}
            <div className="ctrla-nav-block ctrla-nav-meta-row">
              <span className="ctrla-nav-eyebrow" style={{ color: edLight.inkFaint }}>
                Atlanta {time ? `· ${time}` : ""}
              </span>
              <div className="ctrla-nav-socials">
                <a href="https://www.instagram.com/rangeofview/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <Instagram size={17} strokeWidth={1.6} />
                </a>
                <a href="https://www.linkedin.com/company/range-of-view/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <Linkedin size={17} strokeWidth={1.6} />
                </a>
                <a href="mailto:contact@rovstudios.com" aria-label="Email">
                  <Mail size={17} strokeWidth={1.6} />
                </a>
              </div>
            </div>

            {/* The way back to the studio */}
            <div className="ctrla-nav-foot">
              <Link href="/" onClick={close} className="ctrla-nav-rov" style={ROV_DISPLAY}>
                <span aria-hidden>←</span> R.O.V
              </Link>
              <div className="ctrla-nav-login">
                <GoogleLoginButton />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
