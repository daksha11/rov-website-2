# ROV Social Media Generator

You generate ready-to-copy social media text from published blog posts for ROV Studios' LinkedIn and Instagram accounts.

## Arguments: `$ARGUMENTS`

If a slug or file path is provided, use that post. If no argument provided, list recent posts from `content/blog/` and ask which one to generate social content for.

## Step 1: Read the Post

Read the blog post markdown file. Extract:
- Title
- Key results/numbers
- Main takeaway
- Atlanta angle
- Category (case-study vs news — tone differs)

## Step 2: Generate LinkedIn Post

### Format:
- 1-3 paragraphs
- Professional but not corporate — ROV's voice is direct and results-focused
- Lead with the result or insight, not "We're excited to announce..."
- Include 1-2 relevant numbers from the post
- End with a soft CTA (link to the blog post or booking page)
- 3-5 relevant hashtags at the bottom

### LinkedIn Template (adapt, don't copy verbatim):

For case studies:
```
[Headline result in one sentence]

[1-2 paragraphs: what the client needed, what we built, what happened]

[The result with specific numbers]

Read the full case study: https://rovstudios.com/blog/{slug}

#WebDesign #Atlanta #[Industry] #ROVStudios
```

For news posts:
```
[Attention-grabbing take on the trend]

[Why this matters for businesses — 1-2 paragraphs]

[What to do about it — actionable takeaway]

Full breakdown on our blog: https://rovstudios.com/blog/{slug}

#WebDesign #Atlanta #[Topic] #ROVStudios
```

### Anti-Slop (same rules apply):
- No "excited to share", "thrilled to announce", "proud to present"
- No "in today's digital landscape", "leverage", "cutting-edge", "seamless"
- Lead with value, not self-congratulation
- Write like a sharp peer, not a PR department

## Step 3: Generate Instagram Caption

### Format:
- Engaging opening line (hook — this shows in the preview before "...more")
- 2-3 short paragraphs (Instagram readers skim)
- More casual and community-focused than LinkedIn
- End with a CTA: "Link in bio" or "DM us"
- 20-30 relevant hashtags in a separate block at the bottom

### Instagram Template (adapt, don't copy verbatim):

For case studies:
```
[Hook: the one-line result that makes people stop scrolling]

[Short story: what we did, 2-3 sentences max]

[The numbers that matter]

Full story on our blog — link in bio.

.
.
.

#WebDesign #AtlantaBusiness #WebDevelopment #[Industry] #SmallBusiness #Atlanta #Georgia #DigitalMarketing #WebDesigner #ROVStudios #CaseStudy #Results #BusinessGrowth #[5-10 more relevant hashtags] #WebDesignAgency #AtlantaAgency #CreativeAgency
```

For news posts:
```
[Hot take or question that sparks curiosity]

[Why this matters — keep it tight, 2-3 sentences]

[What Atlanta businesses should know]

What do you think? Drop your take below.

.
.
.

#WebDesign #AtlantaBusiness #[Topic] #TechNews #DigitalMarketing #SmallBusiness #Atlanta #ROVStudios #[10-15 more relevant hashtags]
```

### Hashtag Rules:
- Always include: #ROVStudios #Atlanta #WebDesign
- Mix broad (#DigitalMarketing, 1M+ posts) with niche (#AtlantaWebDesign, smaller)
- Include industry-specific tags based on the post topic
- 20-30 total hashtags for Instagram
- 3-5 total for LinkedIn

## Step 4: Output

Display both versions clearly with headers:

```
=== LINKEDIN ===
[LinkedIn post text]

=== INSTAGRAM ===
[Instagram caption + hashtags]
```

Also save to `content/social/{slug}-social.md` with both versions for reference.

Tell the user: "Social posts saved to content/social/{slug}-social.md — copy and paste to your platforms."

## Step 5: Create social directory if needed

If `content/social/` doesn't exist, create it.
