import { NextRequest, NextResponse } from 'next/server';
import { callTradingAgent, validateAgentResponse } from '@/lib/llm/trading-agent';

interface ChatRequest {
  message: string;
  provider?: 'openai' | 'claude';
}

/**
 * Protected LLM Chat Endpoint
 * This endpoint should ONLY be called AFTER AEGIS validation passes
 * In production, this would check auth and rate limits
 */
export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json();
    const { message, provider = 'openai' } = body;

    // Validate input
    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Invalid message: string required' },
        { status: 400 }
      );
    }

    if (message.length > 10000) {
      return NextResponse.json(
        { error: 'Message too long: maximum 10000 characters' },
        { status: 400 }
      );
    }

    // IMPORTANT: In the demo, we assume AEGIS has already validated the input
    // In production, this endpoint would reject requests without a valid AEGIS token

    // Call the protected trading agent
    const response = await callTradingAgent(message, [], provider);

    // Additional output validation
    const outputValidation = validateAgentResponse(response);
    if (!outputValidation.safe) {
      console.warn('⚠️ Output guard triggered:', outputValidation.reason);
      return NextResponse.json(
        {
          error: 'Response blocked by output guard',
          reason: outputValidation.reason
        },
        { status: 403 }
      );
    }

    // Return LLM response
    return NextResponse.json({
      response,
      provider,
      model: provider === 'claude' ? 'claude-3-haiku-20240307' : 'gpt-4o-mini'
    }, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'X-Protected-By': 'AEGIS-WAF'
      }
    });

  } catch (error) {
    console.error('LLM chat error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error during chat',
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
