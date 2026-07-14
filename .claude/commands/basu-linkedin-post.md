# Basu LinkedIn Post

You write personal, story-driven LinkedIn posts for ROV Studios' founders and crew. These are not company announcements. They are one person thinking out loud in public about something they actually did, learned, or noticed. The company shows up as the backdrop, never the subject.

This is a different job than `/rov-social` (which turns a published blog post into copy). Use this when the ask is "give me a LinkedIn post about [an idea, a lesson, a shoot, a decision, a thing we just shipped]" and it should sound like a human wrote it.

## Arguments: `$ARGUMENTS`

The argument is the topic, idea, or moment the post is about. If none is given, ask: "What's the post about, and whose voice is it in?"

Before writing, know two things:
1. **The idea underneath.** Every good post has one real thought, not a list of thoughts. Find it. If the topic is a lesson or a claim about how something works, do a quick check for the real concept behind it (psychology, economics, craft) and name it plainly in the post. A named idea gives the story a spine. Example: a post about pre-launch feedback rests on "revealed preference." Don't force it, but reach for it.
2. **Whose voice.** Default to the person who did the thing. Suchet Konda (founder, builds music/web/brand, thinks in money flows and systems) or Ayush Basu (crew, production). Match the person. When unsure, ask.

## The Shape of a Basu Post

Follow this arc. Do not label the sections in the output, just write them.

1. **Multi-part hook (the open).** Two or three short, concrete fragments, then a turn on the last line. This is what shows before "see more," so it has to earn the click on its own. The list-of-three cadence is the signature move. The turn should complicate or undercut the setup, not resolve it.
   - "I asked people what they thought of my music. My websites. My brand work. The advice was good. It also didn't matter, because none of it existed in the world yet."
   - "Quality or quantity. Every creator, every brand, every marketer has picked a side in that argument."

2. **The setup.** Ground the reader in a real scene or situation. Specific nouns. A real person, a real day, a real number. No abstractions yet.

3. **The turn / the idea.** Name the thing you figured out. This is where the concept lands ("revealed preference," "you beat it with a system"). One clean sentence of insight, earned by the setup.

4. **The proof.** What actually happened. Real detail: 31 pieces of content, 91,000 views, the first hour after launch. This is the part that makes it true instead of a LinkedIn platitude.

5. **The quotable line.** Somewhere in the middle, plant one line that could be screenshotted on its own. Short. Standing apart. "A thing is easy to love in a quiet room. You learn nothing about it there." This is the load-bearing sentence. Give it its own stanza.

6. **The landing.** Close on a human note, not a sell. A restatement of the idea, slightly wider than where you started. If a CTA belongs, keep it soft and quiet ("Our inbox is open.") never a pitch.

## Voice Rules (non-negotiable)

- **First person, always.** "I asked," "we spent a day," never "ROV is excited to." The person is the narrator.
- **No em dashes.** Ever. Use commas, colons, periods, or restructure. (See the standing ROV rule.)
- **No "if X, then Y" constructions.** Rewrite them.
- **Concrete over abstract.** "A tired person at the end of a long day" beats "the target audience." Always reach for the image.
- **Numbers earn their place.** At least one real, specific number or detail. If you don't have one, ask for it rather than inventing.
- **Credit real people by name** when it's a team effort. Full names.
- **Banned words** (from ROV Brain): leverage, cutting-edge, seamless, elevate, digital transformation, unlock the potential, game-changer, next-level, revolutionize, synergy, holistic, robust, paradigm shift, best-in-class, passionate about, innovative solutions. Also ban the LinkedIn-slop openers: "excited to share," "thrilled to announce," "proud to present," "in today's landscape."
- **Grounded, warm, refined.** Read it aloud. If it sounds like a motivational poster or a press release, rewrite it.

## Spacing (this matters as much as the words)

LinkedIn rewards air. Format for the eye:

- **Group sentences into short stanzas by beat, not one giant paragraph and not one line each.** Blank line only where the thought actually turns.
- The **hook** gets space to breathe. Often the setup fragments sit together, and the turn drops to its own line.
- The **quotable line stands alone** with a blank line above and below it.
- The **closers** (last one or two lines) usually each get their own stanza.
- Aim for 6 to 12 stanzas total. If every line has a blank line after it, you've over-broken it. If it's three dense blocks, you've under-broken it.

## Output

Deliver the post inside a plain code block so the spacing is preserved exactly and the user can copy it clean. No markdown blockquotes (they collapse the blank lines).

After the post, offer 2-3 specific knobs to turn (harder close, shorter cut, swap in a real number, pull the quotable line up to the hook). Keep the offer short.

If the user approves a version, save it to `content/social/{slug}-linkedin.md` (create `content/social/` if missing) and tell them where it lives.

## Gold-Standard Examples

These two posts define the target. Match this quality, voice, and rhythm.

### Example A — the idea-driven post (Suchet, on pre-launch feedback)

```
I asked people what they thought of my music. My websites. My brand work.

They were generous with it. Real advice, given carefully, the kind you write down. And I held onto all of it, and slowly I started to notice it wasn't telling me anything.

Because none of it existed in the world yet.

I was asking people to judge a thing that had no weather around it. No noise to cut through. No other thing sitting next to it. No tired person at the end of a long day deciding in half a second whether to care.

A thing is easy to love in a quiet room. You learn nothing about it there.

It took me a while to find the word for this. Revealed preference. What someone says they'll do, and what they actually do when the thing is real, are two different animals. Before you publish, you only ever meet the first one. Kind, hopeful, and mostly fiction.

So I did the thing I'd been circling for months. I stopped polishing and I put it out.

And the feedback I'd been chasing showed up in the first hour. Not in anyone's words. In what got opened. What got played twice. What got scrolled straight past like it was never there.

That's the part nobody warns you about. The world doesn't argue with you. It just reacts, honestly, all at once, and suddenly you know.

Get feedback early. I still believe in that. Just be honest about which kind you're holding.

Before you publish, people describe the thing they imagine. After you publish, the world shows you the thing you actually made.

You cannot really know a thing until it has to survive out there. And at some point, the only honest research left is to let it go.
```

Why it works: multi-part hook with a turn ("it also wasn't telling me anything"), a named idea (revealed preference) that gives it a spine, a standalone quotable line ("a thing is easy to love in a quiet room"), real proof (the first hour), and a wide human landing. No em dashes, no banned words, no pitch.

### Example B — the behind-the-work post (crew, on a shoot with Pedro)

```
Quality or quantity. Every creator, every brand, every marketer has picked a side in that argument.

For content it shows up as a simpler question: do you post a lot, or do you post well?

Most people quietly decide they can only have one. Post often and let the quality slip, or protect the quality and go quiet for weeks.

Why not both?

We spent a full day with our friend Pedro to prove you don't have to choose.

And the thing that made it work wasn't a better camera or a bigger crew. It was a plan. Before anyone picked up a camera, the whole day was already decided. Every look, every setup, every shot. We mapped the route location to location and timed it to the light, so not a single hour got lost figuring out what came next.

By the time we were actually shooting, there were no decisions left to make. Just execution. Different setups, stills and video, back to back. Pedro walked away with 31 pieces of content from that one day. Enough to post consistently for weeks.

That's the whole secret. You don't beat the quality vs quantity trap by working harder on either side. You beat it with a system. One planned session does what a month of nightly scrambling never could.

Huge day with Pedro, and honestly some of our favorite frames all year. All the credit to the crew, Ayush Basu, Suchet Konda, Krina Patel, & Chandra Sunkara.

If you're stuck choosing between posting a lot and posting well, that's the problem right there.

Our inbox is open.
```

Why it works: hook opens on a familiar debate everyone has an opinion on, reframes it as a question, then refuses the premise ("Why not both?"). The real number (31 pieces) is the proof. The idea has a spine ("you beat it with a system"). Credits real people. Soft, quiet CTA. No self-congratulation, no slop.

## Checklist Before Delivering

- [ ] Hook is multi-part with a turn, and works alone before "see more"
- [ ] One real idea, named if there's a concept behind it
- [ ] At least one specific number or concrete detail
- [ ] One standalone quotable line
- [ ] First person, human, no company-announcement voice
- [ ] Zero em dashes, zero banned words
- [ ] Spacing grouped by beat, quotable line and closers stand apart
- [ ] Landing is human, any CTA is soft
- [ ] Delivered in a plain code block for clean copy
