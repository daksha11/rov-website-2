"use client";

// The intake quiz, shared by every service.
//
// Four beats:
//   1. Their link (or business name). If the service crawls, this runs
//      /api/web/site-check and reports real findings off their homepage. It
//      also PRE-ANSWERS moments: no booking link found means Captured is
//      already flagged before they answer anything, so the quiz opens as a
//      diagnosis in progress rather than a blank form.
//   2. Five questions, one screen, yes/no. Every "no" is a leak.
//   3. The reveal. Leaks lit, count stated, tier and real price shown. This is
//      the beat the whole thing exists for, and it happens BEFORE the gate:
//      they get the answer whether or not they hand over an email.
//   4. The gate. Name and email for the written breakdown.
//
// Prices come from lib/pricing.ts and questions from lib/intake.ts, so nothing
// here can drift from /pricing or from the service pages.

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  MOMENTS,
  tierForMoments,
  fmt,
  OVER_CEILING_NOTE,
  type MomentKey,
} from "@/lib/pricing";
import { leakHeadline, type IntakeService } from "@/lib/intake";
import {
  attributionPayload,
  captureAttribution,
  trackBookingClick,
  trackFormError,
  trackFormStart,
  trackFormStep,
  trackFormSubmit,
  trackLead,
} from "@/lib/lead-analytics";

type Finding = { key: string; label: string; why: string; tone: "gap" | "ok" };
type SiteCheck = { title: string; favicon: string; findings: Finding[] };

const HEADING = "Norwige, sans-serif";
const BODY = "'Roboto', sans-serif";
const ORANGE = "#EA9A61";
const GRADIENT =
  "linear-gradient(112deg, #42201C 6.46%, #A64D2B 34.96%, #B16937 63.88%, #EA9A61 97.63%)";
const GRADIENT_SHADOW =
  "3px 4px 4px 0 rgba(255, 244, 227, 0.15) inset, 0 4.385px 4.385px 0 rgba(0, 0, 0, 0.25)";
const CAL_URL = "https://cal.com/rov-studios-imhphw/15min";

/**
 * The raw choice is kept, not just a boolean, so "no" and "not sure" can both
 * count as leaking while still lighting the button the visitor actually
 * pressed. Collapsing them to a boolean loses that and makes the UI lie.
 */
type Choice = "yes" | "no" | "unsure";
type Answers = Partial<Record<MomentKey, Choice>>;

/** Anything that is not a confident yes is treated as a leak. */
const leaks = (c: Choice | undefined) => c !== undefined && c !== "yes";

type Phase = "open" | "questions" | "reveal" | "gate" | "done";

export default function IntakeQuiz({ service }: { service: IntakeService }) {
  const reduce = useReducedMotion();

  const [phase, setPhase] = useState<Phase>("open");
  const [opening, setOpening] = useState("");
  const [answers, setAnswers] = useState<Answers>({});
  const [site, setSite] = useState<SiteCheck | null>(null);
  const [crawling, setCrawling] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [company, setCompany] = useState(""); // honeypot
  const [touched, setTouched] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [error, setError] = useState("");

  const headingRef = useRef<HTMLHeadingElement>(null);
  const didMount = useRef(false);

  useEffect(() => {
    captureAttribution();
  }, []);

  // Move focus to the new heading on each beat so keyboard and screen reader
  // users are not stranded at the top of the document.
  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      return;
    }
    headingRef.current?.focus();
  }, [phase]);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const leaking = useMemo(
    () => service.questions.filter((q) => leaks(answers[q.key])),
    [answers, service.questions]
  );
  const answeredAll = service.questions.every((q) => answers[q.key] !== undefined);
  const tier = tierForMoments(leaking.length);

  function scrollToTop() {
    const el = document.getElementById("intake-card");
    if (!el) return;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 90, behavior: "smooth" });
  }

  function go(next: Phase, step: number, label: string) {
    trackFormStep(service.source, step, label);
    setPhase(next);
    scrollToTop();
  }

  // ── Beat 1 ──────────────────────────────────────────────────
  async function startQuiz() {
    if (!opening.trim()) {
      setTouched(true);
      return;
    }
    trackFormStart(service.source);

    if (!service.crawl) {
      go("questions", 1, "opened");
      return;
    }

    setCrawling(true);
    try {
      const res = await fetch("/api/web/site-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: opening.trim() }),
      });
      const json = await res.json().catch(() => ({ ok: false }));
      if (json.ok && Array.isArray(json.findings)) {
        setSite(json as SiteCheck);
        // Pre-answer what the crawl can already see. A gap finding means that
        // moment is not working, so the visitor confirms rather than starts cold.
        const gaps: Answers = {};
        for (const f of json.findings as Finding[]) {
          if (f.tone !== "gap") continue;
          if (/booking|contact|form|phone|call/i.test(f.key + f.label)) gaps.captured = "no";
          if (/title|meta|description|schema|index|search/i.test(f.key + f.label)) gaps.found = "no";
        }
        setAnswers(gaps);
      }
    } catch {
      /* a dead or blocked site is not a dead end; carry on with nothing */
    }
    setCrawling(false);
    go("questions", 1, "opened");
  }

  const preAnsweredCount = Object.keys(answers).length;

  // ── Beat 2 ──────────────────────────────────────────────────
  function answer(key: MomentKey, choice: Choice) {
    setAnswers((p) => ({ ...p, [key]: choice }));
  }

  // ── Beat 4 ──────────────────────────────────────────────────
  async function submit() {
    if (!name.trim() || !emailValid) {
      setTouched(true);
      return;
    }
    if (status === "sending") return;
    trackFormSubmit(service.source);
    setStatus("sending");
    setError("");

    const leakLines = leaking.map((q) => `· ${MOMENTS.find((m) => m.key === q.key)?.label}: ${q.leak}`);
    const message = [
      `Service: ${service.parentLabel}`,
      service.crawl ? `Site: ${opening.trim()}` : `Business: ${opening.trim()}`,
      site?.title ? `Site title: ${site.title}` : "",
      "",
      `Moments leaking: ${leaking.length} of ${service.questions.length}`,
      ...leakLines,
      "",
      `Tier indicated: ${tier.name} (${fmt(tier.priceFrom)} to ${fmt(tier.priceTo)})`,
      site && site.findings.length
        ? `\nWhat the crawl saw:\n${site.findings.map((f) => `· ${f.label}`).join("\n")}`
        : "",
      notes.trim() ? `\nWhat they said:\n${notes.trim()}` : "",
    ]
      .filter(Boolean)
      .join("\n")
      .trim();

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          company,
          message,
          source: `${service.source}:${leaking.length}-leaking`,
          page: typeof window !== "undefined" ? window.location.pathname : "",
          ...attributionPayload(),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        trackLead(service.source, { leaking: leaking.length, tier: tier.id });
        setPhase("done");
        scrollToTop();
        return;
      }
      trackFormError(service.source, data.code || `http_${res.status}`);
      setStatus("error");
      setError(data.error || "That didn't send. Please try again, or email us directly.");
    } catch {
      trackFormError(service.source, "network");
      setStatus("error");
      setError("Network error. Please try again, or email us directly.");
    }
  }

  const slide = reduce
    ? {}
    : { initial: { opacity: 0, x: 18 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -18 } };

  return (
    <div
      id="intake-card"
      className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 md:p-9"
    >
      <AnimatePresence mode="wait">
        {/* ══ 1 · OPEN ══ */}
        {phase === "open" && (
          <motion.div key="open" {...slide} transition={{ duration: reduce ? 0 : 0.22 }}>
            <h2 ref={headingRef} tabIndex={-1} className="text-2xl font-bold italic text-white outline-none md:text-3xl" style={{ fontFamily: HEADING }}>
              {service.crawl ? "Where are we starting?" : service.openingLabel}
            </h2>
            <p className="mb-7 mt-1.5 text-sm text-white/45" style={{ fontFamily: BODY }}>
              {service.crawl ? service.urlHint : service.openingHint}
            </p>

            <input
              type={service.crawl ? "url" : "text"}
              inputMode={service.crawl ? "url" : "text"}
              value={opening}
              onChange={(e) => setOpening(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && startQuiz()}
              placeholder={service.crawl ? "yourbusiness.com" : service.openingPlaceholder}
              aria-label={service.crawl ? service.urlLabel : service.openingLabel}
              aria-invalid={touched && !opening.trim() ? true : undefined}
              maxLength={160}
              autoFocus
              className={`w-full rounded-lg border bg-white/[0.04] px-3.5 py-3 text-base text-white placeholder-white/25 outline-none transition-colors focus:border-[#EA9A61]/60 ${
                touched && !opening.trim() ? "border-[#ff8b6b]/60" : "border-white/10"
              }`}
              style={{ fontFamily: BODY }}
            />
            {touched && !opening.trim() && (
              <p className="mt-1.5 text-xs text-[#ff8b6b]" style={{ fontFamily: BODY }}>
                We need something to go on.
              </p>
            )}

            <div className="mt-8 flex items-center justify-between gap-3 border-t border-white/[0.07] pt-6">
              <span className="text-xs text-white/30" style={{ fontFamily: BODY }}>
                Five questions. About a minute.
              </span>
              <button
                type="button"
                onClick={startQuiz}
                disabled={crawling}
                className="cta-shine rounded-full text-center font-semibold text-white transition-transform duration-300 hover:scale-[1.03] disabled:opacity-70"
                style={{ fontFamily: HEADING, padding: "13px 34px", fontSize: "13px", letterSpacing: "0.05em", background: GRADIENT, boxShadow: GRADIENT_SHADOW }}
              >
                {crawling ? "Reading your site…" : service.crawl ? "Check my site →" : "Start →"}
              </button>
            </div>
          </motion.div>
        )}

        {/* ══ 2 · QUESTIONS ══ */}
        {phase === "questions" && (
          <motion.div key="questions" {...slide} transition={{ duration: reduce ? 0 : 0.22 }}>
            <h2 ref={headingRef} tabIndex={-1} className="text-2xl font-bold italic text-white outline-none md:text-3xl" style={{ fontFamily: HEADING }}>
              Five moments. Which ones work?
            </h2>
            <p className="mb-7 mt-1.5 text-sm text-white/45" style={{ fontFamily: BODY }}>
              {preAnsweredCount > 0
                ? `We could already see ${preAnsweredCount === 1 ? "one of these" : `${preAnsweredCount} of these`} from your site. Confirm the rest.`
                : "Be honest. Nobody has all five."}
            </p>

            <ol className="space-y-3">
              {service.questions.map((q, i) => {
                const v = answers[q.key];
                return (
                  <li key={q.key} className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
                    <div className="mb-3 flex items-start gap-3">
                      <span className="mt-0.5 shrink-0 text-[0.7rem] tracking-[0.2em] text-white/25" style={{ fontFamily: BODY }}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[0.95rem] font-semibold text-white" style={{ fontFamily: HEADING }}>
                          {q.question}
                        </span>
                        <span className="mt-0.5 block text-xs text-white/40" style={{ fontFamily: BODY }}>
                          {q.hint}
                        </span>
                      </span>
                    </div>
                    <div className="flex gap-2 pl-8" role="radiogroup" aria-label={q.question}>
                      {([
                        { label: "Yes", value: "yes" },
                        { label: "No", value: "no" },
                        { label: "Not sure", value: "unsure" },
                      ] as const).map((opt) => {
                        const on = v === opt.value;
                        return (
                          <button
                            key={opt.label}
                            type="button"
                            role="radio"
                            aria-checked={on}
                            onClick={() => answer(q.key, opt.value)}
                            className={`rounded-full border px-4 py-2 text-sm transition-all duration-200 ${
                              on
                                ? "border-[#EA9A61]/60 bg-[#EA9A61]/[0.12] text-white"
                                : "border-white/[0.1] bg-white/[0.02] text-white/55 hover:border-white/25 hover:text-white/85"
                            }`}
                            style={{ fontFamily: BODY }}
                          >
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>
                  </li>
                );
              })}
            </ol>

            <div className="mt-8 flex items-center justify-between gap-3 border-t border-white/[0.07] pt-6">
              <button type="button" onClick={() => setPhase("open")} className="text-sm text-white/45 transition-colors hover:text-white" style={{ fontFamily: BODY }}>
                ← Back
              </button>
              <button
                type="button"
                onClick={() => go("reveal", 2, `answered-${leaking.length}-leaking`)}
                disabled={!answeredAll}
                className="cta-shine rounded-full text-center font-semibold text-white transition-transform duration-300 hover:scale-[1.03] disabled:cursor-not-allowed disabled:opacity-40"
                style={{ fontFamily: HEADING, padding: "13px 34px", fontSize: "13px", letterSpacing: "0.05em", background: GRADIENT, boxShadow: GRADIENT_SHADOW }}
              >
                {answeredAll ? "See what this means →" : `${service.questions.length - Object.keys(answers).length} to go`}
              </button>
            </div>
          </motion.div>
        )}

        {/* ══ 3 · REVEAL ══ */}
        {phase === "reveal" && (
          <motion.div key="reveal" {...slide} transition={{ duration: reduce ? 0 : 0.22 }}>
            <h2 ref={headingRef} tabIndex={-1} className="text-2xl font-bold italic text-white outline-none md:text-3xl lg:text-4xl" style={{ fontFamily: HEADING }}>
              {leakHeadline(leaking.length, service.questions.length)}
            </h2>

            {/* The picture, before any words. Lit means leaking. */}
            <ol className="mt-6 grid grid-cols-5 gap-1.5">
              {service.questions.map((q) => {
                const isLeaking = leaks(answers[q.key]);
                const label = MOMENTS.find((m) => m.key === q.key)?.label ?? q.key;
                return (
                  <li key={q.key} className="text-center">
                    <div
                      className="mb-2 h-1.5 rounded-full"
                      style={{ background: isLeaking ? ORANGE : "rgba(255,255,255,0.12)" }}
                    />
                    <span
                      className="block text-[0.7rem] leading-tight md:text-xs"
                      style={{ fontFamily: BODY, color: isLeaking ? ORANGE : "rgba(255,255,255,0.3)" }}
                    >
                      {label}
                    </span>
                  </li>
                );
              })}
            </ol>

            {leaking.length > 0 ? (
              <ul className="mt-7 space-y-3">
                {leaking.map((q) => (
                  <li key={q.key} className="flex gap-3">
                    <span aria-hidden className="mt-[3px] shrink-0" style={{ color: ORANGE }}>
                      !
                    </span>
                    <span>
                      <span className="block text-[0.9375rem] font-semibold text-white" style={{ fontFamily: HEADING }}>
                        {MOMENTS.find((m) => m.key === q.key)?.label}
                      </span>
                      <span className="block text-sm leading-relaxed text-white/55" style={{ fontFamily: BODY }}>
                        {q.leak}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-7 text-sm leading-relaxed text-white/60" style={{ fontFamily: BODY }}>
                Genuinely rare, and it means you probably do not need us yet. If you want a second pair
                of eyes on it anyway, we will tell you honestly what we would and would not change.
              </p>
            )}

            {/* The number. Published pricing means we can show it here instead of
                making them book a call to find out, which is the whole point. */}
            {leaking.length > 0 && (
              <div className="mt-8 rounded-xl border p-5 md:p-6" style={{ borderColor: "rgba(234,154,97,0.25)", background: "rgba(234,154,97,0.05)" }}>
                <span className="mb-2 block text-[11px] uppercase tracking-[0.25em]" style={{ fontFamily: BODY, color: ORANGE }}>
                  What this usually is
                </span>
                <h3 className="text-xl font-bold italic text-white md:text-2xl" style={{ fontFamily: HEADING }}>
                  {tier.name}
                </h3>
                <p className="mt-1 text-2xl font-bold italic text-white md:text-3xl" style={{ fontFamily: HEADING }}>
                  {fmt(tier.priceFrom)}{" "}
                  <span className="text-lg text-white/40">to {fmt(tier.priceTo)}</span>
                </p>
                <p className="mt-3 text-sm leading-relaxed text-white/55" style={{ fontFamily: BODY }}>
                  {tier.tagline}
                </p>
                {leaking.length >= 4 && (
                  <p className="mt-3 border-t border-[#EA9A61]/15 pt-3 text-xs leading-relaxed text-white/40" style={{ fontFamily: BODY }}>
                    {OVER_CEILING_NOTE}
                  </p>
                )}
                <Link href="/pricing" className="mt-3 inline-block text-xs underline underline-offset-4" style={{ fontFamily: BODY, color: ORANGE }}>
                  See the full price list
                </Link>
              </div>
            )}

            <div className="mt-8 flex flex-col gap-3 border-t border-white/[0.07] pt-6 sm:flex-row sm:items-center sm:justify-between">
              <a
                href={CAL_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackBookingClick(service.source)}
                className="text-center text-sm text-white/50 underline underline-offset-4 transition-colors hover:text-white"
                style={{ fontFamily: BODY }}
              >
                Rather just talk it through?
              </a>
              <button
                type="button"
                onClick={() => go("gate", 3, "reveal-accepted")}
                className="cta-shine rounded-full text-center font-semibold text-white transition-transform duration-300 hover:scale-[1.03]"
                style={{ fontFamily: HEADING, padding: "13px 34px", fontSize: "13px", letterSpacing: "0.05em", background: GRADIENT, boxShadow: GRADIENT_SHADOW }}
              >
                Send me the breakdown →
              </button>
            </div>
          </motion.div>
        )}

        {/* ══ 4 · GATE ══ */}
        {phase === "gate" && (
          <motion.div key="gate" {...slide} transition={{ duration: reduce ? 0 : 0.22 }}>
            <h2 ref={headingRef} tabIndex={-1} className="text-2xl font-bold italic text-white outline-none md:text-3xl" style={{ fontFamily: HEADING }}>
              Where do we send it?
            </h2>
            <p className="mb-7 mt-1.5 text-sm text-white/45" style={{ fontFamily: BODY }}>
              A written breakdown of the {leaking.length === 1 ? "moment" : `${leaking.length} moments`} above,
              what each one is costing, and what we would fix first. One business day.
            </p>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm text-white/75" style={{ fontFamily: BODY }}>
                  Your name <span style={{ color: ORANGE }}>*</span>
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="First and last"
                  autoComplete="name"
                  maxLength={120}
                  aria-invalid={touched && !name.trim() ? true : undefined}
                  className={`w-full rounded-lg border bg-white/[0.04] px-3.5 py-3 text-base text-white placeholder-white/25 outline-none transition-colors focus:border-[#EA9A61]/60 ${
                    touched && !name.trim() ? "border-[#ff8b6b]/60" : "border-white/10"
                  }`}
                  style={{ fontFamily: BODY }}
                />
                {touched && !name.trim() && (
                  <p className="mt-1.5 text-xs text-[#ff8b6b]" style={{ fontFamily: BODY }}>Who are we replying to?</p>
                )}
              </div>
              <div>
                <label className="mb-1 block text-sm text-white/75" style={{ fontFamily: BODY }}>
                  Email <span style={{ color: ORANGE }}>*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@business.com"
                  autoComplete="email"
                  inputMode="email"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  maxLength={254}
                  aria-invalid={touched && !emailValid ? true : undefined}
                  className={`w-full rounded-lg border bg-white/[0.04] px-3.5 py-3 text-base text-white placeholder-white/25 outline-none transition-colors focus:border-[#EA9A61]/60 ${
                    touched && !emailValid ? "border-[#ff8b6b]/60" : "border-white/10"
                  }`}
                  style={{ fontFamily: BODY }}
                />
                {touched && !emailValid && (
                  <p className="mt-1.5 text-xs text-[#ff8b6b]" style={{ fontFamily: BODY }}>That email doesn&apos;t look right.</p>
                )}
              </div>
            </div>

            <label className="mb-1 mt-4 block text-sm text-white/75" style={{ fontFamily: BODY }}>
              Anything else? <span className="text-white/30">(optional)</span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              maxLength={1500}
              placeholder={service.notesPlaceholder}
              className="w-full resize-y rounded-lg border border-white/10 bg-white/[0.04] px-3.5 py-3 text-base leading-relaxed text-white placeholder-white/25 outline-none transition-colors focus:border-[#EA9A61]/60"
              style={{ fontFamily: BODY }}
            />

            {/* Honeypot */}
            <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
              <label htmlFor="intake-company">Company</label>
              <input id="intake-company" name="company" type="text" tabIndex={-1} autoComplete="off" value={company} onChange={(e) => setCompany(e.target.value)} />
            </div>

            {status === "error" && (
              <p role="alert" className="mt-4 text-sm text-[#ff8b6b]" style={{ fontFamily: BODY }}>{error}</p>
            )}

            <p className="mt-4 text-xs leading-relaxed text-white/30" style={{ fontFamily: BODY }}>
              We use this to send your breakdown and reply. No lists you didn&apos;t ask for.
            </p>

            <div className="mt-8 flex items-center justify-between gap-3 border-t border-white/[0.07] pt-6">
              <button type="button" onClick={() => setPhase("reveal")} className="text-sm text-white/45 transition-colors hover:text-white" style={{ fontFamily: BODY }}>
                ← Back
              </button>
              <button
                type="button"
                onClick={submit}
                disabled={status === "sending"}
                className="cta-shine rounded-full text-center font-semibold text-white transition-transform duration-300 hover:scale-[1.03] disabled:opacity-70"
                style={{ fontFamily: HEADING, padding: "13px 34px", fontSize: "13px", letterSpacing: "0.05em", background: GRADIENT, boxShadow: GRADIENT_SHADOW }}
              >
                {status === "sending" ? "Sending…" : "Send it over →"}
              </button>
            </div>
          </motion.div>
        )}

        {/* ══ DONE ══ */}
        {phase === "done" && (
          <motion.div key="done" role="status" aria-live="polite" initial={reduce ? false : { opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: reduce ? 0 : 0.3 }}>
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full" style={{ background: "rgba(234,154,97,0.12)", border: `1.5px solid ${ORANGE}` }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={ORANGE} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h2 ref={headingRef} tabIndex={-1} className="text-2xl font-bold italic text-white outline-none md:text-3xl" style={{ fontFamily: HEADING }}>
              Got it, {name.split(" ")[0] || "thanks"}.
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/55" style={{ fontFamily: BODY }}>
              Your breakdown is being written by a person, not generated. It lands within one business
              day and covers the {leaking.length === 1 ? "moment" : `${leaking.length} moments`} you
              flagged, what each is costing, and where we would start.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a
                href={CAL_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackBookingClick(service.source)}
                className="flex-1 rounded-full border border-white/12 text-center font-semibold text-white/70 transition-all duration-300 hover:border-[#EA9A61]/50 hover:text-white"
                style={{ fontFamily: HEADING, padding: "14px", fontSize: "13px", letterSpacing: "0.05em", background: "rgba(255,255,255,0.03)" }}
              >
                Book a call while you wait
              </a>
              <Link
                href="/works"
                className="flex-1 rounded-full border border-white/12 text-center font-semibold text-white/70 transition-all duration-300 hover:border-[#EA9A61]/50 hover:text-white"
                style={{ fontFamily: HEADING, padding: "14px", fontSize: "13px", letterSpacing: "0.05em", background: "rgba(255,255,255,0.03)" }}
              >
                See recent work
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
