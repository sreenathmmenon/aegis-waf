cat > CLAUDE.md << 'CLAUDEMD'
# Aegis - AI WAF for LLM Protection

## Project Overview
Aegis is a multi-layered AI firewall protecting AI agents from prompt injection attacks.
Built for the Deriv AI Talent Sprint hackathon (Security track).

## Tech Stack
- Framework: Next.js 14 (App Router, TypeScript)
- Styling: Tailwind CSS + shadcn/ui
- AI: OpenAI API (gpt-4o-mini for classification, text-embedding-3-small for embeddings)
- Charts: Recharts
- Icons: Lucide React
- Animation: Framer Motion (use sparingly)
- Deployment: Vercel

## Code Style
- TypeScript strict mode, ES modules (import/export)
- Prefer async/await over .then()
- Functional components with hooks, "use client" for interactive components
- Keep components under 200 lines; split if larger
- All defense modules export typed functions
- Wrap ALL OpenAI calls in try/catch with fallback behavior

## Commands
- npm run dev — Start dev server
- npm run build — Build for production (run after every module)
- npx shadcn@latest add [component] — Add shadcn component

## Theme (Dark Cybersecurity)
- Background: #0a0a0f, Surface: #12121a, Border: #1e1e2e
- Green (#22c55e) = SAFE/ALLOW, Red (#ef4444) = BLOCKED/THREAT
- Yellow (#eab308) = SUSPICIOUS/FLAG, Blue (#3b82f6) = INFO
- Purple (#a855f7) = ANALYSIS
- Font: JetBrains Mono (mono), Inter (sans)

## Architecture

### 5-Layer Defense System
1. **Pattern Detection** (lib/layers/pattern.ts) - 130+ regex patterns, zero API latency (~2ms)
2. **Intent Classification** (lib/layers/intent.ts) - GPT-4o-mini semantic analysis (~50ms)
3. **Semantic Analysis** (lib/layers/semantic.ts) - Similarity matching against 42 known attacks (~5ms)
4. **Behavior Monitoring** (lib/layers/behavior.ts) - Session-based risk scoring
5. **Output Validation** (lib/layers/output-guard.ts) - PII detection, policy compliance, topic drift (~10ms)

### Real-Time Event System
- **EventBus** (lib/event-bus.ts) - Singleton pub/sub for threat event distribution
- **ThreatStore** (lib/threat-store.ts) - Circular buffer (200 events) + auto-simulation
- **SSE Endpoint** (app/api/events/route.ts) - Server-Sent Events with heartbeat
- **React Hook** (hooks/use-event-stream.ts) - Auto-reconnect with exponential backoff
- **Toast Notifications** (components/threat-notifications.tsx) - Bottom-right alerts
- **Notification Bell** (components/notification-bell.tsx) - Sidebar bell with unread badge

### Key Principles
- All input defense layers run in PARALLEL (Promise.all) for speed
- Pattern detector is regex-based (zero API latency)
- Intent classifier uses GPT-4o-mini with structured JSON response
- Output validation runs 3 checks in parallel (data leakage, policy, drift)
- All APIs return the ValidationResult type from lib/types/index.ts
- Real-time events use SSE (not WebSockets) for Vercel compatibility
- Simulation auto-generates demo traffic (AEGIS_SIMULATE env var)
- Session tracking is in-memory (Map) for demo simplicity

## Important: After ANY correction, update this CLAUDE.md with the fix
## Important: Only commit in  Sreenath name and email for Sreenath. Dont add Claude as committer or co author anywhere.
CLAUDEMD
