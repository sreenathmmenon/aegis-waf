import { NextRequest, NextResponse } from 'next/server';
import { getPaginatedAuditLog } from '@/lib/data/syntheticTraffic';
import { Decision, AttackCategory } from '@/lib/types';

/**
 * Audit log endpoint - returns paginated and filtered audit entries
 */
export async function GET(request: NextRequest) {
  try {
    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;

    // Pagination parameters
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    // Validate pagination parameters
    if (page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json(
        {
          error: 'Invalid pagination parameters',
          details: 'Page must be >= 1, limit must be between 1 and 100'
        },
        { status: 400 }
      );
    }

    // Filter parameters
    const decisionFilter = searchParams.get('decision') as Decision | null;
    const categoryFilter = searchParams.get('category') as AttackCategory | null;
    const searchQuery = searchParams.get('search') || undefined;

    // Validate decision filter
    if (decisionFilter && !['ALLOW', 'BLOCK', 'FLAG'].includes(decisionFilter)) {
      return NextResponse.json(
        {
          error: 'Invalid decision filter',
          details: 'Decision must be ALLOW, BLOCK, or FLAG'
        },
        { status: 400 }
      );
    }

    // Validate category filter
    const validCategories: AttackCategory[] = [
      'direct_injection',
      'indirect_injection',
      'encoding_obfuscation',
      'jailbreak',
      'data_exfiltration',
      'output_manipulation',
      'multi_turn'
    ];

    if (categoryFilter && !validCategories.includes(categoryFilter)) {
      return NextResponse.json(
        {
          error: 'Invalid category filter',
          details: `Category must be one of: ${validCategories.join(', ')}`
        },
        { status: 400 }
      );
    }

    // Get paginated audit log data
    const filters = {
      decision: decisionFilter || undefined,
      category: categoryFilter || undefined,
      search: searchQuery
    };

    const auditData = getPaginatedAuditLog(page, limit, filters);

    // Build response with metadata
    const response = {
      entries: auditData.entries,
      pagination: {
        currentPage: auditData.currentPage,
        totalPages: auditData.totalPages,
        totalCount: auditData.totalCount,
        pageSize: limit,
        hasNext: auditData.currentPage < auditData.totalPages,
        hasPrevious: auditData.currentPage > 1
      },
      filters: {
        decision: decisionFilter,
        category: categoryFilter,
        search: searchQuery || null
      },
      summary: {
        totalBlocked: auditData.entries.filter(e => e.decision === 'BLOCK').length,
        totalAllowed: auditData.entries.filter(e => e.decision === 'ALLOW').length,
        totalFlagged: auditData.entries.filter(e => e.decision === 'FLAG').length,
        averageLatency: auditData.entries.length > 0
          ? auditData.entries.reduce((sum, e) => sum + e.latencyMs, 0) / auditData.entries.length
          : 0,
      },
      generatedAt: new Date().toISOString()
    };

    // Set cache headers
    const headers = new Headers();
    headers.set('Content-Type', 'application/json');
    headers.set('Cache-Control', 'public, max-age=30'); // Cache for 30 seconds

    return new NextResponse(JSON.stringify(response), {
      status: 200,
      headers
    });

  } catch (error) {
    console.error('Audit log error:', error);
    return NextResponse.json(
      {
        error: 'Failed to retrieve audit log',
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