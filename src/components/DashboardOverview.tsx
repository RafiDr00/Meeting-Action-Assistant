import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  BarChart3,
  PieChart,
  Activity,
  Star,
  Target,
  Zap
} from 'lucide-react';
import { Meeting } from '../types';

interface DashboardOverviewProps {
  meetings: Meeting[];
  onViewChange: (view: 'meetings') => void;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ meetings, onViewChange }) => {
  // Calculate statistics
  const totalMeetings = meetings.length;
  const totalActionItems = meetings.reduce((sum, meeting) => sum + meeting.actionItems.length, 0);
  const completedActionItems = meetings.reduce((sum, meeting) => 
    sum + meeting.actionItems.filter(item => item.status === 'completed').length, 0
  );
  const overdueActionItems = meetings.reduce((sum, meeting) => 
    sum + meeting.actionItems.filter(item => item.status === 'overdue').length, 0
  );
  const pendingActionItems = meetings.reduce((sum, meeting) => 
    sum + meeting.actionItems.filter(item => item.status === 'pending').length, 0
  );

  const completionRate = totalActionItems > 0 ? (completedActionItems / totalActionItems) * 100 : 0;
  const recentMeetings = meetings.slice(0, 5);

  // Get meetings from this week
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const thisWeekMeetings = meetings.filter(meeting => new Date(meeting.date) >= weekAgo);

  const stats = [
    {
      title: 'Total Meetings',
      value: totalMeetings,
      change: '+12%',
      trend: 'up',
      icon: Calendar,
      color: 'text-slate-600 dark:text-slate-400',
      bgColor: 'bg-slate-500/10'
    },
    {
      title: 'Action Items',
      value: totalActionItems,
      change: '+8.2%',
      trend: 'up',
      icon: Target,
      color: 'text-slate-600 dark:text-slate-400',
      bgColor: 'bg-slate-500/10'
    },
    {
      title: 'Completion Rate',
      value: `${Math.round(completionRate)}%`,
      change: completionRate > 75 ? '+5.1%' : '-2.3%',
      trend: completionRate > 75 ? 'up' : 'down',
      icon: CheckCircle,
      color: 'text-slate-600 dark:text-slate-400',
      bgColor: 'bg-slate-500/10'
    },
    {
      title: 'This Week',
      value: thisWeekMeetings.length,
      change: '+15.3%',
      trend: 'up',
      icon: Clock,
      color: 'text-slate-600 dark:text-slate-400',
      bgColor: 'bg-slate-500/10'
    }
  ];

  const quickActions = [
    {
      title: 'Upload New Meeting',
      description: 'Add and analyze a new meeting recording',
      icon: Calendar,
      color: 'bg-slate-600 hover:bg-slate-700',
      action: () => document.getElementById('file-upload')?.click()
    },
    {
      title: 'View All Meetings',
      description: 'Browse and manage all meeting records',
      icon: BarChart3,
      color: 'bg-slate-500 hover:bg-slate-600',
      action: () => onViewChange('meetings')
    },
    {
      title: 'Generate Report',
      description: 'Create a summary report of recent activities',
      icon: PieChart,
      color: 'bg-slate-400 hover:bg-slate-500',
      action: () => console.log('Generate report')
    }
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="h-full overflow-y-auto relative">
      {/* Glass background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 pointer-events-none" />
      
      <div className="p-6 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Dashboard Overview
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Track your meeting productivity and action item progress
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="glass-card rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 group relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className={`flex items-center text-sm font-medium ${
                  stat.trend === 'up' ? 'text-slate-600 dark:text-slate-400' : 'text-slate-500 dark:text-slate-400'
                }`}>
                  {stat.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 mr-1" />
                  )}
                  {stat.change}
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {stat.value}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                  {stat.title}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Action Items Status */}
          <div className="lg:col-span-2 space-y-6">
            {/* Action Items Breakdown */}
            <div className="glass-card rounded-2xl p-6 shadow-xl">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-6">
                Action Items Status
              </h3>
              
              <div className="space-y-4">
                {/* Completed */}
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/20 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-slate-600 dark:text-slate-400 mr-3" />
                    <div>
                      <p className="font-medium text-slate-900 dark:text-slate-100">Completed</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Tasks finished successfully</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-slate-600 dark:text-slate-400">
                      {completedActionItems}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {Math.round(completionRate)}% of total
                    </p>
                  </div>
                </div>

                {/* Pending */}
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/20 rounded-lg">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-slate-500 dark:text-slate-400 mr-3" />
                    <div>
                      <p className="font-medium text-slate-900 dark:text-slate-100">Pending</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Awaiting completion</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-slate-500 dark:text-slate-400">
                      {pendingActionItems}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {totalActionItems > 0 ? Math.round((pendingActionItems / totalActionItems) * 100) : 0}% of total
                    </p>
                  </div>
                </div>

                {/* Overdue */}
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/20 rounded-lg">
                  <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-slate-500 dark:text-slate-400 mr-3" />
                    <div>
                      <p className="font-medium text-slate-900 dark:text-slate-100">Overdue</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Require immediate attention</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-slate-500 dark:text-slate-400">
                      {overdueActionItems}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {totalActionItems > 0 ? Math.round((overdueActionItems / totalActionItems) * 100) : 0}% of total
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="glass-card rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                  Recent Activity
                </h3>
                <button 
                  onClick={() => onViewChange('meetings')}
                  className="text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 text-sm font-medium"
                >
                  View all
                </button>
              </div>
              
              <div className="space-y-4">
                {recentMeetings.map((meeting) => (
                  <div key={meeting.id} className="flex items-center p-3 hover:bg-slate-500/10 dark:hover:bg-slate-700/20 rounded-lg transition-colors duration-200">
                    <div className="w-10 h-10 bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg flex items-center justify-center text-white font-medium mr-4">
                      {meeting.title.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-900 dark:text-slate-100 text-sm">
                        {meeting.title}
                      </p>
                      <p className="text-slate-500 dark:text-slate-400 text-xs">
                        {meeting.actionItems.length} action items • {formatDate(meeting.date)}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className={`w-2 h-2 rounded-full ${
                        meeting.actionItems.some(item => item.status === 'overdue') ? 'bg-slate-500' :
                        meeting.actionItems.some(item => item.status === 'pending') ? 'bg-slate-400' :
                        'bg-slate-600'
                      }`} />
                    </div>
                  </div>
                ))}
                
                {recentMeetings.length === 0 && (
                  <div className="text-center py-8">
                    <Activity className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-slate-500 dark:text-slate-400 text-sm">
                      No recent activity
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Quick Actions */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="glass-card rounded-2xl p-6 shadow-xl">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-6">
                Quick Actions
              </h3>
              
              <div className="space-y-3">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={action.action}
                    className={`w-full flex items-center p-4 text-white rounded-lg transition-all duration-200 shadow-sm hover:shadow-md ${action.color}`}
                  >
                    <action.icon className="w-5 h-5 mr-3" />
                    <div className="text-left">
                      <p className="font-medium">{action.title}</p>
                      <p className="text-sm opacity-90">{action.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* AI Insights */}
            <div className="glass-card rounded-2xl p-6 shadow-xl">
              <div className="flex items-center mb-4">
                <Zap className="w-5 h-5 text-teal-600 dark:text-teal-400 mr-2" />
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                  AI Insights
                </h3>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900/20 dark:to-slate-800/20 rounded-lg">
                  <div className="flex items-start">
                    <Star className="w-4 h-4 text-slate-600 dark:text-slate-400 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                        Peak Productivity
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                        Tuesday meetings have 23% higher completion rates
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900/20 dark:to-slate-800/20 rounded-lg">
                  <div className="flex items-start">
                    <Target className="w-4 h-4 text-slate-600 dark:text-slate-400 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                        Action Focus
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                        Meetings with 3-5 participants generate clearer action items
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900/20 dark:to-slate-800/20 rounded-lg">
                  <div className="flex items-start">
                    <AlertCircle className="w-4 h-4 text-slate-600 dark:text-slate-400 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                        Attention Needed
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                        {overdueActionItems} overdue items need immediate follow-up
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;