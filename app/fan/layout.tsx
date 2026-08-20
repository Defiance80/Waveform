import React from 'react';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { FanNav } from '@/components/fan/FanNav';
import { getFanContext } from '@/lib/fan';

export const dynamic = 'force-dynamic';

export default async function FanLayout({ children }: { children: React.ReactNode }) {
  const { profile, fan, subscription, trialDaysLeft } = await getFanContext();

  const showTrialBanner = subscription?.state === 'trialing';
  const lapsed = subscription?.state === 'past_due' || subscription?.state === 'canceled';

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <FanNav
        displayName={profile.display_name}
        level={fan.level}
        streak={fan.streak_days}
      />

      {showTrialBanner && (
        <Link
          href="/fan/subscription"
          className="block bg-gradient-to-r from-[#00C2FF]/10 to-[#7B2EFF]/10 border-b border-[#00C2FF]/20 hover:from-[#00C2FF]/15 hover:to-[#7B2EFF]/15 transition-colors"
        >
          <div className="max-w-6xl mx-auto px-4 py-2 flex items-center gap-2 text-xs">
            <Sparkles size={14} className="text-[#00C2FF] flex-shrink-0" />
            <span className="text-white font-medium">
              {trialDaysLeft === 0
                ? 'Your free trial ends today.'
                : `${trialDaysLeft} day${trialDaysLeft === 1 ? '' : 's'} left in your free trial.`}
            </span>
            <span className="text-[#A0A0A0] hidden sm:inline">
              Keep exclusive drops, subscriber rewards and monthly draw entries.
            </span>
            <span className="ml-auto text-[#00C2FF] font-semibold whitespace-nowrap">Manage →</span>
          </div>
        </Link>
      )}

      {lapsed && (
        <Link href="/fan/subscription" className="block bg-[#FF3B3B]/10 border-b border-[#FF3B3B]/25">
          <div className="max-w-6xl mx-auto px-4 py-2 flex items-center gap-2 text-xs">
            <span className="text-white font-medium">
              Your subscription is inactive — subscriber-only rewards are locked.
            </span>
            <span className="ml-auto text-[#FF3B3B] font-semibold whitespace-nowrap">Reactivate →</span>
          </div>
        </Link>
      )}

      <main className="max-w-6xl mx-auto px-4 py-6 pb-28 md:pb-10">{children}</main>
    </div>
  );
}
