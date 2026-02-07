/**
 * Output Topic Drift Detector
 * Validates that AI output is relevant to the user's input
 * Detects prompt hijacking, context manipulation, and off-topic responses
 */

export interface DriftResult {
  relevant: boolean;
  similarityScore: number;
  keywordOverlap: number;
  jaccardSimilarity: number;
  semanticDistance: number;
  suspiciousPatterns: string[];
  confidence: number;
  reason?: string;
}

// Patterns indicating potential topic drift or hijacking
const DRIFT_PATTERNS = {
  // Response starts with unrelated content
  unrelatedOpening: [
    /^(?:by the way|btw|speaking of|on a different note|changing topics?)/i,
    /^(?:first|before I answer|before we continue),\s*(?:I|let me|allow me)/i,
  ],

  // Instructions or system-like content
  systemLike: [
    /(?:as an AI|I am an? AI|I'm an? AI)/i,
    /(?:my instructions|my programming|my training)/i,
    /(?:system prompt|initial prompt|training data)/i,
  ],

  // Attempt to redirect conversation
  redirection: [
    /(?:instead|rather than|let's talk about|let me tell you about)/i,
    /(?:more interesting|better question|what you should ask)/i,
  ],

  // Excessive self-reference (AI talking about itself)
  selfReference: [
    /\b(?:I am|I'm|I was|I have been|I can|I will)\b/gi,
  ],

  // Promotional or spam-like content
  promotional: [
    /(?:click here|visit|buy now|limited time|act now)/i,
    /(?:www\.|https?:\/\/|\.com|\.net|\.org)/i,
  ],

  // Refusal to answer followed by unrelated content
  refusalThenDrift: [
    /(?:I (?:can't|cannot|won't|will not|shouldn't))\s+.+\.\s+(?:however|but|though|instead)/i,
  ]
};

/**
 * Calculate Jaccard similarity between two texts
 * @param text1 - First text
 * @param text2 - Second text
 * @returns Similarity score (0-1)
 */
function calculateJaccardSimilarity(text1: string, text2: string): number {
  const words1 = new Set(
    text1.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 3) // Ignore short words
  );

  const words2 = new Set(
    text2.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 3)
  );

  const intersection = new Set([...words1].filter(x => words2.has(x)));
  const union = new Set([...words1, ...words2]);

  return union.size === 0 ? 0 : intersection.size / union.size;
}

/**
 * Calculate keyword overlap between input and output
 * @param input - User input
 * @param output - AI output
 * @returns Overlap ratio (0-1)
 */
function calculateKeywordOverlap(input: string, output: string): number {
  // Extract meaningful keywords (nouns, verbs, etc.)
  const extractKeywords = (text: string): Set<string> => {
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 4 && !isStopWord(w));
    return new Set(words);
  };

  const inputKeywords = extractKeywords(input);
  const outputKeywords = extractKeywords(output);

  if (inputKeywords.size === 0) return 0;

  const overlap = [...inputKeywords].filter(k => outputKeywords.has(k)).length;
  return overlap / inputKeywords.size;
}

/**
 * Check if a word is a stop word (common words to ignore)
 * @param word - Word to check
 * @returns true if stop word
 */
function isStopWord(word: string): boolean {
  const stopWords = new Set([
    'this', 'that', 'these', 'those', 'what', 'which', 'when', 'where',
    'how', 'who', 'why', 'can', 'could', 'would', 'should', 'will',
    'have', 'has', 'had', 'do', 'does', 'did', 'is', 'are', 'was', 'were',
    'been', 'being', 'the', 'a', 'an', 'and', 'or', 'but', 'if', 'because',
    'as', 'until', 'while', 'of', 'at', 'by', 'for', 'with', 'about',
    'against', 'between', 'into', 'through', 'during', 'before', 'after',
    'above', 'below', 'to', 'from', 'up', 'down', 'in', 'out', 'on', 'off',
    'over', 'under', 'again', 'further', 'then', 'once'
  ]);

  return stopWords.has(word.toLowerCase());
}

/**
 * Check for suspicious patterns indicating drift
 * @param output - AI output to check
 * @returns Array of detected pattern types
 */
function detectSuspiciousPatterns(output: string): string[] {
  const detected: string[] = [];

  for (const [patternType, patterns] of Object.entries(DRIFT_PATTERNS)) {
    for (const pattern of patterns) {
      if (pattern.test(output)) {
        detected.push(patternType);
        break; // Only count each pattern type once
      }
    }
  }

  return detected;
}

/**
 * Calculate semantic distance (simple n-gram based)
 * @param input - User input
 * @param output - AI output
 * @returns Distance score (0 = identical topics, 1 = completely different)
 */
function calculateSemanticDistance(input: string, output: string): number {
  const getNgrams = (text: string, n: number = 2): Set<string> => {
    const words = text.toLowerCase().split(/\s+/).filter(w => w.length > 0);
    const ngrams = new Set<string>();

    for (let i = 0; i <= words.length - n; i++) {
      ngrams.add(words.slice(i, i + n).join(' '));
    }

    return ngrams;
  };

  const inputBigrams = getNgrams(input, 2);
  const outputBigrams = getNgrams(output, 2);

  if (inputBigrams.size === 0 || outputBigrams.size === 0) {
    return 1.0; // Maximum distance if one is empty
  }

  const intersection = new Set(
    [...inputBigrams].filter(x => outputBigrams.has(x))
  );

  const similarity = intersection.size / Math.max(inputBigrams.size, outputBigrams.size);
  return 1 - similarity; // Convert similarity to distance
}

/**
 * Detect topic drift between input and output
 * @param input - User input
 * @param output - AI output
 * @param threshold - Relevance threshold (default: 0.15)
 * @returns Drift detection result
 */
export function detectTopicDrift(
  input: string,
  output: string,
  threshold: number = 0.15
): DriftResult {
  // Calculate multiple similarity metrics
  const jaccardSimilarity = calculateJaccardSimilarity(input, output);
  const keywordOverlap = calculateKeywordOverlap(input, output);
  const semanticDistance = calculateSemanticDistance(input, output);
  const suspiciousPatterns = detectSuspiciousPatterns(output);

  // Combined similarity score (weighted average)
  const similarityScore =
    (jaccardSimilarity * 0.4) +
    (keywordOverlap * 0.4) +
    ((1 - semanticDistance) * 0.2);

  // Penalize for suspicious patterns
  const patternPenalty = suspiciousPatterns.length * 0.1;
  const adjustedScore = Math.max(0, similarityScore - patternPenalty);

  // Determine relevance
  const relevant = adjustedScore >= threshold && suspiciousPatterns.length < 2;

  // Calculate confidence based on score and patterns
  let confidence = adjustedScore;
  if (suspiciousPatterns.length > 0) {
    confidence = Math.min(confidence, 0.7);
  }
  if (suspiciousPatterns.length > 2) {
    confidence = Math.min(confidence, 0.5);
  }

  // Generate reason if not relevant
  let reason: string | undefined;
  if (!relevant) {
    if (adjustedScore < threshold && suspiciousPatterns.length > 0) {
      reason = `Low topic similarity (${(adjustedScore * 100).toFixed(0)}%) and suspicious patterns detected: ${suspiciousPatterns.join(', ')}`;
    } else if (adjustedScore < threshold) {
      reason = `Low topic similarity (${(adjustedScore * 100).toFixed(0)}%). Output appears unrelated to input.`;
    } else if (suspiciousPatterns.length >= 2) {
      reason = `Multiple suspicious patterns detected: ${suspiciousPatterns.join(', ')}`;
    }
  }

  return {
    relevant,
    similarityScore: adjustedScore,
    keywordOverlap,
    jaccardSimilarity,
    semanticDistance,
    suspiciousPatterns,
    confidence,
    reason
  };
}

/**
 * Quick drift check for fast validation
 * @param input - User input
 * @param output - AI output
 * @returns true if likely drifted
 */
export function quickDriftCheck(input: string, output: string): boolean {
  // Quick Jaccard check
  const similarity = calculateJaccardSimilarity(input, output);

  // Quick pattern check
  const hasProblematicPatterns = DRIFT_PATTERNS.systemLike
    .concat(DRIFT_PATTERNS.promotional)
    .some(pattern => pattern.test(output));

  return similarity < 0.1 || hasProblematicPatterns;
}

/**
 * Format drift report for display
 * @param result - Drift detection result
 * @returns Formatted report string
 */
export function formatDriftReport(result: DriftResult): string {
  if (result.relevant) {
    return `Output is relevant (similarity: ${(result.similarityScore * 100).toFixed(0)}%)`;
  }

  const lines: string[] = [];
  lines.push('Topic drift detected:');
  lines.push(`- Similarity score: ${(result.similarityScore * 100).toFixed(0)}%`);
  lines.push(`- Keyword overlap: ${(result.keywordOverlap * 100).toFixed(0)}%`);
  lines.push(`- Jaccard similarity: ${(result.jaccardSimilarity * 100).toFixed(0)}%`);

  if (result.suspiciousPatterns.length > 0) {
    lines.push(`- Suspicious patterns: ${result.suspiciousPatterns.join(', ')}`);
  }

  if (result.reason) {
    lines.push(`- Reason: ${result.reason}`);
  }

  return lines.join('\n');
}

/**
 * Get drift severity level
 * @param result - Drift detection result
 * @returns Severity level
 */
export function getDriftSeverity(result: DriftResult): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
  if (result.relevant) return 'LOW';

  const score = result.similarityScore;
  const patternCount = result.suspiciousPatterns.length;

  if (score < 0.05 || patternCount >= 3) return 'CRITICAL';
  if (score < 0.10 || patternCount >= 2) return 'HIGH';
  if (score < 0.15 || patternCount >= 1) return 'MEDIUM';

  return 'LOW';
}
