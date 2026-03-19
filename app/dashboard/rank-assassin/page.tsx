'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/ui/DashboardLayout';
import { 
  Target, Search, Brain, TrendingUp, Users, BarChart3, 
  MapPin, Calendar, Hash, Zap, ExternalLink, Copy, 
  Play, Download, Share
} from 'lucide-react';
import { competitorData } from '@/data/mockData';

const CompetitorSearch = ({ onSelect }: { onSelect: (artist: string) => void }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const artists = ['Drake', 'J. Cole', 'Metro Boomin', '21 Savage', 'Future'];
  
  const filteredArtists = artists.filter(artist => 
    artist.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-[#111111] border border-[#1E1E1E] rounded-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-[#FF006E]/20 rounded-lg">
          <Target className="w-6 h-6 text-[#FF006E]" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Rank Assassin™</h2>
          <p className="text-[#A0A0A0]">Competitive Intelligence + AI Content Strategy</p>
        </div>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-3 w-5 h-5 text-[#A0A0A0]" />
        <input
          type="text"
          placeholder="Enter artist name to analyze..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-[#1E1E1E] border border-[#333333] rounded-lg text-white placeholder-[#A0A0A0] focus:border-[#FF006E] transition-colors"
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
        {filteredArtists.map((artist) => (
          <button
            key={artist}
            onClick={() => onSelect(artist.toLowerCase().replace(/\s+/g, ''))}
            className="p-3 bg-[#1E1E1E] hover:bg-[#FF006E]/20 border border-[#333333] hover:border-[#FF006E] rounded-lg text-white text-sm transition-all"
          >
            {artist}
          </button>
        ))}
      </div>
    </div>
  );
};

const CompetitorAnalysis = ({ artist }: { artist: string }) => {
  const data = competitorData[artist as keyof typeof competitorData];
  
  if (!data) return null;

  return (
    <div className="space-y-6">
      {/* Artist Overview */}
      <div className="bg-[#111111] border border-[#1E1E1E] rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-[#FF006E] to-[#7B2EFF] rounded-full flex items-center justify-center">
              <span className="text-white text-xl font-bold">
                {data.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">{data.name}</h3>
              <p className="text-[#A0A0A0]">{data.monthlyStreams} monthly streams</p>
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-[#FF006E] mb-1">{data.engagementRate}%</div>
            <div className="text-sm text-[#A0A0A0]">Engagement Rate</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-[#1E1E1E] rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-white mb-1">{data.trendingCities.length}</div>
            <div className="text-sm text-[#A0A0A0]">Trending Cities</div>
          </div>
          <div className="bg-[#1E1E1E] rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-[#00FF9C] mb-1">{data.playlistPlacements}</div>
            <div className="text-sm text-[#A0A0A0]">Playlist Placements</div>
          </div>
          <div className="bg-[#1E1E1E] rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-[#00C2FF] mb-1">{data.contentTypes.length}</div>
            <div className="text-sm text-[#A0A0A0]">Content Types</div>
          </div>
          <div className="bg-[#1E1E1E] rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-[#FFB800] mb-1">A+</div>
            <div className="text-sm text-[#A0A0A0]">Market Grade</div>
          </div>
        </div>
      </div>

      {/* Geographic Trending */}
      <div className="bg-[#111111] border border-[#1E1E1E] rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <MapPin className="w-5 h-5 text-[#FF006E]" />
          <h3 className="text-lg font-bold text-white">Geographic Trending</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {data.trendingCities.map((city, index) => (
            <div key={city} className="bg-[#1E1E1E] border border-[#333333] rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-white mb-1">{city}</div>
              <div className="text-xs text-[#FF006E]">#{index + 1} Market</div>
              <div className="text-xs text-[#A0A0A0] mt-1">High Activity</div>
            </div>
          ))}
        </div>
      </div>

      {/* Demographics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#111111] border border-[#1E1E1E] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-5 h-5 text-[#00C2FF]" />
            <h3 className="text-lg font-bold text-white">Demographics Breakdown</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-[#A0A0A0] mb-2">Age Distribution</h4>
              {Object.entries(data.demographics.age).map(([age, percent]) => (
                <div key={age} className="flex items-center justify-between mb-1">
                  <span className="text-sm text-white">{age}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-[#1E1E1E] rounded-full">
                      <div 
                        className="h-2 bg-[#00C2FF] rounded-full"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <span className="text-sm text-[#A0A0A0] w-8">{percent}%</span>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <h4 className="text-sm font-medium text-[#A0A0A0] mb-2">Gender Split</h4>
              <div className="flex gap-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-[#00C2FF]">{data.demographics.gender.male}%</div>
                  <div className="text-xs text-[#A0A0A0]">Male</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-[#FF006E]">{data.demographics.gender.female}%</div>
                  <div className="text-xs text-[#A0A0A0]">Female</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#111111] border border-[#1E1E1E] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 className="w-5 h-5 text-[#FFB800]" />
            <h3 className="text-lg font-bold text-white">Platform Preference</h3>
          </div>
          
          <div className="space-y-3">
            {Object.entries(data.demographics.platforms).map(([platform, percent]) => (
              <div key={platform} className="flex items-center justify-between">
                <span className="text-sm text-white capitalize">{platform}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-[#1E1E1E] rounded-full">
                    <div 
                      className="h-2 bg-[#FFB800] rounded-full"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <span className="text-sm text-[#A0A0A0] w-8">{percent}%</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-[#333333]">
            <h4 className="text-sm font-medium text-[#A0A0A0] mb-2">Top Content Types</h4>
            <div className="flex flex-wrap gap-2">
              {data.contentTypes.map((type) => (
                <span 
                  key={type} 
                  className="px-2 py-1 bg-[#FFB800]/20 text-[#FFB800] text-xs rounded-full"
                >
                  {type}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* AI Strategy Panel */}
      <div className="bg-gradient-to-br from-[#FF006E]/10 to-[#7B2EFF]/10 border-2 border-[#FF006E]/30 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-[#FF006E]/20 rounded-lg">
            <Brain className="w-6 h-6 text-[#FF006E]" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">AI Strategy Panel</h3>
            <p className="text-[#A0A0A0]">Based on {data.name}'s audience in Atlanta, we recommend:</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-[#FF006E] mb-2">Content Suggestions</h4>
              <ul className="space-y-1 text-sm text-white">
                <li>• Studio session behind-the-scenes content</li>
                <li>• Collaborate with Atlanta-based producers</li>
                <li>• Feature local Atlanta landmarks in visuals</li>
                <li>• Share your Atlanta story and connections</li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-medium text-[#FF006E] mb-2">Platform Recommendations</h4>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-[#FFB800]/20 text-[#FFB800] text-xs rounded-full">Instagram Reels</span>
                <span className="px-3 py-1 bg-[#00C2FF]/20 text-[#00C2FF] text-xs rounded-full">TikTok</span>
                <span className="px-3 py-1 bg-[#7B2EFF]/20 text-[#7B2EFF] text-xs rounded-full">YouTube Shorts</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-[#FF006E] mb-2">Hashtag Strategy</h4>
              <div className="flex flex-wrap gap-1 text-xs">
                <span className="text-[#A0A0A0]">#AtlantaRap</span>
                <span className="text-[#A0A0A0]">#ATLHipHop</span>
                <span className="text-[#A0A0A0]">#SouthernRap</span>
                <span className="text-[#A0A0A0]">#NewAtlanta</span>
                <span className="text-[#A0A0A0]">#HipHopHead</span>
                <span className="text-[#A0A0A0]">#UndergroundRap</span>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-[#FF006E] mb-2">Optimal Timing</h4>
              <div className="text-sm text-white">
                <p>Best times to post: 7-9 PM EST</p>
                <p>Peak days: Thursday - Saturday</p>
                <p>Avoid: Monday mornings, Sunday nights</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button className="bg-[#FF006E] hover:bg-[#E6005C] text-white px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2">
            <Brain className="w-4 h-4" />
            Generate Content Brief
          </button>
          <button className="bg-[#7B2EFF] hover:bg-[#6A28DB] text-white px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2">
            <Target className="w-4 h-4" />
            Submit to Similar Platforms
          </button>
          <button className="border border-[#FF006E] text-[#FF006E] hover:bg-[#FF006E]/10 px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2">
            <Copy className="w-4 h-4" />
            Copy Strategy
          </button>
        </div>
      </div>

      {/* Competitor Comparison Chart */}
      <div className="bg-[#111111] border border-[#1E1E1E] rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="w-5 h-5 text-[#00FF9C]" />
          <h3 className="text-lg font-bold text-white">Your Stats vs {data.name}</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <h4 className="text-sm text-[#A0A0A0] mb-3">Monthly Streams</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-white">You</span>
                <span className="text-lg font-bold text-[#00FF9C]">2.4M</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#A0A0A0]">{data.name}</span>
                <span className="text-lg font-bold text-[#FF006E]">{data.monthlyStreams}</span>
              </div>
            </div>
          </div>

          <div className="text-center">
            <h4 className="text-sm text-[#A0A0A0] mb-3">Engagement Rate</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-white">You</span>
                <span className="text-lg font-bold text-[#00FF9C]">12.4%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#A0A0A0]">{data.name}</span>
                <span className="text-lg font-bold text-[#FF006E]">{data.engagementRate}%</span>
              </div>
            </div>
          </div>

          <div className="text-center">
            <h4 className="text-sm text-[#A0A0A0] mb-3">Playlist Placements</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-white">You</span>
                <span className="text-lg font-bold text-[#00FF9C]">127</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#A0A0A0]">{data.name}</span>
                <span className="text-lg font-bold text-[#FF006E]">{data.playlistPlacements}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-[#333333]">
          <div className="bg-[#00FF9C]/10 border border-[#00FF9C]/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-[#00FF9C]" />
              <span className="text-sm font-medium text-[#00FF9C]">Opportunity Detected</span>
            </div>
            <p className="text-sm text-white">
              Your engagement rate is higher than {data.name}'s! Focus on scaling your reach while maintaining this strong connection with your audience.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function RankAssassinPage() {
  const [selectedArtist, setSelectedArtist] = useState<string | null>(null);
  const [showContentBrief, setShowContentBrief] = useState(false);

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              <span className="bg-gradient-to-r from-[#FF006E] to-[#7B2EFF] bg-clip-text text-transparent">
                Rank Assassin™
              </span>
            </h1>
            <p className="text-[#A0A0A0]">Competitive Intelligence & AI-Powered Content Strategy</p>
          </div>
          {selectedArtist && (
            <button 
              onClick={() => setSelectedArtist(null)}
              className="text-[#FF006E] hover:text-white flex items-center gap-2 text-sm"
            >
              ← Back to Search
            </button>
          )}
        </div>

        {/* Search or Analysis */}
        {!selectedArtist ? (
          <CompetitorSearch onSelect={setSelectedArtist} />
        ) : (
          <CompetitorAnalysis artist={selectedArtist} />
        )}

        {/* Content Brief Modal */}
        {showContentBrief && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#111111] border border-[#1E1E1E] rounded-xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">AI-Generated Content Brief</h3>
                <button 
                  onClick={() => setShowContentBrief(false)}
                  className="text-[#A0A0A0] hover:text-white"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="font-medium text-[#FF006E] mb-2">Recommended Content Strategy</h4>
                  <p className="text-[#A0A0A0]">
                    Based on competitor analysis, focus on authentic Atlanta street content 
                    with high engagement potential. Target 18-24 demographic through TikTok 
                    and Instagram Reels.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium text-[#FF006E] mb-2">Content Pillars</h4>
                  <ul className="text-[#A0A0A0] space-y-1">
                    <li>• Behind-the-scenes studio content (30%)</li>
                    <li>• Atlanta culture and lifestyle (25%)</li>
                    <li>• Music previews and freestyles (25%)</li>
                    <li>• Collaborations and features (20%)</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-[#FF006E] mb-2">Posting Schedule</h4>
                  <p className="text-[#A0A0A0]">
                    Post 3-4 times per week, with peak engagement on Thursday-Saturday evenings.
                    Focus on Instagram Stories daily and TikTok 2x per week.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3 pt-4 mt-4 border-t border-[#333333]">
                <button className="bg-[#FF006E] hover:bg-[#E6005C] text-white px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Download Brief
                </button>
                <button className="border border-[#FF006E] text-[#FF006E] hover:bg-[#FF006E]/10 px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2">
                  <Share className="w-4 h-4" />
                  Share with Team
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}