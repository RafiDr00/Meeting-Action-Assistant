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
    <div className="card bg-gradient-to-br from-[#1A1A2E] via-[#0F3460] to-[#E94560] p-8 rounded-3xl shadow-2xl font-['Sora','Space Grotesk',sans-serif]">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-[#FFD700] tracking-tight drop-shadow-lg mb-3">
          Upload Meeting Recording
        </h2>
        <p className="text-base text-white opacity-90 font-mono">
          Upload your audio or video file to get AI-powered transcription and action items
        </p>
      </div>

      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200
          ${isDragActive && !isDragReject ? 'border-[#FFD700] bg-[#FFD700]/20' : ''}
          ${isDragReject ? 'border-[#E94560] bg-[#E94560]/20' : ''}
          ${!isDragActive && !isDragReject ? 'border-[#0F3460] hover:border-[#FFD700] hover:bg-[#1A1A2E]/80' : ''}
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
                ${isDragActive ? 'bg-[#FFD700]' : 'bg-[#0F3460]'}
              `}>
                <Upload className={`
                  w-8 h-8 animate-bounce
                  ${isDragActive ? 'text-[#1A1A2E]' : 'text-[#FFD700]'}
                `} />
              </div>
            )}
          </div>

          {/* Text */}
          <div>
            {isProcessing ? (
              <div className="space-y-2">
                <p className="text-xl font-bold text-[#FFD700]">
                  Processing your file...
                </p>
                <div className="flex justify-center space-x-4 text-base text-white font-mono">
                  {processing.uploading && <span>📤 Uploading</span>}
                  {processing.transcribing && <span>🎤 Transcribing</span>}
                  {processing.extracting && <span>🤖 Analyzing</span>}
                </div>
              </div>
            ) : isDragActive ? (
              <p className="text-xl font-bold text-[#FFD700]">
                Drop your file here
              </p>
            ) : (
              <div className="space-y-2">
                <p className="text-xl font-bold text-white">
                  Drag & drop your file here, or click to browse
                </p>
                <p className="text-base text-white/70 font-mono">
                  Supports MP3, WAV, M4A, AAC, MP4, AVI, MOV, WMV, WEBM (max 100MB)
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mt-6 p-4 bg-[#E94560]/30 border-2 border-[#E94560] rounded-2xl backdrop-blur-sm">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-6 h-6 text-[#FFD700]" />
            <p className="text-white font-bold text-lg">Error</p>
          </div>
          <p className="text-white mt-2 font-mono">{error}</p>
        </div>
      )}

      {/* File Info */}
      <div className="mt-6 p-6 bg-[#1A1A2E]/60 rounded-2xl border border-[#0F3460] backdrop-blur-sm">
        <div className="flex items-center space-x-3 mb-4">
          <FileAudio className="w-6 h-6 text-[#FFD700]" />
          <h3 className="font-bold text-xl text-[#FFD700]">Supported Formats</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-base text-white">
          <div>
            <p className="font-bold text-[#FFD700]">Audio:</p>
            <p className="font-mono">MP3, WAV, M4A, AAC</p>
          </div>
          <div>
            <p className="font-bold text-[#FFD700]">Video:</p>
            <p className="font-mono">MP4, AVI, MOV, WMV, WEBM</p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t-2 border-[#0F3460]">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-[#FFD700]" />
            <span className="text-base text-white font-mono">
              Files are processed securely and deleted after analysis
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
