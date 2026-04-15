'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/ui/DashboardLayout';
import Link from 'next/link';
import {
  Sparkles, Image, Youtube, Share2, MessageSquare, TrendingUp,
  Flame, Users, Zap, Star, ArrowRight, BarChart2, Globe, Target
} from 'lucide-react';

const modules = [
  {
    title: 'SEO Image Creator',
    description: 'Generate visual content with keyword overlays optimized for search and AI answer engines.',
    href: '/dashboard/contentlab/seo-images',
    icon: Image,
    color: '#00C2FF',
    badge: 'SEO + AEO',
    stat: '3x more reach',
  },
  {
    title: 'Thumbnail Generator',
    description: 'High-converting YouTube thumbnails with AI-powered composition and click-worthy energy.',
    href: '/dashboard/contentlab/thumbnails',
    icon: Youtube,
    color: '#FF3B3B',
    badge: 'AI Powered',
    stat: '+48% CTR avg',
  },
  {
    title: 'Social Publisher',
    description: 'Publish to Instagram, TikTok, X, Facebook, LinkedIn & YouTube with platform-tailored captions.',
    href: '/dashboard/contentlab/publisher',
    icon: Share2,
    color: '#7B2EFF',
    badge: '6 Platforms',
    stat: 'Schedule & auto-post',
  },
  {
    title: 'Comment Responder',
    description: 'AI filters positive, inquisitive comments and generates authentic replies — skips trolls automatically.',
    href: '/dashboard/contentlab/comments',
    icon: MessageSquare,
    color: '#00FF9C',
    badge: 'Smart Filter',
    stat: '50 auto-replies/day',
  },
];

const culturalMetrics = [
  { label: 'Cultural Heat', value: 84, color: '#FF3B3B', icon: Flame, desc: 'Brand resonance in target culture' },
  { label: 'Demographic Reach', value: 71, color: '#00C2FF', icon: Users, desc: 'Alignment with your audience' },
  { label: 'Trend Alignment', value: 92, color: '#7B2EFF', icon: TrendingUp, desc: 'Relevance to current movements' },
  { label: 'AEO Score', value: 67, color: '#C9A86A', icon: Globe, desc: 'AI answer engine visibility' },
];

const recentAssets = [
  { type: 'SEO Image', title: 'Brand Launch — Spring Collection', platform: 'Instagram', time: '2h ago', status: 'Published' },
  { type: 'Thumbnail', title: 'Behind the Business — Ep. 7', platform: 'YouTube', time: '5h ago', status: 'Draft' },
  { type: 'Post', title: 'Community Spotlight — Vol. 3', platform: '3 platforms', time: '1d ago', status: 'Live' },
];

export default function ContentLabPage() {
  const [hoveredModule, setHoveredModule] = useState<number | null>(null);

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={20} className="text-[#00C2FF]" />
              <span className="text-xs font-semibold text-[#00C2FF] uppercase tracking-widest">ContentLab</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Cultural Content{' '}
              <span className="bg-gradient-to-r from-[#00C2FF] to-[#7B2EFF] bg-clip-text text-transparent">
                Intelligence
              </span>
            </h1>
            <p className="text-[#A0A0A0] text-sm mt-1">
              Create, publish, and measure content that resonates with your culture — not just your industry.
            </p>
          </div>
          <Link
            href="/dashboard/connect"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white border border-[#2A2A2A] hover:border-[#00C2FF] hover:text-[#00C2FF] transition-all"
          >
            <Zap size={14} /> Connect Platforms
          </Link>
        </div>

        {/* Cultural Impact Score */}
        <div className="bg-[#0F0F0F] border border-[#2A2A2A] rounded-2xl p-5 sm:p-6"
          style={{ background: 'linear-gradient(135deg, rgba(0,194,255,0.04) 0%, rgba(123,46,255,0.04) 100%)' }}>
          <div className="flex flex-col lg:flex-row lg:items-center gap-6">
            {/* Score */}
            <div className="flex items-center gap-5 flex-shrink-0">
              <div className="relative w-24 h-24">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="#1E1E1E" strokeWidth="8" />
                  <circle cx="50" cy="50" r="42" fill="none"
                    stroke="url(#scoreGrad)" strokeWidth="8"
                    strokeDasharray={`${79 * 2.64} ${100 * 2.64}`}
                    strokeLinecap="round" />
                  <defs>
                    <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#00C2FF" />
                      <stop offset="100%" stopColor="#7B2EFF" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-extrabold text-white">79</span>
                  <span className="text-[10px] text-[#A0A0A0]">/ 100</span>
                </div>
              </div>
              <div>
                <p className="text-xs text-[#A0A0A0] uppercase tracking-wider font-medium">Cultural Impact Score</p>
                <p className="text-2xl font-extrabold text-white">Strong</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <TrendingUp size={13} className="text-[#00FF9C]" />
                  <span className="text-xs text-[#00FF9C] font-semibold">+6 pts this week</span>
                </div>
                <p className="text-xs text-[#666] mt-1">Top 12% of brands in your industry & market</p>
              </div>
            </div>

            {/* Metric Bars */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {culturalMetrics.map((metric) => (
                <div key={metric.label} className="bg-[#141414] rounded-xl p-3 border border-[#1E1E1E]">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <metric.icon size={13} style={{ color: metric.color }} />
                      <span className="text-xs font-semibold text-white">{metric.label}</span>
                    </div>
                    <span className="text-sm font-extrabold" style={{ color: metric.color }}>{metric.value}</span>
                  </div>
                  <div className="h-1.5 bg-[#1E1E1E] rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${metric.value}%`, backgroundColor: metric.color }} />
                  </div>
                  <p className="text-[10px] text-[#555] mt-1.5">{metric.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* AEO callout */}
          <div className="mt-4 flex flex-wrap gap-2 items-center pt-4 border-t border-[#1E1E1E]">
            <Globe size={13} className="text-[#C9A86A]" />
            <span className="text-xs text-[#C9A86A] font-semibold">AEO Advisory:</span>
            <span className="text-xs text-[#666]">
              Your content ranks in 3 AI answer engines. Boost your AEO score by adding FAQ-format captions to your next 2 posts.
            </span>
            <button className="text-xs text-[#00C2FF] hover:underline ml-auto">See AEO Tips →</button>
          </div>
        </div>

        {/* Module Cards */}
        <div>
          <h2 className="text-sm font-semibold text-[#A0A0A0] uppercase tracking-wider mb-3">Tools</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {modules.map((mod, i) => (
              <Link
                key={mod.title}
                href={mod.href}
                onMouseEnter={() => setHoveredModule(i)}
                onMouseLeave={() => setHoveredModule(null)}
                className="group block bg-[#141414] border border-[#2A2A2A] rounded-2xl p-5 hover:border-[#333] transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,0,0,0.5)]"
                style={{
                  boxShadow: hoveredModule === i ? `0 0 30px ${mod.color}18` : undefined,
                  borderColor: hoveredModule === i ? `${mod.color}44` : undefined,
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${mod.color}18` }}>
                    <mod.icon size={20} style={{ color: mod.color }} />
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: `${mod.color}18`, color: mod.color }}>
                      {mod.badge}
                    </span>
                    <ArrowRight size={14} className="text-[#444] group-hover:text-[#888] transition-colors" />
                  </div>
                </div>
                <h3 className="text-base font-bold text-white mb-1">{mod.title}</h3>
                <p className="text-xs text-[#666] leading-relaxed mb-3">{mod.description}</p>
                <div className="flex items-center gap-1.5">
                  <Star size={11} style={{ color: mod.color }} />
                  <span className="text-[11px] font-semibold" style={{ color: mod.color }}>{mod.stat}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Brand Impact + Recent */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Brand Impact Breakdown */}
          <div className="bg-[#141414] border border-[#2A2A2A] rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Target size={16} className="text-[#7B2EFF]" />
              <h3 className="text-sm font-bold text-white">Brand Impact Breakdown</h3>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Digital Presence', val: 74, color: '#00C2FF' },
                { label: 'Cultural Authority', val: 81, color: '#7B2EFF' },
                { label: 'Audience Loyalty', val: 65, color: '#C9A86A' },
                { label: 'SEO Visibility', val: 58, color: '#00FF9C' },
              ].map(m => (
                <div key={m.label}>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-[#888]">{m.label}</span>
                    <span className="text-xs font-bold text-white">{m.val}</span>
                  </div>
                  <div className="h-1 bg-[#1E1E1E] rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${m.val}%`, backgroundColor: m.color }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-[#1E1E1E]">
              <p className="text-[10px] text-[#555] leading-relaxed">
                Your Cultural Authority outperforms 81% of brands in your industry and market. Lean into it.
              </p>
            </div>
          </div>

          {/* Recent Assets */}
          <div className="lg:col-span-2 bg-[#141414] border border-[#2A2A2A] rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BarChart2 size={16} className="text-[#00C2FF]" />
                <h3 className="text-sm font-bold text-white">Recent Assets</h3>
              </div>
              <Link href="/dashboard/contentlab/publisher" className="text-xs text-[#00C2FF] hover:underline">
                View Publisher →
              </Link>
            </div>
            <div className="space-y-3">
              {recentAssets.map((asset, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-[#0F0F0F] rounded-xl border border-[#1E1E1E]">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 bg-[#1A1A1A]">
                    {asset.type === 'SEO Image' && <Image size={15} className="text-[#00C2FF]" />}
                    {asset.type === 'Thumbnail' && <Youtube size={15} className="text-[#FF3B3B]" />}
                    {asset.type === 'Post' && <Share2 size={15} className="text-[#7B2EFF]" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-white truncate">{asset.title}</p>
                    <p className="text-[10px] text-[#555]">{asset.type} · {asset.platform} · {asset.time}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full flex-shrink-0 ${
                    asset.status === 'Published' || asset.status === 'Live'
                      ? 'bg-[#00FF9C18] text-[#00FF9C]'
                      : 'bg-[#1E1E1E] text-[#888]'
                  }`}>
                    {asset.status}
                  </span>
                </div>
              ))}
            </div>

            {/* Quick actions */}
            <div className="mt-4 pt-3 border-t border-[#1E1E1E] flex flex-wrap gap-2">
              {modules.map((mod) => (
                <Link key={mod.title} href={mod.href}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                  style={{ backgroundColor: `${mod.color}12`, color: mod.color }}>
                  <mod.icon size={11} />
                  {mod.title.split(' ')[0]}
                </Link>
              ))}
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
