---
# ─── Identity ───────────────────────────────────────────────────────────
slug: example-icp-atlanta            # matches the filename (without .md)
industry: Example industry & niche   # a person could self-identify with this
geo: Atlanta                         # a place the reader would name themselves
pitchLine: "the one-line seed that sparked this page"  # preserved verbatim

# ─── SEO ────────────────────────────────────────────────────────────────
title: On-page H1-support / OG title, longer and descriptive
seoTitle: Short Title | Range of View Studios   # keep under ~60 chars, no SERP truncation
description: ""                       # 150-160 chars, answer-shaped: who / what / where, plainly
coverImage: /og/og-industries-example.webp   # 1200x630 (may be pending; see media plan)

# ─── Lifecycle (two flags) ──────────────────────────────────────────────
published: true                       # false = not built at all
indexed: false                        # false = built + reachable, but noindex + out of sitemap
date: 2026-07-21
dateModified: 2026-07-21

# ─── Hero ───────────────────────────────────────────────────────────────
# Live service-page hero pattern: solid-white bold headline line(s), then a
# NorwigeHeroItalic gradient accent line beneath. Split the punchline into the
# two fields where it reads naturally (headline = setup, headlineAccent = turn).
headline: ""                          # solid white H1 line(s) (Norwige bold). Speak to the reader, not about ROV
headlineAccent: ""                    # gradient italic accent line under the headline (optional; omit for headline-only)
eyebrow: ""                           # uppercase pill badge, e.g. "FOR ATLANTA RESTAURANTS" (falls back to industry · geo)
subhead: ""                           # 1-2 sentences, white/65
heroGradient: ember                   # ember | emberDark | earth  (maps to brand-kit gradients)
answerLine: ""                        # ONE plain declarative sentence for GEO, rendered under the hero:
                                      # "Range of View Studios is an Atlanta creative studio that builds
                                      #  brand identities and websites for <industry>."
# Optional full-bleed hero video (SoundHero-style). The CSS ember splash still
# paints first for LCP; this fades in client-side only, after mount + in-view,
# and is ABSENT under prefers-reduced-motion / Save-Data and from SSR HTML. Use
# the page's strongest assigned b-roll clip (an existing muted-friendly mp4 in
# public/, verify with ls). OMIT this whole block for pages with no footage;
# they stay pure CSS splash. poster is optional (an existing webp still).
# heroMedia:
#   src: /webdev/example.mp4
#   poster: /thumbnails/example.webp

# ─── Stats Row (3-4; real numbers or honest process facts, never fabricated) ──
stats:
  - { value: "", label: "" }
  - { value: "", label: "" }
  - { value: "", label: "" }

# ─── Pain section (3-4 cards, from supportingPains) ─────────────────────
pains:
  - { title: "", body: "" }
  - { title: "", body: "" }
  - { title: "", body: "" }

# ─── Services for this ICP (3-5; blurbs rewritten for THIS reader) ──────
services:
  - { name: "", blurb: "" }
  - { name: "", blurb: "" }
  - { name: "", blurb: "" }

# ─── Visual explanation (exactly one; pick the type) ────────────────────
# before-after:
# visual:
#   type: before-after
#   title: ""
#   before: { label: "Before", points: ["", "", ""] }
#   after:  { label: "After",  points: ["", "", ""] }
#
# process-flow:
# visual:
#   type: process-flow
#   title: ""
#   steps:
#     - { n: 1, title: "", body: "" }
#     - { n: 2, title: "", body: "" }
#
# diagram (hub-and-spoke):
# visual:
#   type: diagram
#   title: ""
#   centerLabel: ""
#   items:
#     - { title: "", body: "" }
#
# annotated-mockup:
# visual:
#   type: annotated-mockup
#   title: ""
#   image: ""                 # leave "" for the gradient placeholder block
#   alt: ""
#   annotations:
#     - { x: 30, y: 40, label: "" }   # x/y are % positions over the image
visual:
  type: before-after
  title: ""
  before: { label: "Before", points: ["", "", ""] }
  after: { label: "After", points: ["", "", ""] }

# ─── Showcase media band (optional) ─────────────────────────────────────
# A dark media band between Services and Body, in the sound-page language.
# ONLY reference files that already exist in public/ (verify with ls). Videos
# are lazy-mounted (IntersectionObserver) and autoplay muted+looping once in
# view; a gradient placeholder shows until then and stays under reduced motion.
# Images go through next/image. Keep video ≤2MB and images ≤300KB. Labels are
# short, on-voice, uppercased by the UI (no em dashes). ratio is a CSS
# aspect-ratio ("16 / 9" default, "9 / 16" for vertical clips).
# showcaseHeading: ""                 # optional Norwige heading (defaults to "See it in the wild")
# Each item takes an optional `result`: a one-line outcome caption shown under
# the card title in the featured-work band (hover-to-play video, press on
# touch). A Before/After pair (two adjacent VIDEO items labelled exactly
# "Before" and "After") is auto-rendered as ONE connected card with a toggle.
# showcase:
#   - { src: /webdev/example.mp4, kind: video, label: "The site, live", ratio: "16 / 9", result: "Online revenue doubled after launch." }
#   - { src: /casestudy/x/shot.webp, kind: image, label: "The brand, on every surface", ratio: "16 / 9", alt: "...", result: "One identity across every surface." }

# ─── Trust / proof slot (replaces the blog Author Card) ─────────────────
# type: case-study | logos | credentials
proof:
  type: credentials
  heading: ""
  body: ""
  stat: { value: "", label: "" }      # optional
  link: ""                            # optional (e.g. a related /web page or case study)
  # image: /casestudy/x/proof.webp    # optional image shown inside the proof panel (existing file, ≤300KB)
  # imageAlt: ""                       # alt text for the proof image
  # logos: [ { src: "/logos/x.svg", alt: "X" } ]   # logos type only

# ─── FAQ (4-6; questions phrased as the reader would type them; answers front-loaded) ──
faqs:
  - { q: "", a: "" }
  - { q: "", a: "" }
  - { q: "", a: "" }
  - { q: "", a: "" }

# ─── CTA ────────────────────────────────────────────────────────────────
cta:
  heading: ""
  body: ""
  phone: "+1-XXX-XXX-XXXX"            # OPEN DECISION: Andi supplies number or a booking URL

# ─── Interactive questionnaire estimator (optional, one per page) ────────
# A compact dark widget placed right after the pains (the "feel the cost"
# moment). It is a short QUESTIONNAIRE, one question at a time: each input is a
# step with a conversational `question` and 3-5 large answer chips (`options`,
# ranges rather than sliders). Picking a chip auto-advances; a quiet Back
# button appears from step 2; after the last answer the result panel reveals
# the annual number with an "Adjust my answers" restart. Label results as
# ESTIMATES from the reader's answers, NEVER as a Range of View performance
# claim. `formula` is a safe declarative expression over the input `key`s
# (only + - * / and parentheses; evaluated by a tiny parser, never eval); each
# chosen option's `value` feeds its key. If `options` is omitted, 4 range
# choices are auto-generated from min/max/step so this block still works, but
# hand-written on-voice options are strongly preferred. Phrase every question
# to the reader ("How many calls do you miss in a week?"). `frame` is "loss"
# (money leaking) or "opportunity" (money on the table) and only tints the
# result copy. First answer fires a gtag `icp_calc_engage` (icp_slug) event;
# the result CTA fires `icp_call_click`. No em dashes anywhere (commas,
# colons, periods, or · ).
# calculator:
#   eyebrow: "Short ember label"
#   heading: "A question the reader is asking about cost"
#   frame: loss                       # loss | opportunity
#   inputs:
#     - key: a
#       label: "First input"                       # short admin-facing label
#       question: "How many X do you Y in a week?" # reader-facing phrasing
#       min: 1
#       max: 100
#       step: 1
#       default: 10                    # fallback value, no chip pre-selected
#       suffix: "/wk"
#       options:                       # 3-5 chips; value = a reasonable midpoint
#         - { label: "Under 10", value: 5 }
#         - { label: "10-25", value: 18 }
#         - { label: "25-60", value: 40 }
#         - { label: "60+", value: 80 }
#     - key: b
#       label: "Second input"
#       question: "What is an average B worth?"
#       min: 50
#       max: 500
#       step: 10
#       default: 150
#       prefix: "$"
#       options:
#         - { label: "Under $100", value: 80 }
#         - { label: "$100-250", value: 170 }
#         - { label: "$250-400", value: 320 }
#         - { label: "$400+", value: 450 }
#     - key: c
#       label: "A percentage"
#       question: "How often does C happen?"
#       min: 5
#       max: 60
#       step: 5
#       default: 20
#       suffix: "%"
#       options:
#         - { label: "Around 1 in 10", value: 10 }
#         - { label: "Around 1 in 5", value: 20 }
#         - { label: "Around 1 in 3", value: 35 }
#         - { label: "Half or more", value: 55 }
#   formula: "a * 52 * c / 100 * b"   # keys + - * / ( ) only
#   resultLabel: "What the annual number means, in plain words."
#   note: "An estimate from the numbers you set, not a Range of View performance claim. <one honest caveat about the assumption>."

# ─── Composition (optional presentation fields) ─────────────────────────
# Both are optional and purely presentational (they never change GEO/AEO copy
# order). No em dashes; use commas, colons, periods, or the middot ( · ).
#
# marquee: a thin scrolling ticker of 5-9 short ICP phrases. The UI inserts the
# · separator between them, so DO NOT put · inside a phrase. Keep each phrase to
# a few words, on-voice, uppercased by the UI.
# marquee:
#   - "Brand identity"
#   - "Websites that convert"
#   - "Creative tech & AI"
#
# pullQuote: ONE editorial band per page. `text` is a single sentence lifted
# from the body prose. `accent` is a substring of `text` (verbatim) rendered in
# the ember gradient, so keep it to 2-4 words that carry the punch.
# pullQuote:
#   text: "A single sentence from the body, set huge."
#   accent: "the punch words"
#
# bodyAsides: per-chapter VISUAL COMPANIONS for the editorial body layout. The
# body renders on an asymmetric ~66ch grid; each companion is promoted into the
# freed column beside the H2 chapter it names, so no chapter is a bare wall of
# text. Give EVERY chapter one, and vary the `type` so no two adjacent chapters
# use the same treatment (they alternate left/right automatically). Everything is
# aria-hidden and pulled from the prose/assets already on the page: never a new
# claim, never an invented number, only existing public/ files for media.
#   - afterH2: the H2 text the companion sits beside (punctuation-insensitive).
#   - type:    "pull" (default) | "media" | "number" | "keywords".
#   - kicker:  optional small ember label (2-3 words), works on any type.
#   Per type:
#     pull     → text:  a strong line lifted VERBATIM / near-verbatim from that
#                       chapter's prose. The canonical sentence still reads in the flow.
#     media    → src:   an EXISTING public/ asset (verify with ls); mediaKind:
#                       "video" (.mp4) or "image"; label: a short caption (reuse a
#                       showcase/proof result line). Videos are lazy + reduced-motion safe.
#     number   → value: an oversized numeral/stat that ACTUALLY appears in that
#                       chapter's prose; caption: a short line of context.
#     keywords → items: 3-4 short phrases lifted from that chapter's prose.
# No em dashes anywhere (commas, colons, periods, or · ).
# bodyAsides:
#   - { afterH2: "Chapter one heading", type: pull, kicker: "The idea", text: "A single strong line from that chapter." }
#   - { afterH2: "Chapter two heading", type: number, kicker: "The cost", value: "2×", caption: "what the prose says this figure means." }
#   - { afterH2: "Chapter three heading", type: keywords, kicker: "The surfaces", items: ["Phrase one", "Phrase two", "Phrase three"] }
#   - { afterH2: "Chapter four heading", type: media, kicker: "In the wild", src: /webdev/example.mp4, mediaKind: video, label: "A short caption reused from a showcase result line." }
---

<!--
  Markdown body below. The Main Content section, minimum ~800 words of
  substantive, ICP-specific prose. H2s should track the reader's real
  questions (the keywords this page answers). No em dashes anywhere: use
  commas, colons, periods, or the middot ( · ). First person "we". No hype.
-->

## A question this reader is actually asking

Write here.
