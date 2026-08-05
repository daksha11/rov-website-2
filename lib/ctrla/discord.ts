// lib/ctrla/discord.ts
// ─────────────────────────────────────────────────────────────
// One source of truth for the CTRL-A Discord.
//
// Two halves:
//   1. Invite links — public, safe in client bundles. One code per
//      surface, because Discord counts uses per invite code. That
//      gives free join attribution with no UTM plumbing: Server
//      Settings → Invites shows exactly which surface sends people.
//   2. getRoomSnapshot() — SERVER ONLY. Reads live guild stats with a
//      bot token. Never import this half into a client component.
//
// Env (all optional; everything degrades to "unconfigured" quietly):
//   NEXT_PUBLIC_DISCORD_INVITE          fallback for every surface
//   NEXT_PUBLIC_DISCORD_INVITE_FOOTER   CTRL-A footer (EditorialFooter)
//   NEXT_PUBLIC_DISCORD_INVITE_HUB      /ctrla join section
//   NEXT_PUBLIC_DISCORD_INVITE_TOOLKIT  /ctrla/toolkit/[id]
//   NEXT_PUBLIC_DISCORD_INVITE_ATL      /ctrla/atl
//   NEXT_PUBLIC_DISCORD_INVITE_SIGNUP   email-signup success state
//   DISCORD_GUILD_ID                    server id (server-side)
//   DISCORD_SITE_BOT_TOKEN              read-only bot (server-side)
// ─────────────────────────────────────────────────────────────

/** Accepts a bare code ("aB3xY") or a full URL, returns a full URL. */
function toInviteUrl(value: string | undefined): string | null {
  const raw = value?.trim();
  if (!raw) return null;
  if (/^https?:\/\//i.test(raw)) return raw;
  return `https://discord.gg/${raw.replace(/^discord\.gg\//i, "")}`;
}

const FALLBACK = toInviteUrl(process.env.NEXT_PUBLIC_DISCORD_INVITE);

/**
 * Per-surface invites. Each falls back to NEXT_PUBLIC_DISCORD_INVITE, so
 * setting that one variable lights up every surface at once; add the
 * specific ones later when you want the attribution split.
 *
 * A value is `null` when nothing is configured. Callers MUST handle null by
 * hiding the link — linking to a wrong or dead server is worse than no link.
 */
export const DISCORD_INVITES = {
  /** Not a surface — the plain link, for metadata/schema. */
  canonical: FALLBACK,
  /** The CTRL-A footer. Deliberately NOT on the main rovstudios footer: the
   *  Discord is a CTRL-A thing, not a studio-wide one. */
  ctrlaFooter: toInviteUrl(process.env.NEXT_PUBLIC_DISCORD_INVITE_FOOTER) ?? FALLBACK,
  ctrlaHub: toInviteUrl(process.env.NEXT_PUBLIC_DISCORD_INVITE_HUB) ?? FALLBACK,
  toolkit: toInviteUrl(process.env.NEXT_PUBLIC_DISCORD_INVITE_TOOLKIT) ?? FALLBACK,
  atl: toInviteUrl(process.env.NEXT_PUBLIC_DISCORD_INVITE_ATL) ?? FALLBACK,
  signup: toInviteUrl(process.env.NEXT_PUBLIC_DISCORD_INVITE_SIGNUP) ?? FALLBACK,
} as const;

export type DiscordSurface = keyof typeof DISCORD_INVITES;

/** True once at least the fallback invite is set. */
export const DISCORD_CONFIGURED = FALLBACK !== null;

/**
 * Below this, show the next event instead of the headcount. A small number
 * on a join button costs joins — an empty room reads as a dead room. Once
 * the count helps rather than hurts, this flips itself.
 */
export const MIN_MEMBERS_TO_SHOW = 50;

// ── server only ──────────────────────────────────────────────

export interface RoomEvent {
  name: string;
  /** ISO 8601 UTC start time. */
  startsAt: string;
}

export interface RoomSnapshot {
  /** Total members, or null when under MIN_MEMBERS_TO_SHOW / unavailable. */
  memberCount: number | null;
  /** Members online now, or null when the count is being withheld. */
  onlineCount: number | null;
  /** Soonest upcoming scheduled event, if any. */
  nextEvent: RoomEvent | null;
}

const API = "https://discord.com/api/v10";

async function discordGet<T>(path: string, token: string): Promise<T | null> {
  try {
    const res = await fetch(`${API}${path}`, {
      headers: { Authorization: `Bot ${token}` },
      // The route handler owns caching; don't let fetch cache a stale token error.
      cache: "no-store",
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

/**
 * Live guild stats. Returns null when unconfigured or Discord is unreachable,
 * so every caller can fall back to static copy. Never throws.
 */
export async function getRoomSnapshot(): Promise<RoomSnapshot | null> {
  const guildId = process.env.DISCORD_GUILD_ID;
  const token = process.env.DISCORD_SITE_BOT_TOKEN;
  if (!guildId || !token) return null;

  const [guild, events] = await Promise.all([
    discordGet<{ approximate_member_count?: number; approximate_presence_count?: number }>(
      `/guilds/${guildId}?with_counts=true`,
      token
    ),
    discordGet<Array<{ name: string; scheduled_start_time: string }>>(
      `/guilds/${guildId}/scheduled-events`,
      token
    ),
  ]);

  if (!guild && !events) return null;

  const members = guild?.approximate_member_count ?? 0;
  const showCounts = members >= MIN_MEMBERS_TO_SHOW;

  const now = Date.now();
  const nextEvent =
    (events ?? [])
      .filter((e) => new Date(e.scheduled_start_time).getTime() > now)
      .sort(
        (a, b) =>
          new Date(a.scheduled_start_time).getTime() -
          new Date(b.scheduled_start_time).getTime()
      )
      .map((e) => ({ name: e.name, startsAt: e.scheduled_start_time }))[0] ?? null;

  return {
    memberCount: showCounts ? members : null,
    onlineCount: showCounts ? guild?.approximate_presence_count ?? null : null,
    nextEvent,
  };
}
