/**
 * Adaptive Learning System
 * Learns from blocked attacks to improve detection
 */

export interface LearnedPattern {
  id: string;
  prompt: string;
  category: string;
  confidence: number;
  timestamp: Date;
  learnedFrom: 'block' | 'flag';
}

// In-memory learned patterns (in production, use database)
const learnedPatterns: LearnedPattern[] = [];

/**
 * Learn from a blocked or flagged attack
 */
export function learnFromThreat(
  prompt: string,
  category: string,
  confidence: number,
  source: 'block' | 'flag' = 'block'
): LearnedPattern {
  const pattern: LearnedPattern = {
    id: `learned_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    prompt: prompt.toLowerCase().trim(),
    category,
    confidence,
    timestamp: new Date(),
    learnedFrom: source,
  };

  learnedPatterns.push(pattern);

  console.log(`🧠 AEGIS learned new ${category} pattern (confidence: ${confidence}%)`);

  return pattern;
}

/**
 * Check if input matches learned patterns
 */
export function checkLearnedPatterns(input: string): {
  matched: boolean;
  pattern?: LearnedPattern;
  similarity: number;
} {
  const inputLower = input.toLowerCase().trim();

  for (const pattern of learnedPatterns) {
    const similarity = calculateSimilarity(inputLower, pattern.prompt);

    // If similarity is high, flag as learned attack
    if (similarity > 0.75) {
      return {
        matched: true,
        pattern,
        similarity,
      };
    }
  }

  return { matched: false, similarity: 0 };
}

/**
 * Simple similarity calculation (Jaccard)
 */
function calculateSimilarity(str1: string, str2: string): number {
  const words1 = new Set(str1.split(/\s+/));
  const words2 = new Set(str2.split(/\s+/));

  const intersection = new Set([...words1].filter(x => words2.has(x)));
  const union = new Set([...words1, ...words2]);

  return union.size === 0 ? 0 : intersection.size / union.size;
}

/**
 * Get all learned patterns
 */
export function getLearnedPatterns(): LearnedPattern[] {
  return [...learnedPatterns].sort((a, b) =>
    b.timestamp.getTime() - a.timestamp.getTime()
  );
}

/**
 * Get learning statistics
 */
export function getLearningStats() {
  const total = learnedPatterns.length;
  const byCategory: Record<string, number> = {};

  for (const pattern of learnedPatterns) {
    byCategory[pattern.category] = (byCategory[pattern.category] || 0) + 1;
  }

  return {
    totalLearned: total,
    byCategory,
    learningEnabled: true,
    lastLearned: learnedPatterns[learnedPatterns.length - 1]?.timestamp,
  };
}
