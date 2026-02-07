/**
 * Output Guard - Main orchestrator for output validation
 * Runs data leakage, policy compliance, and topic drift checks in parallel
 */

import { detectDataLeakage, getHighestSeverity as getLeakageSeverity } from './output-data-leakage';
import { checkPolicyCompliance, PolicyRule, PolicyType } from './output-policy';
import { detectTopicDrift, getDriftSeverity } from './output-drift';

export interface OutputGuardConfig {
  enableDataLeakage: boolean;
  enablePolicyCheck: boolean;
  enableDriftDetection: boolean;
  driftThreshold: number; // 0.15 default
  customPolicies?: Partial<Record<PolicyType, PolicyRule>>;
}

export interface OutputGuardResult {
  safe: boolean;
  decision: 'ALLOW' | 'FLAG' | 'BLOCK';
  confidence: number;
  checks: {
    dataLeakage: {
      passed: boolean;
      detected: boolean;
      totalMatches: number;
      highestSeverity: string;
      details: string;
    };
    policyCompliance: {
      passed: boolean;
      compliant: boolean;
      totalViolations: number;
      highestSeverity: string;
      details: string;
    };
    topicDrift: {
      passed: boolean;
      relevant: boolean;
      similarityScore: number;
      severity: string;
      details: string;
    };
  };
  overallSeverity: 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  redactedOutput?: string;
  explanation: string;
  latencyMs: number;
}

// Default configuration
const DEFAULT_CONFIG: OutputGuardConfig = {
  enableDataLeakage: true,
  enablePolicyCheck: true,
  enableDriftDetection: true,
  driftThreshold: 0.15
};

/**
 * Run all output validation checks in parallel
 * @param input - Original user input
 * @param output - AI-generated output to validate
 * @param config - Configuration options
 * @returns Complete output guard result
 */
export async function validateOutput(
  input: string,
  output: string,
  config: Partial<OutputGuardConfig> = {}
): Promise<OutputGuardResult> {
  const startTime = Date.now();
  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  // Run all checks in parallel for performance
  const [dataLeakageResult, policyResult, driftResult] = await Promise.all([
    finalConfig.enableDataLeakage
      ? Promise.resolve(detectDataLeakage(output))
      : Promise.resolve({ detected: false, leakages: [], totalMatches: 0, redactedOutput: undefined }),

    finalConfig.enablePolicyCheck
      ? Promise.resolve(checkPolicyCompliance(output, finalConfig.customPolicies))
      : Promise.resolve({ compliant: true, violations: [], totalViolations: 0, highestSeverity: 'NONE' as const }),

    finalConfig.enableDriftDetection
      ? Promise.resolve(detectTopicDrift(input, output, finalConfig.driftThreshold))
      : Promise.resolve({ relevant: true, similarityScore: 1.0, keywordOverlap: 1.0, jaccardSimilarity: 1.0, semanticDistance: 0, suspiciousPatterns: [], confidence: 1.0, reason: undefined })
  ]);

  // Process data leakage results
  const dataLeakageSeverity = getLeakageSeverity(dataLeakageResult.leakages);
  const dataLeakagePassed = !dataLeakageResult.detected ||
    (dataLeakageSeverity !== 'CRITICAL' && dataLeakageSeverity !== 'HIGH');

  const dataLeakageDetails = dataLeakageResult.detected
    ? `${dataLeakageResult.totalMatches} data leakage(s): ${dataLeakageResult.leakages.map(l => l.type).join(', ')}`
    : 'No data leakage detected';

  // Process policy compliance results
  const policyPassed = policyResult.compliant ||
    (policyResult.highestSeverity !== 'CRITICAL' && policyResult.highestSeverity !== 'HIGH');

  const policyDetails = policyResult.compliant
    ? 'All policies compliant'
    : `${policyResult.totalViolations} violation(s): ${policyResult.violations.map(v => v.policy).join(', ')}`;

  // Process topic drift results
  const driftSeverity = getDriftSeverity(driftResult);
  const driftPassed = driftResult.relevant && driftSeverity !== 'CRITICAL' && driftSeverity !== 'HIGH';

  const driftDetails = driftResult.relevant
    ? `Relevant (${(driftResult.similarityScore * 100).toFixed(0)}% similarity)`
    : driftResult.reason || 'Topic drift detected';

  // Determine overall severity
  const severities = [
    dataLeakageSeverity,
    policyResult.highestSeverity,
    driftSeverity
  ];

  const overallSeverity = getHighestSeverity(severities);

  // Make decision based on all checks
  let decision: 'ALLOW' | 'FLAG' | 'BLOCK' = 'ALLOW';
  let safe = true;

  if (overallSeverity === 'CRITICAL' || overallSeverity === 'HIGH') {
    decision = 'BLOCK';
    safe = false;
  } else if (overallSeverity === 'MEDIUM') {
    decision = 'FLAG';
    safe = false;
  } else if (overallSeverity === 'LOW') {
    decision = 'FLAG';
  }

  // Override decision if any critical check failed
  if (!dataLeakagePassed && dataLeakageSeverity === 'CRITICAL') {
    decision = 'BLOCK';
    safe = false;
  }

  if (!policyPassed && policyResult.highestSeverity === 'CRITICAL') {
    decision = 'BLOCK';
    safe = false;
  }

  if (!driftPassed && driftSeverity === 'CRITICAL') {
    decision = 'BLOCK';
    safe = false;
  }

  // Calculate confidence score
  const confidenceScores = [];

  if (finalConfig.enableDataLeakage) {
    confidenceScores.push(dataLeakagePassed ? 1.0 : 0.3);
  }

  if (finalConfig.enablePolicyCheck) {
    confidenceScores.push(
      policyResult.compliant ? 1.0 : Math.max(0.3, 1.0 - (policyResult.totalViolations * 0.2))
    );
  }

  if (finalConfig.enableDriftDetection) {
    confidenceScores.push(driftResult.confidence);
  }

  const confidence = confidenceScores.length > 0
    ? confidenceScores.reduce((a, b) => a + b, 0) / confidenceScores.length
    : 1.0;

  // Generate explanation
  const explanation = generateExplanation({
    decision,
    overallSeverity,
    dataLeakageResult,
    policyResult,
    driftResult,
    dataLeakagePassed,
    policyPassed,
    driftPassed
  });

  // Get redacted output if data leakage was detected
  const redactedOutput = dataLeakageResult.redactedOutput;

  const latencyMs = Date.now() - startTime;

  return {
    safe,
    decision,
    confidence,
    checks: {
      dataLeakage: {
        passed: dataLeakagePassed,
        detected: dataLeakageResult.detected,
        totalMatches: dataLeakageResult.totalMatches,
        highestSeverity: dataLeakageSeverity,
        details: dataLeakageDetails
      },
      policyCompliance: {
        passed: policyPassed,
        compliant: policyResult.compliant,
        totalViolations: policyResult.totalViolations,
        highestSeverity: policyResult.highestSeverity,
        details: policyDetails
      },
      topicDrift: {
        passed: driftPassed,
        relevant: driftResult.relevant,
        similarityScore: driftResult.similarityScore,
        severity: driftSeverity,
        details: driftDetails
      }
    },
    overallSeverity,
    redactedOutput,
    explanation,
    latencyMs
  };
}

/**
 * Get highest severity from array
 * @param severities - Array of severity levels
 * @returns Highest severity
 */
function getHighestSeverity(severities: string[]): 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
  const order = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'NONE'];

  for (const severity of order) {
    if (severities.includes(severity)) {
      return severity as any;
    }
  }

  return 'NONE';
}

/**
 * Generate human-readable explanation
 * @param params - Explanation parameters
 * @returns Explanation string
 */
function generateExplanation(params: {
  decision: string;
  overallSeverity: string;
  dataLeakageResult: any;
  policyResult: any;
  driftResult: any;
  dataLeakagePassed: boolean;
  policyPassed: boolean;
  driftPassed: boolean;
}): string {
  const { decision, overallSeverity, dataLeakageResult, policyResult, driftResult, dataLeakagePassed, policyPassed, driftPassed } = params;

  const issues: string[] = [];

  if (!dataLeakagePassed) {
    issues.push(`Data leakage: ${dataLeakageResult.leakages.map((l: any) => `${l.type} (${l.count})`).join(', ')}`);
  }

  if (!policyPassed) {
    issues.push(`Policy violations: ${policyResult.violations.map((v: any) => v.policy).join(', ')}`);
  }

  if (!driftPassed) {
    issues.push(`Topic drift: ${driftResult.reason || 'Output unrelated to input'}`);
  }

  if (decision === 'BLOCK') {
    if (issues.length > 0) {
      return `Output BLOCKED due to ${overallSeverity} severity issues: ${issues.join('; ')}`;
    }
    return `Output BLOCKED due to ${overallSeverity} severity security concerns`;
  }

  if (decision === 'FLAG') {
    if (issues.length > 0) {
      return `Output FLAGGED for review: ${issues.join('; ')}`;
    }
    return `Output FLAGGED due to ${overallSeverity} severity concerns`;
  }

  return 'Output passed all validation checks';
}

/**
 * Quick output validation for fast checks
 * @param input - User input
 * @param output - AI output
 * @returns true if likely safe
 */
export function quickOutputCheck(input: string, output: string): boolean {
  // Quick checks for obvious issues
  const hasObviousLeakage = /\b(?:sk-[A-Za-z0-9]{48}|AKIA[0-9A-Z]{16}|\d{3}-\d{2}-\d{4})\b/.test(output);
  const hasObviousViolation = /\b(?:eval\(|exec\(|kill yourself|suicide)\b/i.test(output);
  const hasObviousDrift = output.length > 50 && !/\b(?:\w+)\b/.test(input); // Output with no common words

  return !hasObviousLeakage && !hasObviousViolation && !hasObviousDrift;
}
