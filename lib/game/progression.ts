// ============================================================================
// Progression math, mirrored from 0003_slapbox_engine.sql.
//
// The database is the source of truth -- it computes every award. These
// functions exist so the UI can render a progress bar or preview the next
// rank without a round trip. If you change the curve, change it in BOTH
// places, or the bar will disagree with the number.
// ============================================================================

/** Cumulative XP required to reach a level: 50 * (level-1)^1.6 */
export function xpForLevel(level: number): number {
  return level <= 1 ? 0 : Math.floor(50 * Math.pow(level - 1, 1.6));
}

export function levelForXp(xp: number): number {
  return Math.max(1, Math.floor(Math.pow(Math.max(xp, 0) / 50, 1 / 1.6)) + 1);
}

export const RANKS = [
  { min: 1,  name: 'Listener',     weight: 1,  color: '#A0A0A0' },
  { min: 5,  name: 'Supporter',    weight: 2,  color: '#00C2FF' },
  { min: 10, name: 'Regular',      weight: 4,  color: '#00FF9C' },
  { min: 20, name: 'Real One',     weight: 8,  color: '#FFB800' },
  { min: 35, name: 'Day One',      weight: 15, color: '#FF3B3B' },
  { min: 50, name: 'Inner Circle', weight: 25, color: '#7B2EFF' },
  { min: 70, name: 'Legend',       weight: 40, color: '#C9A86A' },
] as const;

export type Rank = (typeof RANKS)[number];

export function rankForLevel(level: number): Rank {
  let found: Rank = RANKS[0];
  for (const r of RANKS) if (level >= r.min) found = r;
  return found;
}

export function nextRank(level: number): Rank | null {
  return RANKS.find((r) => r.min > level) ?? null;
}

/** How many draw tickets this level is worth. A Legend is 40x a Listener. */
export function drawWeightForLevel(level: number): number {
  return rankForLevel(level).weight;
}

/** Everything the profile header needs to draw a level bar. */
export function progress(xp: number) {
  const level = levelForXp(xp);
  const floorXp = xpForLevel(level);
  const ceilXp = xpForLevel(level + 1);
  const into = xp - floorXp;
  const span = ceilXp - floorXp;
  return {
    level,
    rank: rankForLevel(level),
    next: nextRank(level),
    xpIntoLevel: into,
    xpForNextLevel: span,
    remaining: span - into,
    pct: span > 0 ? Math.min(100, Math.round((into / span) * 100)) : 100,
  };
}

// ── Game modes ──────────────────────────────────────────────────────────────
export type GameKind =
  | 'trivia' | 'speed_round' | 'lyric_gap' | 'cover_art' | 'deep_cut' | 'daily_drop';

export interface GameMode {
  kind: GameKind;
  name: string;
  tagline: string;
  /** lucide-react icon name, resolved at render time. */
  icon: string;
  questions: number;
  color: string;
  timed: boolean;
  /** Per-question countdown. Only present on timed modes. */
  seconds?: number;
}

export const GAME_MODES: readonly GameMode[] = [
  {
    kind: 'trivia' as const,
    name: 'Know Your Artist',
    tagline: 'Five questions. Straight-up knowledge.',
    icon: 'Brain',
    questions: 5,
    color: '#00C2FF',
    timed: false,
  },
  {
    kind: 'speed_round' as const,
    name: 'Beat The Clock',
    tagline: 'Ten seconds a question. Answer fast, earn more.',
    icon: 'Timer',
    questions: 5,
    color: '#FFB800',
    timed: true,
    seconds: 10,
  },
  {
    kind: 'lyric_gap' as const,
    name: 'Fill The Bar',
    tagline: 'One word missing. Finish the line.',
    icon: 'Mic2',
    questions: 4,
    color: '#00FF9C',
    timed: false,
  },
  {
    kind: 'cover_art' as const,
    name: 'Name The Project',
    tagline: 'Cover art in, title out.',
    icon: 'Disc3',
    questions: 4,
    color: '#7B2EFF',
    timed: false,
  },
  {
    kind: 'deep_cut' as const,
    name: 'Deep Cut',
    tagline: 'Superfans only. Pays 1.5x.',
    icon: 'Gem',
    questions: 5,
    color: '#FF3B3B',
    timed: false,
  },
  {
    kind: 'daily_drop' as const,
    name: 'Daily Drop',
    tagline: 'One question a day. Keeps the streak alive.',
    icon: 'Flame',
    questions: 1,
    color: '#C9A86A',
    timed: false,
  },
];

export function modeFor(kind: string): GameMode | undefined {
  return GAME_MODES.find((m) => m.kind === kind);
}

// ── Reward presentation ─────────────────────────────────────────────────────
export const TIER_STYLE: Record<string, { label: string; color: string; glow: string }> = {
  common:    { label: 'Common',    color: '#A0A0A0', glow: 'rgba(160,160,160,0.15)' },
  rare:      { label: 'Rare',      color: '#00C2FF', glow: 'rgba(0,194,255,0.25)' },
  epic:      { label: 'Epic',      color: '#7B2EFF', glow: 'rgba(123,46,255,0.3)' },
  legendary: { label: 'Legendary', color: '#C9A86A', glow: 'rgba(201,168,106,0.35)' },
};

export const REWARD_LABEL: Record<string, string> = {
  swag: 'Merch',
  ticket: 'Tickets',
  private_event: 'Private Event',
  exclusive_audio: 'Exclusive Audio',
  exclusive_video: 'Exclusive Video',
  vinyl: 'Vinyl',
  cd: 'CD',
  signed_item: 'Signed',
  meet_greet: 'Meet & Greet',
  discount_code: 'Discount',
};
