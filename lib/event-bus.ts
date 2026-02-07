/**
 * Event Bus - In-memory pub/sub system for real-time threat events
 * Uses singleton pattern to ensure single event stream across the application
 */

import { Decision, ThreatLevel, AttackCategory } from './types';

export type EventType =
  | 'scan_complete'
  | 'threat_blocked'
  | 'threat_flagged'
  | 'scan_allowed';

export interface ThreatEvent {
  id: string;
  timestamp: string;
  type: EventType;
  input_preview: string; // First 80 chars
  layers_triggered: string[];
  action: Decision;
  severity: ThreatLevel;
  session_id?: string;
  latency_ms: number;
  category?: AttackCategory;
  confidence: number;
}

type EventListener = (event: ThreatEvent) => void;

/**
 * EventBus singleton class for managing threat events
 */
class EventBus {
  private static instance: EventBus;
  private listeners: Set<EventListener> = new Set();
  private eventHistory: ThreatEvent[] = [];
  private maxHistorySize = 1000;

  private constructor() {
    // Private constructor for singleton
  }

  /**
   * Get EventBus singleton instance
   */
  static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  /**
   * Subscribe to events
   * @param listener - Callback function to receive events
   * @returns Unsubscribe function
   */
  subscribe(listener: EventListener): () => void {
    this.listeners.add(listener);

    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Publish an event to all subscribers
   * @param event - Threat event to publish
   */
  publish(event: ThreatEvent): void {
    // Add to history
    this.eventHistory.push(event);

    // Keep history size limited
    if (this.eventHistory.length > this.maxHistorySize) {
      this.eventHistory = this.eventHistory.slice(-this.maxHistorySize);
    }

    // Notify all listeners
    this.listeners.forEach(listener => {
      try {
        listener(event);
      } catch (error) {
        console.error('Error in event listener:', error);
      }
    });
  }

  /**
   * Get recent events from history
   * @param count - Number of events to retrieve
   * @returns Array of recent events
   */
  getRecentEvents(count: number = 50): ThreatEvent[] {
    return this.eventHistory.slice(-count).reverse();
  }

  /**
   * Get total event count
   */
  getEventCount(): number {
    return this.eventHistory.length;
  }

  /**
   * Get number of active listeners
   */
  getListenerCount(): number {
    return this.listeners.size;
  }

  /**
   * Clear all event history (for testing)
   */
  clearHistory(): void {
    this.eventHistory = [];
  }

  /**
   * Get events by type
   * @param type - Event type to filter by
   * @param count - Maximum number of events
   */
  getEventsByType(type: EventType, count: number = 50): ThreatEvent[] {
    return this.eventHistory
      .filter(event => event.type === type)
      .slice(-count)
      .reverse();
  }

  /**
   * Get events by session
   * @param sessionId - Session ID to filter by
   */
  getEventsBySession(sessionId: string): ThreatEvent[] {
    return this.eventHistory
      .filter(event => event.session_id === sessionId)
      .reverse();
  }

  /**
   * Get stats for dashboard
   */
  getStats(): {
    totalEvents: number;
    blocked: number;
    flagged: number;
    allowed: number;
    activeListeners: number;
    avgLatency: number;
    eventsPerMinute: number;
  } {
    const now = Date.now();
    const oneMinuteAgo = new Date(now - 60000).toISOString();

    // Filter events from last minute
    const recentEvents = this.eventHistory.filter(
      event => event.timestamp > oneMinuteAgo
    );

    // Count by action
    const blocked = this.eventHistory.filter(e => e.action === 'BLOCK').length;
    const flagged = this.eventHistory.filter(e => e.action === 'FLAG').length;
    const allowed = this.eventHistory.filter(e => e.action === 'ALLOW').length;

    // Calculate average latency
    const avgLatency = this.eventHistory.length > 0
      ? this.eventHistory.reduce((sum, e) => sum + e.latency_ms, 0) / this.eventHistory.length
      : 0;

    return {
      totalEvents: this.eventHistory.length,
      blocked,
      flagged,
      allowed,
      activeListeners: this.listeners.size,
      avgLatency,
      eventsPerMinute: recentEvents.length
    };
  }
}

// Export singleton instance
export const eventBus = EventBus.getInstance();

/**
 * Helper function to create event from validation result
 */
export function createEventFromValidation(validationResult: any): ThreatEvent {
  const { id, timestamp, input, decision, threatLevel, layers, latencyMs, sessionId, category, confidence } = validationResult;

  // Get first 80 chars of input
  const input_preview = input.substring(0, 80);

  // Get layers that failed or warned
  const layers_triggered = layers
    .filter((l: any) => l.status !== 'PASS')
    .map((l: any) => l.layer);

  // Determine event type
  let type: EventType = 'scan_complete';
  if (decision === 'BLOCK') {
    type = 'threat_blocked';
  } else if (decision === 'FLAG') {
    type = 'threat_flagged';
  } else if (decision === 'ALLOW') {
    type = 'scan_allowed';
  }

  return {
    id,
    timestamp,
    type,
    input_preview,
    layers_triggered,
    action: decision,
    severity: threatLevel,
    session_id: sessionId,
    latency_ms: latencyMs,
    category,
    confidence
  };
}
