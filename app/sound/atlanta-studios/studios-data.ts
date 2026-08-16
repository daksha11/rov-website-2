// Data for rovmusic.com/atlanta-studios.
//
// STRATEGY NOTE: the Atlanta studio SERP is made of directories and listicles
// (Yelp, SoundBetter, Peerspace, Tagvenue, roomforsound, atlantahits), not
// studio homepages. The way into a listicle SERP is to be the better listicle,
// which means describing competitors fairly and sending some readers to them.
//
// ACCURACY RULES, non-negotiable, because these are real businesses:
//   1. Only facts published on each studio's own site, checked 2026-08-05.
//   2. No invented rates. None of them publish rates; say exactly that.
//   3. No disparagement. The comparison is "what is it for", not "who is worse".
//   4. Re-check before any major update and move VERIFIED_ON.
//
// If a studio publishes rates later, add them with the source. Do not estimate.

export const VERIFIED_ON = "August 2026";

export interface StudioEntry {
    name: string;
    /** Neighborhood or city as published by the studio. */
    location: string;
    /** The one-line answer to "what is this room for". */
    bestFor: string;
    /** Verified detail from the studio's own site. */
    detail: string;
    /** Named credits or track record, as the studio states them. */
    trackRecord?: string;
    /** Exactly what we could verify about pricing. Never estimate. */
    rates: string;
    url: string;
    /** True only for ROV, which drives the "this is us" styling. */
    isUs?: boolean;
}

export interface StudioTier {
    id: string;
    title: string;
    /** Who should be reading this tier. */
    who: string;
    studios: StudioEntry[];
}

export const tiers: StudioTier[] = [
    {
        id: "landmark",
        title: "Landmark rooms",
        who: "You have label money, a producer, or a session that needs a large tracking room and an SSL console. If a room like this is within reach, use it.",
        studios: [
            {
                name: "Patchwerk Recording Studios",
                location: "1094 Hemphill Ave NW, Atlanta",
                bestFor: "Full-scale tracking and analog mixing with label services attached",
                detail:
                    "Operating since 1995 across five rooms, including Studio 9000 for SSL tracking and mixing, Studio 995 for SSL Duality analog mixing, a dedicated vocal and voice-over room, a producer room, and a mastering suite. They also run label services, distribution, graphic design, and an audio engineering school.",
                trackRecord: "States 500+ hit records and albums, indie through top-charting.",
                rates: "Not published. Booking is by phone or email.",
                url: "https://patchwerk.com/",
            },
            {
                name: "Solar Sound Studio",
                location: "1453 Carroll Dr NW, Atlanta (Studio District)",
                bestFor: "Hip-hop and rap sessions with a major-label client history",
                detail:
                    "Recording, mixing, and mastering in Atlanta's Studio District, serving both indie artists and major label acts.",
                trackRecord:
                    "Lists work with Future, Young Thug, Benny the Butcher, Kevin Gates, and 8Ball & MJG.",
                rates: "Not published. Contact for a quote.",
                url: "https://solarsoundstudio.com/",
            },
        ],
    },
    {
        id: "mastering",
        title: "Mastering specialists",
        who: "Your mix is finished and you want the final stage handled by someone who does nothing else. Worth it when the record is genuinely ready.",
        studios: [
            {
                name: "SING Mastering",
                location: "Atlanta",
                bestFor: "Mastering only, including Dolby Atmos",
                detail:
                    "A dedicated mastering studio, home to engineer Colin Leonard. Mastering is the entire service; they do not position as a tracking or mixing room.",
                trackRecord:
                    "Multiple Grammy wins, with credits listing Beyoncé, Bad Bunny, Justin Bieber, Jay-Z, Cardi B, Lil Baby, Lil Uzi Vert, Elton John, Paul McCartney, and Migos. States RIAA-certified sales and streams totalling over 600 million.",
                rates: "Not published. Booking and upload by enquiry.",
                url: "https://www.singmastering.com/",
            },
        ],
    },
    {
        id: "band",
        title: "Band and live-tracking rooms",
        who: "You are a band, not a solo vocalist. You need a live room, a drum kit, and someone who records groups playing at the same time.",
        studios: [
            {
                name: "Meadowlark Audioworks",
                location: "Decatur, just outside Atlanta",
                bestFor: "Live-in-studio band sessions, with video captured alongside",
                detail:
                    "A spacious live room, professionally designed control room, iso booth, and sound lock, run by Greg Hendler and Matt Hendler. Their published work leans indie rock, psychedelic rock, pop-punk, metal, hardcore, and singer-songwriter.",
                rates: "Not published.",
                url: "https://www.meadowlarkaudioworks.com/",
            },
        ],
    },
    {
        id: "first-record",
        title: "First-record rooms",
        who: "You are making your first record that is actually meant to be heard. You need the work done properly and you need to know what it costs before you commit.",
        studios: [
            {
                name: "Range of View Music",
                location: "Atlanta",
                bestFor:
                    "Independent artists making a first serious release, with mix and master included in every recording rate",
                detail:
                    "Mixing, mastering, and studio time, plus cover art, video, and the release backend if you need them. 48-hour first pass on mixes. Rates are published in full below because the point is that you should not have to ask.",
                trackRecord:
                    "Named credits and linked releases are on our credits page. Nothing anonymous.",
                rates: "Published. See the full rate card below.",
                url: "https://www.rovmusic.com/",
                isUs: true,
            },
        ],
    },
];

/** Our own numbers, mirrored from data/soundPricing.ts. Keep in sync. */
export const ourRates: { label: string; price: string; note?: string }[] = [
    { label: "First mix and master", price: "$50", note: "Intro rate, one song" },
    { label: "Mix and master, single song", price: "$65" },
    { label: "Mix and master, 3-pack", price: "$165", note: "$55 a song" },
    { label: "Mix and master, 6-pack", price: "$270", note: "$45 a song" },
    { label: "Mix and master, 12-pack", price: "$480", note: "$40 a song" },
    { label: "Studio session, hourly", price: "$65", note: "Mix and master included" },
    { label: "Studio session, 2-hour block", price: "$120", note: "$60 an hour" },
    { label: "Studio session, 4-hour block", price: "$200", note: "$50 an hour" },
];

export const chooseSteps: { question: string; answer: string }[] = [
    {
        question: "Is your song written and arranged, or still being figured out?",
        answer:
            "Studio time is the most expensive place to write. If the arrangement is not settled, book fewer hours and demo first. Every room on this page charges for the hour whether you are recording or deciding.",
    },
    {
        question: "Do you need a room, or do you need an engineer?",
        answer:
            "If you already have usable takes, you need mixing, not studio time, and you can send stems to anyone anywhere. Paying for a live room you are not using is the most common way first-time budgets disappear.",
    },
    {
        question: "Are you tracking alone or as a band?",
        answer:
            "A solo vocalist needs a good booth and a good engineer. A band playing together needs a live room big enough to do it, which is a much smaller list of studios and a different price bracket.",
    },
    {
        question: "Is the record finished, or does it need work?",
        answer:
            "A dedicated mastering house is the right call for a finished, well-mixed record. It is the wrong call for a rough mix, because mastering amplifies what is there rather than repairing it.",
    },
    {
        question: "Can you find out the price before you book?",
        answer:
            "Every studio on this page is a real, working room, and none of them publish rates except us. Quote-only is normal in this industry and is not a red flag on its own. But you are allowed to ask for the number in writing before you commit, and a studio that will not give you one is telling you something.",
    },
];

export const studiosFaqs: { question: string; answer: string }[] = [
    {
        question: "How much does a recording studio cost in Atlanta?",
        answer:
            "Most Atlanta studios quote rather than publish, so there is no single public number. Studio rental marketplaces list Atlanta rooms averaging around $102 an hour, with budget listings closer to $35 to $55. Range of View Music publishes its full rate card: $65 an hour with mix and master included, or $200 for a four-hour block, which works out at $50 an hour.",
    },
    {
        question: "How much does it cost to mix and master a song in Atlanta?",
        answer:
            "It varies widely and most engineers quote per project. Our published rate is $50 for a first song, $65 for a single song after that, and down to $40 a song on a 12-song pack. A dedicated mastering specialist working on major-label records will be substantially more.",
    },
    {
        question: "Why do so few Atlanta studios list their prices?",
        answer:
            "Quote-based pricing is the industry norm, partly because sessions genuinely vary and partly because it keeps negotiating room. It is not dishonest. It does make it hard for a first-time artist to plan a budget, which is why we publish ours.",
    },
    {
        question: "Do I need to record in Atlanta to work with an Atlanta engineer?",
        answer:
            "No. Mixing and mastering are remote by default and most work arrives as stems from anywhere. Being in Atlanta matters when you need the room itself, which means tracking, or when you want the arrangement conversation to happen in person.",
    },
    {
        question: "Is a more expensive studio a better studio?",
        answer:
            "It is usually a bigger one. Rate mostly reflects the room, the console, and the demand for the engineer's time. A large SSL tracking room is genuinely worth it for a full band with a producer, and genuinely wasted on one vocalist over a beat.",
    },
];
