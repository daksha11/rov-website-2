// app/api/web/site-check/route.ts
// ─────────────────────────────────────────────────────────────
// Reads a visitor's website and reports back what we found. Powers screen 1
// of /web/brief: they paste a link, we confirm we found them, then show two
// to four concrete things about the site. Every finding carries a "why this
// matters" line, because the point is not to score them, it is to teach them
// what a working site actually needs before they answer the rest of the form.
//
// Deliberately dependency-free: one fetch, regex over the HTML. No headless
// browser, no cheerio. Findings are shallow by design and phrased as
// observations, never as a verdict.
//
// SECURITY: this endpoint fetches a URL supplied by an anonymous caller, so it
// is an SSRF vector by construction. Guards below:
//   - http/https only
//   - hostname blocklist plus DNS resolution checked against private ranges
//   - redirects followed manually, max 2, each hop revalidated
//   - 6s timeout, 600KB read cap
// ─────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import { lookup } from "node:dns/promises";
import { isIP } from "node:net";

export const runtime = "nodejs";
export const maxDuration = 15;

const FETCH_TIMEOUT_MS = 6000;
const MAX_BYTES = 600_000;
const MAX_REDIRECTS = 2;

// ── SSRF guards ─────────────────────────────────────────────────
function isPrivateIPv4(ip: string) {
  const p = ip.split(".").map(Number);
  if (p.length !== 4 || p.some((n) => Number.isNaN(n))) return true;
  const [a, b] = p;
  if (a === 10) return true;
  if (a === 127) return true;
  if (a === 0) return true;
  if (a === 169 && b === 254) return true; // link-local, cloud metadata
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;
  if (a >= 224) return true; // multicast and reserved
  return false;
}

function isPrivateIPv6(ip: string) {
  const v = ip.toLowerCase();
  if (v === "::1" || v === "::") return true;
  if (v.startsWith("fc") || v.startsWith("fd")) return true; // unique local
  if (v.startsWith("fe80")) return true; // link-local
  // IPv4-mapped, e.g. ::ffff:127.0.0.1
  const mapped = v.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
  if (mapped) return isPrivateIPv4(mapped[1]);
  return false;
}

async function assertPublicUrl(raw: string): Promise<URL | null> {
  let u: URL;
  try {
    u = new URL(raw);
  } catch {
    return null;
  }
  if (u.protocol !== "http:" && u.protocol !== "https:") return null;

  const host = u.hostname.toLowerCase().replace(/^\[|\]$/g, "");
  if (
    host === "localhost" ||
    host.endsWith(".localhost") ||
    host.endsWith(".local") ||
    host.endsWith(".internal") ||
    host === "metadata.google.internal"
  ) {
    return null;
  }

  // Literal IPs skip DNS; named hosts must resolve to something public.
  if (isIP(host)) {
    if (isIP(host) === 4 ? isPrivateIPv4(host) : isPrivateIPv6(host)) return null;
    return u;
  }

  try {
    const { address, family } = await lookup(host);
    if (family === 4 ? isPrivateIPv4(address) : isPrivateIPv6(address)) return null;
  } catch {
    return null;
  }
  return u;
}

// Follows redirects by hand so every hop gets the same public-address check.
async function safeFetch(startUrl: URL) {
  let current = startUrl;
  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    let res: Response;
    try {
      res = await fetch(current.toString(), {
        redirect: "manual",
        signal: controller.signal,
        cache: "no-store",
        headers: {
          // Identify ourselves honestly. Some hosts block unknown agents.
          "User-Agent": "ROVStudiosSiteCheck/1.0 (+https://www.rovstudios.com)",
          Accept: "text/html,application/xhtml+xml",
        },
      });
    } finally {
      clearTimeout(timer);
    }

    if (res.status >= 300 && res.status < 400) {
      const loc = res.headers.get("location");
      if (!loc) return null;
      const next = await assertPublicUrl(new URL(loc, current).toString());
      if (!next) return null;
      current = next;
      continue;
    }
    return { res, finalUrl: current };
  }
  return null;
}

async function readCapped(res: Response) {
  const type = res.headers.get("content-type") || "";
  if (type && !type.includes("html") && !type.includes("xml") && !type.includes("text")) {
    return "";
  }
  const buf = await res.arrayBuffer();
  const slice = buf.byteLength > MAX_BYTES ? buf.slice(0, MAX_BYTES) : buf;
  return new TextDecoder("utf-8", { fatal: false }).decode(slice);
}

// ── Findings ────────────────────────────────────────────────────
export type Finding = {
  key: string;
  // What we saw, stated plainly.
  label: string;
  // Why a business owner should care. This is the teaching part.
  why: string;
  tone: "gap" | "ok";
};

function attr(html: string, re: RegExp) {
  const m = html.match(re);
  return m ? m[1].trim() : "";
}

function analyze(html: string, finalUrl: URL) {
  const head = html.slice(0, 120_000);
  const lower = html.toLowerCase();

  const title =
    attr(head, /<title[^>]*>([\s\S]*?)<\/title>/i).replace(/\s+/g, " ").slice(0, 160) || "";
  const description =
    attr(head, /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i) ||
    attr(head, /<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["']/i);
  const ogImage = attr(head, /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']*)["']/i);
  const viewport = /<meta[^>]+name=["']viewport["']/i.test(head);
  const favicon =
    attr(head, /<link[^>]+rel=["'][^"']*icon[^"']*["'][^>]+href=["']([^"']+)["']/i) || "/favicon.ico";

  const hasTelLink = /href=["']tel:/i.test(lower);
  const phoneInText = /\(?\b\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}\b/.test(html.replace(/<[^>]+>/g, " "));
  const bookingLink =
    /href=["'][^"']*(book|schedule|appointment|reserve|calendly|cal\.com|acuity|squareup\.com\/appointments)/i.test(
      lower
    );
  const hasForm = /<form[\s>]/i.test(lower) || /href=["']mailto:/i.test(lower);
  const isHttps = finalUrl.protocol === "https:";

  const findings: Finding[] = [];

  // Ordered by what actually costs a local business money, most first.
  if (!viewport) {
    findings.push({
      key: "viewport",
      label: "No mobile viewport tag",
      why: "Phones render the desktop layout zoomed out, so visitors pinch and scroll to read anything. Most of your traffic is phones.",
      tone: "gap",
    });
  }
  if (!hasTelLink && phoneInText) {
    findings.push({
      key: "tel",
      label: "Phone number isn't tappable",
      why: "The number is on the page as plain text, so on a phone it can't be tapped to call. That's a lost call every time someone tries.",
      tone: "gap",
    });
  } else if (!phoneInText) {
    findings.push({
      key: "nophone",
      label: "No phone number found",
      why: "If someone is ready to hire you, the fastest path is calling. Right now they have to hunt for a way to reach you.",
      tone: "gap",
    });
  }
  if (!bookingLink) {
    findings.push({
      key: "booking",
      label: "No booking or scheduling link",
      why: "Every enquiry has to go through you first. A booking link lets people commit at 9pm without waiting on a reply.",
      tone: "gap",
    });
  }
  if (!hasForm) {
    findings.push({
      key: "form",
      label: "No contact form",
      why: "Some people won't call. Without a form, those visitors leave without telling you they were interested.",
      tone: "gap",
    });
  }
  if (!description) {
    findings.push({
      key: "description",
      label: "No meta description",
      why: "Google writes its own snippet for your listing instead of you. That's your first sentence to a stranger, chosen at random.",
      tone: "gap",
    });
  }
  if (!title) {
    findings.push({
      key: "title",
      label: "No page title",
      why: "The title is what shows in search results and browser tabs. Without it you're a blank line on the results page.",
      tone: "gap",
    });
  }
  if (!ogImage) {
    findings.push({
      key: "og",
      label: "No social share image",
      why: "When someone pastes your link into a text or a group chat, it shows up as a bare grey box instead of your work.",
      tone: "gap",
    });
  }
  if (!isHttps) {
    findings.push({
      key: "https",
      label: "Not served over HTTPS",
      why: "Browsers label the site 'Not secure' in the address bar. Visitors notice, and Google ranks it lower.",
      tone: "gap",
    });
  }

  let faviconUrl = "";
  try {
    faviconUrl = new URL(favicon, finalUrl).toString();
  } catch {
    faviconUrl = "";
  }

  return {
    title,
    description: description.slice(0, 200),
    favicon: faviconUrl,
    finalUrl: finalUrl.toString(),
    // Four is enough to teach without turning the screen into a scolding.
    findings: findings.slice(0, 4),
    checked: { viewport, hasTelLink, phoneInText, bookingLink, hasForm, isHttps, ogImage: !!ogImage },
  };
}

// ── Handler ─────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  let input = "";
  try {
    const body = await req.json();
    input = String(body?.url || "").trim();
  } catch {
    return NextResponse.json({ ok: false, reason: "bad_request" }, { status: 400 });
  }

  if (!input || input.length > 300) {
    return NextResponse.json({ ok: false, reason: "bad_request" }, { status: 400 });
  }

  // People type "webbhvac.com", not "https://webbhvac.com".
  const withScheme = /^https?:\/\//i.test(input) ? input : `https://${input}`;

  const url = await assertPublicUrl(withScheme);
  if (!url) {
    // Not reachable or not allowed. The form treats every failure the same
    // way: skip the findings, never block the visitor.
    return NextResponse.json({ ok: false, reason: "unreachable" });
  }

  try {
    const result = await safeFetch(url);
    if (!result || !result.res.ok) {
      return NextResponse.json({ ok: false, reason: "unreachable" });
    }
    const html = await readCapped(result.res);
    if (!html) return NextResponse.json({ ok: false, reason: "not_html" });

    return NextResponse.json({ ok: true, ...analyze(html, result.finalUrl) });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "unknown";
    console.error("site-check failed:", msg.slice(0, 200));
    return NextResponse.json({ ok: false, reason: "unreachable" });
  }
}
