'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/ui/DashboardLayout';
import {
  TrendingUp, Zap, DollarSign, ArrowUp,
  MapPin, Brain, ExternalLink, Calendar, Send,
  Eye, Flame, Search, Loader2, BarChart2, Youtube,
  MessageSquare, RefreshCw
} from 'lucide-react';
import { momentumData, quickStats, recentActivity } from '@/data/mockData';

const MomentumGauge = ({ score, change }: { score: number; change: number }) => {
  const c = 2 * Math.PI * 45;
  return (
    <div className="relative w-28 h-28">
      <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" stroke="rgba(255,255,255,0.08)" strokeWidth="8" fill="transparent" />
        <circle cx="50" cy="50" r="45" stroke="url(#gG)" strokeWidth="8" fill="transparent"
          strokeDasharray={c} strokeDashoffset={c - (score / 100) * c} strokeLinecap="round" />
        <defs>
          <linearGradient id="gG" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00C2FF" /><stop offset="100%" stopColor="#7B2EFF" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-2xl font-bold text-white">{score}</div>
        <div className="text-xs text-[#00FF9C] flex items-center gap-0.5"><ArrowUp size={11} />+{change}</div>
      </div>
    </div>
  );
};

type ScanResult = { platform: 'YouTube' | 'Reddit' | 'TikTok'; title: string; views: string; match: number; rank: number; };

const mockResults: ScanResult[] = [
  { platform: 'YouTube', title: 'How __INDUSTRY__ Is Changing in 2026', views: '2.4M', match: 91, rank: 1 },
  { platform: 'TikTok', title: 'Insider secrets nobody in __INDUSTRY__ talks about', views: '8.1M', match: 87, rank: 2 },
  { platform: 'Reddit', title: 'What actually moves the needle in __INDUSTRY__', views: '247K', match: 82, rank: 3 },
  { platform: 'YouTube', title: 'I tried the top __INDUSTRY__ strategy for 30 days', views: '1.8M', match: 78, rank: 4 },
  { platform: 'TikTok', title: 'POV: Running a real __INDUSTRY__ business in 2026', views: '5.3M', match: 74, rank: 5 },
];

const TrendScanner = () => {
  const [industry, setIndustry] = useState('');
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [results, setResults] = useState<ScanResult[]>([]);

  const scan = () => {
    if (!industry.trim()) return;
    setScanning(true); setScanned(false);
    setTimeout(() => {
      setResults(mockResults.map(r => ({ ...r, title: r.title.split('__INDUSTRY__').join(industry) })));
      setScanning(false); setScanned(true);
    }, 2200);
  };

  const PlatformTag = ({ p }: { p: string }) => {
    if (p === 'YouTube') return <><Youtube size={10} className="text-[#FF3B3B]" /><span className="text-[10px] text-[#555]">YouTube</span></>;
    if (p === 'TikTok') return <><span className="text-[10px]">♪</span><span className="text-[10px] text-[#555]">TikTok</span></>;
    return <><MessageSquare size={10} className="text-[#FF6314]" /><span className="text-[10px] text-[#555]">Reddit</span></>;
  };

  return (
    <div className="bg-[#141414] border border-[#2A2A2A] rounded-2xl p-4 sm:p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Flame size={17} className="text-[#FF3B3B]" />
          <h2 className="text-base font-bold text-white">Trending in Your Industry</h2>
          <span className="hidden sm:inline text-[10px] px-2 py-0.5 rounded-full bg-[#FF3B3B18] text-[#FF3B3B] font-semibold">Reddit · YouTube · TikTok</span>
        </div>
        {scanned && <button onClick={() => { setScanned(false); setResults([]); setIndustry(''); }} className="flex items-center gap-1 text-[10px] text-[#555] hover:text-[#888]"><RefreshCw size={10} /> Reset</button>}
      </div>

      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555] pointer-events-none" />
          <input type="text" value={industry} onChange={e => setIndustry(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && scan()}
            placeholder="Type your industry — e.g. Fitness, Streetwear, Food & Bev, Real Estate..."
            className="w-full bg-[#0A0A0A] border border-[#2A2A2A] text-white rounded-xl pl-9 pr-4 py-2.5 text-sm placeholder-[#3A3A3A] focus:outline-none focus:border-[#00C2FF] transition-colors" />
        </div>
        <button onClick={scan} disabled={!industry.trim() || scanning}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold text-black bg-[#00C2FF] hover:bg-[#00AADD] transition-all disabled:opacity-40 flex-shrink-0">
          {scanning ? <Loader2 size={13} className="animate-spin" /> : <Search size={13} />}
          {scanning ? 'Scanning...' : 'Scan'}
        </button>
      </div>

      {scanning && (
        <div className="flex items-center gap-3 p-3 bg-[#0A0A0A] rounded-xl border border-[#1E1E1E]">
          <Loader2 size={15} className="text-[#00C2FF] animate-spin flex-shrink-0" />
          <div>
            <p className="text-sm text-white font-medium">AI scanning Reddit, YouTube & TikTok...</p>
            <p className="text-xs text-[#555]">Identifying top trending content for: <span className="text-[#00C2FF]">{industry}</span></p>
          </div>
        </div>
      )}

      {scanned && results.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-2">
            {results.map(r => (
              <div key={r.rank} className="flex items-center gap-3 p-2.5 bg-[#0A0A0A] rounded-xl border border-[#1A1A1A] hover:border-[#2A2A2A] transition-colors">
                <div className="w-7 h-7 rounded-lg bg-[#1A1A1A] flex items-center justify-center flex-shrink-0">
                  <span className="text-[10px] font-extrabold text-[#666]">#{r.rank}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white truncate">{r.title}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <PlatformTag p={r.platform} />
                    <span className="text-[10px] text-[#2A2A2A]">·</span>
                    <Eye size={9} className="text-[#555]" /><span className="text-[10px] text-[#555]">{r.views}</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="text-xs font-bold text-[#00C2FF]">{r.match}%</span>
                  <p className="text-[9px] text-[#444]">match</p>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-[#0A0A0A] border border-[#7B2EFF33] rounded-xl p-3 self-start">
            <div className="flex items-center gap-2 mb-3">
              <BarChart2 size={13} className="text-[#7B2EFF]" />
              <span className="text-xs font-bold text-white">Your Content vs Trends</span>
            </div>
            {[{ label: 'Trending Avg', val: 74, color: '#00C2FF' }, { label: 'Your Brand', val: 61, color: '#7B2EFF' }].map(m => (
              <div key={m.label} className="mb-2">
                <div className="flex justify-between mb-1">
                  <p className="text-[10px] text-[#555]">{m.label}</p>
                  <span className="text-[10px] font-bold" style={{ color: m.color }}>{m.val}</span>
                </div>
                <div className="h-1.5 bg-[#1E1E1E] rounded-full">
                  <div className="h-full rounded-full transition-all" style={{ width: `${m.val}%`, backgroundColor: m.color }} />
                </div>
              </div>
            ))}
            <p className="text-[10px] text-[#C9A86A] leading-relaxed mt-2">⚡ Post frequency is 3× lower than the trending average in your niche</p>
          </div>
        </div>
      )}

      {!scanning && !scanned && (
        <div className="text-center py-5">
          <Search size={26} className="text-[#222] mx-auto mb-2" />
          <p className="text-xs text-[#444]">Enter your industry to surface top 5 trending content</p>
          <p className="text-[10px] text-[#333] mt-1">AI benchmarks your brand media against viral data</p>
        </div>
      )}
    </div>
  );
};

const ActivityCard = ({ activity }: { activity: any }) => (
  <div className={`bg-[#141414]/80 rounded-lg p-3 border-l-4 ${activity.impact === 'High' ? 'border-l-[#00FF9C]' : activity.impact === 'Medium' ? 'border-l-[#00C2FF]' : 'border-l-[#A0A0A0]'}`}>
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0 flex-1">
        <h4 className="font-medium text-white text-sm truncate">{activity.title}</h4>
        <p className="text-xs text-[#A0A0A0] mt-0.5 leading-relaxed">{activity.description}</p>
        <span className="text-xs text-[#555] mt-0.5 block">{activity.time}</span>
      </div>
      <span className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${activity.impact === 'High' ? 'bg-[#00FF9C]/20 text-[#00FF9C]' : activity.impact === 'Medium' ? 'bg-[#00C2FF]/20 text-[#00C2FF]' : 'bg-[#A0A0A0]/20 text-[#A0A0A0]'}`}>{activity.impact}</span>
    </div>
  </div>
);

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
        <TrendScanner />

        <div className="gradient-border-card hero-mesh">
          <div className="bg-[#0A0A0A]/90 rounded-lg p-4 sm:p-5 relative noise-overlay">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 min-w-0 mr-3">
                <h2 className="text-lg sm:text-2xl font-bold text-white mb-1 gradient-text accent-cyan">CURRENT MOMENTUM</h2>
                <p className="text-sm text-[#A0A0A0]">Trending in <span className="text-[#00C2FF] font-semibold">{momentumData.emergingMarkets} emerging markets</span> — <span className="text-[#7B2EFF] font-semibold">cross-platform intelligence active</span>.</p>
              </div>
              <Brain className="w-6 h-6 text-[#C9A86A] flex-shrink-0" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="flex flex-col items-center">
                <MomentumGauge score={momentumData.score} change={momentumData.change} />
                <div className="mt-2 text-center"><div className="text-sm font-bold text-white">Momentum</div><div className="text-xs text-[#A0A0A0]">Real-time</div></div>
              </div>
              <div className="bg-[#141414]/80 border-t-2 border-t-[#00C2FF] rounded-lg p-3 card-glow">
                <div className="flex items-center justify-between mb-2"><MapPin className="w-4 h-4 text-[#00C2FF]" /><span className="text-[10px] bg-[#00FF9C]/20 text-[#00FF9C] px-1.5 py-0.5 rounded-full">Active</span></div>
                <div className="text-base font-bold text-white">{momentumData.topRegion}</div>
                <div className="text-[#A0A0A0] text-xs">Top Region</div>
                <div className="text-[#00C2FF] text-xs font-medium mt-1 flex items-center gap-1"><ArrowUp className="w-3 h-3" /> Early Surge</div>
              </div>
              <div className="bg-[#141414]/80 border-t-2 border-t-[#00FF9C] rounded-lg p-3 card-glow">
                <div className="flex items-center justify-between mb-2"><TrendingUp className="w-4 h-4 text-[#00FF9C]" /><div className="w-2 h-2 bg-[#00FF9C] rounded-full animate-pulse" /></div>
                <div className="text-base font-bold text-white">{momentumData.direction}</div>
                <div className="text-[#A0A0A0] text-xs">Trend Direction</div>
                <div className="text-[#00FF9C] text-xs font-medium mt-1">+152% growth</div>
              </div>
              <div className="ai-insight-card rounded-lg p-3">
                <div className="flex items-center mb-2"><Brain className="w-4 h-4 text-[#7B2EFF] mr-1.5" /><span className="text-[10px] text-[#7B2EFF] font-medium tracking-wide">AI INSIGHT</span></div>
                <p className="text-xs text-white leading-relaxed">Brand is gaining in 3 adjacent markets. Window for geo-push is open — act within 48 hours.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="bg-[#141414]/80 border border-[#2A2A2A] rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2"><TrendingUp className="w-4 h-4 text-[#00FF9C]" /><h3 className="text-sm font-bold text-white">Street Buzz</h3></div>
              <button className="text-[#00FF9C] text-xs hover:underline">View All</button>
            </div>
            <div className="space-y-1.5">
              {['Los Angeles, CA', 'Atlanta, GA', 'New York, NY', 'Houston, TX', 'Chicago, IL'].map((city, i) => (
                <div key={city} className="flex items-center justify-between"><span className="text-xs text-white">#{i + 1} {city}</span><div className="w-2 h-2 rounded-full bg-[#00FF9C] animate-pulse" /></div>
              ))}
            </div>
          </div>
          <div className="bg-[#141414]/80 border border-[#2A2A2A] rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-[#FFB800]" /><h3 className="text-sm font-bold text-white">Upcoming Events</h3></div>
              <button className="text-[#FFB800] text-xs hover:underline">View All</button>
            </div>
            <div className="space-y-2">
              {[{ name: 'Brand Pop-Up — DTLA', date: 'Apr 22', venue: 'Arts District' }, { name: 'Industry Mixer', date: 'Apr 28', venue: 'West Hollywood' }].map((e, i) => (
                <div key={i} className="bg-[#1E1E1E] rounded-lg p-2.5"><div className="font-medium text-white text-xs">{e.name}</div><div className="text-[10px] text-[#A0A0A0] mt-0.5">{e.date} · {e.venue}</div></div>
              ))}
            </div>
          </div>
          <div className="bg-[#141414]/80 border border-[#2A2A2A] rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2"><Send className="w-4 h-4 text-[#00C2FF]" /><h3 className="text-sm font-bold text-white">Submissions</h3></div>
              <button className="text-[#00C2FF] text-xs hover:underline">View All</button>
            </div>
            <div className="space-y-2">
              {[{ label: 'Pending', val: 4, color: '#FFB800' }, { label: 'Accepted', val: 7, color: '#00FF9C' }, { label: 'Published', val: 1, color: '#7B2EFF' }].map(s => (
                <div key={s.label} className="flex items-center justify-between"><span className="text-xs" style={{ color: s.color }}>{s.label}</span><span className="text-sm font-bold text-white">{s.val}</span></div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quickStats.map((stat, i) => (
            <div key={i} className="bg-[#141414]/80 border-t-2 border-t-[#00C2FF] rounded-lg p-3 card-glow noise-overlay relative">
              <div className="text-lg sm:text-2xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-[#A0A0A0] text-xs mb-1 leading-tight">{stat.label}</div>
              <div className="text-[#00C2FF] text-xs font-medium">{stat.change}</div>
            </div>
          ))}
        </div>

        <div className="section-divider" />

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white gradient-text">Recent Activity</h3>
            <button className="text-[#00C2FF] text-xs font-medium hover:text-[#7B2EFF] transition-colors">View All</button>
          </div>
          <div className="space-y-2">{recentActivity.map((a) => <ActivityCard key={a.id} activity={a} />)}</div>
        </div>

        <div className="section-divider purple" />

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: TrendingUp, label: 'View Pulse', sub: 'Cultural signals', color: '#00FF9C' },
            { icon: MapPin, label: 'Geo Campaign', sub: 'Targeted push', color: '#C9A86A' },
            { icon: DollarSign, label: 'Revenue', sub: '$4.5K activity', color: '#FFB800', alert: true },
            { icon: Zap, label: 'Run Strategy', sub: 'AI recommendations', color: '#00C2FF', gradient: true },
          ].map((action, i) => (
            <button key={i} className={`${action.gradient ? 'btn-gradient' : 'bg-[#141414]/80 hover:bg-[#0A0A0A] border border-[#2A2A2A]'} rounded-xl p-3 text-left transition-all group`}>
              <div className="flex items-center justify-between mb-2">
                <action.icon className="w-5 h-5 group-hover:scale-110 transition-transform" style={{ color: action.color }} />
                {action.alert ? <span className="w-2 h-2 bg-[#FF3B3B] rounded-full animate-pulse" /> : <ExternalLink className="w-3 h-3 text-[#A0A0A0]" />}
              </div>
              <div className="text-white font-medium text-sm">{action.label}</div>
              <div className="text-xs mt-0.5" style={{ color: action.gradient ? 'rgba(255,255,255,0.7)' : '#A0A0A0' }}>{action.sub}</div>
            </button>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
