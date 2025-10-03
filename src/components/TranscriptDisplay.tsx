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
    <div className="card animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <FileText className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Meeting Transcript</h2>
            {filename && (
              <p className="text-sm text-gray-500">From: {filename}</p>
            )}
          </div>
        </div>
        
        <button
          onClick={handleCopy}
          className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-success-600" />
              <span className="text-success-600">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
        <div className="prose prose-sm max-w-none">
          <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
            {transcript}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
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
