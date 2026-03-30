# ROV Blog Publisher

You validate and publish blog posts for ROV Studios. This skill has multiple modes based on the arguments provided.

## Arguments: `$ARGUMENTS`

## Modes

### Mode 1: `--approve <slug>` (Publish from review queue)
1. Read the file `content/review-queue/<slug>.md`
2. Run the validation checks (see below)
3. If validation passes:
   - Move the file from `content/review-queue/<slug>.md` to `content/blog/<slug>.md`
   - Run `git add content/blog/<slug>.md content/review-queue/`
   - Run `git commit -m "publish: <post title>"`
   - Run `git push`
   - Tell the user: "Published! Post will be live after Vercel deploys."
4. If validation fails:
   - List all failures
   - DO NOT move or publish the file
   - Tell the user what needs to be fixed

### Mode 2: `--auto <slug>` (Auto-publish, for news content)
1. Read the file from wherever it is (`content/blog/<slug>.md`, `content/review-queue/<slug>.md`, or `content/drafts/<slug>.md`)
2. Run the validation checks
3. If validation passes:
   - Ensure file is in `content/blog/<slug>.md` (move if needed)
   - Run `git add content/blog/<slug>.md`
   - Run `git commit -m "publish: <post title>"`
   - Run `git push`
4. If validation fails:
   - Move to `content/review-queue/<slug>.md` instead
   - Tell the user: "Validation failed — post moved to review queue instead of publishing."

### Mode 3: `--validate <slug>` (Dry run, no publishing)
1. Find the file in `content/blog/`, `content/review-queue/`, or `content/drafts/`
2. Run the validation checks
3. Report results (pass/fail for each check)
4. Do NOT move, commit, or push anything

### Mode 4: `--queue` (List review queue)
1. List all files in `content/review-queue/`
2. For each file, show: filename, title (from frontmatter), date created
3. Flag any files older than 7 days as "STALE"
4. If queue is empty, say "Review queue is empty."

### Mode 5: No arguments
Show help text explaining the available modes.

## Validation Checks

Run ALL of these before any publish action:

### 1. Banned Phrase Scan
Check the post content (not frontmatter) for these banned phrases (case-insensitive):
- "in today's digital landscape"
- "leverage"
- "cutting-edge"
- "seamless"
- "elevate your brand"
- "digital transformation journey"
- "unlock the potential"
- "game-changer"
- "next-level"
- "revolutionize"
- "synergy"
- "holistic approach"
- "robust solution"
- "paradigm shift"
- "best-in-class"

If any found: FAIL. List each banned phrase and the sentence it appears in.

### 2. Required Elements Check
- [ ] At least one number or date in the content (regex: `\d+`)
- [ ] At least one mention of "Atlanta", "Georgia", "GA", or "ATL" (case-insensitive)
- [ ] Title is under 60 characters
- [ ] Description is under 155 characters
- [ ] Description contains a city/state reference

If any missing: FAIL. List which elements are missing.

### 3. Frontmatter Completeness
Check that ALL required frontmatter fields are present and non-empty:
- title, slug, description, author, date, dateModified, category, tags, readingTime, atlantaAngle, published

If any missing: FAIL. List which fields are missing.

### 4. FAQ Section Check
- [ ] Post contains a "## Frequently Asked Questions" section
- [ ] At least 3 questions (### headings) under the FAQ section

If missing: WARN (not a hard fail, but flag it).

## Report Format

After validation, output a clear report:

```
VALIDATION REPORT: <slug>
========================
Banned phrases:    PASS / FAIL (list violations)
Required elements: PASS / FAIL (list missing)
Frontmatter:       PASS / FAIL (list missing fields)
FAQ section:       PASS / WARN (details)
========================
RESULT: PUBLISH / BLOCKED
```
