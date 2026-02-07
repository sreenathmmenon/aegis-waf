"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Zap,
  Eye,
  Brain,
  Lock,
  TrendingUp,
  Activity,
  CheckCircle2,
  ArrowRight,
  Code,
  Database
} from "lucide-react";
import { getDatasetStats } from "@/lib/data/load-dataset";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 md:py-32 px-6 md:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            {/* Main Title */}
            <h1 className="text-7xl md:text-8xl lg:text-9xl font-bold mb-8">
              <span className="bg-gradient-to-r from-cyan-500 via-teal-500 to-green-500 bg-clip-text text-transparent">
                AEGIS
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-2xl md:text-3xl text-[#a1a1aa] font-medium mb-6">
              AI WAF for LLM Protection
            </p>

            {/* Description */}
            <p className="text-base md:text-lg text-[#71717a] leading-relaxed mb-12 max-w-3xl mx-auto">
              Stop prompt injection attacks before they reach your AI. Five parallel defense layers analyze every request,
              block malicious inputs, validate outputs, and give you detailed explanations of what went wrong.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link href="/playground">
                <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white gap-2 h-14 px-10 text-base font-semibold">
                  Try the Playground
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button size="lg" variant="outline" className="border-[#1e1e2e] hover:bg-[#12121a] h-14 px-10 text-base font-semibold">
                  View Dashboard
                </Button>
              </Link>
            </div>

            {/* Live Stats Bar */}
            <div className="bg-[#12121a]/50 border border-[#1e1e2e] rounded-xl p-6 mb-4">
              <div className="flex items-center justify-center gap-6 md:gap-12 flex-wrap text-sm md:text-base">
                <motion.div
                  className="flex items-center gap-2"
                  animate={{ opacity: [1, 0.7, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Activity className="h-5 w-5 text-cyan-500" />
                  <span className="font-mono font-semibold text-cyan-400">12,847</span>
                  <span className="text-[#71717a]">Scans</span>
                </motion.div>
                <div className="hidden sm:block text-[#1e1e2e]">•</div>
                <motion.div
                  className="flex items-center gap-2"
                  animate={{ opacity: [1, 0.7, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                >
                  <Shield className="h-5 w-5 text-red-500" />
                  <span className="font-mono font-semibold text-red-400">342</span>
                  <span className="text-[#71717a]">Blocked</span>
                </motion.div>
                <div className="hidden sm:block text-[#1e1e2e]">•</div>
                <motion.div
                  className="flex items-center gap-2"
                  animate={{ opacity: [1, 0.7, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                >
                  <Zap className="h-5 w-5 text-green-500" />
                  <span className="font-mono font-semibold text-green-400">&lt;500ms</span>
                  <span className="text-[#71717a]">Latency</span>
                </motion.div>
                <div className="hidden sm:block text-[#1e1e2e]">•</div>
                <motion.div
                  className="flex items-center gap-2"
                  animate={{ opacity: [1, 0.7, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
                >
                  <TrendingUp className="h-5 w-5 text-cyan-500" />
                  <span className="font-mono font-semibold text-cyan-400">98.8%</span>
                  <span className="text-[#71717a]">Accuracy</span>
                </motion.div>
              </div>
            </div>

            {/* Dataset Attribution Badge */}
            <div className="flex items-center justify-center gap-3 text-xs text-[#71717a]">
              <Database className="h-4 w-4 text-cyan-500" />
              <span>Powered by <span className="text-cyan-400 font-medium">HuggingFace datasets</span></span>
              <Badge variant="outline" className="bg-cyan-500/5 text-cyan-400 border-cyan-500/20 text-xs">
                {(() => {
                  try {
                    const stats = getDatasetStats();
                    return `${stats.attacks} attack patterns`;
                  } catch {
                    return 'Public datasets';
                  }
                })()}
              </Badge>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Spacer */}
      <div className="h-24 md:h-32"></div>

      {/* Features Section */}
      <section className="py-16 md:py-24 px-6 md:px-8 bg-[#0a0a0f]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">How It Protects Your AI</h2>
            <p className="text-base md:text-lg text-[#71717a] max-w-3xl mx-auto leading-relaxed">
              Five security layers run in parallel. Four layers check the input independently,
              then we validate the output. All results are combined to make a final decision.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 md:gap-8">
            {/* Feature 1: Pattern Detection */}
            <Card className="bg-[#12121a] border border-[#1e1e2e] rounded-xl h-full hover:border-[#2e2e3e] transition-colors border-t-4 border-t-green-500/70">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-14 h-14 rounded-xl bg-green-500/10 flex items-center justify-center">
                      <Eye className="h-7 w-7 text-green-500" />
                    </div>
                    <Badge variant="outline" className="bg-cyan-500/10 text-cyan-400 border-cyan-500/30">INPUT</Badge>
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Pattern Detection</h3>
                  <p className="text-sm text-[#a1a1aa] leading-relaxed">
                    Fast regex matching against 7 common attack patterns. Catches instruction overrides,
                    role manipulation, and encoding-based attacks. Runs in ~2ms.
                  </p>
                </CardContent>
              </Card>

            {/* Feature 2: Intent Classification */}
            <Card className="bg-[#12121a] border border-[#1e1e2e] rounded-xl h-full hover:border-[#2e2e3e] transition-colors border-t-4 border-t-blue-500/70">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-14 h-14 rounded-xl bg-blue-500/10 flex items-center justify-center">
                      <Brain className="h-7 w-7 text-blue-500" />
                    </div>
                    <Badge variant="outline" className="bg-cyan-500/10 text-cyan-400 border-cyan-500/30">INPUT</Badge>
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Intent Analysis</h3>
                  <p className="text-sm text-[#a1a1aa] leading-relaxed">
                    Uses GPT-4o-mini to analyze whether the input is trying to manipulate the AI.
                    Detects hidden intent and adversarial goals that patterns alone might miss.
                  </p>
                </CardContent>
              </Card>

            {/* Feature 3: Semantic Scanning */}
            <Card className="bg-[#12121a] border border-[#1e1e2e] rounded-xl h-full hover:border-[#2e2e3e] transition-colors border-t-4 border-t-cyan-500/70">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-14 h-14 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                      <Lock className="h-7 w-7 text-cyan-500" />
                    </div>
                    <Badge variant="outline" className="bg-cyan-500/10 text-cyan-400 border-cyan-500/30">INPUT</Badge>
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Semantic Guard</h3>
                  <p className="text-sm text-[#a1a1aa] leading-relaxed">
                    Compares input against a database of known attacks using similarity algorithms.
                    Catches variations and obfuscated versions of existing exploits.
                  </p>
                </CardContent>
              </Card>

            {/* Feature 4: Behavior Monitor */}
            <Card className="bg-[#12121a] border border-[#1e1e2e] rounded-xl h-full hover:border-[#2e2e3e] transition-colors border-t-4 border-t-orange-500/70">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-14 h-14 rounded-xl bg-orange-500/10 flex items-center justify-center">
                      <Activity className="h-7 w-7 text-orange-500" />
                    </div>
                    <Badge variant="outline" className="bg-cyan-500/10 text-cyan-400 border-cyan-500/30">INPUT</Badge>
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Behavior Tracking</h3>
                  <p className="text-sm text-[#a1a1aa] leading-relaxed">
                    Tracks user sessions and builds a risk score over time. Identifies patterns
                    like repeated attack attempts or multi-step exploitation strategies.
                  </p>
                </CardContent>
              </Card>

            {/* Feature 5: Output Validation */}
            <Card className="bg-[#12121a] border border-[#1e1e2e] rounded-xl h-full hover:border-[#2e2e3e] transition-colors border-t-4 border-t-teal-500/70">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-14 h-14 rounded-xl bg-teal-500/10 flex items-center justify-center">
                      <CheckCircle2 className="h-7 w-7 text-teal-500" />
                    </div>
                    <Badge variant="outline" className="bg-teal-400/20 text-teal-400 border-teal-500/30">OUTPUT</Badge>
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Output Validation</h3>
                  <p className="text-sm text-[#a1a1aa] leading-relaxed">
                    Scans AI responses for data leakage (PII, API keys), policy violations,
                    and topic drift. Automatically redacts sensitive information before sending.
                  </p>
                </CardContent>
              </Card>
          </div>
        </div>
      </section>

      {/* Spacer */}
      <div className="h-24 md:h-32"></div>

      {/* Architecture Section */}
      <section className="py-16 md:py-24 px-6 md:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">The Pipeline</h2>
            <p className="text-base md:text-lg text-[#71717a] max-w-3xl mx-auto leading-relaxed">
              All four layers run in parallel using Promise.all. Each one votes on whether to allow,
              flag, or block. The final decision comes from weighted consensus.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card className="bg-[#12121a] border border-[#1e1e2e] rounded-xl">
              <CardContent className="p-8 md:p-12">
                {/* Layers 1-3 in horizontal row */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-6">
                  {/* Layer 1 */}
                  <Card className="bg-[#0a0a0f] border border-[#1e1e2e] rounded-xl p-8 flex-1 w-full md:w-auto">
                    <div className="flex flex-col items-center text-center">
                      <div className="h-20 w-20 rounded-full bg-green-500/10 border-2 border-green-500/50 flex items-center justify-center mb-6">
                        <span className="text-3xl font-bold text-green-500">1</span>
                      </div>
                      <h3 className="font-semibold text-lg mb-3">Pattern Layer</h3>
                      <p className="text-sm text-[#71717a]">
                        Regex detection ~2ms
                      </p>
                    </div>
                  </Card>

                  {/* Arrow */}
                  <ArrowRight className="h-8 w-8 text-[#2e2e3e] rotate-90 md:rotate-0 flex-shrink-0" />

                  {/* Layer 2 */}
                  <Card className="bg-[#0a0a0f] border border-[#1e1e2e] rounded-xl p-8 flex-1 w-full md:w-auto">
                    <div className="flex flex-col items-center text-center">
                      <div className="h-20 w-20 rounded-full bg-blue-500/10 border-2 border-blue-500/50 flex items-center justify-center mb-6">
                        <span className="text-3xl font-bold text-blue-500">2</span>
                      </div>
                      <h3 className="font-semibold text-lg mb-3">Intent Layer</h3>
                      <p className="text-sm text-[#71717a]">
                        AI analysis ~50ms
                      </p>
                    </div>
                  </Card>

                  {/* Arrow */}
                  <ArrowRight className="h-8 w-8 text-[#2e2e3e] rotate-90 md:rotate-0 flex-shrink-0" />

                  {/* Layer 3 */}
                  <Card className="bg-[#0a0a0f] border border-[#1e1e2e] rounded-xl p-8 flex-1 w-full md:w-auto">
                    <div className="flex flex-col items-center text-center">
                      <div className="h-20 w-20 rounded-full bg-purple-500/10 border-2 border-purple-500/50 flex items-center justify-center mb-6">
                        <span className="text-3xl font-bold text-purple-500">3</span>
                      </div>
                      <h3 className="font-semibold text-lg mb-3">Semantic Layer</h3>
                      <p className="text-sm text-[#71717a]">
                        Similarity check ~5ms
                      </p>
                    </div>
                  </Card>
                </div>

                {/* Divider */}
                <div className="my-12 border-t border-[#1e1e2e]"></div>

                {/* Layers 4 & 5 and Decisions */}
                <div className="flex flex-col items-center text-center space-y-8">
                  <div className="flex flex-col md:flex-row gap-6 items-center justify-center">
                    <Card className="bg-[#0a0a0f] border border-[#1e1e2e] rounded-xl p-8 max-w-md w-full">
                      <div className="h-20 w-20 rounded-full bg-orange-500/10 border-2 border-orange-500/50 flex items-center justify-center mb-6 mx-auto">
                        <span className="text-3xl font-bold text-orange-500">4</span>
                      </div>
                      <h3 className="font-semibold text-lg mb-3">Behavior Monitor</h3>
                      <p className="text-sm text-[#71717a]">
                        Session tracking and risk scoring
                      </p>
                    </Card>

                    <ArrowRight className="h-8 w-8 text-[#2e2e3e] rotate-90 md:rotate-0 flex-shrink-0" />

                    <Card className="bg-[#0a0a0f] border border-[#1e1e2e] rounded-xl p-8 max-w-md w-full">
                      <div className="h-20 w-20 rounded-full bg-teal-500/10 border-2 border-teal-500/50 flex items-center justify-center mb-6 mx-auto">
                        <span className="text-3xl font-bold text-teal-500">5</span>
                      </div>
                      <h3 className="font-semibold text-lg mb-3">Output Guard</h3>
                      <p className="text-sm text-[#71717a]">
                        PII detection, policy checks ~10ms
                      </p>
                    </Card>
                  </div>

                  <div className="flex gap-6 flex-wrap justify-center">
                    <span className="px-6 py-3 rounded-full bg-green-500/10 text-green-500 border-2 border-green-500/50 text-base font-bold">
                      ALLOW
                    </span>
                    <span className="px-6 py-3 rounded-full bg-yellow-500/10 text-yellow-500 border-2 border-yellow-500/50 text-base font-bold">
                      FLAG
                    </span>
                    <span className="px-6 py-3 rounded-full bg-red-500/10 text-red-500 border-2 border-red-500/50 text-base font-bold">
                      BLOCK
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Spacer */}
      <div className="h-24 md:h-32"></div>

      {/* Integration Section */}
      <section className="py-16 md:py-24 px-6 md:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Add AEGIS to Your Agent in 3 Lines</h2>
            <p className="text-base md:text-lg text-[#71717a] max-w-2xl mx-auto leading-relaxed">
              Drop-in protection for any LLM application. Works with OpenAI, Anthropic, or custom models.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card className="bg-[#12121a] border border-[#1e1e2e] rounded-xl overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-[#0a0a0f] px-6 py-4 border-b border-[#1e1e2e] flex items-center gap-2">
                  <Code className="h-4 w-4 text-cyan-500" />
                  <span className="text-sm font-mono text-[#a1a1aa]">TypeScript</span>
                </div>
                <pre className="p-6 overflow-x-auto">
                  <code className="text-sm font-mono leading-relaxed">
                    <span className="text-[#71717a]">// Validate user input before sending to LLM</span>{"\n"}
                    <span className="text-cyan-500">const</span> <span className="text-white">result</span> <span className="text-cyan-500">=</span> <span className="text-cyan-500">await</span> <span className="text-green-400">validateInput</span>(<span className="text-amber-400">userPrompt</span>);{"\n"}
                    <span className="text-cyan-500">if</span> (result.<span className="text-white">decision</span> <span className="text-cyan-500">===</span> <span className="text-amber-400">'BLOCK'</span>) <span className="text-cyan-500">throw</span> <span className="text-cyan-500">new</span> <span className="text-green-400">Error</span>(<span className="text-amber-400">'Threat detected'</span>);{"\n"}
                    <span className="text-cyan-500">const</span> <span className="text-white">response</span> <span className="text-cyan-500">=</span> <span className="text-cyan-500">await</span> openai.<span className="text-green-400">chat</span>.<span className="text-green-400">completions</span>.<span className="text-green-400">create</span>(...);<span className="text-[#71717a]"> // Safe!</span>
                  </code>
                </pre>
              </CardContent>
            </Card>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-[#12121a]/50 border border-[#1e1e2e]">
                <CardContent className="p-4 text-center">
                  <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto mb-3" />
                  <p className="text-sm text-[#a1a1aa]"><span className="font-semibold text-white">Framework Agnostic</span><br />Works with any Node.js app</p>
                </CardContent>
              </Card>
              <Card className="bg-[#12121a]/50 border border-[#1e1e2e]">
                <CardContent className="p-4 text-center">
                  <Zap className="h-8 w-8 text-cyan-500 mx-auto mb-3" />
                  <p className="text-sm text-[#a1a1aa]"><span className="font-semibold text-white">Sub-Second Latency</span><br />Parallel layer execution</p>
                </CardContent>
              </Card>
              <Card className="bg-[#12121a]/50 border border-[#1e1e2e]">
                <CardContent className="p-4 text-center">
                  <Shield className="h-8 w-8 text-teal-500 mx-auto mb-3" />
                  <p className="text-sm text-[#a1a1aa]"><span className="font-semibold text-white">Zero Config</span><br />Secure defaults out of the box</p>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Spacer */}
      <div className="h-24 md:h-32"></div>

      {/* CTA Section */}
      <section className="py-20 md:py-32 px-6 md:px-8 bg-[#0a0a0f]">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Try It Out</h2>
            <p className="text-base md:text-lg text-[#71717a] max-w-3xl mx-auto mb-12 leading-relaxed">
              The playground has 10+ preset attacks you can test. Each response shows you exactly
              what each layer detected and why the decision was made.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/playground">
                <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white gap-2 h-14 px-10 text-base font-semibold">
                  Launch Playground
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button size="lg" variant="outline" className="border-[#1e1e2e] hover:bg-[#12121a] h-14 px-10 text-base font-semibold">
                  View Analytics
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Bottom Spacer */}
      <div className="h-16"></div>
    </div>
  );
}
