// Type definitions for the frontend

export interface ActionItem {
  id: number;
  task: string;
  owner: string;
  due: string;
  status: 'pending' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high';
  confidence: number;
}

export interface Meeting {
  id: string;
  title: string;
  date: string;
  duration: number;
  participants: string[];
  summary: string;
  transcript?: string;
  actionItems: ActionItem[];
  confidence: number;
  tags: string[];
  status: 'processing' | 'completed' | 'error';
}

export interface MeetingAnalysis {
  summary: string;
  action_items: ActionItem[];
}

export interface TranscriptionResponse {
  success: boolean;
  transcript?: string;
  error?: string;
}

export interface ExtractionResponse {
  success: boolean;
  data?: MeetingAnalysis;
  error?: string;
}

export interface UploadResponse {
  success: boolean;
  filename?: string;
  error?: string;
}

export interface ProcessingState {
  uploading: boolean;
  transcribing: boolean;
  extracting: boolean;
}

export interface AppState {
  file: File | null;
  filename: string | null;
  transcript: string | null;
  analysis: MeetingAnalysis | null;
  processing: ProcessingState;
  error: string | null;
  approvedItems: Set<number>;
}
