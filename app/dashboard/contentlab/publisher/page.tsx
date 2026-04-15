'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/ui/DashboardLayout';
import Link from 'next/link';
import {
  Share2, ChevronLeft, Clock, Send, CheckCircle, XCircle,
  Loader2, Image, Calendar, Zap, ExternalLink, Search,
  Hash, RefreshCw, Webhook, Layers, MessageSquare, Sparkles,
  TrendingUp, ChevronDown, ChevronUp, Info
} from 'lucide-react';

/* ─── Platform Config ─── */
const platforms = [
  { id: 'instagram', label: 'Instagram',  color: '#E1306C', connected: true,  followers: '284K' },
  { id: 'tiktok',   label: 'TikTok',     color: '#69C9D0', connected: true,  followers: '512K' },
  { id: 'twitter',  label: 'X (Twitter)', color: '#1DA1F2', connected: true,  followers: '98K' },
  { id: 'facebook', label: 'Facebook',   color: '#1877F2', connected: false, followers: null },
  { id: 'linkedin', label: 'LinkedIn',   color: '#0A66C2', connected: false, followers: null },
  { id: 'youtube',  label: 'YouTube',    color: '#FF0000', connected: true,  followers: '67K' },
];

/* ─── Post Frequency Tiers ─── */
const postTiers = [
  { plan: 'Starter', postsPerMonth: 10,  n8nFlows: 1,  autoReply: false, topicSearch: false, color: '#A0A0A0' },
  { plan: 'Growth',  postsPerMonth: 30,  n8nFlows: 5,  autoReply: true,  topicSearch: true,  color: '#00C2FF' },
  { plan: 'Pro',     postsPerMonth: 999, n8nFlows: 20, autoReply: true,  topicSearch: true,  color: '#7B2EFF' },
];

/* ─── Keyword Highlight Colors ─── */
const highlightColors = [
  { id: 'blue',  label: 'Blue',  hex: '#00C2FF', bg: '#00C2FF22' },
  { id: 'green', label: 'Green', hex: '#00FF9C', bg: '#00FF9C22' },
  { id: 'red',   label: 'Red',   hex: '#FF3B3B', bg: '#FF3B3B22' },
];

/* ─── Mock Captions ─── */
const mockCaptions: Record<string, string> = {
  instagram: `✨ Building something that matters — one move at a time.\n\nBehind every brand is a story worth telling. What's yours?\n\n#BrandBuilding #Entrepreneur #ContentCreator #SmallBusiness #SlapBox`,
  tiktok: `POV: You finally start treating your brand like the business it is 📲\n\nWhat's the one thing holding you back? Drop it below 👇\n\n#Entrepreneur #BrandGrowth #FYP #BusinessTips #ContentStrategy`,
  twitter: `Your content is your storefront. Make it count.\n\nBrand consistency = trust. Trust = conversions.\n\n#BrandStrategy #SmallBusiness #SlapBox`,
  facebook: `Every brand has a story — and the brands that win are the ones bold enough to share it consistently. We're here to help you do exactly that. Drop a comment and tell us what you're building.`,
  linkedin: `Excited to share our latest brand content initiative. Consistency and cultural relevance are the two biggest drivers of engagement in 2025. Here's how we're approaching it — would love your thoughts.`,
  youtube: `New Community Post: Thank you for the support — we're focused on delivering content that actually moves the needle for your brand. More drops incoming. Stay locked in. 🙏`,
};

/* ─── Mock Trending Topics ─── */
const mockTopics: Record<string, { tag: string; platform: string; volume: string; relevance: number }[]> = {
  instagram: [
    { tag: '#SmallBusinessOwner', platform: 'Instagram', volume: '2.4M posts', relevance: 94 },
    { tag: '#EntrepreneurMindset', platform: 'Instagram', volume: '1.8M posts', relevance: 88 },
    { tag: '#BrandingTips', platform: 'Instagram', volume: '980K posts', relevance: 82 },
  ],
  tiktok: [
    { tag: '#BusinessTok', platform: 'TikTok', volume: '4.1B views', relevance: 91 },
    { tag: '#HustleCulture', platform: 'TikTok', volume: '2.6B views', relevance: 85 },
    { tag: '#ContentCreatorLife', platform: 'TikTok', volume: '1.9B views', relevance: 79 },
  ],
  twitter: [
    { tag: '#BuildInPublic', platform: 'X', volume: '320K tweets', relevance: 90 },
    { tag: '#StartupLife', platform: 'X', volume: '280K tweets', relevance: 83 },
    { tag: '#ContentMarketing', platform: 'X', volume: '190K tweets', relevance: 76 },
  ],
};

type PublishStatus = 'idle' | 'publishing' | 'live' | 'failed';

/* ─── Keyword Highlight Preview ─── */
function HighlightedCaption({ text, keywords, color }: { text: string; keywords: string[]; color: typeof highlightColors[0] }) {
  if (!keywords.length) return <p className="text-sm text-white whitespace-pre-wrap">{text}</p>;

  const parts: { text: string; highlighted: boolean }[] = [];
  let remaining = text;
  const pattern = new RegExp(`(${keywords.filter(Boolean).map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');

  const split = remaining.split(pattern);
  for (const part of split) {
    const isHighlighted = keywords.some(k => k && part.toLowerCase() === k.toLowerCase());
    parts.push({ text: part, highlighted: isHighlighted });
  }

  return (
    <p className="text-sm text-white whitespace-pre-wrap leading-relaxed">
      {parts.map((p, i) =>
        p.highlighted ? (
          <mark key={i} className="rounded px-0.5 font-semibold"
            style={{ backgroundColor: color.bg, color: color.hex }}>
            {p.text}
          </mark>
        ) : p.text
      )}
    </p>
  );
}

export default function PublisherPage() {
  const currentPlan = postTiers[1]; // Growth — change to index 0 or 2 for other plans
  const postsUsed = 14;

  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['instagram', 'twitter']);
  const [activeTab, setActiveTab]             = useState('instagram');
  const [captions, setCaptions]               = useState(mockCaptions);
  const [scheduleMode, setScheduleMode]       = useState<'now' | 'schedule'>('now');
  const [scheduleTime, setScheduleTime]       = useState('');
  const [status, setStatus]                   = useState<PublishStatus>('idle');
  const [results, setResults]                 = useState<{ platform: string; status: 'live' | 'failed'; url?: string }[]>([]);

  // Keyword highlight state
  const [keywords, setKeywords]         = useState('');
  const [highlightColor, setHighlightColor] = useState(highlightColors[0]);
  const [showPreview, setShowPreview]   = useState(false);

  // N8N automation
  const [n8nEnabled, setN8nEnabled]     = useState(false);
  const [n8nWebhook, setN8nWebhook]     = useState('');
  const [n8nTriggered, setN8nTriggered] = useState(false);
  const [n8nExpanded, setN8nExpanded]   = useState(false);

  // Topic search
  const [topicQuery, setTopicQuery]         = useState('');
  const [topicSearching, setTopicSearching] = useState(false);
  const [topicResults, setTopicResults]     = useState<typeof mockTopics['instagram']>([]);
  const [topicSearched, setTopicSearched]   = useState(false);

  // Auto-reply
  const [autoReply, setAutoReply] = useState(false);

  const keywordList = keywords.split(',').map(k => k.trim()).filter(Boolean);

  const togglePlatform = (id: string) => {
    const p = platforms.find(p => p.id === id);
    if (!p?.connected) return;
    setSelectedPlatforms(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
    if (!selectedPlatforms.includes(id)) setActiveTab(id);
  };

  const handleTopicSearch = () => {
    if (!topicQuery.trim()) return;
    setTopicSearching(true);
    setTimeout(() => {
      const topics = mockTopics[activeTab] ?? mockTopics['instagram'];
      setTopicResults(topics);
      setTopicSearched(true);
      setTopicSearching(false);
    }, 1400);
  };

  const injectTopic = (tag: string) => {
    setCaptions(prev => ({
      ...prev,
      [activeTab]: prev[activeTab] + `\n${tag}`,
    }));
  };

  const triggerN8N = async () => {
    if (!n8nWebhook) return;
    setN8nTriggered(false);
    try {
      await fetch(n8nWebhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platforms: selectedPlatforms, captions, keywords: keywordList, highlightColor: highlightColor.id, scheduledAt: scheduleTime || 'now' }),
      });
    } catch { /* webhook may be cors-blocked in browser, that's OK */ }
    setN8nTriggered(true);
  };

  const handlePublish = () => {
    setStatus('publishing');
    setResults([]);
    const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
    (async () => {
      if (n8nEnabled && n8nWebhook) triggerN8N();
      for (const pid of selectedPlatforms) {
        await delay(900);
        setResults(prev => [...prev, {
          platform: pid,
          status: Math.random() > 0.1 ? 'live' : 'failed',
          url: `https://${pid}.com/p/mock123`,
        }]);
      }
      setStatus('live');
    })();
  };

  const activeCaptions = selectedPlatforms.filter(p => platforms.find(pl => pl.id === p)?.connected);
  const postLimitReached = currentPlan.postsPerMonth !== 999 && postsUsed >= currentPlan.postsPerMonth;

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 space-y-5 max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-3">
          <Link href="/dashboard/contentlab" className="p-2 rounded-lg text-[#888] hover:text-white hover:bg-[#141414] transition-all">
            <ChevronLeft size={18} />
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Share2 size={16} className="text-[#7B2EFF]" />
              <h1 className="text-lg sm:text-xl font-extrabold text-white">Social Publisher</h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#7B2EFF18] text-[#7B2EFF]">6 Platforms</span>
            </div>
            <p className="text-xs text-[#666] mt-0.5">Publish with keyword highlights, N8N automation, and AI-tailored captions</p>
          </div>
          {/* Plan badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#2A2A2A] bg-[#141414]">
            <Layers size={12} style={{ color: currentPlan.color }} />
            <span className="text-xs font-bold" style={{ color: currentPlan.color }}>{currentPlan.plan}</span>
            <span className="text-[10px] text-[#555]">
              {currentPlan.postsPerMonth === 999 ? '∞' : `${postsUsed}/${currentPlan.postsPerMonth}`} posts
            </span>
          </div>
        </div>

        {/* Post limit warning */}
        {postLimitReached && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#FF3B3B11] border border-[#FF3B3B33] text-[#FF3B3B] text-xs font-medium">
            <Info size={13} />
            You&apos;ve reached your {currentPlan.postsPerMonth} post/month limit on the {currentPlan.plan} plan.
            <Link href="/dashboard/connect" className="ml-auto font-bold hover:underline">Upgrade →</Link>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* ─── Left Column ─── */}
          <div className="space-y-4">

            {/* Asset Preview */}
            <div className="bg-[#141414] border border-[#2A2A2A] rounded-2xl p-4">
              <h3 className="text-xs font-bold text-[#888] uppercase tracking-wider mb-3">Asset</h3>
              <div className="aspect-video rounded-xl overflow-hidden relative flex items-center justify-center border border-[#1E1E1E]"
                style={{ background: 'linear-gradient(135deg, #0d1b2a, #1a0533)' }}>
                <div className="text-center px-4">
                  <p className="text-xs text-[#00C2FF] font-semibold uppercase tracking-widest mb-1">Brand</p>
                  <p className="text-base font-extrabold text-white">Content Drop</p>
                  <p className="text-xs text-[#7B2EFF] mt-1">Scheduled · Multi-Platform</p>
                </div>
                {keywordList.length > 0 && (
                  <div className="absolute bottom-2 left-2 flex flex-wrap gap-1 max-w-[80%]">
                    {keywordList.slice(0, 3).map(k => (
                      <span key={k} className="text-[9px] font-bold px-1.5 py-0.5 rounded"
                        style={{ backgroundColor: highlightColor.bg, color: highlightColor.hex }}>
                        {k}
                      </span>
                    ))}
                  </div>
                )}
                <div className="absolute bottom-2 right-2 text-[9px] text-white/20 font-mono">ASSET</div>
              </div>
              <button className="mt-2 w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs text-[#888] border border-dashed border-[#2A2A2A] hover:border-[#444] hover:text-white transition-all">
                <Image size={12} /> Replace Asset
              </button>
            </div>

            {/* Platform toggles */}
            <div className="bg-[#141414] border border-[#2A2A2A] rounded-2xl p-4">
              <h3 className="text-xs font-bold text-[#888] uppercase tracking-wider mb-3">Platforms</h3>
              <div className="space-y-2">
                {platforms.map(p => (
                  <button key={p.id} onClick={() => togglePlatform(p.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all ${
                      !p.connected ? 'opacity-40 cursor-not-allowed border-[#1E1E1E]' :
                      selectedPlatforms.includes(p.id) ? 'border-transparent' : 'border-[#1E1E1E] hover:border-[#2A2A2A]'
                    }`}
                    style={selectedPlatforms.includes(p.id) && p.connected
                      ? { backgroundColor: `${p.color}18`, borderColor: `${p.color}44` }
                      : {}}>
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: p.color }} />
                    <span className="text-xs font-semibold text-white flex-1 text-left">{p.label}</span>
                    {p.connected ? (
                      <div className="flex items-center gap-1.5">
                        {p.followers && <span className="text-[10px] text-[#555]">{p.followers}</span>}
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                          selectedPlatforms.includes(p.id) ? 'border-white bg-white' : 'border-[#333]'
                        }`}>
                          {selectedPlatforms.includes(p.id) && <div className="w-2 h-2 rounded-full bg-black" />}
                        </div>
                      </div>
                    ) : (
                      <Link href="/dashboard/connect" onClick={e => e.stopPropagation()}
                        className="text-[10px] text-[#7B2EFF] hover:underline">Connect</Link>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Schedule */}
            <div className="bg-[#141414] border border-[#2A2A2A] rounded-2xl p-4">
              <h3 className="text-xs font-bold text-[#888] uppercase tracking-wider mb-3">When to Post</h3>
              <div className="flex gap-2 mb-3">
                {(['now', 'schedule'] as const).map(m => (
                  <button key={m} onClick={() => setScheduleMode(m)}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                      scheduleMode === m ? 'bg-[#7B2EFF] text-white' : 'bg-[#1A1A1A] text-[#666] hover:text-white'
                    }`}>
                    {m === 'now' ? <><Zap size={10} className="inline mr-1" />Now</> : <><Calendar size={10} className="inline mr-1" />Schedule</>}
                  </button>
                ))}
              </div>
              {scheduleMode === 'schedule' && (
                <input type="datetime-local" value={scheduleTime} onChange={e => setScheduleTime(e.target.value)}
                  className="w-full bg-[#0F0F0F] border border-[#2A2A2A] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#7B2EFF] transition-colors" />
              )}
              {/* Post frequency meter */}
              <div className="mt-3 pt-3 border-t border-[#1E1E1E]">
                <div className="flex justify-between mb-1">
                  <span className="text-[10px] text-[#555]">Monthly posts used</span>
                  <span className="text-[10px] font-bold" style={{ color: currentPlan.color }}>
                    {postsUsed} / {currentPlan.postsPerMonth === 999 ? '∞' : currentPlan.postsPerMonth}
                  </span>
                </div>
                <div className="h-1 bg-[#1E1E1E] rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all"
                    style={{
                      width: `${currentPlan.postsPerMonth === 999 ? 30 : Math.min((postsUsed / currentPlan.postsPerMonth) * 100, 100)}%`,
                      backgroundColor: currentPlan.color,
                    }} />
                </div>
              </div>
            </div>

            {/* Publish button */}
            <button onClick={handlePublish}
              disabled={selectedPlatforms.length === 0 || status === 'publishing' || postLimitReached}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#7B2EFF] to-[#00C2FF] hover:opacity-90 transition-all disabled:opacity-40">
              {status === 'publishing' ? (
                <><Loader2 size={15} className="animate-spin" /> Publishing...</>
              ) : scheduleMode === 'schedule' ? (
                <><Clock size={15} /> Schedule Post</>
              ) : (
                <><Send size={15} /> Publish Now</>
              )}
            </button>
          </div>

          {/* ─── Right Column ─── */}
          <div className="lg:col-span-2 space-y-4">

            {/* Keyword Highlight */}
            <div className="bg-[#141414] border border-[#2A2A2A] rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Hash size={14} className="text-[#FFB800]" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">Keyword Highlights</h3>
                </div>
                <button onClick={() => setShowPreview(v => !v)}
                  className="text-[10px] text-[#00C2FF] hover:underline flex items-center gap-1">
                  {showPreview ? 'Hide preview' : 'Preview caption'} {showPreview ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
                </button>
              </div>
              <div className="flex gap-2 mb-3">
                <input
                  value={keywords}
                  onChange={e => setKeywords(e.target.value)}
                  placeholder="brand, growth, culture (comma-separated)"
                  className="flex-1 bg-[#0F0F0F] border border-[#2A2A2A] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FFB800] transition-colors"
                />
              </div>
              <div className="flex gap-2">
                {highlightColors.map(c => (
                  <button key={c.id} onClick={() => setHighlightColor(c)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold border transition-all ${
                      highlightColor.id === c.id ? 'border-transparent' : 'border-[#1E1E1E] text-[#666] hover:text-white'
                    }`}
                    style={highlightColor.id === c.id ? { backgroundColor: c.bg, color: c.hex, borderColor: `${c.hex}44` } : {}}>
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.hex }} />
                    {c.label}
                  </button>
                ))}
              </div>
              {showPreview && keywordList.length > 0 && activeCaptions.includes(activeTab) && (
                <div className="mt-3 p-3 bg-[#0F0F0F] rounded-xl border border-[#1E1E1E]">
                  <p className="text-[10px] text-[#555] mb-2 uppercase tracking-wider">Caption preview · {platforms.find(p => p.id === activeTab)?.label}</p>
                  <HighlightedCaption text={captions[activeTab] ?? ''} keywords={keywordList} color={highlightColor} />
                </div>
              )}
            </div>

            {/* Topic Search */}
            {currentPlan.topicSearch && (
              <div className="bg-[#141414] border border-[#2A2A2A] rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp size={14} className="text-[#00FF9C]" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">Trending Topic Search</h3>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#00FF9C18] text-[#00FF9C] font-bold">AI</span>
                </div>
                <div className="flex gap-2 mb-3">
                  <input
                    value={topicQuery}
                    onChange={e => setTopicQuery(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleTopicSearch()}
                    placeholder={`Search relevant topics for ${platforms.find(p => p.id === activeTab)?.label ?? 'platform'}…`}
                    className="flex-1 bg-[#0F0F0F] border border-[#2A2A2A] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00FF9C] transition-colors"
                  />
                  <button onClick={handleTopicSearch} disabled={topicSearching}
                    className="px-3 py-2 rounded-xl bg-[#00FF9C18] text-[#00FF9C] hover:bg-[#00FF9C30] transition-all disabled:opacity-40">
                    {topicSearching ? <Loader2 size={13} className="animate-spin" /> : <Search size={13} />}
                  </button>
                </div>
                {topicSearched && topicResults.length > 0 && (
                  <div className="space-y-2">
                    {topicResults.map(t => (
                      <div key={t.tag} className="flex items-center gap-3 p-2.5 bg-[#0F0F0F] rounded-xl border border-[#1E1E1E]">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-white">{t.tag}</p>
                          <p className="text-[10px] text-[#555]">{t.platform} · {t.volume}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-1 bg-[#1E1E1E] rounded-full overflow-hidden">
                            <div className="h-full bg-[#00FF9C] rounded-full" style={{ width: `${t.relevance}%` }} />
                          </div>
                          <span className="text-[10px] font-bold text-[#00FF9C]">{t.relevance}%</span>
                          <button onClick={() => injectTopic(t.tag)}
                            className="px-2 py-1 rounded-lg text-[10px] font-bold text-[#00FF9C] bg-[#00FF9C12] hover:bg-[#00FF9C22] transition-all">
                            Add
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Caption Editor */}
            <div className="bg-[#141414] border border-[#2A2A2A] rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-[#888] uppercase tracking-wider">Per-Platform Captions</h3>
                <div className="flex items-center gap-2">
                  {currentPlan.autoReply && (
                    <button onClick={() => setAutoReply(v => !v)}
                      className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-bold border transition-all ${
                        autoReply ? 'bg-[#00C2FF18] text-[#00C2FF] border-[#00C2FF44]' : 'text-[#555] border-[#1E1E1E] hover:text-white'
                      }`}>
                      <MessageSquare size={10} />
                      Auto-Reply {autoReply ? 'ON' : 'OFF'}
                    </button>
                  )}
                  <button className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-bold text-[#7B2EFF] bg-[#7B2EFF12] hover:bg-[#7B2EFF22] border border-[#7B2EFF33] transition-all">
                    <Sparkles size={10} /> Re-generate
                  </button>
                </div>
              </div>

              {activeCaptions.length === 0 ? (
                <p className="text-xs text-[#555] text-center py-6">Select at least one connected platform</p>
              ) : (
                <>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {activeCaptions.map(pid => {
                      const p = platforms.find(pl => pl.id === pid)!;
                      return (
                        <button key={pid} onClick={() => setActiveTab(pid)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            activeTab === pid ? 'text-white' : 'bg-[#1A1A1A] text-[#666] hover:text-white'
                          }`}
                          style={activeTab === pid ? { backgroundColor: `${p.color}33`, color: p.color } : {}}>
                          {p.label}
                        </button>
                      );
                    })}
                  </div>

                  {activeCaptions.includes(activeTab) && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: platforms.find(p => p.id === activeTab)?.color }} />
                          <span className="text-xs font-semibold text-[#888]">
                            {platforms.find(p => p.id === activeTab)?.label} Caption
                          </span>
                        </div>
                        <span className="text-[10px] text-[#555]">{captions[activeTab]?.length ?? 0} chars</span>
                      </div>
                      <textarea
                        value={captions[activeTab] ?? ''}
                        onChange={e => setCaptions(prev => ({ ...prev, [activeTab]: e.target.value }))}
                        rows={6}
                        className="w-full bg-[#0F0F0F] border border-[#2A2A2A] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#7B2EFF] transition-colors resize-none"
                      />
                      <div className="flex items-center justify-between mt-1.5">
                        <p className="text-[10px] text-[#444]">
                          AI-tailored for {platforms.find(p => p.id === activeTab)?.label}. Edit freely.
                        </p>
                        {autoReply && currentPlan.autoReply && (
                          <span className="text-[10px] text-[#00C2FF] font-semibold flex items-center gap-1">
                            <MessageSquare size={9} /> Auto-reply enabled for this platform
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* N8N Automation */}
            <div className="bg-[#141414] border border-[#2A2A2A] rounded-2xl overflow-hidden">
              <button
                onClick={() => setN8nExpanded(v => !v)}
                className="w-full flex items-center justify-between p-5 hover:bg-[#1A1A1A] transition-colors">
                <div className="flex items-center gap-2">
                  <Webhook size={14} className="text-[#FF3B3B]" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">N8N Automation</h3>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${n8nEnabled ? 'bg-[#00FF9C18] text-[#00FF9C]' : 'bg-[#1E1E1E] text-[#555]'}`}>
                    {n8nEnabled ? 'Active' : 'Off'}
                  </span>
                  {n8nTriggered && <CheckCircle size={12} className="text-[#00FF9C]" />}
                </div>
                {n8nExpanded ? <ChevronUp size={14} className="text-[#555]" /> : <ChevronDown size={14} className="text-[#555]" />}
              </button>

              {n8nExpanded && (
                <div className="px-5 pb-5 space-y-3 border-t border-[#1E1E1E]">
                  <div className="flex items-center justify-between pt-3">
                    <p className="text-xs text-[#888]">Trigger N8N workflow on every publish</p>
                    <button onClick={() => setN8nEnabled(v => !v)}
                      className={`relative w-10 h-5 rounded-full transition-all ${n8nEnabled ? 'bg-[#FF3B3B]' : 'bg-[#2A2A2A]'}`}>
                      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${n8nEnabled ? 'left-5' : 'left-0.5'}`} />
                    </button>
                  </div>
                  <div>
                    <label className="text-[10px] text-[#555] block mb-1">Webhook URL</label>
                    <input
                      value={n8nWebhook}
                      onChange={e => setN8nWebhook(e.target.value)}
                      placeholder="https://your-n8n-instance.com/webhook/..."
                      className="w-full bg-[#0F0F0F] border border-[#2A2A2A] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF3B3B] transition-colors font-mono"
                    />
                  </div>
                  <div className="text-[10px] text-[#444] bg-[#0A0A0A] rounded-lg p-3 border border-[#1A1A1A]">
                    <p className="text-[#666] font-semibold mb-1">Payload sent to N8N:</p>
                    <pre className="text-[#444] leading-relaxed">{JSON.stringify({ platforms: selectedPlatforms, keywords: keywordList, highlightColor: highlightColor.id, scheduledAt: scheduleMode === 'schedule' ? scheduleTime : 'now' }, null, 2)}</pre>
                  </div>
                  <button onClick={triggerN8N} disabled={!n8nWebhook}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#FF3B3B] hover:bg-[#FF3B3B]/80 transition-all disabled:opacity-40">
                    <RefreshCw size={12} /> Test Webhook
                  </button>
                  {n8nTriggered && (
                    <p className="text-[10px] text-[#00FF9C] flex items-center gap-1">
                      <CheckCircle size={10} /> Webhook triggered successfully
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Publish Status */}
            {(status === 'publishing' || status === 'live') && (
              <div className="bg-[#141414] border border-[#2A2A2A] rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  {status === 'publishing' && <Loader2 size={16} className="text-[#7B2EFF] animate-spin" />}
                  {status === 'live' && <CheckCircle size={16} className="text-[#00FF9C]" />}
                  <h3 className="text-sm font-bold text-white">
                    {status === 'publishing' ? 'Publishing...' : 'Post Live'}
                  </h3>
                </div>
                <div className="space-y-2">
                  {selectedPlatforms.map(pid => {
                    const p = platforms.find(pl => pl.id === pid)!;
                    const result = results.find(r => r.platform === pid);
                    return (
                      <div key={pid} className="flex items-center gap-3 p-3 bg-[#0F0F0F] rounded-xl border border-[#1E1E1E]">
                        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: p.color }} />
                        <span className="text-xs font-semibold text-white flex-1">{p.label}</span>
                        {!result ? (
                          <div className="flex items-center gap-1.5 text-[10px] text-[#555]">
                            <Loader2 size={10} className="animate-spin" /> Queued
                          </div>
                        ) : result.status === 'live' ? (
                          <div className="flex items-center gap-1.5">
                            <CheckCircle size={12} className="text-[#00FF9C]" />
                            <span className="text-[10px] text-[#00FF9C] font-semibold">Live</span>
                            <a href={result.url} target="_blank" rel="noopener noreferrer"
                              className="ml-1 text-[10px] text-[#555] hover:text-[#888]">
                              <ExternalLink size={10} />
                            </a>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <XCircle size={12} className="text-[#FF3B3B]" />
                            <span className="text-[10px] text-[#FF3B3B] font-semibold">Failed</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
