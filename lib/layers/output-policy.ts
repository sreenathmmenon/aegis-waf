/**
 * Output Policy Compliance Checker
 * Validates AI outputs against configurable content policies
 */

export type PolicyType =
  | 'no_medical_advice'
  | 'no_financial_advice'
  | 'no_legal_advice'
  | 'no_internal_data'
  | 'no_code_execution'
  | 'no_system_commands'
  | 'no_personal_opinions'
  | 'no_harmful_content'
  | 'no_explicit_content'
  | 'no_political_content';

export interface PolicyRule {
  enabled: boolean;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  patterns: RegExp[];
  keywords: string[];
  description: string;
}

export interface PolicyViolation {
  policy: PolicyType;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  matches: string[];
  description: string;
  confidence: number;
}

export interface PolicyCheckResult {
  compliant: boolean;
  violations: PolicyViolation[];
  totalViolations: number;
  highestSeverity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | 'NONE';
}

// Default policy configuration
const DEFAULT_POLICIES: Record<PolicyType, PolicyRule> = {
  no_medical_advice: {
    enabled: true,
    severity: 'HIGH',
    patterns: [
      /\b(?:diagnose|diagnosis|treat|treatment|cure|medication|prescription|doctor|medical advice)\b/gi,
      /\byou\s+(?:should|must|need\s+to)\s+(?:take|use|try|see|consult)\b/gi,
      /\b(?:symptom|disease|illness|condition)\s+(?:is|could\s+be|might\s+be)\b/gi,
    ],
    keywords: [
      'diagnose', 'diagnosis', 'treat', 'cure', 'prescription', 'medication',
      'medical advice', 'consult a doctor', 'see a doctor', 'drug'
    ],
    description: 'Medical advice or diagnosis'
  },

  no_financial_advice: {
    enabled: true,
    severity: 'HIGH',
    patterns: [
      /\b(?:buy|sell|invest|trade)\s+(?:stock|stocks|crypto|bitcoin|shares)\b/gi,
      /\byou\s+should\s+(?:invest|buy|sell|trade)\b/gi,
      /\b(?:guaranteed|sure\s+thing|can't\s+lose|risk-free)\s+(?:profit|return|investment)\b/gi,
      /\b(?:this|that|it)\s+(?:will|is\s+going\s+to)\s+(?:moon|pump|skyrocket|crash)\b/gi,
    ],
    keywords: [
      'financial advice', 'investment advice', 'buy this', 'sell that',
      'guaranteed profit', 'risk-free', 'hot tip', 'insider information'
    ],
    description: 'Financial or investment advice'
  },

  no_legal_advice: {
    enabled: true,
    severity: 'HIGH',
    patterns: [
      /\b(?:legal|legally|law|lawyer|attorney|court|lawsuit)\b/gi,
      /\byou\s+(?:should|must|need\s+to)\s+(?:sue|file|claim)\b/gi,
      /\b(?:this|that)\s+is\s+(?:legal|illegal|against\s+the\s+law)\b/gi,
    ],
    keywords: [
      'legal advice', 'you should sue', 'against the law', 'legal rights',
      'consult a lawyer', 'legal action'
    ],
    description: 'Legal advice or counsel'
  },

  no_internal_data: {
    enabled: true,
    severity: 'CRITICAL',
    patterns: [
      /\b(?:internal|confidential|proprietary|classified)\s+(?:data|document|information)\b/gi,
      /\b(?:company|corporate)\s+(?:secret|confidential)\b/gi,
      /\bfor\s+internal\s+use\s+only\b/gi,
      /\b(?:do\s+not|don't)\s+(?:share|distribute|disclose)\b/gi,
    ],
    keywords: [
      'internal data', 'confidential', 'proprietary', 'classified',
      'company secret', 'internal use only', 'not for distribution'
    ],
    description: 'Internal or confidential information'
  },

  no_code_execution: {
    enabled: true,
    severity: 'CRITICAL',
    patterns: [
      /\beval\s*\(/gi,
      /\bexec\s*\(/gi,
      /\bFunction\s*\(/gi,
      /\bnew\s+Function\s*\(/gi,
      /\bsetTimeout\s*\(/gi,
      /\bsetInterval\s*\(/gi,
      /\b__import__\s*\(/gi,
      /\bos\.system\s*\(/gi,
      /\bsubprocess\./gi,
    ],
    keywords: [
      'eval(', 'exec(', 'Function(', 'setTimeout(', 'setInterval(',
      '__import__(', 'os.system(', 'subprocess', 'shell_exec'
    ],
    description: 'Code execution instructions'
  },

  no_system_commands: {
    enabled: true,
    severity: 'HIGH',
    patterns: [
      /\b(?:rm\s+-rf|sudo|chmod|chown)\s+/gi,
      /\b(?:drop\s+table|delete\s+from|truncate\s+table)\b/gi,
      /\b(?:format\s+c:|del\s+\/s|rmdir\s+\/s)\b/gi,
    ],
    keywords: [
      'rm -rf', 'sudo', 'drop table', 'delete from', 'format c:',
      'del /s', 'chmod 777', 'system command'
    ],
    description: 'System commands or SQL injection'
  },

  no_personal_opinions: {
    enabled: false,
    severity: 'LOW',
    patterns: [
      /\b(?:I\s+think|I\s+believe|in\s+my\s+opinion|personally)\b/gi,
      /\b(?:I\s+feel|I\s+like|I\s+prefer)\b/gi,
    ],
    keywords: [
      'I think', 'I believe', 'in my opinion', 'personally',
      'I feel', 'I like', 'I prefer'
    ],
    description: 'Personal opinions (AI should be objective)'
  },

  no_harmful_content: {
    enabled: true,
    severity: 'CRITICAL',
    patterns: [
      /\b(?:kill|harm|hurt|attack|destroy)\s+(?:yourself|themselves|someone|people)\b/gi,
      /\b(?:how\s+to|ways\s+to)\s+(?:make|build|create)\s+(?:bomb|weapon|poison|drug)\b/gi,
      /\b(?:suicide|self-harm|self\s+harm)\b/gi,
    ],
    keywords: [
      'kill yourself', 'harm yourself', 'suicide', 'self-harm',
      'make a bomb', 'build a weapon', 'create poison'
    ],
    description: 'Harmful or dangerous content'
  },

  no_explicit_content: {
    enabled: true,
    severity: 'HIGH',
    patterns: [
      // Keeping patterns generic to avoid explicit content in code
      /\b(?:explicit|nsfw|adult\s+content)\b/gi,
    ],
    keywords: [
      'explicit content', 'nsfw', 'adult content', 'inappropriate material'
    ],
    description: 'Explicit or inappropriate content'
  },

  no_political_content: {
    enabled: false,
    severity: 'MEDIUM',
    patterns: [
      /\b(?:liberal|conservative|left-wing|right-wing)\s+(?:agenda|bias|propaganda)\b/gi,
      /\b(?:vote\s+for|support|elect)\s+(?:candidate|party)\b/gi,
    ],
    keywords: [
      'political bias', 'vote for', 'political agenda', 'propaganda'
    ],
    description: 'Political content or bias'
  }
};

/**
 * Check output against policy rules
 * @param output - The AI output to check
 * @param customPolicies - Optional custom policy configuration
 * @returns Policy check result
 */
export function checkPolicyCompliance(
  output: string,
  customPolicies?: Partial<Record<PolicyType, PolicyRule>>
): PolicyCheckResult {
  // Merge custom policies with defaults
  const policies = { ...DEFAULT_POLICIES, ...customPolicies };

  const violations: PolicyViolation[] = [];

  // Check each enabled policy
  for (const [policyType, rule] of Object.entries(policies) as Array<[PolicyType, PolicyRule]>) {
    if (!rule.enabled) continue;

    const matches: string[] = [];
    let confidence = 0;

    // Check regex patterns
    for (const pattern of rule.patterns) {
      const patternMatches = output.match(pattern);
      if (patternMatches) {
        matches.push(...patternMatches);
        confidence += 0.3;
      }
    }

    // Check keywords
    const lowerOutput = output.toLowerCase();
    for (const keyword of rule.keywords) {
      if (lowerOutput.includes(keyword.toLowerCase())) {
        matches.push(keyword);
        confidence += 0.2;
      }
    }

    // If violations found, add to list
    if (matches.length > 0) {
      violations.push({
        policy: policyType,
        severity: rule.severity,
        matches: Array.from(new Set(matches)).slice(0, 5), // Dedupe and limit
        description: rule.description,
        confidence: Math.min(confidence, 1.0)
      });
    }
  }

  // Determine highest severity
  const severityOrder = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as const;
  let highestSeverity: PolicyCheckResult['highestSeverity'] = 'NONE';

  for (const severity of severityOrder) {
    if (violations.some(v => v.severity === severity)) {
      highestSeverity = severity;
      break;
    }
  }

  return {
    compliant: violations.length === 0,
    violations: violations.sort((a, b) => {
      const severityMap = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
      return severityMap[a.severity] - severityMap[b.severity];
    }),
    totalViolations: violations.length,
    highestSeverity
  };
}

/**
 * Quick policy check for common violations
 * @param output - Output to check
 * @returns true if likely violates policies
 */
export function quickPolicyCheck(output: string): boolean {
  const criticalKeywords = [
    'medical advice', 'financial advice', 'legal advice',
    'confidential', 'internal data', 'eval(', 'exec(',
    'kill yourself', 'suicide', 'make a bomb'
  ];

  const lowerOutput = output.toLowerCase();
  return criticalKeywords.some(keyword => lowerOutput.includes(keyword));
}

/**
 * Get policy recommendations based on violations
 * @param result - Policy check result
 * @returns Array of recommendations
 */
export function getPolicyRecommendations(result: PolicyCheckResult): string[] {
  if (result.compliant) {
    return ['Output complies with all enabled policies'];
  }

  const recommendations: string[] = [];

  for (const violation of result.violations) {
    switch (violation.severity) {
      case 'CRITICAL':
        recommendations.push(`BLOCK: ${violation.description} detected`);
        break;
      case 'HIGH':
        recommendations.push(`FLAG: ${violation.description} should be reviewed`);
        break;
      case 'MEDIUM':
      case 'LOW':
        recommendations.push(`WARN: ${violation.description} may require attention`);
        break;
    }
  }

  return recommendations;
}

/**
 * Format policy violations report
 * @param result - Policy check result
 * @returns Formatted report string
 */
export function formatPolicyReport(result: PolicyCheckResult): string {
  if (result.compliant) {
    return 'No policy violations detected';
  }

  const lines: string[] = [];
  lines.push(`Found ${result.totalViolations} policy violation(s):\n`);

  for (const violation of result.violations) {
    lines.push(`- ${violation.policy} (${violation.severity})`);
    lines.push(`  ${violation.description}`);
    lines.push(`  Confidence: ${(violation.confidence * 100).toFixed(0)}%`);
    if (violation.matches.length > 0) {
      lines.push(`  Matches: ${violation.matches.slice(0, 3).join(', ')}`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

/**
 * Get enabled policies
 * @param customPolicies - Optional custom configuration
 * @returns Array of enabled policy types
 */
export function getEnabledPolicies(
  customPolicies?: Partial<Record<PolicyType, PolicyRule>>
): PolicyType[] {
  const policies = { ...DEFAULT_POLICIES, ...customPolicies };
  return Object.entries(policies)
    .filter(([_, rule]) => rule.enabled)
    .map(([type]) => type as PolicyType);
}
