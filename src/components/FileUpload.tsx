import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileAudio, AlertCircle, CheckCircle } from 'lucide-react';
import { ProcessingState } from '../types';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  processing: ProcessingState;
  error: string | null;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, processing, error }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.mp3', '.wav', '.m4a', '.aac'],
      'video/*': ['.mp4', '.avi', '.mov', '.wmv', '.webm']
    },
    maxFiles: 1,
    maxSize: 100 * 1024 * 1024, // 100MB
    disabled: processing.uploading || processing.transcribing || processing.extracting
  });

  const isProcessing = processing.uploading || processing.transcribing || processing.extracting;

  return (
    <div className="card">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Upload Meeting Recording
        </h2>
        <p className="text-gray-600">
          Upload your audio or video file to get AI-powered transcription and action items
        </p>
      </div>

      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200
          ${isDragActive && !isDragReject ? 'border-primary-500 bg-primary-50' : ''}
          ${isDragReject ? 'border-danger-500 bg-danger-50' : ''}
          ${!isDragActive && !isDragReject ? 'border-gray-300 hover:border-primary-400 hover:bg-gray-50' : ''}
          ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        <div className="space-y-4">
          {/* Icon */}
          <div className="flex justify-center">
            {isProcessing ? (
              <div className="w-16 h-16 spinner"></div>
            ) : (
              <div className={`
                w-16 h-16 rounded-full flex items-center justify-center
                ${isDragActive ? 'bg-primary-100' : 'bg-gray-100'}
              `}>
                <Upload className={`
                  w-8 h-8
                  ${isDragActive ? 'text-primary-600' : 'text-gray-600'}
                `} />
              </div>
            )}
          </div>

          {/* Text */}
          <div>
            {isProcessing ? (
              <div className="space-y-2">
                <p className="text-lg font-medium text-gray-700">
                  Processing your file...
                </p>
                <div className="flex justify-center space-x-4 text-sm text-gray-500">
                  {processing.uploading && <span>📤 Uploading</span>}
                  {processing.transcribing && <span>🎤 Transcribing</span>}
                  {processing.extracting && <span>🤖 Analyzing</span>}
                </div>
              </div>
            ) : isDragActive ? (
              <p className="text-lg font-medium text-primary-600">
                Drop your file here
              </p>
            ) : (
              <div className="space-y-2">
                <p className="text-lg font-medium text-gray-700">
                  Drag & drop your file here, or click to browse
                </p>
                <p className="text-sm text-gray-500">
                  Supports MP3, WAV, M4A, AAC, MP4, AVI, MOV, WMV, WEBM (max 100MB)
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mt-4 p-4 bg-danger-50 border border-danger-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-danger-600" />
            <p className="text-danger-700 font-medium">Error</p>
          </div>
          <p className="text-danger-600 mt-1">{error}</p>
        </div>
      )}

      {/* File Info */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <FileAudio className="w-5 h-5 text-gray-600" />
          <h3 className="font-medium text-gray-900">Supported Formats</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
          <div>
            <p className="font-medium">Audio:</p>
            <p>MP3, WAV, M4A, AAC</p>
          </div>
          <div>
            <p className="font-medium">Video:</p>
            <p>MP4, AVI, MOV, WMV, WEBM</p>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-success-600" />
            <span className="text-sm text-gray-600">
              Files are processed securely and deleted after analysis
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
