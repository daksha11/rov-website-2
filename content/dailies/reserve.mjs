// ═══════════════════════════════════════════════════════
// CTRL-A — THE DAILY, reserve bench
// Ready-to-go questions not yet scheduled. The launch trio lives
// in vol-01.mjs. To publish from here, either move entries into
// the live batch file, or seed this file directly:
//   npm run seed:dailies -- --batch=reserve --start=YYYY-MM-DD
// Order matters: consecutive dates from --start.
// ═══════════════════════════════════════════════════════

export const volume = 1;

export const dailies = [
  {
    prompt: "A coffee shop needs a button under its menu. Which CTA earns the click?",
    a: { label: "Option A", text: "Order ahead. Skip the line." },
    b: { label: "Option B", text: "Explore our ordering options." },
    pick: "a",
    note: "A gives you the action and the reward in six words. B asks the reader to do homework. A button is a promise, not a menu.",
  },
  {
    prompt: "Two subject lines for the same newsletter. Which gets opened?",
    a: { label: "Option A", text: "Our March Newsletter: Updates, News and More!" },
    b: { label: "Option B", text: "The mistake in your homepage hero (we made it too)" },
    pick: "b",
    note: "A describes the container, B describes the contents. Curiosity plus a little humility beats an announcement every time.",
  },
  {
    prompt: "A photographer's homepage. Which layout call is right?",
    a: { label: "Option A", text: "One full-bleed photo, name in the corner, nothing else above the fold." },
    b: { label: "Option B", text: "A grid of 12 thumbnails so visitors see the range immediately." },
    pick: "a",
    note: "One image forces a first impression; twelve images ask the visitor to average them. Lead with your best frame and let the grid live one scroll down.",
  },
  {
    prompt: "Two bios for the same designer. Which one would you keep reading?",
    a: { label: "Option A", text: "Passionate multidisciplinary creative leveraging design thinking to deliver impactful solutions." },
    b: { label: "Option B", text: "I design brand systems for small teams that are tired of looking small." },
    pick: "b",
    note: "A is written to sound impressive and lands as wallpaper. B names who it is for and the feeling it fixes. Buzzwords are what confidence looks like when it has nothing to say.",
  },
  {
    prompt: "A band is naming its debut EP. Which title has more pull?",
    a: { label: "Option A", text: "Emotions" },
    b: { label: "Option B", text: "Crying at the Gas Station" },
    pick: "b",
    note: "A is a category, B is a scene. The specific image does what a title is for: it starts the story before the first track plays.",
  },
  {
    prompt: "Same landing page, two color calls. Which is the better instinct?",
    a: { label: "Option A", text: "Five brand colors used evenly so the palette gets full expression." },
    b: { label: "Option B", text: "One dominant neutral, one accent, and the accent appears only on things you can click." },
    pick: "b",
    note: "When the accent means something, the page teaches people where to act. Color used evenly is decoration; color used sparingly is information.",
  },
  {
    prompt: "Two ways to end a cold email to a dream client. Which closes stronger?",
    a: { label: "Option A", text: "Let me know if you'd ever like to chat about potential opportunities to collaborate!" },
    b: { label: "Option B", text: "If the timing is wrong, a no is genuinely useful. Either way, the teardown of your checkout page is attached, keep it." },
    pick: "b",
    note: "B gives before it asks and makes replying easy in both directions. A asks the reader to do the work of inventing the next step.",
  },
  {
    prompt: "A cafe's Instagram. Which caption fits a photo of the morning rush?",
    a: { label: "Option A", text: "Nothing beats the hustle and bustle of a busy morning! #coffee #cafelife #community" },
    b: { label: "Option B", text: "7:42am. The espresso machine has not stopped since we unlocked the door." },
    pick: "b",
    note: "B trusts the photo and adds a detail only an insider would know. Hashtag piles and exclamation points are how captions apologize for themselves.",
  },
  {
    prompt: "Two error messages for a failed payment. Which one keeps the customer?",
    a: { label: "Option A", text: "Error 402: Transaction could not be processed at this time." },
    b: { label: "Option B", text: "Your card didn't go through. Nothing was charged. Try again, or use another card." },
    pick: "b",
    note: "B answers the three questions a person actually has: what happened, am I safe, what now. Error copy is design's most honest moment.",
  },
  {
    prompt: "A studio is picking its logo lockup for small sizes. Which call survives?",
    a: { label: "Option A", text: "The full wordmark with the tagline underneath, shrunk to fit." },
    b: { label: "Option B", text: "A simplified monogram, tagline dropped entirely." },
    pick: "b",
    note: "A logo that needs its tagline at 24 pixels was not finished. Identity systems earn trust by knowing what to remove at each size.",
  },
  {
    prompt: "Two openings for a case study. Which makes you read paragraph two?",
    a: { label: "Option A", text: "We were thrilled to partner with Meridian Coffee on a comprehensive brand refresh across all touchpoints." },
    b: { label: "Option B", text: "Meridian's sales were fine. Their problem was that nobody could remember them the next day." },
    pick: "b",
    note: "B opens with the tension, and tension is the only reason anyone reads on. A opens with the vendor congratulating itself, which is the fastest way to lose the room.",
  },
];
