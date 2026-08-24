"use client";

// ═══════════════════════════════════════════════════════
// CTRL-A — START
// The intake quiz, set as part of the magazine rather than as a form.
//
// Question 01 is four full-bleed accent panels that expand under the
// cursor, each carrying one of the CTRL-A cosmic marks. Questions 02 to
// 04 and the reveal are editorial rows on hairlines, the same language
// as CraftPathways on the landing: giant grotesque answers, mono gold
// meta, accent on the node rather than on the text. No cards, no boxes,
// no icon set. Layout and motion live in globals.css under .ctrla-panel
// and .ctrla-row; only the per-craft accent is passed down, as --acc.
//
// The four answers land in lib/ctrla/profile.ts, which is what the nav,
// the toolkit modes, and the landing page read back later.
// ═══════════════════════════════════════════════════════

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { ed, Bleed, Label, Kicker } from "../_components/editorial";
import {
  useCtrlAProfile,
  profileSentence,
  type CraftSlug,
  type Intent,
  type Level,
  type CtrlAProfile,
} from "@/lib/ctrla/profile";

// ── Question 01 ──────────────────────────────────────────────
// One panel per craft. The art is the issue's own cosmic kit, the same
// marks CosmicBackdrop uses, so the quiz belongs to the volume instead
// of importing a generic icon set.

type CraftOption = {
  value: CraftSlug;
  label: string;
  accent: string;
  art: string;
  /** Mono line under the name, one glance at what the panel leads to. */
  meta: string;
};

const CRAFTS: CraftOption[] = [
  { value: "music", label: "Music", accent: "#A56A67", art: "/ctrla/asset-comet.svg", meta: "12 picks" },
  { value: "design", label: "Design", accent: "#8E76B8", art: "/ctrla/asset-saturn.svg", meta: "8 picks" },
  { value: "web-dev", label: "Websites", accent: "#E3C24A", art: "/ctrla/asset-planets.svg", meta: "8 picks" },
  // The spaceship and galaxy marks only exist in the source asset folder,
  // whose name has spaces. Encoded rather than duplicated into the root.
  { value: "video", label: "Video", accent: "#7FA8A0", art: "/ctrla/Assets%20and%20Textures/CTRL%20A_spaceship.svg", meta: "8 picks" },
];

// ── Questions 02 to 04 ───────────────────────────────────────
// Each answer is a row. The right-hand mono line is the only support
// copy any of them get.

type LevelOption = { value: Level; label: string; meta: string };

const LEVELS: LevelOption[] = [
  { value: "beginner", label: "Just starting", meta: "Nothing finished yet" },
  { value: "beginner", label: "Made a few things", meta: "Still figuring it out" },
  { value: "expert", label: "I do this seriously", meta: "Paid, or shipping constantly" },
];

type IntentOption = { value: Intent; label: string; meta: string };

const INTENTS: IntentOption[] = [
  { value: "craft", label: "Get better", meta: "The craft itself" },
  { value: "brand", label: "Build my look", meta: "Name, logo, colours" },
  { value: "release", label: "Finish something", meta: "Work sitting unfinished" },
  { value: "atlanta", label: "Meet ATL creatives", meta: "Rooms, events, people" },
];

// ── Where each answer sends them ─────────────────────────────

type Door = { href: string; label: string; note: string };

const DOORS = {
  brandKit: {
    href: "/ctrla/brand-kit",
    label: "The Brand Kit Generator",
    note: "Logo, palette, type, voice. One sitting, free.",
  },
  atl: {
    href: "/ctrla/atl",
    label: "CTRL-A · Atlanta",
    note: "The lineage, the events, the rooms.",
  },
  lockIn: {
    href: "/ctrla/the-fold",
    label: "Lock In",
    note: "Five rooms. Sound, timer, nothing else.",
  },
  daily: {
    href: "/ctrla/daily",
    label: "The Daily Taste Test",
    note: "Two options a day. One is sharper.",
  },
} satisfies Record<string, Door>;

function toolkitDoor(craft: CraftSlug): Door {
  const meta: Record<CraftSlug, { label: string; note: string }> = {
    music: { label: "The Music Toolkit", note: "The chain our engineers run in real sessions." },
    design: { label: "The Design Toolkit", note: "Interface, brand, and 3D, from real client work." },
    "web-dev": { label: "The Development Toolkit", note: "The stack we ship on, framework to deploy." },
    video: { label: "The Video Toolkit", note: "Bodies, glass, light, and the finish room." },
  };
  return { href: `/ctrla/toolkit/${craft}`, ...meta[craft] };
}

/**
 * One primary door and two secondary ones.
 *
 * The rule that matters: a beginner with no look yet goes to the brand kit
 * first, whatever else they said. Handing someone who has never finished a
 * project a page of professional tooling is how you lose them, and the kit
 * is the one thing on CTRL-A that produces a finished artifact in one
 * sitting. Everyone else goes to the toolkit for what they make.
 */
function doorsFor(p: {
  crafts: CraftSlug[];
  level: Level;
  intent: Intent;
  hasBrand: boolean;
}): { primary: Door; secondary: Door[]; why: string } {
  const craft = p.crafts[0];
  const kit = toolkitDoor(craft);
  const second = p.crafts[1] ? toolkitDoor(p.crafts[1]) : null;

  if (p.intent === "brand" || (p.level === "beginner" && !p.hasBrand)) {
    return {
      primary: DOORS.brandKit,
      secondary: [kit, second ?? DOORS.lockIn],
      why:
        p.intent === "brand"
          ? "The look is what you're after. This is where it gets made."
          : "Fastest way to finish something. The toolkit lands better after.",
    };
  }

  if (p.intent === "atlanta") {
    return {
      primary: DOORS.atl,
      secondary: [kit, DOORS.lockIn],
      why: "The scene, and where to go. Your toolkit is one tap away.",
    };
  }

  if (p.intent === "release") {
    return {
      primary: kit,
      secondary: [DOORS.lockIn, p.hasBrand ? (second ?? DOORS.daily) : DOORS.brandKit],
      why: "Everything you need to finish it, in order.",
    };
  }

  return {
    primary: kit,
    secondary: [second ?? DOORS.daily, DOORS.lockIn],
    why: "The founder's guide sits on top. Read it in order.",
  };
}

// ── Chrome ───────────────────────────────────────────────────

const STEPS = 4;

/** A hairline that fills across the top of the page as the quiz advances. */
function ProgressRule({ step }: { step: number }) {
  return (
    <div aria-hidden style={{ position: "fixed", top: 0, left: 0, right: 0, height: 2, background: "rgba(240,230,224,0.12)", zIndex: 40 }}>
      <div
        style={{
          height: "100%",
          width: `${(Math.min(step, STEPS) / STEPS) * 100}%`,
          background: ed.gold,
          transition: "width 520ms cubic-bezier(0.22,1,0.36,1)",
        }}
      />
    </div>
  );
}

function Question({ children }: { children: React.ReactNode }) {
  return (
    <h1
      tabIndex={-1}
      style={{
        fontFamily: ed.grotesque,
        fontWeight: 800,
        fontSize: "clamp(34px, 6.4vw, 88px)",
        lineHeight: 0.92,
        letterSpacing: "-0.035em",
        color: ed.ink,
        margin: "clamp(14px,1.8vw,22px) 0 0",
        maxWidth: 960,
        outline: "none",
      }}
    >
      {children}
    </h1>
  );
}

/** The serif italic subline the rest of the issue uses under a headline. */
function Sub({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontFamily: ed.serif,
        fontStyle: "italic",
        fontSize: "clamp(17px,2.2vw,28px)",
        lineHeight: 1.24,
        color: ed.gold,
        margin: "clamp(12px,1.5vw,18px) 0 0",
        maxWidth: 640,
      }}
    >
      {children}
    </p>
  );
}

/** Question 01's panel. Vertical name, cosmic mark, order stamp once picked. */
function CraftPanel({
  option,
  order,
  onClick,
}: {
  option: CraftOption;
  order: number | null;
  onClick: () => void;
}) {
  const selected = order !== null;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      aria-label={option.label}
      className="ctrla-panel"
      style={{ ["--acc" as string]: option.accent }}
    >
      <Image src={option.art} alt="" width={68} height={68} unoptimized className="ctrla-panel-art" />

      <span
        className="ctrla-panel-name"
        style={{ fontFamily: ed.grotesque, color: selected ? option.accent : ed.ink }}
      >
        {option.label}
      </span>

      {/* Meta and the order stamp sit at the foot of the panel. On a phone
          the panel is a bar, so they tuck to the right of the name. */}
      {/* Layout lives in .ctrla-panel-meta, not here: inline styles beat the
          stylesheet, so anything set here could not be re-placed for the
          phone layout where the panel becomes a bar. */}
      <span className="ctrla-panel-meta">
        {selected && (
          <span style={{ fontFamily: ed.mono, fontSize: 11, letterSpacing: "0.2em", color: option.accent }}>
            {String(order + 1).padStart(2, "0")}
          </span>
        )}
        <span
          aria-hidden
          style={{
            width: selected ? 34 : 14,
            height: 2,
            background: selected ? option.accent : "rgba(240,230,224,0.3)",
            transition: "width 320ms cubic-bezier(0.22,1,0.36,1), background 320ms ease",
          }}
        />
      </span>
    </button>
  );
}

/** Every answer after question 01. A row, not a card. */
function Row({
  label,
  meta,
  selected,
  onClick,
}: {
  label: string;
  meta: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className="ctrla-row"
      style={{ color: ed.gold }}
    >
      <span aria-hidden className="ctrla-row-node" />
      <span style={{ minWidth: 0 }}>
        <span
          style={{
            display: "block",
            fontFamily: ed.grotesque,
            fontWeight: 800,
            fontSize: "clamp(26px,4.4vw,58px)",
            letterSpacing: "-0.03em",
            lineHeight: 1,
            color: ed.ink,
          }}
        >
          {label}
        </span>
        <span style={{ display: "block", marginTop: 10 }}>
          <Label color={ed.gold}>{meta}</Label>
        </span>
      </span>
      <span className="ctrla-row-cta" style={{ justifySelf: "end", whiteSpace: "nowrap" }}>
        <Label color={ed.gold}>{selected ? "Picked" : "Select"} →</Label>
      </span>
    </button>
  );
}

/** A door on the reveal. Same row language, sized by rank. */
function DoorRow({ door, primary, accent }: { door: Door; primary?: boolean; accent: string }) {
  return (
    <a
      href={door.href}
      className="ctrla-start-door"
      style={{
        display: "grid",
        gridTemplateColumns: "1fr auto",
        alignItems: "end",
        gap: "clamp(12px,2vw,28px)",
        textDecoration: "none",
        padding: primary ? "clamp(22px,3vw,38px) 0" : "clamp(16px,2.2vw,26px) 0",
        borderBottom: `1px solid ${ed.hair}`,
        borderTop: primary ? `2px solid ${accent}` : "none",
      }}
    >
      <span style={{ minWidth: 0 }}>
        {primary && (
          <span style={{ display: "block", marginBottom: 12 }}>
            <Kicker color={accent}>Start here</Kicker>
          </span>
        )}
        <span
          style={{
            display: "block",
            fontFamily: ed.grotesque,
            fontWeight: 800,
            fontSize: primary ? "clamp(30px,5.2vw,72px)" : "clamp(20px,2.6vw,34px)",
            letterSpacing: "-0.03em",
            lineHeight: 0.98,
            color: primary ? accent : ed.ink,
          }}
        >
          {door.label}
        </span>
        <span
          style={{
            display: "block",
            marginTop: 10,
            fontFamily: ed.body,
            fontSize: primary ? "clamp(14px,1.6vw,18px)" : "clamp(13px,1.4vw,15px)",
            lineHeight: 1.5,
            color: ed.inkSoft,
            maxWidth: 560,
          }}
        >
          {door.note}
        </span>
      </span>
      <span style={{ justifySelf: "end", whiteSpace: "nowrap", paddingBottom: 4 }}>
        <Label color={primary ? accent : ed.gold}>
          Enter <span aria-hidden className="ctrla-start-door-arrow">→</span>
        </Label>
      </span>
    </a>
  );
}

// ── The quiz ─────────────────────────────────────────────────

export default function StartContent() {
  const reduce = useReducedMotion();
  const { profile, save, clear, ready } = useCtrlAProfile();

  // 0..3 are the questions, 4 is the reveal.
  const [step, setStep] = useState(0);
  const [crafts, setCrafts] = useState<CraftSlug[]>([]);
  const [levelIdx, setLevelIdx] = useState<number | null>(null);
  const [intent, setIntent] = useState<Intent | null>(null);
  const [hasBrand, setHasBrand] = useState<boolean | null>(null);

  const headingRef = useRef<HTMLDivElement>(null);
  const didMount = useRef(false);
  const saved = useRef(false);
  /**
   * Owned by the resume effect alone. It cannot share `didMount` with the
   * focus effect below: the profile hook hydrates a tick after mount, so by
   * the time `ready` flips true the focus effect has already set that flag
   * and resume would silently never run.
   */
  const restored = useRef(false);

  // Someone who already answered lands straight on their reveal, so the
  // permanent door in the hero is a way back to your result, not a
  // second interrogation. "Start over" clears it.
  const [resuming, setResuming] = useState(false);
  useEffect(() => {
    // `saved` is already true when the profile we are seeing is the one this
    // session just wrote, which is a finished quiz, not a return visit.
    if (!ready || restored.current || saved.current || !profile) return;
    restored.current = true;
    setCrafts(profile.crafts);
    setLevelIdx(LEVELS.findIndex((l) => l.value === profile.level));
    setIntent(profile.intent);
    setHasBrand(profile.hasBrand);
    setStep(STEPS);
    setResuming(true);
    saved.current = true;
  }, [ready, profile]);

  useEffect(() => {
    document.body.style.backgroundColor = ed.ground;
    return () => {
      document.body.style.backgroundColor = "";
    };
  }, []);

  // Move focus to each new screen so keyboard and screen reader users are
  // not left at the top of the document on every advance.
  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      return;
    }
    const h = headingRef.current?.querySelector<HTMLElement>("h1");
    h?.focus();
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  }, [step, reduce]);

  const level: Level | null = levelIdx === null ? null : LEVELS[levelIdx].value;

  const answers = useMemo(
    () =>
      crafts.length > 0 && level !== null && intent !== null && hasBrand !== null
        ? { crafts, level, intent, hasBrand }
        : null,
    [crafts, level, intent, hasBrand]
  );

  // Persist once, on arrival at the reveal.
  useEffect(() => {
    if (step !== STEPS || saved.current || !answers) return;
    save(answers);
    saved.current = true;
  }, [step, answers, save]);

  function toggleCraft(c: CraftSlug) {
    setCrafts((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));
  }

  function restart() {
    clear();
    saved.current = false;
    restored.current = false;
    setCrafts([]);
    setLevelIdx(null);
    setIntent(null);
    setHasBrand(null);
    setResuming(false);
    setStep(0);
  }

  const accent = crafts[0] ? CRAFTS.find((c) => c.value === crafts[0])!.accent : ed.gold;
  const doors = answers ? doorsFor(answers) : null;

  const fade = reduce
    ? {}
    : {
        initial: { opacity: 0, y: 16 },
        animate: { opacity: 1, y: 0, pointerEvents: "auto" as const },
        // AnimatePresence mode="wait" keeps the outgoing screen mounted until
        // its exit finishes, so without this a fast second tap lands on the
        // question that is already fading out and re-answers it.
        exit: { opacity: 0, y: -12, pointerEvents: "none" as const },
        transition: { duration: 0.34, ease: [0.22, 1, 0.36, 1] as const },
      };

  return (
    <div style={{ minHeight: "100vh", background: ed.ground, position: "relative", overflowX: "clip" }}>
      <div aria-hidden className="ctrla-page-grain" />
      <ProgressRule step={step} />

      <div style={{ position: "relative", zIndex: 1, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        {/* Masthead — the issue's own, not a nav.
            `width: 100%` is required on any Bleed that is a direct child of
            this column flex container: Bleed centres itself with `margin: 0
            auto`, and auto cross-axis margins beat align-items: stretch, so
            without it the masthead shrinks to fit its contents. */}
        <Bleed style={{ width: "100%", padding: "clamp(16px,2.2vw,26px) clamp(18px,5vw,64px) 0" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
            <a href="/ctrla" style={{ display: "inline-flex", alignItems: "center", textDecoration: "none" }} aria-label="CTRL-A home">
              <Image
                src="/ctrla/ctrla-flat-logo-white.svg"
                alt="CTRL-A"
                width={48}
                height={35}
                priority
                unoptimized
                style={{ height: "clamp(20px, 2.4vw, 28px)", width: "auto" }}
              />
            </a>
            <Label color={ed.inkFaint}>
              {step < STEPS ? `${String(step + 1).padStart(2, "0")} / ${String(STEPS).padStart(2, "0")}` : "Your route"}
            </Label>
          </div>
        </Bleed>

        <div ref={headingRef} style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "clamp(20px,3vw,40px) 0" }}>
          <AnimatePresence mode="wait">
            {/* ── 01 · Craft ───────────────────────────────── */}
            {step === 0 && (
              <motion.div key="q0" {...fade}>
                <Bleed style={{ padding: "0 clamp(18px,5vw,64px) clamp(20px,2.6vw,32px)" }}>
                  <Kicker color={ed.gold}>Four taps, twenty seconds</Kicker>
                  <Question>What do you make?</Question>
                  <Sub>Tap all that apply. The first one leads.</Sub>
                </Bleed>

                <div className="ctrla-panels">
                  {CRAFTS.map((c) => {
                    const i = crafts.indexOf(c.value);
                    return <CraftPanel key={c.value} option={c} order={i === -1 ? null : i} onClick={() => toggleCraft(c.value)} />;
                  })}
                </div>
              </motion.div>
            )}

            {/* ── 02 · Level ───────────────────────────────── */}
            {step === 1 && (
              <motion.div key="q1" {...fade}>
                <Bleed style={{ padding: "0 clamp(18px,5vw,64px)" }}>
                  <Kicker color={ed.gold}>Question 02</Kicker>
                  <Question>How far in are you?</Question>
                  <Sub>No wrong answer.</Sub>
                  <div style={{ marginTop: "clamp(22px,3vw,40px)" }}>
                    {LEVELS.map((l, i) => (
                      <Row
                        key={l.label}
                        label={l.label}
                        meta={l.meta}
                        selected={levelIdx === i}
                        onClick={() => {
                          setLevelIdx(i);
                          setStep(2);
                        }}
                      />
                    ))}
                  </div>
                </Bleed>
              </motion.div>
            )}

            {/* ── 03 · Intent ──────────────────────────────── */}
            {step === 2 && (
              <motion.div key="q2" {...fade}>
                <Bleed style={{ padding: "0 clamp(18px,5vw,64px)" }}>
                  <Kicker color={ed.gold}>Question 03</Kicker>
                  <Question>What do you want right now?</Question>
                  <Sub>Whatever is true today.</Sub>
                  <div style={{ marginTop: "clamp(22px,3vw,40px)" }}>
                    {INTENTS.map((o) => (
                      <Row
                        key={o.value}
                        label={o.label}
                        meta={o.meta}
                        selected={intent === o.value}
                        onClick={() => {
                          setIntent(o.value);
                          setStep(3);
                        }}
                      />
                    ))}
                  </div>
                </Bleed>
              </motion.div>
            )}

            {/* ── 04 · Brand ───────────────────────────────── */}
            {step === 3 && (
              <motion.div key="q3" {...fade}>
                <Bleed style={{ padding: "0 clamp(18px,5vw,64px)" }}>
                  <Kicker color={ed.gold}>Question 04</Kicker>
                  <Question>Do you have a look yet?</Question>
                  <Sub>A name, a logo, colours that read as yours.</Sub>
                  <div style={{ marginTop: "clamp(22px,3vw,40px)" }}>
                    <Row
                      label="Yeah, I've got one"
                      meta="Logo and colours I already use"
                      selected={hasBrand === true}
                      onClick={() => {
                        setHasBrand(true);
                        setStep(STEPS);
                      }}
                    />
                    <Row
                      label="Nope, blank page"
                      meta="No name or colours yet"
                      selected={hasBrand === false}
                      onClick={() => {
                        setHasBrand(false);
                        setStep(STEPS);
                      }}
                    />
                  </div>
                </Bleed>
              </motion.div>
            )}

            {/* ── Reveal ───────────────────────────────────── */}
            {step === STEPS && answers && doors && (
              <motion.div key="reveal" {...fade}>
                <Bleed style={{ padding: "0 clamp(18px,5vw,64px)" }}>
                  <Kicker color={accent}>{resuming ? "Where you left off" : "Here's where you start"}</Kicker>
                  <h1
                    tabIndex={-1}
                    style={{
                      fontFamily: ed.grotesque,
                      fontWeight: 800,
                      fontSize: "clamp(30px, 5.4vw, 76px)",
                      lineHeight: 0.94,
                      letterSpacing: "-0.035em",
                      color: ed.ink,
                      margin: "clamp(14px,1.8vw,22px) 0 0",
                      maxWidth: 1040,
                      outline: "none",
                    }}
                  >
                    {profileSentence({ ...answers, v: 1, completedAt: "" } as CtrlAProfile)}
                  </h1>
                  <Sub>{doors.why}</Sub>

                  <div style={{ marginTop: "clamp(26px,3.4vw,46px)" }}>
                    <DoorRow door={doors.primary} primary accent={accent} />
                    {doors.secondary.map((d) => (
                      <DoorRow key={d.href} door={d} accent={accent} />
                    ))}
                  </div>

                  <p
                    style={{
                      fontFamily: ed.mono,
                      fontSize: "clamp(11px,1.2vw,13px)",
                      letterSpacing: "0.08em",
                      lineHeight: 1.7,
                      color: ed.inkFaint,
                      margin: "clamp(20px,2.6vw,30px) 0 0",
                    }}
                  >
                    Saved on this device. Nothing sent anywhere.{" "}
                    <button
                      type="button"
                      onClick={restart}
                      style={{
                        background: "none",
                        border: "none",
                        padding: 0,
                        cursor: "pointer",
                        font: "inherit",
                        color: ed.gold,
                        textDecoration: "underline",
                        textUnderlineOffset: 3,
                      }}
                    >
                      Start over
                    </button>
                  </p>
                </Bleed>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer controls */}
        <Bleed style={{ width: "100%", padding: "0 clamp(18px,5vw,64px) clamp(24px,3.4vw,44px)" }}>
          <div style={{ borderTop: `1px solid ${ed.hair}`, paddingTop: "clamp(14px,1.8vw,22px)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "clamp(14px,2.4vw,28px)" }}>
              {step > 0 && step < STEPS && (
                <button
                  type="button"
                  onClick={() => setStep((s) => s - 1)}
                  className="ctrla-start-text-btn"
                  style={{ background: "none", border: "none", padding: "6px 0", cursor: "pointer" }}
                >
                  <Label color={ed.inkFaint}>← Back</Label>
                </button>
              )}
              {step < STEPS ? (
                <a href="/ctrla" className="ctrla-start-text-btn" style={{ textDecoration: "none", padding: "6px 0" }}>
                  <Label color={ed.inkFaint}>Just let me look around</Label>
                </a>
              ) : (
                <a href="/ctrla" className="ctrla-start-text-btn" style={{ textDecoration: "none", padding: "6px 0" }}>
                  <Label color={ed.inkFaint}>← Back to CTRL-A</Label>
                </a>
              )}
            </div>

            {/* Only the multi-select question needs an explicit Next; the
                single-answer screens advance on tap. */}
            {step === 0 && (
              <button
                type="button"
                disabled={crafts.length === 0}
                onClick={() => setStep(1)}
                className="ctrla-cover-cta"
                style={{
                  fontFamily: ed.mono,
                  fontSize: "clamp(12px,1.4vw,15px)",
                  fontWeight: 700,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: crafts.length ? ed.ground : "rgba(240,230,224,0.35)",
                  background: crafts.length ? ed.gold : "transparent",
                  border: crafts.length ? "none" : `1px solid ${ed.hair}`,
                  padding: "15px 32px",
                  borderRadius: 2,
                  cursor: crafts.length ? "pointer" : "not-allowed",
                }}
              >
                Next →
              </button>
            )}
          </div>
        </Bleed>
      </div>
    </div>
  );
}
