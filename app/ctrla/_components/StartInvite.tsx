"use client";

// ═══════════════════════════════════════════════════════
// CTRL-A — START INVITE
// The one-time offer to take the intake quiz. Mounted once in the CTRL-A
// layout, so it can appear on any page of the issue.
//
// Rules it obeys, in order of how much they matter:
//   · Asks once, ever. Answering or dismissing both silence it for good.
//   · Never interrupts the cover. It waits for the first-visit loader to
//     finish, then for six seconds or the first scroll, whichever lands
//     first. Landing on a page you have not read yet and getting a modal
//     in the face is the one version of this that feels hostile.
//   · Stays out of rooms with their own job: the quiz itself, Lock In
//     (a focus space), the submission flow, and the pitch deck.
//   · Esc closes it, focus returns where it came from, and "Not now" is
//     as prominent as the yes.
// ═══════════════════════════════════════════════════════

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ed } from "./editorial";
import { useCtrlAProfile } from "@/lib/ctrla/profile";

/** Six seconds, or the first scroll. */
const DELAY_MS = 6000;

/** Routes that get to do their job uninterrupted. */
const QUIET_ROUTES = [
  "/ctrla/space",
  "/ctrla/finish",
  "/ctrla/start",
  "/ctrla/the-fold",
  "/ctrla/submit",
  "/ctrla/pitchdeck",
  "/ctrla/u/",
];

export default function StartInvite() {
  const pathname = usePathname() || "";
  const { profile, dismissed, ready, dismiss } = useCtrlAProfile();
  const [open, setOpen] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  const quiet = QUIET_ROUTES.some((r) => pathname === r || pathname.startsWith(`${r}/`) || pathname.startsWith(r));
  const eligible = ready && !profile && !dismissed && !quiet;

  const close = useCallback(() => {
    setOpen(false);
    dismiss();
    returnFocus.current?.focus?.();
  }, [dismiss]);

  // Arm the timer. On the landing page the first-visit loader owns the
  // screen until it sets `ctrla-loaded`, so wait that out before counting.
  useEffect(() => {
    if (!eligible) return;

    let timer: ReturnType<typeof setTimeout> | null = null;
    let poll: ReturnType<typeof setInterval> | null = null;
    let armed = false;

    const show = () => {
      window.removeEventListener("scroll", show);
      if (timer) clearTimeout(timer);
      setOpen(true);
    };

    const arm = () => {
      if (armed) return;
      armed = true;
      timer = setTimeout(show, DELAY_MS);
      window.addEventListener("scroll", show, { once: true, passive: true });
    };

    const loaderDone = () => {
      try {
        return sessionStorage.getItem("ctrla-loaded") === "1";
      } catch {
        return true;
      }
    };

    if (pathname !== "/ctrla" || loaderDone()) {
      arm();
    } else {
      poll = setInterval(() => {
        if (loaderDone()) {
          if (poll) clearInterval(poll);
          arm();
        }
      }, 400);
    }

    return () => {
      if (timer) clearTimeout(timer);
      if (poll) clearInterval(poll);
      window.removeEventListener("scroll", show);
    };
  }, [eligible, pathname]);

  // Modal behaviour: lock the page, take focus, Esc closes.
  useEffect(() => {
    if (!open) return;
    returnFocus.current = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    cardRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  if (!open) return null;

  return (
    <div
      className="ctrla-invite-backdrop"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div
        ref={cardRef}
        className="ctrla-invite-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ctrla-invite-title"
        tabIndex={-1}
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 560,
          padding: "clamp(26px,4vw,44px)",
          borderRadius: 8,
          background: "linear-gradient(165deg, #241539 0%, #150C29 55%, #0C0619 100%)",
          border: "1px solid rgba(227,194,74,0.24)",
          boxShadow: "0 40px 90px rgba(0,0,0,0.6), 0 1px 0 rgba(240,230,224,0.07) inset",
          outline: "none",
        }}
      >
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="ctrla-start-text-btn"
          style={{
            position: "absolute",
            top: 14,
            right: 16,
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: 20,
            lineHeight: 1,
            color: ed.inkFaint,
            padding: 6,
          }}
        >
          ×
        </button>

        <span style={{ fontFamily: ed.mono, fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: ed.gold }}>
          First time here?
        </span>

        <h2
          id="ctrla-invite-title"
          style={{
            fontFamily: ed.grotesque,
            fontWeight: 800,
            fontSize: "clamp(24px,3.6vw,38px)",
            lineHeight: 1.02,
            letterSpacing: "-0.03em",
            color: ed.ink,
            margin: "14px 0 10px",
          }}
        >
          Want us to point you at your part of it?
        </h2>

        <p
          style={{
            fontFamily: ed.body,
            fontSize: "clamp(14px,1.6vw,17px)",
            lineHeight: 1.55,
            color: ed.inkSoft,
            margin: 0,
          }}
        >
          Four taps, twenty seconds. No email.
        </p>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: "clamp(22px,3vw,30px)" }}>
          <a
            href="/ctrla/start"
            className="ctrla-cover-cta"
            style={{
              fontFamily: ed.mono,
              fontSize: "clamp(12px,1.4vw,14px)",
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: ed.ground,
              background: ed.gold,
              padding: "15px 28px",
              borderRadius: 4,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            Show me where to start <span aria-hidden>→</span>
          </a>
          <button
            type="button"
            onClick={close}
            className="ctrla-start-text-btn"
            style={{
              fontFamily: ed.mono,
              fontSize: "clamp(12px,1.4vw,14px)",
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: ed.inkFaint,
              background: "transparent",
              border: "1.5px solid rgba(240,230,224,0.2)",
              padding: "15px 28px",
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  );
}
