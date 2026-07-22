---
name: rov-carousel
description: >
  Generate a Range of View "flow": one carousel deck plus a LinkedIn caption and an Instagram
  caption, in ROV's exact social style. Use whenever the user wants a social post, carousel,
  LinkedIn post, Instagram post, or "a flow" for ROV, CTRL A, a client, a shoot, a toolkit, a
  launch, or a behind-the-scenes story. Triggers: "make a carousel", "banger LinkedIn post",
  "post about X", "content for the launch", "turn this into a social post", "make a flow",
  "post like the Pedro one / the CTRL A one". Produces ready-to-paste copy in the chat and saves
  it to content/social/{slug}-social.md.
---

# ROV Carousel / Social Flow Generator

You write Range of View Studios social posts. One **flow** = one carousel deck + a LinkedIn caption
+ an Instagram caption, all telling the same story, posted to both platforms. This skill encodes the
exact style ROV converged on. Follow it precisely; it is a house style, not a suggestion.

Reference examples already in the repo (read them before writing if unsure of the feel):
- `content/social/ctrla-launch-social.md` — a launch/brand flow (CTRL A pinned post)
- `content/social/pedro-content-day-social.md` — a behind-the-scenes / thesis flow (Pedro shoot)

---

## Step 0: Get the source truth

Never invent facts. Before writing, gather the raw material:
- If the post is about a page/product/toolkit, read the real content (e.g. `app/resources/...`,
  `app/ctrla/...`, `content/blog/...`). Name real tools, real features, real numbers.
- If it's about an event or shoot, use what the user tells you. Ask for hard numbers (counts,
  pieces delivered, crew names) rather than guessing. Mark anything unknown as `[X]` and flag it.
- One thing only: every flow makes ONE argument. Find it before you write a word.

## Step 1: Build the spine (the argument)

Every ROV flow runs on a three-word arc. Name each before drafting:
1. **The claim** — a shareable worldview line the reader can nod at ("Nobody gets to gatekeep the
   craft anymore." / "Quality or quantity, everyone picks a side.").
2. **The proof** — the concrete, specific thing that cashes the claim (real tools, "31 pieces of
   content from one day", the actual process). Never leave the claim un-cashed.
3. **The payoff** — what the reader gets or believes by the end (raise your ceiling / plan the day).

Word discipline (learned the hard way): pick the *right noun for each layer* and don't let them
blur. If you promise to un-gatekeep "taste," you must then hand over taste, but what's actually in
the box is usually *craft* or *a system*. Give the concrete noun in the hook; save the aspirational
noun (taste, mastery) for the closing belief slide.

## Step 2: Engineer the first two sentences

This is the highest-leverage work. On both platforms only the first ~2 sentences show before
"…see more" / "…more". They must carry the whole hook.

Rules:
- **Sentence 1 = the claim.** A worldview or a sharp, specific tension. Shareable on its own.
- **Sentence 2 = the proof, immediately.** Cash the claim with one concrete thing. No abstraction
  survives past line 2. "Everything we know" is NOT concrete; "31 pieces from one day" is.
- Do not make the reader parse across three unrelated ideas in one line. If listing specifics,
  give them ONE frame ("the exact tools, the full process, and the reference we make music,
  websites, and brands with") so they read as examples of one thing, not three fragments.
- Name disciplines as plain nouns (music, websites, brands), never as insider metaphors
  (vocal chain, the stack) unless the audience lives in those tools.
- Always draft 2–4 alternate hooks and keep them at the bottom of the file for A/B testing.

## Step 3: Structure the carousel

Lean. 7–9 slides. Every slide = a kicker/label (optional), then 2–3 short lines. Never a paragraph.
Photo-forward posts (shoots, BTS) note which slides ride real images.

The default arc:
1. **Hook** — the claim, huge type, minimal. Add label: `TOPIC · RANGE OF VIEW STUDIOS · swipe →`.
2. **The resolve / what it is** — cash the claim, name the thing.
3. **The problem or the purpose** — why this matters, the tension the post resolves.
4–7. **The proof** — the specifics: features, steps, the process (planning / routing / executing /
   output), or the real tools. One idea per slide. Sub-features get labeled `INSIDE VOL 01 · …`.
8. **The thesis / belief** — the payoff line + the aspirational noun (taste, the ceiling).
9. **Close** — see Step 5. Soft, warm, never a hard sell.

Spec line to include: `Deck: 1080x1350, N slides. Export as PDF for LinkedIn, individual images for IG.`

## Step 4: Write the two captions

- **LinkedIn**: fuller. The engineered hook, then the argument in 3–5 short paragraphs, then the
  soft close. Professional but never corporate. Real line breaks between paragraphs. 3–5 hashtags.
- **Instagram**: same story, tighter and warmer. Hook often number-forward. Short paragraphs, more
  community voice, "come say hi" energy. 20–30 hashtags in a separate block after `.`/`.`/`.`.
- Keep both captions telling the *identical* argument as the carousel. No new claims in the caption.

## Step 5: The close (CTA) is soft

ROV closes never hard-sell. A pitch right after a warm story kills it.
- Lead with genuine warmth or credit (thank the friend, credit the crew by name).
- Frame the offer as "here's what it looks like" or "if this is something you've been thinking
  about," not "book now / DM us / limited spots."
- End on an open door: "our inbox is open," "come say hi." Never an imperative CTA.

## Step 5.5: Distribution and funnel (bake into every flow)

A post is only half the work; how it travels is the other half. Every flow must declare these
before it's done. Put them in the header block of the saved file.

1. **Funnel job.** Every flow does ONE of three jobs. Name it, because it changes the hook and close:
   - **Reach** — broad topic, worldview, or lead-magnet. Optimized for shares and new followers
     (e.g. the CTRL A launch, a "3 ways founders waste money on branding" teardown).
   - **Positioning** — an opinion, a method, a hot take that proves how ROV thinks (e.g. the Pedro
     "plan the day" thesis). Builds authority.
   - **Conversion** — a client case study with proof, a tactical breakdown ending in a soft call to
     work together. Carries a metric.
   Most flows lean one way with a touch of a second. Don't try to do all three in one post.

2. **Founder-reshare line.** Personal profiles out-distribute company pages, and the page is the
   trust anchor the founder's post points back to. Draft a 1–2 sentence line Andi / Ayush / Suchet
   can put on top when they reshare the company post from their personal profile. First person,
   even more casual than the caption.

3. **Engagement-window tags.** LinkedIn reach keys off the first 10–15 minutes of engagement. List
   who to tag and who should comment early: crew, collaborators, the client/friend featured. Tagging
   is a distribution move, not just credit. Always tag the people in the story by name.

4. **Proof requirement (conversion + case-study flows).** If the flow is about client or real work,
   it must carry a concrete before/after or metric ("31 pieces from one day", load time, revenue,
   time saved). A nice story without a number is a reach post, not a conversion post; label it right.

5. **ICP signal.** Client-facing flows must make clear WHO this is for, in the reader's own words
   (e.g. "Atlanta founders", "local service businesses"). Inherit the ICP from the source page.
   Audience-growth / brand flows (like CTRL A) may stay intentionally broad; if so, say so in the
   header so it's a choice, not an accident.

## Step 6: Voice guardrails (ROV house style)

Three pillars: **Grounded, Warm, Refined.** Substance over noise. Quiet confidence over hype.

Hard bans:
- **No em dashes, ever.** Recast with commas, colons, periods, or a middot ( · ). This is a
  standing ROV rule across all writing.
- No "excited to announce", "thrilled to share", "proud to present", "in today's digital
  landscape", "leverage", "cutting-edge", "seamless", "unlock", "elevate", "game-changer".
- No self-congratulation as the lead. Lead with the reader's value or a real tension.
- Write like a sharp peer or a trusted collaborator, not a PR department or a LinkedIn influencer.
  Read every line aloud; if it sounds like a deck or a 3am infomercial, rewrite it.

## Step 7: Output

1. Print the whole flow in the chat, cleanly spaced: carousel slides (blank line between slides),
   then LinkedIn caption, then Instagram caption, then alternate hooks.
2. Save it to `content/social/{slug}-social.md` (create `content/social/` if missing) using the same
   layout as the reference files. The header block must include: topic, thesis, **funnel job**, **ICP
   (or "intentionally broad")**, deck spec, and **crew/tags**. After the captions, include a
   **Distribution** section with the **founder-reshare line** and the **engagement-window tag list**.
3. Flag any `[X]` placeholders and ask the user for the real numbers.
4. Offer to generate a brand-colored Word doc (`.docx`) of the flow if they want a shareable file
   (see the CTRL A flow's doc for the pattern: HTML in ROV colors → Word COM SaveAs format 16).

Do not skip the chat output in favor of only writing the file. The user wants to read and react.
