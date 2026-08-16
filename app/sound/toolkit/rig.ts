// Content for rovmusic.com/toolkit.
//
// Deliberately NOT shared with app/ctrla/data.ts. The CTRL A music toolkit is a
// community artifact: a flat grid of picks plus the history of recorded sound.
// This page is the commercial expert page for the music host, and it is
// organised by signal chain, the order a vocal actually moves through one of our
// sessions. Same studio, different question. CTRL A answers "what should I try",
// this answers "what happens to my record when I hand it over".
//
// Keeping the copy separate is the point: two genuinely different pages remove
// the duplicate-content question instead of managing it with a canonical hint.

export interface ChainStage {
    /** Two-digit rail number. */
    step: string;
    /** Stage of the signal path. */
    title: string;
    /** What this stage is actually for, in one line. */
    purpose: string;
    /** The longer explanation. Written to be quotable by an answer engine. */
    body: string;
    /** What we reach for, and the setting that matters. */
    tools: { name: string; note: string }[];
    /** The mistake we see most often at this stage. */
    trap: string;
}

export const chainStages: ChainStage[] = [
    {
        step: "01",
        title: "Capture",
        purpose: "Everything downstream is a reaction to what the mic heard.",
        body: "Post amplifies what you captured, it does not invent it. A clean take is easier to mix than a hot one, and no plugin recovers a distorted peak. We gain stage so peaks land around -12dB and record at 24-bit/48kHz, which leaves enough headroom that the rest of the chain has room to work.",
        tools: [
            { name: "Pop filter, six inches back", note: "Closer is not better. Proximity buildup is a low-end problem you pay for twice." },
            { name: "24-bit / 48kHz", note: "The session standard. Higher rates cost storage and buy nothing you can hear." },
        ],
        trap: "Recording hot because the meter looks exciting. Peaks at -3dB leave the compressor nothing to grab and bake in harshness you cannot undo.",
    },
    {
        step: "02",
        title: "Tuning",
        purpose: "Pitch is a performance decision before it is a correction.",
        body: "We tune by hand first, then let Auto-Tune ride on top. Hand tuning in graph mode fixes the notes that are genuinely wrong while leaving the drift and scoop that make a vocal sound human. Auto mode then holds the whole take in place. Retune Speed is the entire sound: slow reads as natural, near zero is the locked effect that became its own genre.",
        tools: [
            { name: "Auto-Tune Pro, graph mode", note: "Detailed by-hand work. This is the pass that decides whether the vocal sounds sung or processed." },
            { name: "Auto-Tune Pro, auto mode", note: "Rides on top of the hand-tuned take to hold pitch in real time." },
        ],
        trap: "Reaching for auto mode alone and turning Retune Speed to zero because it sounds confident. It flattens the performance and there is no way back once it is printed.",
    },
    {
        step: "03",
        title: "Cleanup",
        purpose: "Take away what is wrong before adding anything that is right.",
        body: "Most of what people call a bad vocal is a frequency problem, not a performance problem. Mud, harshness, and boxiness each live in a predictable place, and carving them out is subtractive work that happens before any compression. Sibilance gets handled here too, and the order matters: the de-esser sits before the compressor so the compressor is not reacting to harshness and pumping the whole take in response.",
        tools: [
            { name: "FabFilter Pro-Q", note: "Surgical subtractive EQ. Find the offending band, cut it, move on." },
            { name: "A transparent de-esser", note: "Placed before the compressor. Single-vocal or wideband depending on how wide the problem is." },
        ],
        trap: "Boosting to fix. If it sounds muddy, cut the mud instead of boosting the top. Boosting stacks gain and pushes the next stage into working harder than it should.",
    },
    {
        step: "04",
        title: "Dynamics",
        purpose: "Hold the vocal in one place so it sits in the record.",
        body: "A vocal that swings 20dB between the verse and the hook cannot sit in a mix at a single fader level. Optical compression smooths that without sounding like a machine did it, which is why the LA-2A circuit is still the reference forty years on. We compress in service of consistency, not loudness. If you can hear the compressor working, it is doing too much.",
        tools: [
            { name: "LA-2A style optical compressor", note: "Smooth, musical, forgiving. Works on vocals and bass alike." },
        ],
        trap: "Compressing to make it louder. That is the fader's job. Compression is about range, and using it for volume costs you the dynamics that make a hook land.",
    },
    {
        step: "05",
        title: "Color",
        purpose: "The part that stops being correction and starts being taste.",
        body: "Once the vocal is clean and steady, character is a choice rather than a repair. Formant shifting, doubling, and analog-modeled delay are where a record starts sounding like a specific record instead of a competent one. This is the stage where the reference tracks in the session actually earn their place.",
        tools: [
            { name: "Little Alterboy", note: "Formant and pitch shifting for doubles, hard-panned thickeners, and effect vocals." },
            { name: "EchoBoy", note: "Delay with character. Throws and slaps that sit behind the lead instead of competing with it." },
        ],
        trap: "Adding color to fix a problem from stage 03. Effects on an uncleaned vocal amplify the mud rather than covering it.",
    },
    {
        step: "06",
        title: "Space",
        purpose: "Depth without washing the record in mud.",
        body: "Reverb is the easiest way to make a mix sound worse, because the thing it adds most efficiently is low-mid buildup. A reverb with a Decay Rate EQ lets you keep the tail while pulling the frequencies that turn a room into a fog. We set the size first and the amount last, and we do not touch it at all until levels are right.",
        tools: [
            { name: "A natural reverb with Decay Rate EQ", note: "One Space knob from a tight room to a cathedral. Shape the tail, not just the amount." },
        ],
        trap: "Setting reverb early. Reverb decisions made before the levels are balanced always end up too wet, because you were using it to hide a level problem.",
    },
    {
        step: "07",
        title: "Master",
        purpose: "Polish, not repair.",
        body: "Mastering enhances a good mix. If the mix is muddy, mastering makes it a louder muddy mix. The other half of the job is target loudness: streaming normalization keeps winning, so we master for LUFS and dynamics rather than for the loudest possible file. A master that wins the volume war gets turned down by the platform anyway, and arrives flat.",
        tools: [
            { name: "Ozone", note: "AI-assisted starting point, manual controls when precision matters. The skill is knowing which half you need." },
        ],
        trap: "Sending a mix to mastering hoping it gets fixed. It gets amplified. Every problem you left in is a problem the master makes louder.",
    },
    {
        step: "08",
        title: "Release",
        purpose: "The record is not finished until it is live and the splits are clean.",
        body: "Distribution is the cheap part now. The part artists get wrong is paperwork: splits agreed after a song does well are the single most common way collaborations end badly. Agree them in writing before release, while everyone is still happy. Then the artwork, the metadata, and the release date are all one job rather than three panics.",
        tools: [
            { name: "DistroKid", note: "Unlimited uploads, you keep 100% of royalties, splits handled in the platform." },
        ],
        trap: "Releasing before splits are written down. It is a conversation that costs nothing in advance and costs friendships afterward.",
    },
];

/** Studio advice, written as what we actually say in a first session. */
export const beforeYouBook: { claim: string; truth: string }[] = [
    {
        claim: "I need better plugins first.",
        truth: "Stock plugins in Logic or Pro Tools get you roughly 90% of the way. We have finished records on stock chains. Learn one EQ and one compressor completely before you buy a third of either. Skill compounds, plugin folders do not.",
    },
    {
        claim: "Mastering will fix it.",
        truth: "Mastering is polish, not repair. It makes a good mix competitive and a bad mix loud. If something is wrong, it gets fixed in the mix or it gets fixed in a re-record, and knowing which one is most of the job.",
    },
    {
        claim: "I need a treated room before I can mix.",
        truth: "Knowing how your room lies to you matters more than making it stop. Reference on car speakers, earbuds, a phone, and monitors. Engineers who know their room beat engineers with a better one.",
    },
    {
        claim: "More tracks means a bigger record.",
        truth: "Some of the best records ever made used eight tracks or fewer. Arrangement is about what you leave out. If a part does not serve the song, muting it is the mix move.",
    },
];

/** Session prep. Emitted as HowTo schema, so keep steps concrete and ordered. */
export const sessionPrep: { title: string; steps: { title: string; body: string }[] } = {
    title: "How to show up with a session we can work on",
    steps: [
        {
            title: "Pick a DAW and stay in it for six months",
            body: "Logic, Pro Tools, Ableton, FL Studio, or something free. It genuinely does not matter which. They all reach the same finish line, and speed comes from muscle memory, not features. Do not DAW-hop.",
        },
        {
            title: "Build a session template",
            body: "Pre-route lead vocal, doubles, adlibs, beat bus, and master. Color code it. A template saves about twenty minutes at the top of every session, which is twenty minutes you are not paying us to spend on routing.",
        },
        {
            title: "Record clean takes with headroom",
            body: "Peaks around -12dB, 24-bit/48kHz, pop filter six inches out. A clean recording is easier and faster to mix than a hot one, and it costs nothing to do right.",
        },
        {
            title: "Export consolidated stems from bar one",
            body: "Every stem starting at the same point, no plugins printed unless the effect is part of the performance. Name them plainly. Mislabeled stems are the most common reason a first pass takes two days instead of one.",
        },
        {
            title: "Send two or three reference tracks",
            body: "Not songs you like. Songs that sound like what you want this record to sound like. References settle more arguments in five minutes than a paragraph of adjectives settles in an hour.",
        },
        {
            title: "Agree the splits before release",
            body: "In writing, while everyone is still happy about the song. Producer, features, writers. This is the step people skip and the only one that gets more expensive with time.",
        },
    ],
};

export const toolkitFaqs: { question: string; answer: string }[] = [
    {
        question: "Do I need to mix and master with the same engineer?",
        answer: "No, and there is an argument for fresh ears on the master. We do both because it shortens the loop: when the master reveals a mix problem, we go back and fix the mix instead of compensating for it. If you already have a mix you love, we will master it on its own.",
    },
    {
        question: "What do you need from me to start?",
        answer: "Consolidated stems from bar one, named plainly, with no printed effects unless the effect is part of the performance. Two or three reference tracks. A note on what is bothering you about the current version. That is enough to start a first pass.",
    },
    {
        question: "How long does a mix take?",
        answer: "First pass typically inside 48 hours once we have usable stems. Revisions are faster. Sessions that arrive with mislabeled or unconsolidated stems take longer, which is why the prep list above exists.",
    },
    {
        question: "Can you fix a vocal that was recorded badly?",
        answer: "Sometimes, and we will tell you honestly which case you are in before you pay. Pitch, timing, and mild room tone are workable. Clipping, heavy bleed, and a blown low end are not, because post amplifies what was captured rather than replacing it. Re-recording one take is often cheaper than three rounds of repair.",
    },
    {
        question: "Do you work with artists outside Atlanta?",
        answer: "Yes. Mixing and mastering are remote by default and most of our work arrives as stems. Atlanta artists additionally get studio time, which is where the tracking and the arrangement conversations happen in the room.",
    },
    {
        question: "What makes you different from any other mixing engineer in Atlanta?",
        answer: "We are a studio, not only an engineer. The same team that mixes your record can shoot the visual, build the artwork, and put the release page together. For most artists the bottleneck is not the mix, it is everything that has to happen around it.",
    },
];
