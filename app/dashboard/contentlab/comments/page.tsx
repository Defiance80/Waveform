'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/ui/DashboardLayout';
import Link from 'next/link';
import {
  MessageSquare, ChevronLeft, CheckCircle, SkipForward, Edit3,
  Send, Loader2, ToggleLeft, ToggleRight, BarChart2, TrendingUp
} from 'lucide-react';

type Sentiment = 'positive' | 'neutral' | 'negative';
type ReplyStatus = 'pending' | 'sent' | 'skipped';

interface Comment {
  id: string;
  platform: string;
  platformColor: string;
  username: string;
  text: string;
  sentiment: Sentiment;
  intent: string;
  eligible: boolean;
  postTitle: string;
  time: string;
  aiReply: string;
  replyStatus: ReplyStatus;
}

const mockComments: Comment[] = [
  {
    id: '1', platform: 'Instagram', platformColor: '#E1306C',
    username: '@jayrock_la',
    text: 'Bro this track is INSANE. What studio did you record this at? Trying to get that same vibe for my project 🔥',
    sentiment: 'positive', intent: 'question', eligible: true,
    postTitle: 'West Coast Sound — New Drop',
    time: '2h ago',
    aiReply: 'Appreciate it Jay! We were at Paramount in Hollywood — hit me in the DMs and I can connect you with the engineer.',
    replyStatus: 'pending',
  },
  {
    id: '2', platform: 'YouTube', platformColor: '#FF0000',
    username: '@musicfan2040',
    text: 'This gives me early Kendrick vibes but with something totally new. How long have you been working on this sound?',
    sentiment: 'positive', intent: 'question', eligible: true,
    postTitle: 'Behind The Beat - Vlog',
    time: '4h ago',
    aiReply: 'Man that comparison means everything — been developing this for about 3 years, really letting it breathe before I dropped it.',
    replyStatus: 'pending',
  },
  {
    id: '3', platform: 'X (Twitter)', platformColor: '#1DA1F2',
    username: '@streetcritic99',
    text: 'mid. LA fell off',
    sentiment: 'negative', intent: 'cynical', eligible: false,
    postTitle: 'West Coast Sound Announcement',
    time: '5h ago',
    aiReply: '',
    replyStatus: 'skipped',
  },
  {
    id: '4', platform: 'Instagram', platformColor: '#E1306C',
    username: '@divina_music',
    text: 'This song literally got me through a tough week. Thank you for putting real feelings into your music ❤️',
    sentiment: 'positive', intent: 'admiration', eligible: true,
    postTitle: 'West Coast Sound — New Drop',
    time: '6h ago',
    aiReply: "That's real — that's exactly why I make music. Grateful you felt it. Keep your head up.",
    replyStatus: 'pending',
  },
  {
    id: '5', platform: 'YouTube', platformColor: '#FF0000',
    username: '@beatmaker_tx',
    text: 'Would you ever collab with producers outside of LA? I\'ve been making beats in Dallas that fit your vibe perfectly',
    sentiment: 'positive', intent: 'question', eligible: true,
    postTitle: 'Behind The Beat - Vlog',
    time: '8h ago',
    aiReply: "Dallas got talent, no doubt. Send some work through my site — I'm always listening to what's out there.",
    replyStatus: 'pending',
  },
  {
    id: '6', platform: 'Instagram', platformColor: '#E1306C',
    username: '@spambot_12345',
    text: '🔥🔥🔥💯💯💯❤️❤️❤️',
    sentiment: 'neutral', intent: 'spam', eligible: false,
    postTitle: 'West Coast Sound — New Drop',
    time: '9h ago',
    aiReply: '',
    replyStatus: 'skipped',
  },
];

const sentimentConfig = {
  positive: { color: '#00FF9C', label: 'Positive', dot: '🟢' },
  neutral: { color: '#FFB800', label: 'Neutral', dot: '🟡' },
  negative: { color: '#FF3B3B', label: 'Negative', dot: '🔴' },
};

const platformFilters = ['All', 'Instagram', 'YouTube', 'X (Twitter)'];

export default function CommentsPage() {
  const [comments, setComments] = useState<Comment[]>(mockComments);
  const [platformFilter, setPlatformFilter] = useState('All');
  const [autoReply, setAutoReply] = useState(false);
  const [sendingId, setSendingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const filtered = comments.filter(c =>
    platformFilter === 'All' ? true : c.platform === platformFilter
  );

  const handleApprove = (id: string) => {
    setSendingId(id);
    setTimeout(() => {
      setSendingId(null);
      setComments(prev => prev.map(c => c.id === id ? { ...c, replyStatus: 'sent' } : c));
    }, 1400);
  };

  const handleSkip = (id: string) => {
    setComments(prev => prev.map(c => c.id === id ? { ...c, replyStatus: 'skipped' } : c));
  };

  const handleEditReply = (id: string, text: string) => {
    setComments(prev => prev.map(c => c.id === id ? { ...c, aiReply: text } : c));
  };

  const pendingCount = filtered.filter(c => c.eligible && c.replyStatus === 'pending').length;
  const sentCount = comments.filter(c => c.replyStatus === 'sent').length;
  const skippedCount = comments.filter(c => c.replyStatus === 'skipped').length;

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 space-y-5 max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-3">
          <Link href="/dashboard/contentlab" className="p-2 rounded-lg text-[#888] hover:text-white hover:bg-[#141414] transition-all">
            <ChevronLeft size={18} />
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <MessageSquare size={16} className="text-[#00FF9C]" />
              <h1 className="text-lg sm:text-xl font-extrabold text-white">Comment Responder</h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#00FF9C18] text-[#00FF9C]">Smart Filter</span>
            </div>
            <p className="text-xs text-[#666] mt-0.5">AI replies to genuine fans — skips trolls and spam automatically</p>
          </div>
          {/* Auto-Reply Toggle */}
          <button onClick={() => setAutoReply(!autoReply)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-bold transition-all ${
              autoReply ? 'bg-[#00FF9C12] border-[#00FF9C44] text-[#00FF9C]' : 'border-[#2A2A2A] text-[#666] hover:text-white'
            }`}>
            {autoReply ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
            Auto-Reply
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Pending', val: pendingCount, color: '#FFB800' },
            { label: 'Replies Sent', val: sentCount, color: '#00FF9C' },
            { label: 'Auto-Skipped', val: skippedCount, color: '#FF3B3B' },
            { label: 'Engagement Lift', val: '+18%', color: '#00C2FF' },
          ].map(s => (
            <div key={s.label} className="bg-[#141414] border border-[#2A2A2A] rounded-xl p-3 text-center">
              <p className="text-lg font-extrabold" style={{ color: s.color }}>{s.val}</p>
              <p className="text-[10px] text-[#555] mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Auto-reply banner */}
        {autoReply && (
          <div className="bg-[#00FF9C10] border border-[#00FF9C33] rounded-xl px-4 py-3 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[#00FF9C] animate-pulse flex-shrink-0" />
            <p className="text-xs text-[#00FF9C]">
              <strong>Auto-Reply Mode Active</strong> — AI is approving and sending replies to eligible comments. All activity is logged below.
            </p>
          </div>
        )}

        {/* Platform Filter */}
        <div className="flex gap-2 flex-wrap">
          {platformFilters.map(f => (
            <button key={f} onClick={() => setPlatformFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                platformFilter === f ? 'bg-[#00FF9C18] text-[#00FF9C] border border-[#00FF9C33]' : 'bg-[#141414] text-[#666] border border-[#2A2A2A] hover:text-white'
              }`}>
              {f}
            </button>
          ))}
        </div>

        {/* Comment Inbox */}
        <div className="space-y-3">
          {filtered.map(comment => {
            const sent = sentimentConfig[comment.sentiment];
            const isSending = sendingId === comment.id;
            const isEditing = editingId === comment.id;

            return (
              <div key={comment.id}
                className={`bg-[#141414] border rounded-2xl p-4 transition-all ${
                  comment.replyStatus === 'sent'
                    ? 'border-[#00FF9C22] opacity-70'
                    : comment.replyStatus === 'skipped'
                    ? 'border-[#1E1E1E] opacity-50'
                    : 'border-[#2A2A2A]'
                }`}>

                {/* Comment Header */}
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-white"
                    style={{ backgroundColor: `${comment.platformColor}33`, border: `1px solid ${comment.platformColor}44` }}>
                    {comment.username.charAt(1).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-white">{comment.username}</span>
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded"
                        style={{ backgroundColor: `${comment.platformColor}22`, color: comment.platformColor }}>
                        {comment.platform}
                      </span>
                      <span className="text-[10px] text-[#444]">{comment.time}</span>
                    </div>
                    <p className="text-[10px] text-[#555] mt-0.5 truncate">{comment.postTitle}</p>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span className="text-xs">{sent.dot}</span>
                    <span className="text-[10px] font-semibold" style={{ color: sent.color }}>{sent.label}</span>
                    {!comment.eligible && (
                      <span className="text-[10px] bg-[#FF3B3B18] text-[#FF3B3B] font-bold px-1.5 py-0.5 rounded ml-1">
                        Skipped
                      </span>
                    )}
                  </div>
                </div>

                {/* Comment text */}
                <p className="text-sm text-[#CCC] bg-[#0F0F0F] rounded-xl px-3 py-2.5 border border-[#1E1E1E] mb-3">
                  {comment.text}
                </p>

                {/* Eligible: show AI reply */}
                {comment.eligible && comment.replyStatus !== 'skipped' && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-[10px] text-[#00FF9C] font-semibold uppercase tracking-wider">AI Draft Reply</span>
                    </div>

                    {isEditing ? (
                      <textarea
                        value={comment.aiReply}
                        onChange={e => handleEditReply(comment.id, e.target.value)}
                        rows={3}
                        className="w-full bg-[#0F0F0F] border border-[#00FF9C44] rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#00FF9C] transition-colors resize-none"
                      />
                    ) : (
                      <p className="text-sm text-white bg-[#00FF9C08] border border-[#00FF9C1A] rounded-xl px-3 py-2.5">
                        {comment.aiReply}
                      </p>
                    )}

                    {comment.replyStatus === 'sent' ? (
                      <div className="flex items-center gap-2 text-xs text-[#00FF9C]">
                        <CheckCircle size={13} /> Reply sent
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        <button onClick={() => handleApprove(comment.id)} disabled={isSending}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-black bg-[#00FF9C] hover:bg-[#00DD88] transition-all disabled:opacity-60">
                          {isSending ? <Loader2 size={11} className="animate-spin" /> : <Send size={11} />}
                          {isSending ? 'Sending...' : 'Approve & Send'}
                        </button>
                        <button onClick={() => setEditingId(isEditing ? null : comment.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-[#888] bg-[#1A1A1A] border border-[#2A2A2A] hover:text-white hover:border-[#444] transition-all">
                          <Edit3 size={11} />
                          {isEditing ? 'Done' : 'Edit'}
                        </button>
                        <button onClick={() => handleSkip(comment.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-[#888] bg-[#1A1A1A] border border-[#2A2A2A] hover:text-[#FF3B3B] hover:border-[#FF3B3B44] transition-all">
                          <SkipForward size={11} /> Skip
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Not eligible */}
                {(!comment.eligible || comment.replyStatus === 'skipped') && comment.replyStatus !== 'sent' && (
                  <div className="flex items-center gap-2 text-[10px] text-[#444]">
                    <SkipForward size={11} />
                    {comment.intent === 'spam' ? 'Spam detected — auto-skipped'
                      : comment.intent === 'cynical' ? 'Cynical/negative — auto-skipped'
                      : 'Not eligible for auto-reply'}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Analytics */}
        <div className="bg-[#141414] border border-[#2A2A2A] rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <BarChart2 size={16} className="text-[#00C2FF]" />
            <h3 className="text-sm font-bold text-white">Reply Analytics</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: 'Replies This Week', val: '34', change: '+12', color: '#00C2FF' },
              { label: 'Avg Engagement Lift', val: '+18%', change: 'per post', color: '#00FF9C' },
              { label: 'Top Platform', val: 'Instagram', change: '21 replies', color: '#E1306C' },
            ].map(s => (
              <div key={s.label} className="bg-[#0F0F0F] rounded-xl p-3 border border-[#1E1E1E]">
                <p className="text-lg font-extrabold" style={{ color: s.color }}>{s.val}</p>
                <p className="text-[10px] text-[#555]">{s.label}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp size={10} className="text-[#00FF9C]" />
                  <span className="text-[10px] text-[#00FF9C]">{s.change}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
