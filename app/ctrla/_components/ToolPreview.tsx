"use client";

// ═══════════════════════════════════════════════════════
// CTRL-A — TOOL PREVIEW
// A live look at each tool's site inside a CTRL-A browser
// frame. Most tool marketing sites block iframe embedding
// (X-Frame-Options / CSP), so a server-rendered screenshot
// (WordPress mShots, free, no key) gives every station a
// real visual. Tools flagged `embeddable` also get a scaled
// live iframe layered on top. Same idea as the studio site's
// "Sites I've Helped Build" hover preview.
// ═══════════════════════════════════════════════════════

import { useEffect, useRef, useState } from "react";
import { ed as edBase } from "./editorial";
import { localShot } from "./toolshots";

const shot = (url: string) =>
  `https://s0.wp.com/mshots/v1/${encodeURIComponent(url)}?w=1200&h=750`;

// iframe renders large then scales down to fit the card.
const SCALE = 0.4;
const INV = `${(100 / SCALE).toFixed(2)}%`;

function Chrome({ url, accent, theme }: { url: string; accent: string; theme: typeof edBase }) {
  const ed = theme;
  const label = url.replace(/^https?:\/\//, "").replace(/\/$/, "");
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        height: 34,
        padding: "0 12px",
        background: "rgba(240,230,224,0.05)",
        borderBottom: `1px solid ${ed.hair}`,
        flexShrink: 0,
      }}
    >
      {/* Traffic lights — tinted from the palette, not the usual mac trio */}
      <span style={{ display: "flex", gap: 6, flexShrink: 0 }}>
        <span style={{ width: 9, height: 9, borderRadius: "50%", background: ed.amber }} />
        <span style={{ width: 9, height: 9, borderRadius: "50%", background: ed.gold }} />
        <span style={{ width: 9, height: 9, borderRadius: "50%", background: ed.plum }} />
      </span>
      {/* URL bar */}
      <span
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          gap: 6,
          height: 20,
          padding: "0 10px",
          margin: "0 6px",
          background: "rgba(240,230,224,0.05)",
          border: `1px solid ${ed.hair}`,
          borderRadius: 5,
          maxWidth: 340,
          minWidth: 0,
        }}
      >
        <span aria-hidden style={{ width: 6, height: 7, border: `1px solid ${accent}`, borderRadius: 1, opacity: 0.8, flexShrink: 0 }} />
        <span style={{ fontFamily: ed.mono, fontSize: 10, color: ed.inkSoft, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {label}
        </span>
      </span>
    </div>
  );
}

export default function ToolPreview({
  url,
  name,
  accent,
  embeddable = false,
  preview,
  theme,
}: {
  url: string;
  name: string;
  accent: string;
  embeddable?: boolean;
  preview?: string;
  theme?: typeof edBase;
}) {
  const ed = theme ?? edBase;
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [frameLoaded, setFrameLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [tick, setTick] = useState(0);

  // Priority: hand-curated `preview` override, then a self-hosted
  // shot (public/ctrla/toolshots/{id}.webp) when the manifest lists
  // one, then the third-party mShots capture as the safety net.
  const local = localShot(url);
  const src = preview ?? local ?? shot(url);
  // Only the remote mShots capture needs the reload nudge; curated
  // and self-hosted shots are local files that resolve immediately.
  const isRemote = !preview && !local;

  // Load the heavy preview only once the station nears the viewport.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin: "400px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // mShots renders the shot server-side on first request; nudge a few silent
  // reloads, then give up to the branded fallback if it never resolves.
  // (A curated `preview` image is local, so it needs no nudging.)
  useEffect(() => {
    if (!inView || loaded || failed || !isRemote) return;
    if (tick >= 3) {
      const id = setTimeout(() => setFailed(true), 3000);
      return () => clearTimeout(id);
    }
    const id = setTimeout(() => setTick((t) => t + 1), 2600);
    return () => clearTimeout(id);
  }, [inView, loaded, failed, tick, isRemote]);

  return (
    <div
      ref={ref}
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        background: ed.panel,
        overflow: "hidden",
      }}
    >
      <Chrome url={url} accent={accent} theme={ed} />

      <div style={{ position: "relative", flex: 1, overflow: "hidden" }}>
        {/* Loading */}
        {inView && !loaded && !failed && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              background: ed.panel,
              zIndex: 2,
            }}
          >
            <span
              className="ctrla-preview-spin"
              style={{ width: 20, height: 20, borderRadius: "50%", border: `2px solid ${accent}`, borderTopColor: "transparent" }}
            />
            <span style={{ fontFamily: ed.mono, fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: ed.inkFaint }}>
              Loading preview
            </span>
          </div>
        )}

        {/* Screenshot — base layer / poster (curated image or auto capture) */}
        {inView && !failed && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={tick}
            src={src}
            alt={`${name} website preview`}
            onLoad={() => setLoaded(true)}
            onError={() => setFailed(true)}
            loading="lazy"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "top center",
              opacity: loaded ? 1 : 0,
              transition: "opacity 0.6s ease",
            }}
          />
        )}

        {/* Branded fallback — a preview never reads as broken */}
        {inView && failed && (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 14,
              padding: 20,
              textAlign: "center",
              textDecoration: "none",
              background: `radial-gradient(120% 120% at 30% 20%, ${accent}26 0%, ${ed.panel} 62%)`,
              zIndex: 2,
            }}
          >
            <span
              aria-hidden
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: `radial-gradient(circle at 34% 30%, ${accent}, ${ed.panel} 78%)`,
                boxShadow: `0 0 22px ${accent}44`,
              }}
            />
            <span style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(18px,2.4vw,28px)", letterSpacing: "-0.02em", color: ed.ink }}>
              {name}
            </span>
            <span style={{ fontFamily: ed.mono, fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: accent }}>
              Open site ↗
            </span>
          </a>
        )}

        {/* Live iframe — layered on top only where the site allows it */}
        {inView && embeddable && (
          <iframe
            key={url}
            src={url}
            title={name}
            sandbox="allow-scripts allow-same-origin"
            loading="lazy"
            onLoad={() => setFrameLoaded(true)}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: INV,
              height: INV,
              transform: `scale(${SCALE})`,
              transformOrigin: "top left",
              border: 0,
              opacity: frameLoaded ? 1 : 0,
              transition: "opacity 0.6s ease",
              pointerEvents: "none",
            }}
          />
        )}

        {/* Status badge — only over an actual preview, not the fallback */}
        {!failed && (
          <span
            style={{
              position: "absolute",
              right: 10,
              bottom: 9,
              zIndex: 3,
              fontFamily: ed.mono,
              fontSize: 8,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: ed.ground,
              background: accent,
              padding: "3px 7px",
              borderRadius: 2,
            }}
          >
            {embeddable && frameLoaded ? "Live" : "Preview"}
          </span>
        )}
      </div>
    </div>
  );
}
