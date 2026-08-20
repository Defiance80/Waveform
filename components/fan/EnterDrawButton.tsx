'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Ticket, Check, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { EnterDrawResult } from '@/lib/types';

export function EnterDrawButton({
  drawId,
  weight,
  entered,
  rankName,
}: {
  drawId: string;
  weight: number;
  entered: boolean;
  rankName: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(entered);
  const [error, setError] = useState('');
  const [result, setResult] = useState<EnterDrawResult | null>(null);

  const enter = async () => {
    setBusy(true);
    setError('');

    const { data, error: rpcError } = await createClient().rpc('enter_draw', {
      p_draw: drawId,
      p_free: false,
    });

    if (rpcError) {
      setError(rpcError.message);
      setBusy(false);
      return;
    }

    setResult(data as EnterDrawResult);
    setDone(true);
    setBusy(false);
    router.refresh();
  };

  if (done) {
    return (
      <div className="text-right">
        <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-[#00FF9C] bg-[#00FF9C]/10">
          <Check size={13} /> Entered
        </span>
        <p className="text-[11px] text-[#666] mt-1.5">
          {(result?.weight ?? weight)} ticket{(result?.weight ?? weight) === 1 ? '' : 's'} as {rankName}
        </p>
      </div>
    );
  }

  return (
    <div className="text-right">
      <button
        onClick={enter}
        disabled={busy}
        className="px-4 py-2.5 rounded-xl text-xs font-bold text-white transition-all hover:scale-[1.03] disabled:opacity-60 flex items-center gap-1.5"
        style={{ background: 'linear-gradient(135deg, #C9A86A, #7B2EFF)' }}
      >
        {busy ? <Loader2 size={13} className="animate-spin" /> : <Ticket size={13} />}
        Enter draw
      </button>
      <p className="text-[11px] text-[#666] mt-1.5">
        {weight} ticket{weight === 1 ? '' : 's'} as {rankName}
      </p>
      {error && <p className="text-[11px] text-[#FF6B6B] mt-1">{error}</p>}
    </div>
  );
}
