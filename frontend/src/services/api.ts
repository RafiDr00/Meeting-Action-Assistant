import axios from 'axios';
import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { 
  UploadResponse, 
  TranscriptionResponse, 
  ExtractionResponse,
  isTranscriptionResponse as isTranscriptionResponseType,
  isExtractionResponse as isExtractionResponseType
} from '../types';

// Custom API Error class for better error handling
export class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public data?: any
  ) {
    super(message);
    this.name = 'APIError';
  }
}

// Environment configuration with fallback
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 300000, // 5 minutes timeout for long operations
  headers: {
    'Content-Type': 'application/json',
  },
});

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

// Utility function for retrying requests
const retryRequest = async <T>(
  requestFn: () => Promise<T>,
  retries: number = MAX_RETRIES
): Promise<T> => {
  try {
    return await requestFn();
  } catch (error) {
    if (retries > 0 && axios.isAxiosError(error)) {
      const status = (error as any).response?.status;
      // Retry on network errors or 5xx server errors
      if (!status || status >= 500) {
  // Removed console.log for production
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        return retryRequest(requestFn, retries - 1);
      }
    }
    throw error;
  }
};

// Request interceptor for logging and error handling
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Removed console.log for production
    return config;
  },
  (error: unknown) => {
    if (error instanceof Error) {
      console.error('❌ API Request Error:', error);
    }
    return Promise.reject(error);
  }
);

// Response interceptor for logging and error handling
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Removed console.log for production
    return response;
  },
  (error: unknown) => {
    if (axios.isAxiosError(error)) {
      console.error('❌ API Response Error:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url,
      });
      // Transform error for better user experience
      if (error.response?.status === 413) {
        (error as any).message = 'File too large. Please upload a file smaller than 100MB.';
      } else if (error.response?.status === 415) {
        (error as any).message = 'Unsupported file type. Please upload an audio or video file.';
      } else if (error.code === 'ECONNABORTED') {
        (error as any).message = 'Request timeout. Please try again with a smaller file.';
      } else if (!error.response) {
        (error as any).message = 'Network error. Please check your connection and try again.';
      }
    }
    return Promise.reject(error);
  }
);

/**
 * Upload file to the server with progress tracking
 * @param file - The file to upload
 * @param onProgress - Optional callback for upload progress
 * @returns Promise with upload response
 */
export const uploadFile = async (
  file: File,
  onProgress?: (progress: number) => void
): Promise<UploadResponse> => {
  // Validate file before upload
  const maxSize = 100 * 1024 * 1024; // 100MB
  if (file.size > maxSize) {
    throw new APIError(
      `File too large. Maximum size is ${maxSize / (1024 * 1024)}MB`,
      413
    );
  }

  const allowedTypes = [
    'audio/mpeg', 'audio/wav', 'audio/m4a', 'audio/aac',
    'video/mp4', 'video/avi', 'video/quicktime', 'video/x-ms-wmv', 'video/webm'
  ];
  
  if (!allowedTypes.some(type => file.type.startsWith(type.split('/')[0]))) {
    throw new APIError(
      'Unsupported file type. Please upload an audio or video file.',
      415
    );
  }

  const formData = new FormData();
  formData.append('file', file);
  
  const response = await retryRequest<AxiosResponse<UploadResponse>>(() =>
    api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 60000, // 1 minute for upload
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    })
  );
  return response.data;
};

/**
 * Transcribe audio file
 * @param filename - The uploaded file name
 * @returns Promise with transcription response
 */
export const transcribeFile = async (filename: string): Promise<TranscriptionResponse> => {
  if (!filename || typeof filename !== 'string') {
    throw new APIError('Invalid filename provided', 400);
  }

  const response = await retryRequest<AxiosResponse<TranscriptionResponse>>(() =>
    api.get(`/transcribe/${encodeURIComponent(filename)}`, {
      timeout: 240000, // 4 minutes for transcription
    })
  );
  
  // Validate response structure
  if (!isTranscriptionResponseType(response.data)) {
    throw new APIError('Invalid response format from transcription service', 500);
  }
  
  return response.data;
};

/**
 * Extract action items from transcript
 * @param transcript - The transcript text
 * @returns Promise with extraction response
 */
export const extractActionItems = async (transcript: string): Promise<ExtractionResponse> => {
  if (!transcript || typeof transcript !== 'string' || transcript.trim().length === 0) {
    throw new APIError('Invalid transcript provided', 400);
  }

  // Validate transcript length
  const maxLength = 50000;
  if (transcript.length > maxLength) {
    throw new APIError(`Transcript too long. Maximum length: ${maxLength} characters`, 413);
  }

  const response = await retryRequest<AxiosResponse<ExtractionResponse>>(() =>
    api.post('/extract', { transcript }, {
      timeout: 60000, // 1 minute for extraction
    })
  );
  
  // Validate response structure
  if (!isExtractionResponseType(response.data)) {
    throw new APIError('Invalid response format from extraction service', 500);
  }
  
  return response.data;
};

/**
 * Check server health
 * @returns Promise with health status
 */
export const checkHealth = async (): Promise<{ status: string; timestamp?: string; version?: string }> => {
  try {
    const response = await api.get<{ status: string; timestamp?: string; version?: string }>('/health', {
      timeout: 5000, // 5 seconds for health check
    });
    return response.data;
  } catch (error) {
    throw new APIError('Health check failed - server may be down', 503);
  }
};



/**
 * Cancel ongoing requests (useful for cleanup)
 */
export const cancelRequests = () => {
  // Cancel all pending requests (no-op, as axios v1+ uses AbortController)
  // To implement cancellation, use AbortController in requests.
  return;
};

export default api;
