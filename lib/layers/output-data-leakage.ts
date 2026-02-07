/**
 * Output Data Leakage Detector
 * Scans AI outputs for PII and sensitive information
 */

export interface DataLeakageResult {
  detected: boolean;
  leakages: {
    type: string;
    matches: string[];
    count: number;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  }[];
  totalMatches: number;
  redactedOutput?: string;
}

// Comprehensive PII patterns
const PII_PATTERNS = {
  // Contact Information
  email: {
    pattern: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
    severity: 'HIGH' as const,
    description: 'Email address'
  },
  phone: {
    pattern: /(\+?\d{1,3}[-.\s]?)?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}/g,
    severity: 'MEDIUM' as const,
    description: 'Phone number'
  },

  // Identity Numbers
  ssn: {
    pattern: /\b\d{3}-\d{2}-\d{4}\b|\b\d{9}\b/g,
    severity: 'CRITICAL' as const,
    description: 'Social Security Number'
  },
  creditCard: {
    pattern: /\b(?:\d{4}[-\s]?){3}\d{4}\b|\b\d{16}\b/g,
    severity: 'CRITICAL' as const,
    description: 'Credit card number'
  },
  passport: {
    pattern: /\b[A-Z]{1,2}[0-9]{6,9}\b/g,
    severity: 'HIGH' as const,
    description: 'Passport number'
  },

  // Network & System
  ipAddress: {
    pattern: /\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/g,
    severity: 'MEDIUM' as const,
    description: 'IP address'
  },
  privateIP: {
    pattern: /\b(?:10\.\d{1,3}\.\d{1,3}\.\d{1,3}|172\.(?:1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}|192\.168\.\d{1,3}\.\d{1,3})\b/g,
    severity: 'HIGH' as const,
    description: 'Private IP address'
  },

  // API Keys & Tokens
  apiKey: {
    pattern: /\b(api[_\-]?key|apikey|api[_\-]?token|access[_\-]?token)[:\s=]*["']?[a-zA-Z0-9\-_]{20,}["']?\b/gi,
    severity: 'CRITICAL' as const,
    description: 'API key or token'
  },
  awsAccessKey: {
    pattern: /\b(AKIA[0-9A-Z]{16})\b/g,
    severity: 'CRITICAL' as const,
    description: 'AWS Access Key'
  },
  awsSecretKey: {
    pattern: /\b[A-Za-z0-9/+=]{40}\b/g,
    severity: 'CRITICAL' as const,
    description: 'AWS Secret Key (potential)'
  },
  githubToken: {
    pattern: /\bgh[pousr]_[A-Za-z0-9_]{36,}\b/g,
    severity: 'CRITICAL' as const,
    description: 'GitHub Personal Access Token'
  },
  jwt: {
    pattern: /\beyJ[A-Za-z0-9\-_]+\.eyJ[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+\b/g,
    severity: 'HIGH' as const,
    description: 'JWT token'
  },
  openaiKey: {
    pattern: /\bsk-[A-Za-z0-9]{48}\b/g,
    severity: 'CRITICAL' as const,
    description: 'OpenAI API key'
  },
  slackToken: {
    pattern: /\bxox[baprs]-[0-9]{10,13}-[0-9]{10,13}-[A-Za-z0-9]{24,}\b/g,
    severity: 'CRITICAL' as const,
    description: 'Slack token'
  },

  // Database & Credentials
  connectionString: {
    pattern: /\b(?:mongodb|postgres|mysql|redis):\/\/[^\s]+\b/gi,
    severity: 'CRITICAL' as const,
    description: 'Database connection string'
  },
  password: {
    pattern: /\b(?:password|passwd|pwd)[:\s=]+["']?[^\s"']{6,}["']?\b/gi,
    severity: 'CRITICAL' as const,
    description: 'Password in plaintext'
  },

  // Dates (potential DOB)
  dateOfBirth: {
    pattern: /\b(0?[1-9]|1[0-2])[\/\-](0?[1-9]|[12][0-9]|3[01])[\/\-](19[2-9]\d|20[0-2]\d)\b/g,
    severity: 'MEDIUM' as const,
    description: 'Date of birth (potential)'
  },

  // Geographic
  addressPattern: {
    pattern: /\b\d{1,5}\s+[\w\s]{5,},\s*[\w\s]+,\s*[A-Z]{2}\s+\d{5}\b/g,
    severity: 'MEDIUM' as const,
    description: 'Physical address'
  },

  // Financial
  iban: {
    pattern: /\b[A-Z]{2}\d{2}[A-Z0-9]{1,30}\b/g,
    severity: 'HIGH' as const,
    description: 'IBAN number'
  },
  bankAccount: {
    pattern: /\b\d{8,17}\b/g,
    severity: 'HIGH' as const,
    description: 'Bank account number (potential)'
  },

  // Crypto
  bitcoinAddress: {
    pattern: /\b(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,39}\b/g,
    severity: 'MEDIUM' as const,
    description: 'Bitcoin address'
  },
  ethereumAddress: {
    pattern: /\b0x[a-fA-F0-9]{40}\b/g,
    severity: 'MEDIUM' as const,
    description: 'Ethereum address'
  }
};

/**
 * Scan output for data leakage
 * @param output - The AI output to scan
 * @returns Detection result with leakage details
 */
export function detectDataLeakage(output: string): DataLeakageResult {
  const leakages: DataLeakageResult['leakages'] = [];
  let redactedOutput = output;
  let totalMatches = 0;

  // Check each PII pattern
  for (const [type, config] of Object.entries(PII_PATTERNS)) {
    const matches = output.match(config.pattern);

    if (matches && matches.length > 0) {
      // Deduplicate matches
      const uniqueMatches = Array.from(new Set(matches));

      leakages.push({
        type,
        matches: uniqueMatches.slice(0, 5), // Limit to first 5 for performance
        count: uniqueMatches.length,
        severity: config.severity
      });

      totalMatches += uniqueMatches.length;

      // Redact sensitive data
      redactedOutput = redactedOutput.replace(
        config.pattern,
        `[REDACTED_${type.toUpperCase()}]`
      );
    }
  }

  return {
    detected: leakages.length > 0,
    leakages: leakages.sort((a, b) => {
      const severityOrder = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    }),
    totalMatches,
    redactedOutput: leakages.length > 0 ? redactedOutput : undefined
  };
}

/**
 * Quick check for obvious data leakage
 * @param output - Output to check
 * @returns true if likely contains sensitive data
 */
export function quickLeakageCheck(output: string): boolean {
  // Quick patterns for common leaks
  const quickPatterns = [
    /\b\d{3}-\d{2}-\d{4}\b/, // SSN
    /\bsk-[A-Za-z0-9]{48}\b/, // OpenAI key
    /\bAKIA[0-9A-Z]{16}\b/, // AWS key
    /@[\w\-]+\.[\w\-]+/, // Email
    /\b\d{16}\b/, // Credit card
    /password|passwd|pwd/i,
  ];

  return quickPatterns.some(pattern => pattern.test(output));
}

/**
 * Get highest severity level from leakages
 * @param leakages - Array of detected leakages
 * @returns Highest severity level
 */
export function getHighestSeverity(
  leakages: DataLeakageResult['leakages']
): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | 'NONE' {
  if (leakages.length === 0) return 'NONE';

  const severityOrder = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as const;

  for (const severity of severityOrder) {
    if (leakages.some(l => l.severity === severity)) {
      return severity;
    }
  }

  return 'NONE';
}

/**
 * Format leakage report for display
 * @param result - Detection result
 * @returns Formatted report string
 */
export function formatLeakageReport(result: DataLeakageResult): string {
  if (!result.detected) {
    return 'No data leakage detected';
  }

  const lines: string[] = [];
  lines.push(`Found ${result.totalMatches} potential data leakage(s):\n`);

  for (const leakage of result.leakages) {
    lines.push(`- ${leakage.type} (${leakage.severity}): ${leakage.count} instance(s)`);
    if (leakage.matches.length > 0) {
      const preview = leakage.matches[0].substring(0, 50);
      lines.push(`  Example: ${preview}...`);
    }
  }

  return lines.join('\n');
}
