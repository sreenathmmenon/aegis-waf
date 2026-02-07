export type ThreatLevel = 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type Decision = 'ALLOW' | 'BLOCK' | 'FLAG';
export type AttackCategory =
  | 'direct_injection'
  | 'indirect_injection'
  | 'encoding_obfuscation'
  | 'jailbreak'
  | 'data_exfiltration'
  | 'output_manipulation'
  | 'multi_turn';

export interface PatternResult {
  detected: boolean;
  patterns: string[];
  severity: ThreatLevel;
  confidence: number;
  category?: AttackCategory;
}

export interface IntentClassification {
  threat: 'LEGIT' | 'SUSPICIOUS' | 'MALICIOUS';
  confidence: number;
  reasoning: string;
  hiddenGoal?: string;
  category?: AttackCategory;
}

export interface SemanticResult {
  similar: boolean;
  maxSimilarity: number;
  matchedPattern?: string;
  category?: AttackCategory;
}

export interface LayerResult {
  layer: string;
  status: 'PASS' | 'FAIL' | 'WARN';
  confidence: number;
  details: string;
  latencyMs: number;
}

export interface Explanation {
  summary: string;
  technicalDetail: string;
  owaspCategory: string;
  severity: ThreatLevel;
  evidence: string[];
  recommendation: string;
}

export interface ValidationResult {
  id: string;
  timestamp: string;
  input: string;
  decision: Decision;
  confidence: number;
  threatLevel: ThreatLevel;
  category?: AttackCategory;
  layers: LayerResult[];
  explanation?: Explanation;
  latencyMs: number;
  sessionId?: string;
}

export interface ThreatLogEntry extends ValidationResult {
  ipAddress?: string;
}

export interface AnalyticsData {
  totalRequests: number;
  blocked: number;
  allowed: number;
  flagged: number;
  falsePositiveRate: number;
  avgLatencyMs: number;
  dailyBreakdown: { date: string; total: number; blocked: number; allowed: number }[];
  categoryBreakdown: { category: string; count: number }[];
  recentThreats: ThreatLogEntry[];
}

export interface PresetAttack {
  id: string;
  name: string;
  description: string;
  payload: string;
  category: AttackCategory;
  difficulty: 'basic' | 'intermediate' | 'advanced';
  expectedResult: Decision;
}