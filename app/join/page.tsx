'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Sparkles, Check } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { AuthShell, Field, SubmitButton, ErrorNote } from '@/components/auth/AuthShell';

const PERKS = [
  '7 days free, then $4.99/month',
  'Exclusive drops that never go public',
  'Levels and ranks that unlock better rewards',
  'Rank-weighted entry into monthly prize draws',
  'Cancel any time',
];

export default function JoinPage() {
  const [displayName, setDisplayName] = useState('');
  const [handle, setHandle] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkInbox, setCheckInbox] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Use at least 8 characters for your password.');
      return;
    }
    const cleanHandle = handle.trim().toLowerCase();
    if (!/^[a-z0-9_]{3,24}$/.test(cleanHandle)) {
      setError('Your handle can use lowercase letters, numbers and underscores, 3–24 characters.');
      return;
    }

    setLoading(true);

    const supabase = createClient();
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        // Read by the handle_new_user() trigger to provision the profile,
        // fan game state and the 7-day trial in one transaction.
        data: { display_name: displayName.trim(), handle: cleanHandle, role: 'fan' },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/fan/discover`,
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    // With email confirmation on, there is no session yet.
    if (!data.session) {
      setCheckInbox(true);
      setLoading(false);
      return;
    }

    router.push('/fan/discover');
    router.refresh();
  };

  if (checkInbox) {
    return (
      <AuthShell title="Check your email" subtitle="One click and you're in.">
        <div className="text-center space-y-4">
          <div
            className="w-14 h-14 rounded-full mx-auto flex items-center justify-center"
            style={{ background: 'rgba(0,255,156,0.1)', boxShadow: 'inset 0 0 0 1px rgba(0,255,156,0.3)' }}
          >
            <Check size={26} className="text-[#00FF9C]" />
          </div>
          <p className="text-sm text-[#A0A0A0]">
            We sent a confirmation link to{' '}
            <span className="text-white font-medium break-all">{email}</span>. Open it to activate
            your account and start your free trial.
          </p>
          <Link href="/login" className="inline-block text-sm text-[#00C2FF] font-semibold hover:underline">
            Back to sign in
          </Link>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Become a superfan"
      subtitle="Play trivia. Climb the ranks. Unlock things nobody else gets."
      footer={
        <>
          Already have an account?{' '}
          <Link href="/login" className="text-[#00C2FF] font-semibold hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <ul className="space-y-2 mb-6">
        {PERKS.map((p) => (
          <li key={p} className="flex items-center gap-2.5 text-sm text-[#A0A0A0]">
            <Check size={15} className="text-[#00FF9C] flex-shrink-0" />
            {p}
          </li>
        ))}
      </ul>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Display name" htmlFor="displayName">
          <input
            id="displayName"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="auth-input"
            placeholder="What should we call you?"
            maxLength={40}
            required
          />
        </Field>

        <Field label="Handle" htmlFor="handle" hint="This is how you show up on leaderboards.">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#555] text-sm">@</span>
            <input
              id="handle"
              value={handle}
              onChange={(e) => setHandle(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
              className="auth-input pl-8"
              placeholder="dayone_fan"
              maxLength={24}
              required
            />
          </div>
        </Field>

        <Field label="Email" htmlFor="email">
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="auth-input"
            placeholder="you@email.com"
            required
          />
        </Field>

        <Field label="Password" htmlFor="password" hint="At least 8 characters.">
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="auth-input pr-12"
              placeholder="Create a password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#555] hover:text-white transition-colors p-1"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </Field>

        {error && <ErrorNote>{error}</ErrorNote>}

        <SubmitButton loading={loading} icon={<Sparkles size={16} />}>
          Start free trial
        </SubmitButton>

        <p className="text-[11px] text-[#666] text-center leading-relaxed">
          No card required for the trial. Prize draws are open to subscribers and, where required by
          law, via free entry — see the draw rules.
        </p>
      </form>
    </AuthShell>
  );
}
