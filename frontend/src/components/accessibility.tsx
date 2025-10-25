/**
 * Accessibility utilities and components for the Meeting Action Assistant.
 */

import React, { useRef, useEffect } from 'react';

// Skip Link Component for keyboard navigation
export const SkipLink: React.FC<{ target: string; children: React.ReactNode }> = ({ 
  target, 
  children 
}) => (
  <a
    href={`#${target}`}
    className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 
               bg-blue-600 text-white px-4 py-2 rounded-md z-50 
               focus:outline-none focus:ring-2 focus:ring-blue-300"
  >
    {children}
  </a>
);

// Announce dynamic content changes to screen readers
export const LiveRegion: React.FC<{
  message: string;
  level?: 'polite' | 'assertive';
  clearOnUnmount?: boolean;
}> = ({ message, level = 'polite', clearOnUnmount = true }) => {
  const regionRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (regionRef.current) {
      regionRef.current.textContent = message;
    }
    
    return () => {
      if (clearOnUnmount && regionRef.current) {
        regionRef.current.textContent = '';
      }
    };
  }, [message, clearOnUnmount]);
  
  return (
    <div
      ref={regionRef}
      aria-live={level}
      aria-atomic="true"
      className="sr-only"
    />
  );
};

// Custom hook for managing focus
export const useFocusManagement = () => {
  const focusRef = useRef<HTMLElement | null>(null);
  
  const setFocus = (element: HTMLElement | null) => {
    if (element) {
      element.focus();
      focusRef.current = element;
    }
  };
  
  const restoreFocus = () => {
    if (focusRef.current) {
      focusRef.current.focus();
    }
  };
  
  return { setFocus, restoreFocus };
};

// Enhanced Button with better accessibility
export const AccessibleButton: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'primary' | 'secondary' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    loadingText?: string;
  }
> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  loading = false, 
  loadingText = 'Loading...',
  disabled,
  className = '',
  ...props 
}) => {
  const baseClasses = `
    inline-flex items-center justify-center font-medium rounded-md
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    transition-colors duration-200
  `;
  
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
  };
  
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };
  
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled || loading}
      aria-disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg 
          className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle 
            className="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4"
          />
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      <span className={loading ? 'sr-only' : undefined}>
        {loading ? loadingText : children}
      </span>
      {loading && (
        <span aria-hidden="true">{children}</span>
      )}
    </button>
  );
};

// Enhanced Input with better accessibility
export const AccessibleInput: React.FC<
  React.InputHTMLAttributes<HTMLInputElement> & {
    label: string;
    error?: string;
    hint?: string;
    required?: boolean;
  }
> = ({ label, error, hint, required, id, className = '', ...props }) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const errorId = error ? `${inputId}-error` : undefined;
  const hintId = hint ? `${inputId}-hint` : undefined;
  
  return (
    <div className="space-y-1">
      <label 
        htmlFor={inputId}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
        {required && (
          <span className="text-red-500 ml-1" aria-label="required">*</span>
        )}
      </label>
      
      {hint && (
        <p id={hintId} className="text-sm text-gray-500">
          {hint}
        </p>
      )}
      
      <input
        id={inputId}
        className={`
          block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          disabled:bg-gray-50 disabled:text-gray-500
          ${error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}
          ${className}
        `}
        aria-describedby={[hintId, errorId].filter(Boolean).join(' ') || undefined}
        aria-invalid={error ? 'true' : 'false'}
        required={required}
        {...props}
      />
      
      {error && (
        <p id={errorId} className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

// Progress indicator with accessibility
export const AccessibleProgressBar: React.FC<{
  value: number;
  max?: number;
  label: string;
  description?: string;
}> = ({ value, max = 100, label, description }) => {
  const percentage = Math.round((value / max) * 100);
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm text-gray-500">{percentage}%</span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
          aria-label={label}
          aria-describedby={description ? `progress-desc-${Math.random().toString(36).substr(2, 9)}` : undefined}
        />
      </div>
      
      {description && (
        <p className="text-xs text-gray-500">{description}</p>
      )}
    </div>
  );
};

// Keyboard navigation utilities
export const useKeyboardNavigation = (
  items: HTMLElement[],
  options: {
    loop?: boolean;
    orientation?: 'horizontal' | 'vertical';
  } = {}
) => {
  const { loop = true, orientation = 'vertical' } = options;
  
  const handleKeyDown = (event: KeyboardEvent, currentIndex: number) => {
    let nextIndex = currentIndex;
    
    switch (event.key) {
      case orientation === 'vertical' ? 'ArrowDown' : 'ArrowRight':
        event.preventDefault();
        nextIndex = currentIndex + 1;
        if (nextIndex >= items.length) {
          nextIndex = loop ? 0 : items.length - 1;
        }
        break;
        
      case orientation === 'vertical' ? 'ArrowUp' : 'ArrowLeft':
        event.preventDefault();
        nextIndex = currentIndex - 1;
        if (nextIndex < 0) {
          nextIndex = loop ? items.length - 1 : 0;
        }
        break;
        
      case 'Home':
        event.preventDefault();
        nextIndex = 0;
        break;
        
      case 'End':
        event.preventDefault();
        nextIndex = items.length - 1;
        break;
        
      default:
        return;
    }
    
    items[nextIndex]?.focus();
  };
  
  return { handleKeyDown };
};

export default {
  SkipLink,
  LiveRegion,
  useFocusManagement,
  AccessibleButton,
  AccessibleInput,
  AccessibleProgressBar,
  useKeyboardNavigation
};