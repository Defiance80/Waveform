'use client';

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Home, Radio, TrendingUp, Zap, DollarSign, Target, Settings, 
  Menu, X, User, Bell, ChevronLeft, LogOut, Calendar, Send, Wifi
} from 'lucide-react';

const navigationItems = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Pulse', href: '/dashboard/pulse', icon: Radio },
  { name: 'Momentum', href: '/dashboard/momentum', icon: TrendingUp },
  { name: 'Street Buzz', href: '/dashboard/street-buzz', icon: TrendingUp },
  { name: 'Echo', href: '/dashboard/echo', icon: Zap },
  { name: 'Events', href: '/dashboard/events', icon: Calendar },
  { name: 'Revenue', href: '/dashboard/revenue', icon: DollarSign },
  { name: 'PR & Campaigns', href: '/dashboard/pr', icon: Radio },
  { name: 'Submissions', href: '/dashboard/submit', icon: Send },
  { name: 'Rank Assassin', href: '/dashboard/rank-assassin', icon: Target },
  { name: 'Connect', href: '/dashboard/connect', icon: Wifi },
  { name: 'Leverage', href: '/dashboard/leverage', icon: Target },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string) => href === '/dashboard' ? pathname === '/dashboard' : pathname?.startsWith(href);

  const handleLogout = () => {
    localStorage.removeItem('slapbox_user');
    router.push('/');
  };

  return (
    <div className="flex h-screen bg-[#0A0A0A] overflow-hidden">
      {/* Desktop Sidebar */}
      <div className={`hidden md:flex md:flex-col ${collapsed ? 'md:w-16' : 'md:w-64'} bg-[#0A0A0A] border-r border-[#1E1E1E] transition-all duration-300 flex-shrink-0`}>
        {/* Logo */}
        <div className="p-4 border-b border-[#1E1E1E]">
          <div className="flex items-center justify-between">
            {!collapsed && (
              <h2 className="text-xl font-extrabold tracking-tight">
                <span className="bg-gradient-to-r from-[#00C2FF] to-[#7B2EFF] bg-clip-text text-transparent">SLAPBOX</span>
              </h2>
            )}
            {collapsed && (
              <span className="text-lg font-extrabold bg-gradient-to-r from-[#00C2FF] to-[#7B2EFF] bg-clip-text text-transparent">S</span>
            )}
            <button onClick={() => setCollapsed(!collapsed)} className="p-1.5 rounded-lg text-white hover:text-white hover:bg-[#111111] transition-all">
              <ChevronLeft size={16} className={`transition-transform ${collapsed ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1">
          {navigationItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link key={item.name} href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  active 
                    ? 'text-white bg-[#111111] border-l-2 border-[#00C2FF] shadow-[0_0_15px_rgba(0,194,255,0.1)]' 
                    : 'text-white hover:text-white hover:bg-[#111111]/50'
                } ${collapsed ? 'justify-center px-2' : ''}`}
              >
                <item.icon size={18} className={active ? 'text-[#00C2FF]' : ''} />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="p-3 border-t border-[#1E1E1E]">
          <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'}`}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold"
              style={{ background: 'linear-gradient(135deg, #00C2FF, #7B2EFF)' }}>
              KC
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="text-sm font-medium text-white truncate">Kendrick Cole</p>
                <p className="text-xs text-[#A0A0A0]">Artist</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="fixed left-0 top-0 bottom-0 w-72 bg-[#0A0A0A] border-r border-[#1E1E1E]">
            <div className="flex items-center justify-between p-4 border-b border-[#1E1E1E]">
              <h2 className="text-xl font-extrabold">
                <span className="bg-gradient-to-r from-[#00C2FF] to-[#7B2EFF] bg-clip-text text-transparent">SLAPBOX</span>
              </h2>
              <button onClick={() => setSidebarOpen(false)} className="p-2 text-white hover:text-white">
                <X size={20} />
              </button>
            </div>
            <nav className="p-4 space-y-1">
              {navigationItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link key={item.name} href={item.href} onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all ${
                      active ? 'text-white bg-[#111111] border-l-2 border-[#00C2FF]' : 'text-white hover:text-white hover:bg-[#111111]/50'
                    }`}>
                    <item.icon size={18} className={active ? 'text-[#00C2FF]' : ''} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Header */}
        <header className="bg-[#0A0A0A] border-b border-[#1E1E1E] px-4 py-3 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 text-white hover:text-white rounded-lg">
                <Menu size={20} />
              </button>
              <div className="min-w-0">
                <h1 className="text-lg font-bold text-white truncate">Kendrick Cole</h1>
                <p className="text-xs text-[#A0A0A0] hidden sm:block">Hip-Hop Artist • Atlanta, GA</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="relative p-2 text-white hover:text-white transition-colors rounded-lg">
                <Bell size={18} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#FF3B3B] rounded-full" />
              </button>
              <div className="relative">
                <button onClick={() => setUserMenu(!userMenu)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                  style={{ background: 'linear-gradient(135deg, #00C2FF, #7B2EFF)' }}>
                  KC
                </button>
                {userMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-[#111] border border-[#1E1E1E] rounded-xl shadow-xl z-50 overflow-hidden">
                    <div className="p-3 border-b border-[#1E1E1E]">
                      <p className="text-sm font-medium text-white">Kendrick Cole</p>
                      <p className="text-xs text-[#A0A0A0]">demo@slapbox.ai</p>
                    </div>
                    <button onClick={handleLogout} className="w-full text-left px-3 py-2.5 text-sm text-white hover:text-white hover:bg-[#1E1E1E] flex items-center gap-2 transition-colors">
                      <LogOut size={14} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto pb-24 md:pb-0">
          {children}
        </main>

        {/* Footer */}
        <footer className="hidden md:block border-t border-[#1E1E1E] px-4 py-2">
          <div className="flex justify-between text-xs text-[#666666]">
            <span>© 2026 SLAPBOX</span>
            <span>Developed by GoKoncentrate</span>
          </div>
        </footer>
      </div>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0A0A0A]/95 backdrop-blur-lg border-t border-[#1E1E1E] px-1 py-1.5 z-40">
        <div className="flex items-center justify-around">
          {/* Home | Pulse | Street Buzz | Revenue | More */}
          <Link href="/dashboard" className={`flex flex-col items-center py-1.5 px-3 rounded-lg transition-colors ${isActive('/dashboard') ? 'text-[#00C2FF]' : 'text-white'}`}>
            <Home size={18} />
            <span className="text-[10px] mt-0.5 font-medium">Home</span>
          </Link>
          <Link href="/dashboard/pulse" className={`flex flex-col items-center py-1.5 px-3 rounded-lg transition-colors ${isActive('/dashboard/pulse') ? 'text-[#00C2FF]' : 'text-white'}`}>
            <Radio size={18} />
            <span className="text-[10px] mt-0.5 font-medium">Pulse</span>
          </Link>
          <Link href="/dashboard/street-buzz" className={`flex flex-col items-center py-1.5 px-3 rounded-lg transition-colors ${isActive('/dashboard/street-buzz') ? 'text-[#00C2FF]' : 'text-white'}`}>
            <TrendingUp size={18} />
            <span className="text-[10px] mt-0.5 font-medium">Street Buzz</span>
          </Link>
          <Link href="/dashboard/revenue" className={`flex flex-col items-center py-1.5 px-3 rounded-lg transition-colors ${isActive('/dashboard/revenue') ? 'text-[#00C2FF]' : 'text-white'}`}>
            <DollarSign size={18} />
            <span className="text-[10px] mt-0.5 font-medium">Revenue</span>
          </Link>
          <button onClick={() => setSidebarOpen(true)} className="flex flex-col items-center py-1.5 px-3 rounded-lg transition-colors text-white">
            <Menu size={18} />
            <span className="text-[10px] mt-0.5 font-medium">More</span>
          </button>
        </div>
      </div>
    </div>
  );
};
