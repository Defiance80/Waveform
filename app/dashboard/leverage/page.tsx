'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/ui/DashboardLayout';
import { 
  Target, 
  Brain, 
  CheckCircle,
  Clock,
  SkipForward,
  TrendingUp,
  Users,
  DollarSign,
  Music,
  Globe,
  Calendar,
  Play,
  Zap,
  AlertCircle
} from 'lucide-react';
import { recommendedActions } from '@/data/mockData';

const ActionCard = ({ action, onComplete, onSkip }: { 
  action: any; 
  onComplete: (id: number) => void;
  onSkip: (id: number) => void;
}) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Urgent': return 'border-l-status-danger text-status-danger bg-status-danger/10';
      case 'High': return 'border-l-accent-blue text-accent-blue bg-accent-blue/10';
      case 'Medium': return 'border-l-accent-purple text-accent-purple bg-accent-purple/10';
      case 'Low': return 'border-l-text-secondary text-text-secondary bg-text-secondary/10';
      default: return 'border-l-text-secondary text-text-secondary bg-text-secondary/10';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Press Relations': return <Users className="w-5 h-5" />;
      case 'Content Strategy': return <Music className="w-5 h-5" />;
      case 'Marketing': return <Globe className="w-5 h-5" />;
      case 'Collaboration': return <Users className="w-5 h-5" />;
      case 'Revenue': return <DollarSign className="w-5 h-5" />;
      default: return <Target className="w-5 h-5" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'Very High': return 'text-status-success bg-status-success/20';
      case 'High': return 'text-status-success bg-status-success/20';
      case 'Medium': return 'text-accent-gold bg-accent-gold/20';
      case 'Low': return 'text-text-secondary bg-text-secondary/20';
      default: return 'text-text-secondary bg-text-secondary/20';
    }
  };

  return (
    <div className={`bg-primary-secondary rounded-lg p-6 card-glow border-l-4 ${getPriorityColor(action.priority)}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${getPriorityColor(action.priority).split(' ')[2]}`}>
            {getCategoryIcon(action.category)}
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-text-primary mb-1">{action.title}</h4>
            <p className="text-sm text-text-secondary mb-2">{action.description}</p>
            <div className="flex items-center space-x-2 text-xs">
              <span className={`px-2 py-1 rounded-full font-medium ${getPriorityColor(action.priority).split('bg-')[1] ? `bg-${getPriorityColor(action.priority).split('bg-')[1]} ${getPriorityColor(action.priority).split(' ')[1]}` : 'bg-text-secondary/20 text-text-secondary'}`}>
                {action.priority}
              </span>
              <span className="text-text-secondary">{action.category}</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm font-medium text-text-primary">{action.timeframe}</div>
          <div className="text-xs text-text-secondary">Deadline</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="text-sm font-medium text-text-primary">Effort</div>
          <div className={`text-xs px-2 py-1 rounded-full mt-1 ${
            action.effort === 'Low' ? 'bg-status-success/20 text-status-success' :
            action.effort === 'Medium' ? 'bg-accent-gold/20 text-accent-gold' :
            'bg-status-danger/20 text-status-danger'
          }`}>
            {action.effort}
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-sm font-medium text-text-primary">Impact</div>
          <div className={`text-xs px-2 py-1 rounded-full mt-1 ${getImpactColor(action.impact)}`}>
            {action.impact}
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-sm font-medium text-text-primary">ROI</div>
          <div className="text-xs px-2 py-1 rounded-full mt-1 bg-accent-blue/20 text-accent-blue">
            {action.effort === 'Low' && action.impact === 'High' ? 'Excellent' :
             action.effort === 'Medium' && action.impact === 'High' ? 'Good' :
             'Fair'}
          </div>
        </div>
      </div>

      <div className="flex space-x-2">
        <button
          onClick={() => onComplete(action.id)}
          className="flex-1 bg-accent-blue hover:bg-accent-blue/80 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
        >
          <Play className="w-4 h-4 mr-2" />
          Execute
        </button>
        <button
          onClick={() => onSkip(action.id)}
          className="px-4 py-2 bg-primary-bg hover:bg-gray-900 border border-gray-700 text-text-secondary hover:text-text-primary rounded-lg text-sm font-medium transition-colors"
        >
          <SkipForward className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

const StrategyBrief = () => (
  <div className="bg-gradient-to-br from-accent-purple/10 to-accent-blue/10 border border-accent-purple/20 rounded-lg p-6">
    <div className="flex items-center mb-4">
      <Brain className="w-6 h-6 text-accent-purple mr-3" />
      <h3 className="text-lg font-semibold text-text-primary">AI Strategic Brief</h3>
      <span className="ml-auto px-3 py-1 bg-status-success/20 text-status-success rounded-full text-xs font-medium">
        Updated 2 min ago
      </span>
    </div>
    
    <div className="space-y-4">
      <div className="bg-primary-bg rounded-lg p-4">
        <h4 className="text-accent-gold font-semibold mb-2">🎯 Current Momentum Window</h4>
        <p className="text-text-primary text-sm leading-relaxed">
          You're experiencing a perfect storm of momentum: Atlanta market surge (+127%), podcast network amplification (3 major shows), 
          and viral content velocity (+340%). The next <strong>72 hours</strong> are critical for maximum leverage.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-primary-bg rounded-lg p-4">
          <h4 className="text-text-primary font-semibold mb-2 flex items-center">
            <TrendingUp className="w-4 h-4 mr-2 text-accent-blue" />
            Priority Actions
          </h4>
          <ul className="text-sm text-text-secondary space-y-1">
            <li>• Claim YouTube revenue ($4.5K waiting)</li>
            <li>• Contact Pitchfork/XXL (response rates peak)</li>
            <li>• Launch Atlanta geo-campaign (window closing)</li>
          </ul>
        </div>
        
        <div className="bg-primary-bg rounded-lg p-4">
          <h4 className="text-text-primary font-semibold mb-2 flex items-center">
            <AlertCircle className="w-4 h-4 mr-2 text-accent-gold" />
            Risk Factors
          </h4>
          <ul className="text-sm text-text-secondary space-y-1">
            <li>• Momentum plateau risk in 5-7 days</li>
            <li>• Competitor activity increasing in ATL</li>
            <li>• UGC wave needs official response</li>
          </ul>
        </div>
      </div>
      
      <div className="text-sm text-text-secondary">
        <span className="text-accent-blue">Confidence Level:</span> 94% • 
        <span className="text-accent-purple ml-2">Based on:</span> 47 data points across 8 platforms
      </div>
    </div>
  </div>
);

export default function LeveragePage() {
  const [actions, setActions] = useState(recommendedActions);
  const [activeTab, setActiveTab] = useState('all');
  const [completedActions, setCompletedActions] = useState<number[]>([]);
  const [skippedActions, setSkippedActions] = useState<number[]>([]);

  const handleCompleteAction = (id: number) => {
    setCompletedActions([...completedActions, id]);
  };

  const handleSkipAction = (id: number) => {
    setSkippedActions([...skippedActions, id]);
  };

  const filterActions = (filterType: string) => {
    switch (filterType) {
      case 'urgent':
        return actions.filter(action => action.priority === 'Urgent');
      case 'high-impact':
        return actions.filter(action => action.impact === 'High' || action.impact === 'Very High');
      case 'quick-wins':
        return actions.filter(action => action.effort === 'Low' && (action.impact === 'High' || action.impact === 'Very High'));
      default:
        return actions;
    }
  };

  const filteredActions = filterActions(activeTab).filter(action => 
    !completedActions.includes(action.id) && !skippedActions.includes(action.id)
  );

  const TabButton = ({ id, label, count }: { id: string; label: string; count?: number }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
        activeTab === id 
          ? 'bg-accent-blue text-white shadow-lg' 
          : 'bg-primary-secondary text-text-secondary hover:text-text-primary hover:bg-gray-800'
      }`}
    >
      {label}
      {count !== undefined && (
        <span className="ml-2 px-2 py-1 bg-current/20 rounded-full text-xs">
          {count}
        </span>
      )}
    </button>
  );

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-text-primary mb-2">Strategic Leverage</h1>
            <p className="text-text-secondary">AI-powered action center for maximum impact</p>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-text-secondary" />
            <span className="text-text-secondary text-sm">Actions updated every 30 minutes</span>
          </div>
        </div>

        {/* AI Strategy Brief */}
        <StrategyBrief />

        {/* Action Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-primary-secondary rounded-lg p-4 card-glow">
            <div className="flex items-center justify-between mb-3">
              <Target className="w-5 h-5 text-accent-blue" />
              <TrendingUp className="w-4 h-4 text-accent-blue" />
            </div>
            <div className="text-2xl font-bold text-text-primary mb-1">
              {actions.length - completedActions.length - skippedActions.length}
            </div>
            <div className="text-text-secondary text-sm">Active Actions</div>
            <div className="text-accent-blue text-sm font-medium">Ready to execute</div>
          </div>

          <div className="bg-primary-secondary rounded-lg p-4 card-glow">
            <div className="flex items-center justify-between mb-3">
              <CheckCircle className="w-5 h-5 text-status-success" />
              <Zap className="w-4 h-4 text-status-success" />
            </div>
            <div className="text-2xl font-bold text-text-primary mb-1">{completedActions.length}</div>
            <div className="text-text-secondary text-sm">Completed</div>
            <div className="text-status-success text-sm font-medium">This week</div>
          </div>

          <div className="bg-primary-secondary rounded-lg p-4 card-glow">
            <div className="flex items-center justify-between mb-3">
              <Clock className="w-5 h-5 text-status-warning" />
              <AlertCircle className="w-4 h-4 text-status-warning" />
            </div>
            <div className="text-2xl font-bold text-text-primary mb-1">
              {actions.filter(a => a.priority === 'Urgent').length}
            </div>
            <div className="text-text-secondary text-sm">Urgent</div>
            <div className="text-status-warning text-sm font-medium">&lt; 48 hours</div>
          </div>

          <div className="bg-primary-secondary rounded-lg p-4 card-glow">
            <div className="flex items-center justify-between mb-3">
              <DollarSign className="w-5 h-5 text-accent-gold" />
              <TrendingUp className="w-4 h-4 text-status-success" />
            </div>
            <div className="text-2xl font-bold text-text-primary mb-1">$8.2K</div>
            <div className="text-text-secondary text-sm">Revenue Potential</div>
            <div className="text-status-success text-sm font-medium">From pending actions</div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          <TabButton 
            id="all" 
            label="All Actions" 
            count={filteredActions.length} 
          />
          <TabButton 
            id="urgent" 
            label="Urgent" 
            count={filterActions('urgent').filter(a => !completedActions.includes(a.id) && !skippedActions.includes(a.id)).length}
          />
          <TabButton 
            id="high-impact" 
            label="High Impact" 
            count={filterActions('high-impact').filter(a => !completedActions.includes(a.id) && !skippedActions.includes(a.id)).length}
          />
          <TabButton 
            id="quick-wins" 
            label="Quick Wins" 
            count={filterActions('quick-wins').filter(a => !completedActions.includes(a.id) && !skippedActions.includes(a.id)).length}
          />
        </div>

        {/* Action Queue */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-text-primary">
              {activeTab === 'all' ? 'Recommended Actions' :
               activeTab === 'urgent' ? 'Urgent Actions' :
               activeTab === 'high-impact' ? 'High Impact Actions' :
               'Quick Win Actions'}
            </h3>
            <button className="text-accent-blue hover:text-accent-purple text-sm font-medium transition-colors">
              Refresh Queue
            </button>
          </div>
          
          {filteredActions.length > 0 ? (
            <div className="space-y-4">
              {filteredActions.map((action) => (
                <ActionCard 
                  key={action.id} 
                  action={action}
                  onComplete={handleCompleteAction}
                  onSkip={handleSkipAction}
                />
              ))}
            </div>
          ) : (
            <div className="bg-primary-secondary rounded-lg p-8 text-center card-glow border border-gray-800">
              <CheckCircle className="w-16 h-16 text-status-success mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium text-text-primary mb-2">All caught up!</h3>
              <p className="text-text-secondary">
                {activeTab === 'all' ? 'No actions pending. Great work!' :
                 activeTab === 'urgent' ? 'No urgent actions at the moment.' :
                 activeTab === 'high-impact' ? 'No high-impact actions pending.' :
                 'All quick wins completed!'}
              </p>
            </div>
          )}
        </div>

        {/* Campaign Templates */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-text-primary">Campaign Templates</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-primary-secondary rounded-lg p-6 card-glow border border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <Globe className="w-6 h-6 text-accent-blue" />
                <span className="px-2 py-1 bg-accent-blue/20 text-accent-blue rounded-full text-xs font-medium">
                  Geo-Targeted
                </span>
              </div>
              <h4 className="font-semibold text-text-primary mb-2">Atlanta Surge Campaign</h4>
              <p className="text-sm text-text-secondary mb-4">
                Pre-configured campaign for Atlanta market momentum. Includes playlist pitching, blog outreach, and local influencer engagement.
              </p>
              <button className="w-full bg-accent-blue hover:bg-accent-blue/80 text-white py-2 rounded-lg text-sm font-medium transition-colors">
                Launch Campaign
              </button>
            </div>

            <div className="bg-primary-secondary rounded-lg p-6 card-glow border border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <Users className="w-6 h-6 text-accent-purple" />
                <span className="px-2 py-1 bg-accent-purple/20 text-accent-purple rounded-full text-xs font-medium">
                  Press
                </span>
              </div>
              <h4 className="font-semibold text-text-primary mb-2">Blog Outreach Blitz</h4>
              <p className="text-sm text-text-secondary mb-4">
                Comprehensive press campaign targeting publications that mentioned you. Automated follow-ups and relationship building.
              </p>
              <button className="w-full bg-accent-purple hover:bg-accent-purple/80 text-white py-2 rounded-lg text-sm font-medium transition-colors">
                Launch Campaign
              </button>
            </div>

            <div className="bg-primary-secondary rounded-lg p-6 card-glow border border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <DollarSign className="w-6 h-6 text-accent-gold" />
                <span className="px-2 py-1 bg-accent-gold/20 text-accent-gold rounded-full text-xs font-medium">
                  Revenue
                </span>
              </div>
              <h4 className="font-semibold text-text-primary mb-2">Revenue Recovery</h4>
              <p className="text-sm text-text-secondary mb-4">
                Automated claiming of unclaimed royalties, unauthorized usage disputes, and monetization optimization across platforms.
              </p>
              <button className="w-full bg-accent-gold hover:bg-accent-gold/80 text-white py-2 rounded-lg text-sm font-medium transition-colors">
                Launch Campaign
              </button>
            </div>
          </div>
        </div>

        {/* Completed Actions (if any) */}
        {completedActions.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-text-primary">Recently Completed</h3>
            
            <div className="bg-primary-secondary rounded-lg p-4 card-glow border border-gray-800">
              <div className="space-y-2">
                {actions.filter(action => completedActions.includes(action.id)).map((action) => (
                  <div key={action.id} className="flex items-center justify-between p-3 bg-status-success/10 border border-status-success/20 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-status-success" />
                      <div>
                        <div className="text-text-primary font-medium">{action.title}</div>
                        <div className="text-text-secondary text-sm">Completed</div>
                      </div>
                    </div>
                    <span className="text-status-success text-sm font-medium">✓ Done</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}