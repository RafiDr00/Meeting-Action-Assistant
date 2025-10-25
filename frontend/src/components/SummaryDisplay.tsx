import React from 'react';
import { FileText, Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface SummaryDisplayProps {
  summary: string;
}

const SummaryDisplay: React.FC<SummaryDisplayProps> = ({ summary }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy summary:', err);
    }
  };

  return (
    <div className="card animate-fade-in bg-gradient-to-br from-[#1A1A2E] via-[#0F3460] to-[#E94560] p-8 rounded-3xl shadow-2xl font-['Sora','Space Grotesk',sans-serif]">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-tr from-[#FFD700] to-[#E94560] rounded-2xl flex items-center justify-center shadow-lg">
            <FileText className="w-7 h-7 text-[#1A1A2E] animate-bounce" />
          </div>
          <div>
            <h2 className="text-3xl font-extrabold text-[#FFD700] tracking-tight drop-shadow-lg">Meeting Summary</h2>
            <p className="text-base text-[#FFFFFF] opacity-80 font-mono">AI-generated overview</p>
          </div>
        </div>
        
        <button
          onClick={handleCopy}
          className="flex items-center space-x-2 px-4 py-2 text-base font-semibold text-[#1A1A2E] bg-[#FFD700] hover:bg-[#E94560] hover:text-white rounded-xl shadow transition-all duration-200"
        >
          {copied ? (
            <>
              <Check className="w-5 h-5 animate-pulse text-[#0F3460]" />
              <span className="text-[#0F3460]">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-5 h-5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      <div className="bg-gradient-to-r from-[#FFD700]/20 to-[#E94560]/10 rounded-2xl p-6 border-l-4 border-[#FFD700]">
        <div className="prose prose-sm max-w-none">
          <p className="text-white leading-relaxed text-lg font-semibold tracking-tight">
            {summary}
          </p>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between text-base text-white font-mono">
        <span>
          {summary.length.toLocaleString()} characters
        </span>
        <span className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-[#FFD700] rounded-full animate-pulse"></div>
          <span>AI Generated</span>
        </span>
      </div>
    </div>
  );
};

export default SummaryDisplay;
