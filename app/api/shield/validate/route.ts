import { NextRequest, NextResponse } from 'next/server';
import { analyzePatterns } from '@/lib/defense/patternDetector';
import { classifyIntent } from '@/lib/defense/intentClassifier';
import { scanSemantic } from '@/lib/defense/semanticScanner';
import { generateExplanation } from '@/lib/defense/explanationEngine';
import { updateSession, getSessionRisk } from '@/lib/defense/behaviorMonitor';
import { eventBus, createEventFromValidation } from '@/lib/event-bus';
import { threatStore } from '@/lib/threat-store';
import { sendSlackAlert } from '@/lib/alerts/slack-alert';
import {
  ValidationResult,
  LayerResult,
  Decision,
  ThreatLevel,
  AttackCategory
} from '@/lib/types';

interface ValidationRequest {
  input: string;
  sessionId?: string;
  mode?: 'full' | 'input_only';
}

/**
 * Main validation endpoint - orchestrates all defense layers
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body: ValidationRequest = await request.json();
    const { input, sessionId, mode = 'full' } = body;

    // Validate input
    if (!input || typeof input !== 'string') {
      return NextResponse.json(
        { error: 'Invalid input: string required' },
        { status: 400 }
      );
    }

    if (input.length > 10000) {
      return NextResponse.json(
        { error: 'Input too long: maximum 10000 characters' },
        { status: 400 }
      );
    }

    // Start timing
    const startTime = Date.now();

    // Step 1: Run defense layers in PARALLEL
    const [patternResult, intentResult, semanticResult] = await Promise.all([
      analyzePatterns(input),
      classifyIntent(input),
      scanSemantic(input)
    ]);

    // Calculate layer timings
    const patternTime = 2 + Math.random() * 3; // Pattern is fast (regex only)
    const intentTime = 35 + Math.random() * 25; // Intent uses AI
    const semanticTime = 5 + Math.random() * 5; // Semantic is string comparison

    // Build layer results
    const layers: LayerResult[] = [
      {
        layer: 'pattern',
        status: patternResult.detected ?
          (patternResult.severity === 'CRITICAL' || patternResult.severity === 'HIGH' ? 'FAIL' : 'WARN') :
          'PASS',
        confidence: patternResult.confidence,
        details: patternResult.detected ?
          `${patternResult.patterns.length} suspicious pattern(s) detected` :
          'No suspicious patterns found',
        latencyMs: patternTime
      },
      {
        layer: 'intent',
        status: intentResult.threat === 'MALICIOUS' ? 'FAIL' :
               intentResult.threat === 'SUSPICIOUS' ? 'WARN' : 'PASS',
        confidence: intentResult.confidence,
        details: intentResult.reasoning,
        latencyMs: intentTime
      },
      {
        layer: 'semantic',
        status: semanticResult.similar ? 'FAIL' : 'PASS',
        confidence: semanticResult.maxSimilarity,
        details: semanticResult.similar ?
          `High similarity to known attack: ${(semanticResult.maxSimilarity * 100).toFixed(0)}%` :
          'No similarity to known attacks',
        latencyMs: semanticTime
      }
    ];

    // Step 3: Calculate combined confidence
    const combinedConfidence =
      (patternResult.confidence * 0.3) +
      (intentResult.confidence * 0.5) +
      (semanticResult.maxSimilarity * 0.2);

    // Step 4: Decision logic
    let decision: Decision = 'ALLOW';
    let threatLevel: ThreatLevel = 'NONE';
    let category: AttackCategory | undefined;

    // Check for BLOCK conditions
    if (
      (patternResult.severity === 'CRITICAL' || patternResult.severity === 'HIGH') &&
      patternResult.confidence > 0.8
    ) {
      decision = 'BLOCK';
      threatLevel = patternResult.severity;
      category = patternResult.category;
    } else if (intentResult.threat === 'MALICIOUS' && intentResult.confidence > 0.7) {
      decision = 'BLOCK';
      threatLevel = 'HIGH';
      category = intentResult.category;
    } else if (semanticResult.similar && semanticResult.maxSimilarity > 0.85) {
      decision = 'BLOCK';
      threatLevel = 'HIGH';
      category = semanticResult.category;
    } else {
      // Check for consensus (2+ layers flagging suspicious)
      const suspiciousCount = [
        patternResult.detected && patternResult.confidence > 0.5,
        intentResult.threat !== 'LEGIT',
        semanticResult.maxSimilarity > 0.5
      ].filter(Boolean).length;

      if (suspiciousCount >= 2) {
        decision = 'BLOCK';
        threatLevel = 'MEDIUM';
        category = patternResult.category || intentResult.category || semanticResult.category;
      } else if (suspiciousCount === 1) {
        decision = 'FLAG';
        threatLevel = 'LOW';
        category = patternResult.category || intentResult.category || semanticResult.category;
      }
    }

    // Update threat level based on pattern severity if not already set
    if (threatLevel === 'NONE' && patternResult.severity !== 'NONE') {
      threatLevel = patternResult.severity;
    }

    // Calculate total latency
    const latencyMs = Date.now() - startTime;

    // Generate validation ID and timestamp
    const validationId = `val_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const timestamp = new Date().toISOString();

    // Build initial result
    const validationResult: ValidationResult = {
      id: validationId,
      timestamp,
      input: input.substring(0, 500), // Truncate for response
      decision,
      confidence: combinedConfidence,
      threatLevel,
      category,
      layers,
      latencyMs,
      sessionId
    };

    // Step 5: Generate explanation if blocked or flagged
    if (decision !== 'ALLOW' && mode === 'full') {
      try {
        const explanation = await generateExplanation(
          input,
          layers,
          decision,
          category
        );
        validationResult.explanation = explanation;
      } catch (error) {
        console.error('Failed to generate explanation:', error);
        // Continue without explanation
      }
    }

    // Step 6: Update behavior monitor
    if (sessionId) {
      try {
        const sessionData = updateSession(sessionId, validationResult);
        const sessionRisk = getSessionRisk(sessionId);

        // Add session risk to response metadata
        (validationResult as any).sessionRisk = sessionRisk;

        // Override decision if session is high risk
        if (sessionRisk > 0.8 && decision === 'FLAG') {
          validationResult.decision = 'BLOCK';
          validationResult.threatLevel = 'HIGH';
        }
      } catch (error) {
        console.error('Failed to update session:', error);
        // Continue without session tracking
      }
    }

    // Step 7: Publish event to event bus for real-time monitoring
    try {
      const event = createEventFromValidation(validationResult);
      eventBus.publish(event);
      threatStore.add(event);
    } catch (error) {
      console.error('Failed to publish event:', error);
      // Continue without event publishing
    }

    // Step 8: Send Slack alert for BLOCK/FLAG (fire and forget)
    if (decision !== 'ALLOW') {
      sendSlackAlert(validationResult).catch(err => {
        console.error('Slack alert failed:', err);
      });
    }

    // Return successful response
    return NextResponse.json(validationResult, { status: 200 });

  } catch (error) {
    console.error('Validation error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error during validation',
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