'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/ui/DashboardLayout';
import { 
  Zap, 
  Brain, 
  Play,
  Share2,
  Heart,
  Bookmark,
  TrendingUp,
  Eye,
  ArrowRight,
  Clock,
  Users,
  Music
} from 'lucide-react';
import { viralClips } from '@/data/mockData';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

const ClipCard = ({ clip }: { clip: any }) => {
  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'TikTok': return 'bg-black text-white';
      case 'Instagram': return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white';
      case 'YouTube': return 'bg-red-600 text-white';
      case 'Twitter': return 'bg-blue-500 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  return (
    <div className="bg-primary-secondary rounded-lg p-6 card-glow border border-gray-800">
      <div className="flex items-start space-x-4 mb-4">
        <div className="w-20 h-14 bg-gray-800 rounded-lg flex items-center justify-center">
          <Play className="w-6 h-6 text-accent-blue" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-text-primary mb-2">{clip.title}</h4>
          <div className="flex flex-wrap gap-1 mb-3">
            {clip.platforms.map((platform: string, index: number) => (
              <span
                key={index}
                className={`px-2 py-1 rounded-full text-xs font-medium ${getPlatformColor(platform)}`}
              >
                {platform}
              </span>
            ))}
          </div>
          <div className="text-sm text-text-secondary">
            Started on <span className="text-accent-blue">{clip.originalPlatform}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <div className="flex items-center justify-center text-accent-blue mb-1">
            <Eye className="w-4 h-4 mr-1" />
            <span className="font-bold">{clip.views}</span>
          </div>
          <div className="text-xs text-text-secondary">Views</div>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center text-accent-purple mb-1">
            <Share2 className="w-4 h-4 mr-1" />
            <span className="font-bold">{clip.shares}</span>
          </div>
          <div className="text-xs text-text-secondary">Shares</div>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center text-accent-gold mb-1">
            <Bookmark className="w-4 h-4 mr-1" />
            <span className="font-bold">{clip.saves}</span>
          </div>
          <div className="text-xs text-text-secondary">Saves</div>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center text-status-success mb-1">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span className="font-bold">{clip.velocity}</span>
          </div>
          <div className="text-xs text-text-secondary">Velocity</div>
        </div>
      </div>

      <button className="w-full bg-primary-bg hover:bg-gray-900 border border-gray-700 rounded-lg py-2 text-sm font-medium text-text-primary transition-colors">
        View Analytics
      </button>
    </div>
  );
};

const PlatformFlow = ({ flow }: { flow: string[] }) => (
  <div className="flex items-center space-x-2 bg-primary-secondary rounded-lg p-4 border border-gray-800">
    {flow.map((platform, index) => (
      <React.Fragment key={index}>
        <div className="flex flex-col items-center">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold ${
            platform === 'TikTok' ? 'bg-black text-white' :
            platform === 'Instagram' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' :
            platform === 'YouTube' ? 'bg-red-600 text-white' :
            'bg-blue-500 text-white'
          }`}>
            {platform.slice(0, 2).toUpperCase()}
          </div>
          <span className="text-xs text-text-secondary mt-1">{platform}</span>
        </div>
        {index < flow.length - 1 && (
          <ArrowRight className="w-4 h-4 text-accent-blue" />
        )}
      </React.Fragment>
    ))}
  </div>
);

export default function EchoPage() {
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');

  // Mock data for content velocity chart
  const velocityData = [
    { name: 'Mon', views: 45000, shares: 1200, saves: 800 },
    { name: 'Tue', views: 67000, shares: 1800, saves: 1200 },
    { name: 'Wed', views: 89000, shares: 2400, saves: 1600 },
    { name: 'Thu', views: 125000, shares: 3200, saves: 2100 },
    { name: 'Fri', views: 178000, shares: 4500, saves: 2800 },
    { name: 'Sat', views: 234000, shares: 6200, saves: 3900 },
    { name: 'Sun', views: 289000, shares: 7800, saves: 4700 },
  ];

  const ugcContent = [
    {
      id: 1,
      creator: "@atlantavibes",
      type: "Remix",
      engagement: "45.2K",
      platform: "TikTok",
      timestamp: "2h ago"
    },
    {
      id: 2,
      creator: "@musiclover_23",
      type: "Dance Challenge",
      engagement: "32.1K",
      platform: "Instagram",
      timestamp: "4h ago"
    },
    {
      id: 3,
      creator: "@hiphopheads_atl",
      type: "Reaction Video",
      engagement: "28.7K",
      platform: "YouTube",
      timestamp: "6h ago"
    }
  ];

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-text-primary mb-2">Content Echo</h1>
            <p className="text-text-secondary">Track how your content spreads across platforms</p>
          </div>
          <div className="flex items-center space-x-2">
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              className="bg-primary-secondary border border-gray-800 text-text-primary rounded-lg px-3 py-2 text-sm"
            >
              <option value="24h">Last 24 hours</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
            </select>
          </div>
        </div>

        {/* AI Insight */}
        <div className="bg-gradient-to-br from-accent-purple/10 to-accent-blue/10 border border-accent-purple/20 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Brain className="w-6 h-6 text-accent-purple mr-3" />
            <h3 className="text-lg font-semibold text-text-primary">Content Intelligence</h3>
          </div>
          <p className="text-text-primary leading-relaxed mb-4">
            Your <strong>"Late Night Freestyle"</strong> clip is performing 340% above your average. The content is spreading organically from TikTok → Instagram → YouTube, 
            indicating strong cross-platform appeal. The freestyle format is resonating particularly well with your core demographic (18-24, hip-hop enthusiasts).
          </p>
          <div className="bg-status-danger/10 border border-status-danger/20 rounded-lg p-4">
            <h4 className="text-status-danger font-semibold mb-2">⚠️ Optimization Opportunity</h4>
            <p className="text-text-primary text-sm">
              You did not post the highest-performing version. The 47-second cut is outperforming your official 30-second version by 280%. 
              Consider promoting the longer format.
            </p>
          </div>
        </div>

        {/* Content Velocity Chart */}
        <div className="bg-primary-secondary rounded-lg p-6 card-glow border border-gray-800">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-text-primary">Content Velocity</h3>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-accent-blue rounded-full"></div>
                <span className="text-text-secondary">Views</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-accent-purple rounded-full"></div>
                <span className="text-text-secondary">Shares</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-accent-gold rounded-full"></div>
                <span className="text-text-secondary">Saves</span>
              </div>
            </div>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={velocityData}>
                <defs>
                  <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00C2FF" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00C2FF" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="sharesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7B2EFF" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#7B2EFF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="name" 
                  stroke="#A0A0A0"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#A0A0A0"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#111111', 
                    border: '1px solid #333',
                    borderRadius: '8px',
                    color: '#FFFFFF'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="views"
                  stroke="#00C2FF"
                  fillOpacity={1}
                  fill="url(#viewsGradient)"
                />
                <Area
                  type="monotone"
                  dataKey="shares"
                  stroke="#7B2EFF"
                  fillOpacity={1}
                  fill="url(#sharesGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Platform Flow Visualization */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-text-primary">Content Flow Patterns</h3>
          
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-text-primary font-medium">Late Night Freestyle</span>
                <span className="text-accent-blue text-sm">2.3M total reach</span>
              </div>
              <PlatformFlow flow={['TikTok', 'Instagram', 'YouTube']} />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-text-primary font-medium">Studio Behind Scenes</span>
                <span className="text-accent-purple text-sm">1.8M total reach</span>
              </div>
              <PlatformFlow flow={['Instagram', 'YouTube', 'Twitter']} />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-text-primary font-medium">Unreleased Snippet</span>
                <span className="text-accent-gold text-sm">950K total reach</span>
              </div>
              <PlatformFlow flow={['TikTok', 'Instagram']} />
            </div>
          </div>
        </div>

        {/* Top Performing Clips */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-text-primary">Top Performing Clips</h3>
            <button className="text-accent-blue hover:text-accent-purple text-sm font-medium transition-colors">
              View All
            </button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {viralClips.map((clip) => (
              <ClipCard key={clip.id} clip={clip} />
            ))}
          </div>
        </div>

        {/* User Generated Content */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-text-primary">User Generated Content</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {ugcContent.map((content) => (
              <div key={content.id} className="bg-primary-secondary rounded-lg p-4 card-glow border border-gray-800">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-brand rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-text-primary font-medium">{content.creator}</span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    content.platform === 'TikTok' ? 'bg-black text-white' :
                    content.platform === 'Instagram' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' :
                    'bg-red-600 text-white'
                  }`}>
                    {content.platform}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div className="text-text-secondary text-sm">{content.type}</div>
                  <div className="flex items-center justify-between">
                    <div className="text-accent-blue font-bold">{content.engagement}</div>
                    <div className="text-text-secondary text-xs flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {content.timestamp}
                    </div>
                  </div>
                </div>
                
                <button className="w-full mt-3 bg-primary-bg hover:bg-gray-900 border border-gray-700 rounded-lg py-2 text-sm font-medium text-text-primary transition-colors">
                  View Content
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Remix & Cover Detection */}
        <div className="bg-primary-secondary rounded-lg p-6 card-glow border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-text-primary">Remix & Cover Detection</h3>
            <span className="px-3 py-1 bg-status-success/20 text-status-success rounded-full text-sm font-medium">
              5 New Detections
            </span>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-primary-bg rounded-lg">
              <div className="flex items-center space-x-3">
                <Music className="w-5 h-5 text-accent-blue" />
                <div>
                  <div className="text-text-primary font-medium">Unofficial Remix by @prodbybeats</div>
                  <div className="text-text-secondary text-sm">67K plays on SoundCloud</div>
                </div>
              </div>
              <button className="text-accent-blue hover:text-accent-purple text-sm font-medium">
                Claim
              </button>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-primary-bg rounded-lg">
              <div className="flex items-center space-x-3">
                <Music className="w-5 h-5 text-accent-purple" />
                <div>
                  <div className="text-text-primary font-medium">Cover by @singersarah</div>
                  <div className="text-text-secondary text-sm">23K plays on YouTube</div>
                </div>
              </div>
              <button className="text-accent-blue hover:text-accent-purple text-sm font-medium">
                Monitor
              </button>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-primary-bg rounded-lg">
              <div className="flex items-center space-x-3">
                <Music className="w-5 h-5 text-accent-gold" />
                <div>
                  <div className="text-text-primary font-medium">Dance Routine by @dancecrew_atl</div>
                  <div className="text-text-secondary text-sm">156K views on TikTok</div>
                </div>
              </div>
              <button className="text-accent-blue hover:text-accent-purple text-sm font-medium">
                Collaborate
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}