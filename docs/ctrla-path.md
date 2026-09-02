# CTRL·A · The Path

The spine every CTRL·A surface reads. Decided with Andi on 2026-09-01 after
the ICP interview: CTRL·A is the open-source school for Atlanta's
first-timers, and the thing a person walks away with is a **first finished
piece**. The path is how the site gets them there.

## Five stops, every craft

| Stop | What | Counts when | Source |
|---|---|---|---|
| Learn | the craft toolkit | scrolled to the end of the toolkit | auto |
| Look | a brand kit | a kit is exported | auto |
| Work | Lock In and the Daily | a Lock In session finishes, or a Daily answer lands | auto |
| Finish | the first finished piece (`/ctrla/finish/[craft]`) | the person pastes the link | self |
| Show | submit it | an editor approves the submission | review |

Look and Work are shared across crafts (stored under craft `all`); Learn,
Finish, and Show are per craft. The first piece per craft: a released song,
a kit and a portfolio page, a live site, a short film.

## Where things live

```
lib/ctrla/path.ts        the registry: stops, titles, hrefs, what counts
lib/ctrla/progress.ts    local progress + useCtrlAPath(); markDone()
lib/ctrla/sync.ts        push/merge with the account; signInWithGoogle()
lib/ctrla/profile.ts     the quiz profile (unchanged contract)
app/api/ctrla/path       GET / POST (merge) / DELETE (forget me)
supabase/sql/ctrla-path-setup.sql
                         profiles.ctrla_profile, ctrla_progress, RLS
app/ctrla/_components/CtrlAPathSync.tsx   mounted once in the layout
app/ctrla/_components/SignInGate.tsx      the hard gate + useSession()
app/ctrla/finish/[craft]                  the Finish stop
```

## Identity rules

- Signed out: profile and progress live in localStorage and everything
  reads them. Nothing is lost on this device.
- Signed in: `CtrlAPathSync` pushes the local copy to `/api/ctrla/path` on
  every visit and after every local change (debounced), merges with the
  account copy, and writes the merge back locally. Newest profile wins;
  the earliest completion of a stop wins. Nothing can undo progress.
- **Gated (needs Google sign-in):** building a kit, marking Finish,
  submitting. Reading is free, always. `SignInGate` is the one gate.
- **Forget me:** `DELETE /api/ctrla/path` clears the account copy;
  `clearProgress()` + `clearProfile()` clear the device. (Account page
  control still to be added.)

## Running the SQL

Run `supabase/sql/ctrla-path-setup.sql` in the Supabase SQL editor once.
It is idempotent. Until it runs, the API returns errors in the server log
and the site keeps working from localStorage.

## Wired so far

- `ExportStep.tsx` → Look
- `DailyTasteTest.tsx`, `FoldSession.tsx` → Work
- `ToolkitPageContent.tsx` → Learn
- `api/ctrla/review` → Show (service role, on approve/feature)
- `brand-kit/builder/layout.tsx` → gated
- `YourPath.tsx` (full / strip / line) on: the home page under the cover,
  the nav bar (replaces "Start here" once a path exists) and menu panel,
  the toolkit masthead, the quiz reveal, and the account page (with the
  forget-me control). The home hero CTA points at the next stop.

## The contribution loop (step 3, shipped 2026-09-01)

```
lib/ctrla/contribute.ts                  ranks, good-first asks per craft, house changelog
app/ctrla/_components/Contributors.tsx   toolkit foot: "Improved by", last 5 commits, good-first asks
app/ctrla/changelog                      every commit, ours and theirs, by month
app/ctrla/_components/Rank.tsx           Visitor / Artist / Resident line (account page)
```

- **Ranks** mirror Discord. Visitor: nothing yet. Artist: a first piece
  finished, or one approved contribution. Resident: three approved, or one
  featured. `rankFor()` is the one rule; retune it there.
- **Good first contributions** are four concrete asks per craft, each a
  real submission type. Links carry `?toolkit=<craft>` and the form
  pre-chooses it. Shown on the toolkit foot, the Finish page, and the hub.
- **Bylines**: `Contributors` reads `ctrla_community_wall` (approved and
  featured only) and names public authors, linking to `/ctrla/u/[handle]`.
- **Changelog** merges the wall with `HOUSE_CHANGELOG`. Add a house line
  when something a member would notice ships.
- Public profiles show rank and "n of 5 stops" from `ctrla_public_progress`.

## Next

1. Space: the five planets become the five stops; `visited` becomes
   progress.
2. Credits: reward path stops instead of disconnected actions.
3. Toolkit beginner mode (content: simple, big copy, plain steps) picked
   by `profile.level`; the strip and done marks are already in.
4. Finish checklists grow with contributions (music and development
   first, video next, then design). The asks are live; the content is the
   work.
