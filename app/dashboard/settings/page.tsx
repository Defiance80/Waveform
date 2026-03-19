'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/ui/DashboardLayout';
import { 
  User, 
  Bell, 
  Music, 
  Key, 
  Info, 
  Save,
  Eye,
  EyeOff,
  Link,
  CheckCircle,
  AlertTriangle,
  Crown,
  Zap
} from 'lucide-react';

const SettingsSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="bg-[#111111] rounded-lg p-6 card-glow border border-[#1E1E1E]">
    <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
    {children}
  </div>
);

const Toggle = ({ enabled, onChange, label }: { enabled: boolean; onChange: (value: boolean) => void; label: string }) => (
  <div className="flex items-center justify-between py-2">
    <span className="text-white">{label}</span>
    <button
      onClick={() => onChange(!enabled)}
      className={`relative w-12 h-6 rounded-full transition-colors ${
        enabled ? 'bg-[#00C2FF]' : 'bg-gray-700'
      }`}
    >
      <div
        className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-0'
        }`}
      />
    </button>
  </div>
);

export default function SettingsPage() {
  const [profile, setProfile] = useState({
    name: 'Kendrick Cole',
    email: 'kendrick@example.com',
    genre: 'Hip-Hop',
    location: 'Atlanta, GA',
    bio: 'Emerging hip-hop artist from Atlanta bringing authentic street narratives to the culture.',
  });

  const [notifications, setNotifications] = useState({
    pulseAlerts: true,
    momentumChanges: true,
    revenueAlerts: true,
    actionRecommendations: true,
    weeklyReports: true,
    emailDigest: false,
  });

  const [platforms, setPlatforms] = useState({
    spotify: { connected: true, status: 'active' },
    appleMusic: { connected: true, status: 'active' },
    youtube: { connected: false, status: 'pending' },
    tiktok: { connected: true, status: 'limited' },
    instagram: { connected: false, status: 'disconnected' },
    twitter: { connected: false, status: 'disconnected' },
  });

  const [showApiKey, setShowApiKey] = useState(false);
  const [subscription] = useState({
    tier: 'Pro',
    billingCycle: 'Monthly',
    nextBilling: '2024-04-19',
    features: [
      'Real-time cultural intelligence',
      'Advanced AI insights',
      'Revenue tracking & alerts',
      'Unlimited platform connections',
      'Priority support',
      'Custom campaign templates'
    ]
  });

  const handleProfileSave = () => {
    // Save profile logic
    console.log('Saving profile:', profile);
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications({ ...notifications, [key]: value });
  };

  const getPlatformStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-[#00FF9C] bg-[#00FF9C]/20';
      case 'limited': return 'text-[#FFB800] bg-[#FFB800]/20';
      case 'pending': return 'text-[#00C2FF] bg-[#00C2FF]/20';
      case 'disconnected': return 'text-[#FF3B3B] bg-[#FF3B3B]/20';
      default: return 'text-[#A0A0A0] bg-text-secondary/20';
    }
  };

  const getPlatformIcon = (platform: string) => {
    const iconClass = "w-6 h-6";
    switch (platform) {
      case 'spotify': return <div className={`${iconClass} bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold`}>S</div>;
      case 'appleMusic': return <div className={`${iconClass} bg-black rounded-full flex items-center justify-center text-white text-xs font-bold`}>A</div>;
      case 'youtube': return <div className={`${iconClass} bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold`}>Y</div>;
      case 'tiktok': return <div className={`${iconClass} bg-black rounded-full flex items-center justify-center text-white text-xs font-bold`}>T</div>;
      case 'instagram': return <div className={`${iconClass} bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold`}>I</div>;
      case 'twitter': return <div className={`${iconClass} bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold`}>X</div>;
      default: return <Music className={iconClass} />;
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Settings</h1>
          <p className="text-[#A0A0A0]">Manage your account, preferences, and integrations</p>
        </div>

        {/* Profile Information */}
        <SettingsSection title="Profile Information">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Artist Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl px-4 py-3 text-white placeholder-[#555] text-sm focus:outline-none focus:ring-2 focus:ring-[#00C2FF]/50 transition-all w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">Email</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl px-4 py-3 text-white placeholder-[#555] text-sm focus:outline-none focus:ring-2 focus:ring-[#00C2FF]/50 transition-all w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Genre</label>
                <select
                  value={profile.genre}
                  onChange={(e) => setProfile({ ...profile, genre: e.target.value })}
                  className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl px-4 py-3 text-white placeholder-[#555] text-sm focus:outline-none focus:ring-2 focus:ring-[#00C2FF]/50 transition-all w-full"
                >
                  <option value="Hip-Hop">Hip-Hop</option>
                  <option value="R&B">R&B</option>
                  <option value="Pop">Pop</option>
                  <option value="Electronic">Electronic</option>
                  <option value="Rock">Rock</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">Location</label>
                <input
                  type="text"
                  value={profile.location}
                  onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                  className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl px-4 py-3 text-white placeholder-[#555] text-sm focus:outline-none focus:ring-2 focus:ring-[#00C2FF]/50 transition-all w-full"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Bio</label>
              <textarea
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl px-4 py-3 text-white placeholder-[#555] text-sm focus:outline-none focus:ring-2 focus:ring-[#00C2FF]/50 transition-all w-full h-24 resize-none"
                placeholder="Tell us about your music and artistic journey..."
              />
            </div>

            <button
              onClick={handleProfileSave}
              className="bg-gradient-to-r from-[#00C2FF] to-[#7B2EFF] text-white font-semibold py-3 px-6 rounded-xl hover:opacity-90 transition-all flex items-center"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </button>
          </div>
        </SettingsSection>

        {/* Subscription */}
        <SettingsSection title="Subscription">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-accent-blue/10 to-accent-purple/10 border border-[#00C2FF]/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <Crown className="w-6 h-6 text-[#C9A86A]" />
                <div>
                  <div className="text-white font-semibold flex items-center">
                    WAVEFORM {subscription.tier}
                    <span className="ml-2 px-2 py-1 bg-[#C9A86A]/20 text-[#C9A86A] rounded-full text-xs font-medium">
                      Active
                    </span>
                  </div>
                  <div className="text-[#A0A0A0] text-sm">
                    {subscription.billingCycle} • Next billing: {subscription.nextBilling}
                  </div>
                </div>
              </div>
              <button className="bg-[#0A0A0A] hover:bg-gray-900 border border-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Manage
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-white font-medium mb-3">Included Features</h4>
                <ul className="space-y-2">
                  {subscription.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm text-[#A0A0A0]">
                      <CheckCircle className="w-4 h-4 text-[#00FF9C] mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="text-white font-medium mb-3">Usage This Month</h4>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#A0A0A0]">API Calls</span>
                    <span className="text-white">2,847 / ∞</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#A0A0A0]">Data Points</span>
                    <span className="text-white">47,392 / ∞</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#A0A0A0]">Reports Generated</span>
                    <span className="text-white">23 / ∞</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SettingsSection>

        {/* Notification Preferences */}
        <SettingsSection title="Notification Preferences">
          <div className="space-y-2">
            <Toggle
              enabled={notifications.pulseAlerts}
              onChange={(value) => handleNotificationChange('pulseAlerts', value)}
              label="Pulse Alerts (New mentions detected)"
            />
            <Toggle
              enabled={notifications.momentumChanges}
              onChange={(value) => handleNotificationChange('momentumChanges', value)}
              label="Momentum Changes (Market shifts)"
            />
            <Toggle
              enabled={notifications.revenueAlerts}
              onChange={(value) => handleNotificationChange('revenueAlerts', value)}
              label="Revenue Alerts (Unclaimed money, opportunities)"
            />
            <Toggle
              enabled={notifications.actionRecommendations}
              onChange={(value) => handleNotificationChange('actionRecommendations', value)}
              label="Action Recommendations (AI suggestions)"
            />
            <Toggle
              enabled={notifications.weeklyReports}
              onChange={(value) => handleNotificationChange('weeklyReports', value)}
              label="Weekly Intelligence Reports"
            />
            <Toggle
              enabled={notifications.emailDigest}
              onChange={(value) => handleNotificationChange('emailDigest', value)}
              label="Email Digest (Daily summary)"
            />
          </div>
        </SettingsSection>

        {/* Connected Platforms */}
        <SettingsSection title="Connected Platforms">
          <div className="space-y-4">
            <p className="text-[#A0A0A0] text-sm">
              Connect your music platforms to unlock comprehensive cultural intelligence and revenue tracking.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(platforms).map(([platform, details]) => (
                <div key={platform} className="flex items-center justify-between p-4 bg-[#0A0A0A] rounded-lg border border-[#1E1E1E]">
                  <div className="flex items-center space-x-3">
                    {getPlatformIcon(platform)}
                    <div>
                      <div className="text-white font-medium capitalize">
                        {platform === 'appleMusic' ? 'Apple Music' : platform}
                      </div>
                      <div className={`text-xs px-2 py-1 rounded-full font-medium ${getPlatformStatusColor(details.status)}`}>
                        {details.status}
                      </div>
                    </div>
                  </div>
                  
                  <button className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    details.connected
                      ? 'bg-[#FF3B3B]/20 text-[#FF3B3B] hover:bg-[#FF3B3B]/30'
                      : 'bg-[#00C2FF]/20 text-[#00C2FF] hover:bg-[#00C2FF]/30'
                  }`}>
                    {details.connected ? 'Disconnect' : 'Connect'}
                  </button>
                </div>
              ))}
            </div>

            <div className="bg-[#00C2FF]/10 border border-[#00C2FF]/20 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Zap className="w-5 h-5 text-[#00C2FF] mt-1" />
                <div>
                  <h4 className="text-white font-medium mb-1">Connect More for Better Intelligence</h4>
                  <p className="text-[#A0A0A0] text-sm">
                    Each connected platform increases the accuracy of your cultural intelligence by 15-20%. 
                    We recommend connecting at least 3 major platforms for comprehensive tracking.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </SettingsSection>

        {/* API Access */}
        <SettingsSection title="API Access">
          <div className="space-y-4">
            <p className="text-[#A0A0A0] text-sm">
              Access WAVEFORM data programmatically with our REST API. Perfect for custom integrations and automation.
            </p>
            
            <div>
              <label className="block text-sm font-medium text-white mb-2">API Key</label>
              <div className="flex items-center space-x-2">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  value="wf_live_8a7b9c2d1e3f4g5h6i7j8k9l0m1n2o3p"
                  readOnly
                  className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl px-4 py-3 text-white placeholder-[#555] text-sm focus:outline-none focus:ring-2 focus:ring-[#00C2FF]/50 transition-all flex-1"
                />
                <button
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="p-3 bg-[#0A0A0A] hover:bg-gray-900 border border-gray-700 rounded-lg text-[#A0A0A0] hover:text-white transition-colors"
                >
                  {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-sm">
              <Link className="w-4 h-4 text-[#00C2FF]" />
              <a href="#" className="text-[#00C2FF] hover:text-[#7B2EFF] transition-colors">
                View API Documentation
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-3 bg-[#0A0A0A] rounded-lg border border-[#1E1E1E]">
                <div className="text-lg font-bold text-white">2,847</div>
                <div className="text-xs text-[#A0A0A0]">API Calls This Month</div>
              </div>
              <div className="text-center p-3 bg-[#0A0A0A] rounded-lg border border-[#1E1E1E]">
                <div className="text-lg font-bold text-white">99.9%</div>
                <div className="text-xs text-[#A0A0A0]">Uptime</div>
              </div>
              <div className="text-center p-3 bg-[#0A0A0A] rounded-lg border border-[#1E1E1E]">
                <div className="text-lg font-bold text-white">47ms</div>
                <div className="text-xs text-[#A0A0A0]">Avg Response Time</div>
              </div>
            </div>
          </div>
        </SettingsSection>

        {/* About & Version */}
        <SettingsSection title="About & Version">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-white font-medium">WAVEFORM</h4>
                <p className="text-[#A0A0A0] text-sm">Cultural Intelligence OS</p>
              </div>
              <span className="px-3 py-1 bg-[#00C2FF]/20 text-[#00C2FF] rounded-full text-sm font-medium">
                v2.1.4
              </span>
            </div>

            <div className="text-sm text-[#A0A0A0] space-y-1">
              <p>• Real-time cultural signal processing</p>
              <p>• AI-powered strategic recommendations</p>
              <p>• Cross-platform revenue intelligence</p>
              <p>• Geographic momentum tracking</p>
            </div>

            <div className="border-t border-[#1E1E1E] pt-4 text-center text-xs text-[#A0A0A0]">
              Developed by <span className="text-[#C9A86A] font-medium">GoKoncentrate</span>
              <br />
              © 2024 WAVEFORM. All rights reserved.
            </div>
          </div>
        </SettingsSection>
      </div>
    </DashboardLayout>
  );
}