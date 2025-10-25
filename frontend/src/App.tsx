import React, { useState, useCallback } from 'react';
import Hero3D from './components/Hero3D';
import UnusualFrontier from './components/UnusualFrontier';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import TopBar from './components/TopBar';
import MeetingList from './components/MeetingList';
import MeetingDetail from './components/MeetingDetail';
import DashboardOverview from './components/DashboardOverview';
import ErrorBoundary from './components/ErrorBoundary';
import { MeetingWorkflow } from './components/MeetingWorkflow';
import { uploadFile, transcribeFile, extractActionItems } from './services/api';
import { AppState, ProcessingState, Meeting } from './types';

type ViewType = 'dashboard' | 'meetings' | 'clients' | 'teams' | 'settings';

const App: React.FC = () => {
  const [showUnusualFrontier, setShowUnusualFrontier] = useState(true);
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [showNewMeetingWorkflow, setShowNewMeetingWorkflow] = useState(false);
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

  // Removed unused isProcessing variable

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

  const handleMeetingWorkflowComplete = useCallback((results: {
    transcript: string;
    actionItems: any[];
    filename: string;
  }) => {
    // Create new meeting from workflow results
    const newMeeting: Meeting = {
      id: Date.now().toString(),
      title: `Meeting - ${results.filename}`,
      date: new Date().toISOString(),
      duration: 0, // Could be calculated from audio duration
      participants: [], // Could be extracted from transcript
      summary: results.transcript.substring(0, 200) + '...',
      transcript: results.transcript,
      actionItems: results.actionItems.map((item, index) => ({
        id: Date.now() + index,
        task: item.task || item,
        owner: item.owner || 'TBD',
        due: item.due || 'TBD',
        status: 'pending' as const,
        priority: item.priority || 'medium' as const,
        confidence: item.confidence || 0.85
      })),
      confidence: 0.85,
      tags: ['new'],
      status: 'completed' as const
    };

    setMeetings(prev => [newMeeting, ...prev]);
    setShowNewMeetingWorkflow(false);
    setCurrentView('meetings');
    setSelectedMeeting(newMeeting);
  }, []);

  const handleFileSelect = useCallback(async (file: File) => {
    try {
      setError(null);
      updateProcessing({ uploading: true, progress: 0 });

  // Removed console.log for production

      // Validate file size (100MB limit)
      const maxSize = 100 * 1024 * 1024; // 100MB
      if (file.size > maxSize) {
        throw new Error('File size exceeds 100MB limit');
      }

      // Upload file with progress tracking
      const uploadResponse = await uploadFile(file, (progress) => {
        updateProcessing({ progress });
      });
      
      if (!uploadResponse.success || !uploadResponse.filename) {
        throw new Error(uploadResponse.error || 'Upload failed');
      }

  // Removed console.log for production

      setState(prev => ({
        ...prev,
        file,
        filename: uploadResponse.filename!,
      }));

      updateProcessing({ uploading: false, transcribing: true, progress: 0 });

      // Transcribe file
      const transcribeResponse = await transcribeFile(uploadResponse.filename);
      
      if (!transcribeResponse.success || !transcribeResponse.transcript) {
        throw new Error(transcribeResponse.error || 'Transcription failed');
      }

  // Removed console.log for production

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

  // Removed console.log for production

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

  // Removed unused handleToggleApproval function

  // Removed unused handleReset function

  // Removed unused loadingMessage function

  return (
    <ErrorBoundary>
      {showUnusualFrontier ? (
        <UnusualFrontier onEnterApp={() => setShowUnusualFrontier(false)} />
      ) : (
      <div className={`min-h-screen ${isDarkMode ? 'dark' : ''} relative overflow-hidden bg-neutral-950 text-neutral-100`}> 
        <Hero3D />
        <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.08),transparent_55%),radial-gradient(circle_at_80%_10%,rgba(148,163,184,0.07),transparent_60%)]" />
        {/* Spectacular Background Effects */}
        <div className="floating-orb-1"></div>
        <div className="floating-orb-2"></div>
        <div className="floating-orb-3"></div>
        <div className="floating-orb-4"></div>
        
        {/* Advanced Particle System */}
        <div className="particles">
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
        </div>
        
        {/* Energy Streams */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="energy-trail absolute left-1/4 top-0 opacity-20"></div>
          <div className="energy-trail absolute right-1/3 top-0 opacity-15" style={{animationDelay: '1s'}}></div>
          <div className="energy-trail absolute left-2/3 top-0 opacity-25" style={{animationDelay: '2s'}}></div>
        </div>
        
        {/* Cinematic Light Beams */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div 
            className="absolute top-1/4 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-400/20 to-transparent blur-sm animate-shimmer"
            style={{animationDuration: '4s'}}
          ></div>
          <div 
            className="absolute bottom-1/3 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-400/20 to-transparent blur-sm animate-shimmer"
            style={{animationDuration: '6s', animationDelay: '2s'}}
          ></div>
        </div>
        
        {/* Dynamic Grid Background */}
        <div 
          className="fixed inset-0 opacity-30"
          style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, rgba(37, 99, 235, 0.05) 0%, transparent 25%),
              radial-gradient(circle at 75% 75%, rgba(139, 92, 246, 0.05) 0%, transparent 25%),
              linear-gradient(90deg, rgba(226, 232, 240, 0.3) 1px, transparent 1px),
              linear-gradient(rgba(226, 232, 240, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '600px 600px, 600px 600px, 50px 50px, 50px 50px'
          }}
        />
        
        <div className="relative flex min-h-screen overflow-auto z-10">
          {/* Sidebar */}
          <Sidebar 
            currentView={currentView} 
            onViewChange={setCurrentView}
            isDarkMode={isDarkMode}
          />
          
          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-auto">
            {/* Navbar */}
            <Navbar />
            
            {/* Top Bar */}
            <TopBar 
              isDarkMode={isDarkMode}
              onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
              onFileSelect={handleFileSelect}
              processing={state.processing}
              error={state.error}
              onNewMeeting={() => setShowNewMeetingWorkflow(true)}
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
                      <h2 className="text-4xl font-extrabold text-[#FFD700] mb-3 tracking-tight drop-shadow-lg">
                        Clients
                      </h2>
                      <p className="text-white text-lg font-mono opacity-90">
                        Client management dashboard coming soon...
                      </p>
                      <div className="mt-8 bg-gradient-to-br from-[#1A1A2E] via-[#0F3460] to-[#E94560] rounded-3xl shadow-2xl border-2 border-[#FFD700] p-8">
                        <div className="text-center py-12">
                          <div className="w-20 h-20 bg-gradient-to-tr from-[#FFD700] to-[#E94560] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                            <span className="text-4xl">👥</span>
                          </div>
                          <h3 className="text-2xl font-bold text-[#FFD700] mb-3">
                            Client Dashboard
                          </h3>
                          <p className="text-white font-mono">
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
                      <h2 className="text-4xl font-extrabold text-[#FFD700] mb-3 tracking-tight drop-shadow-lg">
                        Teams
                      </h2>
                      <p className="text-white text-lg font-mono opacity-90">
                        Team collaboration and task management coming soon...
                      </p>
                      <div className="mt-8 bg-gradient-to-br from-[#1A1A2E] via-[#0F3460] to-[#E94560] rounded-3xl shadow-2xl border-2 border-[#FFD700] p-8">
                        <div className="text-center py-12">
                          <div className="w-20 h-20 bg-gradient-to-tr from-[#FFD700] to-[#E94560] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                            <span className="text-4xl">🚀</span>
                          </div>
                          <h3 className="text-2xl font-bold text-[#FFD700] mb-3">
                            Team Workspace
                          </h3>
                          <p className="text-white font-mono">
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
                      <h2 className="text-4xl font-extrabold text-[#FFD700] mb-3 tracking-tight drop-shadow-lg">
                        Settings
                      </h2>
                      <p className="text-white text-lg font-mono opacity-90">
                        Configure your Meeting AI preferences
                      </p>
                      <div className="mt-8 bg-gradient-to-br from-[#1A1A2E] via-[#0F3460] to-[#E94560] rounded-3xl shadow-2xl border-2 border-[#FFD700] p-8">
                        <div className="text-center py-12">
                          <div className="w-20 h-20 bg-gradient-to-tr from-[#FFD700] to-[#E94560] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                            <span className="text-4xl">⚙️</span>
                          </div>
                          <h3 className="text-2xl font-bold text-[#FFD700] mb-3">
                            Application Settings
                          </h3>
                          <p className="text-white font-mono">
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
        
        {/* Meeting Workflow Modal */}
        {showNewMeetingWorkflow && (
          <MeetingWorkflow
            onComplete={handleMeetingWorkflowComplete}
            onClose={() => setShowNewMeetingWorkflow(false)}
            isDarkMode={isDarkMode}
          />
        )}
      </div>
      )}
    </ErrorBoundary>
  );
};

export default App;