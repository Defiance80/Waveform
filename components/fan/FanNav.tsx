'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Compass, Store, Package, Ticket, User, LogOut, Flame } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { rankForLevel } from '@/lib/game/progression';

const ITEMS = [
  { name: 'Home',     href: '/fan',          icon: Home },
  { name: 'Discover', href: '/fan/discover', icon: Compass },
  { name: 'Shelf',    href: '/fan/shop',     icon: Store },
  { name: 'Vault',    href: '/fan/vault',    icon: Package },
  { name: 'Draws',    href: '/fan/draws',    icon: Ticket },
  { name: 'Profile',  href: '/fan/profile',  icon: User },
];

export function FanNav({
  displayName,
  level,
  streak,
}: {
  displayName: string;
  level: number;
  streak: number;
}) {
  const rank = rankForLevel(level);
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string) =>
    href === '/fan' ? pathname === '/fan' : pathname?.startsWith(href);

  const signOut = async () => {
    await createClient().auth.signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <>
      {/* ── Top bar ───────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-[#0A0A0A]/90 backdrop-blur-lg border-b border-[#1E1E1E]">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
          <Link href="/fan" className="text-lg font-extrabold tracking-tight flex-shrink-0">
            <span className="bg-gradient-to-r from-[#00C2FF] to-[#7B2EFF] bg-clip-text text-transparent">
              SLAPBOX
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                  isActive(item.href)
                    ? 'text-white bg-[#151515] shadow-[inset_0_0_0_1px_rgba(0,194,255,0.25)]'
                    : 'text-[#A0A0A0] hover:text-white hover:bg-[#111]'
                }`}
              >
                <item.icon size={16} className={isActive(item.href) ? 'text-[#00C2FF]' : ''} />
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 flex-shrink-0">
            {streak > 0 && (
              <span
                className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold text-[#FFB800]"
                style={{ background: 'rgba(255,184,0,0.1)', boxShadow: 'inset 0 0 0 1px rgba(255,184,0,0.25)' }}
                title={`${streak}-day streak`}
              >
                <Flame size={13} /> {streak}
              </span>
            )}
            <Link
              href="/fan/profile"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold tabular-nums transition-transform hover:scale-105"
              style={{
                color: rank.color,
                background: `${rank.color}14`,
                boxShadow: `inset 0 0 0 1px ${rank.color}38`,
              }}
              title={`Level ${level} — ${rank.name}`}
            >
              <span>LVL {level}</span>
              <span className="hidden sm:inline font-semibold opacity-80">{rank.name}</span>
            </Link>
            <button
              onClick={signOut}
              title={`Sign out of ${displayName}`}
              className="p-2 rounded-lg text-[#A0A0A0] hover:text-white hover:bg-[#151515] transition-colors"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile bottom nav ─────────────────────────────────────────────── */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#0A0A0A]/95 backdrop-blur-lg border-t border-[#1E1E1E] px-1 py-1.5">
        <div className="flex items-center justify-around">
          {ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center py-1 px-2 rounded-lg transition-colors ${
                isActive(item.href) ? 'text-[#00C2FF]' : 'text-[#A0A0A0]'
              }`}
            >
              <item.icon size={18} />
              <span className="text-[10px] mt-0.5 font-medium">{item.name}</span>
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
