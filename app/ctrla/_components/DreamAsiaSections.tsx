"use client";

// ═══════════════════════════════════════════════════════
// CTRL-A — FEATURE STORY (beat / module system)
// ───────────────────────────────────────────────────────
// A CTRL-A feature is not hand-built per volume. It is
// COMPOSED from named beats that read their content from the
// volume's `feature` data (see _volumes/types.ts):
//
//   FIXED   The Open · The Work · The Turn · The Toolkit
//   OPTION  The Scale · The Interview · The Sound
//
// `FeatureStory` renders the fixed beats in order and drops in
// each optional module only when the volume supplies it. Every
// beat below is a pure, prop-driven component — swap the data
// in `vol-NN.ts` and the story re-composes. Real media lives in
// /public/ctrla/VOLn; videos use the LazyVideo pattern so only
// on-screen clips decode. Inline styles + existing .ctrla-*
// classes only.
// ═══════════════════════════════════════════════════════

import { useEffect, useRef } from "react";
import Image from "next/image";
import { ed, Bleed, Rule, Label, Kicker } from "./editorial";
import { currentVolume, type Volume } from "../_volumes";
import type {
  Bts,
  BtsTile,
  CoverShot,
  FeatureInterview,
  FeatureSound,
  FeatureTurn,
  IssueOpen,
  ProductionToolkit,
  TwoCities,
} from "../_volumes/types";

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

// ── Shared beat header — eyebrow + big headline + right meta ──
// Every beat opens the same way, so the header is one component.
// `meta` is optional right-aligned serif italic; `note` is the same slot
// but plainer. Pass one or the other.
function BeatHeader({
  eyebrow,
  headline,
  meta,
  dark = false,
  goldEyebrow = false,
}: {
  eyebrow: string;
  headline: string;
  meta?: React.ReactNode;
  dark?: boolean;
  goldEyebrow?: boolean;
}) {
  const ink = dark ? ed.paper : ed.ink;
  return (
    <>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 20, flexWrap: "wrap" }}>
        <div style={{ maxWidth: 720 }}>
          <Label color={goldEyebrow ? ed.gold : ed.amber} style={{ display: "block", marginBottom: 16 }}>
            {eyebrow}
          </Label>
          <h2
            style={{
              fontFamily: ed.grotesque,
              fontWeight: 800,
              fontSize: "clamp(30px,5.4vw,74px)",
              letterSpacing: "-0.03em",
              lineHeight: 0.92,
              color: ink,
              margin: 0,
            }}
          >
            {headline}
          </h2>
        </div>
        {meta && (
          <p
            style={{
              fontFamily: ed.serif,
              fontStyle: "italic",
              fontSize: "clamp(13px,1.5vw,16px)",
              lineHeight: 1.5,
              color: dark ? "rgba(240,230,224,0.6)" : ed.inkSoft,
              textAlign: "right",
              maxWidth: 340,
              margin: 0,
            }}
          >
            {meta}
          </p>
        )}
      </div>
      <Rule color={dark ? "rgba(240,230,224,0.2)" : ed.ink} style={{ margin: "clamp(28px,4vw,48px) 0" }} />
    </>
  );
}

// ════════════════════════════════════════════════════════
// FIXED BEAT 1 · The Open — hero + lead + one Vue pull-quote
// ════════════════════════════════════════════════════════

function TheOpen({ data, cover, featureHeadline }: { data: IssueOpen; cover: CoverShot; featureHeadline: string }) {
  return (
    <section style={{ background: "transparent", padding: "clamp(56px,8vw,104px) 0" }}>
      <Bleed>
        {/* Feature lead — the issue's hero performance frame */}
        <div style={{ position: "relative", width: "100%", aspectRatio: "16 / 7", minHeight: 220, background: ed.panel, overflow: "hidden", marginBottom: "clamp(40px,5vw,72px)" }}>
          <Image
            src={cover.src}
            alt={cover.alt}
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
              {featureHeadline}
            </h2>
            <span style={{ fontFamily: ed.mono, fontSize: "clamp(8px,0.9vw,10px)", letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(240,230,224,0.7)" }}>
              {cover.label}
            </span>
          </div>
        </div>

        <Label style={{ display: "block", marginBottom: 18 }}>{data.eyebrow}</Label>
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
                {data.headline}
              </h2>
              {data.body.map((paragraph, i) => (
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
                  {paragraph}
                </p>
              ))}
            </div>
            <VueNote>{data.vueNote}</VueNote>
          </div>

          {/* The stage — first load-in */}
          <MediaBlock img={data.stage.src} label={data.stage.label} ratio={data.stage.ratio} />
        </div>
      </Bleed>
    </section>
  );
}

// ════════════════════════════════════════════════════════
// FIXED BEAT 2 · The Work — the hero mosaic of real media
// ════════════════════════════════════════════════════════

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

function TheWork({ data }: { data: Bts }) {
  return (
    <section style={{ background: ed.panel, padding: "clamp(64px,9vw,120px) 0" }}>
      <Bleed>
        <BeatHeader eyebrow={data.eyebrow} headline={data.headline} meta={data.note} dark goldEyebrow />
        <div className="ctrla-bts-grid">
          {data.tiles.map((tile, i) => (
            <BtsCell key={i} tile={tile} />
          ))}
        </div>
      </Bleed>
    </section>
  );
}

// ════════════════════════════════════════════════════════
// FIXED BEAT 3 · The Turn — the decision that nearly broke it
// The narrative pivot. Body on the left, one line pulled large
// on the right so the obstacle lands as the story's centre.
// ════════════════════════════════════════════════════════

function TheTurn({ data }: { data: FeatureTurn }) {
  return (
    <section style={{ background: "transparent", padding: "clamp(56px,8vw,104px) 0" }}>
      <Bleed>
        <BeatHeader eyebrow={data.eyebrow} headline={data.headline} />
        <div className="ctrla-open-grid">
          {/* The prose */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {data.body.map((paragraph, i) => (
              <p
                key={i}
                style={{
                  fontFamily: ed.body,
                  fontSize: "clamp(15px,1.7vw,19px)",
                  lineHeight: 1.65,
                  color: ed.inkSoft,
                  margin: 0,
                  maxWidth: 560,
                }}
              >
                {paragraph}
              </p>
            ))}
          </div>

          {/* The pull-quote — the turn in one line, set large */}
          <blockquote
            style={{
              margin: 0,
              alignSelf: "stretch",
              background: ed.panel,
              borderLeft: `2px solid ${ed.gold}`,
              padding: "clamp(28px,4vw,44px)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: 18,
            }}
          >
            <Label color={ed.gold}>The decision</Label>
            <p
              style={{
                fontFamily: ed.serif,
                fontStyle: "italic",
                fontSize: "clamp(24px,3.4vw,42px)",
                lineHeight: 1.12,
                letterSpacing: "-0.01em",
                color: ed.paper,
                margin: 0,
              }}
            >
              {data.pullquote}
            </p>
          </blockquote>
        </div>
      </Bleed>
    </section>
  );
}

// ════════════════════════════════════════════════════════
// FIXED BEAT 4 · The Toolkit — how it was made, so you can too
// ════════════════════════════════════════════════════════

function TheToolkit({ data }: { data: ProductionToolkit }) {
  return (
    <section style={{ background: "transparent", padding: "clamp(56px,8vw,104px) 0" }}>
      <Bleed>
        <BeatHeader eyebrow={data.eyebrow} headline={data.headline} meta={data.note} />
        <div className="ctrla-toolgrid">
          {data.tools.map((tool, i) => (
            <div
              key={tool.name}
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
                  {tool.name}
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
                {tool.role}
              </span>
              <p style={{ fontFamily: ed.body, fontSize: "clamp(14px,1.5vw,16px)", lineHeight: 1.55, color: ed.inkSoft, margin: 0 }}>
                {tool.line}
              </p>
            </div>
          ))}
        </div>
      </Bleed>
    </section>
  );
}

// ════════════════════════════════════════════════════════
// OPTIONAL MODULE · The Scale — multi-location / multi-show
// ════════════════════════════════════════════════════════

function TheScale({ data }: { data: TwoCities }) {
  return (
    <section style={{ background: "transparent", padding: "clamp(56px,8vw,104px) 0" }}>
      <Bleed>
        <BeatHeader eyebrow={data.eyebrow} headline={data.headline} meta={data.body} />
        {/* One crew, one operation, two states — a single honest panel with the
            two-state point carried in the annotation row beneath it. */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <MediaBlock img={data.panel.src} label={data.panel.label} ratio={data.panel.ratio} />
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 16, marginTop: 20, flexWrap: "wrap" }}>
            <h3 style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(22px,3vw,38px)", letterSpacing: "-0.02em", color: ed.ink, margin: 0 }}>
              North Carolina <span style={{ color: ed.inkFaint }}>→</span> Georgia
            </h3>
            <Label color={ed.inkFaint}>Two shows · Two states</Label>
          </div>
        </div>
      </Bleed>
    </section>
  );
}

// ════════════════════════════════════════════════════════
// OPTIONAL MODULE · The Interview — three Q&A
// ════════════════════════════════════════════════════════

function TheInterview({ data }: { data: FeatureInterview }) {
  return (
    <section style={{ background: ed.panel, padding: "clamp(64px,9vw,120px) 0" }}>
      <Bleed>
        <BeatHeader
          eyebrow={data.eyebrow}
          headline={data.headline}
          meta={`In conversation with ${data.subject}`}
          dark
          goldEyebrow
        />
        <div style={{ display: "flex", flexDirection: "column", gap: "clamp(28px,4vw,44px)" }}>
          {data.qa.map((item, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 820 }}>
              <div style={{ display: "flex", gap: 14, alignItems: "baseline" }}>
                <Label color={ed.gold}>Q{String(i + 1).padStart(2, "0")}</Label>
                <h3
                  style={{
                    fontFamily: ed.grotesque,
                    fontWeight: 800,
                    fontSize: "clamp(19px,2.4vw,30px)",
                    letterSpacing: "-0.02em",
                    lineHeight: 1.05,
                    color: ed.paper,
                    margin: 0,
                  }}
                >
                  {item.question}
                </h3>
              </div>
              <p
                style={{
                  fontFamily: ed.body,
                  fontSize: "clamp(15px,1.7vw,19px)",
                  lineHeight: 1.6,
                  color: "rgba(240,230,224,0.86)",
                  margin: 0,
                  paddingLeft: "clamp(0px,3vw,52px)",
                }}
              >
                {item.answer}
              </p>
            </div>
          ))}
        </div>
      </Bleed>
    </section>
  );
}

// ════════════════════════════════════════════════════════
// OPTIONAL MODULE · The Sound — one embedded track
// A link-out card (streaming), matching the on-repeat pattern.
// ════════════════════════════════════════════════════════

function TheSound({ data }: { data: FeatureSound }) {
  const { track } = data;
  return (
    <section style={{ background: "transparent", padding: "clamp(56px,8vw,104px) 0" }}>
      <Bleed>
        <BeatHeader eyebrow={data.eyebrow} headline={data.headline} meta={data.note} />
        <a
          href={track.url}
          target="_blank"
          rel="noopener noreferrer"
          className="ctrla-feature-card"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "clamp(16px,3vw,32px)",
            background: ed.panel,
            padding: "clamp(16px,2.4vw,24px)",
            textDecoration: "none",
          }}
        >
          <span style={{ position: "relative", flexShrink: 0, width: "clamp(84px,14vw,132px)", aspectRatio: "1 / 1", overflow: "hidden", background: ed.ground }}>
            <Image src={track.image} alt={`${track.title} by ${track.artist}`} fill sizes="132px" style={{ objectFit: "cover" }} />
          </span>
          <span style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 0 }}>
            <Label color={ed.gold}>Now playing</Label>
            <span style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(22px,3.4vw,42px)", letterSpacing: "-0.02em", lineHeight: 0.98, color: ed.paper }}>
              {track.title}
            </span>
            <span style={{ fontFamily: ed.body, fontSize: "clamp(14px,1.6vw,18px)", color: "rgba(240,230,224,0.72)" }}>
              {track.artist}
            </span>
          </span>
          <span className="ctrla-feature-cta" style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 9, fontFamily: ed.mono, fontSize: "clamp(11px,1.2vw,13px)", letterSpacing: "0.16em", textTransform: "uppercase", color: ed.paper, whiteSpace: "nowrap" }}>
            Listen <span aria-hidden className="ctrla-feature-arrow" style={{ transition: "transform .25s" }}>→</span>
          </span>
        </a>
      </Bleed>
    </section>
  );
}

// ════════════════════════════════════════════════════════
// THE COMPOSER · FeatureStory
// Renders the four fixed beats in order and drops in each
// optional module only when the volume supplies it. This is the
// whole feature: point it at a volume and it composes itself.
// ════════════════════════════════════════════════════════

export function FeatureStory({ volume = currentVolume }: { volume?: Volume }) {
  const { feature, issueMeta } = volume;
  return (
    <>
      {/* Fixed beats */}
      <TheOpen data={feature.issueOpen} cover={feature.coverShot} featureHeadline={issueMeta.featureHeadline} />
      <TheWork data={feature.bts} />
      <TheTurn data={feature.turn} />

      {/* Optional modules — render only when present */}
      {feature.twoCities && <TheScale data={feature.twoCities} />}
      {feature.interview && <TheInterview data={feature.interview} />}
      {feature.sound && <TheSound data={feature.sound} />}

      {/* Fixed closing beat */}
      <TheToolkit data={feature.productionToolkit} />
    </>
  );
}

// ── Feature teaser — compact, clickable cover on the front page ──
// Standalone (rendered by CtrlAContent). Reads the current volume so
// the front page and the full feature route never drift.

export function DreamAsiaTeaser() {
  const { feature, issueMeta } = currentVolume;
  const { coverShot } = feature;
  return (
    <section style={{ background: "transparent", padding: "clamp(48px,7vw,88px) 0" }}>
      <Bleed>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: "clamp(18px,2.4vw,28px)" }}>
          <Kicker color={ed.gold}>Issue Feature</Kicker>
          <Label color={ed.gold}>DreamAsia Fest</Label>
        </div>
        <Rule style={{ marginBottom: "clamp(24px,3vw,36px)" }} />

        <a href={feature.href} className="ctrla-feature-card" style={{ position: "relative", display: "block", width: "100%", aspectRatio: "16 / 7", minHeight: 300, background: ed.panel, border: `1px solid ${ed.hair}`, overflow: "hidden", textDecoration: "none" }}>
          <Image
            src={coverShot.src}
            alt={coverShot.alt}
            fill
            sizes="(max-width: 768px) 92vw, 1180px"
            className="ctrla-feature-img"
            style={{ objectFit: "cover", filter: "blur(5px)" }}
          />
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to top, rgba(15,8,32,0.9) 0%, rgba(15,8,32,0.42) 40%, rgba(15,8,32,0.08) 68%, transparent 100%)",
            }}
          />
          <span style={{ position: "absolute", top: "clamp(16px,2vw,28px)", left: "clamp(18px,2.4vw,34px)", fontFamily: ed.mono, fontSize: "clamp(9px,1vw,11px)", letterSpacing: "0.2em", textTransform: "uppercase", color: ed.gold }}>
            Behind the scenes
          </span>
          <div style={{ position: "absolute", left: "clamp(18px,2.4vw,34px)", right: "clamp(18px,2.4vw,34px)", bottom: "clamp(16px,2.2vw,30px)", display: "flex", flexDirection: "column", gap: "clamp(8px,1vw,14px)" }}>
            <h2 style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(26px,3.6vw,52px)", letterSpacing: "-0.03em", lineHeight: 0.94, color: ed.paper, margin: 0, maxWidth: 640 }}>
              {issueMeta.featureHeadline.replace(/\.$/, "")}<span style={{ color: ed.gold }}>.</span>
            </h2>
            <p style={{ fontFamily: ed.body, fontSize: "clamp(13px,1.4vw,17px)", lineHeight: 1.5, color: "rgba(240,230,224,0.86)", margin: 0, maxWidth: 520 }}>
              {issueMeta.featureDeck}
            </p>
            <span className="ctrla-feature-cta" style={{ display: "inline-flex", alignItems: "center", gap: 9, fontFamily: ed.mono, fontSize: "clamp(10px,1.1vw,12px)", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: ed.gold, marginTop: 4 }}>
              Read the feature <span aria-hidden className="ctrla-feature-arrow" style={{ transition: "transform .25s" }}>→</span>
            </span>
          </div>
        </a>
      </Bleed>
    </section>
  );
}
