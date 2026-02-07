import { NextRequest, NextResponse } from 'next/server';
import { generateSyntheticAnalytics } from '@/lib/data/syntheticTraffic';
import { AnalyticsData } from '@/lib/types';

/**
 * Analytics endpoint - returns synthetic analytics data
 */
export async function GET(request: NextRequest) {
  try {
    // Generate synthetic analytics data
    const analyticsData: AnalyticsData = generateSyntheticAnalytics();

    // Add some real-time feel with current timestamp
    const enrichedData = {
      ...analyticsData,
      generatedAt: new Date().toISOString(),
      timeRange: {
        start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        end: new Date().toISOString()
      },
      // Add some additional metrics
      metrics: {
        detectionRate: analyticsData.blocked / (analyticsData.blocked + analyticsData.allowed),
        averageResponseTime: analyticsData.avgLatencyMs,
        peakHour: Math.floor(Math.random() * 24), // Random peak hour
        uniqueSessions: Math.floor(analyticsData.totalRequests / 3.5), // Rough estimate
        repeatOffenders: Math.floor(analyticsData.blocked * 0.3), // 30% are repeat
      },
      // Add threat severity breakdown
      severityBreakdown: {
        critical: Math.floor(analyticsData.blocked * 0.15),
        high: Math.floor(analyticsData.blocked * 0.35),
        medium: Math.floor(analyticsData.blocked * 0.30),
        low: Math.floor(analyticsData.blocked * 0.20),
      },
      // Add top attack sources (mock IPs)
      topAttackSources: [
        { ip: '192.168.1.100', count: Math.floor(analyticsData.blocked * 0.08), country: 'Unknown' },
        { ip: '10.0.0.50', count: Math.floor(analyticsData.blocked * 0.06), country: 'Internal' },
        { ip: '203.0.113.42', count: Math.floor(analyticsData.blocked * 0.05), country: 'External' },
        { ip: '198.51.100.15', count: Math.floor(analyticsData.blocked * 0.04), country: 'External' },
        { ip: '172.16.0.23', count: Math.floor(analyticsData.blocked * 0.03), country: 'Internal' },
      ],
      // Performance metrics
      performance: {
        uptime: '99.99%',
        errorRate: '0.01%',
        cacheHitRate: '85%',
        aiModelLatency: {
          p50: 35,
          p90: 55,
          p99: 85
        },
        systemLoad: {
          cpu: Math.random() * 30 + 10, // 10-40%
          memory: Math.random() * 20 + 40, // 40-60%
        }
      }
    };

    // Set cache headers for performance
    const headers = new Headers();
    headers.set('Content-Type', 'application/json');
    headers.set('Cache-Control', 'public, max-age=60'); // Cache for 1 minute

    return new NextResponse(JSON.stringify(enrichedData), {
      status: 200,
      headers
    });

  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate analytics data',
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