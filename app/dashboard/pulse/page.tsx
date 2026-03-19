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
      case 'Strong': return 'text-status-success bg-status-success/20';
      case 'Moderate': return 'text-accent-blue bg-accent-blue/20';
      case 'Weak': return 'text-text-secondary bg-text-secondary/20';
      default: return 'text-text-secondary bg-text-secondary/20';
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'Very Positive': return 'text-status-success bg-status-success/20';
      case 'Positive': return 'text-status-success bg-status-success/20';
      case 'Neutral': return 'text-accent-gold bg-accent-gold/20';
      case 'Negative': return 'text-status-danger bg-status-danger/20';
      default: return 'text-text-secondary bg-text-secondary/20';
    }
  };

  return (
    <div className="bg-primary-secondary rounded-lg p-6 card-glow border border-gray-800">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-accent-blue/20 text-accent-blue rounded-lg">
            {getIcon()}
          </div>
          <div>
            <h4 className="font-semibold text-text-primary">
              {type === 'podcast' ? item.show : item.publication}
            </h4>
            <p className="text-sm text-text-secondary">
              {type === 'podcast' ? item.episode : item.title}
            </p>
          </div>
        </div>
        <button className="text-text-secondary hover:text-accent-blue transition-colors">
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-3">
        {type === 'podcast' && (
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1 text-text-secondary">
              <Clock className="w-4 h-4" />
              <span>{item.timestamp}</span>
            </div>
            <div className="flex items-center space-x-1 text-text-secondary">
              <TrendingUp className="w-4 h-4" />
              <span>{item.reach} reach</span>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSentimentColor(item.sentiment)}`}>
              {item.sentiment}
            </span>
            {item.strength && (
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStrengthColor(item.strength)}`}>
                <Signal className="w-3 h-3 inline mr-1" />
                {item.strength}
              </span>
            )}
          </div>
          <span className="text-xs text-text-secondary">{item.date}</span>
        </div>

        {type === 'blog' && (
          <div className="text-sm text-text-secondary">
            Reach: <span className="text-accent-blue font-medium">{item.reach}</span>
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
        ? 'bg-accent-blue text-white shadow-lg' 
        : 'bg-primary-secondary text-text-secondary hover:text-text-primary hover:bg-gray-800'
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
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-text-primary mb-2">Cultural Pulse</h1>
            <p className="text-text-secondary">Track where your name is being mentioned across platforms</p>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-text-secondary" />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-primary-secondary border border-gray-800 text-text-primary rounded-lg px-3 py-2 text-sm"
            >
              <option value="24h">Last 24 hours</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
          </div>
        </div>

        {/* AI Insight Panel */}
        <div className="bg-gradient-to-br from-accent-purple/10 to-accent-blue/10 border border-accent-purple/20 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Brain className="w-6 h-6 text-accent-purple mr-3" />
            <h3 className="text-lg font-semibold text-text-primary">AI Cultural Insight</h3>
          </div>
          <p className="text-text-primary leading-relaxed">
            Your name is being mentioned alongside <strong className="text-accent-blue">Lil Baby</strong> and <strong className="text-accent-blue">21 Savage</strong> in Atlanta hip-hop discussions. 
            This association is strengthening across 3 major podcast networks and underground blog circles. The narrative is positioning you as part of the "next wave" 
            of Atlanta talent. <span className="text-accent-gold">Recommendation: Engage with this association through strategic collaborations or co-signs.</span>
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
            <h3 className="text-lg font-semibold text-text-primary flex items-center">
              <Radio className="w-5 h-5 mr-2 text-accent-blue" />
              Podcast Mentions ({podcastMentions.length})
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {podcastMentions.map((mention) => (
                <PulseCard key={mention.id} item={mention} type="podcast" />
              ))}
            </div>
          </div>
        )}

        {/* Blog Features */}
        {(activeFilter === 'all' || activeFilter === 'blogs') && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-text-primary flex items-center">
              <BookOpen className="w-5 h-5 mr-2 text-accent-purple" />
              Blog Features ({blogFeatures.length})
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {blogFeatures.map((feature) => (
                <PulseCard key={feature.id} item={feature} type="blog" />
              ))}
            </div>
          </div>
        )}

        {/* Forum Activity */}
        {(activeFilter === 'all' || activeFilter === 'forums') && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-text-primary flex items-center">
              <MessageCircle className="w-5 h-5 mr-2 text-accent-gold" />
              Forum Activity (8)
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-primary-secondary rounded-lg p-6 card-glow border border-gray-800">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-accent-gold/20 text-accent-gold rounded-lg">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-text-primary">r/hiphopheads</h4>
                      <p className="text-sm text-text-secondary">Atlanta's Underground Scene Discussion</p>
                    </div>
                  </div>
                  <button className="text-text-secondary hover:text-accent-blue transition-colors">
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-3">
                  <div className="text-sm text-text-secondary">
                    <span className="text-accent-blue">+847 upvotes</span> • <span className="text-accent-purple">234 comments</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-1 rounded-full text-xs font-medium text-status-success bg-status-success/20">
                      Positive
                    </span>
                    <span className="text-xs text-text-secondary">2024-03-18</span>
                  </div>
                </div>
              </div>

              <div className="bg-primary-secondary rounded-lg p-6 card-glow border border-gray-800">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-accent-gold/20 text-accent-gold rounded-lg">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-text-primary">KanyeToThe</h4>
                      <p className="text-sm text-text-secondary">Next Up: ATL Edition</p>
                    </div>
                  </div>
                  <button className="text-text-secondary hover:text-accent-blue transition-colors">
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-3">
                  <div className="text-sm text-text-secondary">
                    <span className="text-accent-blue">+234 likes</span> • <span className="text-accent-purple">89 replies</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-1 rounded-full text-xs font-medium text-status-success bg-status-success/20">
                      Very Positive
                    </span>
                    <span className="text-xs text-text-secondary">2024-03-17</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Social Mentions */}
        {(activeFilter === 'all' || activeFilter === 'social') && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-text-primary flex items-center">
              <Hash className="w-5 h-5 mr-2 text-status-success" />
              Social Media Mentions (47)
            </h3>
            <div className="bg-primary-secondary rounded-lg p-6 border border-gray-800">
              <div className="text-center text-text-secondary">
                <Hash className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Social media tracking coming soon</p>
                <p className="text-sm mt-2">Connect your social accounts to track mentions</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}