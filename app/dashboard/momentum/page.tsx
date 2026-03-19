'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/ui/DashboardLayout';
import { 
  TrendingUp, 
  MapPin, 
  Brain, 
  Users, 
  Music, 
  Target,
  ArrowUp,
  ArrowDown,
  Minus,
  Globe
} from 'lucide-react';
import { cityMomentumData } from '@/data/mockData';

const CityCard = ({ city }: { city: any }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Early Surge': return 'text-status-success bg-status-success/20 border-status-success/30';
      case 'Growing': return 'text-status-warning bg-status-warning/20 border-status-warning/30';
      case 'Rising': return 'text-accent-blue bg-accent-blue/20 border-accent-blue/30';
      case 'Emerging': return 'text-accent-blue bg-accent-blue/20 border-accent-blue/30';
      case 'Stable': return 'text-text-primary bg-text-primary/20 border-text-primary/30';
      case 'Dormant': return 'text-text-secondary bg-text-secondary/20 border-text-secondary/30';
      default: return 'text-text-secondary bg-text-secondary/20 border-text-secondary/30';
    }
  };

  const getGrowthIcon = (growth: string) => {
    const value = parseInt(growth.replace(/[^-\d]/g, ''));
    if (value > 0) return <ArrowUp className="w-4 h-4" />;
    if (value < 0) return <ArrowDown className="w-4 h-4" />;
    return <Minus className="w-4 h-4" />;
  };

  const getGrowthColor = (growth: string) => {
    const value = parseInt(growth.replace(/[^-\d]/g, ''));
    if (value > 50) return 'text-status-success';
    if (value > 0) return 'text-accent-blue';
    if (value < 0) return 'text-status-danger';
    return 'text-text-secondary';
  };

  return (
    <div className="bg-primary-secondary rounded-lg p-6 card-glow border border-gray-800">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-text-primary">{city.city}</h3>
          <p className="text-sm text-text-secondary">{city.country}</p>
        </div>
        <MapPin className="w-5 h-5 text-accent-blue" />
      </div>

      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border mb-4 ${getStatusColor(city.status)}`}>
        <div className="w-2 h-2 rounded-full bg-current mr-2 animate-pulse"></div>
        {city.status}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-text-secondary text-sm">Growth Rate</span>
          <div className={`flex items-center font-bold ${getGrowthColor(city.growth)}`}>
            {getGrowthIcon(city.growth)}
            <span className="ml-1">{city.growth}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-text-secondary text-sm">Listeners</span>
          <span className="font-semibold text-text-primary">{city.listeners}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-text-secondary text-sm">Playlist Adds</span>
          <span className="font-semibold text-accent-blue">{city.playlistAdds}</span>
        </div>
      </div>

      <button className="w-full mt-4 bg-primary-bg hover:bg-gray-900 border border-gray-700 rounded-lg py-2 text-sm font-medium text-text-primary transition-colors">
        View Details
      </button>
    </div>
  );
};

const PlaylistCard = ({ playlist }: { playlist: any }) => (
  <div className="bg-primary-secondary rounded-lg p-4 card-glow border border-gray-800">
    <div className="flex items-center space-x-3 mb-3">
      <div className="w-12 h-12 bg-gradient-brand rounded-lg flex items-center justify-center">
        <Music className="w-6 h-6 text-white" />
      </div>
      <div className="flex-1">
        <h4 className="font-medium text-text-primary">{playlist.name}</h4>
        <p className="text-sm text-text-secondary">{playlist.curator}</p>
      </div>
      <span className="text-accent-blue font-bold">{playlist.followers}</span>
    </div>
    <div className="flex items-center justify-between text-sm">
      <span className="text-text-secondary">Added: {playlist.dateAdded}</span>
      <span className="text-status-success">{playlist.streams} plays</span>
    </div>
  </div>
);

export default function MomentumPage() {
  const [viewMode, setViewMode] = useState<'cards' | 'map'>('cards');

  const trendingPlaylists = [
    {
      name: "Atlanta Underground",
      curator: "Spotify",
      followers: "234K",
      dateAdded: "2024-03-15",
      streams: "12.4K"
    },
    {
      name: "Southern Heat",
      curator: "Apple Music",
      followers: "189K",
      dateAdded: "2024-03-14",
      streams: "8.7K"
    },
    {
      name: "Next Up ATL",
      curator: "Tidal",
      followers: "67K",
      dateAdded: "2024-03-13",
      streams: "5.2K"
    },
    {
      name: "Lagos Vibes",
      curator: "Audiomack",
      followers: "145K",
      dateAdded: "2024-03-12",
      streams: "18.9K"
    }
  ];

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-text-primary mb-2">Market Momentum</h1>
            <p className="text-text-secondary">Geographic intelligence and market traction analysis</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('cards')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'cards' 
                  ? 'bg-accent-blue text-white' 
                  : 'bg-primary-secondary text-text-secondary hover:text-text-primary'
              }`}
            >
              Card View
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'map' 
                  ? 'bg-accent-blue text-white' 
                  : 'bg-primary-secondary text-text-secondary hover:text-text-primary'
              }`}
            >
              Map View
            </button>
          </div>
        </div>

        {/* AI Strategy Recommendation */}
        <div className="bg-gradient-to-br from-accent-blue/10 to-accent-purple/10 border border-accent-blue/20 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Brain className="w-6 h-6 text-accent-purple mr-3" />
            <h3 className="text-lg font-semibold text-text-primary">Strategic Recommendation</h3>
            <span className="ml-auto px-3 py-1 bg-status-danger/20 text-status-danger rounded-full text-xs font-medium">
              URGENT
            </span>
          </div>
          <div className="bg-primary-bg rounded-lg p-4 mb-4">
            <h4 className="text-accent-gold font-semibold mb-2">Atlanta Market Window Closing</h4>
            <p className="text-text-primary leading-relaxed">
              Run geo-targeted promotion in Atlanta within <strong>72 hours</strong>. Early surge momentum detected with 
              +127% growth. Market indicators show peak receptivity. Recommended budget: $2,500-$5,000 for maximum impact.
            </p>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm text-text-secondary">
              <span className="text-accent-blue">Impact:</span> Very High • 
              <span className="text-accent-purple ml-1">Confidence:</span> 94%
            </div>
            <button className="btn-primary py-2 px-4 text-sm">
              <Target className="w-4 h-4 mr-2" />
              Launch Campaign
            </button>
          </div>
        </div>

        {/* Market Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-primary-secondary rounded-lg p-4 card-glow">
            <div className="flex items-center justify-between mb-3">
              <Globe className="w-5 h-5 text-accent-blue" />
              <ArrowUp className="w-4 h-4 text-status-success" />
            </div>
            <div className="text-2xl font-bold text-text-primary mb-1">6</div>
            <div className="text-text-secondary text-sm">Active Markets</div>
            <div className="text-status-success text-sm font-medium">+2 this month</div>
          </div>

          <div className="bg-primary-secondary rounded-lg p-4 card-glow">
            <div className="flex items-center justify-between mb-3">
              <Users className="w-5 h-5 text-accent-purple" />
              <TrendingUp className="w-4 h-4 text-accent-purple" />
            </div>
            <div className="text-2xl font-bold text-text-primary mb-1">185K</div>
            <div className="text-text-secondary text-sm">Total Listeners</div>
            <div className="text-accent-purple text-sm font-medium">+23% growth</div>
          </div>

          <div className="bg-primary-secondary rounded-lg p-4 card-glow">
            <div className="flex items-center justify-between mb-3">
              <Music className="w-5 h-5 text-accent-gold" />
              <ArrowUp className="w-4 h-4 text-status-success" />
            </div>
            <div className="text-2xl font-bold text-text-primary mb-1">80</div>
            <div className="text-text-secondary text-sm">Playlist Adds</div>
            <div className="text-status-success text-sm font-medium">+15 this week</div>
          </div>
        </div>

        {/* City Markets */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-text-primary">City Markets</h3>
          
          {viewMode === 'cards' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cityMomentumData.map((city, index) => (
                <CityCard key={index} city={city} />
              ))}
            </div>
          ) : (
            <div className="bg-primary-secondary rounded-lg p-8 card-glow border border-gray-800">
              <div className="text-center text-text-secondary">
                <MapPin className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">Interactive Map Coming Soon</h3>
                <p>Geographic visualization with real-time momentum tracking</p>
              </div>
            </div>
          )}
        </div>

        {/* Trending Playlists */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-text-primary">Trending Playlists by Region</h3>
            <button className="text-accent-blue hover:text-accent-purple text-sm font-medium transition-colors">
              View All
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {trendingPlaylists.map((playlist, index) => (
              <PlaylistCard key={index} playlist={playlist} />
            ))}
          </div>
        </div>

        {/* Competition Analysis */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-text-primary">Market Competition</h3>
          
          <div className="bg-primary-secondary rounded-lg p-6 card-glow border border-gray-800">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-status-success mb-1">3rd</div>
                <div className="text-text-secondary text-sm">Atlanta Ranking</div>
                <div className="text-accent-blue text-sm">Behind Lil Baby, 21 Savage</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-accent-blue mb-1">7th</div>
                <div className="text-text-secondary text-sm">Lagos Ranking</div>
                <div className="text-accent-purple text-sm">Rising fast (+5 positions)</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-accent-gold mb-1">12th</div>
                <div className="text-text-secondary text-sm">Houston Ranking</div>
                <div className="text-text-secondary text-sm">Steady position</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}