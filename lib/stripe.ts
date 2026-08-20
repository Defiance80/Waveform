import Stripe from 'stripe';

/**
 * Returns a Stripe client, or null when billing has not been configured yet.
 *
 * Returning null rather than throwing lets the whole app build and run
 * without Stripe keys -- trials still work, fans still play, and only the
 * checkout button is inert.
 */
export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key, { apiVersion: '2025-02-24.acacia' as Stripe.LatestApiVersion });
}

export const PLAN = {
  code: 'superfan_monthly',
  priceCents: 499,
  trialDays: 7,
} as const;
