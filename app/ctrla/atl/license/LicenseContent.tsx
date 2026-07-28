"use client";

// ═══════════════════════════════════════════════════════
// CTRL-A · The Reel — B-Roll License Terms
// A drafting starting point, NOT legal advice. Fill every [BRACKETED] blank
// with real business facts and have a licensed Georgia media/IP attorney
// review before this leaves noindex. Terms are written to shift third-party
// clearance risk to the licensee and to disclaim warranties, matching the
// "as-is" posture of the on-page offer.
// ═══════════════════════════════════════════════════════

import { useEffect } from "react";
import type { ReactNode } from "react";
import { NavigationDock } from "@/components/sections/NavDoc";
import EditorialFooter from "../../_components/EditorialFooter";
import { ed, Bleed, Rule, Label, Kicker } from "../../_components/editorial";

// One clause = one titled block. Body accepts arrays of paragraphs / lists so
// the structure stays scannable rather than a wall of legalese.
const CLAUSES: { n: string; title: string; body: ReactNode }[] = [
  {
    n: "01",
    title: "The short version",
    body: (
      <>
        <p>
          This footage is free. You can use it in your own creative work, including paid client work,
          and you do not have to credit us. You cannot sell or hand out the raw clips on their own, and
          you are responsible for clearing anything your specific use needs (for example, a release from
          a person or brand that appears on screen). We provide the footage as-is, with no guarantees.
          The full terms below control.
        </p>
      </>
    ),
  },
  {
    n: "02",
    title: "Definitions",
    body: (
      <ul>
        <li>
          <strong>&ldquo;Licensor,&rdquo; &ldquo;we,&rdquo; &ldquo;us&rdquo;</strong> means [LEGAL ENTITY NAME],
          a [STATE] [ENTITY TYPE, e.g. limited liability company] doing business as Range of View Studios.
        </li>
        <li>
          <strong>&ldquo;Footage&rdquo;</strong> means the video clips made available through the CTRL-A
          &ldquo;The Reel&rdquo; Atlanta b-roll pack, in any resolution or format we provide.
        </li>
        <li>
          <strong>&ldquo;You,&rdquo; &ldquo;Licensee&rdquo;</strong> means the person or entity that downloads
          or uses the Footage.
        </li>
        <li>
          <strong>&ldquo;Production&rdquo;</strong> means a finished work you create that incorporates the
          Footage together with your own or other material (for example, a film, ad, reel, social post,
          website, or client deliverable).
        </li>
      </ul>
    ),
  },
  {
    n: "03",
    title: "License granted",
    body: (
      <>
        <p>
          Subject to these terms, we grant you a worldwide, non-exclusive, royalty-free, perpetual
          license to:
        </p>
        <ul>
          <li>reproduce, edit, alter, color, and combine the Footage into a Production;</li>
          <li>use and distribute that Production for commercial and personal purposes; and</li>
          <li>display the Production across any media now known or later developed.</li>
        </ul>
        <p>
          No attribution is required. A credit reading &ldquo;Footage by Range of View Studios&rdquo; is
          welcome but never mandatory.
        </p>
      </>
    ),
  },
  {
    n: "04",
    title: "What you cannot do",
    body: (
      <ul>
        <li>
          Sell, license, sublicense, or otherwise redistribute the Footage on a standalone basis, or in a
          form substantially similar to how we provided it (for example, reselling it as stock footage or
          posting the raw clips for others to download).
        </li>
        <li>
          Use the Footage in a way that is unlawful, defamatory, obscene, pornographic, hateful, or that
          promotes such content.
        </li>
        <li>
          Use the Footage in a way that implies endorsement, sponsorship, or affiliation by us, by the
          City of Atlanta, or by any person, brand, or property that appears in the Footage, without their
          separate permission.
        </li>
        <li>
          Use the Footage as a trademark, logo, or service mark, or register it as your own.
        </li>
        <li>
          Represent the Footage, or an unmodified frame of it, as your own original cinematography for
          resale or in a stock library.
        </li>
      </ul>
    ),
  },
  {
    n: "05",
    title: "Third-party rights are your responsibility",
    body: (
      <>
        <p>
          The Footage is provided <strong>without any model, property, trademark, or other release.</strong>{" "}
          It may include people, private property, buildings, artwork, signage, or brands. Whether your
          particular use requires a release or permission depends on how you use it, and that is your
          responsibility to determine and obtain.
        </p>
        <p>
          You agree that you will secure any consents, releases, or licenses required for your Production
          before you publish or distribute it. We make no representation that any such release exists.
        </p>
      </>
    ),
  },
  {
    n: "06",
    title: "No warranty",
    body: (
      <p>
        THE FOOTAGE IS PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE,&rdquo; WITHOUT WARRANTY OF
        ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO ANY WARRANTY OF NON-INFRINGEMENT,
        TITLE, MERCHANTABILITY, OR FITNESS FOR A PARTICULAR PURPOSE. WE DO NOT WARRANT THAT THE FOOTAGE
        IS CLEARED FOR ANY SPECIFIC USE OR THAT IT IS FREE OF THIRD-PARTY CLAIMS.
      </p>
    ),
  },
  {
    n: "07",
    title: "Limitation of liability",
    body: (
      <p>
        TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE WILL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL,
        SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUE, ARISING OUT OF OR
        RELATING TO THE FOOTAGE OR THESE TERMS. OUR TOTAL LIABILITY FOR ANY CLAIM RELATING TO THE FOOTAGE
        WILL NOT EXCEED THE AMOUNT YOU PAID FOR IT, WHICH IS ZERO. Some jurisdictions do not allow certain
        limitations, so parts of this section may not apply to you.
      </p>
    ),
  },
  {
    n: "08",
    title: "Your indemnity",
    body: (
      <p>
        You agree to defend, indemnify, and hold us harmless from any claim, demand, loss, or expense
        (including reasonable legal fees) arising out of your use of the Footage or your Production,
        including any claim that your use infringed a third party&rsquo;s rights or required a release you
        did not obtain.
      </p>
    ),
  },
  {
    n: "09",
    title: "Term, changes, and termination",
    body: (
      <>
        <p>
          The license for Footage you have already downloaded is perpetual, subject to your compliance
          with these terms. We may stop offering the pack, change these terms for future downloads, or
          revoke your license if you materially breach it. On revocation for breach, you must stop using
          the Footage and remove it from Productions not yet published.
        </p>
        <p>
          The version of these terms in effect when you download the Footage governs that download.
        </p>
      </>
    ),
  },
  {
    n: "10",
    title: "Governing law",
    body: (
      <p>
        These terms are governed by the laws of the State of Georgia, without regard to its conflict-of-law
        rules. Any dispute will be brought exclusively in the state or federal courts located in
        [COUNTY, e.g. Fulton County], Georgia, and you consent to their jurisdiction.
      </p>
    ),
  },
  {
    n: "11",
    title: "Contact",
    body: (
      <p>
        Questions about this license: [CONTACT EMAIL]. Mailing address: [BUSINESS MAILING ADDRESS].
      </p>
    ),
  },
];

export default function LicenseContent() {
  useEffect(() => {
    window.scrollTo(0, 0);
    const prevBg = document.body.style.backgroundColor;
    document.body.style.backgroundColor = ed.ground;
    document.body.style.overflowX = "hidden";
    document.body.style.height = "auto";
    return () => {
      document.body.style.backgroundColor = prevBg;
      document.body.style.overflowX = "";
      document.body.style.height = "";
    };
  }, []);

  return (
    <div style={{ background: ed.ground, minHeight: "100vh", width: "100%", overflowX: "hidden", color: ed.ink }}>
      <NavigationDock />
      <div aria-hidden style={{ height: 3, background: ed.gold }} />

      {/* Back-nav masthead */}
      <div style={{ background: "transparent", position: "relative", zIndex: 5 }}>
        <Bleed style={{ padding: "12px clamp(18px,5vw,64px)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
            <a href="/ctrla/atl" className="ctrla-back" style={{ display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
              <span style={{ color: ed.gold }}>←</span>
              <Label color={ed.ink}>CTRL-A · ATL</Label>
            </a>
            <Label color={ed.gold}>The Reel · License</Label>
          </div>
        </Bleed>
        <Rule color={ed.hair} />
      </div>

      {/* Header */}
      <section style={{ background: "transparent", padding: "clamp(40px,7vw,88px) 0 clamp(8px,2vw,24px)" }}>
        <Bleed>
          <Kicker color={ed.gold} style={{ marginBottom: 16 }}>The Reel · Atlanta b-roll</Kicker>
          <h1 style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(36px,6.4vw,88px)", letterSpacing: "-0.03em", lineHeight: 0.9, color: ed.ink, margin: 0, maxWidth: 900 }}>
            License terms<span style={{ color: ed.gold }}>.</span>
          </h1>
          <p style={{ fontFamily: ed.serif, fontStyle: "italic", fontWeight: 400, fontSize: "clamp(17px,2.2vw,28px)", lineHeight: 1.3, color: ed.gold, margin: "clamp(14px,1.8vw,20px) 0 0", maxWidth: 680 }}>
            Free to use in your work, with a few plain-English limits. Read clause 01 for the gist and the rest for the detail.
          </p>
          <p style={{ fontFamily: ed.mono, fontSize: "clamp(10px,1.1vw,12px)", letterSpacing: "0.1em", color: ed.inkFaint, margin: "clamp(18px,2.4vw,28px) 0 0", textTransform: "none" }}>
            Effective [EFFECTIVE DATE] · Version 0.1
          </p>
        </Bleed>
      </section>

      {/* Clauses */}
      <section style={{ background: "transparent", padding: "clamp(20px,3vw,40px) 0 clamp(48px,7vw,96px)" }}>
        <Bleed>
          <Rule color={ed.hair} />
          {CLAUSES.map((c) => (
            <div key={c.n} style={{ display: "grid", gridTemplateColumns: "minmax(0, 0.9fr) minmax(0, 2.4fr)", gap: "clamp(16px,3vw,48px)", padding: "clamp(24px,3.4vw,40px) 0", borderBottom: `1px solid ${ed.hair}` }} className="ctrla-license-row">
              <div>
                <span style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(13px,1.4vw,17px)", letterSpacing: "-0.01em", color: ed.gold }}>{c.n}</span>
                <h2 style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(20px,2.4vw,32px)", letterSpacing: "-0.02em", lineHeight: 1.02, color: ed.ink, margin: "8px 0 0" }}>{c.title}</h2>
              </div>
              <div className="ctrla-license-body" style={{ fontFamily: ed.body, fontSize: "clamp(14px,1.5vw,17px)", lineHeight: 1.6, color: ed.inkSoft }}>
                {c.body}
              </div>
            </div>
          ))}
        </Bleed>
      </section>

      <EditorialFooter />
    </div>
  );
}
