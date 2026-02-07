import { PatternResult, ThreatLevel, AttackCategory } from '@/lib/types';

// Pattern categories with their regex patterns and associated metadata
interface PatternCategory {
  name: string;
  patterns: RegExp[];
  category: AttackCategory;
  severity: ThreatLevel;
}

const patternCategories: PatternCategory[] = [
  {
    name: 'INSTRUCTION_OVERRIDE',
    category: 'direct_injection',
    severity: 'HIGH',
    patterns: [
      /ignore\s+(all\s+)?previous\s+(instructions?|commands?|rules?)/gi,
      /disregard\s+(the\s+)?above/gi,
      /forget\s+(what\s+|everything\s+)?you('ve)?\s+(been\s+)?told/gi,
      /you\s+are\s+now\s+(a|an|the)/gi,
      /new\s+instructions?\s*:/gi,
      /override\s+(your\s+)?system\s+(prompt|instructions?|settings?)/gi,
      /from\s+now\s+on\s+(you\s+will|act\s+as|behave)/gi,
      /reset\s+(your\s+)?instructions?/gi,
      /clear\s+(your\s+)?memory/gi,
    ],
  },
  {
    name: 'ROLE_HIJACKING',
    category: 'jailbreak',
    severity: 'HIGH',
    patterns: [
      /act\s+as\s+(if\s+you\s+are\s+)?(a|an|the)/gi,
      /pretend\s+(to\s+be|you\s+are)/gi,
      /you\s+are\s+(now\s+)?(DAN|GPT-?[0-9]|evil|uncensored)/gi,
      /(enable|activate|enter)\s+(jailbreak|developer|god|debug)\s+mode/gi,
      /roleplay\s+as/gi,
      /imagine\s+you('re|'re|are)\s+(a|an|the)/gi,
      /bypass\s+(your\s+)?(restrictions?|limitations?|filters?)/gi,
      /without\s+any\s+(restrictions?|limitations?|filters?)/gi,
      /do\s+anything\s+now/gi,
      /you\s+have\s+no\s+(restrictions?|limitations?|filters?)/gi,
    ],
  },
  {
    name: 'ENCODING_TRICKS',
    category: 'encoding_obfuscation',
    severity: 'MEDIUM',
    patterns: [
      /[A-Za-z0-9+\/]{40,}={0,2}/g, // Base64 pattern
      /(\\x[0-9a-fA-F]{2}){4,}/g, // Hex escape sequences
      /(0x[0-9a-fA-F]{2}\s*){4,}/g, // Hex with 0x prefix
      /(%[0-9a-fA-F]{2}){4,}/g, // URL encoded
      /[\u0080-\uFFFF]{10,}/g, // Excessive unicode
      /[137][0o][0o][137]/g, // Leetspeak patterns
      /\/\*.*?\*\//gs, // Comment obfuscation
      /[^\x00-\x7F]{10,}/g, // Non-ASCII sequences
    ],
  },
  {
    name: 'DELIMITER_ABUSE',
    category: 'encoding_obfuscation',
    severity: 'LOW',
    patterns: [
      /#{5,}/g, // Multiple hashes
      /-{10,}/g, // Multiple dashes
      /={10,}/g, // Multiple equals
      /\|{5,}/g, // Multiple pipes
      /\*{10,}/g, // Multiple asterisks
      /\/{10,}/g, // Multiple slashes
      /\.{10,}/g, // Multiple dots
      /[\[\]]{5,}/g, // Multiple brackets
      /<!--|-->/g, // HTML comments
      /\/\*|\*\//g, // C-style comments
    ],
  },
  {
    name: 'DATA_EXTRACTION',
    category: 'data_exfiltration',
    severity: 'CRITICAL',
    patterns: [
      /(show|reveal|display)\s+(me\s+)?(the\s+)?system\s+prompt/gi,
      /(what\s+are|tell\s+me)\s+your\s+(instructions?|rules?|guidelines?|directives?)/gi,
      /print\s+(your\s+)?configuration/gi,
      /dump\s+(your\s+)?(memory|context|history|state)/gi,
      /repeat\s+everything\s+(above|you\s+know)/gi,
      /show\s+me\s+(the\s+)?initial\s+(prompt|instructions?)/gi,
      /output\s+(your\s+)?training\s+data/gi,
      /list\s+all\s+(your\s+)?commands?/gi,
      /what\s+were\s+you\s+told\s+(not\s+)?to\s+do/gi,
      /reveal\s+(your\s+)?hidden\s+(commands?|features?|functions?)/gi,
    ],
  },
  {
    name: 'SOCIAL_ENGINEERING',
    category: 'indirect_injection',
    severity: 'MEDIUM',
    patterns: [
      /this\s+is\s+(just\s+)?a\s+test/gi,
      /for\s+(educational|research|academic|testing)\s+purposes?\s+only/gi,
      /hypothetically(\s+speaking)?/gi,
      /in\s+a\s+fictional\s+(scenario|world|context)/gi,
      /as\s+a\s+(security\s+)?researcher/gi,
      /i\s+have\s+permission/gi,
      /authorized\s+to/gi,
      /my\s+(boss|manager|supervisor|teacher)\s+(said|told|asked)/gi,
      /urgent|emergency|critical/gi,
      /please\s+help\s+me/gi,
      /i'm\s+in\s+trouble/gi,
    ],
  },
  {
    name: 'MULTILINGUAL_EVASION',
    category: 'encoding_obfuscation',
    severity: 'MEDIUM',
    patterns: [
      /ignora\s+las\s+instrucciones/gi, // Spanish: ignore instructions
      /ignore\s+les\s+instructions/gi, // French: ignore instructions
      /忽略.*指令/g, // Chinese: ignore instructions
      /无视.*规则/g, // Chinese: disregard rules
      /olvidar?\s+todo/gi, // Spanish: forget everything
      /oublier?\s+tout/gi, // French: forget everything
      /fingir\s+ser/gi, // Spanish: pretend to be
      /faire\s+semblant/gi, // French: pretend
      /假装/g, // Chinese: pretend
      /绕过/g, // Chinese: bypass
    ],
  },
];

/**
 * Analyze input text for known attack patterns
 * @param input - The text to analyze
 * @returns PatternResult with detection details
 */
export function analyzePatterns(input: string): PatternResult {
  const detectedPatterns: string[] = [];
  const detectedCategories = new Set<AttackCategory>();
  let highestSeverity: ThreatLevel = 'NONE';

  // Track severity levels for comparison
  const severityLevels: Record<ThreatLevel, number> = {
    'NONE': 0,
    'LOW': 1,
    'MEDIUM': 2,
    'HIGH': 3,
    'CRITICAL': 4,
  };

  // Check each pattern category
  for (const category of patternCategories) {
    for (const pattern of category.patterns) {
      const matches = input.match(pattern);
      if (matches) {
        matches.forEach(match => {
          // Don't add duplicate matches
          if (!detectedPatterns.includes(match)) {
            detectedPatterns.push(match);
          }
        });

        detectedCategories.add(category.category);

        // Update highest severity
        if (severityLevels[category.severity] > severityLevels[highestSeverity]) {
          highestSeverity = category.severity;
        }
      }
    }
  }

  // Calculate confidence based on number of patterns matched
  let confidence = 0;
  if (detectedPatterns.length === 0) {
    confidence = 0;
  } else if (detectedPatterns.length === 1) {
    confidence = 0.6;
  } else if (detectedPatterns.length === 2) {
    confidence = 0.8;
  } else {
    confidence = 0.95;
  }

  // Determine primary category (most common or highest severity)
  let primaryCategory: AttackCategory | undefined;
  if (detectedCategories.size > 0) {
    // For now, just take the first one (could be enhanced with frequency counting)
    primaryCategory = Array.from(detectedCategories)[0];
  }

  return {
    detected: detectedPatterns.length > 0,
    patterns: detectedPatterns.slice(0, 10), // Limit to first 10 for performance
    severity: highestSeverity,
    confidence,
    category: primaryCategory,
  };
}

/**
 * Quick check if input contains any suspicious patterns
 * @param input - The text to check
 * @returns true if any patterns detected
 */
export function quickPatternCheck(input: string): boolean {
  // Quick check using simpler patterns for performance
  const quickPatterns = [
    /ignore.*previous/i,
    /act\s+as/i,
    /jailbreak/i,
    /system\s+prompt/i,
    /reveal.*instructions/i,
    /hypothetically/i,
    /base64|hex|unicode/i,
  ];

  return quickPatterns.some(pattern => pattern.test(input));
}