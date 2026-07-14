"use client";

/**
 * /internal/map/visual · the plain-English, heavily visual companion to /internal/map.
 * Same gate (Supabase session + profiles.role). Same brand palette.
 * This page is hand-authored narrative + a real folder tree; the canonical
 * source of truth for the SYSTEM remains ../map-data.ts. When the tree here
 * drifts from reality, fix it here — it is a teaching aid, not generated.
 */

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

const C = {
  cream: "#FFF4E3",
  paper: "#FFFDF8",
  espresso: "#3B2114",
  rust: "#90422C",
  orange: "#EA9A61",
  hair: "rgba(59,33,20,0.14)",
  faint: "rgba(59,33,20,0.60)",
  shadow: "0 1px 3px rgba(59,33,20,0.05), 0 8px 26px rgba(59,33,20,0.06)",
};

/** The five floors, top to bottom. Colour is reused everywhere: floors, tree, legend. */
const FLOORS = [
  { id: "routes", n: 1, plain: "The front door", tech: "Routes · app/", color: "#90422C",
    body: "Each web address is a door into a room. Type the address, land in the right room." },
  { id: "components", n: 2, plain: "The furniture", tech: "Shared UI · components/", color: "#B65B39",
    body: "The reusable pieces every room shares: the navigation bar, the footer, buttons, headers." },
  { id: "logic", n: 3, plain: "The rulebook", tech: "Logic · lib/, hooks/, data/", color: "#C87F4A",
    body: "The thinking: how a blog post is read, how credits are earned, what today's challenge is." },
  { id: "services", n: 4, plain: "The phone lines", tech: "Services · Supabase, Klaviyo", color: "#D99A5C",
    body: "Calls to outside help: the login system, the email list, the analytics that count visitors." },
  { id: "data", n: 5, plain: "The filing cabinet", tech: "Data · storage + content", color: "#E7B378",
    body: "Where everything is stored and remembered: accounts, projects, blog text, images, files." },
] as const;

type FloorId = (typeof FLOORS)[number]["id"];
const FLOOR_COLOR: Record<FloorId, string> = Object.fromEntries(FLOORS.map((f) => [f.id, f.color])) as Record<FloorId, string>;
const FLOOR_PLAIN: Record<FloorId, string> = Object.fromEntries(FLOORS.map((f) => [f.id, f.plain])) as Record<FloorId, string>;

/** Real folder tree of the repo, annotated in plain English, tinted by which floor it belongs to. */
type TreeNode = { name: string; floor?: FloorId; note?: string; open?: boolean; children?: TreeNode[] };

const TREE: TreeNode[] = [
  {
    name: "app/", floor: "routes", note: "Every folder here becomes a web address", open: true,
    children: [
      { name: "page.tsx  ·  layout.tsx", floor: "routes", note: "The homepage and the shell wrapped around every page" },
      { name: "about · web · sound · video-production · ai-automation", floor: "routes", note: "The marketing + four service pages" },
      { name: "blog/ · casestudy/ · resources/", floor: "routes", note: "Content routes: posts, client stories, playbooks" },
      {
        name: "ctrla/", floor: "routes", note: "The CTRL-A platform — biggest area, has its own toolbox", open: true,
        children: [
          { name: "_components/ · _lib/ · _volumes/", floor: "routes", note: "Private helpers only CTRL-A uses (the _ hides them from routing)" },
          { name: "brand-kit/ · cookbook/ · toolkit/ · daily/ · vol/", floor: "routes", note: "The builder, recipes, tools, daily challenge, magazine issues" },
          { name: "toolkit/[id]/history/", floor: "routes", note: "An immersive 'history lesson' per toolkit — a scrolling story with the topic's own artwork and playable toys (a drum machine, a live code box, a camera lens)" },
        ],
      },
      { name: "portal/ · admin/", floor: "routes", note: "Locked rooms — each checks your role before letting you in" },
      {
        name: "api/", floor: "routes", note: "Back-office endpoints the browser talks to, never seen directly", open: true,
        children: [
          { name: "chat · credits · daily · klaviyo · og · predictions", floor: "routes", note: "Each handles one job on the server side" },
        ],
      },
      { name: "internal/", floor: "routes", note: "This guide and the system map live here" },
    ],
  },
  {
    name: "components/", floor: "components", note: "Reusable pieces shared across pages", open: true,
    children: [
      { name: "sections/", floor: "components", note: "Big shared blocks: nav bar (used 21×), footer (14×), team, heroes" },
      { name: "ui/ · common/", floor: "components", note: "Small building blocks: buttons, inputs, shared composites" },
      { name: "effects/", floor: "components", note: "The eye-candy: animated text, gradient blobs, tilt cards" },
      { name: "schema/", floor: "components", note: "Invisible SEO tags that tell Google what a page is" },
      { name: "providers/", floor: "components", note: "Glue for outside tools: chat widget, analytics, Google login" },
      { name: "blog/ · casestudy/ · brand-kit/ · (service folders)", floor: "components", note: "Pieces specific to one page-family" },
    ],
  },
  {
    name: "lib/  ·  hooks/  ·  data/", floor: "logic", note: "The thinking and the typed facts", open: true,
    children: [
      { name: "lib/blog.ts", floor: "logic", note: "Reads blog text off disk. Its folder path is hardcoded — never move it" },
      { name: "lib/brand-kit/ · lib/credits/ · lib/daily/", floor: "logic", note: "The rules behind the builder, the points economy (rewards, costs, streak bonuses), and the daily game's date logic" },
      { name: "hooks/useCredits · hooks/useLeadSync", floor: "logic", note: "Live browser helpers: points balance + streak, and a one-time email sync to Klaviyo" },
      { name: "data/", floor: "logic", note: "Hand-typed facts: testimonials, FAQs, approach steps, map coastlines" },
    ],
  },
  {
    name: "utils/supabase/  ·  middleware.ts", floor: "services", note: "The phone lines to outside services", open: true,
    children: [
      { name: "client.ts", floor: "services", note: "The public key — safe for the browser. Used by 9 places" },
      { name: "server.ts", floor: "services", note: "The staff key — server-only, tied to your login cookie" },
      { name: "admin.ts", floor: "services", note: "The master key — ignores all locks. API routes only. Guard it" },
      { name: "middleware.ts", floor: "services", note: "Runs on every request to keep your session fresh. Locks nothing itself" },
    ],
  },
  {
    name: "content/  ·  public/  ·  supabase/", floor: "data", note: "Everything that is stored and remembered", open: true,
    children: [
      { name: "content/blog · content/dailies", floor: "data", note: "The actual writing — Markdown files read at run time" },
      { name: "public/", floor: "data", note: "197 MB of images, fonts, video, downloadable files" },
      { name: "supabase/sql", floor: "data", note: "The database blueprint and its locked functions: accounts + roles, client projects/audio, the points wallet + ledger, daily plays + streaks, predictions + stakes" },
    ],
  },
];

/** Plain-English retellings of the five canonical flows. */
const JOURNEYS = [
  { n: 1, title: "A blog post shows up on screen",
    path: ["Front door", "Rulebook", "Filing cabinet"],
    body: "The address asks for a post, the rulebook reads its text file from storage, and it comes back as a finished page." },
  { n: 2, title: "A visitor joins the CTRL-A email list",
    path: ["CTRL-A page", "Email phone line", "Klaviyo (outside)"],
    body: "They type their email, the site quietly phones the email service, and they're added to the list." },
  { n: 3, title: "Someone plays the daily challenge",
    path: ["CTRL-A page", "Rulebook", "Master key", "Filing cabinet"],
    body: "They take today's taste test; the site checks who they are, records the result with the master key, and updates their credits." },
  { n: 4, title: "A client logs into the portal",
    path: ["Portal door", "Login check", "Filing cabinet"],
    body: "The site confirms they're really them and allowed in. Anyone who doesn't belong is turned away at the door." },
  { n: 5, title: "A brand kit gets built",
    path: ["Builder page", "Builder furniture", "Rulebook"],
    body: "The step-by-step wizard gathers the brand, and the rulebook turns it into ready-to-download files." },
  { n: 6, title: "A reader opens a toolkit history",
    path: ["Toolkit page", "History page", "Its own art + toys"],
    body: "A strip on the toolkit page opens the history; it reads that toolkit's story data and draws the topic's own illustrations and interactive toys — a drum machine, a live code box, a camera lens." },
  { n: 7, title: "You earn points for an action",
    path: ["Points panel", "Login check", "Master key", "Filing cabinet"],
    body: "You tap 'I followed on Instagram.' The site confirms who you are, then a locked back-office function adds the points once and writes it to your ledger, so the same reward can never pay twice." },
  { n: 8, title: "Your daily streak grows",
    path: ["Daily test", "Master key", "Streak record"],
    body: "You pick A or B on today's taste test. The site records the play (only one counts per day), updates your streak — spending a one-day 'freeze' if you missed yesterday — and pays points plus a bonus at 3, 7, 14, and 30 days in a row." },
  { n: 9, title: "You stake points on a prediction",
    path: ["Signals card", "Master key", "Stakes record"],
    body: "You wager some points (10 to 200) on an outcome; the site spends them and records your stake. When the result is called later, winners are paid double." },
];

/** The deeper technical notes, told straight but still friendly. */
const TECH = [
  { tag: "Three keys, three levels of trust", title: "Why there are three Supabase clients",
    body: "The database has one front door but three different keys. The public key (client.ts) is safe to hand the browser — it can only do what a logged-in visitor is allowed. The staff key (server.ts) runs on the server and is tied to your login cookie. The master key (admin.ts) ignores every lock, so it never leaves the server and lives only inside API routes.",
    pills: ["client.ts = public", "server.ts = staff", "admin.ts = master"] },
  { tag: "Where the lock actually is", title: "The bouncer is at each door, not the hallway",
    body: "Middleware runs on every request, but it only refreshes your session — it locks nothing. The real check happens inside each protected page: it asks the database for your role and turns you away if you don't belong. Portal, admin, and this guide all do their own bouncing.",
    pills: ["middleware = refresh only", "page = real gate"] },
  { tag: "Built ahead vs made to order", title: "Most pages are pre-baked; a few are cooked live",
    body: "Marketing and service pages are built once, ahead of time, so they load instantly — like plated dishes ready on the pass. The blog is different: it reads its Markdown files the moment someone visits, so new posts appear without a rebuild. That's why the blog folder path can never move.",
    pills: ["marketing = pre-baked", "blog = made to order"] },
  { tag: "Talking to the outside world", title: "The site leans on a few outside services",
    body: "Supabase stores accounts and data. Klaviyo runs the email list and gets fed by the signup forms. Three analytics systems (Microsoft Clarity, Google Analytics, Klaviyo) quietly count what visitors do. Each is reached through a single, well-labeled phone line so it's easy to find and swap.",
    pills: ["Supabase", "Klaviyo", "Clarity", "Google Analytics"] },
  { tag: "The economy can't be cheated", title: "Points, streaks, and stakes only move on the server",
    body: "The browser can ask to earn or spend, but it can never change the numbers itself. Every points change runs through a locked database function that only the master key is allowed to call, so a visitor can't forge a balance, replay a reward, or fake a streak. Rewards carry a one-time key, and every spend is written as a negative line in a ledger — the balance is always explainable.",
    pills: ["award_credits", "spend_credits", "one-time key", "service-role only"] },
  { tag: "One wallet, sensible defaults", title: "Where the points actually live",
    body: "Everyone starts with 1000 points in a single wallet (the brand_kit_credits table — its balance column is literally called points). A separate ledger (credit_events) records every change with a reason. Streaks and daily plays live in their own records, and predictions keep their own stakes, so nothing steps on anything else.",
    pills: ["wallet: brand_kit_credits", "ledger: credit_events", "start = 1000"] },
  { tag: "Email capture, two ways", title: "How signups reach Klaviyo",
    body: "When someone submits an email, the site prefers a private server key to add them to the list and tag where they signed up; if that key isn't set, it quietly falls back to Klaviyo's public browser API. A hidden honeypot field silently drops bots, and signed-in visitors are synced once automatically.",
    pills: ["server key preferred", "public fallback", "honeypot", "one-time sync"] },
];

const TRAVEL = [
  { b: "Someone clicks a blog link.", s: "The address says “show me this post.”" },
  { b: "The front door opens the blog room.", s: "Floor 1 knows which post was asked for." },
  { b: "The rulebook fetches the writing.", s: "Floor 3 reads the post's text file." },
  { b: "The filing cabinet hands over the words.", s: "Floor 5 is where that text lives." },
  { b: "The furniture wraps it up.", s: "Nav bar, footer, and styling get added on the way out." },
  { b: "The finished page appears.", s: "The reader sees a complete blog post. Done." },
];

function TreeRow({ node, depth }: { node: TreeNode; depth: number }) {
  const [open, setOpen] = useState(node.open ?? false);
  const hasKids = !!node.children?.length;
  const color = node.floor ? FLOOR_COLOR[node.floor] : C.rust;
  return (
    <div>
      <div
        onClick={hasKids ? () => setOpen((o) => !o) : undefined}
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(200px, 360px) 1fr",
          gap: 16,
          alignItems: "baseline",
          padding: "7px 10px",
          paddingLeft: 10 + depth * 22,
          borderLeft: `3px solid ${color}`,
          background: depth === 0 ? "rgba(144,66,44,0.05)" : "transparent",
          borderRadius: 8,
          cursor: hasKids ? "pointer" : "default",
        }}
      >
        <span style={{ display: "flex", alignItems: "baseline", gap: 7, minWidth: 0 }}>
          <span style={{ color: color, fontSize: 11, width: 10, flex: "none", opacity: hasKids ? 1 : 0 }}>
            {hasKids ? (open ? "▾" : "▸") : ""}
          </span>
          <code
            style={{
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              fontSize: 13,
              fontWeight: depth === 0 ? 700 : 500,
              color: C.espresso,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {node.name}
          </code>
        </span>
        {node.note && (
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12.5, color: C.faint, lineHeight: 1.4 }}>{node.note}</span>
        )}
      </div>
      {hasKids && open && node.children!.map((c, i) => <TreeRow key={i} node={c} depth={depth + 1} />)}
    </div>
  );
}

export default function VisualGuidePage() {
  const router = useRouter();
  const [status, setStatus] = useState<"checking" | "ok">("checking");
  const [step, setStep] = useState(-1);
  const trackRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const checkAccess = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push("/"); return; }
      const { data: profile } = await supabase.from("profiles").select("role").eq("id", session.user.id).single();
      if (profile?.role !== "admin" && profile?.role !== "engineer") { router.push("/"); return; }
      setStatus("ok");
    };
    checkAccess();
  }, [router]);

  // Drive the travel animation once it scrolls into view; loop gently.
  useEffect(() => {
    if (status !== "ok") return;
    const el = trackRef.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let interval: ReturnType<typeof setInterval> | null = null;
    const run = () => {
      if (reduce) { setStep(TRAVEL.length - 1); return; }
      setStep(0);
      let i = 0;
      interval = setInterval(() => {
        i += 1;
        if (i >= TRAVEL.length) { i = 0; }
        setStep(i);
      }, 1400);
    };
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting && step === -1) run(); });
    }, { threshold: 0.35 });
    io.observe(el);
    return () => { io.disconnect(); if (interval) clearInterval(interval); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  if (status === "checking") {
    return (
      <main style={{ minHeight: "100vh", background: C.cream, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: C.faint, letterSpacing: "0.08em", textTransform: "uppercase" }}>
          Checking access...
        </p>
      </main>
    );
  }

  const eyebrow: React.CSSProperties = { margin: "0 0 12px", fontFamily: "'Neue Montreal', Inter, sans-serif", fontSize: 11, letterSpacing: "0.24em", textTransform: "uppercase", color: C.rust, fontWeight: 600 };
  const h2: React.CSSProperties = { margin: "0 0 6px", fontFamily: "Norwige, sans-serif", fontWeight: 700, fontSize: "clamp(24px,3.6vw,34px)", lineHeight: 1.12, color: C.espresso };
  const note: React.CSSProperties = { margin: "0 0 24px", fontFamily: "Inter, sans-serif", fontSize: 15, color: C.faint, maxWidth: "58ch", lineHeight: 1.6 };
  const card: React.CSSProperties = { background: "#FFFFFF", border: `1px solid ${C.hair}`, borderRadius: 16, boxShadow: C.shadow };

  return (
    <main style={{ minHeight: "100vh", background: C.cream, color: C.espresso, padding: "clamp(28px,5vw,64px) clamp(18px,5vw,48px) 100px" }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>

        {/* Header */}
        <header style={{ marginBottom: 8 }}>
          <p style={eyebrow}>Internal · the same map, explained simply</p>
          <h1 style={{ margin: 0, fontFamily: "Norwige, sans-serif", fontWeight: 700, fontSize: "clamp(34px,6vw,58px)", lineHeight: 1.04 }}>
            How the website works, without the jargon
          </h1>
          <p style={{ margin: "18px 0 0", fontFamily: "Inter, sans-serif", fontSize: "clamp(16px,2.2vw,20px)", color: C.faint, maxWidth: "60ch", lineHeight: 1.6 }}>
            The <Link href="/internal/map" style={{ color: C.rust, textDecoration: "underline" }}>system map</Link> lists every moving part. This page steps back and answers one question:{" "}
            <b style={{ color: C.espresso, fontWeight: 600 }}>when someone opens rovstudios.com, what actually happens?</b> Think of the whole thing as a restaurant.
          </p>
        </header>

        {/* Restaurant analogy */}
        <section style={{ marginTop: "clamp(48px,7vw,80px)" }}>
          <h2 style={h2}>First, the big picture: it&apos;s a restaurant</h2>
          <p style={note}>A visitor is a customer. They place an order (open a page), and it passes through the kitchen, station by station, until a finished plate comes back.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px,1fr))", gap: 14 }}>
            {[
              { t: "The customer", d: "Anyone who opens a page in their browser. They just want a finished result.", m: "" },
              { t: "The order slip", d: "The web address they typed. It tells the kitchen exactly which dish to make.", m: "Floor 1 · Routes" },
              { t: "The kitchen", d: "Five stations working in order, each doing one job before passing it along.", m: "Floors 2–4" },
              { t: "The pantry", d: "Where all the ingredients are kept: text, images, and saved records.", m: "Floor 5 · Data" },
            ].map((a) => (
              <div key={a.t} style={{ ...card, padding: "20px 18px", display: "flex", flexDirection: "column", gap: 6 }}>
                <h3 style={{ margin: 0, fontFamily: "Norwige, sans-serif", fontWeight: 700, fontSize: 16, color: C.espresso }}>{a.t}</h3>
                <p style={{ margin: 0, fontFamily: "Inter, sans-serif", fontSize: 13.5, color: C.faint, lineHeight: 1.5 }}>{a.d}</p>
                {a.m && <span style={{ fontFamily: "'Neue Montreal', Inter, sans-serif", fontSize: 11.5, color: C.rust, fontWeight: 600, marginTop: 2 }}>→ {a.m}</span>}
              </div>
            ))}
          </div>
        </section>

        {/* Five floors */}
        <section style={{ marginTop: "clamp(56px,8vw,92px)" }}>
          <h2 style={h2}>The five floors, top to bottom</h2>
          <p style={note}>Every request starts at the top and works its way down, only as far as it needs to go. The plain-English name is what it does; the small tag is what an engineer calls it.</p>
          <div style={{ borderRadius: 20, overflow: "hidden", border: `1px solid ${C.hair}`, boxShadow: C.shadow }}>
            {FLOORS.map((f, i) => {
              const dark = f.id !== "data";
              return (
                <div key={f.id} style={{ display: "grid", gridTemplateColumns: "54px 1fr auto", gap: 16, alignItems: "center", padding: "22px clamp(16px,3vw,26px)", background: f.color, color: dark ? "#FFF7EC" : C.espresso, borderTop: i === 0 ? "none" : "2px solid rgba(255,247,236,0.22)" }}>
                  <div style={{ fontFamily: "Norwige, sans-serif", fontSize: 30, fontWeight: 700, opacity: 0.6, textAlign: "center" }}>{f.n}</div>
                  <div>
                    <h3 style={{ margin: "0 0 3px", fontFamily: "Norwige, sans-serif", fontWeight: 700, fontSize: "clamp(18px,2.4vw,22px)" }}>{f.plain}</h3>
                    <p style={{ margin: 0, fontFamily: "Inter, sans-serif", fontSize: 14, opacity: 0.94, lineHeight: 1.45, maxWidth: "52ch" }}>{f.body}</p>
                  </div>
                  <div style={{ justifySelf: "end", fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 11.5, background: dark ? "rgba(0,0,0,0.20)" : "rgba(59,33,20,0.14)", padding: "5px 11px", borderRadius: 999, whiteSpace: "nowrap" }} className="floor-tag">{f.tech}</div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Watch it travel */}
        <section style={{ marginTop: "clamp(56px,8vw,92px)" }}>
          <h2 style={h2}>Watch one order travel</h2>
          <p style={note}>Someone opens a blog post. Follow the glowing step down the floors — that&apos;s the whole trip, start to finish.</p>
          <div style={{ ...card, padding: "clamp(18px,3vw,28px)" }}>
            <div ref={trackRef} style={{ display: "grid", gap: 10 }}>
              {TRAVEL.map((t, i) => {
                const on = i === step;
                return (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "30px 1fr", alignItems: "center", gap: 14, padding: "12px 14px", borderRadius: 12, border: `1px solid ${on ? C.orange : C.hair}`, background: C.paper, boxShadow: on ? "0 0 0 3px rgba(234,154,97,0.25)" : "none", transform: on ? "translateX(4px)" : "none", transition: "all 0.3s ease" }}>
                    <div style={{ width: 18, height: 18, borderRadius: "50%", justifySelf: "center", background: on ? C.orange : C.hair, transform: on ? "scale(1.25)" : "none", transition: "all 0.3s ease" }} />
                    <div style={{ fontFamily: "Inter, sans-serif", fontSize: 15 }}>
                      <b style={{ fontWeight: 650, color: C.espresso }}>{t.b}</b> <span style={{ color: C.faint, fontSize: 13.5 }}>{t.s}</span>
                    </div>
                  </div>
                );
              })}
            </div>
            <button
              onClick={() => setStep(0)}
              style={{ marginTop: 18, font: "inherit", fontSize: 14, fontWeight: 600, color: C.rust, background: "rgba(144,66,44,0.08)", border: `1px solid ${C.hair}`, borderRadius: 999, padding: "9px 20px", cursor: "pointer" }}
            >
              ▶ Play from the top
            </button>
          </div>
        </section>

        {/* Folder architecture map */}
        <section style={{ marginTop: "clamp(56px,8vw,92px)" }}>
          <h2 style={h2}>The actual folder map</h2>
          <p style={note}>
            This is the real shape of the codebase, tinted by floor. The colour of each line tells you which of the five floors it belongs to. Click any folder with a{" "}
            <span style={{ color: C.rust }}>▸</span> to open it.
          </p>

          {/* Legend */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 18 }}>
            {FLOORS.map((f) => (
              <span key={f.id} style={{ display: "inline-flex", alignItems: "center", gap: 7, fontFamily: "Inter, sans-serif", fontSize: 12.5, color: C.faint }}>
                <span style={{ width: 12, height: 12, borderRadius: 3, background: f.color, display: "inline-block" }} />
                {f.plain}
              </span>
            ))}
          </div>

          <div style={{ ...card, padding: "14px 12px", overflowX: "auto" }}>
            <div style={{ minWidth: 520, display: "grid", gap: 3 }}>
              {TREE.map((n, i) => <TreeRow key={i} node={n} depth={0} />)}
            </div>
          </div>
        </section>

        {/* Technicalities */}
        <section style={{ marginTop: "clamp(56px,8vw,92px)" }}>
          <h2 style={h2}>Now the real technicalities</h2>
          <p style={note}>Four things that trip people up, explained straight. Still plain, but this is what&apos;s actually going on.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px,1fr))", gap: 14 }}>
            {TECH.map((t) => (
              <div key={t.title} style={{ ...card, padding: "22px 22px" }}>
                <p style={{ margin: "0 0 8px", fontFamily: "'Neue Montreal', Inter, sans-serif", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: C.orange, fontWeight: 600 }}>{t.tag}</p>
                <h3 style={{ margin: "0 0 10px", fontFamily: "Norwige, sans-serif", fontWeight: 700, fontSize: 18, color: C.espresso }}>{t.title}</h3>
                <p style={{ margin: "0 0 14px", fontFamily: "Inter, sans-serif", fontSize: 14, color: C.faint, lineHeight: 1.6 }}>{t.body}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {t.pills.map((p) => (
                    <span key={p} style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 11.5, color: C.rust, background: "rgba(144,66,44,0.08)", border: `1px solid ${C.hair}`, borderRadius: 6, padding: "4px 9px" }}>{p}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Journeys */}
        <section style={{ marginTop: "clamp(56px,8vw,92px)" }}>
          <h2 style={h2}>Five everyday trips through the building</h2>
          <p style={note}>These are the real journeys that happen all day. Each one only visits the floors it needs.</p>
          <div style={{ display: "grid", gap: 12 }}>
            {JOURNEYS.map((j) => (
              <div key={j.n} style={{ ...card, padding: "20px 22px" }}>
                <h3 style={{ margin: "0 0 12px", display: "flex", alignItems: "center", gap: 10, fontFamily: "Norwige, sans-serif", fontWeight: 700, fontSize: 18, color: C.espresso }}>
                  <span style={{ width: 26, height: 26, flex: "none", borderRadius: 8, background: C.rust, color: "#FFF7EC", fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 700, display: "grid", placeItems: "center" }}>{j.n}</span>
                  {j.title}
                </h3>
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 6, marginBottom: 12 }}>
                  {j.path.map((p, k) => (
                    <span key={k} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12.5, padding: "5px 12px", borderRadius: 999, background: "rgba(234,154,97,0.18)", border: "1px solid rgba(234,154,97,0.45)", color: C.espresso, whiteSpace: "nowrap" }}>{p}</span>
                      {k < j.path.length - 1 && <span style={{ color: C.rust, fontSize: 13 }}>→</span>}
                    </span>
                  ))}
                </div>
                <p style={{ margin: 0, fontFamily: "Inter, sans-serif", fontSize: 14, color: C.faint, lineHeight: 1.55 }}>{j.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer style={{ marginTop: "clamp(56px,8vw,88px)", paddingTop: 22, borderTop: `1px solid ${C.hair}` }}>
          <p style={{ margin: 0, fontFamily: "Inter, sans-serif", fontSize: 13.5, color: C.faint, lineHeight: 1.6 }}>
            This is the friendly companion to <Link href="/internal/map" style={{ color: C.rust, textDecoration: "underline" }}>the system map</Link> — same building, fewer words. When the real system changes, update{" "}
            <code style={{ color: C.rust }}>map-data.ts</code> first; then keep this picture honest.
          </p>
        </footer>
      </div>

      <style>{`
        @media (max-width: 620px) {
          .floor-tag { display: none; }
        }
      `}</style>
    </main>
  );
}
