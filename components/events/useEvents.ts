import { useState, useEffect, useCallback } from 'react';
import { Event } from './types';

interface UseEventsOptions {
  fetchFromAPI?: boolean;
  apiEndpoint?: string;
  sports?: string[];
  pollingInterval?: number; // in milliseconds
  initialData?: Event[];
}

interface UseEventsReturn {
  events: Event[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  updateEvent: (eventId: string, updates: Partial<Event>) => void;
}

export function useEvents({
  fetchFromAPI = false,
  apiEndpoint = '/api/events',
  sports = [],
  pollingInterval = 0,
  initialData = [],
}: UseEventsOptions = {}): UseEventsReturn {
  const [events, setEvents] = useState<Event[]>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchEvents = useCallback(async () => {
    if (!fetchFromAPI) return;

    setLoading(true);
    setError(null);

    try {
      // Build query params
      const params = new URLSearchParams();
      if (sports.length > 0 && !sports.includes('all')) {
        params.append('sports', sports.join(','));
      }

      const response = await fetch(`${apiEndpoint}?${params}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch events: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Transform the data to match our Event interface
      const transformedEvents: Event[] = data.map((item: Event) => ({
        ...item,
        startTime: new Date(item.startTime),
        isLive: item.status === 'live',
      }));

      setEvents(transformedEvents);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
    } finally {
      setLoading(false);
    }
  }, [fetchFromAPI, apiEndpoint, sports]);

  // Initial fetch
  useEffect(() => {
    if (fetchFromAPI) {
      fetchEvents();
    }
  }, [fetchFromAPI, fetchEvents]);

  // Polling for live updates
  useEffect(() => {
    if (!pollingInterval || !fetchFromAPI) return;

    const interval = setInterval(fetchEvents, pollingInterval);
    return () => clearInterval(interval);
  }, [pollingInterval, fetchFromAPI, fetchEvents]);

  // Update a single event (for optimistic updates)
  const updateEvent = useCallback((eventId: string, updates: Partial<Event>) => {
    setEvents(prevEvents =>
      prevEvents.map(event =>
        event.id === eventId ? { ...event, ...updates } : event
      )
    );
  }, []);

  return {
    events,
    loading,
    error,
    refetch: fetchEvents,
    updateEvent,
  };
}

// Hook for managing WebSocket connection for real-time updates
export function useEventsRealtime(events: Event[], onEventUpdate: (event: Event) => void) {
  useEffect(() => {
    // This is where you'd implement WebSocket connection
    // For now, it's a placeholder
    
    // Example WebSocket implementation:
    /*
    const ws = new WebSocket('ws://localhost:8080/events/live');
    
    ws.onmessage = (event) => {
      const updatedEvent = JSON.parse(event.data);
      onEventUpdate(updatedEvent);
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    
    return () => {
      ws.close();
    };
    */
  }, [events, onEventUpdate]);
}