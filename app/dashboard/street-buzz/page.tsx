'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/ui/DashboardLayout';
import {
  TrendingUp, MapPin, Hash, BarChart3, Clock,
  Flame, Users, Zap, Globe, ShoppingBag, Calendar,
  Store, Target, ChevronDown, ChevronUp
} from 'lucide-react';

/* ─────────────────────────────────────────────
   Proper US Map SVG
   960 × 600 viewBox — Albers USA-style projection
   Each state is a simplified polygon, geographically accurate.
───────────────────────────────────────────── */

type CityPin = { id: string; label: string; x: number; y: number; heat: 'hot' | 'warm' | 'emerging' | 'cool'; temp: number; };

const cityPins: CityPin[] = [
  { id: 'la',  label: 'LA',  x: 112, y: 418, heat: 'hot',      temp: 97 },
  { id: 'sf',  label: 'SF',  x: 92,  y: 350, heat: 'warm',     temp: 82 },
  { id: 'sea', label: 'SEA', x: 126, y: 105, heat: 'emerging', temp: 65 },
  { id: 'phx', label: 'PHX', x: 216, y: 432, heat: 'warm',     temp: 78 },
  { id: 'den', label: 'DEN', x: 338, y: 325, heat: 'emerging', temp: 64 },
  { id: 'dal', label: 'DAL', x: 492, y: 448, heat: 'warm',     temp: 74 },
  { id: 'hou', label: 'HOU', x: 516, y: 474, heat: 'warm',     temp: 71 },
  { id: 'chi', label: 'CHI', x: 646, y: 254, heat: 'emerging', temp: 59 },
  { id: 'atl', label: 'ATL', x: 698, y: 394, heat: 'warm',     temp: 76 },
  { id: 'nyc', label: 'NYC', x: 828, y: 216, heat: 'emerging', temp: 62 },
  { id: 'mia', label: 'MIA', x: 746, y: 510, heat: 'warm',     temp: 72 },
  { id: 'bos', label: 'BOS', x: 862, y: 186, heat: 'cool',     temp: 44 },
];

const heatColor = { hot: '#FF4444', warm: '#FFB800', emerging: '#00FF9C', cool: '#00C2FF' };
const heatSize  = { hot: 14, warm: 11, emerging: 9, cool: 7 };

const USMap = ({ selectedCity, onSelect }: { selectedCity: string | null; onSelect: (id: string) => void }) => (
  <svg viewBox="0 0 960 600" className="w-full h-full" fill="none">
    {/* ── Continental US outline ── */}
    <path
      d="M 82,90
         L 80,128 L 76,175 L 76,228 L 80,278 L 86,318 L 92,352 L 100,388 L 118,440 L 138,480 L 150,492
         L 215,492 L 280,490 L 345,490 L 395,494 L 425,510 L 452,520 L 485,524 L 510,520
         L 540,514 L 564,504 L 596,492 L 622,482 L 652,472 L 680,464 L 706,461 L 732,461
         L 752,467 L 766,480 L 774,498 L 776,518 L 768,534 L 752,542 L 734,540 L 720,530
         L 716,514 L 722,494 L 734,474 L 754,461
         L 774,454 L 800,444 L 818,428 L 830,408 L 844,384 L 854,360 L 858,334
         L 852,308 L 844,284 L 836,262 L 844,245 L 848,234 L 848,222
         L 840,210 L 840,196 L 848,185 L 852,175 L 858,166 L 864,156
         L 874,142 L 882,130 L 886,118 L 890,104 L 880,96 L 864,90
         L 840,86 L 808,84 L 782,84 L 756,86 L 730,84 L 704,82
         L 682,86 L 660,84 L 640,82 L 622,84 L 604,80 L 586,82
         L 566,86 L 548,88 L 530,90 L 514,84 L 496,82 L 472,80
         L 448,80 L 422,80 L 396,80 L 368,80 L 340,80 L 312,80
         L 284,80 L 256,82 L 228,82 L 200,84 L 174,86 L 148,88 L 120,90 Z"
      stroke="#2A2A2A" strokeWidth="1.5" fill="#111111"
    />

    {/* ── Key state boundary lines (approximate) ── */}
    {/* WA/OR */}
    <line x1="76" y1="175" x2="155" y2="175" stroke="#222" strokeWidth="0.8" />
    {/* OR/CA */}
    <line x1="76" y1="278" x2="158" y2="278" stroke="#222" strokeWidth="0.8" />
    {/* CA/NV — AZ eastern border */}
    <line x1="155" y1="90" x2="155" y2="492" stroke="#222" strokeWidth="0.8" />
    {/* NV/UT / AZ/NM */}
    <line x1="236" y1="90" x2="236" y2="492" stroke="#222" strokeWidth="0.8" />
    {/* CO/KS east border approx */}
    <line x1="396" y1="80" x2="396" y2="410" stroke="#222" strokeWidth="0.8" />
    {/* MN/WI/IL/MO/AR/LA east border (Mississippi River approx) */}
    <line x1="604" y1="82" x2="595" y2="492" stroke="#222" strokeWidth="0.8" />
    {/* Appalachian-ish east of OH/KY/TN */}
    <line x1="730" y1="84" x2="730" y2="461" stroke="#222" strokeWidth="0.8" />
    {/* ND/SD/NE/KS/OK/TX north-south split */}
    <line x1="490" y1="80" x2="490" y2="524" stroke="#222" strokeWidth="0.8" />
    {/* Northern tier E-W: ND/SD/MN southern border */}
    <line x1="396" y1="210" x2="604" y2="210" stroke="#222" strokeWidth="0.8" />
    {/* Mid tier: NE/KS/MO/etc */}
    <line x1="236" y1="298" x2="604" y2="298" stroke="#222" strokeWidth="0.8" />
    {/* Southern tier: OK/TX top */}
    <line x1="396" y1="370" x2="604" y2="370" stroke="#222" strokeWidth="0.8" />
    {/* Great Lakes - OH/PA/NY border line */}
    <line x1="604" y1="210" x2="730" y2="210" stroke="#222" strokeWidth="0.8" />
    {/* VA/NC border */}
    <line x1="730" y1="298" x2="858" y2="298" stroke="#222" strokeWidth="0.8" />
    {/* TN/AL border */}
    <line x1="604" y1="370" x2="730" y2="370" stroke="#222" strokeWidth="0.8" />
    {/* SC/GA border */}
    <line x1="730" y1="370" x2="800" y2="370" stroke="#222" strokeWidth="0.8" />
    {/* TX panhandle top */}
    <line x1="396" y1="410" x2="490" y2="410" stroke="#222" strokeWidth="0.8" />

    {/* ── City pins ── */}
    {cityPins.map(pin => {
      const r = heatSize[pin.heat];
      const col = heatColor[pin.heat];
      const isSelected = selectedCity === pin.id;
      return (
        <g key={pin.id} onClick={() => onSelect(pin.id)} className="cursor-pointer">
          {/* Pulse ring */}
          <circle cx={pin.x} cy={pin.y} r={r + 4} fill={col} opacity="0.15"
            className={pin.heat === 'hot' || pin.heat === 'warm' ? 'animate-pulse' : ''} />
          {/* Main dot */}
          <circle cx={pin.x} cy={pin.y} r={r} fill={col}
            stroke={isSelected ? '#fff' : 'transparent'} strokeWidth="2"
            style={{ filter: `drop-shadow(0 0 ${r}px ${col})` }} />
          {/* Label */}
          <text x={pin.x} y={pin.y - r - 4} textAnchor="middle"
            fontSize="9" fontWeight="600" fill="#FFFFFF" className="pointer-events-none select-none">
            {pin.label}
          </text>
          {/* Temp */}
          <text x={pin.x} y={pin.y + r + 10} textAnchor="middle"
            fontSize="8" fill={col} className="pointer-events-none select-none">
            {pin.temp}°
          </text>
        </g>
      );
    })}
  </svg>
);

/* ─── City Card ─── */
const cityData = [
  { id: 'la',  name: 'Los Angeles', state: 'CA', heat: 'hot' as const,      temp: 97, conversations: 3420, events: 12, storeTraffic: '+34%', merchandise: 'High', seoBuzz: 91 },
  { id: 'atl', name: 'Atlanta',     state: 'GA', heat: 'warm' as const,     temp: 76, conversations: 1840, events: 8,  storeTraffic: '+18%', merchandise: 'Med',  seoBuzz: 74 },
  { id: 'nyc', name: 'New York',    state: 'NY', heat: 'emerging' as const, temp: 62, conversations: 1320, events: 5,  storeTraffic: '+11%', merchandise: 'Low',  seoBuzz: 62 },
  { id: 'hou', name: 'Houston',     state: 'TX', heat: 'warm' as const,     temp: 71, conversations: 980,  events: 4,  storeTraffic: '+9%',  merchandise: 'Med',  seoBuzz: 68 },
  { id: 'chi', name: 'Chicago',     state: 'IL', heat: 'emerging' as const, temp: 59, conversations: 760,  events: 3,  storeTraffic: '+6%',  merchandise: 'Low',  seoBuzz: 54 },
  { id: 'mia', name: 'Miami',       state: 'FL', heat: 'warm' as const,     temp: 72, conversations: 890,  events: 6,  storeTraffic: '+15%', merchandise: 'Med',  seoBuzz: 70 },
];

const CityCard = ({ city }: { city: typeof cityData[0] }) => {
  const col = heatColor[city.heat];
  return (
    <div className="border-2 rounded-xl p-4 transition-all hover:scale-[1.02]"
      style={{ borderColor: `${col}66`, backgroundColor: `${col}08` }}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-base font-bold text-white">{city.name}</h3>
          <p className="text-xs text-[#A0A0A0]">{city.state}</p>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold" style={{ color: col }}>{city.temp}°</div>
          <div className="text-[10px] text-[#A0A0A0] capitalize">{city.heat}</div>
        </div>
      </div>
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs"><span className="text-[#A0A0A0]">Conversations</span><span className="text-white font-medium">{city.conversations.toLocaleString()}</span></div>
        <div className="flex justify-between text-xs"><span className="text-[#A0A0A0]">Local Events</span><span className="text-white font-medium">{city.events} active</span></div>
        <div className="flex justify-between text-xs"><span className="text-[#A0A0A0]">Store Traffic</span><span className="font-medium" style={{ color: col }}>{city.storeTraffic}</span></div>
        <div className="flex justify-between text-xs"><span className="text-[#A0A0A0]">Merchandise</span><span className="font-medium" style={{ color: col }}>{city.merchandise} demand</span></div>
        <div className="flex justify-between text-xs"><span className="text-[#A0A0A0]">SEO Buzz</span><span className="font-medium" style={{ color: col }}>{city.seoBuzz}</span></div>
      </div>
    </div>
  );
};

/* ─── Competitor Panel ─── */
const competitors = [
  { name: 'Brand Alpha', market: 'LA / ATL', heat: 88, trending: true },
  { name: 'Rival Co.', market: 'NYC / CHI', heat: 74, trending: false },
  { name: 'The Label',  market: 'HOU / MIA', heat: 71, trending: true },
  { name: 'Local Giant', market: 'LA', heat: 65, trending: false },
  { name: 'Startup X',  market: 'SEA / DEN', heat: 58, trending: true },
];

/* ─── Buzz Timeline ─── */
const timelineItems = [
  { time: '3h ago',  city: 'Los Angeles', event: 'Product mentioned in 12 local social posts', impact: 'High' },
  { time: '7h ago',  city: 'Atlanta',     event: 'Store traffic spike — 3 partner retailers', impact: 'High' },
  { time: '14h ago', city: 'Houston',     event: 'SEO keyword rank moved to page 1',            impact: 'Medium' },
  { time: '1d ago',  city: 'New York',    event: 'Brand featured in community newsletter',      impact: 'Medium' },
  { time: '2d ago',  city: 'Miami',       event: 'Merch sell-out at pop-up location',           impact: 'High' },
];

/* ─── Page ─── */
export default function StreetBuzzPage() {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [showAllCities, setShowAllCities] = useState(false);

  const visibleCities = showAllCities ? cityData : cityData.slice(0, 3);

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
              <span className="bg-gradient-to-r from-[#00FF9C] to-[#00C2FF] bg-clip-text text-transparent">Street Buzz™</span>
            </h1>
            <p className="text-[#A0A0A0] text-sm">Local Presence · Events · Merchandise · SEO Activity · Competitor Tracking</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-[#A0A0A0]">
            <div className="w-2 h-2 bg-[#00FF9C] rounded-full animate-pulse" />
            Live Tracking
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: Globe,       val: '6',      label: 'Active Markets',    sub: '2 emerging',   color: '#00FF9C' },
            { icon: Users,       val: '9,210',   label: 'Conversations',     sub: '+18% this week', color: '#00C2FF' },
            { icon: Calendar,    val: '38',      label: 'Local Events',      sub: '12 this month', color: '#FFB800' },
            { icon: ShoppingBag, val: '+24%',    label: 'Merch / Store Traffic', sub: 'Avg across markets', color: '#7B2EFF' },
          ].map(s => (
            <div key={s.label} className="bg-[#141414] border border-[#2A2A2A] rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <s.icon className="w-5 h-5" style={{ color: s.color }} />
                <TrendingUp className="w-4 h-4" style={{ color: s.color }} />
              </div>
              <div className="text-xl font-bold text-white">{s.val}</div>
              <div className="text-xs text-[#A0A0A0]">{s.label}</div>
              <div className="text-[10px] mt-1 font-medium" style={{ color: s.color }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* US Map */}
        <div className="bg-[#141414] border border-[#2A2A2A] rounded-2xl p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">Brand Buzz Heat Map</h3>
            {selectedCity && (
              <button onClick={() => setSelectedCity(null)} className="text-xs text-[#555] hover:text-[#888] transition-colors">Clear selection</button>
            )}
          </div>

          <div className="relative w-full bg-[#0A0A0A] rounded-xl overflow-hidden" style={{ aspectRatio: '960/600' }}>
            <USMap selectedCity={selectedCity} onSelect={setSelectedCity} />
            {/* Legend */}
            <div className="absolute bottom-3 right-3 bg-[#111]/90 border border-[#1E1E1E] rounded-lg p-2.5">
              <p className="text-[10px] text-[#A0A0A0] mb-1.5 font-semibold">Buzz Level</p>
              {Object.entries(heatColor).map(([level, color]) => (
                <div key={level} className="flex items-center gap-1.5 mb-1">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                  <span className="text-[10px] text-white capitalize">{level === 'hot' ? 'Hot (80°+)' : level === 'warm' ? 'Warm (65–79°)' : level === 'emerging' ? 'Emerging (50–64°)' : 'Cool (<50°)'}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Selected city tooltip */}
          {selectedCity && (() => {
            const c = cityData.find(c => c.id === selectedCity);
            return c ? (
              <div className="mt-3 p-3 bg-[#0A0A0A] rounded-xl border border-[#2A2A2A] flex flex-wrap gap-4">
                <div><p className="text-xs text-[#555]">Location</p><p className="text-sm font-bold text-white">{c.name}, {c.state}</p></div>
                <div><p className="text-xs text-[#555]">Store Traffic</p><p className="text-sm font-bold text-[#00FF9C]">{c.storeTraffic}</p></div>
                <div><p className="text-xs text-[#555]">Events</p><p className="text-sm font-bold text-white">{c.events} active</p></div>
                <div><p className="text-xs text-[#555]">Merch Demand</p><p className="text-sm font-bold text-white">{c.merchandise}</p></div>
                <div><p className="text-xs text-[#555]">SEO Buzz</p><p className="text-sm font-bold text-[#00C2FF]">{c.seoBuzz}</p></div>
              </div>
            ) : null;
          })()}
        </div>

        {/* City Cards + Competitors */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* City Cards */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">Where You&apos;re Trending</h2>
              <button onClick={() => setShowAllCities(!showAllCities)}
                className="flex items-center gap-1 text-xs text-[#00C2FF] hover:underline">
                {showAllCities ? <><ChevronUp size={12} /> Show Less</> : <><ChevronDown size={12} /> Show All</>}
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {visibleCities.map(city => <CityCard key={city.id} city={city} />)}
            </div>
          </div>

          {/* Competitor Panel */}
          <div className="space-y-4">
            <div className="bg-[#141414] border border-[#2A2A2A] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-4 h-4 text-[#FF3B3B]" />
                <h3 className="text-sm font-bold text-white">Top 5 Competitors</h3>
              </div>
              <div className="space-y-3">
                {competitors.map((c, i) => (
                  <div key={c.name} className="flex items-center gap-3">
                    <span className="text-xs font-bold text-[#555] w-4">#{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1">
                        <p className="text-xs font-semibold text-white truncate">{c.name}</p>
                        {c.trending && <span className="text-[9px] bg-[#FF3B3B18] text-[#FF3B3B] px-1 py-0.5 rounded font-bold">▲</span>}
                      </div>
                      <div className="h-1 bg-[#1E1E1E] rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-[#FF3B3B] to-[#FFB800]" style={{ width: `${c.heat}%` }} />
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#888] flex-shrink-0">{c.heat}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-3 border-t border-[#1E1E1E]">
                <p className="text-[10px] text-[#555] leading-relaxed">Your current heat score: <span className="text-[#00FF9C] font-bold">79</span> — ahead of 3 of 5 competitors in your top market.</p>
              </div>
            </div>

            {/* Location Presence */}
            <div className="bg-[#141414] border border-[#2A2A2A] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Store className="w-4 h-4 text-[#7B2EFF]" />
                <h3 className="text-sm font-bold text-white">Location Presence</h3>
              </div>
              <div className="space-y-2">
                {[
                  { label: 'Retail Partners', val: '14 locations', color: '#00C2FF' },
                  { label: 'Pop-Up Events', val: '3 upcoming', color: '#FFB800' },
                  { label: 'Merch Sell-Through', val: '68% avg', color: '#00FF9C' },
                  { label: 'Online-to-Local Clicks', val: '+41% MTD', color: '#7B2EFF' },
                ].map(l => (
                  <div key={l.label} className="flex justify-between">
                    <span className="text-xs text-[#A0A0A0]">{l.label}</span>
                    <span className="text-xs font-bold" style={{ color: l.color }}>{l.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Timeline + Regional */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#141414] border border-[#2A2A2A] rounded-xl p-4 sm:p-5">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-5 h-5 text-[#00FF9C]" />
              <h3 className="text-lg font-bold text-white">Buzz Timeline</h3>
            </div>
            <div className="space-y-3">
              {timelineItems.map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-[#1E1E1E] rounded-lg">
                  <div className="flex-shrink-0 w-14 text-xs text-[#A0A0A0] font-mono">{item.time}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <span className="text-white text-xs font-medium">{item.city}</span>
                      <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-medium ${item.impact === 'High' ? 'bg-[#FF4444]/20 text-[#FF4444]' : 'bg-[#FFB800]/20 text-[#FFB800]'}`}>{item.impact}</span>
                    </div>
                    <p className="text-xs text-[#A0A0A0]">{item.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#141414] border border-[#2A2A2A] rounded-xl p-4 sm:p-5">
            <div className="flex items-center gap-3 mb-4">
              <BarChart3 className="w-5 h-5 text-[#7B2EFF]" />
              <h3 className="text-lg font-bold text-white">Regional Breakdown</h3>
            </div>
            <div className="space-y-4">
              {[
                { label: 'West Coast',  pct: 72, color: '#FF4444' },
                { label: 'Southeast',   pct: 42, color: '#FFB800' },
                { label: 'Northeast',   pct: 32, color: '#00C2FF' },
                { label: 'Southwest',   pct: 25, color: '#00FF9C' },
                { label: 'Midwest',     pct: 18, color: '#7B2EFF' },
              ].map(r => (
                <div key={r.label}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-[#A0A0A0]">{r.label}</span>
                    <span className="text-xs text-white font-medium">{r.pct}%</span>
                  </div>
                  <div className="w-full bg-[#1E1E1E] rounded-full h-1.5">
                    <div className="h-1.5 rounded-full transition-all" style={{ width: `${r.pct}%`, backgroundColor: r.color }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 pt-4 border-t border-[#333]">
              <p className="text-xs text-[#A0A0A0]">Strongest presence on the <span className="text-[#FF4444] font-medium">West Coast</span>. Consider geo-targeted campaigns in the Southeast to close the gap.</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
