import React from 'react';
import Link from 'next/link';
import { Package, Truck, Check, Clock, Trophy, Ban } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { getFanContext } from '@/lib/fan';
import { TIER_STYLE, REWARD_LABEL } from '@/lib/game/progression';
import type { RedemptionState } from '@/lib/types';

export const dynamic = 'force-dynamic';

const STATE_STYLE: Record<RedemptionState, { label: string; color: string; icon: React.ElementType }> = {
  pending:   { label: 'Awaiting the artist', color: '#FFB800', icon: Clock },
  approved:  { label: 'Approved',            color: '#00C2FF', icon: Check },
  fulfilled: { label: 'Ready',               color: '#00FF9C', icon: Check },
  shipped:   { label: 'Shipped',             color: '#00C2FF', icon: Truck },
  delivered: { label: 'Delivered',           color: '#00FF9C', icon: Check },
  rejected:  { label: 'Declined',            color: '#FF3B3B', icon: Ban },
  cancelled: { label: 'Cancelled',           color: '#666666', icon: Ban },
};

export default async function VaultPage() {
  const { fan } = await getFanContext();
  const supabase = createClient();

  const { data: redemptions } = await supabase
    .from('redemptions')
    .select('*, rewards(title, description, kind, tier, artist_id, artists(name, slug, accent_color))')
    .eq('fan_id', fan.id)
    .order('created_at', { ascending: false });

  const list = (redemptions ?? []) as any[];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Vault</h1>
        <p className="text-sm text-[#A0A0A0] mt-1">Everything you&apos;ve claimed and won.</p>
      </div>

      {list.length === 0 ? (
        <div className="bg-[#111111] border border-dashed border-[#2A2A2A] rounded-2xl p-10 text-center">
          <Package size={26} className="text-[#00C2FF] mx-auto mb-3" />
          <p className="font-bold text-white mb-1.5">Nothing in the vault yet</p>
          <p className="text-sm text-[#A0A0A0] max-w-sm mx-auto mb-5">
            Play trivia to climb the ranks. Each rank opens a new shelf — merch, unreleased tracks, signed vinyl.
          </p>
          <Link
            href="/fan/shop"
            className="inline-flex px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{ background: 'linear-gradient(135deg, #00C2FF, #7B2EFF)' }}
          >
            Open the shelf
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {list.map((r) => {
            const reward = r.rewards;
            const artist = reward?.artists;
            const state = STATE_STYLE[r.state as RedemptionState] ?? STATE_STYLE.pending;
            const tier = TIER_STYLE[reward?.tier] ?? TIER_STYLE.common;
            const StateIcon = state.icon;

            return (
              <div
                key={r.id}
                className="bg-[#111111] border border-[#1E1E1E] rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center gap-4"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1.5">
                    <span
                      className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                      style={{ color: tier.color, background: `${tier.color}1A` }}
                    >
                      {tier.label}
                    </span>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[#666]">
                      {REWARD_LABEL[reward?.kind] ?? reward?.kind}
                    </span>
                    {r.won_via_draw && (
                      <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#C9A86A]">
                        <Trophy size={11} /> Draw winner
                      </span>
                    )}
                  </div>

                  <p className="font-bold text-white text-sm">{reward?.title}</p>
                  {artist && (
                    <Link
                      href={`/fan/a/${artist.slug}`}
                      className="text-xs hover:underline"
                      style={{ color: artist.accent_color ?? '#00C2FF' }}
                    >
                      {artist.name}
                    </Link>
                  )}

                  <p className="text-[11px] text-[#666] mt-2">
                    Claimed {new Date(r.created_at).toLocaleDateString(undefined, {
                      month: 'short', day: 'numeric', year: 'numeric',
                    })}
                    {r.claimed_at_level > 0 && ` · unlocked at level ${r.claimed_at_level}`}
                  </p>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:gap-1.5 flex-shrink-0">
                  <span
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold"
                    style={{ color: state.color, background: `${state.color}1A` }}
                  >
                    <StateIcon size={12} /> {state.label}
                  </span>
                  {r.claim_code && (
                    <span className="font-mono text-xs text-white bg-[#0A0A0A] px-2.5 py-1 rounded-lg border border-[#2A2A2A]">
                      {r.claim_code}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
