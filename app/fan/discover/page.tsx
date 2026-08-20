import React from 'react';
import Link from 'next/link';
import { Search, BadgeCheck, Users } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { getFanContext } from '@/lib/fan';
import { ArtistAvatar } from '@/components/fan/ArtistAvatar';
import type { Artist } from '@/lib/types';

export const dynamic = 'force-dynamic';

const GENRES = ['All', 'Hip-Hop', 'R&B', 'Pop'];

export default async function DiscoverPage({
  searchParams,
}: {
  searchParams: { q?: string; genre?: string };
}) {
  const { fan } = await getFanContext();
  const supabase = createClient();

  const q = searchParams.q?.trim() ?? '';
  const genre = searchParams.genre ?? 'All';

  let query = supabase.from('artists').select('*').order('monthly_listeners', { ascending: false });
  if (q) query = query.ilike('name', `%${q}%`);
  if (genre !== 'All') query = query.eq('genre', genre);

  const [{ data: artists }, { data: follows }] = await Promise.all([
    query,
    supabase.from('fan_artists').select('artist_id').eq('fan_id', fan.id),
  ]);

  const followed = new Set((follows ?? []).map((f: any) => f.artist_id));
  const list = (artists ?? []) as Artist[];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Discover</h1>
        <p className="text-sm text-[#A0A0A0] mt-1">
          Find your artist. Prove you know them. Get what casual fans never see.
        </p>
      </div>

      {/* Search + genre filter. GET form so results are shareable URLs. */}
      <form method="GET" className="flex flex-col sm:flex-row gap-2.5">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#555]" />
          <input
            name="q"
            defaultValue={q}
            placeholder="Search artists and brands"
            className="auth-input pl-10"
          />
        </div>
        <input type="hidden" name="genre" value={genre} />
        <button
          type="submit"
          className="px-5 py-3 rounded-xl text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
          style={{ background: 'linear-gradient(135deg, #00C2FF, #7B2EFF)' }}
        >
          Search
        </button>
      </form>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {GENRES.map((g) => (
          <Link
            key={g}
            href={`/fan/discover?genre=${encodeURIComponent(g)}${q ? `&q=${encodeURIComponent(q)}` : ''}`}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
              g === genre
                ? 'text-white bg-[#151515] shadow-[inset_0_0_0_1px_rgba(0,194,255,0.3)]'
                : 'text-[#A0A0A0] bg-[#111] hover:text-white'
            }`}
          >
            {g}
          </Link>
        ))}
      </div>

      {list.length === 0 ? (
        <p className="text-center text-sm text-[#A0A0A0] py-16">
          No artists matched{q ? ` “${q}”` : ''}. Try a different search.
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {list.map((a) => (
            <Link
              key={a.id}
              href={`/fan/a/${a.slug}`}
              className="group bg-[#111111] border border-[#1E1E1E] rounded-2xl overflow-hidden transition-all hover:scale-[1.01] hover:border-[#2A2A2A]"
            >
              <div
                className="h-16 relative"
                style={{
                  background: `linear-gradient(135deg, ${a.accent_color}33, transparent 70%), #0D0D0D`,
                }}
              >
                {followed.has(a.id) && (
                  <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#0A0A0A]/80 text-[#00FF9C]">
                    Following
                  </span>
                )}
              </div>

              <div className="px-4 pb-4 -mt-7">
                <ArtistAvatar
                  name={a.name}
                  accent={a.accent_color}
                  size={52}
                  rounded="xl"
                  className="ring-4 ring-[#111111]"
                />
                <p className="font-bold text-white mt-2.5 flex items-center gap-1.5">
                  <span className="truncate">{a.name}</span>
                  {a.verified && <BadgeCheck size={14} className="text-[#00C2FF] flex-shrink-0" />}
                </p>
                <p className="text-xs text-[#A0A0A0] mt-0.5">
                  {a.genre} · {a.hometown}
                </p>
                <p className="text-sm text-[#777] mt-2 line-clamp-2 leading-relaxed">{a.bio}</p>
                <p className="flex items-center gap-1.5 text-[11px] text-[#666] mt-2.5">
                  <Users size={12} />
                  {(a.monthly_listeners ?? 0).toLocaleString()} monthly listeners
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
