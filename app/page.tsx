import React from 'react';
import Link from 'next/link';
import { Brain, Trophy, Gift, Ticket, ChevronRight, Flame } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { ArtistAvatar } from '@/components/fan/ArtistAvatar';
import { RANKS } from '@/lib/game/progression';
import type { Artist } from '@/lib/types';

export const dynamic = 'force-dynamic';

const STEPS = [
  {
    icon: Brain,
    color: '#00C2FF',
    title: 'Prove you know them',
    body: 'Six minigames per artist — trivia, speed rounds, lyric gaps, cover art, deep cuts, and a daily drop that carries your streak.',
  },
  {
    icon: Trophy,
    color: '#7B2EFF',
    title: 'Level up your rank',
    body: 'Every correct answer is XP, and XP is the only currency here. Climb from Listener to Legend, and your rank follows you across every artist.',
  },
  {
    icon: Gift,
    color: '#00FF9C',
    title: 'Unlock real things',
    body: 'Unreleased demos, studio footage, tour merch, signed vinyl. Each one opens at a rank — nothing is bought, and claiming costs you nothing.',
  },
  {
    icon: Ticket,
    color: '#C9A86A',
    title: 'Enter the monthly draws',
    body: 'Soundcheck access, private sets, meet and greets. Your rank decides how many tickets you hold — a Legend carries 40x a Listener.',
  },
];

export default async function LandingPage() {
  // Show real artists from the database, not a hardcoded list.
  const { data } = await createClient()
    .from('artists')
    .select('id, name, slug, genre, accent_color, monthly_listeners')
    .order('monthly_listeners', { ascending: false })
    .limit(10);

  const artists = (data ?? []) as Artist[];

  return (
    <div className="min-h-screen bg-[#0A0A0A] relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `repeating-linear-gradient(90deg, #00C2FF 0px, transparent 1px, transparent 60px),
                            repeating-linear-gradient(0deg, #7B2EFF 0px, transparent 1px, transparent 60px)`,
        }}
      />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#00C2FF]/5 rounded-full blur-3xl" />
      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-[#7B2EFF]/5 rounded-full blur-3xl" />

      <div className="relative z-10">
        {/* ── Nav ──────────────────────────────────────────────────────────── */}
        <header className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-[#00C2FF] to-[#7B2EFF] bg-clip-text text-transparent">
            SLAPBOX
          </span>
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="px-4 py-2 rounded-xl text-sm font-medium text-[#A0A0A0] hover:text-white transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/join"
              className="px-4 py-2 rounded-xl text-sm font-bold text-white transition-transform hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #00C2FF, #7B2EFF)' }}
            >
              Start free
            </Link>
          </div>
        </header>

        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <section className="max-w-3xl mx-auto px-4 pt-16 pb-14 text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-[#FFB800] bg-[#FFB800]/10 mb-6">
            <Flame size={13} /> 7 days free, then $4.99/month
          </span>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.05]">
            Anyone can stream them.
            <br />
            <span className="bg-gradient-to-r from-[#00C2FF] via-[#3B82F6] to-[#7B2EFF] bg-clip-text text-transparent">
              Prove you know them.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-[#A0A0A0] mt-6 max-w-xl mx-auto leading-relaxed">
            SLAPBOX turns knowing an artist into something worth having. Play their trivia, climb the
            ranks, and unlock rewards that never go public — merch, unreleased music, private events.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
            <Link
              href="/join"
              className="px-7 py-3.5 rounded-xl font-bold text-white transition-transform hover:scale-105 flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, #00C2FF, #7B2EFF)', boxShadow: '0 0 30px rgba(0,194,255,0.25)' }}
            >
              Become a superfan <ChevronRight size={17} />
            </Link>
            <Link
              href="/login?next=/dashboard"
              className="px-7 py-3.5 rounded-xl font-bold text-white bg-[#151515] border border-[#2A2A2A] hover:border-[#00C2FF]/40 transition-colors flex items-center justify-center"
            >
              I&apos;m an artist or brand
            </Link>
          </div>
        </section>

        {/* ── Artist marquee ───────────────────────────────────────────────── */}
        {artists.length > 0 && (
          <section className="max-w-5xl mx-auto px-4 pb-16">
            <p className="text-center text-xs uppercase tracking-[0.2em] text-[#555] font-semibold mb-5">
              Playing now
            </p>
            <div className="flex flex-wrap justify-center gap-2.5">
              {artists.map((a) => (
                <Link
                  key={a.id}
                  href="/join"
                  className="flex items-center gap-2.5 pl-2 pr-4 py-2 rounded-full bg-[#111111] border border-[#1E1E1E] hover:border-[#2A2A2A] transition-colors"
                >
                  <ArtistAvatar name={a.name} accent={a.accent_color} size={28} />
                  <div className="text-left">
                    <p className="text-xs font-bold text-white leading-tight">{a.name}</p>
                    <p className="text-[10px] text-[#666] leading-tight">{a.genre}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── How it works ─────────────────────────────────────────────────── */}
        <section className="max-w-5xl mx-auto px-4 pb-16">
          <div className="grid sm:grid-cols-2 gap-3">
            {STEPS.map((s, i) => (
              <div key={s.title} className="bg-[#111111] border border-[#1E1E1E] rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${s.color}1A` }}
                  >
                    <s.icon size={19} style={{ color: s.color }} />
                  </div>
                  <span className="text-xs font-bold text-[#444] tabular-nums">0{i + 1}</span>
                </div>
                <h3 className="font-bold text-white mb-1.5">{s.title}</h3>
                <p className="text-sm text-[#888] leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Rank ladder ──────────────────────────────────────────────────── */}
        <section className="max-w-5xl mx-auto px-4 pb-16">
          <h2 className="text-center text-2xl font-extrabold text-white mb-2">Seven ranks</h2>
          <p className="text-center text-sm text-[#A0A0A0] mb-6 max-w-lg mx-auto">
            Your rank is your standing across the whole platform — and the multiplier on every
            monthly prize draw you enter.
          </p>
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
            {RANKS.map((r) => (
              <div
                key={r.name}
                className="rounded-xl px-2 py-3 text-center"
                style={{ background: `${r.color}12`, boxShadow: `inset 0 0 0 1px ${r.color}33` }}
              >
                <p className="text-[10px] font-bold uppercase tracking-wide truncate" style={{ color: r.color }}>
                  {r.name}
                </p>
                <p className="text-base font-extrabold text-white mt-1">{r.weight}x</p>
                <p className="text-[9px] text-[#666] mt-0.5">LVL {r.min}+</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── For artists ──────────────────────────────────────────────────── */}
        <section className="max-w-3xl mx-auto px-4 pb-20">
          <div
            className="rounded-2xl p-7 text-center border"
            style={{ background: 'rgba(123,46,255,0.06)', borderColor: 'rgba(123,46,255,0.25)' }}
          >
            <h2 className="text-xl font-extrabold text-white mb-2">For artists and brands</h2>
            <p className="text-sm text-[#A0A0A0] max-w-lg mx-auto leading-relaxed mb-5">
              Every subscription is split across the artists a fan actually engages with, weighted by
              how much they play. Set your own trivia, stock your own shop, and see exactly which
              fans are showing up.
            </p>
            <Link
              href="/login?next=/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white transition-transform hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #7B2EFF, #00C2FF)' }}
            >
              Open the artist console <ChevronRight size={16} />
            </Link>
          </div>
        </section>

        <footer className="border-t border-[#1E1E1E] py-6">
          <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row justify-between gap-2 text-xs text-[#555]">
            <span>© 2026 SLAPBOX</span>
            <span>Developed by GoKoncentrate</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
