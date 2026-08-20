import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/types';

/**
 * Service-role client. Bypasses RLS entirely.
 *
 * Only ever import this from server-side code (Route Handlers, Server Actions,
 * scripts). It is used for the handful of operations that legitimately sit
 * outside a user's own permissions: Stripe webhooks moving subscription state,
 * running a monthly draw, and issuing signed URLs for private reward media.
 */
export function createAdminClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set');

  return createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
