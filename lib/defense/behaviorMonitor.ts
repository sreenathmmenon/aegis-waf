import { ValidationResult, AttackCategory } from '@/lib/types';

/**
 * Session data structure for tracking user behavior
 */
interface SessionData {
  sessionId: string;
  requestCount: number;
  flaggedCount: number;
  blockedCount: number;
  categories: Set<AttackCategory>;
  timestamps: number[];
  lastActivity: number;
  riskScore: number;
  ipAddress?: string;
}

// In-memory session storage (in production, use Redis or similar)
const sessionStore = new Map<string, SessionData>();

// Configuration
const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
const MAX_REQUESTS_PER_MINUTE = 30;
const RISK_THRESHOLD_HIGH = 0.7;
const RISK_THRESHOLD_MEDIUM = 0.4;

/**
 * Initialize or get existing session
 * @param sessionId - Unique session identifier
 * @param ipAddress - Optional IP address for tracking
 * @returns Session data
 */
function getOrCreateSession(sessionId: string, ipAddress?: string): SessionData {
  const existing = sessionStore.get(sessionId);
  const now = Date.now();

  if (existing) {
    // Check if session has timed out
    if (now - existing.lastActivity > SESSION_TIMEOUT_MS) {
      // Session expired, create new one
      sessionStore.delete(sessionId);
    } else {
      // Update last activity
      existing.lastActivity = now;
      return existing;
    }
  }

  // Create new session
  const newSession: SessionData = {
    sessionId,
    requestCount: 0,
    flaggedCount: 0,
    blockedCount: 0,
    categories: new Set(),
    timestamps: [],
    lastActivity: now,
    riskScore: 0,
    ipAddress,
  };

  sessionStore.set(sessionId, newSession);
  return newSession;
}

/**
 * Calculate request frequency factor
 * @param timestamps - Array of request timestamps
 * @returns Frequency factor between 0 and 1
 */
function calculateFrequencyFactor(timestamps: number[]): number {
  if (timestamps.length < 2) return 0;

  const now = Date.now();
  const oneMinuteAgo = now - 60000;

  // Count requests in the last minute
  const recentRequests = timestamps.filter(t => t > oneMinuteAgo).length;

  // Calculate frequency factor
  const frequencyFactor = Math.min(recentRequests / MAX_REQUESTS_PER_MINUTE, 1);

  return frequencyFactor;
}

/**
 * Calculate session risk score
 * @param session - Session data
 * @returns Risk score between 0 and 1
 */
function calculateRiskScore(session: SessionData): number {
  const { requestCount, flaggedCount, blockedCount, categories, timestamps } = session;

  if (requestCount === 0) return 0;

  // Component 1: Ratio of flagged/blocked requests (50% weight)
  const threatRatio = (flaggedCount + blockedCount * 2) / requestCount;
  const threatComponent = Math.min(threatRatio, 1) * 0.5;

  // Component 2: Diversity of attack categories (30% weight)
  const categoryDiversity = categories.size / 7; // 7 total categories
  const diversityComponent = categoryDiversity * 0.3;

  // Component 3: Request frequency (20% weight)
  const frequencyFactor = calculateFrequencyFactor(timestamps);
  const frequencyComponent = frequencyFactor * 0.2;

  // Calculate total risk score
  const riskScore = threatComponent + diversityComponent + frequencyComponent;

  return Math.min(riskScore, 1);
}

/**
 * Update session with new validation result
 * @param sessionId - Session identifier
 * @param result - Validation result from defense layers
 * @param ipAddress - Optional IP address
 * @returns Updated session data
 */
export function updateSession(
  sessionId: string,
  result: ValidationResult,
  ipAddress?: string
): SessionData {
  const session = getOrCreateSession(sessionId, ipAddress);
  const now = Date.now();

  // Update request count
  session.requestCount++;

  // Update timestamps (keep only last 100)
  session.timestamps.push(now);
  if (session.timestamps.length > 100) {
    session.timestamps = session.timestamps.slice(-100);
  }

  // Update threat counts based on decision
  if (result.decision === 'FLAG') {
    session.flaggedCount++;
  } else if (result.decision === 'BLOCK') {
    session.blockedCount++;
  }

  // Track attack categories
  if (result.category) {
    session.categories.add(result.category);
  }

  // Update risk score
  session.riskScore = calculateRiskScore(session);

  // Save updated session
  sessionStore.set(sessionId, session);

  return session;
}

/**
 * Get current session risk level
 * @param sessionId - Session identifier
 * @returns Risk score between 0 and 1
 */
export function getSessionRisk(sessionId: string): number {
  const session = sessionStore.get(sessionId);
  if (!session) return 0;

  // Recalculate to ensure it's current
  return calculateRiskScore(session);
}

/**
 * Get session risk level as a category
 * @param sessionId - Session identifier
 * @returns Risk level category
 */
export function getSessionRiskLevel(sessionId: string): 'LOW' | 'MEDIUM' | 'HIGH' {
  const risk = getSessionRisk(sessionId);

  if (risk >= RISK_THRESHOLD_HIGH) return 'HIGH';
  if (risk >= RISK_THRESHOLD_MEDIUM) return 'MEDIUM';
  return 'LOW';
}

/**
 * Get full session data
 * @param sessionId - Session identifier
 * @returns Session data or null if not found
 */
export function getSessionData(sessionId: string): SessionData | null {
  return sessionStore.get(sessionId) || null;
}

/**
 * Clean up expired sessions
 * Should be called periodically
 */
export function cleanupExpiredSessions(): number {
  const now = Date.now();
  let cleanedCount = 0;

  for (const [sessionId, session] of sessionStore.entries()) {
    if (now - session.lastActivity > SESSION_TIMEOUT_MS) {
      sessionStore.delete(sessionId);
      cleanedCount++;
    }
  }

  return cleanedCount;
}

/**
 * Get all active sessions (for monitoring)
 * @returns Array of active sessions
 */
export function getActiveSessions(): SessionData[] {
  const now = Date.now();
  const activeSessions: SessionData[] = [];

  for (const session of sessionStore.values()) {
    if (now - session.lastActivity <= SESSION_TIMEOUT_MS) {
      activeSessions.push(session);
    }
  }

  return activeSessions;
}

/**
 * Get high-risk sessions
 * @returns Array of high-risk sessions
 */
export function getHighRiskSessions(): SessionData[] {
  return getActiveSessions().filter(session =>
    session.riskScore >= RISK_THRESHOLD_HIGH
  );
}

/**
 * Check if session should be rate-limited
 * @param sessionId - Session identifier
 * @returns true if session should be rate-limited
 */
export function shouldRateLimit(sessionId: string): boolean {
  const session = sessionStore.get(sessionId);
  if (!session) return false;

  const frequencyFactor = calculateFrequencyFactor(session.timestamps);
  return frequencyFactor > 0.8 || session.riskScore > 0.9;
}

/**
 * Get session statistics
 * @returns Statistics object
 */
export function getSessionStats() {
  const sessions = getActiveSessions();

  return {
    totalSessions: sessions.length,
    highRiskSessions: sessions.filter(s => s.riskScore >= RISK_THRESHOLD_HIGH).length,
    mediumRiskSessions: sessions.filter(s =>
      s.riskScore >= RISK_THRESHOLD_MEDIUM && s.riskScore < RISK_THRESHOLD_HIGH
    ).length,
    lowRiskSessions: sessions.filter(s => s.riskScore < RISK_THRESHOLD_MEDIUM).length,
    averageRiskScore: sessions.length > 0
      ? sessions.reduce((sum, s) => sum + s.riskScore, 0) / sessions.length
      : 0,
    totalRequests: sessions.reduce((sum, s) => sum + s.requestCount, 0),
    totalBlocked: sessions.reduce((sum, s) => sum + s.blockedCount, 0),
    totalFlagged: sessions.reduce((sum, s) => sum + s.flaggedCount, 0),
  };
}

/**
 * Reset session (for testing or admin purposes)
 * @param sessionId - Session identifier
 */
export function resetSession(sessionId: string): void {
  sessionStore.delete(sessionId);
}

/**
 * Reset all sessions (for testing or admin purposes)
 */
export function resetAllSessions(): void {
  sessionStore.clear();
}

// Set up periodic cleanup (every 5 minutes)
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupExpiredSessions, 5 * 60 * 1000);
}