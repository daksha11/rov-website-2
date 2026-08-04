"use client";

// Visibility gap report request form for /report.
//
// Deliberately thinner than /web/brief. The brief asks budget and timeline
// because it is for people ready to talk about a project. This is the cold
// entry point for Instagram and article traffic, so it asks for two things
// only: the URL and an email. Adding a budget question here would trade most
// of the volume for qualification we do not need yet.
//
// No new backend. Step 1 reuses /api/web/site-check (same SSRF-guarded reader
// the brief uses) to show an instant partial read, which earns the email
// instead of demanding it. Step 2 posts to /api/leads, which already emails
// Andi and pushes to Klaviyo. The instant findings ride along in the message so
// whoever builds the full report starts with context.

import { useState } from "react";

type Finding = { key: string; label: string; why: string; tone: "gap" | "ok" };
type SiteCheck = { ok: true; title: string; findings: Finding[] };

const HEADING = "Norwige, sans-serif";
const BODY = "'Roboto', sans-serif";

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function VisibilityReportForm() {
    const [url, setUrl] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [company, setCompany] = useState(""); // honeypot, must stay empty
    const [site, setSite] = useState<SiteCheck | null>(null);
    const [phase, setPhase] = useState<"url" | "checking" | "gate" | "sending" | "done">("url");
    const [error, setError] = useState("");
    const [touched, setTouched] = useState(false);

    const emailValid = emailRe.test(email.trim());

    async function runCheck() {
        if (!url.trim()) {
            setTouched(true);
            return;
        }
        setPhase("checking");
        setError("");
        try {
            const res = await fetch("/api/web/site-check", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url: url.trim() }),
            });
            const json = await res.json().catch(() => ({ ok: false }));
            if (json.ok && Array.isArray(json.findings)) setSite(json as SiteCheck);
            // A blocked or dead site is not a dead end: we still take the request
            // and check it by hand. Never trap someone here.
        } catch {
            /* fall through to the gate */
        }
        setPhase("gate");
    }

    async function submit() {
        if (!name.trim() || !emailValid) {
            setTouched(true);
            return;
        }
        setPhase("sending");
        setError("");
        const summary = site
            ? site.findings.map((f) => `${f.tone === "gap" ? "GAP" : "OK "} ${f.label}`).join("\n")
            : "Instant check did not complete; site needs a manual read.";
        try {
            const res = await fetch("/api/leads", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: name.trim(),
                    email: email.trim(),
                    company,
                    source: "report:visibility",
                    page: "/report",
                    message: `Visibility report requested for: ${url.trim()}\n\nInstant check:\n${summary}`,
                }),
            });
            if (!res.ok) throw new Error("failed");
            setPhase("done");
        } catch {
            setError("That didn't send. Email admin@pursuenetworking.com and we'll pick it up by hand.");
            setPhase("gate");
        }
    }

    if (phase === "done") {
        return (
            <div className="rounded-2xl border border-[#EA9A61]/25 bg-[#EA9A61]/[0.06] p-8 md:p-10">
                <h2 className="mb-3 text-2xl text-white" style={{ fontFamily: HEADING }}>
                    Got it. Check your inbox.
                </h2>
                <p className="text-[0.9375rem] leading-relaxed text-white/70" style={{ fontFamily: BODY }}>
                    We&apos;ll read {url.trim()} properly, by hand, and send the full report within three
                    business days. Not a score out of ten: the specific gaps, what each one costs you, and
                    what we&apos;d fix first. If we think you need less than you expect, we&apos;ll say so.
                </p>
            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 md:p-9">
            {/* ── Step 1: the URL ── */}
            <label htmlFor="report-url" className="mb-2 block text-sm text-white/70" style={{ fontFamily: BODY }}>
                Your website
            </label>
            <div className="flex flex-col gap-3 sm:flex-row">
                <input
                    id="report-url"
                    type="url"
                    inputMode="url"
                    autoComplete="url"
                    placeholder="yourbusiness.com"
                    value={url}
                    disabled={phase !== "url"}
                    onChange={(e) => setUrl(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && phase === "url" && runCheck()}
                    className="flex-1 rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-white placeholder-white/30 outline-none transition-colors focus:border-[#EA9A61]/60 disabled:opacity-60"
                    style={{ fontFamily: BODY }}
                />
                {phase === "url" && (
                    <button
                        type="button"
                        onClick={runCheck}
                        className="rounded-xl px-6 py-3 text-[0.8rem] font-bold uppercase tracking-[0.1em] text-white transition-transform hover:scale-[1.02]"
                        style={{
                            background:
                                "linear-gradient(132deg, #EA9A61 4.77%, #B16937 27.26%, #A64D2B 50.09%, #42201C 76.74%)",
                            fontFamily: BODY,
                        }}
                    >
                        Check it
                    </button>
                )}
            </div>
            {touched && !url.trim() && phase === "url" && (
                <p className="mt-2 text-sm text-[#EA9A61]" style={{ fontFamily: BODY }}>
                    Paste your website address and we&apos;ll take a look.
                </p>
            )}

            {phase === "checking" && (
                <p className="mt-6 text-sm text-white/50" style={{ fontFamily: BODY }}>
                    Reading your site...
                </p>
            )}

            {/* ── The instant read: earns the email rather than demanding it ── */}
            {site && phase !== "checking" && (
                <div className="mt-8 border-t border-white/10 pt-7">
                    <p
                        className="mb-5 text-xs uppercase tracking-[0.24em] text-[#EA9A61]/70"
                        style={{ fontFamily: HEADING }}
                    >
                        What we can see already
                    </p>
                    <ul className="space-y-4">
                        {site.findings.map((f) => (
                            <li key={f.key} className="flex gap-3">
                                <span
                                    aria-hidden="true"
                                    className={f.tone === "gap" ? "mt-[2px] text-[#EA9A61]" : "mt-[2px] text-white/35"}
                                >
                                    {f.tone === "gap" ? "!" : "✓"}
                                </span>
                                <span>
                                    <span
                                        className="block text-[0.9375rem] font-semibold text-white"
                                        style={{ fontFamily: BODY }}
                                    >
                                        {f.label}
                                    </span>
                                    <span
                                        className="block text-sm leading-relaxed text-white/55"
                                        style={{ fontFamily: BODY }}
                                    >
                                        {f.why}
                                    </span>
                                </span>
                            </li>
                        ))}
                    </ul>
                    <p className="mt-6 text-sm leading-relaxed text-white/45" style={{ fontFamily: BODY }}>
                        That is the shallow pass, read straight off your homepage in a few seconds. The full
                        report covers what AI assistants say when someone asks for a business like yours,
                        whether you show up in local search, and what your reviews are actually doing.
                    </p>
                </div>
            )}

            {/* ── Step 2: the gate ── */}
            {(phase === "gate" || phase === "sending") && (
                <div className="mt-8 border-t border-white/10 pt-7">
                    <p className="mb-5 text-[0.9375rem] text-white/70" style={{ fontFamily: BODY }}>
                        Where should we send the full report?
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2">
                        <input
                            aria-label="Your name"
                            placeholder="Your name"
                            autoComplete="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-white placeholder-white/30 outline-none transition-colors focus:border-[#EA9A61]/60"
                            style={{ fontFamily: BODY }}
                        />
                        <input
                            aria-label="Your email"
                            type="email"
                            placeholder="you@yourbusiness.com"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-white placeholder-white/30 outline-none transition-colors focus:border-[#EA9A61]/60"
                            style={{ fontFamily: BODY }}
                        />
                    </div>

                    {/* Honeypot: real people never see or fill this. */}
                    <input
                        type="text"
                        name="company"
                        tabIndex={-1}
                        autoComplete="off"
                        aria-hidden="true"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
                    />

                    {touched && (!name.trim() || !emailValid) && (
                        <p className="mt-3 text-sm text-[#EA9A61]" style={{ fontFamily: BODY }}>
                            We need a name and a working email to send it to.
                        </p>
                    )}
                    {error && (
                        <p className="mt-3 text-sm text-[#EA9A61]" style={{ fontFamily: BODY }}>
                            {error}
                        </p>
                    )}

                    <button
                        type="button"
                        onClick={submit}
                        disabled={phase === "sending"}
                        className="mt-5 w-full rounded-xl px-6 py-4 text-[0.8rem] font-bold uppercase tracking-[0.1em] text-white transition-transform hover:scale-[1.01] disabled:opacity-60 sm:w-auto sm:px-10"
                        style={{
                            background:
                                "linear-gradient(132deg, #EA9A61 4.77%, #B16937 27.26%, #A64D2B 50.09%, #42201C 76.74%)",
                            fontFamily: BODY,
                        }}
                    >
                        {phase === "sending" ? "Sending..." : "Send me the report"}
                    </button>

                    <p className="mt-4 text-xs leading-relaxed text-white/35" style={{ fontFamily: BODY }}>
                        One report, plus a short follow-up if we find something worth flagging. No newsletter
                        you have to escape from.
                    </p>
                </div>
            )}
        </div>
    );
}
