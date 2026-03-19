'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/ui/DashboardLayout';
import { 
  Send, Clock, CheckCircle, XCircle, Calendar, Users, 
  BarChart3, Radio, Headphones, FileText, ExternalLink, Filter
} from 'lucide-react';
import { blogSubmissions, podcastSubmissions } from '@/data/mockData';

const SubmissionCard = ({ submission, type = 'blog' }: { submission: any; type?: string }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Not Submitted': return 'text-[#A0A0A0] bg-[#A0A0A0]/20 border-[#A0A0A0]/30';
      case 'Submitted': return 'text-[#FFB800] bg-[#FFB800]/20 border-[#FFB800]/30';
      case 'Under Review': return 'text-[#00C2FF] bg-[#00C2FF]/20 border-[#00C2FF]/30';
      case 'Accepted': return 'text-[#00FF9C] bg-[#00FF9C]/20 border-[#00FF9C]/30';
      case 'Declined': return 'text-[#FF3B3B] bg-[#FF3B3B]/20 border-[#FF3B3B]/30';
      case 'Scheduled': return 'text-[#7B2EFF] bg-[#7B2EFF]/20 border-[#7B2EFF]/30';
      default: return 'text-[#A0A0A0] bg-[#A0A0A0]/20 border-[#A0A0A0]/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Not Submitted': return <Send className="w-4 h-4" />;
      case 'Submitted': return <Clock className="w-4 h-4" />;
      case 'Under Review': return <Clock className="w-4 h-4" />;
      case 'Accepted': return <CheckCircle className="w-4 h-4" />;
      case 'Declined': return <XCircle className="w-4 h-4" />;
      case 'Scheduled': return <Calendar className="w-4 h-4" />;
      default: return <Send className="w-4 h-4" />;
    }
  };

  const getSubmissionIcon = () => {
    return type === 'blog' ? <FileText className="w-5 h-5" /> : <Headphones className="w-5 h-5" />;
  };

  const canSubmit = submission.status === 'Not Submitted';
  const canResubmit = submission.status === 'Declined';

  return (
    <div className="bg-[#111111] border border-[#1E1E1E] rounded-xl p-6 hover:bg-[#121212] transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-[#00C2FF]/20 rounded-lg text-[#00C2FF]">
            {getSubmissionIcon()}
          </div>
          <div>
            <h3 className="text-lg font-bold text-white mb-1">{submission.name}</h3>
            <div className="flex items-center gap-4 text-sm text-[#A0A0A0]">
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {submission.audienceSize}
              </span>
              <span>•</span>
              <span>{submission.genre}</span>
              {type === 'blog' && (
                <>
                  <span>•</span>
                  <span>{submission.submissionType}</span>
                </>
              )}
            </div>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(submission.status)} flex items-center gap-2`}>
          {getStatusIcon(submission.status)}
          {submission.status}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="text-sm text-[#A0A0A0]">{type === 'blog' ? 'Acceptance Rate' : 'Booking Rate'}</div>
          <div className="text-lg font-bold text-white">{type === 'blog' ? submission.acceptanceRate : submission.bookingRate}</div>
        </div>
        <div>
          <div className="text-sm text-[#A0A0A0]">Last Update</div>
          <div className="text-lg font-bold text-white">{submission.lastUpdate}</div>
        </div>
      </div>

      {/* Progress Bar for submissions in process */}
      {(submission.status === 'Under Review' || submission.status === 'Scheduled') && (
        <div className="mb-4">
          <div className="flex justify-between text-xs text-[#A0A0A0] mb-1">
            <span>Submission Progress</span>
            <span>{submission.status === 'Under Review' ? '60%' : '90%'}</span>
          </div>
          <div className="w-full bg-[#1E1E1E] rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${submission.status === 'Under Review' ? 'bg-[#00C2FF]' : 'bg-[#7B2EFF]'}`}
              style={{ width: submission.status === 'Under Review' ? '60%' : '90%' }}
            />
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="text-sm text-[#A0A0A0]">
          Audience: <span className="text-white font-medium">{submission.genre}</span>
        </div>
        <div className="flex gap-2">
          {(canSubmit || canResubmit) && (
            <button className="bg-[#00C2FF] hover:bg-[#00A3D9] text-black px-4 py-1.5 rounded-lg text-sm font-medium transition-all">
              {canResubmit ? 'Resubmit' : 'Submit'}
            </button>
          )}
          <button className="text-[#00C2FF] hover:text-white flex items-center gap-1 text-sm">
            Details <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

const SubmissionHistory = () => {
  const historyData = [
    { outlet: 'Complex', date: '2024-03-18', status: 'Published', response: 'Featured in weekly roundup' },
    { outlet: 'XXL Magazine', date: '2024-03-15', status: 'Under Review', response: 'Editor reviewing content' },
    { outlet: 'Pitchfork', date: '2024-03-12', status: 'Declined', response: 'Not aligned with current editorial focus' },
    { outlet: 'The FADER', date: '2024-03-10', status: 'Accepted', response: 'Scheduled for March 25th feature' },
    { outlet: 'HotNewHipHop', date: '2024-03-08', status: 'Published', response: 'Premiere went live with positive response' }
  ];

  return (
    <div className="bg-[#111111] border border-[#1E1E1E] rounded-xl p-6">
      <h3 className="text-lg font-bold text-white mb-4">Submission History</h3>
      <div className="space-y-3">
        {historyData.map((item, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-[#1E1E1E] rounded-lg">
            <div className="flex items-center gap-4">
              <div>
                <div className="font-medium text-white text-sm">{item.outlet}</div>
                <div className="text-xs text-[#A0A0A0]">{item.date}</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className={`text-xs font-medium ${
                  item.status === 'Published' ? 'text-[#00FF9C]' :
                  item.status === 'Accepted' ? 'text-[#7B2EFF]' :
                  item.status === 'Under Review' ? 'text-[#00C2FF]' :
                  'text-[#FF3B3B]'
                }`}>
                  {item.status}
                </div>
                <div className="text-xs text-[#A0A0A0] max-w-xs truncate">{item.response}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function SubmissionsPage() {
  const [activeTab, setActiveTab] = useState('blogs');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredBlogs = filterStatus === 'all' 
    ? blogSubmissions 
    : blogSubmissions.filter(blog => blog.status === filterStatus);

  const filteredPodcasts = filterStatus === 'all' 
    ? podcastSubmissions 
    : podcastSubmissions.filter(podcast => podcast.status === filterStatus);

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              <span className="bg-gradient-to-r from-[#00C2FF] to-[#7B2EFF] bg-clip-text text-transparent">
                1-Click Submissions
              </span>
            </h1>
            <p className="text-[#A0A0A0]">Submit to blogs, podcasts, and media platforms with one click</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-[#111111] border border-[#1E1E1E] rounded-lg px-3 py-2">
              <Filter className="w-4 h-4 text-[#A0A0A0]" />
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-transparent text-white text-sm border-none outline-none"
              >
                <option value="all">All Status</option>
                <option value="Not Submitted">Not Submitted</option>
                <option value="Under Review">Under Review</option>
                <option value="Accepted">Accepted</option>
                <option value="Declined">Declined</option>
                <option value="Scheduled">Scheduled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-[#111111] border border-[#1E1E1E] rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <Send className="w-5 h-5 text-[#FFB800]" />
              <Clock className="w-4 h-4 text-[#A0A0A0]" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">3</div>
            <div className="text-sm text-[#A0A0A0]">Pending Submissions</div>
            <div className="text-xs text-[#FFB800] mt-1">Awaiting response</div>
          </div>

          <div className="bg-[#111111] border border-[#1E1E1E] rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <CheckCircle className="w-5 h-5 text-[#00FF9C]" />
              <BarChart3 className="w-4 h-4 text-[#00FF9C]" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">2</div>
            <div className="text-sm text-[#A0A0A0]">Accepted</div>
            <div className="text-xs text-[#00FF9C] mt-1">Ready to publish</div>
          </div>

          <div className="bg-[#111111] border border-[#1E1E1E] rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <Calendar className="w-5 h-5 text-[#7B2EFF]" />
              <ExternalLink className="w-4 h-4 text-[#7B2EFF]" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">1</div>
            <div className="text-sm text-[#A0A0A0]">Published</div>
            <div className="text-xs text-[#7B2EFF] mt-1">Live content</div>
          </div>

          <div className="bg-[#111111] border border-[#1E1E1E] rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <Users className="w-5 h-5 text-[#00C2FF]" />
              <BarChart3 className="w-4 h-4 text-[#FFB800]" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">47.2M</div>
            <div className="text-sm text-[#A0A0A0]">Total Reach</div>
            <div className="text-xs text-[#FFB800] mt-1">Across all platforms</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-[#111111] p-1 rounded-xl border border-[#1E1E1E] w-fit">
          <button
            onClick={() => setActiveTab('blogs')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
              activeTab === 'blogs' 
                ? 'bg-[#00C2FF] text-black' 
                : 'text-[#A0A0A0] hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            Blogs & Publications
          </button>
          <button
            onClick={() => setActiveTab('podcasts')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
              activeTab === 'podcasts' 
                ? 'bg-[#00C2FF] text-black' 
                : 'text-[#A0A0A0] hover:text-white'
            }`}
          >
            <Headphones className="w-4 h-4" />
            Podcast Bookings
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
              activeTab === 'history' 
                ? 'bg-[#00C2FF] text-black' 
                : 'text-[#A0A0A0] hover:text-white'
            }`}
          >
            <Clock className="w-4 h-4" />
            History
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'blogs' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Blog & Publication Submissions</h2>
              <div className="text-sm text-[#A0A0A0]">
                {filteredBlogs.length} outlets available
              </div>
            </div>
            
            <div className="grid gap-4">
              {filteredBlogs.map((submission) => (
                <SubmissionCard key={submission.id} submission={submission} type="blog" />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'podcasts' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Podcast Interview Bookings</h2>
              <div className="text-sm text-[#A0A0A0]">
                {filteredPodcasts.length} shows available
              </div>
            </div>
            
            <div className="grid gap-4">
              {filteredPodcasts.map((submission) => (
                <SubmissionCard key={submission.id} submission={submission} type="podcast" />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white">Submission History</h2>
            <SubmissionHistory />
          </div>
        )}

        {/* Submission Templates */}
        {(activeTab === 'blogs' || activeTab === 'podcasts') && (
          <div className="bg-[#111111] border border-[#1E1E1E] rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Submission Templates</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#1E1E1E] border border-[#333333] rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <FileText className="w-5 h-5 text-[#00C2FF]" />
                  <h4 className="font-medium text-white">Blog Premiere</h4>
                </div>
                <p className="text-sm text-[#A0A0A0] mb-3">
                  Template for exclusive song/video premieres on music blogs
                </p>
                <button className="text-[#00C2FF] hover:text-white text-sm font-medium">
                  Use Template
                </button>
              </div>

              <div className="bg-[#1E1E1E] border border-[#333333] rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Headphones className="w-5 h-5 text-[#FFB800]" />
                  <h4 className="font-medium text-white">Podcast Interview</h4>
                </div>
                <p className="text-sm text-[#A0A0A0] mb-3">
                  Standard template for podcast interview requests
                </p>
                <button className="text-[#FFB800] hover:text-white text-sm font-medium">
                  Use Template
                </button>
              </div>

              <div className="bg-[#1E1E1E] border border-[#333333] rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Radio className="w-5 h-5 text-[#7B2EFF]" />
                  <h4 className="font-medium text-white">Radio Feature</h4>
                </div>
                <p className="text-sm text-[#A0A0A0] mb-3">
                  Template for radio station playlist submissions
                </p>
                <button className="text-[#7B2EFF] hover:text-white text-sm font-medium">
                  Use Template
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}