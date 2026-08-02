"use client";

// Long-form project brief for /web/brief. Six steps, one idea per step, so the
// visitor answers everything we need to picture the site and build a demo
// without a discovery call first. Posts to /api/web/brief (Resend).
//
// Only business name, name, and email are required. Everything else is
// optional on purpose: a half-filled brief still tells us plenty, and a wall
// of required fields is how these forms die.

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const HEADING = "Norwige, sans-serif";
const BODY = "'Roboto', sans-serif";
const GRADIENT =
  "linear-gradient(112deg, #42201C 6.46%, #A64D2B 34.96%, #B16937 63.88%, #EA9A61 97.63%)";
const GRADIENT_SHADOW =
  "3px 4px 4px 0 rgba(255, 244, 227, 0.15) inset, 0 4.385px 4.385px 0 rgba(0, 0, 0, 0.25)";
const spring = { type: "spring" as const, stiffness: 160, damping: 22 };

// ── Options ─────────────────────────────────────────────────────
const INDUSTRIES = [
  "Restaurant / food & beverage",
  "Home services (HVAC, plumbing, roofing)",
  "Real estate",
  "Health, wellness & fitness",
  "Legal / financial / professional services",
  "Beauty, salon & spa",
  "Retail / e-commerce",
  "Construction & trades",
  "Events & hospitality",
  "Nonprofit",
  "Creative / studio / agency",
  "Tech / SaaS / startup",
  "Other",
];

const GOALS = [
  { key: "leads", label: "Get more calls and leads", sub: "The phone should ring more than it does now" },
  { key: "sell", label: "Sell online", sub: "Products, services, or bookings that check out on the site" },
  { key: "credibility", label: "Look like the real thing", sub: "Stop losing deals because the site undersells us" },
  { key: "book", label: "Fill the calendar", sub: "Appointments, consults, and reservations" },
  { key: "showcase", label: "Show the work", sub: "Portfolio, case studies, proof" },
  { key: "rebuild", label: "Fix what's broken", sub: "Slow, dated, hard to update, or invisible on Google" },
];

const PROJECT_TYPES = [
  "Brand new site, nothing exists yet",
  "Full redesign of an existing site",
  "Refresh: keep the bones, rebuild the look",
  "Add to what we have (new pages or features)",
  "Not sure yet, tell us",
];

const PAGES = [
  "Home",
  "About",
  "Services",
  "Individual service pages",
  "Portfolio / gallery",
  "Case studies",
  "Menu / product catalog",
  "Pricing",
  "Blog / resources",
  "Team",
  "Testimonials",
  "FAQ",
  "Contact",
  "Booking",
  "Locations",
  "Careers",
];

const FEATURES = [
  "Online booking / scheduling",
  "Payments or e-commerce checkout",
  "Contact and quote forms",
  "Blog or CMS I can edit myself",
  "Email capture and newsletter",
  "Live chat or AI chat assistant",
  "Customer login / member area",
  "CRM or software integration",
  "Reviews pulled in from Google",
  "Maps and location pages",
  "Multi-language",
  "Analytics and call tracking",
  "SEO built in",
  "Automated follow-up (texts, emails)",
];

const VIBES = [
  "Clean and minimal",
  "Bold and loud",
  "Warm and human",
  "Premium / luxury",
  "Playful",
  "Editorial",
  "Technical and precise",
  "Retro / nostalgic",
  "Dark and moody",
  "Bright and airy",
  "Handmade / textured",
  "Corporate and trustworthy",
];

const BRAND_ASSETS = [
  "Full brand kit: logo, colors, fonts, guidelines",
  "Logo and colors only",
  "Just a logo, and it needs work",
  "Nothing yet, we need branding too",
];

const MEDIA = [
  "Professional photos and video ready to go",
  "Some photos, nothing recent or consistent",
  "Phone photos only",
  "Nothing, we'd need a shoot",
];

const COPY_STATUS = [
  "Copy is written and approved",
  "Rough drafts we can work from",
  "Old site copy we'd reuse or rewrite",
  "Nothing written, we need help with words",
];

const TIMELINES = [
  "ASAP, we're behind",
  "Within a month",
  "1 to 3 months",
  "3 to 6 months",
  "No hard deadline, doing it right matters more",
];

const BUDGETS = [
  "$2,500 to $5,000",
  "$5,000 to $10,000",
  "$10,000 to $20,000",
  "$20,000+",
  "Not sure yet, show me what's possible",
];

const CONTACT_PREFS = ["Email", "Phone call", "Text", "Video call"];

const STEPS = [
  { title: "The business", sub: "Who you are and where we're starting from." },
  { title: "The goal", sub: "What this site has to actually do for you." },
  { title: "The scope", sub: "Pages and features. Guess freely, nothing is locked." },
  { title: "The vision", sub: "The part that makes your demo look like yours." },
  { title: "The reality", sub: "What you already have, and what you're working with." },
  { title: "You", sub: "Where to send the demo." },
];

// ── State ───────────────────────────────────────────────────────
type Data = {
  businessName: string;
  website: string;
  industry: string;
  location: string;
  goal: string;
  successMetric: string;
  audience: string;
  projectType: string;
  pages: string[];
  features: string[];
  references: string;
  likes: string;
  vibe: string[];
  colors: string;
  avoid: string;
  brandAssets: string;
  media: string;
  copyStatus: string;
  timeline: string;
  budget: string;
  name: string;
  email: string;
  phone: string;
  contactPref: string;
  notes: string;
  company: string; // honeypot
};

const EMPTY: Data = {
  businessName: "",
  website: "",
  industry: "",
  location: "",
  goal: "",
  successMetric: "",
  audience: "",
  projectType: "",
  pages: [],
  features: [],
  references: "",
  likes: "",
  vibe: [],
  colors: "",
  avoid: "",
  brandAssets: "",
  media: "",
  copyStatus: "",
  timeline: "",
  budget: "",
  name: "",
  email: "",
  phone: "",
  contactPref: "",
  notes: "",
  company: "",
};

type Status = "idle" | "submitting" | "success" | "error";

export default function ProjectBriefForm() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Data>(EMPTY);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [touched, setTouched] = useState(false);

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

  // Only two gates: a business name to open, a name and email to send.
  const stepValid = useMemo(() => {
    if (step === 0) return data.businessName.trim().length > 0;
    if (step === 5) return data.name.trim().length > 0 && emailValid;
    return true;
  }, [step, data.businessName, data.name, emailValid]);

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

  function scrollToTop() {
    if (typeof window === "undefined") return;
    const el = document.getElementById("brief-card");
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 90;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
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
      const res = await fetch("/api/web/brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          page: typeof window !== "undefined" ? window.location.pathname : "/web/brief",
        }),
      });
      const json = await res.json().catch(() => ({ ok: false }));
      if (res.ok && json.ok) {
        setStatus("success");
        scrollToTop();
        return;
      }
      setStatus("error");
      setErrorMsg(
        json.error ||
          "Something went wrong. Please try again, or email us at hello@rovstudios.com."
      );
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Please try again, or email us at hello@rovstudios.com.");
    }
  }

  if (status === "success") {
    return (
      <div
        id="brief-card"
        className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-8 md:p-12 text-center"
      >
        <div className="w-14 h-14 rounded-full bg-[#EA9A61]/15 border border-[#EA9A61]/30 flex items-center justify-center mx-auto mb-5">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#EA9A61" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h2 className="text-white text-3xl md:text-4xl font-bold italic mb-3" style={{ fontFamily: HEADING }}>
          Got it, {data.name.split(" ")[0] || "thanks"}.
        </h2>
        <p className="text-white/55 text-base max-w-md mx-auto leading-relaxed" style={{ fontFamily: BODY }}>
          Your brief for {data.businessName} is in. We read every one ourselves. Expect a reply
          within one business day with our read on it, and what a demo would look like.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="https://cal.com/rov-studios-imhphw/15min"
            target="_blank"
            rel="noopener noreferrer"
            className="cta-shine inline-block text-center text-white font-semibold rounded-full transition-transform duration-300 hover:scale-[1.03]"
            style={{ fontFamily: HEADING, padding: "14px 30px", fontSize: "13px", letterSpacing: "0.05em", background: GRADIENT, boxShadow: GRADIENT_SHADOW }}
          >
            Book a call while you wait &rarr;
          </a>
          <a
            href="/works"
            className="inline-block text-center text-white/70 font-semibold rounded-full border border-white/12 hover:border-[#EA9A61]/50 hover:text-white transition-all duration-300"
            style={{ fontFamily: HEADING, padding: "14px 30px", fontSize: "13px", letterSpacing: "0.05em", background: "rgba(255,255,255,0.03)" }}
          >
            See recent work
          </a>
        </div>
      </div>
    );
  }

  const isLast = step === STEPS.length - 1;

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
          About 4 minutes
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

          {/* ── Step 0: Business ── */}
          {step === 0 && (
            <div className="space-y-5">
              <Field label="Business or project name" required>
                <TextInput
                  value={data.businessName}
                  onChange={(v) => set("businessName", v)}
                  placeholder="Range of View Studios"
                  autoFocus
                  invalid={touched && !data.businessName.trim()}
                />
                {touched && !data.businessName.trim() && (
                  <ErrorText>We need a name to file this under.</ErrorText>
                )}
              </Field>

              <Field label="Current website" hint="optional, paste it even if you hate it">
                <TextInput
                  value={data.website}
                  onChange={(v) => set("website", v)}
                  placeholder="yoursite.com, or 'none yet'"
                />
              </Field>

              <Field label="Industry">
                <Select
                  value={data.industry}
                  onChange={(v) => set("industry", v)}
                  placeholder="Pick the closest one"
                  options={INDUSTRIES}
                />
              </Field>

              <Field label="Where you are, and who you serve" hint="city, region, or nationwide">
                <TextInput
                  value={data.location}
                  onChange={(v) => set("location", v)}
                  placeholder="Atlanta, plus metro north to Alpharetta"
                />
              </Field>
            </div>
          )}

          {/* ── Step 1: Goal ── */}
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
                label="Six months from launch, what has to be true for this to be worth it?"
                hint="be specific if you can: 'ten booked jobs a month' beats 'more traffic'"
              >
                <TextArea
                  value={data.successMetric}
                  onChange={(v) => set("successMetric", v)}
                  placeholder="We'd be getting 8 to 10 qualified quote requests a month instead of 2, and I'd stop hearing 'I couldn't find your prices.'"
                  rows={3}
                />
              </Field>

              <Field label="Who is walking in the door?" hint="your best customer, in your words">
                <TextArea
                  value={data.audience}
                  onChange={(v) => set("audience", v)}
                  placeholder="Homeowners, 35 to 60, found us on Google at 9pm with a problem they want handled tomorrow."
                  rows={3}
                />
              </Field>
            </div>
          )}

          {/* ── Step 2: Scope ── */}
          {step === 2 && (
            <div className="space-y-6">
              <Field label="What kind of project is this?">
                <Select
                  value={data.projectType}
                  onChange={(v) => set("projectType", v)}
                  placeholder="Pick one"
                  options={PROJECT_TYPES}
                />
              </Field>

              <Field label="Pages you think you need" hint="pick anything that sounds right">
                <ChipGroup
                  options={PAGES}
                  selected={data.pages}
                  onToggle={(v) => toggle("pages", v)}
                />
              </Field>

              <Field label="Things it has to do" hint="features, integrations, the functional stuff">
                <ChipGroup
                  options={FEATURES}
                  selected={data.features}
                  onToggle={(v) => toggle("features", v)}
                />
              </Field>
            </div>
          )}

          {/* ── Step 3: Vision ── */}
          {step === 3 && (
            <div className="space-y-6">
              <Field
                label="Three sites you love"
                hint="any industry, competitors welcome. This is the single most useful answer here."
              >
                <TextArea
                  value={data.references}
                  onChange={(v) => set("references", v)}
                  placeholder={"stripe.com\naesop.com\nthat one competitor: example.com"}
                  rows={4}
                />
              </Field>

              <Field label="What do you like about them?" hint="the feeling, the layout, the type, the photos, anything">
                <TextArea
                  value={data.likes}
                  onChange={(v) => set("likes", v)}
                  placeholder="They feel expensive without trying hard. Lots of space. You always know what to click next."
                  rows={3}
                />
              </Field>

              <Field label="How should yours feel?" hint="pick two or three, not eight">
                <ChipGroup options={VIBES} selected={data.vibe} onToggle={(v) => toggle("vibe", v)} />
              </Field>

              <Field label="Colors" hint="ones you own, ones you want, ones you can't stand">
                <TextInput
                  value={data.colors}
                  onChange={(v) => set("colors", v)}
                  placeholder="Our green #1F4D3A, cream, black. No blue, everyone here uses blue."
                />
              </Field>

              <Field label="What should we absolutely not do?" hint="the fastest way to a demo you like">
                <TextArea
                  value={data.avoid}
                  onChange={(v) => set("avoid", v)}
                  placeholder="No stock photos of people shaking hands. No sliders. Don't bury the phone number."
                  rows={3}
                />
              </Field>
            </div>
          )}

          {/* ── Step 4: Reality ── */}
          {step === 4 && (
            <div className="space-y-5">
              <Field label="Brand assets">
                <Select
                  value={data.brandAssets}
                  onChange={(v) => set("brandAssets", v)}
                  placeholder="Where's your brand at?"
                  options={BRAND_ASSETS}
                />
              </Field>

              <Field label="Photos and video">
                <Select
                  value={data.media}
                  onChange={(v) => set("media", v)}
                  placeholder="What imagery do you have?"
                  options={MEDIA}
                />
              </Field>

              <Field label="Copy and content">
                <Select
                  value={data.copyStatus}
                  onChange={(v) => set("copyStatus", v)}
                  placeholder="Who's writing the words?"
                  options={COPY_STATUS}
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

              <Field
                label="Budget range"
                hint="so we scope something real. Our website projects start at $2,500."
              >
                <Select
                  value={data.budget}
                  onChange={(v) => set("budget", v)}
                  placeholder="Pick a range"
                  options={BUDGETS}
                />
              </Field>
            </div>
          )}

          {/* ── Step 5: Contact ── */}
          {step === 5 && (
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="Phone" hint="optional">
                  <TextInput
                    value={data.phone}
                    onChange={(v) => set("phone", v)}
                    placeholder="(404) 555-0123"
                    type="tel"
                    autoComplete="tel"
                  />
                </Field>
                <Field label="Best way to reach you">
                  <Select
                    value={data.contactPref}
                    onChange={(v) => set("contactPref", v)}
                    placeholder="Pick one"
                    options={CONTACT_PREFS}
                  />
                </Field>
              </div>

              <Field label="Anything else we should know?" hint="context, constraints, the thing you almost didn't mention">
                <TextArea
                  value={data.notes}
                  onChange={(v) => set("notes", v)}
                  placeholder="We're rebranding in the spring, and whatever we build has to survive that."
                  rows={4}
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
                We use this to reply and scope your project. No lists you didn&apos;t ask for, no
                sharing it around.
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
        {!isLast ? (
          <motion.button
            type="button"
            onClick={goNext}
            whileTap={{ scale: 0.98 }}
            transition={spring}
            className="cta-shine text-center text-white font-semibold rounded-full transition-transform duration-300 hover:scale-[1.03] cursor-pointer"
            style={{ fontFamily: HEADING, padding: "13px 34px", fontSize: "13px", letterSpacing: "0.05em", background: GRADIENT, boxShadow: GRADIENT_SHADOW }}
          >
            Continue &rarr;
          </motion.button>
        ) : (
          <motion.button
            type="button"
            onClick={submit}
            disabled={status === "submitting"}
            whileTap={{ scale: 0.98 }}
            transition={spring}
            className="cta-shine text-center text-white font-semibold rounded-full transition-transform duration-300 hover:scale-[1.03] disabled:opacity-70 cursor-pointer"
            style={{ fontFamily: HEADING, padding: "13px 34px", fontSize: "13px", letterSpacing: "0.05em", background: GRADIENT, boxShadow: GRADIENT_SHADOW }}
          >
            {status === "submitting" ? "Sending…" : "Send the brief →"}
          </motion.button>
        )}
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
      {hint && (
        <p className="text-white/30 text-xs mb-2.5" style={{ fontFamily: BODY }}>
          {hint}
        </p>
      )}
      {!hint && <div className="mb-2.5" />}
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
