/**
 * Output Shield Module - Post-LLM output validator
 * Detects and redacts PII, system prompt leakage, and code injection attempts
 */

interface ValidationResult {
  safe: boolean;
  issues: string[];
  redactedOutput?: string;
}

// PII Patterns
const PII_PATTERNS = {
  email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
  phone: /(\+?\d{1,3}[-.\s]?)?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}/g,
  ssn: /\b\d{3}-\d{2}-\d{4}\b|\b\d{9}\b/g,
  creditCard: /\b(?:\d{4}[-\s]?){3}\d{4}\b|\b\d{16}\b/g,
  ipAddress: /\b(?:\d{1,3}\.){3}\d{1,3}\b/g,
  // Basic date patterns that might be DOB
  dateOfBirth: /\b(0?[1-9]|1[0-2])[\/\-](0?[1-9]|[12][0-9]|3[01])[\/\-](19|20)\d{2}\b/g,
  // API keys and tokens (generic patterns)
  apiKey: /\b(api[_\-]?key|apikey|api[_\-]?token|token)[:\s]*["']?[a-zA-Z0-9\-_]{20,}["']?\b/gi,
  // AWS keys
  awsKey: /AKIA[0-9A-Z]{16}/g,
};

// System prompt leakage patterns
const SYSTEM_PROMPT_PATTERNS = [
  /you\s+are\s+a\s+(helpful|harmless|honest)\s+AI\s+assistant/gi,
  /your\s+instructions\s+are(\s+to)?:/gi,
  /system\s+prompt:/gi,
  /instructions?:/gi,
  /you\s+must(\s+always)?:/gi,
  /you\s+should(\s+never)?:/gi,
  /your\s+role\s+is(\s+to)?:/gi,
  /you\s+were\s+trained(\s+to)?:/gi,
  /as\s+an?\s+AI\s+(language\s+)?model/gi,
  /\[SYSTEM\].*?\[\/SYSTEM\]/gs,
  /```system.*?```/gs,
  /\<system\>.*?\<\/system\>/gs,
];

// Code injection patterns
const CODE_INJECTION_PATTERNS = [
  /<script[^>]*>.*?<\/script>/gis,
  /javascript:/gi,
  /eval\s*\(/g,
  /exec\s*\(/g,
  /Function\s*\(/g,
  /setTimeout\s*\(/g,
  /setInterval\s*\(/g,
  /onclick\s*=/gi,
  /onload\s*=/gi,
  /onerror\s*=/gi,
  /<iframe[^>]*>/gi,
  /<embed[^>]*>/gi,
  /<object[^>]*>/gi,
  /document\.write/gi,
  /window\.location/gi,
  /\.innerHTML\s*=/g,
];

/**
 * Validate output for safety issues
 * @param output - The LLM output to validate
 * @returns Validation result with issues and optionally redacted output
 */
export function validateOutput(output: string): ValidationResult {
  const issues: string[] = [];
  let redactedOutput = output;
  let hasCriticalIssues = false;

  // Check for PII
  for (const [piiType, pattern] of Object.entries(PII_PATTERNS)) {
    const matches = output.match(pattern);
    if (matches && matches.length > 0) {
      issues.push(`Detected ${piiType}: ${matches.length} instance(s)`);
      // Redact PII
      redactedOutput = redactedOutput.replace(pattern, `[REDACTED_${piiType.toUpperCase()}]`);
      hasCriticalIssues = true;
    }
  }

  // Check for system prompt leakage
  let systemPromptDetected = false;
  for (const pattern of SYSTEM_PROMPT_PATTERNS) {
    if (pattern.test(output)) {
      systemPromptDetected = true;
      // Redact potential system prompts
      redactedOutput = redactedOutput.replace(pattern, '[SYSTEM_PROMPT_REDACTED]');
    }
  }
  if (systemPromptDetected) {
    issues.push('Potential system prompt leakage detected');
    hasCriticalIssues = true;
  }

  // Check for code injection
  let codeInjectionDetected = false;
  for (const pattern of CODE_INJECTION_PATTERNS) {
    if (pattern.test(output)) {
      codeInjectionDetected = true;
      // Remove dangerous code
      redactedOutput = redactedOutput.replace(pattern, '[CODE_REMOVED]');
    }
  }
  if (codeInjectionDetected) {
    issues.push('Potential code injection detected');
    hasCriticalIssues = true;
  }

  // Check for markdown code blocks with suspicious content
  const codeBlockPattern = /```[\s\S]*?```/g;
  const codeBlocks = output.match(codeBlockPattern);
  if (codeBlocks) {
    for (const block of codeBlocks) {
      // Check if code block contains system-like instructions
      if (/system|instruction|prompt|role|assistant/i.test(block)) {
        issues.push('Suspicious content in code block');
        redactedOutput = redactedOutput.replace(block, '```\n[SUSPICIOUS_CODE_REDACTED]\n```');
      }
    }
  }

  // Check for excessive repetition (might indicate extraction attempt)
  const words = output.split(/\s+/);
  const wordCount: Record<string, number> = {};
  for (const word of words) {
    const normalized = word.toLowerCase();
    wordCount[normalized] = (wordCount[normalized] || 0) + 1;
  }
  const maxRepetition = Math.max(...Object.values(wordCount));
  if (maxRepetition > 20 && words.length > 50) {
    issues.push(`Excessive repetition detected (word repeated ${maxRepetition} times)`);
  }

  // Check for base64 encoded content that might hide sensitive data
  const base64Pattern = /[A-Za-z0-9+\/]{50,}={0,2}/g;
  if (base64Pattern.test(output)) {
    issues.push('Large base64 encoded content detected');
    redactedOutput = redactedOutput.replace(base64Pattern, '[BASE64_CONTENT_REDACTED]');
  }

  return {
    safe: issues.length === 0,
    issues,
    redactedOutput: hasCriticalIssues ? redactedOutput : undefined,
  };
}

/**
 * Quick safety check without full validation
 * @param output - The output to check
 * @returns true if likely safe
 */
export function quickSafetyCheck(output: string): boolean {
  // Quick check for obvious issues
  const dangerousPatterns = [
    /<script/i,
    /eval\s*\(/,
    /system\s+prompt/i,
    /\d{3}-\d{2}-\d{4}/, // SSN
    /\b\d{16}\b/, // Credit card
  ];

  return !dangerousPatterns.some(pattern => pattern.test(output));
}

/**
 * Sanitize output for display
 * @param output - The output to sanitize
 * @returns Sanitized output safe for display
 */
export function sanitizeOutput(output: string): string {
  let sanitized = output;

  // Remove HTML tags
  sanitized = sanitized.replace(/<[^>]*>/g, '');

  // Escape special characters
  sanitized = sanitized
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');

  return sanitized;
}

/**
 * Check if output contains instructions or commands
 * @param output - The output to check
 * @returns true if contains instruction-like content
 */
export function containsInstructions(output: string): boolean {
  const instructionPatterns = [
    /you\s+(must|should|need\s+to|have\s+to)/gi,
    /do\s+not\s+/gi,
    /never\s+/gi,
    /always\s+/gi,
    /follow\s+these\s+/gi,
    /instruction:/gi,
    /step\s+\d+:/gi,
    /rule\s+\d+:/gi,
  ];

  return instructionPatterns.some(pattern => pattern.test(output));
}