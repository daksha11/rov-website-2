import Link from "next/link";

// The music home page is built in four acts (proof, the song, the career, the
// close) and that structure only ever existed as comments in the JSX. On screen
// it read as fourteen dark sections of equal weight, so the journey was
// invisible: nice components, no narrative punctuation.
//
// ActBreak is the punctuation. It is deliberately quiet, a label, one line that
// carries the argument forward, and a hairline. It is not a section and must
// never compete with the sections around it.

const HEADING_FONT = "Norwige, sans-serif";
const BODY_FONT = "'Roboto', sans-serif";
const ACCENT = "#EA9A61";

export default function ActBreak({
    act,
    line,
    sub,
    link,
}: {
    /** e.g. "Act two". Small, accent, sets position in the journey. */
    act: string;
    /** The one line that moves the reader from the act above to the one below. */
    line: string;
    /** Optional second line, for the bridge that needs a beat more. */
    sub?: string;
    /** Optional route out to the proof pages, which otherwise live only in the menu. */
    link?: { label: string; href: string };
}) {
    return (
        <section className="bg-black px-6 py-20 sm:py-28">
            <div className="mx-auto max-w-4xl">
                <div className="h-px w-full" style={{ background: "rgba(255,255,255,0.12)" }} />

                <p
                    className="mt-10 text-[11px] uppercase tracking-[0.3em]"
                    style={{ fontFamily: BODY_FONT, color: ACCENT }}
                >
                    {act}
                </p>

                <p
                    className="mt-5 max-w-3xl text-white"
                    style={{
                        fontFamily: HEADING_FONT,
                        fontSize: "clamp(1.75rem, 4vw, 3rem)",
                        lineHeight: 1.15,
                    }}
                >
                    {line}
                </p>

                {sub && (
                    <p
                        className="mt-5 max-w-2xl text-base leading-relaxed text-white/55 sm:text-lg"
                        style={{ fontFamily: BODY_FONT }}
                    >
                        {sub}
                    </p>
                )}

                {link && (
                    <Link
                        href={link.href}
                        className="mt-7 inline-block text-sm underline decoration-white/25 underline-offset-4 transition-colors hover:text-white"
                        style={{ fontFamily: BODY_FONT, color: "rgba(255,255,255,0.6)" }}
                    >
                        {link.label} →
                    </Link>
                )}
            </div>
        </section>
    );
}
