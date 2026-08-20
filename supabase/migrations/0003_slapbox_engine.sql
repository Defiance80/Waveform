-- ============================================================================
-- SLAPBOX GAME ENGINE
--
-- ONE currency: XP. Earned, never spent. Rewards unlock at a level rather than
-- being bought, so a fan who claims the vinyl does not drop back down the
-- ladder for doing it.
--
-- Every function here is SECURITY DEFINER and re-derives the caller from
-- auth.uid(). Nothing trusts a fan_id passed in from the client. Answer keys
-- are read only inside these functions, never returned before the fan has
-- committed to a choice.
-- ============================================================================

-- == Progression math ========================================================
-- Cumulative XP required to REACH a level: 50 * (level-1)^1.6
--   L2=50  L5=459  L10=1,680  L20=5,600  L35=13,400  L50=25,000  L70=42,300
-- A 5-question round pays roughly 60-90 XP, so Regular (L10) lands around 22
-- rounds in and Inner Circle (L50) is a genuine long haul.
create or replace function xp_for_level(p_level integer) returns integer
language sql immutable as $fn$
  select case when p_level <= 1 then 0
              else floor(50 * power(p_level - 1, 1.6))::integer end;
$fn$;

create or replace function level_for_xp(p_xp integer) returns integer
language sql immutable as $fn$
  select greatest(1, floor(power(greatest(p_xp, 0)::numeric / 50, 1.0 / 1.6))::integer + 1);
$fn$;

-- Rank tiers. The fan-facing identity attached to a level band, and the thing
-- that gates every reward on the shelf.
create or replace function rank_for_level(p_level integer) returns text
language sql immutable as $fn$
  select case
    when p_level >= 70 then 'Legend'
    when p_level >= 50 then 'Inner Circle'
    when p_level >= 35 then 'Day One'
    when p_level >= 20 then 'Real One'
    when p_level >= 10 then 'Regular'
    when p_level >= 5  then 'Supporter'
    else 'Listener'
  end;
$fn$;

-- Draw weight: how many tickets a fan's rank is worth in a monthly draw.
-- A Legend is 40x more likely to win than a Listener.
create or replace function draw_weight_for_level(p_level integer) returns integer
language sql immutable as $fn$
  select case
    when p_level >= 70 then 40
    when p_level >= 50 then 25
    when p_level >= 35 then 15
    when p_level >= 20 then 8
    when p_level >= 10 then 4
    when p_level >= 5  then 2
    else 1
  end;
$fn$;

-- == Signup: provision profile + fan state + free trial ======================
create or replace function handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $fn$
declare
  v_handle text;
  v_base   text;
  v_n      integer := 0;
  v_role   account_role;
begin
  -- Signup metadata is attacker-controlled: anyone can call auth.signUp with
  -- { role: 'admin' }. Only self-service roles are honoured here; promoting an
  -- account to admin is a service-role operation.
  v_role := case new.raw_user_meta_data->>'role'
              when 'artist' then 'artist'::account_role
              else 'fan'::account_role
            end;

  -- Derive a unique handle from metadata or the email local-part.
  v_base := lower(regexp_replace(
    coalesce(new.raw_user_meta_data->>'handle', split_part(new.email, '@', 1), 'fan'),
    '[^a-z0-9_]', '', 'g'));
  if length(v_base) < 3 then v_base := v_base || 'fan'; end if;
  v_base := left(v_base, 20);
  v_handle := v_base;
  while exists (select 1 from profiles where handle = v_handle) loop
    v_n := v_n + 1;
    v_handle := left(v_base, 20) || v_n::text;
  end loop;

  insert into profiles (id, handle, display_name, avatar_url, role)
  values (
    new.id,
    v_handle,
    coalesce(new.raw_user_meta_data->>'display_name', initcap(v_base)),
    new.raw_user_meta_data->>'avatar_url',
    v_role
  );

  -- Artists get a profile but no fan game state.
  if v_role = 'fan' then
    -- Everyone starts at zero. There is no welcome balance to grant, because
    -- there is no balance -- rank is earned only by answering questions.
    insert into fan_profiles (id) values (new.id);

    -- 7-day free trial, then the paid Superfan plan.
    insert into subscriptions (fan_id, state, trial_ends_at, current_period_end)
    values (new.id, 'trialing', now() + interval '7 days', now() + interval '7 days');
  end if;

  return new;
end
$fn$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- == Internal: grant XP and keep the ledger honest ===========================
-- finish_game writes its own ledger rows (it already updates fan_profiles.xp
-- in one atomic statement). This helper exists for the out-of-band grants --
-- 'admin_grant' and 'referral_bonus' -- issued from the service role.
create or replace function award_xp(
  p_fan uuid, p_delta integer, p_reason ledger_reason,
  p_ref uuid default null, p_note text default null
) returns void
language plpgsql security definer set search_path = public as $fn$
begin
  -- XP is append-only. A negative delta would corrupt the rank ladder, so it
  -- is rejected rather than silently clamped.
  if p_delta <= 0 then return; end if;

  update fan_profiles set xp = xp + p_delta where id = p_fan;

  insert into xp_ledger (fan_id, delta, reason, ref_id, note)
  values (p_fan, p_delta, p_reason, p_ref, p_note);
end
$fn$;

-- == Start a round ===========================================================
-- Returns the session plus its questions WITHOUT the answer key.
create or replace function start_game(
  p_artist_slug text,
  p_kind        game_kind default 'trivia',
  p_count       integer   default 5
) returns jsonb
language plpgsql security definer set search_path = public as $fn$
declare
  v_fan     uuid := auth.uid();
  v_artist  artists%rowtype;
  v_ids     uuid[];
  v_session game_sessions%rowtype;
  v_count   integer := least(greatest(coalesce(p_count, 5), 1), 15);
begin
  if v_fan is null then
    raise exception 'not authenticated' using errcode = '28000';
  end if;
  if not exists (select 1 from fan_profiles where id = v_fan) then
    raise exception 'not a fan account' using errcode = '42501';
  end if;

  select * into v_artist from artists where slug = p_artist_slug;
  if not found then
    raise exception 'artist not found: %', p_artist_slug using errcode = 'P0002';
  end if;

  -- daily_drop is deterministic per fan per day so the streak cannot be farmed
  -- by restarting the round until an easy question appears.
  if p_kind = 'daily_drop' then
    if exists (
      select 1 from game_sessions
       where fan_id = v_fan and artist_id = v_artist.id and kind = 'daily_drop'
         and created_at::date = current_date and finished_at is not null
    ) then
      raise exception 'daily drop already played today' using errcode = 'P0001';
    end if;
    select array_agg(id) into v_ids from (
      select id from questions
       where artist_id = v_artist.id and active
       order by md5(id::text || v_fan::text || current_date::text)
       limit 1
    ) q;
  else
    select array_agg(id) into v_ids from (
      select id from questions
       where artist_id = v_artist.id and kind = p_kind and active
       order by random()
       limit v_count
    ) q;
  end if;

  if v_ids is null or array_length(v_ids, 1) = 0 then
    raise exception 'no questions available for this game yet' using errcode = 'P0002';
  end if;

  insert into game_sessions (fan_id, artist_id, kind, question_ids)
  values (v_fan, v_artist.id, p_kind, v_ids)
  returning * into v_session;

  -- Auto-follow on first play: this is what seeds affinity and, later, the
  -- artist's share of this fan's subscription.
  insert into fan_artists (fan_id, artist_id) values (v_fan, v_artist.id)
  on conflict do nothing;

  return jsonb_build_object(
    'session_id', v_session.id,
    'kind',       v_session.kind,
    'expires_at', v_session.expires_at,
    'artist',     jsonb_build_object(
                    'id', v_artist.id, 'slug', v_artist.slug, 'name', v_artist.name,
                    'avatar_url', v_artist.avatar_url, 'accent_color', v_artist.accent_color),
    'questions',  (
      select coalesce(jsonb_agg(jsonb_build_object(
               'id', q.id, 'prompt', q.prompt, 'choices', q.choices,
               'difficulty', q.difficulty, 'media_url', q.media_url
             ) order by array_position(v_ids, q.id)), '[]'::jsonb)
      from questions q where q.id = any(v_ids)
    )
  );
end
$fn$;

-- == Grade one answer ========================================================
create or replace function submit_answer(
  p_session  uuid,
  p_question uuid,
  p_choice   integer,
  p_ms       integer default null
) returns jsonb
language plpgsql security definer set search_path = public as $fn$
declare
  v_fan       uuid := auth.uid();
  v_session   game_sessions%rowtype;
  v_question  questions%rowtype;
  v_correct   smallint;
  v_is_right  boolean;
  v_xp        integer := 0;
  v_inserted  integer;
begin
  if v_fan is null then
    raise exception 'not authenticated' using errcode = '28000';
  end if;

  -- Lock the session so two concurrent submits cannot both score.
  select * into v_session from game_sessions where id = p_session for update;
  if not found or v_session.fan_id <> v_fan then
    raise exception 'session not found' using errcode = 'P0002';
  end if;
  if v_session.finished_at is not null then
    raise exception 'session already finished' using errcode = 'P0001';
  end if;
  if v_session.expires_at < now() then
    raise exception 'session expired' using errcode = 'P0001';
  end if;
  if not (p_question = any(v_session.question_ids)) then
    raise exception 'question not part of this session' using errcode = 'P0001';
  end if;

  select * into v_question from questions where id = p_question;
  select correct_index into v_correct from question_answers where question_id = p_question;

  v_is_right := (p_choice is not null and p_choice = v_correct);

  if v_is_right then
    -- Base value scales with difficulty: 10 / 20 / 30 XP.
    v_xp := 10 * v_question.difficulty;

    -- Speed rounds pay a bonus for answering fast; other modes do not, so
    -- there is no incentive to rush a deep-cut question.
    if v_session.kind = 'speed_round' and p_ms is not null then
      if    p_ms < 3000 then v_xp := v_xp + (v_xp / 2);
      elsif p_ms < 6000 then v_xp := v_xp + (v_xp / 4);
      end if;
    end if;

    if v_session.kind = 'deep_cut' then
      v_xp := (v_xp * 3) / 2;
    end if;
  end if;

  -- The primary key makes re-answering impossible; a conflict means the fan
  -- already submitted for this question.
  insert into session_answers (session_id, question_id, position, chosen_index, is_correct, ms_taken, xp)
  values (p_session, p_question, v_session.current_index, p_choice, v_is_right, p_ms, v_xp)
  on conflict (session_id, question_id) do nothing;

  get diagnostics v_inserted = row_count;
  if v_inserted = 0 then
    raise exception 'question already answered' using errcode = 'P0001';
  end if;

  update game_sessions
     set current_index = current_index + 1,
         correct_count = correct_count + (case when v_is_right then 1 else 0 end),
         xp_awarded    = xp_awarded + v_xp
   where id = p_session;

  -- Only now, after the choice is locked in, is the answer key revealed.
  return jsonb_build_object(
    'is_correct',    v_is_right,
    'correct_index', v_correct,
    'explanation',   v_question.explanation,
    'xp',            v_xp,
    'answered',      v_session.current_index + 1,
    'total',         array_length(v_session.question_ids, 1)
  );
end
$fn$;

-- == Close out a round: commit XP, streak, level =============================
create or replace function finish_game(p_session uuid) returns jsonb
language plpgsql security definer set search_path = public as $fn$
declare
  v_fan           uuid := auth.uid();
  v_session       game_sessions%rowtype;
  v_before        fan_profiles%rowtype;
  v_new_xp        integer;
  v_new_level     integer;
  v_levels_up     integer;
  v_streak        integer;
  v_streak_bonus  integer := 0;
  v_perfect       boolean;
  v_perfect_bonus integer := 0;
  v_total_xp      integer;
  v_unlocked      jsonb;
begin
  if v_fan is null then
    raise exception 'not authenticated' using errcode = '28000';
  end if;

  select * into v_session from game_sessions where id = p_session for update;
  if not found or v_session.fan_id <> v_fan then
    raise exception 'session not found' using errcode = 'P0002';
  end if;
  if v_session.finished_at is not null then
    raise exception 'session already finished' using errcode = 'P0001';
  end if;

  select * into v_before from fan_profiles where id = v_fan for update;

  -- Streak advances at most once per calendar day.
  if v_before.last_played_on is null then
    v_streak := 1;
  elsif v_before.last_played_on = current_date then
    v_streak := v_before.streak_days;          -- already counted today
  elsif v_before.last_played_on = current_date - 1 then
    v_streak := v_before.streak_days + 1;      -- kept it alive
  else
    v_streak := 1;                             -- broke it, start over
  end if;

  -- Streak bonus is paid once per day, not once per round.
  if v_before.last_played_on is distinct from current_date then
    v_streak_bonus := least(v_streak * 5, 100);
  end if;

  v_perfect := v_session.correct_count = array_length(v_session.question_ids, 1)
               and v_session.correct_count > 0;
  if v_perfect then
    v_perfect_bonus := 25;
  end if;

  -- Bonuses are folded in BEFORE the level is derived, so a streak bonus can
  -- itself trigger the level up it earned. There is deliberately no "level up
  -- bonus" any more: awarding XP for gaining a level would compound into
  -- itself now that XP is the only currency.
  v_total_xp  := v_session.xp_awarded + v_streak_bonus + v_perfect_bonus;
  v_new_xp    := v_before.xp + v_total_xp;
  v_new_level := level_for_xp(v_new_xp);
  v_levels_up := greatest(v_new_level - v_before.level, 0);

  update game_sessions set finished_at = now() where id = p_session;

  update fan_profiles
     set xp             = v_new_xp,
         level          = v_new_level,
         rounds_played  = rounds_played + 1,
         streak_days    = v_streak,
         best_streak    = greatest(best_streak, v_streak),
         last_played_on = current_date,
         total_answered = total_answered + array_length(v_session.question_ids, 1),
         total_correct  = total_correct + v_session.correct_count
   where id = v_fan;

  -- Ledger rows are written directly rather than through award_xp(), because
  -- fan_profiles.xp was already set above in one atomic update.
  if v_session.xp_awarded > 0 then
    insert into xp_ledger (fan_id, delta, reason, ref_id, note)
    values (v_fan, v_session.xp_awarded, 'game_reward', p_session,
            v_session.kind::text || ' round');
  end if;
  if v_streak_bonus > 0 then
    insert into xp_ledger (fan_id, delta, reason, ref_id, note)
    values (v_fan, v_streak_bonus, 'streak_bonus', p_session,
            v_streak::text || '-day streak');
  end if;
  if v_perfect_bonus > 0 then
    insert into xp_ledger (fan_id, delta, reason, ref_id, note)
    values (v_fan, v_perfect_bonus, 'perfect_bonus', p_session, 'Perfect round');
  end if;

  -- Affinity is the currency of the revenue split: playing an artist's games
  -- is what routes a slice of this fan's subscription to that artist.
  update fan_artists
     set affinity = affinity + v_session.correct_count + 1,
         xp_with  = xp_with + v_total_xp
   where fan_id = v_fan and artist_id = v_session.artist_id;

  -- What this round actually opened up. This is the payoff moment now that
  -- rewards unlock by rank instead of being bought.
  select coalesce(jsonb_agg(jsonb_build_object(
           'id', r.id, 'title', r.title, 'tier', r.tier, 'kind', r.kind,
           'artist', a.name, 'slug', a.slug)), '[]'::jsonb)
    into v_unlocked
    from rewards r
    join artists a on a.id = r.artist_id
   where r.active
     and not r.is_high_ticket
     and r.requires_level > v_before.level
     and r.requires_level <= v_new_level
     and exists (select 1 from fan_artists fa
                  where fa.fan_id = v_fan and fa.artist_id = r.artist_id);

  return jsonb_build_object(
    'correct',       v_session.correct_count,
    'total',         array_length(v_session.question_ids, 1),
    'perfect',       v_perfect,
    'xp_earned',     v_total_xp,
    'base_xp',       v_session.xp_awarded,
    'streak_bonus',  v_streak_bonus,
    'perfect_bonus', v_perfect_bonus,
    'xp',            v_new_xp,
    'level',         v_new_level,
    'levelled_up',   v_levels_up > 0,
    'levels_gained', v_levels_up,
    'rank',          rank_for_level(v_new_level),
    'rank_changed',  rank_for_level(v_new_level) is distinct from rank_for_level(v_before.level),
    'xp_into_level', v_new_xp - xp_for_level(v_new_level),
    'xp_for_next',   xp_for_level(v_new_level + 1) - xp_for_level(v_new_level),
    'streak_days',   v_streak,
    'unlocked',      v_unlocked
  );
end
$fn$;

-- == Shelf: claim a reward your rank has unlocked ============================
create or replace function claim_reward(
  p_reward     uuid,
  p_fulfilment jsonb default '{}'::jsonb
) returns jsonb
language plpgsql security definer set search_path = public as $fn$
declare
  v_fan        uuid := auth.uid();
  v_reward     rewards%rowtype;
  v_fan_row    fan_profiles%rowtype;
  v_owned      integer;
  v_sub_ok     boolean;
  v_code       text;
  v_redemption uuid;
begin
  if v_fan is null then
    raise exception 'not authenticated' using errcode = '28000';
  end if;

  -- Lock the reward row: without this, two simultaneous claims on the last
  -- item in stock would both succeed.
  select * into v_reward from rewards where id = p_reward for update;
  if not found or not v_reward.active then
    raise exception 'reward unavailable' using errcode = 'P0002';
  end if;
  if v_reward.is_high_ticket then
    raise exception 'this reward is awarded by monthly draw, not claimed' using errcode = 'P0001';
  end if;
  if v_reward.stock is not null and v_reward.claimed_count >= v_reward.stock then
    raise exception 'sold out' using errcode = 'P0001';
  end if;

  select * into v_fan_row from fan_profiles where id = v_fan for update;

  -- Rank is the only gate. No balance to check, nothing to deduct.
  if v_fan_row.level < v_reward.requires_level then
    raise exception 'reach level % (%) to unlock this',
      v_reward.requires_level, rank_for_level(v_reward.requires_level)
      using errcode = 'P0001';
  end if;

  select count(*) into v_owned from redemptions
   where fan_id = v_fan and reward_id = p_reward
     and state <> 'cancelled' and state <> 'rejected';
  if v_owned >= v_reward.per_fan_limit then
    raise exception 'already claimed' using errcode = 'P0001';
  end if;

  if v_reward.requires_subscription then
    select exists (
      select 1 from subscriptions
       where fan_id = v_fan and state in ('trialing', 'active')
    ) into v_sub_ok;
    if not v_sub_ok then
      raise exception 'subscribers only' using errcode = 'P0001';
    end if;
  end if;

  v_code := upper(substr(encode(gen_random_bytes(6), 'hex'), 1, 10));

  insert into redemptions (fan_id, reward_id, claimed_at_level, fulfilment, claim_code, state)
  values (v_fan, p_reward, v_fan_row.level, coalesce(p_fulfilment, '{}'::jsonb), v_code,
          case when v_reward.kind in ('exclusive_audio', 'exclusive_video', 'discount_code')
               then 'fulfilled' else 'pending' end)
  returning id into v_redemption;

  update rewards set claimed_count = claimed_count + 1 where id = p_reward;

  return jsonb_build_object(
    'redemption_id', v_redemption,
    'claim_code',    v_code,
    'level',         v_fan_row.level,
    'rank',          rank_for_level(v_fan_row.level),
    'reward',        jsonb_build_object('title', v_reward.title, 'kind', v_reward.kind,
                                        'tier', v_reward.tier)
  );
end
$fn$;

-- == Monthly draw entry ======================================================
create or replace function enter_draw(p_draw uuid, p_free boolean default false) returns jsonb
language plpgsql security definer set search_path = public as $fn$
declare
  v_fan    uuid := auth.uid();
  v_draw   draws%rowtype;
  v_level  integer;
  v_weight integer;
begin
  if v_fan is null then
    raise exception 'not authenticated' using errcode = '28000';
  end if;

  select * into v_draw from draws where id = p_draw;
  if not found then
    raise exception 'draw not found' using errcode = 'P0002';
  end if;
  if now() < v_draw.opens_at or now() > v_draw.closes_at or v_draw.drawn_at is not null then
    raise exception 'draw is not open' using errcode = 'P0001';
  end if;

  select level into v_level from fan_profiles where id = v_fan;

  -- Entry costs nothing -- rank alone decides how many tickets you hold.
  -- Free (AMOE) entries always carry exactly one, which is what keeps a
  -- no-purchase-necessary path meaningful.
  v_weight := case when p_free then 1 else draw_weight_for_level(v_level) end;

  insert into draw_entries (draw_id, fan_id, weight, is_free)
  values (p_draw, v_fan, v_weight, p_free)
  on conflict (draw_id, fan_id) do nothing;

  return jsonb_build_object(
    'draw_id',      p_draw,
    'weight',       v_weight,
    'rank',         rank_for_level(v_level),
    'total_weight', (select coalesce(sum(weight), 0) from draw_entries where draw_id = p_draw)
  );
end
$fn$;

-- == Pick a winner (admin / scheduled job, service role only) ================
create or replace function run_draw(p_draw uuid) returns jsonb
language plpgsql security definer set search_path = public as $fn$
declare
  v_draw   draws%rowtype;
  v_total  bigint;
  v_roll   bigint;
  v_winner uuid;
  v_code   text;
begin
  select * into v_draw from draws where id = p_draw for update;
  if not found then
    raise exception 'draw not found' using errcode = 'P0002';
  end if;
  if v_draw.drawn_at is not null then
    raise exception 'draw already run' using errcode = 'P0001';
  end if;

  select coalesce(sum(weight), 0) into v_total from draw_entries where draw_id = p_draw;
  if v_total = 0 then
    raise exception 'no entries' using errcode = 'P0001';
  end if;

  -- Weighted pick: roll a number in [1, total] and walk the running sum.
  v_roll := 1 + floor(random() * v_total)::bigint;
  select fan_id into v_winner from (
    select fan_id, sum(weight) over (order by created_at, id) as running
      from draw_entries where draw_id = p_draw
  ) t where t.running >= v_roll order by t.running limit 1;

  v_code := upper(substr(encode(gen_random_bytes(6), 'hex'), 1, 10));

  update draws set drawn_at = now(), winner_fan_id = v_winner where id = p_draw;

  insert into redemptions (fan_id, reward_id, claimed_at_level, state, claim_code, won_via_draw)
  values (v_winner, v_draw.reward_id,
          coalesce((select level from fan_profiles where id = v_winner), 1),
          'approved', v_code, p_draw);

  return jsonb_build_object('draw_id', p_draw, 'winner_fan_id', v_winner,
                            'total_weight', v_total, 'claim_code', v_code);
end
$fn$;
revoke execute on function run_draw(uuid) from anon, authenticated;

-- == Revenue split: route subscription money to artists by affinity ==========
-- For each paying fan, their artist pool is divided in proportion to the
-- affinity they built with each artist. An artist then keeps rev_share_pct of
-- the slice allocated to them.
create or replace function allocate_revenue(p_month date default date_trunc('month', now())::date)
returns jsonb
language plpgsql security definer set search_path = public as $fn$
declare
  v_rows integer := 0;
begin
  insert into revenue_splits (fan_id, artist_id, period_month, affinity, weight, amount_cents)
  select fa.fan_id,
         fa.artist_id,
         p_month,
         fa.affinity,
         (fa.affinity::numeric / nullif(totals.total_affinity, 0)) as weight,
         floor(
           s.price_cents
           * (fa.affinity::numeric / nullif(totals.total_affinity, 0))
           * a.rev_share_pct
         )::integer
    from fan_artists fa
    join artists a on a.id = fa.artist_id
    join subscriptions s on s.fan_id = fa.fan_id and s.state in ('active', 'trialing')
    join (
      select fan_id, sum(affinity) as total_affinity
        from fan_artists group by fan_id
    ) totals on totals.fan_id = fa.fan_id
   where fa.affinity > 0 and totals.total_affinity > 0
  on conflict (fan_id, artist_id, period_month) do update
     set affinity     = excluded.affinity,
         weight       = excluded.weight,
         amount_cents = excluded.amount_cents;

  get diagnostics v_rows = row_count;

  insert into artist_payouts (artist_id, period_month, gross_cents, fan_count)
  select artist_id, p_month, sum(amount_cents), count(distinct fan_id)
    from revenue_splits where period_month = p_month
   group by artist_id
  on conflict (artist_id, period_month) do update
     set gross_cents = excluded.gross_cents,
         fan_count   = excluded.fan_count;

  return jsonb_build_object('period_month', p_month, 'splits', v_rows);
end
$fn$;
revoke execute on function allocate_revenue(date) from anon, authenticated;

-- == Execute grants ==========================================================
grant execute on function start_game(text, game_kind, integer)        to authenticated;
grant execute on function submit_answer(uuid, uuid, integer, integer) to authenticated;
grant execute on function finish_game(uuid)                           to authenticated;
grant execute on function claim_reward(uuid, jsonb)                   to authenticated;
grant execute on function enter_draw(uuid, boolean)                   to authenticated;
grant execute on function xp_for_level(integer)                       to authenticated;
grant execute on function level_for_xp(integer)                       to authenticated;
grant execute on function rank_for_level(integer)                     to authenticated;
grant execute on function draw_weight_for_level(integer)              to authenticated;

-- award_xp is internal: exposing it would let any fan grant themselves XP,
-- which is now the same thing as granting themselves merchandise.
revoke execute on function award_xp(uuid, integer, ledger_reason, uuid, text)
  from anon, authenticated;
