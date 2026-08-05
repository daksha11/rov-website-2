// Shared page shell for every service brief. The quiz itself is the client
// component; this stays a server component so the copy above it is in the
// static HTML for search and AI crawlers.

import Link from "next/link";
import { NavigationDock } from "@/components/sections/NavDoc";
import Footer from "@/components/sections/Footer";
import { BreadcrumbSchema } from "@/components/schema/BreadcrumbSchema";
import IntakeQuiz from "./IntakeQuiz";
import type { IntakeService } from "@/lib/intake";

const HEADING = "Norwige, sans-serif";
const BODY = "'Roboto', sans-serif";

// Titles only. Each has to land on its own, so they read as three promises
// rather than three headings waiting for a paragraph.
const PROMISES = [
  "You get the answer before we ask for anything",
  "A person replies within a day",
  "You get a scope and a number, not a pitch",
];

export default function IntakePage({ service }: { service: IntakeService }) {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "" },
          { name: service.parentLabel, url: service.parentHref },
          { name: service.eyebrow, url: `${service.parentHref}/brief` },
        ]}
      />
      <main className="relative min-h-screen overflow-x-hidden bg-black text-white">
        <section style={{ padding: "clamp(90px, 13vw, 150px) clamp(16px, 5vw, 60px) clamp(28px, 5vw, 48px)" }}>
          <div className="mx-auto max-w-3xl">
            <Link
              href={service.parentHref}
              className="mb-8 inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] text-white/40 transition-colors hover:text-[#EA9A61]"
              style={{ fontFamily: BODY }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              {service.parentLabel}
            </Link>

            <span className="mb-4 block text-xs uppercase tracking-[0.3em] text-[#EA9A61]" style={{ fontFamily: BODY }}>
              {service.eyebrow}
            </span>
            <h1
              className="mb-5 font-bold italic leading-[1.05] text-white"
              style={{ fontFamily: HEADING, fontSize: "clamp(2.25rem, 6vw, 4rem)" }}
            >
              {service.title}
            </h1>
            <p
              className="max-w-xl leading-relaxed text-white/55"
              style={{ fontFamily: BODY, fontSize: "clamp(1rem, 1.6vw, 1.125rem)" }}
            >
              {service.intro}
            </p>
          </div>
        </section>

        <section style={{ padding: "0 clamp(16px, 5vw, 60px) clamp(50px, 8vw, 90px)" }}>
          <div className="mx-auto max-w-3xl">
            <IntakeQuiz service={service} />
          </div>
        </section>

        <section
          className="border-t border-white/[0.07]"
          style={{ padding: "clamp(50px, 8vw, 90px) clamp(16px, 5vw, 60px)" }}
        >
          <div className="mx-auto max-w-3xl">
            <span className="mb-8 block text-xs uppercase tracking-[0.3em] text-white/35" style={{ fontFamily: BODY }}>
              What happens next
            </span>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-10">
              {PROMISES.map((p, i) => (
                <div key={p} className="border-t border-white/[0.09] pt-5">
                  <span className="mb-3 block text-xs tabular-nums tracking-[0.2em] text-[#EA9A61]" style={{ fontFamily: BODY }}>
                    0{i + 1}
                  </span>
                  <h2
                    className="font-bold italic leading-snug text-white"
                    style={{ fontFamily: HEADING, fontSize: "clamp(1.25rem, 1.9vw, 1.6rem)" }}
                  >
                    {p}
                  </h2>
                </div>
              ))}
            </div>

            <p className="mt-10 text-sm leading-relaxed text-white/35" style={{ fontFamily: BODY }}>
              Would you rather talk it through?{" "}
              <a
                href="https://cal.com/rov-studios-imhphw/15min"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#EA9A61] hover:underline"
              >
                Book a free 15 minute call
              </a>{" "}
              and we&apos;ll fill this out together. Prices are published at{" "}
              <Link href="/pricing" className="text-[#EA9A61] hover:underline">
                /pricing
              </Link>{" "}
              either way.
            </p>
          </div>
        </section>

        <NavigationDock />
        <Footer />
      </main>
    </>
  );
}
