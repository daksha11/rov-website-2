"use client";

// ═══════════════════════════════════════════════════════
// CTRL-A — DREAMASIA FEST FEATURE
// The behind-the-scenes issue. Story open · BTS mosaic
// (hero) · two-city split · production toolkit. Editorial
// and human — the small team is the star, not the gear.
// Real media lives in /ctrla/VOL1; the rest are labelled
// placeholder blocks at locked sizes for photo drop-in.
// ═══════════════════════════════════════════════════════

import { useEffect, useRef } from "react";
import Image from "next/image";
import { ed, Bleed, Rule, Label } from "./editorial";
import { issueMeta, coverShot, issueOpen, bts, twoCities, productionToolkit, type BtsTile } from "../data";

// ── Feature teaser — compact, clickable cover on the front page ──

export function DreamAsiaTeaser() {
  return (
    <section style={{ background: ed.ground, padding: "clamp(48px,7vw,88px) 0" }}>
      <Bleed>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: "clamp(18px,2.4vw,28px)" }}>
          <Label color={ed.ink}>Issue Feature</Label>
          <Label color={ed.inkFaint}>DreamAsia Fest</Label>
        </div>
        <Rule style={{ marginBottom: "clamp(24px,3vw,36px)" }} />

        <a href="/ctrla/dreamasia" className="ctrla-feature-card" style={{ position: "relative", display: "block", width: "100%", aspectRatio: "16 / 7", minHeight: 260, background: ed.panel, overflow: "hidden", textDecoration: "none" }}>
          <Image
            src={coverShot.src}
            alt={coverShot.alt}
            fill
            sizes="(max-width: 768px) 92vw, 1180px"
            className="ctrla-feature-img"
            style={{ objectFit: "cover" }}
          />
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to top, rgba(15,8,32,0.82) 0%, rgba(15,8,32,0.28) 46%, transparent 72%)",
            }}
          />
          <span style={{ position: "absolute", top: 18, left: 20, fontFamily: ed.mono, fontSize: "clamp(9px,1vw,11px)", letterSpacing: "0.2em", textTransform: "uppercase", color: ed.gold }}>
            Behind the scenes
          </span>
          <div style={{ position: "absolute", left: 20, right: 20, bottom: 18, display: "flex", flexDirection: "column", gap: 12 }}>
            <h2 style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(28px,5vw,68px)", letterSpacing: "-0.03em", lineHeight: 0.92, color: ed.paper, margin: 0, maxWidth: 760 }}>
              {issueMeta.coverHeadline}
            </h2>
            <p style={{ fontFamily: ed.body, fontSize: "clamp(14px,1.6vw,18px)", lineHeight: 1.5, color: "rgba(240,230,224,0.86)", margin: 0, maxWidth: 560 }}>
              How a small team produced a multi-city festival headline. Sam Suen headlines DreamAsia Fest across two states.
            </p>
            <span className="ctrla-feature-cta" style={{ display: "inline-flex", alignItems: "center", gap: 9, fontFamily: ed.mono, fontSize: "clamp(11px,1.2vw,13px)", letterSpacing: "0.16em", textTransform: "uppercase", color: ed.paper, marginTop: 4 }}>
              Read the feature <span aria-hidden className="ctrla-feature-arrow" style={{ transition: "transform .25s" }}>→</span>
            </span>
          </div>
        </a>
      </Bleed>
    </section>
  );
}

// ── Media block — image / video / labelled placeholder ──

// Plays only while on-screen, and doesn't buffer until then. Several
// autoplaying HD videos decoding at once is the main scroll-jank culprit,
// so each one pauses and releases the decoder when scrolled out of view.
function LazyVideo({ src, label }: { src: string; label?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          v.play().catch(() => {});
        } else {
          v.pause();
        }
      },
      { rootMargin: "150px", threshold: 0.1 }
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);
  return (
    <video
      ref={ref}
      src={src}
      muted
      loop
      playsInline
      preload="none"
      aria-label={label}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
    />
  );
}

function MediaBlock({
  img,
  video,
  label,
  ratio = "4 / 3",
  rounded = false,
}: {
  img?: string;
  video?: string;
  label?: string;
  ratio?: string;
  rounded?: boolean;
}) {
  const hasMedia = !!(img || video);
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: ratio,
        background: hasMedia ? ed.panel : ed.paper,
        backgroundImage: hasMedia
          ? undefined
          : "repeating-linear-gradient(45deg, rgba(36,18,58,0.05) 0, rgba(36,18,58,0.05) 1px, transparent 1px, transparent 11px)",
        overflow: "hidden",
        borderRadius: rounded ? 12 : 0,
        // Light wireframe frame when empty — reads as a drop-in slot.
        boxShadow: hasMedia ? "none" : "inset 0 0 0 1.5px rgba(36,18,58,0.3)",
      }}
    >
      {video ? (
        <LazyVideo src={video} label={label} />
      ) : img ? (
        <Image src={img} alt={label || ""} fill sizes="(max-width: 768px) 100vw, 60vw" style={{ objectFit: "cover" }} />
      ) : null}

      {/* Empty placeholder — centred label */}
      {!hasMedia && label && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 18,
            textAlign: "center",
          }}
        >
          <span
            style={{
              fontFamily: ed.mono,
              fontSize: "clamp(9px,1vw,11px)",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "rgba(36,18,58,0.65)",
              lineHeight: 1.5,
            }}
          >
            {label}
          </span>
        </div>
      )}

      {/* Media caption — short, bottom-left over a gradient */}
      {hasMedia && label && (
        <>
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to top, rgba(15,8,32,0.7) 0%, transparent 42%)",
              pointerEvents: "none",
            }}
          />
          <span
            style={{
              position: "absolute",
              left: 14,
              bottom: 12,
              fontFamily: ed.mono,
              fontSize: "clamp(8px,0.9vw,10px)",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "rgba(240,230,224,0.82)",
            }}
          >
            {label}
          </span>
        </>
      )}
    </div>
  );
}

// ── Vue narration — pull-quote in Vue's voice ──────────

function VueNote({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <div style={{ display: "flex", gap: 14, alignItems: "flex-start", maxWidth: 460 }}>
      {/* Vue mascot drop-in slot */}
      <span
        aria-hidden
        style={{
          flexShrink: 0,
          width: 38,
          height: 38,
          borderRadius: "50%",
          border: `1px solid ${ed.amber}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: ed.mono,
          fontSize: 8,
          letterSpacing: "0.1em",
          color: ed.amber,
        }}
      >
        VUE
      </span>
      <p
        style={{
          fontFamily: ed.serif,
          fontStyle: "italic",
          fontSize: "clamp(15px,1.7vw,19px)",
          lineHeight: 1.5,
          color: dark ? ed.paper : ed.ink,
          margin: 0,
        }}
      >
        {children}
      </p>
    </div>
  );
}

// ── 1. The story, how it started ───────────────────────

export function IssueOpen() {
  return (
    <section style={{ background: ed.ground, padding: "clamp(56px,8vw,104px) 0" }}>
      <Bleed>
        {/* Feature lead — the issue's hero performance frame */}
        <div style={{ position: "relative", width: "100%", aspectRatio: "16 / 7", minHeight: 220, background: ed.panel, overflow: "hidden", marginBottom: "clamp(40px,5vw,72px)" }}>
          <Image
            src={coverShot.src}
            alt={coverShot.alt}
            fill
            sizes="(max-width: 768px) 92vw, 1180px"
            style={{ objectFit: "cover" }}
          />
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to top, rgba(15,8,32,0.72) 0%, transparent 46%, transparent 78%, rgba(15,8,32,0.4) 100%)",
            }}
          />
          <span style={{ position: "absolute", top: 16, left: 18, fontFamily: ed.mono, fontSize: "clamp(9px,1vw,11px)", letterSpacing: "0.2em", textTransform: "uppercase", color: ed.gold }}>
            Issue Feature · DreamAsia Fest
          </span>
          <div style={{ position: "absolute", left: 18, right: 18, bottom: 16, display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
            <h2 style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(28px,4.6vw,60px)", letterSpacing: "-0.03em", lineHeight: 0.9, color: ed.paper, margin: 0, maxWidth: 760 }}>
              {issueMeta.coverHeadline}
            </h2>
            <span style={{ fontFamily: ed.mono, fontSize: "clamp(8px,0.9vw,10px)", letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(240,230,224,0.7)" }}>
              {coverShot.label}
            </span>
          </div>
        </div>

        <Label style={{ display: "block", marginBottom: 18 }}>{issueOpen.eyebrow}</Label>
        <div className="ctrla-open-grid">
          {/* Copy */}
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 28 }}>
            <div>
              <h2
                style={{
                  fontFamily: ed.grotesque,
                  fontWeight: 800,
                  fontSize: "clamp(30px,4.6vw,60px)",
                  letterSpacing: "-0.025em",
                  lineHeight: 0.96,
                  color: ed.ink,
                  margin: "0 0 22px",
                }}
              >
                {issueOpen.headline}
              </h2>
              {issueOpen.body.map((p, i) => (
                <p
                  key={i}
                  style={{
                    fontFamily: ed.body,
                    fontSize: "clamp(15px,1.7vw,19px)",
                    lineHeight: 1.65,
                    color: ed.inkSoft,
                    margin: i === 0 ? "0 0 16px" : 0,
                    maxWidth: 540,
                  }}
                >
                  {p}
                </p>
              ))}
            </div>
            <VueNote>{issueOpen.vueNote}</VueNote>
          </div>

          {/* Contrast pair — quiet prep vs the stage */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(12px,2vw,20px)" }}>
            <MediaBlock label={issueOpen.prep.label} ratio={issueOpen.prep.ratio} />
            <MediaBlock img={issueOpen.stage.src} label={issueOpen.stage.label} ratio={issueOpen.stage.ratio} />
          </div>
        </div>
      </Bleed>
    </section>
  );
}

// ── 2. Behind the scenes — the hero mosaic ─────────────

function BtsCell({ tile }: { tile: BtsTile }) {
  return (
    <div
      className={tile.wide ? "ctrla-bts-cell ctrla-bts-wide" : "ctrla-bts-cell"}
      style={{ gridColumn: `span ${tile.span}` }}
    >
      <MediaBlock img={tile.img} video={tile.video} label={tile.label} ratio={tile.ratio} />
    </div>
  );
}

export function BehindTheScenes() {
  return (
    <section style={{ background: ed.panel, padding: "clamp(64px,9vw,120px) 0" }}>
      <Bleed>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 20, flexWrap: "wrap" }}>
          <div style={{ maxWidth: 720 }}>
            <Label color={ed.gold} style={{ display: "block", marginBottom: 16 }}>{bts.eyebrow}</Label>
            <h2
              style={{
                fontFamily: ed.grotesque,
                fontWeight: 800,
                fontSize: "clamp(34px,6vw,84px)",
                letterSpacing: "-0.03em",
                lineHeight: 0.9,
                color: ed.paper,
                margin: 0,
              }}
            >
              {bts.headline}
            </h2>
          </div>
          <p style={{ fontFamily: ed.serif, fontStyle: "italic", fontSize: "clamp(13px,1.5vw,16px)", lineHeight: 1.5, color: "rgba(240,230,224,0.6)", textAlign: "right", maxWidth: 320, margin: 0 }}>
            {bts.note}
          </p>
        </div>
        <Rule color="rgba(240,230,224,0.2)" style={{ margin: "clamp(28px,4vw,48px) 0" }} />

        <div className="ctrla-bts-grid">
          {bts.tiles.map((t, i) => (
            <BtsCell key={i} tile={t} />
          ))}
        </div>
      </Bleed>
    </section>
  );
}

// ── 3. Two cities, the scale ───────────────────────────

export function TwoCities() {
  return (
    <section style={{ background: ed.ground, padding: "clamp(56px,8vw,104px) 0" }}>
      <Bleed>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 20, flexWrap: "wrap" }}>
          <div style={{ maxWidth: 640 }}>
            <Label style={{ display: "block", marginBottom: 16 }}>{twoCities.eyebrow}</Label>
            <h2
              style={{
                fontFamily: ed.grotesque,
                fontWeight: 800,
                fontSize: "clamp(30px,5vw,68px)",
                letterSpacing: "-0.025em",
                lineHeight: 0.94,
                color: ed.ink,
                margin: 0,
              }}
            >
              {twoCities.headline}
            </h2>
          </div>
          <p style={{ fontFamily: ed.body, fontSize: "clamp(14px,1.6vw,17px)", lineHeight: 1.6, color: ed.inkSoft, maxWidth: 360, margin: 0 }}>
            {twoCities.body}
          </p>
        </div>
        <Rule style={{ margin: "clamp(28px,4vw,48px) 0" }} />

        <div className="ctrla-cities">
          {twoCities.cities.map((c) => (
            <div key={c.state} style={{ display: "flex", flexDirection: "column" }}>
              <MediaBlock label={c.label} ratio={c.ratio} />
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12, marginTop: 16 }}>
                <h3 style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(22px,3vw,38px)", letterSpacing: "-0.02em", color: ed.ink, margin: 0 }}>
                  {c.state}
                </h3>
                <Label color={ed.inkFaint}>{c.state === "North Carolina" ? "Show 01" : "Show 02"}</Label>
              </div>
              <p style={{ fontFamily: ed.body, fontSize: "clamp(13px,1.4vw,15px)", lineHeight: 1.6, color: ed.inkSoft, margin: "8px 0 0", maxWidth: 460 }}>
                {c.note}
              </p>
            </div>
          ))}
        </div>
      </Bleed>
    </section>
  );
}

// ── 4. The toolkit, what you can use ───────────────────

export function ProductionToolkit() {
  return (
    <section style={{ background: ed.ground, padding: "clamp(56px,8vw,104px) 0" }}>
      <Bleed>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 20, flexWrap: "wrap" }}>
          <div style={{ maxWidth: 640 }}>
            <Label style={{ display: "block", marginBottom: 16 }}>{productionToolkit.eyebrow}</Label>
            <h2
              style={{
                fontFamily: ed.grotesque,
                fontWeight: 800,
                fontSize: "clamp(30px,5vw,68px)",
                letterSpacing: "-0.025em",
                lineHeight: 0.94,
                color: ed.ink,
                margin: 0,
              }}
            >
              {productionToolkit.headline}
            </h2>
          </div>
          <p style={{ fontFamily: ed.serif, fontStyle: "italic", fontSize: "clamp(13px,1.5vw,16px)", color: ed.inkSoft, textAlign: "right", maxWidth: 300, margin: 0 }}>
            {productionToolkit.note}
          </p>
        </div>
        <Rule style={{ margin: "clamp(28px,4vw,48px) 0" }} />

        <div className="ctrla-toolgrid">
          {productionToolkit.tools.map((t, i) => (
            <div
              key={t.name}
              style={{
                borderTop: `2px solid ${ed.ink}`,
                paddingTop: 16,
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 10 }}>
                <span style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(18px,2.2vw,26px)", letterSpacing: "-0.01em", color: ed.ink }}>
                  {t.name}
                </span>
                <Label color={ed.inkFaint}>{String(i + 1).padStart(2, "0")}</Label>
              </div>
              <span
                style={{
                  fontFamily: ed.mono,
                  fontSize: 9,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: ed.amber,
                  border: `1px solid ${ed.hair}`,
                  padding: "4px 10px",
                  alignSelf: "flex-start",
                }}
              >
                {t.role}
              </span>
              <p style={{ fontFamily: ed.body, fontSize: "clamp(14px,1.5vw,16px)", lineHeight: 1.55, color: ed.inkSoft, margin: 0 }}>
                {t.line}
              </p>
            </div>
          ))}
        </div>
      </Bleed>
    </section>
  );
}
