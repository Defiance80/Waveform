'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/ui/DashboardLayout';
import { 
  Radio, TrendingUp, DollarSign, AlertTriangle, Star, Plus,
  BarChart3, Clock, Users, Zap, Target, ExternalLink, Calendar
} from 'lucide-react';
import { activeCampaigns, reputationData, viralMoments } from '@/data/mockData';

const CampaignCard = ({ campaign }: { campaign: any }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'text-[#00FF9C] bg-[#00FF9C]/20';
      case 'Planning': return 'text-[#FFB800] bg-[#FFB800]/20';
      case 'Complete': return 'text-[#00C2FF] bg-[#00C2FF]/20';
      case 'Paused': return 'text-[#FF3B3B] bg-[#FF3B3B]/20';
      default: return 'text-[#A0A0A0] bg-[#A0A0A0]/20';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'PR': return <Radio className="w-4 h-4" />;
      case 'Social': return <Zap className="w-4 h-4" />;
      case 'Radio': return <Radio className="w-4 h-4" />;
      case 'Digital': return <Target className="w-4 h-4" />;
      default: return <BarChart3 className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-[#141414] border border-[#2A2A2A] rounded-xl p-6 hover:bg-[#121212] transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-[#7B2EFF]/20 rounded-lg text-[#7B2EFF]">
            {getTypeIcon(campaign.type)}
          </div>
          <div>
            <h3 className="text-lg font-bold text-white mb-1">{campaign.name}</h3>
            <div className="flex items-center gap-3 text-sm text-[#A0A0A0]">
              <span>{campaign.type}</span>
              <span>•</span>
              <span>{campaign.startDate} - {campaign.endDate}</span>
            </div>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
          {campaign.status}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="text-xl font-bold text-white">{campaign.reach}</div>
          <div className="text-xs text-[#A0A0A0]">Reach</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-[#00C2FF]">{campaign.impressions}</div>
          <div className="text-xs text-[#A0A0A0]">Impressions</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-[#7B2EFF]">{campaign.progress}%</div>
          <div className="text-xs text-[#A0A0A0]">Progress</div>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm text-[#A0A0A0] mb-2">
          <span>Campaign Progress</span>
          <span>{campaign.progress}%</span>
        </div>
        <div className="w-full bg-[#1E1E1E] rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-[#7B2EFF] to-[#FF006E] h-2 rounded-full transition-all"
            style={{ width: `${campaign.progress}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm">
          <span className="text-[#A0A0A0]">Budget: </span>
          <span className="text-white font-medium">{campaign.spent} / {campaign.budget}</span>
        </div>
        <button className="text-[#7B2EFF] hover:text-white flex items-center gap-1 text-sm">
          View Details <ExternalLink className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};

const SentimentGauge = ({ positive, negative, neutral }: { positive: number; negative: number; neutral: number }) => {
  const total = positive + negative + neutral;
  const positivePercent = (positive / total) * 100;
  const negativePercent = (negative / total) * 100;
  const neutralPercent = (neutral / total) * 100;

  return (
    <div className="space-y-4">
      <div className="text-center">
        <div className="text-3xl font-bold text-white mb-1">{positive}%</div>
        <div className="text-sm text-[#A0A0A0]">Positive Sentiment</div>
      </div>
      
      <div className="space-y-2">
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-[#00FF9C]">Positive</span>
            <span className="text-xs text-white">{positive}%</span>
          </div>
          <div className="w-full bg-[#1E1E1E] rounded-full h-2">
            <div className="bg-[#00FF9C] h-2 rounded-full" style={{ width: `${positivePercent}%` }}></div>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-[#FF3B3B]">Negative</span>
            <span className="text-xs text-white">{negative}%</span>
          </div>
          <div className="w-full bg-[#1E1E1E] rounded-full h-2">
            <div className="bg-[#FF3B3B] h-2 rounded-full" style={{ width: `${negativePercent}%` }}></div>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-[#A0A0A0]">Neutral</span>
            <span className="text-xs text-white">{neutral}%</span>
          </div>
          <div className="w-full bg-[#1E1E1E] rounded-full h-2">
            <div className="bg-[#A0A0A0] h-2 rounded-full" style={{ width: `${neutralPercent}%` }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ViralMomentCard = ({ moment }: { moment: any }) => {
  return (
    <div className="bg-[#141414] border border-[#2A2A2A] rounded-xl p-4 hover:bg-[#121212] transition-all">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-bold text-white text-sm mb-1">{moment.title}</h4>
          <div className="flex items-center gap-2 text-xs text-[#A0A0A0]">
            <span>{moment.platform}</span>
            <span>•</span>
            <span>{moment.peakDate}</span>
          </div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-[#FF006E]">{moment.views}</div>
          <div className="text-xs text-[#A0A0A0]">Views</div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <div className="text-[#A0A0A0]">Shares</div>
          <div className="text-white font-medium">{moment.shares}</div>
        </div>
        <div>
          <div className="text-[#A0A0A0]">Engagement</div>
          <div className="text-[#00FF9C] font-medium">{moment.engagement}</div>
        </div>
      </div>
    </div>
  );
};

export default function PRPage() {
  const [activeTab, setActiveTab] = useState('campaigns');
  const [showNewCampaign, setShowNewCampaign] = useState(false);

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              <span className="bg-gradient-to-r from-[#7B2EFF] to-[#FF006E] bg-clip-text text-transparent">
                PR & Campaign Manager
              </span>
            </h1>
            <p className="text-[#A0A0A0]">Manage campaigns, track reputation, and monitor viral moments</p>
          </div>
          <button 
            onClick={() => setShowNewCampaign(true)}
            className="flex items-center gap-2 bg-[#7B2EFF] hover:bg-[#FF006E] text-white px-4 py-2 rounded-xl font-medium transition-all"
          >
            <Plus className="w-4 h-4" />
            New Campaign
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-[#141414] border border-[#2A2A2A] rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <BarChart3 className="w-5 h-5 text-[#7B2EFF]" />
              <TrendingUp className="w-4 h-4 text-[#00FF9C]" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">3</div>
            <div className="text-sm text-[#A0A0A0]">Active Campaigns</div>
            <div className="text-xs text-[#00FF9C] mt-1">2 performing well</div>
          </div>

          <div className="bg-[#141414] border border-[#2A2A2A] rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <Users className="w-5 h-5 text-[#00C2FF]" />
              <Star className="w-4 h-4 text-[#FFB800]" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">7.3M</div>
            <div className="text-sm text-[#A0A0A0]">Total Reach</div>
            <div className="text-xs text-[#FFB800] mt-1">26.1M impressions</div>
          </div>

          <div className="bg-[#141414] border border-[#2A2A2A] rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <Target className="w-5 h-5 text-[#00FF9C]" />
              <AlertTriangle className="w-4 h-4 text-[#FF3B3B]" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">78%</div>
            <div className="text-sm text-[#A0A0A0]">Positive Sentiment</div>
            <div className="text-xs text-[#00FF9C] mt-1">+12% this month</div>
          </div>

          <div className="bg-[#141414] border border-[#2A2A2A] rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <DollarSign className="w-5 h-5 text-[#FFB800]" />
              <BarChart3 className="w-4 h-4 text-[#7B2EFF]" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">$48K</div>
            <div className="text-sm text-[#A0A0A0]">Total Budget</div>
            <div className="text-xs text-[#7B2EFF] mt-1">$28.25K spent</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-[#141414] p-1 rounded-xl border border-[#2A2A2A] w-fit">
          <button
            onClick={() => setActiveTab('campaigns')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'campaigns' 
                ? 'bg-[#7B2EFF] text-white' 
                : 'text-[#A0A0A0] hover:text-white'
            }`}
          >
            Active Campaigns
          </button>
          <button
            onClick={() => setActiveTab('reputation')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'reputation' 
                ? 'bg-[#7B2EFF] text-white' 
                : 'text-[#A0A0A0] hover:text-white'
            }`}
          >
            Reputation Manager
          </button>
          <button
            onClick={() => setActiveTab('viral')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'viral' 
                ? 'bg-[#7B2EFF] text-white' 
                : 'text-[#A0A0A0] hover:text-white'
            }`}
          >
            Viral Moments
          </button>
          <button
            onClick={() => setActiveTab('distribution')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'distribution' 
                ? 'bg-[#7B2EFF] text-white' 
                : 'text-[#A0A0A0] hover:text-white'
            }`}
          >
            PR Distribution
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'campaigns' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white">Active Campaigns</h2>
            <div className="grid gap-4">
              {activeCampaigns.map((campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'reputation' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white">Reputation Manager</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Sentiment Gauge */}
              <div className="bg-[#141414] border border-[#2A2A2A] rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Star className="w-5 h-5 text-[#FFB800]" />
                  <h3 className="text-lg font-bold text-white">Sentiment Analysis</h3>
                </div>
                <SentimentGauge 
                  positive={reputationData.sentiment.positive} 
                  negative={reputationData.sentiment.negative} 
                  neutral={reputationData.sentiment.neutral} 
                />
                <div className="mt-4 pt-4 border-t border-[#333333]">
                  <div className="text-sm text-[#A0A0A0]">
                    Total Mentions: <span className="text-white font-medium">{reputationData.totalMentions.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Recent Mentions */}
              <div className="bg-[#141414] border border-[#2A2A2A] rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Radio className="w-5 h-5 text-[#00C2FF]" />
                  <h3 className="text-lg font-bold text-white">Recent Press Mentions</h3>
                </div>
                <div className="space-y-4">
                  {reputationData.recentMentions.map((mention) => (
                    <div key={mention.id} className="p-3 bg-[#1E1E1E] rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div className="font-medium text-white text-sm">{mention.source}</div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            mention.sentiment === 'Positive' 
                              ? 'bg-[#00FF9C]/20 text-[#00FF9C]' 
                              : 'bg-[#FF3B3B]/20 text-[#FF3B3B]'
                          }`}>
                            {mention.sentiment}
                          </span>
                          <span className="text-xs text-[#A0A0A0]">{mention.reach} reach</span>
                        </div>
                      </div>
                      <p className="text-sm text-[#A0A0A0] mb-1">{mention.content}</p>
                      <div className="text-xs text-[#555555]">{mention.date}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Crisis Alerts */}
            <div className="bg-[#141414] border border-[#FF3B3B] rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-5 h-5 text-[#FF3B3B]" />
                <h3 className="text-lg font-bold text-white">Crisis Alert Center</h3>
                <span className="px-2 py-1 bg-[#00FF9C]/20 text-[#00FF9C] text-xs rounded-full">All Clear</span>
              </div>
              <p className="text-sm text-[#A0A0A0]">
                No crisis indicators detected. Your reputation sentiment is healthy with 78% positive mentions.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'viral' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white">Viral Moments Tracker</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {viralMoments.map((moment) => (
                <ViralMomentCard key={moment.id} moment={moment} />
              ))}
            </div>

            {/* Viral Trends */}
            <div className="bg-[#141414] border border-[#2A2A2A] rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Viral Content Analysis</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-[#A0A0A0]">TikTok Performance</span>
                    <span className="text-sm text-white font-medium">Leading Platform</span>
                  </div>
                  <div className="w-full bg-[#1E1E1E] rounded-full h-2">
                    <div className="bg-[#FF006E] h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-[#A0A0A0]">Instagram Reels</span>
                    <span className="text-sm text-white font-medium">Growing</span>
                  </div>
                  <div className="w-full bg-[#1E1E1E] rounded-full h-2">
                    <div className="bg-[#FFB800] h-2 rounded-full" style={{ width: '67%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-[#A0A0A0]">YouTube Shorts</span>
                    <span className="text-sm text-white font-medium">Emerging</span>
                  </div>
                  <div className="w-full bg-[#1E1E1E] rounded-full h-2">
                    <div className="bg-[#00C2FF] h-2 rounded-full" style={{ width: '43%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'distribution' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white">PR Distribution Progress</h2>
            
            {/* Distribution Pipeline */}
            <div className="bg-[#141414] border border-[#2A2A2A] rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-6">Distribution Pipeline</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-[#FFB800] rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-black font-bold">1</span>
                  </div>
                  <div className="text-sm font-medium text-white">Submission</div>
                  <div className="text-xs text-[#A0A0A0]">Prepare content</div>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-[#00C2FF] rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-black font-bold">2</span>
                  </div>
                  <div className="text-sm font-medium text-white">Review</div>
                  <div className="text-xs text-[#A0A0A0]">Editorial process</div>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-[#7B2EFF] rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-white font-bold">3</span>
                  </div>
                  <div className="text-sm font-medium text-white">Scheduled</div>
                  <div className="text-xs text-[#A0A0A0]">Ready to publish</div>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-[#00FF9C] rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-black font-bold">4</span>
                  </div>
                  <div className="text-sm font-medium text-white">Published</div>
                  <div className="text-xs text-[#A0A0A0]">Live content</div>
                </div>
              </div>
              
              {/* Current Submissions */}
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-[#1E1E1E] rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-[#00C2FF] rounded-full"></div>
                    <span className="text-white font-medium">Complex Magazine Feature</span>
                  </div>
                  <span className="text-xs text-[#00C2FF] bg-[#00C2FF]/20 px-2 py-1 rounded-full">Under Review</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-[#1E1E1E] rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-[#7B2EFF] rounded-full"></div>
                    <span className="text-white font-medium">XXL Freshman Interview</span>
                  </div>
                  <span className="text-xs text-[#7B2EFF] bg-[#7B2EFF]/20 px-2 py-1 rounded-full">Scheduled</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-[#1E1E1E] rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-[#00FF9C] rounded-full"></div>
                    <span className="text-white font-medium">The FADER Profile</span>
                  </div>
                  <span className="text-xs text-[#00FF9C] bg-[#00FF9C]/20 px-2 py-1 rounded-full">Published</span>
                </div>
              </div>
            </div>

            {/* Budget Tracking */}
            <div className="bg-[#141414] border border-[#2A2A2A] rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Campaign Budget Tracking</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-1">$48,000</div>
                  <div className="text-sm text-[#A0A0A0] mb-2">Total Budget</div>
                  <div className="w-full bg-[#1E1E1E] rounded-full h-2">
                    <div className="bg-[#7B2EFF] h-2 rounded-full" style={{ width: '59%' }}></div>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#FFB800] mb-1">$28,250</div>
                  <div className="text-sm text-[#A0A0A0] mb-2">Spent (59%)</div>
                  <div className="text-xs text-[#00FF9C]">On track</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#00FF9C] mb-1">$19,750</div>
                  <div className="text-sm text-[#A0A0A0] mb-2">Remaining</div>
                  <div className="text-xs text-[#A0A0A0]">41% left</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* New Campaign Modal */}
        {showNewCampaign && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#141414] border border-[#2A2A2A] rounded-xl p-6 w-full max-w-md">
              <h3 className="text-lg font-bold text-white mb-4">Create New Campaign</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#A0A0A0] mb-2">Campaign Name</label>
                  <input 
                    type="text" 
                    placeholder="Campaign name" 
                    className="w-full bg-[#1E1E1E] border border-[#333333] rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#A0A0A0] mb-2">Campaign Type</label>
                  <select className="w-full bg-[#1E1E1E] border border-[#333333] rounded-lg px-3 py-2 text-white">
                    <option>PR</option>
                    <option>Social Media</option>
                    <option>Radio</option>
                    <option>Digital Marketing</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#A0A0A0] mb-2">Budget</label>
                    <input 
                      type="number" 
                      placeholder="$0" 
                      className="w-full bg-[#1E1E1E] border border-[#333333] rounded-lg px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#A0A0A0] mb-2">Duration (days)</label>
                    <input 
                      type="number" 
                      placeholder="30" 
                      className="w-full bg-[#1E1E1E] border border-[#333333] rounded-lg px-3 py-2 text-white"
                    />
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <button 
                    onClick={() => setShowNewCampaign(false)}
                    className="flex-1 bg-[#1E1E1E] text-white px-4 py-2 rounded-lg hover:bg-[#2A2A2A] transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => setShowNewCampaign(false)}
                    className="flex-1 bg-[#7B2EFF] hover:bg-[#FF006E] text-white px-4 py-2 rounded-lg font-medium transition-all"
                  >
                    Create Campaign
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}