"use client";

import { useState, useEffect, useCallback } from 'react';
import { SportCategory, defaultSports } from './types';

interface UseSportsOptions {
  fetchFromAPI?: boolean;
  apiEndpoint?: string;
  initialData?: SportCategory[];
}

interface UseSportsReturn {
  sports: SportCategory[];
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useSports(options: UseSportsOptions = {}): UseSportsReturn {
  const { 
    fetchFromAPI = false, 
    apiEndpoint = '/api/sports',
    initialData = defaultSports 
  } = options;

  const [sports, setSports] = useState<SportCategory[]>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchSports = useCallback(async () => {
    if (!fetchFromAPI) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(apiEndpoint);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch sports: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Transform API data to SportCategory format if needed
      const transformedSports = data.sports || data;
      setSports(transformedSports);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      // Keep using initial data on error
      setSports(initialData);
    } finally {
      setLoading(false);
    }
  }, [fetchFromAPI, apiEndpoint, initialData]);

  useEffect(() => {
    fetchSports();
  }, [fetchSports]);

  return {
    sports,
    loading,
    error,
    refetch: fetchSports,
  };
}