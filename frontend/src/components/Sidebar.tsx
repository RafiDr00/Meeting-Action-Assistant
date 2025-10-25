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
      color: 'text-neutral-100',
      bgColor: 'bg-neutral-800/60'
    },
    {
      label: 'Completed',
      value: '18',
      icon: CheckCircle,
      color: 'text-neutral-100',
      bgColor: 'bg-neutral-800/60'
    },
    {
      label: 'This Week',
      value: '7',
      icon: Clock,
      color: 'text-neutral-100',
      bgColor: 'bg-neutral-800/60'
    },
  ];

  return (
    <aside className="w-72 glass-panel border-r border-gray-200/50 flex flex-col animate-slide-in-left relative overflow-hidden perspective-container">
      {/* Cinematic Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="floating-orb-2 opacity-40"></div>
        <div className="absolute top-20 right-4 w-32 h-32 bg-gradient-to-br from-white/15 to-neutral-500/15 rounded-full animate-float blur-2xl"></div>
        <div className="absolute bottom-40 left-6 w-20 h-20 bg-gradient-to-br from-white/10 to-neutral-600/10 rounded-full animate-float blur-xl" style={{animationDelay: '2s'}}></div>
        
        {/* Energy Streams */}
        <div className="absolute right-2 top-1/4 energy-trail opacity-30"></div>
        <div className="absolute right-6 top-1/2 energy-trail opacity-20" style={{animationDelay: '1s'}}></div>
      </div>
      
      {/* Holographic Grid Background */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px',
          animation: 'backgroundFlow 10s ease-in-out infinite'
        }}
      ></div>

      {/* Header Section */}
      <div className="p-8 border-b border-gray-200/30 relative z-10 epic-glow">
        <div className="flex items-center space-x-5 animate-scale-in group perspective-container">
          <div className="relative transform-3d">
            <div className="w-16 h-16 bg-gradient-to-br from-white/40 via-neutral-400/40 to-neutral-900/70 rounded-3xl flex items-center justify-center shadow-2xl animate-morph group-hover:scale-110 transition-all duration-500 hover-tilt-3d">
              <MessageSquare className="w-8 h-8 text-neutral-900 animate-pulse relative z-10" />
              <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-white/20 to-transparent rounded-3xl"></div>
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent rounded-3xl animate-shimmer"></div>
            </div>
            
            {/* Orbital Rings */}
            <div className="absolute -inset-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute inset-0 border-2 border-white/20 rounded-full animate-orbit-slow"></div>
              <div className="absolute inset-2 border border-neutral-500/30 rounded-full animate-orbit-fast"></div>
            </div>
            
            {/* Floating Energy Dots */}
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-white/70 rounded-full animate-float blur-sm"></div>
            <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-neutral-500 rounded-full animate-float blur-sm" style={{animationDelay: '1s'}}></div>
          </div>
          
          <div className="space-y-2 flex-1">
            <h2 className="text-2xl font-black bg-gradient-to-r from-white via-neutral-300 to-neutral-600 bg-clip-text text-transparent tracking-tight">
              Control Center
            </h2>
            <p className="text-sm text-neutral-400 font-semibold flex items-center space-x-2">
              <span>Neural Dashboard</span>
              <div className="flex space-x-1">
                <div className="w-1 h-1 bg-white rounded-full animate-pulse"></div>
                <div className="w-1 h-1 bg-neutral-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                <div className="w-1 h-1 bg-neutral-600 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
              </div>
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 relative z-10">
        {navigationItems.map((item, index) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id as ViewType)}
              className={`
                w-full flex items-center px-4 py-4 text-left rounded-xl transition-all duration-300 group relative animate-fade-in-up interactive-glow overflow-hidden
                ${isActive 
                  ? 'glass-card text-neutral-100 shadow-lg' 
                  : 'text-neutral-300 hover:glass-card hover:text-neutral-100 hover:scale-105'
                }
              `}
              style={{
                animationDelay: `${index * 100}ms`,
                background: isActive 
                  ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(107, 114, 128, 0.06) 100%)'
                  : undefined
              }}
            >
              {/* Active holographic indicator */}
              {isActive && (
                <>
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-white via-neutral-400 to-neutral-600 rounded-r-full animate-scale-in shadow-lg"></div>
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-white/70 via-neutral-500/60 to-neutral-700/60 rounded-r-full blur animate-pulse"></div>
                </>
              )}
              
              {/* Icon with epic glow effect */}
              <div className={`relative mr-5 perspective-container ${isActive ? 'epic-glow' : ''}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 ${
                  isActive 
                    ? 'bg-gradient-to-br from-white/20 to-neutral-500/10 shadow-lg' 
                    : 'group-hover:bg-gradient-to-br group-hover:from-white/10 group-hover:to-neutral-500/10'
                }`}>
                  <item.icon 
                    className={`w-6 h-6 transition-all duration-500 transform-3d ${
                      isActive 
                        ? 'text-neutral-100 animate-pulse' 
                        : 'text-neutral-500 group-hover:text-neutral-100 group-hover:scale-110'
                    }`}
                  />
                </div>
                
                {/* Orbital glow rings for active state */}
                {isActive && (
                  <>
                    <div className="absolute -inset-2 border border-white/25 rounded-xl animate-pulse"></div>
                    <div className="absolute -inset-1 bg-white/15 rounded-xl blur animate-pulse"></div>
                  </>
                )}
                
                {/* Floating energy dots */}
                {isActive && (
                  <>
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-white/80 rounded-full animate-float"></div>
                    <div className="absolute -bottom-1 -left-1 w-1 h-1 bg-neutral-500 rounded-full animate-float" style={{animationDelay: '1s'}}></div>
                  </>
                )}
              </div>

              <span className={`font-semibold transition-all duration-300 flex-1 ${
                isActive 
                  ? 'font-bold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent' 
                  : 'text-neutral-300 group-hover:text-neutral-100 group-hover:font-bold'
              }`}>
                {item.label}
              </span>
              
              {item.badge && (
                <div className="relative">
                  <span className="bg-gradient-to-r from-white to-neutral-500 text-neutral-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg animate-pulse border border-white/40">
                    {item.badge}
                  </span>
                  <div className="absolute -inset-1 bg-white/30 rounded-full blur opacity-30 animate-pulse"></div>
                </div>
              )}
              
              {/* Multi-layer hover effects */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-shimmer"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-neutral-500/10 to-neutral-700/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
            </button>
          );
        })}
      </nav>

      {/* Quick Stats */}
      <div className="px-4 pb-6 relative z-10">
        <h3 className="text-sm font-bold text-neutral-300 uppercase tracking-wide mb-6 flex items-center space-x-2">
          <span>Quick Stats</span>
          <div className="w-2 h-2 bg-gradient-to-r from-white to-neutral-500 rounded-full animate-pulse"></div>
        </h3>
        <div className="space-y-4">
          {quickStats.map((stat, index) => (
            <div 
              key={index} 
              className="glass-card p-5 rounded-xl hover:shadow-xl transition-all duration-300 animate-fade-in-up group interactive-glow relative overflow-hidden"
              style={{
                animationDelay: `${(index + 3) * 150}ms`
              }}
            >
              {/* Background gradient effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-neutral-500/10 to-neutral-700/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center space-x-4">
                  <div className={`
                    w-12 h-12 rounded-2xl flex items-center justify-center ${stat.bgColor} 
                    group-hover:scale-110 transition-all duration-300 shadow-lg
                    relative overflow-hidden
                  `}>
                    <stat.icon className={`w-6 h-6 ${stat.color} animate-pulse`} />
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"></div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-2xl font-bold text-neutral-100 group-hover:text-white transition-colors">
                      {stat.value}
                    </p>
                    <p className="text-sm text-neutral-400 font-medium">{stat.label}</p>
                  </div>
                </div>
                
                {/* Progress indicator */}
                <div className="w-2 h-8 bg-gradient-to-t from-white/40 via-neutral-400/40 to-neutral-700/40 rounded-full opacity-20 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              
              {/* Shimmer effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-shimmer"></div>
            </div>
          ))}
        </div>

        {/* AI Status */}
        <div className="mt-8 glass-card p-6 rounded-2xl animate-glow relative overflow-hidden group">
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-neutral-500/10 to-neutral-800/10 animate-pulse"></div>
          
          <div className="flex items-center space-x-4 relative z-10">
            <div className="relative">
              <div className="w-4 h-4 bg-gradient-to-r from-white to-neutral-500 rounded-full animate-pulse shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-r from-white to-neutral-600 rounded-full animate-ping"></div>
              </div>
              <div className="absolute -inset-1 bg-gradient-to-r from-white to-neutral-600 rounded-full blur opacity-30 animate-pulse"></div>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
                AI Assistant Online
              </p>
              <p className="text-xs text-neutral-400 flex items-center space-x-1">
                <span>Ready to process meetings</span>
                <div className="w-1 h-1 bg-white rounded-full animate-pulse"></div>
              </p>
            </div>
          </div>
          
          {/* Floating particles effect */}
          <div className="absolute top-2 right-4 w-1 h-1 bg-white/80 rounded-full animate-float opacity-60"></div>
          <div className="absolute bottom-3 right-6 w-1 h-1 bg-neutral-400 rounded-full animate-float opacity-40" style={{animationDelay: '1s'}}></div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;