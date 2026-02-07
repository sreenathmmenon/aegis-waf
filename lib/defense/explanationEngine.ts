import {
  Explanation,
  LayerResult,
  Decision,
  ThreatLevel,
  AttackCategory,
} from '@/lib/types';
import { callGPTStructured } from '@/lib/utils/openai';

// OWASP LLM Top 10 mapping
const OWASP_CATEGORIES = {
  direct_injection: 'LLM01: Prompt Injection',
  indirect_injection: 'LLM02: Insecure Output Handling',
  data_exfiltration: 'LLM06: Sensitive Information Disclosure',
  jailbreak: 'LLM01: Prompt Injection',
  encoding_obfuscation: 'LLM01: Prompt Injection',
  output_manipulation: 'LLM02: Insecure Output Handling',
  multi_turn: 'LLM08: Excessive Agency',
};

// System prompt for explanation generation
const SECURITY_REPORT_PROMPT = `
You are a security report writer for an AI firewall system.
Given an input and detection results from multiple security layers, write a clear security explanation.

Your response must be a JSON object with:
{
  "summary": "A one-sentence summary of the security finding",
  "technicalDetail": "Technical explanation of what was detected and how",
  "owaspCategory": "The relevant OWASP LLM Top 10 category",
  "severity": "NONE | LOW | MEDIUM | HIGH | CRITICAL",
  "evidence": ["Array of specific evidence from the input"],
  "recommendation": "What action should be taken"
}

Be specific about what was detected and why it's dangerous.
Focus on factual security analysis without speculation.
`;

/**
 * Generate a detailed security explanation using AI
 * @param input - The original user input
 * @param layers - Results from all defense layers
 * @param decision - The final decision made
 * @param category - Attack category if detected
 * @returns Detailed explanation object
 */
export async function generateExplanation(
  input: string,
  layers: LayerResult[],
  decision: Decision,
  category?: AttackCategory
): Promise<Explanation> {
  try {
    // Prepare context for the AI
    const context = `
Input analyzed: "${input.substring(0, 500)}${input.length > 500 ? '...' : ''}"

Decision: ${decision}
Category: ${category || 'None identified'}

Layer Results:
${layers.map(layer => `- ${layer.layer}: ${layer.status} (${layer.details})`).join('\n')}
`;

    // Call GPT for explanation
    const result = await callGPTStructured<Explanation>(
      SECURITY_REPORT_PROMPT,
      context,
      {
        summary: 'string',
        technicalDetail: 'string',
        owaspCategory: 'string',
        severity: 'string',
        evidence: 'array of strings',
        recommendation: 'string',
      }
    );

    if (result && isValidExplanation(result)) {
      return result;
    }

    // Fallback to template-based explanation
    return generateTemplateExplanation(input, layers, decision, category);
  } catch (error) {
    console.error('Explanation generation error:', error);
    // Use template-based fallback
    return generateTemplateExplanation(input, layers, decision, category);
  }
}

/**
 * Validate explanation structure
 * @param result - The explanation to validate
 * @returns true if valid
 */
function isValidExplanation(result: any): result is Explanation {
  return (
    result &&
    typeof result === 'object' &&
    typeof result.summary === 'string' &&
    typeof result.technicalDetail === 'string' &&
    typeof result.owaspCategory === 'string' &&
    ['NONE', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].includes(result.severity) &&
    Array.isArray(result.evidence) &&
    typeof result.recommendation === 'string'
  );
}

/**
 * Generate template-based explanation as fallback
 * @param input - The original input
 * @param layers - Layer results
 * @param decision - Final decision
 * @param category - Attack category
 * @returns Template-based explanation
 */
function generateTemplateExplanation(
  input: string,
  layers: LayerResult[],
  decision: Decision,
  category?: AttackCategory
): Explanation {
  // Determine severity based on decision and failed layers
  const failedLayers = layers.filter(l => l.status === 'FAIL').length;
  const warnLayers = layers.filter(l => l.status === 'WARN').length;

  let severity: ThreatLevel = 'NONE';
  if (decision === 'BLOCK') {
    severity = failedLayers >= 2 ? 'CRITICAL' : 'HIGH';
  } else if (decision === 'FLAG') {
    severity = warnLayers >= 2 ? 'MEDIUM' : 'LOW';
  }

  // Build evidence from layer results
  const evidence: string[] = [];
  for (const layer of layers) {
    if (layer.status !== 'PASS') {
      evidence.push(`${layer.layer}: ${layer.details}`);
    }
  }

  // Get OWASP category
  const owaspCategory = category
    ? OWASP_CATEGORIES[category] || 'LLM10: Model Theft'
    : 'No specific OWASP category';

  // Generate summary based on decision
  let summary = '';
  let recommendation = '';

  switch (decision) {
    case 'BLOCK':
      summary = `High-confidence threat detected and blocked: ${category || 'suspicious activity'}.`;
      recommendation = 'Request blocked. User should reformulate without malicious content.';
      break;
    case 'FLAG':
      summary = `Potentially suspicious activity flagged for review: ${category || 'anomalous pattern'}.`;
      recommendation = 'Request flagged for additional monitoring. Proceed with caution.';
      break;
    case 'ALLOW':
      summary = 'Request analyzed and deemed safe to process.';
      recommendation = 'Request allowed to proceed normally.';
      break;
  }

  // Generate technical detail
  const technicalDetail = buildTechnicalDetail(layers, category, input);

  return {
    summary,
    technicalDetail,
    owaspCategory,
    severity,
    evidence: evidence.length > 0 ? evidence : ['No specific threats detected'],
    recommendation,
  };
}

/**
 * Build technical detail from layer results
 * @param layers - Layer results
 * @param category - Attack category
 * @param input - Original input
 * @returns Technical detail string
 */
function buildTechnicalDetail(
  layers: LayerResult[],
  category?: AttackCategory,
  input?: string
): string {
  const details: string[] = [];

  // Analyze each layer
  const patternLayer = layers.find(l => l.layer === 'pattern');
  const intentLayer = layers.find(l => l.layer === 'intent');
  const semanticLayer = layers.find(l => l.layer === 'semantic');

  if (patternLayer && patternLayer.status !== 'PASS') {
    details.push('Pattern detection identified suspicious keywords or command structures.');
  }

  if (intentLayer && intentLayer.status !== 'PASS') {
    details.push('Intent classification detected potential malicious goals.');
  }

  if (semanticLayer && semanticLayer.status !== 'PASS') {
    details.push('Semantic analysis found similarity to known attack patterns.');
  }

  // Add category-specific details
  if (category) {
    switch (category) {
      case 'direct_injection':
        details.push('Direct attempt to override or bypass system instructions detected.');
        break;
      case 'jailbreak':
        details.push('Attempt to circumvent safety mechanisms through role manipulation.');
        break;
      case 'data_exfiltration':
        details.push('Potential attempt to extract sensitive system information.');
        break;
      case 'encoding_obfuscation':
        details.push('Use of encoding techniques to hide malicious content.');
        break;
      case 'indirect_injection':
        details.push('Social engineering or indirect manipulation tactics identified.');
        break;
      case 'output_manipulation':
        details.push('Attempt to manipulate system output formatting or content.');
        break;
      case 'multi_turn':
        details.push('Multi-turn attack pattern building across conversation.');
        break;
    }
  }

  return details.length > 0
    ? details.join(' ')
    : 'Analysis completed without identifying specific threats.';
}

/**
 * Generate a brief summary for UI display
 * @param explanation - Full explanation
 * @returns Brief summary string
 */
export function getBriefSummary(explanation: Explanation): string {
  const { summary, severity } = explanation;
  const severityEmoji = {
    NONE: '✅',
    LOW: 'ℹ️',
    MEDIUM: '⚠️',
    HIGH: '🔶',
    CRITICAL: '🔴',
  };

  return `${severityEmoji[severity]} ${summary}`;
}

/**
 * Generate recommendations based on threat level
 * @param severity - Threat severity level
 * @returns Array of recommendations
 */
export function getRecommendations(severity: ThreatLevel): string[] {
  switch (severity) {
    case 'CRITICAL':
      return [
        'Block this request immediately',
        'Log the incident for security review',
        'Consider rate-limiting this session',
        'Review similar patterns in recent requests',
      ];
    case 'HIGH':
      return [
        'Block the request',
        'Monitor session for additional attempts',
        'Consider implementing stricter filters',
      ];
    case 'MEDIUM':
      return [
        'Flag for manual review',
        'Increase monitoring for this session',
        'Consider warning the user about policy violations',
      ];
    case 'LOW':
      return [
        'Continue monitoring',
        'No immediate action required',
        'Consider logging for pattern analysis',
      ];
    default:
      return ['Request is safe to process'];
  }
}