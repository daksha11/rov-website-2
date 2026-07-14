/**
 * SYSTEM MAP DATA · the single source for /internal/map
 *
 * HOW TO KEEP THIS CURRENT
 * When you add a route, module, integration, or data source, add (or edit) one
 * node here and bump LAST_UPDATED. The page renders whatever this file says:
 * you never touch the page component for content changes.
 *
 * - `layer` places the node in one of the five bands (top to bottom):
 *   routes → components → logic → services → data
 * - `connectsTo` is a list of node ids this node calls, imports, or reads.
 *   The page renders them as flow chips on the card.
 * - `flows` at the bottom are the end-to-end stories worth telling a new
 *   engineer. Keep them honest: every step must name a real node id.
 */

export const LAST_UPDATED = "2026-07-13";

export type LayerId = "routes" | "components" | "logic" | "services" | "data";

export interface MapNode {
  id: string;
  label: string;
  path: string;
  layer: LayerId;
  note: string;
  connectsTo?: string[];
}

export const LAYERS: { id: LayerId; title: string; blurb: string }[] = [
  { id: "routes", title: "Routes · app/", blurb: "Folder = URL. Pages and API endpoints." },
  { id: "components", title: "Shared UI · components/", blurb: "Used by two or more route trees." },
  { id: "logic", title: "Logic · lib/, hooks/, data/", blurb: "Domain rules, helpers, typed data." },
  { id: "services", title: "Services · infrastructure + external", blurb: "Supabase clients, third-party APIs, analytics." },
  { id: "data", title: "Data · content + storage", blurb: "What the code reads and writes." },
];

export const NODES: MapNode[] = [
  // ── Routes ──
  { id: "marketing", label: "Marketing site", path: "app/{page,about,works,web,sound,video-production,ai-automation}", layer: "routes", note: "Home plus the four service pages. Static, SEO-heavy.", connectsTo: ["sections", "schema", "effects", "feature-ui", "static-data"] },
  { id: "blog", label: "Blog", path: "app/blog", layer: "routes", note: "Markdown-driven [slug] route plus custom-designed posts.", connectsTo: ["blog-lib", "blog-ui", "schema"] },
  { id: "casestudy", label: "Case studies", path: "app/casestudy", layer: "routes", note: "One folder per client story.", connectsTo: ["casestudy-ui", "schema"] },
  { id: "resources", label: "Resources", path: "app/resources", layer: "routes", note: "Playbooks and toolkits. Content colocated in _content/.", connectsTo: ["sections", "schema"] },
  { id: "ctrla", label: "CTRL-A magazine", path: "app/ctrla", layer: "routes", note: "The creative platform: volumes, toolkit, cookbook, brand-kit builder, daily game, points. UI lives in its own _components/. Toolkit data (toolkitSections) is in app/ctrla/data.ts.", connectsTo: ["brandkit-lib", "credits-lib", "daily-lib", "use-credits", "klaviyo-api", "supabase-client", "toolkit-history", "ctrla-economy-ui"] },
  { id: "toolkit-history", label: "Toolkit histories", path: "app/ctrla/toolkit/[id]/history", layer: "routes", note: "Immersive scroll 'history lesson' per toolkit (music, web-dev, design, video). Copy in _content/*.ts, driven by ToolkitHistory data on toolkitSections (app/ctrla/data.ts). Per-topic SVG motifs, a bespoke animated hero, and interactive playables live in {Dev,Design,Video}Graphics.tsx + HistoryMotifs.tsx, routed by shared Motif/Interactive/Hero dispatchers. Playables use the Web Audio API (808 sequencer, Moog, Auto-Tune, vinyl) and a sandboxed iframe (live code editor). Reached from each toolkit page's entry strip.", connectsTo: ["ctrla"] },
  { id: "portal-admin", label: "Portal + Admin", path: "app/portal · app/admin", layer: "routes", note: "Client portal and the command center. Gated by page-level Supabase role checks (middleware only refreshes the session).", connectsTo: ["supabase-client", "supabase-db"] },
  { id: "api", label: "API routes", path: "app/api/{chat,credits,daily,klaviyo,og,predictions}", layer: "routes", note: "All server endpoints. credits/daily/predictions use the service-role client.", connectsTo: ["supabase-server", "supabase-admin", "klaviyo-ext", "credits-lib", "daily-lib"] },

  // ── Shared UI ──
  { id: "sections", label: "sections/", path: "components/sections", layer: "components", note: "Cross-page site sections: NavDoc (21 importers), Footer (14), team, heroes.", connectsTo: ["effects", "static-data"] },
  { id: "schema", label: "schema/", path: "components/schema", layer: "components", note: "JSON-LD emitters for SEO/GEO: Organization, Breadcrumb, FAQ, Service, Video...", connectsTo: [] },
  { id: "effects", label: "effects/", path: "components/effects", layer: "components", note: "Visual layer: DecryptedText, SplitText, GradientBlob, TiltedCard...", connectsTo: [] },
  { id: "providers", label: "providers/", path: "components/providers", layer: "components", note: "Third-party glue mounted in layout: Clarity, ChatWidget, Google login.", connectsTo: ["analytics", "supabase-client"] },
  { id: "feature-ui", label: "Feature folders", path: "components/{web,sound,video-production,ai-automation,common,ui}", layer: "components", note: "Page-family components plus primitives (ui/) and shared composites (common/).", connectsTo: ["static-data"] },
  { id: "blog-ui", label: "blog/", path: "components/blog", layer: "components", note: "Post body, FAQ, cards, BlogPostingSchema.", connectsTo: [] },
  { id: "casestudy-ui", label: "casestudy/", path: "components/casestudy", layer: "components", note: "Hero, sidebar, results, testimonial blocks.", connectsTo: [] },
  { id: "brandkit-ui", label: "brand-kit/", path: "components/brand-kit", layer: "components", note: "The builder wizard: steps, export buttons, auth modal.", connectsTo: ["brandkit-lib", "supabase-client"] },
  { id: "ctrla-economy-ui", label: "Game + capture UI", path: "app/ctrla/_components/{DailyTasteTest,CreditsPanel,ToolGate,CtrlASignup}", layer: "components", note: "The player-facing surfaces: the daily taste test, the points/streak panel, the soft lead gate, and the email signup. They show live balance/streak over Supabase realtime and post plays, earns, and stakes to the API.", connectsTo: ["use-credits", "daily-lib", "credits-lib", "klaviyo-api", "supabase-client", "api"] },

  // ── Logic ──
  { id: "blog-lib", label: "Blog engine", path: "lib/blog.ts", layer: "logic", note: "Reads content/blog markdown at runtime. Path is hardcoded: never move that folder.", connectsTo: ["content-blog"] },
  { id: "brandkit-lib", label: "Brand-kit engine", path: "lib/brand-kit", layer: "logic", note: "Store, share, and the generator (css/html/js) behind the builder.", connectsTo: [] },
  { id: "credits-lib", label: "Points economy config", path: "lib/credits/config.ts", layer: "logic", note: "One tuning file. REWARDS (follow-instagram 100 once, referral 250), COSTS (brand-kit-export 50, premium-download 75, premium-course 100), DAILY (base 10 + spike up to 25 + streak bonuses at 3/7/14/30 days), PREDICTION_STAKE (10-200). The wallet itself is brand_kit_credits.points and everyone starts at 1000.", connectsTo: ["api"] },
  { id: "daily-lib", label: "Daily / game logic", path: "lib/daily/{date,preview}.ts", layer: "logic", note: "todayET() pins the challenge day to America/New_York (the server's source of truth); preview.ts serves a dev-only sample when there is no service key. The actual streak and points maths live in the SQL RPCs, not here.", connectsTo: ["content-dailies"] },
  { id: "use-credits", label: "useCredits + useLeadSync", path: "hooks/useCredits.ts · hooks/useLeadSync.ts", layer: "logic", note: "useCredits keeps the live balance (realtime on brand_kit_credits), stashes a ?ref= code in localStorage, and posts earn/refer to /api/credits. useLeadSync pushes an authed user's email to Klaviyo once. Spending is always server-side, never in the browser.", connectsTo: ["supabase-client", "klaviyo-api", "api"] },
  { id: "static-data", label: "Typed site data", path: "data/", layer: "logic", note: "Testimonials, FAQs, approach steps, globe coastlines. Imported directly.", connectsTo: [] },

  // ── Services ──
  { id: "supabase-client", label: "Supabase · browser", path: "utils/supabase/client.ts", layer: "services", note: "createBrowserClient. 9 importers: auth modals, hooks, admin/portal pages.", connectsTo: ["supabase-db"] },
  { id: "supabase-server", label: "Supabase · server", path: "utils/supabase/server.ts", layer: "services", note: "Cookie-bound server client for API routes.", connectsTo: ["supabase-db"] },
  { id: "supabase-admin", label: "Supabase · service role", path: "utils/supabase/admin.ts", layer: "services", note: "Bypasses RLS. API routes only, never a client component. Needs SUPABASE_SERVICE_ROLE_KEY (returns null if absent). Used by credits/earn, credits/refer, daily, daily/play, predictions/stake to run the economy RPCs, and by the admin dashboard's writes. This is the only writer of points, streaks, and stakes.", connectsTo: ["economy-rpcs", "supabase-db"] },
  { id: "economy-rpcs", label: "Economy RPCs (locked)", path: "supabase/sql/*.sql (SECURITY DEFINER)", layer: "services", note: "The only way economy state changes: award_credits, spend_credits, play_daily(_anon), stake_prediction, resolve_prediction, buy_entitlement (+ legacy deduct_brand_kit_points). REVOKEd from public, granted only to service_role, so the browser can never forge points, streaks, or payouts. Earn/play/stake dedupe by key.", connectsTo: ["db-economy", "db-game", "db-predictions", "supabase-db"] },
  { id: "middleware", label: "Session middleware", path: "middleware.ts", layer: "services", note: "Refreshes the Supabase session on every request. Protects NOTHING: gates are page-level.", connectsTo: ["supabase-db"] },
  { id: "klaviyo-api", label: "Klaviyo endpoint", path: "app/api/klaviyo/subscribe", layer: "services", note: "POST only. With KLAVIYO_PRIVATE_KEY it upserts the profile then subscribes to KLAVIYO_LIST_ID server-side; with no key it falls back to the public client API (NEXT_PUBLIC_KLAVIYO_COMPANY_ID); 503 if neither is set. Honeypot field drops bots, 10s timeout, profile-upsert failures are non-fatal. Fed by CtrlASignup, ToolGate, useLeadSync; also fires onsite events 'CTRL-A Signup' / 'Tool Unlocked'.", connectsTo: ["klaviyo-ext"] },
  { id: "analytics", label: "Analytics stack", path: "app/layout.tsx", layer: "services", note: "Three systems: Microsoft Clarity, Google Analytics, Klaviyo onsite tracking.", connectsTo: [] },
  { id: "klaviyo-ext", label: "Klaviyo (external)", path: "a.klaviyo.com", layer: "services", note: "Email list + events. Env: KLAVIYO_PRIVATE_KEY, KLAVIYO_LIST_ID, NEXT_PUBLIC_KLAVIYO_COMPANY_ID.", connectsTo: [] },

  // ── Data ──
  { id: "supabase-db", label: "Supabase · identity + studio", path: "supabase/sql (schema)", layer: "data", note: "profiles (role: client / engineer / admin, plus referral_code and referred_by) and the client-work tables: projects, audio_tracks, mixed_audio_tracks, mixed_track_revisions. RLS is gated by is_staff() / is_admin(). The economy and game tables are broken out below.", connectsTo: [] },
  { id: "db-economy", label: "Points wallet + ledger", path: "brand_kit_credits · credit_events", layer: "data", note: "brand_kit_credits is the single wallet (user_id PK, points DEFAULT 1000, live over realtime). credit_events is the append-only ledger with a UNIQUE dedupe_key, so one-time rewards never double-pay and every spend is a 'spend:<reason>' line. New profiles auto-seed 1000 via a trigger.", connectsTo: [] },
  { id: "db-game", label: "Daily game + streaks", path: "daily_challenges · daily_plays · user_streaks", layer: "data", note: "daily_challenges: one row per ET day, fully RLS-locked (service-role only), reveal withheld until you vote. daily_plays: UNIQUE(user, challenge) enforces one play per day. user_streaks: current/longest streak, last_played, and a one-day freeze that regenerates weekly. All written by play_daily.", connectsTo: [] },
  { id: "db-predictions", label: "Predictions + entitlements", path: "predictions · prediction_stakes · entitlements", layer: "data", note: "predictions (public read), prediction_stakes (one per user, 10-200 points), entitlements (access grants tagged credits / stripe / comp). stake_prediction spends to stake, resolve_prediction pays winners 2x, buy_entitlement spends for premium-download / premium-course.", connectsTo: [] },
  { id: "content-blog", label: "Blog markdown", path: "content/blog", layer: "data", note: "Read at runtime by lib/blog.ts.", connectsTo: [] },
  { id: "content-dailies", label: "Daily batches", path: "content/dailies", layer: "data", note: "Authored .mjs batches; scripts/seed-dailies.mjs upserts them into Supabase.", connectsTo: ["supabase-db"] },
  { id: "public-assets", label: "Static assets", path: "public/ (197 MB, 19 topic folders)", layer: "data", note: "Images, fonts, video, downloadable vault files. Referenced as string paths, not imports.", connectsTo: [] },
];

/** End-to-end stories. Every step is a node id above. */
export const FLOWS: { title: string; steps: string[]; summary: string }[] = [
  { title: "A blog post renders", steps: ["blog", "blog-lib", "content-blog"], summary: "Request hits app/blog/[slug], lib/blog.ts reads the markdown, remark renders it, schema components emit JSON-LD." },
  { title: "A visitor joins the CTRL-A list", steps: ["ctrla-economy-ui", "klaviyo-api", "klaviyo-ext"], summary: "A CtrlASignup form (or a ToolGate) posts the email to /api/klaviyo/subscribe; with a private key it upserts the profile and subscribes to the list server-side, otherwise it uses the public client API. useLeadSync does the same once for signed-in users." },
  { title: "Points get earned", steps: ["ctrla-economy-ui", "use-credits", "api", "supabase-admin", "economy-rpcs", "db-economy"], summary: "CreditsPanel calls useCredits.earn('follow-instagram'); /api/credits/earn identifies the user with the server client, then award_credits (service role) pays once, deduped by key. brand_kit_credits.points rises and credit_events logs it." },
  { title: "A referral pays out", steps: ["ctrla", "use-credits", "api", "supabase-admin", "economy-rpcs", "db-economy"], summary: "A ?ref= code is stashed in localStorage before sign-in; afterwards useCredits posts /api/credits/refer, which sets referred_by once (no self-referral) and awards the referrer 250 points." },
  { title: "The daily streak advances", steps: ["ctrla-economy-ui", "api", "supabase-server", "supabase-admin", "economy-rpcs", "db-game", "db-economy"], summary: "DailyTasteTest posts /api/daily/play; the server client identifies the user, then play_daily inserts a once-per-day daily_plays row, bumps the vote counts, updates user_streaks (using the weekly freeze if a day was missed), and awards base + a random spike + any streak-milestone bonus." },
  { title: "A prediction is staked", steps: ["ctrla-economy-ui", "api", "supabase-admin", "economy-rpcs", "db-predictions", "db-economy"], summary: "/api/predictions/stake runs stake_prediction: it checks the call is still open, spends the stake (10-200) via spend_credits, and records prediction_stakes. When a volume resolves, resolve_prediction pays winners 2x." },
  { title: "A client logs into the portal", steps: ["portal-admin", "middleware", "supabase-client", "supabase-db"], summary: "Middleware refreshes the session cookie; the page itself checks profiles.role and redirects anyone who does not belong." },
  { title: "A brand kit gets built", steps: ["ctrla", "brandkit-ui", "brandkit-lib"], summary: "The builder wizard collects the brand, lib/brand-kit generates css/html/js exports, and an export spends points server-side." },
  { title: "A toolkit history plays", steps: ["ctrla", "toolkit-history"], summary: "A toolkit page's entry strip links to /ctrla/toolkit/[id]/history; ToolkitHistoryContent renders the moments from toolkitSections[].history, and the per-topic dispatchers draw the SVG motifs, the bespoke hero, and mount the interactive playables (Web Audio + a sandboxed iframe)." },
];
