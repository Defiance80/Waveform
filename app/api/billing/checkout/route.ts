import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getStripe } from '@/lib/stripe';

/** Creates a Stripe Checkout session for the Superfan plan. */
export async function POST() {
  const stripe = getStripe();
  const priceId = process.env.STRIPE_PRICE_ID;

  if (!stripe || !priceId) {
    return NextResponse.json(
      { error: 'Billing is not configured. Set STRIPE_SECRET_KEY and STRIPE_PRICE_ID.' },
      { status: 503 }
    );
  }

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Not signed in' }, { status: 401 });

  const { data: sub } = await supabase
    .from('subscriptions')
    .select('stripe_customer_id, trial_ends_at')
    .eq('fan_id', user.id)
    .maybeSingle();

  // Reuse the customer if one exists, so a fan who cancels and returns keeps
  // one billing history rather than accumulating duplicates.
  let customerId = sub?.stripe_customer_id ?? undefined;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email ?? undefined,
      metadata: { fan_id: user.id },
    });
    customerId = customer.id;

    await createAdminClient()
      .from('subscriptions')
      .update({ stripe_customer_id: customerId })
      .eq('fan_id', user.id);
  }

  // Honour whatever is left of the in-app trial rather than restarting it.
  const remainingTrialDays = sub?.trial_ends_at
    ? Math.max(0, Math.ceil((new Date(sub.trial_ends_at).getTime() - Date.now()) / 86_400_000))
    : 0;

  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    subscription_data: {
      metadata: { fan_id: user.id },
      ...(remainingTrialDays > 0 ? { trial_period_days: remainingTrialDays } : {}),
    },
    success_url: `${origin}/fan/subscription?checkout=success`,
    cancel_url: `${origin}/fan/subscription?checkout=cancelled`,
    allow_promotion_codes: true,
  });

  return NextResponse.json({ url: session.url });
}
