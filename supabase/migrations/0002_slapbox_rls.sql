-- ============================================================================
-- SLAPBOX ROW LEVEL SECURITY + COLUMN GRANTS
--
-- Guiding rule: the client may READ its own state and the public catalog, but
-- may never WRITE anything that touches progression. Every XP, level, streak
-- and redemption mutation goes through a SECURITY DEFINER function in 0003.
-- That is what stops a fan from granting themselves 100,000 XP with a
-- hand-rolled supabase-js call from the browser console.
--
-- This matters more now that XP is the ONLY currency: XP is what unlocks every
-- reward, so forged XP is forged merchandise.
--
-- RLS alone is NOT enough here: a row policy like "id = auth.uid()" would
-- still let a fan UPDATE their own xp, or set profiles.role to 'admin'.
-- Postgres RLS cannot restrict columns, so writable columns are pinned down
-- with explicit column-level GRANTs below.
-- ============================================================================

alter table profiles         enable row level security;
alter table fan_profiles     enable row level security;
alter table artists          enable row level security;
alter table fan_artists      enable row level security;
alter table questions        enable row level security;
alter table question_answers enable row level security;
alter table game_sessions    enable row level security;
alter table session_answers  enable row level security;
alter table xp_ledger        enable row level security;
alter table rewards          enable row level security;
alter table redemptions      enable row level security;
alter table draws            enable row level security;
alter table draw_entries     enable row level security;
alter table subscriptions    enable row level security;
alter table revenue_splits   enable row level security;
alter table artist_payouts   enable row level security;
alter table social_accounts  enable row level security;
alter table social_posts     enable row level security;

-- == Reset default Supabase grants ===========================================
-- Supabase grants ALL on every table to anon/authenticated by default. Strip
-- that back to nothing and re-grant deliberately, column by column.
revoke all on profiles, fan_profiles, artists, fan_artists, questions,
  question_answers, game_sessions, session_answers, xp_ledger, rewards,
  redemptions, draws, draw_entries, subscriptions, revenue_splits,
  artist_payouts, social_accounts, social_posts
  from anon, authenticated;

-- == Helper: does the current user own this artist/brand? ====================
create or replace function owns_artist(a_id uuid) returns boolean
language sql stable security definer set search_path = public as $fn$
  select exists (select 1 from artists where id = a_id and owner_id = auth.uid());
$fn$;

-- == profiles ================================================================
-- Public handles/display names are visible (leaderboards, fan lists).
-- role is READ-ONLY to clients: granting it would let any fan self-promote
-- to 'admin'. Role changes happen server-side with the service key.
grant select on profiles to authenticated;
grant update (display_name, avatar_url, handle) on profiles to authenticated;

create policy profiles_read_all on profiles
  for select to authenticated using (true);
create policy profiles_update_own on profiles
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

-- == fan_profiles ============================================================
-- Readable by all signed-in users so leaderboards can show level/XP/rank.
-- Only cosmetic fields are writable: xp, level, streak_days and the counters
-- are function-owned.
grant select on fan_profiles to authenticated;
grant update (city, country, onboarded_at) on fan_profiles to authenticated;

create policy fan_profiles_read on fan_profiles
  for select to authenticated using (true);
create policy fan_profiles_update_own on fan_profiles
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

-- == artists =================================================================
grant select on artists to anon, authenticated;
grant update (name, genre, hometown, bio, avatar_url, banner_url, accent_color)
  on artists to authenticated;

create policy artists_read_all on artists
  for select to anon, authenticated using (true);
create policy artists_update_owner on artists
  for update to authenticated using (owns_artist(id)) with check (owns_artist(id));

-- == fan_artists =============================================================
-- Fans may follow, unfollow and star a favorite. affinity and xp_with drive
-- the revenue split, so they are function-owned on BOTH insert and update --
-- a blanket INSERT grant would let a fan follow an artist with affinity
-- pre-loaded and divert subscription revenue.
grant select, delete on fan_artists to authenticated;
grant insert (fan_id, artist_id, is_favorite) on fan_artists to authenticated;
grant update (is_favorite) on fan_artists to authenticated;

create policy fan_artists_read on fan_artists
  for select to authenticated using (fan_id = auth.uid() or owns_artist(artist_id));
create policy fan_artists_follow on fan_artists
  for insert to authenticated with check (fan_id = auth.uid());
create policy fan_artists_update_own on fan_artists
  for update to authenticated using (fan_id = auth.uid()) with check (fan_id = auth.uid());
create policy fan_artists_unfollow on fan_artists
  for delete to authenticated using (fan_id = auth.uid());

-- == questions ===============================================================
-- Prompts and choices are public to signed-in fans. The answer key lives in a
-- separate table that no client can reach.
grant select on questions to authenticated;
grant insert, update, delete on questions to authenticated;

create policy questions_read_active on questions
  for select to authenticated using (active);
create policy questions_write_owner on questions
  for all to authenticated using (owns_artist(artist_id)) with check (owns_artist(artist_id));

-- == question_answers ========================================================
-- No grants and no policies, deliberately. Every client read returns zero
-- rows. Only the SECURITY DEFINER grading functions can see correct_index.

-- == game_sessions / session_answers =========================================
-- Read-only to the client. Sessions are created and advanced by functions.
grant select on game_sessions, session_answers to authenticated;

create policy game_sessions_read_own on game_sessions
  for select to authenticated using (fan_id = auth.uid());
create policy session_answers_read_own on session_answers
  for select to authenticated using (
    exists (select 1 from game_sessions s where s.id = session_id and s.fan_id = auth.uid())
  );

-- == xp_ledger ===============================================================
grant select on xp_ledger to authenticated;

create policy xp_ledger_read_own on xp_ledger
  for select to authenticated using (fan_id = auth.uid());

-- == rewards =================================================================
grant select on rewards to authenticated;
grant insert, update, delete on rewards to authenticated;

create policy rewards_read_active on rewards
  for select to authenticated using (active);
create policy rewards_write_owner on rewards
  for all to authenticated using (owns_artist(artist_id)) with check (owns_artist(artist_id));

-- == redemptions =============================================================
-- Fans see their own claims; the artist sees claims against their own rewards
-- so they can actually ship the swag. Artists may only move the fulfilment
-- state, never the claim itself.
grant select on redemptions to authenticated;
grant update (state, fulfilment) on redemptions to authenticated;

create policy redemptions_read on redemptions
  for select to authenticated using (
    fan_id = auth.uid()
    or exists (select 1 from rewards r where r.id = reward_id and owns_artist(r.artist_id))
  );
create policy redemptions_fulfil_owner on redemptions
  for update to authenticated using (
    exists (select 1 from rewards r where r.id = reward_id and owns_artist(r.artist_id))
  ) with check (
    exists (select 1 from rewards r where r.id = reward_id and owns_artist(r.artist_id))
  );

-- == draws ===================================================================
grant select on draws, draw_entries to authenticated;

create policy draws_read_all on draws
  for select to authenticated using (true);
create policy draw_entries_read_own on draw_entries
  for select to authenticated using (fan_id = auth.uid());

-- == subscriptions ===========================================================
-- Read-only: state transitions come from Stripe webhooks (service role).
grant select on subscriptions to authenticated;

create policy subscriptions_read_own on subscriptions
  for select to authenticated using (fan_id = auth.uid());

-- == revenue_splits / artist_payouts =========================================
grant select on revenue_splits, artist_payouts to authenticated;

create policy revenue_splits_read on revenue_splits
  for select to authenticated using (fan_id = auth.uid() or owns_artist(artist_id));
create policy artist_payouts_read_owner on artist_payouts
  for select to authenticated using (owns_artist(artist_id));

-- == social_accounts =========================================================
-- No SELECT grant: OAuth access/refresh tokens must never reach a browser.
-- The artist console reads connection status through the view below, which
-- runs as definer and filters to the caller's own artists.
grant delete on social_accounts to authenticated;

create policy social_accounts_delete_owner on social_accounts
  for delete to authenticated using (owns_artist(artist_id));

create or replace view social_connections
with (security_invoker = false) as
  select id, artist_id, platform, username, expires_at, scopes, connected_at
  from social_accounts
  where owns_artist(artist_id);

grant select on social_connections to authenticated;

-- == social_posts ============================================================
grant select, insert, update, delete on social_posts to authenticated;

create policy social_posts_owner on social_posts
  for all to authenticated using (owns_artist(artist_id)) with check (owns_artist(artist_id));
