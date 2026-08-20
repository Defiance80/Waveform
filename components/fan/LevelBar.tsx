import React from 'react';
import { progress } from '@/lib/game/progression';

/** XP progress toward the next level, with the current rank badge. */
export function LevelBar({
  xp,
  compact = false,
  showRank = true,
}: {
  xp: number;
  compact?: boolean;
  showRank?: boolean;
}) {
  const p = progress(xp);

  return (
    <div className="w-full">
      <div className="flex items-baseline justify-between mb-1.5 gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className={`font-bold text-white ${compact ? 'text-xs' : 'text-sm'}`}>
            LVL {p.level}
          </span>
          {showRank && (
            <span
              className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider truncate"
              style={{
                color: p.rank.color,
                background: `${p.rank.color}1A`,
                boxShadow: `inset 0 0 0 1px ${p.rank.color}44`,
              }}
            >
              {p.rank.name}
            </span>
          )}
        </div>
        <span className={`text-[#A0A0A0] tabular-nums ${compact ? 'text-[10px]' : 'text-xs'}`}>
          {p.xpIntoLevel.toLocaleString()} / {p.xpForNextLevel.toLocaleString()} XP
        </span>
      </div>

      <div className={`w-full rounded-full bg-[#1E1E1E] overflow-hidden ${compact ? 'h-1.5' : 'h-2'}`}>
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${p.pct}%`,
            background: `linear-gradient(90deg, ${p.rank.color}, ${p.next?.color ?? p.rank.color})`,
            boxShadow: `0 0 12px ${p.rank.color}66`,
          }}
        />
      </div>

      {!compact && p.next && (
        <p className="text-[11px] text-[#666] mt-1.5">
          {p.remaining.toLocaleString()} XP to level {p.level + 1}
          {p.next.min === p.level + 1 && (
            <>
              {' '}— unlocks{' '}
              <span style={{ color: p.next.color }} className="font-semibold">
                {p.next.name}
              </span>{' '}
              ({p.next.weight}x draw tickets)
            </>
          )}
        </p>
      )}
    </div>
  );
}
