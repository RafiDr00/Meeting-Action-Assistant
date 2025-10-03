import axios, { AxiosError } from 'axios';
import { UploadResponse, TranscriptionResponse, ExtractionResponse } from '../types';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ? `${import.meta.env.VITE_API_BASE_URL}/api` : '/api',
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
  retries = MAX_RETRIES
): Promise<T> => {
  try {
    return await requestFn();
  } catch (error) {
    if (retries > 0 && axios.isAxiosError(error)) {
      const status = error.response?.status;
      // Retry on network errors or 5xx server errors
      if (!status || status >= 500) {
        console.log(`Retrying request... ${retries} attempts left`);
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        return retryRequest(requestFn, retries - 1);
      }
    }
    throw error;
  }
};

// Request interceptor for logging and error handling
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for logging and error handling
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error: AxiosError) => {
    console.error('❌ API Response Error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url,
    });
    
    // Transform error for better user experience
    if (error.response?.status === 413) {
      error.message = 'File too large. Please upload a file smaller than 100MB.';
    } else if (error.response?.status === 415) {
      error.message = 'Unsupported file type. Please upload an audio or video file.';
    } else if (error.code === 'ECONNABORTED') {
      error.message = 'Request timeout. Please try again with a smaller file.';
    } else if (!error.response) {
      error.message = 'Network error. Please check your connection and try again.';
    }
    
    return Promise.reject(error);
  }
);

/**
 * Upload file to the server
 * @param file - The file to upload
 * @returns Promise with upload response
 */
export const uploadFile = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await retryRequest(() =>
    api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 60000, // 1 minute for upload
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
  const response = await retryRequest(() =>
    api.get(`/transcribe/${encodeURIComponent(filename)}`, {
      timeout: 240000, // 4 minutes for transcription
    })
  );
  return response.data;
};

/**
 * Extract action items from transcript
 * @param transcript - The transcript text
 * @returns Promise with extraction response
 */
export const extractActionItems = async (transcript: string): Promise<ExtractionResponse> => {
  const response = await retryRequest(() =>
    api.post('/extract', { transcript }, {
      timeout: 60000, // 1 minute for extraction
    })
  );
  return response.data;
};

/**
 * Check server health
 * @returns Promise with health status
 */
export const checkHealth = async (): Promise<{ status: string }> => {
  const response = await api.get('/health', {
    timeout: 5000, // 5 seconds for health check
  });
  return response.data;
};

/**
 * Cancel ongoing requests (useful for cleanup)
 */
export const cancelRequests = () => {
  // Cancel all pending requests
  const source = axios.CancelToken.source();
  return source.cancel('Operation cancelled by user');
};

export default api;
