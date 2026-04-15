'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/ui/DashboardLayout';
import {
  DollarSign, TrendingUp, ExternalLink, Clock, Shield,
  Zap, BarChart3, Link2, AlertTriangle, CheckCircle, CreditCard
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

/* ─── Payment Aggregators ─── */
const paymentPlatforms = [
  { id: 'stripe',  name: 'Stripe',      color: '#635BFF', connected: true,  monthly: '$8,420', growth: '+18%', status: 'Active',      icon: '⚡' },
  { id: 'paypal',  name: 'PayPal',      color: '#003087', connected: true,  monthly: '$3,180', growth: '+7%',  status: 'Active',      icon: '🅿' },
  { id: 'apple',   name: 'Apple Pay',   color: '#A2AAAD', connected: true,  monthly: '$1,640', growth: '+24%', status: 'Active',      icon: '🍎' },
  { id: 'shopify', name: 'Shopify',     color: '#96BF48', connected: false, monthly: null,     growth: null,   status: 'Connect',     icon: '🛍' },
  { id: 'square',  name: 'Square',      color: '#000000', connected: false, monthly: null,     growth: null,   status: 'Connect',     icon: '▪' },
  { id: 'venmo',   name: 'Venmo',       color: '#3D95CE', connected: false, monthly: null,     growth: null,   status: 'Connect',     icon: '💸' },
];

const revenueAlerts = [
  { type: 'Opportunity',   platform: 'Shopify',  amount: '+$2,400 est.',  description: 'Connecting Shopify would consolidate 3 product lines into revenue tracking.', priority: 'High' as const,   action: 'Connect Shopify' },
  { type: 'Spike',         platform: 'Apple Pay', amount: '$640 in 24h',  description: 'Apple Pay transactions up 24% — campaign is converting well on mobile.',       priority: 'Medium' as const, action: 'View Details' },
  { type: 'Marketing ROI', platform: 'Stripe',   amount: '3.2× ROAS',    description: 'Last campaign spend returned 3.2× via Stripe checkout. Scale the campaign.',  priority: 'High' as const,   action: 'Scale Campaign' },
];

const trendData = [
  { name: 'W1', stripe: 1800, paypal: 820, apple: 310 },
  { name: 'W2', stripe: 2200, paypal: 940, apple: 390 },
  { name: 'W3', stripe: 1940, paypal: 760, apple: 340 },
  { name: 'W4', stripe: 2480, paypal: 660, apple: 600 },
  { name: 'W5', stripe: 2420, paypal: 980, apple: 640 },  // partial current week
];

const marketingSpend = [
  { channel: 'Social Ads (Meta)', spend: '$1,200', roas: '2.8×', color: '#00C2FF' },
  { channel: 'TikTok Ads',        spend: '$640',   roas: '4.1×', color: '#7B2EFF' },
  { channel: 'Google Ads',        spend: '$480',   roas: '1.9×', color: '#FFB800' },
  { channel: 'Influencer / PR',   spend: '$800',   roas: '3.4×', color: '#00FF9C' },
];

const breakdownData = [
  { name: 'Stripe',    value: 64, color: '#635BFF' },
  { name: 'PayPal',    value: 24, color: '#003087' },
  { name: 'Apple Pay', value: 12, color: '#A2AAAD' },
];

const PlatformCard = ({ p }: { p: typeof paymentPlatforms[0] }) => (
  <div className="bg-[#141414]/80 border border-[#2A2A2A] rounded-xl p-4 sm:p-5 card-glow border-t-2"
    style={{ borderTopColor: p.color }}>
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <span className="text-xl">{p.icon}</span>
        <div>
          <h3 className="font-semibold text-white text-sm">{p.name}</h3>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.connected ? 'bg-[#00FF9C]/20 text-[#00FF9C]' : 'bg-[#A0A0A0]/20 text-[#A0A0A0]'}`}>
            {p.status}
          </span>
        </div>
      </div>
      <ExternalLink className="w-4 h-4 text-[#A0A0A0] hover:text-[#00C2FF] cursor-pointer transition-colors" />
    </div>
    {p.connected ? (
      <>
        <div className="text-2xl font-bold text-white mb-2">{p.monthly}<span className="text-sm font-normal text-[#A0A0A0]">/mo</span></div>
        <div className="flex items-center gap-1 text-[#00FF9C] text-sm font-medium">
          <TrendingUp size={13} />{p.growth}
        </div>
      </>
    ) : (
      <button className="w-full mt-2 py-2 rounded-lg text-xs font-semibold text-white transition-all"
        style={{ backgroundColor: `${p.color}33`, border: `1px solid ${p.color}55` }}>
        Connect {p.name}
      </button>
    )}
  </div>
);

const AlertCard = ({ alert }: { alert: typeof revenueAlerts[0] }) => (
  <div className={`bg-[#141414]/80 rounded-lg p-4 border-l-4 ${alert.priority === 'High' ? 'border-l-[#FF3B3B]' : 'border-l-[#FFB800]'}`}>
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-center gap-2">
        <div className={`p-1.5 rounded-lg ${alert.priority === 'High' ? 'bg-[#FF3B3B]/20 text-[#FF3B3B]' : 'bg-[#FFB800]/20 text-[#FFB800]'}`}>
          {alert.type === 'Opportunity' ? <Zap size={14} /> : alert.type === 'Marketing ROI' ? <BarChart3 size={14} /> : <TrendingUp size={14} />}
        </div>
        <div>
          <h4 className="font-semibold text-white text-sm">{alert.type}</h4>
          <p className="text-xs text-[#A0A0A0]">{alert.platform}</p>
        </div>
      </div>
      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${alert.priority === 'High' ? 'bg-[#FF3B3B]/20 text-[#FF3B3B]' : 'bg-[#FFB800]/20 text-[#FFB800]'}`}>
        {alert.priority}
      </span>
    </div>
    <div className="text-lg font-bold text-white mb-1">{alert.amount}</div>
    <p className="text-xs text-[#A0A0A0] mb-3">{alert.description}</p>
    <button className={`w-full py-2 rounded-lg text-xs font-medium text-white transition-colors ${alert.priority === 'High' ? 'bg-[#FF3B3B]/80 hover:bg-[#FF3B3B]' : 'bg-[#00C2FF]/80 hover:bg-[#00C2FF]'}`}>
      {alert.action}
    </button>
  </div>
);

export default function RevenuePage() {
  const [range, setRange] = useState('30d');

  const connectedTotal = 8420 + 3180 + 1640;
  const totalSpend = 1200 + 640 + 480 + 800;

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
              <span className="bg-gradient-to-r from-[#FFB800] to-[#FF3B3B] bg-clip-text text-transparent">Revenue Intelligence</span>
            </h1>
            <p className="text-[#A0A0A0] text-sm">Payment aggregators · Marketing spend · Revenue flow estimates</p>
          </div>
          <select value={range} onChange={e => setRange(e.target.value)}
            className="bg-[#141414] border border-[#2A2A2A] text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#FFB800] w-fit">
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>

        {/* Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Revenue (est.)', val: `$${connectedTotal.toLocaleString()}`, sub: 'Connected platforms', color: '#00FF9C', icon: DollarSign },
            { label: 'Marketing Spend',      val: `$${totalSpend.toLocaleString()}`,     sub: 'Across all channels',  color: '#FF3B3B', icon: CreditCard },
            { label: 'Blended ROAS',         val: '3.1×',                                sub: 'Avg return on ad $',   color: '#FFB800', icon: TrendingUp },
            { label: 'Platforms Connected',  val: '3 / 6',                               sub: '3 more available',     color: '#00C2FF', icon: Link2 },
          ].map(s => (
            <div key={s.label} className="bg-[#141414] rounded-xl p-4 card-glow border border-[#2A2A2A]">
              <div className="flex items-center justify-between mb-2">
                <s.icon className="w-5 h-5" style={{ color: s.color }} />
                <TrendingUp className="w-4 h-4" style={{ color: s.color }} />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-white mb-0.5">{s.val}</div>
              <div className="text-[#A0A0A0] text-xs">{s.label}</div>
              <div className="text-[10px] mt-1 font-medium" style={{ color: s.color }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Platform Cards */}
        <div>
          <h2 className="text-lg font-bold text-white mb-3">Connected Payment Platforms</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {paymentPlatforms.map(p => <PlatformCard key={p.id} p={p} />)}
          </div>
        </div>

        {/* Revenue Trend Chart + Pie */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-[#141414] border border-[#2A2A2A] rounded-xl p-4 sm:p-6">
            <h3 className="text-base font-bold text-white mb-4">Revenue Trend by Platform</h3>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="stripe" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#635BFF" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#635BFF" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="paypal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#003087" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#003087" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="apple" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#A2AAAD" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#A2AAAD" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#444" tick={{ fill: '#666', fontSize: 11 }} />
                <YAxis stroke="#444" tick={{ fill: '#666', fontSize: 11 }} tickFormatter={v => `$${v}`} />
                <Tooltip contentStyle={{ backgroundColor: '#141414', border: '1px solid #333', borderRadius: 8 }} labelStyle={{ color: '#fff' }} />
                <Area type="monotone" dataKey="stripe" name="Stripe" stroke="#635BFF" fill="url(#stripe)" strokeWidth={2} />
                <Area type="monotone" dataKey="paypal" name="PayPal" stroke="#5090C0" fill="url(#paypal)" strokeWidth={2} />
                <Area type="monotone" dataKey="apple"  name="Apple Pay" stroke="#A2AAAD" fill="url(#apple)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-[#141414] border border-[#2A2A2A] rounded-xl p-4 sm:p-5">
            <h3 className="text-base font-bold text-white mb-4">Revenue Split</h3>
            <ResponsiveContainer width="100%" height={150}>
              <PieChart>
                <Pie data={breakdownData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" strokeWidth={0}>
                  {breakdownData.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-2">
              {breakdownData.map(d => (
                <div key={d.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                    <span className="text-xs text-[#A0A0A0]">{d.name}</span>
                  </div>
                  <span className="text-xs font-bold text-white">{d.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Marketing Spend */}
        <div className="bg-[#141414] border border-[#2A2A2A] rounded-xl p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-[#FFB800]" />
            <h3 className="text-base font-bold text-white">Marketing Dollar Aggregation</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {marketingSpend.map(m => (
              <div key={m.channel} className="bg-[#0A0A0A] rounded-xl p-3 border border-[#1E1E1E]">
                <p className="text-xs text-[#888] mb-1">{m.channel}</p>
                <p className="text-lg font-bold text-white">{m.spend}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp size={11} style={{ color: m.color }} />
                  <span className="text-xs font-bold" style={{ color: m.color }}>{m.roas} ROAS</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-[#1E1E1E] flex items-center justify-between flex-wrap gap-3">
            <p className="text-xs text-[#555]">Total marketing spend: <span className="text-white font-bold">${totalSpend.toLocaleString()}/mo</span> · Est. revenue generated: <span className="text-[#00FF9C] font-bold">${(totalSpend * 3.1).toLocaleString()}</span></p>
            <button className="text-xs text-[#00C2FF] hover:underline flex items-center gap-1"><ExternalLink size={10} /> Export Report</button>
          </div>
        </div>

        {/* Alerts */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-[#FF3B3B]" />
            <h2 className="text-lg font-bold text-white">Revenue Alerts</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {revenueAlerts.map((a, i) => <AlertCard key={i} alert={a} />)}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
