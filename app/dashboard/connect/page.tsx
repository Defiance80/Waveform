'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/ui/DashboardLayout';
import { 
  Wifi, Check, X, TrendingUp, Users, Calendar, ExternalLink,
  BarChart3, Radio
} from 'lucide-react';
import { connectedPlatforms, twitchStreamers } from '@/data/mockData';

const BrandIcon = ({ name }: { name: string }) => {
  switch (name) {
    case 'Spotify':
      return (
        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#1DB954' }}>
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="white"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>
        </div>
      );
    case 'TikTok':
      return (
        <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center relative overflow-hidden">
          <span className="font-black text-lg text-white" style={{ textShadow: '2px 0 #FF0050, -2px 0 #00F2EA' }}>T</span>
        </div>
      );
    case 'Instagram':
      return (
        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(45deg, #F58529, #DD2A7B, #8134AF)' }}>
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="white"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
        </div>
      );
    case 'Twitter/X':
      return (
        <div className="w-10 h-10 rounded-full bg-black border border-[#333333] flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="white"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
        </div>
      );
    case 'YouTube':
      return (
        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FF0000' }}>
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="white"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
        </div>
      );
    case 'Facebook':
      return (
        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#1877F2' }}>
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="white"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
        </div>
      );
    case 'Twitch':
      return (
        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#9146FF' }}>
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="white"><path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z"/></svg>
        </div>
      );
    default:
      return (
        <div className="w-10 h-10 rounded-full bg-[#333333] flex items-center justify-center">
          <Wifi className="w-5 h-5 text-white" />
        </div>
      );
  }
};

const PlatformCard = ({ platform }: { platform: any }) => {
  const getPlatformColor = (name: string) => {
    switch (name) {
      case 'YouTube': return 'border-[#FF0000] bg-[#FF0000]/10';
      case 'TikTok': return 'border-[#FF0050] bg-[#FF0050]/10';
      case 'Instagram': return 'border-[#DD2A7B] bg-[#DD2A7B]/10';
      case 'Facebook': return 'border-[#1877F2] bg-[#1877F2]/10';
      case 'Twitter/X': return 'border-[#333333] bg-[#000000]/10';
      case 'Spotify': return 'border-[#1DB954] bg-[#1DB954]/10';
      case 'Twitch': return 'border-[#9146FF] bg-[#9146FF]/10';
      default: return 'border-[#333333] bg-[#141414]';
    }
  };

  return (
    <div className={`border-2 rounded-xl p-4 sm:p-6 transition-all hover:scale-105 ${
      platform.connected 
        ? getPlatformColor(platform.name)
        : 'border-[#333333] bg-[#141414]'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <BrandIcon name={platform.name} />
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white">{platform.name}</h3>
            <p className="text-xs sm:text-sm text-[#A0A0A0]">Social Platform</p>
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
              <div className="text-lg sm:text-xl font-bold text-white">{platform.followers}</div>
              <div className="text-xs text-[#A0A0A0]">Followers</div>
            </div>
            <div className="text-center">
              <div className="text-lg sm:text-xl font-bold text-[#00FF9C]">{platform.engagementRate}</div>
              <div className="text-xs text-[#A0A0A0]">Engagement</div>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#A0A0A0]">Last Post: {platform.lastPost}</span>
            <span className="text-[#00FF9C] font-medium">{platform.growth}</span>
          </div>
          
          <div className="flex gap-2">
            <button className="flex-1 bg-[#1E1E1E] text-white px-3 py-2 rounded-lg text-sm hover:bg-[#2A2A2A] transition-all min-h-[44px]">
              Manage
            </button>
            <button className="bg-[#FF3B3B] text-white px-3 py-2 rounded-lg text-sm hover:bg-[#E03333] transition-all min-h-[44px]">
              Disconnect
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-sm text-[#A0A0A0] mb-4">Connect your {platform.name} account to sync content and track performance</p>
          <button className="bg-[#C9A86A] hover:bg-[#B8976B] text-black px-4 py-2 rounded-lg font-medium transition-all w-full min-h-[44px]">
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
    <div className="bg-[#141414] border border-[#2A2A2A] rounded-xl p-4 hover:bg-[#181818] transition-all">
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
        className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-all min-h-[44px] ${
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
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
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-[#141414] border border-[#2A2A2A] rounded-xl p-4">
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

          <div className="bg-[#141414] border border-[#2A2A2A] rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <Users className="w-5 h-5 text-[#00C2FF]" />
              <TrendingUp className="w-4 h-4 text-[#00FF9C]" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">{Math.round(totalReach / 1000)}K</div>
            <div className="text-sm text-[#A0A0A0]">Total Reach</div>
            <div className="text-xs text-[#FFB800] mt-1">Across all platforms</div>
          </div>

          <div className="bg-[#141414] border border-[#2A2A2A] rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <BarChart3 className="w-5 h-5 text-[#7B2EFF]" />
              <Calendar className="w-4 h-4 text-[#A0A0A0]" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">9.7%</div>
            <div className="text-sm text-[#A0A0A0]">Avg Engagement</div>
            <div className="text-xs text-[#7B2EFF] mt-1">Above industry avg</div>
          </div>

          <div className="bg-[#141414] border border-[#2A2A2A] rounded-xl p-4">
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
        <div className="flex flex-wrap gap-1 bg-[#141414] p-1 rounded-xl border border-[#2A2A2A] w-fit">
          <button
            onClick={() => setActiveTab('platforms')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all min-h-[44px] ${
              activeTab === 'platforms' 
                ? 'bg-[#C9A86A] text-black' 
                : 'text-[#A0A0A0] hover:text-white'
            }`}
          >
            Social Platforms
          </button>
          <button
            onClick={() => setActiveTab('streamers')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all min-h-[44px] ${
              activeTab === 'streamers' 
                ? 'bg-[#C9A86A] text-black' 
                : 'text-[#A0A0A0] hover:text-white'
            }`}
          >
            Gaming Streamers
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all min-h-[44px] ${
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {connectedPlatforms.map((platform, index) => (
                <PlatformCard key={index} platform={platform} />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'streamers' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-xl font-bold text-white">Music-Friendly Gamers & YouTubers</h2>
                <p className="text-[#A0A0A0]">Streamers who play music during their content</p>
              </div>
              <div className="text-sm text-[#A0A0A0]">
                {twitchStreamers.length} streamers available
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {twitchStreamers.map((streamer, index) => (
                <StreamerCard key={index} streamer={streamer} />
              ))}
            </div>

            {/* Pitch Template */}
            <div className="bg-[#141414] border border-[#2A2A2A] rounded-xl p-4 sm:p-6">
              <h3 className="text-lg font-bold text-white mb-4">Pitch Template</h3>
              <div className="bg-[#1E1E1E] border border-[#333333] rounded-lg p-4 mb-4">
                <p className="text-sm text-[#A0A0A0] leading-relaxed">
                  &quot;Hey [Streamer Name]! I&apos;m Kendrick Cole, a hip-hop artist from Atlanta. 
                  I&apos;ve been following your streams and love the vibe you create. I have some new music 
                  that would fit perfectly with your content style. Would you be interested in featuring 
                  my tracks during your streams? Happy to send you a preview pack. Thanks!&quot;
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button className="bg-[#C9A86A] hover:bg-[#B8976B] text-black px-4 py-2 rounded-lg font-medium transition-all min-h-[44px]">
                  Use Template
                </button>
                <button className="border border-[#C9A86A] text-[#C9A86A] hover:bg-[#C9A86A]/10 px-4 py-2 rounded-lg font-medium transition-all min-h-[44px]">
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
              <div className="bg-[#141414] border border-[#2A2A2A] rounded-xl p-4 sm:p-6">
                <h3 className="text-lg font-bold text-white mb-4">Platform Performance</h3>
                <div className="space-y-4">
                  {connectedPlatforms.filter(p => p.connected).map((platform) => (
                    <div key={platform.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <BrandIcon name={platform.name} />
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
              <div className="bg-[#141414] border border-[#2A2A2A] rounded-xl p-4 sm:p-6">
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
            <div className="bg-gradient-to-br from-[#C9A86A]/10 to-[#FFB800]/10 border-2 border-[#C9A86A]/30 rounded-xl p-4 sm:p-6">
              <h3 className="text-lg font-bold text-white mb-4">Connection Summary</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
}
