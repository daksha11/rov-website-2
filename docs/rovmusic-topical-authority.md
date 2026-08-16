# rovmusic.com Topical Authority Architecture

**Goal:** make rovmusic.com the ranking authority for music services in Atlanta, using the CTRL·A music toolkit as the substance behind the claim.

**Decisions locked (2026-08-05, Ayush):**
- Toolkit serves on both hosts, canonical pointed at rovmusic.
- Three intent layers: local commercial, craft how-to, artist career.
- Authors: Ayush Basu and Sam Suen.
- Cadence: one large batch, then 2 to 3 posts a week.

---

## 1. The problem in one paragraph

rovmusic.com currently exposes three URLs: `/`, `/pricing`, `/sam-suen`. That is the entire indexable surface of the domain we want to rank. Meanwhile the deepest music expertise Range Of View has ever written down (12 tools with first-person session notes, 4 misconceptions, a 6-step session guide, a full history of recorded sound, and a live signals feed) sits at `rovstudios.com/ctrla/toolkit/music`, on the other side of a domain boundary, self-canonicalled to studios. The expertise and the ranking target are not connected. Everything below is the connection.

---

## 2. Layer 0: routing and host architecture

rovmusic.com is a host rewrite of this same Next app (`middleware.ts`). Two new surfaces are needed on the music host, both following the existing `/sound` prefix pattern exactly.

### 2.1 The editorial surface

Create the route tree:

```
app/sound/blog/page.tsx          -> rovmusic.com/blog
app/sound/blog/[slug]/page.tsx   -> rovmusic.com/blog/<slug>
```

Middleware changes in `middleware.ts`:

- `MUSIC_SUBPAGES` is an exact-match array. `/blog/<slug>` needs prefix matching. Add a `MUSIC_PREFIXES = ["/blog", "/toolkit"]` list and rewrite `/blog*` to `/sound/blog*` on the music host.
- Keep the existing fold-back rule: `/sound/blog*` on the music host 308s to `/blog*` so there is one canonical URL per page.
- On the studios host, `/sound/blog*` already 308s to rovmusic via the existing `/sound` rule. No change needed, but verify it survives the prefix addition.

### 2.2 Content pipeline

`lib/blog.ts` reads a single `content/blog` directory, and `getAllPosts()` feeds both `app/blog/page.tsx` and `app/sitemap.ts`. Music posts must not leak onto the studios blog or the studios sitemap.

**Approach:** add a `site` frontmatter field rather than a second content directory. One authoring pipeline, one markdown renderer, one design standard.

```ts
// lib/blog.ts
site: data.site ?? "studios",   // "studios" | "music", defaults to studios

export function getAllPosts()      // filter: site !== "music"  (studios only)
export function getMusicPosts()    // filter: site === "music"
```

The default must be `"studios"` so an author who forgets the field never accidentally publishes to the wrong domain. Add `site` to the `BlogPost` type in `lib/types.ts`.

### 2.3 Sitemap

`app/music-sitemap.xml/route.ts` is a hardcoded three-entry array. Make it dynamic: import `getMusicPosts()` and append `/blog/<slug>` entries plus the `/blog` index and `/toolkit`. Mirror how `app/sitemap.ts` already does it at line 37.

`app/music-robots.txt/route.ts` needs no change. It already welcomes GPTBot, ClaudeBot, PerplexityBot, which is exactly right for the craft-content layer.

---

## 3. Layer 1: the canonical bridge

This is the load-bearing decision. The music toolkit renders on both hosts; only rovmusic is the indexed original.

| URL | Renders | Canonical | Indexed |
|---|---|---|---|
| `rovmusic.com/toolkit` | music toolkit | self | yes, ranks |
| `rovstudios.com/ctrla/toolkit/music` | music toolkit | `rovmusic.com/toolkit` | no, credit passes |
| `rovstudios.com/ctrla/toolkit/{design,video,web-dev}` | unchanged | self | unchanged |

**Implementation:**

1. Middleware: add `/toolkit` to the music-host prefix list, rewriting to a new `app/sound/toolkit/page.tsx` that renders `ToolkitPageContent` with `id="music"`.
2. `app/ctrla/toolkit/[id]/page.tsx` `generateMetadata` currently hardcodes `canonical: https://www.rovstudios.com/ctrla/toolkit/${section.id}`. Special-case `music` to canonical at `https://www.rovmusic.com/toolkit`.
3. CTRL·A nav keeps its Sound pillar pointing at the CTRL·A URL. The community experience does not change. Only the SEO credit moves.

**Blocker found while building (2026-08-05):** step 1 above is not a simple mirror. `ToolkitPageContent.tsx` is bound to CTRL·A, not to the toolkit content: it renders the CTRL·A `NavigationDock` and `EditorialFooter`, a back link to `/ctrla`, a history link to `/ctrla/toolkit/<id>/history`, and prev/next links to the design and web-dev toolkits. Rendering it on rovmusic.com would publish CTRL·A wayfinding and four studios-bound links onto the music domain. That is a leak, not a mirror. See the open question at the end of this document.

**Honest caveat:** a cross-domain canonical is a hint to Google, not a directive, and consolidation typically takes weeks. If `ctrla/toolkit/music` already holds rankings, expect a dip before the transfer settles. Check Search Console for existing impressions on that URL before shipping, and if it is already earning, consider the phase-2 route below instead.

**Phase 2 (stronger, more work):** stop mirroring and differentiate. rovmusic.com/toolkit becomes the expanded expert version with Atlanta framing, author bylines, and service CTAs. CTRL·A keeps a shorter community cut that links out to it. Two genuinely different pages beats one canonical hint, and it removes the duplicate-content question entirely. Given a 2-to-3-per-week cadence, this is affordable within a quarter.

---

## 4. Layer 2: the cluster map

### 4.0 What we are claiming authority over (decided 2026-08-05)

Not "mixing and mastering." That claim is taken. A competitive scan found the Atlanta head terms held by [Patchwerk](https://patchwerk.com/) (Midtown, operating since 1995) and [SING Mastering](https://www.singmastering.com/), home to Colin Leonard, a multi-Grammy mastering engineer with Beyoncé, Jay-Z, Cardi B, and Lil Baby credits. No amount of writing beats a discography like that on a prestige query.

**The claim is narrower and uncontested: the independent artist's first professional record in Atlanta.**

The wedge is real and it is priced. Atlanta studio time averages roughly $102/hr. ROV is $65/hr with mix and master included, and $40 a song. Every studio on page one of that SERP is selling "world-class" and "multi-platinum." Nobody is credibly serving the artist making their first record that is actually meant to be heard. That artist has a completely different set of questions, and those questions are the topical map.

Everything below serves one sentence: **ROV Music is where an Atlanta artist takes their first record seriously.**

### 4.1 The single biggest content opportunity

That SERP is not filled with studio homepages. It is filled with directories and listicles: Yelp, SoundBetter, Peerspace, Tagvenue, roomforsound.com, atlantahits.com.

When a results page is made of listicles, the way in is to **be the best listicle**, not to fight it with a service page.

Build `rovmusic.com/atlanta-studios`: an honest, maintained comparison of Atlanta recording studios by price and by what each one is actually for. Include Patchwerk, SING, Solar Sound, Meadowlark, Bravo Ocean, and the rest, described fairly. Place ROV honestly in the first-record tier rather than at the top.

This is the highest-leverage page on the site because it does four jobs at once: it ranks for head terms as a resource rather than as an advertiser, it earns local links, it is exactly the shape AI answer engines cite, and it converts, because the reader arrives at the affordable tier already trusting the source that sent them there.

It requires the nerve to send some readers to Patchwerk. That is the price of the position, and it is worth paying.

### 4.2 Hub A: the first record (commercial)

**Hub:** `rovmusic.com/` for the core service claim, with the cluster built around cost and expectation rather than prestige.

| Spoke | Target intent |
|---|---|
| `/atlanta-studios` | The comparison resource above. Priority one. |
| `/blog/how-much-does-it-cost-to-mix-a-song-atlanta` | Price transparency. Nobody in this market publishes real numbers. |
| `/blog/first-time-in-a-recording-studio-what-to-expect` | Pure first-record intent, zero competition |
| `/blog/how-to-choose-a-mixing-engineer` | The decision query, answered honestly |
| `/blog/studio-time-with-mixing-included-atlanta` | The actual differentiated offer |

### 4.3 Hub B: craft (authority)

**Hub:** `rovmusic.com/toolkit`, "The chain we run on your record." Eight signal-path stages, each with what we reach for and the trap at that step. Spokes below expand individual stages; each one should link back up to its stage anchor.

### 4.4 Hub C: the Atlanta scene (community and local entity authority)

**Hub:** an ATL scene guide on rovmusic. Studios, open mics, showcases, venues, and who does what. The scan found the landscape genuinely fragmented across Eventbrite, allevents.in, ARTS ATL, ATL Collective, and the Atlanta Songwriters Club, with no single good hub.

This is what makes Google associate the rovmusic entity with "Atlanta music" rather than only with "mixing." It earns local links that no service page can, and it feeds Hub A directly, since an artist reading about open mics is an artist who will need a record mixed.

Spokes: open mic and showcase calendar, venues by capacity and genre, and a "who to know" page. Note honestly that a calendar carries real recurring maintenance, so only commit if it will actually be maintained.

### 4.5 Hub D: proof (the layer that makes the other three believable)

Named artists with linkable releases are available, which is the strongest asset in this entire plan and the most under-used.

Build `rovmusic.com/credits`: every record worked on, the artist named, linked to Spotify and Apple Music, with the role stated. In schema terms each named release is an edge from the ROV entity to an entity Google already knows. That is how a studio stops looking like a freelancer with a website and starts looking like an institution, and it is the one thing a competitor cannot copy by writing more posts.

### Cross-hub linking rule

Craft posts (B) link down to the service pages (A) with a single honest line, not a hard sell. Scene pages (C) link to A and to `/credits`. Every hub links to `/credits`, because proof is what each of them is missing on its own.

### Hub B: craft how-to (the authority layer)

**Hub:** `rovmusic.com/toolkit`, "The chain we run on your record." Eight signal-path stages, each with what we reach for and the trap at that step. Spokes below expand individual stages; each one should link back up to its stage anchor.

Spokes come straight out of `app/ctrla/data.ts`. Each one is an expansion of something already drafted, which is why the opening batch can be large:

*From `musicMisconceptions` (4 posts, strongest AI-citation shape, direct myth/reality Q&A):*
- Do expensive plugins actually make better mixes
- Can mastering fix a bad mix
- Do you need a treated room to mix well
- How many tracks does a song actually need

*From `musicTools` (12 posts, one per tool, review + how-we-use-it):*
- Auto-Tune Pro: retune speed, graph mode vs auto, the locked sound
- FabFilter Pro-Q: carving mud, harshness, boxiness
- The de-esser chain order (before the compressor, and why)
- LA-2A optical compression on vocals
- Little Alterboy, EchoBoy, the reverb Space knob
- Ozone and where AI mastering stops being enough
- DistroKid, splits, and keeping 100% of royalties

*From `musicSignals` (evergreen-refresh posts, updated monthly per the toolkit's stated cadence):*
- Stem separation changed remixing and cleanup
- Master for LUFS, not loudness
- When to trust an AI master and when to take over

*From `musicHistory`:*
- "Everyone has the studio, the only edge left is taste" is already a finished essay in the data file. Publish it close to as-is.

### Hub C: artist career

**Hub:** a new pillar at `rovmusic.com/blog/release-a-song` built from `musicGuide` ("Setting Up Your First Session") extended forward through release.

Spokes:
- Session template setup and why it saves 20 minutes
- Gain staging: peaks at -12dB, 24-bit/48kHz, and headroom
- Mixing in passes, not in circles
- Splits, publishing, and who owns what
- Distribution: DistroKid vs the alternatives
- Pre-save, release-day, and the first 8 seconds on a phone speaker

`/sam-suen` is the proof exhibit for this hub. Every Hub C spoke should link to it.

### Cross-hub linking rule

Craft posts (B) link down to the service pages (A) with a single honest line, not a hard sell. Career posts (C) link to `/sam-suen`. Local posts (A) link to toolkit spokes (B) to prove the expertise behind the service. That triangle is what turns three separate clusters into one topical authority.

---

## 5. Layer 3: author entities (E-E-A-T)

`lib/blog.ts` already parses `author`, `authorRole`, `authorUrl`. The wiring exists. What is missing is the entity itself.

Build two author pages on the music host:

- `rovmusic.com/authors/ayush-basu` — founder and audio engineer. This role string already appears in `musicTools.favoriteBy`, so the toolkit voice and the byline match.
- `rovmusic.com/authors/sam-suen` — in-house artist and engineer, with the Summer '26 proof numbers.

Keep these distinct from `rovmusic.com/sam-suen`, which is a case study, not an author page. Cross-link the two.

Each author page needs `Person` schema with `sameAs` pointing at Spotify, Apple Music, Instagram, and any producer credits. A working artist with verifiable streaming presence is the single strongest E-E-A-T signal available in this niche, and no competing Atlanta mixing engineer will have built it.

**Byline split:**
- Sam: craft, gear, artist-career posts.
- Ayush: service, local, business, pricing posts.
- Toolkit: attributed to Ayush, since the first-person quotes in `musicTools` are already his.

---

## 6. Layer 4: schema and technical

`components/schema/` has Breadcrumb, CreativeWork, FAQPage, HowTo, MusicOffer, Organization, Service, Video. `BlogPostingSchema` already exists at `components/blog/BlogPostingSchema.tsx` and is now host-aware (publisher, image, and `mainEntityOfPage` all follow `post.site`). Still missing:

1. **`PersonSchema.tsx`** — for the author pages, with `sameAs`.

Reuse what exists:
- `FAQPageSchema` on every post. `lib/blog.ts` already auto-parses a `## Frequently Asked Questions` section into Q&A pairs, so every post gets FAQ rich results for free by writing that heading.
- `HowToSchema` on the Hub C guide posts and the session-setup spokes.
- `BreadcrumbSchema` on everything, rooted at the rovmusic host, not studios.

**Design standard:** `CLAUDE.md` mandates the blog design standard for custom blog pages, canonical reference `app/blog/restaurant-atlanta/page.tsx`. The music blog uses a different visual world (rovmusic is dark, the standard is cream `#FFF4E3`). Decide before the batch: either the music blog gets its own documented standard in `.claude/`, or it inherits the cream standard. Do not leave this implicit or the first ten posts will drift.

**Metadata pattern:** per the established pattern, a custom design-standard blog page needs `page.tsx` + `layout.tsx` (metadata) + the `content/blog` markdown for listing and sitemap. Markdown-only posts render through `[slug]` and need no extra files.

---

## 7. Build sequence

**Phase 1, plumbing — SHIPPED 2026-08-05:**
1. ~~`site` field in `lib/types.ts` and `lib/blog.ts`, with `getMusicPosts()` and the studios-default filter.~~ Done. `getPostBySlug` and `getRelatedPosts` also take a site argument, so a slug is only reachable from its own host.
2. ~~`app/sound/blog/` route tree, middleware prefix matching for `/blog`.~~ Done via `MUSIC_SUBTREES` in `middleware.ts`.
3. ~~Dynamic `music-sitemap.xml`.~~ Done.
4. ~~Verify isolation.~~ Verified against a production build: music post appears in `rovmusic.com/sitemap.xml` and the music `/blog` listing; absent from the studios sitemap (54 URLs) and the studios `/blog` listing; `rovstudios.com/blog/<music-slug>` returns 404; `rovmusic.com/sound/blog` 308s to `/blog`; canonical, publisher, and `mainEntityOfPage` all resolve to rovmusic.

Also shipped: `BlogPostingSchema`, `BlogPostHeader`, and `BlogPostCTA` are now host-aware, with studios behaviour unchanged by default.

**Phase 2, the bridge — SHIPPED 2026-08-05 (option b, distinct pages):**
5. ~~Build `app/sound/toolkit/page.tsx`, add `/toolkit` to `MUSIC_SUBTREES`, add it to the music sitemap.~~ Done.
6. ~~Cross-domain canonical.~~ Superseded. Option (b) means two genuinely different pages, so both stay self-canonical and link to each other instead. `ToolkitPageContent` was left untouched apart from a music-only outbound card.
7. Submit `rovmusic.com/sitemap.xml` in Search Console as a separate property. This has to happen or none of the above is measured. **Still outstanding.**

**Phase 3, entities — PARTLY SHIPPED 2026-08-05:**
8. ~~`/credits`~~ Done. `app/sound/credits/` with six named releases seeded from the before/after catalogue already public in `MusicPlayer.tsx`, each emitted as a `MusicRecording` with `byArtist` and ROV as `contributor`. All six Spotify links verified live (HTTP 200). Roles are deliberately conservative: the player evidences mix and master, so that is what is claimed. Widen only to what can be backed up.
9. ~~`/atlanta-studios`~~ Done. `app/sound/atlanta-studios/`, four tiers (landmark rooms, mastering specialists, band and live-tracking rooms, first-record rooms), competitors described from their own sites only, FAQ schema on the cost questions, and the ROV rate card published in full. Accuracy rules are documented at the top of `studios-data.ts` and are not optional.
10. Author pages plus `PersonSchema` for Ayush and Sam. **Still outstanding.**
11. Decide and document the music blog design standard. **Still outstanding.**

**Phase 4, the batch:**
10. The 4 misconception posts first. They are short, already written in substance, and are the best-shaped content for AI answer engines.
11. The `/blog/release-a-song` pillar.
12. The 5 local commercial spokes.
13. Then 2 to 3 per week off the tool list.

---

## 7b. What actually moves the ranking, in order

Content is not first on this list. Ordering the work by leverage rather than by enthusiasm:

**1. Google Business Profile.** For "mixing engineer atlanta" style searches the map pack takes most of the clicks, and no page on this site can enter it without a profile. This outranks every blog post in the plan.

The complication: the studio is a home/private space. Google's rules split on whether customers come to you. Two honest options, and it is a real decision, not a formality.
- *Hide the address and register as a service-area business.* Protects privacy, still reaches the local pack, but it declares that you travel to clients, which sits badly beside selling studio time in your room.
- *List the address openly.* Strongest local signal and consistent with hourly sessions, at the cost of publishing a home address.

Either way, proximity drives local-pack ranking, so the neighborhood the studio actually sits in should be named consistently across the site, and reviews should be requested from every session as a matter of routine.

**2. Directory and listicle placement.** The first page of results is largely directories. Being present in them is distribution and link equity at once, and it requires no writing: SoundBetter, Yelp, Peerspace, plus outreach to roomforsound.com and atlantahits.com to be added to their Atlanta studio roundups. Cheap, fast, and independent of everything else here.

**3. The `/credits` page and entity schema.** See 4.5. Named releases linked to Spotify and Apple, `Person` schema on both engineers with `sameAs` to their artist profiles.

**4. `/atlanta-studios`, the comparison resource.** See 4.1. The best single content investment available.

**5. The blog cluster.** Real, compounding, and slower than all of the above. It is the fifth lever, not the first.

**Fix first, before any of it:** a search for the studio still returns `rovstudios.com/sound` rather than rovmusic.com, quoting a stale "$50/song". The migration has not been recognised, and the redirect and canonical work in this document is what starts that clock. Registering rovmusic.com in Search Console and requesting indexing is the trigger.

## 8. Open items and risks

- **RESOLVED: rovmusic.com/toolkit was built as a distinct page (option b).** It is organised by signal chain (capture, tuning, cleanup, dynamics, color, space, master, release) rather than as a grid of picks, with a "trap" callout per stage, a session-prep `HowTo`, and an FAQ. Copy lives in `app/sound/toolkit/rig.ts` and is deliberately not shared with `app/ctrla/data.ts`. Both pages stay self-canonical and cross-link.
- **The music blog and toolkit link with clean root-relative URLs** (`/pricing`, `/blog`), which are correct on the production music host. `MusicNav` instead uses `/sound/pricing`, which stays clickable on localhost but 308s in production. Two conventions now coexist. Worth picking one; the clean URLs are the SEO-correct side.
- ~~Possible price drift on the music home page.~~ **Checked against `data/soundPricing.ts` and withdrawn.** The metadata's "from $50/hr" resolves to the 4-hour block ($200 / 4 hours), and "from $40 a song" resolves to the 12-pack ($480 / 12). Both "from" claims are accurate. The rate card is: first mix $50, single $65, 3-pack $165, 6-pack $270, 12-pack $480; studio hourly $65, 2-hour $120, 4-hour $200, mix and master included at every recording rate.
- **Search Console property for rovmusic.com does not appear to be set up.** Nothing here is measurable without it. This is the highest-priority item in the whole document.
- **Toolkit internal contradiction.** `musicTools[0]` says Logic Pro is "the go-to for most of our sessions" while `dawNote` says "we usually reach for FL Studio." Both are indexed claims about how the studio actually works. Fix before the toolkit becomes the ranking pillar, since it undercuts exactly the first-hand credibility the strategy runs on.
- **Existing CTRL·A toolkit rankings.** Check impressions on `ctrla/toolkit/music` before canonicalling it away.
- **Apex DNS for rovmusic** is a known open follow-up and should be resolved before pushing links at the domain.
- **Cadence realism.** 2 to 3 posts a week is 10 to 12 a month. The toolkit supplies roughly 25 to 30 posts of raw material. That is two to three months of runway. Plan the next source of substance (client sessions, Sam's releases, the ATL scene guide series) before it runs dry.
- **The claim itself.** "Only music service experts in Atlanta" is defensible because ROV does music *and* video *and* brand for artists. Plain mixing engineers do not. That full-stack angle should appear in the local cluster explicitly, since it is the one thing competitors cannot copy by writing more posts.

---

## Changelog

- 2026-08-05: Created. Architecture for bridging the CTRL·A music toolkit to rovmusic.com as a topical authority play.
- 2026-08-05: Phase 1 shipped and verified against a production build. Logged the `ToolkitPageContent` blocker in sections 3 and 8. Corrected section 6: `BlogPostingSchema` already existed and is now host-aware.
- 2026-08-05: Shipped `/credits` and `/atlanta-studios`, the two highest-leverage pages in section 7b. Music host is now 7 URLs. Competitor facts on the studios page were verified against each studio's own site; none publish rates, which became the page's angle rather than a gap to paper over.
- 2026-08-05: Positioning decided after a competitive scan. The claim is "the independent artist's first professional record in Atlanta," not "mixing and mastering," because the prestige terms are held by Patchwerk and SING Mastering. Rewrote section 4 around four hubs (first record, craft, Atlanta scene, credits) and added section 7b ordering the work by actual ranking leverage, which puts Google Business Profile and directory placement above content.
- 2026-08-05: Phase 2 shipped as option (b). rovmusic.com/toolkit is a distinct signal-chain page with its own copy in `app/sound/toolkit/rig.ts`; CTRL·A keeps its picks grid, stays self-canonical, and gains a music-only card pointing at it. `HowToSchema` took a `baseUrl` prop so its step anchors stop hardcoding rovstudios.
