'use client';

import React from 'react';
import { DashboardLayout } from '@/components/ui/DashboardLayout';
import { 
  TrendingUp, 
  Radio, 
  Zap, 
  DollarSign, 
  ArrowUp, 
  Clock, 
  MapPin, 
  Brain,
  ExternalLink,
  Play
} from 'lucide-react';
import { momentumData, quickStats, recentActivity, artistProfile } from '@/data/mockData';

const MomentumGauge = ({ score, change }: { score: number; change: number }) => {
  const circumference = 2 * Math.PI * 45;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="relative w-32 h-32">
      <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="8"
          fill="transparent"
        />
        {/* Progress circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke="url(#gaugeGradient)"
          strokeWidth="8"
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
        {/* Gradient definition */}
        <defs>
          <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00C2FF" />
            <stop offset="100%" stopColor="#7B2EFF" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-2xl font-bold text-text-primary">{score}</div>
        <div className="text-xs text-status-success flex items-center">
          <ArrowUp className="w-3 h-3 mr-1" />
          +{change}
        </div>
      </div>
    </div>
  );
};

const ActivityCard = ({ activity }: { activity: any }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'podcast': return <Radio className="w-4 h-4" />;
      case 'social': return <Zap className="w-4 h-4" />;
      case 'revenue': return <DollarSign className="w-4 h-4" />;
      case 'geo': return <MapPin className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getColor = (impact: string) => {
    switch (impact) {
      case 'High': return 'border-l-status-success';
      case 'Medium': return 'border-l-accent-blue';
      default: return 'border-l-text-secondary';
    }
  };

  return (
    <div className={`bg-primary-secondary rounded-lg p-4 border-l-4 ${getColor(activity.impact)} card-glow`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary-bg rounded-lg text-accent-blue">
            {getIcon(activity.type)}
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-text-primary">{activity.title}</h4>
            <p className="text-sm text-text-secondary mt-1">{activity.description}</p>
            <span className="text-xs text-text-secondary">{activity.time}</span>
          </div>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          activity.impact === 'High' 
            ? 'bg-status-success/20 text-status-success'
            : activity.impact === 'Medium'
            ? 'bg-accent-blue/20 text-accent-blue'
            : 'bg-text-secondary/20 text-text-secondary'
        }`}>
          {activity.impact}
        </span>
      </div>
    </div>
  );
};

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Hero Panel - Current Momentum */}
        <div className="gradient-border">
          <div className="bg-primary-bg rounded-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-text-primary mb-2">CURRENT MOMENTUM</h2>
                <p className="text-text-secondary">
                  You are trending in <span className="text-accent-blue font-semibold">3 emerging markets</span> and{' '}
                  <span className="text-accent-purple font-semibold">2 underground podcast networks</span>.
                </p>
              </div>
              <Brain className="w-8 h-8 text-accent-gold" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Momentum Score */}
              <div className="text-center">
                <MomentumGauge score={momentumData.score} change={momentumData.change} />
                <div className="mt-4">
                  <div className="text-lg font-bold text-text-primary">Momentum Score</div>
                  <div className="text-text-secondary">Real-time intelligence</div>
                </div>
              </div>

              {/* Top Region */}
              <div className="bg-primary-secondary rounded-lg p-4 card-glow">
                <div className="flex items-center justify-between mb-3">
                  <MapPin className="w-5 h-5 text-accent-blue" />
                  <span className="text-xs bg-status-success/20 text-status-success px-2 py-1 rounded-full">
                    Active
                  </span>
                </div>
                <div className="text-2xl font-bold text-text-primary mb-1">{momentumData.topRegion}</div>
                <div className="text-text-secondary text-sm">Top Region</div>
                <div className="text-accent-blue text-sm font-medium mt-2 flex items-center">
                  <ArrowUp className="w-3 h-3 mr-1" />
                  Early Surge
                </div>
              </div>

              {/* Trend Direction */}
              <div className="bg-primary-secondary rounded-lg p-4 card-glow">
                <div className="flex items-center justify-between mb-3">
                  <TrendingUp className="w-5 h-5 text-status-success" />
                  <div className="w-3 h-3 bg-status-success rounded-full animate-pulse"></div>
                </div>
                <div className="text-2xl font-bold text-text-primary mb-1">{momentumData.direction}</div>
                <div className="text-text-secondary text-sm">Trend Direction</div>
                <div className="text-status-success text-sm font-medium mt-2">
                  +127% growth
                </div>
              </div>

              {/* AI Insight */}
              <div className="bg-gradient-to-br from-accent-blue/10 to-accent-purple/10 border border-accent-blue/20 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <Brain className="w-5 h-5 text-accent-purple mr-2" />
                  <span className="text-xs text-accent-purple font-medium">AI INSIGHT</span>
                </div>
                <p className="text-sm text-text-primary leading-relaxed">
                  Your sound is resonating in underground Atlanta circles tied to nightlife DJs. 
                  Strike within 48 hours.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickStats.map((stat, index) => (
            <div key={index} className="bg-primary-secondary rounded-lg p-4 card-glow">
              <div className="text-2xl font-bold text-text-primary mb-1 animate-count-up">
                {stat.value}
              </div>
              <div className="text-text-secondary text-sm mb-2">{stat.label}</div>
              <div className="text-accent-blue text-sm font-medium">{stat.change}</div>
            </div>
          ))}
        </div>

        {/* Recent Activity Feed */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-text-primary">Recent Activity</h3>
            <button className="text-accent-blue hover:text-accent-purple text-sm font-medium transition-colors">
              View All
            </button>
          </div>
          
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="bg-primary-secondary hover:bg-primary-bg border border-gray-800 rounded-lg p-4 text-left transition-all duration-200 card-glow group">
            <div className="flex items-center justify-between mb-3">
              <Radio className="w-6 h-6 text-accent-blue group-hover:scale-110 transition-transform" />
              <ExternalLink className="w-4 h-4 text-text-secondary" />
            </div>
            <div className="text-text-primary font-medium">Check Pulse</div>
            <div className="text-text-secondary text-sm">View cultural signals</div>
          </button>

          <button className="bg-primary-secondary hover:bg-primary-bg border border-gray-800 rounded-lg p-4 text-left transition-all duration-200 card-glow group">
            <div className="flex items-center justify-between mb-3">
              <TrendingUp className="w-6 h-6 text-status-success group-hover:scale-110 transition-transform" />
              <ExternalLink className="w-4 h-4 text-text-secondary" />
            </div>
            <div className="text-text-primary font-medium">Atlanta Campaign</div>
            <div className="text-text-secondary text-sm">Run geo-targeted push</div>
          </button>

          <button className="bg-primary-secondary hover:bg-primary-bg border border-gray-800 rounded-lg p-4 text-left transition-all duration-200 card-glow group">
            <div className="flex items-center justify-between mb-3">
              <DollarSign className="w-6 h-6 text-status-warning group-hover:scale-110 transition-transform" />
              <ExternalLink className="w-4 h-4 text-text-secondary" />
            </div>
            <div className="text-text-primary font-medium">Claim Revenue</div>
            <div className="text-text-secondary text-sm">$4.5K unclaimed</div>
          </button>

          <button className="bg-primary-secondary hover:bg-primary-bg border border-gray-800 rounded-lg p-4 text-left transition-all duration-200 card-glow group">
            <div className="flex items-center justify-between mb-3">
              <Play className="w-6 h-6 text-accent-purple group-hover:scale-110 transition-transform" />
              <ExternalLink className="w-4 h-4 text-text-secondary" />
            </div>
            <div className="text-text-primary font-medium">Run Strategy</div>
            <div className="text-text-secondary text-sm">AI recommendations</div>
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}