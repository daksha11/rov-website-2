"use client";

// ═══════════════════════════════════════════════════════
// CTRL-A — FINISH
// The fourth stop, and the reason the school exists: a first finished
// piece. A short checklist per craft (open to contributions, like every
// toolkit), then the one verifiable action: paste the link. Marking it
// needs an account, because this is the thing worth keeping.
//
// The checklists here are the first draft. Step 3 of the plan grows them
// with the community; the shape (steps, then the link) stays.
// ═══════════════════════════════════════════════════════

import Link from "next/link";
import { useState } from "react";
import { Bleed, Rule, ed } from "../../_components/editorial";
import SignInGate from "../../_components/SignInGate";
import { useCtrlAPath } from "@/lib/ctrla/progress";
import { CRAFT_LABEL, FIRST_PIECE, pathFor } from "@/lib/ctrla/path";
import type { CraftSlug } from "@/lib/ctrla/profile";
import { track } from "../../space/_state/track";
import { GOOD_FIRST, submitHref } from "@/lib/ctrla/contribute";

interface Step {
  title: string;
  note: string;
  href?: string;
}

const CHECKLIST: Record<CraftSlug, Step[]> = {
  music: [
    { title: "One song, finished, not perfect", note: "A bounce you would play in a car. Two minutes is a song." },
    { title: "A mix you can live with", note: "Reference it against three songs you love at the same volume. Fix the thing that bothers you most, then stop.", href: "/ctrla/toolkit/music" },
    { title: "A master, or someone's", note: "A limiter and a loudness target get you there. If you want a room and an engineer, ROV Music does first records for $50.", href: "https://www.rovmusic.com" },
    { title: "Cover art from your kit", note: "Square, your colours, your type. The brand kit exports a template for exactly this.", href: "/ctrla/brand-kit" },
    { title: "Upload to a distributor, pick a date", note: "DistroKid, TuneCore, or Amuse. Two weeks out gives you a pre-save link." },
    { title: "Tell ten people, by name", note: "Not a post. Ten messages. That is a release." },
  ],
  design: [
    { title: "A brand kit, exported", note: "Yours or a friend's. Colours, type, logo rules, in one sitting.", href: "/ctrla/brand-kit" },
    { title: "Three pieces that use it", note: "A poster, a social post, a cover. Same system, three surfaces. That is what a kit is for." },
    { title: "A one-page portfolio", note: "One page, your name, the three pieces, one line about each, one way to reach you." },
    { title: "Someone else's eyes", note: "Post it in the Design room. Take one note and act on it." },
    { title: "It is live, at a link", note: "A free host is fine. A link is the finish line." },
  ],
  "web-dev": [
    { title: "One page that does one thing", note: "A portfolio, a link page, a landing page for a friend's thing. One job." },
    { title: "Built with the stack, not around it", note: "Framework to deploy, in the order the toolkit lists them.", href: "/ctrla/toolkit/web-dev" },
    { title: "A look from a kit", note: "Your colours and type from a brand kit, not defaults.", href: "/ctrla/brand-kit" },
    { title: "Deployed, with a real domain or a clean subdomain", note: "Vercel, Netlify, Cloudflare Pages. Free tiers are enough." },
    { title: "It loads fast on a phone", note: "Open it on your own phone on cellular. Fix what is slow." },
  ],
  video: [
    { title: "A sixty-second film", note: "One idea, one location, one day. Length is not the point." },
    { title: "Shot with a plan", note: "A shot list before the camera comes out. Five shots you need, five you want.", href: "/ctrla/toolkit/video" },
    { title: "Cut, with sound that was thought about", note: "Music or room tone, levelled. Silence is a choice, not a default." },
    { title: "A title card from your kit", note: "Your type, your colours, at the top and the end.", href: "/ctrla/brand-kit" },
    { title: "Uploaded, unlisted is fine", note: "YouTube, Vimeo. A link is the finish line." },
  ],
};

export default function FinishContent({ craft }: { craft: CraftSlug }) {
  const path = useCtrlAPath(craft);
  const piece = FIRST_PIECE[craft];
  const finish = path.stops.find((s) => s.id === "finish");
  const show = pathFor(craft).find((s) => s.id === "show")!;
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submit = () => {
    let clean: URL;
    try {
      clean = new URL(url.trim().startsWith("http") ? url.trim() : `https://${url.trim()}`);
    } catch {
      setError("That does not look like a link. Paste the full address.");
      return;
    }
    setError(null);
    path.markDone("finish", { url: clean.toString() }, "self");
    track("path_finish", { craft });
  };

  return (
    <main style={{ background: ed.ground, color: ed.ink, minHeight: "100vh", paddingTop: 96, paddingBottom: 120 }}>
      <Bleed>
        <span style={{ fontFamily: ed.mono, fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: ed.gold }}>
          Finish · {CRAFT_LABEL[craft]} · stop four of five
        </span>
        <h1 style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(44px,8vw,120px)", letterSpacing: "-0.035em", lineHeight: 0.9, color: ed.ink, margin: "18px 0 22px", maxWidth: 900 }}>
          {piece.title}.
        </h1>
        <p style={{ fontFamily: ed.serif, fontStyle: "italic", fontSize: "clamp(19px,2.3vw,28px)", lineHeight: 1.35, color: ed.ink, margin: "0 0 48px", maxWidth: 640 }}>
          Everything before this was practice. This is the thing with your name on it. Small is fine. Finished is the point.
        </p>
        <Rule color={ed.hair} />

        <ol style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {CHECKLIST[craft].map((step, i) => (
            <li key={step.title} style={{ display: "grid", gridTemplateColumns: "56px 1fr", gap: 18, padding: "clamp(18px,2.4vw,30px) 0", borderBottom: `1px solid ${ed.hair}` }}>
              <span style={{ fontFamily: ed.mono, fontSize: 11, letterSpacing: "0.2em", color: ed.gold, paddingTop: 8 }}>{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h2 style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(22px,3vw,40px)", letterSpacing: "-0.02em", lineHeight: 1, color: ed.ink, margin: "0 0 8px" }}>{step.title}</h2>
                <p style={{ fontFamily: ed.body, fontSize: "clamp(15px,1.5vw,18px)", lineHeight: 1.6, color: ed.inkSoft, margin: 0, maxWidth: 620 }}>
                  {step.note}
                  {step.href && (
                    <>
                      {" "}
                      <Link href={step.href} style={{ color: ed.gold, textDecoration: "none", borderBottom: `1px solid ${ed.gold}` }}>
                        {step.href.startsWith("http") ? "Open" : "Go"} →
                      </Link>
                    </>
                  )}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <div style={{ margin: "clamp(28px,3.6vw,48px) 0 0" }}>
          <span style={{ fontFamily: ed.mono, fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: ed.gold }}>
            This checklist is open · good first contributions
          </span>
          <ul style={{ listStyle: "none", padding: 0, margin: "12px 0 0", display: "grid", gap: 0 }}>
            {GOOD_FIRST[craft].map((a) => (
              <li key={a.title} style={{ borderTop: `1px solid ${ed.hair}` }}>
                <Link href={submitHref(a.type, craft)} className="ctrla-contrib-ask" style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 16, alignItems: "baseline", padding: "14px 0", textDecoration: "none" }}>
                  <span style={{ fontFamily: ed.grotesque, fontWeight: 700, fontSize: "clamp(16px,1.7vw,21px)", letterSpacing: "-0.015em", lineHeight: 1.1, color: ed.ink }}>{a.title}</span>
                  <span style={{ fontFamily: ed.mono, fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: ed.gold, whiteSpace: "nowrap" }}>Suggest →</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div style={{ marginTop: "clamp(48px,7vw,96px)" }}>
          {!path.ready ? null : finish?.done ? (
            <div style={{ borderLeft: `3px solid ${ed.plum}`, padding: "8px 0 8px 22px" }}>
              <span style={{ fontFamily: ed.mono, fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: ed.gold }}>Finished</span>
              <h2 style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(30px,4.6vw,64px)", letterSpacing: "-0.03em", lineHeight: 0.94, color: ed.ink, margin: "12px 0 14px" }}>
                It exists. That is the hard part.
              </h2>
              {typeof finish.entry?.evidence?.url === "string" && (
                <p style={{ fontFamily: ed.body, fontSize: 16, color: ed.inkSoft, margin: "0 0 22px", wordBreak: "break-all" }}>
                  <a href={finish.entry.evidence.url} target="_blank" rel="noreferrer" style={{ color: ed.gold }}>
                    {finish.entry.evidence.url}
                  </a>
                </p>
              )}
              <Link href={show.href} className="ctrla-space-enter">
                {show.title} <span aria-hidden>→</span>
              </Link>
            </div>
          ) : (
            <SignInGate title="Sign in to mark it finished." reason="The link to your piece goes on your path and follows you. Reading the checklist never needs an account.">
              <span style={{ fontFamily: ed.mono, fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: ed.gold }}>The finish line</span>
              <h2 style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(30px,4.6vw,64px)", letterSpacing: "-0.03em", lineHeight: 0.94, color: ed.ink, margin: "12px 0 18px", maxWidth: 720 }}>
                Paste the link.
              </h2>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", maxWidth: 640 }}>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://"
                  aria-label="Link to your finished piece"
                  style={{ flex: "1 1 280px", padding: "13px 0", background: "none", border: 0, borderBottom: `1px solid ${ed.gold}`, color: ed.ink, fontFamily: ed.body, fontSize: 17, outline: "none" }}
                />
                <button type="button" onClick={submit} className="ctrla-space-enter" style={{ cursor: "pointer" }}>
                  Mark it finished <span aria-hidden>→</span>
                </button>
              </div>
              {error && (
                <p style={{ fontFamily: ed.body, fontSize: 14, color: ed.amber, margin: "12px 0 0" }} role="alert">
                  {error}
                </p>
              )}
            </SignInGate>
          )}
        </div>
      </Bleed>
    </main>
  );
}
