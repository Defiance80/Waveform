import React from 'react';
import Link from 'next/link';
import { Store, Lock, Unlock } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { getFanContext } from '@/lib/fan';
import { RewardCard } from '@/components/fan/RewardCard';
import { rankForLevel, nextRank, xpForLevel } from '@/lib/game/progression';
import type { Reward } from '@/lib/types';

export const dynamic = 'force-dynamic';

const FILTERS = [
  { key: 'all',       label: 'Everything' },
  { key: 'unlocked',  label: 'Unlocked' },
  { key: 'locked',    label: 'Next to unlock' },
  { key: 'exclusive', label: 'Exclusive media' },
  { key: 'physical',  label: 'Physical' },
  { key: 'draw',      label: 'Monthly draws' },
];

export default async function ShelfPage({ searchParams }: { searchParams: { filter?: string } }) {
  const { fan, hasAccess } = await getFanContext();
  const supabase = createClient();

  const filter = searchParams.filter ?? 'all';

  // Scope the shelf to artists this fan follows — an exclusive shelf is a
  // relationship, not a public catalog.
  const { data: follows } = await supabase
    .from('fan_artists')
    .select('artist_id')
    .eq('fan_id', fan.id);

  const artistIds = (follows ?? []).map((f: any) => f.artist_id);

  if (artistIds.length === 0) {
    return (
      <div className="text-center py-20">
        <Store size={28} className="text-[#00C2FF] mx-auto mb-3" />
        <p className="font-bold text-white mb-1.5">Your shelf is empty</p>
        <p className="text-sm text-[#A0A0A0] max-w-sm mx-auto mb-6">
          Follow an artist to see theirs. Every artist stocks their own rewards, and each one opens
          up at a rank you have to earn.
        </p>
        <Link
          href="/fan/discover"
          className="inline-flex px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
          style={{ background: 'linear-gradient(135deg, #00C2FF, #7B2EFF)' }}
        >
          Find artists
        </Link>
      </div>
    );
  }

  const [{ data: rewards }, { data: claims }, { data: artists }] = await Promise.all([
    supabase
      .from('rewards')
      .select('*')
      .in('artist_id', artistIds)
      .eq('active', true)
      .order('requires_level', { ascending: true }),
    supabase.from('redemptions').select('reward_id').eq('fan_id', fan.id),
    supabase.from('artists').select('id, name').in('id', artistIds),
  ]);

  const nameById = new Map((artists ?? []).map((a: any) => [a.id, a.name as string]));
  const claimedIds = new Set((claims ?? []).map((c: any) => c.reward_id));

  const all = (rewards ?? []) as Reward[];
  const unlockedCount = all.filter((r) => !r.is_high_ticket && fan.level >= r.requires_level).length;

  const list = all.filter((r) => {
    switch (filter) {
      case 'unlocked':  return !r.is_high_ticket && fan.level >= r.requires_level;
      case 'locked':    return !r.is_high_ticket && fan.level < r.requires_level;
      case 'exclusive': return r.kind === 'exclusive_audio' || r.kind === 'exclusive_video';
      case 'physical':  return ['swag', 'vinyl', 'cd', 'signed_item'].includes(r.kind);
      case 'draw':      return r.is_high_ticket;
      default:          return true;
    }
  });

  const rank = rankForLevel(fan.level);
  const next = nextRank(fan.level);
  const xpToNextRank = next ? Math.max(0, xpForLevel(next.min) - fan.xp) : 0;

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Shelf</h1>
          <p className="text-sm text-[#A0A0A0] mt-1">
            Nothing is bought here. Everything is earned by rank.
          </p>
        </div>

        <div
          className="px-4 py-2.5 rounded-xl"
          style={{ background: `${rank.color}14`, boxShadow: `inset 0 0 0 1px ${rank.color}38` }}
        >
          <p className="text-xs font-extrabold" style={{ color: rank.color }}>
            LVL {fan.level} · {rank.name}
          </p>
          <p className="text-[11px] text-[#A0A0A0] mt-0.5 tabular-nums">
            <Unlock size={10} className="inline mb-0.5" /> {unlockedCount} unlocked
          </p>
        </div>
      </div>

      {next && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#0D0D0D] border border-[#1E1E1E]">
          <Lock size={14} className="text-[#666] flex-shrink-0" />
          <p className="text-xs text-[#A0A0A0]">
            <span className="text-white font-semibold tabular-nums">
              {xpToNextRank.toLocaleString()} XP
            </span>{' '}
            until{' '}
            <span style={{ color: next.color }} className="font-semibold">
              {next.name}
            </span>{' '}
            (level {next.min}) opens the next shelf.
          </p>
        </div>
      )}

      <div className="flex gap-2 overflow-x-auto pb-1">
        {FILTERS.map((f) => (
          <Link
            key={f.key}
            href={`/fan/shop?filter=${f.key}`}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
              f.key === filter
                ? 'text-white bg-[#151515] shadow-[inset_0_0_0_1px_rgba(0,194,255,0.3)]'
                : 'text-[#A0A0A0] bg-[#111] hover:text-white'
            }`}
          >
            {f.label}
          </Link>
        ))}
      </div>

      {list.length === 0 ? (
        <p className="text-center text-sm text-[#A0A0A0] py-16">Nothing matches that filter yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {list.map((r) => (
            <RewardCard
              key={r.id}
              reward={r}
              artistName={nameById.get(r.artist_id)}
              level={fan.level}
              xp={fan.xp}
              hasAccess={hasAccess}
              alreadyClaimed={claimedIds.has(r.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
