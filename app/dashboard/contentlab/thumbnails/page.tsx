'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/ui/DashboardLayout';
import Link from 'next/link';
import {
  Youtube, ChevronLeft, Sparkles, Download, RefreshCw,
  Upload, Loader2, Check, Zap
} from 'lucide-react';

const energyStyles = [
  { id: 'hype', label: 'Hype', emoji: '🔥', colors: 'from-[#FF3B3B] to-[#FF8C00]' },
  { id: 'shocked', label: 'Shocked', emoji: '😱', colors: 'from-[#FFB800] to-[#FF3B3B]' },
  { id: 'calm', label: 'Calm', emoji: '🧊', colors: 'from-[#00C2FF] to-[#0066CC]' },
  { id: 'mysterious', label: 'Mysterious', emoji: '🌑', colors: 'from-[#7B2EFF] to-[#0a0020]' },
  { id: 'triumphant', label: 'Triumphant', emoji: '🏆', colors: 'from-[#C9A86A] to-[#FFB800]' },
];

const palettes = [
  { id: 'auto', label: 'Auto', colors: ['#00C2FF', '#7B2EFF', '#FF3B3B'] },
  { id: 'fire', label: 'Fire', colors: ['#FF3B3B', '#FF8C00', '#FFB800'] },
  { id: 'ocean', label: 'Ocean', colors: ['#00C2FF', '#0066CC', '#001A4D'] },
  { id: 'royal', label: 'Royal', colors: ['#7B2EFF', '#4A0080', '#1A0033'] },
  { id: 'gold', label: 'Gold', colors: ['#C9A86A', '#FFB800', '#8B6914'] },
  { id: 'mono', label: 'Mono', colors: ['#FFFFFF', '#888888', '#000000'] },
];

const mockVariations = [
  { id: 1, focus: 'Text Dominant', desc: 'Bold headline fills 60% of frame' },
  { id: 2, focus: 'Image Dominant', desc: 'Visual impact with compact title' },
  { id: 3, focus: 'Balanced', desc: 'Split composition — text + imagery' },
];

export default function ThumbnailsPage() {
  const [videoTitle, setVideoTitle] = useState('');
  const [videoDesc, setVideoDesc] = useState('');
  const [energyStyle, setEnergyStyle] = useState('hype');
  const [palette, setPalette] = useState('auto');
  const [hasPhoto, setHasPhoto] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [editingText, setEditingText] = useState<string>('');

  const currentEnergy = energyStyles.find(e => e.id === energyStyle)!;
  const currentPalette = palettes.find(p => p.id === palette)!;

  const handleGenerate = () => {
    if (!videoTitle.trim()) return;
    setLoading(true);
    setGenerated(false);
    setSelected(null);
    setTimeout(() => {
      setLoading(false);
      setGenerated(true);
      setEditingText(videoTitle.toUpperCase());
    }, 2600);
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
              <Youtube size={16} className="text-[#FF3B3B]" />
              <h1 className="text-lg sm:text-xl font-extrabold text-white">Thumbnail Generator</h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FF3B3B18] text-[#FF3B3B]">+48% CTR</span>
            </div>
            <p className="text-xs text-[#666] mt-0.5">High-converting YouTube thumbnails in 3 AI variations</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

          {/* Config Panel */}
          <div className="lg:col-span-2 space-y-4">

            {/* Video Info */}
            <div className="bg-[#141414] border border-[#2A2A2A] rounded-2xl p-5">
              <h3 className="text-xs font-bold text-[#888] uppercase tracking-wider mb-3">Video Details</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-[#666] mb-1.5 block">Video Title *</label>
                  <input
                    type="text"
                    value={videoTitle}
                    onChange={e => setVideoTitle(e.target.value)}
                    placeholder="e.g. Behind The Beat with DJ Quake"
                    className="w-full bg-[#0F0F0F] border border-[#2A2A2A] rounded-xl px-4 py-2.5 text-sm text-white placeholder-[#555] focus:outline-none focus:border-[#FF3B3B] transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#666] mb-1.5 block">Description (optional)</label>
                  <textarea
                    value={videoDesc}
                    onChange={e => setVideoDesc(e.target.value)}
                    placeholder="What's the video about?"
                    rows={2}
                    className="w-full bg-[#0F0F0F] border border-[#2A2A2A] rounded-xl px-4 py-2.5 text-sm text-white placeholder-[#555] focus:outline-none focus:border-[#FF3B3B] transition-colors resize-none"
                  />
                </div>

                {/* Photo upload */}
                <button
                  onClick={() => setHasPhoto(!hasPhoto)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 border-dashed transition-all ${
                    hasPhoto ? 'border-[#00C2FF44] bg-[#00C2FF08] text-[#00C2FF]' : 'border-[#2A2A2A] text-[#555] hover:border-[#444] hover:text-[#888]'
                  }`}>
                  <Upload size={16} />
                  <span className="text-xs font-semibold">{hasPhoto ? '✓ Photo added' : 'Add your photo (optional)'}</span>
                </button>
              </div>
            </div>

            {/* Energy Style */}
            <div className="bg-[#141414] border border-[#2A2A2A] rounded-2xl p-5">
              <h3 className="text-xs font-bold text-[#888] uppercase tracking-wider mb-3">Energy Style</h3>
              <div className="space-y-2">
                {energyStyles.map(style => (
                  <button key={style.id} onClick={() => setEnergyStyle(style.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${
                      energyStyle === style.id
                        ? 'border-transparent text-white'
                        : 'border-[#1E1E1E] text-[#666] hover:text-white hover:border-[#2A2A2A]'
                    }`}
                    style={energyStyle === style.id
                      ? { background: `linear-gradient(135deg, ${style.colors.replace('from-', '').replace('to-', '').split(' ').join(', ')})`, opacity: 0.9 }
                      : {}}>
                    <span className="text-xl">{style.emoji}</span>
                    <span className="text-sm font-bold">{style.label}</span>
                    {energyStyle === style.id && <Check size={14} className="ml-auto" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Palette */}
            <div className="bg-[#141414] border border-[#2A2A2A] rounded-2xl p-5">
              <h3 className="text-xs font-bold text-[#888] uppercase tracking-wider mb-3">Color Palette</h3>
              <div className="grid grid-cols-3 gap-2">
                {palettes.map(p => (
                  <button key={p.id} onClick={() => setPalette(p.id)}
                    className={`flex flex-col items-center gap-2 p-2 rounded-xl border transition-all ${
                      palette === p.id ? 'border-white' : 'border-[#2A2A2A] hover:border-[#444]'
                    }`}>
                    <div className="flex gap-0.5">
                      {p.colors.map(c => (
                        <div key={c} className="w-5 h-5 rounded-sm" style={{ backgroundColor: c }} />
                      ))}
                    </div>
                    <span className="text-[10px] text-[#888]">{p.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <button onClick={handleGenerate} disabled={!videoTitle.trim() || loading}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-black bg-gradient-to-r from-[#FF3B3B] to-[#FF8C00] hover:opacity-90 transition-all disabled:opacity-40">
              {loading ? (
                <><Loader2 size={16} className="animate-spin" /> Generating 3 Variations...</>
              ) : (
                <><Sparkles size={16} /> Generate Thumbnails</>
              )}
            </button>
          </div>

          {/* Variations Panel */}
          <div className="lg:col-span-3 space-y-4">

            {!generated && !loading && (
              <div className="bg-[#141414] border border-[#2A2A2A] rounded-2xl p-8 flex flex-col items-center justify-center text-center min-h-[300px]">
                <Youtube size={40} className="text-[#2A2A2A] mb-3" />
                <p className="text-[#555] text-sm">Enter your video title and click Generate</p>
                <p className="text-[#333] text-xs mt-1">3 variations will appear here</p>
              </div>
            )}

            {loading && (
              <div className="bg-[#141414] border border-[#2A2A2A] rounded-2xl p-8 flex flex-col items-center justify-center min-h-[300px]">
                <Loader2 size={32} className="text-[#FF3B3B] animate-spin mb-4" />
                <p className="text-sm text-white font-semibold">Generating thumbnails...</p>
                <p className="text-xs text-[#555] mt-1">Building 3 AI variations</p>
                <div className="w-48 h-1 bg-[#1E1E1E] rounded-full overflow-hidden mt-4">
                  <div className="h-full rounded-full bg-gradient-to-r from-[#FF3B3B] to-[#FF8C00] animate-pulse w-2/3" />
                </div>
              </div>
            )}

            {generated && !loading && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white">Choose Your Variation</h3>
                  <button onClick={handleRegen} className="flex items-center gap-1.5 text-xs text-[#888] hover:text-white transition-colors">
                    <RefreshCw size={12} /> Regenerate
                  </button>
                </div>

                {mockVariations.map(v => (
                  <button key={v.id} onClick={() => setSelected(v.id)}
                    className={`w-full text-left transition-all rounded-2xl overflow-hidden border-2 ${
                      selected === v.id ? 'border-[#00C2FF]' : 'border-[#2A2A2A] hover:border-[#444]'
                    }`}>
                    {/* Thumbnail mockup */}
                    <div className="relative aspect-video w-full flex items-center justify-center p-6"
                      style={{
                        background: `linear-gradient(135deg, ${currentPalette.colors[2] ?? '#000'}, ${currentPalette.colors[0] ?? '#333'})`
                      }}>
                      {selected === v.id && (
                        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#00C2FF] flex items-center justify-center">
                          <Check size={12} className="text-black" />
                        </div>
                      )}
                      <div className={`text-center ${
                        v.id === 1 ? 'w-full' : v.id === 2 ? 'w-2/3' : 'w-full'
                      }`}>
                        {hasPhoto && (
                          <div className="w-12 h-12 rounded-full bg-[#ffffff22] mx-auto mb-2 border-2 border-white/30 flex items-center justify-center">
                            <span className="text-xs text-white/60">KC</span>
                          </div>
                        )}
                        <p className="text-xs text-white/60 uppercase tracking-widest mb-1">{currentEnergy.emoji}</p>
                        <h3 className={`font-extrabold leading-tight text-white ${
                          v.id === 1 ? 'text-xl sm:text-2xl' : v.id === 2 ? 'text-sm sm:text-base' : 'text-lg'
                        }`} style={{ textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>
                          {editingText || videoTitle.toUpperCase()}
                        </h3>
                      </div>
                      <div className="absolute bottom-2 left-2 text-[9px] text-white/30 font-mono">
                        1280×720 · {currentEnergy.label} · {v.focus}
                      </div>
                    </div>
                    <div className="bg-[#141414] px-4 py-2.5 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-white">Variation {v.id}</p>
                        <p className="text-[10px] text-[#555]">{v.desc}</p>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        selected === v.id ? 'bg-[#00C2FF18] text-[#00C2FF]' : 'bg-[#1E1E1E] text-[#555]'
                      }`}>{selected === v.id ? 'Selected' : 'Pick This'}</span>
                    </div>
                  </button>
                ))}

                {/* Text Editor */}
                {selected && (
                  <div className="bg-[#141414] border border-[#2A2A2A] rounded-2xl p-4">
                    <label className="text-xs text-[#888] mb-2 block">Edit Overlay Text</label>
                    <input
                      type="text"
                      value={editingText}
                      onChange={e => setEditingText(e.target.value)}
                      className="w-full bg-[#0F0F0F] border border-[#2A2A2A] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#00C2FF] transition-colors"
                    />
                    <div className="flex gap-2 mt-3">
                      <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#1A1A1A] border border-[#2A2A2A] hover:border-[#444] transition-all">
                        <Download size={12} /> Download PNG
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#FF3B3B18] border border-[#FF3B3B44] text-[#FF3B3B] hover:opacity-80 transition-all">
                        <Zap size={12} /> Add to YouTube Queue
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
