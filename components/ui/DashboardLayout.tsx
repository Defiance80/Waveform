'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  Home, 
  Radio, 
  TrendingUp, 
  Zap, 
  DollarSign, 
  Target, 
  Settings, 
  Menu, 
  X,
  User,
  Bell,
  ChevronLeft
} from 'lucide-react';
import { WaveformLogo } from './WaveformLogo';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: Home,
    description: 'Overview & momentum'
  },
  {
    name: 'Pulse',
    href: '/dashboard/pulse',
    icon: Radio,
    description: 'Cultural signals'
  },
  {
    name: 'Momentum',
    href: '/dashboard/momentum',
    icon: TrendingUp,
    description: 'Geo intelligence'
  },
  {
    name: 'Echo',
    href: '/dashboard/echo',
    icon: Zap,
    description: 'Content spread'
  },
  {
    name: 'Revenue',
    href: '/dashboard/revenue',
    icon: DollarSign,
    description: 'Revenue intelligence'
  },
  {
    name: 'Leverage',
    href: '/dashboard/leverage',
    icon: Target,
    description: 'Action center'
  },
  {
    name: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
    description: 'Preferences'
  }
];

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname?.startsWith(href);
  };

  return (
    <div className="flex h-screen bg-primary-bg">
      {/* Desktop Sidebar */}
      <div className={`hidden md:flex md:flex-col ${sidebarCollapsed ? 'md:w-16' : 'md:w-64'} bg-primary-bg border-r border-gray-800 transition-all duration-300`}>
        {/* Logo */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <WaveformLogo size="md" />
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-primary-secondary transition-all duration-200"
            >
              <ChevronLeft className={`w-4 h-4 transition-transform duration-300 ${sidebarCollapsed ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`nav-item ${active ? 'active' : ''} ${sidebarCollapsed ? 'justify-center px-2' : ''}`}
              >
                <Icon className={`w-5 h-5 ${sidebarCollapsed ? '' : 'mr-3'}`} />
                {!sidebarCollapsed && (
                  <div className="flex-1">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs text-text-secondary">{item.description}</div>
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-gray-800">
          <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'space-x-3'}`}>
            <div className="w-8 h-8 bg-gradient-brand rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1">
                <div className="font-medium text-text-primary">Kendrick Cole</div>
                <div className="text-xs text-text-secondary">Artist Account</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="fixed left-0 top-0 bottom-0 w-64 bg-primary-bg border-r border-gray-800">
            {/* Mobile Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <WaveformLogo size="md" />
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-lg text-text-secondary hover:text-text-primary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Navigation */}
            <nav className="p-4 space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`nav-item ${active ? 'active' : ''}`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    <div className="flex-1">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-xs text-text-secondary">{item.description}</div>
                    </div>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-primary-bg border-b border-gray-800 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden p-2 rounded-lg text-text-secondary hover:text-text-primary"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-text-primary">Kendrick Cole</h1>
                <p className="text-sm text-text-secondary">Hip-Hop Artist • Atlanta, GA</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="relative p-2 rounded-lg text-text-secondary hover:text-text-primary transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-status-danger rounded-full"></span>
              </button>
              <div className="w-8 h-8 bg-gradient-brand rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-primary-bg border-t border-gray-800 px-2 py-2">
        <div className="flex items-center justify-around">
          {navigationItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                  active 
                    ? 'text-accent-blue' 
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                <Icon className="w-5 h-5 mb-1" />
                <span className="text-xs">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Floating Action Button (Mobile) */}
      <button className="md:hidden fixed bottom-20 right-4 w-14 h-14 bg-gradient-brand rounded-full shadow-lg flex items-center justify-center">
        <Target className="w-6 h-6 text-white" />
      </button>
    </div>
  );
};