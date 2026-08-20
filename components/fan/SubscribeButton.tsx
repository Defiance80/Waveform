'use client';

import React, { useState } from 'react';
import { Loader2, CreditCard } from 'lucide-react';

/**
 * Kicks off Stripe Checkout. When billing is not configured the button stays
 * visible but inert, so the operator can see exactly where the gap is instead
 * of the page silently hiding the flow.
 */
export function SubscribeButton({ state, configured }: { state: string; configured: boolean }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const go = async (action: 'checkout' | 'portal') => {
    setBusy(true);
    setError('');

    const res = await fetch(`/api/billing/${action}`, { method: 'POST' });
    const json = await res.json().catch(() => ({}));

    if (!res.ok || !json.url) {
      setError(json.error ?? 'Could not reach billing. Try again in a moment.');
      setBusy(false);
      return;
    }

    window.location.href = json.url;
  };

  const isSubscribed = state === 'active';
  const label = isSubscribed ? 'Manage billing' : state === 'trialing' ? 'Subscribe now' : 'Reactivate';

  return (
    <div className="text-right">
      <button
        onClick={() => go(isSubscribed ? 'portal' : 'checkout')}
        disabled={busy || !configured}
        className="px-5 py-3 rounded-xl text-sm font-bold text-white transition-all hover:scale-[1.03] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        style={
          isSubscribed
            ? { background: '#151515', boxShadow: 'inset 0 0 0 1px #2A2A2A' }
            : { background: 'linear-gradient(135deg, #00C2FF, #7B2EFF)' }
        }
      >
        {busy ? <Loader2 size={15} className="animate-spin" /> : <CreditCard size={15} />}
        {label}
      </button>
      {error && <p className="text-[11px] text-[#FF6B6B] mt-1.5 max-w-[220px]">{error}</p>}
    </div>
  );
}
