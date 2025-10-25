import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Users, 
  CheckCircle, 
  AlertCircle, 
  Circle, 
  User,
  FileText,
  Download,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Share2,
  Edit3,
  Flag,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  X
} from 'lucide-react';
import { Meeting, ActionItem } from '../types';

interface MeetingDetailProps {
  meeting: Meeting | null;
  transcript: string;
  onClose: () => void;
  onUpdateActionItem: (itemId: string, updates: Partial<ActionItem>) => void;
}

const MeetingDetail: React.FC<MeetingDetailProps> = ({ 
  meeting, 
  transcript, 
  onClose,
  onUpdateActionItem 
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'transcript' | 'actions'>('overview');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({
    overview: true,
    participants: true,
    summary: true
  });

  if (!meeting) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No meeting selected
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Select a meeting from the list to view details
          </p>
        </div>
      </div>
    );
  }

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20';
      case 'pending':
        return 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20';
      case 'overdue':
        return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20';
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 dark:text-red-400';
      case 'medium':
        return 'text-orange-600 dark:text-orange-400';
      case 'low':
        return 'text-green-600 dark:text-green-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'overdue':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Circle className="w-4 h-4" />;
    }
  };

  const completedActions = meeting.actionItems.filter(item => item.status === 'completed').length;
  const totalActions = meeting.actionItems.length;
  const completionPercentage = totalActions > 0 ? (completedActions / totalActions) * 100 : 0;

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {meeting.title}
            </h1>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 space-x-4">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {formatDate(meeting.date)}
              </div>
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                {meeting.participants.length} participants
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200">
              <Share2 className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200">
              <Download className="w-5 h-5" />
            </button>
            <button 
              onClick={onClose}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Action Items Progress
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {completedActions} of {totalActions} completed ({Math.round(completionPercentage)}%)
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 mt-6 -mb-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors duration-200 ${
              activeTab === 'overview'
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('actions')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors duration-200 ${
              activeTab === 'actions'
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Action Items ({totalActions})
          </button>
          <button
            onClick={() => setActiveTab('transcript')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors duration-200 ${
              activeTab === 'transcript'
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Transcript
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Audio Player */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full transition-colors duration-200"
                  >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  </button>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Meeting Recording
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Duration: 45:32
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200"
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
              </div>
              <div className="mt-3">
                <div className="w-full bg-gray-300 dark:bg-gray-600 rounded-full h-1">
                  <div className="bg-indigo-500 h-1 rounded-full" style={{ width: '35%' }} />
                </div>
              </div>
            </div>

            {/* Participants */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
              <button
                onClick={() => toggleSection('participants')}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-colors duration-200"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Participants ({meeting.participants.length})
                </h3>
                {expandedSections.participants ? 
                  <ChevronUp className="w-5 h-5 text-gray-500" /> : 
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                }
              </button>
              
              {expandedSections.participants && (
                <div className="px-4 pb-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {meeting.participants.map((participant, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                          {participant.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {participant}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Participant
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* AI Summary */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
              <button
                onClick={() => toggleSection('summary')}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-colors duration-200"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  AI-Generated Summary
                </h3>
                {expandedSections.summary ? 
                  <ChevronUp className="w-5 h-5 text-gray-500" /> : 
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                }
              </button>
              
              {expandedSections.summary && (
                <div className="px-4 pb-4">
                  <div className="prose dark:prose-invert max-w-none">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      This meeting focused on project planning and resource allocation for the upcoming quarter. 
                      Key decisions were made regarding team assignments, budget approval, and timeline adjustments. 
                      The team discussed potential risks and mitigation strategies, with emphasis on maintaining 
                      quality standards while meeting aggressive deadlines. Several action items were identified 
                      to ensure project success and stakeholder alignment.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'actions' && (
          <div className="space-y-4">
            {meeting.actionItems.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No action items
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  This meeting didn't generate any action items
                </p>
              </div>
            ) : (
              meeting.actionItems.map((item, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <div className={`flex items-center mr-3 ${getStatusColor(item.status).split(' ')[0]}`}>
                          {getStatusIcon(item.status)}
                        </div>
                        <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                          {item.task}
                        </h4>
                      </div>
                      
                      {item.owner && (
                        <div className="flex items-center mb-2">
                          <User className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            Assigned to: {item.owner}
                          </span>
                        </div>
                      )}
                      
                      {item.due && (
                        <div className="flex items-center mb-2">
                          <Clock className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            Due: {new Date(item.due).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-4 mt-3">
                        <select
                          value={item.status}
                          onChange={(e) => onUpdateActionItem(item.id.toString(), { status: e.target.value as 'pending' | 'completed' | 'overdue' })}
                          className={`px-3 py-1 rounded-full text-xs font-medium border-0 ${getStatusColor(item.status)}`}
                        >
                          <option value="pending">Pending</option>
                          <option value="completed">Completed</option>
                          <option value="overdue">Overdue</option>
                        </select>
                        
                        <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}>
                          <Flag className="w-3 h-3 mr-1" />
                          {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)} Priority
                        </div>
                        
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Confidence: {Math.round(item.confidence * 100)}%
                        </div>
                      </div>
                    </div>
                    
                    <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200">
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'transcript' && (
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Full Transcript
              </h3>
              <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200">
                <Download className="w-4 h-4" />
              </button>
            </div>
            
            <div className="prose dark:prose-invert max-w-none">
              {transcript ? (
                <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 leading-relaxed">
                  {transcript}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">
                    Transcript not available for this meeting
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MeetingDetail;