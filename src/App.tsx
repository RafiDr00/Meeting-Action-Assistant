import React, { useState, useCallback, useMemo } from 'react';
import Navbar from './components/Navbar';
import FileUpload from './components/FileUpload';
import TranscriptDisplay from './components/TranscriptDisplay';
import SummaryDisplay from './components/SummaryDisplay';
import ActionItemsDisplay from './components/ActionItemsDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorBoundary from './components/ErrorBoundary';
import { uploadFile, transcribeFile, extractActionItems, checkHealth } from './services/api';
import { AppState, ProcessingState, ActionItem } from './types';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    file: null,
    filename: null,
    transcript: null,
    analysis: null,
    processing: {
      uploading: false,
      transcribing: false,
      extracting: false,
    },
    error: null,
    approvedItems: new Set(),
  });

  // Memoized processing state checks
  const isProcessing = useMemo(() => 
    state.processing.uploading || state.processing.transcribing || state.processing.extracting,
    [state.processing]
  );

  const hasResults = useMemo(() => 
    state.transcript && state.analysis,
    [state.transcript, state.analysis]
  );

  const updateProcessing = useCallback((updates: Partial<ProcessingState>) => {
    setState(prev => ({
      ...prev,
      processing: { ...prev.processing, ...updates }
    }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error }));
  }, []);

  const handleFileSelect = useCallback(async (file: File) => {
    try {
      setError(null);
      updateProcessing({ uploading: true });

      console.log('📁 File selected:', file.name, file.size);

      // Validate file size (100MB limit)
      const maxSize = 100 * 1024 * 1024; // 100MB
      if (file.size > maxSize) {
        throw new Error('File size exceeds 100MB limit');
      }

      // Upload file
      const uploadResponse = await uploadFile(file);
      
      if (!uploadResponse.success || !uploadResponse.filename) {
        throw new Error(uploadResponse.error || 'Upload failed');
      }

      console.log('✅ File uploaded:', uploadResponse.filename);

      setState(prev => ({
        ...prev,
        file,
        filename: uploadResponse.filename!,
      }));

      updateProcessing({ uploading: false, transcribing: true });

      // Transcribe file
      const transcribeResponse = await transcribeFile(uploadResponse.filename);
      
      if (!transcribeResponse.success || !transcribeResponse.transcript) {
        throw new Error(transcribeResponse.error || 'Transcription failed');
      }

      console.log('✅ Transcription completed');

      setState(prev => ({
        ...prev,
        transcript: transcribeResponse.transcript!,
      }));

      updateProcessing({ transcribing: false, extracting: true });

      // Extract action items
      const extractResponse = await extractActionItems(transcribeResponse.transcript);
      
      if (!extractResponse.success || !extractResponse.data) {
        throw new Error(extractResponse.error || 'Action item extraction failed');
      }

      console.log('✅ Action items extracted:', extractResponse.data.action_items.length);

      setState(prev => ({
        ...prev,
        analysis: extractResponse.data!,
      }));

      updateProcessing({ extracting: false });

    } catch (error) {
      console.error('❌ Processing error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setError(errorMessage);
      updateProcessing({ uploading: false, transcribing: false, extracting: false });
    }
  }, [updateProcessing, setError]);

  const handleToggleApproval = useCallback((id: number) => {
    setState(prev => {
      const newApprovedItems = new Set(prev.approvedItems);
      if (newApprovedItems.has(id)) {
        newApprovedItems.delete(id);
      } else {
        newApprovedItems.add(id);
      }
      return { ...prev, approvedItems: newApprovedItems };
    });
  }, []);

  const handleReset = useCallback(() => {
    setState({
      file: null,
      filename: null,
      transcript: null,
      analysis: null,
      processing: {
        uploading: false,
        transcribing: false,
        extracting: false,
      },
      error: null,
      approvedItems: new Set(),
    });
  }, []);

  // Memoized loading message
  const loadingMessage = useMemo(() => {
    if (state.processing.uploading) return 'Uploading your file...';
    if (state.processing.transcribing) return 'Transcribing audio...';
    if (state.processing.extracting) return 'Extracting action items...';
    return 'Processing...';
  }, [state.processing]);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Transform Your Meetings into Action
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Upload your meeting recording and get AI-powered transcription, 
              intelligent summaries, and actionable items automatically extracted.
            </p>
          </div>

          {/* Main Content */}
          <div className="space-y-8">
            {/* File Upload */}
            <FileUpload
              onFileSelect={handleFileSelect}
              processing={state.processing}
              error={state.error}
            />

            {/* Processing States */}
            {isProcessing && (
              <div className="card">
                <LoadingSpinner
                  message={loadingMessage}
                  size="lg"
                />
              </div>
            )}

            {/* Results */}
            {hasResults && (
              <div className="space-y-8">
                {/* Summary */}
                <SummaryDisplay summary={state.analysis!.summary} />

                {/* Transcript */}
                <TranscriptDisplay 
                  transcript={state.transcript!} 
                  filename={state.filename}
                />

                {/* Action Items */}
                <ActionItemsDisplay
                  actionItems={state.analysis!.action_items}
                  approvedItems={state.approvedItems}
                  onToggleApproval={handleToggleApproval}
                />

                {/* Reset Button */}
                <div className="text-center">
                  <button
                    onClick={handleReset}
                    className="btn-secondary"
                  >
                    Process Another Meeting
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <footer className="mt-16 pt-8 border-t border-gray-200">
            <div className="text-center text-gray-500">
              <p className="mb-2">
                Meeting Action Assistant • Powered by OpenAI Whisper & GPT-4
              </p>
              <p className="text-sm">
                Your files are processed securely and deleted after analysis
              </p>
            </div>
          </footer>
        </main>
      </div>
    </ErrorBoundary>
  );
};

export default App;