-- ============================================================================
-- SLAPBOX CORE SCHEMA
-- Fan <-> Artist/Brand engagement platform: trivia minigames, XP/levels/ranks,
-- rank-gated reward shelf, rank-weighted draws, subscription rev-share.
--
-- ONE currency: XP. It is only ever earned, never spent. Rewards are unlocked
-- by reaching a level, not purchased, so claiming something never costs a fan
-- the standing they built.
--
-- Run order: 0001_slapbox_core.sql -> 0002_slapbox_rls.sql -> 0003_slapbox_engine.sql
-- ============================================================================

create extension if not exists "pgcrypto";
create extension if not exists "citext";

-- == Enums ===================================================================
create type account_role     as enum ('fan', 'artist', 'admin');
create type entity_kind      as enum ('artist', 'brand');
create type game_kind        as enum (
  'trivia',        -- classic multiple choice
  'speed_round',   -- beat the clock, bonus XP for fast answers
  'lyric_gap',     -- fill in the missing bar
  'cover_art',     -- name the project from the artwork
  'deep_cut',      -- hard-mode superfan questions
  'daily_drop'     -- one rotating question per day, carries the streak
);
create type reward_kind      as enum (
  'swag', 'ticket', 'private_event', 'exclusive_audio',
  'exclusive_video', 'vinyl', 'cd', 'signed_item', 'meet_greet', 'discount_code'
);
create type reward_tier      as enum ('common', 'rare', 'epic', 'legendary');
create type redemption_state as enum ('pending', 'approved', 'fulfilled', 'shipped', 'delivered', 'rejected', 'cancelled');
create type sub_state        as enum ('trialing', 'active', 'past_due', 'canceled', 'incomplete');
-- XP only ever accrues, so there are no spend/refund reasons here.
create type ledger_reason    as enum (
  'game_reward', 'streak_bonus', 'perfect_bonus', 'referral_bonus', 'admin_grant'
);

-- == Identity ================================================================
create table profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  handle       citext unique not null,
  display_name text   not null,
  avatar_url   text,
  role         account_role not null default 'fan',
  created_at   timestamptz not null default now(),
  constraint handle_format check (handle ~ '^[a-z0-9_]{3,24}$')
);

-- Fan game state. One row per fan, created by trigger on signup.
create table fan_profiles (
  id                uuid primary key references profiles(id) on delete cascade,
  xp                integer not null default 0 check (xp >= 0),
  level             integer not null default 1 check (level >= 1),
  rounds_played     integer not null default 0,
  streak_days       integer not null default 0,
  best_streak       integer not null default 0,
  last_played_on    date,
  total_answered    integer not null default 0,
  total_correct     integer not null default 0,
  city              text,
  country           text default 'US',
  onboarded_at      timestamptz,
  created_at        timestamptz not null default now()
);

-- == Artists & Brands ========================================================
create table artists (
  id                uuid primary key default gen_random_uuid(),
  slug              citext unique not null,
  name              text not null,
  kind              entity_kind not null default 'artist',
  genre             text,
  hometown          text,
  bio               text,
  avatar_url        text,
  banner_url        text,
  accent_color      text default '#00C2FF',
  verified          boolean not null default false,
  -- owner_id null => demo / unclaimed account. Claiming an account sets this.
  owner_id          uuid references profiles(id) on delete set null,
  is_demo           boolean not null default false,
  -- artist's cut of subscriber revenue attributed to them, 0..1
  rev_share_pct     numeric(5,4) not null default 0.5000 check (rev_share_pct between 0 and 1),
  monthly_listeners integer default 0,
  follower_count    integer not null default 0,
  created_at        timestamptz not null default now()
);
create index artists_genre_idx on artists (genre);
create index artists_kind_idx  on artists (kind);

-- Fan <-> artist relationship. affinity drives the revenue-share split.
create table fan_artists (
  fan_id       uuid not null references fan_profiles(id) on delete cascade,
  artist_id    uuid not null references artists(id) on delete cascade,
  is_favorite  boolean not null default false,
  affinity     integer not null default 0,   -- engagement weight -> payout split
  xp_with      integer not null default 0,   -- per-artist XP ("Day One" status)
  followed_at  timestamptz not null default now(),
  primary key (fan_id, artist_id)
);
create index fan_artists_artist_idx on fan_artists (artist_id);

-- == Question bank ===========================================================
-- Publicly readable. Deliberately contains NO answer key.
create table questions (
  id           uuid primary key default gen_random_uuid(),
  artist_id    uuid not null references artists(id) on delete cascade,
  kind         game_kind not null default 'trivia',
  prompt       text not null,
  choices      jsonb not null,               -- ["A","B","C","D"]
  difficulty   smallint not null default 1 check (difficulty between 1 and 3),
  media_url    text,                         -- cover art / audio clip
  explanation  text,                         -- revealed after answering
  active       boolean not null default true,
  created_at   timestamptz not null default now(),
  constraint choices_is_array check (jsonb_typeof(choices) = 'array')
);
create index questions_artist_kind_idx on questions (artist_id, kind) where active;

-- Answer key. RLS denies ALL client access; only SECURITY DEFINER fns read it.
create table question_answers (
  question_id   uuid primary key references questions(id) on delete cascade,
  correct_index smallint not null check (correct_index >= 0)
);

-- == Gameplay ================================================================
create table game_sessions (
  id             uuid primary key default gen_random_uuid(),
  fan_id         uuid not null references fan_profiles(id) on delete cascade,
  artist_id      uuid not null references artists(id) on delete cascade,
  kind           game_kind not null,
  question_ids   uuid[] not null,
  current_index  smallint not null default 0,
  correct_count  smallint not null default 0,
  xp_awarded     integer not null default 0,
  finished_at    timestamptz,
  expires_at     timestamptz not null default now() + interval '30 minutes',
  created_at     timestamptz not null default now()
);
create index game_sessions_fan_idx on game_sessions (fan_id, created_at desc);

create table session_answers (
  session_id   uuid not null references game_sessions(id) on delete cascade,
  question_id  uuid not null references questions(id) on delete cascade,
  position     smallint not null,
  chosen_index smallint,
  is_correct   boolean not null default false,
  ms_taken     integer,
  xp           integer not null default 0,
  answered_at  timestamptz not null default now(),
  primary key (session_id, question_id)
);

-- == XP ledger ===============================================================
-- Append-only audit trail of every XP award. Never debited.
create table xp_ledger (
  id         bigserial primary key,
  fan_id     uuid not null references fan_profiles(id) on delete cascade,
  delta      integer not null,
  reason     ledger_reason not null,
  ref_id     uuid,
  note       text,
  created_at timestamptz not null default now()
);
create index xp_ledger_fan_idx on xp_ledger (fan_id, created_at desc);

-- == Reward shelf ============================================================
-- Rewards are UNLOCKED, not bought. requires_level is the gate: reach the rank
-- and the item becomes claimable. stock and per_fan_limit are the only scarcity
-- controls, since there is no balance to spend down.
create table rewards (
  id                    uuid primary key default gen_random_uuid(),
  artist_id             uuid not null references artists(id) on delete cascade,
  title                 text not null,
  description           text,
  kind                  reward_kind not null,
  tier                  reward_tier not null default 'common',
  stock                 integer,                 -- null = unlimited
  claimed_count         integer not null default 0,
  per_fan_limit         integer not null default 1,
  requires_level        integer not null default 1,
  requires_subscription boolean not null default false,
  -- high-ticket items are not buyable; they are awarded via rank-weighted draw
  is_high_ticket        boolean not null default false,
  image_url             text,
  -- exclusive_audio / exclusive_video: private storage path, signed URL on claim
  asset_path            text,
  active                boolean not null default true,
  created_at            timestamptz not null default now(),
  constraint stock_sane check (stock is null or stock >= 0)
);
create index rewards_artist_idx on rewards (artist_id) where active;

create table redemptions (
  id            uuid primary key default gen_random_uuid(),
  fan_id        uuid not null references fan_profiles(id) on delete cascade,
  reward_id     uuid not null references rewards(id) on delete restrict,
  -- the level the fan held when they claimed, kept for the artist's records
  claimed_at_level integer not null default 1,
  state         redemption_state not null default 'pending',
  fulfilment    jsonb not null default '{}'::jsonb,  -- shipping address, size, notes
  claim_code    text unique,
  won_via_draw  uuid,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index redemptions_fan_idx on redemptions (fan_id, created_at desc);

-- == Monthly high-ticket draws (rank-weighted) ===============================
create table draws (
  id             uuid primary key default gen_random_uuid(),
  artist_id      uuid references artists(id) on delete cascade, -- null = platform-wide
  reward_id      uuid not null references rewards(id) on delete restrict,
  period_month   date not null,                  -- first day of the month
  opens_at       timestamptz not null,
  closes_at      timestamptz not null,
  drawn_at       timestamptz,
  winner_fan_id  uuid references fan_profiles(id) on delete set null,
  -- sweepstakes: when true, a free (AMOE) entry path must be offered
  is_sweepstakes boolean not null default true,
  created_at     timestamptz not null default now(),
  unique (reward_id, period_month)
);

create table draw_entries (
  id         uuid primary key default gen_random_uuid(),
  draw_id    uuid not null references draws(id) on delete cascade,
  fan_id     uuid not null references fan_profiles(id) on delete cascade,
  weight     integer not null default 1 check (weight > 0), -- derived from rank
  is_free    boolean not null default false,                -- AMOE entry
  created_at timestamptz not null default now(),
  unique (draw_id, fan_id)
);

-- == Subscriptions & artist payouts ==========================================
create table subscriptions (
  id                     uuid primary key default gen_random_uuid(),
  fan_id                 uuid not null unique references fan_profiles(id) on delete cascade,
  state                  sub_state not null default 'trialing',
  plan_code              text not null default 'superfan_monthly',
  price_cents            integer not null default 499,
  trial_ends_at          timestamptz,
  current_period_start   timestamptz,
  current_period_end     timestamptz,
  cancel_at_period_end   boolean not null default false,
  stripe_customer_id     text,
  stripe_subscription_id text unique,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

-- One row per (fan, month, artist): how that fan's payment was split.
create table revenue_splits (
  id            uuid primary key default gen_random_uuid(),
  fan_id        uuid not null references fan_profiles(id) on delete cascade,
  artist_id     uuid not null references artists(id) on delete cascade,
  period_month  date not null,
  affinity      integer not null,
  weight        numeric(6,5) not null,   -- artist's share of this fan's pool
  amount_cents  integer not null,
  created_at    timestamptz not null default now(),
  unique (fan_id, artist_id, period_month)
);

create table artist_payouts (
  id            uuid primary key default gen_random_uuid(),
  artist_id     uuid not null references artists(id) on delete cascade,
  period_month  date not null,
  gross_cents   integer not null default 0,
  fan_count     integer not null default 0,
  paid_at       timestamptz,
  created_at    timestamptz not null default now(),
  unique (artist_id, period_month)
);

-- == Social connections (artist-owned accounts, OAuth) =======================
create table social_accounts (
  id               uuid primary key default gen_random_uuid(),
  artist_id        uuid not null references artists(id) on delete cascade,
  platform         text not null,               -- x | instagram | facebook | tiktok | youtube
  platform_user_id text,
  username         text,
  -- tokens: RLS denies all client reads; server routes use the service role
  access_token     text,
  refresh_token    text,
  expires_at       timestamptz,
  scopes           text[],
  connected_at     timestamptz not null default now(),
  unique (artist_id, platform)
);

create table social_posts (
  id            uuid primary key default gen_random_uuid(),
  artist_id     uuid not null references artists(id) on delete cascade,
  platform      text not null,
  body          text not null,
  media_url     text,
  scheduled_for timestamptz,
  posted_at     timestamptz,
  remote_id     text,
  remote_url    text,
  state         text not null default 'draft',  -- draft|scheduled|posted|failed
  error         text,
  created_at    timestamptz not null default now()
);

-- == updated_at maintenance ==================================================
create or replace function touch_updated_at() returns trigger
language plpgsql as $fn$
begin
  new.updated_at = now();
  return new;
end
$fn$;

create trigger redemptions_touch before update on redemptions
  for each row execute function touch_updated_at();
create trigger subscriptions_touch before update on subscriptions
  for each row execute function touch_updated_at();
