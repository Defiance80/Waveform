'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/ui/DashboardLayout';
import { 
  Wifi, Check, X, TrendingUp, Users, Calendar, ExternalLink,
  Youtube, Music, Play, Send, BarChart3, Gamepad2, Radio
} from 'lucide-react';
import { connectedPlatforms, twitchStreamers } from '@/data/mockData';

const PlatformCard = ({ platform }: { platform: any }) => {
  const getPlatformIcon = (name: string) => {
    switch (name) {
      case 'YouTube': return <Youtube className="w-6 h-6" />;
      case 'TikTok': return <Music className="w-6 h-6" />;
      case 'Instagram': return <BarChart3 className="w-6 h-6" />;
      case 'Facebook': return <Users className="w-6 h-6" />;
      case 'Twitter/X': return <Send className="w-6 h-6" />;
      case 'Spotify': return <Play className="w-6 h-6" />;
      case 'Twitch': return <Gamepad2 className="w-6 h-6" />;
      default: return <Wifi className="w-6 h-6" />;
    }
  };

  const getPlatformColor = (name: string) => {
    switch (name) {
      case 'YouTube': return 'border-[#FF0000] bg-[#FF0000]/10';
      case 'TikTok': return 'border-[#000000] bg-[#000000]/10';
      case 'Instagram': return 'border-[#E4405F] bg-[#E4405F]/10';
      case 'Facebook': return 'border-[#1877F2] bg-[#1877F2]/10';
      case 'Twitter/X': return 'border-[#1DA1F2] bg-[#1DA1F2]/10';
      case 'Spotify': return 'border-[#1DB954] bg-[#1DB954]/10';
      case 'Twitch': return 'border-[#9146FF] bg-[#9146FF]/10';
      default: return 'border-[#333333] bg-[#111111]';
    }
  };

  return (
    <div className={`border-2 rounded-xl p-6 transition-all hover:scale-105 ${
      platform.connected 
        ? getPlatformColor(platform.name)
        : 'border-[#333333] bg-[#111111]'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${
            platform.connected 
              ? 'bg-white/20' 
              : 'bg-[#333333]/50'
          }`}>
            {getPlatformIcon(platform.name)}
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{platform.name}</h3>
            <p className="text-sm text-[#A0A0A0]">Social Platform</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {platform.connected ? (
            <Check className="w-5 h-5 text-[#00FF9C]" />
          ) : (
            <X className="w-5 h-5 text-[#FF3B3B]" />
          )}
        </div>
      </div>

      {platform.connected ? (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-xl font-bold text-white">{platform.followers}</div>
              <div className="text-xs text-[#A0A0A0]">Followers</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-[#00FF9C]">{platform.engagementRate}</div>
              <div className="text-xs text-[#A0A0A0]">Engagement</div>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#A0A0A0]">Last Post: {platform.lastPost}</span>
            <span className="text-[#00FF9C] font-medium">{platform.growth}</span>
          </div>
          
          <div className="flex gap-2">
            <button className="flex-1 bg-[#1E1E1E] text-white px-3 py-2 rounded-lg text-sm hover:bg-[#2A2A2A] transition-all">
              Manage
            </button>
            <button className="bg-[#FF3B3B] text-white px-3 py-2 rounded-lg text-sm hover:bg-[#E03333] transition-all">
              Disconnect
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-sm text-[#A0A0A0] mb-4">Connect your {platform.name} account to sync content and track performance</p>
          <button className="bg-[#C9A86A] hover:bg-[#B8976B] text-black px-4 py-2 rounded-lg font-medium transition-all w-full">
            Connect Account
          </button>
        </div>
      )}
    </div>
  );
};

const StreamerCard = ({ streamer }: { streamer: any }) => {
  const [isPitched, setIsPitched] = useState(false);

  return (
    <div className="bg-[#111111] border border-[#1E1E1E] rounded-xl p-4 hover:bg-[#121212] transition-all">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-bold text-white text-sm mb-1">{streamer.name}</h4>
          <div className="flex items-center gap-3 text-xs text-[#A0A0A0]">
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {streamer.followers}
            </span>
            <span>•</span>
            <span>{streamer.genre}</span>
          </div>
        </div>
        <div className="text-xs text-[#A0A0A0] font-mono">
          {streamer.handle}
        </div>
      </div>
      
      <div className="mb-3">
        <span className="px-2 py-1 bg-[#9146FF]/20 text-[#9146FF] text-xs rounded-full">
          {streamer.platform}
        </span>
      </div>
      
      <button 
        onClick={() => setIsPitched(true)}
        disabled={isPitched}
        className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-all ${
          isPitched 
            ? 'bg-[#00FF9C]/20 text-[#00FF9C] cursor-default'
            : 'bg-[#C9A86A] hover:bg-[#B8976B] text-black'
        }`}
      >
        {isPitched ? 'Pitch Sent ✓' : 'Pitch Your Music'}
      </button>
    </div>
  );
};

export default function ConnectPage() {
  const [activeTab, setActiveTab] = useState('platforms');

  const connectedCount = connectedPlatforms.filter(p => p.connected).length;
  const totalReach = connectedPlatforms
    .filter(p => p.connected)
    .reduce((total, p) => {
      const followers = p.followers.replace(/[^\d.]/g, '');
      const multiplier = p.followers.includes('K') ? 1000 : 1;
      return total + (parseFloat(followers) * multiplier);
    }, 0);

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              <span className="bg-gradient-to-r from-[#C9A86A] to-[#FFB800] bg-clip-text text-transparent">
                Platform Connections
              </span>
            </h1>
            <p className="text-[#A0A0A0]">Connect and manage your social accounts and partnerships</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-[#A0A0A0]">
            <div className="w-2 h-2 bg-[#00FF9C] rounded-full animate-pulse"></div>
            {connectedCount} of {connectedPlatforms.length} connected
          </div>
        </div>

        {/* Connection Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-[#111111] border border-[#1E1E1E] rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <Wifi className="w-5 h-5 text-[#C9A86A]" />
              <Check className="w-4 h-4 text-[#00FF9C]" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">{connectedCount}</div>
            <div className="text-sm text-[#A0A0A0]">Connected Platforms</div>
            <div className="text-xs text-[#00FF9C] mt-1">
              {Math.round((connectedCount / connectedPlatforms.length) * 100)}% coverage
            </div>
          </div>

          <div className="bg-[#111111] border border-[#1E1E1E] rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <Users className="w-5 h-5 text-[#00C2FF]" />
              <TrendingUp className="w-4 h-4 text-[#00FF9C]" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">{Math.round(totalReach / 1000)}K</div>
            <div className="text-sm text-[#A0A0A0]">Total Reach</div>
            <div className="text-xs text-[#FFB800] mt-1">Across all platforms</div>
          </div>

          <div className="bg-[#111111] border border-[#1E1E1E] rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <BarChart3 className="w-5 h-5 text-[#7B2EFF]" />
              <Calendar className="w-4 h-4 text-[#A0A0A0]" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">9.7%</div>
            <div className="text-sm text-[#A0A0A0]">Avg Engagement</div>
            <div className="text-xs text-[#7B2EFF] mt-1">Above industry avg</div>
          </div>

          <div className="bg-[#111111] border border-[#1E1E1E] rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <Radio className="w-5 h-5 text-[#FFB800]" />
              <ExternalLink className="w-4 h-4 text-[#A0A0A0]" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">12</div>
            <div className="text-sm text-[#A0A0A0]">Streamer Pitches</div>
            <div className="text-xs text-[#FFB800] mt-1">3 pending responses</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-[#111111] p-1 rounded-xl border border-[#1E1E1E] w-fit">
          <button
            onClick={() => setActiveTab('platforms')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'platforms' 
                ? 'bg-[#C9A86A] text-black' 
                : 'text-[#A0A0A0] hover:text-white'
            }`}
          >
            Social Platforms
          </button>
          <button
            onClick={() => setActiveTab('streamers')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'streamers' 
                ? 'bg-[#C9A86A] text-black' 
                : 'text-[#A0A0A0] hover:text-white'
            }`}
          >
            Gaming Streamers
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'analytics' 
                ? 'bg-[#C9A86A] text-black' 
                : 'text-[#A0A0A0] hover:text-white'
            }`}
          >
            Cross-Platform Analytics
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'platforms' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white">Social Platform Connections</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {connectedPlatforms.map((platform, index) => (
                <PlatformCard key={index} platform={platform} />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'streamers' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">Music-Friendly Gamers & YouTubers</h2>
                <p className="text-[#A0A0A0]">Streamers who play music during their content</p>
              </div>
              <div className="text-sm text-[#A0A0A0]">
                {twitchStreamers.length} streamers available
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {twitchStreamers.map((streamer, index) => (
                <StreamerCard key={index} streamer={streamer} />
              ))}
            </div>

            {/* Pitch Template */}
            <div className="bg-[#111111] border border-[#1E1E1E] rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Pitch Template</h3>
              <div className="bg-[#1E1E1E] border border-[#333333] rounded-lg p-4 mb-4">
                <p className="text-sm text-[#A0A0A0] leading-relaxed">
                  "Hey [Streamer Name]! I'm Kendrick Cole, a hip-hop artist from Atlanta. 
                  I've been following your streams and love the vibe you create. I have some new music 
                  that would fit perfectly with your content style. Would you be interested in featuring 
                  my tracks during your streams? Happy to send you a preview pack. Thanks!"
                </p>
              </div>
              <div className="flex gap-3">
                <button className="bg-[#C9A86A] hover:bg-[#B8976B] text-black px-4 py-2 rounded-lg font-medium transition-all">
                  Use Template
                </button>
                <button className="border border-[#C9A86A] text-[#C9A86A] hover:bg-[#C9A86A]/10 px-4 py-2 rounded-lg font-medium transition-all">
                  Customize
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white">Cross-Platform Analytics</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Platform Performance */}
              <div className="bg-[#111111] border border-[#1E1E1E] rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Platform Performance</h3>
                <div className="space-y-4">
                  {connectedPlatforms.filter(p => p.connected).map((platform) => (
                    <div key={platform.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#333333] flex items-center justify-center">
                          {getPlatformIcon(platform.name)}
                        </div>
                        <span className="text-white text-sm">{platform.name}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-[#A0A0A0]">{platform.followers}</span>
                        <span className={`font-medium ${
                          platform.growth.startsWith('+') ? 'text-[#00FF9C]' : 'text-[#FF3B3B]'
                        }`}>
                          {platform.growth}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Content Performance */}
              <div className="bg-[#111111] border border-[#1E1E1E] rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Content Performance</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-[#A0A0A0]">Video Content</span>
                      <span className="text-sm text-white font-medium">Leading</span>
                    </div>
                    <div className="w-full bg-[#1E1E1E] rounded-full h-2">
                      <div className="bg-[#00C2FF] h-2 rounded-full" style={{ width: '78%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-[#A0A0A0]">Audio Content</span>
                      <span className="text-sm text-white font-medium">Strong</span>
                    </div>
                    <div className="w-full bg-[#1E1E1E] rounded-full h-2">
                      <div className="bg-[#FFB800] h-2 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-[#A0A0A0]">Image Posts</span>
                      <span className="text-sm text-white font-medium">Growing</span>
                    </div>
                    <div className="w-full bg-[#1E1E1E] rounded-full h-2">
                      <div className="bg-[#7B2EFF] h-2 rounded-full" style={{ width: '52%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-gradient-to-br from-[#C9A86A]/10 to-[#FFB800]/10 border-2 border-[#C9A86A]/30 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Connection Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#C9A86A] mb-1">{Math.round(totalReach / 1000)}K</div>
                  <div className="text-sm text-[#A0A0A0]">Total Audience</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#00FF9C] mb-1">9.7%</div>
                  <div className="text-sm text-[#A0A0A0]">Avg Engagement</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#FFB800] mb-1">+34%</div>
                  <div className="text-sm text-[#A0A0A0]">Growth Rate</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );

  function getPlatformIcon(name: string) {
    switch (name) {
      case 'YouTube': return <Youtube className="w-4 h-4" />;
      case 'TikTok': return <Music className="w-4 h-4" />;
      case 'Instagram': return <BarChart3 className="w-4 h-4" />;
      case 'Facebook': return <Users className="w-4 h-4" />;
      case 'Twitter/X': return <Send className="w-4 h-4" />;
      case 'Spotify': return <Play className="w-4 h-4" />;
      case 'Twitch': return <Gamepad2 className="w-4 h-4" />;
      default: return <Wifi className="w-4 h-4" />;
    }
  }
}