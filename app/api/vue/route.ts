// ═══════════════════════════════════════════════════════
// VUE — ASK
//
// Retrieval first, model second. The passages in content/vue-brain are the
// only thing an answer may draw on: we score the question, and when nothing
// clears the floor Vue says she does not know and OpenAI is never called. That
// is both the hallucination guard and the reason a quiet question costs zero.
//
// The model's whole job is to say the matched passage in Vue's voice. It is
// not asked to reason, so a small model reads as smart here.
//
// ?retrieval=1 returns the matches without calling the model, which is the
// free way to debug a bad answer: nine times in ten the retrieval was wrong,
// not the wording.
// ═══════════════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { CONFIDENCE_FLOOR, retrieve, scoreAll, type VueLink } from "@/lib/ctrla/vue-brain";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

// One constant so the model is a one-line swap. gpt-5.4-mini because this is a
// grounded paraphrase with a short prompt and a short answer, not a reasoning
// task. Move up a tier only if her voice comes out flat.
const MODEL = "gpt-5.4-mini";

// Costs money per call, so it gets a limit even behind the internal gate.
const LIMIT = 20;
const WINDOW_MS = 10 * 60 * 1000;

/**
 * Frozen, and first in the request, so OpenAI's automatic prefix caching has
 * something stable to hit. Everything that varies goes in the user message.
 */
const SYSTEM = [
  "You are Vue, the narrator of CTRL·A, guiding a creative person who is making something. Most of them are starting out. Your job is to get them to the right part of CTRL·A, not to impress them.",
  "",
  "You answer ONLY from the passages given in the user message. They are the whole of what you know.",
  "If the passages do not answer the question, say you do not have that one, and point at whatever in the passages comes closest. Never fill a gap from general knowledge, and never guess at a number, a price, or a name that is not in front of you.",
  "",
  "Never write a URL, a path, or a link. The page prints the real links underneath your answer. Refer to a place by its name (Start here, the Design toolkit, Lock In) and let the link do the rest.",
  "",
  "Voice: first person, plain sentences, warm but a little above it all. You are the one who has watched a lot of people start. You are never selling anything.",
  "Two to four sentences unless more is genuinely needed. No preamble, no restating the question.",
  "Never use em dashes. Use commas, colons, or periods instead.",
].join("\n");

const DONT_KNOW =
  "I do not have that one yet. Try me on the toolkits, the brand kit, or where to start if you are new.";

// A miss is still a place to send someone. Rather than a dead end, the reader
// gets the same doors the navigation passage offers, which is the honest
// answer to "I do not know": here is the map, have a look.
const FALLBACK_LINKS: VueLink[] = [
  { label: "Start here, the two minute intake", href: "/ctrla/start" },
  { label: "The magazine, front to back", href: "/ctrla/vol/1" },
];

const FALLBACK_FOLLOWUPS = ["What is CTRL-A?", "Which toolkit is mine?", "Where should I start?"];

function bad(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

async function ask(req: NextRequest, question: string, opts: { debug: boolean; retrievalOnly: boolean }) {
  const trimmed = question.trim().slice(0, 500);
  if (!trimmed) return bad("Ask her something", 400);

  const matches = retrieve(trimmed);
  const sources = matches.map((m) => ({
    slug: m.passage.slug,
    title: m.passage.title,
    score: Number(m.score.toFixed(2)),
  }));

  // Where she is sending them, straight off the matched passages. Deduped by
  // href and capped at four, because five links under an answer is not
  // navigation, it is a sitemap.
  //
  // Round-robin rather than passage-by-passage: a link-rich passage would
  // otherwise drain the cap and the second passage would contribute nothing,
  // which is how she ends up naming the Design toolkit in a sentence while the
  // links underneath offer everything except the Design toolkit.
  const seen = new Set<string>();
  const links: VueLink[] = [];
  const deepest = Math.max(0, ...matches.map((m) => m.passage.links.length));
  for (let rank = 0; rank < deepest && links.length < 4; rank++) {
    for (const m of matches) {
      const link = m.passage.links[rank];
      if (!link || seen.has(link.href)) continue;
      seen.add(link.href);
      links.push(link);
      if (links.length >= 4) break;
    }
  }
  // Same interleave as the links, and never offer back the question just
  // asked: "you might also ask the thing you just asked" is how a guide loses
  // someone's trust in one step.
  const asked = trimmed.toLowerCase().replace(/[^a-z0-9 ]/g, "").trim();
  const followups: string[] = [];
  const deepestF = Math.max(0, ...matches.map((m) => m.passage.followups.length));
  for (let rank = 0; rank < deepestF && followups.length < 3; rank++) {
    for (const m of matches) {
      const f = m.passage.followups[rank];
      if (!f) continue;
      const norm = f.toLowerCase().replace(/[^a-z0-9 ]/g, "").trim();
      if (norm === asked || followups.includes(f)) continue;
      followups.push(f);
      if (followups.length >= 3) break;
    }
  }

  const debugScores = opts.debug
    ? scoreAll(trimmed).map((m) => ({ slug: m.passage.slug, score: Number(m.score.toFixed(2)) }))
    : undefined;

  // Below the floor: a real answer, and a free one.
  if (matches.length === 0) {
    return NextResponse.json({
      question: trimmed,
      knows: false,
      answer: DONT_KNOW,
      sources: [],
      links: FALLBACK_LINKS,
      followups: FALLBACK_FOLLOWUPS,
      floor: CONFIDENCE_FLOOR,
      ...(debugScores ? { allScores: debugScores } : {}),
    });
  }

  if (opts.retrievalOnly) {
    return NextResponse.json({
      question: trimmed,
      knows: true,
      retrievalOnly: true,
      sources,
      links,
      followups,
      passages: matches.map((m) => m.passage.body),
      ...(debugScores ? { allScores: debugScores } : {}),
    });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error("OPENAI_API_KEY is not set");
    return bad("Vue is not configured", 503);
  }

  const limited = rateLimit(`vue:${clientIp(req)}`, LIMIT, WINDOW_MS);
  if (!limited.ok) {
    return NextResponse.json(
      { error: "That is a lot of questions at once. Give it a few minutes." },
      { status: 429, headers: { "Retry-After": String(limited.retryAfter) } }
    );
  }

  const passages = matches
    .map((m) => `## ${m.passage.title}\n\n${m.passage.body}`)
    .join("\n\n---\n\n");

  try {
    const client = new OpenAI({ apiKey });
    const completion = await client.chat.completions.create({
      model: MODEL,
      max_completion_tokens: 500,
      messages: [
        { role: "system", content: SYSTEM },
        {
          role: "user",
          content: `Passages:\n\n${passages}\n\n---\n\nQuestion: ${trimmed}`,
        },
      ],
    });

    const answer = completion.choices[0]?.message?.content?.trim() || DONT_KNOW;

    return NextResponse.json({
      question: trimmed,
      knows: true,
      answer,
      sources,
      links,
      followups,
      usage: completion.usage
        ? {
            in: completion.usage.prompt_tokens,
            out: completion.usage.completion_tokens,
            cached: completion.usage.prompt_tokens_details?.cached_tokens ?? 0,
          }
        : undefined,
      ...(debugScores ? { allScores: debugScores } : {}),
    });
  } catch (err: unknown) {
    // Most specific first: a 401 is a bad key and a 429 is a spend or rate
    // ceiling, and those need different fixes from a generic outage.
    if (err instanceof OpenAI.AuthenticationError) {
      console.error("Vue: OpenAI rejected the API key");
      return bad("Vue is not configured", 503);
    }
    if (err instanceof OpenAI.RateLimitError) {
      console.error("Vue: OpenAI rate limit or quota", err.message);
      return bad("Vue is thinking too hard right now. Try again in a minute.", 429);
    }
    if (err instanceof OpenAI.APIError) {
      console.error(`Vue: OpenAI error ${err.status}`, err.message);
      return bad("Vue could not answer that one", 502);
    }
    console.error("Vue: unexpected failure", err);
    return bad("Vue could not answer that one", 500);
  }
}

// GET is for eyeballing in a browser: /api/vue?q=what%20is%20ctrl-a
export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams;
  return ask(req, p.get("q") ?? "", {
    debug: p.get("debug") === "1",
    retrievalOnly: p.get("retrieval") === "1",
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  return ask(req, typeof body?.question === "string" ? body.question : "", {
    debug: body?.debug === true,
    retrievalOnly: body?.retrieval === true,
  });
}
