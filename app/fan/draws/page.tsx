import React from 'react';
import Link from 'next/link';
import { Ticket, Trophy, Info } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { getFanContext } from '@/lib/fan';
import { EnterDrawButton } from '@/components/fan/EnterDrawButton';
import { ArtistAvatar } from '@/components/fan/ArtistAvatar';
import { RANKS, rankForLevel, drawWeightForLevel } from '@/lib/game/progression';

export const dynamic = 'force-dynamic';

export default async function DrawsPage() {
  const { fan } = await getFanContext();
  const supabase = createClient();

  const [{ data: draws }, { data: entries }] = await Promise.all([
    supabase
      .from('draws')
      .select('*, rewards(title, description, tier, kind), artists(name, slug, accent_color)')
      .is('drawn_at', null)
      .gt('closes_at', new Date().toISOString())
      .order('closes_at', { ascending: true }),
    supabase.from('draw_entries').select('draw_id, weight').eq('fan_id', fan.id),
  ]);

  const entered = new Map((entries ?? []).map((e: any) => [e.draw_id, e.weight as number]));
  const myRank = rankForLevel(fan.level);
  const myWeight = drawWeightForLevel(fan.level);
  const list = (draws ?? []) as any[];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Monthly draws</h1>
        <p className="text-sm text-[#A0A0A0] mt-1">
          The high-ticket rewards. Not for sale at any point total — your rank buys your odds.
        </p>
      </div>

      {/* ── Your standing ────────────────────────────────────────────────── */}
      <section
        className="rounded-2xl p-5 border"
        style={{ background: 'rgba(201,168,106,0.06)', borderColor: 'rgba(201,168,106,0.25)' }}
      >
        <div className="flex items-center gap-4 flex-wrap">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: `${myRank.color}1A` }}
          >
            <Ticket size={22} style={{ color: myRank.color }} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-bold text-white">
              You hold <span style={{ color: myRank.color }}>{myWeight} ticket{myWeight === 1 ? '' : 's'}</span> per draw
            </p>
            <p className="text-xs text-[#A0A0A0] mt-0.5">
              Level {fan.level} · {myRank.name}. Every rank up multiplies your odds.
            </p>
          </div>
        </div>

        {/* Rank ladder */}
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5 mt-4">
          {RANKS.map((r) => {
            const reached = fan.level >= r.min;
            return (
              <div
                key={r.name}
                className="rounded-lg px-2 py-2 text-center transition-opacity"
                style={{
                  background: reached ? `${r.color}18` : '#0D0D0D',
                  boxShadow: reached ? `inset 0 0 0 1px ${r.color}55` : 'inset 0 0 0 1px #1E1E1E',
                  opacity: reached ? 1 : 0.5,
                }}
              >
                <p className="text-[10px] font-bold uppercase tracking-wide truncate" style={{ color: reached ? r.color : '#555' }}>
                  {r.name}
                </p>
                <p className="text-xs font-extrabold mt-0.5" style={{ color: reached ? '#fff' : '#555' }}>
                  {r.weight}x
                </p>
                <p className="text-[9px] text-[#555] mt-0.5">LVL {r.min}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Open draws ───────────────────────────────────────────────────── */}
      {list.length === 0 ? (
        <div className="bg-[#111111] border border-dashed border-[#2A2A2A] rounded-2xl p-10 text-center">
          <Trophy size={26} className="text-[#C9A86A] mx-auto mb-3" />
          <p className="font-bold text-white mb-1.5">No draws open right now</p>
          <p className="text-sm text-[#A0A0A0]">
            New high-ticket rewards go up at the start of each month.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {list.map((d) => {
            const accent = d.artists?.accent_color ?? '#C9A86A';
            const closes = new Date(d.closes_at);
            const daysLeft = Math.max(0, Math.ceil((closes.getTime() - Date.now()) / 86_400_000));

            return (
              <div
                key={d.id}
                className="bg-[#111111] border rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center gap-4"
                style={{ borderColor: entered.has(d.id) ? 'rgba(0,255,156,0.3)' : '#1E1E1E' }}
              >
                {d.artists && <ArtistAvatar name={d.artists.name} accent={accent} size={48} rounded="xl" />}

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-[#C9A86A] bg-[#C9A86A]/10">
                      {d.rewards?.tier}
                    </span>
                    <span className="text-[10px] font-semibold text-[#666]">
                      {daysLeft === 0 ? 'Closes today' : `${daysLeft} day${daysLeft === 1 ? '' : 's'} left`}
                    </span>
                  </div>
                  <p className="font-bold text-white text-sm leading-snug">{d.rewards?.title}</p>
                  {d.artists && (
                    <Link href={`/fan/a/${d.artists.slug}`} className="text-xs hover:underline" style={{ color: accent }}>
                      {d.artists.name}
                    </Link>
                  )}
                  <p className="text-xs text-[#777] mt-1.5 leading-relaxed">{d.rewards?.description}</p>
                </div>

                <div className="flex-shrink-0">
                  <EnterDrawButton
                    drawId={d.id}
                    weight={myWeight}
                    entered={entered.has(d.id)}
                    rankName={myRank.name}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Rules note ───────────────────────────────────────────────────── */}
      <div className="flex gap-3 p-4 rounded-2xl bg-[#0D0D0D] border border-[#1E1E1E]">
        <Info size={16} className="text-[#666] flex-shrink-0 mt-0.5" />
        <p className="text-xs text-[#777] leading-relaxed">
          Winners are picked by weighted random selection when the draw closes, and the result is
          recorded against the draw. Where a prize promotion requires it, a free entry route must be
          offered — every draw here is flagged for that path. Confirm the rules that apply in your
          jurisdiction before running a public promotion.
        </p>
      </div>
    </div>
  );
}
