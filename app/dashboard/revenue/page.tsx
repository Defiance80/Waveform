'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/ui/DashboardLayout';
import { 
  DollarSign, 
  AlertTriangle, 
  TrendingUp,
  Eye,
  ExternalLink,
  Clock,
  Shield,
  Zap,
  Music,
  Play
} from 'lucide-react';
import { revenueStreams, revenueAlerts } from '@/data/mockData';
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

const RevenueCard = ({ stream }: { stream: any }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'text-[#00FF9C] bg-[#00FF9C]/20';
      case 'Unclaimed': return 'text-[#FF3B3B] bg-[#FF3B3B]/20';
      case 'Opportunity': return 'text-[#FFB800] bg-[#FFB800]/20';
      default: return 'text-[#A0A0A0] bg-text-secondary/20';
    }
  };

  const getActionButton = (status: string) => {
    switch (status) {
      case 'Unclaimed': return 'Claim Now';
      case 'Opportunity': return 'Monetize';
      default: return 'View Details';
    }
  };

  return (
    <div className="bg-[#141414]/80 border-t-2 border-t-[#FFB800] rounded-lg p-4 sm:p-6 card-glow revenue-accent border border-[#2A2A2A] noise-overlay relative">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div 
            className="w-12 h-12 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: stream.color }}
          >
            <Music className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-white">{stream.platform}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(stream.status)}`}>
              {stream.status}
            </span>
          </div>
        </div>
        <ExternalLink className="w-4 h-4 text-[#A0A0A0] hover:text-[#00C2FF] cursor-pointer transition-colors" />
      </div>

      <div className="space-y-3">
        <div className="text-3xl font-bold text-white">{stream.amount}</div>
        <div className="flex items-center justify-between">
          <span className="text-[#A0A0A0] text-sm">Growth</span>
          <span className="text-[#00FF9C] font-medium">{stream.growth}</span>
        </div>
      </div>

      <button className={`w-full mt-4 py-2 rounded-lg text-sm font-medium transition-colors ${
        stream.status === 'Unclaimed' 
          ? 'bg-[#FF3B3B] hover:bg-[#FF3B3B]/80 text-white'
          : stream.status === 'Opportunity'
          ? 'bg-[#FFB800] hover:bg-[#FFB800]/80 text-white'
          : 'bg-[#0A0A0A] hover:bg-gray-900 border border-gray-700 text-white'
      }`}>
        {getActionButton(stream.status)}
      </button>
    </div>
  );
};

const AlertCard = ({ alert }: { alert: any }) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'border-l-status-danger text-[#FF3B3B]';
      case 'Medium': return 'border-l-status-warning text-[#FFB800]';
      case 'Low': return 'border-l-accent-blue text-[#00C2FF]';
      default: return 'border-l-text-secondary text-[#A0A0A0]';
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'Unclaimed Royalties': return <DollarSign className="w-5 h-5" />;
      case 'Trending Sound': return <TrendingUp className="w-5 h-5" />;
      case 'Unauthorized Usage': return <Shield className="w-5 h-5" />;
      default: return <AlertTriangle className="w-5 h-5" />;
    }
  };

  return (
    <div className={`bg-[#141414]/80 rounded-lg p-4 sm:p-6 card-glow border-l-4 ${getPriorityColor(alert.priority)} noise-overlay relative`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${getPriorityColor(alert.priority).includes('danger') ? 'bg-[#FF3B3B]/20' : 
            getPriorityColor(alert.priority).includes('warning') ? 'bg-[#FFB800]/20' : 'bg-[#00C2FF]/20'}`}>
            {getIcon(alert.type)}
          </div>
          <div>
            <h4 className="font-semibold text-white">{alert.type}</h4>
            <p className="text-sm text-[#A0A0A0]">{alert.platform}</p>
          </div>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          alert.priority === 'High' ? 'bg-[#FF3B3B]/20 text-[#FF3B3B]' :
          alert.priority === 'Medium' ? 'bg-[#FFB800]/20 text-[#FFB800]' :
          'bg-[#00C2FF]/20 text-[#00C2FF]'
        }`}>
          {alert.priority} Priority
        </span>
      </div>

      <div className="space-y-3">
        <div className="text-2xl font-bold text-white">{alert.amount}</div>
        <p className="text-[#A0A0A0] text-sm">{alert.description}</p>
        
        <button className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
          alert.priority === 'High' 
            ? 'bg-[#FF3B3B] hover:bg-[#FF3B3B]/80 text-white'
            : 'bg-[#00C2FF] hover:bg-[#00C2FF]/80 text-white'
        }`}>
          {alert.action}
        </button>
      </div>
    </div>
  );
};

export default function RevenuePage() {
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d');

  // Mock revenue trend data
  const revenueTrendData = [
    { name: 'Week 1', revenue: 2400, royalties: 800 },
    { name: 'Week 2', revenue: 3200, royalties: 1200 },
    { name: 'Week 3', revenue: 2800, royalties: 900 },
    { name: 'Week 4', revenue: 4500, royalties: 1500 },
    { name: 'Week 5', revenue: 5200, royalties: 1800 },
  ];

  // Data for pie chart
  const revenueBreakdown = [
    { name: 'Streaming', value: 45, color: '#00C2FF' },
    { name: 'Sync Licensing', value: 25, color: '#7B2EFF' },
    { name: 'Performance Rights', value: 20, color: '#C9A86A' },
    { name: 'Merchandise', value: 10, color: '#00FF9C' },
  ];

  const totalRevenue = revenueStreams.reduce((sum, stream) => {
    const amount = parseFloat(stream.amount.replace(/[$,]/g, ''));
    return sum + amount;
  }, 0);

  const unclaimedRevenue = revenueStreams
    .filter(stream => stream.status === 'Unclaimed')
    .reduce((sum, stream) => {
      const amount = parseFloat(stream.amount.replace(/[$,]/g, ''));
      return sum + amount;
    }, 0);

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">Revenue Intelligence</h1>
            <p className="text-[#A0A0A0]">Monitor revenue streams and identify opportunities</p>
          </div>
          <div className="flex items-center space-x-2">
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              className="bg-[#141414] border border-[#2A2A2A] text-white rounded-lg px-3 py-2 text-sm"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
          </div>
        </div>

        {/* Revenue Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-[#141414] rounded-lg p-4 card-glow">
            <div className="flex items-center justify-between mb-3">
              <DollarSign className="w-5 h-5 text-[#00FF9C]" />
              <TrendingUp className="w-4 h-4 text-[#00FF9C]" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              ${totalRevenue.toLocaleString()}
            </div>
            <div className="text-[#A0A0A0] text-sm">Total Revenue</div>
            <div className="text-[#00FF9C] text-sm font-medium">+23% this month</div>
          </div>

          <div className="bg-[#141414] rounded-lg p-4 card-glow">
            <div className="flex items-center justify-between mb-3">
              <AlertTriangle className="w-5 h-5 text-[#FF3B3B]" />
              <Eye className="w-4 h-4 text-[#FF3B3B]" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              ${unclaimedRevenue.toLocaleString()}
            </div>
            <div className="text-[#A0A0A0] text-sm">Unclaimed Revenue</div>
            <div className="text-[#FF3B3B] text-sm font-medium">Needs attention</div>
          </div>

          <div className="bg-[#141414] rounded-lg p-4 card-glow">
            <div className="flex items-center justify-between mb-3">
              <Music className="w-5 h-5 text-[#00C2FF]" />
              <Zap className="w-4 h-4 text-[#00C2FF]" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">4</div>
            <div className="text-[#A0A0A0] text-sm">Active Platforms</div>
            <div className="text-[#00C2FF] text-sm font-medium">All connected</div>
          </div>

          <div className="bg-[#141414] rounded-lg p-4 card-glow">
            <div className="flex items-center justify-between mb-3">
              <Clock className="w-5 h-5 text-[#7B2EFF]" />
              <TrendingUp className="w-4 h-4 text-[#00FF9C]" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">$1,847</div>
            <div className="text-[#A0A0A0] text-sm">This Week</div>
            <div className="text-[#00FF9C] text-sm font-medium">+45% vs last week</div>
          </div>
        </div>

        {/* Revenue Alerts */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Revenue Alerts</h3>
            <span className="px-3 py-1 bg-[#FF3B3B]/20 text-[#FF3B3B] rounded-full text-sm font-medium">
              {revenueAlerts.length} Active
            </span>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {revenueAlerts.map((alert) => (
              <AlertCard key={alert.id} alert={alert} />
            ))}
          </div>
        </div>

        {/* Revenue Streams */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Platform Revenue Streams</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {revenueStreams.map((stream, index) => (
              <RevenueCard key={index} stream={stream} />
            ))}
          </div>
        </div>

        {/* Revenue Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Trend */}
          <div className="bg-[#141414] rounded-lg p-6 card-glow border border-[#2A2A2A]">
            <h3 className="text-lg font-semibold text-white mb-4">Revenue Trend</h3>
            
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueTrendData}>
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00C2FF" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#00C2FF" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="royaltiesGradient" x1="0" y1="0" x2="0" y2="1">
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
                    dataKey="revenue"
                    stroke="#00C2FF"
                    fillOpacity={1}
                    fill="url(#revenueGradient)"
                  />
                  <Area
                    type="monotone"
                    dataKey="royalties"
                    stroke="#7B2EFF"
                    fillOpacity={1}
                    fill="url(#royaltiesGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            <div className="flex items-center justify-center space-x-6 mt-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-[#00C2FF] rounded-full"></div>
                <span className="text-[#A0A0A0]">Total Revenue</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-[#7B2EFF] rounded-full"></div>
                <span className="text-[#A0A0A0]">Royalties</span>
              </div>
            </div>
          </div>

          {/* Revenue Breakdown */}
          <div className="bg-[#141414] rounded-lg p-6 card-glow border border-[#2A2A2A]">
            <h3 className="text-lg font-semibold text-white mb-4">Revenue Breakdown</h3>
            
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={revenueBreakdown}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                  >
                    {revenueBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#111111', 
                      border: '1px solid #333',
                      borderRadius: '8px',
                      color: '#FFFFFF'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="space-y-2">
              {revenueBreakdown.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-[#A0A0A0]">{item.name}</span>
                  </div>
                  <span className="text-white font-medium">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-[#141414] rounded-lg p-6 card-glow border border-[#2A2A2A]">
          <h3 className="text-lg font-semibold text-white mb-4">Quick Revenue Actions</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="bg-[#FF3B3B]/20 hover:bg-[#FF3B3B]/30 border border-[#FF3B3B]/30 rounded-lg p-4 text-left transition-colors group">
              <div className="flex items-center space-x-3">
                <DollarSign className="w-6 h-6 text-[#FF3B3B] group-hover:scale-110 transition-transform" />
                <div>
                  <div className="text-white font-medium">Claim All Revenue</div>
                  <div className="text-[#A0A0A0] text-sm">$4,526 unclaimed</div>
                </div>
              </div>
            </button>

            <button className="bg-[#00C2FF]/20 hover:bg-[#00C2FF]/30 border border-[#00C2FF]/30 rounded-lg p-4 text-left transition-colors group">
              <div className="flex items-center space-x-3">
                <Shield className="w-6 h-6 text-[#00C2FF] group-hover:scale-110 transition-transform" />
                <div>
                  <div className="text-white font-medium">Dispute Usage</div>
                  <div className="text-[#A0A0A0] text-sm">3 unauthorized uses</div>
                </div>
              </div>
            </button>

            <button className="bg-[#7B2EFF]/20 hover:bg-[#7B2EFF]/30 border border-[#7B2EFF]/30 rounded-lg p-4 text-left transition-colors group">
              <div className="flex items-center space-x-3">
                <Play className="w-6 h-6 text-[#7B2EFF] group-hover:scale-110 transition-transform" />
                <div>
                  <div className="text-white font-medium">Connect Platform</div>
                  <div className="text-[#A0A0A0] text-sm">Add new revenue stream</div>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}