import type { ToolkitHistory } from "../../../../data";

// ═══════════════════════════════════════════════════════
// DEVELOPMENT — A HISTORY
// How building got cheap. Centered on the through-line that the same
// annoyed person in Finland changed how the world builds, twice.
// ═══════════════════════════════════════════════════════

export const webDevHistory: ToolkitHistory = {
  entryLabel: "A history lesson",
  title: "How building got cheap.",
  lede: "In one lifetime, building software went from a room full of specialists to a kid on a laptop at midnight. And more than once, the person who moved the whole world was just someone mildly annoyed who gave their fix away.",
  moments: [
    {
      era: "1969",
      title: "The first two computers talk",
      hook: "Two machines, one message, and the word crashed the system halfway through. The network was born anyway.",
      motif: "dev-nodes",
      body: "A team sent the first message between two computers on ARPANET. They typed L, O, and it crashed before G. The internet started with a two letter login and a bug.",
      whyItMattered: "The web is not a place, it is machines agreeing to pass notes, and that agreement is fifty years of the same idea scaled up.",
    },
    {
      era: "1991",
      title: "The web goes public",
      hook: "One man put the first website online and told nobody they needed permission. They never did. Try it yourself below.",
      motif: "dev-browser",
      interactive: "codepen",
      body: "Tim Berners-Lee published the first web page and gave the whole system away: HTTP, HTML, the URL, no license, no gatekeeper. Anyone with a connection could read it, and soon, write to it.",
      whyItMattered: "The web's superpower was never the tech, it was that it was open. Nobody has to approve your page. That is still the deal, and it is why a studio can outrun an agency.",
    },
    {
      era: "1991",
      title: "Just a hobby",
      hook: "A 21 year old in Helsinki posted that he was building a free operating system, just a hobby, nothing big or professional. It now runs most of the internet and every Android phone on earth.",
      motif: "dev-penguin",
      quote: {
        text: "I'm doing a (free) operating system (just a hobby, won't be big and professional).",
        attribution: "Linus Torvalds, 1991",
      },
      body: "Linus Torvalds, a student in Finland, announced Linux on a mailing list with a shrug, gave the source away, and let thousands of strangers build it with him. Today it runs the servers behind almost every website, all of Android, and the world's supercomputers.",
      whyItMattered: "The most important software of the era was started by one person who was mildly annoyed and gave it away. You do not need permission or a company. You need to start the thing and let others in.",
    },
    {
      era: "1995",
      title: "A language written in ten days",
      hook: "JavaScript was built in ten days as a throwaway. It now runs on nearly every screen on earth.",
      motif: "dev-braces",
      body: "Brendan Eich wrote the first JavaScript under a rushed deadline, meant as small glue for a browser. It became the most widely deployed language in history.",
      whyItMattered: "The lesson is not that fast is good. It is that the thing you ship to solve a small problem can outlive every grand plan around it.",
    },
    {
      era: "2004",
      title: "The page stops reloading",
      hook: "Gmail and Google Maps loaded once and never blinked again. The web quietly became software.",
      motif: "dev-ajax",
      body: "A technique called Ajax let a page fetch new data without reloading. Maps dragged smoothly, email updated live, and the document became an application.",
      whyItMattered: "This is the moment websites became products. Everything this kit builds, apps that feel native in a browser, starts the day the page stopped flashing white.",
    },
    {
      era: "2005",
      title: "The same man, fourteen years later",
      hook: "Linux got so big its version control broke. So Linus sat down and, in about ten days, wrote Git. Now nearly every developer on earth builds on it.",
      motif: "dev-branch",
      interactive: "branchgraph",
      quote: {
        text: "I'm an egotistical bastard, so I name all my projects after myself. First Linux, now Git.",
        attribution: "Linus Torvalds",
      },
      body: "By 2005 thousands were contributing to Linux, and the tool tracking all those changes pulled its free license. Rather than beg or wait, Torvalds wrote his own in roughly ten days and named it Git, British slang for an unpleasant person. GitHub built a social network on top of it, and now it is how the world's code is kept.",
      whyItMattered: "Twice now, the same person solved a problem for himself, gave the answer away, and changed how everyone works. That is the pattern this whole kit is chasing. Build the tool you wish existed.",
    },
    {
      era: "2013",
      title: "The interface becomes a tree",
      hook: "React let you build a screen out of small reusable pieces, and describe what it should look like instead of how to change it.",
      motif: "dev-tree",
      body: "React introduced the component model and the idea that you declare the end state and let the machine handle the DOM. Screens became Lego instead of clay.",
      whyItMattered: "The design-to-code handoff this whole studio runs on assumes this. A button built once, used everywhere. The dev kit lives here.",
    },
    {
      era: "2010s",
      title: "Deploy in seconds",
      hook: "Renting a server used to take weeks. Now you push to a branch and it is live worldwide before your coffee is cold.",
      motif: "dev-cloud",
      body: "The cloud, then platforms like Vercel, turned infrastructure into a commodity you never see. No racks, no ops team, no waiting. Global deployment became a git push.",
      whyItMattered: "The last excuse died here. There is nothing between an idea and a live URL but the building, and the kit is built to close that last gap.",
    },
    {
      era: "Now",
      title: "The barrier drops again",
      hook: "AI can write the boilerplate, so the scarce thing is knowing what to build and having the taste to know when it is right.",
      motif: "dev-caret",
      body: "AI assistants now handle the parts that used to take years to learn. The floor is gone, anyone can produce working code. What they cannot fake is judgment.",
      whyItMattered: "This is the whole thesis of the kit. The tools are handled, and the advantage moved entirely to taste, intent, and the will to actually ship.",
    },
  ],
  closer: "Twice, one annoyed person in Finland changed how the entire world builds, just by making his own fix and giving it away. The barrier is lower now than it has ever been. You are early. Build.",
};
