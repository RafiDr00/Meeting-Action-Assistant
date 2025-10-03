import React from 'react';
import { Mic, Sparkles } from 'lucide-react';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-primary-600 rounded-lg">
              <Mic className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Meeting Action Assistant
              </h1>
              <p className="text-sm text-gray-500">
                AI-powered meeting insights
              </p>
            </div>
          </div>
          
          {/* Right side - Status indicator */}
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-primary-600" />
            <span className="text-sm font-medium text-gray-700">
              Powered by OpenAI
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
