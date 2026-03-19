'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { WaveformLogo } from '@/components/ui/WaveformLogo';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login process
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For demo purposes, any credentials work, but highlight the demo ones
    router.push('/dashboard');
  };

  const fillDemoCredentials = () => {
    setEmail('demo@waveform.ai');
    setPassword('demo123');
  };

  return (
    <div className="min-h-screen bg-primary-bg relative overflow-hidden">
      {/* Animated background waveform */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 waveform">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="waveform-bar"
              style={{
                height: `${Math.random() * 30 + 10}px`,
                animationDelay: `${i * 0.1}s`
              }}
            />
          ))}
        </div>
        <div className="absolute bottom-32 right-20 waveform">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="waveform-bar"
              style={{
                height: `${Math.random() * 40 + 15}px`,
                animationDelay: `${i * 0.15}s`
              }}
            />
          ))}
        </div>
        <div className="absolute top-1/2 left-1/4 waveform">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="waveform-bar"
              style={{
                height: `${Math.random() * 25 + 8}px`,
                animationDelay: `${i * 0.2}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Main login container */}
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-12">
            <WaveformLogo size="lg" animated className="mx-auto mb-4" />
            <p className="text-text-secondary text-sm font-medium tracking-wide">
              See the motion before it becomes momentum.
            </p>
          </div>

          {/* Login form */}
          <div className="bg-primary-secondary border border-gray-800 rounded-2xl p-8 card-glow">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-dark w-full"
                  placeholder="Enter your email"
                  required
                />
              </div>

              {/* Password field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-text-primary mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-dark w-full pr-12"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Demo credentials */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={fillDemoCredentials}
                  className="text-accent-blue hover:text-accent-purple text-sm font-medium transition-colors"
                >
                  Use Demo Credentials
                </button>
                <p className="text-text-secondary text-xs mt-1">
                  demo@waveform.ai / demo123
                </p>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Signing In...
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>
          </div>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-text-secondary text-xs">
              Developed by{' '}
              <span className="text-accent-gold font-medium">GoKoncentrate</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}