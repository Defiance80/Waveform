'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/ui/DashboardLayout';
import {
  Send, Clock, CheckCircle, XCircle, Calendar, Users,
  BarChart3, Headphones, FileText, ExternalLink, Filter,
  Link2, Lock, Plus, ChevronDown, Star, TrendingUp, Zap
} from 'lucide-react';
import { blogSubmissions, podcastSubmissions } from '@/data/mockData';

/* ─── Submission Card (unchanged) ─── */
const SubmissionCard = ({ submission, type = 'blog' }: { submission: any; type?: string }) => {
  const statusColor: Record<string, string> = {
    'Not Submitted': 'text-[#A0A0A0] bg-[#A0A0A0]/20 border-[#A0A0A0]/30',
    'Submitted':     'text-[#FFB800] bg-[#FFB800]/20 border-[#FFB800]/30',
    'Under Review':  'text-[#00C2FF] bg-[#00C2FF]/20 border-[#00C2FF]/30',
    'Accepted':      'text-[#00FF9C] bg-[#00FF9C]/20 border-[#00FF9C]/30',
    'Declined':      'text-[#FF3B3B] bg-[#FF3B3B]/20 border-[#FF3B3B]/30',
    'Scheduled':     'text-[#7B2EFF] bg-[#7B2EFF]/20 border-[#7B2EFF]/30',
  };
  const statusIcon: Record<string, React.ReactNode> = {
    'Not Submitted': <Send className="w-4 h-4" />,
    'Submitted':     <Clock className="w-4 h-4" />,
    'Under Review':  <Clock className="w-4 h-4" />,
    'Accepted':      <CheckCircle className="w-4 h-4" />,
    'Declined':      <XCircle className="w-4 h-4" />,
    'Scheduled':     <Calendar className="w-4 h-4" />,
  };
  const canSubmit    = submission.status === 'Not Submitted';
  const canResubmit  = submission.status === 'Declined';

  return (
    <div className="bg-[#141414] border border-[#2A2A2A] rounded-xl p-5 hover:bg-[#121212] transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-[#00C2FF]/20 rounded-lg text-[#00C2FF]">
            {type === 'blog' ? <FileText className="w-5 h-5" /> : <Headphones className="w-5 h-5" />}
          </div>
          <div>
            <h3 className="text-base font-bold text-white mb-1">{submission.name}</h3>
            <div className="flex items-center gap-3 text-sm text-[#A0A0A0]">
              <span className="flex items-center gap-1"><Users className="w-4 h-4" />{submission.audienceSize}</span>
              <span>·</span><span>{submission.genre}</span>
            </div>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1.5 ${statusColor[submission.status] ?? ''}`}>
          {statusIcon[submission.status]}{submission.status}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="text-xs text-[#A0A0A0]">{type === 'blog' ? 'Acceptance Rate' : 'Booking Rate'}</div>
          <div className="text-lg font-bold text-white">{type === 'blog' ? submission.acceptanceRate : submission.bookingRate}</div>
        </div>
        <div>
          <div className="text-xs text-[#A0A0A0]">Last Update</div>
          <div className="text-lg font-bold text-white">{submission.lastUpdate}</div>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-[#A0A0A0]">Audience: <span className="text-white font-medium">{submission.genre}</span></span>
        <div className="flex gap-2">
          {(canSubmit || canResubmit) && (
            <button className="bg-[#00C2FF] hover:bg-[#00A3D9] text-black px-4 py-1.5 rounded-lg text-sm font-medium transition-all">
              {canResubmit ? 'Resubmit' : 'Submit'}
            </button>
          )}
          <button className="text-[#00C2FF] hover:text-white flex items-center gap-1 text-sm">Details <ExternalLink className="w-3 h-3" /></button>
        </div>
      </div>
    </div>
  );
};

/* ─── Site Feed (Backlinks) ─── */
const PLAN = { tier: 'Starter', included: 2, used: 1, max: 10 };

const backlinkSites = [
  { id: 1, domain: 'Forbes.com',           da: 94, traffic: '120M/mo', niche: 'Business / Entrepreneurship', price: '$420/link', status: 'Available', doFollow: true },
  { id: 2, domain: 'Entrepreneur.com',     da: 91, traffic: '80M/mo',  niche: 'Business / Startup',          price: '$280/link', status: 'Available', doFollow: true },
  { id: 3, domain: 'HuffPost.com',         da: 92, traffic: '95M/mo',  niche: 'Lifestyle / Culture',         price: '$310/link', status: 'Waitlist',  doFollow: true },
  { id: 4, domain: 'Inc.com',              da: 88, traffic: '42M/mo',  niche: 'Business / Growth',           price: '$240/link', status: 'Available', doFollow: true },
  { id: 5, domain: 'Mashable.com',         da: 87, traffic: '35M/mo',  niche: 'Tech / Culture',              price: '$190/link', status: 'Available', doFollow: true },
  { id: 6, domain: 'BusinessInsider.com',  da: 90, traffic: '68M/mo',  niche: 'Business / Finance',         price: '$260/link', status: 'Available', doFollow: true },
  { id: 7, domain: 'Medium.com',           da: 95, traffic: '100M/mo', niche: 'All Niches',                  price: '$120/link', status: 'Available', doFollow: false },
  { id: 8, domain: 'TheVerge.com',         da: 91, traffic: '38M/mo',  niche: 'Tech / Consumer',             price: '$350/link', status: 'Available', doFollow: true },
];

const submittedLinks = [
  { id: 'sl1', url: 'https://yourbrand.com/launch',   keyword: 'best urban streetwear brand', targetDomain: 'Forbes.com',       da: 94, status: 'Pending',  date: 'Apr 10' },
  { id: 'sl2', url: 'https://yourbrand.com/about',    keyword: 'independent fashion label LA', targetDomain: 'Entrepreneur.com', da: 91, status: 'Live',     date: 'Apr 2' },
];

const SiteFeedTab = () => {
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [submitUrl, setSubmitUrl] = useState('');
  const [submitKeyword, setSubmitKeyword] = useState('');
  const [submitDomain, setSubmitDomain] = useState('');
  const [sortDA, setSortDA] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  const remaining = PLAN.included - PLAN.used;
  const sortedSites = [...backlinkSites].sort((a, b) => sortDA ? b.da - a.da : a.da - b.da);

  const handleSubmit = () => {
    if (!submitUrl || !submitKeyword || !submitDomain) return;
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); setShowSubmitForm(false); setSubmitUrl(''); setSubmitKeyword(''); setSubmitDomain(''); }, 2000);
  };

  return (
    <div className="space-y-5">
      {/* Plan banner */}
      <div className="bg-[#141414] border border-[#C9A86A33] rounded-2xl p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link2 size={15} className="text-[#C9A86A]" />
              <span className="text-sm font-bold text-white">Site Feed — Backlink Service</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#C9A86A18] text-[#C9A86A]">Paid Add-On</span>
            </div>
            <p className="text-xs text-[#555]">Submit URLs with targeted keywords to high-DA sites. Notifies the backlink provider automatically.</p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="text-center">
              <p className="text-xl font-extrabold text-white">{PLAN.used}<span className="text-[#555]">/{PLAN.included}</span></p>
              <p className="text-[10px] text-[#555]">{PLAN.tier} plan</p>
            </div>
            <button onClick={() => setShowSubmitForm(!showSubmitForm)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-black bg-[#C9A86A] hover:bg-[#B8975A] transition-all disabled:opacity-40"
              disabled={remaining <= 0}>
              <Plus size={12} /> Submit URL
            </button>
          </div>
        </div>

        {/* Plan tiers */}
        <div className="mt-3 pt-3 border-t border-[#1E1E1E] grid grid-cols-3 gap-2">
          {[
            { tier: 'Starter', links: 2, price: '$29/mo', active: PLAN.tier === 'Starter' },
            { tier: 'Growth',  links: 5, price: '$79/mo', active: PLAN.tier === 'Growth' },
            { tier: 'Pro',     links: 10, price: '$149/mo', active: PLAN.tier === 'Pro' },
          ].map(t => (
            <div key={t.tier} className={`p-2 rounded-lg border text-center ${t.active ? 'border-[#C9A86A44] bg-[#C9A86A10]' : 'border-[#1E1E1E] bg-[#0A0A0A]'}`}>
              <p className="text-xs font-bold" style={{ color: t.active ? '#C9A86A' : '#555' }}>{t.tier}</p>
              <p className="text-[10px] text-[#888]">{t.links} links incl.</p>
              <p className="text-[10px] text-[#555]">{t.price}</p>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-[#444] mt-2">Need more? <span className="text-[#C9A86A]">A la carte: $49/additional link</span> — upgrade or add single links anytime.</p>
      </div>

      {/* Submit form */}
      {showSubmitForm && (
        <div className="bg-[#141414] border border-[#2A2A2A] rounded-2xl p-4">
          <h4 className="text-sm font-bold text-white mb-3">Submit Backlink Request</h4>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-[#888] mb-1 block">Your URL *</label>
              <input type="url" value={submitUrl} onChange={e => setSubmitUrl(e.target.value)}
                placeholder="https://yourdomain.com/page"
                className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl px-3 py-2 text-sm text-white placeholder-[#444] focus:outline-none focus:border-[#C9A86A] transition-colors" />
            </div>
            <div>
              <label className="text-xs text-[#888] mb-1 block">Target Keyword *</label>
              <input type="text" value={submitKeyword} onChange={e => setSubmitKeyword(e.target.value)}
                placeholder="e.g. best urban streetwear brand Los Angeles"
                className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl px-3 py-2 text-sm text-white placeholder-[#444] focus:outline-none focus:border-[#C9A86A] transition-colors" />
            </div>
            <div>
              <label className="text-xs text-[#888] mb-1 block">Target Domain *</label>
              <select value={submitDomain} onChange={e => setSubmitDomain(e.target.value)}
                className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#C9A86A] transition-colors appearance-none">
                <option value="">Select a domain...</option>
                {backlinkSites.filter(s => s.status === 'Available').map(s => (
                  <option key={s.id} value={s.domain}>{s.domain} (DA {s.da}) — {s.price}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <button onClick={handleSubmit} disabled={!submitUrl || !submitKeyword || !submitDomain || submitted}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-black bg-[#C9A86A] hover:bg-[#B8975A] transition-all disabled:opacity-50">
                {submitted ? <><CheckCircle size={11} /> Sent!</> : <><Send size={11} /> Submit Request</>}
              </button>
              <button onClick={() => setShowSubmitForm(false)} className="px-4 py-2 rounded-xl text-xs text-[#888] hover:text-white bg-[#1A1A1A] border border-[#2A2A2A]">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Active submissions */}
      {submittedLinks.length > 0 && (
        <div className="bg-[#141414] border border-[#2A2A2A] rounded-2xl p-4">
          <h4 className="text-sm font-bold text-white mb-3">My Submitted Links</h4>
          <div className="space-y-2">
            {submittedLinks.map(l => (
              <div key={l.id} className="flex items-center gap-3 p-3 bg-[#0A0A0A] rounded-xl border border-[#1A1A1A]">
                <div className="w-10 h-10 rounded-lg bg-[#1A1A1A] flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-[#C9A86A]">DA{l.da}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white truncate">{l.targetDomain}</p>
                  <p className="text-[10px] text-[#555] truncate">{l.url}</p>
                  <p className="text-[10px] text-[#888] mt-0.5">Keyword: <span className="text-[#C9A86A]">{l.keyword}</span></p>
                </div>
                <div className="flex flex-col items-end flex-shrink-0 gap-1">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${l.status === 'Live' ? 'bg-[#00FF9C18] text-[#00FF9C]' : 'bg-[#FFB80018] text-[#FFB800]'}`}>{l.status}</span>
                  <span className="text-[10px] text-[#444]">{l.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Directory */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-bold text-white">Site Directory — Ranked by DA</h4>
          <button onClick={() => setSortDA(!sortDA)}
            className="flex items-center gap-1 text-[10px] text-[#555] hover:text-[#888] transition-colors border border-[#2A2A2A] px-2 py-1 rounded-lg">
            DA {sortDA ? '↓' : '↑'} Sort
          </button>
        </div>
        <div className="space-y-2">
          {sortedSites.map(site => (
            <div key={site.id} className="flex items-center gap-3 p-3 bg-[#141414] rounded-xl border border-[#2A2A2A] hover:border-[#333] transition-colors">
              <div className="w-12 h-10 rounded-lg bg-[#0A0A0A] border border-[#1E1E1E] flex flex-col items-center justify-center flex-shrink-0">
                <span className="text-[9px] text-[#888]">DA</span>
                <span className={`text-sm font-extrabold ${site.da >= 90 ? 'text-[#00FF9C]' : site.da >= 80 ? 'text-[#FFB800]' : 'text-[#00C2FF]'}`}>{site.da}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-bold text-white">{site.domain}</p>
                  {site.doFollow && <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#00FF9C18] text-[#00FF9C] font-bold">DoFollow</span>}
                </div>
                <p className="text-[10px] text-[#555] mt-0.5">{site.niche} · {site.traffic}</p>
              </div>
              <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                <span className="text-xs font-bold text-[#C9A86A]">{site.price}</span>
                <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full ${site.status === 'Available' ? 'bg-[#00FF9C18] text-[#00FF9C]' : 'bg-[#FFB80018] text-[#FFB800]'}`}>
                  {site.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ─── Submission History ─── */
const SubmissionHistory = () => {
  const historyData = [
    { outlet: 'TechCrunch',      date: '2026-04-10', status: 'Published',    response: 'Featured in weekly roundup' },
    { outlet: 'Fast Company',    date: '2026-04-07', status: 'Under Review', response: 'Editor reviewing content' },
    { outlet: 'Inc. Magazine',   date: '2026-04-03', status: 'Declined',     response: 'Not aligned with current editorial focus' },
    { outlet: 'Entrepreneur',    date: '2026-03-28', status: 'Accepted',     response: 'Scheduled for April 25th feature' },
    { outlet: 'Business Insider', date: '2026-03-21', status: 'Published',   response: 'Premiere went live with positive response' },
  ];
  const col: Record<string, string> = { Published: 'text-[#00FF9C]', Accepted: 'text-[#7B2EFF]', 'Under Review': 'text-[#00C2FF]', Declined: 'text-[#FF3B3B]' };
  return (
    <div className="bg-[#141414] border border-[#2A2A2A] rounded-xl p-5">
      <h3 className="text-lg font-bold text-white mb-4">Submission History</h3>
      <div className="space-y-3">
        {historyData.map((item, i) => (
          <div key={i} className="flex items-center justify-between p-3 bg-[#1E1E1E] rounded-lg">
            <div>
              <div className="font-medium text-white text-sm">{item.outlet}</div>
              <div className="text-xs text-[#A0A0A0]">{item.date}</div>
            </div>
            <div className="text-right">
              <div className={`text-xs font-medium ${col[item.status] ?? 'text-[#888]'}`}>{item.status}</div>
              <div className="text-xs text-[#A0A0A0] max-w-xs truncate">{item.response}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─── Page ─── */
export default function SubmissionsPage() {
  const [activeTab, setActiveTab] = useState('blogs');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredBlogs    = filterStatus === 'all' ? blogSubmissions    : blogSubmissions.filter(b => b.status === filterStatus);
  const filteredPodcasts = filterStatus === 'all' ? podcastSubmissions : podcastSubmissions.filter(p => p.status === filterStatus);

  const tabs = [
    { id: 'blogs',    label: 'Blogs & Publications', icon: FileText },
    { id: 'podcasts', label: 'Podcasts',              icon: Headphones },
    { id: 'sitefeed', label: 'Site Feed',             icon: Link2, badge: 'NEW' },
    { id: 'history',  label: 'History',               icon: Clock },
  ];

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
              <span className="bg-gradient-to-r from-[#00C2FF] to-[#7B2EFF] bg-clip-text text-transparent">1-Click Submissions</span>
            </h1>
            <p className="text-[#A0A0A0] text-sm">Submit to blogs, podcasts, and backlink partners</p>
          </div>
          {activeTab !== 'sitefeed' && (
            <div className="flex items-center gap-2 bg-[#141414] border border-[#2A2A2A] rounded-lg px-3 py-2 w-fit">
              <Filter className="w-4 h-4 text-[#A0A0A0]" />
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
                className="bg-transparent text-white text-sm border-none outline-none">
                <option value="all">All Status</option>
                <option value="Not Submitted">Not Submitted</option>
                <option value="Under Review">Under Review</option>
                <option value="Accepted">Accepted</option>
                <option value="Declined">Declined</option>
                <option value="Scheduled">Scheduled</option>
              </select>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { icon: Send,        val: '3',    label: 'Pending',    sub: 'Awaiting response', color: '#FFB800' },
            { icon: CheckCircle, val: '2',    label: 'Accepted',   sub: 'Ready to publish',  color: '#00FF9C' },
            { icon: Calendar,    val: '1',    label: 'Published',  sub: 'Live content',       color: '#7B2EFF' },
            { icon: Users,       val: '47.2M', label: 'Total Reach', sub: 'Across platforms',  color: '#00C2FF' },
          ].map(s => (
            <div key={s.label} className="bg-[#141414] border border-[#2A2A2A] rounded-xl p-4">
              <div className="flex items-center justify-between mb-2"><s.icon className="w-5 h-5" style={{ color: s.color }} /><TrendingUp className="w-4 h-4" style={{ color: s.color }} /></div>
              <div className="text-xl font-bold text-white">{s.val}</div>
              <div className="text-xs text-[#A0A0A0]">{s.label}</div>
              <div className="text-[10px] mt-1" style={{ color: s.color }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-1 bg-[#141414] p-1 rounded-xl border border-[#2A2A2A] w-fit">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 ${
                activeTab === t.id ? (t.id === 'sitefeed' ? 'bg-[#C9A86A] text-black' : 'bg-[#00C2FF] text-black') : 'text-[#A0A0A0] hover:text-white'
              }`}>
              <t.icon className="w-4 h-4" />
              {t.label}
              {t.badge && <span className="text-[9px] font-extrabold bg-[#FF3B3B] text-white px-1 py-0.5 rounded ml-0.5">{t.badge}</span>}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === 'blogs' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">Blog & Publication Submissions</h2>
              <div className="text-sm text-[#A0A0A0]">{filteredBlogs.length} outlets</div>
            </div>
            <div className="grid gap-4">{filteredBlogs.map(s => <SubmissionCard key={s.id} submission={s} type="blog" />)}</div>
          </div>
        )}
        {activeTab === 'podcasts' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">Podcast Interview Bookings</h2>
              <div className="text-sm text-[#A0A0A0]">{filteredPodcasts.length} shows</div>
            </div>
            <div className="grid gap-4">{filteredPodcasts.map(s => <SubmissionCard key={s.id} submission={s} type="podcast" />)}</div>
          </div>
        )}
        {activeTab === 'sitefeed' && <SiteFeedTab />}
        {activeTab === 'history' && <SubmissionHistory />}
      </div>
    </DashboardLayout>
  );
}
