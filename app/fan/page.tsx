import React from 'react';
import Link from 'next/link';
import { Flame, Compass, ChevronRight, Ticket, Target, Zap } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { getFanContext } from '@/lib/fan';
import { ArtistAvatar } from '@/components/fan/ArtistAvatar';
import { LevelBar } from '@/components/fan/LevelBar';
import { progress, drawWeightForLevel } from '@/lib/game/progression';
import type { Artist } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function FanHome() {
  const { profile, fan } = await getFanContext();
  const supabase = createClient();

  const [{ data: following }, { data: openDraws }, { data: recent }] = await Promise.all([
    supabase
      .from('fan_artists')
      .select('affinity, is_favorite, artists(*)')
      .eq('fan_id', fan.id)
      .order('affinity', { ascending: false })
      .limit(6),
    supabase
      .from('draws')
      .select('id, closes_at, artists(name, slug, accent_color), rewards(title, tier)')
      .is('drawn_at', null)
      .gt('closes_at', new Date().toISOString())
      .limit(3),
    supabase
      .from('xp_ledger')
      .select('id, delta, reason, note, created_at')
      .eq('fan_id', fan.id)
      .order('created_at', { ascending: false })
      .limit(6),
  ]);

  const p = progress(fan.xp);
  // The embedded join comes back typed as an array by the generic client;
  // the FK guarantees exactly one artist per row.
  const followed = (following ?? []) as unknown as Array<{
    affinity: number;
    is_favorite: boolean;
    artists: Artist;
  }>;
  const playedToday = fan.last_played_on === new Date().toISOString().slice(0, 10);
  const accuracy = fan.total_answered > 0 ? Math.round((fan.total_correct / fan.total_answered) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* ── Greeting + level ─────────────────────────────────────────────── */}
      <section className="bg-[#111111] border border-[#1E1E1E] rounded-2xl p-5 sm:p-6 relative overflow-hidden noise-overlay">
        <div className="h-1 absolute top-0 inset-x-0 bg-gradient-to-r from-[#00C2FF] to-[#7B2EFF]" />
        <div className="relative z-10">
          <p className="text-xs uppercase tracking-[0.15em] text-[#666] font-semibold mb-1">
            @{profile.handle}
          </p>
          <h1 className="text-2xl font-extrabold text-white mb-4">
            {playedToday ? 'Streak secured today.' : "Let's keep the streak alive."}
          </h1>

          <LevelBar xp={fan.xp} />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
            <Stat icon={Zap} label="Total XP" value={fan.xp.toLocaleString()} color="#00C2FF" />
            <Stat icon={Flame} label="Day streak" value={fan.streak_days} color="#FFB800" />
            <Stat icon={Target} label="Accuracy" value={`${accuracy}%`} color="#00FF9C" />
            <Stat icon={Ticket} label="Draw tickets" value={`${drawWeightForLevel(fan.level)}x`} color="#7B2EFF" />
          </div>
        </div>
      </section>

      {/* ── Daily drop nudge ─────────────────────────────────────────────── */}
      {followed.length > 0 && !playedToday && (
        <Link
          href={`/fan/play/${followed[0].artists.slug}/daily_drop`}
          className="flex items-center gap-4 p-4 rounded-2xl border transition-all hover:scale-[1.01]"
          style={{ background: 'rgba(255,184,0,0.07)', borderColor: 'rgba(255,184,0,0.3)' }}
        >
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(255,184,0,0.15)' }}
          >
            <Flame size={20} className="text-[#FFB800]" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-bold text-white text-sm">Daily Drop is live</p>
            <p className="text-xs text-[#A0A0A0] truncate">
              One question on {followed[0].artists.name}. Keeps your {fan.streak_days}-day streak going.
            </p>
          </div>
          <ChevronRight size={18} className="text-[#FFB800] flex-shrink-0" />
        </Link>
      )}

      {/* ── Your artists ─────────────────────────────────────────────────── */}
      <section>
        <SectionHead title="Your artists" href="/fan/discover" cta="Find more" />

        {followed.length === 0 ? (
          <EmptyState
            icon={Compass}
            title="You haven't picked an artist yet"
            body="Follow an artist or brand, play their trivia, and climb the ranks that unlock their exclusive drops."
            href="/fan/discover"
            cta="Browse artists"
          />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {followed.map(({ artists: a, affinity, is_favorite }) => (
              <Link
                key={a.id}
                href={`/fan/a/${a.slug}`}
                className="group bg-[#111111] border border-[#1E1E1E] rounded-2xl p-4 flex items-center gap-3.5 transition-all hover:border-[#2A2A2A] hover:scale-[1.01]"
              >
                <ArtistAvatar name={a.name} accent={a.accent_color} size={48} />
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-white text-sm truncate flex items-center gap-1.5">
                    {a.name}
                    {is_favorite && <span className="text-[#FFB800] text-xs">★</span>}
                  </p>
                  <p className="text-xs text-[#A0A0A0] truncate">{a.genre} · {a.hometown}</p>
                  <p className="text-[11px] mt-1" style={{ color: a.accent_color ?? '#00C2FF' }}>
                    {affinity} affinity
                  </p>
                </div>
                <ChevronRight
                  size={16}
                  className="text-[#444] group-hover:text-white transition-colors flex-shrink-0"
                />
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ── Open draws ───────────────────────────────────────────────────── */}
      {openDraws && openDraws.length > 0 && (
        <section>
          <SectionHead title="Draws closing soon" href="/fan/draws" cta="All draws" />
          <div className="grid sm:grid-cols-3 gap-3">
            {(openDraws as any[]).map((d) => (
              <Link
                key={d.id}
                href="/fan/draws"
                className="bg-[#111111] border border-[#1E1E1E] rounded-2xl p-4 hover:border-[#C9A86A]/40 transition-colors"
              >
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C9A86A]">
                  {d.rewards?.tier}
                </span>
                <p className="font-bold text-white text-sm mt-1 leading-snug line-clamp-2">
                  {d.rewards?.title}
                </p>
                <p className="text-xs text-[#A0A0A0] mt-1.5">{d.artists?.name}</p>
                <p className="text-[11px] text-[#666] mt-2">
                  Closes {new Date(d.closes_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── Recent activity ──────────────────────────────────────────────── */}
      {recent && recent.length > 0 && (
        <section>
          <SectionHead title="Recent activity" href="/fan/profile" cta="Full history" />
          <div className="bg-[#111111] border border-[#1E1E1E] rounded-2xl divide-y divide-[#1E1E1E]">
            {recent.map((row: any) => (
              <div key={row.id} className="flex items-center gap-3 px-4 py-3">
                <Zap size={14} className="text-[#00C2FF]" />
                <span className="text-sm text-white flex-1 min-w-0 truncate">
                  {row.note ?? row.reason.replace(/_/g, ' ')}
                </span>
                <span className="text-sm font-bold tabular-nums text-[#00C2FF]">
                  +{row.delta} XP
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

// ── Small pieces ────────────────────────────────────────────────────────────
function Stat({
  icon: Icon, label, value, color,
}: {
  icon: React.ElementType; label: string; value: React.ReactNode; color: string;
}) {
  return (
    <div className="bg-[#0A0A0A] border border-[#1E1E1E] rounded-xl p-3">
      <Icon size={15} style={{ color }} />
      <p className="text-lg font-extrabold text-white mt-1.5 tabular-nums leading-none">{value}</p>
      <p className="text-[11px] text-[#666] mt-1">{label}</p>
    </div>
  );
}

function SectionHead({ title, href, cta }: { title: string; href: string; cta: string }) {
  return (
    <div className="flex items-baseline justify-between mb-3">
      <h2 className="text-base font-bold text-white">{title}</h2>
      <Link href={href} className="text-xs font-semibold text-[#00C2FF] hover:underline">
        {cta}
      </Link>
    </div>
  );
}

function EmptyState({
  icon: Icon, title, body, href, cta,
}: {
  icon: React.ElementType; title: string; body: string; href: string; cta: string;
}) {
  return (
    <div className="bg-[#111111] border border-dashed border-[#2A2A2A] rounded-2xl p-8 text-center">
      <Icon size={26} className="text-[#00C2FF] mx-auto mb-3" />
      <p className="font-bold text-white mb-1.5">{title}</p>
      <p className="text-sm text-[#A0A0A0] max-w-sm mx-auto mb-5">{body}</p>
      <Link
        href={href}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-transform hover:scale-105"
        style={{ background: 'linear-gradient(135deg, #00C2FF, #7B2EFF)' }}
      >
        {cta} <ChevronRight size={15} />
      </Link>
    </div>
  );
}
