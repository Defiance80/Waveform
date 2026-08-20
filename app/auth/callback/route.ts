import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * Exchanges the email-confirmation / OAuth code for a session cookie.
 * Supabase redirects here after a fan clicks the link in their inbox.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/fan';

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Only allow same-app redirects: an attacker-supplied absolute URL in
      // ?next= would otherwise turn this into an open redirect.
      const safeNext = next.startsWith('/') && !next.startsWith('//') ? next : '/fan';
      return NextResponse.redirect(`${origin}${safeNext}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}
