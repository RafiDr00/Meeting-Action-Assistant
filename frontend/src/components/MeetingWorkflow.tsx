import React, { useState, useCallback } from 'react';
import { 
  Upload, 
  FileAudio, 
  Loader2, 
  CheckCircle, 
  AlertCircle, 
  X
} from 'lucide-react';
import { uploadFile, transcribeFile, extractActionItems } from '../services/api';
import type { UploadResponse, TranscriptionResponse, ExtractionResponse } from '../types';

interface MeetingWorkflowProps {
  onComplete?: (results: {
    transcript: string;
    actionItems: any[];
    filename: string;
  }) => void;
  onClose?: () => void;
  isDarkMode?: boolean;
}

export const MeetingWorkflow: React.FC<MeetingWorkflowProps> = ({ 
  onComplete, 
  onClose,
  isDarkMode = false 
}) => {
  const [currentStep, setCurrentStep] = useState<'upload' | 'transcribe' | 'extract' | 'complete'>('upload');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<{
    filename?: string;
    transcript?: string;
    actionItems?: any[];
  }>({});

  const handleFileUpload = useCallback(async (file: File) => {
    setIsProcessing(true);
    setError(null);
    setProgress(0);

    try {
      // Step 1: Upload file
      setCurrentStep('upload');
      setProgress(25);
      const uploadResponse: UploadResponse = await uploadFile(file);
      
      if (!uploadResponse.success || !uploadResponse.filename) {
        throw new Error(uploadResponse.error || 'Upload failed');
      }

      // Step 2: Transcribe
      setCurrentStep('transcribe');
      setProgress(50);
      const transcriptionResponse: TranscriptionResponse = await transcribeFile(uploadResponse.filename);
      
      if (!transcriptionResponse.success || !transcriptionResponse.transcript) {
        throw new Error(transcriptionResponse.error || 'Transcription failed');
      }

      // Step 3: Extract action items
      setCurrentStep('extract');
      setProgress(75);
      const extractionResponse: ExtractionResponse = await extractActionItems(transcriptionResponse.transcript);
      
      if (!extractionResponse.success || !extractionResponse.data) {
        throw new Error(extractionResponse.error || 'Action item extraction failed');
      }

      // Step 4: Complete
      setCurrentStep('complete');
      setProgress(100);
      
      const finalResults = {
        filename: uploadResponse.filename,
        transcript: transcriptionResponse.transcript,
        actionItems: extractionResponse.data.action_items || []
      };
      
      setResults(finalResults);
      onComplete?.(finalResults);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setCurrentStep('upload');
      setProgress(0);
    } finally {
      setIsProcessing(false);
    }
  }, [onComplete]);

  const handleReset = () => {
    setCurrentStep('upload');
    setIsProcessing(false);
    setError(null);
    setProgress(0);
    setResults({});
  };

  const steps = [
    { key: 'upload', label: 'Upload', description: 'Upload your meeting recording' },
    { key: 'transcribe', label: 'Transcribe', description: 'Converting speech to text' },
    { key: 'extract', label: 'Extract', description: 'Identifying action items' },
    { key: 'complete', label: 'Complete', description: 'Processing finished' }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-panel w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white text-shadow">New Meeting Processing</h2>
            <p className="text-slate-600 dark:text-slate-400 mt-1">Upload and process your meeting recording</p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 glass-button rounded-xl transition-all duration-200 hover:scale-110"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="p-6 space-y-8">
          {/* Progress Bar */}
          <div className="space-y-3">
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-500 ease-out shadow-lg"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
          </div>

          {/* Status Steps */}
          <div className="grid grid-cols-4 gap-4">
            {steps.map((step, index) => {
              const isActive = currentStep === step.key;
              const isCompleted = progress > (index * 25);
              const isStepProcessing = isActive && isProcessing;
              
              return (
                <div key={step.key} className="text-center">
                  <div className={`
                    w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-medium mx-auto mb-2 transition-all duration-300
                    ${isStepProcessing ? 'glass-button animate-pulse border-indigo-500/50' : ''}
                    ${isCompleted ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg' : 
                      isActive ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg' : 
                      'glass-button text-slate-600 dark:text-slate-400'}
                  `}>
                    {isCompleted ? (
                      <CheckCircle size={20} />
                    ) : isStepProcessing ? (
                      <Loader2 size={20} className="animate-spin" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <h3 className="font-medium text-slate-900 dark:text-white text-sm">{step.label}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{step.description}</p>
                </div>
              );
            })}
          </div>

          {/* File Upload Area */}
          {currentStep === 'upload' && !isProcessing && (
            <FileUploadZone onFileSelect={handleFileUpload} disabled={isProcessing} isDarkMode={isDarkMode} />
          )}

          {/* Processing Status */}
          {isProcessing && (
            <div className="text-center py-12">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <Loader2 className="animate-spin h-8 w-8 text-white" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full opacity-20 animate-ping" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                {currentStep === 'upload' && 'Uploading file...'}
                {currentStep === 'transcribe' && 'Transcribing audio...'}
                {currentStep === 'extract' && 'Extracting action items...'}
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                This may take a few moments depending on file size
              </p>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="glass-panel bg-red-50/10 border border-red-200/20 rounded-2xl p-6">
              <div className="flex items-start">
                <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-red-800 dark:text-red-200 font-semibold mb-1">Processing Error</h3>
                  <p className="text-red-700 dark:text-red-300 mb-4">{error}</p>
                  <button
                    onClick={handleReset}
                    className="btn-primary text-sm px-4 py-2 rounded-xl"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Results Display */}
          {currentStep === 'complete' && results.transcript && (
            <MeetingResults
              transcript={results.transcript}
              actionItems={results.actionItems || []}
              filename={results.filename || ''}
              onStartNew={handleReset}
              isDarkMode={isDarkMode}
            />
          )}
        </div>
      </div>
    </div>
  );
};

// File Upload Component
const FileUploadZone: React.FC<{
  onFileSelect: (file: File) => void;
  disabled: boolean;
  isDarkMode: boolean;
}> = ({ onFileSelect, disabled }) => {
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const audioFile = files.find(file => 
      file.type.startsWith('audio/') || file.type.startsWith('video/')
    );
    
    if (audioFile) {
      onFileSelect(audioFile);
    }
  }, [onFileSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  }, [onFileSelect]);

  return (
    <div
      className={`
        glass-panel border-2 border-dashed rounded-3xl p-12 text-center transition-all duration-300
        ${dragOver ? 'border-indigo-400 bg-indigo-50/10 scale-[1.02]' : 'border-slate-300 dark:border-slate-600'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/5'}
      `}
      onDrop={handleDrop}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
    >
      <div className="space-y-6">
        <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto shadow-xl">
          <Upload className="h-10 w-10 text-white" />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Upload Meeting Recording</h3>
          <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
            Drag and drop your audio or video file here, or click to browse. Supported formats: MP3, MP4, WAV, M4A
          </p>
        </div>

        <input
          type="file"
          accept="audio/*,video/*"
          onChange={handleFileInput}
          disabled={disabled}
          className="hidden"
          id="file-upload-workflow"
        />
        <label
          htmlFor="file-upload-workflow"
          className={`
            btn-primary inline-flex items-center px-6 py-3 text-sm font-medium rounded-2xl shadow-lg
            ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:scale-105'}
          `}
        >
          <FileAudio className="h-5 w-5 mr-2" />
          Choose File
        </label>

        <p className="text-xs text-slate-500 dark:text-slate-400">
          Maximum file size: 100MB
        </p>
      </div>
    </div>
  );
};

// Results Display Component
const MeetingResults: React.FC<{
  transcript: string;
  actionItems: any[];
  filename: string;
  onStartNew: () => void;
  isDarkMode: boolean;
}> = ({ transcript, actionItems, filename, onStartNew }) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'transcript'>('summary');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Processing Complete!</h3>
          <p className="text-slate-600 dark:text-slate-400 mt-1">File: {filename}</p>
        </div>
        <button
          onClick={onStartNew}
          className="btn-accent px-6 py-3 text-sm font-medium rounded-2xl shadow-lg hover:scale-105"
        >
          Process Another Meeting
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-slate-100 dark:bg-slate-800 rounded-2xl p-1">
        <button
          onClick={() => setActiveTab('summary')}
          className={`
            flex-1 px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200
            ${activeTab === 'summary' 
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' 
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }
          `}
        >
          Action Items ({actionItems.length})
        </button>
        <button
          onClick={() => setActiveTab('transcript')}
          className={`
            flex-1 px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200
            ${activeTab === 'transcript' 
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' 
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }
          `}
        >
          Full Transcript
        </button>
      </div>

      {/* Content */}
      {activeTab === 'summary' && (
        <div className="glass-panel rounded-2xl p-6">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mr-3">
              <CheckCircle className="h-5 w-5 text-white" />
            </div>
            <h4 className="text-lg font-semibold text-slate-900 dark:text-white">
              Extracted Action Items
            </h4>
          </div>
          
          {actionItems.length > 0 ? (
            <div className="space-y-4">
              {actionItems.map((item, index) => (
                <div key={index} className="glass-button rounded-2xl p-4 hover:shadow-lg transition-all duration-200">
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center text-sm font-semibold mr-4 flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-slate-900 dark:text-white font-medium mb-2">{item.task}</p>
                      <div className="flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-400">
                        <span><strong>Owner:</strong> {item.owner}</span>
                        <span><strong>Due:</strong> {item.due}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-slate-400" />
              </div>
              <p className="text-slate-500 dark:text-slate-400">No action items identified in this meeting.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'transcript' && (
        <div className="glass-panel rounded-2xl p-6">
          <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Full Transcript</h4>
          <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-6 max-h-96 overflow-y-auto">
            <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">{transcript}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MeetingWorkflow;
