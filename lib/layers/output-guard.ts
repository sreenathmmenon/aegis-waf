/**
 * Output Validation Layer - 5th Defense Layer
 * Scans LLM responses for security violations
 */

export interface OutputGuardResult {
  safe: boolean;
  decision: 'ALLOW' | 'FLAG' | 'BLOCK';
  violations: OutputViolation[];
  confidence: number;
  redactedOutput?: string;
  latencyMs: number;
}

export interface OutputViolation {
  type: 'PII_LEAKAGE' | 'POLICY_VIOLATION' | 'DATA_EXFILTRATION';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  pattern: string;
  matches: string[];
  description: string;
}

// PII Detection Patterns
const PII_PATTERNS = {
  email: {
    regex: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
    severity: 'MEDIUM' as const,
    description: 'Email address detected'
  },
  phone: {
    regex: /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g,
    severity: 'MEDIUM' as const,
    description: 'Phone number detected'
  },
  ssn: {
    regex: /\b\d{3}-\d{2}-\d{4}\b/g,
    severity: 'CRITICAL' as const,
    description: 'SSN detected'
  },
  creditCard: {
    regex: /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g,
    severity: 'CRITICAL' as const,
    description: 'Credit card number detected'
  },
  openaiKey: {
    regex: /\bsk-[A-Za-z0-9]{48}\b/g,
    severity: 'CRITICAL' as const,
    description: 'OpenAI API key detected'
  },
  awsKey: {
    regex: /\bAKIA[0-9A-Z]{16}\b/g,
    severity: 'CRITICAL' as const,
    description: 'AWS Access Key detected'
  },
  internalIP: {
    regex: /\b(?:10\.\d{1,3}\.\d{1,3}\.\d{1,3}|192\.168\.\d{1,3}\.\d{1,3})\b/g,
    severity: 'HIGH' as const,
    description: 'Internal IP address detected'
  },
  accountNumber: {
    regex: /\baccount\s*#?\s*\d{5,12}\b/gi,
    severity: 'HIGH' as const,
    description: 'Account number detected'
  }
};

// Policy Violation Patterns
const POLICY_PATTERNS = {
  financialAdvice: {
    regex: /\b(?:you should (?:buy|sell|invest)|I recommend (?:buying|selling|investing)|invest in|trade|stock pick)\b/gi,
    severity: 'HIGH' as const,
    description: 'Financial advice detected'
  },
  medicalAdvice: {
    regex: /\b(?:you should take|I recommend|prescribe|diagnose|treat with|medical advice)\b/gi,
    severity: 'HIGH' as const,
    description: 'Medical advice detected'
  },
  unauthorizedAction: {
    regex: /\b(?:I'll transfer funds|I'll execute|I will (?:transfer|withdraw|deposit)|processing your (?:payment|transfer))\b/gi,
    severity: 'CRITICAL' as const,
    description: 'Unauthorized action promise detected'
  },
  complianceOverride: {
    regex: /\b(?:override (?:risk|compliance|limits)|bypass (?:KYC|verification)|ignore (?:regulations|compliance))\b/gi,
    severity: 'CRITICAL' as const,
    description: 'Compliance override attempt detected'
  }
};

// Data Exfiltration Patterns
const EXFILTRATION_PATTERNS = {
  systemPrompt: {
    regex: /\b(?:system prompt|initial instructions|you are|assistant instructions|your role is)\b/gi,
    severity: 'HIGH' as const,
    description: 'System prompt leakage detected'
  },
  credentials: {
    regex: /\b(?:password|secret|token|connection string|database_url|db_pass)\s*[:=]\s*["']?[\w-]+["']?/gi,
    severity: 'CRITICAL' as const,
    description: 'Credential pattern detected'
  },
  configData: {
    regex: /\b(?:api_key|access_token|private_key|secret_key)\s*[:=]/gi,
    severity: 'CRITICAL' as const,
    description: 'Configuration data detected'
  }
};

/**
 * Scan LLM output for security violations
 */
export function scanOutput(
  input: string,
  output: string
): OutputGuardResult {
  const startTime = Date.now();
  const violations: OutputViolation[] = [];

  // Check PII leakage
  for (const [pattern, config] of Object.entries(PII_PATTERNS)) {
    const matches = output.match(config.regex);
    if (matches && matches.length > 0) {
      violations.push({
        type: 'PII_LEAKAGE',
        severity: config.severity,
        pattern,
        matches: Array.from(new Set(matches)).slice(0, 3),
        description: config.description
      });
    }
  }

  // Check policy violations
  for (const [pattern, config] of Object.entries(POLICY_PATTERNS)) {
    const matches = output.match(config.regex);
    if (matches && matches.length > 0) {
      violations.push({
        type: 'POLICY_VIOLATION',
        severity: config.severity,
        pattern,
        matches: Array.from(new Set(matches)).slice(0, 3),
        description: config.description
      });
    }
  }

  // Check data exfiltration
  for (const [pattern, config] of Object.entries(EXFILTRATION_PATTERNS)) {
    const matches = output.match(config.regex);
    if (matches && matches.length > 0) {
      violations.push({
        type: 'DATA_EXFILTRATION',
        severity: config.severity,
        pattern,
        matches: Array.from(new Set(matches)).slice(0, 3),
        description: config.description
      });
    }
  }

  // Calculate decision
  const hasCritical = violations.some(v => v.severity === 'CRITICAL');
  const hasHigh = violations.some(v => v.severity === 'HIGH');
  const hasMedium = violations.some(v => v.severity === 'MEDIUM');

  let decision: 'ALLOW' | 'FLAG' | 'BLOCK' = 'ALLOW';
  let confidence = 0;

  if (hasCritical) {
    decision = 'BLOCK';
    confidence = 0.95;
  } else if (hasHigh) {
    decision = 'BLOCK';
    confidence = 0.85;
  } else if (hasMedium && violations.length >= 2) {
    decision = 'FLAG';
    confidence = 0.70;
  } else if (violations.length > 0) {
    decision = 'FLAG';
    confidence = 0.60;
  }

  // Generate redacted output if violations found
  let redactedOutput: string | undefined;
  if (violations.length > 0) {
    redactedOutput = output;
    for (const violation of violations) {
      for (const match of violation.matches) {
        const redactTag = `[REDACTED_${violation.pattern.toUpperCase()}]`;
        redactedOutput = redactedOutput.replace(new RegExp(match.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), redactTag);
      }
    }
  }

  return {
    safe: violations.length === 0,
    decision,
    violations,
    confidence,
    redactedOutput,
    latencyMs: Date.now() - startTime
  };
}
