import { NextRequest, NextResponse } from 'next/server';
import { validateOutput } from '@/lib/layers/output-guard';
import { OutputGuardResult } from '@/lib/types';

interface OutputValidationRequest {
  input: string;
  output: string;
  config?: {
    enableDataLeakage?: boolean;
    enablePolicyCheck?: boolean;
    enableDriftDetection?: boolean;
    driftThreshold?: number;
  };
}

/**
 * Dedicated output validation endpoint
 * POST /api/shield/validate-output
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body: OutputValidationRequest = await request.json();
    const { input, output, config } = body;

    // Validate inputs
    if (!input || typeof input !== 'string') {
      return NextResponse.json(
        { error: 'Invalid input: string required' },
        { status: 400 }
      );
    }

    if (!output || typeof output !== 'string') {
      return NextResponse.json(
        { error: 'Invalid output: string required' },
        { status: 400 }
      );
    }

    if (input.length > 10000) {
      return NextResponse.json(
        { error: 'Input too long: maximum 10000 characters' },
        { status: 400 }
      );
    }

    if (output.length > 50000) {
      return NextResponse.json(
        { error: 'Output too long: maximum 50000 characters' },
        { status: 400 }
      );
    }

    // Run output validation
    const result: OutputGuardResult = await validateOutput(input, output, config);

    // Return result with proper headers
    return NextResponse.json(result, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    });

  } catch (error) {
    console.error('Output validation error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error during output validation',
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
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
