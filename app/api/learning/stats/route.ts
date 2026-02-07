import { NextResponse } from 'next/server';
import { getLearningStats, getLearnedPatterns } from '@/lib/learning/adaptive-learning';

/**
 * GET /api/learning/stats
 * Returns adaptive learning statistics
 */
export async function GET() {
  try {
    const stats = getLearningStats();
    const recentPatterns = getLearnedPatterns().slice(0, 10);

    return NextResponse.json({
      ...stats,
      recentPatterns: recentPatterns.map(p => ({
        id: p.id,
        category: p.category,
        confidence: p.confidence,
        timestamp: p.timestamp,
        preview: p.prompt.substring(0, 50) + (p.prompt.length > 50 ? '...' : ''),
      })),
    });
  } catch (error) {
    console.error('Failed to get learning stats:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve learning statistics' },
      { status: 500 }
    );
  }
}
