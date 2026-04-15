'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/ui/DashboardLayout';
import Link from 'next/link';
import {
  Image, Sparkles, ChevronLeft, RefreshCw, Send, Globe, Search,
  Check, Loader2, Info, TrendingUp, Zap
} from 'lucide-react';

const industries = [
  'Music', 'Fashion', 'Fitness', 'Food & Beverage', 'Real Estate',
  'Tech', 'Beauty', 'Sports', 'Entertainment', 'Finance', 'Automotive', 'Travel'
];

const imageStyles = [
  { id: 'cinematic', label: 'Cinematic', preview: 'bg-gradient-to-br from-[#1a1a2e] to-[#16213e]' },
  { id: 'bold', label: 'Bold Type', preview: 'bg-gradient-to-br from-[#0d0d0d] to-[#1a1a1a]' },
  { id: 'minimal', label: 'Minimal', preview: 'bg-gradient-to-br from-[#f5f5f5] to-[#e0e0e0]' },
  { id: 'neon', label: 'Neon', preview: 'bg-gradient-to-br from-[#000000] to-[#0a0020]' },
  { id: 'editorial', label: 'Editorial', preview: 'bg-gradient-to-br from-[#2d1b00] to-[#1a0f00]' },
];

const mockKeywords: Record<string, string[]> = {
  Music: [
    'West Coast Hip-Hop', 'Underground Sound', 'Street Anthems', 'LA Cipher',
    'Bars & Beats', 'New Era Rap', 'Culture Shift', 'Sound of the Streets',
    'Next Wave', 'Authentic Vibes'
  ],
  Fashion: [
    'Urban Streetwear', 'Culture-Driven Style', 'Street Aesthetic', 'LA Drip',
    'Authentic Fits', 'Limited Edition', 'Brand Identity', 'Style Authority',
    'Underground Fashion', 'Next Level Looks'
  ],
};

const mockPhrases: Record<string, string[]> = {
  Music: [
    '"Where the culture lives"',
    '"Built in the booth, stamped on the streets"',
    '"This ain\'t just music — it\'s a movement"',
  ],
  Fashion: [
    '"Style before the trend"',
    '"The streets set the standard"',
    '"Wear your culture with conviction"',
  ],
};

const aeoTips = [
  { tip: 'Add FAQ-style caption below your image', impact: 'High', icon: '❓' },
  { tip: 'Include city + genre in alt text', impact: 'High', icon: '📍' },
  { tip: 'Use conversational keyword phrases', impact: 'Med', icon: '💬' },
  { tip: 'Add "Who is [Artist]?" structured context', impact: 'High', icon: '🤖' },
];

type Step = 'configure' | 'keywords' | 'generate' | 'result';

export default function SEOImagesPage() {
  const [step, setStep] = useState<Step>('configure');
  const [industry, setIndustry] = useState('Music');
  const [topic, setTopic] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('cinematic');
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [selectedPhrase, setSelectedPhrase] = useState(0);
  const [loading, setLoading] = useState(false);
  const [caption, setCaption] = useState('');

  const keywords = mockKeywords[industry] ?? mockKeywords.Music;
  const phrases = mockPhrases[industry] ?? mockPhrases.Music;

  const toggleKeyword = (kw: string) => {
    setSelectedKeywords(prev =>
      prev.includes(kw) ? prev.filter(k => k !== kw) : [...prev, kw]
    );
  };

  const handleGenerateKeywords = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSelectedKeywords([keywords[0], keywords[1], keywords[2]]);
      setStep('keywords');
    }, 1800);
  };

  const handleGenerateImage = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setCaption(`${topic || 'New Drop'} — ${selectedKeywords.slice(0, 2).join(' · ')} · ${industry}`);
      setStep('result');
    }, 2800);
  };

  const handleRegen = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

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
              <Image size={16} className="text-[#00C2FF]" />
              <h1 className="text-lg sm:text-xl font-extrabold text-white">SEO Image Creator</h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#C9A86A18] text-[#C9A86A]">SEO + AEO</span>
            </div>
            <p className="text-xs text-[#666] mt-0.5">Generate keyword-rich visuals optimized for search and AI engines</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Left: Config Panel */}
          <div className="lg:col-span-2 space-y-4">

            {/* Step 1: Industry + Topic */}
            <div className="bg-[#141414] border border-[#2A2A2A] rounded-2xl p-5">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#00C2FF] text-[#000] text-[10px] font-extrabold flex items-center justify-center">1</span>
                Industry & Topic
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="text-xs text-[#888] mb-2 block">Industry</label>
                  <div className="flex flex-wrap gap-2">
                    {industries.map(ind => (
                      <button key={ind} onClick={() => setIndustry(ind)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          industry === ind
                            ? 'bg-[#00C2FF] text-black'
                            : 'bg-[#1A1A1A] text-[#888] hover:text-white border border-[#2A2A2A] hover:border-[#444]'
                        }`}>
                        {ind}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs text-[#888] mb-2 block">Campaign / Topic</label>
                  <input
                    type="text"
                    value={topic}
                    onChange={e => setTopic(e.target.value)}
                    placeholder="e.g. New Album Drop - West Coast Sound"
                    className="w-full bg-[#0F0F0F] border border-[#2A2A2A] rounded-xl px-4 py-2.5 text-sm text-white placeholder-[#555] focus:outline-none focus:border-[#00C2FF] transition-colors"
                  />
                </div>

                <button onClick={handleGenerateKeywords} disabled={loading}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-black bg-[#00C2FF] hover:bg-[#00AADD] transition-all disabled:opacity-60">
                  {loading && step === 'configure' ? (
                    <><Loader2 size={14} className="animate-spin" /> Generating Keywords...</>
                  ) : (
                    <><Sparkles size={14} /> Generate Keywords</>
                  )}
                </button>
              </div>
            </div>

            {/* Step 2: Keywords */}
            {(step === 'keywords' || step === 'generate' || step === 'result') && (
              <div className="bg-[#141414] border border-[#2A2A2A] rounded-2xl p-5">
                <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#7B2EFF] text-white text-[10px] font-extrabold flex items-center justify-center">2</span>
                  Select Keywords & Phrase
                </h3>

                <div>
                  <label className="text-xs text-[#888] mb-2 block">SEO Keywords <span className="text-[#555]">(select to highlight in image)</span></label>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {keywords.map(kw => (
                      <button key={kw} onClick={() => toggleKeyword(kw)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                          selectedKeywords.includes(kw)
                            ? 'bg-[#7B2EFF22] border-[#7B2EFF] text-[#7B2EFF]'
                            : 'bg-[#1A1A1A] border-[#2A2A2A] text-[#888] hover:text-white'
                        }`}>
                        {selectedKeywords.includes(kw) && <Check size={10} />}
                        {kw}
                      </button>
                    ))}
                  </div>

                  <label className="text-xs text-[#888] mb-2 block">Unique Phrases</label>
                  <div className="space-y-2">
                    {phrases.map((phrase, i) => (
                      <button key={i} onClick={() => setSelectedPhrase(i)}
                        className={`w-full text-left p-3 rounded-xl text-sm transition-all border ${
                          selectedPhrase === i
                            ? 'bg-[#00C2FF12] border-[#00C2FF44] text-white'
                            : 'bg-[#0F0F0F] border-[#1E1E1E] text-[#888] hover:text-white hover:border-[#333]'
                        }`}>
                        {phrase}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Style Picker */}
                <div className="mt-4">
                  <label className="text-xs text-[#888] mb-2 block">Visual Style</label>
                  <div className="flex gap-2 flex-wrap">
                    {imageStyles.map(style => (
                      <button key={style.id} onClick={() => setSelectedStyle(style.id)}
                        className={`flex flex-col items-center gap-1.5 transition-all`}>
                        <div className={`w-14 h-10 rounded-lg ${style.preview} border-2 transition-all ${
                          selectedStyle === style.id ? 'border-[#00C2FF]' : 'border-[#2A2A2A]'
                        }`} />
                        <span className={`text-[10px] font-semibold ${selectedStyle === style.id ? 'text-[#00C2FF]' : 'text-[#666]'}`}>
                          {style.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <button onClick={() => { setStep('generate'); handleGenerateImage(); }}
                  disabled={selectedKeywords.length === 0 || loading}
                  className="mt-4 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-black bg-gradient-to-r from-[#00C2FF] to-[#7B2EFF] hover:opacity-90 transition-all disabled:opacity-40">
                  {loading && step === 'generate' ? (
                    <><Loader2 size={14} className="animate-spin" /> Generating Image...</>
                  ) : (
                    <><Image size={14} /> Create Image</>
                  )}
                </button>
              </div>
            )}

            {/* Step 3: Result */}
            {step === 'result' && (
              <div className="bg-[#141414] border border-[#2A2A2A] rounded-2xl p-5">
                <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#00FF9C] text-black text-[10px] font-extrabold flex items-center justify-center">3</span>
                  Generated Image
                </h3>

                {/* Image Preview Mockup */}
                <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-[#2A2A2A] mb-4"
                  style={{ background: 'linear-gradient(135deg, #0d1b2a, #1a0533)' }}>
                  {loading ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                      <Loader2 size={28} className="text-[#00C2FF] animate-spin" />
                      <p className="text-xs text-[#888]">Building your SEO image...</p>
                      <div className="w-48 h-1 bg-[#1E1E1E] rounded-full overflow-hidden">
                        <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-[#00C2FF] to-[#7B2EFF] animate-pulse" />
                      </div>
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                      <p className="text-xs text-[#00C2FF] font-semibold uppercase tracking-widest mb-2">{industry}</p>
                      <h2 className="text-xl sm:text-2xl font-extrabold text-white leading-tight mb-3">
                        {selectedKeywords[0] ?? 'West Coast Sound'}
                      </h2>
                      <p className="text-sm text-[#7B2EFF] font-semibold">{selectedKeywords[1] ?? 'Street Anthems'}</p>
                      <p className="text-xs text-[#888] mt-4 italic">{phrases[selectedPhrase]}</p>
                      <div className="absolute bottom-3 right-3 text-[10px] text-[#444] font-mono">SLAPBOX · CONTENTLAB</div>
                    </div>
                  )}
                </div>

                {/* Caption editor */}
                <div className="mb-4">
                  <label className="text-xs text-[#888] mb-1.5 block">Caption (editable)</label>
                  <textarea
                    value={caption}
                    onChange={e => setCaption(e.target.value)}
                    rows={3}
                    className="w-full bg-[#0F0F0F] border border-[#2A2A2A] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#00C2FF] transition-colors resize-none"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  <button onClick={handleRegen} disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#1A1A1A] border border-[#2A2A2A] hover:border-[#444] transition-all disabled:opacity-60">
                    <RefreshCw size={12} className={loading ? 'animate-spin' : ''} /> Regenerate
                  </button>
                  <Link href="/dashboard/contentlab/publisher"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-black bg-gradient-to-r from-[#00C2FF] to-[#7B2EFF] hover:opacity-90 transition-all">
                    <Send size={12} /> Send to Publisher
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Right: AEO + Tips */}
          <div className="space-y-4">
            <div className="bg-[#141414] border border-[#2A2A2A] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Globe size={14} className="text-[#C9A86A]" />
                <h3 className="text-xs font-bold text-white">AEO Optimization Tips</h3>
              </div>
              <p className="text-[10px] text-[#555] mb-3 leading-relaxed">
                AEO (Answer Engine Optimization) targets AI search tools like Perplexity, ChatGPT, and Google SGE.
              </p>
              <div className="space-y-2">
                {aeoTips.map((tip, i) => (
                  <div key={i} className="flex items-start gap-2 p-2.5 bg-[#0F0F0F] rounded-lg border border-[#1E1E1E]">
                    <span className="text-base leading-none mt-0.5">{tip.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] text-white leading-snug">{tip.tip}</p>
                      <span className={`text-[9px] font-bold mt-0.5 inline-block ${
                        tip.impact === 'High' ? 'text-[#FF3B3B]' : 'text-[#C9A86A]'
                      }`}>{tip.impact} Impact</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#141414] border border-[#2A2A2A] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp size={14} className="text-[#00C2FF]" />
                <h3 className="text-xs font-bold text-white">Cultural Resonance</h3>
              </div>
              <div className="space-y-2">
                {[
                  { label: 'Target Demo Fit', val: '18–34 Urban', score: 92 },
                  { label: 'Platform Match', val: 'IG + TikTok', score: 88 },
                  { label: 'Trend Timing', val: 'Peak Season', score: 85 },
                ].map(r => (
                  <div key={r.label} className="flex items-center justify-between">
                    <div>
                      <p className="text-[11px] text-[#888]">{r.label}</p>
                      <p className="text-[10px] text-[#555]">{r.val}</p>
                    </div>
                    <span className="text-xs font-extrabold text-[#00C2FF]">{r.score}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#141414] border border-[#2A2A2A] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Zap size={14} className="text-[#7B2EFF]" />
                <h3 className="text-xs font-bold text-white">Small Business Tips</h3>
              </div>
              <ul className="space-y-1.5">
                {[
                  'Use neighborhood names as keywords',
                  'Reference local events in your topic',
                  'Bold cultural phrases beat generic taglines',
                  'Urban slang in captions = higher shares',
                ].map((t, i) => (
                  <li key={i} className="text-[11px] text-[#666] flex items-start gap-1.5">
                    <Check size={10} className="text-[#7B2EFF] mt-0.5 flex-shrink-0" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
