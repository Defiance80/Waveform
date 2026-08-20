import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import * as Icons from 'lucide-react';
import { BadgeCheck, Users, MapPin, ChevronRight, Ticket } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { getFanContext } from '@/lib/fan';
import { ArtistAvatar } from '@/components/fan/ArtistAvatar';
import { RewardCard } from '@/components/fan/RewardCard';
import { FollowButton } from '@/components/fan/FollowButton';
import { GAME_MODES, drawWeightForLevel, rankForLevel } from '@/lib/game/progression';
import type { Artist, Reward } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function ArtistPage({ params }: { params: { slug: string } }) {
  const { fan, hasAccess } = await getFanContext();
  const supabase = createClient();

  const { data: artist } = await supabase
    .from('artists')
    .select('*')
    .eq('slug', params.slug)
    .maybeSingle();

  if (!artist) notFound();
  const a = artist as Artist;

  const [{ data: rewards }, { data: link }, { data: claims }, { data: modeCounts }, { data: draw }] =
    await Promise.all([
      supabase
        .from('rewards')
        .select('*')
        .eq('artist_id', a.id)
        .eq('active', true)
        .order('requires_level', { ascending: true }),
      supabase
        .from('fan_artists')
        .select('*')
        .eq('fan_id', fan.id)
        .eq('artist_id', a.id)
        .maybeSingle(),
      supabase.from('redemptions').select('reward_id').eq('fan_id', fan.id),
      supabase.from('questions').select('kind').eq('artist_id', a.id).eq('active', true),
      supabase
        .from('draws')
        .select('id, closes_at, rewards(title, tier)')
        .eq('artist_id', a.id)
        .is('drawn_at', null)
        .gt('closes_at', new Date().toISOString())
        .maybeSingle(),
    ]);

  const claimedIds = new Set((claims ?? []).map((c: any) => c.reward_id));
  const available = new Set((modeCounts ?? []).map((q: any) => q.kind));
  const accent = a.accent_color ?? '#00C2FF';

  return (
    <div className="space-y-6">
      {/* ── Banner ───────────────────────────────────────────────────────── */}
      <section className="rounded-2xl overflow-hidden border border-[#1E1E1E] bg-[#111111]">
        <div
          className="h-28 sm:h-36"
          style={{ background: `linear-gradient(135deg, ${accent}44, transparent 65%), #0D0D0D` }}
        />
        <div className="px-5 pb-5 -mt-10">
          <div className="flex items-end justify-between gap-4">
            <ArtistAvatar name={a.name} accent={accent} size={80} rounded="xl" className="ring-4 ring-[#111111]" />
            <FollowButton
              artistId={a.id}
              fanId={fan.id}
              initialFollowing={!!link}
              initialFavorite={!!link?.is_favorite}
              accent={accent}
            />
          </div>

          <h1 className="text-2xl font-extrabold text-white mt-3 flex items-center gap-2">
            {a.name}
            {a.verified && <BadgeCheck size={20} className="text-[#00C2FF]" />}
          </h1>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#A0A0A0] mt-1.5">
            <span className="font-semibold" style={{ color: accent }}>{a.genre}</span>
            {a.hometown && <span className="flex items-center gap-1"><MapPin size={12} /> {a.hometown}</span>}
            <span className="flex items-center gap-1">
              <Users size={12} /> {(a.monthly_listeners ?? 0).toLocaleString()} monthly listeners
            </span>
          </div>

          <p className="text-sm text-[#999] mt-3 leading-relaxed max-w-2xl">{a.bio}</p>

          {link && (
            <div className="flex gap-4 mt-4 pt-4 border-t border-[#1E1E1E]">
              <Metric label="Your affinity" value={link.affinity} accent={accent} />
              <Metric label="XP with them" value={link.xp_with.toLocaleString()} accent={accent} />
            </div>
          )}
        </div>
      </section>

      {/* ── Minigames ────────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-bold text-white mb-1">Play</h2>
        <p className="text-xs text-[#666] mb-3">
          Every correct answer is XP toward the rank that unlocks the shelf below.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {GAME_MODES.map((m) => {
            const Icon = (Icons as any)[m.icon] ?? Icons.Gamepad2;
            const playable = available.has(m.kind) || m.kind === 'daily_drop';

            return playable ? (
              <Link
                key={m.kind}
                href={`/fan/play/${a.slug}/${m.kind}`}
                className="group bg-[#111111] border border-[#1E1E1E] rounded-2xl p-4 transition-all hover:scale-[1.02]"
                style={{ boxShadow: `inset 0 0 0 1px transparent` }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110"
                  style={{ background: `${m.color}1A` }}
                >
                  <Icon size={19} style={{ color: m.color }} />
                </div>
                <p className="font-bold text-white text-sm">{m.name}</p>
                <p className="text-xs text-[#777] mt-1 leading-relaxed">{m.tagline}</p>
                <p className="text-[11px] mt-2.5 font-semibold flex items-center gap-1" style={{ color: m.color }}>
                  Play <ChevronRight size={12} />
                </p>
              </Link>
            ) : (
              <div
                key={m.kind}
                className="bg-[#0D0D0D] border border-dashed border-[#1E1E1E] rounded-2xl p-4 opacity-50"
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 bg-[#151515]">
                  <Icon size={19} className="text-[#555]" />
                </div>
                <p className="font-bold text-[#777] text-sm">{m.name}</p>
                <p className="text-xs text-[#555] mt-1">No questions yet</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── This month's draw ────────────────────────────────────────────── */}
      {draw && (
        <Link
          href="/fan/draws"
          className="flex items-center gap-4 p-4 rounded-2xl border transition-all hover:scale-[1.01]"
          style={{ background: 'rgba(201,168,106,0.07)', borderColor: 'rgba(201,168,106,0.3)' }}
        >
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(201,168,106,0.15)' }}
          >
            <Ticket size={20} className="text-[#C9A86A]" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-bold text-white text-sm truncate">{(draw as any).rewards?.title}</p>
            <p className="text-xs text-[#A0A0A0]">
              Your rank is worth {drawWeightForLevel(fan.level)} ticket
              {drawWeightForLevel(fan.level) === 1 ? '' : 's'} · closes{' '}
              {new Date((draw as any).closes_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            </p>
          </div>
          <ChevronRight size={18} className="text-[#C9A86A] flex-shrink-0" />
        </Link>
      )}

      {/* ── Shop ─────────────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-bold text-white mb-1">{a.name}&apos;s shelf</h2>
        <p className="text-xs text-[#666] mb-3">
          You&apos;re level <span className="text-white font-semibold">{fan.level}</span> —{' '}
          <span style={{ color: rankForLevel(fan.level).color }} className="font-semibold">
            {rankForLevel(fan.level).name}
          </span>
          . Climb to unlock more.
        </p>

        {!rewards || rewards.length === 0 ? (
          <p className="text-sm text-[#A0A0A0] py-8 text-center">No rewards listed yet.</p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-3">
            {(rewards as Reward[]).map((r) => (
              <RewardCard
                key={r.id}
                reward={r}
                level={fan.level}
                xp={fan.xp}
                hasAccess={hasAccess}
                alreadyClaimed={claimedIds.has(r.id)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function Metric({ label, value, accent }: { label: string; value: React.ReactNode; accent: string }) {
  return (
    <div>
      <p className="text-lg font-extrabold tabular-nums" style={{ color: accent }}>{value}</p>
      <p className="text-[11px] text-[#666]">{label}</p>
    </div>
  );
}
