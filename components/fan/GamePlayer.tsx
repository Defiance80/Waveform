'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Check, X, ChevronRight, Flame, Trophy, Zap, ArrowLeft, RotateCcw, Loader2, Gift,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { ArtistAvatar } from '@/components/fan/ArtistAvatar';
import { LevelBar } from '@/components/fan/LevelBar';
import { modeFor } from '@/lib/game/progression';
import type { StartGameResult, SubmitAnswerResult, FinishGameResult, GameKind } from '@/lib/types';

const KEYS = ['A', 'B', 'C', 'D', 'E', 'F'];

type Phase = 'loading' | 'playing' | 'revealed' | 'finished' | 'error';

export function GamePlayer({ slug, kind }: { slug: string; kind: GameKind }) {
  const router = useRouter();
  const supabase = useRef(createClient()).current;
  const mode = modeFor(kind);

  const [phase, setPhase] = useState<Phase>('loading');
  const [game, setGame] = useState<StartGameResult | null>(null);
  const [index, setIndex] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [result, setResult] = useState<SubmitAnswerResult | null>(null);
  const [summary, setSummary] = useState<FinishGameResult | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(mode?.seconds ?? 0);

  const questionStart = useRef<number>(Date.now());
  const question = game?.questions[index];
  const total = game?.questions.length ?? 0;

  // ── Start the round ───────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    (async () => {
      const { data, error: rpcError } = await supabase.rpc('start_game', {
        p_artist_slug: slug,
        p_kind: kind,
        p_count: mode?.questions ?? 5,
      });

      if (cancelled) return;

      if (rpcError) {
        setError(
          rpcError.message.includes('already played today')
            ? "You've already taken today's Daily Drop. Come back tomorrow to keep the streak alive."
            : rpcError.message.includes('no questions')
            ? "This artist doesn't have questions for this mode yet."
            : rpcError.message
        );
        setPhase('error');
        return;
      }

      setGame(data as StartGameResult);
      setPhase('playing');
      questionStart.current = Date.now();
      setSecondsLeft(mode?.seconds ?? 0);
    })();

    return () => { cancelled = true; };
  }, [slug, kind, mode?.questions, mode?.seconds, supabase]);

  // ── Submit one answer ─────────────────────────────────────────────────────
  const submit = useCallback(
    async (choiceIndex: number | null) => {
      if (!game || !question || busy || phase !== 'playing') return;

      setBusy(true);
      setChosen(choiceIndex);

      const { data, error: rpcError } = await supabase.rpc('submit_answer', {
        p_session: game.session_id,
        p_question: question.id,
        p_choice: choiceIndex,
        p_ms: Date.now() - questionStart.current,
      });

      if (rpcError) {
        setError(rpcError.message);
        setPhase('error');
        setBusy(false);
        return;
      }

      setResult(data as SubmitAnswerResult);
      setPhase('revealed');
      setBusy(false);
    },
    [game, question, busy, phase, supabase]
  );

  // ── Countdown for timed modes ─────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'playing' || !mode?.timed) return;

    setSecondsLeft(mode.seconds ?? 10);
    const id = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(id);
          // Out of time counts as an unanswered question, not a free pass.
          void submit(null);
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [phase, index, mode?.timed, mode?.seconds, submit]);

  // ── Advance / finish ──────────────────────────────────────────────────────
  const advance = async () => {
    if (!game) return;

    if (index + 1 < total) {
      setIndex((i) => i + 1);
      setChosen(null);
      setResult(null);
      setPhase('playing');
      questionStart.current = Date.now();
      return;
    }

    setBusy(true);
    const { data, error: rpcError } = await supabase.rpc('finish_game', { p_session: game.session_id });

    if (rpcError) {
      setError(rpcError.message);
      setPhase('error');
      setBusy(false);
      return;
    }

    setSummary(data as FinishGameResult);
    setPhase('finished');
    setBusy(false);
    router.refresh(); // repaint level and streak in the nav
  };

  // ── Keyboard shortcuts: 1-4 to answer, Enter to advance ───────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (phase === 'playing' && question) {
        const n = parseInt(e.key, 10);
        if (n >= 1 && n <= question.choices.length) void submit(n - 1);
      } else if (phase === 'revealed' && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        void advance();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  // ── Render ────────────────────────────────────────────────────────────────
  if (phase === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <Loader2 size={28} className="animate-spin text-[#00C2FF]" />
        <p className="text-sm text-[#A0A0A0]">Pulling your questions…</p>
      </div>
    );
  }

  if (phase === 'error') {
    return (
      <div className="max-w-md mx-auto text-center py-20">
        <div
          className="w-14 h-14 rounded-full mx-auto flex items-center justify-center mb-4"
          style={{ background: 'rgba(255,184,0,0.1)', boxShadow: 'inset 0 0 0 1px rgba(255,184,0,0.3)' }}
        >
          <Flame size={24} className="text-[#FFB800]" />
        </div>
        <p className="text-white font-medium mb-2">Can&apos;t start this round</p>
        <p className="text-sm text-[#A0A0A0] mb-6">{error}</p>
        <Link
          href={`/fan/a/${slug}`}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#151515] border border-[#2A2A2A] text-sm font-medium text-white hover:border-[#00C2FF]/40 transition-colors"
        >
          <ArrowLeft size={15} /> Back to artist
        </Link>
      </div>
    );
  }

  if (phase === 'finished' && summary && game) {
    return <Summary summary={summary} game={game} slug={slug} kind={kind} />;
  }

  if (!game || !question) return null;

  const accent = mode?.color ?? game.artist.accent_color ?? '#00C2FF';

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <Link
          href={`/fan/a/${slug}`}
          className="p-2 rounded-lg text-[#A0A0A0] hover:text-white hover:bg-[#151515] transition-colors"
          aria-label="Leave round"
        >
          <ArrowLeft size={18} />
        </Link>
        <ArtistAvatar name={game.artist.name} accent={game.artist.accent_color} size={36} />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-white truncate">{game.artist.name}</p>
          <p className="text-xs" style={{ color: accent }}>{mode?.name ?? kind}</p>
        </div>
        <span className="text-xs font-bold text-[#A0A0A0] tabular-nums">
          {index + 1} / {total}
        </span>
      </div>

      {/* Progress through the round */}
      <div className="flex gap-1.5 mb-6">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className="h-1 flex-1 rounded-full transition-colors duration-300"
            style={{ background: i < index ? accent : i === index ? `${accent}66` : '#1E1E1E' }}
          />
        ))}
      </div>

      {/* Countdown */}
      {mode?.timed && phase === 'playing' && (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-[11px] uppercase tracking-wider text-[#666] font-semibold">
              Answer fast for bonus XP
            </span>
            <span
              className="text-sm font-bold tabular-nums"
              style={{ color: secondsLeft <= 3 ? '#FF3B3B' : '#FFB800' }}
            >
              {secondsLeft}s
            </span>
          </div>
          <div className="h-1 w-full rounded-full bg-[#1E1E1E] overflow-hidden">
            <div
              key={index}
              className="timer-bar h-full rounded-full"
              style={{
                background: 'linear-gradient(90deg, #FFB800, #FF3B3B)',
                animationDuration: `${mode.seconds}s`,
              }}
            />
          </div>
        </div>
      )}

      {/* Question */}
      <div className="bg-[#111111] border border-[#1E1E1E] rounded-2xl p-5 sm:p-6 mb-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1" style={{ background: accent }} />
        {question.difficulty > 1 && (
          <span
            className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider mb-3"
            style={{
              color: question.difficulty === 3 ? '#FF3B3B' : '#FFB800',
              background: question.difficulty === 3 ? 'rgba(255,59,59,0.1)' : 'rgba(255,184,0,0.1)',
            }}
          >
            {question.difficulty === 3 ? 'Hard' : 'Medium'} · {10 * question.difficulty} XP
          </span>
        )}
        <p className="text-lg sm:text-xl font-bold text-white leading-snug">{question.prompt}</p>
      </div>

      {/* Choices */}
      <div className="space-y-2.5">
        {question.choices.map((choice, i) => {
          const isChosen = chosen === i;
          const isCorrect = result?.correct_index === i;
          const revealed = phase === 'revealed';

          let cls = 'choice-btn';
          if (revealed && isCorrect) cls += ' choice-correct';
          else if (revealed && isChosen && !isCorrect) cls += ' choice-wrong';
          else if (revealed) cls += ' opacity-45';

          return (
            <button
              key={i}
              className={cls}
              disabled={phase !== 'playing' || busy}
              onClick={() => submit(i)}
            >
              <span className="choice-key">{KEYS[i]}</span>
              <span className="flex-1">{choice}</span>
              {revealed && isCorrect && <Check size={18} className="text-[#00FF9C] flex-shrink-0" />}
              {revealed && isChosen && !isCorrect && <X size={18} className="text-[#FF3B3B] flex-shrink-0" />}
            </button>
          );
        })}
      </div>

      {/* Reveal */}
      {phase === 'revealed' && result && (
        <div className="mt-5 pop-in">
          <div
            className="rounded-2xl p-4 border"
            style={{
              background: result.is_correct ? 'rgba(0,255,156,0.06)' : 'rgba(255,59,59,0.06)',
              borderColor: result.is_correct ? 'rgba(0,255,156,0.25)' : 'rgba(255,59,59,0.25)',
            }}
          >
            <div className="flex items-center justify-between gap-3 mb-1.5">
              <p className="font-bold text-white">
                {result.is_correct ? 'Correct' : chosen === null ? "Time's up" : 'Not quite'}
              </p>
              {result.xp > 0 && (
                <span className="flex items-center gap-1 text-sm font-bold text-[#00C2FF] tabular-nums">
                  <Zap size={14} /> +{result.xp} XP
                </span>
              )}
            </div>
            {result.explanation && (
              <p className="text-sm text-[#A0A0A0] leading-relaxed">{result.explanation}</p>
            )}
          </div>

          <button
            onClick={advance}
            disabled={busy}
            className="w-full mt-3 py-3.5 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
            style={{ background: `linear-gradient(135deg, ${accent}, #7B2EFF)` }}
          >
            {busy ? (
              <Loader2 size={16} className="animate-spin" />
            ) : index + 1 < total ? (
              <>Next question <ChevronRight size={16} /></>
            ) : (
              <>See results <Trophy size={16} /></>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

// ── Round summary ───────────────────────────────────────────────────────────
function Summary({
  summary, game, slug, kind,
}: {
  summary: FinishGameResult;
  game: StartGameResult;
  slug: string;
  kind: GameKind;
}) {
  const pct = summary.total > 0 ? Math.round((summary.correct / summary.total) * 100) : 0;

  const lines: Array<[string, number, string]> = [
    ['Correct answers', summary.base_xp, '#00C2FF'],
    ...(summary.perfect_bonus
      ? ([['Perfect round', summary.perfect_bonus, '#00FF9C']] as Array<[string, number, string]>)
      : []),
    ...(summary.streak_bonus
      ? ([[`${summary.streak_days}-day streak`, summary.streak_bonus, '#FFB800']] as Array<[string, number, string]>)
      : []),
  ];

  return (
    <div className="max-w-md mx-auto text-center py-6">
      <div className="mb-6">
        <ArtistAvatar name={game.artist.name} accent={game.artist.accent_color} size={64} className="mx-auto mb-4" />
        <p className="text-5xl font-extrabold text-white tabular-nums pop-in">
          {summary.correct}
          <span className="text-2xl text-[#555]">/{summary.total}</span>
        </p>
        <p className="text-sm text-[#A0A0A0] mt-1">
          {summary.perfect ? 'Flawless. Certified.' : pct >= 60 ? 'Solid run.' : 'Room to grow — run it back.'}
        </p>
      </div>

      {summary.levelled_up && (
        <div
          className="rounded-2xl p-4 mb-4 pop-in"
          style={{ background: 'rgba(123,46,255,0.1)', boxShadow: 'inset 0 0 0 1px rgba(123,46,255,0.35)' }}
        >
          <Trophy size={22} className="text-[#7B2EFF] mx-auto mb-2" />
          <p className="font-bold text-white">Level {summary.level}</p>
          <p className="text-sm text-[#A0A0A0]">
            {summary.rank_changed ? (
              <>
                New rank: <span className="text-[#7B2EFF] font-semibold">{summary.rank}</span> — better
                odds in every monthly draw.
              </>
            ) : (
              <>
                Still <span className="text-[#7B2EFF] font-semibold">{summary.rank}</span>, and closer to
                the next shelf.
              </>
            )}
          </p>
        </div>
      )}

      {/* What this round actually opened up -- the payoff now that rewards
          unlock by rank instead of being bought. */}
      {summary.unlocked?.length > 0 && (
        <div
          className="rounded-2xl p-4 mb-4 text-left pop-in"
          style={{ background: 'rgba(0,255,156,0.07)', boxShadow: 'inset 0 0 0 1px rgba(0,255,156,0.3)' }}
        >
          <p className="flex items-center gap-2 font-bold text-[#00FF9C] text-sm mb-2.5">
            <Gift size={15} />
            {summary.unlocked.length} reward{summary.unlocked.length === 1 ? '' : 's'} unlocked
          </p>
          <div className="space-y-1.5">
            {summary.unlocked.map((u) => (
              <Link
                key={u.id}
                href={`/fan/a/${u.slug}`}
                className="flex items-center gap-2 text-sm text-white hover:underline"
              >
                <span className="w-1 h-1 rounded-full bg-[#00FF9C] flex-shrink-0" />
                <span className="truncate">{u.title}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="bg-[#111111] border border-[#1E1E1E] rounded-2xl p-5 mb-4 text-left">
        <div className="space-y-2.5">
          {lines.map(([label, value, color]) => (
            <div key={label} className="flex items-center justify-between text-sm">
              <span className="text-[#A0A0A0]">{label}</span>
              <span className="font-bold tabular-nums" style={{ color }}>+{value}</span>
            </div>
          ))}
          <div className="border-t border-[#1E1E1E] pt-2.5 flex items-center justify-between">
            <span className="text-sm font-semibold text-white">XP earned</span>
            <span className="flex items-center gap-1.5 font-extrabold text-[#00C2FF] tabular-nums">
              <Zap size={15} /> +{summary.xp_earned}
            </span>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-[#1E1E1E]">
          <LevelBar xp={summary.xp} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <Link
          href={`/fan/play/${slug}/${kind}`}
          className="py-3 rounded-xl bg-[#151515] border border-[#2A2A2A] text-sm font-semibold text-white hover:border-[#00C2FF]/40 transition-colors flex items-center justify-center gap-2"
        >
          <RotateCcw size={15} /> Play again
        </Link>
        <Link
          href={`/fan/a/${slug}`}
          className="py-3 rounded-xl text-sm font-semibold text-white transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
          style={{ background: 'linear-gradient(135deg, #00C2FF, #7B2EFF)' }}
        >
          See the shelf <ChevronRight size={15} />
        </Link>
      </div>
    </div>
  );
}
