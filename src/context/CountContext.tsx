'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from 'react';

export interface CountData {
  waitList: number;
  details: number;
  inputWip: number;
  inputToStringer: number;
  outputToInput: number;
  published: number;
}

interface CountContextType {
  counts: CountData;
  isLoading: boolean;
  error: string | null;
  refreshCounts: () => Promise<void>;
  updateCount: (key: keyof CountData, value: number) => void;
}

const defaultCounts: CountData = {
  waitList: 0,
  details: 0,
  inputWip: 0,
  inputToStringer: 0,
  outputToInput: 0,
  published: 0,
};

const CountContext = createContext<CountContextType | undefined>(undefined);

import { fetchCounts } from '../services/countService';

interface CountProviderProps {
  children: ReactNode;
}

export const CountProvider: React.FC<CountProviderProps> = ({ children }) => {
  const [counts, setCounts] = useState<CountData>(defaultCounts);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  const refreshCounts = useCallback(async () => {
    if (!mountedRef.current) return;

    try {
      setIsLoading(true);
      setError(null);
      
      const newCounts = await fetchCounts();
      
      if (mountedRef.current) {
        setCounts(newCounts);
      }
      
    } catch (err) {
      if (mountedRef.current) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch counts';
        setError(errorMessage);
      }
    } finally {
      if (mountedRef.current) {
        setIsLoading(false);
      }
    }
  }, []);

  const updateCount = useCallback((key: keyof CountData, value: number) => {
    setCounts(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);


  useEffect(() => {
    mountedRef.current = true;
    refreshCounts();

    return () => {
      mountedRef.current = false;
    };
  }, [refreshCounts]);

  
  useEffect(() => {
    const handleFocus = () => {
      if (mountedRef.current && !document.hidden) {
        refreshCounts();
      }
    };

    const handleVisibilityChange = () => {
      if (!document.hidden && mountedRef.current) {
        refreshCounts();
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [refreshCounts]);

  const contextValue: CountContextType = {
    counts,
    isLoading,
    error,
    refreshCounts,
    updateCount,
  };

  return (
    <CountContext.Provider value={contextValue}>
      {children}
    </CountContext.Provider>
  );
};

// Custom hook to use the count context with fallback
export const useCount = (): CountContextType => {
  const context = useContext(CountContext);
  if (context === undefined) {
    return {
      counts: defaultCounts,
      isLoading: false,
      error: null,
      refreshCounts: async () => {},
      updateCount: () => {},
    };
  }
  
  return context;
};

// Helper hook to get a specific count
export const useSpecificCount = (key: keyof CountData): number => {
  const { counts } = useCount();
  return counts[key];
};

// Helper hook to get multiple counts
export const useMultipleCounts = (keys: (keyof CountData)[]): Partial<CountData> => {
  const { counts } = useCount();
  return keys.reduce((result, key) => {
    result[key] = counts[key];
    return result;
  }, {} as Partial<CountData>);
};