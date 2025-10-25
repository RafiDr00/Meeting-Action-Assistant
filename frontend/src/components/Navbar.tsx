import React, { useEffect, useState } from 'react';
import { Mic, Sparkles, Search, Bell, User, Zap } from 'lucide-react';

const Navbar: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <nav 
      className="glass-panel sticky top-0 z-50 border-b border-gray-200/50 animate-fade-in-down interactive-glow"
      style={{
        background: `
          radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(255, 255, 255, 0.1) 0%, transparent 55%),
          linear-gradient(135deg, rgba(26, 26, 26, 0.9) 0%, rgba(15, 15, 15, 0.75) 100%)
        `
      }}
    >
      {/* Premium Content Container */}
      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="flex justify-between items-center h-16">
          
          {/* Brand Identity */}
          <div className="flex items-center space-x-6 animate-slide-in-left">
            <div className="relative group perspective-container">
              <div className="w-16 h-16 bg-gradient-to-br from-white/40 via-neutral-500/40 to-neutral-900/80 rounded-3xl flex items-center justify-center shadow-2xl animate-morph group-hover:scale-110 transition-all duration-500 transform-3d epic-glow hover-tilt-3d">
                <Mic className="w-8 h-8 text-neutral-900 animate-pulse relative z-10" />
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/15 to-transparent rounded-3xl"></div>
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent rounded-3xl animate-shimmer"></div>
              </div>
              
              {/* Holographic Ring */}
              <div className="absolute -inset-2 rounded-3xl animate-glow opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-white via-neutral-400 to-neutral-700 animate-rotate" style={{
                  background: 'conic-gradient(from 0deg, #ffffff, #d4d4d4, #525252, #111111, #ffffff)',
                  animation: 'rotate 3s linear infinite'
                }}></div>
              </div>
              
              {/* AI Status Indicator */}
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-white to-neutral-500 rounded-full border-3 border-white shadow-2xl overflow-hidden">
                <Zap className="w-3 h-3 text-neutral-900 absolute top-1 left-1 animate-pulse" />
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent rounded-full"></div>
                <div className="absolute -inset-1 bg-white/60 rounded-full blur animate-pulse opacity-60"></div>
              </div>
              
              {/* Floating Particles around Logo */}
              <div className="absolute top-2 -right-4 w-1 h-1 bg-white/80 rounded-full animate-float opacity-80"></div>
              <div className="absolute -bottom-2 -left-3 w-1 h-1 bg-neutral-500 rounded-full animate-float opacity-60" style={{animationDelay: '1s'}}></div>
              <div className="absolute top-8 -left-2 w-1 h-1 bg-neutral-400 rounded-full animate-float opacity-70" style={{animationDelay: '2s'}}></div>
            </div>
            
            <div className="space-y-2">
              <h1 className="text-3xl font-black bg-gradient-to-r from-white via-neutral-300 to-neutral-600 bg-clip-text text-transparent tracking-tight hover:scale-105 transition-transform duration-300">
                Meeting AI
              </h1>
              <p className="text-sm text-neutral-400 font-semibold flex items-center space-x-2 group-hover:text-neutral-200 transition-colors">
                <span>Neural Action Assistant</span>
                <Sparkles className="w-4 h-4 text-neutral-200 animate-pulse" />
                <div className="w-2 h-2 bg-gradient-to-r from-white to-neutral-500 rounded-full animate-pulse"></div>
              </p>
            </div>
          </div>

          {/* Center Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400 group-focus-within:text-white transition-colors duration-200" />
              <input
                type="text"
                placeholder="Search meetings, actions, insights..."
                className="w-full pl-12 pr-4 py-3 glass-card border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/40 focus:shadow-lg transition-all duration-300 placeholder-neutral-500 text-neutral-100"
                style={{
                  background: 'rgba(24, 24, 24, 0.8)',
                  backdropFilter: 'blur(12px)'
                }}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <kbd className="px-2 py-1 text-xs font-medium text-neutral-300 bg-neutral-800 border border-neutral-700 rounded">⌘K</kbd>
              </div>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex items-center space-x-4 animate-slide-in-right">
            <button className="glass-button p-3 rounded-xl hover:scale-110 transition-all duration-200 relative group">
              <Bell className="w-5 h-5 text-neutral-400 group-hover:text-neutral-100 transition-colors" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full animate-pulse"></span>
            </button>
            
            <div className="flex items-center space-x-3 glass-card px-4 py-3 rounded-xl animate-glow relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-neutral-500/10 to-neutral-800/10 animate-shimmer"></div>
              <div className="relative flex items-center space-x-2">
                <div className="w-2 h-2 bg-gradient-to-r from-white to-neutral-500 rounded-full animate-pulse"></div>
                <Sparkles className="w-4 h-4 text-neutral-100 animate-pulse" />
                <span className="text-sm font-bold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
                  AI Online
                </span>
              </div>
            </div>
            
            <button className="w-10 h-10 bg-gradient-to-br from-white/20 to-neutral-700/40 rounded-xl flex items-center justify-center hover:scale-110 transition-all duration-300 shadow-lg">
              <User className="w-5 h-5 text-neutral-100" />
            </button>
          </div>
        </div>
      </div>

    </nav>
  );
};

export default Navbar;
