import React from 'react';
import Link from 'next/link';

/** Shared chrome for the sign-in / sign-up screens. */
export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0A0A0A] relative overflow-hidden flex items-center justify-center py-10">
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: `repeating-linear-gradient(90deg, #00C2FF 0px, transparent 1px, transparent 60px),
                            repeating-linear-gradient(0deg, #7B2EFF 0px, transparent 1px, transparent 60px)`,
        }}
      />
      <div className="absolute top-1/4 left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-[#00C2FF]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 sm:w-80 sm:h-80 bg-[#7B2EFF]/5 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
              <span className="bg-gradient-to-r from-[#00C2FF] via-[#3B82F6] to-[#7B2EFF] bg-clip-text text-transparent">
                SLAPBOX
              </span>
            </h1>
          </Link>
          <div className="flex items-center justify-center gap-1.5 mt-3">
            <div className="h-[2px] w-8 bg-gradient-to-r from-transparent to-[#00C2FF]" />
            <p className="text-[#A0A0A0] text-xs font-medium tracking-[0.2em] uppercase">
              Know them better than anyone
            </p>
            <div className="h-[2px] w-8 bg-gradient-to-l from-transparent to-[#7B2EFF]" />
          </div>
        </div>

        <div className="bg-[#111111]/80 border border-[#1E1E1E] rounded-2xl overflow-hidden noise-overlay relative">
          <div className="h-1 bg-gradient-to-r from-[#00C2FF] via-[#3B82F6] to-[#7B2EFF]" />
          <div className="p-5 sm:p-7 relative z-10">
            <h2 className="text-xl font-bold text-white text-center">{title}</h2>
            <p className="text-[#A0A0A0] text-sm text-center mt-1 mb-6">{subtitle}</p>
            {children}
          </div>
        </div>

        {footer && <p className="text-center mt-5 text-sm text-[#A0A0A0]">{footer}</p>}
      </div>
    </div>
  );
}

export function Field({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-sm font-medium text-white mb-1.5">
        {label}
      </label>
      {children}
      {hint && <p className="text-[11px] text-[#666] mt-1.5">{hint}</p>}
    </div>
  );
}

export function ErrorNote({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#FF3B3B]/10 border border-[#FF3B3B]/25 rounded-xl p-3" role="alert">
      <p className="text-sm text-[#FF6B6B]">{children}</p>
    </div>
  );
}

export function SubmitButton({
  loading,
  icon,
  children,
}: {
  loading: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full py-3.5 rounded-xl font-semibold text-sm text-white transition-all duration-200 disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98]"
      style={{ background: 'linear-gradient(135deg, #00C2FF, #7B2EFF)', boxShadow: '0 0 25px rgba(0,194,255,0.2)' }}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Working…
        </span>
      ) : (
        <span className="flex items-center justify-center gap-2">
          {icon}
          {children}
        </span>
      )}
    </button>
  );
}
