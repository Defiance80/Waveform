import React from 'react';
import Link from 'next/link';
import { Flame, Target, Zap, Trophy, Ticket, Gamepad2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { getFanContext } from '@/lib/fan';
import { LevelBar } from '@/components/fan/LevelBar';
import { ArtistAvatar } from '@/components/fan/ArtistAvatar';
import { progress, RANKS, drawWeightForLevel } from '@/lib/game/progression';

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const { profile, fan, subscription } = await getFanContext();
  const supabase = createClient();

  const [{ data: ledger }, { data: top }, { data: splits }] = await Promise.all([
    supabase
      .from('xp_ledger')
      .select('*')
      .eq('fan_id', fan.id)
      .order('created_at', { ascending: false })
      .limit(25),
    supabase
      .from('fan_artists')
      .select('affinity, xp_with, artists(name, slug, accent_color, genre)')
      .eq('fan_id', fan.id)
      .order('affinity', { ascending: false })
      .limit(5),
    supabase
      .from('revenue_splits')
      .select('amount_cents, weight, artists(name, accent_color)')
      .eq('fan_id', fan.id)
      .order('amount_cents', { ascending: false })
      .limit(5),
  ]);

  const p = progress(fan.xp);
  const accuracy = fan.total_answered > 0 ? Math.round((fan.total_correct / fan.total_answered) * 100) : 0;
  const memberSince = new Date(fan.created_at).toLocaleDateString(undefined, { month: 'long', year: 'numeric' });

  return (
    <div className="space-y-6">
      {/* ── Identity ─────────────────────────────────────────────────────── */}
      <section className="bg-[#111111] border border-[#1E1E1E] rounded-2xl p-5 sm:p-6 relative overflow-hidden noise-overlay">
        <div className="h-1 absolute top-0 inset-x-0" style={{ background: p.rank.color }} />
        <div className="relative z-10 flex items-start gap-4">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 text-xl font-extrabold text-white"
            style={{
              background: `linear-gradient(135deg, ${p.rank.color}, #7B2EFF)`,
              boxShadow: `0 0 24px ${p.rank.color}33`,
            }}
          >
            {profile.display_name.slice(0, 2).toUpperCase()}
          </div>

          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-extrabold text-white truncate">{profile.display_name}</h1>
            <p className="text-sm text-[#A0A0A0]">@{profile.handle}</p>
            <p className="text-[11px] text-[#666] mt-1">
              Superfan since {memberSince}
              {subscription && ` · ${subscription.state}`}
            </p>
          </div>
        </div>

        <div className="mt-5">
          <LevelBar xp={fan.xp} />
        </div>
      </section>

      {/* ── Career stats ─────────────────────────────────────────────────── */}
      <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <Stat icon={Zap}      label="Total XP"     value={fan.xp.toLocaleString()} color="#00C2FF" />
        <Stat icon={Gamepad2} label="Rounds"       value={fan.rounds_played.toLocaleString()} color="#00FF9C" />
        <Stat icon={Flame}    label="Streak"       value={fan.streak_days} color="#FFB800" />
        <Stat icon={Trophy}   label="Best streak"  value={fan.best_streak} color="#C9A86A" />
        <Stat icon={Target}   label="Accuracy"     value={`${accuracy}%`} color="#7B2EFF" />
        <Stat icon={Ticket}   label="Draw tickets" value={`${drawWeightForLevel(fan.level)}x`} color={p.rank.color} />
      </section>

      {/* ── Rank ladder ──────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-bold text-white mb-1">Rank</h2>
        <p className="text-xs text-[#666] mb-3">
          {p.next
            ? `${p.remaining.toLocaleString()} XP to level ${p.level + 1}. ${p.next.name} unlocks at level ${p.next.min}.`
            : 'You have reached the top rank.'}
        </p>
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
          {RANKS.map((r) => {
            const reached = fan.level >= r.min;
            const current = p.rank.name === r.name;
            return (
              <div
                key={r.name}
                className="rounded-lg px-2 py-2.5 text-center"
                style={{
                  background: reached ? `${r.color}18` : '#0D0D0D',
                  boxShadow: current
                    ? `inset 0 0 0 2px ${r.color}`
                    : reached
                    ? `inset 0 0 0 1px ${r.color}55`
                    : 'inset 0 0 0 1px #1E1E1E',
                  opacity: reached ? 1 : 0.45,
                }}
              >
                <p className="text-[10px] font-bold uppercase tracking-wide truncate" style={{ color: reached ? r.color : '#555' }}>
                  {r.name}
                </p>
                <p className="text-[9px] text-[#666] mt-1">LVL {r.min}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Top artists ──────────────────────────────────────────────────── */}
      {top && top.length > 0 && (
        <section>
          <h2 className="text-base font-bold text-white mb-3">Where your affinity sits</h2>
          <div className="bg-[#111111] border border-[#1E1E1E] rounded-2xl divide-y divide-[#1E1E1E]">
            {(top as any[]).map((row) => (
              <Link
                key={row.artists.slug}
                href={`/fan/a/${row.artists.slug}`}
                className="flex items-center gap-3 px-4 py-3 hover:bg-[#151515] transition-colors first:rounded-t-2xl last:rounded-b-2xl"
              >
                <ArtistAvatar name={row.artists.name} accent={row.artists.accent_color} size={36} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-white truncate">{row.artists.name}</p>
                  <p className="text-xs text-[#666]">{row.artists.genre}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold tabular-nums" style={{ color: row.artists.accent_color }}>
                    {row.affinity}
                  </p>
                  <p className="text-[10px] text-[#666]">affinity</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── Where the money went ─────────────────────────────────────────── */}
      {splits && splits.length > 0 && (
        <section>
          <h2 className="text-base font-bold text-white mb-1">Your subscription, split</h2>
          <p className="text-xs text-[#666] mb-3">
            Your monthly payment is divided across the artists you actually play, weighted by affinity.
          </p>
          <div className="bg-[#111111] border border-[#1E1E1E] rounded-2xl divide-y divide-[#1E1E1E]">
            {(splits as any[]).map((s, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3">
                <span className="text-sm text-white flex-1 min-w-0 truncate">{s.artists?.name}</span>
                <span className="text-xs text-[#666] tabular-nums">
                  {Math.round(Number(s.weight) * 100)}%
                </span>
                <span className="text-sm font-bold text-[#00FF9C] tabular-nums w-16 text-right">
                  ${(s.amount_cents / 100).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Points history ───────────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-bold text-white mb-1">XP history</h2>
        <p className="text-xs text-[#666] mb-3">
          XP is never spent — claiming a reward costs you nothing but the rank you already earned.
        </p>
        {!ledger || ledger.length === 0 ? (
          <p className="text-sm text-[#A0A0A0] py-8 text-center">Nothing yet — go play a round.</p>
        ) : (
          <div className="bg-[#111111] border border-[#1E1E1E] rounded-2xl divide-y divide-[#1E1E1E]">
            {(ledger as any[]).map((row) => (
              <div key={row.id} className="flex items-center gap-3 px-4 py-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-white truncate">
                    {row.note ?? row.reason.replace(/_/g, ' ')}
                  </p>
                  <p className="text-[11px] text-[#666]">
                    {new Date(row.created_at).toLocaleString(undefined, {
                      month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
                    })}
                  </p>
                </div>
                <span className="text-sm font-bold tabular-nums flex-shrink-0 text-[#00C2FF]">
                  +{row.delta.toLocaleString()} XP
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function Stat({
  icon: Icon, label, value, color,
}: {
  icon: React.ElementType; label: string; value: React.ReactNode; color: string;
}) {
  return (
    <div className="bg-[#111111] border border-[#1E1E1E] rounded-xl p-3.5">
      <Icon size={15} style={{ color }} />
      <p className="text-lg font-extrabold text-white mt-2 tabular-nums leading-none">{value}</p>
      <p className="text-[11px] text-[#666] mt-1">{label}</p>
    </div>
  );
}
