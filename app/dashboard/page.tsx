'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/ui/DashboardLayout';
import { 
  TrendingUp, 
  Radio, 
  Zap, 
  DollarSign, 
  ArrowUp, 
  Clock, 
  MapPin, 
  Brain,
  ExternalLink,
  Play,
  Calendar,
  Send,
  Heart,
  Eye,
  ChevronDown,
  Flame
} from 'lucide-react';
import { momentumData, quickStats, recentActivity, artistProfile, dashboardWidgets } from '@/data/mockData';

const MomentumGauge = ({ score, change }: { score: number; change: number }) => {
  const circumference = 2 * Math.PI * 45;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="relative w-32 h-32">
      <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="8"
          fill="transparent"
        />
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke="url(#gaugeGradient)"
          strokeWidth="8"
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
        <defs>
          <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00C2FF" />
            <stop offset="100%" stopColor="#7B2EFF" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-2xl font-bold text-white">{score}</div>
        <div className="text-xs text-[#00FF9C] flex items-center">
          <ArrowUp className="w-3 h-3 mr-1" />
          +{change}
        </div>
      </div>
    </div>
  );
};

const ActivityCard = ({ activity }: { activity: any }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'podcast': return <Radio className="w-4 h-4" />;
      case 'social': return <Zap className="w-4 h-4" />;
      case 'revenue': return <DollarSign className="w-4 h-4" />;
      case 'geo': return <MapPin className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getColor = (impact: string) => {
    switch (impact) {
      case 'High': return 'border-l-[#00FF9C]';
      case 'Medium': return 'border-l-[#00C2FF]';
      default: return 'border-l-[#A0A0A0]';
    }
  };

  return (
    <div className={`bg-[#141414]/80 rounded-lg p-3 sm:p-4 border-l-4 ${getColor(activity.impact)} card-glow dashboard-accent noise-overlay relative`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start space-x-3 min-w-0 flex-1">
          <div className="p-2 bg-[#0A0A0A] rounded-lg text-[#00C2FF] flex-shrink-0">
            {getIcon(activity.type)}
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="font-medium text-white text-sm sm:text-base truncate">{activity.title}</h4>
            <p className="text-xs sm:text-sm text-[#A0A0A0] mt-1 leading-relaxed">{activity.description}</p>
            <span className="text-xs text-[#A0A0A0] mt-1 block">{activity.time}</span>
          </div>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
          activity.impact === 'High' 
            ? 'bg-[#00FF9C]/20 text-[#00FF9C]'
            : activity.impact === 'Medium'
            ? 'bg-[#00C2FF]/20 text-[#00C2FF]'
            : 'bg-[#A0A0A0]/20 text-[#A0A0A0]'
        }`}>
          {activity.impact}
        </span>
      </div>
    </div>
  );
};

/* ── Trending Now Video Player ── */

const trendingVideos = {
  myHottest: {
    main: {
      title: "Midnight on Crenshaw (Official Video)",
      artist: "Kendrick Cole",
      views: "2.4M",
      likes: "187K",
      uploadDate: "Mar 12, 2024",
      rank: 1,
    },
    upNext: [
      { title: "Studio Session pt. 3", artist: "Kendrick Cole", views: "1.1M", rank: 2 },
      { title: "West Side Story (Freestyle)", artist: "Kendrick Cole", views: "890K", rank: 3 },
      { title: "SlapBox Cypher", artist: "Kendrick Cole ft. Blxst", views: "674K", rank: 4 },
      { title: "LA Nights (Acoustic)", artist: "Kendrick Cole", views: "412K", rank: 5 },
    ],
  },
  localTrending: {
    main: {
      title: "Die Hard (Official Video)",
      artist: "Roddy Ricch",
      views: "18.7M",
      likes: "1.2M",
      uploadDate: "Feb 28, 2024",
      rank: 1,
    },
    upNext: [
      { title: "Chosen", artist: "Blxst ft. Tyga", views: "9.3M", rank: 2 },
      { title: "Hussle & Motivate (Legacy)", artist: "Nipsey Hussle", views: "7.8M", rank: 3 },
      { title: "South Central Love", artist: "G Perico", views: "4.1M", rank: 4 },
      { title: "Larry's Diaries", artist: "Larry June", views: "3.6M", rank: 5 },
    ],
  },
};

const cities = [
  "Los Angeles, CA", "Long Beach, CA", "Compton, CA", "Sacramento, CA",
  "San Francisco, CA", "Oakland, CA", "San Diego, CA", "Atlanta, GA",
  "New York, NY", "Chicago, IL", "Houston, TX", "Miami, FL",
];

const genres = [
  "Hip-Hop/Rap", "R&B", "Pop", "Latin", "Rock", "Country", "Electronic", "Afrobeats",
];

const TrendingNowPlayer = () => {
  const [mode, setMode] = useState<'myHottest' | 'localTrending'>('myHottest');
  const [city, setCity] = useState('Los Angeles, CA');
  const [genre, setGenre] = useState('Hip-Hop/Rap');
  const data = trendingVideos[mode];

  return (
    <div className="bg-[#141414] border border-[#2A2A2A] rounded-2xl overflow-hidden relative">
      {/* Glow effects */}
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-[#00C2FF]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-[#7B2EFF]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 p-4 sm:p-6">
        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-[#FF3B3B]" />
            <h2 className="text-lg sm:text-xl font-bold text-white">Trending Now</h2>
          </div>

          {/* Toggle */}
          <div className="flex bg-[#0A0A0A] rounded-lg p-1 self-start sm:self-auto">
            <button
              onClick={() => setMode('myHottest')}
              className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all min-h-[44px] ${
                mode === 'myHottest' ? 'bg-[#00C2FF] text-white' : 'text-[#A0A0A0] hover:text-white'
              }`}
            >
              My Hottest
            </button>
            <button
              onClick={() => setMode('localTrending')}
              className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all min-h-[44px] ${
                mode === 'localTrending' ? 'bg-[#7B2EFF] text-white' : 'text-[#A0A0A0] hover:text-white'
              }`}
            >
              Local Trending
            </button>
          </div>
        </div>

        {/* Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A0A0A0] pointer-events-none" />
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full bg-[#0A0A0A] border border-[#2A2A2A] text-white rounded-lg pl-9 pr-8 py-3 text-sm appearance-none min-h-[44px] focus:border-[#00C2FF] focus:outline-none"
            >
              {cities.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A0A0A0] pointer-events-none" />
          </div>
          <div className="relative">
            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="w-full bg-[#0A0A0A] border border-[#2A2A2A] text-white rounded-lg px-4 pr-8 py-3 text-sm appearance-none min-h-[44px] focus:border-[#00C2FF] focus:outline-none"
            >
              {genres.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A0A0A0] pointer-events-none" />
          </div>
        </div>

        {/* Main video mockup — 16:9 */}
        <div className="relative w-full rounded-xl overflow-hidden" style={{ aspectRatio: '16/9' }}>
          <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A] via-[#141414] to-[#0A0A0A]" />
          {/* subtle gradient glow behind play */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="absolute w-32 h-32 bg-[#00C2FF]/20 rounded-full blur-2xl" />
            <button className="relative z-10 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all min-h-[44px] min-w-[44px]">
              <Play className="w-7 h-7 sm:w-9 sm:h-9 text-white fill-white ml-1" />
            </button>
          </div>

          {/* Rank badge */}
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-[#C9A86A] text-black text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> #{data.main.rank} Trending
          </div>

          {/* Bottom overlay info */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 sm:p-5">
            <h3 className="text-white font-bold text-base sm:text-lg truncate">{data.main.title}</h3>
            <p className="text-[#A0A0A0] text-sm">{data.main.artist}</p>
            <div className="flex items-center gap-4 mt-2 text-xs sm:text-sm text-[#A0A0A0]">
              <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {data.main.views}</span>
              <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5 text-[#FF3B3B]" /> {data.main.likes}</span>
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {data.main.uploadDate}</span>
            </div>
          </div>
        </div>

        {/* Up Next — horizontal scroll */}
        <div className="mt-4">
          <h4 className="text-sm font-semibold text-[#A0A0A0] mb-3 tracking-wide uppercase">Up Next</h4>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-thin scrollbar-thumb-[#2A2A2A]">
            {data.upNext.map((v, i) => (
              <button
                key={i}
                className="flex-shrink-0 w-40 sm:w-48 bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg overflow-hidden hover:border-[#00C2FF]/50 transition-all group min-h-[44px]"
              >
                {/* Thumbnail */}
                <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
                  <div className="absolute inset-0 bg-gradient-to-br from-[#141414] to-[#0A0A0A]" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Play className="w-5 h-5 text-white/40 group-hover:text-white/80 transition-colors" />
                  </div>
                  <div className="absolute top-1.5 left-1.5 bg-[#C9A86A]/90 text-black text-[10px] font-bold px-1.5 py-0.5 rounded">
                    #{v.rank}
                  </div>
                </div>
                <div className="p-2">
                  <p className="text-white text-xs font-medium truncate">{v.title}</p>
                  <p className="text-[#A0A0A0] text-[10px] truncate">{v.artist}</p>
                  <p className="text-[#00C2FF] text-[10px] mt-0.5">{v.views} views</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        {/* Trending Now Video Player */}
        <TrendingNowPlayer />

        {/* Hero Panel - Current Momentum */}
        <div className="gradient-border-card hero-mesh">
          <div className="bg-[#0A0A0A]/90 rounded-lg p-4 sm:p-6 lg:p-8 relative noise-overlay">
            <div className="flex items-start justify-between mb-4 sm:mb-6">
              <div className="flex-1 min-w-0 mr-3">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2 gradient-text accent-cyan">CURRENT MOMENTUM</h2>
                <p className="text-sm sm:text-base text-[#A0A0A0] leading-relaxed">
                  You are trending in <span className="text-[#00C2FF] font-semibold">3 emerging markets</span> and{' '}
                  <span className="text-[#7B2EFF] font-semibold">2 underground podcast networks</span>.
                </p>
              </div>
              <Brain className="w-6 h-6 sm:w-8 sm:h-8 text-[#C9A86A] flex-shrink-0" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {/* Momentum Score */}
              <div className="text-center">
                <MomentumGauge score={momentumData.score} change={momentumData.change} />
                <div className="mt-4">
                  <div className="text-lg font-bold text-white">Momentum Score</div>
                  <div className="text-[#A0A0A0]">Real-time intelligence</div>
                </div>
              </div>

              {/* Top Region */}
              <div className="bg-[#141414]/80 border-t-2 border-t-[#00C2FF] rounded-lg p-4 card-glow dashboard-accent noise-overlay relative">
                <div className="flex items-center justify-between mb-3">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-[#00C2FF]" />
                  <span className="text-xs bg-[#00FF9C]/20 text-[#00FF9C] px-2 py-1 rounded-full font-medium">
                    Active
                  </span>
                </div>
                <div className="text-xl sm:text-2xl font-bold text-white mb-1 stat-number">{momentumData.topRegion}</div>
                <div className="text-[#A0A0A0] text-xs sm:text-sm">Top Region</div>
                <div className="text-[#00C2FF] text-xs sm:text-sm font-medium mt-2 flex items-center">
                  <ArrowUp className="w-3 h-3 mr-1" />
                  Early Surge
                </div>
              </div>

              {/* Trend Direction */}
              <div className="bg-[#141414]/80 border-t-2 border-t-[#00FF9C] rounded-lg p-4 card-glow dashboard-accent noise-overlay relative">
                <div className="flex items-center justify-between mb-3">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-[#00FF9C]" />
                  <div className="w-3 h-3 bg-[#00FF9C] rounded-full animate-pulse"></div>
                </div>
                <div className="text-xl sm:text-2xl font-bold text-white mb-1 stat-number">{momentumData.direction}</div>
                <div className="text-[#A0A0A0] text-xs sm:text-sm">Trend Direction</div>
                <div className="text-[#00FF9C] text-xs sm:text-sm font-medium mt-2">
                  +152% growth
                </div>
              </div>

              {/* AI Insight */}
              <div className="ai-insight-card rounded-lg p-4 relative">
                <div className="flex items-center mb-3">
                  <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-[#7B2EFF] mr-2" />
                  <span className="text-xs text-[#7B2EFF] font-medium tracking-wide">AI INSIGHT</span>
                </div>
                <p className="text-xs sm:text-sm text-white leading-relaxed">
                  Your sound is resonating in West Coast underground circles tied to nightlife DJs and Blxst&apos;s audience. 
                  Strike within 48 hours.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* New Mini-Widgets */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Street Buzz Mini-Widget */}
          <div className="bg-[#141414]/80 border border-[#2A2A2A] rounded-xl p-4 card-glow dashboard-accent noise-overlay relative">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-[#00FF9C]" />
                <h3 className="text-lg font-bold text-white">Street Buzz</h3>
              </div>
              <button className="text-[#00FF9C] hover:text-white text-xs">View All</button>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-[#A0A0A0] mb-2">Top Trending Cities</div>
              {dashboardWidgets.streetBuzz.topCities.map((city, index) => (
                <div key={city} className="flex items-center justify-between">
                  <span className="text-sm text-white">#{index + 1} {city}</span>
                  <div className="w-2 h-2 rounded-full bg-[#00FF9C] animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Events Mini-Widget */}
          <div className="bg-[#141414]/80 border border-[#2A2A2A] rounded-xl p-4 card-glow dashboard-accent noise-overlay relative">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-[#FFB800]" />
                <h3 className="text-lg font-bold text-white">Upcoming Events</h3>
              </div>
              <button className="text-[#FFB800] hover:text-white text-xs">View All</button>
            </div>
            <div className="space-y-3">
              {dashboardWidgets.upcomingEvents.map((event, index) => (
                <div key={index} className="bg-[#1E1E1E] rounded-lg p-3">
                  <div className="font-medium text-white text-sm">{event.name}</div>
                  <div className="text-xs text-[#A0A0A0] mt-1">{event.date} • {event.venue}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Submission Status Mini-Widget */}
          <div className="bg-[#141414]/80 border border-[#2A2A2A] rounded-xl p-4 card-glow dashboard-accent noise-overlay relative">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <Send className="w-5 h-5 text-[#00C2FF]" />
                <h3 className="text-lg font-bold text-white">Submissions</h3>
              </div>
              <button className="text-[#00C2FF] hover:text-white text-xs">View All</button>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#FFB800]">Pending</span>
                <span className="text-lg font-bold text-white">{dashboardWidgets.submissionStatus.pending}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#00FF9C]">Accepted</span>
                <span className="text-lg font-bold text-white">{dashboardWidgets.submissionStatus.accepted}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#7B2EFF]">Published</span>
                <span className="text-lg font-bold text-white">{dashboardWidgets.submissionStatus.published}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {quickStats.map((stat, index) => (
            <div key={index} className="bg-[#141414]/80 border-t-2 border-t-[#00C2FF] rounded-lg p-3 sm:p-4 card-glow dashboard-accent noise-overlay relative">
              <div className="text-lg sm:text-2xl font-bold text-white mb-1 stat-number">
                {stat.value}
              </div>
              <div className="text-[#A0A0A0] text-xs sm:text-sm mb-2 leading-tight">{stat.label}</div>
              <div className="text-[#00C2FF] text-xs sm:text-sm font-medium">{stat.change}</div>
            </div>
          ))}
        </div>

        {/* Section divider */}
        <div className="section-divider"></div>
        
        {/* Recent Activity Feed */}
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg sm:text-xl font-bold text-white gradient-text">Recent Activity</h3>
            <button className="text-[#00C2FF] hover:text-[#7B2EFF] text-xs sm:text-sm font-medium transition-colors">
              View All
            </button>
          </div>
          
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </div>
        </div>

        {/* Section divider */}
        <div className="section-divider purple"></div>
        
        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <button className="bg-[#141414]/80 hover:bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl p-3 sm:p-4 text-left transition-all duration-200 card-glow dashboard-accent group noise-overlay relative">
            <div className="flex items-center justify-between mb-3">
              <Radio className="w-5 h-5 sm:w-6 sm:h-6 text-[#00FF9C] group-hover:scale-110 transition-transform" />
              <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 text-[#A0A0A0]" />
            </div>
            <div className="text-white font-medium text-sm sm:text-base">Check Pulse</div>
            <div className="text-[#A0A0A0] text-xs sm:text-sm">View cultural signals</div>
          </button>

          <button className="bg-[#141414]/80 hover:bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl p-3 sm:p-4 text-left transition-all duration-200 card-glow dashboard-accent group noise-overlay relative">
            <div className="flex items-center justify-between mb-3">
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-[#C9A86A] group-hover:scale-110 transition-transform" />
              <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 text-[#A0A0A0]" />
            </div>
            <div className="text-white font-medium text-sm sm:text-base">LA Campaign</div>
            <div className="text-[#A0A0A0] text-xs sm:text-sm">Run geo-targeted push</div>
          </button>

          <button className="bg-[#141414]/80 hover:bg-[#0A0A0A] border border-[#FFB800] border-pulse rounded-xl p-3 sm:p-4 text-left transition-all duration-200 card-glow revenue-accent group noise-overlay relative">
            <div className="flex items-center justify-between mb-3">
              <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-[#FFB800] group-hover:scale-110 transition-transform" />
              <span className="w-2 h-2 bg-[#FF3B3B] rounded-full animate-pulse"></span>
            </div>
            <div className="text-white font-medium text-sm sm:text-base">Claim Revenue</div>
            <div className="text-[#FFB800] text-xs sm:text-sm font-medium">$4.5K unclaimed</div>
          </button>

          <button className="btn-gradient p-3 sm:p-4 text-left transition-all duration-200 group text-white rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <Play className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:scale-110 transition-transform" />
              <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 text-white/80" />
            </div>
            <div className="text-white font-medium text-sm sm:text-base">Run Strategy</div>
            <div className="text-white/80 text-xs sm:text-sm">AI recommendations</div>
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}