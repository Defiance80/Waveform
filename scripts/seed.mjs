#!/usr/bin/env node
// ============================================================================
// SLAPBOX SEEDER
//
//   npm run seed
//
// Idempotent: artists upsert on slug, and each demo artist's questions,
// rewards and draws are rebuilt from scratch on every run. Safe to re-run
// after editing scripts/seed-data.mjs.
//
// Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in
// .env.local. The service role key bypasses RLS -- it must never be exposed
// to the browser or committed.
// ============================================================================

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'node:fs';
import { ARTISTS, REWARD_TEMPLATES, QUESTION_BUILDERS, FILLER } from './seed-data.mjs';

// ── Load .env.local without a dependency ────────────────────────────────────
try {
  for (const line of readFileSync(new URL('../.env.local', import.meta.url), 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch {
  // no .env.local -- fall through to the check below
}

const URL_ = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!URL_ || !KEY) {
  console.error('\n  Missing credentials.\n');
  console.error('  Add these to .env.local (Supabase dashboard > Project Settings > API):');
  console.error('    NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co');
  console.error('    SUPABASE_SERVICE_ROLE_KEY=eyJ...\n');
  process.exit(1);
}

const db = createClient(URL_, KEY, { auth: { persistSession: false } });

// ── Distractor pools, built from every artist's canon ───────────────────────
const POOL_OF = {
  mixtape:     (a) => a.canon.mixtape,
  hometown:    (a) => a.hometown,
  single:      (a) => a.canon.single,
  album:       (a) => a.canon.album,
  label:       (a) => a.canon.label,
  adlib:       (a) => `"${a.canon.adlib}"`,
  crew:        (a) => a.canon.crew,
  year:        (a) => String(a.canon.albumYear),
  mixtapeYear: (a) => String(a.canon.mixtapeYear),
  lyric:       (a) => a.canon.lyricAnswer,
  producer:    (a) => a.canon.producer,
  feature:     (a) => a.canon.feature,
  venue:       (a) => a.canon.venue,
};

const POOLS = Object.fromEntries(
  Object.entries(POOL_OF).map(([name, get]) => [
    name,
    [...new Set(ARTISTS.map(get).concat(FILLER[name] ?? []))],
  ])
);

const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

function buildQuestion(artist, builder) {
  const answer = builder.answer(artist);
  const distractors = shuffle(POOLS[builder.pool].filter((v) => v !== answer)).slice(0, 3);

  // A pool too small to yield three distinct wrong answers would produce a
  // question with duplicate choices -- skip it rather than ship it broken.
  if (distractors.length < 3) return null;

  const choices = shuffle([answer, ...distractors]);
  return {
    kind: builder.kind,
    prompt: builder.prompt(artist),
    choices,
    correct_index: choices.indexOf(answer),
    difficulty: builder.difficulty,
    explanation: builder.explanation(artist),
  };
}

async function main() {
  console.log(`\nSeeding ${ARTISTS.length} demo artists into ${URL_}\n`);

  let totalQuestions = 0, totalRewards = 0, totalDraws = 0, skipped = 0;

  for (const a of ARTISTS) {
    // ---- artist -----------------------------------------------------------
    const { data: artist, error: artistErr } = await db
      .from('artists')
      .upsert({
        slug: a.slug,
        name: a.name,
        kind: 'artist',
        genre: a.genre,
        hometown: a.hometown,
        bio: a.bio,
        accent_color: a.accent,
        monthly_listeners: a.listeners,
        verified: true,
        is_demo: true,
        rev_share_pct: 0.5,
      }, { onConflict: 'slug' })
      .select()
      .single();

    if (artistErr) throw new Error(`artist ${a.slug}: ${artistErr.message}`);

    // ---- questions (rebuilt each run) --------------------------------------
    await db.from('questions').delete().eq('artist_id', artist.id);

    const built = QUESTION_BUILDERS.map((b) => buildQuestion(a, b)).filter(Boolean);
    skipped += QUESTION_BUILDERS.length - built.length;

    const { data: inserted, error: qErr } = await db
      .from('questions')
      .insert(built.map((q) => ({
        artist_id: artist.id,
        kind: q.kind,
        prompt: q.prompt,
        choices: q.choices,
        difficulty: q.difficulty,
        explanation: q.explanation,
      })))
      .select('id');

    if (qErr) throw new Error(`questions ${a.slug}: ${qErr.message}`);

    // Answer key goes into the locked-down table, positionally matched.
    const { error: ansErr } = await db.from('question_answers').insert(
      inserted.map((row, i) => ({ question_id: row.id, correct_index: built[i].correct_index }))
    );
    if (ansErr) throw new Error(`answers ${a.slug}: ${ansErr.message}`);
    totalQuestions += inserted.length;

    // ---- rewards (rebuilt each run) ----------------------------------------
    // Delete only rewards with no claims against them, so re-seeding never
    // destroys a fan's redemption history or their Vault.
    const { data: existing } = await db.from('rewards').select('id').eq('artist_id', artist.id);
    for (const r of existing ?? []) {
      const { count } = await db
        .from('redemptions').select('id', { count: 'exact', head: true }).eq('reward_id', r.id);
      if (!count) await db.from('rewards').delete().eq('id', r.id);
    }

    const { data: rewards, error: rErr } = await db
      .from('rewards')
      .insert(REWARD_TEMPLATES.map((t) => ({
        artist_id: artist.id,
        title: t.title(a),
        description: t.desc(a),
        kind: t.kind,
        tier: t.tier,
        stock: t.stock,
        requires_level: t.level,
        requires_subscription: t.sub,
        is_high_ticket: !!t.highTicket,
      })))
      .select('id, is_high_ticket');

    if (rErr) throw new Error(`rewards ${a.slug}: ${rErr.message}`);
    totalRewards += rewards.length;

    // ---- this month's high-ticket draw --------------------------------------
    const highTicket = rewards.find((r) => r.is_high_ticket);
    if (highTicket) {
      const now = new Date();
      const first = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
      const last  = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0, 23, 59, 59));

      const { error: dErr } = await db.from('draws').upsert({
        artist_id: artist.id,
        reward_id: highTicket.id,
        period_month: first.toISOString().slice(0, 10),
        opens_at: first.toISOString(),
        closes_at: last.toISOString(),
        is_sweepstakes: true,
      }, { onConflict: 'reward_id,period_month' });

      if (dErr) throw new Error(`draw ${a.slug}: ${dErr.message}`);
      totalDraws++;
    }

    console.log(`  ${a.name.padEnd(20)} ${String(inserted.length).padStart(2)} questions  ${rewards.length} rewards`);
  }

  console.log(`\nDone. ${totalQuestions} questions, ${totalRewards} rewards, ${totalDraws} open draws.`);
  if (skipped) console.log(`(${skipped} question templates skipped: distractor pool too small.)`);
  console.log('');
}

main().catch((e) => {
  console.error('\nSeed failed:', e.message, '\n');
  process.exit(1);
});
