import React from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  UserCheck, 
  Settings, 
  MessageSquare,
  CheckCircle,
  Clock,
  Target
} from 'lucide-react';

type ViewType = 'dashboard' | 'meetings' | 'clients' | 'teams' | 'settings';

interface SidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  isDarkMode: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange }) => {
  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'meetings', label: 'Meetings', icon: Calendar, badge: '3' },
    { id: 'clients', label: 'Clients', icon: Users },
    { id: 'teams', label: 'Teams', icon: UserCheck },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const quickStats = [
    {
      label: 'Active Tasks',
      value: '24',
      icon: Target,
      color: 'text-slate-700 dark:text-slate-300',
      bgColor: 'bg-slate-600/10'
    },
    {
      label: 'Completed',
      value: '18',
      icon: CheckCircle,
      color: 'text-teal-700 dark:text-teal-300',
      bgColor: 'bg-teal-600/10'
    },
    {
      label: 'This Week',
      value: '7',
      icon: Clock,
      color: 'text-yellow-700 dark:text-yellow-300',
      bgColor: 'bg-yellow-500/10'
    },
  ];

  return (
    <aside className="w-64 glass-panel shadow-2xl flex flex-col relative overflow-hidden">
      {/* Glass reflection effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-white/5 to-transparent pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
      <div className="absolute top-0 left-0 h-full w-px bg-gradient-to-b from-white/30 via-white/10 to-transparent" />
      
      {/* Logo and Brand */}
      <div className="p-6 border-b border-white/20 relative z-10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl flex items-center justify-center shadow-xl backdrop-blur-sm border border-slate-600/50 glow-primary">
            <MessageSquare className="w-6 h-6 text-white drop-shadow-sm" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white text-shadow">Meeting AI</h1>
            <p className="text-xs text-gray-600 dark:text-gray-300 opacity-80">Action Assistant</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 relative z-10">
        {navigationItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id as ViewType)}
              className={`w-full flex items-center px-4 py-3 text-left rounded-2xl transition-all duration-300 group backdrop-blur-sm border relative overflow-hidden ${
                isActive
                  ? 'bg-slate-800/20 text-slate-900 dark:text-slate-100 shadow-lg border-slate-700/40 glow-primary'
                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-600/10 dark:hover:bg-slate-700/20 border-slate-200/30 dark:border-slate-700/30 hover:border-slate-300/50 dark:hover:border-slate-600/50 hover:shadow-lg hover:scale-[1.02]'
              }`}
            >
              {/* Glass reflection effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <item.icon className={`w-5 h-5 mr-3 transition-all duration-300 drop-shadow-sm relative z-10 ${
                isActive ? 'text-slate-800 dark:text-slate-200' : 'text-slate-600 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300'
              }`} />
              <span className="font-medium drop-shadow-sm relative z-10">{item.label}</span>
              {item.badge && (
                <span className="ml-auto px-2 py-1 bg-teal-500/20 backdrop-blur-sm text-teal-800 dark:text-teal-200 text-xs rounded-full font-medium border border-teal-400/30 shadow-sm glow-accent">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Quick Stats */}
      <div className="px-4 pb-6 relative z-10">
        <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider mb-4 text-shadow opacity-80">
          Quick Stats
        </h3>
        <div className="grid grid-cols-1 gap-3">
          {quickStats.map((stat, index) => (
            <div key={index} className="glass-card rounded-2xl p-4 hover:shadow-2xl hover:bg-white/30 dark:hover:bg-white/10 transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white text-shadow">
                    {stat.value}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 opacity-90">
                    {stat.label}
                  </p>
                </div>
                <div className={`p-2 rounded-xl backdrop-blur-sm border border-white/40 shadow-lg group-hover:scale-110 transition-transform duration-300 ${stat.bgColor}`}>
                  <stat.icon className={`w-4 h-4 drop-shadow-sm ${stat.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* AI Status */}
        <div className="mt-6 p-4 glass-card rounded-2xl bg-teal-500/10 border-teal-400/30 shadow-xl relative overflow-hidden glow-accent">
          {/* Animated glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-teal-400/15 to-transparent animate-pulse" />
          
          <div className="flex items-center space-x-3 relative z-10">
            <div className="w-3 h-3 bg-teal-500 rounded-full animate-pulse shadow-lg shadow-teal-400/60 ring-2 ring-teal-300/50" />
            <div>
              <p className="text-sm font-medium text-teal-800 dark:text-teal-200 text-shadow">
                AI Assistant Online
              </p>
              <p className="text-xs text-teal-700 dark:text-teal-300 opacity-80">
                Ready to process meetings
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;