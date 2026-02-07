import { NextRequest, NextResponse } from 'next/server';
import { threatStore } from '@/lib/threat-store';
import { eventBus } from '@/lib/event-bus';

/**
 * Get current threat statistics
 * GET /api/stats
 */
export async function GET(request: NextRequest) {
  try {
    // Get stats from threat store
    const storeStats = threatStore.getStats();

    // Get stats from event bus
    const busStats = eventBus.getStats();

    // Combine stats
    const stats = {
      ...storeStats,
      // Add real-time listener count
      activeConnections: busStats.activeListeners,
      // Simulation status
      simulationActive: threatStore.isSimulationRunning(),
      // Timestamp
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(stats, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Access-Control-Allow-Origin': '*',
      }
    });

  } catch (error) {
    console.error('Stats endpoint error:', error);
    return NextResponse.json(
      {
        error: 'Failed to retrieve stats',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * OPTIONS handler for CORS
 */
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
