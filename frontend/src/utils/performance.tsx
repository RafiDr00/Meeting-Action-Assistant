/**
 * Performance optimization utilities and hooks for the Meeting Action Assistant.
 */

import React, { 
  memo, 
  useMemo, 
  useCallback, 
  lazy, 
  Suspense,
  useEffect,
  useState,
  useRef
} from 'react';

// Lazy load components for code splitting
export const LazyMeetingDetail = lazy(() => import('../components/MeetingDetail'));
export const LazyTranscriptDisplay = lazy(() => import('../components/TranscriptDisplay'));
export const LazyActionItemsDisplay = lazy(() => import('../components/ActionItemsDisplay'));
export const LazySummaryDisplay = lazy(() => import('../components/SummaryDisplay'));

// Memoized loading fallback component
export const LoadingFallback = memo(() => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    <span className="ml-3 text-gray-600">Loading...</span>
  </div>
));

LoadingFallback.displayName = 'LoadingFallback';

// Optimized lazy wrapper with error boundary
export const OptimizedLazyWrapper: React.FC<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ children, fallback = <LoadingFallback /> }) => (
  <Suspense fallback={fallback}>
    {children}
  </Suspense>
);

// Virtual scrolling hook for large lists
export const useVirtualScroll = <T,>(
  items: T[],
  itemHeight: number,
  containerHeight: number
) => {
  const [scrollTop, setScrollTop] = useState(0);
  
  const visibleItems = useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight) + 1,
      items.length
    );
    
    return {
      startIndex,
      endIndex,
      items: items.slice(startIndex, endIndex),
      offsetY: startIndex * itemHeight,
      totalHeight: items.length * itemHeight
    };
  }, [items, itemHeight, containerHeight, scrollTop]);
  
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);
  
  return { visibleItems, handleScroll };
};

// Debounced input hook
export const useDebouncedValue = <T,>(value: T, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  
  return debouncedValue;
};

// Memoized search functionality
export const useOptimizedSearch = <T,>(
  items: T[],
  searchTerm: string,
  searchFields: (keyof T)[],
  delay: number = 300
) => {
  const debouncedSearchTerm = useDebouncedValue(searchTerm, delay);
  
  return useMemo(() => {
    if (!debouncedSearchTerm) return items;
    
    const lowercaseSearch = debouncedSearchTerm.toLowerCase();
    return items.filter(item =>
      searchFields.some(field => {
        const value = item[field];
        return typeof value === 'string' && 
               value.toLowerCase().includes(lowercaseSearch);
      })
    );
  }, [items, debouncedSearchTerm, searchFields]);
};

// Intersection Observer hook for lazy loading
export const useIntersectionObserver = (
  options: IntersectionObserverInit = {}
) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const targetRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);
    
    const currentTarget = targetRef.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }
    
    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [options]);
  
  return { targetRef, isIntersecting };
};

// Image optimization component
export const OptimizedImage: React.FC<{
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  loading?: 'lazy' | 'eager';
}> = memo(({ src, alt, width, height, className = '', loading = 'lazy' }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const handleLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);
  
  const handleError = useCallback(() => {
    setImageError(true);
  }, []);
  
  if (imageError) {
    return (
      <div 
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={{ width, height }}
      >
        <span className="text-gray-500 text-sm">Image failed to load</span>
      </div>
    );
  }
  
  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      {!imageLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        onLoad={handleLoad}
        onError={handleError}
        className={`transition-opacity duration-300 ${
          imageLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
});

OptimizedImage.displayName = 'OptimizedImage';

// Memoized list component for better performance
export const OptimizedList = memo(<T,>({
  items,
  renderItem,
  keyExtractor,
  className = '',
  emptyMessage = 'No items found'
}: {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor: (item: T, index: number) => string | number;
  className?: string;
  emptyMessage?: string;
}) => {
  if (items.length === 0) {
    return (
      <div className={`text-center py-8 text-gray-500 ${className}`}>
        {emptyMessage}
      </div>
    );
  }
  
  return (
    <div className={className}>
      {items.map((item, index) => (
        <div key={keyExtractor(item, index)}>
          {renderItem(item, index)}
        </div>
      ))}
    </div>
  );
});

OptimizedList.displayName = 'OptimizedList';

// Performance monitoring hook
export const usePerformanceMonitor = (componentName: string) => {
  const renderCount = useRef(0);
  const startTime = useRef<number>(0);
  
  useEffect(() => {
    renderCount.current += 1;
    startTime.current = performance.now();
    
    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime.current;
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`${componentName} render #${renderCount.current}: ${renderTime}ms`);
      }
    };
  });
  
  return { renderCount: renderCount.current };
};

// Batch state updates for better performance
export const useBatchedUpdates = <T,>(initialState: T) => {
  const [state, setState] = useState<T>(initialState);
  const pendingUpdates = useRef<Partial<T>[]>([]);
  
  const batchUpdate = useCallback((update: Partial<T>) => {
    pendingUpdates.current.push(update);
    
    // Use RAF to batch updates
    requestAnimationFrame(() => {
      if (pendingUpdates.current.length > 0) {
        const updates = pendingUpdates.current;
        pendingUpdates.current = [];
        
        setState(prevState => 
          updates.reduce((acc, update) => ({ ...acc, ...update }), prevState) as T
        );
      }
    });
  }, []);
  
  return [state, batchUpdate] as const;
};

// Export all performance utilities
export default {
  LazyMeetingDetail,
  LazyTranscriptDisplay,
  LazyActionItemsDisplay,
  LazySummaryDisplay,
  LoadingFallback,
  OptimizedLazyWrapper,
  useVirtualScroll,
  useDebouncedValue,
  useOptimizedSearch,
  useIntersectionObserver,
  OptimizedImage,
  OptimizedList,
  usePerformanceMonitor,
  useBatchedUpdates
};