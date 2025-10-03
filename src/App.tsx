import React, { useState, useCallback, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import MeetingList from './components/MeetingList';
import MeetingDetail from './components/MeetingDetail';
import DashboardOverview from './components/DashboardOverview';
import ErrorBoundary from './components/ErrorBoundary';
import { uploadFile, transcribeFile, extractActionItems } from './services/api';
import { AppState, ProcessingState, Meeting } from './types';

type ViewType = 'dashboard' | 'meetings' | 'clients' | 'teams' | 'settings';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [meetings, setMeetings] = useState<Meeting[]>([
    {
      id: '1',
      title: 'Q4 Planning Session',
      date: '2024-01-15T10:00:00Z',
      duration: 45,
      participants: ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson'],
      summary: 'Quarterly planning and goal setting meeting',
      transcript: 'This is a sample transcript of the quarterly planning meeting...',
      actionItems: [
        {
          id: 1,
          task: 'Prepare budget proposal for Q4',
          owner: 'John Doe',
          due: '2024-01-22',
          status: 'pending',
          priority: 'high',
          confidence: 0.95
        },
        {
          id: 2,
          task: 'Schedule team retrospective',
          owner: 'Jane Smith',
          due: '2024-01-20',
          status: 'completed',
          priority: 'medium',
          confidence: 0.88
        }
      ],
      confidence: 0.92,
      tags: ['planning', 'quarterly'],
      status: 'completed'
    },
    {
      id: '2',
      title: 'Product Launch Review',
      date: '2024-01-12T14:30:00Z',
      duration: 60,
      participants: ['Alice Brown', 'Bob Taylor', 'Carol Davis'],
      summary: 'Review of recent product launch metrics and feedback',
      transcript: 'Product launch discussion transcript...',
      actionItems: [
        {
          id: 3,
          task: 'Analyze user feedback from launch week',
          owner: 'Alice Brown',
          due: '2024-01-18',
          status: 'overdue',
          priority: 'high',
          confidence: 0.91
        },
        {
          id: 4,
          task: 'Create marketing campaign adjustments',
          owner: 'Bob Taylor',
          due: '2024-01-25',
          status: 'pending',
          priority: 'medium',
          confidence: 0.87
        }
      ],
      confidence: 0.89,
      tags: ['product', 'launch', 'review'],
      status: 'completed'
    }
  ]);
  const [isDarkMode, setIsDarkMode] = useState(false);
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

  const updateProcessing = useCallback((updates: Partial<ProcessingState>) => {
    setState(prev => ({
      ...prev,
      processing: { ...prev.processing, ...updates }
    }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error }));
  }, []);

  const handleMeetingSelect = (meetingId: string) => {
    const meeting = meetings.find(m => m.id === meetingId);
    setSelectedMeeting(meeting || null);
  };

  const handleUpdateActionItem = useCallback((itemId: string, updates: Partial<any>) => {
    setMeetings(prevMeetings => 
      prevMeetings.map(meeting => ({
        ...meeting,
        actionItems: meeting.actionItems.map(item => 
          item.id.toString() === itemId ? { ...item, ...updates } : item
        )
      }))
    );
    
    // Update selected meeting if it's currently selected
    if (selectedMeeting) {
      setSelectedMeeting(prev => prev ? {
        ...prev,
        actionItems: prev.actionItems.map(item => 
          item.id.toString() === itemId ? { ...item, ...updates } : item
        )
      } : null);
    }
  }, [selectedMeeting]);

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
      <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
        {/* Corporate Background */}
        <div className={`fixed inset-0 ${
          isDarkMode 
            ? 'corporate-gradient-bg-dark' 
            : 'corporate-gradient-bg'
        }`} />
        
        {/* Subtle overlay for depth */}
        <div className="fixed inset-0 bg-gradient-to-br from-slate-50/10 via-transparent to-slate-900/5 backdrop-blur-[0.5px]" />
        
        <div className="relative flex h-screen overflow-hidden">
          {/* Sidebar */}
          <Sidebar 
            currentView={currentView} 
            onViewChange={setCurrentView}
            isDarkMode={isDarkMode}
          />
          
          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Top Bar */}
            <TopBar 
              isDarkMode={isDarkMode}
              onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
              onFileSelect={handleFileSelect}
              processing={state.processing}
              error={state.error}
            />
            
            {/* Content Area */}
            <div className="flex-1 flex overflow-hidden">
              {/* Main Panel */}
              <div className="flex-1 overflow-auto">
                {currentView === 'dashboard' && (
                  <DashboardOverview 
                    meetings={meetings} 
                    onViewChange={setCurrentView}
                  />
                )}
                
                {currentView === 'meetings' && (
                  <MeetingList 
                    meetings={meetings}
                    selectedMeetingId={selectedMeeting?.id || null}
                    onMeetingSelect={handleMeetingSelect}
                    viewType={currentView}
                  />
                )}
                
                {currentView === 'clients' && (
                  <div className="p-8">
                    <div className="max-w-4xl mx-auto">
                      <h2 className="text-3xl font-bold text-[#111827] dark:text-white mb-2">
                        Clients
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400 text-lg">
                        Client management dashboard coming soon...
                      </p>
                      <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <div className="text-center py-12">
                          <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">👥</span>
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            Client Dashboard
                          </h3>
                          <p className="text-gray-500 dark:text-gray-400">
                            Manage client relationships and meeting history
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {currentView === 'teams' && (
                  <div className="p-8">
                    <div className="max-w-4xl mx-auto">
                      <h2 className="text-3xl font-bold text-[#111827] dark:text-white mb-2">
                        Teams
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400 text-lg">
                        Team collaboration and task management coming soon...
                      </p>
                      <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <div className="text-center py-12">
                          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">🚀</span>
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            Team Workspace
                          </h3>
                          <p className="text-gray-500 dark:text-gray-400">
                            Collaborate on action items and track team progress
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {currentView === 'settings' && (
                  <div className="p-8">
                    <div className="max-w-4xl mx-auto">
                      <h2 className="text-3xl font-bold text-[#111827] dark:text-white mb-2">
                        Settings
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400 text-lg">
                        Configure your Meeting AI preferences
                      </p>
                      <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <div className="text-center py-12">
                          <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">⚙️</span>
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            Application Settings
                          </h3>
                          <p className="text-gray-500 dark:text-gray-400">
                            Customize AI behavior, notifications, and integrations
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Detail Panel - Only show when meeting is selected */}
              {selectedMeeting && (
                <MeetingDetail 
                  meeting={selectedMeeting}
                  transcript={state.transcript || ''}
                  onClose={() => setSelectedMeeting(null)}
                  onUpdateActionItem={handleUpdateActionItem}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default App;