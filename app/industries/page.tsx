import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { getAllIndustries, getIndexedIndustries } from "@/lib/industries";
import { BreadcrumbSchema } from "@/components/schema/BreadcrumbSchema";
import {
  HEADING,
  BODY,
  BLACK,
  PILL_TEXT,
  EMBER_SPLASH,
  CTA_GRADIENT,
  CTA_GLOW,
} from "@/components/industries/shared";

const NavigationDock = dynamic(
  () =>
    import("@/components/sections/NavDoc").then((mod) => ({
      default: mod.NavigationDock,
    })),
  { ssr: false }
);
const Footer = dynamic(() => import("@/components/sections/Footer"), {
  ssr: false,
});

const BASE = "https://www.rovstudios.com";
const TITLE = "Industries We Build For | Range of View Studios";
const DESCRIPTION =
  "Range of View Studios builds brands, websites, and content for specific kinds of Atlanta businesses: Beltline storefronts, restaurants, real estate, home services, and tech.";

/**
 * The index inherits the drafts' visibility. While every child page is still
 * `indexed: false`, listing them publicly would undo that, so the index is
 * noindex too. It flips automatically once any child is promoted.
 */
const anyIndexed = () => getIndexedIndustries().length > 0;

export function generateMetadata(): Metadata {
  const indexed = anyIndexed();
  return {
    title: TITLE,
    description: DESCRIPTION,
    alternates: { canonical: `${BASE}/industries` },
    robots: indexed ? undefined : { index: false, follow: false },
    openGraph: {
      title: TITLE,
      description: DESCRIPTION,
      url: `${BASE}/industries`,
      type: "website",
      images: [{ url: "/og/og-default.webp", width: 1200, height: 630, alt: TITLE }],
    },
  };
}

export default function IndustriesIndexPage() {
  const pages = getAllIndustries();

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "" },
          { name: "Industries", url: "/industries" },
        ]}
      />
      {/* CollectionPage + ItemList so an assistant asked "who does branding for
          Atlanta restaurants" can resolve the hub to the right child page. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "@id": `${BASE}/industries#collection`,
            url: `${BASE}/industries`,
            name: TITLE,
            description: DESCRIPTION,
            isPartOf: { "@type": "WebSite", url: BASE },
            about: {
              "@type": "Organization",
              name: "Range of View Studios",
              url: BASE,
              areaServed: { "@type": "City", name: "Atlanta" },
            },
            mainEntity: {
              "@type": "ItemList",
              itemListOrder: "https://schema.org/ItemListUnordered",
              numberOfItems: pages.length,
              itemListElement: pages.map((page, i) => ({
                "@type": "ListItem",
                position: i + 1,
                name: page.industry,
                description: page.description,
                url: `${BASE}/industries/${page.slug}`,
              })),
            },
          }),
        }}
      />

      <main style={{ background: BLACK }}>
        {/* Hero */}
        <section
          style={{
            position: "relative",
            overflow: "hidden",
            padding: "clamp(120px, 16vw, 190px) clamp(20px, 6%, 6%) clamp(48px, 7vw, 80px)",
          }}
        >
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              background: EMBER_SPLASH,
              opacity: 0.55,
              pointerEvents: "none",
            }}
          />
          <div style={{ position: "relative", maxWidth: 1100, margin: "0 auto" }}>
            <span
              style={{
                display: "block",
                fontFamily: BODY,
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: PILL_TEXT,
                marginBottom: 18,
              }}
            >
              Industries
            </span>
            <h1
              style={{
                fontFamily: HEADING,
                fontStyle: "italic",
                fontWeight: 700,
                fontSize: "clamp(2.2rem, 6vw, 4rem)",
                lineHeight: 1.08,
                color: "#FFFFFF",
                margin: "0 0 20px",
                maxWidth: 900,
              }}
            >
              We build for specific kinds of Atlanta businesses.
            </h1>
            <p
              style={{
                fontFamily: BODY,
                fontWeight: 300,
                fontSize: "clamp(1rem, 2vw, 1.15rem)",
                lineHeight: 1.65,
                color: "rgba(255,255,255,0.65)",
                margin: 0,
                maxWidth: 620,
              }}
            >
              A restaurant, a Beltline storefront, and a development launch do not
              have the same problem. Find yours and see how we would approach it.
            </p>
          </div>
        </section>

        {/* Alternating split rows */}
        <section style={{ padding: "0 clamp(20px, 6%, 6%) clamp(60px, 9vw, 110px)" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            {pages.map((page, i) => (
              <Link
                key={page.slug}
                href={`/industries/${page.slug}`}
                className={`ind-row${i % 2 === 1 ? " ind-row-flip" : ""}`}
              >
                <div className="ind-media">
                  {page.cardImage ? (
                    <Image
                      src={page.cardImage}
                      alt={page.cardAlt || page.industry}
                      fill
                      sizes="(max-width: 900px) 100vw, 520px"
                      style={{ objectFit: "cover" }}
                    />
                  ) : (
                    <div
                      aria-hidden
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: "var(--gradient-ember)",
                      }}
                    />
                  )}
                  <span className="ind-index" aria-hidden>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                <div className="ind-copy">
                  <span className="ind-eyebrow">{page.geo || "Atlanta"}</span>
                  <h2 className="ind-title">{page.industry}</h2>
                  <p className="ind-pitch">{page.pitchLine}</p>
                  <span className="ind-cta">
                    See the approach <span aria-hidden>&rarr;</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Close */}
        <section
          style={{
            position: "relative",
            overflow: "hidden",
            padding: "clamp(56px, 8vw, 100px) clamp(20px, 6%, 6%)",
            borderTop: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              background: EMBER_SPLASH,
              opacity: 0.5,
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "relative",
              maxWidth: 1100,
              margin: "0 auto",
              textAlign: "center",
            }}
          >
            <h2
              style={{
                fontFamily: HEADING,
                fontStyle: "italic",
                fontWeight: 700,
                fontSize: "clamp(1.7rem, 4vw, 2.6rem)",
                lineHeight: 1.15,
                color: "#FFFFFF",
                margin: "0 0 16px",
              }}
            >
              Not on the list?
            </h2>
            <p
              style={{
                fontFamily: BODY,
                fontWeight: 300,
                fontSize: "clamp(1rem, 2vw, 1.1rem)",
                lineHeight: 1.65,
                color: "rgba(255,255,255,0.65)",
                margin: "0 auto 30px",
                maxWidth: 520,
              }}
            >
              These are the ones we have written up so far. Tell us what you do and
              we will tell you how we would approach it.
            </p>
            <Link
              href="/contact"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                minHeight: 48,
                padding: "14px 30px",
                borderRadius: 9999,
                background: CTA_GRADIENT,
                boxShadow: CTA_GLOW,
                color: "#FFFFFF",
                fontFamily: BODY,
                fontWeight: 700,
                fontSize: "0.8rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                textDecoration: "none",
              }}
            >
              Start a conversation <span aria-hidden>&rarr;</span>
            </Link>
          </div>
        </section>
      </main>

      <NavigationDock />
      <Footer />

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .ind-row {
          display: grid;
          grid-template-columns: 1fr;
          gap: clamp(20px, 3vw, 40px);
          align-items: center;
          padding: clamp(28px, 4vw, 44px) 0;
          border-top: 1px solid rgba(255,255,255,0.08);
          text-decoration: none;
        }
        .ind-row:last-child { border-bottom: 1px solid rgba(255,255,255,0.08); }
        .ind-media {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 10;
          border-radius: 18px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.10);
          background: #111;
          transition: border-color .3s ease, transform .4s cubic-bezier(.2,.8,.2,1);
        }
        .ind-media img { transition: transform .5s cubic-bezier(.2,.8,.2,1); }
        .ind-index {
          position: absolute;
          left: 16px;
          top: 14px;
          font-family: ${HEADING};
          font-style: italic;
          font-weight: 700;
          font-size: 1.1rem;
          color: rgba(255,255,255,0.85);
          text-shadow: 0 2px 12px rgba(0,0,0,0.6);
        }
        .ind-eyebrow {
          display: block;
          font-family: ${BODY};
          font-size: 11.5px;
          font-weight: 600;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: ${PILL_TEXT};
          margin-bottom: 14px;
        }
        .ind-title {
          /* The industry name is stored in sentence case because it also reads
             inside a sentence ("Creative services for restaurants..."). As a
             card title it wants title case, so that happens here. */
          text-transform: capitalize;
          font-family: ${HEADING};
          font-style: italic;
          font-weight: 700;
          font-size: clamp(1.5rem, 3.4vw, 2.3rem);
          line-height: 1.12;
          color: #FFFFFF;
          margin: 0 0 12px;
        }
        .ind-pitch {
          font-family: ${BODY};
          font-weight: 300;
          font-size: clamp(0.98rem, 1.8vw, 1.08rem);
          line-height: 1.6;
          color: rgba(255,255,255,0.62);
          margin: 0 0 20px;
          max-width: 46ch;
        }
        /* Pitch lines are kept verbatim in content as the seed line that
           started each page, so they arrive lowercase. Sentence-case them on
           render instead of editing the source of record. */
        .ind-pitch::first-letter { text-transform: uppercase; }
        .ind-cta {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: ${BODY};
          font-weight: 600;
          font-size: 12px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.75);
          transition: color .25s ease, gap .25s ease;
        }
        @media (hover: hover) {
          .ind-row:hover .ind-media { border-color: rgba(234,154,97,0.5); }
          .ind-row:hover .ind-media img { transform: scale(1.045); }
          .ind-row:hover .ind-cta { color: ${PILL_TEXT}; gap: 14px; }
        }
        .ind-row:focus-visible {
          outline: 2px solid ${PILL_TEXT};
          outline-offset: 6px;
          border-radius: 20px;
        }
        @media (min-width: 900px) {
          .ind-row {
            grid-template-columns: 1fr 1fr;
            gap: clamp(40px, 6vw, 80px);
            padding: clamp(40px, 5vw, 64px) 0;
          }
          /* Alternating: even rows are image-left, odd rows image-right. */
          .ind-row-flip .ind-media { order: 2; }
          .ind-row-flip .ind-copy { order: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ind-media, .ind-media img, .ind-cta { transition: none !important; }
          .ind-row:hover .ind-media img { transform: none; }
        }
      `,
        }}
      />
    </>
  );
}
