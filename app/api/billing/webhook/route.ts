import { NextResponse, type NextRequest } from 'next/server';
import type Stripe from 'stripe';
import { createAdminClient } from '@/lib/supabase/admin';
import { getStripe } from '@/lib/stripe';

// Stripe needs the raw body to verify the signature, so this route must not
// be statically analysed or cached.
export const dynamic = 'force-dynamic';

const STATE_MAP: Record<string, string> = {
  trialing: 'trialing',
  active: 'active',
  past_due: 'past_due',
  unpaid: 'past_due',
  canceled: 'canceled',
  incomplete: 'incomplete',
  incomplete_expired: 'canceled',
  paused: 'canceled',
};

/**
 * Stripe webhook. This is the ONLY thing that moves a subscription into a
 * paid state -- the client can read subscriptions but never write them, so a
 * fan cannot grant themselves subscriber rewards.
 */
export async function POST(req: NextRequest) {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !secret) {
    return NextResponse.json({ error: 'Billing not configured' }, { status: 503 });
  }

  const signature = req.headers.get('stripe-signature');
  if (!signature) return NextResponse.json({ error: 'Missing signature' }, { status: 400 });

  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, secret);
  } catch (err) {
    // A failed signature check means the request did not come from Stripe.
    console.error('[stripe-webhook] signature verification failed', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const db = createAdminClient();

  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription;
      const fanId = sub.metadata?.fan_id;

      const patch = {
        state: STATE_MAP[sub.status] ?? 'incomplete',
        stripe_subscription_id: sub.id,
        stripe_customer_id: typeof sub.customer === 'string' ? sub.customer : sub.customer.id,
        current_period_start: new Date((sub as any).current_period_start * 1000).toISOString(),
        current_period_end: new Date((sub as any).current_period_end * 1000).toISOString(),
        cancel_at_period_end: sub.cancel_at_period_end,
        trial_ends_at: sub.trial_end ? new Date(sub.trial_end * 1000).toISOString() : null,
        price_cents: sub.items.data[0]?.price.unit_amount ?? 499,
      };

      // Match on fan_id when Stripe carried it, otherwise fall back to the
      // customer id -- portal-initiated changes do not always echo metadata.
      const query = fanId
        ? db.from('subscriptions').update(patch).eq('fan_id', fanId)
        : db.from('subscriptions').update(patch).eq('stripe_customer_id', patch.stripe_customer_id);

      const { error } = await query;
      if (error) {
        console.error('[stripe-webhook] subscription update failed', error);
        return NextResponse.json({ error: 'Update failed' }, { status: 500 });
      }
      break;
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice;
      const customerId = typeof invoice.customer === 'string' ? invoice.customer : invoice.customer?.id;
      if (customerId) {
        await db.from('subscriptions').update({ state: 'past_due' }).eq('stripe_customer_id', customerId);
      }
      break;
    }

    default:
      // Everything else is acknowledged and ignored.
      break;
  }

  return NextResponse.json({ received: true });
}
