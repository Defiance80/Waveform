import React from 'react';
import { Check, Sparkles, AlertTriangle } from 'lucide-react';
import { getFanContext } from '@/lib/fan';
import { SubscribeButton } from '@/components/fan/SubscribeButton';

export const dynamic = 'force-dynamic';

const INCLUDED = [
  'Subscriber-only drops: unreleased demos, studio footage, early listens',
  'Entry into every monthly high-ticket draw, weighted by your rank',
  'Points on every round, spendable in any artist shop you follow',
  'Your payment splits across the artists you actually play',
];

export default async function SubscriptionPage() {
  const { subscription, trialDaysLeft } = await getFanContext();

  const state = subscription?.state ?? 'incomplete';
  const price = ((subscription?.price_cents ?? 499) / 100).toFixed(2);
  const stripeReady = !!process.env.STRIPE_SECRET_KEY && !!process.env.STRIPE_PRICE_ID;

  const renews = subscription?.current_period_end
    ? new Date(subscription.current_period_end).toLocaleDateString(undefined, {
        month: 'long', day: 'numeric', year: 'numeric',
      })
    : null;

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Your plan</h1>
        <p className="text-sm text-[#A0A0A0] mt-1">
          One subscription. Every artist you follow gets a cut.
        </p>
      </div>

      {/* ── Current state ────────────────────────────────────────────────── */}
      <section
        className="rounded-2xl p-5 border relative overflow-hidden"
        style={{
          background: '#111111',
          borderColor: state === 'active' ? 'rgba(0,255,156,0.3)'
            : state === 'trialing' ? 'rgba(0,194,255,0.3)'
            : 'rgba(255,59,59,0.3)',
        }}
      >
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <span
              className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
              style={
                state === 'active'
                  ? { color: '#00FF9C', background: 'rgba(0,255,156,0.1)' }
                  : state === 'trialing'
                  ? { color: '#00C2FF', background: 'rgba(0,194,255,0.1)' }
                  : { color: '#FF3B3B', background: 'rgba(255,59,59,0.1)' }
              }
            >
              {state === 'trialing' ? 'Free trial' : state}
            </span>
            <p className="text-2xl font-extrabold text-white mt-2.5">
              ${price}
              <span className="text-sm font-medium text-[#A0A0A0]">/month</span>
            </p>
            {state === 'trialing' && (
              <p className="text-sm text-[#A0A0A0] mt-1">
                {trialDaysLeft === 0
                  ? 'Your trial ends today.'
                  : `${trialDaysLeft} day${trialDaysLeft === 1 ? '' : 's'} left, then billing starts.`}
              </p>
            )}
            {state === 'active' && renews && (
              <p className="text-sm text-[#A0A0A0] mt-1">
                {subscription?.cancel_at_period_end ? 'Ends' : 'Renews'} {renews}.
              </p>
            )}
          </div>

          <SubscribeButton state={state} configured={stripeReady} />
        </div>
      </section>

      {/* ── What it unlocks ──────────────────────────────────────────────── */}
      <section className="bg-[#111111] border border-[#1E1E1E] rounded-2xl p-5">
        <h2 className="font-bold text-white flex items-center gap-2 mb-4">
          <Sparkles size={16} className="text-[#00C2FF]" /> What Superfan includes
        </h2>
        <ul className="space-y-3">
          {INCLUDED.map((line) => (
            <li key={line} className="flex items-start gap-2.5 text-sm text-[#A0A0A0]">
              <Check size={15} className="text-[#00FF9C] flex-shrink-0 mt-0.5" />
              <span className="leading-relaxed">{line}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* ── Setup notice for the operator ────────────────────────────────── */}
      {!stripeReady && (
        <div className="flex gap-3 p-4 rounded-2xl bg-[#FFB800]/[0.06] border border-[#FFB800]/25">
          <AlertTriangle size={16} className="text-[#FFB800] flex-shrink-0 mt-0.5" />
          <div className="text-xs text-[#A0A0A0] leading-relaxed">
            <p className="text-white font-semibold mb-1">Billing is not connected yet</p>
            Trials run and every subscriber feature works, but no card is charged until{' '}
            <code className="text-[#FFB800]">STRIPE_SECRET_KEY</code> and{' '}
            <code className="text-[#FFB800]">STRIPE_PRICE_ID</code> are set. See{' '}
            <code className="text-[#FFB800]">docs/SETUP.md</code>.
          </div>
        </div>
      )}

      <p className="text-[11px] text-[#666] text-center leading-relaxed">
        Cancel any time — you keep access through the end of the paid period. Points already earned
        stay in your account.
      </p>
    </div>
  );
}
