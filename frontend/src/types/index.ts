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
  metadata?: {
    size?: number;
    type?: string;
    uploadTime?: string;
  };
}

export interface ProcessingState {
  uploading: boolean;
  transcribing: boolean;
  extracting: boolean;
  progress?: number;
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

export interface HealthStatus {
  status: string;
  timestamp?: string;
  version?: string;
  environment?: string;
  uptime?: string;
}

// Type guards for runtime validation
export const isActionItem = (item: any): item is ActionItem => {
  return (
    typeof item === 'object' &&
    item !== null &&
    typeof item.id === 'number' &&
    typeof item.task === 'string' &&
    typeof item.owner === 'string' &&
    typeof item.due === 'string'
  );
};

export const isMeetingAnalysis = (data: any): data is MeetingAnalysis => {
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof data.summary === 'string' &&
    Array.isArray(data.action_items) &&
    data.action_items.every(isActionItem)
  );
};

export const isUploadResponse = (data: any): data is UploadResponse => {
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof data.success === 'boolean' &&
    (data.filename === undefined || typeof data.filename === 'string') &&
    (data.error === undefined || typeof data.error === 'string')
  );
};

export const isTranscriptionResponse = (data: any): data is TranscriptionResponse => {
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof data.success === 'boolean' &&
    (data.transcript === undefined || typeof data.transcript === 'string') &&
    (data.error === undefined || typeof data.error === 'string')
  );
};

export const isExtractionResponse = (data: any): data is ExtractionResponse => {
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof data.success === 'boolean' &&
    (data.data === undefined || isMeetingAnalysis(data.data)) &&
    (data.error === undefined || typeof data.error === 'string')
  );
};
