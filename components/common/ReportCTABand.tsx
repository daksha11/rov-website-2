import Link from "next/link";

// Entry point to /report, the free visibility report.
//
// /report is a real offer with its own capture form, but it sat behind almost
// no internal links, so the only people finding it were arriving from search or
// a pasted link. It belongs on the service pages whose audience has the problem
// it diagnoses: /web (their site is invisible) and /ai-automation (AI
// assistants answer for them and get it wrong).
//
// Deliberately a quiet band, not a second hero. The page's own lead form is
// still the primary conversion; this is the lower-commitment path for someone
// not ready to describe a project yet.

export default function ReportCTABand({
  eyebrow,
  heading,
  body,
  cta = "Get the free report",
}: {
  eyebrow: string;
  heading: string;
  body: string;
  cta?: string;
}) {
  return (
    <section className="relative bg-black px-6 pb-20 md:px-12 md:pb-28 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-2xl border border-[#EA9A61]/25 bg-[#EA9A61]/[0.05] p-7 md:flex md:items-center md:justify-between md:gap-10 md:p-9">
          <div className="max-w-2xl">
            <span
              className="mb-3 block text-xs uppercase tracking-[0.28em] text-[#EA9A61]"
              style={{ fontFamily: "'Roboto', sans-serif" }}
            >
              {eyebrow}
            </span>
            <h2
              className="mb-2 text-2xl text-white md:text-3xl"
              style={{ fontFamily: "Norwige, sans-serif" }}
            >
              {heading}
            </h2>
            <p
              className="text-sm leading-relaxed text-white/55 md:text-[0.9375rem]"
              style={{ fontFamily: "'Roboto', sans-serif" }}
            >
              {body}
            </p>
          </div>
          <Link
            href="/report"
            className="mt-6 inline-block shrink-0 rounded-full px-7 py-3.5 text-center text-[0.8rem] font-bold uppercase tracking-[0.1em] text-white transition-transform hover:scale-[1.02] md:mt-0"
            style={{
              background:
                "linear-gradient(132deg, #EA9A61 4.77%, #B16937 27.26%, #A64D2B 50.09%, #42201C 76.74%)",
              fontFamily: "'Roboto', sans-serif",
            }}
          >
            {cta}
          </Link>
        </div>
      </div>
    </section>
  );
}
