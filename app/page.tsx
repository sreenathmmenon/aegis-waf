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
              The immune system for AI agents
            </p>

            {/* Description */}
            <p className="text-base md:text-lg text-[#71717a] leading-relaxed mb-12 max-w-3xl mx-auto">
              Multi-layered AI firewall that detects prompt injection, validates outputs,
              monitors behavior, and explains every security decision.
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
                  <span>4 Defense Layers</span>
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
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Defense in Depth</h2>
            <p className="text-base md:text-lg text-[#71717a] max-w-3xl mx-auto leading-relaxed">
              Four independent security layers working in parallel to protect your AI agents
              from adversarial inputs and malicious exploitation.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {/* Feature 1: Pattern Detection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="bg-[#12121a] border border-[#1e1e2e] rounded-xl h-full hover:border-[#2e2e3e] transition-all duration-200 border-t-4 border-t-green-500/70">
                <CardContent className="p-8">
                  <div className="w-14 h-14 rounded-xl bg-green-500/10 flex items-center justify-center mb-6">
                    <Eye className="h-7 w-7 text-green-500" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Pattern Detection</h3>
                  <p className="text-sm text-[#a1a1aa] leading-relaxed">
                    Zero-latency regex-based detection of 7 known attack patterns including
                    instruction overrides, role hijacking, and encoding tricks.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Feature 2: Intent Classification */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="bg-[#12121a] border border-[#1e1e2e] rounded-xl h-full hover:border-[#2e2e3e] transition-all duration-200 border-t-4 border-t-blue-500/70">
                <CardContent className="p-8">
                  <div className="w-14 h-14 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6">
                    <Brain className="h-7 w-7 text-blue-500" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Intent Analysis</h3>
                  <p className="text-sm text-[#a1a1aa] leading-relaxed">
                    AI-powered semantic analysis using GPT-4o-mini to understand hidden goals,
                    adversarial intent, and sophisticated attack vectors.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Feature 3: Semantic Scanning */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Card className="bg-[#12121a] border border-[#1e1e2e] rounded-xl h-full hover:border-[#2e2e3e] transition-all duration-200 border-t-4 border-t-purple-500/70">
                <CardContent className="p-8">
                  <div className="w-14 h-14 rounded-xl bg-purple-500/10 flex items-center justify-center mb-6">
                    <Lock className="h-7 w-7 text-purple-500" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Semantic Guard</h3>
                  <p className="text-sm text-[#a1a1aa] leading-relaxed">
                    Similarity matching against known attack database using Jaccard and n-gram
                    algorithms to catch variants and obfuscated attempts.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Feature 4: Behavior Monitor */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Card className="bg-[#12121a] border border-[#1e1e2e] rounded-xl h-full hover:border-[#2e2e3e] transition-all duration-200 border-t-4 border-t-orange-500/70">
                <CardContent className="p-8">
                  <div className="w-14 h-14 rounded-xl bg-orange-500/10 flex items-center justify-center mb-6">
                    <Activity className="h-7 w-7 text-orange-500" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Behavior Tracking</h3>
                  <p className="text-sm text-[#a1a1aa] leading-relaxed">
                    Session-based monitoring with risk scoring to detect multi-turn attacks,
                    repeated probing, and coordinated exploitation attempts.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
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
            <h2 className="text-3xl md:text-4xl font-bold mb-6">How It Works</h2>
            <p className="text-base md:text-lg text-[#71717a] max-w-3xl mx-auto leading-relaxed">
              All layers execute in parallel for minimal latency. Decisions are made through
              weighted consensus with explainable AI reasoning.
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

                {/* Layer 4 and Decisions */}
                <div className="flex flex-col items-center text-center space-y-8">
                  <Card className="bg-[#0a0a0f] border border-[#1e1e2e] rounded-xl p-8 max-w-md w-full">
                    <div className="h-20 w-20 rounded-full bg-orange-500/10 border-2 border-orange-500/50 flex items-center justify-center mb-6 mx-auto">
                      <span className="text-3xl font-bold text-orange-500">4</span>
                    </div>
                    <h3 className="font-semibold text-lg mb-3">Behavior Monitor</h3>
                    <p className="text-sm text-[#71717a]">
                      Session tracking and risk scoring
                    </p>
                  </Card>

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
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to secure your AI?</h2>
            <p className="text-base md:text-lg text-[#71717a] max-w-3xl mx-auto mb-12 leading-relaxed">
              Test AEGIS with real attack scenarios in our interactive playground or explore
              detailed analytics in the security dashboard.
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
