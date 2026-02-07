"use client";

import { useEffect, useState, useRef, useCallback } from 'react';
import { ThreatEvent } from '@/lib/event-bus';

interface EventStreamStats {
  total_scans: number;
  blocked: number;
  flagged: number;
  allowed: number;
  avg_latency: number;
  attack_types: Record<string, number>;
  events_per_minute: number;
  last_updated: string;
}

interface UseEventStreamReturn {
  events: ThreatEvent[];
  stats: EventStreamStats | null;
  isConnected: boolean;
  error: string | null;
  reconnect: () => void;
}

const MAX_EVENTS = 50; // Keep last 50 events in memory

/**
 * React hook for consuming real-time threat events via SSE
 * Automatically reconnects on connection loss
 */
export function useEventStream(): UseEventStreamReturn {
  const [events, setEvents] = useState<ThreatEvent[]>([]);
  const [stats, setStats] = useState<EventStreamStats | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;

  // Fetch initial stats
  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch('/api/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  }, []);

  // Connect to SSE endpoint
  const connect = useCallback(() => {
    // Close existing connection if any
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    // Clear any pending reconnect
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }

    try {
      const eventSource = new EventSource('/api/events');
      eventSourceRef.current = eventSource;

      eventSource.onopen = () => {
        console.log('✅ SSE connection established');
        setIsConnected(true);
        setError(null);
        reconnectAttemptsRef.current = 0;

        // Fetch initial stats
        fetchStats();
      };

      eventSource.onmessage = (event) => {
        try {
          const threatEvent: ThreatEvent = JSON.parse(event.data);

          // Add new event to the beginning of the array
          setEvents(prevEvents => {
            const newEvents = [threatEvent, ...prevEvents];
            // Keep only last MAX_EVENTS
            return newEvents.slice(0, MAX_EVENTS);
          });

          // Refresh stats periodically (every 10 events)
          if (Math.random() < 0.1) {
            fetchStats();
          }

        } catch (error) {
          console.error('Failed to parse event:', error);
        }
      };

      eventSource.onerror = (event) => {
        console.error('❌ SSE connection error:', event);
        setIsConnected(false);

        // Close the connection
        eventSource.close();

        // Attempt to reconnect with exponential backoff
        if (reconnectAttemptsRef.current < maxReconnectAttempts) {
          const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 30000);
          console.log(`🔄 Reconnecting in ${delay}ms (attempt ${reconnectAttemptsRef.current + 1}/${maxReconnectAttempts})`);

          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttemptsRef.current++;
            connect();
          }, delay);
        } else {
          setError('Failed to connect after multiple attempts. Please refresh the page.');
        }
      };

    } catch (error) {
      console.error('Failed to create EventSource:', error);
      setError('Failed to establish connection');
      setIsConnected(false);
    }
  }, [fetchStats]);

  // Manual reconnect function
  const reconnect = useCallback(() => {
    reconnectAttemptsRef.current = 0;
    setError(null);
    connect();
  }, [connect]);

  // Initialize connection on mount
  useEffect(() => {
    connect();

    // Periodic stats refresh (every 30 seconds)
    const statsInterval = setInterval(fetchStats, 30000);

    // Cleanup on unmount
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      clearInterval(statsInterval);
    };
  }, [connect, fetchStats]);

  return {
    events,
    stats,
    isConnected,
    error,
    reconnect
  };
}

/**
 * Hook for filtered events by type
 */
export function useFilteredEvents(type?: string): ThreatEvent[] {
  const { events } = useEventStream();

  if (!type) return events;

  return events.filter(event => event.type === type);
}

/**
 * Hook for events by decision
 */
export function useEventsByDecision(decision: 'ALLOW' | 'FLAG' | 'BLOCK'): ThreatEvent[] {
  const { events } = useEventStream();

  return events.filter(event => event.action === decision);
}
