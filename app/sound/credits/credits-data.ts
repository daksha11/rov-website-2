// Discography for rovmusic.com/credits.
//
// Why this page exists: in music, named credits linked to releases are the
// strongest authority signal there is. Each entry here is an edge from the ROV
// Music entity to an artist and a recording that Spotify and Google already
// know about, which is what separates a studio from a freelancer with a site.
//
// Seeded from the before/after catalogue already public in
// components/sound/MusicPlayer.tsx, so nothing here is a new disclosure. Every
// spotifyUrl below is a real, live track link taken from that component.
//
// ROLES ARE CONSERVATIVE. The player demonstrates before/after audio, which
// evidences mix and master. Where ROV did more than that, widen the role, but
// only to what can actually be backed up.

export interface Credit {
    /** Track title as released. */
    title: string;
    /** Artist name as credited on the release. */
    artist: string;
    /** What ROV actually did. Keep this honest and specific. */
    role: string;
    /** Live Spotify track URL. Doubles as the schema sameAs. */
    spotifyUrl: string;
    /** Cover art already shipped in /public/audio/covers. */
    cover: string;
    /** Optional: set true to surface in the featured row. */
    featured?: boolean;
}

export const credits: Credit[] = [
    {
        title: "Back in Time",
        artist: "Sam Suen",
        role: "Artist development, mix and master",
        spotifyUrl: "https://open.spotify.com/track/7MC8JAS25hJWvFXClSzFND",
        cover: "/audio/covers/backintimecover.webp",
        featured: true,
    },
    {
        title: "Talk My Shit",
        artist: "DDK",
        role: "Mix and master",
        spotifyUrl: "https://open.spotify.com/track/5Wdqmd6QqHFivymlHbMWg7",
        cover: "/audio/covers/talkmyshitcover.webp",
        featured: true,
    },
    {
        title: "Martyr",
        artist: "DDK",
        role: "Mix and master",
        spotifyUrl: "https://open.spotify.com/track/2CDURlegHo60zais4SyNbN",
        cover: "/audio/covers/martyrcover.webp",
    },
    {
        title: "Give Me Your Love",
        artist: "Lorenzo Barns",
        role: "Mix and master",
        spotifyUrl: "https://open.spotify.com/track/38SRgJ4K6R1KaeX9YHRZVn",
        cover: "/audio/covers/gimmeyourlovecober.webp",
        featured: true,
    },
    {
        title: "Guap",
        artist: "Dafes",
        role: "Mix and master",
        spotifyUrl: "https://open.spotify.com/track/0xVvZTr5prKOC6Fv9aIfwU",
        cover: "/audio/covers/guapcover.webp",
    },
    {
        title: "YKWIW",
        artist: "Basu",
        role: "Mix and master",
        spotifyUrl: "https://open.spotify.com/track/5lsskTv7eUZYIbLTEtq1cz",
        cover: "/audio/covers/ykwiwcover.webp",
    },
];

/** Artist-level profiles. sameAs links are what tie the entity graph together. */
export interface ArtistProfile {
    name: string;
    line: string;
    spotify?: string;
    apple?: string;
}

export const artistProfiles: ArtistProfile[] = [
    {
        name: "Sam Suen",
        line: "In-house artist. Every lane ROV runs, on one catalogue: brand, site, socials, shows, and the records themselves.",
        spotify: "https://open.spotify.com/artist/0xXkuHzIgsvT7a00POWMIK",
        apple: "https://music.apple.com/us/artist/sam-suen/1561994926",
    },
];

/** Rooms and stages the work has actually reached. Verifiable, not decorative. */
export const stages: { year: string; name: string; venue: string }[] = [
    { year: "2023", name: "Ted Park × Parlay Pass", venue: "Glam 104" },
    { year: "2024", name: "Hanyang Society", venue: "Believe Music Hall" },
    { year: "2025", name: "Invasian Labubu Rave", venue: "District Atlanta" },
    { year: "2026", name: "Justin Park × Junoflo & Friends", venue: "Rendezvous" },
];
