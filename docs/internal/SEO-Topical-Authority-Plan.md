# SEO Topical Authority Plan

_Created 2026-07-30. Audit + task list. No implementation done yet._

## The three clusters, in priority order

| # | Cluster | Job | Hub | Status |
|---|---------|-----|-----|--------|
| 1 | Atlanta web design + cost | Traffic engine. Only cluster with real local buying volume. | `/web` | Exists, hub is broken (see T1) |
| 2 | Brand identity + the experience it flows into | Differentiation + AI citation. Why they pick us over cheaper. | `/brand` | **Does not exist** |
| 3 | Industry + Atlanta | Beats national competitors on local specificity. | `/industries` | Built, all six `indexed: false`, Andi-gated |

Supporting cluster: local visibility ("why isn't my business showing up on Google") feeds cluster 1 rather than standing alone.

Geography: Atlanta-first, but keep hub copy geo-neutral enough to expand nationally later.

## Audit findings

**F1. The `/web` hub does not link down to its cluster.** Each of the five children
carries 7 to 10 internal links, but `app/web/page.tsx` contains zero `href="/web/..."`.
Spokes point outward and upward; the hub points nowhere. Topical authority is largely a
link-structure signal, so this is the highest-value fix on the list.

**F2. `/web/missed-call-text-back-atlanta-hvac` is orphaned.** The route exists but is
absent from `app/sitemap.ts`, while its four siblings are listed explicitly.

**F3. All six industry pages are noindex.** `indexed: false` in frontmatter drives
`robots: { index: false, follow: false }` in `app/industries/[slug]/page.tsx` and excludes
them from the sitemap. They are reachable by direct link (the Phase 1 outreach design), so
they look published but earn zero search value. Promotion is deliberately gated on Andi.

**F4. No `/brand` route exists,** despite brand identity being practice area #1 in
`company.md`. Cluster 2 has nothing to point at.

**F5. The `externalUrl` stub pattern is correct.** Seven `content/blog/*.md` files are
stubs that 308-redirect to canonical `/web/*` pages and are filtered out of the sitemap.
Keep this pattern for any new cluster.

## Honest constraints on cluster 2

- "Brand identity" queries skew research-stage, not buying-stage. The buying queries are
  `branding agency atlanta` and `brand identity designer atlanta`, and that pool is small.
- Email/lifecycle head terms (`welcome email sequence`, `abandoned cart email`) are owned by
  Klaviyo, HubSpot, Shopify, Mailchimp as product marketing. Do not compete head-on.
- **The ownable wedge is the gap between the two halves:** businesses buy a logo, then send
  confirmation emails that look like 2009 receipts. Agencies do identity, SaaS does email,
  almost nobody does both. That framing is specific, true, defensible, and citable by AI
  search because it names a problem that isn't already answered a thousand times.
- Winnable queries in the wedge: `branded email template design`,
  `why do my emails look unprofessional`, `post-purchase experience design`,
  `brand consistency across touchpoints`, `thank you page design`.

ROV builds and ships the flows, not just the designs, so cluster 2 content should target
buyers of that service. It is a real revenue line and is not yet listed among the four
practice areas in `company.md`.

## Task list

### Now, structural, no new writing
- **T1** Add a cluster links section to `app/web/page.tsx` pointing at all five children with descriptive anchor text. Fixes F1.
- **T2** Add `/web/missed-call-text-back-atlanta-hvac` to `app/sitemap.ts`. Fixes F2.
- **T3** *(Andi's call, pending)* Flip `indexed: true` on the industry pages. One line per file, reversible. Blocks T5.

### Next, still no new writing
- **T4** Audit the seven non-stub blog posts for whether they link into `/web`. Several are cluster-1 topics sitting outside the cluster.
- **T5** Point the three industry-matched blog posts at their `/industries` pages. Depends on T3.

### Then, new writing, in order
- **T6** Build the `/brand` hub. Identity work and the experience layer on one page, organized around the wedge, not around a service menu.
- **T7** Cluster 2 spokes, buyer-facing: branded email template design, post-purchase experience, thank-you page design, brand consistency across touchpoints.
- **T8** Cluster 1 buying-intent spokes under `/web`: timeline, what's included, Wix vs custom, who owns the code.
- **T9** Local-visibility hub with the gap report as the conversion step.
- **T10** Only after clusters 1 and 2 hold: repeat the hub-and-spoke shape for video.

### Follow-ups outside the site
- Fill the "What makes us different" and "Who we serve" TODOs in `R.O.V/company.md`. The brand-plus-experience positioning answers the first one.
- Decide whether email/lifecycle becomes a fifth listed practice area.

---

# Blog Action Plan

_Added 2026-07-30. Covers all 13 existing posts plus the forward queue._

## The defect worth fixing first

`category` is not decoration. It drives related-post linking by **exact string match**
(`lib/blog.ts:127`), the card color map (`components/blog/BlogCard.tsx:4`), and
`articleSection` in `BlogPostingSchema`. Right now 13 posts carry 8 different category
values, which means the clustering mechanism you already have is mostly not firing.

Concretely:
- `restaurant-atlanta.md` has `category: "web-design"` (lowercase, hyphenated) while three
  other posts use `"Web Design"`. Exact match fails, so it gets **zero related posts** and
  falls through to the gray default card style.
- `"Creative Direction"` (2 posts) is absent from `categoryColors`, so those cards are gray too.
- `"Branding"`, `"Branding & Web Design"`, `"Web Development"`, and `"Marketing"` each hold
  1 to 2 posts, splitting the cluster into singletons that can never surface each other.

**Because category drives related posts, category should equal cluster, not content type.**
Case studies belong in their cluster's category, not a separate "Case Study" bucket. Use
`tags` and `featured` for the case-study distinction.

## Proposed controlled vocabulary

Four values total. Add the two new ones to `categoryColors` or they render gray.

| Category | Cluster | Color status |
|---|---|---|
| `Web Design` | 1, traffic engine | exists |
| `Brand & Experience` | 2, differentiation | **new, needs color** |
| `Local Visibility` | 1 support | **new, needs color** |
| `AI Automation` | outlier, leave alone | exists |

Retire: `Creative Direction`, `Branding`, `Branding & Web Design`, `web-design`,
`Web Development`, `Marketing`.

## Per-post actions, all 13

| Post | Category now | Change to | Other action |
|---|---|---|---|
| `restaurant-atlanta` | `web-design` | **`Web Design`** | Fixes the broken-match defect |
| `creative-studios-atlanta` | Creative Direction | **`Brand & Experience`** | Repoint at `/brand`; it's cluster 2's best existing asset |
| `creative-studio-vs-agency-vs-freelancer` | Creative Direction | **`Brand & Experience`** | Repoint at `/brand`; decision-stage spoke |
| `dkm-corp-brand-identity` | Branding & Web Design | **`Brand & Experience`** | Closest thing to a cluster 2 proof piece; refresh `dateModified` |
| `design-toolkit` | Branding | **`Brand & Experience`** | Stub, no body change |
| `ikna-ecommerce-growth` | Branding & Web Design | **`Web Design`** | Refresh `dateModified` |
| `thebando-brand-transformation` | Web Design | keep | Refresh `dateModified` |
| `web-dev-toolkit` | Web Development | **`Web Design`** | Stub, no body change |
| `real-estate-agent-playbook` | Marketing | **`Web Design`** | Judgment call: supports the real-estate web cluster |
| `why-isnt-my-business-showing-up-on-google` | Marketing | **`Local Visibility`** | Becomes cluster anchor for T9 |
| `how-much-does-a-website-cost-in-atlanta` | Web Design | keep | Cluster 1 anchor, leave alone |
| `real-estate-agent-website-atlanta` | Web Design | keep | Leave alone |
| `skills-that-matter-in-the-ai-era` | AI Automation | keep | Genuine outlier, fits no cluster. Don't build around it. |

Four case studies are still stamped `2026-03-30` with `dateModified` equal to `date`. Refresh
`dateModified` when the category edit touches them.

## The content gap

**Zero existing posts sit in cluster 2's actual wedge.** `dkm-corp-brand-identity` is brand
identity work, and the two creative-studio posts are positioning pieces. Nothing covers email
funnels, thank-you campaigns, or touchpoint experience. The entire new positioning has no
supporting content. That is the whole reason for the forward queue below.

## Forward queue, priority order

Cluster 2, buyer-facing, since ROV builds and ships the flows.

- **N1. "What a Branded Email Funnel Costs in Atlanta"** · target `email funnel cost`,
  `branded email design pricing`. **Highest priority.** Mirrors the exact shape of your
  proven winner (`how-much-does-a-website-cost-in-atlanta`). Pricing posts win snippets and
  AI citations because competitors hide numbers.
- **N2. "Why Your Confirmation Emails Undo Your Brand"** · target
  `branded email template design`, `why do my emails look unprofessional`. The wedge argument
  in its sharpest form.
- **N3. "The Thank-You Page Is the Most Wasted Page on Your Site"** · target
  `thank you page design`. Low competition, high specificity.
- **N4. "The Five Emails Every Atlanta Business Should Send After a Purchase"** · target
  `post-purchase experience design`. Listicle shape, good for AI extraction.
- **N5. "Brand Guidelines That Survive Contact With Email"** · target
  `brand consistency across touchpoints`. Ties identity work to the experience layer.
- **N6. "Do You Need a Rebrand, or Just Better Touchpoints?"** · target `do i need a rebrand`.
  Decision-stage, captures existing rebrand search volume and redirects it to your offer.

Write N1 through N3 before N4 through N6. Do not start any of them before the `/brand` hub
(T6) exists, or they have nothing to link up to.

## Also missing

`/web/missed-call-text-back-atlanta-hvac` has **no `content/blog` stub at all**, which is why
it is orphaned. It needs both: an `externalUrl` stub file so it appears in the blog listing,
**and** an explicit `app/sitemap.ts` entry, because stubs are filtered out of `blogPosts`.

## Execution log and corrections, 2026-07-30

B1, B2, B4, B5 and T1 are done. Build and `tsc --noEmit` both clean. Two claims in the
sections above turned out to be wrong once verified, and one new finding is bigger than the
defect this batch set out to fix.

**Correction 1: the related-posts rail is dead code for every current post.**
`getRelatedPosts` is called in exactly one place, `app/blog/[slug]/page.tsx:93`. But all 14
files in `content/blog/` are either `externalUrl` stubs (8, which redirect away) or have a
custom page under `app/blog/<slug>/` (6, which bypass the `[slug]` route entirely). **Zero
posts render through `[slug]`,** so `getRelatedPosts` never executes.

So `restaurant-atlanta` really was getting zero related posts, but not because of the
`web-design` case mismatch. It gets zero because its custom page never calls the function.
Normalizing categories does not by itself restore any internal links.

What the category fix does still deliver, verified: correct labels and colors on the `/blog`
listing cards (`BlogCard`, real and user-visible), correct `articleSection` on the 2 custom
pages that use `BlogPostingSchema`, and a correct taxonomy ready for the rail below.

**Correction 2: `Local Visibility` was reverted to `Web Design`.** A category with one member
returns an empty array from `getRelatedPosts`, with no fallback. Splitting
`why-isnt-my-business-showing-up-on-google` into a solo category would remove links rather
than add them. The `categoryColors` entry is kept and commented as reserved. Split it out when
the local-visibility hub (T9) ships actual siblings.

Final counts: `Web Design` 9, `Brand & Experience` 4, `AI Automation` 1 (14 total, including
the new HVAC stub).

**New finding, F6: the custom blog pages barely link to each other.**

| Custom page | Links to other `/blog/*` | Uses `BlogPostingSchema` |
|---|---|---|
| `creative-studio-vs-agency-vs-freelancer` | 3 | yes |
| `creative-studios-atlanta` | 1 | yes |
| `thebando-brand-transformation` | 1 | no |
| `dkm-corp-brand-identity` | **0** | no |
| `ikna-ecommerce-growth` | **0** | no |
| `restaurant-atlanta` | **0** | no |

Three of your six real article pages, including both restaurant assets, link to no other post
at all. This is the actual internal-linking gap and it is larger than the taxonomy issue.

**B3 was deliberately skipped.** Bumping `dateModified` on posts whose body text did not change
signals freshness that does not exist. Do it during a real content pass on those case studies,
not as part of a taxonomy edit.

## Second execution pass and corrections, 2026-07-30

**Correction 3: F6 was wrong. All six custom pages already have a "Related reading" section.**
The earlier count grepped for `href="` and missed links written as `href: "` inside link
arrays, which is how every one of these sections is built. So "three pages link to zero other
posts" was a measurement artifact, not a fact.

**Correction 4: B9 was unnecessary as written.** `components/blog/RelatedPosts.tsx` already
exists and is commented out at `app/blog/[slug]/page.tsx:116` behind a deliberate
`TODO: Re-enable RelatedPosts when blog has 20+ posts`. Since no post renders through `[slug]`
(Correction 1), re-enabling it would change nothing. Left as-is. The hand-built sections in the
custom pages are the real rail and they work.

**What the link audit actually found, and what got fixed:**

- **One broken link.** `restaurant-atlanta` pointed at `/blog/every-business-leaks-money`,
  which has no content file. A 404 sitting in the related-reading block of a flagship asset.
  Repointed at `/web/why-isnt-my-business-showing-up-on-google`.
- **Three redirect hops.** `creative-studios-atlanta` (2 links) and
  `creative-studio-vs-agency-vs-freelancer` (1 link) pointed at
  `/blog/how-much-does-a-website-cost-in-atlanta`, which is an `externalUrl` stub that
  308-redirects. Repointed straight at the canonical `/web/` page.
- **Thin link blocks thickened.** `dkm-corp-brand-identity` had no links to any sibling article,
  `ikna-ecommerce-growth` and `restaurant-atlanta` had one each. Added cluster-mate links.

Article-to-article link counts after the pass (links to `/blog/*` or `/web/*` guides):

| Page | Before | After |
|---|---|---|
| `creative-studio-vs-agency-vs-freelancer` | 5 | 5 |
| `creative-studios-atlanta` | 5 | 5 |
| `dkm-corp-brand-identity` | 0 | 3 |
| `ikna-ecommerce-growth` | 1 | 3 |
| `restaurant-atlanta` | 1 (broken) | 3 |
| `thebando-brand-transformation` | 2 | 2 |

A validation script now checks every internal href in `app/blog/*/` against the filesystem:
`/blog/<slug>` must have a content file and must not be a stub, everything else must have a
route directory. It reports 0 problems. Worth re-running after any content edit. `tsc --noEmit`
and `next build` both clean, 101 static pages.

**Standing rule this pass established:** never link to a `/blog/<slug>` that is an `externalUrl`
stub. Link to the canonical target directly. The stubs exist for listing discovery only.

## Sequenced blog task list

- ~~**B1** Add `Brand & Experience` and `Local Visibility` to `categoryColors`.~~ Done.
- ~~**B2** Apply the category changes in the table above.~~ Done, 9 files, `Local Visibility` reverted (see corrections).
- **B3** ~~Refresh `dateModified` on the 4 stale case studies.~~ Skipped on purpose. Fold into a real content pass.
- ~~**B4** Create the `missed-call-text-back-atlanta-hvac` stub plus its sitemap entry.~~ Done, sitemap now 49 URLs.
- ~~**B5** Verify related-posts output after B2.~~ Done, and it revealed the rail never runs. See Correction 1.
- ~~**B9** Add a related-posts rail to the 6 custom blog pages.~~ Not needed. They all already
  have one. See Correction 4.
- ~~**B10** Hand-add contextual links to the thin pages.~~ Done, plus fixed one 404 and three
  redirect hops the audit surfaced. See Correction 3.
- **B6** Repoint the two creative-studio posts at `/brand`. Depends on T6.
- **B7** Write N1 through N3. Depends on T6.
- **B8** Write N4 through N6.

B9 and B10 are the highest-value remaining structural work and neither needs the `/brand` hub.
B6 onward still waits on T6.

## Expected timeline

T1 and T2 are same-day. Structural fixes typically take two to three months to show
movement, and cluster 2 will always convert better than it traffics. Judge cluster 1 on
rankings and cluster 2 on lead quality and AI citations, not on raw sessions.
