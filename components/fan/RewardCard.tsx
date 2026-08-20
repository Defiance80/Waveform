'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Lock, Check, Loader2, Ticket, Shirt, Disc3, Music, Video, Percent,
  Sparkles, Users, PenLine, Package, Unlock,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { TIER_STYLE, REWARD_LABEL, rankForLevel, xpForLevel } from '@/lib/game/progression';
import type { Reward, ClaimResult } from '@/lib/types';

const ICONS: Record<string, React.ElementType> = {
  swag: Shirt,
  ticket: Ticket,
  private_event: Users,
  exclusive_audio: Music,
  exclusive_video: Video,
  vinyl: Disc3,
  cd: Disc3,
  signed_item: PenLine,
  meet_greet: Users,
  discount_code: Percent,
};

export function RewardCard({
  reward,
  artistName,
  level,
  xp,
  hasAccess,
  alreadyClaimed,
}: {
  reward: Reward;
  artistName?: string;
  level: number;
  xp: number;
  hasAccess: boolean;
  alreadyClaimed: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [claimed, setClaimed] = useState<ClaimResult | null>(null);

  const tier = TIER_STYLE[reward.tier] ?? TIER_STYLE.common;
  const Icon = ICONS[reward.kind] ?? Package;

  // The gate is rank, not a balance.
  const gateRank = rankForLevel(reward.requires_level);
  const unlocked = level >= reward.requires_level;
  const xpToUnlock = Math.max(0, xpForLevel(reward.requires_level) - xp);

  const soldOut = reward.stock !== null && reward.claimed_count >= reward.stock;
  const needsSub = reward.requires_subscription && !hasAccess;
  const done = alreadyClaimed || !!claimed;

  const blocked = soldOut || !unlocked || needsSub || done;

  const claim = async () => {
    setBusy(true);
    setError('');

    const { data, error: rpcError } = await createClient().rpc('claim_reward', {
      p_reward: reward.id,
      p_fulfilment: {},
    });

    if (rpcError) {
      setError(rpcError.message);
      setBusy(false);
      return;
    }

    setClaimed(data as ClaimResult);
    setBusy(false);
    router.refresh();
  };

  // High-ticket items are never claimable — they route through the draw.
  if (reward.is_high_ticket) {
    return (
      <div
        className="rounded-2xl p-4 border relative overflow-hidden"
        style={{ background: '#111111', borderColor: `${tier.color}44`, boxShadow: `0 0 24px ${tier.glow}` }}
      >
        <div className="flex items-start gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: `${tier.color}1A` }}
          >
            <Icon size={18} style={{ color: tier.color }} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                style={{ color: tier.color, background: `${tier.color}1A` }}
              >
                {tier.label}
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#666]">
                Monthly draw
              </span>
            </div>
            <p className="font-bold text-white text-sm mt-1.5 leading-snug">{reward.title}</p>
            {artistName && <p className="text-xs text-[#A0A0A0] mt-0.5">{artistName}</p>}
            <p className="text-xs text-[#777] mt-2 leading-relaxed">{reward.description}</p>
            <p className="text-[11px] mt-3 flex items-center gap-1.5" style={{ color: tier.color }}>
              <Sparkles size={12} /> Entered by rank in the monthly draw
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl p-4 border bg-[#111111] transition-colors"
      style={{
        borderColor: done
          ? 'rgba(0,255,156,0.3)'
          : unlocked
          ? `${tier.color}44`
          : '#1E1E1E',
        opacity: unlocked || done ? 1 : 0.72,
      }}
    >
      <div className="flex items-start gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: unlocked ? `${tier.color}1A` : '#161616' }}
        >
          <Icon size={18} style={{ color: unlocked ? tier.color : '#555' }} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
              style={{ color: tier.color, background: `${tier.color}1A` }}
            >
              {tier.label}
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#666]">
              {REWARD_LABEL[reward.kind] ?? reward.kind}
            </span>
            {reward.requires_subscription && (
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#7B2EFF]">
                Subscriber
              </span>
            )}
          </div>

          <p className="font-bold text-white text-sm mt-1.5 leading-snug">{reward.title}</p>
          {artistName && <p className="text-xs text-[#A0A0A0] mt-0.5">{artistName}</p>}
          <p className="text-xs text-[#777] mt-2 leading-relaxed">{reward.description}</p>

          {reward.stock !== null && (
            <p className="text-[11px] text-[#666] mt-2">
              {Math.max(0, reward.stock - reward.claimed_count)} of {reward.stock} left
            </p>
          )}
        </div>
      </div>

      {claimed && (
        <div
          className="mt-3 rounded-xl p-3 pop-in"
          style={{ background: 'rgba(0,255,156,0.08)', boxShadow: 'inset 0 0 0 1px rgba(0,255,156,0.3)' }}
        >
          <p className="text-xs font-bold text-[#00FF9C]">Claimed</p>
          <p className="text-[11px] text-[#A0A0A0] mt-1">
            Code <span className="font-mono text-white">{claimed.claim_code}</span> — find it any time
            in your Vault.
          </p>
        </div>
      )}

      {error && <p className="mt-3 text-xs text-[#FF6B6B]">{error}</p>}

      {/* ── Rank gate ───────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-3 mt-3.5 pt-3.5 border-t border-[#1E1E1E]">
        <div className="min-w-0">
          <span
            className="flex items-center gap-1.5 text-xs font-bold"
            style={{ color: unlocked ? gateRank.color : '#777' }}
          >
            {unlocked ? <Unlock size={12} /> : <Lock size={12} />}
            {gateRank.name}
            <span className="text-[#555] font-medium">· LVL {reward.requires_level}</span>
          </span>
          {!unlocked && (
            <p className="text-[11px] text-[#666] mt-0.5 tabular-nums">
              {xpToUnlock.toLocaleString()} XP to go
            </p>
          )}
        </div>

        <button
          onClick={claim}
          disabled={blocked || busy}
          className="px-4 py-2 rounded-xl text-xs font-bold transition-all disabled:cursor-not-allowed flex items-center gap-1.5 flex-shrink-0"
          style={
            blocked
              ? { background: '#1A1A1A', color: '#666' }
              : { background: `linear-gradient(135deg, ${tier.color}, #7B2EFF)`, color: '#fff' }
          }
        >
          {busy ? (
            <><Loader2 size={13} className="animate-spin" /> Claiming</>
          ) : done ? (
            <><Check size={13} /> Claimed</>
          ) : soldOut ? (
            'Sold out'
          ) : needsSub ? (
            <><Lock size={13} /> Subscribers</>
          ) : !unlocked ? (
            <><Lock size={13} /> Locked</>
          ) : (
            'Claim'
          )}
        </button>
      </div>
    </div>
  );
}
