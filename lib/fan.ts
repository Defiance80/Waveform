import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { FanProfile, Profile, Subscription } from '@/lib/types';

export interface FanContext {
  userId: string;
  profile: Profile;
  fan: FanProfile;
  subscription: Subscription | null;
  /** Trial or paid — the gate for subscriber-only rewards. */
  hasAccess: boolean;
  trialDaysLeft: number | null;
}

/**
 * Loads everything the fan area needs about the signed-in user.
 * Redirects to /login when there is no session, so pages can treat the
 * return value as always-present.
 */
export async function getFanContext(): Promise<FanContext> {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const [{ data: profile }, { data: fan }, { data: subscription }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('fan_profiles').select('*').eq('id', user.id).single(),
    supabase.from('subscriptions').select('*').eq('fan_id', user.id).maybeSingle(),
  ]);

  // An artist-role account has a profile but no fan game state.
  if (!profile) redirect('/login');
  if (!fan) redirect('/dashboard');

  const state = subscription?.state;
  const hasAccess = state === 'active' || state === 'trialing';

  let trialDaysLeft: number | null = null;
  if (state === 'trialing' && subscription?.trial_ends_at) {
    const ms = new Date(subscription.trial_ends_at).getTime() - Date.now();
    trialDaysLeft = Math.max(0, Math.ceil(ms / 86_400_000));
  }

  return {
    userId: user.id,
    profile: profile as Profile,
    fan: fan as FanProfile,
    subscription: (subscription as Subscription) ?? null,
    hasAccess,
    trialDaysLeft,
  };
}
