// Per-IP rate limiting for the public lead routes.
//
// The honeypot stops bots that render the page and fill every field. It does
// nothing against a script that POSTs JSON straight at the route, which is the
// case that burns Resend quota and fills the Klaviyo list with junk.
//
// In-memory on purpose: no Redis dependency for a site this size. The tradeoff
// is that each serverless instance keeps its own counter, so the effective
// limit is (limit x warm instances). That still turns an unbounded flood into a
// trickle, which is the goal. If lead volume ever justifies exact limits, swap
// the Map for Upstash without touching the call sites.

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

// Bound the map so a spray of spoofed IPs cannot grow it without limit.
const MAX_KEYS = 10_000;

function sweep(now: number) {
  // forEach rather than for..of: the project's TS target predates downlevel
  // Map iteration, and this is the only place the map is walked.
  const expired: string[] = [];
  buckets.forEach((bucket, key) => {
    if (bucket.resetAt <= now) expired.push(key);
  });
  expired.forEach((key) => buckets.delete(key));
}

/**
 * Client IP from the proxy headers Vercel sets. Falls back to a constant, which
 * means an unknown-IP flood shares one bucket rather than bypassing the limit.
 */
export function clientIp(req: Request): string {
  const h = req.headers;
  const forwarded = h.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return h.get("x-real-ip")?.trim() || h.get("cf-connecting-ip")?.trim() || "unknown";
}

export type RateLimitResult = {
  ok: boolean;
  /** Seconds until the window resets. Sent as Retry-After on a block. */
  retryAfter: number;
};

/**
 * Fixed-window limiter.
 *
 * @param key    Bucket identity, conventionally `${routeName}:${ip}` so one
 *               noisy route cannot lock a visitor out of the others.
 * @param limit  Requests allowed per window.
 * @param windowMs Window length in milliseconds.
 */
export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();

  if (buckets.size > MAX_KEYS) sweep(now);

  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfter: 0 };
  }

  bucket.count += 1;
  if (bucket.count > limit) {
    return { ok: false, retryAfter: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)) };
  }
  return { ok: true, retryAfter: 0 };
}

/**
 * The shared limit for lead forms: 5 submissions per IP per 10 minutes. Well
 * clear of a person who mistypes an email and resubmits, or a household behind
 * one NAT, while capping a script at 30 an hour per instance.
 *
 * Pass a higher `limit` where many *different* people legitimately share one
 * IP. The /card QR flow is the case that matters: a room full of people on the
 * same event wifi presents as a single address, and silently blocking the
 * eleventh person to scan your business card is far worse than letting a bot
 * add a few junk emails to a list.
 */
export function leadRateLimit(req: Request, route: string, limit = 5): RateLimitResult {
  return rateLimit(`${route}:${clientIp(req)}`, limit, 10 * 60 * 1000);
}

/** 429 body shared by every lead route, so the forms can render one message. */
export function rateLimitResponse(result: RateLimitResult) {
  return Response.json(
    {
      ok: false,
      code: "rate_limited",
      error: "That is a lot of submissions in a short window. Give it a few minutes, or email us directly.",
    },
    { status: 429, headers: { "Retry-After": String(result.retryAfter) } }
  );
}
