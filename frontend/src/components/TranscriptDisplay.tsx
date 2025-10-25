import React from 'react';
import { FileText, Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface TranscriptDisplayProps {
  transcript: string;
  filename: string | null;
}

const TranscriptDisplay: React.FC<TranscriptDisplayProps> = ({ transcript, filename }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(transcript);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy transcript:', err);
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
            <h2 className="text-3xl font-extrabold text-[#FFD700] tracking-tight drop-shadow-lg">Meeting Transcript</h2>
            {filename && (
              <p className="text-base text-[#FFFFFF] opacity-80 font-mono">From: {filename}</p>
            )}
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

      <div className="bg-[#1A1A2E]/60 rounded-2xl p-6 max-h-96 overflow-y-auto backdrop-blur-sm border border-[#0F3460]">
        <div className="prose prose-sm max-w-none">
          <p className="text-white leading-relaxed whitespace-pre-wrap text-base tracking-tight">
            {transcript}
          </p>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between text-base text-white font-mono">
        <span>
          {transcript.length.toLocaleString()} characters
        </span>
        <span>
          {Math.ceil(transcript.length / 1000)} words (estimated)
        </span>
      </div>
    </div>
  );
};

export default TranscriptDisplay;
