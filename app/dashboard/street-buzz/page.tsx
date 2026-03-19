'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/ui/DashboardLayout';
import { 
  TrendingUp, MapPin, Radio, Hash, BarChart3, Clock, 
  Flame, Users, Zap, Globe
} from 'lucide-react';
import { streetBuzzData } from '@/data/mockData';

const HeatMap = () => {
  return (
    <div className="bg-[#111111] border border-[#1E1E1E] rounded-xl p-6">
      <h3 className="text-lg font-bold text-white mb-4">Street Buzz™ Heat Map</h3>
      <div className="h-80 bg-[#0A0A0A] rounded-lg relative overflow-hidden">
        {/* Simplified US Map with City Dots */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-full h-full max-w-lg">
            {/* Atlanta - Hot */}
            <div 
              className="absolute w-8 h-8 rounded-full bg-[#FF4444] animate-pulse-dot shadow-[0_0_20px_#FF4444]"
              style={{ top: '65%', left: '75%' }}
            >
              <div className="absolute -top-6 -left-3 text-xs text-white font-medium">ATL</div>
              <div className="absolute top-10 -left-4 text-xs text-[#FF4444]">94°</div>
            </div>

            {/* Houston - Warm */}
            <div 
              className="absolute w-6 h-6 rounded-full bg-[#FFB800] animate-pulse shadow-[0_0_15px_#FFB800]"
              style={{ top: '70%', left: '55%' }}
            >
              <div className="absolute -top-6 -left-3 text-xs text-white font-medium">HTX</div>
              <div className="absolute top-8 -left-4 text-xs text-[#FFB800]">78°</div>
            </div>

            {/* Chicago - Emerging */}
            <div 
              className="absolute w-6 h-6 rounded-full bg-[#00FF9C] animate-pulse shadow-[0_0_15px_#00FF9C]"
              style={{ top: '45%', left: '65%' }}
            >
              <div className="absolute -top-6 -left-3 text-xs text-white font-medium">CHI</div>
              <div className="absolute top-8 -left-4 text-xs text-[#00FF9C]">67°</div>
            </div>

            {/* NYC - Warm */}
            <div 
              className="absolute w-6 h-6 rounded-full bg-[#FFB800] animate-pulse shadow-[0_0_15px_#FFB800]"
              style={{ top: '35%', left: '85%' }}
            >
              <div className="absolute -top-6 -left-3 text-xs text-white font-medium">NYC</div>
              <div className="absolute top-8 -left-4 text-xs text-[#FFB800]">72°</div>
            </div>

            {/* LA - Cool */}
            <div 
              className="absolute w-4 h-4 rounded-full bg-[#00C2FF] opacity-60"
              style={{ top: '60%', left: '15%' }}
            >
              <div className="absolute -top-6 -left-2 text-xs text-white font-medium">LA</div>
              <div className="absolute top-6 -left-4 text-xs text-[#00C2FF]">45°</div>
            </div>
          </div>
        </div>

        {/* Heat Legend */}
        <div className="absolute bottom-4 right-4 bg-[#1E1E1E] rounded-lg p-3">
          <div className="text-xs text-[#A0A0A0] mb-2">Heat Level</div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#FF4444]"></div>
              <span className="text-xs text-white">Hot (80°+)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#FFB800]"></div>
              <span className="text-xs text-white">Warm (60-79°)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#00FF9C]"></div>
              <span className="text-xs text-white">Emerging (50-69°)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#00C2FF]"></div>
              <span className="text-xs text-white">Cool (&lt;50°)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CityCard = ({ city }: { city: any }) => {
  const getHeatColor = (level: string) => {
    switch (level) {
      case 'hot': return 'border-[#FF4444] bg-[#FF4444]/10';
      case 'warm': return 'border-[#FFB800] bg-[#FFB800]/10';
      case 'emerging': return 'border-[#00FF9C] bg-[#00FF9C]/10';
      case 'cool': return 'border-[#00C2FF] bg-[#00C2FF]/10';
      default: return 'border-[#333333] bg-[#111111]';
    }
  };

  const getHeatIcon = (level: string) => {
    switch (level) {
      case 'hot': return <Flame className="w-5 h-5 text-[#FF4444]" />;
      case 'warm': return <TrendingUp className="w-5 h-5 text-[#FFB800]" />;
      case 'emerging': return <Zap className="w-5 h-5 text-[#00FF9C]" />;
      case 'cool': return <BarChart3 className="w-5 h-5 text-[#00C2FF]" />;
      default: return <BarChart3 className="w-5 h-5 text-[#666666]" />;
    }
  };

  return (
    <div className={`border-2 rounded-xl p-4 ${getHeatColor(city.heatLevel)} transition-all hover:scale-105`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          {getHeatIcon(city.heatLevel)}
          <div>
            <h3 className="text-lg font-bold text-white">{city.name}</h3>
            <p className="text-sm text-[#A0A0A0]">{city.state}</p>
          </div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-white">{city.temperature}°</div>
          <div className="text-xs text-[#A0A0A0] capitalize">{city.heatLevel}</div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-[#A0A0A0]">Conversations</span>
          <span className="text-white font-medium">{city.conversations.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-[#A0A0A0]">Hashtag Usage</span>
          <span className="text-[#00FF9C] font-medium">{city.hashtagUsage}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-[#A0A0A0]">Playlist Adds</span>
          <span className="text-[#00C2FF] font-medium">{city.playlistAdds}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-[#A0A0A0]">Radio Spins</span>
          <span className="text-[#FFB800] font-medium">{city.radioSpins}</span>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-[#333333]">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[#A0A0A0]">Traffic Share</span>
          <span className="text-white font-medium">{city.trafficShare}</span>
        </div>
      </div>
    </div>
  );
};

const BuzzTimeline = () => {
  const timelineData = [
    { time: '6h ago', city: 'Atlanta', event: 'Radio mention on V-103', impact: 'High' },
    { time: '12h ago', city: 'Houston', event: 'Playlist add on local station', impact: 'Medium' },
    { time: '18h ago', city: 'Chicago', event: 'Social media buzz surge', impact: 'Medium' },
    { time: '1d ago', city: 'NYC', event: 'Blog feature published', impact: 'High' },
    { time: '2d ago', city: 'Atlanta', event: 'Viral TikTok reaction', impact: 'High' },
  ];

  return (
    <div className="bg-[#111111] border border-[#1E1E1E] rounded-xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <Clock className="w-5 h-5 text-[#00FF9C]" />
        <h3 className="text-lg font-bold text-white">Buzz Timeline</h3>
      </div>
      <div className="space-y-3">
        {timelineData.map((item, index) => (
          <div key={index} className="flex items-start gap-4 p-3 bg-[#1E1E1E] rounded-lg">
            <div className="flex-shrink-0 w-12 text-xs text-[#A0A0A0] font-mono">
              {item.time}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-white font-medium">{item.city}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  item.impact === 'High' ? 'bg-[#FF4444]/20 text-[#FF4444]' : 'bg-[#FFB800]/20 text-[#FFB800]'
                }`}>
                  {item.impact}
                </span>
              </div>
              <p className="text-sm text-[#A0A0A0]">{item.event}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function StreetBuzzPage() {
  const [selectedCity, setSelectedCity] = useState(null);

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              <span className="bg-gradient-to-r from-[#00FF9C] to-[#00C2FF] bg-clip-text text-transparent">
                Street Buzz™
              </span>
            </h1>
            <p className="text-[#A0A0A0]">Geographic Intelligence & Real-time Street Awareness</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-[#A0A0A0]">
            <div className="w-2 h-2 bg-[#00FF9C] rounded-full animate-pulse"></div>
            Live Tracking
          </div>
        </div>

        {/* Global Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-[#111111] border border-[#1E1E1E] rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <Globe className="w-5 h-5 text-[#00FF9C]" />
              <TrendingUp className="w-4 h-4 text-[#00FF9C]" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">5</div>
            <div className="text-sm text-[#A0A0A0]">Active Markets</div>
            <div className="text-xs text-[#00FF9C] mt-1">2 emerging</div>
          </div>

          <div className="bg-[#111111] border border-[#1E1E1E] rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <Users className="w-5 h-5 text-[#00C2FF]" />
              <Hash className="w-4 h-4 text-[#FFB800]" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">8,927</div>
            <div className="text-sm text-[#A0A0A0]">Total Conversations</div>
            <div className="text-xs text-[#FFB800] mt-1">+234% this week</div>
          </div>

          <div className="bg-[#111111] border border-[#1E1E1E] rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <Radio className="w-5 h-5 text-[#FFB800]" />
              <Zap className="w-4 h-4 text-[#FF4444]" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">77</div>
            <div className="text-sm text-[#A0A0A0]">Radio Spins</div>
            <div className="text-xs text-[#FF4444] mt-1">Peak in Atlanta</div>
          </div>

          <div className="bg-[#111111] border border-[#1E1E1E] rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <BarChart3 className="w-5 h-5 text-[#7B2EFF]" />
              <MapPin className="w-4 h-4 text-[#00FF9C]" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">384</div>
            <div className="text-sm text-[#A0A0A0]">Playlist Adds</div>
            <div className="text-xs text-[#7B2EFF] mt-1">Cross-platform</div>
          </div>
        </div>

        {/* Heat Map */}
        <HeatMap />

        {/* Trending Cities Leaderboard */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Where You're Trending</h2>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-[#FF4444] rounded-full"></div>
              <span className="text-[#A0A0A0]">Real-time data</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {streetBuzzData.topCities.map((city, index) => (
              <CityCard key={index} city={city} />
            ))}
          </div>
        </div>

        {/* Bottom Section: Timeline + Regional Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BuzzTimeline />
          
          <div className="bg-[#111111] border border-[#1E1E1E] rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <BarChart3 className="w-5 h-5 text-[#7B2EFF]" />
              <h3 className="text-lg font-bold text-white">Regional Analytics</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-[#A0A0A0]">Southeast</span>
                  <span className="text-sm text-white font-medium">67%</span>
                </div>
                <div className="w-full bg-[#1E1E1E] rounded-full h-2">
                  <div className="bg-[#FF4444] h-2 rounded-full" style={{ width: '67%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-[#A0A0A0]">Southwest</span>
                  <span className="text-sm text-white font-medium">45%</span>
                </div>
                <div className="w-full bg-[#1E1E1E] rounded-full h-2">
                  <div className="bg-[#FFB800] h-2 rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-[#A0A0A0]">Northeast</span>
                  <span className="text-sm text-white font-medium">32%</span>
                </div>
                <div className="w-full bg-[#1E1E1E] rounded-full h-2">
                  <div className="bg-[#00C2FF] h-2 rounded-full" style={{ width: '32%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-[#A0A0A0]">West Coast</span>
                  <span className="text-sm text-white font-medium">28%</span>
                </div>
                <div className="w-full bg-[#1E1E1E] rounded-full h-2">
                  <div className="bg-[#00FF9C] h-2 rounded-full" style={{ width: '28%' }}></div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#333333]">
              <p className="text-sm text-[#A0A0A0]">
                Your strongest markets are in the <span className="text-[#FF4444] font-medium">Southeast</span>, 
                with Atlanta leading engagement. Consider geo-targeted campaigns in emerging markets.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}