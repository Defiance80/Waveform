'use client';

import React from 'react';
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
  Play
} from 'lucide-react';
import { momentumData, quickStats, recentActivity, artistProfile, dashboardWidgets } from '@/data/mockData';

const MomentumGauge = ({ score, change }: { score: number; change: number }) => {
  const circumference = 2 * Math.PI * 45;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="relative w-32 h-32">
      <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="8"
          fill="transparent"
        />
        {/* Progress circle */}
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
        {/* Gradient definition */}
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
      case 'High': return 'border-l-status-success';
      case 'Medium': return 'border-l-accent-blue';
      default: return 'border-l-text-secondary';
    }
  };

  return (
    <div className={`bg-[#111111]/80 rounded-lg p-3 sm:p-4 border-l-4 ${getColor(activity.impact)} card-glow dashboard-accent noise-overlay relative`}>
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
            : 'bg-text-secondary/20 text-[#A0A0A0]'
        }`}>
          {activity.impact}
        </span>
      </div>
    </div>
  );
};

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
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
              <div className="bg-[#111111]/80 border-t-2 border-t-[#00C2FF] rounded-lg p-4 card-glow dashboard-accent noise-overlay relative">
                <div className="flex items-center justify-between mb-3">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-[#00C2FF]" />
                  <span className="status-dot active"></span>
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
              <div className="bg-[#111111]/80 border-t-2 border-t-[#00FF9C] rounded-lg p-4 card-glow dashboard-accent noise-overlay relative">
                <div className="flex items-center justify-between mb-3">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-[#00FF9C]" />
                  <div className="w-3 h-3 bg-[#00FF9C] rounded-full animate-pulse-dot"></div>
                </div>
                <div className="text-xl sm:text-2xl font-bold text-white mb-1 stat-number">{momentumData.direction}</div>
                <div className="text-[#A0A0A0] text-xs sm:text-sm">Trend Direction</div>
                <div className="text-[#00FF9C] text-xs sm:text-sm font-medium mt-2">
                  +127% growth
                </div>
              </div>

              {/* AI Insight */}
              <div className="ai-insight-card rounded-lg p-4 relative">
                <div className="flex items-center mb-3">
                  <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-[#7B2EFF] mr-2" />
                  <span className="text-xs text-[#7B2EFF] font-medium tracking-wide">AI INSIGHT</span>
                </div>
                <p className="text-xs sm:text-sm text-white leading-relaxed">
                  Your sound is resonating in underground Atlanta circles tied to nightlife DJs. 
                  Strike within 48 hours.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {quickStats.map((stat, index) => (
            <div key={index} className="bg-[#111111]/80 border-t-2 border-t-[#00C2FF] rounded-lg p-3 sm:p-4 card-glow dashboard-accent noise-overlay relative">
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
          <button className="bg-[#111111]/80 hover:bg-[#0A0A0A] border border-[#1E1E1E] rounded-xl p-3 sm:p-4 text-left transition-all duration-200 card-glow dashboard-accent group noise-overlay relative">
            <div className="flex items-center justify-between mb-3">
              <Radio className="w-5 h-5 sm:w-6 sm:h-6 text-[#00FF9C] group-hover:scale-110 transition-transform" />
              <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 text-[#A0A0A0]" />
            </div>
            <div className="text-white font-medium text-sm sm:text-base">Check Pulse</div>
            <div className="text-[#A0A0A0] text-xs sm:text-sm">View cultural signals</div>
          </button>

          <button className="bg-[#111111]/80 hover:bg-[#0A0A0A] border border-[#1E1E1E] rounded-xl p-3 sm:p-4 text-left transition-all duration-200 card-glow dashboard-accent group noise-overlay relative">
            <div className="flex items-center justify-between mb-3">
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-[#C9A86A] group-hover:scale-110 transition-transform" />
              <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 text-[#A0A0A0]" />
            </div>
            <div className="text-white font-medium text-sm sm:text-base">Atlanta Campaign</div>
            <div className="text-[#A0A0A0] text-xs sm:text-sm">Run geo-targeted push</div>
          </button>

          <button className="bg-[#111111]/80 hover:bg-[#0A0A0A] border border-[#FFB800] border-pulse rounded-xl p-3 sm:p-4 text-left transition-all duration-200 card-glow revenue-accent group noise-overlay relative">
            <div className="flex items-center justify-between mb-3">
              <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-[#FFB800] group-hover:scale-110 transition-transform" />
              <span className="status-dot urgent"></span>
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