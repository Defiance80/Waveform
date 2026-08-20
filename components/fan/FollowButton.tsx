'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Star, Check, Plus, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

/**
 * Follow / unfollow plus the favorite star.
 *
 * Following is what opens the revenue-share relationship: affinity accrues as
 * the fan plays, and affinity is the weight used to split their subscription
 * across the artists they actually engage with.
 */
export function FollowButton({
  artistId,
  fanId,
  initialFollowing,
  initialFavorite,
  accent,
}: {
  artistId: string;
  fanId: string;
  initialFollowing: boolean;
  initialFavorite: boolean;
  accent: string;
}) {
  const router = useRouter();
  const [following, setFollowing] = useState(initialFollowing);
  const [favorite, setFavorite] = useState(initialFavorite);
  const [busy, setBusy] = useState(false);

  const supabase = createClient();

  const toggleFollow = async () => {
    setBusy(true);
    if (following) {
      await supabase.from('fan_artists').delete().eq('fan_id', fanId).eq('artist_id', artistId);
      setFollowing(false);
      setFavorite(false);
    } else {
      await supabase.from('fan_artists').insert({ fan_id: fanId, artist_id: artistId });
      setFollowing(true);
    }
    setBusy(false);
    router.refresh();
  };

  const toggleFavorite = async () => {
    if (!following) return;
    setBusy(true);
    const next = !favorite;
    await supabase
      .from('fan_artists')
      .update({ is_favorite: next })
      .eq('fan_id', fanId)
      .eq('artist_id', artistId);
    setFavorite(next);
    setBusy(false);
    router.refresh();
  };

  return (
    <div className="flex items-center gap-2 flex-shrink-0">
      {following && (
        <button
          onClick={toggleFavorite}
          disabled={busy}
          aria-label={favorite ? 'Remove favorite' : 'Mark as favorite'}
          className="p-2.5 rounded-xl border transition-colors"
          style={{
            borderColor: favorite ? 'rgba(255,184,0,0.4)' : '#2A2A2A',
            background: favorite ? 'rgba(255,184,0,0.1)' : '#151515',
          }}
        >
          <Star
            size={16}
            className={favorite ? 'text-[#FFB800]' : 'text-[#666]'}
            fill={favorite ? '#FFB800' : 'none'}
          />
        </button>
      )}

      <button
        onClick={toggleFollow}
        disabled={busy}
        className="px-4 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:scale-[1.03] disabled:opacity-60 flex items-center gap-1.5"
        style={
          following
            ? { background: '#151515', boxShadow: 'inset 0 0 0 1px #2A2A2A' }
            : { background: `linear-gradient(135deg, ${accent}, #7B2EFF)` }
        }
      >
        {busy ? (
          <Loader2 size={14} className="animate-spin" />
        ) : following ? (
          <><Check size={14} /> Following</>
        ) : (
          <><Plus size={14} /> Follow</>
        )}
      </button>
    </div>
  );
}
