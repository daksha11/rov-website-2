"use client";

// Project brief for /web/brief.
//
// Architecture: the form splits at the conversion point. Four short screens ask
// only what we act on (their URL, the goal, their taste, budget and timeline),
// then a name-and-email gate submits the lead. Everything heavier lives *after*
// that gate, in an optional deepening step, where a drop-off costs us nothing
// because the lead is already captured.
//
// The reveal between the two halves is the trade: they hand us taste, we hand
// back a read on their project instead of a thank-you page.

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const HEADING = "Norwige, sans-serif";
const BODY = "'Roboto', sans-serif";
const GRADIENT =
  "linear-gradient(112deg, #42201C 6.46%, #A64D2B 34.96%, #B16937 63.88%, #EA9A61 97.63%)";
const GRADIENT_SHADOW =
  "3px 4px 4px 0 rgba(255, 244, 227, 0.15) inset, 0 4.385px 4.385px 0 rgba(0, 0, 0, 0.25)";
const spring = { type: "spring" as const, stiffness: 160, damping: 22 };

const CAL_URL = "https://cal.com/rov-studios-imhphw/15min";

// ── Pre-gate options: only what changes what we build ────────────
const GOALS = [
  { key: "leads", label: "Get more calls and leads", sub: "The phone should ring more than it does now" },
  { key: "sell", label: "Sell online", sub: "Products, services, or bookings that check out on the site" },
  { key: "credibility", label: "Look like the real thing", sub: "Stop losing deals because the site undersells us" },
  { key: "book", label: "Fill the calendar", sub: "Appointments, consults, reservations" },
  { key: "showcase", label: "Show the work", sub: "Portfolio, case studies, proof" },
  { key: "rebuild", label: "Fix what's broken", sub: "Slow, dated, hard to update, invisible on Google" },
];

// Six, not twelve. Enough to place them on the map, few enough to scan.
const VIBES = [
  "Clean and minimal",
  "Bold and loud",
  "Warm and human",
  "Premium and polished",
  "Playful",
  "Dark and moody",
];

const TIMELINES = [
  "ASAP, we're behind",
  "Within a month",
  "1 to 3 months",
  "No hard deadline, doing it right matters more",
];

const BUDGETS = [
  "$2,500 to $5,000",
  "$5,000 to $10,000",
  "$10,000 to $20,000",
  "$20,000+",
  "Not sure yet, show me what's possible",
];

// ── Post-gate options: the scoping detail, asked once they're in ──
const PAGES = [
  "Home",
  "About",
  "Services",
  "Portfolio or gallery",
  "Pricing",
  "Blog or resources",
  "Contact",
  "Booking",
];

const FEATURES = [
  "Online booking",
  "Payments or e-commerce",
  "A CMS I can edit myself",
  "Email capture",
  "Customer login",
  "CRM or software integration",
  "Google reviews pulled in",
  "Automated follow-up",
];

const BRAND_ASSETS = [
  "Full brand kit: logo, colors, fonts",
  "Logo and colors only",
  "Just a logo, and it needs work",
  "Nothing yet, we need branding too",
];

const MEDIA = [
  "Professional photos and video ready",
  "Some photos, nothing recent",
  "Phone photos only",
  "Nothing, we'd need a shoot",
];

const COPY_STATUS = [
  "Written and approved",
  "Rough drafts to work from",
  "Old site copy to reuse or rewrite",
  "Nothing written, we need help",
];

const STEPS = [
  { title: "Where are we starting?", sub: "One link tells us more than a page of questions." },
  { title: "What does it need to do?", sub: "The job, not the features. We'll handle those." },
  { title: "What should it feel like?", sub: "This is the part that makes your demo look like yours." },
  { title: "What are we working with?", sub: "So we scope something real instead of guessing." },
  { title: "Where do we send it?", sub: "Last step. Then you get our read on it." },
];

// The payoff. Honest ranges tied to what they told us, not a fake quote.
function scopeRead(budget: string) {
  switch (budget) {
    case "$2,500 to $5,000":
      return {
        band: "A focused 4 to 6 page site",
        body: "Custom design, mobile first, built around one clear action. Typically 3 to 5 weeks start to finish.",
      };
    case "$5,000 to $10,000":
      return {
        band: "8 to 12 pages with room to grow",
        body: "Custom sections throughout, a CMS so you can edit it yourself, and real SEO groundwork. Typically 5 to 8 weeks.",
      };
    case "$10,000 to $20,000":
      return {
        band: "A larger build with custom functionality",
        body: "Booking, e-commerce, integrations, or a content system that does actual work. Typically 8 to 12 weeks.",
      };
    case "$20,000+":
      return {
        band: "A multi-phase build",
        body: "Custom product work, systems that connect, and ongoing iteration after launch. We scope this in phases so you see value early.",
      };
    default:
      return {
        band: "We'll show you two or three levels",
        body: "Rather than guess, we'll come back with options at different investment levels so you can see exactly what each one buys.",
      };
  }
}

// ── State ───────────────────────────────────────────────────────
type Data = {
  // Pre-gate
  website: string;
  noSite: boolean;
  businessName: string;
  goal: string;
  successMetric: string;
  references: string;
  vibe: string[];
  avoid: string;
  budget: string;
  timeline: string;
  name: string;
  email: string;
  notes: string;
  company: string; // honeypot
  // Post-gate
  pages: string[];
  features: string[];
  colors: string;
  brandAssets: string;
  media: string;
  copyStatus: string;
};

const EMPTY: Data = {
  website: "",
  noSite: false,
  businessName: "",
  goal: "",
  successMetric: "",
  references: "",
  vibe: [],
  avoid: "",
  budget: "",
  timeline: "",
  name: "",
  email: "",
  notes: "",
  company: "",
  pages: [],
  features: [],
  colors: "",
  brandAssets: "",
  media: "",
  copyStatus: "",
};

type Status = "idle" | "submitting" | "success" | "error";

export default function ProjectBriefForm() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Data>(EMPTY);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [touched, setTouched] = useState(false);
  // Second, optional submission after the gate.
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsStatus, setDetailsStatus] = useState<Status>("idle");

  const set = <K extends keyof Data>(key: K, value: Data[K]) =>
    setData((p) => ({ ...p, [key]: value }));

  const toggle = (key: "pages" | "features" | "vibe", value: string) =>
    setData((p) => {
      const current = p[key];
      return {
        ...p,
        [key]: current.includes(value)
          ? current.filter((v) => v !== value)
          : [...current, value],
      };
    });

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim());

  // Two gates in the whole flow: something to identify them by, then contact.
  const stepValid = useMemo(() => {
    if (step === 0) {
      return data.noSite ? data.businessName.trim().length > 0 : data.website.trim().length > 0;
    }
    if (step === 4) return data.name.trim().length > 0 && emailValid;
    return true;
  }, [step, data.noSite, data.website, data.businessName, data.name, emailValid]);

  function scrollToTop() {
    if (typeof window === "undefined") return;
    const el = document.getElementById("brief-card");
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 90;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  }

  const goNext = () => {
    if (!stepValid) {
      setTouched(true);
      return;
    }
    setTouched(false);
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
    scrollToTop();
  };

  const goBack = () => {
    setTouched(false);
    setStep((s) => Math.max(s - 1, 0));
    scrollToTop();
  };

  function payload(stage: "initial" | "details") {
    return {
      stage,
      name: data.name,
      email: data.email,
      businessName: data.businessName,
      website: data.noSite ? "No site yet" : data.website,
      goal: data.goal,
      successMetric: data.successMetric,
      references: data.references,
      vibe: data.vibe,
      avoid: data.avoid,
      budget: data.budget,
      timeline: data.timeline,
      notes: data.notes,
      pages: data.pages,
      features: data.features,
      colors: data.colors,
      brandAssets: data.brandAssets,
      media: data.media,
      copyStatus: data.copyStatus,
      company: data.company,
      page: typeof window !== "undefined" ? window.location.pathname : "/web/brief",
    };
  }

  async function post(stage: "initial" | "details") {
    const res = await fetch("/api/web/brief", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload(stage)),
    });
    const json = await res.json().catch(() => ({ ok: false }));
    return { ok: res.ok && json.ok, error: json.error as string | undefined };
  }

  async function submit() {
    if (!stepValid) {
      setTouched(true);
      return;
    }
    if (status === "submitting") return;
    setStatus("submitting");
    setErrorMsg("");
    try {
      const { ok, error } = await post("initial");
      if (ok) {
        setStatus("success");
        scrollToTop();
        return;
      }
      setStatus("error");
      setErrorMsg(error || "Something went wrong. Please try again, or email us directly.");
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Please try again, or email us directly.");
    }
  }

  async function submitDetails() {
    if (detailsStatus === "submitting") return;
    setDetailsStatus("submitting");
    try {
      const { ok } = await post("details");
      setDetailsStatus(ok ? "success" : "error");
    } catch {
      setDetailsStatus("error");
    }
  }

  // ── The reveal + optional deepening ───────────────────────────
  if (status === "success") {
    const read = scopeRead(data.budget);
    const label = data.businessName.trim() || data.website.trim() || "your project";
    const goal = GOALS.find((g) => g.label === data.goal);

    return (
      <div id="brief-card" className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 md:p-9">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-[#EA9A61]/15 border border-[#EA9A61]/30 flex items-center justify-center shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#EA9A61" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <div>
            <h2 className="text-white text-2xl md:text-3xl font-bold italic leading-tight" style={{ fontFamily: HEADING }}>
              Got it, {data.name.split(" ")[0] || "thanks"}.
            </h2>
            <p className="text-white/40 text-sm" style={{ fontFamily: BODY }}>
              We reply within one business day.
            </p>
          </div>
        </div>

        {/* The payoff: what their answers point at */}
        <div className="rounded-xl border border-[#EA9A61]/25 bg-[#EA9A61]/[0.05] p-5 md:p-6 mb-6">
          <span className="block text-[11px] uppercase tracking-[0.25em] text-[#EA9A61] mb-2" style={{ fontFamily: BODY }}>
            What we&apos;d scope for {label}
          </span>
          <h3 className="text-white text-xl md:text-2xl font-bold italic mb-2" style={{ fontFamily: HEADING }}>
            {read.band}
          </h3>
          <p className="text-white/55 text-sm leading-relaxed" style={{ fontFamily: BODY }}>
            {read.body}
          </p>
          {goal && (
            <p className="text-white/40 text-sm leading-relaxed mt-3 pt-3 border-t border-[#EA9A61]/15" style={{ fontFamily: BODY }}>
              Built around one job: {goal.label.toLowerCase()}.
            </p>
          )}
        </div>

        {/* Optional deepening. The lead is already in, so this is pure upside. */}
        {detailsStatus === "success" ? (
          <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-5 text-center">
            <p className="text-white/70 text-sm" style={{ fontFamily: BODY }}>
              Sent. That detail is attached to your brief.
            </p>
          </div>
        ) : !detailsOpen ? (
          <button
            type="button"
            onClick={() => setDetailsOpen(true)}
            className="w-full rounded-xl border border-white/[0.1] bg-white/[0.02] hover:border-[#EA9A61]/40 p-5 text-left transition-all duration-200 cursor-pointer"
          >
            <span className="block text-white text-base font-semibold mb-1" style={{ fontFamily: HEADING }}>
              Want a sharper demo? &rarr;
            </span>
            <span className="block text-white/40 text-sm" style={{ fontFamily: BODY }}>
              Four more optional questions about pages, features, and what you already have. Skip
              it and we&apos;ll cover this on the call instead.
            </span>
          </button>
        ) : (
          <div className="rounded-xl border border-white/[0.1] bg-white/[0.02] p-5 md:p-6 space-y-6">
            <Field label="Pages you think you need" hint="rough guess is fine, we'll propose the rest">
              <ChipGroup options={PAGES} selected={data.pages} onToggle={(v) => toggle("pages", v)} />
            </Field>
            <Field label="Things it has to do">
              <ChipGroup options={FEATURES} selected={data.features} onToggle={(v) => toggle("features", v)} />
            </Field>
            <Field label="Colors" hint="ones you own, ones you can't stand">
              <TextInput
                value={data.colors}
                onChange={(v) => set("colors", v)}
                placeholder="Our green #1F4D3A, cream, black. No blue."
              />
            </Field>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field label="Brand assets">
                <Select value={data.brandAssets} onChange={(v) => set("brandAssets", v)} placeholder="Pick one" options={BRAND_ASSETS} />
              </Field>
              <Field label="Photos">
                <Select value={data.media} onChange={(v) => set("media", v)} placeholder="Pick one" options={MEDIA} />
              </Field>
              <Field label="Copy">
                <Select value={data.copyStatus} onChange={(v) => set("copyStatus", v)} placeholder="Pick one" options={COPY_STATUS} />
              </Field>
            </div>
            {detailsStatus === "error" && (
              <p role="alert" className="text-[#ff8b6b] text-sm" style={{ fontFamily: BODY }}>
                That didn&apos;t send. No harm done, your brief is already in.
              </p>
            )}
            <button
              type="button"
              onClick={submitDetails}
              disabled={detailsStatus === "submitting"}
              className="cta-shine block w-full text-center text-white font-semibold rounded-full transition-transform duration-300 hover:scale-[1.02] disabled:opacity-70 cursor-pointer"
              style={{ fontFamily: HEADING, padding: "13px", fontSize: "13px", letterSpacing: "0.05em", background: GRADIENT, boxShadow: GRADIENT_SHADOW }}
            >
              {detailsStatus === "submitting" ? "Sending…" : "Add this to my brief →"}
            </button>
          </div>
        )}

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <a
            href={CAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center text-white/70 font-semibold rounded-full border border-white/12 hover:border-[#EA9A61]/50 hover:text-white transition-all duration-300"
            style={{ fontFamily: HEADING, padding: "14px", fontSize: "13px", letterSpacing: "0.05em", background: "rgba(255,255,255,0.03)" }}
          >
            Book a call while you wait
          </a>
          <a
            href="/works"
            className="flex-1 text-center text-white/70 font-semibold rounded-full border border-white/12 hover:border-[#EA9A61]/50 hover:text-white transition-all duration-300"
            style={{ fontFamily: HEADING, padding: "14px", fontSize: "13px", letterSpacing: "0.05em", background: "rgba(255,255,255,0.03)" }}
          >
            See recent work
          </a>
        </div>
      </div>
    );
  }

  const isGate = step === STEPS.length - 1;

  return (
    <div id="brief-card" className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 md:p-9">
      {/* Progress */}
      <div className="flex items-center gap-2 mb-3">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className="h-1 flex-1 rounded-full transition-colors duration-300"
            style={{ background: i <= step ? "#EA9A61" : "rgba(255,255,255,0.1)" }}
          />
        ))}
      </div>
      <div className="flex items-center justify-between mb-7">
        <span className="text-[11px] uppercase tracking-[0.22em] text-white/35" style={{ fontFamily: BODY }}>
          Step {step + 1} of {STEPS.length}
        </span>
        <span className="text-[11px] text-white/30" style={{ fontFamily: BODY }}>
          Under 2 minutes
        </span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 18 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -18 }}
          transition={{ duration: 0.22 }}
        >
          <h2 className="text-white text-2xl md:text-3xl font-bold italic" style={{ fontFamily: HEADING }}>
            {STEPS[step].title}
          </h2>
          <p className="text-white/45 text-sm mt-1.5 mb-7" style={{ fontFamily: BODY }}>
            {STEPS[step].sub}
          </p>

          {/* ── 0: Their URL. One field, no commitment. ── */}
          {step === 0 && (
            <div className="space-y-4">
              {!data.noSite ? (
                <Field label="Your current website" hint="paste it even if you hate it, that's useful too">
                  <TextInput
                    value={data.website}
                    onChange={(v) => set("website", v)}
                    placeholder="yourbusiness.com"
                    autoFocus
                    invalid={touched && !data.website.trim()}
                  />
                  {touched && !data.website.trim() && (
                    <ErrorText>Paste a link, or tell us there isn&apos;t one yet.</ErrorText>
                  )}
                </Field>
              ) : (
                <Field label="What's the business called?">
                  <TextInput
                    value={data.businessName}
                    onChange={(v) => set("businessName", v)}
                    placeholder="Webb Heating & Air"
                    autoFocus
                    invalid={touched && !data.businessName.trim()}
                  />
                  {touched && !data.businessName.trim() && <ErrorText>We need something to call it.</ErrorText>}
                </Field>
              )}

              <button
                type="button"
                onClick={() => {
                  set("noSite", !data.noSite);
                  setTouched(false);
                }}
                className="text-white/40 hover:text-[#EA9A61] text-sm transition-colors cursor-pointer underline underline-offset-4 decoration-white/15"
                style={{ fontFamily: BODY }}
              >
                {data.noSite ? "Actually, we do have a site" : "We don't have a site yet"}
              </button>

              <p className="text-white/25 text-xs leading-relaxed pt-2" style={{ fontFamily: BODY }}>
                We look at it before we reply. Half of what most forms ask, we can read off the site
                itself.
              </p>
            </div>
          )}

          {/* ── 1: The job. ── */}
          {step === 1 && (
            <div className="space-y-6">
              <Field label="What's the primary job of this site?">
                <div className="space-y-3">
                  {GOALS.map((g) => (
                    <OptionRow
                      key={g.key}
                      label={g.label}
                      sub={g.sub}
                      selected={data.goal === g.label}
                      onClick={() => set("goal", data.goal === g.label ? "" : g.label)}
                    />
                  ))}
                </div>
              </Field>

              <Field
                label="Six months in, what makes this worth it?"
                hint="optional, but the most useful thing you can tell us"
              >
                <TextArea
                  value={data.successMetric}
                  onChange={(v) => set("successMetric", v)}
                  placeholder="Eight to ten quote requests a month instead of two, and nobody says 'I couldn't find your prices.'"
                  rows={3}
                />
              </Field>
            </div>
          )}

          {/* ── 2: Taste. The demo fuel. ── */}
          {step === 2 && (
            <div className="space-y-6">
              <Field
                label="Sites you love"
                hint="two or three links, any industry. Competitors welcome."
              >
                <TextArea
                  value={data.references}
                  onChange={(v) => set("references", v)}
                  placeholder={"stripe.com\naesop.com\nthat one competitor: example.com"}
                  rows={3}
                />
              </Field>

              <Field label="How should yours feel?" hint="pick two or three">
                <ChipGroup options={VIBES} selected={data.vibe} onToggle={(v) => toggle("vibe", v)} />
              </Field>

              <Field label="What should we absolutely not do?" hint="fastest way to a demo you like">
                <TextArea
                  value={data.avoid}
                  onChange={(v) => set("avoid", v)}
                  placeholder="No stock photos of people shaking hands. No sliders. Don't bury the phone number."
                  rows={3}
                />
              </Field>
            </div>
          )}

          {/* ── 3: Qualification. ── */}
          {step === 3 && (
            <div className="space-y-5">
              <Field label="Budget range" hint="our website projects start at $2,500">
                <Select
                  value={data.budget}
                  onChange={(v) => set("budget", v)}
                  placeholder="Pick a range"
                  options={BUDGETS}
                />
              </Field>

              <Field label="Timeline">
                <Select
                  value={data.timeline}
                  onChange={(v) => set("timeline", v)}
                  placeholder="When do you want this live?"
                  options={TIMELINES}
                />
              </Field>

              <p className="text-white/25 text-xs leading-relaxed pt-1" style={{ fontFamily: BODY }}>
                Straight numbers here save us both a call. We scope to the range you pick, and tell
                you honestly if what you want costs more than that.
              </p>
            </div>
          )}

          {/* ── 4: The gate. ── */}
          {step === 4 && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="Your name" required>
                  <TextInput
                    value={data.name}
                    onChange={(v) => set("name", v)}
                    placeholder="First and last"
                    maxLength={120}
                    autoComplete="name"
                    autoFocus
                    invalid={touched && !data.name.trim()}
                  />
                  {touched && !data.name.trim() && <ErrorText>Who are we replying to?</ErrorText>}
                </Field>
                <Field label="Email" required>
                  <TextInput
                    value={data.email}
                    onChange={(v) => set("email", v)}
                    placeholder="you@business.com"
                    maxLength={254}
                    type="email"
                    autoComplete="email"
                    invalid={touched && !emailValid}
                  />
                  {touched && !emailValid && <ErrorText>That email doesn&apos;t look right.</ErrorText>}
                </Field>
              </div>

              <Field label="Anything else we should know?" hint="optional">
                <TextArea
                  value={data.notes}
                  onChange={(v) => set("notes", v)}
                  placeholder="We're rebranding in the spring, and whatever we build has to survive that."
                  rows={3}
                />
              </Field>

              {/* Honeypot */}
              <div aria-hidden className="absolute -left-[9999px] w-px h-px overflow-hidden">
                <label htmlFor="brief-company">Company</label>
                <input
                  id="brief-company"
                  name="company"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={data.company}
                  onChange={(e) => set("company", e.target.value)}
                />
              </div>

              {status === "error" && (
                <p role="alert" className="text-[#ff8b6b] text-sm" style={{ fontFamily: BODY }}>
                  {errorMsg}
                </p>
              )}

              <p className="text-white/30 text-xs leading-relaxed" style={{ fontFamily: BODY }}>
                We use this to reply and scope your project. No lists you didn&apos;t ask for.
              </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Nav */}
      <div className="flex items-center gap-3 mt-9 pt-6 border-t border-white/[0.07]">
        {step > 0 && (
          <button
            type="button"
            onClick={goBack}
            className="text-white/45 hover:text-white text-sm transition-colors cursor-pointer flex items-center gap-1.5"
            style={{ fontFamily: BODY }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        )}
        <div className="flex-1" />
        <motion.button
          type="button"
          onClick={isGate ? submit : goNext}
          disabled={status === "submitting"}
          whileTap={{ scale: 0.98 }}
          transition={spring}
          className="cta-shine text-center text-white font-semibold rounded-full transition-transform duration-300 hover:scale-[1.03] disabled:opacity-70 cursor-pointer"
          style={{ fontFamily: HEADING, padding: "13px 34px", fontSize: "13px", letterSpacing: "0.05em", background: GRADIENT, boxShadow: GRADIENT_SHADOW }}
        >
          {isGate
            ? status === "submitting"
              ? "Sending…"
              : "Send the brief →"
            : "Continue →"}
        </motion.button>
      </div>
    </div>
  );
}

// ── Building blocks ─────────────────────────────────────────────
const inputClass =
  "w-full rounded-lg bg-white/[0.04] border border-white/10 px-3.5 py-3 text-white text-sm placeholder-white/25 focus:border-[#EA9A61]/60 focus:outline-none focus:ring-2 focus:ring-[#EA9A61]/20 transition-colors";

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-white/75 text-sm font-medium mb-1" style={{ fontFamily: BODY }}>
        {label}
        {required && <span className="text-[#EA9A61] ml-1">*</span>}
      </label>
      {hint ? (
        <p className="text-white/30 text-xs mb-2.5" style={{ fontFamily: BODY }}>
          {hint}
        </p>
      ) : (
        <div className="mb-2.5" />
      )}
      {children}
    </div>
  );
}

function ErrorText({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[#ff8b6b] text-xs mt-1.5" style={{ fontFamily: BODY }}>
      {children}
    </p>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
  type = "text",
  autoComplete,
  autoFocus,
  invalid,
  // Mirrors the server schema so a long answer never comes back as a 400.
  maxLength = 160,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  autoComplete?: string;
  autoFocus?: boolean;
  invalid?: boolean;
  maxLength?: number;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      maxLength={maxLength}
      autoComplete={autoComplete}
      autoFocus={autoFocus}
      aria-invalid={invalid || undefined}
      className={`${inputClass} ${invalid ? "border-[#ff8b6b]/60" : ""}`}
      style={{ fontFamily: BODY }}
    />
  );
}

function TextArea({
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      maxLength={1500}
      className={`${inputClass} resize-y leading-relaxed`}
      style={{ fontFamily: BODY }}
    />
  );
}

function Select({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder: string;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputClass} appearance-none pr-10 cursor-pointer ${
          value ? "text-white" : "text-white/40"
        }`}
        style={{ fontFamily: BODY }}
      >
        <option value="" style={{ background: "#151110" }}>
          {placeholder}
        </option>
        {options.map((o) => (
          <option key={o} value={o} style={{ background: "#151110", color: "#fff" }}>
            {o}
          </option>
        ))}
      </select>
      <svg
        aria-hidden
        className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-white/35"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </div>
  );
}

function ChipGroup({
  options,
  selected,
  onToggle,
}: {
  options: string[];
  selected: string[];
  onToggle: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const on = selected.includes(o);
        return (
          <button
            key={o}
            type="button"
            onClick={() => onToggle(o)}
            aria-pressed={on}
            className={`rounded-full border px-3.5 py-2 text-sm transition-all duration-200 cursor-pointer ${
              on
                ? "border-[#EA9A61]/60 bg-[#EA9A61]/[0.12] text-white"
                : "border-white/[0.1] bg-white/[0.02] text-white/60 hover:border-white/25 hover:text-white/85"
            }`}
            style={{ fontFamily: BODY }}
          >
            {o}
          </button>
        );
      })}
    </div>
  );
}

function OptionRow({
  label,
  sub,
  selected,
  onClick,
}: {
  label: string;
  sub?: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`group w-full flex items-center gap-3 rounded-xl border p-4 text-left transition-all duration-200 cursor-pointer ${
        selected
          ? "border-[#EA9A61]/50 bg-[#EA9A61]/[0.06]"
          : "border-white/[0.08] bg-white/[0.02] hover:border-white/20"
      }`}
    >
      <span
        className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 ${
          selected
            ? "bg-[#EA9A61] text-black"
            : "border border-white/25 text-transparent group-hover:border-[#EA9A61]/50"
        }`}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </span>
      <span className="flex-1 min-w-0">
        <span className="block text-white text-base font-semibold" style={{ fontFamily: HEADING }}>
          {label}
        </span>
        {sub && (
          <span className="block text-white/40 text-xs mt-0.5" style={{ fontFamily: BODY }}>
            {sub}
          </span>
        )}
      </span>
    </button>
  );
}
