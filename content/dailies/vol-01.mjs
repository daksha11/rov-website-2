// ═══════════════════════════════════════════════════════
// CTRL-A — THE DAILY, Vol. 01 launch batch
// Three bangers to open with. Seed with `npm run seed:dailies`:
// day 1 = --start date (default today ET), then consecutive days.
//
// Eleven more ready-to-go questions live in reserve.mjs. To extend
// the run, move entries from there into this array (or seed them as
// their own batch: npm run seed:dailies -- --batch=reserve --start=<date>).
//
// Each entry: prompt, two options (label + text, image optional),
// pick ('a' | 'b'), and note (the two-sentence why, the payoff).
// Voice: grounded, warm, refined. Teach something every day.
// ═══════════════════════════════════════════════════════

export const volume = 1;

export const dailies = [
  {
    prompt: "Two headlines for the same portfolio site. Which is sharper?",
    a: { label: "Option A", text: "We craft unforgettable digital experiences that elevate your brand." },
    b: { label: "Option B", text: "We design websites people actually finish reading." },
    pick: "b",
    note: "A says nothing you could disprove, which means it says nothing. B makes one small claim you can picture, and specificity is what makes copy feel true.",
  },
  {
    prompt: "Same AI prompt, two openings. Which one gets the better output?",
    a: { label: "Option A", text: "Write me something good about our new product launch for social media." },
    b: { label: "Option B", text: "You are a copywriter for a small studio. Write three Instagram captions announcing our product launch: one playful, one direct, one story-led. Two sentences each." },
    pick: "b",
    note: "B gives the model a role, a format, and a way to vary. Vague in, vague out is the whole game: the quality of the answer is set before you hit enter.",
  },
  {
    prompt: "A luxury candle brand is choosing type for its labels. Which direction holds up?",
    a: { label: "Option A", text: "A quiet serif, small, with generous space around it." },
    b: { label: "Option B", text: "A bold condensed sans, large, edge to edge." },
    pick: "a",
    note: "Luxury whispers because it can afford to. Restraint and empty space read as confidence; shouting reads as clearance rack.",
  },
];
