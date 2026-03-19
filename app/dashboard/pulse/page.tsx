'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/ui/DashboardLayout';
import { 
  Radio, 
  Brain, 
  Filter, 
  ExternalLink, 
  Clock, 
  TrendingUp,
  MessageCircle,
  BookOpen,
  Hash,
  Signal
} from 'lucide-react';
import { podcastMentions, blogFeatures } from '@/data/mockData';

const PulseCard = ({ item, type }: { item: any; type: 'podcast' | 'blog' | 'forum' | 'social' }) => {
  const getIcon = () => {
    switch (type) {
      case 'podcast': return <Radio className="w-5 h-5" />;
      case 'blog': return <BookOpen className="w-5 h-5" />;
      case 'forum': return <MessageCircle className="w-5 h-5" />;
      case 'social': return <Hash className="w-5 h-5" />;
    }
  };

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'Strong': return 'text-[#00FF9C] bg-[#00FF9C]/20';
      case 'Moderate': return 'text-[#00C2FF] bg-[#00C2FF]/20';
      case 'Weak': return 'text-[#A0A0A0] bg-text-secondary/20';
      default: return 'text-[#A0A0A0] bg-text-secondary/20';
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'Very Positive': return 'text-[#00FF9C] bg-[#00FF9C]/20';
      case 'Positive': return 'text-[#00FF9C] bg-[#00FF9C]/20';
      case 'Neutral': return 'text-[#C9A86A] bg-[#C9A86A]/20';
      case 'Negative': return 'text-[#FF3B3B] bg-[#FF3B3B]/20';
      default: return 'text-[#A0A0A0] bg-text-secondary/20';
    }
  };

  return (
    <div className="bg-[#141414]/80 border-t-2 border-t-[#00FF9C] rounded-lg p-4 sm:p-6 card-glow pulse-accent border border-[#2A2A2A] noise-overlay relative">
      <div className="flex items-start justify-between mb-4 gap-3">
        <div className="flex items-start space-x-3 min-w-0 flex-1">
          <div className="p-2 bg-[#00FF9C]/20 text-[#00FF9C] rounded-lg flex-shrink-0">
            {getIcon()}
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="font-semibold text-white text-sm sm:text-base truncate">
              {type === 'podcast' ? item.show : item.publication}
            </h4>
            <p className="text-xs sm:text-sm text-[#A0A0A0] mt-1 leading-relaxed">
              {type === 'podcast' ? item.episode : item.title}
            </p>
          </div>
        </div>
        <button className="text-[#A0A0A0] hover:text-[#00FF9C] transition-colors flex-shrink-0">
          <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
        </button>
      </div>

      <div className="space-y-3">
        {type === 'podcast' && (
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1 text-[#A0A0A0]">
              <Clock className="w-4 h-4" />
              <span>{item.timestamp}</span>
            </div>
            <div className="flex items-center space-x-1 text-[#A0A0A0]">
              <TrendingUp className="w-4 h-4" />
              <span>{item.reach} reach</span>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center space-x-2 min-w-0 flex-1">
            <span className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${getSentimentColor(item.sentiment)}`}>
              {item.sentiment}
            </span>
            {item.strength && (
              <span className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${getStrengthColor(item.strength)}`}>
                <Signal className="w-3 h-3 inline mr-1" />
                {item.strength}
              </span>
            )}
          </div>
          <span className="text-xs text-[#A0A0A0] flex-shrink-0">{item.date}</span>
        </div>

        {type === 'blog' && (
          <div className="text-sm text-[#A0A0A0]">
            Reach: <span className="text-[#00C2FF] font-medium">{item.reach}</span>
          </div>
        )}
      </div>
    </div>
  );
};

const FilterButton = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
      active 
        ? 'bg-[#00C2FF] text-white shadow-lg' 
        : 'bg-[#141414] text-[#A0A0A0] hover:text-white hover:bg-gray-800'
    }`}
  >
    {children}
  </button>
);

export default function PulsePage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [timeRange, setTimeRange] = useState('7d');

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2 gradient-text accent-cyan">
              <Radio className="w-5 h-5 sm:w-6 sm:h-6 inline mr-2 text-[#00FF9C]" />
              Cultural Pulse
            </h1>
            <p className="text-sm sm:text-base text-[#A0A0A0]">Track where your name is being mentioned across platforms</p>
          </div>
          <div className="flex items-center space-x-2 flex-shrink-0">
            <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-[#A0A0A0]" />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-[#141414] border border-[#2A2A2A] text-white rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm min-w-[120px]"
            >
              <option value="24h">Last 24 hours</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
          </div>
        </div>

        {/* AI Insight Panel */}
        <div className="ai-insight-card rounded-lg p-4 sm:p-6 relative">
          <div className="flex items-center mb-4">
            <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-[#7B2EFF] mr-3" />
            <h3 className="text-base sm:text-lg font-semibold text-white">AI Cultural Insight</h3>
          </div>
          <p className="text-sm sm:text-base text-white leading-relaxed">
            Your name is being mentioned alongside <strong className="text-[#00FF9C]">Blxst</strong> and <strong className="text-[#00FF9C]">Roddy Ricch</strong> in West Coast hip-hop discussions. 
            This association is strengthening across 3 major podcast networks and underground blog circles. The narrative is positioning you as part of the &quot;next wave&quot; 
            of LA talent. <span className="text-[#C9A86A]">Recommendation: Engage with this association through strategic collaborations or co-signs.</span>
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          <FilterButton active={activeFilter === 'all'} onClick={() => setActiveFilter('all')}>
            All Mentions
          </FilterButton>
          <FilterButton active={activeFilter === 'podcasts'} onClick={() => setActiveFilter('podcasts')}>
            Podcasts
          </FilterButton>
          <FilterButton active={activeFilter === 'blogs'} onClick={() => setActiveFilter('blogs')}>
            Blog Features
          </FilterButton>
          <FilterButton active={activeFilter === 'forums'} onClick={() => setActiveFilter('forums')}>
            Forum Activity
          </FilterButton>
          <FilterButton active={activeFilter === 'social'} onClick={() => setActiveFilter('social')}>
            Social Mentions
          </FilterButton>
        </div>

        {/* Podcast Mentions */}
        {(activeFilter === 'all' || activeFilter === 'podcasts') && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <Radio className="w-5 h-5 mr-2 text-[#00C2FF]" />
              Podcast Mentions ({podcastMentions.length})
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
              {podcastMentions.map((mention) => (
                <PulseCard key={mention.id} item={mention} type="podcast" />
              ))}
            </div>
          </div>
        )}

        {/* Blog Features */}
        {(activeFilter === 'all' || activeFilter === 'blogs') && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <BookOpen className="w-5 h-5 mr-2 text-[#7B2EFF]" />
              Blog Features ({blogFeatures.length})
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
              {blogFeatures.map((feature) => (
                <PulseCard key={feature.id} item={feature} type="blog" />
              ))}
            </div>
          </div>
        )}

        {/* Forum Activity */}
        {(activeFilter === 'all' || activeFilter === 'forums') && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <MessageCircle className="w-5 h-5 mr-2 text-[#C9A86A]" />
              Forum Activity (8)
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
              <div className="bg-[#141414]/80 border-t-2 border-t-[#C9A86A] rounded-lg p-4 sm:p-6 card-glow pulse-accent border border-[#2A2A2A] noise-overlay relative">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-[#C9A86A]/20 text-[#C9A86A] rounded-lg">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">r/hiphopheads</h4>
                      <p className="text-sm text-[#A0A0A0]">LA&apos;s Underground Scene Discussion</p>
                    </div>
                  </div>
                  <button className="text-[#A0A0A0] hover:text-[#00C2FF] transition-colors">
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-3">
                  <div className="text-sm text-[#A0A0A0]">
                    <span className="text-[#00C2FF]">+847 upvotes</span> • <span className="text-[#7B2EFF]">234 comments</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-1 rounded-full text-xs font-medium text-[#00FF9C] bg-[#00FF9C]/20">
                      Positive
                    </span>
                    <span className="text-xs text-[#A0A0A0]">2024-03-18</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#141414]/80 border-t-2 border-t-[#C9A86A] rounded-lg p-4 sm:p-6 card-glow pulse-accent border border-[#2A2A2A] noise-overlay relative">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-[#C9A86A]/20 text-[#C9A86A] rounded-lg">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">KanyeToThe</h4>
                      <p className="text-sm text-[#A0A0A0]">Next Up: West Coast Edition</p>
                    </div>
                  </div>
                  <button className="text-[#A0A0A0] hover:text-[#00C2FF] transition-colors">
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-3">
                  <div className="text-sm text-[#A0A0A0]">
                    <span className="text-[#00C2FF]">+234 likes</span> • <span className="text-[#7B2EFF]">89 replies</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-1 rounded-full text-xs font-medium text-[#00FF9C] bg-[#00FF9C]/20">
                      Very Positive
                    </span>
                    <span className="text-xs text-[#A0A0A0]">2024-03-17</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Social Mentions */}
        {(activeFilter === 'all' || activeFilter === 'social') && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <Hash className="w-5 h-5 mr-2 text-[#00FF9C]" />
              Social Media Mentions (47)
            </h3>
            <div className="bg-[#141414]/80 border border-[#2A2A2A] rounded-lg p-4 sm:p-6 noise-overlay relative">
              <div className="text-center text-[#A0A0A0]">
                <Hash className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-4 opacity-50" />
                <p className="text-sm sm:text-base">Social media tracking coming soon</p>
                <p className="text-xs sm:text-sm mt-2">Connect your social accounts to track mentions</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}