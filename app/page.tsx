"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Shield,
  Zap,
  Eye,
  Brain,
  Lock,
  TrendingUp,
  Activity,
  CheckCircle2,
  ArrowRight
} from "lucide-react";

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
              <span className="bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">
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

            {/* Stats Bar */}
            <div className="bg-[#12121a]/50 border border-[#1e1e2e] rounded-xl p-6">
              <div className="flex items-center justify-center gap-6 md:gap-12 flex-wrap text-sm md:text-base text-[#71717a]">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-500" />
                  <span>5 Defense Layers</span>
                </div>
                <div className="hidden sm:block text-[#1e1e2e]">•</div>
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-blue-500" />
                  <span>&lt;500ms Latency</span>
                </div>
                <div className="hidden sm:block text-[#1e1e2e]">•</div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  <span>&lt;2% False Positives</span>
                </div>
                <div className="hidden sm:block text-[#1e1e2e]">•</div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>OWASP Aligned</span>
                </div>
              </div>
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
                  <div className="w-14 h-14 rounded-xl bg-green-500/10 flex items-center justify-center mb-6">
                    <Eye className="h-7 w-7 text-green-500" />
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
                  <div className="w-14 h-14 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6">
                    <Brain className="h-7 w-7 text-blue-500" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Intent Analysis</h3>
                  <p className="text-sm text-[#a1a1aa] leading-relaxed">
                    Uses GPT-4o-mini to analyze whether the input is trying to manipulate the AI.
                    Detects hidden intent and adversarial goals that patterns alone might miss.
                  </p>
                </CardContent>
              </Card>

            {/* Feature 3: Semantic Scanning */}
            <Card className="bg-[#12121a] border border-[#1e1e2e] rounded-xl h-full hover:border-[#2e2e3e] transition-colors border-t-4 border-t-purple-500/70">
                <CardContent className="p-8">
                  <div className="w-14 h-14 rounded-xl bg-purple-500/10 flex items-center justify-center mb-6">
                    <Lock className="h-7 w-7 text-purple-500" />
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
                  <div className="w-14 h-14 rounded-xl bg-orange-500/10 flex items-center justify-center mb-6">
                    <Activity className="h-7 w-7 text-orange-500" />
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
                  <div className="w-14 h-14 rounded-xl bg-teal-500/10 flex items-center justify-center mb-6">
                    <CheckCircle2 className="h-7 w-7 text-teal-500" />
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
