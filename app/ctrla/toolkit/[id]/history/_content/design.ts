import type { ToolkitHistory } from "../../../../data";

// ═══════════════════════════════════════════════════════
// DESIGN — A HISTORY
// The people who drew the world. The designer and typography canon:
// named legends, real typefaces, the marks you see every day.
// ═══════════════════════════════════════════════════════

export const designHistory: ToolkitHistory = {
  entryLabel: "A history lesson",
  title: "The people who drew the world.",
  lede: "Design has a canon, a lineage of names most people never learn but see every single day. These are the designers and typographers whose work you have looked at a thousand times without knowing it.",
  moments: [
    {
      era: "1450s",
      title: "Gutenberg cuts the first type",
      hook: "Gutenberg carved letters into metal so they could be set, inked, and printed again and again. Typography, and the modern world, started with reusable letters.",
      motif: "des-punch",
      body: "Johannes Gutenberg cut a punch for each letter of a blackletter script, cast them in metal, and built the movable type press. His 42 line Bible proved a page could be reproduced perfectly, by the thousand.",
      whyItMattered: "Every font you have ever chosen descends from those first punches. The whole discipline starts with one goldsmith and a set of metal letters.",
    },
    {
      era: "1500s",
      title: "Garamond, the letters that outlived everyone",
      hook: "Claude Garamond cut roman typefaces so good that five hundred years later you are still reading them. Type it below and see.",
      motif: "des-serif",
      interactive: "typespecimen",
      body: "Garamond was among the first to cut type as its own profession, not a printer's side task. His letterforms were so balanced they never went out of use, and Garamond is still a default in books and brands. Bodoni and Baskerville later pushed contrast and elegance, each name now a typeface you know.",
      whyItMattered: "Type is the rare design that outlives its maker by centuries. Get the fundamentals right and the work endures long after the trends around it are gone.",
    },
    {
      era: "1930s",
      title: "The crystal goblet",
      hook: "The best typography, one legend wrote, is a crystal goblet: you are meant to see the wine, not the glass.",
      motif: "des-goblet",
      quote: { text: "Type well used is invisible as type.", attribution: "Beatrice Warde" },
      body: "Beatrice Warde argued that type well used is invisible, its job to carry the words, not show off. Jan Tschichold turned that belief into a system in the 1920s with functional, asymmetric layouts, then spent his life refining the rules, even setting the standards for Penguin's paperbacks.",
      whyItMattered: "Restraint is the whole game. When people notice your typography before your message, something has gone wrong.",
    },
    {
      era: "1957",
      title: "Helvetica and the Swiss machine",
      hook: "Two Swiss designers drew a typeface so neutral it became the default voice of the modern world, from tax forms to subway signs.",
      motif: "des-helvetica",
      body: "Max Miedinger and Eduard Hoffmann designed Helvetica as clean, neutral, and rational. The same year, Adrian Frutiger released Univers with a numbered system of weights, treating a typeface like an engineered family. The Swiss style, the grid, and near religious restraint took over corporate design for decades.",
      whyItMattered: "Neutral is a choice, and a powerful one. Half of what the design kit calls good taste, the grid, the white space, the calm, was codified by these Swiss typographers.",
    },
    {
      era: "1960s",
      title: "Paul Rand makes the logo a system",
      hook: "Paul Rand turned IBM, UPS, and ABC into a few perfect marks, and argued a logo is the company's signature, not decoration.",
      motif: "des-logo",
      quote: { text: "Design is the silent ambassador of your brand.", attribution: "Paul Rand" },
      body: "Rand brought European modernism to American business and designed identities that lasted fifty years. He argued design was strategy, not styling, and once talked Steve Jobs through why the NeXT logo worked. His marks are so simple they look inevitable.",
      whyItMattered: "This is where design grew up into identity and systems, the backbone of what the studio does. Simple is not easy. A mark that feels obvious took the most work.",
    },
    {
      era: "1960s",
      title: "Saul Bass, design that moves",
      hook: "Saul Bass made the opening titles of Psycho and Vertigo their own art form, and drew logos for AT&T and United that ran for decades.",
      motif: "des-title",
      body: "Bass proved a title sequence could set a film's whole mood before a line of dialogue, using cut paper, motion, and type. He also designed some of the most enduring corporate logos in America. Same eye, two scales.",
      whyItMattered: "Motion and identity are one craft, which is exactly why the studio's video and design kits talk to each other. A mark can move. A moment can be branded.",
    },
    {
      era: "1972",
      title: "Vignelli, if you can design one thing",
      hook: "Massimo Vignelli designed the New York subway signage and believed that with enough discipline you could design anything, from a spoon to a city.",
      motif: "des-subway",
      quote: { text: "If you can design one thing, you can design everything.", attribution: "Massimo Vignelli" },
      body: "Vignelli was a total designer, working across furniture, books, signage, and identity with a small set of typefaces and iron consistency. His 1972 New York subway system is still a design landmark. He treated design as a lifelong fight against ugliness.",
      whyItMattered: "The systems mindset, one consistent language applied everywhere, is the professional core of the design kit. Taste plus discipline scales. Whim does not.",
    },
    {
      era: "1977",
      title: "Milton Glaser, warmth against the grid",
      hook: "While the Swiss chased neutrality, Milton Glaser drew I love NY and the rainbow Bob Dylan poster, and proved design could be joyful and human.",
      motif: "des-heart",
      quote: { text: "There are three responses to design: yes, no, and wow. Wow is the one to aim for.", attribution: "Milton Glaser" },
      body: "Glaser was the great humanist of American design. The I love NY mark may be the most reproduced logo in history, given away free to help the city. His work had wit and heart, a deliberate counterweight to cold modernism.",
      whyItMattered: "Not everything should be neutral. The best studios hold both, Swiss discipline and Glaser warmth, and know when each one is right. Taste is choosing between them.",
    },
    {
      era: "1984",
      title: "Susan Kare draws the machine a face",
      hook: "Susan Kare designed the original Macintosh icons pixel by pixel, and made a cold computer feel friendly enough for everyone.",
      motif: "des-pixel",
      body: "Working on a tight grid of black and white pixels, Kare drew the trash can, the paintbrush, the smiling Mac, and the fonts that gave the first Macintosh its warmth. She was doing typography and iconography at the smallest possible scale.",
      whyItMattered: "Design at the pixel is still design. Constraint sharpens taste rather than limiting it, and the friendliness of good software traces straight back to her grid.",
    },
    {
      era: "Now",
      title: "The canon meets the machine",
      hook: "AI can imitate every one of these legends in seconds. What it cannot do is know which of them the moment calls for.",
      motif: "des-gen",
      body: "Generative tools have swallowed the surface of every style in this history. You can ask for Rand, or Swiss, or Glaser, and get a passable copy instantly. What no model has is the reason, the taste to know why one choice is right for this client, now.",
      whyItMattered: "The names in this history were not great because of their tools. They were great because of their judgment, the one thing that is not for sale.",
    },
  ],
  closer: "You have seen the work of every designer in this history today, on a sign, a screen, a box, a logo, without knowing their names. That is the goal. The best design does the work and lets the name disappear.",
};
