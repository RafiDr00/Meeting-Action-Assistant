import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Users, 
  CheckCircle, 
  AlertCircle, 
  Circle, 
  MoreVertical,
  Play,
  Download,
  Trash2,
  Eye,
  Star,
  Archive
} from 'lucide-react';
import { Meeting } from '../types';

interface MeetingListProps {
  meetings: Meeting[];
  selectedMeetingId: string | null;
  onMeetingSelect: (meetingId: string) => void;
  viewType: 'dashboard' | 'meetings';
}

const MeetingList: React.FC<MeetingListProps> = ({ 
  meetings, 
  selectedMeetingId, 
  onMeetingSelect,
  viewType 
}) => {
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'status'>('date');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed' | 'overdue'>('all');
  const [showMoreMenu, setShowMoreMenu] = useState<string | null>(null);

  // Sort meetings
  const sortedMeetings = [...meetings].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case 'title':
        return a.title.localeCompare(b.title);
      case 'status':
        const getStatusPriority = (meeting: Meeting) => {
          const pendingActions = meeting.actionItems.filter(item => item.status === 'pending').length;
          const overdueActions = meeting.actionItems.filter(item => item.status === 'overdue').length;
          if (overdueActions > 0) return 3;
          if (pendingActions > 0) return 2;
          return 1;
        };
        return getStatusPriority(b) - getStatusPriority(a);
      default:
        return 0;
    }
  });

  // Filter meetings
  const filteredMeetings = sortedMeetings.filter(meeting => {
    if (filterStatus === 'all') return true;
    
    const hasStatus = (status: string) => 
      meeting.actionItems.some(item => item.status === status);
    
    switch (filterStatus) {
      case 'pending':
        return hasStatus('pending');
      case 'completed':
        return meeting.actionItems.every(item => item.status === 'completed');
      case 'overdue':
        return hasStatus('overdue');
      default:
        return true;
    }
  });

  const getStatusColor = (meeting: Meeting) => {
    const overdueCount = meeting.actionItems.filter(item => item.status === 'overdue').length;
    const pendingCount = meeting.actionItems.filter(item => item.status === 'pending').length;
    const completedCount = meeting.actionItems.filter(item => item.status === 'completed').length;
    
    if (overdueCount > 0) return 'text-orange-600 dark:text-orange-400';
    if (pendingCount > 0) return 'text-yellow-600 dark:text-yellow-400';
    if (completedCount === meeting.actionItems.length) return 'text-teal-600 dark:text-teal-400';
    return 'text-slate-600 dark:text-slate-400';
  };

  const getStatusIcon = (meeting: Meeting) => {
    const overdueCount = meeting.actionItems.filter(item => item.status === 'overdue').length;
    const pendingCount = meeting.actionItems.filter(item => item.status === 'pending').length;
    const completedCount = meeting.actionItems.filter(item => item.status === 'completed').length;
    
    if (overdueCount > 0) return <AlertCircle className="w-4 h-4" />;
    if (pendingCount > 0) return <Circle className="w-4 h-4" />;
    if (completedCount === meeting.actionItems.length) return <CheckCircle className="w-4 h-4" />;
    return <Circle className="w-4 h-4" />;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const generateSummary = (meeting: Meeting) => {
    const totalActions = meeting.actionItems.length;
    const completedActions = meeting.actionItems.filter(item => item.status === 'completed').length;
    const pendingActions = meeting.actionItems.filter(item => item.status === 'pending').length;
    const overdueActions = meeting.actionItems.filter(item => item.status === 'overdue').length;
    
    if (totalActions === 0) {
      return `Discussion with ${meeting.participants.length} participants. No action items identified.`;
    }
    
    let summary = `${totalActions} action item${totalActions > 1 ? 's' : ''} identified`;
    if (completedActions > 0) summary += `, ${completedActions} completed`;
    if (pendingActions > 0) summary += `, ${pendingActions} pending`;
    if (overdueActions > 0) summary += `, ${overdueActions} overdue`;
    
    return summary + '.';
  };

  return (
    <div className="h-full flex flex-col glass-panel relative overflow-hidden">
      {/* Glass effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/5 to-transparent pointer-events-none" />
      
      {/* Header */}
      <div className="p-6 border-b border-white/20 relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 text-shadow">
            {viewType === 'dashboard' ? 'Recent Meetings' : 'All Meetings'}
          </h2>
          <span className="px-3 py-1 glass-card text-slate-600 dark:text-slate-300 text-sm rounded-full backdrop-blur-sm">
            {filteredMeetings.length} meetings
          </span>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'title' | 'status')}
            className="px-3 py-2 glass-button rounded-2xl text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-600/50 transition-all duration-300"
          >
            <option value="date">Sort by Date</option>
            <option value="title">Sort by Title</option>
            <option value="status">Sort by Status</option>
          </select>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as 'all' | 'pending' | 'completed' | 'overdue')}
            className="px-3 py-2 glass-button rounded-2xl text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-600/50 transition-all duration-300"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
      </div>

      {/* Meeting List */}
      <div className="flex-1 overflow-y-auto relative z-10">
        {filteredMeetings.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <Calendar className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
              No meetings found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Upload a meeting recording to get started
            </p>
          </div>
        ) : (
          <div className="divide-y divide-white/10 dark:divide-white/5">
            {filteredMeetings.map((meeting) => (
              <div
                key={meeting.id}
                onClick={() => onMeetingSelect(meeting.id)}
                className={`p-6 glass-button hover:bg-slate-600/10 dark:hover:bg-slate-700/20 cursor-pointer transition-all duration-300 hover:shadow-lg relative group ${
                  selectedMeetingId === meeting.id ? 'bg-slate-800/15 border-r-4 border-slate-700 glow-primary' : ''
                }`}
              >
                {/* Glass reflection on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="flex items-start justify-between relative z-10">
                  <div className="flex-1">
                    {/* Meeting Title and Status */}
                    <div className="flex items-center mb-2">
                      <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mr-3 text-shadow">
                        {meeting.title}
                      </h3>
                      <div className={`flex items-center ${getStatusColor(meeting)}`}>
                        {getStatusIcon(meeting)}
                      </div>
                    </div>

                    {/* Meeting Details */}
                    <div className="flex items-center text-sm text-slate-500 dark:text-slate-400 mb-3 space-x-4">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(meeting.date)}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {new Date(meeting.date).toLocaleTimeString('en-US', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {meeting.participants.length} participants
                      </div>
                    </div>

                    {/* AI-Generated Summary */}
                    <p className="text-sm text-slate-600 dark:text-slate-300 mb-3 opacity-90">
                      {generateSummary(meeting)}
                    </p>

                    {/* Participants */}
                    <div className="flex items-center">
                      <span className="text-xs text-slate-500 dark:text-slate-400 mr-2">Participants:</span>
                      <div className="flex items-center space-x-1">
                        {meeting.participants.slice(0, 3).map((participant, index) => (
                          <div
                            key={index}
                            className="w-6 h-6 bg-gradient-to-br from-slate-700 to-slate-800 rounded-full flex items-center justify-center text-xs text-white font-medium shadow-lg border border-slate-600/30"
                            title={participant}
                          >
                            {participant.charAt(0).toUpperCase()}
                          </div>
                        ))}
                        {meeting.participants.length > 3 && (
                          <div className="w-6 h-6 glass-card rounded-full flex items-center justify-center text-xs text-gray-600 dark:text-gray-300 font-medium">
                            +{meeting.participants.length - 3}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* More Actions Menu */}
                  <div className="relative ml-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowMoreMenu(showMoreMenu === meeting.id ? null : meeting.id);
                      }}
                      className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 glass-button rounded-2xl transition-all duration-300 hover:scale-110"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {showMoreMenu === meeting.id && (
                      <div className="absolute right-0 mt-2 w-48 glass-card rounded-2xl shadow-2xl border border-white/30 z-50 overflow-hidden">
                        <button className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 glass-button transition-all duration-200 hover:bg-white/30 dark:hover:bg-white/10">
                          <Eye className="w-4 h-4 mr-3" />
                          View Details
                        </button>
                        <button className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 glass-button transition-all duration-200 hover:bg-white/30 dark:hover:bg-white/10">
                          <Play className="w-4 h-4 mr-3" />
                          Play Recording
                        </button>
                        <button className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 glass-button transition-all duration-200 hover:bg-white/30 dark:hover:bg-white/10">
                          <Download className="w-4 h-4 mr-3" />
                          Download Transcript
                        </button>
                        <button className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 glass-button transition-all duration-200 hover:bg-white/30 dark:hover:bg-white/10">
                          <Star className="w-4 h-4 mr-3" />
                          Add to Favorites
                        </button>
                        <button className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 glass-button transition-all duration-200 hover:bg-white/30 dark:hover:bg-white/10">
                          <Archive className="w-4 h-4 mr-3" />
                          Archive
                        </button>
                        <div className="border-t border-white/20">
                          <button className="w-full flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 glass-button transition-all duration-200 hover:bg-red-500/10">
                            <Trash2 className="w-4 h-4 mr-3" />
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MeetingList;