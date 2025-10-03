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
}

const TopBar: React.FC<TopBarProps> = ({ 
  isDarkMode, 
  onToggleDarkMode,
  onFileSelect,
  processing,
  error 
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
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search meetings, action items, or people..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 glass-button rounded-2xl text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-600/50 focus:border-slate-500/50 focus:glow-primary transition-all duration-300 text-shadow"
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
              className={`btn-primary inline-flex items-center px-4 py-2.5 text-sm font-medium rounded-2xl hover:scale-105 text-shadow ${
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
          <button className="btn-accent inline-flex items-center px-4 py-2.5 text-sm font-medium rounded-2xl hover:scale-105 text-shadow">
            <Plus className="w-4 h-4 mr-2" />
            New Meeting
          </button>

          {/* Notifications */}
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2.5 text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-100 glass-button rounded-2xl transition-all duration-300 relative hover:scale-110 hover:shadow-lg"
            >
              <Bell className="w-5 h-5" />
              {notifications.length > 0 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                  {notifications.length}
                </div>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Notifications
                  </h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                      <div className="flex items-start">
                        <div className={`w-2 h-2 rounded-full mt-2 mr-3 ${
                          notification.type === 'success' ? 'bg-green-500' :
                          notification.type === 'warning' ? 'bg-orange-500' : 'bg-blue-500'
                        }`} />
                        <div className="flex-1">
                          <p className="text-sm text-gray-900 dark:text-white">{notification.message}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notification.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                  <button className="w-full text-center text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Dark Mode Toggle */}
          <button 
            onClick={onToggleDarkMode}
            className="p-2.5 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 glass-button rounded-2xl transition-all duration-300 hover:scale-110 hover:shadow-lg"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Profile Menu */}
          <div className="relative">
            <button 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors duration-200"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-gray-900 dark:text-white">John Doe</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">john@company.com</p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">John Doe</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">john@company.com</p>
                </div>
                <div className="py-2">
                  <button className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                    <Settings className="w-4 h-4 mr-3" />
                    Settings
                  </button>
                  <button className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                    <HelpCircle className="w-4 h-4 mr-3" />
                    Help & Support
                  </button>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 py-2">
                  <button className="w-full flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
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