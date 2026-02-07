import { NextRequest } from 'next/server';
import { eventBus, ThreatEvent } from '@/lib/event-bus';
import { threatStore } from '@/lib/threat-store';

/**
 * Server-Sent Events (SSE) endpoint for real-time threat events
 * GET /api/events
 */
export async function GET(request: NextRequest) {
  // Create a ReadableStream for SSE
  const stream = new ReadableStream({
    start(controller) {
      // Text encoder for sending data
      const encoder = new TextEncoder();

      // Send initial connection message
      const sendEvent = (event: ThreatEvent) => {
        try {
          const data = `data: ${JSON.stringify(event)}\n\n`;
          controller.enqueue(encoder.encode(data));
        } catch (error) {
          console.error('Error sending event:', error);
        }
      };

      // Send heartbeat to keep connection alive
      const heartbeat = () => {
        try {
          controller.enqueue(encoder.encode(': heartbeat\n\n'));
        } catch (error) {
          // Connection closed, ignore
        }
      };

      // Send recent events on connection
      const recentEvents = threatStore.getRecent(10);
      recentEvents.forEach(event => sendEvent(event));

      // Subscribe to new events
      const unsubscribe = eventBus.subscribe((event) => {
        sendEvent(event);
      });

      // Set up heartbeat every 15 seconds
      const heartbeatInterval = setInterval(heartbeat, 15000);

      // Cleanup on connection close
      const cleanup = () => {
        unsubscribe();
        clearInterval(heartbeatInterval);
        try {
          controller.close();
        } catch (error) {
          // Already closed
        }
      };

      // Handle client disconnect
      request.signal.addEventListener('abort', cleanup);

      // Auto-cleanup after 1 hour (safety measure)
      setTimeout(cleanup, 60 * 60 * 1000);
    },
  });

  // Return response with SSE headers
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no', // Disable nginx buffering
    },
  });
}

/**
 * OPTIONS handler for CORS preflight
 */
export async function OPTIONS(request: NextRequest) {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
