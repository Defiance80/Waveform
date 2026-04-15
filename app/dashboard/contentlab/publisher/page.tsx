'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/ui/DashboardLayout';
import Link from 'next/link';
import {
  Share2, ChevronLeft, Clock, Send, CheckCircle, XCircle,
  Loader2, Image, Calendar, Zap, ExternalLink
} from 'lucide-react';

const platforms = [
  { id: 'instagram', label: 'Instagram', color: '#E1306C', connected: true, followers: '284K' },
  { id: 'tiktok', label: 'TikTok', color: '#000000', border: '#ffffff22', connected: true, followers: '512K' },
  { id: 'twitter', label: 'X (Twitter)', color: '#1DA1F2', connected: true, followers: '98K' },
  { id: 'facebook', label: 'Facebook', color: '#1877F2', connected: false, followers: null },
  { id: 'linkedin', label: 'LinkedIn', color: '#0A66C2', connected: false, followers: null },
  { id: 'youtube', label: 'YouTube', color: '#FF0000', connected: true, followers: '67K' },
];

const mockCaptions: Record<string, string> = {
  instagram: `🔥 West Coast Sound is HERE. New drop that hits different — streets to the speakers.\n\n#WestCoastHipHop #NewMusic #SlapBox #StreetAnthems #LA #HipHop`,
  tiktok: `POV: You finally drop the album the streets have been waiting for 🎵\n\nWhat city is feeling this the most? Drop it below 👇\n\n#HipHop #NewDrop #WestCoast #FYP #StreetMusic`,
  twitter: `West Coast Sound is out. No cap, this one is for the culture.\n\n#NewMusic #WestCoastHipHop #SlapBox`,
  facebook: `New music just dropped and I need you to hear it. "West Coast Sound" is everything I've been building toward — raw, real, and straight from the streets. Stream it now and let me know what you think in the comments.`,
  linkedin: `Excited to announce my latest project: West Coast Sound. This release represents months of creative work and collaboration with some of the most talented artists in the industry. Available on all platforms now.`,
  youtube: `New Community Post: West Coast Sound is live on all platforms! The response from the community has been incredible. Thank you for the support — more content coming soon. 🙏`,
};

type PublishStatus = 'idle' | 'publishing' | 'live' | 'failed';

export default function PublisherPage() {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['instagram', 'twitter']);
  const [activeTab, setActiveTab] = useState('instagram');
  const [captions, setCaptions] = useState(mockCaptions);
  const [scheduleMode, setScheduleMode] = useState<'now' | 'schedule'>('now');
  const [scheduleTime, setScheduleTime] = useState('');
  const [status, setStatus] = useState<PublishStatus>('idle');
  const [results, setResults] = useState<{ platform: string; status: 'live' | 'failed'; url?: string }[]>([]);

  const togglePlatform = (id: string) => {
    const p = platforms.find(p => p.id === id);
    if (!p?.connected) return;
    setSelectedPlatforms(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
    if (!selectedPlatforms.includes(id)) setActiveTab(id);
  };

  const handlePublish = () => {
    setStatus('publishing');
    setResults([]);
    const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

    (async () => {
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

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 space-y-5 max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-3">
          <Link href="/dashboard/contentlab" className="p-2 rounded-lg text-[#888] hover:text-white hover:bg-[#141414] transition-all">
            <ChevronLeft size={18} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <Share2 size={16} className="text-[#7B2EFF]" />
              <h1 className="text-lg sm:text-xl font-extrabold text-white">Social Publisher</h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#7B2EFF18] text-[#7B2EFF]">6 Platforms</span>
            </div>
            <p className="text-xs text-[#666] mt-0.5">Publish with AI-tailored captions across every platform at once</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Left col */}
          <div className="space-y-4">

            {/* Asset Preview */}
            <div className="bg-[#141414] border border-[#2A2A2A] rounded-2xl p-4">
              <h3 className="text-xs font-bold text-[#888] uppercase tracking-wider mb-3">Asset</h3>
              <div className="aspect-video rounded-xl overflow-hidden relative flex items-center justify-center border border-[#1E1E1E]"
                style={{ background: 'linear-gradient(135deg, #0d1b2a, #1a0533)' }}>
                <div className="text-center px-4">
                  <p className="text-xs text-[#00C2FF] font-semibold uppercase tracking-widest mb-1">Music</p>
                  <p className="text-base font-extrabold text-white">West Coast Sound</p>
                  <p className="text-xs text-[#7B2EFF] mt-1">Street Anthems · LA Cipher</p>
                </div>
                <div className="absolute bottom-2 right-2 text-[9px] text-white/20 font-mono">SEO IMAGE</div>
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
                          {selectedPlatforms.includes(p.id) && (
                            <div className="w-2 h-2 rounded-full bg-black" />
                          )}
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
                {['now', 'schedule'].map(m => (
                  <button key={m} onClick={() => setScheduleMode(m as 'now' | 'schedule')}
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
            </div>

            <button onClick={handlePublish}
              disabled={selectedPlatforms.length === 0 || status === 'publishing'}
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

          {/* Right col: Captions + Status */}
          <div className="lg:col-span-2 space-y-4">

            {/* Caption Tabs */}
            <div className="bg-[#141414] border border-[#2A2A2A] rounded-2xl p-5">
              <h3 className="text-xs font-bold text-[#888] uppercase tracking-wider mb-3">Per-Platform Captions</h3>

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
                      <p className="text-[10px] text-[#444] mt-1.5">
                        AI-tailored for {platforms.find(p => p.id === activeTab)?.label}. Edit freely.
                      </p>
                    </div>
                  )}
                </>
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
