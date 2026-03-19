'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (email && password) {
      localStorage.setItem('slapbox_user', JSON.stringify({ email, name: 'Kendrick Cole' }));
      router.push('/dashboard');
    } else {
      setError('Please enter your credentials');
    }
    setIsLoading(false);
  };

  const fillCredentials = (e: string, p: string) => {
    setEmail(e);
    setPassword(p);
    setError('');
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] relative overflow-hidden flex items-center justify-center">
      {/* Enhanced background pattern - more visible */}
      <div className="absolute inset-0 opacity-[0.08]" style={{
        backgroundImage: `repeating-linear-gradient(90deg, #00C2FF 0px, transparent 1px, transparent 60px),
                          repeating-linear-gradient(0deg, #7B2EFF 0px, transparent 1px, transparent 60px)`
      }} />
      
      {/* Floating orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-[#00C2FF]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 sm:w-80 sm:h-80 bg-[#7B2EFF]/5 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-md mx-4 px-4 sm:px-0">
        {/* Logo */}
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            <span className="bg-gradient-to-r from-[#00C2FF] via-[#3B82F6] to-[#7B2EFF] bg-clip-text text-transparent">
              SLAPBOX
            </span>
          </h1>
          <div className="flex items-center justify-center gap-1.5 mt-3">
            <div className="h-[2px] w-8 bg-gradient-to-r from-transparent to-[#00C2FF]" />
            <p className="text-[#A0A0A0] text-xs font-medium tracking-[0.2em] uppercase">
              Cultural Intelligence OS
            </p>
            <div className="h-[2px] w-8 bg-gradient-to-l from-transparent to-[#7B2EFF]" />
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-[#111111]/80 border border-[#1E1E1E] rounded-2xl overflow-hidden noise-overlay relative">
          {/* Gradient top bar */}
          <div className="h-1 bg-gradient-to-r from-[#00C2FF] via-[#3B82F6] to-[#7B2EFF]" />
          
          <div className="p-4 sm:p-6 md:p-8 relative z-10">
            <p className="text-[#A0A0A0] text-sm text-center mb-6">
              See the motion before it becomes momentum.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white mb-1.5">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl text-white placeholder-[#555] text-sm focus:outline-none focus:ring-2 focus:ring-[#00C2FF]/50 focus:border-[#00C2FF]/50 transition-all"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-white mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl text-white placeholder-[#555] text-sm focus:outline-none focus:ring-2 focus:ring-[#00C2FF]/50 focus:border-[#00C2FF]/50 transition-all"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#555] hover:text-white transition-colors p-1"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-[#FF3B3B]/10 border border-[#FF3B3B]/20 rounded-xl p-3">
                  <p className="text-sm text-[#FF3B3B]">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl font-semibold text-sm text-white transition-all duration-200 disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98]"
                style={{ background: 'linear-gradient(135deg, #00C2FF, #7B2EFF)', boxShadow: '0 0 25px rgba(0,194,255,0.2)' }}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Signing In...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Lock size={16} />
                    Sign In
                  </span>
                )}
              </button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 pt-5 border-t border-[#1E1E1E]">
              <p className="text-[10px] font-semibold text-[#555] text-center uppercase tracking-[0.15em] mb-3">
                Demo Access
              </p>
              <button
                type="button"
                onClick={() => fillCredentials('demo@slapbox.ai', 'demo123')}
                className="w-full p-3 bg-[#0A0A0A] hover:bg-[#151515] border border-[#1E1E1E] hover:border-[#00C2FF]/30 rounded-xl transition-all duration-200 text-left group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white group-hover:text-[#00C2FF] transition-colors">
                      Demo Account
                    </p>
                    <p className="text-xs text-[#555] font-mono mt-0.5">demo@slapbox.ai</p>
                  </div>
                  <span className="text-xs text-[#555] font-mono">demo123</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-[#555] text-xs">
            Developed by <span className="text-[#C9A86A] font-medium">GoKoncentrate</span>
          </p>
        </div>
      </div>
    </div>
  );
}
