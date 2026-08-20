// ============================================================================
// Database types.
//
// Hand-maintained to cover what the app actually queries. Once the schema
// settles, replace this file with generated types:
//   npx supabase gen types typescript --project-id <ref> > lib/types.ts
// ============================================================================

export type AccountRole = 'fan' | 'artist' | 'admin';
export type EntityKind = 'artist' | 'brand';
export type GameKind =
  | 'trivia' | 'speed_round' | 'lyric_gap' | 'cover_art' | 'deep_cut' | 'daily_drop';
export type RewardKind =
  | 'swag' | 'ticket' | 'private_event' | 'exclusive_audio' | 'exclusive_video'
  | 'vinyl' | 'cd' | 'signed_item' | 'meet_greet' | 'discount_code';
export type RewardTier = 'common' | 'rare' | 'epic' | 'legendary';
export type RedemptionState =
  | 'pending' | 'approved' | 'fulfilled' | 'shipped' | 'delivered' | 'rejected' | 'cancelled';
export type SubState = 'trialing' | 'active' | 'past_due' | 'canceled' | 'incomplete';
export type LedgerReason =
  | 'game_reward' | 'streak_bonus' | 'perfect_bonus' | 'referral_bonus' | 'admin_grant';

export interface Profile {
  id: string;
  handle: string;
  display_name: string;
  avatar_url: string | null;
  role: AccountRole;
  created_at: string;
}

export interface FanProfile {
  id: string;
  xp: number;
  level: number;
  rounds_played: number;
  streak_days: number;
  best_streak: number;
  last_played_on: string | null;
  total_answered: number;
  total_correct: number;
  city: string | null;
  country: string | null;
  onboarded_at: string | null;
  created_at: string;
}

export interface Artist {
  id: string;
  slug: string;
  name: string;
  kind: EntityKind;
  genre: string | null;
  hometown: string | null;
  bio: string | null;
  avatar_url: string | null;
  banner_url: string | null;
  accent_color: string | null;
  verified: boolean;
  owner_id: string | null;
  is_demo: boolean;
  rev_share_pct: number;
  monthly_listeners: number | null;
  follower_count: number;
  created_at: string;
}

export interface FanArtist {
  fan_id: string;
  artist_id: string;
  is_favorite: boolean;
  affinity: number;
  xp_with: number;
  followed_at: string;
}

/** Client-visible question shape. Note: no correct answer. */
export interface Question {
  id: string;
  artist_id: string;
  kind: GameKind;
  prompt: string;
  choices: string[];
  difficulty: number;
  media_url: string | null;
  explanation: string | null;
  active: boolean;
}

export interface Reward {
  id: string;
  artist_id: string;
  title: string;
  description: string | null;
  kind: RewardKind;
  tier: RewardTier;
  stock: number | null;
  claimed_count: number;
  per_fan_limit: number;
  requires_level: number;
  requires_subscription: boolean;
  is_high_ticket: boolean;
  image_url: string | null;
  asset_path: string | null;
  active: boolean;
  created_at: string;
}

export interface Redemption {
  id: string;
  fan_id: string;
  reward_id: string;
  claimed_at_level: number;
  state: RedemptionState;
  fulfilment: Record<string, unknown>;
  claim_code: string | null;
  won_via_draw: string | null;
  created_at: string;
  updated_at: string;
}

export interface Draw {
  id: string;
  artist_id: string | null;
  reward_id: string;
  period_month: string;
  opens_at: string;
  closes_at: string;
  drawn_at: string | null;
  winner_fan_id: string | null;
  is_sweepstakes: boolean;
}

export interface DrawEntry {
  id: string;
  draw_id: string;
  fan_id: string;
  weight: number;
  is_free: boolean;
  created_at: string;
}

export interface Subscription {
  id: string;
  fan_id: string;
  state: SubState;
  plan_code: string;
  price_cents: number;
  trial_ends_at: string | null;
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
}

export interface XpLedgerRow {
  id: number;
  fan_id: string;
  delta: number;
  reason: LedgerReason;
  ref_id: string | null;
  note: string | null;
  created_at: string;
}

// ── RPC payloads ────────────────────────────────────────────────────────────

export interface StartGameResult {
  session_id: string;
  kind: GameKind;
  expires_at: string;
  artist: { id: string; slug: string; name: string; avatar_url: string | null; accent_color: string };
  questions: Array<{
    id: string;
    prompt: string;
    choices: string[];
    difficulty: number;
    media_url: string | null;
  }>;
}

export interface SubmitAnswerResult {
  is_correct: boolean;
  correct_index: number;
  explanation: string | null;
  xp: number;
  answered: number;
  total: number;
}

/** One reward that this round's level-ups just opened up. */
export interface UnlockedReward {
  id: string;
  title: string;
  tier: RewardTier;
  kind: RewardKind;
  artist: string;
  slug: string;
}

export interface FinishGameResult {
  correct: number;
  total: number;
  perfect: boolean;
  xp_earned: number;
  base_xp: number;
  streak_bonus: number;
  perfect_bonus: number;
  xp: number;
  level: number;
  levelled_up: boolean;
  levels_gained: number;
  rank: string;
  rank_changed: boolean;
  xp_into_level: number;
  xp_for_next: number;
  streak_days: number;
  unlocked: UnlockedReward[];
}

export interface ClaimResult {
  redemption_id: string;
  claim_code: string;
  level: number;
  rank: string;
  reward: { title: string; kind: RewardKind; tier: RewardTier };
}

export interface EnterDrawResult {
  draw_id: string;
  weight: number;
  rank: string;
  total_weight: number;
}

// Minimal shape so the typed Supabase client compiles. Swap for generated
// types when the schema stabilises.
export type Database = any;
