// Type definitions for the frontend

export interface ActionItem {
  id: number;
  task: string;
  owner: string;
  due: string;
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
