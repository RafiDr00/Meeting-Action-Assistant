import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  Moon, 
  Sun, 
  Upload,
  Plus,
  User,
  ChevronDown,
  Settings,
  HelpCircle,
  LogOut
} from 'lucide-react';
import { ProcessingState } from '../types';

interface TopBarProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onFileSelect: (file: File) => void;
  processing: ProcessingState;
  error: string | null;
  onNewMeeting?: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ 
  isDarkMode, 
  onToggleDarkMode,
  onFileSelect,
  processing,
  error,
  onNewMeeting 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const isProcessing = processing.uploading || processing.transcribing || processing.extracting;

  const notifications = [
    { id: 1, message: 'New meeting processed', time: '2 min ago', type: 'success' },
    { id: 2, message: '3 action items due today', time: '5 min ago', type: 'warning' },
    { id: 3, message: 'Weekly report ready', time: '1 hour ago', type: 'info' },
  ];

  return (
    <header className="glass-panel border-b border-white/20 shadow-xl backdrop-blur-xl relative overflow-hidden">
      {/* Glass reflection effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/5 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
      
      <div className="flex items-center justify-between px-6 py-4 relative z-10">
        {/* Search Bar */}
        <div className="flex-1 max-w-lg">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-500" />
            <input
              type="text"
              placeholder="Search meetings, action items, or people..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 glass-button rounded-2xl text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/20 transition-all duration-300"
            />
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-4 ml-6">
          {/* Upload Button */}
          <div className="relative">
            <input
              type="file"
              id="file-upload"
              accept="audio/*,video/*"
              onChange={handleFileUpload}
              className="hidden"
              disabled={isProcessing}
            />
            <label
              htmlFor="file-upload"
              className={`inline-flex items-center px-4 py-2.5 text-sm font-medium rounded-2xl border border-white/10 bg-white/10 text-neutral-100 hover:bg-white/15 transition-transform duration-300 hover:scale-105 ${
                isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
              }`}
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Meeting
                </>
              )}
            </label>
          </div>

          {/* New Meeting Button */}
          <button 
            onClick={onNewMeeting}
            className="inline-flex items-center px-4 py-2.5 text-sm font-medium rounded-2xl border border-white/10 bg-gradient-to-r from-white/10 via-neutral-500/10 to-neutral-800/10 text-neutral-100 hover:scale-105 transition-transform duration-300"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Meeting
          </button>

          {/* Notifications */}
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2.5 text-neutral-400 hover:text-neutral-100 glass-button rounded-2xl transition-all duration-300 relative hover:scale-110 hover:shadow-lg"
            >
              <Bell className="w-5 h-5" />
              {notifications.length > 0 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-white text-neutral-900 text-xs rounded-full flex items-center justify-center font-medium">
                  {notifications.length}
                </div>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-neutral-950 rounded-xl shadow-2xl border border-white/10 z-50">
                <div className="p-4 border-b border-white/5">
                  <h3 className="text-lg font-semibold text-neutral-100">
                    Notifications
                  </h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="p-4 border-b border-white/5 hover:bg-white/5 transition-colors duration-200">
                      <div className="flex items-start">
                        <div className="w-2 h-2 rounded-full mt-2 mr-3 bg-white" />
                        <div className="flex-1">
                          <p className="text-sm text-neutral-100">{notification.message}</p>
                          <p className="text-xs text-neutral-500 mt-1">{notification.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-white/5">
                  <button className="w-full text-center text-sm text-neutral-300 hover:text-neutral-100 font-medium">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Dark Mode Toggle */}
          <button 
            onClick={onToggleDarkMode}
            aria-label="Toggle dark mode"
            className="p-2.5 text-neutral-400 hover:text-neutral-100 glass-button rounded-2xl transition-all duration-300 hover:scale-110 hover:shadow-lg"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Profile Menu */}
          <div className="relative">
            <button 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-3 p-2 hover:bg-white/10 rounded-xl transition-colors duration-200"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-neutral-700 via-neutral-500 to-neutral-300 rounded-lg flex items-center justify-center shadow-inner">
                <User className="w-4 h-4 text-neutral-50" />
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-neutral-100">John Doe</p>
                <p className="text-xs text-neutral-500">john@company.com</p>
              </div>
              <ChevronDown className="w-4 h-4 text-neutral-500" />
            </button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-neutral-950 rounded-xl shadow-lg border border-white/10 z-50">
                <div className="p-3 border-b border-white/10">
                  <p className="text-sm font-medium text-neutral-100">John Doe</p>
                  <p className="text-xs text-neutral-500">john@company.com</p>
                </div>
                <div className="py-2">
                  <button className="w-full flex items-center px-4 py-2 text-sm text-neutral-300 hover:bg-white/5 transition-colors duration-200">
                    <Settings className="w-4 h-4 mr-3" />
                    Settings
                  </button>
                  <button className="w-full flex items-center px-4 py-2 text-sm text-neutral-300 hover:bg-white/5 transition-colors duration-200">
                    <HelpCircle className="w-4 h-4 mr-3" />
                    Help & Support
                  </button>
                </div>
                <div className="border-t border-white/10 py-2">
                  <button className="w-full flex items-center px-4 py-2 text-sm text-red-400 hover:bg-white/5 transition-colors duration-200">
                    <LogOut className="w-4 h-4 mr-3" />
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border-t border-red-200 dark:border-red-800 px-6 py-3">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-red-500 rounded-full mr-3" />
            <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
          </div>
        </div>
      )}

      {/* Processing Banner */}
      {isProcessing && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border-t border-blue-200 dark:border-blue-800 px-6 py-3">
          <div className="flex items-center">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-3" />
            <p className="text-sm text-blue-800 dark:text-blue-300">
              {processing.uploading && 'Uploading meeting recording...'}
              {processing.transcribing && 'Transcribing audio with AI...'}
              {processing.extracting && 'Extracting action items...'}
            </p>
          </div>
        </div>
      )}
    </header>
  );
};

export default TopBar;