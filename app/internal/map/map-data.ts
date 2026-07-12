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

export const LAST_UPDATED = "2026-07-12";

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
  { id: "ctrla", label: "CTRL-A magazine", path: "app/ctrla", layer: "routes", note: "The creative platform: volumes, toolkit, cookbook, brand-kit builder, daily, credits. UI lives in its own _components/.", connectsTo: ["brandkit-lib", "credits-lib", "daily-lib", "use-credits", "klaviyo-api", "supabase-client"] },
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

  // ── Logic ──
  { id: "blog-lib", label: "Blog engine", path: "lib/blog.ts", layer: "logic", note: "Reads content/blog markdown at runtime. Path is hardcoded: never move that folder.", connectsTo: ["content-blog"] },
  { id: "brandkit-lib", label: "Brand-kit engine", path: "lib/brand-kit", layer: "logic", note: "Store, share, and the generator (css/html/js) behind the builder.", connectsTo: [] },
  { id: "credits-lib", label: "Credits economy", path: "lib/credits · hooks/useCredits", layer: "logic", note: "Config for earn/spend rules; the hook talks to /api/credits.", connectsTo: ["api"] },
  { id: "daily-lib", label: "Daily taste test", path: "lib/daily", layer: "logic", note: "Date logic and preview for the daily challenge.", connectsTo: [] },
  { id: "use-credits", label: "useCredits + useLeadSync", path: "hooks/", layer: "logic", note: "Client hooks: credits state, and one-time Klaviyo sync for authed users.", connectsTo: ["supabase-client", "klaviyo-api"] },
  { id: "static-data", label: "Typed site data", path: "data/", layer: "logic", note: "Testimonials, FAQs, approach steps, globe coastlines. Imported directly.", connectsTo: [] },

  // ── Services ──
  { id: "supabase-client", label: "Supabase · browser", path: "utils/supabase/client.ts", layer: "services", note: "createBrowserClient. 9 importers: auth modals, hooks, admin/portal pages.", connectsTo: ["supabase-db"] },
  { id: "supabase-server", label: "Supabase · server", path: "utils/supabase/server.ts", layer: "services", note: "Cookie-bound server client for API routes.", connectsTo: ["supabase-db"] },
  { id: "supabase-admin", label: "Supabase · service role", path: "utils/supabase/admin.ts", layer: "services", note: "Bypasses RLS. Only in API routes. Needs SUPABASE_SERVICE_ROLE_KEY.", connectsTo: ["supabase-db"] },
  { id: "middleware", label: "Session middleware", path: "middleware.ts", layer: "services", note: "Refreshes the Supabase session on every request. Protects NOTHING: gates are page-level.", connectsTo: ["supabase-db"] },
  { id: "klaviyo-api", label: "Klaviyo endpoint", path: "app/api/klaviyo/subscribe", layer: "services", note: "Server-side subscribe (private key) with client-API fallback. Fed by CtrlASignup, ToolGate, useLeadSync.", connectsTo: ["klaviyo-ext"] },
  { id: "analytics", label: "Analytics stack", path: "app/layout.tsx", layer: "services", note: "Three systems: Microsoft Clarity, Google Analytics, Klaviyo onsite tracking.", connectsTo: [] },
  { id: "klaviyo-ext", label: "Klaviyo (external)", path: "a.klaviyo.com", layer: "services", note: "Email list + events. Env: KLAVIYO_PRIVATE_KEY, KLAVIYO_LIST_ID, NEXT_PUBLIC_KLAVIYO_COMPANY_ID.", connectsTo: [] },

  // ── Data ──
  { id: "supabase-db", label: "Supabase database", path: "supabase/sql (schema source of truth)", layer: "data", note: "profiles, projects, audio_tracks, daily_challenges, credits, predictions, points. SQL setup files run manually.", connectsTo: [] },
  { id: "content-blog", label: "Blog markdown", path: "content/blog", layer: "data", note: "Read at runtime by lib/blog.ts.", connectsTo: [] },
  { id: "content-dailies", label: "Daily batches", path: "content/dailies", layer: "data", note: "Authored .mjs batches; scripts/seed-dailies.mjs upserts them into Supabase.", connectsTo: ["supabase-db"] },
  { id: "public-assets", label: "Static assets", path: "public/ (197 MB, 19 topic folders)", layer: "data", note: "Images, fonts, video, downloadable vault files. Referenced as string paths, not imports.", connectsTo: [] },
];

/** End-to-end stories. Every step is a node id above. */
export const FLOWS: { title: string; steps: string[]; summary: string }[] = [
  { title: "A blog post renders", steps: ["blog", "blog-lib", "content-blog"], summary: "Request hits app/blog/[slug], lib/blog.ts reads the markdown, remark renders it, schema components emit JSON-LD." },
  { title: "A visitor joins the CTRL-A list", steps: ["ctrla", "klaviyo-api", "klaviyo-ext"], summary: "CtrlASignup or a ToolGate posts the email to /api/klaviyo/subscribe, which pushes to the Klaviyo list server-side." },
  { title: "Someone plays the daily", steps: ["ctrla", "use-credits", "api", "supabase-admin", "supabase-db"], summary: "DailyTasteTest calls /api/daily/play; the route validates with the server client, writes with the service-role client, credits update." },
  { title: "A client logs into the portal", steps: ["portal-admin", "middleware", "supabase-client", "supabase-db"], summary: "Middleware refreshes the session cookie; the page itself checks profiles.role and redirects anyone who does not belong." },
  { title: "A brand kit gets built", steps: ["ctrla", "brandkit-ui", "brandkit-lib"], summary: "The builder wizard collects the brand, lib/brand-kit generates css/html/js exports, points sync via Supabase." },
];
