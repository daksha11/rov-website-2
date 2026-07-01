# ROV Studios — Blog Page Design Standard

Reference: `app/blog/restaurant-atlanta/page.tsx` is the canonical implementation.
Every custom blog `page.tsx` must match this spec. Do not deviate without a strong reason.

---

## Color Palette

| Role | Value | Usage |
|---|---|---|
| Page background | `#FFF4E3` | `<main>` background, FAQ section, CTA section |
| Primary dark | `#3B2114` | Body text, stats bar bg, dark cards, table headers |
| Accent rust | `#90422C` | Section H2s, links, hover states |
| Mid-brown | `#B16937` | Section labels (uppercase), secondary links |
| Highlight orange | `#EA9A61` | Numbers, arrows, chevrons, bordered accents |
| Hero gradient | `linear-gradient(160deg, #3B2114 0%, #603E25 55%, #90422C 100%)` | Hero section background only |
| Cream text | `#FFF4E3` | Text on dark backgrounds |
| Muted cream text | `rgba(255,244,227,0.82)` | Hero subtitle |
| Muted dark text | `rgba(59,33,20,0.7)` | FAQ answers, body on cream |
| Separator | `rgba(59,33,20,0.12)` | Horizontal rules, borders |

---

## Typography

### Fonts (always in this order)
- **Display / Headings:** `Norwige, sans-serif`
- **Body / UI copy:** `Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`
- **Labels / metadata:** `'Neue Montreal', sans-serif`

### Scale

| Element | Font | Size | Weight | Color |
|---|---|---|---|---|
| H1 (hero) | Norwige | `clamp(36px, 6vw, 64px)` | 400 | `#FFFFFF` |
| H2 (sections) | Norwige | `clamp(26px, 4vw, 38px)` | 400 | `#90422C` |
| H3 (card titles) | Inter | `18px` | 700 | `#B16937` |
| Stat number | Norwige | `clamp(32px, 5vw, 48px)` | 400 | gradient `#EA9A61 → #90422C` |
| Body copy | Inter | `17px` | 400 | `#3B2114` |
| Small body | Inter | `16px` | 400 | `rgba(59,33,20,0.7)` |
| Section label | Neue Montreal | `11px`, `0.22em` tracking, uppercase | 700 | `#B16937` |
| Meta / date | Neue Montreal | `13px` | 400 | `rgba(255,244,227,0.45)` |
| FAQ questions | Norwige | `clamp(17px, 2.5vw, 22px)` | 700 | `#3B2114` / `#90422C` open |
| Table header | Neue Montreal | `12px`, uppercase | 700 | `#FFF4E3` on `#3B2114` |

---

## Page Structure (in order)

Every custom blog page must include these sections in this order:

### 1. Hero
- Background: hero gradient
- Logo: `<Link href="/"><Image src="/rov-logo.webp" width={48} height={48} /></Link>`
- Breadcrumb: `ROV Studios · [Category] · [Topic]` — cream, 55% opacity
- H1: Norwige, white, `clamp(36px, 6vw, 64px)`, weight 400
- Subtitle paragraph: 18px, `rgba(255,244,227,0.82)`, max-width 600
- Author pill: beige `#FFF4E3` background, dark `#3B2114` text, pill shape (borderRadius 100), avatar + name

### 2. Stats Row
- Background: `#3B2114`
- CSS grid `repeat(auto-fit, minmax(180px, 1fr))`
- Each stat: large Norwige number with orange gradient, white label, muted cream sub-label
- Numbers use `WebkitBackgroundClip: "text"` gradient technique

### 3. Main Content Area
- Background: `#FFF4E3`
- Max-width: `760px`, centered, `padding: "48px 24px 80px"`
- **Table of Contents:** light card, numbered in `#EA9A61`, links in `#3B2114`
- **Section headings (H2):** Norwige, `#90422C`
- **Body paragraphs:** Inter, 17px, lineHeight 1.75, `#3B2114`
- **Pull quotes:** left border `4px solid #EA9A61`, `rgba(234,154,97,0.08)` bg, Norwige italic 22px
- **Stat callouts:** dark card `#3B2114`, gradient number, cream text
- **Full-bleed images:** `margin: "0 -24px 56px"`, relative positioning, caption overlay with `rgba(59,33,20,0.75)` bg
- **Numbered steps:** `#EA9A61` step number, Inter H3 in `#B16937`, body in `#3B2114`, bottom border between steps
- **Data tables:** dark header `#3B2114`, alternating cream/transparent rows, change column in `#90422C` bold
- **Info boxes:** `rgba(144,66,44,0.08)` bg, `1px solid rgba(144,66,44,0.2)` border, borderRadius 12

### 4. FAQ Accordion
- Background: `#FFF4E3`, `padding: "0 24px 64px"`
- Top border separator
- Label: "Frequently asked" — 11px, `0.22em` tracking, `#B16937`
- Questions: Norwige bold, `clamp(17px, 2.5vw, 22px)`, `#3B2114` closed / `#90422C` open
- Chevron: `#EA9A61`, rotates 180° on open
- Answers: Inter, 16px, `rgba(59,33,20,0.7)`
- Animation: `grid-template-rows` transition (`0fr` → `1fr`)
- First item open by default (`useState<number | null>(0)`)

### 5. Author Card
- Background: `#3B2114`, borderRadius 16, padding `28px 32px`
- Avatar: 64px circle, `2px solid rgba(234,154,97,0.4)` border
- Name: white, 700, 16px
- Role: `#EA9A61`, 13px, Neue Montreal
- Last updated line: thin separator, white text

### 6. CTA Section
- Background: `#FFF4E3`
- Border: `1.5px solid rgba(59,33,20,0.15)`, borderRadius 16
- H2: Norwige, `#3B2114`, centered
- Subtitle: `rgba(59,33,20,0.7)`, max-width 480
- Primary button: `#90422C` bg, `#FFF4E3` text, pill shape
- Secondary button: transparent, `#3B2114` text, `1.5px solid rgba(59,33,20,0.25)` border

---

## Design Elements Cheatsheet

### Image captions
```jsx
<div style={{ position: "absolute", bottom: 16, left: 24, background: "rgba(59,33,20,0.75)", color: "#FFF4E3", fontSize: 12, padding: "6px 12px", borderRadius: 6, backdropFilter: "blur(4px)" }}>
  Caption text here.
</div>
```

### Section label (uppercase eyebrow)
```jsx
<p style={{ fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: "#B16937", fontFamily: "'Neue Montreal', sans-serif", fontWeight: 700 }}>
  Label text
</p>
```

### Pull quote
```jsx
<blockquote style={{ margin: "32px 0", padding: "24px 28px", borderLeft: "4px solid #EA9A61", background: "rgba(234,154,97,0.08)", borderRadius: "0 8px 8px 0" }}>
  <p style={{ fontFamily: "Norwige, sans-serif", fontSize: 22, lineHeight: 1.5, color: "#3B2114", margin: 0, fontStyle: "italic" }}>
    &ldquo;Quote text here.&rdquo;
  </p>
</blockquote>
```

### Info/summary box
```jsx
<div style={{ background: "rgba(144,66,44,0.08)", border: "1px solid rgba(144,66,44,0.2)", borderRadius: 12, padding: "24px 28px" }}>
  <p style={{ fontFamily: "'Neue Montreal', sans-serif", fontSize: 13, fontWeight: 700, color: "#90422C", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>Box title</p>
  <p style={{ fontSize: 16, lineHeight: 1.7, margin: 0 }}>Content here.</p>
</div>
```

### Dark stat callout card
```jsx
<div style={{ background: "#3B2114", borderRadius: 12, padding: "28px 32px", margin: "32px 0", display: "grid", gridTemplateColumns: "auto 1fr", gap: 24, alignItems: "center" }}>
  <div style={{ fontFamily: "Norwige, sans-serif", fontSize: 56, background: "linear-gradient(135deg, #EA9A61, #90422C)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", lineHeight: 1 }}>76%</div>
  <div>
    <p style={{ color: "#FFF4E3", fontSize: 16, lineHeight: 1.6, margin: 0 }}>Stat description text.</p>
    <p style={{ color: "rgba(255,244,227,0.8)", fontSize: 12, marginTop: 8, marginBottom: 0 }}>Source: Name</p>
  </div>
</div>
```

### Before / After data table
```jsx
<div style={{ overflowX: "auto", margin: "32px 0" }}>
  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 15 }}>
    <thead>
      <tr style={{ background: "#3B2114" }}>
        {["Metric", "Before", "After", "Change"].map((h) => (
          <th key={h} style={{ padding: "12px 16px", textAlign: "left", color: "#FFF4E3", fontFamily: "'Neue Montreal', sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>{h}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {ROWS.map((row, i) => (
        <tr key={i} style={{ background: i % 2 === 0 ? "rgba(59,33,20,0.04)" : "transparent" }}>
          {row.map((cell, j) => (
            <td key={j} style={{ padding: "12px 16px", borderBottom: "1px solid rgba(59,33,20,0.08)", color: j === 3 ? "#90422C" : "#3B2114", fontWeight: j === 3 ? 700 : 400, fontFamily: j === 3 ? "'Neue Montreal', sans-serif" : "inherit" }}>{cell}</td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
</div>
```
In a markdown post, a normal `|` table renders in this exact style automatically (see BlogPostBody table CSS).

### Numbered step cards (01 / 02 / 03)
```jsx
{STEPS.map((item) => (
  <div key={item.n} style={{ display: "grid", gridTemplateColumns: "48px 1fr", gap: 20, marginBottom: 36, paddingBottom: 36, borderBottom: "1px solid rgba(59,33,20,0.1)" }}>
    <div style={{ fontFamily: "'Neue Montreal', sans-serif", fontSize: 13, fontWeight: 700, color: "#EA9A61", paddingTop: 4, letterSpacing: "0.05em" }}>{item.n}</div>
    <div>
      <h3 style={{ fontFamily: "Inter, sans-serif", fontSize: 18, fontWeight: 700, color: "#B16937", marginBottom: 12 }}>{item.title}</h3>
      <p style={{ fontSize: 16, lineHeight: 1.75, color: "#3B2114", margin: 0 }}>{item.body}</p>
    </div>
  </div>
))}
```

### Then → Now growth cards
```jsx
<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, margin: "32px 0" }}>
  {CARDS.map((item, i) => (
    <div key={i} style={{ background: "#3B2114", borderRadius: 12, padding: "24px 20px", color: "#FFF4E3" }}>
      <div style={{ fontSize: 13, color: "rgba(255,244,227,0.85)", marginBottom: 8, fontFamily: "'Neue Montreal', sans-serif" }}>{item.then}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <span style={{ fontSize: 20, fontWeight: 700, textDecoration: "line-through", color: "rgba(255,244,227,0.35)" }}>{item.from}</span>
        <span style={{ color: "#EA9A61", fontSize: 12 }}>→</span>
        <span style={{ fontFamily: "Norwige, sans-serif", fontSize: 26, color: "#EA9A61" }}>{item.now}</span>
      </div>
      <div style={{ fontSize: 13, color: "#FFF4E3", fontWeight: 600 }}>{item.label}</div>
    </div>
  ))}
</div>
```

---

## Density Rule — USE THESE, don't just write paragraphs

A page that is all body text fails the standard. Break up the prose. Target, per page:

- **At least 1 pull quote** — the single most surprising line, lifted out
- **At least 1 dark stat callout OR a stats row** — every page has a number worth blowing up
- **At least 1 table** (before/after, comparison, or "what we changed") when there is data
- **At least 1 info/summary box** — usually "The short version" near the end
- **Numbered step cards** whenever you describe a process (what we changed, how it works)
- **An image with caption** every 2-3 sections, never a wall of text longer than ~3 short paragraphs

Rule of thumb: a reader scrolling fast with the sound off should understand the story from the bubbles, quotes, numbers, and images alone. If two H2 sections in a row have no visual element between them, add one.

**Markdown posts** (`/rov-draft`) can natively use: pull quotes (`> blockquote`), tables (`|`), images, and bold callouts. The dark stat callouts, step cards, growth cards, and stats row require a custom `page.tsx` build.

---

## Technical Rules

- Every page that uses `useState` must have `"use client"` at top — cannot use `export const metadata`
- Required imports: `useState` (React), `ChevronDown` (lucide-react), `Image` (next/image), `Link` (next/link), `dynamic` (next/dynamic)
- NavigationDock and Footer always dynamic with `{ ssr: false }`
- Full-bleed images use `margin: "0 -24px"` to break out of the `24px` padding container
- All responsive font sizes use `clamp()` — no fixed px on headings
- Logo always links to `/`

---

## What NOT to do

- Do not use dark backgrounds for the CTA section
- Do not use gradient text for H1 in the hero — use solid white
- Do not use `bg-black` or any Tailwind dark theme classes on this page
- Do not use different fonts — Norwige for display, Inter for body, Neue Montreal for labels only
- Do not skip the author pill in the hero using cream bg with dark text
- Do not make the FAQ section dark — it must use `#FFF4E3` cream

---

## Max Content Width

- Main content: `maxWidth: 760`
- CTA subtitle: `maxWidth: 480`
- FAQ container: `maxWidth: 760`
- Full-bleed images break out with `margin: "0 -24px"`
