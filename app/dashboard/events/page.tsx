'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/ui/DashboardLayout';
import { 
  Calendar, MapPin, Users, TrendingUp, DollarSign, Plus, 
  BarChart3, Clock, AlertCircle, Star, ExternalLink
} from 'lucide-react';
import { upcomingEvents, pastEvents } from '@/data/mockData';

const EventCard = ({ event, isPast = false }: { event: any; isPast?: boolean }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'On Sale': return 'text-[#00FF9C] bg-[#00FF9C]/20';
      case 'Confirmed': return 'text-[#00C2FF] bg-[#00C2FF]/20';
      case 'Pre-Sale': return 'text-[#FFB800] bg-[#FFB800]/20';
      default: return 'text-[#A0A0A0] bg-[#A0A0A0]/20';
    }
  };

  if (isPast) {
    return (
      <div className="bg-[#111111] border border-[#1E1E1E] rounded-xl p-6 hover:bg-[#121212] transition-all">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-white mb-1">{event.name}</h3>
            <div className="flex items-center gap-4 text-sm text-[#A0A0A0]">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {event.venue}, {event.city}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {event.date}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-[#FFB800]">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-sm font-medium">{event.rating}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="text-center">
            <div className="text-xl font-bold text-white">{event.attendance}</div>
            <div className="text-xs text-[#A0A0A0]">Attendance</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-[#00FF9C]">{event.revenue}</div>
            <div className="text-xs text-[#A0A0A0]">Revenue</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-[#00C2FF]">{event.socialMentions}</div>
            <div className="text-xs text-[#A0A0A0]">Social Mentions</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-[#FFB800]">{event.roi}</div>
            <div className="text-xs text-[#A0A0A0]">ROI</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#111111] border border-[#1E1E1E] rounded-xl p-6 hover:bg-[#121212] transition-all">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-white mb-1">{event.name}</h3>
          <div className="flex items-center gap-4 text-sm text-[#A0A0A0]">
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {event.venue}, {event.city}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {event.date} • {event.time}
            </span>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(event.ticketStatus)}`}>
          {event.ticketStatus}
        </span>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{event.ticketsSold}</div>
            <div className="text-xs text-[#A0A0A0]">Sold</div>
          </div>
          <div className="text-center">
            <div className="text-lg text-[#A0A0A0]">/ {event.expectedAttendance}</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-[#00FF9C]">{event.ticketPrice}</div>
            <div className="text-xs text-[#A0A0A0]">Price</div>
          </div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-[#FFB800]">{event.presaleBuzz}</div>
          <div className="text-xs text-[#A0A0A0]">Buzz Score</div>
        </div>
      </div>

      <div className="w-full bg-[#1E1E1E] rounded-full h-2 mb-3">
        <div 
          className="bg-gradient-to-r from-[#FFB800] to-[#FF6B00] h-2 rounded-full transition-all"
          style={{ width: `${(event.ticketsSold / event.expectedAttendance) * 100}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-sm text-[#A0A0A0]">
        <span>{Math.round((event.ticketsSold / event.expectedAttendance) * 100)}% sold</span>
        <button className="text-[#FFB800] hover:text-white flex items-center gap-1">
          View Details <ExternalLink className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};

export default function EventsPage() {
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [activeTab, setActiveTab] = useState('upcoming');

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              <span className="bg-gradient-to-r from-[#FFB800] to-[#FF6B00] bg-clip-text text-transparent">
                Event Tracker
              </span>
            </h1>
            <p className="text-[#A0A0A0]">Manage shows, performances, and appearances</p>
          </div>
          <button 
            onClick={() => setShowAddEvent(true)}
            className="flex items-center gap-2 bg-[#FFB800] hover:bg-[#FF6B00] text-black px-4 py-2 rounded-xl font-medium transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Event
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-[#111111] border border-[#1E1E1E] rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <Calendar className="w-5 h-5 text-[#FFB800]" />
              <TrendingUp className="w-4 h-4 text-[#00FF9C]" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">3</div>
            <div className="text-sm text-[#A0A0A0]">Upcoming Events</div>
            <div className="text-xs text-[#00FF9C] mt-1">Next in 6 days</div>
          </div>

          <div className="bg-[#111111] border border-[#1E1E1E] rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <Users className="w-5 h-5 text-[#00C2FF]" />
              <BarChart3 className="w-4 h-4 text-[#FFB800]" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">2,450</div>
            <div className="text-sm text-[#A0A0A0]">Total Capacity</div>
            <div className="text-xs text-[#FFB800] mt-1">857 tickets sold</div>
          </div>

          <div className="bg-[#111111] border border-[#1E1E1E] rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <DollarSign className="w-5 h-5 text-[#00FF9C]" />
              <TrendingUp className="w-4 h-4 text-[#00FF9C]" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">$55.5K</div>
            <div className="text-sm text-[#A0A0A0]">Total Revenue</div>
            <div className="text-xs text-[#00FF9C] mt-1">+340% vs last quarter</div>
          </div>

          <div className="bg-[#111111] border border-[#1E1E1E] rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <Star className="w-5 h-5 text-[#FFB800]" />
              <AlertCircle className="w-4 h-4 text-[#FF3B3B]" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">4.8</div>
            <div className="text-sm text-[#A0A0A0]">Avg Rating</div>
            <div className="text-xs text-[#FFB800] mt-1">From 1,240 reviews</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-[#111111] p-1 rounded-xl border border-[#1E1E1E] w-fit">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'upcoming' 
                ? 'bg-[#FFB800] text-black' 
                : 'text-[#A0A0A0] hover:text-white'
            }`}
          >
            Upcoming Events
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'past' 
                ? 'bg-[#FFB800] text-black' 
                : 'text-[#A0A0A0] hover:text-white'
            }`}
          >
            Past Events
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'analytics' 
                ? 'bg-[#FFB800] text-black' 
                : 'text-[#A0A0A0] hover:text-white'
            }`}
          >
            Analytics
          </button>
        </div>

        {/* Event Lists */}
        {activeTab === 'upcoming' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">Upcoming Events</h2>
            <div className="grid gap-4">
              {upcomingEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'past' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">Past Events</h2>
            <div className="grid gap-4">
              {pastEvents.map((event) => (
                <EventCard key={event.id} event={event} isPast={true} />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white">Event Analytics</h2>
            
            {/* ROI Calculator */}
            <div className="bg-[#111111] border border-[#1E1E1E] rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Event ROI Calculator</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#A0A0A0] mb-2">Event Budget</label>
                  <input 
                    type="number" 
                    placeholder="$0" 
                    className="w-full bg-[#1E1E1E] border border-[#333333] rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#A0A0A0] mb-2">Expected Revenue</label>
                  <input 
                    type="number" 
                    placeholder="$0" 
                    className="w-full bg-[#1E1E1E] border border-[#333333] rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div className="flex items-end">
                  <button className="w-full bg-[#FFB800] hover:bg-[#FF6B00] text-black px-4 py-2 rounded-lg font-medium transition-all">
                    Calculate ROI
                  </button>
                </div>
              </div>
            </div>

            {/* Geographic Map Placeholder */}
            <div className="bg-[#111111] border border-[#1E1E1E] rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Event Locations</h3>
              <div className="h-64 bg-[#1E1E1E] rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-[#FFB800] mx-auto mb-2" />
                  <p className="text-[#A0A0A0]">Geographic event map coming soon</p>
                  <p className="text-sm text-[#555555]">Track your performance across different markets</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Event Modal */}
        {showAddEvent && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#111111] border border-[#1E1E1E] rounded-xl p-6 w-full max-w-md">
              <h3 className="text-lg font-bold text-white mb-4">Add New Event</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#A0A0A0] mb-2">Event Name</label>
                  <input 
                    type="text" 
                    placeholder="Event name" 
                    className="w-full bg-[#1E1E1E] border border-[#333333] rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#A0A0A0] mb-2">Venue</label>
                  <input 
                    type="text" 
                    placeholder="Venue name" 
                    className="w-full bg-[#1E1E1E] border border-[#333333] rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#A0A0A0] mb-2">Date</label>
                    <input 
                      type="date" 
                      className="w-full bg-[#1E1E1E] border border-[#333333] rounded-lg px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#A0A0A0] mb-2">Time</label>
                    <input 
                      type="time" 
                      className="w-full bg-[#1E1E1E] border border-[#333333] rounded-lg px-3 py-2 text-white"
                    />
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <button 
                    onClick={() => setShowAddEvent(false)}
                    className="flex-1 bg-[#1E1E1E] text-white px-4 py-2 rounded-lg hover:bg-[#2A2A2A] transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => setShowAddEvent(false)}
                    className="flex-1 bg-[#FFB800] hover:bg-[#FF6B00] text-black px-4 py-2 rounded-lg font-medium transition-all"
                  >
                    Add Event
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}